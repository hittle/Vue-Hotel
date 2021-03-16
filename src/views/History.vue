<template>
  <div class="histoty">
    <div class="history-search">
      <el-form :inline="true" :model="searchForm" :rules="searchRules" ref="nSearchForm">
          <el-form-item label="姓名" prop="name">
            <el-input 
              placeholder="请输入姓名" 
              v-model="searchForm.name"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="入住日期" prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" 
              v-model="searchForm.date"
            >
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="search('nSearchForm')">搜索</el-button>
          <el-button type="primary" @click="getHistory">刷新</el-button>
      </el-form>
    </div>
    <div class="history-table">
      <el-table 
      :data="showData" 
      style="width:100%"
      border>
        <el-table-column 
          type="index"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          label="房号"
          prop="roomNo"
          align="center"
        >
        </el-table-column>

        <el-table-column 
          label="类型"
          prop="roomType"
          align="center"
        >
        </el-table-column>

        <el-table-column 
          label="总费用"
          prop="totalMoney"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          label="开房时间"
          prop="liveDateView"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          label="退房时间"
          prop="leaveDateView"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          label="姓名"
          prop="name"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          label="性别"
          prop="sex"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          label="证件号"
          prop="cardNum"
          align="center"
        >
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="jump"
          :current-page.sync="currentPage"
          :page-size="15"
          layout="prev, pager, next, jumper"
          :total="historyData">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      historyData:[],    //所有的数据
      searchForm:{
        name:'lzl',
        date:'2021-2-24'
      },
      searchRules:{
        name:[
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        date:[
          { required: true, message: '请选择日期', trigger: 'blur' },
        ]
      },
      pickerOptions: {
               disabledDate: time => {
                   return (
                       time > new Date()
                   )
               }
           },
      currentPage:1,  //当前页码
      pageSize:15,    //每页显示的数据数量
      showData:[]     //显示出来的数据集合
    }
  },
  mounted(){
    this.getHistory();
    this.getHistoryLength();
    this.getCurrentDate();
  },
  methods:{
    
    getHistory(){
      let params = new URLSearchParams();
      params.append("index",this.currentPage);
      params.append("pageNum",this.pageSize);
      this.postRequest('/getHistory',params).then(res=>{
        console.log(res)
        // this.historyData=res.data;
        
        this.showData=res.data;
        // this.historyData.slice(0,this.pageSize)
        // console.log(this.historyData.slice(0,10))
      })
    },
    getHistoryLength(){
      this.getRequest('/getHistoryLength',{withCredentials : true}).then(res=>{
        // console.log(res)
        this.historyData=res.data;
        // this.showData=this.historyData.slice(0,this.pageSize)
        // console.log(this.historyData.slice(0,10))
      })
    },
    search(form){   //搜索记录
      this.$refs[form].validate((valid)=>{   //表单验证
        if(valid){
          let params = new URLSearchParams();
          params.append('name',this.searchForm.name);
          params.append('date',this.searchForm.date);
          // console.log(this.searchForm.date);
          this.postRequest('/searchHistory',params).then(res=>{  
            // console.log(res)
            if(res.code===200){
              this.historyData=res.data.length;
              this.showData=res.data.slice(0,this.pageSize)
              this.$message({
                showClose:true,
                message:'搜索数据成功',
                type:'success'
              })
            }else{
              this.$message({
                showClose:true,
                message:'搜索数据失败',
                type:'error'
              })
            }
          })
        }else{
          this.$message({
            showClose:true,
            message:'请正确填写搜索表单',
            type:'error'
          })
        }
      })
    },
    jump(){
      // console.log(this.currentPage);
      this.getHistory();
      // this.showData=this.historyData.slice(this.pageSize*(this.currentPage-1),this.pageSize*(this.currentPage-1)+15)
    },
    getCurrentDate(){
    
      let nDate = new Date();
      let y = nDate.getFullYear();
      let m = nDate.getMonth()+1;
      let d = nDate.getDate();
      this.searchForm.date = y+"-"+m+"-"+d;
    }
  }
}
</script>

<style lang="less" scoped>
  .block {
    margin-top: 15px;
  }
</style>
