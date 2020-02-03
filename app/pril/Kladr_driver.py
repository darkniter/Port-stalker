import requests
import json
import pril.config_kladr as config
# import config_kladr as config
import hashlib
import redis
import datetime
from functools import partial, lru_cache
from profilehooks import timecall

redis_connect = redis.StrictRedis(config.REDIS_HOST,config.REDIS_PORT, config.REDIS_DB, config.REDIS_PASSWORD)

def Test(ListStreet, cityId):

    main_tmp = partial(main,cityId)
    responses = list(map(main_tmp, ListStreet))

    return responses

@lru_cache(2000)
def main(cityId, address, force=False):
    if not cityId[0].isdigit():
        cityId = config.FIAS_CODE[cityId.lower()]
    request_data={}
    hashing_string = hashing(address.upper(), cityId)

    if not force:
        request_data, header = redis_data_output(address, cityId, hashing_string)

    if len(request_data)==0:
        request_data_tmp = FinderKladr(address, cityId)
        redis_data_input(request_data_tmp.text, hashing_string)
        header='Kladr'
        request_data = request_data_tmp.text

    request_data = json.loads(request_data)
    request_data.update({'header_base':header})
    print(request_data['header_base'],request_data['searchContext'])
    return json.dumps(request_data)

@timecall
def FinderKladr(address,cityId):
    path = "https://kladr-api.ru/api.php"
    params = {
        'query': address,
        'cityId': cityId,
        'regionId':'5000000000000',
        'limit':'10',
        'contentType':'building',
        'oneString':'1',
        'withParent':'1',
        }


    response_tmp = requests.get(path, params=params)

    return response_tmp

def hashing(address, cityId):
    s = ':'.join([address, cityId])
    hash_string = hashlib.sha1(s.encode()).hexdigest()
    return hash_string

@timecall
def redis_data_output(address, cityId, hashing_string):
    header = 'Redis'

    request_data = redis_connect.get(hashing_string)
    redis_connect.pttl(hashing_string)

    if request_data:

        if not(config.ENV == 'production'):
            print({
                'adress': address,
                'cityId': cityId,
                'pttl': redis_connect.pttl(hashing_string)/3600000
                })
    else :
        request_data={}
    return request_data, header

@timecall
def redis_data_input(data_request, hashing_string):
    redis_connect.set(
        hashing_string,
        data_request
        )

    print('Redis base update')



if __name__ == "__main__":
    name = [
    'Ленина 32',
    'Лапина 58',
    "Бабушкина 2",
    "Ленина 98",
    ]

    for item in Test(name,'5000002600000'):
        item = json.loads(item)
        print(item['header_base'],item['searchContext'])
