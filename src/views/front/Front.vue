<template>
  <div>
    <!-- 头部导航栏 -->
    <div style="display: flex; height: 60px; line-height: 60px; border-bottom: 1px solid #eee">
      <div style="width: 300px; display: flex; padding-left: 30px">
        <div style="width: 60px">
          <img src="../../assets/ucas.png" alt="" style="width: 50px; position: relative; top: 5px; right: 0">
        </div>
        <div style="flex: 1">果壳集市 : UCASmart</div>
      </div>
      <div style="flex: 1; padding-left: 400px">
        <ul style="list-style: none">
          <li class="item" style="color: #3F5EFB"><a href="/front/home">首页</a></li>
          <li class="item" style="color: #3F5EFB"><a href="/front/ins">帖子列表</a></li>
        </ul>
      </div>
      <div style="width: 200px">
        <div v-if="!user.username" style="text-align: right; padding-right:30px">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown style="width: 100px; cursor: pointer">
            <div style="display: inline-block">
              <img :src="user.avatarUrl" referrerpolicy="no-referrer" alt=""
                   style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
              <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
              <el-dropdown-item style="font-size: 14px; padding: 5px 0">
                <router-link to="/front/password" style="text-decoration: none">修改密码</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0;display:block">
                <router-link to="/front/person" style="text-decoration: none">个人信息</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px; padding: 5px 0; display:block">
                <span style="text-decoration: none" @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div style="width: 1200px; margin: 0 auto">
      <router-view @refreshUser="getUser"/>
    </div>


        <!-- 底部版权信息 -->
        <footer>
          <p>版权所有 © 果壳集市 : UCASmart</p>
        </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      name: "",
      price: "",
      address: ""
    };
  },
  created() {
    this.getUser()
  },
  methods: {
    logout() {
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    },
    getUser(){
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username: ""
      if (username){
        //从后台获取User数据
        this.request.get("/user/username/" + username).then(res=>{
          this.user = res.data
        })
      }

    },
    search() {
      // 根据机构名称、价位和机构地址信息过滤机构列表
      let filteredInstitutions = this.institutions;
      if (this.name) {
        filteredInstitutions = filteredInstitutions.filter(institution => {
          return institution.name.toLowerCase().includes(this.name.toLowerCase());
        });
      }
      if (this.price) {
        filteredInstitutions = filteredInstitutions.filter(institution => {
          return institution.price.toLowerCase().includes(this.price.toLowerCase());
        });
      }
      if (this.address) {
        filteredInstitutions = filteredInstitutions.filter(institution => {
          return institution.address.toLowerCase().includes(this.address.toLowerCase());
        });
      }
      // 更新列表
      this.filteredInstitutions = filteredInstitutions;
    }
  },
  computed: {
    filteredInstitutions() {
      return this.institutions;
    }
  }
};
</script>

<style scoped>
.item{
  display: inline-block;
  width:200px;
  text-align: center;
  cursor: pointer;
}
header {
  background-color: #333;
  color: #fff;
  padding: 20px;
}

header h1 {
  margin: 0;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #666;
}

nav ul li {
  display: inline-block;
  margin-right: 20px;
  color: #666;
}

nav ul li:last-child {
  margin-right: 0;
  color: #666;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
  color: #666;
}

section {
  padding: 20px;
}

section form label {
  display: inline-block;
  margin-right: 10px;
}

section form input[type="text"] {
  width: 200px;
  padding: 5px;
  margin-right: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

section form button[type="submit"] {
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

section ul {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #666;
}

section ul li {
  margin-bottom: 20px;
  color: #666;
}

section ul li a {
  font-weight: bold;
  color: #333;
  color: #666;
}

section ul li p {
  margin: 0;
  color: #666;
}

footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 10px;
}
</style>
