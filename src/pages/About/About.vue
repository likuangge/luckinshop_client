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
    <el-tab-pane label="订单中心" name="order">
      <h2>订单中心</h2>
      <el-tabs @tab-click="checkOrder" v-model="activeOrder">
        <el-tab-pane v-for="(state,index) in orderState" :key="index" :label="state" :name="index">
          <el-table :data=orderList style="width:100%" height="500">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-row v-for="(product,index) in props.row.orderProducts" :key="index">
                  <el-col :span="6">
                    <el-avatar :src="picUrl(product.displayImage)" shape="square" :size="200"></el-avatar>
                  </el-col>
                  <el-col :span="4">
                    <div class="name">
                      {{product.productName}}
                    </div>
                    <div class="type">
                      {{product.typeName}}
                    </div>
                    <div class="type">
                      购买数量:{{product.count}}
                    </div>
                    <div style="margin-top:15px">
                      <el-tag v-for="(keyword,index) in product.keywords" :key="index" size="medium">{{keyword}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <!--div v-for="(property,index) in product.propertyName" :key="property" class="property">
                      {{property}}:{{product.propertyValue[index]}}
                    </div-->
                    <el-form inline class="demo-table-expand" label-width="80px">
                      <el-form-item v-for="(property,index) in product.propertyName" :key="index" :label=property>
                        <span>{{product.propertyValue[index]}}</span>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderId"></el-table-column>
            <el-table-column label="收货人姓名" prop="receiver"></el-table-column>
            <el-table-column label="收货人手机" prop="telephone"></el-table-column>
            <el-table-column label="收货人地址" prop="address"></el-table-column>
            <el-table-column label="订单创建时间" prop="createTime"></el-table-column>
            <el-table-column label="商品详情">请展开显示</el-table-column>
            <el-table-column v-if="index === 0" width="100">
              <template slot-scope="scope">
                <el-link type="primary" @click="pay(scope.row.orderId)">立即付款</el-link>
              </template>
            </el-table-column>
            <el-table-column v-if="index === 0" width="100">
              <template slot-scope="scope">
                <el-link type="primary" @click="cancelOrder(scope.row.orderId)">取消订单</el-link>
              </template>
            </el-table-column>
            <el-table-column v-if="index === 0">
              <template slot-scope="scope">
                剩余时间:{{scope.row.djs}}
              </template>
            </el-table-column>
            <el-table-column v-if="index === 2">
              <template slot-scope="scope">
                <el-button type="primary" @click="receive(scope.row.orderId)">确认收货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane label="积分详情" name="credit">
      <el-row>
        <el-col :span="3">
          <h2>积分详情</h2>
        </el-col>
        <el-col :span="4">
          <el-tag style="margin-top:20px">当前积分:{{currentCredit}}</el-tag>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-timeline>
        <el-timeline-item v-for="(creditInfo, index) in creditList" :key="index" :timestamp="creditInfo.changeTime">
          <div v-if="creditInfo.action === 0">
            增加{{creditInfo.credit}}
          </div>
          <div v-else>
            使用{{creditInfo.credit}}
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-tab-pane>
    <el-tab-pane label="地址管理" name="address">
      <h2>我的收货地址</h2>
      <el-divider></el-divider>
      <el-table :data="allAddress" style="width: 100%">
        <el-table-column prop="receiver" label="收件人姓名" width="100"></el-table-column>
        <el-table-column prop="telephone" label="收件人手机" width="150"></el-table-column>
        <el-table-column prop="province" label="省/自治区" width="100"></el-table-column>
        <el-table-column prop="city" label="市/城区" width="100"></el-table-column>
        <el-table-column prop="district" label="区/县" width="100"></el-table-column>
        <el-table-column prop="detail" label="详细地址" width="150"></el-table-column>
        <el-table-column prop="isDefault" width="100">
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
        <el-table-column width="100">
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
  import {modifyUserInfo,reqModifyCommit,reqAddAddress,reqGetAddress,reqSetDefault,reqDeleteAddress,reqModifyAddress,reqGetOrder,reqCancelOrder,reqGetTime,reqPay,reqReceive,reqCreditInfo} from '../../api'
  import axios from 'axios'
  import addressData from '../../assets/citys.json'
  import { Notification } from 'element-ui'

  function InitTime(endtime){
    var mm,ss = null
    var time = endtime
    if(time<=0){
      return '结束'
    }else{
      mm = Math.floor(time / 60);
      ss = time - mm*60;
      var str = mm+"分"+ss+"秒";
      return str;
    }
  }

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
        },
        activeOrder: 0,
        orderList: [],
        orderState: ['未付款','待发货','待收货','已完成','已取消'],
        time: [],
        timer: null,
        creditList: []
      }
    },
    computed: {
      ...mapState({
        isLogin: state=>state.Person.isLogin,
        userId: state=>state.Person.userId,
        username: state=>state.Person.username,
        telephone: state=>state.Person.telephone,
        email: state=>state.Person.email,
        avatar: state=>state.Person.avatar,
        unpaidOrder: state=>state.Order.unpaidOrder,
        unreceiveOrder: state=>state.Order.unreceiveOrder,
        currentCredit: state=>state.Person.currentCredit
      }),
      userAvatar: function(){
        let url = "/api/pictures/" + this.avatar
        return url
      },
    },
    mounted() {
      if(!this.isLogin) {
        this.$router.push('/home')
        this.$message.warning("请先登录")
      }
    },
    methods: {
      handleClick(tab, event) {
        if(tab.name === "order") {
          if(this.unpaidOrder > 0){
            this.activeOrder = 0
            reqGetOrder(0).then((data) => {
              let tempOrderList = data
              reqGetTime().then((timedata) => {
                this.time = timedata
                tempOrderList.map((obj,index)=>{
                  this.$set(obj,"restTime",this.time[index]);
                })
                tempOrderList.map((obj,index)=>{
                  this.$set(obj,"djs",InitTime(this.time[index]));
                })
                this.orderList = tempOrderList
                if(!this.timer) {
                  this.timer = setInterval(()=> {
                    for (var key in this.orderList) {
                      var rightTime = parseInt(this.orderList[key]["restTime"]);
                      if (rightTime > 0) {
                        var mm = Math.floor(rightTime/60);
                        var ss = rightTime - mm*60;
                      }
                      if(ss > 0 && ss <= 59) {
                        ss--
                        this.orderList[key]["restTime"]--
                        this.orderList[key]["djs"] = mm + "分" + ss + "秒";
                      }
                      if(ss === 0 && mm > 0 && mm <= 5) {
                        mm--
                        ss = 59
                        this.orderList[key]["restTime"]--
                        this.orderList[key]["djs"] = mm + "分" + ss + "秒";
                      } 
                      if(ss <= 0 && mm <= 0) {
                        clearInterval(this.timer);
                        this.timer = null;
                        mm = 0
                        ss = 0
                      }
                    }
                  }, 1000)
                }
              })
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          } else {
            this.activeOrder = 2;
            reqGetOrder(2).then((data) => {
              this.orderList = data
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          }
        }
        if(tab.name === "credit") {
          reqCreditInfo().then((data) => {
            this.creditList = data
          })
        }
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
      picUrl(picName) {
        return "/api/pictures/" + picName
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
      checkOrder(tab,event) {
        if(tab.name === 0) {
          reqGetOrder(0).then((data) => {
            let tempOrderList = data
            reqGetTime().then((timedata) => {
              this.time = timedata
              tempOrderList.map((obj,index)=>{
                this.$set(obj,"restTime",this.time[index]);
              })
              tempOrderList.map((obj,index)=>{
                this.$set(obj,"djs",InitTime(this.time[index]));
              })
              this.orderList = tempOrderList
              if(!this.timer) {
                this.timer = setInterval(()=> {
                  for (var key in this.orderList) {
                    var rightTime = parseInt(this.orderList[key]["restTime"]);
                    if (rightTime > 0) {
                      var mm = Math.floor(rightTime/60);
                      var ss = rightTime - mm*60;
                    }
                    if(ss > 0 && ss <= 59) {
                      ss--
                      this.orderList[key]["restTime"]--
                      this.orderList[key]["djs"] = mm + "分" + ss + "秒";
                    }
                    if(ss === 0 && mm > 0 && mm <= 5) {
                      mm--
                      ss = 59
                      this.orderList[key]["restTime"]--
                      this.orderList[key]["djs"] = mm + "分" + ss + "秒";
                    } 
                    if(ss <= 0 && mm <= 0) {
                      clearInterval(this.timer);
                      this.timer = null;
                      mm = 0
                      ss = 0
                    }
                  }
                }, 1000)
              }
            })
          }).catch(() => {
            this.$message.error("获取订单失败")
          })
        } else {
          reqGetOrder(tab.name).then((data) => {
            this.orderList = data
          }).catch(() => {
            this.$message.error("获取订单失败")
          })
        }
      },
      messageUnpaid() {
        return '您有' + this.unpaidOrder +'个未付款的订单！请到个人中心的订单中心继续付款!'
      },
      messageUnreceive() {
        return this.unreceiveOrder +'个未收货的订单！请到个人中心的订单中心确认收货!'
      },
      cancelOrder(orderId) {
        reqCancelOrder(orderId).then(() => {
          reqGetOrder(4).then((data) => {
            this.activeOrder = 4
            this.$store.commit('Order/minus')
            this.orderList = data
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
          }).catch(() => {
            this.$message.error("获取订单失败")
          })
        }).catch()
      },
      pay(orderId) {
        reqPay(orderId).then((data) => {
          reqGetOrder(1).then((data) => {
            this.activeOrder = 1
            this.$store.commit('Order/minus')
            this.orderList = data
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
          })
        }).catch(() => {

        })
      },
      receive(orderId) {
        reqReceive(orderId).then(() => {
          reqGetOrder(3).then((data) => {
            this.activeOrder = 3
            this.$store.commit('Order/unreceiveMinus')
            this.orderList = data
            Notification.closeAll()
            if(this.unreceiveOrder > 0) {
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
        })
      }
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
  .name{
    font-family: 等线;
    font-size: 24px;
  }
  .type{
    font-family: 仿宋;
    font-size: 20px;
    margin-top: 15px;
  }
  .property{
    font-family: 仿宋;
    font-size: 20px;
  }
  .demo-table-expand {
    font-family: 仿宋;
    font-size: 0;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>