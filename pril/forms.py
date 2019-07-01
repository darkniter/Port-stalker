from wtforms import Form, StringField, TextAreaField, validators

class Vendor (Form):
    ip_device = StringField('ip_device',[validators.DataRequired(), validators.Length(min=7,max=15,message='format ip - 255.255.255.255')])
    vendor_device = StringField('vendor_device', [validators.DataRequired(),validators.Length(min=5,max=5,message='vendor_name = dlink or eltex')])
