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
import {reqInitLogin,reqAdminInitLogin,reqInitShopCart} from './api'

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
        this.$store.commit('Person/setUserId', data.userId)
        this.$store.commit('Person/setUsername', data.username)
        this.$store.commit('Person/setTelephone', data.telephone)
        this.$store.commit('Person/setEmail', data.email)
        this.$store.commit('Person/setAvatar', data.avatar)
      } else {
        reqAdminInitLogin().then((data) => {
          if(data.isLogin){
            this.$store.commit('Person/changeAdmin')
            this.$store.commit('Person/changeLogin')
            this.$store.commit('Person/setUsername', data.username)
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
    }),
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
