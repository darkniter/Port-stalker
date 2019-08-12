from wtforms import Form, StringField, validators, SelectField
from pril import app

class Vendor (Form):
    ip_device = StringField('ip_device', [validators.DataRequired(),
                            validators.Length(min=7, max=15, message='format\
                             ip - 255.255.255.255')])

    # vendor_device = StringField('vendor_device', [validators.DataRequired(),\
    # validators.Length(min=5,max=5,message='vendor_name = dlink or eltex')])
    choices_vendor = [('',"-")]
    for vendor in app.config.get_namespace("SQL_REQUEST_"):
        choices_vendor.append((vendor,str.capitalize(vendor)))

    list_field = SelectField("list_field",
                             [validators.DataRequired(),
                            #  validators.NoneOf('',message="Значение не выбрано")
                            ],
                             choices=choices_vendor)
