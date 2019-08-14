from flaskext.mysql import MySQL
from pril import app
from timeit import default_timer as timer
import redis, json
import datetime
import hashlib
from functools import lru_cache

def request_SQL(ip, vendor):
    request_rows =[('Atest','aaa','aaa','test','testA'),('Btest','bbb','bbb','test','testB'),('Ctest','ccc','ccc','test','testC')]
    stop = timer()
    header=['id','login','mac','port','why not?']
    time_flag = True

    return request_rows, stop, header, time_flag
