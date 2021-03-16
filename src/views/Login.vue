<template>
  <div id="login">
    <div class="login-wrap">
      <div class="login-wrap-left">
        <img src="../assets/images/龙泉酒店.jpg" alt="login">
      </div>
      <div class="login-wrap-right" :class="[bForgetPassowrd===true?'login-trans':'']">
        <img class="login-logo" src="../assets/images/龙泉.png" alt="">
        <!-- <h3>Hotel Admin</h3> -->
        <div class="login-wrap-form">
          <el-form  :model="loginRulesForm" 
                    :rules="loginRules" 
                    ref="loginRules" 
                    label-width="100px" 
                    class="demo-loginRules">
            <el-form-item class="login-name"  prop="name">
              <el-input v-model="loginRulesForm.name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item class="login-password" prop="password">
              <el-input type="password" v-model="loginRulesForm.password" placeholder="请输入密码" @focus="passFocus" @keyup.enter.native="login('loginRules')"></el-input>
            </el-form-item>
            <el-form-item class="login-code" prop="code">
            <el-input type="code" v-model.string="loginRulesForm.code" placeholder="点击图片更换验证码" class="code-input"></el-input>
            <img :src="codeUrl" class="code-btn" @click="uploadLoginValidateCode"></img>
            </el-form-item>
            
            
            <div class="login-btn-div" @click="login('loginRules')">
              <el-button class="login-btn" type="primary" :loading="bBtnLoginStatus" >登录</el-button>
            </div>
            <el-form-item class="login-operation">
              <el-checkbox v-model="checkBoxFlag">记住我</el-checkbox>
              <span class="regist-account" @click="registAccount" v-if="isCustomer">注册</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="regist-account-wrap" :class="[bForgetPassowrd===true?'forget':'']" v-if="isCustomer">
        <h3>注册账号</h3>
        <div class="login-wrap-form">
          <el-form  :model="registRulesForm" 
                    :rules="registRules" 
                    ref="registRulesForm" 
                    label-width="100px" 
                    class="demo-ruleForm">
            <el-form-item  prop="account">
              <el-input v-model="registRulesForm.account" placeholder="请创建账号"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="validate-code">
              <el-input type="password" v-model="registRulesForm.password" placeholder="请输入密码" ></el-input>
              <!-- @keyup.enter.native="login('registRulesForm')"  -->
              <!-- /* class="code-input" */ -->
              <!-- <el-button type="default" class="code-btn" :disabled="bModifyBtnStatus" @click="sendMail">{{sModifyBtnText}}</el-button> -->
            </el-form-item>
            <el-form-item  prop="confirmPassword">
              <el-input type="password" v-model="registRulesForm.confirmPassword" placeholder="请确认密码"></el-input>
            </el-form-item>
            <div class="forget-btn-div" >
              <el-button class="login-btn" type="defalut"  @click="registAccount" >返回登录</el-button>
              <el-button class="login-btn" type="primary" :loading="bBtnLoginStatus" @click="modify('registRulesForm')">立即注册</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto';
