from pril import app
from flask import Markup, render_template, request

@app.route('/', methods=['GET', 'POST'])
# @app.route('/hello?name=<name>&control=<control>', methods=['GET', 'POST'])
def hello(name=None, control=None):
    # Markup('<strong>Hello %s%s%s!</strong>') % ('<blink>',name,'</blink>')
    if request.method == 'GET':
        name = request.args.get('name',name)
        control = request.args.get('control',control)
    # Markup('<strong>Hello %s%s%s!</strong>') % ('<blink>',name,'</blink>')

    # Markup('<em>Marked up</em> &raquo; HTML').striptags()

    return render_template('main.html', name=name, control= control)

@app.route('/login', methods=['GET', 'POST'])
def login (param_request = []):
    # if request.method == 'POST':
    #     return do_the_login()
    # else:
    #     return show_the_login_form()
    return param_request