<template>
  <el-tabs :tab-position="tabPosition" @tab-click="handleClick" style="height: 700px;">
    <el-tab-pane label="个人中心">
      <el-row style="height:50px">
        <el-col :span="21">
          <h2>个人中心</h2>
        </el-col>
        <el-col :span="3">
          <el-popover placement="bottom" width="200" trigger="click">
            <el-form>
              原密码
              <el-form-item>
                <el-input v-model="currentPassword" clearable show-password></el-input>
              </el-form-item>
              新密码
              <el-form-item>
                <el-input v-model="newPassword" clearable show-password></el-input>
              </el-form-item>
              再次输入新密码
              <el-form-item>
                <el-input v-model="againNewPassword" clearable show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifyPassword">确认修改</el-button>
              </el-form-item>
            </el-form>
            <el-button style="margin-top:15px" type="primary" slot="reference">修改密码</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-container>
        <el-aside>
          <div v-if="!isUpload" style="text-align:center">
            <el-image :src=userAvatar style="width:278px;height:278px"></el-image>
            <el-button style="margin-top:30px" @click="beginUpload">Change your avatar</el-button>
          </div>
          <div v-else style="text-align:center">
            <el-upload class="avatar-uploader" action="/api/avatarUpload" :show-file-list="false" :on-success="onSuccess" :onError="onError" :on-remove="onRemove" :http-request="picUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button v-show="endUpload" style="margin-top:16px" @click="finishUpload">Commit</el-button>
          </div>
        </el-aside>
        <el-main>
          <el-container>
            <el-main>
              <el-form :model="Modify">
                Username
                <el-form-item>
                  <el-input v-model="Modify.username" class="accountInput" :placeholder="user.nickname" clearable></el-input>
                </el-form-item>
                Telephone
                <el-form-item>
                  <el-input v-model="Modify.telephone" class="accountInput" :placeholder="user.phoneNum" clearable></el-input>
                </el-form-item>
                Email
                <el-form-item>
                  <el-input v-model="Modify.email" class="accountInput" :placeholder="user.email" clearable></el-input>
                </el-form-item>
              </el-form>
            </el-main>
            <el-footer style="margin-left:70px">
              <el-button @click.prevent="modifyUserInfo">Update Profile</el-button>
            </el-footer>
          </el-container>
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="OCR" name="order">
      <h2>OCR</h2>
      <el-table :data=orderList style="width:100%" height="450" @expand-change="expandChange">
        <el-table-column type="index" fixed="left"></el-table-column>
        <el-table-column label="订单编号" prop="orderNo" width="200"></el-table-column>
        <el-table-column label="是否秒杀" prop="typeStr" width="100"></el-table-column>
        <el-table-column label="收货人姓名" prop="receiverName" width="100"></el-table-column>
        <el-table-column label="收货人手机" prop="phone" width="125"></el-table-column>
        <el-table-column label="收货人地址" prop="address" width="250"></el-table-column>
        <el-table-column label="参与满减活动金额" prop="fullReduction" width="150"></el-table-column>
        <el-table-column label="优惠券信息" prop="couponContent" width="150"></el-table-column>
      </el-table>
      <div style="text-align:center">
        <el-pagination layout="total,prev,pager,next,jumper" :total="totalOrder" :page-size="orderPageSize" :hide-on-single-page="hideOrderOnSinglePage" @current-change="handleOrderCurrentChange" :current-page.sync="currentOrderPage"></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="积分与余额详情" name="credit">
      <el-row>
        <el-col :span="5">
          <h2>积分与余额详情</h2>
        </el-col>
        <el-col :span="3">
          <el-tag style="margin-top:20px">当前积分:{{user.points}}</el-tag>
        </el-col>
        <el-col :span="3">
          <el-tag style="margin-top:20px">当前余额:{{user.balance}}</el-tag>
        </el-col>
        <el-col :span="2">
          <el-popover placement="bottom" width="150" trigger="click">
            <el-form>
              充值金额
              <el-form-item>
                <el-input v-model.number="balance" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="charge">确认充值</el-button>
              </el-form-item>
            </el-form>
            <el-button style="margin-top:15px" type="primary" slot="reference">充值</el-button>
          </el-popover>
        </el-col>
        <el-col :span="2">
          <el-popover placement="bottom" width="150" trigger="click">
            <el-form>
              兑换积分
              <el-form-item>
                <el-input v-model.number="change" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="exchange">确认兑换</el-button>
              </el-form-item>
            </el-form>
            <el-button style="margin-top:15px" type="primary" slot="reference">兑换</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-timeline>
        <div style="height:500px;overflow:auto">
          <el-timeline-item v-for="(creditInfo, index) in creditList" :key="index" :timestamp="creditInfo.time" hide-timestamp=true>
            <div>
              {{creditInfo.typeStr}}{{creditInfo.change}}
            </div>
            <div>
              {{creditInfo.timeStr}}
            </div>
          </el-timeline-item>
        </div>
      </el-timeline>
    </el-tab-pane>
    <el-tab-pane label="地址管理" name="address">
      <h2>我的收货地址</h2>
      <el-divider></el-divider>
      <el-table :data="allAddress" style="width: 100%">
        <el-table-column prop="receiver" label="收件人姓名" width="100"></el-table-column>
        <el-table-column prop="phoneNum" label="收件人手机" width="150"></el-table-column>
        <el-table-column prop="info" label="收件地址" width="300"></el-table-column>
        <el-table-column prop="defaultAddress" width="150">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.defaultAddress === 1">默认地址</el-tag>
            <el-link type="primary" v-else @click="setDefault(scope.row.addressNo)">设为默认地址</el-link>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click="modify(scope.row)">修改地址</el-link>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template slot-scope="scope">
            <el-link type="primary" @click="deleteAddress(scope.row.addressNo)">删除地址</el-link>
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
            <el-cascader v-model="ModifyAddress.pcd" :options="options" placeholder="请选择省\市\区" style="width:500px" clearable></el-cascader>
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
    <el-tab-pane name="comment" >
      <span slot="label" v-if="replyUnreadCount === 0">
        我的消息
      </span>
      <span slot="label" v-else>
        我的消息&nbsp
        <el-badge :value="replyUnreadCount" />
      </span>
      <h2>我的评价</h2>
      <el-tabs @tab-click="checkComment" v-model="activeComment">
        <el-tab-pane name="replied">
          <span slot="label" v-if="replyUnreadCount === 0">
            回复我的
          </span>
          <span slot="label" v-else>
            回复我的&nbsp
            <el-badge :value="replyUnreadCount" />
          </span>
          <div v-for="(comment,index) in commentList" :key="index">
            <el-row>
              <el-col :span="3">
                <el-avatar :src="picUrl(comment.userImage)" shape="square" :size="100"></el-avatar>
              </el-col>
              <el-col :span="21">
                <div>
                  {{comment.nickName}}
                  <el-image :src=navAvatar style="width:30px;height:15px" v-if="comment.readStatus === 0"></el-image>
                </div>
                <div>
                  {{comment.createTimeStr}}
                </div>
                <div class="message">
                  <p>{{comment.replyComment.commentContent}}</p>
                </div>
                <el-row>
                  <el-col :span="21">
                    {{comment.commentContent}}
                  </el-col>
                  <el-col :span="3"> 
                    <el-button @click="openReply(comment)">回复</el-button>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
              </el-col>
            </el-row>
          </div>
          <div style="text-align:center">
            <el-pagination layout="total,prev,pager,next,jumper" :total="totalComment" :page-size="commentPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleCommentCurrentChange" :current-page.sync="commentCurrentPage"></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我回复的" name="reply">
          <div v-for="(comment,index) in commentList" :key="index">
            <div class="message">
              回复:{{comment.replyUserNickName}}:{{comment.replyComment.commentContent}}
            </div>
            <div>
              {{comment.commentContent}}
            </div>
            <div>
              回复时间:{{comment.createTimeStr}}
            </div>
            <el-divider></el-divider>
          </div>
          <div style="text-align:center">
            <el-pagination layout="total,prev,pager,next,jumper" :total="totalComment" :page-size="commentPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleUncommentCurrentChange" :current-page.sync="commentCurrentPage"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-dialog :visible.sync="showInputReply" title="回复评论" center @close="closeReply">
      <div>
        回复[{{replyComment.nickName}}]:{{replyComment.commentContent}}
      </div>
      <div style="margin-top:20px">
        <el-input v-model="replyCommentContent" maxlength="30" show-word-limit></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reply">发表</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showRefundReason" title="选择退款原因" center @close="closeRefund">
      <div style="margin-left:100px">
        请选择取消原因
        <el-select v-model="cancelReason">
          <el-option v-for="(cancelReason,index) in cancelList" :key="index" :label="cancelReason.name" :value="cancelReason.index"></el-option>
        </el-select>
        <el-button type="primary" @click="applyRefund">确认取消</el-button>
      </div>
    </el-dialog>
  </el-tabs>
