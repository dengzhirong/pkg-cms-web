window.$myConfig = {
  PWD_CRYPTO_SALT: '@#()&%@!_+:"Q<>?@#', // 密码的前端加密密钥

  RES_COMMON_CODES: { // 接口返回的code值
    success: 1, // 请求成功
    fail: -1, // 请求失败（普通）

    noLogin: -21, // 未登录
    noPermission: -22, // 无访问权限
    userNotFound: -23, // 用户不存在
    userIsBan: -24 // 用户已被禁用
  }
};
