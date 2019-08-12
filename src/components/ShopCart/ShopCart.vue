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
        <el-dialog title="订单确认" :visible.sync="orderVisible">
            <div>
            {{this.order.orderId}}
            </div>
            <div v-for="(product, index) in order.orderProducts" :key="index">
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
                                    {{product.count}}
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
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import axios from 'axios'
    import {reqDeleteShopCart,reqAddCount,reqSubstractCount,reqSubmitOrder} from '../../api'

    export default {
        name: "ShopCart",
        data() {
            return {
                showShopCart: false,
                order: '',
                orderList: [],
                checkAll: false,
                isIndeterminate: false,
                orderVisible: false
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
                products: state => state.ShopCart.products
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
                    console.log("Data", this.order)
                    this.orderVisible = true
                }).catch(() => {
                    this.$message.error("获取订单失败")
                })
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
    .type{
        font-family: 仿宋;
        font-size: 14px;
    }
    .money{
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
</style>