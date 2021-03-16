<template>
  <div>
    <div class="room-table">
      <h2>未开出</h2>
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
        :data="notOpened"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roomNo"
          label="房间号"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="roomType"
          label="类型"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roomPrice"
          label="价格"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column  
          label="状态"
          align="center">
          <template scope="scope">
              {{ scope.row.roomState===0 ? '未开出' : '已开出' }}
          </template>
        </el-table-column>
        <el-table-column  
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.roomState===1" @click="openRoom(scope.row)">开房</el-button>
            <!-- <el-button size="mini" :disabled="scope.row.roomState===0">退房</el-button>
            <el-button size="mini" :disabled="scope.row.roomState===0">换房</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="录入开房信息" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" :inline="true" label-position="right" label-width="120px">
        <el-form-item label="房号">
          <el-input v-model="form.roomObj" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="姓名">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号">
          <el-input v-model="form.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="开出时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期时间"
            v-model="form.liveDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptionsTod" 
            @change="dateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.leaveDate"
            :picker-options="pickerOptionsTom" 
            @change="paymentChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="房费">
          <el-input v-model="form.totalMoney" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="押金">
          <el-input v-model="form.orderMemo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="addPeople">增加房间人物信息</el-button> -->
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendOpenRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from '../assets/bus.js'
export default {
  data(){
    return {
      form: {
        roomObj:'',   //房号
        name: '',     //姓名
        sex:'',    //性别
        cardNum: '',   //证件号
        liveDate: '',    //开出时间
        days:'',
        leaveDate: '',    //到期时间  
        totalMoney: '',   //房费
        ordermemo: '',    //备注
      },
      dialogFormVisible: false,
      openRoomForm: {

      },
      opnRoomId:null,
      room_money:null,
      peopleNum:1,
      todayDate:'',
      otherDate:'',
      room:[],
      notOpened:[],
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
    this.getRoomNumber();
    this.getEventDate();
  },
  methods:{
    emitToA(){
      bus.$emit('updateInfoB','更新组件');
    },
    getEventDate(){
      const that = this;
      bus.$on('updateInfoA',function(val){
        that.getRoomNumber();
      });
    },
    getDays(){
      let live = new Date(Date.parse(this.form.liveDate));
      let leave = new Date(Date.parse(this.form.leaveDate)) ;
      this.form.days = leave.getDate() - live.getDate();
    },
    getRoomNumber(){
      let parms = new URLSearchParams();
      parms.append("thisDate",Date.parse(this.todayDate));
      parms.append("thatDate",Date.parse(this.otherDate));
      this.postRequest('/getNotOpen',parms).then(res=>{
        this.notOpened=res.data.notOpen;
      })
    },
    openRoom(room){
      // console.log(room)
      this.opnRoomId=room.id;
      this.form.roomObj=room.roomNo;
      this.form.totalMoney=room.roomPrice;
      this.room_money=room.roomPrice;
      this.dialogFormVisible=true;
      switch(room.roomType){
        case "单人间":
          this.peopleNum=1;
        break;
        case "双人间":
          this.peopleNum=2;
        break;
        case "三人间":
          this.peopleNum=3;
        break;
        default:
          this.peopleNum=1;
      }
    },
    sendOpenRoom(){
      let params=new URLSearchParams();
      this.getDays();
      params.append('roomObj',this.form.roomObj);/*  */
      params.append('name',this.form.name);/*  */
      params.append('sex',this.form.sex);
      params.append('cardNum',this.form.cardNum);
      params.append('liveDate',this.form.liveDate);
      params.append('leaveDate',this.form.leaveDate);
      params.append('days',this.form.days);
      params.append('totalMoney',this.form.totalMoney);
      params.append('orderMemo',this.form.orderMemo);
      this.postRequest('/openRoom',params).then(res=>{
        if(res.code===200){
          this.$message({
            showClose:true,
            message:res.msg,
            type:'success'
          })
          this.dialogFormVisible=false;
          this.getRoomNumber();
          this.emitToA();
        }else if(res.code === 210){
          this.$message({
            showClose:true,
            message:res.msg,
            type:'error'
          })
        }
      }).catch(err =>{
        this.$message({
            showClose:true,
            message:"开房失败",
            type:'error'
      })
      })
    },
    dateChange(time){   //设置到期默认时间
    // console.log(time)
      var day=new Date(new Date(Date.parse(time)).getTime()+24*60*60*1000);
      let month=day.getMonth()+1;
      let date=day.getDate();
      month=month<10?'0'+Number(month):month;   //小于10情况
      date=date<10?'0'+date:date;

      this.form.leaveDate=`${day.getFullYear()}-${month}-${date} 12:00:00`;
      this.paymentChange();
    },
    paymentChange(){   //根据开房时间和到期时间的天差来动态计算需要的支付的费用
      let date1=new Date(this.form.liveDate);
      let date2=new Date(this.form.leaveDate);
      let date3=date2.getTime()-date1.getTime();
      let days=Math.ceil(date3/(24*3600*1000));   //向上取整，超过1天算2天

      this.form.totalMoney=days*this.room_money;
      this.form.orderMemo=days*this.room_money+this.room_money;
    },
    addPeople(){
      this.form.name.push({
        value:''
      })
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
          let tsd = new Date(Date.parse(this.todayDate))
          let ttd = new Date(Date.parse(this.otherDate))
          if(tsd.getTime()>=ttd.getTime()){
            this.otherDate =new Date(Date.parse(this.todayDate)+1000*3600*24);
          }
          this.getRoomNumber();
          // console.log("888")
        }else if(no == 1){
          this.otherDate = time;
          this.getRoomNumber();
        }
      }
    }
  },
}
</script>

