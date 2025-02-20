include $(TOPDIR)/rules.mk

PKG_NAME:=opengnb
PKG_VERSION:=1.4.5c
PKG_RELEASE:=1

# PKG_SOURCE_PROTO:=git
# PKG_SOURCE_URL:=https://github.com/gnbdev/opengnb.git
# PKG_SOURCE_VERSION:=HEAD
# PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION)
# PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.xz

PKG_LICENSE:=GPLv3
PKG_LICENSE_FILES:=COPYING
PKG_MAINTAINER:=Sun Bing<hoowa.sun@gmail.com>

# PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)/$(BUILD_VARIANT)/$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION)

PKG_USE_MIPS16:=0
PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk

define Package/opengnb
	SECTION:=net
	CATEGORY:=Network
	TITLE:=OpenSource P2P Virtual Network
	URL:=https://github.com/gnbdev/opengnb
	DEPENDS:=+kmod-tun
endef

define Package/opengnb/description
	OpenSource P2P Virtual Network
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)/files
	$(CP) ./files/* $(PKG_BUILD_DIR)/files/
	$(call Build/Prepare/Default)
endef

define Build/Compile
	(cd $(PKG_BUILD_DIR); cp -f Makefile.openwrt Makefile)
	$(call Build/Compile/Default)
endef

define Package/opengnb/install
	$(INSTALL_DIR) $(1)/lib/netifd/proto
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/files/lib/netifd/proto/gnb.sh $(1)/lib/netifd/proto
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/files/lib/netifd/gnb-up.script $(1)/lib/netifd
	$(INSTALL_DIR) $(1)/www/luci-static/resources/protocol
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/files/www/luci-static/resources/protocol/gnb.js $(1)/www/luci-static/resources/protocol
	$(INSTALL_DIR) $(1)/lib/upgrade/keep.d
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/files/lib/upgrade/keep.d/opengnb $(1)/lib/upgrade/keep.d
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/gnb $(1)/usr/bin/
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/gnb_crypto $(1)/usr/bin/
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/gnb_ctl $(1)/usr/bin/
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/gnb_es $(1)/usr/bin/
endef

$(eval $(call BuildPackage,opengnb))
