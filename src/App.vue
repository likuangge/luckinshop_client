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
import {reqInitLogin,reqInitShopCart,reqUnpaid,reqUnsend,reqUnreceive,AdminUserInfo,reqSysCancelOrder,reqGetUserInfo} from './api'
import { Notification } from 'element-ui'

export default {
  name: 'App',
  mounted () {
    let user = JSON.parse(window.sessionStorage.getItem('user'))
    if(user != null) {
      Notification.closeAll()
      reqGetUserInfo(user.memberId).then((data) => {
        this.$store.commit('Person/setUser',data.data)
      })
      this.initWebSocket(user)
      reqInitShopCart({
        memberId: user.memberId
      }).then((data) => {
        this.$store.commit('ShopCart/displayShopCart', data.data)
      })
      Notification.closeAll()
      reqUnpaid({
        memberId: user.memberId
      }).then((data) => {
        if(data.success) {
          this.$store.commit('Order/changeUnpaidOrder',data.data)
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
        }
      })
    }
  },
  data() {
    return {
      websocket: null
    }
  },
  components: {
    ShopCart,
    Navbar
  },
  computed: {
    ...mapState({
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
    },
    initWebSocket(user) {
      const wsuri = "ws://10.104.130.53:9081/membersrpc/messagesocket?user=" + user.memberId
      this.websocket = new WebSocket(wsuri);
      this.websocket.onmessage = this.websocketOnMessage
      this.websocket.onopen = this.websocketOnOpen
      this.websocket.onerror = this.websocketOnError
      this.websocket.onclose = this.websocketClose
    },
    websocketOnOpen() {
      console.log("连接打开")
    },
    websocketOnError() {
      this.initWebSocket()
    },
    websocketOnMessage(e) {
      this.$store.commit('Order/minus')
      this.$message.info(e.data)
      console.log("websocket",e.data)
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
    },
    websocketClose(e) {
      console.log('断开连接',e)
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
