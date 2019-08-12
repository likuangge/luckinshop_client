<template>
  <el-menu :class="el-menu-demo" mode="horizontal">
    <el-menu-item class="title"><a href="/"><i class="el-icon-s-home"></i>Luckin Shop</a></el-menu-item>
    <el-menu-item>
      <div style="margin-left:175px">
        <el-input placeholder="请输入商品名称" v-model="input" class="input-with-select" :disabled="select === '全部商品' || !select">
          <el-select v-model="select" slot="prepend" placeholder="全部商品">
            <el-option v-for="(type,index) in types" :key="index" :label="type" :value="type"></el-option>
            <el-option label="全部商品" value="全部商品"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="Select"></el-button>
        </el-input>
      </div>
    </el-menu-item>
    <el-menu-item class="login">
      <i v-show="!isLogin" class="el-icon-user-solid"></i>
      <i v-show="isLogin && isAdmin" class="el-icon-user-solid"></i>
      <el-image v-show="isLogin && !isAdmin" :src=navAvatar style="width:25px;height:25px"></el-image>
      <el-button @click="loginFormVisible = true" v-if="!isLogin">请登录</el-button>
      <el-dropdown v-else @command="handleCommand">
        <span class="el-dropdown-link">
          {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
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
            <div>
              <i class="el-icon-switch-button"></i>
              Sign Out
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog title="请先登录" :visible.sync="loginFormVisible" center>
        <el-form :model="SignIn" class="input" ref="SignIn" :rules="signin_rules">
          <el-form-item prop="account">
            <el-input class="accountInput" v-model="SignIn.account" placeholder="请输入手机号或者邮箱地址" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="accountInput" v-model="SignIn.password" placeholder="请输入密码" clearable show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-link type="primary" @click="showAdminForm">管理员登录</el-link>
          </el-form-item>
          <el-form-item>
            <el-link type="primary" @click="Login='FindPassword'">忘记密码？</el-link>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="signin('SignIn')">登录</el-button>
          <el-button type="primary" @click="Login='SignUp'">没有账号？请注册</el-button>
        </div>
      </el-dialog>
      <el-dialog title="管理员登录" :visible.sync="adminFormVisible" center>
        <el-form :model="AdminSignIn" class="input" ref="AdminSignIn" :rules="adminsignin_rules">
          <el-form-item prop="account">
            <el-input class="accountInput" v-model="AdminSignIn.account" placeholder="请输入管理员账号" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="accountInput" v-model="AdminSignIn.password" placeholder="请输入密码" clearable show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent="adminsignin('AdminSignIn')">登录</el-button>
        </div>
      </el-dialog>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import {mapState} from 'vuex'
  import {userLogin,adminLogin,reqInitShopCart} from '../../api'

  export default {
    data() {
      var Account = (rule, value, callback) => {
        if (value === ''){
          this.$alert('请输入手机号码或者邮箱地址', '', {
            confirmButtonText: '确定'
          });
        } else {
          const telReg = /^1[3|4|5|6|7|8|9]\d{9}$/
          if (telReg.test(value)) {
            callback()
          } else {
            const emReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            if(emReg.test(value)) {
              callback()
            } else {
              this.$alert('请输入正确的手机号码或者邮箱地址', '', {
                confirmButtonText: '确定'
              });
            }
          }
        }
      }
      var AdminAccount = (rule, value, callback) => {
        if (value === ''){
          this.$alert('请输入管理员账号', '', {
            confirmButtonText: '确定'
          });
        } else {
          callback()
        }
      }
      var Password =  (rule, value, callback) => {
        if (value === ''){
          this.$alert('请输入密码', '', {
            confirmButtonText: '确定'
          });
        } else {
          callback()
        }
      }
      return {
        loginFormVisible: false,
        adminFormVisible: false,
        input: '',
        select: '',
        url: '/api/pictures/user_1.JPG',
        SignIn: {
          account: '',
          password: ''
        },
        AdminSignIn: {
          account: '',
          password: ''
        },
        signin_rules: {
          account: [{ validator: Account, trigger: 'blur'}],
          password: [{ validator: Password, trigger: 'blur'}]
        },
        adminsignin_rules: {
          account: [{ validator: AdminAccount, trigger: 'blur'}],
          password: [{ validator: Password, trigger: 'blur'}]
        },
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
        types: state=>state.Products.productTypes
      }),
      navAvatar: function(){
        let url = "/api/pictures/" + this.avatar
        return url
      },
    },
    methods: {
      handleCommand(command){
        this.$router.push(command)
      },
      showAdminForm(){
        this.adminFormVisible = true
        this.loginFormVisible = false
      },
      signin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            adminLogin({
              account: this.SignIn.account,
              password: this.SignIn.password,
              role: 'common_user'
            }).then((data) => {
              if (data.isLogin) {
                this.loginFormVisible = false
                reqInitShopCart().then((data) => {
                  this.$store.commit('ShopCart/displayShopCart', data)
                })
                this.$store.commit('Person/changeLogin')
                this.$store.commit('Person/setUserId', data.userId)
                this.$store.commit('Person/setUsername', data.username)
                this.$store.commit('Person/setTelephone', data.telephone)
                this.$store.commit('Person/setEmail', data.email)
                this.$store.commit('Person/setAvatar', data.avatar)
              } else {
                this.SignIn.password = ''
                this.$message.error(data.message)
                return false
              }
            }).catch(() => {
              this.$message.error("登录失败，请检查网络连接")
            })
          }else {
            return false
          }
        })
      },
      adminsignin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            userLogin({
              account: this.AdminSignIn.account,
              password: this.AdminSignIn.password,
              role: 'admin'
            }).then((data) => {
              console.log("Come into AdminLogin", data.role)
              if (data.isLogin) {
                this.adminFormVisible = false
                this.$store.commit('Person/changeAdmin')
                this.$store.commit('Person/changeLogin')
                this.$store.commit('Person/setUsername', data.username)
                this.$router.push('/home')
              } else {
                this.SignIn.password = ''
                this.$message.error(data.message)
                return false
              }
            }).catch(() => {
              this.$message.error("登录失败，请检查网络连接")
            })
          }else {
            return false
          }
        })
      },
      Select() {
        if(this.select === '' || this.select === '全部商品') {
          this.$store.dispatch('Products/getPropertyName', '家用电器')
          this.$store.dispatch('Products/getProducts', '家用电器')
          this.$store.commit('Products/updateActiveType', '家用电器')
        } else {
          this.$store.dispatch('Products/getPropertyName', this.select)
          this.$store.dispatch('Products/getProducts', this.select)
          this.$store.commit('Products/updateActiveType', this.select)
        }
        this.$router.push('/products')
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
    width:300px;
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