export default {
  name:'login',
  data(){
    return{
      path:'',
      isCustomer:false,
      aa:'aa',
      registRulesForm: { 
        account: '',
        password: '',
        confirmPassword: ''
      },
      loginRulesForm:{
        name: '',
        password: '',
        code:'',
        identity:''
      },
      loginRules:{
        name: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4,max: 4, message: '长度为4', trigger: 'blur' }
        ]
      },
      registRules: {
        account: [
          { required: true, message: '创建账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '设置登录密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认登录密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ]
        
      },
      codeUrl:'/api/loginValidateCode',
      bBtnLoginStatus:false,   //点击登录时按钮的等待状态
      checkBoxFlag:false,      //记住我？
      bForgetPassowrd:false,   //忘记密码
      sModifyBtnText:'发送验证码',    //发送验证码按钮文本
      nSendTime:60,    //
      bModifyBtnStatus:false,
      bSendTime:null,
      focusPass:false
    }
  },
  mounted(){   
    this.getIdentity();
    // this.path = this.$route.path;
    let RememberUser=localStorage.getItem('RememberUser');     //进入页面时判断是否"记住我"这个用户，如果有，就填充表单
    if(RememberUser != null){
      let tmpUser=JSON.parse(RememberUser);
      this.loginRules.password[1].max = 100
      //根据给定的算法和密钥，创建并返回解密对象
      this.loginRulesForm.name=tmpUser.user;
      this.loginRulesForm.password=tmpUser.password;
      this.checkBoxFlag=tmpUser.status;
      this.focusPass = tmpUser.status;
    }
  },
  methods:{
    passFocus(){
      this.loginRulesForm.password = '';
      this.focusPass = false;
    },
    login(formName){
      this.$refs[formName].validate(valid=>{   //表单验证
        if(valid){ 
          
          this.bBtnLoginStatus=true; //改变登陆按钮状态
             //进入页面时判断是否"记住我"这个用户，如果有，就填充表单
          var pass = this.loginRulesForm.password;
          if(!this.focusPass){
            var md5=crypto.createHash('md5');    //对密码进行加密
            md5.update(this.loginRulesForm.password);
            pass = md5.digest('hex');
          }
          
         
          
          //根据给定的算法和密钥，创建并返回加密对象
          // let p1=crypto.createCipher('aes192','qingquanhotel');   //第二个参数为密钥，所有密钥都要相同
          // //输入数据为utf8格式，输出格式为hex
          // let pass=p1.update(this.loginRulesForm.password,'utf8','hex');  
          // //返回所有加密过的内容
          // pass+=p1.final('hex');
          
          if(this.checkBoxFlag){   //记住密码
            localStorage.setItem('RememberUser',JSON.stringify({user:this.loginRulesForm.name,password:pass,status:this.checkBoxFlag}))
          }

          var params = new URLSearchParams();
          params.append('account',this.loginRulesForm.name);
          params.append('password',pass);
          params.append('code',this.loginRulesForm.code);
          if(this.isCustomer){
          params.append('identity','customer');
          }
          else{
            console.log("jjjjS")
          params.append('identity','staff');
          }
          let message='登陆正确';
          let type='success';
          this.postRequest('/login',params).then(res=>{  //发起请求
            if(res.code===200){
              message=res.msg;
              type='success';
              // window.localStorage.setItem('loginToken',res.token)
              setTimeout(()=>{
                this.$router.push({path:'/'})
              },500)
            }else{
              message=res.msg;
              type='error';
            }
           
            this.$message({
              showClose: true,
              message: message,
              type: type
            })
            this.bBtnLoginStatus=false;
            let userLogin={
              username:this.loginRulesForm.name,
              password:pass
            }
            
          }).catch(err=>{
            this.$message({
              showClose: true,
              message: '网络请求失败',
              type: 'error'
            });
            this.bBtnLoginStatus=false;
          })
        }else{
          this.$message({
            showClose: true,
            message: '请正确填写登录表单',
            type: 'error'
          });
        }
      })
    },
    uploadLoginValidateCode() {
      this.codeUrl='/api/loginValidateCode?random='+new Date().getMilliseconds();
        // $("#loginValidateCode").attr("src","/loginValidateCode?random="+new Date().getMilliseconds());
    },
    registAccount(){   //注册账号
      this.bForgetPassowrd=!this.bForgetPassowrd
    },
    modify(formName){   //注册
      this.$refs[formName].validate(valid=>{
        if(valid){
          if(this.registRulesForm.password != this.registRulesForm.confirmPassword){
            this.$message({
                showClose: true,
                message: '两次密码不同',
                type: 'error'
              });
          }else{
            let message=null;
            let type=null;
            let md5=crypto.createHash('md5');    //对密码进行加密
            md5.update(this.registRulesForm.password);
            let newPass = md5.digest('hex');
            // let t1=crypto.createCipher('aes192','qingquanhotel');   //对密码进行加密
            // let newPass=t1.update(this.registRulesForm.password,'utf8','hex');
            // newPass+=t1.final('hex');
            var params=new URLSearchParams();
            params.append('account',this.registRulesForm.account);
            params.append('password',newPass);

            this.postRequest('/regist',params).then(res=>{
              if(res.code===200){
                message=res.msg;
                type='success';
                setTimeout(()=>{
                this.bForgetPassowrd=!this.bForgetPassowrd
              },1000)
                
              }else{
                message=res.msg;
                type='error';
              }
              this.$message({
                showClose: true,
                message: message,
                type: type
              })
            }).catch(err=>{
              this.$message({
                showClose: true,
                message: '网络请求失败',
                type: 'error'
              });
            })
          }
        }else{
          this.$message({
            showClose: true,
            message: '请正确填写登录表单',
            type: 'error'
          });
        }
      })
    },
    getIdentity(){
      this.path = this.$route.path;
      console.log(this.path);
      if(this.path === '/Login' || this.path === '/login'){
        this.isCustomer = true;
      }else if(this.path === '/admin/Login'){
        this.isCustomer = false;
      }
      // if()
    }
  },
  
}
</script>


<style>
  #login {
    position: relative;
    width: 100%;
    height: 100%;
    background: #F1F2F7;
  }
  .login-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    /* display: flex;
    justify-content: space-between; */
    width: 800px;
    height: 400px;
    background: #fff;
    overflow: hidden;
    /* border: 1px  solid #cfcfcf; */
  }
  .login-wrap-left {
    position: absolute;
    left: 0;
    width: 60%;
    height: 100%;
  }
  .login-wrap-left img {
    width: 100%;
    height: 100%;
  }
  .login-wrap-right {
    position: absolute;
    right: 0;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    width: 40%;
    height: 100%;
    /* border-left: 1px solid #cfcfcf; */
    box-sizing: border-box;
    transition: .5s;
    background: #fff;
  }
  .login-wrap-right h3 {
    text-align: center;
    font-size: 20px;
    
  }
  .login-wrap-form {
    margin-top: 0px;
    text-align: center;
    /* border: 1px solid black; */
  }
  .login-btn-div {
    width: 100%;
  }
  .login-logo {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: block;
  }
  .regist-account {
    color: #606266;
    cursor: pointer;
  }
  .login-operation {
    width: 100%;
    margin-top: 5px;
  }
  .login-operation>div {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .regist-account-wrap {
    position: absolute;
    right: 0;
    width: 40%;
    height: 100%;
    /* background: #000; */
    transform: translateX(100%);
    transition: .5s;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
    opacity: 0;
  }
  .regist-account-wrap h3 {
    text-align: center;
    color: #59A8F4;
    line-height: 80px;
  }
  .login-trans {
    transform: translateX(-100%);
    opacity: 0;
  }
  .forget {
    transform: translateX(0%);
    opacity: 1;
  }
  .forget-btn-div {
    width: 100%;
    display: flex;
  }

</style>
