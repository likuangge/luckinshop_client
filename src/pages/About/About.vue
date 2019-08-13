<template>
  <el-tabs :tab-position="tabPosition" @tab-click="handleClick" style="height: 600px;">
    <el-tab-pane label="个人中心">
      <h2>个人中心</h2>
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
    <el-tab-pane label="地址管理" name="address">
      <h2>我的收货地址</h2>
      <el-divider></el-divider>
      <el-table :data="allAddress" style="width: 100%">
        <el-table-column prop="receiver" label="收件人姓名" width="100"></el-table-column>
        <el-table-column prop="telephone" label="收件人手机" width="150"></el-table-column>
        <el-table-column prop="province" label="省/自治区" width="100"></el-table-column>
        <el-table-column prop="city" label="市/城区" width="100"></el-table-column>
        <el-table-column prop="district" label="区/县" width="100"></el-table-column>
        <el-table-column prop="detail" label="详细地址" width="300"></el-table-column>
        <el-table-column prop="isDefault" width="120">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.isDefault">默认地址</el-tag>
            <el-link type="primary" v-else @click="setDefault(scope.row.addressId)">设为默认地址</el-link>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click="modify(scope.row)">修改地址</el-link>
          </template>
        </el-table-column>
        <el-table-column width="300">
          <template slot-scope="scope">
            <el-link type="primary" @click="deleteAddress(scope.row.addressId)">删除地址</el-link>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-button type="primary" @click="addAddress = true">添加地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="addAddress" title="添加地址" center @close="onClose">
        <el-form :model="Address" label-width="100px">
          <el-form-item label="收货人姓名">
            <el-input v-model="Address.receiver" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="收货人电话">
            <el-input v-model="Address.telephone" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="收获地址">
            <el-cascader v-model="Address.pcd" :options="options" @change="handleChange" placeholder="请选择省\市\区" style="width:460px" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-input type="textarea" v-model="Address.detail" placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="checked">设为默认地址</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createAddress('Address')">立即创建</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="changeAddress" title="修改地址" center @close="onModifyClose">
        <el-form :model="ModifyAddress" label-width="100px">
          <el-form-item label="收货人姓名">
            <el-input v-model="ModifyAddress.receiver" style="width:500px" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="收货人电话">
            <el-input v-model="ModifyAddress.telephone" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="收获地址">
            <el-cascader v-model="ModifyAddress.pcd" :options="options" placeholder="请选择省\市\区" style="width:460px" clearable></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" v-model="ModifyAddress.detail" placeholder="详细地址"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="modifyAddress('ModifyAddress')">确认修改</el-button>
          <el-button @click="onModifyCancel">取消</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import {mapState} from 'vuex'
  import {modifyUserInfo,reqModifyCommit,reqAddAddress,reqGetAddress,reqSetDefault,reqDeleteAddress,reqModifyAddress} from '../../api'
  import axios from 'axios'
  import addressData from '../../assets/citys.json'

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
        options: addressData,
        checked: false,
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
        },
        allAddress: [],
        addAddress: false,
        changeAddress: false,
        Address: {
          name: '',
          telephone: '',
          pcd: [],
          detail: ''
        },
        ModifyAddress: {
          id: '',
          name: '',
          telephone: '',
          pcd: [],
          detail: ''
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
      handleClick(tab, event) {
        if(tab.name === "address") {
          reqGetAddress().then((data) => {
            this.allAddress = data
          }).catch(() => {
            this.$message.error("获取地址失败")
          })
        }
      },
      change(e) {
        this.$forceUpdate()
      },
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
      },
      setDefault(addressId) {
        reqSetDefault(addressId).then((data) => {
          this.allAddress = data
        }).catch(() => {
          this.$message.error("修改地址失败")
        })
      },
      deleteAddress(addressId) {
        reqDeleteAddress(addressId).then((data) => {
          this.allAddress = data
        }).catch(() => {
          this.$message.error("删除地址失败")
        })
      },
      createAddress(modelName) {
        reqAddAddress({
          receiver: this.Address.receiver,
          telephone: this.Address.telephone,
          province: this.Address.pcd[0],
          city: this.Address.pcd[1],
          district: this.Address.pcd[2],
          detail: this.Address.detail,
          isDefault: this.checked
        }).then(() => {
          this.addAddress = false
          this.Address.receiver = ''
          this.Address.telephone = ''
          this.Address.pcd = []
          this.Address.detail = ''
          this.checked = false
          reqGetAddress().then((data) => {
            this.allAddress = data
          }).catch(() => {
            this.$message.error("获取地址失败")
          })
        }).catch(() => {
          this.$message.error("添加地址失败")
        })
      },
      onClose() {
        this.addAddress = false
        this.Address.receiver = ''
        this.Address.telephone = ''
        this.Address.pcd = []
        this.Address.detail = ''
        this.checked = false
      },
      onCancel() {
        this.addAddress = false
        this.Address.receiver = ''
        this.Address.telephone = ''
        this.Address.pcd = []
        this.Address.detail = ''
        this.checked = false
      },
      modify(data) {
        this.changeAddress = true
        this.ModifyAddress.receiver = data.receiver
        this.ModifyAddress.id = data.addressId
        this.ModifyAddress.telephone = data.telephone
        this.ModifyAddress.detail = data.detail
      },
      modifyAddress(modelName) {
        reqModifyAddress({
          addressId: this.ModifyAddress.id,
          receiver: this.ModifyAddress.receiver,
          telephone: this.ModifyAddress.telephone,
          province: this.ModifyAddress.pcd[0],
          city: this.ModifyAddress.pcd[1],
          district: this.ModifyAddress.pcd[2],
          detail: this.ModifyAddress.detail
        }).then(() => {
          this.changeAddress = false
          this.ModifyAddress.pcd = []
          reqGetAddress().then((data) => {
            this.allAddress = data
          }).catch(() => {
            this.$message.error("获取地址失败")
          })
        }).catch(() => {
          this.$message.error("添加地址失败")
        })
      },
      onModifyClose() {
        this.changeAddress = false
        this.ModifyAddress.pcd = []
      },
      onModifyCancel() {
        this.changeAddress = false
        this.ModifyAddress.pcd = []
      },
    }
  }
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