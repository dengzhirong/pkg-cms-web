// 全局状态
window.$store = {
  state: {
    userInfo: {
      UserName: "",
      NickName: "",
      GroupName: "",
      Email: "",
      Phone: "",
      QQ: "",
      GroupId: ""
    },

    devUserList: [],
    custUserList: [],
    allUserList: [],

    GroupMaps: {
      custom: { id: 3, name: "客户" },
      develop: { id: 2, name: "开发" },
      manager: { id: 1, name: "管理员" }
    },

    isCustom: false,
    isDevelop: false,
    isManager: false,

    showContact: false,
    showMarket: false
  }
};

