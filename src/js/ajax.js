// api 请求
let API_HOST = "http://test.dzr.com:8081";
let ADMIN_API_HOST = API_HOST + "/admin_api";

const API_ROUTER = {
  login: ADMIN_API_HOST + "/login", // 登录
  logincode: ADMIN_API_HOST + "/logincode", // 登录验证码
  logout: ADMIN_API_HOST + "/logout", // 登出
  checkLogin: ADMIN_API_HOST + "/checklogin", // 检查是否登录

  createUser: ADMIN_API_HOST + "/user/create", // 添加用户
  updateUser: ADMIN_API_HOST + "/user/update", // 修改用户
  modifyUserPwd: ADMIN_API_HOST + "/user/modify_pwd", // 修改密码
  getUserList: ADMIN_API_HOST + "/user/list", // 获取用户列表
  getAllDevUserList: ADMIN_API_HOST + "/user/all_dev", // 获取所有的用户列表
  getUserDetail: ADMIN_API_HOST + "/user/:id", // 获取用户信息
  deleteUser: ADMIN_API_HOST + "/user/delete/:id", // 删除用户
  banUser: ADMIN_API_HOST + "/user/ban/:id", // 禁用用户
  unBanUser: ADMIN_API_HOST + "/user/unban/:id", // 解封
  center: ADMIN_API_HOST + "/user/center", // 用户个人中心

  createApp: ADMIN_API_HOST + "/app/create", // 添加app
  updateApp: ADMIN_API_HOST + "/app/update/:id", // 修改app
  updateAppByIds: ADMIN_API_HOST + "/app/update_batch", // 批量修改app
  deleteApp: ADMIN_API_HOST + "/app/delete/:id", // 删除app
  getAppDetail: ADMIN_API_HOST + "/app/detail/:id", // 获取app详情
  getAppList: ADMIN_API_HOST + "/app/list", // 获取app列表
  getAppListOfMarket: ADMIN_API_HOST + "/app/list_market", // 获取app市场列表
  publishApp: ADMIN_API_HOST + "/app/publish/:id", // 发布app

  exportUserExcel: ADMIN_API_HOST + "/user/export", // 导出用户表
  exportAppExcel: ADMIN_API_HOST + "/app/export", // 导出App表
  exportAppMarketExcel: ADMIN_API_HOST + "/app/export_market", // 导出App商店表

  appDataPreviewUrl: API_HOST + "/biz/getAppConfig?appid=", // 查看app的应用数据
  backupSql: ADMIN_API_HOST + "/sql/backup_latest", // sql数据库备份
};
window.ADMIN_API_HOST = ADMIN_API_HOST;
window.API_ROUTER = API_ROUTER;

const resCommonCodes = window.$myConfig.RES_COMMON_CODES;

let ajax = function(url, data, methods, dataType, successCb, errorCb, notDueSuccessCb) {
  $.ajax({
    url: url,
    data: data,
    type: methods,
    dataType: dataType || "json",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    success: function(res) {
      if (notDueSuccessCb) {
        // 是否不处理成功的返回
        return successCb && successCb(res);
      }
      var resCode = res.code;
      if (resCode == 1) {
        successCb && successCb(res);
      } else if (resCode == resCommonCodes.noLogin
        || resCode == resCommonCodes.userNotFound
        || resCode == resCommonCodes.userIsBan) {
        // 未登录/用户不存在/用户被禁言
        window.$store.state.userInfo = {};
        $store.app && $store.app.$router.push({ name: "login" });
        errorCb && errorCb(res.msg || "网络信号不好，请稍后再试");
      } else {
        errorCb && errorCb(res.msg || "网络信号不好，请稍后再试");
      }
    },
    error: function() {
      var msg = "网络信号不好，请稍后再试";
      errorCb && errorCb(msg);
    }
  });
};

