<template>
  <div>
    <el-carousel indicator-position="none" height="250px">
        <el-carousel-item v-for="url in urls" :key="url">
            <el-image :src="url"></el-image>
        </el-carousel-item>
    </el-carousel>
    <div>
      <el-row>
        <el-col :span="1">
          <div style="margin-top:25px;font-size:25px">
            秒
          </div>
          <div style="margin-top:25px;font-size:25px">
            杀
          </div>
          <div style="margin-top:25px;font-size:25px">
            专
          </div>
          <div style="margin-top:25px;font-size:25px">
            区
          </div>
        </el-col>
        <el-col :span="23">
          <h3 style="text-align:center">
            {{text}}{{hour}}小时{{min}}分钟{{second}}秒
          </h3>
          <el-row>
            <el-col :span="6" v-for="(product, index) in products" :key="index">
              <Product v-if="index >= start && index <= end" :product="product" :index="index"></Product>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Product from '../../components/Product/Product'
  import {mapState} from 'vuex'
  import {reqGetSecKillTime,reqSecKillProduct,reqSearchExpiredSeckillProduct} from '../../api'

  export default {
    mounted() {
      reqGetSecKillTime().then((data) => {
        console.log("begin",new Date(data.data.seckillBegin))
        console.log("end",new Date(data.data.seckillEnd))
        if(new Date().getTime() >= data.data.seckillEnd) {
          this.text = '距离下次秒杀开始还有'
          if(!this.timer) {
            var totalS = Math.floor((data.data.seckillBegin - new Date().getTime())/1000)
            this.timer = setInterval(() => {
              totalS--
              this.second = totalS%60
              var totalM = Math.floor(totalS/60)
              this.min = totalM%60
              this.hour = Math.floor(totalM/60)
            },1000)
          }
          reqSearchExpiredSeckillProduct().then((data) => {
            console.log("sec",data.data)
            this.$store.commit('Products/setSecKillProducts',data.data)
          })
        } else {
          this.text = '距离秒杀结束还有'
          if(!this.timer) {
            var totalS = Math.floor((data.data.seckillEnd - new Date().getTime())/1000)
            this.timer = setInterval(() => {
              totalS--
              this.second = totalS%60
              var totalM = Math.floor(totalS/60)
              this.min = totalM%60
              this.hour = Math.floor(totalM/60)
            },1000)
          }
          reqSecKillProduct().then((data) => {
            console.log("sec",data.data)
            this.$store.commit('Products/setSecKillProducts',data.data)
          })
        }
      })
    },
    components: {
      Product
    },
    data() {
      return {
        urls: ['../../../static/1.jpg','../../../static/2.png','../../../static/3.png'],
        hour: '',
        min: '',
        second: '',
        timer: null,
        text: '',
        start: 0,
        end: 3
      }
    },
    computed: {
      ...mapState({
        products: state=>state.Products.secKillProducts,
      })
    },
  }
</script>

<style scoped>
</style>