<template>
  <div class="product">
    <div style="cursor: pointer" @click="showDetail">
      <el-image :src="displayUrl"></el-image>
    </div>
    <div class="name" @click="showDetail">{{product.productName}}</div>
    <div class="price" @click="showDetail" v-show="!isAdmin">
      价格:￥{{product.price | numFilter}}
      <el-tooltip effect="dark" :content="product.stock" placement="top">
        <el-tag type="info" v-if="product.stock > 0">有库存</el-tag>
        <el-tag type="warning" v-else>无库存</el-tag>
      </el-tooltip>
    </div>
    <el-tag v-show="!isAdmin" v-for="(keyword) in product.keywords" :key="keyword" size="medium">{{keyword}}</el-tag>
    <div v-show="!isAdmin">
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
    <div v-show="isAdmin">
      <el-button type="info" icon="el-icon-upload" @click="ModifyPicture">修改商品展示图片</el-button>
    </div>
    <el-dialog title="修改商品展示图片" :visible.sync="ModifyPictureVisible" center>
      <el-upload class="avatar-uploader" action="/api/productDisplayPictureUpload" :on-success="onSuccess" :http-request="displayImageUpload">
        <img v-if="displayImageUrl === product.displayImage" :src="smallUrl(displayImageUrl)" class="avatar">
        <img v-else :src="displayImageUrl" class="avatar">
      </el-upload>
      <div slot="footer">
        <el-button type="primary" @click="confirm(product.productId)">确认修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {reqGetProductPictures,insertShopCart,AdminModifyProductDisplayImage} from '../../api'
  import axios from 'axios'

  export default {
    name: "Products",
    props: {
      product: Object,
      index: Number,
    },
    data() {
      return {
        count: 1,
        ModifyPictureVisible: false,
        displayImageUrl: ''
      }
    },
    computed: {
      ...mapState({
        isLogin:state=>state.Person.isLogin,
        isAdmin:state=>state.Person.isAdmin,
        activeType: state=>state.Products.activeType,
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
      onSuccess(res, file) {
        this.displayImageUrl = URL.createObjectURL(file.raw)
      },
      smallUrl(url) {
        return "/api/pictures/" + url
      },
      showDetail() {
        this.$store.dispatch('Products/getAllTypes')
        this.$store.commit('ClickProduct/changeClick')
        this.$store.commit('Products/updateActiveType',this.product.typeName)
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
          insertShopCart({
            productId:this.product.productId,
            count:this.count
          }).then((data) => {
            this.count = 1
          }).catch(() => {
            this.$message.error("网络连接异常")
          })
          this.$message.success("成功加入购物车")
        }).catch(() => {
          this.$message.error("无法重复加入购物车")
        })
      },
      ModifyPicture() {
        this.ModifyPictureVisible = true
        this.displayImageUrl = this.product.displayImage
      },
      displayImageUpload(data) {
        let file = data.file
        let url = '/api/productDisplayPictureUpload'
        let formData = new FormData()
        formData.append("file",file)
        axios({
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8'
          },
          data:formData
        }).then((response) => {
          data.onSuccess(response.data)
        })
      },
      confirm(productId) {
        AdminModifyProductDisplayImage(productId).then((data) => {
          if(data === '修改成功') {
            this.ModifyPictureVisible = false
            this.displayImageUrl = ''
            this.$store.dispatch('Products/getProducts', this.activeType)
          } else {
            this.$message.warning(data)
          }
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
  .avatar {
    width: 250px;
    height: 250px;
    display: block;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:250px;
    height:250px;
    margin-left:175px;
  }
  .avatar-uploader-icon {
    font-size: 100px;
    color: #8c939d;
    width: 250px;
    height: 250px;
    line-height: 250px;
  }
</style>