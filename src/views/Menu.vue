<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px"  prefix-icon="el-icon-search" placeholder="请输入帖子类别" v-model="name"></el-input>
<!--      <el-input style="width: 200px"  prefix-icon="el-icon-message" placeholder="请输入邮箱" class="ml-5" v-model="email"></el-input>-->
<!--      <el-input style="width: 200px"  prefix-icon="el-icon-position" placeholder="请输入地址" class="ml-5" v-model="address"></el-input>-->
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
<!--      <el-upload action="http://localhost:8004/role/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">-->
<!--      <el-button type="primary" class = "ml-5">导入<i class="el-icon-bottom"></i></el-button>-->
<!--      </el-upload>-->
<!--      <el-button type="primary" class="ml-5" @click="exp"> 导出<i class="el-icon-top"></i></el-button>-->
    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
              row-key="id" default-expand-all @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"align="center"></el-table-column>
      <el-table-column prop="name" label="名称"align="center"></el-table-column>
      <el-table-column prop="path" label="路径"align="center"></el-table-column>
      <el-table-column prop="icon" label="图标"align="center">
        <template slot-scope="scope">
          <i style="font-size: 18px" :class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"align="center"></el-table-column>
      <el-table-column label="操作"width="300px"align="center">
        <template slot-scope="scope">
          <el-button type="primary"@click="addChildren(scope.row.id)" v-if="!scope.row.pid && !scope.row.path" class="el-icon-plus"> 新增子菜单</el-button>
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

    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width = "30%" >
      <el-form label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-select clearable v-model="form.icon" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
              <i :class="item.value" /> {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data(){
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: "",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      headerBg: 'headerBg',
      options: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      this.request.get("/menu",{
        params:{
          name: this.name,
        }
      }).then(res =>{
        console.log(res)

        this.tableData = res.data
      })
    },
    save(){
      this.request.post("/menu",this.form).then(res =>{
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
    addChildren(pid){
      this.dialogFormVisible = true
      this.form = {}
      if (pid){
        this.form.pid = pid
      }
    },
    handleEdit(row){
      this.form = row
      this.dialogFormVisible = true
      //请求图标数据
      this.request.get("/menu/icons").then(res =>{
        this.options = res.data
      })
    },
    del(id) {
      this.request.delete("/menu/" + id).then(res =>{
        if(res.code === '200'){
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
      this.request.post("/menu/del/batch",ids).then(res =>{
        if(res.code === '200'){
          this.$message.success("批量删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })
    },
    reset() {
      this.name = ""
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
      window.open("http://localhost:8004/menu/export")
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