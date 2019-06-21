from flaskext.mysql import MySQL
from pril import app
mysql = MySQL()

mysql.init_app(app)

conn = mysql.connect()
cursor = conn.cursor()

cursor.execute("SELECT * from User")
# data = cursor.fetchone()