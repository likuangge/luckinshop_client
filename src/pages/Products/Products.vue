<template>
  <div>
    <el-tabs :tab-position="tabPosition" style="height: 900px;" :value="activeType" @tab-click="handleClick">
      <el-tab-pane v-for="(type,index) in types" :key="index" :label="type" :name="type" :disabled="type === '搜索结果'">
        <el-row>
          <el-col :span="16">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item style="margin-top:20px" disabled="type === '搜索结果'">
                <el-button type="text" style="font-size:25px" @click="Return" :disabled="type === '搜索结果'">{{activeType}}</el-button>
              </el-breadcrumb-item>
              <el-breadcrumb-item style="margin-top:20px" v-show="isClick">
                <el-button type="text" style="font-size:25px">{{clickProduct.productName}}</el-button>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="6">
            <el-button v-show="isAdmin" style="float:right;margin-top:30px" @click="CreateProductTypeFormVisible = true">
              添加商品种类
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button v-show="isAdmin" style="float:right;margin-top:30px" @click="CreateProductFormVisible = true">
              添加商品
            </el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="productSpanValue" v-for="(product, index) in products">
            <Product :product="product" :index="index" v-show="!isClick && product.state === 0"></Product>
          </el-col>
        </el-row>
        <el-row v-show="isClick" :gutter="20">
          <el-col :span="8">
            <el-carousel indicator-position="none"  height="360px">
              <el-carousel-item v-for="(productPicture,index) in productPictures" :key="index">
                <el-image :src="smallUrl(productPicture.picName)"></el-image>
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="8">
            <h2>{{clickProduct.productName}}</h2>
            <div v-show="!isAdmin">
              <el-tag v-for="(keyword) in clickProduct.keywords" :key="keyword" size="medium">{{keyword}}</el-tag>
            </div>
            <div class="price" v-show="!isAdmin">
              <p>价格:￥{{clickProduct.price | numFilter}}</p>
              <p>库存:{{clickProduct.stock}}件</p>
              <p>销量:{{clickProduct.amount}}件!</p>
            </div> 
            <div class="count" v-show="!isAdmin">
              <el-container>
                <el-button icon="el-icon-minus" @click="minus" :disabled="isAdmin"></el-button>
                <el-input v-model="count" :disabled="isAdmin"></el-input>
                <el-button icon="el-icon-plus" @click="plus" :disabled="isAdmin"></el-button>
              </el-container>
            </div>
            <div>
              <el-container v-show="!isAdmin">
                <el-button type="info" icon="el-icon-star-off" :disabled="isAdmin">收藏</el-button>
                <el-button type="primary" class="shopcart" :disabled="isAdmin">加入购物车</el-button>
              </el-container>
            </div>
            <el-button v-show="isAdmin" size="medium" @click="ModifyPictureVisible = true">
              修改商品详情图片
            </el-button>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" v-show="isClick" @tab-click="checkDetail">
          <el-tab-pane label="商品详情" name="first">
            <el-row>
              <el-col :span="4">
                <div v-for="(property,index) in clickProductProperties" :key="index">
                  <p>{{property}}:</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div v-for="(property,index) in clickProductProperties" :key="index">
                  <p v-show="isModify === false">{{clickProduct.propertyValue[index]}}</p>
                  <el-input v-model="propertyValues[index]" v-show="isModify === true" :placeholder="clickProduct.propertyValue[index]" style="width:250px"></el-input>
                </div>
              </el-col>
              <el-col :span="14">
                <el-button v-show="isAdmin && isModify === false" size="medium" @click="ModifyProperty">
                  修改商品规格
                </el-button>
                <el-button v-show="isModify === true" size="medium" @click="ModifyCommit">
                  提交修改
                </el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品评论" name="second">
            <div v-for="(comment,index) in commentList" :key="index">
              <el-row>
                <el-col :span="3" style="margin-top:10px">
                  <el-avatar :src="smallUrl(comment.avatar)" shape="square" :size="100"></el-avatar>
                </el-col>
                <el-col :span="4" style="margin-top:60px">
                  <div class="name">
                    {{comment.userName}}
                  </div>
                </el-col>
                <el-col :span="10" style="margin-top:40px">
                  <el-rate v-model="comment.rate" disabled></el-rate>
                  <div>
                    <div style="margin-top:10px">
                      评价:{{comment.comment}}
                    </div>
                    <div style="margin-top:10px">
                      评价时间:{{comment.time}}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:20px;text-align:center">
              <el-pagination layout="total,prev,pager,next,jumper" :total="totalComment" :page-size="commentPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleCommentCurrentChange"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title=dialogName :visible.sync="CreateProductFormVisible" @close="reset" center>
      <el-form :model="CreateProduct" label-width="100px">
        <el-form-item label="商品名称">
          <el-input class="accountInput" v-model="CreateProduct.name" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input class="accountInput" v-model="CreateProduct.price" placeholder="请输入价格" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品库存">
          <el-input class="accountInput" v-model="CreateProduct.stock" placeholder="请输入库存" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品关键字">
          <div v-for="(keyword,index) of CreateProduct.keywords">
            <el-input class="keywordInput" v-model="CreateProduct.keywords[index]" :key="index" clearable></el-input>
            <el-button @click="Delete(index)">删除关键字</el-button>
          </div>
          <el-row>
            <el-col :span="6">
              <el-button @click="onAdd" :disabled="this.CreateProduct.keywords.length >= 5">新增关键字</el-button>
            </el-col>
            <el-col :span="8" v-show="this.CreateProduct.keywords.length >= 5">
              <p>最多输入5个关键字</p>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-row>
            <el-col :span="4">
              <div v-for="(property,index) in activeProperties" :key="index">
                {{property}}
              </div>
            </el-col>
            <el-col :span="6">
              <div v-for="(property,index) in activeProperties" :key="index">
                <el-input v-model="CreateProduct.properties[index]"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商品展示图片">
          <el-upload class="avatar-uploader" action="/api/productDisplayPictureUpload" :on-success="onSuccess" :http-request="displayImageUpload">
            <img v-if="displayImageUrl" :src="displayImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品详情图片">
          <el-upload action="/api/productPictureUpload" list-type="picture-card" :on-remove="handleRemove" :http-request="picUpload" :limit="4" :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="createProduct">创建商品</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建商品类型" :visible.sync="CreateProductTypeFormVisible" @close="reset" center>
      <el-form :model="CreateProductType">
        <el-form-item label="商品类型名称" style="margin-left:75px">
          <el-input class="accountInput" v-model="CreateProductType.name" placeholder="请输入商品类型名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品类型规格" style="margin-left:75px">
          <el-input class="accountInput" v-model="CreateProductType.property" placeholder="请输入商品类型规格" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.prevent="createProductType()">创建商品类型</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改商品详情图片" :visible.sync="ModifyPictureVisible" center @close="reset">
      <el-row v-for="(productPicture,index) in productPictures" :key="index">
        <el-col :span="8">
          <el-upload v-if="changeDetailImage && index === mindex" class="avatar-uploader" action="/api/productDisplayPictureUpload" :on-success="onSuccess" :http-request="displayImageUpload">
            <img v-if="displayImageUrl" :src="displayImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-image v-else :src="smallUrl(productPicture.picName)" style="width:145px;height:150px"></el-image>
        </el-col>
        <el-col :span="14">
          <el-button type="primary" v-if="changeDetailImage && index === mindex" size="mini" @click="confirmModify(productPicture)">确定</el-button>
          <div v-else>
            <el-button type="success" @click="modifyDetailPicture(index)" size="mini">修改</el-button>
            <el-button type="info" size="mini" @click="deletePicture(productPicture)">删除</el-button>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row v-show="productPictures.length < 4">
        <el-col :span="18">
          <el-upload action="/api/productPictureUpload" list-type="picture-card" :on-remove="handleRemove" :http-request="picUpload" :limit="4 - productPictures.length" :on-exceed="handleExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" style="float:right;margin-bottom:10px" @click="confirmAdd(clickProduct.productId)">确认添加</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import Product from '../../components/Product/Product'
  import {mapState} from 'vuex'
  import {reqCreateProduct,AdminCreateProductType,AdminChangePropertyValue,modifyProductDetailPicture,reqGetProductPictures,AdminDeleteProductDetailImage,AdminAddProductDetailImage,reqProductCommentCount,reqProductComment} from '../../api'
  import axios from 'axios'

  const specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
  const priceReg = /^([1-9]{1}([0-9]*)|[0-9]{1})[.][0-9]{1}$/
  const stockReg = /^[1-9]{1}([0-9]*)$/

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
        CreateProductFormVisible: false,
        CreateProductTypeFormVisible: false,
        displayImageUrl: '',
        displayImageVisible: false,
        CreateProduct: {
          name: '',
          price: '',
          stock: '',
          keywords: [],
          properties: []
        },
        CreateProductType: {
          name: '',
          property: ''
        },
        propertyValues: [],
        ModifyPictureVisible: false,
        changeDetailImage: false,
        mindex: '',
        totalComment: 0,
        hideOnSinglePage: false,
        commentPageSize: 2,
        commentList: []
      }
    },
    computed: {
      ...mapState({
        isAdmin: state=>state.Person.isAdmin,
        types: state=>state.Products.productTypes,
        products: state=>state.Products.products,
        activeProperties: state=>state.Products.productPropertyNames,
        isClick: state=>state.ClickProduct.isClick,
        clickProduct: state=>state.ClickProduct.clickProduct,
        clickProductProperties: state=>state.ClickProduct.clickProductProperties,
        activeType: state=>state.Products.activeType,
        productPictures: state=>state.ClickProduct.clickProductPictures
      }),
      dialogName: function() {
        return "添加" + this.activeType
      },
      productSpanValue: function() {
        return 24/this.products.length
      }
    },
    mounted() {
      this.$store.commit('ClickProduct/resetClick')
    },
    filters: {
      numFilter (value) {
        let realVal = parseFloat(value).toFixed(1)
        return realVal
      }
    },
    methods: {
      hasIllegalChar() {
        for (var i = 0; i < this.CreateProduct.name.length; i++) {
          if (specialKey.indexOf(this.CreateProduct.name.substr(i, 1)) != -1) {
            return true 
          }
        }
        return false
      },
      isEmptyKeywords() {
        if(this.CreateProduct.keywords.length > 0) {
          var flag = 0
          for(var i = 0;i < this.CreateProduct.keywords.length;i++) {
            if(this.CreateProduct.keywords[i] != '') {
              flag = 1
            } else {
              this.CreateProduct.keywords.splice(i,1)
              i--
            }
          }
          if(flag === 0) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      },
      isEmptyProperty() {
        if(this.CreateProduct.properties.length != this.activeProperties.length) {
          return true
        } else {
          for(var i = 0;i < this.CreateProduct.properties.length;i++) {
            if(this.CreateProduct.properties[i] === '') {
              return true
            }
          }
          return false
        }
      },
      onAdd() {
        this.CreateProduct.keywords.push('')
      },
      Delete(index) {
        this.CreateProduct.keywords.splice(index, 1)
      },
      onSuccess(res, file) {
        this.displayImageUrl = URL.createObjectURL(file.raw)
      },
      reset() {
        this.CreateProduct.name = ""
        this.CreateProduct.price = ""
        this.CreateProduct.stock = ""
        this.CreateProduct.keywords = []
        this.CreateProduct.properties = []
        this.CreateProductType.name = ''
        this.CreateProductType.property = ''
        this.mindex = ''
        this.changeDetailImage = ''
        this.displayImageUrl = ''
      },
      handleRemove(file, fileList) {
        let url = '/api/productPictureDelete'
        let formData = new FormData()
        formData.append("file",file.raw)

        axios({
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8'
          },
          data:formData
        }).then((response) => {
          console.log("Response",response)
        })
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
      picUpload(data) {
        let file = data.file
        let url = '/api/productPictureUpload'
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
          console.log(response.data)
        })
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制商品详情页面显示4张图片`);
      },
      createProduct() {
        if(this.CreateProduct.name != '') {
          if(this.CreateProduct.name.length <= 10) {
            if(this.hasIllegalChar()) {
              this.$message.warning("商品名称包含非法字符")
            } else {
              if(this.CreateProduct.price != '') {
                if(priceReg.test(this.CreateProduct.price)) {
                  if(this.CreateProduct.stock != '') {
                    if(stockReg.test(this.CreateProduct.stock)) {
                      if(this.isEmptyKeywords()) {
                        this.$message.warning("请至少输入一个关键字")
                      } else {
                        console.log("property",this.CreateProduct.properties)
                        if(this.isEmptyProperty()) {
                          this.$message.warning("请输入全部商品规格")
                        } else {
                          reqCreateProduct({
                            productName: this.CreateProduct.name,
                            productPrice: this.CreateProduct.price,
                            productStock: this.CreateProduct.stock,
                            productType: this.activeType,
                            keywords: this.CreateProduct.keywords,
                            properties: this.CreateProduct.properties
                          }).then((data) => {
                            this.$message.info(data)
                            if(data === '创建成功') {
                              this.CreateProductFormVisible = false
                              this.$store.dispatch('Products/getProducts', this.activeType)
                            }
                          }).catch(() => {
                            this.$message.error("登录失败，请检查网络连接")
                          })
                         } 
                      }
                    } else {
                      this.$message.warning("请正确输入商品库存")
                    }
                  } else {
                    this.$message.warning("请输入商品库存")
                  }
                } else {
                  this.$message.warning("请输入正确的商品价格并精确至小数点后一位")
                }
              } else {
                this.$message.warning("请输入商品价格")
              }
            }
          } else {
            this.$message.warning("商品名称不得超过10个字")
          }
        } else {
          this.$message.warning("请输入商品名称")
        } 
      },
      smallUrl(url) {
        return "/api/pictures/" + url
      },
      handleClick(tab, event) {
        this.$store.dispatch('Products/getAllTypes')
        if(this.isClick) {
          this.$store.commit('ClickProduct/changeClick')
        }
        this.$store.dispatch('Products/getPropertyName', tab.name)
        this.$store.dispatch('Products/getProducts', tab.name)
        this.$store.commit('Products/updateActiveType', tab.name)
      },
      Return() {
        if(this.isClick) {
          this.$store.commit('ClickProduct/changeClick')
        }
        this.$store.dispatch('Products/getProducts',this.activeType)
      },
      ModifyProperty() {
        this.isModify = true
        for(var i = 0;i < this.clickProductProperties.length;i++) {
          this.propertyValues[i] = this.clickProduct.propertyValue[i]
        }
      },
      ModifyCommit() {
        var tempstr = ''
        for(var i = 0;i < this.propertyValues.length;i++) {
          tempstr += this.propertyValues[i]
          tempstr += ";"
        }
        var str = tempstr.substr(0,tempstr.length - 1)
        AdminChangePropertyValue(str,this.clickProduct.productId).then(() => {
          this.propertyValues = []
          this.isModify = false
          this.$store.dispatch('Products/getProducts', this.activeType)
          this.$store.commit('ClickProduct/changeClick')
        })
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
      },
      hasChineseComma() {
        var ChineseComma = "，"
        for (var i = 0; i < this.CreateProductType.property.length; i++) {
          if (ChineseComma.indexOf(this.CreateProductType.property.substr(i, 1)) != -1) {
            return true 
          }
        }
        return false
      },
      createProductType() {
        if(this.CreateProductType.name != '') {
          if(this.CreateProductType.property != '') {
            if(!this.hasChineseComma()) {
              if(this.CreateProductType.property.charAt(this.CreateProductType.property.length - 1) != ',') {
                AdminCreateProductType({
                  typeName: this.CreateProductType.name,
                  propertyName: this.CreateProductType.property
                }).then(() => {
                  this.$store.dispatch('Products/getAllTypes')
                  this.CreateProductTypeFormVisible = false
                  this.CreateProductType.name = ''
                  this.CreateProductType.property = ''
                }).catch(() => {

                })
              } else {
                this.$message.warning("商品类型规格请勿以逗号结尾")
              }
            } else {
              this.$message.warning("请勿输入中文逗号")
            }
          } else {
            this.$message.warning("请输入商品类型规格")
          }
        } else {
          this.$message.warning("请输入商品类型名称")
        }
      },
      modifyDetailPicture(index) {
        this.mindex = index
        this.changeDetailImage = true
      },
      confirmModify(picture) {
        modifyProductDetailPicture(picture.picId).then((data) => {
          if(data === '修改成功') {
            this.changeDetailImage = false
            this.mindex = ''
            this.displayImageUrl = ''
            reqGetProductPictures(picture.roleId).then((data) => {
              this.$store.commit('ClickProduct/updateClickProductPictures', data)
            }).catch(() => {
              this.$message.error("获取图片失败")
            })
          } else {
            this.$message.warning(data)
          }
        })
      },
      deletePicture(picture) {
        AdminDeleteProductDetailImage(picture.picId).then((data) => {
          if(data === '修改成功') {
            reqGetProductPictures(picture.roleId).then((data) => {
              this.$store.commit('ClickProduct/updateClickProductPictures', data)
            }).catch(() => {
              this.$message.error("获取图片失败")
            })
          }
        })
      },
      confirmAdd(roleId) {
        AdminAddProductDetailImage(roleId).then((data) => {
          if(data === '修改成功') {
            reqGetProductPictures(roleId).then((data) => {
              this.$store.commit('ClickProduct/updateClickProductPictures', data)
              this.ModifyPictureVisible = false
            }).catch(() => {
              this.$message.error("获取图片失败")
            })
          }
        })
      },
      checkDetail(tab,event) {
        if(tab.name === 'second') {
          reqProductCommentCount(this.clickProduct.productId).then((data) => {
            this.totalComment = data
            if(this.totalComment <= 2) {
              this.hideOnSinglePage = true
            }
            reqProductComment(this.clickProduct.productId,1,this.commentPageSize).then((data) => {
              this.commentList = data
            }).catch(() => {
              this.$message.error("获取评价列表失败")
            })
          }).catch(() => {
            this.$message.error("获取评价数量")
          })
        }
      },
      handleCommentCurrentChange(val) {
        reqProductComment(this.clickProduct.productId,val,this.commentPageSize).then((data) => {
          this.commentList = data
        }).ctach(() => {
          this.$message.error("获取评价列表失败")
        })
      }
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