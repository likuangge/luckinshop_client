<template>
  <div id="app">
      <Navbar></Navbar>
      <router-view/>
      <ShopCart v-if="!isAdmin"></ShopCart>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Navbar from './components/Navbar/Navbar'
import ShopCart from './components/ShopCart/ShopCart'
import {reqInitLogin,reqAdminInitLogin,reqInitShopCart,reqUnpaid,reqUnsend,reqUnreceive,AdminUserInfo} from './api'

export default {
  name: 'App',
  mounted () {
    this.$store.dispatch('Products/getAllTypes')
    this.$store.dispatch('Products/getPropertyName', '家用电器')
    this.$store.dispatch('Products/getProducts', '家用电器')
    this.$store.commit('Products/updateActiveType', '家用电器')
    reqInitLogin().then((data) => {
      if (data.isLogin) {
        this.$store.commit('Person/changeLogin')
        this.$store.commit('Person/setUserInfo',data)
        reqUnpaid().then((data) => {
          if(data > 0) {
            this.$store.commit('Order/changeUnpaidOrder', data)
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
        reqUnreceive().then((data) => {
          if(data > 0) {
            this.$store.commit('Order/changeUnreceiveOrder', data)
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
      } else {
        reqAdminInitLogin().then((data) => {
          if(data.isLogin){
            this.$store.commit('Person/changeAdmin')
            this.$store.commit('Person/changeLogin')
            this.$store.commit('Person/setUsername', data.username)
            reqUnsend().then((data) => {
              if(data > 0) {
                this.$store.commit('Order/changeUnsendOrder', data)
                this.$notify({
                  title: '未发货!',
                  dangerouslyUseHTMLString: true,
                  message: this.messageUnsend(),
                  type:'warning',
                  showClose: false,
                  duration: 0,
                  position: 'bottom-left'
                });
              }
            })
            AdminUserInfo().then((data) => {
              this.$store.commit('Person/setUsers',data)
            })
          } else {

          }
        })
      }
    }),
    reqInitShopCart().then((data) => {
      this.$store.commit('ShopCart/displayShopCart', data)
    })
  },
  components: {
    ShopCart,
    Navbar
  },
  computed: {
    ...mapState({
      isAdmin: state=>state.Person.isAdmin,
      unpaidOrder: state=>state.Order.unpaidOrder,
      unsendOrder: state=>state.Order.unsendOrder,
      unreceiveOrder: state=>state.Order.unreceiveOrder
    })
  },
  methods: {
    messageUnpaid() {
      return '您有' + this.unpaidOrder +'个未付款的订单！请到个人中心的订单中心继续付款!'
    },
    messageUnsend() {
      return this.unsendOrder +'个未发货的订单！请到订单管理进行发货!'
    },
    messageUnreceive() {
      return this.unreceiveOrder +'个未收货的订单！请到个人中心的订单中心确认收货!'
    }
  }
}
</script>

<style>
#app {
    height: 100%;
}
::-webkit-scrollbar {/*滚动条整体样式*/
    width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}
</style>
