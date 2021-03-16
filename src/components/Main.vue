<template>
  <div class="main-content">
    <topData />
    <el-row :gutter="20">
      <Log />
      <SevenDays />
    </el-row>
    <el-row :gutter="20">
      <HomeSurplus />
      <newOrder :newOrder="newOrder" />
    </el-row>
  </div>
</template>

<script>
import topData from './HomeData'
import Log from './HomeLog'
import HomeSurplus from './HomeSurplus'
import SevenDays from './SevenDays'
import newOrder from './HomeNewOrder'
export default {
  data(){
    return {
      newOrder:[]
    }
  },
  components:{
    topData,
    Log,
    SevenDays,
    HomeSurplus,
    newOrder
  },
  mounted() {
    this.getRequest('/getHomeData').then(res=>{
      if(res.code===200){
        this.newOrder=res.data.newOrder;
      }
    })
  }
}
</script>


<style lang="less" scoped>
  .main-content {
    width: 100%;
    height: 100%;
    // background: #fff;
  }
  .el-row {
    margin-bottom: 15px;
  }
</style>
