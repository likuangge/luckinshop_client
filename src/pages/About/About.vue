<template>
  <el-tabs :tab-position="tabPosition" style="height: 600px;">
    <el-tab-pane label="Account Settings">
      <h2>Account Settings</h2>
      <el-divider></el-divider>
      <el-container>
        <el-aside>
          <div v-if="!isUpload" style="text-align:center">
            <el-image :src=userAvatar style="width:278px;height:278px"></el-image>
            <el-button style="margin-top:30px" @click="beginUpload">Change your avatar</el-button>
          </div>
          <div v-else style="text-align:center">
            <el-upload class="avatar-uploader" action="/api/avatarUpload" :show-file-list="false" :on-success="onSuccess" :onError="onError" :before-upload="beforeUpload" :on-remove="onRemove" :http-request="picUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button v-show="endUpload" style="margin-top:16px" @click="finishUpload">Commit</el-button>
          </div>
        </el-aside>
        <el-main>
          <el-container>
            <el-main>
              <el-form :model="Modify" ref="Modify" :rules="modify_rules">
                Username
                <el-form-item prop="username">
                  <el-input v-model="Modify.username" class="accountInput" :placeholder=username clearable></el-input>
                </el-form-item>
                Telephone
                <el-form-item prop="telephone">
                  <el-input v-model="Modify.telephone" class="accountInput" :placeholder=telephone clearable></el-input>
                </el-form-item>
                Email
                <el-form-item prop="email">
                  <el-input v-model="Modify.email" class="accountInput" :placeholder=email clearable></el-input>
                </el-form-item>
              </el-form>
            </el-main>
            <el-footer style="margin-left:70px">
              <el-button @click.prevent="modify('Modify')">Update Profile</el-button>
            </el-footer>
          </el-container>
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="Order">配置管理</el-tab-pane>
    <el-tab-pane label="Credit">角色管理</el-tab-pane>
    <el-tab-pane label="Address">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>
<script>
  import {mapState} from 'vuex'
  import {modifyUserInfo,reqModifyCommit} from '../../api'
  import axios from 'axios'

  const url = "/api/pictures/"

  export default {
    data() {
      var Username = (rule, value, callback) => {
        if (value === ''){
          callback()
        } else if(value.length < 7 || value.length > 17){
          this.$alert('用户名长度为7到17个字符', '', {
            confirmButtonText: '确定'
          });
        } else {
          var flag = 0;
          var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
          for (var i = 0; i < value.length; i++) {
            if (specialKey.indexOf(value.substr(i, 1)) != -1) {
              this.$alert('用户名中不得含有非法字符', '', {
                confirmButtonText: '确定'
              });
              flag = 1;
              break;
            }
          }
          if(flag === 0){
            callback()
          }
        }
      }
      var Telephone = (rule, value, callback) => {
        if (value === ''){
          callback()
        } else {
          const telReg = /^1[3|4|5|6|7|8|9]\d{9}$/
          if (telReg.test(value)) {
            callback()
          } else {
            this.$alert('请输入正确的手机号码', '', {
              confirmButtonText: '确定'
            });
          }
        }
      }
      var Email = (rule, value, callback) => {
        if (value === ''){
          callback()
        } else {
          const emReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          if (emReg.test(value)) {
            callback()
          } else {
            this.$alert('请输入正确的邮箱地址', '', {
              confirmButtonText: '确定'
            });
          }
        }
      }
      return {
        tabPosition: 'left',
        imageUrl: '',
        isUpload: false,
        endUpload: false,
        Modify: {
          username: '',
          telephone: '',
          email: ''
        },
        modify_rules: {
          username: [{ validator: Username, trigger: 'blur'}],
          telephone: [{ validator: Telephone, trigger: 'blur'}],
          email: [{ validator: Email, trigger: 'blur'}]
        }
      }
    },
    computed: {
      ...mapState({
        userId: state=>state.Person.userId,
        username: state=>state.Person.username,
        telephone: state=>state.Person.telephone,
        email: state=>state.Person.email,
        avatar: state=>state.Person.avatar
      }),
      userAvatar: function(){
        let url = "/api/pictures/" + this.avatar
        return url
      },
    },
    methods: {
      modify(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyUserInfo({
              username: this.Modify.username,
              telephone: this.Modify.telephone,
              email: this.Modify.email
            }).then((data) => {
              this.$refs[formName].resetFields()
              this.$store.commit('Person/setUsername', data.username)
              this.$store.commit('Person/setTelephone', data.telephone)
              this.$store.commit('Person/setEmail', data.email)
            }).catch(() => {
              this.$message.error("登录失败，请检查网络连接")
            })
          }else {
            return false
          }
        })
      },
      beginUpload() {
        this.isUpload = true
      },
      finishUpload() {
        reqModifyCommit().then((data) => {
          this.imageUrl = ''
          this.isUpload = false
          this.endUpload = false
          this.$store.commit('Person/setAvatar', data)
        }).catch(() => {
          this.$message.error("登录失败，请检查网络连接")
        })
      },
      onSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.endUpload = true
      },
      onRemove() {
      },
      onError(err) {
        this.$message.error(err)
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      picUpload(data) {
        let file = data.file
        let url = '/api/avatarUpload'
        let formData = new FormData()
        formData.append("file",file)
        formData.append("role","user")
        formData.append("userId",this.userId)

        axios({
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8'
          },
          data:formData
        }).then((response) => {
          if(response.data != "修改的头像与之前的头像重复") {
            data.onSuccess(response.data)
          } else {
            data.onError(response.data)
          }
        })
      }
    }
  };
</script>

<style scoped>
  .accountInput {
    width:300px;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 100px;
    color: #8c939d;
    width: 250px;
    height: 290px;
    line-height: 300px;
  }
  .avatar {
    width: 300px;
    height: 290px;
    display: block;
  }
</style>