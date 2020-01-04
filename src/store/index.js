import Vue from 'vue'
import Vuex from 'vuex'
import Person from './modules/Person'
import Products from './modules/Products'
import ClickProduct from './modules/ClickProduct'
import ShopCart from './modules/ShopCart'
import Order from './modules/Order'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
        Person,
        Products,
        ClickProduct,
        ShopCart,
        Order
    },
})