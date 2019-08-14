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
                                        <el-checkbox :label="product.productId" :disabled="product.stock === 0">
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
                                        <el-image :src="picUrl(product.displayImage)"></el-image>
                                    </el-col>
                                    <el-col :span="13">
                                        <el-container>
                                            <el-main>
                                                <div class="type">{{product.typeName}}</div>
                                                <div class="name">{{product.productName}}</div>
                                            </el-main>
                                            <el-footer>
                                                <div>
                                                    <el-button icon="el-icon-plus" @click="add(product.count,product.stock,index,product.productId)" size="mini"></el-button>
                                                    {{product.count}}
                                                    <el-button icon="el-icon-minus" @click="substract(index,product.productId)" size="mini" :disabled="product.count === 1"></el-button>
                                                    </div>
                                            </el-footer>
                                        </el-container>
                                    </el-col>
                                    <el-col :span="4">
                                        <div class="money">
                                            ￥{{product.money | numFilter}}
                                        </div>
                                    </el-col>
                                </el-row>
                                <div style="margin-left:320px">
                                    <i class="el-icon-delete" style="cursor:pointer" @click="deleteProduct(product.productId,index)"></i>
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
            <div>
            订单编号：{{this.order.orderId}}
            </div>
            <el-row>
                <el-col :span="12">
                    <div v-for="(product, index) in order.orderProducts" :key="index">
                        <el-row>
                            <el-col :span="10">
                                <el-image :src="picUrl(product.displayImage)"></el-image>
                            </el-col>
                            <el-col :span="14">
                                <div>
                                    <div class="ordertype">{{product.typeName}}</div>
                                    <div class="ordername">{{product.productName}}</div>
                                    <div class="ordermoney">
                                        共{{product.count}}件,合计{{product.money | numFilter}}元
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
                                    <div v-show="defaultAddress != ''">
                                        <el-radio :label=defaultAddress.addressId>
                                            <span>默认地址</span>
                                            <div>
                                                <span>{{defaultAddress.receiver}}</span><span></span>
                                                <span>{{defaultAddress.telephone}}</span>
                                            </div>
                                            <div>
                                                <span>{{defaultAddress.province}}</span><span>{{defaultAddress.city}}</span><span>{{defaultAddress.district}}</span>
                                            </div>
                                            <div>{{defaultAddress.detail}}</div>
                                        </el-radio>
                                    </div>
                                    <div v-for="(address,index) in otherAddress" :key="index">
                                        <el-radio :label=address.addressId>
                                            <span>{{address.receiver}}</span><span></span>
                                            <span>{{address.telephone}}</span>
                                            <div>
                                                <span>{{address.province}}</span><span>{{address.city}}</span><span>{{address.district}}</span>
                                            </div>
                                            <div>{{address.detail}}</div>
                                        </el-radio>
                                    </div>
                                </el-radio-group>
                            </div>
                            <el-link type="primary" icon="el-icon-plus" @click="addAddress">添加地址</el-link>
                            <div class="pay">
                                请选择支付方式
                            </div>
                            <div>
                                <el-radio v-model="paymethod" label="0">积分支付</el-radio>
                                <el-radio v-model="paymethod" label="1">现金支付</el-radio>
                            </div>
                            <el-row>
                                <el-col :span="14">
                                    <div class="ordertotalmoney" v-if="paymethod === '0'">
                                        共需{{order.totalMoney * 10}}积分
                                    </div>
                                    <div class="ordertotalmoney" v-else>
                                        共需{{order.totalMoney | numFilter}}元
                                    </div>
                                </el-col>
                                <el-col :span="10" style="margin-top:50px">
                                    <el-button type="success" @click="pay">立即付款</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <el-form :model="Address" v-else>
                            <el-form-item label="收货人姓名">
                                <el-input v-model="Address.receiver" @input="change($event)"></el-input>
                            </el-form-item>
                            <el-form-item label="收货人电话">
                                <el-input v-model="Address.telephone"></el-input>
                            </el-form-item>
                            <el-form-item label="收获地址">
                                <el-cascader v-model="Address.pcd" :options="options" placeholder="请选择省\市\区" style="width:460px" clearable></el-cascader>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input type="textarea" v-model="Address.detail" placeholder="详细地址"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-checkbox v-model="checked">设为默认地址</el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="createAddress('Address')">立即创建</el-button>
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
    import {reqDeleteShopCart,reqAddCount,reqSubstractCount,reqAddAddress,reqGetAddress,reqClearOrderSession,reqCreateOrder} from '../../api'
    import addressData from '../../assets/citys.json'

    const MIN_COUNT = 5
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
                    name: '',
                    telephone: '',
                    pcd: [],
                    detail: ''
                },
                otherAddress: [],
                defaultAddress: '',
                selectAddress: '',
                paymethod: '0',
                isPay: false,
                min: '',
                second: '',
                timer: null
            }
        },
        filters: {
            numFilter (value) {
                let realVal = parseFloat(value).toFixed(1)
                return realVal
            }
        },
        computed: {
            ...mapState({
                products: state => state.ShopCart.products,
                min: state=>state.Timer.min,
                second: state=>state.Timer.second
            }),
            total() {
                let total_money = 0;
                let total_products = 0;
                this.products.forEach((product) => {
                    total_money += product.money
                    total_products += product.count
                })
                return {total_money,total_products}
            }
        },
        methods: {
            change(e) {
                this.$forceUpdate()
            },
            picUrl(picName) {
                return "/api/pictures/" + picName
            },
            deleteProduct(productId,index) {
                this.$store.commit('ShopCart/deleteProduct',index)
                reqDeleteShopCart(productId).then((data) => {
                    this.$message.success(data)
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
                    for(var i = 0;i < this.products.length;i++){
                        var id = this.products[i].productId
                        var stock = this.products[i].stock
                        if(stock != 0){
                            var flag = 0
                            for(var j = 0;j < this.orderList.length;j++){
                                if(id === this.orderList[j]){
                                    flag = 1
                                    break
                                }
                            }
                            if(flag === 0){
                                this.orderList.push(id)
                            }
                        } else {
                            continue
                        }
                    }
                } else {
                    this.orderList = []
                }
                this.isIndeterminate = false;
            },
            add(count,stock,index,productId) {
                if (count < stock) {
                    this.$store.commit('ShopCart/add',index)
                    reqAddCount(productId).then().catch(() => {
                        this.$message.error("增加数量失败")
                    })
                } else {
                    this.$message.error("超过库存")
                }
            },
            substract(index,productId) {
                this.$store.commit('ShopCart/substract',index)
                reqSubstractCount(productId).then().catch(() => {
                    this.$message.error("减少数量失败")
                })  
            },
            submitOrder() {
                reqGetAddress().then((data) => {
                    let address = data
                    for(var i = 0;i < address.length;i++) {
                        if(address[i].isDefault) {
                            this.defaultAddress = address[i]
                            this.selectAddress = address[i].addressId
                        } else {
                            this.otherAddress.push(address[i])
                        }
                    }
                }).catch(() => {
                    this.$message.error=("获取地址失败")
                })
                let url = '/api/order/submit'
                let formData = new FormData()
                formData.append("order",this.orderList)

                axios({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'multipart/form-data;charset=UTF-8'
                    },
                    data:formData
                }).then((data) => {
                    this.order = data.data
                    this.orderVisible = true
                }).catch(() => {
                    this.$message.error("获取订单失败")
                })
            },
            addAddress() {
                this.addressVisible = true
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
                    this.addressVisible = false
                    reqGetAddress().then((data) => {
                        let address = data
                        this.otherAddress = []
                        for(var i = 0;i < address.length;i++) {
                            if(address[i].isDefault) {
                                this.defaultAddress = address[i]
                                this.selectAddress = address[i].addressId
                            } else {
                                this.otherAddress.push(address[i])
                            }
                        }
                    }).catch(() => {
                        this.$message.error=("获取地址失败")
                    })
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
                    reqClearOrderSession().then().catch()
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
                            clearInterval(this.timer);
                            this.timer = null;
                            this.min = ''
                            this.second = ''
                        }
                    }, 1000)
                }
                reqCreateOrder(this.selectAddress).then((data) => {}).catch()
                this.isPay = true
                this.orderVisible = false
                this.checkAll = false
                this.isIndeterminate = false
                this.defaultAddress = ''
                this.otherAddress = []
                this.$store.dispatch('Timer/beginTimer')
                for(var i = 0;i < this.orderList.length;i++) {
                    for(var j = 0;j < this.products.length;j++) {
                        if(this.orderList[i] === this.products[j].productId) {
                            this.$store.commit('ShopCart/deleteProduct',j)
                            reqDeleteShopCart(this.orderList[i]).then((data) => {
                                this.$message.success(data)
                            }).catch(() => {
                                this.$message.error("购物车删除商品失败")
                            })
                        }
                    }
                }
                this.orderList = []
            },
            cancelPay() {
                clearInterval(this.timer);
                this.timer = null;
                this.min = ''
                this.second = ''
                this.isPay = false
                const h = this.$createElement;
                this.$notify({
                    title: '未付款!',
                    message: '您有未付款的订单!请到个人中心的订单中心继续付款!',
                    type:'warning',
                    showClose: false,
                    duration: 0
                });
            },
            payClose() {
                clearInterval(this.timer);
                this.timer = null;
                this.min = ''
                this.second = ''
                this.isPay = false
                const h = this.$createElement;
                this.$notify({
                    title: '未付款!',
                    message: '您有未付款的订单！请到个人中心的订单中心继续付款!',
                    type:'warning',
                    showClose: false,
                    duration: 0
                });
            }
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
    }
    .type{
        font-family: 仿宋;
        font-size: 14px;
    }
    .ordertype{
        font-family: 仿宋;
        font-size: 20px;
        margin-top:50px
    }
    .money{
        font-family: tohoma,arial;
        font-size: 15px;
    }
    .ordermoney{
        font-family: tohoma,arial;
        font-size: 15px;
        margin-top:50px
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
        margin-top:50px;
    }
</style>