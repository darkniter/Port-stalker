import requests
import json
import config_kladr as config
import hashlib
import redis
import datetime
# from pril import app


# redis_connect = redis.StrictRedis(**(app.config.get_namespace('REDIS_')), db=1)
redis_connect = redis.StrictRedis(config.REDIS_HOST,config.REDIS_PORT, config.REDIS_DB, config.REDIS_PASSWORD)

def Test(ListStreet):

    responses = list(map(main, ListStreet))

    return responses


def main(address='', cityId='oz',force=False):
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
    return json.dumps(request_data)


def FinderKladr(address='',cityId='oz'):
    path = "https://kladr-api.ru/api.php"
    params = {
        'query': address,
        'cityId': config.FIAS_CODE[cityId],
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


def redis_data_input(data_request, hashing_string):
    redis_connect.set(
        hashing_string,
        data_request
        )

    print('Redis base update')



if __name__ == "__main__":
    name = [
    'Ленина 43',
    'asdas3 23215q',
    "Бабушкина 2",
    ]

    for item in Main(name):
        print(item)
