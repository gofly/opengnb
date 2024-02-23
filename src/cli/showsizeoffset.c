#include <stdio.h>
#include "gnb_block.h"
#include "gnb_ctl_block.h"
#include "gnb_node_type.h"

#undef offsetof
#ifdef __compiler_offsetof
#define offsetof(TYPE, MEMBER)	__compiler_offsetof(TYPE, MEMBER)
#else
#define offsetof(TYPE, MEMBER)	((size_t)&((TYPE *)0)->MEMBER)
#endif

#undef member_size
#define member_size(type, member) \
    sizeof(((type *)0)->member)

int main() {
    printf("const(\n");
    printf("\tsizeof__uint32_t=%ld\n", sizeof(uint32_t));
    printf("\tsizeof__gnb_block32_t=%ld\n", sizeof(gnb_block32_t));
    printf("\n");
    printf("\tsizeof__gnb_ctl_core_zone_t=%ld\n", sizeof(gnb_ctl_core_zone_t));
    printf("\tsizeof__gnb_ctl_core_zone_t__local_uuid=%ld\n", member_size(gnb_ctl_core_zone_t, local_uuid));
    printf("\tsizeof__gnb_ctl_core_zone_t__ifname=%ld\n\n", member_size(gnb_ctl_core_zone_t, ifname));
    printf("\n");
    printf("\tsizeof__gnb_ctl_status_zone_t=%ld\n", sizeof(gnb_ctl_status_zone_t));
    printf("\tsizeof__gnb_ctl_status_zone_t__keep_alive_ts_sec=%ld\n", member_size(gnb_ctl_status_zone_t, keep_alive_ts_sec));
    printf("\n");
    printf("\tsizeof__gnb_ctl_node_zone_t=%ld\n", sizeof(gnb_ctl_node_zone_t));
    printf("\tsizeof__gnb_ctl_node_zone_t__name=%ld\n", member_size(gnb_ctl_node_zone_t, name));
    printf("\tsizeof__gnb_ctl_node_zone_t__node_num=%ld\n", member_size(gnb_ctl_node_zone_t, node_num));
    printf("\n");
    printf("\tsizeof__gnb_node_t=%ld\n", sizeof(gnb_node_t));
    printf("\tsizeof__gnb_node_t__uuid32=%ld\n", member_size(gnb_node_t, uuid32));
    printf("\tsizeof__gnb_node_t__in_bytes=%ld\n", member_size(gnb_node_t, in_bytes));
    printf("\tsizeof__gnb_node_t__out_bytes=%ld\n", member_size(gnb_node_t, out_bytes));
    printf("\tsizeof__gnb_node_t__udp_addr_status=%ld\n", member_size(gnb_node_t, udp_addr_status));
    printf("\tsizeof__gnb_node_t__addr6_ping_latency_usec=%ld\n", member_size(gnb_node_t, addr6_ping_latency_usec));
    printf("\tsizeof__gnb_node_t__addr4_ping_latency_usec=%ld\n", member_size(gnb_node_t, addr4_ping_latency_usec));
    printf(")\n\n");

    printf("const(\n");
    printf("\toffsetof__gnb_ctl_core_zone_t__local_uuid=%ld\n", offsetof(gnb_ctl_core_zone_t, local_uuid));
    printf("\toffsetof__gnb_ctl_core_zone_t__ifname=%ld\n", offsetof(gnb_ctl_core_zone_t, ifname));
    printf("\n");
    printf("\toffsetof__gnb_ctl_status_zone_t__keep_alive_ts_sec=%ld\n", offsetof(gnb_ctl_status_zone_t, keep_alive_ts_sec));
    printf("\n");
    printf("\toffsetof__gnb_ctl_node_zone_t__name=%ld\n", offsetof(gnb_ctl_node_zone_t, name));
    printf("\toffsetof__gnb_ctl_node_zone_t__node_num=%ld\n", offsetof(gnb_ctl_node_zone_t, node_num));
    printf("\n");
    printf("\toffsetof__gnb_node_t__uuid32=%ld\n", offsetof(gnb_node_t, uuid32));
    printf("\toffsetof__gnb_node_t__in_bytes=%ld\n", offsetof(gnb_node_t, in_bytes));
    printf("\toffsetof__gnb_node_t__out_bytes=%ld\n", offsetof(gnb_node_t, out_bytes));
    printf("\toffsetof__gnb_node_t__udp_addr_status=%ld\n", offsetof(gnb_node_t, udp_addr_status));
    printf("\toffsetof__gnb_node_t__addr6_ping_latency_usec=%ld\n", offsetof(gnb_node_t, addr6_ping_latency_usec));
    printf("\toffsetof__gnb_node_t__addr4_ping_latency_usec=%ld\n", offsetof(gnb_node_t, addr4_ping_latency_usec));
    printf(")\n");
}