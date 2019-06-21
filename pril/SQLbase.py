from flaskext.mysql import MySQL
from pril import app
# import SQL_config
mysql = MySQL()

mysql.init_app(app)

conn = mysql.connect()
cursor = conn.cursor()

cursor.execute("SELECT DISTINCT login, mac, circuit_id, CAST(SUBSTRING_INDEX(circuit_id,\
     '::', -1) AS UNSIGNED) port, max(`date`) date\
        FROM `acc`\
        WHERE\
        circuit_id LIKE '10.110.6.17'\
        and `date` > (NOW() - INTERVAL 6 MONTH)\
        group by login, circuit_id, port, mac\
        ORDER BY port")
# data = cursor.fetchone()