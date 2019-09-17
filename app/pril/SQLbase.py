from flaskext.mysql import MySQL, pymysql
from pril import app
from timeit import default_timer as timer
import redis, json
import datetime
import hashlib
from functools import lru_cache
mysql = MySQL()

mysql.init_app(app)
redis_connect = redis.StrictRedis(**(app.config.get_namespace('REDIS_')))
# redis_connect = redis.StrictRedis(host=app.config.get('redis_host'),port=app.config.get('redis_port'),db=app.config.get('redis_db'),password=app.config.get('redis_password'))

@lru_cache()
def hashing(ip,vendor):
    s = ':'.join([vendor, ip])
    hash_string = hashlib.sha1(s.encode()).hexdigest()
    return hash_string


def redis_data_output(ip, vendor, hashing_string):
    request_rows = []
    header = []
    redis_array = []

    redis_string_json = redis_connect.get(hashing_string)
    redis_connect.pttl(hashing_string)

    if redis_string_json:
        redis_array = json.loads(redis_string_json)

    if len(redis_array) > 0:
        header = redis_array[0]
        request_rows = redis_array[1]
        if not(app.config.get('ENV') == 'production'):
                print({'ip': ip, ' vendor': vendor, ' ttl': redis_connect.pttl(hashing_string)/3600000})
    return request_rows, header


def redis_data_input(request_rows, header, ip, vendor, hashing_string):
    redis_array = (header, request_rows)
    next_day = datetime.datetime.today().replace(day=(datetime.datetime.now().day+1), hour=app.config.get('EXPIRE_HOUR'), minute=app.config.get('EXPIRE_MINUTE'), second=0, microsecond=0)
    redis_connect.set(hashing_string, json.dumps(redis_array),ex=(next_day-datetime.datetime.now()).seconds)

    print ('Redis base update')

    pass


def request_SQL(ip, vendor):

        request_rows = []
        header = []
        start = timer()
        hashing_string = hashing(ip, vendor)
        request_rows, header = redis_data_output(ip, vendor, hashing_string)
        time_flag = False


        if  not header:
                time_flag = True

                cursor = mysql.connect().cursor(pymysql.cursors.DictCursor)

                config_sql = app.config.get_namespace('SQL_REQUEST_')

                if vendor in config_sql:
                        cursor.execute(config_sql[vendor] %ip)
                        request_rows =cursor.fetchall()

                else:
                        request_rows = []

                cursor.close()



                desc = cursor.description

                for row in desc:
                        header.append(row[0])
                header = tuple(header)
                redis_data_input(request_rows, header, ip, vendor, hashing_string)
        stop = timer() - start
        stop = float("{0:.4f}".format(stop))

        return request_rows, stop, header, time_flag
