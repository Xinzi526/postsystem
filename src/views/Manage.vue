<template>

</template>

<script>
import Header from "@/components/Header";
export default {
  name: "login",
  components: {Header}
}
</script>

<style scoped>

</style>
<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="submitForm">
      <h2 class="title">果壳集市 : UCASmart</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input id="username" type="text" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" type="password" v-model="password" required>
      </div>
      <button type="submit" class="btn">登录</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submitForm() {
      // 在此处添加提交登录表单的代码
      console.log('登录成功');
      // 登录成功后的操作
    }
  }
}
</script>

<style>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-form {
  width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
}

.btn {
  display: block;
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0070ff;
}
</style>

<template>
  <el-container style="min-height: 100vh">
    <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246); box-shadow: 2px 0 6px rgb(0 21 41 /35%)">
      <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" :menus="user.menus"/>
    </el-aside>

    <el-container>

      <el-header style="border-bottom: 1px solid #ccc;">
        <Header :collapseBtnClass="collapseBtnClass" :collapse="isCollapse" :user="user"/>
      </el-header>

      <el-main>
<!--        表示当前页面的子路由会在这里展示-->
        <router-view @refreshUser="getUser"/>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Aside from "@/components/Aside";
import Header from "@/components/Header";
export default {
  name: 'HomeView',
  data() {
    return {
      collapseBtnClass:'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      user: {}
    }
  },
  components: {
    Aside,
    Header,
  },
  created() {
    this.getUser()
  },
  methods: {
    collapse() { //点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {  // 收缩
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {   // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },
    getUser(){
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username: ""
      //从后台获取User数据
      this.request.get("/user/username/" + username).then(res=>{
        this.user = res.data
      })
    }
  }
}
</script>
<style>
.headerBg {
  background: #eeeeee !important;
}
</style>