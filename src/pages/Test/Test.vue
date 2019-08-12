<template>
    <div>
        <transition name="shopcart">
            <div v-show="showShopCart" class="shopcart">
                <div v-show="products.length === 0">
                    <div style="text-align:center">
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
    </div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: "ShopCart",
        data() {
            return {
                showShopCart: false
            }
        },
        computed: {
            ...mapState({
                products: state => state.ShopCart.products
            }),
            total () {
                let total_money = 0;
                let total_products = 0;
                this.products.forEach((product) => {
                    total_money += product.money
                    total_books += product.count
                })
                return {total_money,total_products}
            }
        }
    }
</script>
<style scoped>
    .shopcart{
        height: 100%;
        width: 30%;
        position: fixed;
        left: 70%;
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
        left: 66%;
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
    .wrap{
        display: flex;
    }
    .center{
        margin: auto;
    }
</style>