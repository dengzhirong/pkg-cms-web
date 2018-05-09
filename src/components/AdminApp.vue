<template>
  <el-container class="main-container">
    <!-- 侧导航 -->
    <el-aside class='main-aside' :width="asideWidth + 'px'">
      <el-menu class="aside-menus"
      default-active="1-1"
      :default-openeds="['1','2','3','4','5','6']" :unique-opened="false"
      :collapse="isCollapse" :collapse-transition='false' :disabled='true'
      background-color="#10394c" text-color="#fff" active-text-color="#ffd04b">
        <router-link :to="{name: 'center'}" class='clearfix avatar-wrap' tag='div'>
          <div class="avatar fl">
            <img src="/static/images/avatar.jpg" alt="头像" v-if="!state.userInfo.Avatar">
            <img :src="state.userInfo.Avatar" alt="头像" v-if="state.userInfo.Avatar">
          </div>
          <span  class='nickname fl'>{{state.userInfo.NickName || state.userInfo.UserName || '用户'}}</span>
        </router-link>
        <el-submenu index="1" :hide-timeout='0' :show-timeout='0'>
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span slot="title">App管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1"><router-link :to="{name: 'appList'}">App列表</router-link></el-menu-item>
            <el-menu-item index="1-2" v-if="state.isManager || state.isDevelop"><router-link :to="{name: 'addApp'}">添加App</router-link></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2" :hide-timeout='0' :show-timeout='0' v-if="state.isManager">
          <template slot="title">
            <i class="el-icon-star-off"></i>
            <span slot="title">用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1"><router-link :to="{name: 'userList'}">用户列表</router-link></el-menu-item>
            <el-menu-item index="2-2"><router-link :to="{name: 'addUser'}">添加用户</router-link></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- <router-link :to="{name: 'groupList'}" tag='div'><el-menu-item index="3">
          <i class="el-icon-menu"></i>
          <span slot="title">角色管理</span>
        </el-menu-item></router-link> -->
        <router-link :to="{name: 'center'}" tag='div'><el-menu-item index="4">
          <i class="el-icon-view"></i>
          <span slot="title">个人信息</span>
        </el-menu-item></router-link>
        <router-link :to="{name: 'appMarket'}" tag='div' v-if="state.showMarket"><el-menu-item index="5">
          <i class="el-icon-goods"></i>
          <span slot="title">App市场</span>
        </el-menu-item></router-link>
        <router-link :to="{name: 'settings'}" tag='div'><el-menu-item index="6"
          v-if="state.isManager">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item></router-link>
        <router-link :to="{name: 'contact'}" tag='div' v-if="state.showContact"><el-menu-item index="7">
          <i class="el-icon-phone-outline"></i>
          <span slot="title">联系我们</span>
        </el-menu-item></router-link>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="main-header" height='30'>
        <div class="btn-toggle-aside el-icon-d-arrow-left"
        @click="toggleAsideCollapse" :class="{'is-collapse': isCollapse}"></div>
        <div class="cms-title fl">App管理系统</div>
        <el-button class='fr' size="mini" round @click="logout">退出</el-button>
      </el-header>
      <el-main class='cms-main-body'>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Cat2',
  data () {
    return {
      state: $store.state,
      isCollapse: false,
      asideWidth: 220, // 侧导航展开宽度
    }
  },
  watch: {
    isCollapse(newVal, oldVal) {
      this.asideWidth = !newVal ? 220 : 64;
    }
  },
  methods: {
    toggleAsideCollapse() { // 切换侧导航的显隐
      this.isCollapse = !this.isCollapse;
    },
    logout() { // 退出登录
      window.$cmsApi.logout(() => {

        this.$router.push({ name: 'login' });
      }, () => {
        window.$myCommon.toast('退出失败');
      });
    },
    getAllDevUserList() {
      window.$cmsApi.getAllDevUserList((res) => {
        let allUsers = res.data || [];
        let GroupMaps = window.$store.state.GroupMaps;
        let devUserList = _.filter(allUsers, {GroupId: GroupMaps.develop.id}) || [];
        let custUserList = _.filter(allUsers, {GroupId: GroupMaps.custom.id}) || [];
        let adminUserList = _.filter(allUsers, {GroupId: GroupMaps.manager.id}) || [];
        window.$store.state.devUserList = _.concat(devUserList, adminUserList);
        window.$store.state.custUserList = _.concat(custUserList, adminUserList);
        window.$store.state.allUserList = allUsers;
      }, () => {
      });
    },
  },
  mounted() {
    // 先判断是否登录
    window.$myCommon.checkLogin((data) => {
      var state = window.$store.state;
      this.getAllDevUserList();
      this.$router.push({name: 'appList'});
    }, () => {}, true);
  }
}
</script>

<style scoped>
.main-container {
  height: 100%;
}
.main-header {
  font-size: 23px;
  background: #058dcc;
  color: #fff;
  padding: 15px 20px 14px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, .3);
}
.main-aside {
    background: #10394c;
    color: #fff;
    text-align: left;
    transition: width .3s ease;
}
.el-menu--collapse {
  width: 64px;
}
.aside-menus {
  border: none;
}
.avatar-wrap {
  width: 200px;
  line-height: 40px;
  padding: 16px 10px;
  border-bottom: 1px solid #144f6a;
  overflow: hidden;
  cursor: pointer;
}
.el-menu--collapse .avatar-wrap .nickname {
  display: none;
}
.avatar-wrap .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.avatar-wrap .avatar img {
  display: block;
  width: 100%;
  height: 100%;
}
.avatar-wrap .nickname {
  margin-left: 15px;
}
.btn-toggle-aside {
  width: 46px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  position: absolute;
  color: #8acae8;
  top: 0;
  font-size: 16px;
  cursor: pointer;
}
.btn-toggle-aside:hover {
  background: #127aab;
}
.btn-toggle-aside.is-collapse {
  transform: rotateZ(180deg);
}
.cms-title {
  margin-left: 55px;
}

.cms-main-body {
  padding: 15px 15px;
}
</style>
