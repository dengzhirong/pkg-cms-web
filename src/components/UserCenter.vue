<template>
<div class="cms-page-center">
  <div class="cms-i-nav">
    <div class="nav-title el-icon-location-outline">个人信息</div>
    <div class="button-group fr">
      <el-button class='' type="warning" round size="mini" icon="el-icon-edit-outline"
        plain @click="showPasswordPop">修改密码</el-button>
      <el-button class='' type="danger" round size="mini" icon="el-icon-edit"
        v-if="!isEditing" @click="eidtUserInfo">编辑</el-button>
    </div>
  </div>

  <div class="userinfo" :class="{isEditing: isEditing}">
    <el-form label-width="80px" class="avatar-form">
      <el-form-item label="头像：" class='avatar-item clearfix'>
        <div class="avatar fl">
          <img src="/static/images/avatar.jpg" alt="头像" v-if="!userInfo.Avatar">
          <img :src="userInfo.Avatar" alt="头像" v-if="userInfo.Avatar">
        </div>
        <el-button size="mini" icon="el-icon-upload" round plain class='fl'
          style="margin: 5px 0 0 20px;" disabled>更换头像</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="userInfoForm" label-width="80px" size='small'
      :model="userInfo" :rules="userRules" :disabled="!isEditing">
      <el-form-item label="账号名：">
        <el-input v-model="userInfo.UserName" :disabled="isEditing"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="NickName">
        <el-input v-model="userInfo.NickName"></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <el-input v-model="userInfo.GroupName" :disabled="isEditing"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="Email">
        <el-input v-model="userInfo.Email" suffix-icon="el-icon-message"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="Phone">
        <el-input v-model="userInfo.Phone" suffix-icon="el-icon-phone"></el-input>
      </el-form-item>
      <el-form-item label="QQ：" prop="QQ">
        <el-input v-model="userInfo.QQ"></el-input>
      </el-form-item>
      <el-form-item v-if="isEditing" align='center'>
        <el-button round size="small" @click="cancelEditUserInfo">取 消</el-button>
        <el-button type="primary" round size="small" @click="saveUserInfo">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 修改密码弹窗 -->
  <el-dialog class='i-pwd-pop'
    title="修改密码" top="25vh"
    :visible.sync="isShowPwdDialog"
    width="380" center>
    <el-form status-icon :model="pwdForm" :rules="pwdRule" ref="pwdFormEle" size="small" label-width="70px">
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="pwdForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="pwdForm.checkPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 20px;">
        <el-button @click="isShowPwdDialog=false">取 消</el-button>
        <el-button type="primary" @click="savePassword">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: 'UserCenter',
  data () {
    let validateRegexpFn = (dataType, valName, required) => {
      return function(rule, value, callback) {
        if (value === '') {
          !required && callback();
          required && callback(new Error('请输入' + valName));
        } else if (!window.$myCommon.testValid(value, dataType)) {
          callback(new Error('请输入正确的' + valName));
        } else {
          callback();
        }
      };
    };

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.pwdForm.checkPassword !== '') {
          this.$refs.pwdFormEle.validateField('checkPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      userInfoForm: {},
      state: $store.state,
      userInfo: $store.state.userInfo,
      tmpUserInfo: {},
      isEditing: false,

      isShowPwdDialog: false, // 显示修改密码弹窗
      pwdForm: {
        password: '',
        checkPassword: ''
      },
      pwdRule: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },

      userRules: {
        NickName: [
          { required: true, message: '请输入姓名', trigger:'blur' }
        ],
        Email: [
          { validator: validateRegexpFn('email', '邮箱', false), trigger: 'blur' }
        ],
        Phone: [
          { validator: validateRegexpFn('phone', '手机号码', false), trigger: 'blur' }
        ],
        QQ: [
          { validator: validateRegexpFn('qq', 'QQ', false), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    eidtUserInfo() { // 编辑个人信息
      this.isEditing = true;
      this.tmpUserInfo = Object.assign({}, this.userInfo);
    },
    cancelEditUserInfo() { // 取消修改个人信息
      this.isEditing = false;
      this.userInfo = Object.assign({}, this.tmpUserInfo);
      this.clearValidate();
    },
    previewUserInfo() { // 预览个人信息
      this.isEditing = false;
    },
    _saveUserInfo(cb) { // 保存用户信息修改
      this.$refs.userInfoForm.validate((valid) => {
        if(!valid) { return false;}
        let userInfo = this.userInfo;
        let info = {
          nickname: userInfo.NickName,
          group_id: userInfo.GroupId,
          email: userInfo.Email,
          phone: userInfo.Phone,
          qq: userInfo.QQ,
          avatar: userInfo.Avatar,
          status: userInfo.Status,
          id: this.userInfo.Id
        };
        window.$cmsApi.updateUser(info, (res) => {
          cb && cb(res);
          this.isEditing = false;
          this.$refs.userInfoForm.clearValidate();
          this.$message({ message: '保存成功', type: 'success', showClose: true });
        }, (msg) => {
          window.$myCommon.toast(msg || '网络连接错误');
        });
      });
    },
    saveUserInfo() { // 保存个人信息
      this._saveUserInfo();
    },
    clearValidate() {
      this.$refs.userInfoForm.clearValidate();
    },
    _savePassword(cb) { // 打开密码修改面板
      // let pwd = CryptoJS.AES.encrypt(this.pwdForm.password, window.$myConfig.PWD_CRYPTO_SALT).toString();
      let pwd = this.pwdForm.password;
      window.$cmsApi.modifyUserPwd(this.userInfo.Id, pwd, (res) => {
        cb && cb(res);
      }, (msg) => {
        window.$myCommon.toast(msg || '网络连接错误');
      });
    },
    savePassword() { // 保存密码
      this.$refs.pwdFormEle && this.$refs.pwdFormEle.validate((valid) => {
        if (valid) {
          this._savePassword(res => {
            this.$message({ message: '密码修改成功，请重新登录', type: 'success', showClose: true });
            this.isShowPwdDialog = false;
            window.localStorage.setItem('cms_pwd', this.pwdForm.password);
            // 跳转到首页登录
            window.$cmsApi.logout();
            this.$router.push({ name: 'login' });
          });
        } else {
          this.$message({ message: '密码错误', type: 'success', showClose: true });
          return false;
        }
      });
    },
    showPasswordPop() { // 显示修改密码弹窗
      this.$refs.pwdFormEle && this.$refs.pwdFormEle.resetFields();
      this.isShowPwdDialog = true;
    }
  },
  mounted() {
    window.$myCommon.checkLogin((data) => { }, () => {});
  }
}
</script>

<style scoped>
.userinfo .el-form.avatar-form {
  margin: 50px auto 0;
}
.userinfo .el-form {
  width: 330px;
  margin: 0 auto;
}
.userinfo .el-form-item {
  margin-bottom: 20px;
}
.avatar {
  width: 80px;
  height: 80px;
  margin: -20px 0 20px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 1px 25px rgba(0, 0, 0, .1);
}
.avatar img {
  width: 100%;
  height: 100%;
  display: block;
}
.avatar-item {
  margin-bottom: 20px;
}

</style>
