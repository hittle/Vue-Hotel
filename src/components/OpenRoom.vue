<template>
  <div>
    <div class="room-table">
      <h2>已开出</h2>
      <el-date-picker 
      v-model="todayDate" 
      type="date" 
      placeholder="选择日期"    
      value-format="yyyy-MM-dd "
      :picker-options="pickerOptionsTod" 
      @change="dateSelect($event,0)">
      </el-date-picker>
      <el-date-picker 
      v-model="otherDate" 
      type="date" 
      placeholder="选择日期"    
      value-format="yyyy-MM-dd "
      :picker-options="pickerOptionsTom" 
      @change="dateSelect($event,1)">
      </el-date-picker>
      <el-table
        :data="openRoom"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          type="index"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="roomNo"
          label="房间号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="roomType"
          label="类型"
          align="center"
          width="100">
        </el-table-column>
        
        <el-table-column  
          label="状态"
          align="center"
          width="100">
          <template scope="scope">
              {{ scope.row.roomState===0 ? '未开出' : '已开出' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="cardNum"
          label="证件号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roomPrice"
          label="价格"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="totalmoney"
          label="应收"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderMemo"
          label="押金"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="liveDateView"
          label="开房时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="orderTermView"
          label="到期时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column  
          label="操作"
          align="center"
          width="300">
          <template slot-scope="scope">
            <!-- <el-button size="mini" v-if="scope.row.roomState===0">开房</el-button> -->
            <el-button size="mini" @click="cancelRoom(scope.row)">取消</el-button>
            <el-button size="mini" @click="checkOut(scope.row)">退房</el-button>
            <el-button size="mini" @click="changeRoom(scope.row)">换房</el-button>
            <el-button size="mini" @click="continueRoom(scope.row)">加时</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="换房" :visible.sync="dialogFormVisible">
      <el-form :model="form" >
        <el-form-item :label="'从'+roomNo+'换到'" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择换房房号">
            <el-option v-for="(item,index) in simpleRoomNo" :key="index" :label="item" :value="item" v-if="item != roomNo"></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendChangeRoom">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="checkOutTable" title="退房" :visible.sync="checkOutVisible">
      <h3>房间信息</h3>
      <el-table
        :data="checkOutInfo"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          type="index"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="roomNo"
          label="房间号"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="roomType"
          label="类型"
          align="center"
          width="100">
        </el-table-column>
        
        <el-table-column  
          label="状态"
          align="center"
          width="100">
          <template scope="scope">
              {{ scope.row.roomState===0 ? '未开出' : '已开出' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="cardNum"
          label="证件号"
          align="center"
          width="180"
          >
        </el-table-column>
        <el-table-column
          prop="roomPrice"
          label="价格"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="totalmoney"
          label="应收"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orderMemo"
          label="押金"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="liveDateView"
          label="开房时间"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="orderTermView"
          label="到期时间"
          align="center"
          width="180">
        </el-table-column>
      </el-table>
      <el-form :model="checkOutForm" label-position="right" label-width="120px" :inline="true">
        <el-form-item label="收取押金">
          <el-input v-model="checkOutForm.SecurityDeposit" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="应退押金">
          <el-input v-model.number="checkOutForm.returnDeposit" @input="depositChange"></el-input>
        </el-form-item>
        <el-form-item label="应收房费">
          <el-input v-model="checkOutForm.SecurityMoney" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="总收费用">
          <el-input v-model="checkOutForm.AllMoney"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkOutVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendCheckOutRoom">确 定</el-button>
      </div>
    </el-dialog>
      
    <el-dialog title="续期" :visible.sync="continueVisible">
    <el-form :model="roomChange" label-position="right" label-width="120px" :inline="true">
      <el-form-item label="开始时间">
        <el-date-picker 
      v-model="todayDate" 
      type="date" 
      placeholder="选择日期"    
      value-format="yyyy-MM-dd "
      :picker-options="pickerOptionsTod" 
      @change="dateSelect($event,0)">
      </el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间" >
        <el-date-picker 
      v-model="otherDate" 
      type="date" 
      placeholder="选择日期"    
      value-format="yyyy-MM-dd "
      :picker-options="pickerOptionsTom" 
      @change="dateSelect($event,1)">
      </el-date-picker>
      </el-form-item>
       <el-form-item label="加钱">
          <el-input v-model.number="needAddMoney" ></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="continueVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendContinueRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import bus from '../assets/bus.js'
export default {
  data(){
    return {
      dialogFormVisible: false,   //换房时的弹框
      form: {     //换房时的表单
        region: '',
      },
      formLabelWidth: '120px', 
      roomNo:'',   //旧房间的房间号
      orderId:'',   //开房记录的id
      formLabelText:'',      
      room:[],  //所有未开房间，
      openRoom:[],//已开的房间
      simpleRoomNo:[],//同段时间未开的房间编号
      needAddMoney:'',
      continueVisible:false,
      roomChange:{
        roomNo:'',
        roomType:'',
        orderId:'',
        liveDate:'',
        leaveDate:'',
        days:'',
        totalmoney:'',
        orderMemo:'',
        roomPrice:'',
        orderTerm:''
        
      },
      checkOutVisible:false,
      checkOutForm:{
        SecurityDeposit:'',
        returnDeposit:'',
        SecurityMoney:'',
        AllMoney:''
      },
      checkOutInfo:[],
      todayDate:'',
      otherDate:'',
      pickerOptionsTod:{
               disabledDate: time => {
                   return (
                       time.getTime() < new Date().getTime() - 24*3600*1000 || time.getTime() >= Date.parse(new Date())+1000*3600*24*6
                   )
               }
           },
      pickerOptionsTom:{
          disabledDate: time => {
              return (
                  time.getTime() <= Date.parse(this.todayDate) || time.getTime() >= Date.parse(new Date())+1000*3600*24*7
              )
          }
      },
    }
  },
  mounted(){
    this.dateSelect();
    this.getNotOpenRoomNumer();
    this.getOpenRoom();
    this.getEventDate();
  },
  methods:{
    emitToB(){
      bus.$emit('updateInfoA','更新组件');
    },
    getEventDate(){
      const that = this;
      bus.$on('updateInfoB',function(val){
        that.getOpenRoom();
        this.getNotOpenRoomNumer();
      });
    },
    getNotOpenRoomNumer(){   //获取所有的房间，用来显示房间号
      // console.log(this.todayDate + "ggggggggggg");
      let parms =new URLSearchParams();
      parms.append("thisDate",Date.parse(this.todayDate));
      parms.append("thatDate",Date.parse(this.otherDate));
      this.postRequest('/getNotOpen',parms).then(res=>{
        this.room=res.data.notOpen;
        
      })
    },
    getOpenRoom(){
      let parms =new URLSearchParams();
      parms.append("thisDate",Date.parse(this.todayDate));
      parms.append("thatDate",Date.parse(this.otherDate));
      this.postRequest('/getOpen',parms).then(res=>{
        if(res.code === 200){
          this.openRoom=res.data.open;
          // console.log(this.openRoom)
        }
        // console.log(res.data.open);
      })
    },
    checkOut(room){   //简单的退房操作
      // console.log(roomid)

      this.checkOutVisible=true;
      this.checkOutInfo=[];
      this.checkOutInfo.push(room);

      this.checkOutForm.SecurityDeposit=room.orderMemo;
      this.checkOutForm.returnDeposit=room.orderMemo;
      this.checkOutForm.SecurityMoney=room.totalmoney;
      this.checkOutForm.AllMoney=(Number(room.totalmoney)+Number(room.orderMemo))-Number(this.checkOutForm.returnDeposit);  //总收金额=应收房费+收取的押金-应退押金
    },
    depositChange(){   //当应退押金改变时，总收金额也会跟着改变
      this.checkOutForm.AllMoney=(Number(this.checkOutForm.SecurityMoney)+Number(this.checkOutForm.SecurityDeposit))-Number(this.checkOutForm.returnDeposit);
    },
    sendCheckOutRoom(){
      // console.log(this.checkOutInfo)
      let params=new URLSearchParams();
      params.append('orderId',this.checkOutInfo[0].id);
      params.append('roomNo',this.checkOutInfo[0].roomNo);
      // params.append('income',this.checkOutForm.AllMoney);
      this.postRequest('/checkOut',params).then(res=>{
        if(res.code===200){
          this.$message({
            showClose:true,
            message:res.msg,
            type:'success'
          })
          this.getNotOpenRoomNumer();
          this.getOpenRoom();
          this.emitToB();
          this.checkOutVisible=false;
        }else{
          this.$message({
            showClose:true,
            message:res.msg,
            type:'error'
          })
        }
      })
    },
    changeRoom(room1){   //弹框表单
      let params = new URLSearchParams();
      params.append("roomType",room1.roomType);
      params.append("orderTerm",room1.orderTerm);
      this.postRequest('/getSimpleRoom',params).then((res) =>{
        if(res.code === 200)
          this.simpleRoomNo = res.data;
          
      })
      this.roomNo = room1.roomNo;
      this.orderId = room1.id;
      this.dialogFormVisible=true;
    },
    sendChangeRoom(){    //换房操作
      this.dialogFormVisible=false;
      let params=new URLSearchParams();
      params.append('newRoomNo',this.form.region);   //根据即将要换的房间id、当前开房记录id、及旧房间id
      params.append('oldRoomNo',this.roomNo);
      params.append('orderId',this.orderId);
      this.postRequest('/changeRoom',params).then(res=>{
        // console.log(res)
        if(res.code===200){
          this.$message({
            showClose:true,
            message:'换房成功',
            type:'success'
          })
          this.getRoomNumer();
          this.dialogFormVisible=false;
          this.form.region='';
          this.getNotOpenRoomNumer();
          this.getOpenRoom();
          this.emitToB();
        }else{
          this.$message({
            showClose:true,
            message:'换房失败',
            type:'error'
          })
        }
      })
    },
    cancelRoom(room){
      this.orderId = room.id;
       let params = new URLSearchParams();
      params.append("orderId",this.orderId);
      this.postRequest('/cancelRoom',params).then(res => {
        if(res.code === 200){
          this.$message({
            showClose:true,
            message:res.msg,
            type:'success'
          })
        }
      }).catch(err => {
        this.$message({
            showClose:true,
            message:'网络错误',
            type:'error'
          })
      })
    },
    continueRoom(room){
      this.continueVisible = true;
      this.roomChange.roomNo=room.roomNo;
      this.roomChange.orderId=room.id;
      this.roomChange.roomType = room.roomType;
      this.roomChange.liveDate = room.liveDate;
      this.roomChange.leaveDate = room.leaveDate;
      this.roomChange.days = room.days;
      this.roomChange.orderTerm = room.orderTerm;
      this.roomChange.totalmoney = room.totalmoney;
      this.roomChange.orderMemo = room.orderMemo;
      this.roomChange.roomPrice = room.roomPrice;
    },
    sendContinueRoom(){
      let params = new URLSearchParams();
      let addDay = (Date.parse(this.otherDate)+12*3600*1000-this.roomChange.orderTerm)/(24*3600*1000);
      let addMoney = addDay*this.roomChange.roomPrice;
      // console.log(addDay);
      params.append("orderId",this.roomChange.orderId);
      params.append("days",this.roomChange.days+addDay);
      params.append("liveDate",Date.parse(this.todayDate));
      params.append("leaveDate",Date.parse(this.otherDate));
      params.append("totalMoney",this.roomChange.totalmoney+addMoney);
      params.append("orderMemo",this.roomChange.orderMemo+addMoney);
      params.append('roomNo',this.roomChange.roomNo);
      this.postRequest('/continueRoom',params).then(res => {
        if(res.code === 200){
          this.$message({
            showClose:true,
            message:res.msg,
            type:'success'
          })
          this.getNotOpenRoomNumer();
          this.getOpenRoom();
          this.emitToB();
          this.continueVisible = false;
        }else{
          this.$message({
            showClose:true,
            message:res.msg,
            type:'error'
          })
        }
      })
      // 
    },
    dateSelect(time,no) {
      if(time == undefined){
        let now = new Date();
        let monthn = now.getMonth()+1;
        let yearn =now.getFullYear();
        let dayn = now.getDate();
        this.todayDate = new Date(Date.parse(yearn+"-"+monthn+"-"+dayn));
        this.otherDate =  new Date(Date.parse(yearn+"-"+monthn+"-"+(dayn+1)));
      }else{
        if(no == 0){
          this.todayDate = time;
          // console.log(time)
          let tsd = new Date(Date.parse(this.todayDate))
          let ttd = new Date(Date.parse(this.otherDate))
          if(tsd.getTime()>=ttd.getTime()){
            this.otherDate =new Date(Date.parse(this.todayDate)+1000*3600*24);
          }
          this.getOpenRoom();
        }else if(no == 1){
          this.otherDate = time;
          let addDay = (Date.parse(this.otherDate)+12*3600*1000-this.roomChange.orderTerm)/(24*3600*1000);
          this.needAddMoney = addDay*this.roomChange.roomPrice;
          this.getOpenRoom();
        }
      }
    }
  },
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
