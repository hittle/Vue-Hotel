<template>
  <div id="CustInfo">
    <div id="cust_table">
      <el-table :data="customers"
        border
        style="width: 100%">
        <el-table-column 
          :prop="id"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="100">
        </el-table-column>
        <el-table-columnsex
          prop="sex"
          label="性别"
          align="center"
          width="100">
        </el-table-column>
        <el-table-columnsex
          prop="cardNum"
          label="身份证号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="100">
        </el-table-column>T
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
  mounted(){
    this.getIdentity();
  },
  methods:{
    getUserInfo(){
      this.getRequest('/getAllUserInfo?identity='+'gg').then(res => {

      })
    },
    getIdentity(){
      this.identity = this.$route.query.identity;
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