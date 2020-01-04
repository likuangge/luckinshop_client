<template>
  <div class="product">
    <div style="cursor: pointer" @click="showDetail">
      <el-image :src="displayUrl" style="height:350px"></el-image>
    </div>
    <div class="name" @click="showDetail">{{product.productName}}</div>
    <div class="price" @click="showDetail" v-show="!isAdmin">
      价格:￥{{product.price}}
      <el-tooltip effect="dark" :content="product.stock.productNum" placement="top">
        <el-tag type="info" v-if="product.stock.productNum > 0">有库存</el-tag>
        <el-tag type="warning" v-else>无库存</el-tag>
      </el-tooltip>
    </div>
    <div style="height:50px">
      <el-tag v-for="(keyword,index) in product.keywords" :key="index" size="medium">{{keyword.keyword}}</el-tag>
    </div>
    <div>
      <el-container class="count">
        <el-button icon="el-icon-minus" @click="minus"></el-button>
        <el-input v-model="count"></el-input>
        <el-button icon="el-icon-plus" @click="plus"></el-button>
      </el-container>
      <el-row>
        <el-col :span="8">
          <div>
            <el-button type="info" icon="el-icon-star-off" v-if="product.flashSale === 0" @click="buy">立即购买</el-button>
            <el-tooltip effect="dark" :content="getZhe(product)" placement="top" v-else>
              <el-tag type="success">秒杀折扣</el-tag>
            </el-tooltip>
          </div>
        </el-col>
        <el-col :span="16">
          <div>
            <el-button type="primary" class="shopcart" @click="addtocart" v-if="product.flashSale === 0">加入购物车</el-button>
            <el-button type="primary" class="shopcart" @click="buy(product)" v-else>立即购买</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="秒杀确认" :visible.sync="secVisible" :before-close=onClose>
      <el-row>
        <el-col :span="12">
          <div>
            <el-row>
              <el-col :span="10" v-if="order != null">
                <el-image :src="picUrl(order.productDTO.displayImage)"></el-image>
              </el-col>
              <el-col :span="14">
                <div>
                  <div class="ordertype" v-if="order != null">{{order.productDTO.productType}}</div>
                  <div class="ordername" v-if="order != null">{{order.productDTO.productName}}</div>
                  <div class="ordermoney" v-if="order != null">
                    共{{this.count}}件,总计{{order.totalMoney | numFilter}}元
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="time">
            请选择配送地址
          </div>
          <div style="margin-top:25px">
            <div>
              <div>
                <el-radio-group v-model="selectAddress">
                  <div v-if="defaultAddress != null">
                    <el-radio :label=defaultAddress.addressNo>
                      <span>默认地址</span>
                      <div>
                        <span>{{defaultAddress.receiver}}</span><span></span>
                        <span>{{defaultAddress.phoneNum}}</span>
                      </div>
                      <div>
                        <span>{{defaultAddress.info}}</span>
                      </div>
                    </el-radio>
                  </div>
                  <div v-for="(address,index) in otherAddress" :key="index" style="margin-top:10px">
                    <el-radio :label=address.addressNo>
                      <span>{{address.receiver}}</span><span></span>
                      <span>{{address.phoneNum}}</span>
                      <div>
                        <span>{{address.info}}</span>
                      </div>
                    </el-radio>
                  </div>
                </el-radio-group>
              </div>
              <div>
                <div class="ordertotalmoney" v-if="order != null">
                  秒杀价格{{order.secKillMoney | numFilter}}元
                </div>
              </div>
              <div>
                <el-button type="success" @click="pay(product)" style="margin-left:200px">提交订单</el-button>
              </div>
            </div>
          </div>
        </el-col>      
      </el-row>
    </el-dialog>
    <el-dialog :visible.sync="isPay" title="付款" @close="payClose">
      <div style="font-size:40px">
        {{this.min}}分{{this.second}}秒后订单自动取消！
      </div>
      <div style="margin-top:50px">
        <el-button type="info" @click="finishPay">完成付款</el-button>
        <el-button type="warning" @click="cancelPay">取消订单</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {insertShopCart,reqInitShopCart,reqConfirmSecOrder,reqGetAddress,reqCreateSecOrder,reqPay,reqCancelOrder} from '../../api'
  import axios from 'axios'

  const MIN_COUNT = 1
  const TIME_COUNT = 59

  export default {
    name: "Products",
    props: {
      product: Object,
      index: Number,
    },
    data() {
      return {
        count: 1,
        secVisible: false,
        order: null,
        otherAddress: [],
        defaultAddress: null,
        selectAddress: '',
        min: '',
        second: '',
        timer: null,
        isPay: false,
        orderNo: ''
      }
    },
    computed: {
      ...mapState({
        isLogin:state=>state.Person.isLogin,
        user: state=>state.Person.user,
        shopcart: state=>state.ShopCart.products,
        activeType: state=>state.Products.activeType,
        unpaidOrder: state=>state.Order.unpaidOrder,
        types: state=>state.Products.productTypes
      }),
      displayUrl: function() {
        let url = "http://10.104.131.158/" + this.product.displayImage
        return url
      }
    },
    filters: {
      numFilter (value) {
        let realVal = parseFloat(value).toFixed(2)
        return realVal
      }
    },
    methods: {
      minus() {
        if(this.count > 1) {
          this.count--
        }
      },
      plus() {
        if(this.count < this.product.stock.productNum) {
          this.count++
        }
      },
      picUrl(picName) {
        return "http://10.104.131.158/" + picName
      },
      getZhe(product) {
        return product.secScale * 10 + "折"
      },
      showDetail() {
        console.log("点击",this.product)
        var flag = 0
        for(var i = 0;i < this.types.length;i++) {
          if(this.product.parentType === this.types[i].typeNo) {
            if(this.types[i].activity === 1) {
              flag = 1
              this.$store.commit('ClickProduct/updateActivity',1)
              this.$store.commit('ClickProduct/updateActivityContent',this.types[i].activityContent)
              break
            }
          }
        }
        if(flag === 0) {
          this.$store.commit('ClickProduct/updateActivity',0)
          this.$store.commit('ClickProduct/updateActivityContent','')
        }
        this.$store.commit('ClickProduct/changeClick')
        this.$store.commit('Products/updateActiveType',this.product.parentType)
        this.$store.commit('Products/updateActiveSecondType',this.product.productType)
        this.$store.commit('ClickProduct/updateClickProduct', this.product)
        this.$router.push('/products')
      },
      addtocart() {
        if(this.isLogin) {
          var flag = 0
          if(this.shopcart.length > 0) {
            for(var i = 0;i < this.shopcart.length;i++) {
              if(this.product.productNo === this.shopcart[i].productNo) {
                flag = 1
                break
              }
            }
          }
          if(flag === 1) {
            this.$message.warning("无法重复加入购物车")
          } else {
            insertShopCart({
              memberId: this.user.memberId,
              productNo: this.product.productNo,
              quantity: this.count,
              stock: this.product.stock.productNum
            }).then(() => {
              this.count = 1
              this.$message.success("成功加入购物车")
              reqInitShopCart({
                memberId: this.user.memberId
              }).then((data) => {
                this.$store.commit('ShopCart/displayShopCart', data.data)
              })
            }).catch(() => {
              this.$message.error("网络连接异常")
            })
          }
        } else {
          this.$message.warning("请先登录")
        }
      },
      buy(product) {
        if(this.user.status === 2) {
          this.$message.error("您已被禁用,无法购买商品。")
        } else {
          if(!this.isLogin) {
            this.$message.info("请先登录")
          } else {
            reqGetAddress(this.user.memberId).then((data) => {
              let address = data.data
              for(var i = 0;i < address.length;i++) {
                if(address[i].defaultAddress === 1) {
                  this.defaultAddress = address[i]
                  this.selectAddress = address[i].addressNo
                } else {
                  this.otherAddress.push(address[i])
                }
              }
            }).catch(() => {
              this.$message.error("获取地址失败")
            })
            reqConfirmSecOrder({
              memberId: this.user.memberId,
              productNo: product.productNo,
              quantity: this.count
            }).then((data) => {
              this.order = data.data
              this.secVisible = true
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          }    
        }
      },
      onClose() {
        this.$confirm('关闭窗口将自动取消订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '取消成功!'
          });
          this.selectAddress = ''
          this.defaultAddress = ''
          this.otherAddress = []
          this.secVisible = false
        }).catch(() => {});
      },
      pay(product) {
        reqCreateSecOrder({
          memberId: this.user.memberId,
          productNo: product.productNo,
          quantity: this.count,
          addressNo: this.selectAddress
        }).then((data) => {
          if(data.success) {
            this.orderNo = data.data
            if(!this.timer) {
              this.second = 0
              this.min = MIN_COUNT
              this.timer = setInterval(() => {
                if(this.second > 0 && this.second <= TIME_COUNT) {
                  this.second--
                }
                if(this.second === 0 && this.min > 0 && this.min <= MIN_COUNT) {
                  this.min--
                  this.second = TIME_COUNT;
                } 
                if(this.second === 0 && this.min === 0) {
                  this.isPay = false
                  this.$store.commit('Order/minus')
                  clearInterval(this.timer);
                  this.timer = null;
                  this.min = ''
                  this.second = ''
                }
              },1000)
            }
            console.log("order",this.order)
            this.$store.commit('Order/add')
            this.isPay = true
            this.secVisible = false
            this.defaultAddress = ''
            this.selectAddress = ''
            this.otherAddress = []
          } else {
            this.$message.warning(data.statusInfo)
            this.secVisible = false
            this.defaultAddress = ''
            this.selectAddress = ''
            this.otherAddress = []        
          }
        }).catch(() => {
          this.$message.error("创建订单失败")
        })
      },
      finishPay() {
        reqPay({
          memberId: this.user.memberId,
          orderNo: this.orderNo
        }).then((data) => {
          if(data.success) {
            this.$message.success(data.statusInfo)
            this.$store.commit('Order/minus')
            clearInterval(this.timer);
            this.timer = null;
            this.min = ''
            this.second = ''
            this.isPay = false
          } else {
            this.$message.warning(data.statusInfo)
          }
        })
      },
      cancelPay() {
        reqCancelOrder({
          memberId: this.user.memberId,
          orderNo: this.orderNo
        }).then(() => {
          this.$store.commit('Order/minus')
          clearInterval(this.timer);
          this.timer = null;
          this.min = ''
          this.second = ''
          this.isPay = false
        }).catch()
      },
      message() {
        return '您有' + this.unpaidOrder +'个未付款的订单！请到个人中心的订单中心继续付款!'
      },
      payClose() {
        clearInterval(this.timer);
        this.timer = null;
        this.min = ''
        this.second = ''
        Notification.closeAll()
        if(this.unpaidOrder > 0){
          this.$notify({
            title: '未付款!',
            dangerouslyUseHTMLString: true,
            message: this.message(),
            type:'warning',
            showClose: false,
            duration: 0,
            position: 'bottom-left'
          });
        }
      }
    }
  }
</script>
<style scoped>
  .product:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .product {
    width: 250px;
  }
  .name {
    font-family: Helvetica Neue;
    font-size: 24px;
    cursor: pointer;
  }
  .price {
    color: #F56C6C;
    font-size: 20px;
    cursor: pointer;
  }
  .count {
    margin-top:10px;
    margin-bottom :10px;
  }
  .shopcart {
    margin-left:50px;
  }
  .avatar {
    width: 250px;
    height: 250px;
    display: block;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:250px;
    height:250px;
    margin-left:175px;
  }
  .avatar-uploader-icon {
    font-size: 100px;
    color: #8c939d;
    width: 250px;
    height: 250px;
    line-height: 250px;
  }
  .ordertype{
    font-family: 仿宋;
    font-size: 20px;
    margin-top:20px;
  }
  .ordername{
    font-family: 等线;
    font-size: 24px;
    margin-top:20px;
  }
  .ordermoney{
    font-family: tohoma,arial;
    font-size: 15px;
  }
  .ordertotalmoney{
    font-weight: 500;
    font-size: 20px;
    font-family: tohoma,arial;
    margin-top: 20px
  }
  .time{
    font-family: 等线;
    font-size: 24px;
  }
</style>