</template>
<script>
  import {mapState} from 'vuex'
  import {reqModifyUserInfo,reqModifyCommit,reqAddAddress,reqGetAddress,reqSetDefault,reqDeleteAddress,reqModifyAddress,reqGetOrder,reqCancelOrder,reqPay,reqReceive,reqCreditInfo,reqSysCancelOrder,reqSubmitComment,reqCommentCount,reqCommentProduct,reqModifyPassword,reqLogout,reqGetUserInfo,reqGetReplyComment,reqGetMemComment,reqCharge,reqExchange,reqReplyComment,reqGetCancelReason,reqApplyRefund,reqGetReplyUnreadCount} from '../../api'
  import axios from 'axios'
  import addressData from '../../assets/citys.json'
  import { Notification } from 'element-ui'

  const telReg = /^1[3|4|5|6|7|8|9]\d{9}$/
  const specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
  const emReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

  export default {
    data() {
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
          addressNo: '',
          receiver: '',
          telephone: '',
          pcd: [],
          detail: ''
        },
        orderList: [],
        creditList: [],
        activeComment: 'replied',
        commentList: [],
        rate: [],
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        commentText: [],
        productNo: [],
        cindex: '',
        modifyCommentVisible: false,
        modifyRate: null,
        modifyCommentText: '',
        totalComment: 0,
        hideOnSinglePage: false,
        commentPageSize: 3,
        currentPassword: '',
        newPassword: '',
        againNewPassword: '',
        orderPageSize: 5,
        totalOrder: 0,
        hideOrderOnSinglePage: false,
        currentOrderPage: 1,
        balance: '',
        change: '',
        showInputReply: false,
        replyComment: '',
        replyCommentContent: '',
        showRefundReason: false,
        cancelList: [],
        cancelReason: '',
        applyRefundOrder: '',
        commentCurrentPage: 1,
        replyUnreadCount: 0
      }
    },
    computed: {
      ...mapState({
        isLogin: state=>state.Person.isLogin,
        user: state=>state.Person.user,
        unreceiveOrder: state=>state.Order.unreceiveOrder
      }),
      userAvatar: function(){
        let url = "http://10.104.131.158/" + this.user.image
        return url
      },
      navAvatar: function(){
        let url = "http://10.104.131.158/new1.png"
        return url
      },
    },
    mounted() {
      reqGetReplyUnreadCount({
        userId: this.user.memberId
      }).then((data) => {
        this.replyUnreadCount = data.data
        console.log("count",this.replyUnreadCount)
      })
    },
    filters: {
      numFilter(value) {
        let realVal = parseFloat(value).toFixed(2)
        return realVal
      }
    },
    methods: {
      handleClick(tab, event) {
        this.activeComment = 'replied'
        reqGetFile({
          memberId: this.user.memberId,
          orderStatus: 0,
          page: 1,
          rows: this.orderPageSize
        }).then((data) => {
          this.totalOrder = data.data.total
          if(this.totalOrder <= this.orderPageSize) {
            this.hideOrderOnSinglePage = true
          }
          this.orderList = data.data.rows
        }).catch(() => {
            this.$message.error("获取订单失败")
        })
        if(tab.name === "credit") {
          reqCreditInfo(this.user.memberId).then((data) => {
            console.log("credit",data.data)
            this.creditList = data.data
          })
        }
        if(tab.name === "address") {
          reqGetAddress(this.user.memberId).then((data) => {
            this.allAddress = data.data
            console.log("address",data.data)
          }).catch(() => {
            this.$message.error("获取地址失败")
          })
        }
        if(tab.name === "comment") {
          reqGetReplyUnreadCount({
            userId: this.user.memberId
          }).then((data) => {
            this.replyUnreadCount = data.data
            console.log("count",this.replyUnreadCount)
            reqGetReplyComment({
              userId: this.user.memberId,
              page: 1,
              rows: this.commentPageSize
            }).then((data) => {
              console.log("comment",data.data)
              this.commentList = data.data.rows
              this.totalComment = data.data.total
              if(this.totalComment <= this.commentPageSize){
                this.hideOnSinglePage = true
              }
            }).catch(() => {
              this.$message.error("获取评价列表失败")
            })
          })
        }
      },
      change(e) {
        this.$forceUpdate()
      },
      picUrl(picName) {
        return "http://10.104.131.158/" + picName
      },
      modifyUserInfo() {
        if(this.Modify.username != '' || this.Modify.telephone != '' || this.Modify.email != '') {
          if(telReg.test(this.Modify.telephone) || this.Modify.telephone === '') {
            if(emReg.test(this.Modify.email) || this.Modify.email === '') {
              if(this.Modify.username === this.user.nickname) {
                this.Modify.username = ''
                this.$message.info("更改的用户昵称与现在的用户昵称相同")
              } else {
                if(this.Modify.telephone === this.user.phoneNum) {
                  this.Modify.telephone = ''
                  this.$message.info("更改的手机号码与现在的手机号码相同")
                } else {
                  if(this.Modify.email === this.user.email) {
                    this.Modify.email = ''
                    this.$message.info("更改的邮箱地址与现在的邮箱地址相同")
                  } else {
                    reqModifyUserInfo({
                      memberId: this.user.memberId,
                      nickname: this.Modify.username,
                      phoneNum: this.Modify.telephone,
                      email: this.Modify.email
                    }).then((data) => {
                      if(data.data > 0) {
                        this.$message.error("个人信息修改成功")
                        this.Modify.username = ''
                        this.Modify.telephone = ''
                        this.Modify.email = ''
                        reqGetUserInfo(this.user.memberId).then((data) => {
                          this.$store.commit('Person/login',data.data)
                        })
                      } else {
                        this.$message.error("个人信息修改失败")
                      }
                    }).catch(() => {
                      this.$message.error("登录失败，请检查网络连接")
                    })
                  }
                }
              }
            } else {
              this.Modify.email = ''
              this.$message.warning("请输入正确的邮箱地址")
            }
          } else {
            this.Modify.telephone = ''
            this.$message.warning("请输入正确的手机号码")
          }
        }
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
        reqSetDefault({
          memberId: this.user.memberId,
          addressNo: addressId
        }).then((data) => {
          if(data.success) {
            this.$message.success("设置默认地址成功!")
            reqGetAddress(this.user.memberId).then((data) => {
              this.allAddress = data.data
              console.log("address",data.data)
            }).catch(() => {
              this.$message.error("获取地址失败")
            })
          } else {
            this.$message.error("设置默认地址失败!")
          }
        }).catch(() => {
          this.$message.error("修改地址失败")
        })
      },
      deleteAddress(addressNo) {
        reqDeleteAddress(addressNo).then((data) => {
          reqGetAddress(this.user.memberId).then((data) => {
            this.allAddress = data.data
          }).catch(() => {
            this.$message.error("获取地址失败")
          })
        }).catch(() => {
          this.$message.error("删除地址失败")
        })
      },
      createAddress() {
        var isDefault = 0
        if(this.checked) {
          isDefault = 1
        }
        reqAddAddress({
          memberId: this.user.memberId,
          receiver: this.Address.receiver,
          phoneNum: this.Address.telephone,
          province: this.Address.pcd[0],
          city: this.Address.pcd[1],
          area: this.Address.pcd[2],
          detailAddress: this.Address.detail,
          defaultAddress: isDefault
        }).then(() => {
          this.addAddress = false
          this.Address.receiver = ''
          this.Address.telephone = ''
          this.Address.pcd = []
          this.Address.detail = ''
          this.checked = false
          reqGetAddress(this.user.memberId).then((data) => {
            this.allAddress = data.data
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
        this.ModifyAddress.addressNo = data.addressNo
        this.ModifyAddress.telephone = data.phoneNum
      },
      modifyAddress() {
        reqModifyAddress({
          addressNo: this.ModifyAddress.addressNo,
          receiver: this.ModifyAddress.receiver,
          phoneNum: this.ModifyAddress.telephone,
          province: this.ModifyAddress.pcd[0],
          city: this.ModifyAddress.pcd[1],
          area: this.ModifyAddress.pcd[2],
          detailAddress: this.ModifyAddress.detail
        }).then((data) => {
          if(data.success) {
            this.$message.success("修改地址成功")
            this.changeAddress = false
            this.ModifyAddress.pcd = []
            this.ModifyAddress.detail = ''
            reqGetAddress(this.user.memberId).then((data) => {
              this.allAddress = data.data
            }).catch(() => {
              this.$message.error("获取地址失败")
            })
          } else {
            this.$message.warning(data.statusInfo)
          }
        }).catch(() => {
          this.$message.error("修改地址失败")
        })
      },
      onModifyClose() {
        this.changeAddress = false
        this.ModifyAddress.pcd = []
        this.ModifyAddress.detail = ''
      },
      onModifyCancel() {
        this.changeAddress = false
        this.ModifyAddress.pcd = []
        this.ModifyAddress.detail = ''
      },
      checkOrder(tab,event) {
        this.activeOrder = tab.name
        this.currentOrderPage = 1
        reqGetOrder({
          memberId: this.user.memberId,
          orderStatus: tab.name,
          page: 1,
          rows: this.orderPageSize
        }).then((data) => {
          if(data.success) {
            this.totalOrder = data.data.total
            if(this.totalOrder <= this.orderPageSize) {
              this.hideOrderOnSinglePage = true
            }
            this.orderList = data.data.rows 
          }
        }).catch(() => {
          this.$message.error("获取订单失败")
        })
      },
      checkComment(tab,event) {
          if(tab.name === 'replied') {
            reqGetReplyComment({
              userId: this.user.memberId,
              page: 1,
              rows: this.commentPageSize
            }).then((data) => {
              console.log("comment",data.data)
              this.commentList = data.data.rows
              this.totalComment = data.data.total
              if(this.totalComment <= this.commentPageSize){
                this.hideOnSinglePage = true
              }
            }).catch(() => {
              this.$message.error("获取评价列表失败")
            })
          } else {
            reqGetMemComment({
              userId: this.user.memberId,
              page: 1,
              rows: this.commentPageSize
            }).then((data) => {
              console.log("comment",data.data)
              this.commentList = data.data.rows
              this.totalComment = data.data.total
              if(this.totalComment <= this.commentPageSize){
                this.hideOnSinglePage = true
              }
            }).catch(() => {
              this.$message.error("获取评价列表失败")
            })
          }
      },
      messageUnpaid() {
        return '您有' + this.unpaidOrder +'个未付款的订单！请到个人中心的订单中心继续付款!'
      },
      messageUnreceive() {
        return this.unreceiveOrder +'个未收货的订单！请到个人中心的订单中心确认收货!'
      },
      cancelOrder(orderNo) {
        reqCancelOrder({
          memberId: this.user.memberId,
          orderNo: orderNo
        }).then((data) => {
          if(data.success) {
            this.$message.success(data.statusInfo)
            reqGetOrder({
              memberId: this.user.memberId,
              orderStatus: 5,
              page: 1,
              rows: this.orderPageSize
            }).then((data) => {
              this.activeOrder = 5
              this.$store.commit('Order/minus')
              this.totalOrder = data.data.total
              if(this.totalOrder <= this.orderPageSize) {
                this.hideOrderOnSinglePage = true
              }
              this.orderList = data.data.rows
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
          }
        })
      },
      pay(orderNo) {
        reqPay({
          memberId: this.user.memberId,
          orderNo: orderNo
        }).then((data) => {
          if(data.success) {
            this.$message.success(data.statusInfo)
            reqGetOrder({
              memberId: this.user.memberId,
              orderStatus: 1,
              page: 1,
              rows: this.orderPageSize
            }).then((data) => {
              this.activeOrder = 1
              this.$store.commit('Order/minus')
              this.totalOrder = data.data.total
              if(this.totalOrder <= this.orderPageSize) {
                this.hideOrderOnSinglePage = true
              }
              this.orderList = data.data.rows
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
          } else {
            this.$message.warning(data.statusInfo)
          }
        })
      },
      receive(orderNo) {
        reqReceive({
          memberId: this.user.memberId,
          orderNo: orderNo
        }).then((data) => {
          if(data.success) {
            this.$message.success(data.statusInfo)
            this.activeOrder = 3
            reqGetOrder({
              memberId: this.user.memberId,
              orderStatus: 3,
              page: 1,
              rows: this.orderPageSize
            }).then((data) => {
              if(data.success) {
                this.totalOrder = data.data.total
                if(this.totalOrder <= this.orderPageSize) {
                  this.hideOrderOnSinglePage = true
                }
                this.orderList = data.data.rows 
              }
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          } else {
            this.$message.error(data.statusInfo)
          }
        })
      },
      submitComment(order) {
        var flag = 0;
        console.log(order.orderDetailDTOS)
        for(var i = 0;i < order.orderDetailDTOS.length;i++) {
          if(order.orderDetailDTOS[i].commentStar === null || order.orderDetailDTOS[i].commentContent === null) {
            flag = 1
            break
          }
        }
        if(flag === 1) {
          this.$message.warning("请评论订单内的全部商品（评分以及评价）！！！")
        } else {
          reqSubmitComment({
            memberId: this.user.memberId,
            orderNo: order.orderNo,
            orderDetailDTOS: order.orderDetailDTOS
          }).then((data) => {
            this.$message.success(data.statusInfo)
            this.activeOrder = 4
            reqGetOrder({
              memberId: this.user.memberId,
              orderStatus: 4,
              page: 1,
              rows: this.orderPageSize
            }).then((data) => {
              if(data.success) {
                this.totalOrder = data.data.total
                if(this.totalOrder <= this.orderPageSize) {
                  this.hideOrderOnSinglePage = true
                }
                this.orderList = data.data.rows 
              }
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          }).catch(() => {
            this.$message.error("提交评价失败!")
          })
        }
      },
      ModifyComment(comment,index) {
        this.modifyCommentVisible = true
        this.cindex = index
        this.modifyCommentText = comment
      },
      confirmModifyComment(commentId) {
        reqSubmitComment({
          commentId: commentId,
          rate: this.modifyRate,
          comment: this.modifyCommentText
        }).then((data) => {
          this.$message.success(data)
          this.modifyRate = null
          this.modifyCommentText = ''
          this.modifyCommentVisible = false
          reqCommentCount(this.userId,1).then((data) => {
            this.totalComment = data
            if(this.totalComment <= 2) {
              this.hideOnSinglePage = true
            }
            reqCommentProduct(this.userId,1,1,this.commentPageSize).then((data) => {
              this.activeComment = '1'
              this.commentList = data
            }).catch(() => {
              this.$message.error("获取已评价列表失败")
            })
          }).catch(() => {
            this.$message.error("获取已评价数量失败")
          })
        }).catch(() => {
          this.$message.error("提交评价失败!")
        })
      },
      handleUncommentCurrentChange(val) {
        reqGetMemComment({
          userId: this.user.memberId,
          page: val,
          rows: this.commentPageSize
        }).then((data) => {
            console.log("comment",data.data)
            this.commentList = data.data.rows
            this.totalComment = data.data.total
            if(this.totalComment <= this.commentPageSize){
              this.hideOnSinglePage = true
            }
          }).catch(() => {
            this.$message.error("获取评价列表失败")
          })
      },
      handleCommentCurrentChange(val) {
        reqGetReplyComment({
          userId: this.user.memberId,
          page: val,
          rows: this.commentPageSize
        }).then((data) => {
          console.log("comment",data.data)
          this.commentList = data.data.rows
          this.totalComment = data.data.total
          if(this.totalComment <= this.commentPageSize){
            this.hideOnSinglePage = true
          }
        }).catch(() => {
          this.$message.error("获取评价列表失败")
        })
      },
      modifyPassword() {
        if(this.currentPassword != '') {
          if(this.newPassword != '') {
            if(this.againNewPassword != '') {
              if(this.againNewPassword != this.newPassword) {
                this.$message.warning("两次输入的新密码不同")
              } else {
                reqModifyPassword({
                  memberId: this.user.memberId,
                  password: this.currentPassword,
                  newPassword: this.newPassword
                }).then(() => {
                  this.$message.success("修改密码成功!")
                  Notification.closeAll()
                  this.$store.commit('Person/logout')
                  this.$store.commit('ShopCart/clear')
                  this.$router.push('/home')
                })
              }
            } else {
              this.$message.warning("请再次填写新密码")
            }
          } else {
            this.$message.warning("请填写新密码")
          }
        } else {
          this.$message.warning("请填写原密码")
        }
      },
      handleOrderCurrentChange(val) {
        reqGetOrder({
          memberId: this.user.memberId,
          orderStatus: this.activeOrder,
          page: val,
          rows: this.orderPageSize
        }).then((data) => {
          if(data.success) {
            this.totalOrder = data.data.total
            if(this.totalOrder <= this.orderPageSize) {
              this.hideOrderOnSinglePage = true
            }
            this.orderList = data.data.rows 
          }
        }).catch(() => {
          this.$message.error("获取订单失败")
        })
      },
      expandChange(row, expandedRows) {
        console.log("row",row)
        console.log("expandedRows",expandedRows)
      },
      charge() {
        if(this.balance > 20000) {
          this.$message.warning("一次充值的限额为20000！")
        } else {
          reqCharge({
            memberId: this.user.memberId,
            balance: this.balance
          }).then((data) => {
            this.$message.success(data.statusInfo)
            reqGetUserInfo(this.user.memberId).then((data) => {
              this.$store.commit('Person/setUser',data.data)
            })
          })
        }
      },
      exchange() {
        if(this.change > this.user.points) {
          this.$message.warning("兑换的积分不能大于当前总积分!")
        } else {
          reqExchange({
            memberId: this.user.memberId,
            change: this.change
          }).then((data) => {
            this.$message.success(data.statusInfo)
            reqGetUserInfo(this.user.memberId).then((data) => {
              this.$store.commit('Person/setUser',data.data)
            })
            reqCreditInfo(this.user.memberId).then((data) => {
              console.log("credit",data.data)
              this.creditList = data.data
            })
          })
        }
      },
      openReply(comment) {
        this.showInputReply = true
        this.replyComment = comment
        console.log("comment",comment)
      },
      reply() {
        reqReplyComment({
          userId: this.user.memberId,
          commentContent: this.replyCommentContent,
          parentId: this.replyComment.id,
          replyId: this.replyComment.id
        }).then((data) => {
          this.$message.success(data.statusInfo)
          this.showInputReply = false
          this.replyCommentContent = ''
          reqProductComment({
            productNo: this.clickProduct.productNo,
            page: 1,
            rows: this.commentPageSize
          }).then((data) => {
            this.commentList = data.data.rows
            this.totalComment = data.data.total
            if(this.totalComment <= this.commentPageSize){
              this.hideOnSinglePage = true
            }
            this.isShowReply = -1
          }).catch(() => {
            this.$message.error("获取评价列表失败")
          })
        })
      },
      closeReply() {
        this.replyCommentContent = ''
      },
      ShowRefundReason(order) {
        this.showRefundReason = true
        this.applyRefundOrder = order
        reqGetCancelReason().then((data) => {
          this.cancelList = data.data
        })
      },
      applyRefund() {
        if(this.cancelReason != '') {
          reqApplyRefund({
            memberId: this.user.memberId,
            orderNo: this.applyRefundOrder.orderNo,
            cancelNo: this.cancelReason
          }).then((data) => {
            if(data.success) {
              this.activeOrder = 6;
              this.showRefundReason = false
              this.cancelReason = ''
              reqGetOrder({
                memberId: this.user.memberId,
                orderStatus: 6,
                page: 1,
                rows: this.orderPageSize
              }).then((data) => {
                if(data.success) {
                  console.log("order",data.data)
                  this.totalOrder = data.data.total
                  if(this.totalOrder <= this.orderPageSize) {
                    this.hideOrderOnSinglePage = true
                  }
                  this.orderList = data.data.rows 
                }
              }).catch(() => {
                this.$message.error("获取订单失败")
              })
            }
          })
        } else {
          this.$message.warning("请选择退款原因!")
        }
      },
      closeRefund() {
        this.cancelReason = ''
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
  .message {
    width: 500px;
    color: #00F;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
  }
</style>