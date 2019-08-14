<template>
  <div class="product">
    <div style="cursor: pointer" @click="showDetail">
      <el-avatar shape="square" :size="250" :fit="cover" :src="displayUrl"></el-avatar>
    </div>
    <div class="name" @click="showDetail">{{product.productName}}</div>
    <div class="price" @click="showDetail">
      Price:￥{{product.price | numFilter}}
      <el-tooltip effect="dark" :content="product.stock" placement="top">
        <el-tag type="info" v-if="product.stock > 0">有库存</el-tag>
        <el-tag type="warning" v-else>无库存</el-tag>
      </el-tooltip>
    </div>
    <el-tag v-for="(keyword) in product.keywords" :key="keyword" size="medium">{{keyword}}</el-tag>
    <div>
      <el-container class="count">
        <el-button icon="el-icon-minus" @click="minus"></el-button>
        <el-input v-model="count"></el-input>
        <el-button icon="el-icon-plus" @click="plus"></el-button>
      </el-container>
      <el-container>
        <el-button type="info" icon="el-icon-star-off">收藏</el-button>
        <el-button type="primary" class="shopcart" @click="addtocart">加入购物车</el-button>
      </el-container>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {reqGetProductPictures,insertShopCart} from '../../api'

  export default {
    name: "Products",
    props: {
      product: Object,
      index: Number,
    },
    data() {
      return {
        count: 1
      }
    },
    computed: {
      ...mapState({
        isLogin:state=>state.Person.isLogin,
        productProperties: state=>state.Products.productPropertyNames
      }),
      displayUrl: function() {
        let url = "/api/pictures/" + this.product.displayImage
        return url
      }
    },
    filters: {
      numFilter (value) {
        let realVal = parseFloat(value).toFixed(1)
        return realVal
      }
    },
    methods: {
      minus() {
        if(this.count > 1) {
          this.count--
        }
      },
      plus() {
        if(this.count < this.product.stock) {
          this.count++
        }
      },
      showDetail() {
        this.$store.commit('ClickProduct/changeClick')
        this.$store.commit('ClickProduct/updateClickProduct', this.product)
        this.$store.commit('ClickProduct/updateClickProductProperties', this.productProperties)
        reqGetProductPictures(this.product.productId).then((data) => {
          this.$store.commit('ClickProduct/updateClickProductPictures', data)
        }).catch(() => {
          this.$message.error("获取图片失败")
        })
      },
      addtocart() {
        this.$store.dispatch('ShopCart/addtocart', {
          productId: this.product.productId,
          displayImage: this.product.displayImage,
          productName: this.product.productName,
          typeName: this.product.typeName,
          count: this.count,
          price: this.product.price,
          money: this.count*this.product.price,
          stock: this.product.stock,
        }).then(() => {
          this.count = 1
          insertShopCart({
            productId:this.product.productId,
            count:this.count
          }).then((data) => {}).catch(() => {
            this.$message.error("网络连接异常")
          })
          this.$message.success("成功加入购物车")
        }).catch(() => {
          this.$message.error("无法重复加入购物车")
        })
      }
    }
  }
</script>
<style scoped>
  .product:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .product {
    width: 250px;
  }
  .name {
    font-family: Helvetica Neue;
    font-size: 24px;
    cursor: pointer;
  }
  .price {
    color: #F56C6C;
    font-size: 20px;
    cursor: pointer;
  }
  .count {
    margin-top:10px;
    margin-bottom :10px;
  }
  .shopcart {
    margin-left:50px;
  }
</style>