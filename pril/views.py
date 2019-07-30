from pril import app, forms, SQLbase
from flask import Markup, render_template, request, redirect, flash, url_for


@app.route('/', methods=['GET', 'POST'])
def reply():

    request_rows=[]

    if request.method == 'GET':
        ip = request.args.get('ip')
        vendor = request.args.get('vendor')
    elif request.method == 'POST':
        ip = request.form.get('ip_device')
        vendor = request.form.get('list_field')
        request_rows = SQLbase.request_SQL(ip,vendor)

    if vendor:
        vendor = str.lower(vendor)

    form = forms.Vendor(ip_device=ip, list_field=vendor)

    return render_template('main.html',form=form, row = request_rows)