function urlEncode(obj) {
  var str = "";
  for (var key in obj) {
    if (str != "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(obj[key]);
  }
  return str;
}

window.$cmsApi = {
  getLoginCode(params, successCb, errorCb) {
    // 获取登录验证码
    ajax(
      API_ROUTER.logincode,
      params,
      "get",
      "jsonp",
      function(res) {
        successCb && successCb(res.data);
      },
      errorCb,
      false
    );
  },
  login(params, successCb, errorCb) {
    // 登录
    ajax(
      API_ROUTER.login,
      params,
      "get",
      "jsonp",
      function(res) {
        successCb && successCb(res);
      },
      errorCb
    );
  },
  login(params, successCb, errorCb) {
    // 登录
    ajax(
      API_ROUTER.login,
      params,
      "get",
      "jsonp",
      function(res) {
        successCb && successCb(res);
      },
      errorCb
    );
  },

  logout(successCb, errorCb) {
    ajax(
      API_ROUTER.logout,
      {},
      "get",
      "jsonp",
      function(res) {
        successCb && successCb(res);
      },
      errorCb
    );
  },
  checkLogin(successCb, errorCb) {
    ajax(
      API_ROUTER.checkLogin,
      {},
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "修改失败");
        }
      },
      errorCb
    );
  },

  createUser(params, successCb, errorCb) {
    ajax(
      API_ROUTER.createUser,
      params,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "修改失败");
        }
      },
      errorCb
    );
  },
  updateUser(params = {}, successCb, errorCb) {
    ajax(
      API_ROUTER.updateUser,
      params,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "修改失败");
        }
      },
      errorCb
    );
  },
  modifyUserPwd(userId, pwd, successCb, errorCb) {
    ajax(
      API_ROUTER.modifyUserPwd,
      { pwd, id: userId },
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "修改密码失败");
        }
      },
      errorCb
    );
  },
  getUserList(options, successCb, errorCb) {
    ajax(
      API_ROUTER.getUserList,
      options,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          if (res.code == 1) {
            successCb && successCb(res);
          } else {
            errorCb && errorCb(res.msg || "网络连接错误");
          }
        }
      },
      errorCb
    );
  },
  getAllDevUserList(successCb, errorCb) {
    ajax(
      API_ROUTER.getAllDevUserList,
      {},
      "get",
      "jsonp",
      function(res) {
        successCb && successCb(res);
      },
      errorCb
    );
  },
  getUserDetail(id, successCb, errorCb) {
    ajax(
      API_ROUTER.getUserDetail.replace(":id", id),
      {},
      "get",
      "jsonp",
      function(res) {
        successCb && successCb(res);
      },
      errorCb
    );
  },
  deleteUser(id, successCb, errorCb) {
    ajax(
      API_ROUTER.deleteUser.replace(":id", id),
      {},
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  banUser(id, successCb, errorCb) {
    ajax(
      API_ROUTER.banUser.replace(":id", id),
      {},
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  unBanUser(id, successCb, errorCb) {
    ajax(
      API_ROUTER.unBanUser.replace(":id", id),
      {},
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },

  createApp(info, successCb, errorCb) {
    ajax(
      API_ROUTER.createApp,
      info,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  updateApp(params, successCb, errorCb) {
    var id = params.id;
    console.log(params);
    ajax(
      API_ROUTER.updateApp.replace(":id", id),
      params,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },

  updateAppByIds(ids, params, successCb, errorCb) {
    params.ids = ids;
    ajax(
      API_ROUTER.updateAppByIds,
      params,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  deleteApp(id, successCb, errorCb) {
    ajax(
      API_ROUTER.deleteApp.replace(":id", id),
      {},
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  publishApp(id, isPublish, successCb, errorCb) {
    ajax(API_ROUTER.publishApp.replace(":id", id), { isPublish }, "get", "jsonp", function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      }, errorCb);
  },
  getAppDetail(id, successCb, errorCb) {
    ajax(
      API_ROUTER.getAppDetail.replace(":id", id),
      {},
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  getAppList(options, successCb, errorCb) {
    ajax(
      API_ROUTER.getAppList,
      options,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },
  getAppListOfMarket(options, successCb, errorCb) {
    ajax(
      API_ROUTER.getAppListOfMarket,
      options,
      "get",
      "jsonp",
      function(res) {
        if (res.code == 1) {
          successCb && successCb(res);
        } else {
          errorCb && errorCb(res.msg || "网络连接错误");
        }
      },
      errorCb
    );
  },

  exportUserExcel(options = {}) {
    options = window.$myUtil.compact(options);
    var paramsStr = urlEncode(options);
    var url = API_ROUTER.exportUserExcel + "?" + paramsStr;
    window.open(url, "_blank");
  },
  exportAppExcel(options = {}) {
    options = window.$myUtil.compact(options);
    var paramsStr = urlEncode(options);
    var url = API_ROUTER.exportAppExcel + "?" + paramsStr;
    window.open(url, "_blank");
  },
  exportAppMarketExcel(options = {}) {
    options = window.$myUtil.compact(options);
    var paramsStr = urlEncode(options);
    var url = API_ROUTER.exportAppMarketExcel + "?" + paramsStr;
    window.open(url, "_blank");
  }
};
