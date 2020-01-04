<template>
  <div>
    <el-tabs :tab-position="tabPosition" style="height: 1000px;" :value="activeType" @tab-click="handleClick">
      <el-tab-pane v-for="(type,index) in types" :key="index" :name="type.typeNo">
        <span slot="label" v-if="type.activity === 0">
            <i>{{type.typeName}}</i>
        </span>
        <span slot="label" v-else>
            <i>{{type.typeName}}<el-image :src=navAvatar style="width:30px;height:35px"/></i>
        </span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item style="margin-top:20px">
            <el-button type="text" style="font-size:25px" @click="Return" v-show="isClick">{{clickProduct.productType}}</el-button>
            <el-select v-model="activeSecondType" clearable v-show="!isClick" @change="choseType">
              <el-option v-for="(type,index) in secondTypes" :key="index" :label="type.typeName" :value="type.typeNo"></el-option>
            </el-select>
          </el-breadcrumb-item>
          <el-breadcrumb-item style="margin-top:20px" v-show="isClick">
            <el-button type="text" style="font-size:25px">{{clickProduct.productName}}</el-button>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <div>
          <el-row>
            <el-col :span="6" v-for="(product, index) in products" :key="index">
              <Product v-if="index >= start && index <= end" :product="product" :index="index" v-show="!isClick"></Product>
            </el-col>
          </el-row>
          <div v-show="!isClick" style="text-align:center;margin-top:50px">
            <el-pagination layout="total,prev,pager,next,jumper" :total="products.length" :page-size="productPageSize" :hide-on-single-page="products.length <= productPageSize" @current-change="handleProductCurrentChange"></el-pagination>
          </div>
        </div>
        <el-row v-if="isClick" :gutter="20">
          <el-col :span="8">
            <el-carousel indicator-position="none"  height="360px">
              <el-carousel-item v-for="(detailImage,index) in clickProduct.detailImages" :key="index">
                <el-image :src="smallUrl(detailImage.imgName)"></el-image>
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="8">
            <h2>{{clickProduct.productName}}</h2>
            <div>
              <el-tag v-for="(keyword,index) in clickProduct.keywords" :key="index" size="medium">{{keyword.keyword}}</el-tag>
            </div>
            <div class="price">
              <p>价格:￥{{clickProduct.price}}<span style="margin-left:10px;font-size:15px;color:#5DF">{{activityContent}}</span></p>
              <p>库存:{{clickProduct.stock.productNum}}件</p>
              <p>销量:{{clickProduct.productSales}}件!</p>
            </div>
            <div class="count">
              <el-container>
                <el-button icon="el-icon-minus" @click="minus"></el-button>
                <el-input v-model="count"></el-input>
                <el-button icon="el-icon-plus" @click="plus"></el-button>
              </el-container>
            </div>
            <div>
              <el-container>
                <el-button type="info" icon="el-icon-star-off">收藏</el-button>
                <el-button type="primary" class="shopcart" @click="addtocart">加入购物车</el-button>
              </el-container>
            </div>
          </el-col>
        </el-row>
        <el-tabs :value="activeName" v-show="isClick" @tab-click="checkDetail">
          <el-tab-pane label="商品详情" name="first">
            <el-row>
              <el-col :span="4">
                <div v-for="(property,index) in clickProduct.property" :key="index">
                  <p>{{property.skuLabel}}:</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div v-for="(property,index) in clickProduct.property" :key="index">
                  <p>{{property.skuValue}}</p>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品描述" name="second">
            <p v-html="clickProduct.description"></p>
          </el-tab-pane>
          <el-tab-pane label="商品评论" name="third">
            <div v-for="(comment,index) in commentList" :key="index">
              <el-row>
                <el-col :span="3">
                  <el-avatar :src="smallUrl(comment.userImage)" shape="square" :size="100"></el-avatar>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      {{comment.nickName}}
                    </el-col>
                    <el-col :span="17">
                      <el-rate v-model="comment.commentStar" disabled show-score text-color="#ff9900"></el-rate>
                    </el-col>
                    <el-col :span="2">
                      <el-tooltip content="显示评论回复" placement="top" v-if="isShowReply != index">
                        <el-button icon="el-icon-s-comment" @click="showReply(index)">{{comment.childrenList.length}}</el-button>
                      </el-tooltip>
                      <el-tooltip content="折叠评论回复" placement="top" v-else>
                        <el-button icon="el-icon-s-comment" @click="showReply(index)">{{comment.childrenList.length}}</el-button>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="2">
                      <el-button @click="openReply(comment)">回复</el-button>
                    </el-col>
                  </el-row>
                  <div>
                    <div>
                      评价时间:{{comment.createTimeStr}}
                    </div>
                    <div>
                      评价:{{comment.commentContent}}
                    </div>
                  </div>
                  <el-divider></el-divider>
                  <div v-show="isShowReply === index" style="height:100px;overflow:auto">
                    <div v-for="(reply,replyIndex) in comment.childrenList" :key="replyIndex">
                      <el-row>
                        <el-col :span="22">
                          <div>
                            {{reply.nickName}}&nbsp回复&nbsp{{reply.replyUserNickName}}
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <el-button @click="openReply(reply)">回复</el-button>
                        </el-col>
                      </el-row>
                      <div>
                        <div style="margin-top:18px">
                          {{reply.commentContent}}
                        </div>
                      </div>
                      <el-divider></el-divider>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:20px;text-align:center">
              <el-pagination layout="total,prev,pager,next,jumper" :total="totalComment" :page-size="commentPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleCommentCurrentChange" :current-page.sync="currentPage"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="showInputReply" title="回复评论" center @close="closeReply">
      <div>
        回复[{{replyComment.nickName}}]:{{replyComment.commentContent}}
      </div>
      <div style="margin-top:20px">
        <el-input v-model="replyCommentContent" maxlength="30" show-word-limit></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reply">发表</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Product from '../../components/Product/Product'
  import {mapState} from 'vuex'
  import {reqSearchProduct,reqProductComment,reqReplyComment,reqGetActivity,insertShopCart,reqInitShopCart} from '../../api'
  import axios from 'axios'

  export default {
    name: "Products",
    components: {
      Product
    },
    data() {
      return {
        tabPosition: 'left',
        count: 1,
        activeName: 'first',
        totalComment: 0,
        hideOnSinglePage: false,
        commentPageSize: 2,
        commentList: [],
        productHideOnSinglePage: false,
        productPageSize:4,
        start: 0,
        end: 3,
        currentPage: 1,
        isShowReply: -1,
        showInputReply: false,
        replyComment: '',
        replyCommentContent: '',
        camList: []
      }
    },
    computed: {
      ...mapState({
        isLogin: state=>state.Person.isLogin,
        types: state=>state.Products.productTypes,
        products: state=>state.Products.products,
        isClick: state=>state.ClickProduct.isClick,
        clickProduct: state=>state.ClickProduct.clickProduct,
        activeType: state=>state.Products.activeType,
        secondTypes: state=>state.Products.productSecondTypes,
        user: state=>state.Person.user,
        activeSecondType: state=>state.Products.activeSecondType,
        activityContent: state=>state.ClickProduct.activityContent,
        shopcart: state=>state.ShopCart.products,
      }),
      navAvatar: function(){
        let url = "http://10.104.131.158/jian.png"
        return url
      },
    },
    mounted() {
      //this.$store.commit('ClickProduct/resetClick')
      reqGetActivity().then((data) => {
        this.camList = data.data
      })
    },
    methods: {
      smallUrl(url) {
        return "http://10.104.131.158/" + url
      },
      choseType(value) {
        if(value != '') {
          reqSearchProduct({
            parentType: '',
            productType: value,
            filter: ''
          }).then((data) => {
            this.$store.commit('Products/updateProducts', data.data)
            this.$store.commit('Products/updateActiveSecondType', value)
          })
        } else {
          reqSearchProduct({
            parentType: this.activeType,
            productType: '',
            filter: ''
          }).then((data) => {
          this.$store.commit('Products/updateActiveSecondType', value)
            this.$store.commit('Products/updateProducts', data.data)
          })
        }
        this.start = 0
        this.end = 3
      },
      handleClick(tab, event) {
        this.start = 0
        this.end = 3
        reqSearchProduct({
          parentType: tab.name,
          productType: '',
          filter: ''
        }).then((data) => {
          this.activeName = 'first'
          console.log("data",data.data)
          this.$store.commit('Products/updateProducts', data.data)
          if(this.isClick) {
            this.$store.commit('ClickProduct/changeClick')
          }
          this.$store.dispatch('Products/getSecondTypes',tab.name)
          this.$store.commit('Products/updateActiveType', tab.name)
          this.$store.commit('Products/updateActiveSecondType', '')
        })
      },
      Return() {
        if(this.isClick) {
          this.$store.commit('ClickProduct/changeClick')
        }
        this.activeName = 'first'
        this.isShowReply = -1
        this.currentPage = 1
      },
      minus() {
        if(this.count > 1) {
          this.count--
        }
      },
      plus() {
        if(this.count < this.clickProduct.stock.productNum) {
          this.count++
        }
      },
      checkDetail(tab,event) {
        if(tab.name === 'third') {
          reqProductComment({
            productNo: this.clickProduct.productNo,
            page: 1,
            rows: this.commentPageSize
          }).then((data) => {
            console.log("comment",data.data)
            this.commentList = data.data.rows
            this.totalComment = data.data.total
            if(this.totalComment <= this.commentPageSize){
              this.hideOnSinglePage = true
            }
          }).catch(() => {
            this.$message.error("获取评价列表失败")
          })
        }
        this.activeName = tab.name
      },
      handleCommentCurrentChange(val) {
        reqProductComment({
          productNo: this.clickProduct.productNo,
          page: val,
          rows: this.commentPageSize
        }).then((data) => {
          this.commentList = data.data.rows
          this.totalComment = data.data.total
          if(this.totalComment <= this.commentPageSize){
            this.hideOnSinglePage = true
          }
          this.isShowReply = -1
        }).catch(() => {
          this.$message.error("获取评价列表失败")
        })
      },
      handleProductCurrentChange(val) {
        this.start = (val - 1) * this.productPageSize
        this.end = this.start + this.productPageSize - 1
      },
      showReply(index) {
        if(this.isShowReply === index) {
          this.isShowReply = -1;
        } else {
          if(this.commentList[index].childrenList.length > 0) {
            this.isShowReply = index
          }
        }
      },
      openReply(comment) {
        this.showInputReply = true
        this.replyComment = comment
        console.log("comment",comment)
      },
      reply() {
        reqReplyComment({
          userId: this.user.memberId,
          commentContent: this.replyCommentContent,
          parentId: this.replyComment.id,
          replyId: this.replyComment.id
        }).then((data) => {
          this.$message.success(data.statusInfo)
          this.showInputReply = false
          this.replyCommentContent = ''
          reqProductComment({
            productNo: this.clickProduct.productNo,
            page: 1,
            rows: this.commentPageSize
          }).then((data) => {
            this.commentList = data.data.rows
            this.totalComment = data.data.total
            if(this.totalComment <= this.commentPageSize){
              this.hideOnSinglePage = true
            }
            this.isShowReply = -1
          }).catch(() => {
            this.$message.error("获取评价列表失败")
          })
        })
      },
      closeReply() {
        this.replyCommentContent = ''
      },
      addtocart() {
        if(this.isLogin) {
          var flag = 0
          if(this.shopcart.length > 0) {
            for(var i = 0;i < this.shopcart.length;i++) {
              if(this.clickProduct.productNo === this.shopcart[i].productNo) {
                flag = 1
                break
              }
            }
          }
          if(flag === 1) {
            this.$message.warning("无法重复加入购物车")
          } else {
            insertShopCart({
              memberId: this.user.memberId,
              productNo: this.clickProduct.productNo,
              quantity: this.count,
              stock: this.clickProduct.stock.productNum
            }).then(() => {
              this.count = 1
              this.$message.success("成功加入购物车")
              reqInitShopCart({
                memberId: this.user.memberId
              }).then((data) => {
                this.$store.commit('ShopCart/displayShopCart', data.data)
              })
            }).catch(() => {
              this.$message.error("网络连接异常")
            })
          }
        } else {
          this.$message.warning("请先登录")
        }
      },
    }
  }
</script>

<style scoped>
  .accountInput {
    width:300px;
  }
  .keywordInput {
    width:200px;
  }
  .smallpic {
    width:50px;
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
  .avatar {
    width: 145px;
    height: 150px;
    display: block;
  }
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:145px;
    height:150px;
  }
  .avatar-uploader-icon {
    font-size: 35px;
    color: #8c939d;
    width: 145px;
    height: 150px;
    line-height: 150px;
  }
</style>
