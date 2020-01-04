<template>
    <div>
        <transition name="shopcart">
            <div v-show="showShopCart" class="shopcart">
                <div v-show="products.length">
                    <el-container>
                        <el-aside width="85px">
                            <div style="margin-left:5px">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            </div>
                            <div style="margin-top:16px;margin-left:5px">
                                <el-checkbox-group v-model="orderList" @change="handleCheckedOrderChange">
                                    <div v-for="(product, index) in products" :key="index" style="margin-bottom:138px">
                                        <el-checkbox :label="product.productNo" :disabled="product.stock === 0">
                                            <el-tooltip effect="dark" :content=product.stock placement="right-end">
                                                <el-tag v-if="product.stock > 0" type="info" size="mini">有库存</el-tag>
                                                <el-tag v-else type="warning" size="mini">无库存</el-tag>
                                            </el-tooltip>
                                        </el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </div>
                        </el-aside>
                        <el-main>
                            <div v-for="(product, index) in products" :key="index">
                                <el-row>
                                    <el-col :span="7">
                                        <el-image :src="picUrl(product.displayImage)" style="width:100px;height:125px"></el-image>
                                    </el-col>
                                    <el-col :span="13">
                                        <el-container>
                                            <el-main>
                                                <div class="type">{{product.typeName}}</div>
                                                <div class="name">{{product.productName}}</div>
                                            </el-main>
                                            <el-footer>
                                                <div>
                                                    <el-button icon="el-icon-plus" @click="add(product.quantity,product.stock,index,product.productNo)" size="mini"></el-button>
                                                    {{product.quantity}}
                                                    <el-button icon="el-icon-minus" @click="substract(index,product.productNo)" size="mini" :disabled="product.quantity === 1"></el-button>
                                                    </div>
                                            </el-footer>
                                        </el-container>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="money">
                                            ￥{{product.quantity * product.price | numFilter}}
                                        </div>
                                    </el-col>
                                </el-row>
                                <div style="margin-left:320px">
                                    <i class="el-icon-delete" style="cursor:pointer" @click="deleteProduct(product.productNo,index)"></i>
                                </div>
                            </div>
                        </el-main>
                    </el-container>
                    <el-row v-show="total.total_money!=0" style="margin-top:10px">
                        <el-col :span="12">
                            <el-row>
                                <el-col :span="7" class="totaltxt">总计</el-col>
                                <el-col :span="6" class="totalmoney">￥{{total.total_money | numFilter}}</el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <el-button style="margin-left:120px" type="info" @click="submitOrder" :disabled="this.orderList.length === 0">提交订单</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div v-show="products.length === 0">
                    <div style="text-align:center;margin-top:30px">
                        <i class="el-icon-shopping-cart-2"></i>
                        购物车为空
                    </div>
                </div>
            </div>
        </transition>
        <transition name="shopcart">
            <div class="float wrap" @click="showShopCart = !showShopCart" v-show="showShopCart">
                <el-badge :value="total.total_products" class="center" :hidden="total.total_products === 0">
                    <i v-if="total.total_products === 0" class="el-icon-shopping-cart-2"></i>
                    <i v-else class="el-icon-shopping-cart-full"></i>
                </el-badge>
            </div>
        </transition>
        <transition name="float">
            <div class="shopcart-float wrap" @click="showShopCart = !showShopCart" v-show="!showShopCart">
                <el-badge :value="total.total_products" class="center" :hidden="total.total_products === 0">
                    <i class="el-icon-shopping-cart-2"></i>
                </el-badge>
            </div>
        </transition>
        <el-dialog title="订单确认" :visible.sync="orderVisible" :before-close=onClose>
            <el-row>
                <el-col :span="12">
                    <div v-for="(product, index) in order.shopCartDTOS" :key="index">
                        <el-row>
                            <el-col :span="10">
                                <el-image :src="picUrl(product.displayImage)"></el-image>
                            </el-col>
                            <el-col :span="14">
                                <div>
                                    <div class="ordertype">{{product.typeName}}</div>
                                    <div class="ordername">{{product.productName}}</div>
                                    <div class="orderCondition">{{product.activityContent}}</div>
                                    <div class="ordermoney">
                                        共{{product.quantity}}件,合计{{product.quantity*product.price | numFilter}}元
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
                        <div v-if="!addressVisible">
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
                            <el-link type="primary" icon="el-icon-plus" @click="addAddress">添加地址</el-link>
                            <div class="pay">
                                请选择优惠券
                            </div>
                            <div>
                                <div>
                                    <el-radio v-model="paymethod" label="0" :disabled="couponList.length === 0">
                                        请选择使用的优惠券
                                        <div>
                                            <el-select v-model="coupon" :disabled="paymethod === '1'">
                                                <el-option v-for="(coupon,index) in couponList" :key="index" :label="showCoupon(coupon)" :value="coupon.membersNo"></el-option>
                                            </el-select>
                                        </div>
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio v-model="paymethod" label="1" @change="notUseCoupon()">不使用优惠券</el-radio>
                                </div>
                            </div>
                            <div class="orderFull">
                                {{order.campaignsInfo}}
                            </div>
                            <div>
                                <div class="ordertotalmoney" v-if="coupon != ''">
                                    共需<span style="text-decoration:line-through;margin-left:5px">{{order.totalMoney - order.fullReduction | numFilter}}</span><span style="margin-left:5px">{{order.totalMoney - order.fullReduction - getDiscount(coupon) | numFilter}}</span>元
                                </div>
                                <div class="ordertotalmoney" v-else>
                                    共需{{order.totalMoney - order.fullReduction | numFilter}}元
                                </div>
                            </div>
                            <div>
                                <el-button type="success" @click="pay" style="margin-left:200px">提交订单</el-button>
                            </div>
                        </div>
                        <el-form :model="Address" v-else>
                            <el-form-item label="收货人姓名">
                                <el-input v-model="Address.receiver" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="收货人电话">
                                <el-input v-model="Address.telephone"></el-input>
                            </el-form-item>
                            <el-form-item label="收获地址">
                                <el-cascader v-model="Address.pcd" :options="options" placeholder="请选择省\市\区" clearable></el-cascader>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input type="textarea" v-model="Address.detail" placeholder="详细地址"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-checkbox v-model="checked">设为默认地址</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="createAddress()">立即创建</el-button>
                                <el-button @click="onCancel">取消</el-button>
                            </el-form-item>
                        </el-form>
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
    import axios from 'axios'
    import {reqEditShopCart,reqSubmitOrder,reqAddAddress,reqGetAddress,reqCreateOrder,reqCancelOrder,reqPay,reqSysCancelOrder,reqInitShopCart,reqGetCoupon} from '../../api'
    import addressData from '../../assets/citys.json'
    import { Notification } from 'element-ui'

    const MIN_COUNT = 1
    const TIME_COUNT = 59

    export default {
        name: "ShopCart",
        data() {
            return {
                options: addressData,
                addressVisible: false,
                checked: false,
                showShopCart: false,
                order: '',
                orderList: [],
                checkAll: false,
                isIndeterminate: false,
                orderVisible: false,
                Address: {
                    receiver: '',
                    telephone: '',
                    pcd: [],
                    detail: ''
                },
                otherAddress: [],
                defaultAddress: null,
                selectAddress: '',
                paymethod: '1',
                isPay: false,
                min: '',
                second: '',
                timer: null,
                coupon: '',
                couponList: []
            }
        },
        filters: {
            numFilter (value) {
                let realVal = parseFloat(value).toFixed(2)
                return realVal
            }
        },
        computed: {
            ...mapState({
                user: state=>state.Person.user,
                products: state =>state.ShopCart.products,
                isLogin: state=>state.Person.isLogin,
                unpaidOrder: state=>state.Order.unpaidOrder
            }),
            total() {
                let total_money = 0;
                let total_products = 0;
                this.products.forEach((product) => {
                    total_money += product.quantity * product.price
                    total_products += product.quantity
                })
                return {total_money,total_products}
            }
        },
        methods: {
            change(e) {
                this.$forceUpdate()
            },
            showCoupon(coupon) {
                return coupon.tag + ":" + coupon.name
            },
            notUseCoupon() {
                this.coupon = ''
            },
            getDiscount(coupon) {
                for(var i = 0;i < this.couponList.length;i++) {
                    if(coupon === this.couponList[i].membersNo) {
                        return this.couponList[i].discount
                    }
                }
                return 0
            },
            picUrl(picName) {
                return "http://10.104.131.158/" + picName
            },
            deleteProduct(productNo,index) {
                reqEditShopCart({
                    memberId: this.user.memberId,
                    productNo: productNo,
                    type: 2
                }).then(() => {
                    this.$store.commit('ShopCart/deleteProduct',index)
                }).catch(() => {
                    this.$message.error("购物车删除商品失败")
                })
            },
            handleCheckedOrderChange(value) {
                let checkedCount = value.length;
                let num = 0
                for(var i = 0;i < this.products.length;i++) {
                    if(this.products[i].stock != 0) {
                        num++
                    }
                }
                this.checkAll = checkedCount === num;
                this.isIndeterminate = checkedCount > 0 && checkedCount < num;
            },
            handleCheckAllChange(val) {
                if(val){
                    this.orderList = []
                    for(var i = 0;i < this.products.length;i++){
                        if(this.products[i].stock > 0) {
                            this.orderList.push(this.products[i].productNo)
                        }
                    }
                } else {
                    this.orderList = []
                }
                this.isIndeterminate = false;
            },
            add(count,stock,index,productNo) {
                if (count < stock) {
                    reqEditShopCart({
                        memberId: this.user.memberId,
                        productNo: productNo,
                        type: 0
                    }).then(() => {
                        this.$store.commit('ShopCart/add',index)
                    }).catch(() => {
                        this.$message.error("增加数量失败")
                    })
                } else {
                    this.$message.error("超过库存")
                }
            },
            substract(index,productNo) {
                reqEditShopCart({
                    memberId: this.user.memberId,
                    productNo: productNo,
                    type: 1
                }).then(() => {
                    this.$store.commit('ShopCart/substract',index)
                }).catch(() => {
                    this.$message.error("减少数量失败")
                })  
            },
            submitOrder() {
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
                        reqGetCoupon(this.user.memberId).then((data) => {
                            console.log("coupon",data.data)
                            this.couponList = data.data
                        })
                        reqSubmitOrder({
                            memberId: this.user.memberId,
                            productNos: this.orderList
                        }).then((data) => {
                            if(data.success) {
                                this.order = data.data
                                this.orderVisible = true
                            } else {
                                var product = null
                                var index = -1
                                for(var i = 0;i < this.products.length;i++) {
                                    if(data.statusInfo === this.products[i].productNo) {
                                        product = this.products[i]
                                        index = i
                                        break
                                    }
                                }
                                this.$message.error("属于" + product.typeName + "的商品" + product.productName + "已经下架或者正在进行秒杀！")
                                reqEditShopCart({
                                    memberId: this.user.memberId,
                                    productNo: product.productNo,
                                    type: 2
                                }).then(() => {
                                    this.$store.commit('ShopCart/deleteProduct',index)
                                    for(var j = 0;j < this.orderList.length;j++) {
                                        if(product.productNo === this.orderList[j]) {
                                            this.orderList.splice(j,1);
                                            this.checkAll = this.orderList.length === this.products.length
                                            this.isIndeterminate = this.orderList.length > 0 && this.orderList.length < this.products.length
                                            break;
                                        }
                                    }
                                }).catch(() => {
                                    this.$message.error("购物车删除商品失败")
                                })
                            }
                        }).catch(() => {
                            this.$message.error("获取订单失败")
                        })
                    }    
                }
            },
            addAddress() {
                this.addressVisible = true
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
                }).then((data) => {
                    if(data.success) {
                        this.$message.success("创建地址成功!")
                        this.selectAddress = ''
                        this.defaultAddress = ''
                        this.otherAddress = []
                        this.addressVisible = false
                        this.Address.receiver = ''
                        this.Address.telephone = ''
                        this.Address.pcd = []
                        this.Address.detail = ''
                        this.checked = false
                        this.addressVisible = false
                        reqGetAddress(this.user.memberId).then((data) => {
                            let address = data.data
                            console.log("address",address)
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
                    } else {
                        this.$message.warning("创建地址失败!")
                    }
                }).catch(() => {
                    this.$message.success("传输失败")
                })
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
                    this.addressVisible = false
                    this.orderVisible = false
                    this.orderList = []
                    this.checkAll = false
                    this.isIndeterminate = false
                    this.Address.receiver = ''
                    this.Address.telephone = ''
                    this.Address.pcd = []
                    this.Address.detail = ''
                    this.checked = false
                    this.paymethod = '1'
                    this.coupon = ''
                }).catch(() => {});
            },
            onCancel() {
                this.addressVisible = false
                this.Address.receiver = ''
                this.Address.telephone = ''
                this.Address.pcd = []
                this.Address.detail = ''
                this.checked = false
            },
            pay() {
                var productNos = []
                for(var i = 0;i < this.order.shopCartDTOS.length;i++) {
                    productNos.push(this.order.shopCartDTOS[i].productNo)
                }
                var selectCoupon = null
                for(var i = 0;i < this.couponList.length;i++) {
                    if(this.coupon === this.couponList[i].membersNo) {
                        selectCoupon = this.couponList[i]
                        break
                    }
                }
                reqCreateOrder({
                    memberId: this.user.memberId,
                    productNos: productNos,
                    addressNo: this.selectAddress,
                    couponDTO: selectCoupon
                }).then((data) => {
                    if(data.success) {
                        this.order = data.data
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
                            }, 1000)
                        }
                        this.$store.commit('Order/add')
                        this.isPay = true
                        this.orderVisible = false
                        this.checkAll = false
                        this.isIndeterminate = false
                        this.defaultAddress = ''
                        this.selectAddress = ''
                        this.otherAddress = []
                        this.paymethod = '1'
                        this.soupon = ''
                        for(var i = 0;i < productNos.length;i++) {
                            for(var j = 0;j < this.products.length;j++) {
                                if(productNos[i] === this.products[j].productNo) {
                                    console.log("product",productNos[i])
                                    this.$store.commit('ShopCart/deleteProduct',j)
                                    reqEditShopCart({
                                        memberId: this.user.memberId,
                                        productNo: productNos[i],
                                        type: 2
                                    }).then(() => {
                                    }).catch(() => {
                                        this.$message.error("购物车删除商品失败")
                                    })
                                    break
                                }
                            }
                        }
                        this.orderList = []
                    } else {
                        this.$message.info(data.statusInfo)
                        reqInitShopCart().then((data) => {
                            this.$store.commit('ShopCart/displayShopCart', data)
                            this.defaultAddress = ''
                            this.otherAddress = []
                            this.addressVisible = false
                            this.orderVisible = false
                            this.orderList = []
                            this.checkAll = false
                            this.isIndeterminate = false
                            this.Address.receiver = ''
                            this.Address.telephone = ''
                            this.Address.pcd = []
                            this.Address.detail = ''
                            this.checked = false
                            this.paymethod = '1'
                        })
                    }
                }).catch(() => {
                    this.$message.error("创建订单失败")
                })
            },
            finishPay() {
                reqPay({
                    memberId: this.user.memberId,
                    orderNo: this.order.orderNo,
                    couponDTO: this.order.couponDTO
                }).then((data) => {
                    if(data.success) {
                        this.$message.success(data.statusInfo)
                        this.showShopCart = false
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
                    orderNo: this.order.orderNo
                }).then(() => {
                    this.showShopCart = false
                    this.$store.commit('Order/minus')
                    clearInterval(this.timer);
                    this.timer = null;
                    this.min = ''
                    this.second = ''
                    this.isPay = false
                }).catch()
            },
            confirmCancelPay() {
                reqCancelOrder({
                    memberId: this.user.memberId,
                    orderNo: this.order
                }).then(() => {
                    this.showShopCart = false
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
                this.showShopCart = false
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
            },
        }
    }
</script>
<style scoped>
    .shopcart{
        height: 100%;
        width: 35%;
        position: fixed;
        left: 65%;
        top: 0%;
        z-index: 999;
        overflow: auto;
        background-color: white;
    }
    .shopcart-float{
        width: 50px;
        height: 50px;
        border-radius: 50px;
        position: fixed;
        top: 50%;
        left: 96%;
        z-index: 999;
        background-color: red;
        cursor: pointer;
    }
    .float{
        width: 50px;
        height: 50px;
        border-radius: 50px;
        position: fixed;
        top: 50%;
        left: 61%;
        z-index: 999;
        background-color: red;
        cursor: pointer;
    }
    .shopcart-content{
        width:200px;
        height: 200px;
        position: fixed;
        left: 0%;
        top: 0%;
        float: left;
        z-index: 999;   
    }
    .shopcart-enter-active {
        transition: all .5s ease;
    }
    .shopcart-leave-active {
        transition: all .5s ease;
    }
    .shopcart-enter, .shopcart-leave-to{
        transform: translateX(50px);
        opacity: 0;
    }
    .wrap{
        display: flex;
    }
    .center{
        margin: auto;
    }
    .name{
        font-family: 等线;
        font-size: 16px;
    }
    .ordername{
        font-family: 等线;
        font-size: 24px;
        margin-top:20px;
    }
    .orderCondition{
        font-family: tohoma,arial;
        font-size: 15px;
        color: #00F;
        margin-top:15px;
    }
    .type{
        font-family: 仿宋;
        font-size: 14px;
    }
    .ordertype{
        font-family: 仿宋;
        font-size: 20px;
        margin-top:20px;
    }
    .money{
        font-family: tohoma,arial;
        font-size: 15px;
    }
    .ordermoney{
        font-family: tohoma,arial;
        font-size: 15px;
    }
    .totaltxt{
        font-family: 仿宋;
        font-size: 20px;
        padding-left: 10px;
    }
    .totalmoney{
        font-weight: 500;
        font-size: 20px;
        font-family: tohoma,arial;
    }
    .time{
        font-family: 等线;
        font-size: 24px;
    }
    .pay{
        font-family: 等线;
        font-size: 24px;
        margin-top:20px;
    }
    .ordertotalmoney{
        font-weight: 500;
        font-size: 20px;
        font-family: tohoma,arial;
    }
    .orderFull{
        font-weight: 500;
        font-size: 20px;
        font-family: tohoma,arial;
        color: #00F;
        margin-top:50px;
    }
</style>