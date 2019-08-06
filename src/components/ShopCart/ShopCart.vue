<template>
	<div>
		<transition name="shopcart">
			<div v-show="showShopCart">
				<div v-show="products.length === 0">
                	<div>
                    	<i class="icon-gel-icon-shopping-cart-2"></i>
                        	购物车为空
                        </div>
                    </div>
                </div>
			</div>
		</transition>
		<transition name="shopcart">
            <div style="cursor: pointer" @click="showShopCart = !showShopCart" v-show="showShopCart">
            	<el-badge :value="total.total_books" :hidden="total.total_books === 0">
                	<i class="icon-gel-icon-shopping-cart-2"></i>
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
                this.books.forEach((book) => {
                    total_money += book.money
                    total_books += book.count
                })
                return {total_money,total_products}
            }
        }
	}
</script>