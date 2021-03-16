<template>
  <div class="room-information">
    <div class="add">
      <el-button type="primary" @click="showForm('add')">新增房间</el-button>
    </div>
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item
          label="房间号码"
          :label-width="formLabelWidth"
          prop="roomNo"
          @blur="roomFind"
        >
          <el-input v-model="form.roomNo" autocomplete="off" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item
          label="房间类型"
          :label-width="formLabelWidth"
          prop="roomType"
        >
          <el-select v-model="form.roomType" placeholder="请选择房间类型">
            <el-option label="单人间" value="单人间"></el-option>
            <el-option label="双人间" value="双人间"></el-option>
            <el-option label="三人间" value="三人间"></el-option>
            <el-option label="商务间" value="商务间"></el-option>
            <el-option label="总统间" value="总统间"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="房间定价"
          :label-width="formLabelWidth"
          prop="roomPrice"
        >
          <el-input v-model="form.roomPrice" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendRoom">确 定</el-button>
      </div>
    </el-dialog>
    <div class="room-table">
      <el-table :data="roomData" border style="width: 100%">
        <el-table-column prop="roomNo" label="房号" align="center" width="180">
        </el-table-column>
        <el-table-column
          prop="roomType"
          label="类型"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="roomTypeObj"
          label="类型编号"
          align="center"
          width="180"
          v-if="false"
        >
        </el-table-column>
        <el-table-column prop="roomPrice" align="center" label="定价">
        </el-table-column>

        <el-table-column prop="updateDateView" align="center" label="更新日期">
        </el-table-column>
        <el-table-column prop="createDateView" align="center" label="创建日期">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="showForm('modify', scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="deleteRoom(scope.row.roomNo)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>


<script>
import crypto from "crypto";
export default {
  data() {
    return {
      roomData: [],
      dialogFormVisible: false,
      isDisabled:false,
      form: {
        roomNo: "",
        roomType: "",
        roomPrice: "",
        roomTypeObj: "",
      },
      formLabelWidth: "120px",
      rules: {
        roomNo: [
          { required: true, message: "请输入房间号码", trigger: "blur" },
          { min:3, max: 5,message:"超长",trigger: "blur" },
          { validator: (rule,value,callback) =>{
              let roomNo = this.form.roomNo;
              let _this = this;
              _this.getRequest("/roomFind?roomNo=" + roomNo).then( res =>{
               if(res.code === 204){
                callback(new Error("该房间已经存在"));
              }
              });
          },trigger: "blur" }
        ],
        roomType: [
          { required: true, message: "请选择房间类型", trigger: "blur" },
        ],
        roomPrice: [
          { required: true, message: "请输入房间定价", trigger: "blur" },
          { min: 0, max: 100000, message: "不能小于0",trigger: "blur"},
        ],
      },
      formTitle: "新增房间",
      roomAPI: "/addRoom",
      formType: "",
      // roomId:null,
    };
  },
  mounted() {
    this.getRoom();
  },
  methods: {
    getRoom() {
      this.getRequest("/getAllRoom").then((res) => {
        //获取房间信息
        this.roomData = res.data;
      });
    },
    
    sendRoom() {
      //添加房间信息或者修改房间信息
      var parmas = new URLSearchParams();
      parmas.append("roomNo", this.form.roomNo);
      parmas.append("roomPrice", this.form.roomPrice);
      // let roomtype = this.form.roomType
      parmas.append("roomTypeObj", this.getTypeObj(this.form.roomType));
      
      this.postRequest(this.roomAPI, parmas).then((res) => {
        if (res.code === 200) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getRoom();
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    deleteRoom(roomNo) {
      this.$confirm("此操作将永久删除该房间信息, 是否继续?", "操作提示", {
        //点击删除按钮时先弹框警告
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var parmas = new URLSearchParams();
          // parmas.append('roomId',roomId);
          // parmas.append('room_num',room_num)

          this.deleteRequest(
            "/deleteRoom?roomNo=" + roomNo,
            { withCredentials: true },
            {
              header: {
                emulateJSON: true,
              },
            }
          ).then((res) => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "success",
              });
              this.getRoom();
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    showForm(type, room = undefined) {
      this.dialogFormVisible = true;
      if (type === "modify") {
        //判断是修改房间信息还是添加房间
        this.isDisabled = true;
        this.formTitle = "修改房间";
        let tmpRoomData = {
          roomNo: room.roomNo,
          roomType: room.roomType,
          roomPrice: room.roomPrice,
          // roomTypeObj:room.roomTypeObj
        };
        this.form = tmpRoomData;
        this.formType = "modify";
        this.roomNo = room.roomNo;
        this.roomAPI = "/modifyRoom";
      } else {
        //添加房间
        this.isDisabled = false;
        this.form = {
          roomNo: "",
          roomType: "",
          roomPrice: "",
          roomTypeObj: "",
        };
        this.roomAPI = "/addRoom";
        this.formType = "";
      }
    },
    roomFind(roomNo,callback){
      
    },
    getTypeObj(roomType) {
      let roomTypeObj = 0;
      switch (roomType) {
        case "单人间":
          roomTypeObj =1;
          break;
        case "双人间":
          roomTypeObj = 2
          break;
        case "三人间":
          roomTypeObj = 3
          break;
        case "商务间":
          roomTypeObj = 4
          break;
        case "总统间":
          roomTypeObj = 5
          break;
      }
      return roomTypeObj;
    },
  },
};
</script>


<style lang="less" scoped>
.room-table {
  margin-top: 20px;
}
</style>
