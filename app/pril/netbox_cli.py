import pril.config as config
# import config
# import requests
# import json
import pynetbox
from functools import lru_cache


net_box = pynetbox.api(config.NETBOX_URL, config.TOKEN)


class dev_netbox():
    def __init__(self, ip=None):
        self.ip_address = ip
        if self.ip_address:
            self.ip = net_box.ipam.ip_addresses.get(address=self.ip_address)
            if self.ip:
                self.dev_id = self.ip.interface.device.id
                self.device = net_box.dcim.devices.get(self.dev_id)
                if self.device:
                    self.vendor = self.device.device_type.manufacturer
                if self.vendor:
                    self.vendor_name = self.vendor.slug


class regions_netbox():
    def __init__(self,obj,parent):
        self.name = obj.name
        self.id = obj.id
        if not parent and obj.parent:
            self.name = obj.parent.name + ': ' + self.name

        self.slug = obj.slug
        if obj.parent:
            self.parent_code = config.FIAS_CODE.get(obj.parent.slug)
        else:
            self.parent_code = None


@lru_cache(maxsize=40)
def get_device(address):
    device_obj = dev_netbox(address)

    return device_obj


def get_regions(query=None,parent=True):
    regions_list = []
    if query:
        regions = net_box.dcim.regions.filter(query)

    if query == '' or query is None:
        regions = net_box.dcim.regions.all()

    for region in regions:
        obj = regions_netbox(region, parent)
        if obj.parent_code or parent:
            regions_list.append({
                'id': obj.id,
                'slug': obj.slug,
                'name': obj.name,
                'region_code': obj.parent_code
            })

    return regions_list


if __name__ == "__main__":
    print(get_regions(
        'M',
        False
        )
    )
    print()
