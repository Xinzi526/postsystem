<template>
  <div>
    <div style="margin: 10px 0">
      <el-carousel :interval="4000" type="card" height="350px">
        <el-carousel-item v-for="item in imgs" :key="item">
          <img :src="item" alt="" style="width: 100%; " >
        </el-carousel-item>
      </el-carousel>
    </div>
        <!-- 搜索框 -->
        <section style="padding-bottom: 10px">
          <form @submit.prevent="search">
            <div style="margin: 10px 0" >
              <el-input style="width: 300px; margin-left: 50px" size="small" prefix-icon="el-icon-search" placeholder="请输入帖子类别" v-model="insname"></el-input>
              <el-input style="width: 300px; margin-left: 10px" size="small" prefix-icon="el-icon-shopping-bag-1" placeholder="请输入学号" v-model="insprice"></el-input>
              <el-input style="width: 300px; margin-left: 10px" size="small" prefix-icon="el-icon-position" placeholder="请输入帖子内容" v-model="address"></el-input>
              <el-button style="margin-left: 10px" type="primary" @click="load"size="small">搜索</el-button>
              <el-button style="margin-left: 10px" type="warning" @click="reset"size="small">重置</el-button>
            </div>
          </form>
        </section>
    <div style="margin: 10px 0">
      <el-row :gutter="10">
        <el-col :span="8" v-for="item in inss" :key="item.id" style="margin-bottom: 10px">
          <div class="el-card" >
            <img :src="item.url" alt="" style="height: 250px; width: 100%" @click="$router.push('/front/insDetail?id=' + item.id)">
            <div class="recd-content">
              <h2 class="recd-c-title-p" style="margin:10px">{{ item.insname }}</h2>
              <div class="recd-c-price">
                <div class="recd-cp-left" style="margin:10px">{{ item.address }}</div>
                <div class="recd-cp-right">￥{{ item.insprice }}元</div>
                <div class="clear"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "FrontHome",
  props: {
    user: Object
  },
  data() {
    return {
      imgs: [
        'https://njc.ucas.ac.cn/__local/A/47/99/D209D45727816DF1EB5A112DB62_C8CFA403_1574A.jpg',
        'https://njc.ucas.ac.cn/__local/1/4B/F6/885B97A80BFE01B3A07A4A5BF0F_2536E609_2525D.jpg',
        'https://njc.ucas.ac.cn/__local/B/4A/92/30826EB971BAE56ECF00253FFCC_101D360B_2316E.jpg'
      ],
      inss: [],
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      insname: "",
      insprice: "",
      address: "",
    }
  },
  created() {
    this.request.get("/ins/front/all").then(res =>{
      // console.log(res.data)
      this.inss = res.data
      // console.log(this.inss)
    })
  },
  methods: {
    reset() {
      this.insname = ""
      this.insprice = ""
      this.address = ""
      this.load()
    },
    load(){
      // 根据机构名称、价位和机构地址信息过滤机构列表
      this.request.get("/ins/front/all").then(res =>{
        console.log(this.insprice)
        this.inss = res.data
        // this.inss = res.data.filter(v => (v.insname.match(this.insname) || v.insname.match("")) && (v.insprice == this.insprice || v.insprice.match("")) && (v.address.match(this.address)|| v.address.match("")))
        if(this.insname != "") {
          this.inss = res.data.filter(v => v.insname.match(this.insname))
        }
        if(this.insprice != "") {
          this.inss = this.inss.filter(v => v.insprice == this.insprice)
        }
        if(this.address != "") {
          this.inss = this.inss.filter(v => v.address.match(this.address))
        }
        console.log(this.inss)
      })
    },
  }
}
</script>

<style>
.recd-c-title-p {
  font-size: 20px;
  font-weight: 600;
  color: #1D1D1D;
  margin-top:4px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.recd-c-price {
  width:100%;
  height:30px;
  margin-top:3px;
  display: table-cell;
  vertical-align: bottom;
}
.recd-cp-left {
  width:144px;
  float:left;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: 400;
  color: #5B5B5B;
}

.recd-cp-right {
  width:200px;
  float:right;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 18px;
  font-weight: 600;
  color: #219ECB;
  text-align:right;
}
.el-row {
  margin-bottom: 20px;
  display:flex;
  flex-wrap: wrap;
}
.el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}
</style>