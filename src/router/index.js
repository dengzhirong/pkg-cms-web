import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import AdminApp from "@/components/AdminApp"

import AppList from "@/components/AppList"
import AppMarket from "@/components/AppMarket"

import UserList from "@/components/UserList"
import UserCenter from "@/components/UserCenter"

import Settings from "@/components/Settings"
import ContactUs from "@/components/ContactUs"

Vue.use(Router)

export default new Router({
  routes: [
    { path: "/login", name: "login", component: Login },
    {
      path: "/admin",
      name: "adminApp",
      component: AdminApp,
      children: [
        { path: "app/list", name: "appList", component: AppList },
        { path: "app/add", name: "addApp", component: AppList },
        { path: "app/market", name: "appMarket", component: AppMarket },
        { path: "app/*", redirect: "/admin/app/list" },

        { path: "user/list", name: "userList", component: UserList },
        { path: "user/add", name: "addUser", component: UserList },
        { path: "user/center", name: "center", component: UserCenter },
        { path: "user/*", redirect: "/admin/user/list" },
        { path: "settings", name: "settings", component: Settings },

        { path: "contact", name: "contact", component: ContactUs },

        { path: "/*", redirect: "/admin/app/list" },
      ]
    },
    { path: "/*", redirect: "/login" }
  ]
});
