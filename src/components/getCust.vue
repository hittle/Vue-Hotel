<template>
  <div id="customer">
  <el-button @click="getCustomer" type="primary">点我</el-button>
  <h2>{{message}}</h2>
  </div>
</template>
<script>
export default {
  name:'customer',
  data(){
    return{
      message:['666']
    }
  },
  methods:{
    getCustomer(){
      let that = this
      this.getRequest('/getCust').then(res => {
        console.log(res);
        this.message.push(res[0])
         console.log(this.message);
      })
      }
    }
  }
</script>
<style scoped>

</style>