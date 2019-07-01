from pril import app, forms, SQLbase
from flask import Markup, render_template, request, redirect, flash


@app.route('/', methods=['GET', 'POST'])
def hello(name=None, control=None):
    form = forms.Vendor(request.form)
    ip=''
    vendor=''

    if request.method == 'GET':
        return redirect('/login')


    return render_template('main.html',form=form, ip=ip, vendor = vendor)

@app.route('/login', methods=['GET', 'POST'])
def login ():
    form = forms.Vendor(request.form)
    request_rows=[]
    ip = request.form.get('ip_device')
    vendor = request.form.get('vendor_device')
    request_rows = SQLbase.request_SQL(ip,vendor)
    return render_template('main.html',form=form, ip=ip, vendor = vendor, row = request_rows)