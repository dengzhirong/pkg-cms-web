<template>
  <div class='page-login flex-center'>
    <div class="login-wrap">
    <el-form ref="loginForm" :model="form" :rules="rules"
      v-on:validate="validateListener" label-width="60px">
      <el-form-item label="用户名" placeholder="请输入用户名" prop="name">
        <el-input v-model="form.name" maxlength="20" clearable :class="{'auto-complete': isAutoComplete}"
          @input="isAutoComplete=false"></el-input>
      </el-form-item>
      <el-form-item ref="loginForm_pwd" label="密码" placeholder="请输入密码" prop="pwd">
        <el-input v-model="form.pwd" type="password" maxlength="20" clearable auto-complete='on'
          :class="{'auto-complete': isAutoComplete}" @input="isAutoComplete=false"></el-input>
      </el-form-item>
      <el-form-item ref="loginForm_code" label="验证码" placeholder="请输入验证码" prop="code">
        <el-col :span="13">
          <el-input v-model="form.code" auto-complete='on'></el-input>
        </el-col>
        <el-col class='code-col'>
          <div class="code-wrap" v-html="codeImageHtml" @click="changeCodeImage"></div>
        </el-col>
      </el-form-item>
      <div style="text-align:center;margin-top:40px;">
        <el-button type="primary" class='btn-login' @click="submitForm">登&nbsp;&nbsp;录</el-button>
      </div>
    </el-form>
    </div>
    <div class="copyright">Copyright © 2018</div>
  </div>
</template>

<script>
function genValidator(regx, msg) {
  return function(rule, value, callback) {
    if(!regx.test(value)) {
      callback(new Error(msg));
    }
  }
}
function genCharValidator(regx, msg) {
  return function(rule, value='', callback) {
    for(var i = 0, l = value.length; i < l; i++) {
      if(!regx.test(value[i])) {
        callback(new Error(msg));
      }
    }
  };
}
export default {
  name: 'Login',
  data () {
    return {
      form: {
        name: '',
        pwd: '',
        code: '',
      },
      codeImageHtml: '',
      codeImageKey: '',
      isLoginFormValid: false,
      formValidStatus: {}, // 表单验证结果
      formPropKeys: ['name', 'pwd', 'code'], // 表单属性key

      isAutoComplete: false,

      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // { validator: genCharValidator(/[a-zA-z]|\w|\d/, '不允许输入特殊字符'), trigger: ['blur', 'change'] },
          { min: 3, message: '用户名不少于3个字符', trigger: 'blur' },
          { max: 20, message: '用户名不多于20个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '密码名不少于3个字符', trigger: 'blur' },
          { max: 20, message: '密码名不多于20个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: ['blur', 'change'] },
        ]
      }
    }
  },
  methods: {
    changeCodeImage() { // 更换验证码图片
      this.codeImageKey = '';
      this.resetForm('code');
      this.getLoginCode();
    },
    getLoginCode() { // 请求验证码图片
      window.$cmsApi.getLoginCode({
        width: 100, height: 30
      }, (res={}) => {
        this.codeImageHtml = res.img;
        this.codeImageKey = res.key || '';
      }, () => {
        this.$message({
          showClose: true,
          message: '验证码请求出错',
          type: 'error'
        });
      });
    },
    validWholeForm(cb) {
      var valid = true;
      this.formPropKeys.forEach((val, index) => {
       if(!valid) return;
       valid = !!this.formValidStatus[val];
      });
      this.isLoginFormValid = valid;
    },
    validateListener(propname, valid) {
      this.formValidStatus[propname] = valid;
      console.log(propname, valid);
      this.validWholeForm();
    },
    submitForm() { // 登录
      if (this.isLoginFormValid) {
          var formData = this.form || {};
          this._login(formData.name, formData.pwd, formData.code, this.codeImageKey);
        } else {
          window.$myCommon.toast('请检查参数是否正确');
          return false;
        }
    },
    _login(username, pwd, code, codekey) {
      // pwd = CryptoJS.AES.encrypt(pwd, window.$myConfig.PWD_CRYPTO_SALT).toString();
      var RES_COMMON_CODES = window.$myConfig.RES_COMMON_CODES;
      var loginResCodes = { // http请求的返回码
        errorPwd: -2, // 密码错误
        errorImgCode: -3, // 验证码错误
      };
      window.$cmsApi.login({username, pwd, code, codekey}, (res) => {
        this.isAutoComplete = false;
        var resCode = res.code;
        if(resCode == 1) {
          this.$router.push({ name: 'adminApp' }); // 登录成功

          // 将账号密码写入缓存
          window.localStorage.setItem('cms_username', this.form.name);
          window.localStorage.setItem('cms_pwd', this.form.pwd);
        } else {
          window.$myCommon.toast(res.msg || '登录失败');
          if(resCode == RES_COMMON_CODES.userNotFound || resCode == RES_COMMON_CODES.userIsBan) {
            this.resetForm();
            this.changeCodeImage();
          } else if(resCode == loginResCodes.errorPwd) {
            this.resetForm('pwd');
            this.changeCodeImage();
          } else if(resCode == loginResCodes.errorImgCode) {
            this.changeCodeImage();
          }
        }
      }, (msg) => {
        this.isAutoComplete = false;
        window.$myCommon.toast(msg || '网络失败，请稍后再试');
      });
    },
    resetForm(field) {
      if(!field) {
        this.$refs.loginForm.resetFields();
      } else {
        this.$refs['loginForm_' + field].resetField();
      }
    }
  },
  mounted() {
    // 先判断是否登录
    this.getLoginCode();
    // 先判断是否登录
    window.$myCommon.checkLogin((data) => {
    }, () => {
      // 从缓存中读取账号密码
      var cacheUsername = window.localStorage.getItem('cms_username');
      var cachePwd = window.localStorage.getItem('cms_pwd');
      if(cacheUsername && cachePwd) {
        this.form.name = cacheUsername;
        this.form.pwd = cachePwd;
        this.isAutoComplete = true;
        this.formValidStatus.name = true;
        this.formValidStatus.pwd = true;
      }
    });
  }
}
</script>

<style scoped>
.page-login {
  position: relative;
  width: 100%;
  height: 100%;
  background: #3b70bb url(/static/images/bg-login.jpg) no-repeat center;
  background-size: 100% 100%;
}
.el-form-item__label {
  color: #312128;
 }
.login-wrap {
  padding: 30px 30px 20px 20px;
  width: 320px;
  margin: 0 auto;
  background: rgba(255, 255, 255, .6);
  border: 1px solid #cbd1e5;
  border-radius: 8px;
  box-shadow: 0 0 14px rgba(255,255,255,.4);
}
.btn-login {
  width: 150px;
  font-weight: bold;
}
.code-wrap {
  background: #fff;
  height: 40px;
  width: 100px;
  border-radius: 4px;
  overflow: hidden;
}
.code-col {
  width: auto;
  float: right;
}
.copyright {
  position: absolute;
  width: 100%;
  text-align: center;
  left: 0;
  bottom: 20px;
  color: #666;
}

</style>
