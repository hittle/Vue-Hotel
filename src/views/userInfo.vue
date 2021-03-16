<template>
  <div>
    <div id="userInfo">
      <!-- :visible.sync="dialogFormVisible" -->
      <el-form :model="userInfo"
        ref="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="姓名"
          prop="name">
          <el-input v-model="userInfo.name"
            autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="账号"
          prop="account" >
          <el-input v-model="userInfo.account"
            autocomplete="off"
            disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="身份证号"
          prop="cardNum">
          <el-input v-model="userInfo.cardNum"
            autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userInfo.sex"
            placeholder="请选择性别">
            <el-option label="男"
              value="男"></el-option>
            <el-option label="女"
              value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话"
          prop="tel">
          <el-input v-model="userInfo.tel"
            autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
          prop="email">
          <el-input v-model="userInfo.email"
            autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份" v-if="userInfo.identity === 'staff' || userInfo.identity === 'admin'">
          <el-input v-model="userInfo.identity"
            autocomplete="off" disabled="true" ></el-input>

        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="changeUserInfo"
            size="small">立即修改</el-button>
          <el-button type="primary"
            size="small"
            @click="changePasswordVisible = true">修改密码</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="修改密码"
        :visible.sync="changePasswordVisible"
        center >
        <el-form :model="psdForm"
          ref="form"
          :rules="rules"
          label-width="120px"
          >
          <el-form-item label="旧密码"
            prop="pass">
            <el-input v-model="psdForm.pass"
              placeholder="请输入旧密码"
              type="password" ></el-input>
          </el-form-item>
          <el-form-item label="新密码"
            prop="newpass">
            <el-input v-model="psdForm.newpass"
              placeholder="请输入新密码"
              type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码"
            prop="checknewpass">
            <el-input v-model="psdForm.checknewpass"
              placeholder="请确认密码"
              type="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="changePasswordVisible = false">取消</el-button>
          <el-button type="primary"
            @click="changePassword">提交</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
  <!-- <div class="all-container">
    <div class="all-container-padding bg" >
     <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="基本信息" name="first">
      <el-form :model="userInfo" :rules="rules" ref="EditorUserForms">
        
        <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
         <el-col :span="8"> <el-input v-model="userInfo.name" disabled ></el-input></el-col>
        </el-form-item>
        <el-form-item label="电话" prop="tel" :label-width="formLabelWidth">
         <el-col :span="8">  <el-input v-model="userInfo.tel" placeholder="请输入电话"></el-input></el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
         <el-col :span="8">  <el-input v-model="userInfo.email" placeholder="请输入邮箱"></el-input></el-col>
        </el-form-item>
        <el-form-item label="用户角色" prop="identity" :label-width="formLabelWidth">
         <el-col :span="8">
          <el-input v-model="userInfo.identity" disabled ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="grid-content bg-purple">
       <el-button type="primary" @click="EditorUserClick('form')" >保存</el-button>
      </div>
     </el-tab-pane>
     <el-tab-pane label="修改密码" name="second">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
       <el-form-item label="原密码" prop="pass" :label-width="formLabelWidth">
         <el-col :span="8">  <el-input v-model="ruleForm.pass" placeholder="请输入原密码" type="password"></el-input></el-col>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass" :label-width="formLabelWidth">
         <el-col :span="8"><el-input v-model="ruleForm.newpass" placeholder="请输入新密码" id="newkey" type="password"></el-input></el-col>
        </el-form-item>
        <el-form-item label="重复新密码" prop="checknewpass" :label-width="formLabelWidth">
         <el-col :span="8">  <el-input v-model="ruleForm.checknewpass" placeholder="请再次输入新密码" id='newkey1' type="password"></el-input></el-col>
        </el-form-item>
        </el-form>
        <div class="grid-content bg-purple">
       <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
     </el-tab-pane>
    </el-tabs>
    </div>
   </div> -->
</template>
<script>
import crypto from 'crypto';
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入密码"));
      } else {
        if (this.psdForm.checknewpass !== "") {
          this.$refs.psdForm.validateField("checknewpass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.psdForm.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        id:'',
        name:'',
        account:'',
        cardNum:'',
        tel:'',
        email:'',
        identity:'',
        sex:''
      },
      psdForm: {
        pass:'',
        newpass:'',
        checknewpass:''
      },
      activeName: "first",
      ruleForm: {},
      formLabelWidth: "150px",
      changePasswordVisible: false,
      rules: {
        tel: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur",
          },
          {
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: "手机格式不对",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入电子邮箱",
            trigger: "blur",
          },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
            message: "请输入有效的邮箱",
            trigger: "blur",
          },
        ],
        pass: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码",
          },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        newpass: [
          {
            validator: validatePass,
            trigger: "blur",
          },
           { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        checknewpass: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
           { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  mounted() {
    // this.userInfo = this.userInfo;
    this.getUserInfo();
  },
  methods: {
    getUserInfo(){
      this.getRequest('/getUserInfo').then(res => {
        if(res.code === 200){
          this.userInfo = res.data;
        }
      })
    },
    changeUserInfo(){
      let params = new URLSearchParams();
      params.append("id",this.userInfo.id);
      params.append("name",this.userInfo.name);
      // params.append("account",this.userInfo.account);
      params.append("sex",this.userInfo.sex);
      params.append("cardNum",this.userInfo.cardNum);
      params.append("tel",this.userInfo.tel);
      params.append("email",this.userInfo.email);
      this.postRequest('/changeUserInfo',params).then(res => {
        if(res.code === 200){
          this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            })
          this.getUserInfo();
        }
      })

    },

    changePassword(){
      let params = new URLSearchParams();
      let md51=crypto.createHash('md5');    //对密码进行加密
      md51.update(this.psdForm.pass);
      let oldPass = md51.digest('hex');
      let md52=crypto.createHash('md5'); 
      md52.update(this.psdForm.newpass)
      let newPass = md52.digest('hex');
      params.append("userId",this.userInfo.id);
      params.append("oldPass",oldPass);
      params.append("newPass",newPass);
      if(this.psdForm.newpass === this.psdForm.checknewpass){
        this.postRequest('/changePassword',params).then(res => {
          if(res.code === 200){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            })
            this.changePasswordVisible = false;
          }else if(res.code ===210){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    }
  },
};
</script>
<style scoped>
#userInfo {
  width: 300px;
}
</style>