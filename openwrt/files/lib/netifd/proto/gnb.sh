#!/bin/sh

[ -x /usr/bin/gnb ] || exit 0

[ -n "$INCLUDE_ONLY" ] || {
	. /lib/functions.sh
	. ../netifd-proto.sh
	init_proto "$@"
}

proto_gnb_append() {
	append "$3" "$1" "~"
}


proto_gnb_init_config() {
	proto_config_add_string nodeid
	proto_config_add_string 'ipaddr:ipaddr'
	proto_config_add_string netmask
	proto_config_add_string passcode
	proto_config_add_string 'crypto:or("xor","arc4","none")'
	proto_config_add_boolean 'multisocket:bool'
	proto_config_add_int 'mtu:uinteger'
	proto_config_add_array 'listen:list(uinteger)'
	proto_config_add_array 'nodeopt:list(string)'
	proto_config_add_array 'address:list(string)'
	proto_config_add_array 'route:list(string)'
	no_device=1
	available=1
}

proto_gnb_setup() {
	local config="$1"

	local nodeid ipaddr netmask passcode crypto multisocket mtu
	local listen listens nodeopt nodeopts address addresses route routes
	json_get_vars nodeid ipaddr netmask passcode crypto multisocket mtu
	json_for_each_item proto_gnb_append listen listens
	json_for_each_item proto_gnb_append nodeopt nodeopts
	json_for_each_item proto_gnb_append address addresses
	json_for_each_item proto_gnb_append route routes

	netmask="${netmask:-255.255.255.0}"
	iface="gnb-${config}"
	config_dir="/etc/gnb/$config"

	proto_export IFACE="$iface"
	proto_export IPADDR="$ipaddr"
	proto_export NETMASK="$netmask"
	proto_export CONFIG="$config"
	proto_export NODEID="$nodeid"
	proto_export ROUTECONF="$config_dir/route.conf"

	mkdir -p $config_dir/security $config_dir/ed25519 $config_dir/scripts

	if [ ! -f $config_dir/security/${nodeid}.private ] || [ ! -f $config_dir/security/${nodeid}.public ]; then
			gnb_crypto -c -p $config_dir/security/${nodeid}.private -k $config_dir/security/${nodeid}.public
	fi

	{
		echo "nodeid $nodeid"
		[ -n "$listens" ] && echo $listens | sed 's/~/\n/g' | while read line; do echo listen $line; done
		[ -n "$passcode" ] && echo "passcode $passcode"
		[ -n "$crypto" ] && echo "crypto $crypto"
		[ "$multisocket" = 1 ] && echo "multi-socket on" || echo "multi-socket off"
		[ -n "$mtu" ] && echo "mtu $mtu"
		[ -n "$nodeopts" ] && echo $nodeopts | sed 's/~/\n/g' | while read line; do echo $line; done
		echo "ctl-block /var/run/gnb.${config}.map"
		echo "node-cache-file /var/run/gnb.${config}.nodes"
		echo "pid-file /var/run/gnb.${config}.pid"
		echo "log-file-path /tmp/log/gnb/${config}"
	} > $config_dir/node.conf
	{
		[ -n "$addresses" ] && echo $addresses | sed 's/~/\n/g' | while read line; do
			(echo "$line" | grep -q "^$nodeid|") || echo $line
		done
	} > $config_dir/address.conf
	{
		echo "$nodeid|$ipaddr|$netmask"
		[ -n "$routes" ] && echo $routes | sed 's/~/\n/g' | while read line; do
			(echo "$line" | grep -q "^$nodeid|") || echo $line
		done
	} > $config_dir/route.conf

	mkdir -p /tmp/log/gnb/${config}
	cp -f /lib/netifd/gnb-up.script $config_dir/scripts/if_up_linux.sh
	proto_run_command "$config" /usr/bin/gnb -c $config_dir -i "$iface" -q
}

proto_gnb_teardown() {
	local config="$1"
	logger -t gnb "stopping..."
	proto_kill_command "$config"
}

proto_gnb_renew() {
	local iface="$1"
	logger -t gnb "renew $iface ..."
}

[ -n "$INCLUDE_ONLY" ] || {
	add_protocol gnb
}
