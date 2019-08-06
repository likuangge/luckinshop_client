<template>
  <div>
    <el-tabs :tab-position="tabPosition" style="height: 900px;" :value="activeType" @tab-click="handleClick" :closable="isAdmin">
      <el-tab-pane v-for="type in types" :label="type" :name="type">
        <el-button v-show="isAdmin" size="small" style="float:right;margin-top:30px">
          添加商品
        </el-button>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item style="margin-top:20px">
            <el-button type="text" style="font-size:25px" @click="Return">{{type}}</el-button>
          </el-breadcrumb-item>
          <el-breadcrumb-item style="margin-top:20px" v-show="isClick">
            <el-button type="text" style="font-size:25px">{{clickProduct.productName}}</el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <Product v-for="(product, index) in products" :key="index" :product="product" :index="index" v-show="!isClick"></Product>
        <el-row v-show="isClick">
          <el-col :span="8">
            <el-container>
              <el-main>
                <el-button v-show="isModify === true" size="small" style="margin-left:60px">
                  修改商品图片
                </el-button>
                <el-avatar :src='clickUrl' :size="250" shape="square" :fit="cover"></el-avatar>
              </el-main>
              <el-footer>
                <div style="width:300px">
                  <el-row>
                    <el-col :span="4" v-for="url in urls" :key="url">
                      <div @click="clickUrl = url" class="smallpic">
                       <el-avatar :src="url" shape="square" :size="small"></el-avatar>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-footer>
            </el-container>
          </el-col>
          <el-col :span="8">
            <h2 v-show="isModify === false">{{clickProduct.productName}}</h2>
            <el-input v-show="isModify === true" v-model="productName" :placeholder="clickProduct.productName" class="productname"></el-input>
            <div>
              <el-tag v-for="(keyword) in clickProduct.keywords" :key="keyword" size="medium" :closable="isModify === true">{{keyword}}</el-tag>
            </div>
            <div class="price">
              <p v-show="isModify === false">价格:￥{{clickProduct.price | numFilter}}</p>
              <div v-show="isModify === true">
                价格:￥
                <el-input v-model="productPrice" :placeholder="clickProduct.price | numFilter" style="width:100px"></el-input>
              </div>
              <p>库存:{{clickProduct.stock}}件</p>
              <p>销量:{{clickProduct.amount}}件!</p>
            </div> 
            <div class="count">
              <el-container>
                <el-button icon="el-icon-minus" @click="minus" :disabled="isAdmin"></el-button>
                <el-input v-model="count" :disabled="isAdmin"></el-input>
                <el-button icon="el-icon-plus" @click="plus" :disabled="isAdmin"></el-button>
              </el-container>
            </div>
            <div>
              <el-container>
                <el-button type="info" icon="el-icon-star-off" :disabled="isAdmin">收藏</el-button>
                <el-button type="primary" class="shopcart" :disabled="isAdmin">加入购物车</el-button>
              </el-container>
            </div>
          </el-col>
          <el-button v-show="isAdmin && isModify === false" size="small" @click="ModifyProduct">
            修改商品
          </el-button>
          <el-button v-show="isModify === true" size="small" @click="ModifyCommit">
            提交修改
          </el-button>
        </el-row>
        <el-tabs v-model="activeName" v-show="isClick">
          <el-tab-pane label="商品详情" name="first">
            <el-row>
              <el-col :span="4">
                <div v-for="(property,index) in clickProductProperties" :key="property">
                  <p>{{property}}:</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div v-for="(property,index) in clickProduct.propertyValue" :key="property">
                  <p v-show="isModify === false">{{property}}</p>
                  <el-input v-show="isModify === true" :placeholder="property" style="width:250px"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品评论" name="second">配置管理</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <el-button v-show="isAdmin" size="small">
      添加商品种类
    </el-button>
  </div>
</template>
<script>
  import Product from '../../components/Product/Product'
  import {mapState} from 'vuex'

  export default {
    name: "Products",
    components: {
      Product
    },
    data() {
      return {
        tabPosition: 'left',
        count: 1,
        isModify: false,
        activeName: 'first',
        productName: '',
        productPrice: '',
        clickUrl: '../../../static/product_1.jfif',
        urls: ['../../../static/product_1.jfif',
               '../../../static/product_2.jfif',
               '../../../static/product_3.jfif',
               '../../../static/product_4.jfif',
               '../../../static/product_5.jfif']
      }
    },
    computed: {
      ...mapState({
        isAdmin: state=>state.Person.isAdmin,
        types: state=>state.Products.productTypes,
        products: state=>state.Products.products,
        isClick: state=>state.ClickProduct.isClick,
        clickProduct: state=>state.ClickProduct.clickProduct,
        clickProductProperties: state=>state.Products.productPropertyNames,
        activeType: state=>state.Products.activeType
      })
    },
    filters: {
      numFilter (value) {
        let realVal = parseFloat(value).toFixed(1)
        return realVal
      }
    },
    methods: {
      handleClick(tab, event) {
        if(this.isClick) {
          this.$store.commit('ClickProduct/changeClick')
        }
        this.$store.dispatch('Products/getPropertyName', tab.name)
        this.$store.dispatch('Products/getProducts', tab.name)
      },
      Return() {
        if(this.isClick) {
          this.$store.commit('ClickProduct/changeClick')
        }
      },
      ModifyProduct() {
        this.isModify = !this.isModify
      },
      ModifyCommit() {
        this.isModify = !this.isModify
      },
      minus() {
        if(this.count > 1) {
          this.count--
        }
      },
      plus() {
        if(this.count < this.clickProduct.stock) {
          this.count++
        }
      }
    }
  }
</script>

<style scoped>
  .accountInput {
    width:300px;
  }
  .smallpic {
    border:1px solid #FFFFFF;
  }
  .smallpic:hover {
    border:1px solid #000000;
  }
  .count {
    margin-top:20px;
    margin-bottom :20px;
    width:210px;
  }
  .price {
    margin-top:20px;
    margin-botton:20px; 
    color: #F56C6C;
    font-size: 20px;
  }
  .productname {
    width:250px;
    margin-bottom:20px;
  }
</style>