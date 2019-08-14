from pril import app, forms, SQLbase
from flask import render_template, request
from prometheus_flask_exporter import PrometheusMetrics

metrics = PrometheusMetrics(app)

metrics.info('app_info_test', 'Test metrics lib', version='2')
time_SQL = metrics.info('SQL_request','The response time from the server SQL-base')
time_Redis = metrics.info('Redis_request','The response time from the server Redis-base')

time_SQL.set(0)

time_Redis.set(0)

@app.route('/', methods=['GET', 'POST'])
@metrics.do_not_track()
@metrics.counter('count_call_init', 'Number call init')
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
            time_SQL.set(time)
        else:
            time_Redis.set(time)
    
    if vendor:
        vendor = str.lower(vendor)

    
    
    form = forms.Vendor(ip_device=ip, list_field=vendor)
    return render_template('main.html', form=form, time=time, row=request_rows, header_request=header)
