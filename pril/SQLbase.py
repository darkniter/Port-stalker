from flaskext.mysql import MySQL
from pril import app
from time import clock


mysql = MySQL()

mysql.init_app(app)


def request_SQL(ip, vendor):

        start=clock()

        cursor = mysql.connect().cursor()

        request_rows = []

        config_sql = app.config.get('sql')

        if vendor in config_sql:
                cursor.execute(config_sql[vendor] %ip)
                result_rows =cursor.fetchall()
                for row in result_rows:
                        request_rows.append(row)
        else:
                request_rows = []

        cursor.close()
        stop = clock() - start
        print('')
        return request_rows, stop
