window.$myRegexp = {
  qq: /^[1-9][0-9]{4,}$/,
  phone: /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/,
  email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
  url: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/,
};

window.$myCommon = {
  toast(msg, type) {
    $store.app &&
      $store.app.$message({
        showClose: true,
        message: msg,
        type: type || "error"
      });
  },

  alert(msg) {
    this.$confirm(msg, "", {
      confirmButtonText: "确定",
      type: "danger",
      center: true
    });
  },

  // 根据角色Id获取角色名
  getGroupNameByGroupId(groupId) {
    if (!groupId || isNaN(groupId)) return "";
    groupId = parseInt(groupId);
    let GroupMaps = window.$store.state.GroupMaps;
    let group = _.find(GroupMaps, { id: groupId }) || {};
    return group.name || "";
  },

  // 检查是否登录成功
  checkLogin(successCb, errorCb, isRedictToAdmin) {
    window.$cmsApi.checkLogin(
      res => {
        if (res.code == 1) {
          let loginData = res.data || {};
          let GroupMaps = window.$store.state.GroupMaps;
          let userInfo = res.data || {};
          userInfo.GroupName = window.$myCommon.getGroupNameByGroupId(
            userInfo.GroupId
          );
          window.$store.state.userInfo = userInfo;
          window.$store.state.isCustom =
            loginData.GroupName == GroupMaps.custom.name;
          window.$store.state.isDevelop =
            loginData.GroupName == GroupMaps.develop.name;
          let isManager = loginData.GroupName == GroupMaps.manager.name;
          window.$store.state.isManager = isManager;
          window.$store.state.showContact = !!userInfo.ShowContact;
          window.$store.state.showMarket = !!userInfo.ShowMarket;
          successCb && successCb(res);

          if (isRedictToAdmin) {
            $store.app && $store.app.$router.push({ name: "appList" });
          }
        } else {
          errorCb && errorCb();
          $store.app && $store.app.$router.push({ name: "login" });
        }
      },
      () => {
        errorCb && errorCb();
        $store.app && $store.app.$router.push({ name: "login" });
      }
    );
  },

  testValid(str, dataType) {
    let regexp = window.$myRegexp[dataType];
    return regexp && regexp.test(str);
  },

  getCustNameById(custId) {
    if (!custId) {
      return "";
    }
    let custUserList = window.$store.state.custUserList || [];
    custId = parseInt(custId);
    let custInfo = _.find(custUserList, { Id: custId }) || {};
    return custInfo.NickName || custInfo.UserName || custInfo.Id || "";
  }
};


