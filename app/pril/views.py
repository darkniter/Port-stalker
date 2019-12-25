from pril import app, forms, SQLbase
from flask import render_template, request, jsonify
from prometheus_flask_exporter import PrometheusMetrics, Gauge
import json
import pril.config as config
from pril.netbox_cli import get_device,get_regions
from flask_cors import cross_origin
from pril.slugify import slugify
from pril.transliteration import transliterate
import requests

metrics = PrometheusMetrics(app)

metrics.info('app_info', 'radius web app', version='0.1')
time_db = Gauge(
    'sql_request_time',
    'The response time from the server sql-base',
    ['database']
    )
time_db.labels('sql').set(0)
time_db.labels('redis').set(0)


@app.route('/', methods=['GET', 'POST'])
# @metrics.do_not_track()
@metrics.counter('client_requests', 'Number call init')
def reply():
    access_restriction = url_netbox = dev_name = dev_model = time_flag = None
    header = request_rows = []
    time = 0

    if request.method == 'GET':
        ip = request.args.get('ip')
    elif request.method == 'POST':
        ip = request.form.get('ip_device')

    if ip:
        device_netbox = get_device(ip)
        if device_netbox.ip:
            if device_netbox.device.device_role.slug.find('switch') != -1:
                request_rows, time, header, time_flag = SQLbase.request_SQL(ip, device_netbox.vendor_name)
                url_netbox = config.NETBOX_URL + '/dcim/devices/{}'.format(device_netbox.dev_id)
                dev_name = device_netbox.device.display_name
                dev_model = device_netbox.device.device_type.model
            else:
                access_restriction = True

    if time_flag:
        time_db.labels('sql').set(time)
    else:
        time_db.labels('redis').set(time)

    form = forms.Vendor(ip_device=ip)

    return render_template(
        'main.html',
        form=form,
        time=time,
        access=access_restriction,
        dev_name_netbox=dev_name,
        dev_model_netbox=dev_model,
        url_netbox=url_netbox,
        row=request_rows,
        header_request=header
        )


# @app.route('/api/v1/radius/', methods=['GET'])
# def radius_api():
#     # query_arr = request.args(args)
#     return '200'


@app.route('/api/v1/PortStalker/', methods=['GET'])
@cross_origin()
def radius_api():
    response_json = {}
    ip = request.args.get('ip')

    if ip:
        device_netbox = get_device(ip)
        if device_netbox.ip:
            if device_netbox.device.device_role.slug.find('switch') != -1:
                response = SQLbase.request_SQL(ip, device_netbox.vendor_name)
                response_json = {
                    "request_rows": response[0],
                    "header": response[2]
                    }
                response_json.update(
                    {
                        "url_netbox": config.NETBOX_URL + '/dcim/devices/{}'.format(device_netbox.dev_id),
                        "dev_name": device_netbox.device.display_name,
                        "dev_model": device_netbox.device.device_type.model,
                    }
                )

    return jsonify(response_json)


@app.route('/api/v1/radius/', methods=['GET'])
def radius_api_Stalker():
    response_json = {}
    ip = request.args.get('ip')

    if ip:
        device_netbox = get_device(ip)
        if device_netbox.ip:
            if device_netbox.device.device_role.slug.find('switch') != -1:
                response = SQLbase.request_SQL(ip, device_netbox.vendor_name)
                response_json = json.dumps(response[0])

    return jsonify(response_json)


@app.route('/ping', methods=['GET'])
@cross_origin()
def ping_pong():
    return jsonify('Flask bitches!')


@app.route('/regions/', methods=['GET', 'POST'])
@app.route('/regions', methods=['GET', 'POST'])
@cross_origin()
def GetRegions():

    reg_query = request.args.get('q')
    if reg_query is not None:
        reg_query = slugify(transliterate(reg_query))

    regions = get_regions(reg_query)

    return jsonify({"regions": regions})



@app.route('/regions-child/', methods=['GET', 'POST'])
@app.route('/regions-child', methods=['GET', 'POST'])
@cross_origin()
def GetRegions_child():

    reg_query = request.args.get('q')
    reg_query = slugify(transliterate(reg_query))
    regions = get_regions(reg_query, False)

    return jsonify({"regions": regions})


@app.route('/streets/', methods=['GET', 'POST'])
@cross_origin()
def GetStreet_name():
    street_query = request.args.get('street')
    if street_query:
        trans_street = transliterate(street_query)
        street = {'translit': trans_street, 'slug': slugify(trans_street), }
        return jsonify({"street": street})
    else: return 'error value is None type'

@app.route('/forism/', methods=['GET'])
@cross_origin()
def getForism():
    forism = requests.get('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru')
    response = json.loads(forism.text)
    return jsonify({"forism": response})


@app.route('/guestUser/', methods=['GET'])
@cross_origin()
def GetGuest():
    return jsonify({'token': config.TOKENUSER, 'url': config.NETBOX_URL, })

