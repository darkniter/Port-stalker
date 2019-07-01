from flaskext.mysql import MySQL
from pril import app

mysql = MySQL()

mysql.init_app(app)

conn = mysql.connect()
cursor = conn.cursor()


def request_SQL(ip,vendor):

        request_rows=[]

        if vendor in ['dlink','eltex']:
                if vendor == 'dlink':
                        cursor.execute("SELECT DISTINCT login, mac, circuit_id, CAST(SUBSTRING_INDEX(circuit_id, '::', -1) AS UNSIGNED) port, max(`date`) date\
                                        FROM `acc`\
                                        WHERE\
                                        circuit_id LIKE '%%::%s::%%'\
                                        and `date` > (NOW() - INTERVAL 6 MONTH)\
                                        group by login, circuit_id, port, mac\
                                        ORDER BY port" % ip)
                if vendor == 'eltex':
                        cursor.execute("SELECT DISTINCT login, mac, circuit_id, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(circuit_id, '/', -1), ':', 1) AS UNSIGNED) port, max(`date`) date\
                                        FROM `acc`\
                                        WHERE\
                                        circuit_id LIKE '%s%%'\
                                        and `date` > (NOW() - INTERVAL 6 MONTH)\
                                        group by login, circuit_id, port, mac\
                                        ORDER BY port" % ip)

                result_rows = cursor.fetchall()

                for row in result_rows:
                        request_rows.append(row[0])
        else:
                request_rows=[]

        return request_rows
