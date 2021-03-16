<template>
  <div id="CustInfo">
    <div id="cust_table">
      <el-table :data="customers"
        border
        style="width: 100%">
        <el-table-column 
          prop="id"
          align="center"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="cardNum"
          label="身份证号"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column 
          prop="identity"
          label="职位"
          align="center"
          width="150"
          v-if="identity==='staff'">
        </el-table-column>
      </el-table>
      
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      customers:[],
      identity:'',
    }
  },
  created(){
    this.getIdentity();
  },
  watch:{
  '$route'(to,from){
    this.identity = to.params.identity
    this.getUserInfo();
    }
  },
  mounted(){
    
  },
  methods:{
    getUserInfo(){
      this.getRequest('/getAllUserInfo?identity=' + this.identity).then(res => {
        if(res.code === 200){
          console.log(res)
          this.customers = res.data;
          console.log(this.customers)
        }
      }).catch(err => {
        this.$message({
          showClose:true,
            message:'未获取到数据',
            type:'error'
        })
      })
    },
    getIdentity(){
      this.identity = this.$route.query.identity;
      console.log(this.identity);
    }

  }
}
</script>

<style lang="less" scoped>
  .el-dialog__body h3{
    margin-bottom: 15px;
  }
  .el-table {
    margin-bottom: 25px;
  }
</style>