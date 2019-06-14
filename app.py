from flask import Flask

app = Flask(__name__)
@app.route('/')
def index ():
    return 'This is test service page: Please, stand by'

if __name__ == "__main__":
    app.run()

