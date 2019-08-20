<template>
  <el-menu :class="el-menu-demo" mode="horizontal">
    <el-menu-item class="title"><a href="/"><i class="el-icon-s-home"></i>Luckin Shop</a></el-menu-item>
    <el-menu-item>
      <div style="margin-left:175px">
        <el-input placeholder="请输入商品名称" v-model="input" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="全部商品">
            <el-option v-for="(type,index) in types" :key="index" :label="type" :value="type"></el-option>
            <el-option label="全部商品" value="全部商品"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="Select"></el-button>
        </el-input>
      </div>
    </el-menu-item>
    <el-menu-item class="login">
      <el-tag v-show="forbidden === 1" type="warning">已禁用</el-tag>
      <el-popover placement="bottom" width="200" trigger="hover" style="margin-right:15px">
        <div>
          <p style="font-size:16px;color:blue">当前积分等级:{{level}}</p>
          <p style="font-size:16px;color:red" v-if="level < 10">距离下一级还有{{restCredit()}}积分</p>
          <p style="font-size:16px;color:red" v-else>您满级啦！敬请期待新的积分等级！！</p>
        </div>
        <i v-show="isLogin && !isAdmin" class="el-icon-medal" slot="reference">{{level}}</i>
      </el-popover>
      <i v-show="!isLogin" class="el-icon-user-solid"></i>
      <i v-show="isLogin && isAdmin" class="el-icon-user-solid"></i>
      <el-image v-show="isLogin && !isAdmin" :src=navAvatar style="width:25px;height:25px"></el-image>
      <el-button @click="loginFormVisible = true" v-if="!isLogin">请登录</el-button>
      <el-dropdown v-else @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/about" v-if="!isAdmin">
            <div>
              <i class="el-icon-info"></i>
              About
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="/admin" v-else>
            <div>
              <i class="el-icon-info"></i>
              Back End Management
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
        <div style="text-align:center">
          <el-radio v-model="LoginRole" label="1" @change="onChange">用户登录</el-radio>
          <el-radio v-model="LoginRole" label="2" @change="onChange">管理员登录</el-radio>
        </div>
        <el-form :model="SignIn" class="input" v-if="LoginRole === '1'">
          <el-form-item>
            <el-input class="accountInput" v-model="SignIn.account" placeholder="请输入手机号或者邮箱地址" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="accountInput" v-model="SignIn.password" placeholder="请输入密码" clearable show-password></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="AdminSignIn" class="input" v-else>
          <el-form-item>
            <el-input class="accountInput" v-model="AdminSignIn.account" placeholder="请输入管理员账号" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="accountInput" v-model="AdminSignIn.password" placeholder="请输入密码" clearable show-password></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-left:139px">
          <slide-verify :l="42" :r="10" :w="310" :h="100" @success="onSuccess" @fail="onFail" @refresh="onRefresh" :slider-text="text"></slide-verify>
        </div>
        <div slot="footer">
          <el-link type="primary" @click="forgetPassword" v-show="LoginRole === '1'">忘记密码？</el-link>
          <el-button @click.prevent="signin">登录</el-button>
          <el-button type="primary" @click="openSignUp" v-show="LoginRole === '1'">没有账号？请注册</el-button>
        </div>
      </el-dialog>
      <el-dialog title="请先注册" :visible.sync="signUpFormVisible" center @close="signUpDialogClose">
        <el-form :model="SignUp" label-width="7em">
          <el-form-item label="用户名" required="true">
            <el-input placeholder="请输入用户名" v-model="SignUp.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" required="true">
            <el-input placeholder="请输入密码" v-model="SignUp.password" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="确认密码" required="true">
            <el-input placeholder="请再次输入密码" v-model="SignUp.confirm_password" show-password clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱" required="true">
            <el-input placeholder="请输入邮箱" v-model="SignUp.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" required="true">
            <el-row>
              <el-col :span="18">
                <el-input placeholder="请输入手机号" v-model="SignUp.account" clearable></el-input>
              </el-col>
              <el-col :span="6" v-show="!countDown">
                <el-button type="primary" :disabled="!phoneCheck" @click="getCode(SignUp.account)" style="margin-left:10px">获取验证码</el-button>
              </el-col>
              <el-col :span="6" v-show="countDown">
                <el-button type="success" plain disabled style="margin-left:10px">{{count}}s后重发</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="手机验证码" required="true">
            <el-input placeholder="请输入验证码" v-model="SignUp.code" clearable></el-input>
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
  import {reqLogin,reqInitShopCart,reqUnsend,reqUnpaid,reqUnreceive,AdminUserInfo,reqPhoneCode,reqSendMail,reqLogout,reqSignup,reqInitLogin,reqSearchProduct} from '../../api'
  import { Notification } from 'element-ui'

  const telReg = /^1[3|4|5|6|7|8|9]\d{9}$/
  const emReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

  export default {
    data() {
      return {
        msg: '',
        text: '向右滑',
        LoginRole: '1',
        loginFormVisible: false,
        signUpFormVisible: false,
        count: 0,
        countDown: false,
        SignUp: {
          account: '',
          name:'',
          password: '',
          confirm_password: '',
          email: '',
          code: '',
        },
        passwordFormVisible: false,
        findPassword: '',
        input: '',
        select: '',
        SignIn: {
          account: '',
          password: ''
        },
        AdminSignIn: {
          account: '',
          password: ''
        }
      }
    },
    computed: {
      ...mapState({
        isLogin: state=>state.Person.isLogin,
        isAdmin: state=>state.Person.isAdmin,
        username: state=>state.Person.username,
        telephone: state=>state.Person.telephone,
        email: state=>state.Person.email,
        avatar: state=>state.Person.avatar,
        forbidden: state=>state.Person.forbidden,
        level: state=>state.Person.level,
        totalCredit: state=>state.Person.totalCredit,
        nextLevelCredit: state=>state.Person.nextLevelCredit,
        types: state=>state.Products.productTypes,
        unsendOrder: state=>state.Order.unsendOrder,
        unpaidOrder: state=>state.Order.unpaidOrder,
        unreceiveOrder: state=>state.Order.unreceiveOrder,
        isClick: state=>state.ClickProduct.isClick,
        productTypes: state=>state.Products.productTypes
      }),
      navAvatar: function(){
        let url = "/api/pictures/" + this.avatar
        return url
      },
      phoneCheck () {
        if(telReg.test(this.SignUp.account)) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      handleCommand(command){
        this.$router.push(command)
      },
      restCredit() {
        return this.nextLevelCredit - this.totalCredit
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
      onChange() {
        this.SignIn.account = ''
        this.SignIn.password = ''
        this.AdminSignIn.account = ''
        this.AdminSignIn.password = ''
        this.msg = ''
      },
      loginDialogClose() {
        this.SignIn.account = ''
        this.SignIn.password = ''
        this.AdminSignIn.account = ''
        this.AdminSignIn.password = ''
        this.msg = ''
        this.LoginRole = '1'
      },
      openSignUp() {
        this.SignIn.account = ''
        this.SignIn.password = ''
        this.AdminSignIn.account = ''
        this.AdminSignIn.password = ''
        this.msg = ''
        this.loginFormVisible = false
        this.signUpFormVisible = true
      },
      openSignIn() {
        this.SignUp.account = ''
        this.SignUp.password = ''
        this.SignUp.confirm_password = ''
        this.SignUp.name = ''
        this.SignUp.code = ''
        this.SignUp.email = ''
        this.loginFormVisible = true
        this.signUpFormVisible = false
      },
      signUpDialogClose() {
        this.SignUp.account = ''
        this.SignUp.password = ''
        this.SignUp.confirm_password = ''
        this.SignUp.name = ''
        this.SignUp.code = ''
        this.SignUp.email = ''
      },
      forgetPassword() {
        this.passwordFormVisible = true
        this.loginFormVisible = false
      },
      hasIllegalChar() {
        var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
        for (var i = 0; i < this.SignUp.name.length; i++) {
          if (specialKey.indexOf(this.SignUp.name.substr(i, 1)) != -1) {
            return true 
          }
        }
        return false
      },
      signin() {
        if(this.LoginRole === '1') {
          if(this.msg === 0) {
            if(this.SignIn.account === '') {
              this.$message.warning("请输入手机号码或者邮箱地址")
            } else {
              if(telReg.test(this.SignIn.account) || emReg.test(this.SignIn.account)) {
                if(this.SignIn.password === '') {
                  this.$message.warning("请输入密码")
                } else {
                  reqLogin({
                    account: this.SignIn.account,
                    password: this.SignIn.password,
                    role: 'common_user'
                  }).then((data) => {
                    if (data.isLogin) {
                      this.loginFormVisible = false
                      reqInitShopCart().then((data) => {
                        this.$store.commit('ShopCart/displayShopCart', data)
                      })
                      reqUnpaid().then((data) => {
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
                      })
                      this.$store.commit('Person/changeLogin')
                      this.$store.commit('Person/setUserInfo',data)
                    } else {
                      this.SignIn.account = ''
                      this.SignIn.password = ''
                      this.msg = ''
                      this.$message.error(data.message)
                    }
                  }).catch(() => {
                    this.$message.error("登录失败，请检查网络连接")
                  })
                }
              } else {
                this.$message.warning("请输入正确的手机号码或者邮箱地址")
              }
            }
          } else {
            this.$message.warning("图片验证成功之后方可登录")
          }
        } else {
          if(this.msg === 0) {
            if(this.AdminSignIn.account === '') {
              this.$message.warning("请输入管理员账号")
            } else {
              if(this.AdminSignIn.password === '') {
                this.$message.warning("请输入密码")
              } else {
                reqLogin({
                  account: this.AdminSignIn.account,
                  password: this.AdminSignIn.password,
                  role: 'admin'
                }).then((data) => {
                  if (data.isLogin) {
                    this.loginFormVisible = false
                    this.$store.commit('Person/changeAdmin')
                    this.$store.commit('Person/changeLogin')
                    this.$store.commit('Person/setUsername', data.username)
                    reqUnsend().then((data) => {
                      if(data > 0) {
                        this.$store.commit('Order/changeUnsendOrder', data)
                        this.$notify({
                          title: '未发货!',
                          dangerouslyUseHTMLString: true,
                          message: this.messageUnsend(),
                          type:'warning',
                          showClose: false,
                          duration: 0,
                          position: 'bottom-left'
                        });
                      }
                    })
                    AdminUserInfo().then((data) => {
                      this.$store.commit('Person/setUsers',data)
                    })
                  } else {
                    this.AdminSignIn.account = ''
                    this.AdminSignIn.password = ''
                    this.msg = ''
                    this.$message.error(data.message)
                  }
                }).catch(() => {
                  this.$message.error("登录失败，请检查网络连接")
                })
              }
            }
          } else {
            this.$message.warning("图片验证成功之后方可登录")
          }
        }
      },
      getCode(telephone) {
        reqPhoneCode(telephone).then((data) => {
          if (data == "发送成功") {
            this.setTimer()
          } else {
            if (data == "手机号已被注册") {
              this.$message.error("手机号已被注册")
            } else {
              this.$message.error("验证码发送失败")
            }
          }
        })
      },
      setTimer() {
        const TIME_COUNT = 60
        if(!this.timer) {
          this.count = TIME_COUNT;
          this.countDown = true;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.countDown = false;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      },
      signup() {
        if(this.SignUp.name != '') {
          if(this.SignUp.name.length >= 7 && this.SignUp.name.length <= 17) {
            if(!this.hasIllegalChar()) {
              if(this.SignUp.password != '') {
                if(this.SignUp.confirm_password != '') {
                  if(this.SignUp.password === this.SignUp.confirm_password) {
                    if(this.SignUp.email != '') {
                      if(emReg.test(this.SignUp.email)) {
                        if(this.SignUp.code != '') {
                          reqSignup({
                            telephone: this.SignUp.account,
                            password: this.SignUp.password,
                            userName: this.SignUp.name,
                            code: this.SignUp.code,
                            email: this.SignUp.email
                          }).then((data) => {
                            if (data == "注册成功") {
                              this.$message.success("注册成功")
                              this.signUpFormVisible = false
                              reqInitLogin().then((data) => {
                                this.$store.commit('Person/changeLogin')
                                this.$store.commit('Person/setUserInfo',data)
                              })
                            }
                            if(data == "邮箱已被注册") {
                              this.$message.error("邮箱已被注册！")
                            }
                            if(data == "验证码错误") {
                              this.$message.error("验证码错误！")
                            }
                          }).catch(() => {
                            this.$message.error("注册失败，请检查网络连接")
                          })
                        } else {
                          this.$message.warning("请输入短信验证码")
                        }
                      } else {
                        this.$message.warning("请填写正确的邮箱地址")
                      }
                    } else {
                      this.$message.warning("请填写您的邮箱地址")
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
              this.$message.warning("用户名中不得含有非法字符")
            }
          } else {
            this.$message.warning("用户名长度为7~17")
          }
        } else {
          this.$message.warning("用户名不得为空")
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
        this.$store.dispatch('Products/getAllTypes')
        if(this.select === '' || this.select === '全部商品') {
          if(this.input != '') {
            reqSearchProduct(this.select,this.input).then((data) => {
              this.productTypes.unshift("搜索结果")
              this.$store.commit('Products/updateActiveType','搜索结果')
              this.$store.commit('Products/updateProductTypes',this.productTypes)
              this.$store.commit('Products/updateProducts',data)
              this.select = ''
              this.input = ''
            })
          } else {
            this.$store.dispatch('Products/getPropertyName', '家用电器')
            this.$store.dispatch('Products/getProducts', '家用电器')
            this.$store.commit('Products/updateActiveType', '家用电器')
            this.select = ''
            this.input = ''
          }
        } else {
          if(this.input != '') {
            reqSearchProduct(this.select,this.input).then((data) => {
              this.$store.commit('Products/updateActiveType',this.select)
              //this.$store.dispatch('Products/getPropertyName',this.select)
              this.$store.commit('Products/updateProducts',data)
              this.select = ''
              this.input = ''
            }).catch(() => {
              this.$message.error("查询商品有误")
            })
          } else {
            if(this.isClick) {
              this.$store.commit('ClickProduct/changeClick')
            }
            this.$store.dispatch('Products/getPropertyName', this.select)
            this.$store.dispatch('Products/getProducts', this.select)
            this.$store.commit('Products/updateActiveType', this.select)
            this.select = ''
            this.input = ''
          }
        }
        this.$router.push('/products')
      },
      logout() {
        reqLogout().then((data) => {
          Notification.closeAll()
          this.$store.commit('Person/changeLogin')
          if (this.isAdmin) {
            this.$store.commit('Person/changeAdmin')
          }
          this.$store.commit('ShopCart/clear')
          this.$router.push('/home')
          this.$message.success(data)
        })
      },
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
    width: 500px;
    background-color: #fff;
  }
</style>