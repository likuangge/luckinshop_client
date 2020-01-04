<template>
  <el-menu :class="el-menu-demo" mode="horizontal">
    <el-menu-item class="title"><a href="/"><i class="el-icon-s-home"/>Garish Shop</a></el-menu-item>
    <el-menu-item>
      <el-row>
        <el-col :span="5.5">
          <el-select v-model="selectFirst" placeholder="全部分类" clearable @change="choseFirstType">
            <el-option v-for="(type,index) in types" :key="index" :label="type.typeName" :value="type.typeNo"/>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="selectSecond" :disabled="selectFirst === ''" clearable>
            <el-option v-for="(type,index) in secondTypes" :key="index" :label="type.typeName" :value="type.typeNo"/>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-input placeholder="请输入查询条件" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="Select"/>
          </el-input>
        </el-col>
      </el-row>
    </el-menu-item>
    <el-menu-item class="login">
      <i class="el-icon-user-solid"></i>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{user.nickname}}<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/about">
            <div>
              <i class="el-icon-info"></i>
              About
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="/ocr" divided>
            <div>
              <i class="el-icon-question"></i>
              OCR
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <div @click="logout">
              <i class="el-icon-switch-button"></i>
              Sign Out
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog title="请先登录" :visible.sync="loginFormVisible" center @close="loginDialogClose">
        <el-form :model="SignIn" class="input">
          <el-form-item>
            <el-input class="accountInput" v-model="SignIn.account" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="accountInput" v-model="SignIn.password" placeholder="请输入密码" clearable show-password></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-left:139px">
          <slide-verify :l="42" :r="10" :w="310" :h="100" @success="onSuccess" @fail="onFail" @refresh="onRefresh" :slider-text="text"></slide-verify>
        </div>
        <div slot="footer">
          <el-link type="primary" @click="forgetPassword">忘记密码？</el-link>
          <el-button @click.prevent="signin">登录</el-button>
          <el-button type="primary" @click="openSignUp">没有账号？请注册</el-button>
        </div>
      </el-dialog>
      <el-dialog title="请先注册" :visible.sync="signUpFormVisible" center @close="signUpDialogClose">
        <el-form :model="SignUp" label-width="7em">
          <el-form-item label="用户账号" required="true">
            <el-input placeholder="请输入账号" v-model="SignUp.account" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" required="true">
            <el-input placeholder="请输入用户昵称" v-model="SignUp.nickName" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" required="true">
            <el-input placeholder="请输入密码" v-model="SignUp.password" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码" required="true">
            <el-input placeholder="请再次输入密码" v-model="SignUp.confirmPassword" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" required="true">
            <el-input placeholder="请输入手机号" v-model="SignUp.telephone" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱" required="true">
            <el-input placeholder="请输入邮箱" v-model="SignUp.email" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click.prevent="signup">确认注册</el-button>
          <el-button type="info" @click="openSignIn">返回登录</el-button>
        </div>
      </el-dialog>
      <el-dialog title="找回密码" :visible.sync="passwordFormVisible" center>
        <div class="input">
          <el-input clearable v-model="findPassword" class="accountInput" placeholder="请输入您与账户绑定的邮箱地址"></el-input>
        </div>
        <div slot="footer">
          <el-button @click.prevent="sendMail">密码找回</el-button>
        </div>
      </el-dialog>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import {mapState} from 'vuex'
  import {reqLogin,reqInitShopCart,reqUnsend,reqUnpaid,reqUnreceive,AdminUserInfo,reqPhoneCode,reqSendMail,reqLogout,reqSignup,reqInitLogin,reqSearchProduct,reqGetMessage,reqGetUnreadMessage} from '../../api'
  import { Notification } from 'element-ui'

  const telReg = /^1[3|4|5|6|7|8|9]\d{9}$/
  const emReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

  export default {
    data() {
      return {
        msg: '',
        text: '向右滑',
        loginFormVisible: false,
        signUpFormVisible: false,
        SignUp: {
          account: '',
          nickName:'',
          password: '',
          confirmPassword: '',
          telephone: '',
          email: ''
        },
        passwordFormVisible: false,
        findPassword: '',
        input: '',
        selectFirst: '',
        selectSecond: '',
        SignIn: {
          account: '',
          password: ''
        },
        adminMessageCount: '',
        sysMessageCount: '',
        messageList: []
      }
    },
    computed: {
      ...mapState({
        isLogin: state=>state.Person.isLogin,
        user: state=>state.Person.user,
        types: state=>state.Products.productTypes,
        secondTypes: state=>state.Products.searchSecondTypes,
        unsendOrder: state=>state.Order.unsendOrder,
        unpaidOrder: state=>state.Order.unpaidOrder,
        unreceiveOrder: state=>state.Order.unreceiveOrder,
        isClick: state=>state.ClickProduct.isClick,
        productTypes: state=>state.Products.productTypes
      }),
      navAvatar: function(){
        let url = "http://10.104.131.158/" + this.user.image
        return url
      },
    },
    methods: {
      choseFirstType(value) {
        if(value != '') {
          this.selectSecond = ''
          this.$store.dispatch('Products/getSearchSecondTypes',value)
        } else {
          this.selectSecond = ''
        }
      },
      handleCommand(command){
        this.$router.push(command)
      },
      messageUnpaid() {
        return '您有' + this.unpaidOrder +'个未付款的订单！请到个人中心的订单中心继续付款!'
      },
      messageUnsend() {
        return this.unsendOrder +'个未发货的订单！请到订单管理进行发货!'
      },
      messageUnreceive() {
        return this.unreceiveOrder +'个未收货的订单！请到个人中心的订单中心确认收货!'
      },
      onSuccess(){
        this.$message.success("验证成功")
        this.msg = 0
      },
      onFail(){
        this.$message.error("验证失败")
        this.msg = 1
      },
      onRefresh(){
        this.msg = ''
      },
      loginDialogClose() {
        this.SignIn.account = ''
        this.SignIn.password = ''
        this.msg = ''
      },
      openSignUp() {
        this.SignIn.account = ''
        this.SignIn.password = ''
        this.msg = ''
        this.loginFormVisible = false
        this.signUpFormVisible = true
      },
      openSignIn() {
        this.SignUp.account = ''
        this.SignUp.nickName = ''
        this.SignUp.password = ''
        this.SignUp.confirmPassword = ''
        this.SignUp.telephone = ''
        this.SignUp.email = ''
        this.loginFormVisible = true
        this.signUpFormVisible = false
      },
      signUpDialogClose() {
        this.SignUp.account = ''
        this.SignUp.nickName = ''
        this.SignUp.password = ''
        this.SignUp.confirmPassword = ''
        this.SignUp.telephone = ''
        this.SignUp.email = ''
      },
      forgetPassword() {
        this.passwordFormVisible = true
        this.loginFormVisible = false
      },
      hasIllegalChar() {
        var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
        for (var i = 0; i < this.SignUp.account.length;i++) {
        if (specialKey.indexOf(this.SignUp.account.substr(i, 1)) != -1) {
            return true
          }
        }
        return false
      },
      signin() {
        if(this.msg === 0) {
          if(this.SignIn.account === '') {
            this.$message.warning("请输入账号")
          } else {
            if(this.SignIn.password === '') {
              this.$message.warning("请输入密码")
            } else {
              reqLogin({
                username: this.SignIn.account,
                password: this.SignIn.password
              }).then((data) => {
                if (data.success) {
                  this.loginFormVisible = false
                  /*reqUnpaid().then((data) => {
                    if(data > 0) {
                      this.$store.commit('Order/changeUnpaidOrder', data)
                      this.$notify({
                        title: '未付款!',
                        dangerouslyUseHTMLString: true,
                        message: this.messageUnpaid(),
                        type:'warning',
                        showClose: false,
                        duration: 0,
                        position: 'bottom-left'
                      });
                    }
                  })
                  reqUnreceive().then((data) => {
                    if(data > 0) {
                      this.$store.commit('Order/changeUnreceiveOrder', data)
                      this.$notify({
                        title: '未收货!',
                        dangerouslyUseHTMLString: true,
                        message: this.messageUnreceive(),
                        type:'warning',
                        showClose: false,
                        duration: 0,
                        position: 'bottom-left'
                      });
                    }
                  })*/
                  this.$store.commit('Person/login',data.data)
                  reqInitShopCart({
                    memberId: this.user.memberId
                  }).then((data) => {
                    this.$store.commit('ShopCart/displayShopCart', data.data)
                  })
                  this.initWebSocket(this.user)
                } else {
                  this.SignIn.account = ''
                  this.SignIn.password = ''
                  this.msg = ''
                  this.$message.error(data.statusInfo)
                }
              }).catch(() => {
                this.$message.error("登录失败，请检查网络连接")
              })
            }
          }
        } else {
          this.$message.warning("图片验证成功之后方可登录")
        }
      },
      signup() {
        if(this.SignUp.account != '') {
          if(this.SignUp.account.length >= 7 && this.SignUp.account.length <= 17) {
            if(!this.hasIllegalChar()) {
              if(this.SignUp.nickName != '') {
                if(this.SignUp.password != '') {
                  if(this.SignUp.confirmPassword != '') {
                    if(this.SignUp.password === this.SignUp.confirmPassword) {
                      if(this.SignUp.telephone != '') {
                        if(telReg.test(this.SignUp.telephone)) {
                          if(this.SignUp.email != '') {
                            if(emReg.test(this.SignUp.email)) {
                              reqSignup({
                                username: this.SignUp.account,
                                nickname: this.SignUp.nickName,
                                password: this.SignUp.password,
                                phoneNum: this.SignUp.telephone,
                                email: this.SignUp.email
                              }).then((data) => {
                                if (data.success) {
                                  this.$message.success("注册成功")
                                  this.signUpFormVisible = false
                                  this.SignUp.account = ''
                                  this.SignUp.nickName = ''
                                  this.SignUp.password = ''
                                  this.SignUp.confirmPassword = ''
                                  this.SignUp.telephone = ''
                                  this.SignUp.email = ''
                                  this.$store.commit('Person/login',data.data)
                                } else {
                                  this.$message.warning(data.statusInfo)
                                }
                              }).catch(() => {
                                this.$message.error("注册失败，请检查网络连接")
                              })
                            } else {
                              this.$message.warning("请填写正确的邮箱地址")
                            }
                          } else {
                            this.$message.warning("请填写您的邮箱地址")
                          }
                        } else {
                          this.$message.warning("请填写正确的手机号码")
                        }
                      } else {
                        this.$message.warning("请填写您的手机号码")
                      }
                    } else {
                      this.$message.warning("两次输入的密码不同")
                    }
                  } else {
                    this.$message.warning("请再次输入密码")
                  }
                } else {
                  this.$message.warning("密码不得为空")
                }
              } else {
                this.$message.warning("昵称不得为空")
              }
            } else {
              this.$message.warning("用户名中不得含有非法字符")
            }
          } else {
            this.$message.warning("账号长度为7~17")
          }
        } else {
          this.$message.warning("账号不得为空")
        }
      },
      sendMail() {
        if(this.findPassword != '') {
          if(emReg.test(this.findPassword)) {
            reqSendMail(this.findPassword).then((data) => {
              if(data == "用户不存在" || data == "发送失败") {
                this.$message.error(data);
              } else {
                this.passwordFormVisible = false
                this.loginFormVisible = true
                this.$message.success("成功发送邮件至"+data+", 请注意查收！")
                this.findPassword = ''
              }
            }).catch(() => {
              this.$message.error("发送邮件失败")
            })
          } else {
            this.$message.warning("请输入正确的邮箱地址")
          }
        } else {
          this.$message.warning("请输入与您账户绑定的邮箱地址")
        }

      },
      Select() {
        if(this.selectFirst === '' && this.selectSecond === '') {
          if(this.input != '') {
            this.$message.warning("请先选择商品一级分类或者二级分类进行查询!")
          } else {
            this.$store.commit('Products/updateActiveSecondType',this.selectSecond)
            this.$store.dispatch('Products/getSecondTypes',this.types[0].typeNo)
            this.$store.commit('Products/updateActiveType', this.types[0].typeNo)
            reqSearchProduct({
              parentType: this.types[0].typeNo,
              productType: '',
              filter: ''
            }).then((data) => {
              console.log("data",data.data)
              this.selectFirst = ''
              this.selectSecond = ''
              this.input = ''
              this.$store.commit('Products/updateProducts', data.data)
              this.$store.commit('ClickProduct/resetClick')
              this.$router.push('/products')
            })
          }
        } else {
          this.$store.dispatch('Products/getSecondTypes',this.selectFirst)
          this.$store.commit('Products/updateActiveType', this.selectFirst)
          this.$store.commit('Products/updateActiveSecondType', this.selectSecond)
          reqSearchProduct({
            parentType: this.selectFirst,
            productType: this.selectSecond,
            filter: this.input
          }).then((data) => {
            console.log("data",data.data)
            this.selectFirst = ''
            this.selectSecond = ''
            this.input = ''
            this.$store.commit('Products/updateProducts', data.data)
            this.$store.commit('ClickProduct/resetClick')
            this.$router.push('/products')
          })
        }
      },
      logout() {
        this.$store.commit('Person/logout')
      },
      showMessage() {
        reqGetMessage(this.user.memberId).then((data) => {
          console.log("Message",data.data)
          this.messageList = data.data
        })
      },
      initWebSocket(user) {
        const wsuri = "ws://10.104.130.53:9081/membersrpc/messagesocket?user=" + user.memberId
        this.websocket = new WebSocket(wsuri);
        this.websocket.onmessage = this.websocketOnMessage
        this.websocket.onopen = this.websocketOnOpen
        this.websocket.onerror = this.websocketOnError
        this.websocket.onclose = this.websocketClose
      },
      websocketOnOpen() {
        console.log("连接打开")
      },
      websocketOnError() {
        this.initWebSocket()
      },
      websocketOnMessage(e) {
        this.$store.commit('Order/minus')
        this.$message.info(e.data)
        Notification.closeAll()
        if(this.unpaidOrder > 0) {
          this.$notify({
            title: '未付款!',
            dangerouslyUseHTMLString: true,
            message: this.messageUnpaid(),
            type:'warning',
            showClose: false,
            duration: 0,
            position: 'bottom-left'
          });
        }
      },
      websocketClose(e) {
        console.log('断开连接',e)
      },
      getUnreadMessage(val) {
        console.log("val",val)
        if(val) {
          reqGetUnreadMessage({
            memberId: this.user.memberId
          }).then((data) => {
            this.adminMessageCount = data.data.adminMsgNum
            this.sysMessageCount = data.data.systemMsgNum
          })
        } else {
          this.adminMessageCount = ''
          this.sysMessageCount = ''
        }
      }
    }
  }
</script>

<style scoped>
  .title{
    font-size:20px;
  }
  .login{
    font-size:20px;
    float:right;
  }
  .input {
    text-align:center;
  }
  .accountInput {
    width:310px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-select {
    width: 120px;
  }
  .input-with-select {
    width: 300px;
    background-color: #fff;
    margin-top: 4px;
  }
  .message {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
  }
</style>
