<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px"  prefix-icon="el-icon-search" placeholder="请输入帖子类别" v-model="insname"></el-input>
      <el-input style="width: 200px"  prefix-icon="el-icon-shopping-bag-1" placeholder="请输入学号" class="ml-5" v-model="insprice"></el-input>
      <el-input style="width: 200px"  prefix-icon="el-icon-position" placeholder="请输入内容" class="ml-5" v-model="address"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button  type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button type="primary" class="el-icon-circle-plus-outline" @click="handleAdd"> 新增</el-button>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='确实'
          cancel-button-text='取消'
          icon="el-icon-info"
          icon-color="red"
          title="您确定批量删除这些数据吗？"
          @confirm="delBatch"
      >
        <el-button type="danger" class="el-icon-remove-outline" slot="reference"> 批量删除</el-button>
      </el-popconfirm>
      <el-upload action="http://localhost:8004/ins/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
      <el-button type="primary" class = "ml-5">导入<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button type="primary" class="ml-5" @click="exp"> 导出<i class="el-icon-top"></i></el-button>
    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"align="center"></el-table-column>
      <el-table-column prop="insname" label="帖子类别"lign="center"></el-table-column>
      <el-table-column prop="insprice" label="学号"align="center"></el-table-column>
      <el-table-column prop="phone" label="电话" align="center"></el-table-column>
      <el-table-column prop="address" label="标题"align="center"></el-table-column>
      <el-table-column prop="url" label="图片"align="center"></el-table-column>
      <el-table-column prop="content" label="详情"align="center">
        <template slot-scope="scope">
          <el-button @click="view(scope.row.content)" type="primary">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240px" align="center">
        <template slot-scope="scope">
          <el-button type="success"@click="handleEdit(scope.row)" class="el-icon-edit"> 编辑</el-button>
          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.id)"
          >
            <el-button type="danger" class="el-icon-remove-outline" slot = "reference"> 删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="帖子信息" :visible.sync="dialogFormVisible" width = "90%" >
      <el-form label-width="80px" size="small">
        <el-form-item label="帖子类别">
          <el-input v-model="form.insname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.insprice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="帖子标题">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="详情">
          <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="viewDialogVis" width="60%" >
      <el-card>
        <div>
          <mavon-editor
              class="md"
              :value="content"
              :subfield="false"
              :defaultOpen="'preview'"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true"
          />
        </div>
      </el-card>
    </el-dialog>
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
        if(res.data){
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