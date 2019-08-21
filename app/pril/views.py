from pril import app, forms, SQLbase
from flask import render_template, request
from prometheus_flask_exporter import PrometheusMetrics, Gauge

metrics = PrometheusMetrics(app)

metrics.info('app_info', 'radius web app', version='0.1')
time_db = Gauge('sql_request_time','The response time from the server sql-base',['database'])
time_db.labels('sql').set(0)
time_db.labels('redis').set(0)

@app.route('/', methods=['GET', 'POST'])
# @metrics.do_not_track()
@metrics.counter('client_requests', 'Number call init')
def reply():

    request_rows = []
    time=0
    header = []
    time_flag = None

    if request.method == 'GET':
        ip = request.args.get('ip')
        vendor = request.args.get('vendor')
    elif request.method == 'POST':
        ip = request.form.get('ip_device')
        vendor = request.form.get('list_field')
        request_rows, time, header, time_flag = SQLbase.request_SQL(ip, vendor)

        if time_flag:
            time_db.labels('sql').set(time)
        else:
            time_db.labels('redis').set(time)

    if vendor:
        vendor = str.lower(vendor)



    form = forms.Vendor(ip_device=ip, list_field=vendor)
    return render_template('main.html', form=form, time=time, row=request_rows, header_request=header)

@app.route('/xyz')
def xyz():
    return "<h1>Do pay</h1>" 404
