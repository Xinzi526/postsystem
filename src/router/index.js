import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Manage',
    component: () => import(/* webpackChunkName: "about" */ '../views/Manage.vue'),
    redirect: "/home",
    children: [
      {path: 'home', name: '首页', component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')},
      {path: 'user', name: '用户管理', component: () => import(/* webpackChunkName: "about" */ '../views/User.vue')},
      {path: 'role', name: '角色管理', component: () => import(/* webpackChunkName: "about" */ '../views/Role.vue')},
      {path: 'institution', name: '帖子管理', component: () => import(/* webpackChunkName: "about" */ '../views/Institution.vue')},
      {path: 'menu', name: '菜单管理', component: () => import(/* webpackChunkName: "about" */ '../views/Menu.vue')},
      {path: 'person', name: '个人信息', component: () => import(/* webpackChunkName: "about" */ '../views/Person.vue')},
      {path: 'file', name: '文件管理', component: () => import(/* webpackChunkName: "about" */ '../views/File.vue')},
      {path: 'password', name: '修改密码', component: () => import(/* webpackChunkName: "about" */ '../views/Password.vue')}
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import(/* webpackChunkName: "about" */ '../views/front/Front'),
    children: [
      {path: 'home', name: '前端主页', component: () => import(/* webpackChunkName: "about" */ '../views/front/Home')},
      {path: 'person', name: '前端个人信息', component: () => import(/* webpackChunkName: "about" */ '../views/front/Person')},
      {path: 'ins', name: '前端帖子信息', component: () => import(/* webpackChunkName: "about" */ '../views/front/Ins')},
      {path: 'insDetail', name: '前端帖子详情', component: () => import(/* webpackChunkName: "about" */ '../views/front/InsDetail')},
      {path: 'password', name: 'FrontPassword', component: () => import(/* webpackChunkName: "about" */ '../views/front/Password')},
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称，为了在Header组件中去使用
  store.commit("setPath")  // 触发store的数据更新
  next()  // 放行路由
})

export default router
