window.$myUtil = {
  encrypto(str, secret) {
    return CryptoJS.AES.encrypt(str, secret).toString();
  },
  decrypto(encoded, secret) {
    return CryptoJS.AES.decrypt(encoded, secret).toString(CryptoJS.enc.Utf8);
  },
  encodePassword(pwd) {
    var salt = window.$myConfig.PWD_CRYPTO_SALT;
    return this.encrypto(pwd, salt);
  },
  compact(obj={}) {
    var res = {};
    for(var key in obj) {
      if(obj[key]) {
        res[key] = obj[key];
      }
    }
    return res;
  }
};
