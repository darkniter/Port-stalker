from pril import app, forms, SQLbase
from flask import Markup, render_template, request, redirect, flash, url_for


@app.route('/', methods=['GET', 'POST'])
def reply(name=None, control=None):
    form = forms.Vendor(request.form)

    ip = request.form.get('ip_device')
    vendor = request.form.get('vendor_device')
    request_rows=[]

    if ip and vendor:

        request_rows = SQLbase.request_SQL(ip,vendor)
    if request_rows:
        redirect(url_for('reply', request='?vendor=%s &ip=%s' % (vendor, ip)))



    return render_template('main.html',form=form, ip=ip, vendor = vendor, row = request_rows)
