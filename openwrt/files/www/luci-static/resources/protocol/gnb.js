'use strict';
'require uci';
'require form';
'require network';
'require fs';
'require ui';

network.registerPatternVirtual(/^gnb-.+$/);
return network.registerProtocol('gnb', {
  NodeID: form.Value.extend({
    validate: function (section_id, value) {
      var str = this.formvalue(section_id);
      if (!str.match(/^\d{4}$/)) {
        return _('Expecting: 4 digits');
      }
      return true;
    }
  }),
  IPAddr: form.Value.extend({
    validate: function (section_id, value) {
      var str = this.formvalue(section_id);
      if (!str.match(/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/)) {
        return _('Expecting: valid IPv4');
      }
      return true;
    }
  }),
  NetMask: form.Value.extend({
    validate: function (section_id, value) {
      var str = this.formvalue(section_id);
      if (!str.match(/^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/)) {
        return _('Expecting: valid IPv4 mask');
      }
      return true;
    }
  }),
  Passcode: form.Value.extend({
    validate: function (section_id, value) {
      var str = this.formvalue(section_id);
      if (str.length > 0 && !str.match(/^[0-9a-f]{8}$/)) {
        return _('Expecting: 8 hex character');
      }
      return true;
    }
  }),
  Listen: form.DynamicList.extend({
    validate: function (section_id, value) {
      var val = this.formvalue(section_id);
      for (i = 0; i < val.length; i++) {
        if (i>4) return _('Max 5 ports');
        var str = val[i];
        if (str.length > 0 && !str.match(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/)) {
          return _('Expecting: [ip:]<port>');
        }
      }
      return true;
    }
  }),
  NodeOption: form.DynamicList.extend({
    validate: function (section_id, value) {
      var val = this.formvalue(section_id), i;
      for (i = 0; i < val.length; i++) {
        var str = val[i];
        if (str.length > 0 && !str.match(/^[a-zA-Z0-9_\-]+\ [a-zA-Z0-9_\-,]+$/)) {
          return _('Expecting: <key> <value>');
        }
      }
      return true;
    }
  }),
  Address: form.DynamicList.extend({
    validate: function (section_id, value) {
      var val = this.formvalue(section_id), i;
        console.log(value);
      for (i = 0; i < val.length; i++) {
        var str = val[i];
        if (str.length > 0 && !str.match(/^[ifnsur]+\|\d{4}\|((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])|[-a-zA-Z0-9\.]{0,62})\|([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/)) {
          return _('Expecting: ifnsur|1000|10.0.0.1|9001');
        }
      }
      return true;
    }
  }),
  Route: form.DynamicList.extend({
    validate: function (section_id, value) {
      var val = this.formvalue(section_id), i;
      for (i = 0; i < val.length; i++) {
        var str = val[i];
        if (str.length > 0 && !str.match(/^\d{4}\|((\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\|((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}|((\d{4},)*(\d{4})+)|((auto,|force,|static,|balance,)*(auto|force|static|balance)+))$/)) {
          return _('Expecting: 1000|10.0.0.1|255.255.0.0');
        }
      }
      return true;
    }
  }),
  getI18n: function () {
    return _('OpenGNB');
  },
  getIfname: function () {
    return this._ubus('l3_device') || 'gnb-%s'.format(this.sid);
  },
  getOpkgPackage: function () {
    return 'opengnb';
  },
  containsDevice: function (ifname) {
    return (network.getIfnameOf(ifname) == this.getIfname());
  },
  renderFormOptions: function (s) {
    var dev = this.getL3Device() || this.getDevice(), o;
    o = s.taboption('general', this.NodeID, 'nodeid', _('Node ID'));
    o.datatype = 'range(1000, 9999)';
    o.placeholder = '1001'
    o.default = '1000'
    o = s.taboption('general', this.IPAddr, 'ipaddr', _('IPv4 address'));
    o.placeholder = '10.0.0.1'
    o.default = '10.0.0.1'
    o = s.taboption('general', this.NetMask, 'netmask', _('IPv4 netmask'));
    o.placeholder = '255.255.255.0';
    o.default = '255.255.255.0';
    o = s.taboption('general', this.Passcode, 'passcode', _('Passcode'));
    o.password = true;
    o = s.taboption('general', form.ListValue, 'crypto', _('Crypto'));
    o.value('xor');
    o.value('arc4');
    o.value('none');
    o.default = 'xor';
    o = s.taboption('general', form.Flag, 'multisocket', _('Multi Socket'));
    o.modalonly=true;
    o.default=o.disabled
    o = s.taboption('general', this.Listen, 'listen', _('Listen'));
    o.datatype = 'range(1000, 60000)';
    o.placeholder = '9001';
    o.default = '9001';
    s.taboption('general', this.NodeOption, 'nodeopt', _('Node options'));
    s.taboption('general', this.Address, 'address', _('Addresses'));
    s.taboption('general', this.Route, 'route', _('Routes'));
    o = s.taboption('advanced', form.Value, 'mtu', _('Override MTU'));
    o.placeholder = dev ? (dev.getMTU()) : '';
    o.datatype = 'range(68, 9200)';
  }
});

