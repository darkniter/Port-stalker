from pril import app, forms, SQLbase
from flask import render_template, request
from prometheus_flask_exporter import PrometheusMetrics

metrics = PrometheusMetrics(app)

metrics.info('app_info_test', 'Test metrics lib', version='2')

@app.route('/', methods=['GET', 'POST'])
def reply():

    request_rows = []
    time=''
    header = []

    if request.method == 'GET':
        ip = request.args.get('ip')
        vendor = request.args.get('vendor')
    elif request.method == 'POST':
        ip = request.form.get('ip_device')
        vendor = request.form.get('list_field')
        request_rows, time, header = SQLbase.request_SQL(ip, vendor)

    if vendor:
        vendor = str.lower(vendor)

    form = forms.Vendor(ip_device=ip, list_field=vendor)
    return render_template('main.html', form=form, time=time, row=request_rows, header_request=header)
