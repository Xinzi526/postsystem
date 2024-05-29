<template>
  <div style="color: #666; margin-top: 20px">
    <div style="margin: 10px 0">
      <el-input style="width: 300px; margin-left: 80px"  size="small" prefix-icon="el-icon-search" placeholder="请输入帖子类别" v-model="insname"></el-input>
      <el-input style="width: 300px"  size="small" prefix-icon="el-icon-shopping-bag-1" placeholder="请输入学号" class="ml-5" v-model="insprice"></el-input>
      <el-input style="width: 300px"  size="small" prefix-icon="el-icon-position" placeholder="请输入帖子内容" class="ml-5" v-model="address"></el-input>
      <el-button class="ml-5" type="primary" @click="load"size="small">搜索</el-button>
      <el-button  type="warning" @click="reset" size="small">重置</el-button>
    </div>

    <div style="margin: 20px 0">
      <div style="padding: 10px 0" v-for="item in tableData" :key="item.id">
        <div @click="$router.push('/front/insDetail?id=' + item.id)">
          <el-row>
            <img :src="item.url" alt="" style="height: 100px;margin-left: 50px;width: 150px; float: left" >
            <div style="font-size: 20px; margin-left: 50px; color: #3F5EFB; cursor: pointer; float: left">{{ item.insname }}</div>
            <div style="font-size: 14px; color: #219ECB;font-weight: 600;margin-top: 40px">
              <i style="margin-left: 50px" class="el-icon-shopping-bag-1"></i> <span>￥{{ item.insprice }}</span>
            </div>
            <div>
              <i style="margin-left: 50px" class="el-icon-position" ></i> <span>{{ item.address }}</span>
            </div>
            <div>
              <i style="margin-left: 50px;" class="el-icon-phone" ></i> <span>{{ item.phone }}</span>
            </div>
          </el-row>

        </div>
        <div style=" border-bottom: 1px dashed #ccc; margin-top: 20px"></div>
      </div>
    </div>

    <div style="padding: 10px 0; margin: 0px auto;text-align: center">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Ins",
  data(){
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      insname: "",
      insprice: "",
      address: "",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      headerBg: 'headerBg',
      content: '',
      viewDialogVis: false,
    }
  },
  created() {
    this.load()
  },
  methods: {
    view(content) {
      this.content = content
      this.viewDialogVis = true
    },
    // 绑定@imgAdd event
    imgAdd(pos, $file) {
      let $vm = this.$refs.md
      // 第一步.将图片上传到服务器.
      const formData = new FormData();
      formData.append('file', $file);
      axios({
        url: 'http://localhost:8004/file/upload',
        method: 'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      }).then((res) => {
        // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
        $vm.$img2Url(pos, res.data);
      })
    },
    load(){
      this.request.get("/ins/page",{
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          insname: this.insname,
          insprice: this.insprice,
          address: this.address,
        }
      }).then(res =>{
        console.log(res)

        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save(){
      this.request.post("/ins",this.form).then(res =>{
        if(res.code === '200'){
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.load()
        }else{
          this.$message.error("保存失败")
        }
      })
    },
    cancel(){
      this.dialogFormVisible = false
      this.load()
    },
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {}
    },
    handleEdit(row){
      this.form = row
      this.dialogFormVisible = true
    },
    del(id) {
      this.request.delete("/ins/" + id).then(res =>{
        if(res.data){
          this.$message.success("删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })
    },

    handleSelectionChange(val){
      console.log(val)
      this.multipleSelection = val

    },
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("/ins/del/batch",ids).then(res =>{
        if(res.data){
          this.$message.success("批量删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })
    },
    reset() {
      this.insname = ""
      this.insprice = ""
      this.address = ""
      this.load()
    },
    handleSizeChange(pageSize){
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    },
    exp(){
      window.open("http://localhost:8004/ins/export")
    },
    handleExcelImportSuccess() {
      this.$message.success("导入成功")
      this.load()
    }
  }
}
</script>

<style>
.headerBg {
  background: #eeeeee !important;
}

</style>