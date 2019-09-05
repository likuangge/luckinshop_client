<template>
  <el-tabs :tab-position="tabPosition" @tab-click="handleClick" style="height:700px;" v-model="defaulttab">
    <el-tab-pane label="用户管理" name="user">
      <h2>用户管理</h2>
      <el-divider></el-divider>
      <el-table :data="users" style="width:100%" height="400">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="userName" label="用户昵称"></el-table-column>
        <el-table-column prop="telephone" label="用户手机号"></el-table-column>
        <el-table-column prop="email" label="用户电子邮箱"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <p v-if="scope.row.forbidden === 0">正常</p>
            <p v-else>禁用</p>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button v-if="scope.row.forbidden === 0" @click="changeState(scope.row.userId)">禁用</el-button>
            <el-button v-else @click="changeState(scope.row.userId)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="订单管理" name="order">
      <el-row>
        <el-col :span="3">
          <h2>订单管理</h2>
        </el-col>
        <el-col :span="16">
          <div style="margin-top:17px">
            <el-input v-model="input" class="input-with-select" clearable :disabled="select === ''">
              <el-select v-model="select" slot="prepend" placeholder="搜索条件" style="width:120px">
                <el-option v-for="(searchCondition,index) in searchConditions" :key="index" :label="searchCondition" :value="index"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="Select" :disabled="select === ''"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-tabs @tab-click="checkOrder" v-model="activeOrder">
        <el-tab-pane v-for="(state,index) in orderState" :key="index" :label="state" :name="index">
          <el-table :data=orderList style="width:100%" height="450">
            <el-table-column type="index" fixed="left"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-row v-for="(product,index) in props.row.orderProducts" :key="index">
                  <el-col :span="6">
                    <el-avatar :src="picUrl(product.displayImage)" shape="square" :size="200"></el-avatar>
                  </el-col>
                  <el-col :span="4">
                    <div class="name">
                      {{product.productName}}
                    </div>
                    <div class="type">
                      {{product.typeName}}
                    </div>
                    <div class="type">
                      购买数量:{{product.count}}
                    </div>
                    <div style="margin-top:15px">
                      <el-tag v-for="(keyword,index) in product.keywords" :key="index" size="medium">{{keyword}}</el-tag>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <!--div v-for="(property,index) in product.propertyName" :key="property" class="property">
                      {{property}}:{{product.propertyValue[index]}}
                    </div-->
                    <el-form inline class="demo-table-expand" label-width="80px">
                      <el-form-item v-for="(property,index) in product.propertyName" :key="index" :label=property>
                        <span>{{product.propertyValue[index]}}</span>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderId" width="168"></el-table-column>
            <el-table-column label="所属用户" prop="userTelephone" width="125"></el-table-column>
            <el-table-column label="收货人姓名" prop="receiver" width="100"></el-table-column>
            <el-table-column label="收货人手机" prop="telephone" width="125"></el-table-column>
            <el-table-column label="收货人地址" prop="address" width="325"></el-table-column>
            <el-table-column label="订单总价格" width="100">
              <template slot-scope="scope">
                <p>{{scope.row.totalMoneyBeforeBenefit | numFilter}}</p>
              </template>
            </el-table-column>
            <el-table-column label="使用优惠券数量" prop="benefitCount" width="150"></el-table-column>
            <el-table-column label="优惠金额" prop="benefitMoney"></el-table-column>
            <el-table-column label="实付金额">
              <template slot-scope="scope">
                <p>{{scope.row.totalMoneyBeforeBenefit - scope.row.benefitMoney | numFilter}}</p>
              </template>
            </el-table-column>
            <el-table-column label="订单创建时间" prop="createTime" width="175"></el-table-column>
            <el-table-column label="订单状态" v-if="state === '搜索结果'" :filters="[{ text:'待发货',value:1},{ text:'待收货',value:2},{ text:'已完成',value:3},{ text:'已取消',value:4}]" :filter-method="filterMethod" filter-placement="bottom-end">
              <template slot-scope="scope">
                <p v-show="scope.row.state === 1">待发货</p>
                <p v-show="scope.row.state === 2">待收货</p>
                <p v-show="scope.row.state === 3">已完成</p>
                <p v-show="scope.row.state === 4">已取消</p>
              </template>
            </el-table-column>
            <el-table-column label="商品详情" width="100">请展开显示</el-table-column>
            <el-table-column v-if="index === 0" width="100">
              <template slot-scope="scope">
                <el-button type="primary" @click="Send(scope.row.orderId)">发货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane label="商品管理" name="product">
      <h2>商品管理</h2>
      <el-tabs @tab-click="checkProduct" v-model="activeProduct">
        <el-tab-pane label="商品类型" :name=0>
          <el-table :data="productTypes" style="width:100%" height="400">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="typeId" label="商品类型ID" width="100"></el-table-column>
            <el-table-column prop="typeName" label="商品类型名称" width="120"></el-table-column>
            <el-table-column label="商品类型规格" width="400">
              <template slot-scope="scope">
                <p v-if="!showProperty || scope.$index != index">{{scope.row.propertyName}}</p>
                <el-input v-if="showProperty && scope.$index === index" v-model="propertyInput"></el-input>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" v-if="!showProperty || scope.$index != index" @click="changeProperty(scope.row.propertyName,scope.$index)">修改规格</el-button>
                <el-button type="primary" v-if="showProperty && scope.$index === index" @click="confirmChangeProperty(scope.row.typeId)">确认修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="商品类型状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state === 0">已上架</p>
                <p v-else>已下架</p>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button v-if="scope.row.state === 0" @click="changeTypeState(scope.row.typeId)">下架</el-button>
                <el-button v-else @click="changeTypeState(scope.row.typeId)">上架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品详情" :name=1>
          <el-table :data="products" style="width:100%" height="450">
            <el-table-column type="index" fixed="left"></el-table-column>
            <el-table-column prop="productId" label="商品ID" width="80"></el-table-column>
            <el-table-column prop="productName" label="商品名称" width="100"></el-table-column>
            <el-table-column label="商品关键字" width="300">
              <template slot-scope="scope">
                <p v-if="!showKeywords || scope.$index != kindex">{{convertArray(scope.row.keywords)}}</p>
                <el-input v-if="showKeywords && scope.$index === kindex" v-model="keywordsInput"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                <el-button type="primary" v-if="!showKeywords || scope.$index != kindex" @click="changeKeywords(convertArray(scope.row.keywords),scope.$index)">修改关键字</el-button>
                <el-button type="primary" v-if="showKeywords && scope.$index === kindex" @click="confirmChangeKeywords(scope.row.productId)">确认修改</el-button>
              </template>
            </el-table-column>
            </el-table-column>
            <el-table-column label="商品价格" width="90">
              <template slot-scope="scope">
                <p v-if="!showPrice || scope.$index != pindex">{{scope.row.price | numFilter}}</p>
                <el-input v-if="showPrice && scope.$index === pindex" v-model="priceInput"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                <el-button type="primary" v-if="!showPrice || scope.$index != pindex" @click="changePrice(scope.row.price,scope.$index)">修改价格</el-button>
                <el-button type="primary" v-if="showPrice && scope.$index === pindex" @click="confirmChangePrice(scope.row.productId)">确认修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="商品库存">
              <template slot-scope="scope">
                <p v-if="!showStock || scope.$index != sindex">{{scope.row.stock}}</p>
                <el-input v-if="showStock && scope.$index === sindex" v-model="stockInput"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                <el-button type="primary" v-if="!showStock || scope.$index != sindex" @click="changeStock(scope.row.stock,scope.$index)">修改库存</el-button>
                <el-button type="primary" v-if="showStock && scope.$index === sindex" @click="confirmChangeStock(scope.row.productId)">确认修改</el-button>
              </template>
            </el-table-column>
            <el-table-column label="商品状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state === 0">已上架</p>
                <p v-else>已下架</p>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button v-if="scope.row.state === 0" @click="changeProductState(scope.row.productId)">下架</el-button>
                <el-button v-else @click="changeProductState(scope.row.productId)">上架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane label="积分管理" name="credit">
      <el-row>
        <el-col :span="20">
          <h2>积分管理</h2>
        </el-col>
        <el-col :span="4">
          <el-popover placement="bottom" width="200" trigger="click">
            <el-form :model="ModifyCreditRule">
              积分等级函数基数
              <el-form-item>
                <el-input v-model="ModifyCreditRule.baseNumber" clearable></el-input>
              </el-form-item>
              积分兑换优惠比例
              <el-form-item>
                <el-input v-model="ModifyCreditRule.benefit" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifyCreditRule">确认修改</el-button>
              </el-form-item>
            </el-form>
            <el-button style="margin-top:25px" type="primary" slot="reference">修改积分规则</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-table :data="creditRule" style="width:60%" height="500">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="level" label="积分等级"></el-table-column>
        <el-table-column prop="credit" label="所需积分"></el-table-column>
        <el-table-column prop="benefit" label="每1000积分可以兑换的优惠"></el-table-column>
      </el-table>   
    </el-tab-pane>
    <el-tab-pane label="操作记录" name="record">
      <h2>操作记录</h2>
      <el-tabs @tab-click="checkRecord" v-model="activeRecord">
        <el-tab-pane v-for="(type,index) in recordType" :key="index" :label="type" :name="index">
          <el-table :data=recordList style="width:100%" height="500">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="用户角色" v-if="type === '用户操作记录'" align="center" :filters="[{ text:'用户',value:0},{ text:'管理员',value:1}]" :filter-method="filterUserRole" filter-placement="bottom-end">
              <template slot-scope="scope">
                <p v-if="scope.row.role === 0">用户</p>
                <p v-else>管理员</p>
              </template>
            </el-table-column>
            <el-table-column label="用户角色" v-if="type === '订单操作记录'" align="center" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.role === 0">用户</p>
                <p v-if="scope.row.role === 1">管理员</p>
                <p v-if="scope.row.role === 2">系统</p>
              </template>
            </el-table-column>
            <el-table-column label="用户角色" v-if="type === '商品操作记录'" align="center" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.role === 0">用户</p>
                <p v-else>管理员</p>
              </template>
            </el-table-column>
            <el-table-column label="用户账号" prop="account" align="center"></el-table-column>
            <el-table-column label="用户行为" v-if="type === '用户操作记录'" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.action === 0">登录</p>
                <p v-if="scope.row.action === 1">登出</p>
                <p v-if="scope.row.action === 2">评价商品</p>
                <p v-if="scope.row.action === 3">修改积分等级函数基数</p>
                <p v-if="scope.row.action === 4">修改积分兑换优惠倍数</p>
                <p v-if="scope.row.action === 5">修改头像</p>
                <p v-if="scope.row.action === 6">修改昵称</p>
                <p v-if="scope.row.action === 7">修改手机号码</p>
                <p v-if="scope.row.action === 8">修改邮箱</p>
                <p v-if="scope.row.action === 9">修改密码</p>
                <p v-if="scope.row.action === 10">修改用户状态</p>
              </template>
            </el-table-column>
            <el-table-column label="用户行为" v-if="type === '订单操作记录'" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.action === 0">下单</p>
                <p v-if="scope.row.action === 1">付款</p>
                <p v-if="scope.row.action === 2">取消</p>
                <p v-if="scope.row.action === 3">发货</p>
                <p v-if="scope.row.action === 4">收货</p>
              </template>
            </el-table-column>
            <el-table-column label="用户行为" v-if="type === '商品操作记录'" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.action === 0">修改商品类型状态</p>
                <p v-if="scope.row.action === 1">修改商品类型规格</p>
                <p v-if="scope.row.action === 2">新增商品类型</p>
                <p v-if="scope.row.action === 3">修改商品关键字</p>
                <p v-if="scope.row.action === 4">修改商品价格</p>
                <p v-if="scope.row.action === 5">修改商品库存</p>
                <p v-if="scope.row.action === 6">修改商品状态</p>
                <p v-if="scope.row.action === 7">修改商品规格</p>
                <p v-if="scope.row.action === 8">新增商品</p>
                <p v-if="scope.row.action === 9">修改商品展示图片</p>
                <p v-if="scope.row.action === 10">修改商品详情图片</p>
                <p v-if="scope.row.action === 11">删除商品详情图片</p>
                <p v-if="scope.row.action === 12">增加商品详情图片</p>
                <p v-if="scope.row.action === 13">对商品进行评价</p>
              </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderId" v-if="type === '订单操作记录'" align="center"></el-table-column>
            <el-table-column label="商品类型" prop="type" v-if="type === '商品操作记录'" align="center" width="100"></el-table-column>
            <el-table-column label="商品名称" v-if="type === '商品操作记录'" align="center" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.productName != ''">{{scope.row.productName}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="time" align="center">
              <template slot="header" slot-scope="scope">
                <el-date-picker v-model="recordDate" type="date" value-format="yyyy-MM-dd" :picker-options="recordPickerOptions" placeholder="选择日期" clearable></el-date-picker>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align:center;margin-top:10px" v-if="type === '用户操作记录'">
            <el-pagination layout="total,prev,pager,next,jumper" :total="totalRecord" :page-size="recordPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleUserRecordChange"></el-pagination>
          </div>
          <div style="text-align:center;margin-top:10px" v-if="type === '订单操作记录'">
            <el-pagination layout="total,prev,pager,next,jumper" :total="totalRecord" :page-size="recordPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleOrderRecordChange"></el-pagination>
          </div>
          <div style="text-align:center;margin-top:10px" v-if="type === '商品操作记录'">
            <el-pagination layout="total,prev,pager,next,jumper" :total="totalRecord" :page-size="recordPageSize" :hide-on-single-page="hideOnSinglePage" @current-change="handleProductRecordChange"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane label="统计信息" name="statistics">
      <el-tabs type="card">
        <el-tab-pane label="用户订单统计">
          <el-row>
            <el-col :span="8">
              <div>开始日期</div>
              <el-date-picker v-model="beginDate" type="date" value-format="yyyy-MM-dd" :picker-options="beginPickerOptions" placeholder="选择日期"></el-date-picker>
            </el-col>
            <el-col :span="8">
              <div>结束日期</div>
              <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" :picker-options="endPickerOptions" placeholder="选择日期"></el-date-picker>
            </el-col>
            <el-col :span="8">
              <div>选择用户</div>
              <el-input v-model="dateUser" placeholder="请输入用户账号">
                <el-button slot="append" icon="el-icon-search" @click="createOrderChart"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <ve-line :data="chartData" :settings="chartSettings" v-if="datePicked" style="margin-top:10px"></ve-line>
        </el-tab-pane>
        <el-tab-pane label="商品销售统计">
          <el-row>
            <el-col :span="8">
              <div>开始日期</div>
              <el-date-picker v-model="beginDate" type="date" value-format="yyyy-MM-dd" :picker-options="beginPickerOptions" placeholder="选择日期"></el-date-picker>
            </el-col>
            <el-col :span="8">
              <div>结束日期</div>
              <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" :picker-options="endPickerOptions" placeholder="选择日期"></el-date-picker>
            </el-col>
            <el-col :span="8">
              <div>选择商品</div>
              <el-row>
                <el-col :span="12">
                  <el-select v-model="selectType" placeholder="请选择商品类型">
                    <el-option v-for="(type,index) in types" :key="index" :label="type" :value="type"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="selectProduct" placeholder="请选择商品">
                    <el-option v-for="(product,index) in chartProducts" :key="index" :label="product.productName" :value="product.productId"></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <ve-histogram :data="productData" v-if="productPicked" style="margin-top:10px"></ve-histogram>
        </el-tab-pane>
        <el-tab-pane label="购买地图">
          <div>
            <div>选择日期</div>
            <el-date-picker v-model="mapDate" type="date" value-format="yyyy-MM-dd" :picker-options="mapPickerOptions" placeholder="选择日期"></el-date-picker>
          </div>
          <div style="width:550px">
            <ve-map :data="mapData" v-if="mapPicked" style="margin-top:10px"></ve-map>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {mapState} from 'vuex'
  import {AdminGetOrder,AdminSendOrder,AdminCreditRule,AdminUserInfo,AdminChangeState,AdminProductType,AdminGetProduct,AdminSearchOrder,AdminUserRecord,AdminOrderRecord,AdminProductRecord,AdminChangeTypeState,AdminChangeProperty,AdminChangeKeywords,AdminChangePrice,AdminChangeStock,AdminChangeProductState,AdminDateOrderFilter,AdminGetUserRecord,AdminGetOrderRecord,AdminGetProductRecord,AdminModifyCreditRule} from '../../api'
  import { Notification } from 'element-ui'
  import addressData from '../../assets/citys.json'

  const telReg = /^1[3|4|5|6|7|8|9]\d{9}$/
  const emReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

  export default {
    data() {
      this.chartSettings = {
        axisSite: { right: ['订单完成数量'] },
        yAxisType: ['RMB', 'RMB'],
        yAxisName: ['元', '个']
      }
      return {
        defaulttab: 'user',
        tabPosition: 'left',
        orderState: ['待发货','待收货','已完成','已取消'],
        recordType: ['用户操作记录','订单操作记录','商品操作记录'],
        searchConditions: ['订单编号','用户ID'],
        activeOrder: 2,
        orderList: [],
        select: '',
        input: '',
        creditRule: [],
        activeProduct: '',
        products: [],
        activeRecord: '',
        recordList: [],
        productTypes: [],
        showKeywords: false,
        index: '',
        kindex: '',
        showProperty: false,
        propertyInput: '',
        keywordsInput: '',
        showPrice: false,
        pindex: '',
        priceInput: '',
        showStock: '',
        sindex: '',
        stockInput: '',
        beginDate: null,
        endDate: null,
        beginPickerOptions: {
          disabledDate: (time) => {
            return this.dateConstrain(time, "BEGIN")
          }
        },
        endPickerOptions: {
          disabledDate: (time) => {
            return this.dateConstrain(time, "END")
          }
        },
        mapPickerOptions: {
          disabledDate: (time) => {
            return this.dateConstrain(time, "MAP")
          }
        },
        recordPickerOptions: {
          disabledDate: (time) => {
            return this.dateConstrain(time, "MAP")
          }
        },
        datePicked: false,
        chartData: {
          columns:['日期','花费金额','订单完成数量'],
          rows: []
        },
        dateUser: '',
        selectType: '',
        selectProduct: '',
        productData: {
          columns:['日期','购买数量'],
          rows: []
        },
        productPicked: false,
        mapDate: null,
        mapData: {
          columns:['位置','订单完成数量','订单取消数量'],
          rows: []
        },
        mapPicked: false,
        totalRecord: '',
        recordPageSize: 10,
        hideOnSinglePage: false,
        ModifyCreditRule: {
          baseNumber: '',
          benefit: ''
        },
        recordDate: null,
        dateSelect: false
      }
    },
    computed: {
      ...mapState({
        isLogin: state=>state.Person.isLogin,
        isAdmin: state=>state.Person.isAdmin,
        unsendOrder: state=>state.Order.unsendOrder,
        users: state=>state.Person.users,
        types: state=>state.Products.productTypes,
        chartProducts: state=>state.Products.products
      }),
      dateDiff: function () {
        if (this.beginDate != null && this.endDate != null) {
          let beginDate = new Date(this.beginDate)
          let endDate = new Date(this.endDate)
          let minus = endDate.getTime()-beginDate.getTime()
          let days = parseInt(minus / (1000*60*60*24))
          return days+1
        } else {
          return null
        }
      }
    },
    filters: {
      numFilter(value) {
        let realVal = parseFloat(value).toFixed(1)
        return realVal
      }
    },
    mounted() {
      if(!this.isLogin) {
        this.$router.push('/home')
        this.$message.warning("请先登录")
      } else if(!this.isAdmin) {
        this.$router.push('/home')
        this.$message.warning("您不是管理员！")
      }
    },
    watch: {
      selectType() {
        this.selectProduct = ''
        this.$store.dispatch('Products/getProducts', this.selectType)
      },
      selectProduct() {
        if(this.beginDate != null) {
          if(this.endDate != null) {
            this.productData.rows = []
            AdminDateOrderFilter(this.beginDate,this.endDate,"").then((data) => {
              this.productPicked = true
              let date = new Date(this.beginDate)
              for(let i=0;i<this.dateDiff;i++) {
                let exist = false
                let totalFinishOrder = 0
                for(let order of data) {
                  let orderDate = new Date(order.createTime)
                  if(orderDate.getDate() == date.getDate()) {
                    if(order.state === 3) {
                      for(let product of order.orderProducts) {
                        if(product.productId === this.selectProduct) {
                          console.log(orderDate.getDate(),product)
                          exist = true
                          totalFinishOrder += product.count
                        }
                      } 
                    }
                  }
                }
                if(!exist) {
                  this.productData.rows.push({
                    '日期': (date.getMonth()+1).toString()+"/"+date.getDate(),
                    '购买数量': 0
                  })
                } else {
                  this.productData.rows.push({
                    '日期': (date.getMonth()+1).toString()+"/"+date.getDate(),
                    '购买数量': totalFinishOrder
                  })
                }
                date.setDate(date.getDate() + 1)
              }
              this.beginDate = null
              this.endDate = null
            })
          } else {
            this.$message.warning("请选择结束日期")
            this.selectType = ''
            this.selectProduct = ''
          }
        } else {
          this.$message.warning("请选择开始日期")
          this.selectType = ''
          this.selectProduct = ''
        }
      },
      mapDate() {
        this.mapData.rows = []
        AdminDateOrderFilter(this.mapDate,this.mapDate,"").then((data) => {
          this.mapPicked = true
          for(let i = 0;i < addressData.length;i++) {
            let totalFinishOrder = 0
            let totalCancelOrder = 0
            for(let order of data) {
              if(order.address.indexOf(addressData[i]['label']) == 0) {
                console.log(order.address,addressData[i]['label'])
                if(order.state === 3) {
                  totalFinishOrder++
                }
                if(order.state === 4) {
                  totalCancelOrder++
                }
              }
            } 
            this.mapData.rows.push({
              '位置': addressData[i]['label'].substr(0,addressData[i]['label'].length-1),
              '订单完成数量': totalFinishOrder,
              '订单取消数量': totalCancelOrder
            })
          }
        })
      },
      recordDate() {
        if(this.recordDate != null) {
          this.dateSelect = true
          if(this.activeRecord === '0') {
            AdminUserRecord(this.recordDate).then((data) => {
              this.activeRecord = '0'
              this.totalRecord = data
              if(this.totalRecord <= this.recordPageSize) {
                this.hideOnSinglePage = true
              }
              AdminGetUserRecord(1,this.recordPageSize,this.recordDate).then((data) => {
                this.recordList = data
              }).catch(() => {
                this.$message.error("获取用户操作记录失败")
              })
            }).catch(() => {
              this.$message.error("获取用户操作记录数量失败")
            })
          }
        } else {
          this.dateSelect = false
          if(this.activeRecord === '0') {
            AdminUserRecord('').then((data) => {
              this.activeRecord = '0'
              this.totalRecord = data
              if(this.totalRecord <= this.recordPageSize) {
                this.hideOnSinglePage = true
              }
              AdminGetUserRecord(1,this.recordPageSize,'').then((data) => {
                this.recordList = data
              }).catch(() => {
                this.$message.error("获取用户操作记录失败")
              })
            }).catch(() => {
              this.$message.error("获取用户操作记录数量失败")
            })
          }
        }
      }
    },
    methods: {
      handleClick(tab, event) {
        if(this.orderState.length > 4) {
          this.orderState.pop()
        }
        if(tab.name === "order") {
          if(this.unsendOrder > 0) {
            this.activeOrder = '0'
            AdminGetOrder(1).then((data) => {
              this.orderList = data
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          } else {
            AdminGetOrder(3).then((data) => {
              this.activeOrder = 2
              this.orderList = data
            }).catch(() => {
              this.$message.error("获取订单失败")
            })
          }
        }
        if(tab.name == "credit") {
          AdminCreditRule().then((data) => {
            this.creditRule = data
          })
        }
        if(tab.name == "product") {
          AdminProductType().then((data) => {
            this.activeProduct = '0'
            this.productTypes = data
          })
        }
        if(tab.name == "record") {
          AdminUserRecord('').then((data) => {
            this.activeRecord = '0'
            this.totalRecord = data
            if(this.totalRecord <= 2) {
              this.hideOnSinglePage = true
            }
            AdminGetUserRecord(1,this.recordPageSize,'').then((data) => {
              this.recordList = data
            }).catch(() => {
              this.$message.error("获取用户操作记录失败")
            })
          }).catch(() => {
            this.$message.error("获取用户操作记录数量失败")
          })
        }
      },
      picUrl(picName) {
        return "/api/pictures/" + picName
      },
      filterMethod(value,row) {
        return row.state === value
      },
      filterUserRole(value,row) {
        return row.role === value
      },
      checkOrder(tab,event) {
        if(this.orderState.length > 4) {
          this.orderState.pop()
        }
        AdminGetOrder(tab.name + 1).then((data) => {
          this.orderList = data
        }).catch(() => {
          this.$message.error("获取订单失败")
        })
      },
      checkRecord(tab,event) {
        if(tab.name === 0) {
          AdminUserRecord('').then((data) => {
            this.activeRecord = '0'
            this.totalRecord = data
            if(this.totalRecord <= 2) {
              this.hideOnSinglePage = true
            }
            AdminGetUserRecord(1,this.recordPageSize,'').then((data) => {
              this.recordList = data
            }).catch(() => {
              this.$message.error("获取用户操作记录失败")
            })
          }).catch(() => {
            this.$message.error("获取用户操作记录数量失败")
          })
        }
        if(tab.name === 1) {
          AdminOrderRecord().then((data) => {
            this.activeRecord = 1
            this.totalRecord = data
            if(this.totalRecord <= 2) {
              this.hideOnSinglePage = true
            }
            AdminGetOrderRecord(1,this.recordPageSize).then((data) => {
              this.recordList = data
            }).catch(() => {
              this.$message.error("获取订单操作记录失败")
            })
          }).catch(() => {
            this.$message.error("获取订单操作记录数量失败")
          })
        }
        if(tab.name === 2) {
          AdminProductRecord().then((data) => {
            this.activeRecord = 2
            this.totalRecord = data
            if(this.totalRecord <= 2) {
              this.hideOnSinglePage = true
            }
            AdminGetProductRecord(1,this.recordPageSize).then((data) => {
              this.recordList = data
            }).catch(() => {
              this.$message.error("获取商品操作记录失败")
            })
          }).catch(() => {
            this.$message.error("获取商品操作记录数量失败")
          })
        }
      },
      checkProduct(tab,event) {
        if(tab.name === 0) {
          AdminProductType().then((data) => {
            this.productTypes = data
          })
        }
        if(tab.name === 1) {
          AdminGetProduct().then((data) => {
            this.products = data
          })
        }
      },
      messageUnsend() {
        return this.unsendOrder +'个未发货的订单！请到订单管理进行发货!'
      },
      convertArray(array) {
        var str = ''
        for(var i = 0;i < array.length;i++) {
          str += array[i]
          str += ','
        }
        var finalstr = str.substr(0,str.length-1)
        return finalstr
      },
      Send(orderId) {
        AdminSendOrder(orderId).then(() => {
          AdminGetOrder(2).then((data) => {
            this.$store.commit('Order/unsendMinus')
            this.activeOrder = 1
            this.orderList = data
            Notification.closeAll()
            if(this.unsendOrder > 0) {
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
          }).catch(() => {
            this.$message.error("获取订单失败")
          })
        })
      },
      changeState(userId) {
        AdminChangeState(userId).then(() => {
          AdminUserInfo().then((data) => {
            this.$store.commit('Person/setUsers',data)
          })
        })
      },
      changeProductState(productId) {
        AdminChangeProductState(productId).then(() => {
          AdminGetProduct().then((data) => {
            this.products = data
          })
        })
      },
      changeTypeState(typeId) {
        AdminChangeTypeState(typeId).then(() => {
          AdminProductType().then((data) => {
            this.$store.dispatch('Products/getAllTypes')
            this.productTypes = data
          })
        })
      },
      Select() {
        this.orderState.push("搜索结果")
        this.activeOrder = 4
        AdminSearchOrder(this.select,this.input).then((data) => {
          this.orderList = data
          this.select = ''
          this.input = ''
        })
      },
      changeProperty(propertyName,index) {
        this.showProperty = true
        this.propertyInput = propertyName
        this.index = index
      },
      confirmChangeProperty(typeId) {
        AdminChangeProperty(this.propertyInput,typeId).then(() => {
          AdminProductType().then((data) => {
            this.productTypes = data
            this.showProperty = false
          })
        })
      },
      changeKeywords(keywords,index) {
        this.showKeywords = true
        this.keywordsInput = keywords
        this.kindex = index
      },
      confirmChangeKeywords(productId) {
        AdminChangeKeywords(this.keywordsInput,productId).then(() => {
          AdminGetProduct().then((data) => {
            this.products = data
            this.showKeywords = false
          })
        })
      },
      changePrice(price,index) {
        this.showPrice = true
        this.priceInput = price
        this.pindex = index
      },
      confirmChangePrice(productId) {
        AdminChangePrice(this.priceInput,productId).then(() => {
          AdminGetProduct().then((data) => {
            this.products = data
            this.showPrice = false
          })
        })
      },
      changeStock(stock,index) {
        this.showStock = true
        this.stockInput = stock
        this.sindex = index
      },
      confirmChangeStock(productId) {
        AdminChangeStock(this.stockInput,productId).then(() => {
          AdminGetProduct().then((data) => {
            this.products = data
            this.showStock = false
          })
        })
      },
      dateConstrain: function(time, order) {
        let date = new Date(time)
        if(date.getTime() >= Date.now()) {
          return true
        }
        if(this.beginDate != null || this.endDate != null) {
          if(order == "BEGIN") {
            let begin = new Date(time)
            let end = new Date(this.endDate)
            return this.amongOneMonth(begin, end)
          } 
          if(order == "END") {
            let begin = new Date(this.beginDate)
            let end = new Date(time)
            return this.amongOneMonth(begin, end)
          }
        }
        return false
      },
      amongOneMonth: function (begin, end) {
        if(begin.getTime() < end.getTime() && (begin.getMonth() == end.getMonth() || ((end.getMonth()-begin.getMonth() === 1 || (begin.getMonth() == 11 && end.getMonth() == 0)) && begin.getDate() >= end.getDate()))) {
          return false
        }
        return true
      },
      createOrderChart() {
        if(this.beginDate != null) {
          if(this.endDate != null) {
            if(this.dateUser != '') {
              if(telReg.test(this.dateUser) || emReg.test(this.dateUser)) {
                this.chartData.rows = []
                AdminDateOrderFilter(this.beginDate,this.endDate,this.dateUser).then((data) => {
                  this.datePicked = true
                  let date = new Date(this.beginDate)
                  for(let i=0;i<this.dateDiff;i++) {
                    let exist = false
                    let totalMoney = 0
                    let totalFinishOrder = 0
                    for (let order of data) {
                      let orderDate = new Date(order.createTime)
                      if(orderDate.getDate() == date.getDate()) {
                        exist = true
                        if(order.state === 3) {
                          totalMoney += order.totalMoneyBeforeBenefit
                          totalFinishOrder++
                        } 
                      }
                    }
                    if(!exist) {
                      this.chartData.rows.push({
                        '日期': (date.getMonth()+1).toString()+"/"+date.getDate(),
                        '花费金额': 0,
                        '订单完成数量': 0
                      })
                    } else {
                      this.chartData.rows.push({
                        '日期': (date.getMonth()+1).toString()+"/"+date.getDate(),
                        '花费金额': totalMoney,
                        '订单完成数量': totalFinishOrder
                      })
                    }
                    date.setDate(date.getDate() + 1)
                  }
                  this.beginDate = null
                  this.endDate = null
                  this.dateUser = ''
                }).catch(() => {
                  this.$message.error("获取过滤订单失败")
                })
              } else {
                this.$message.warning("请输入正确的用户账号")
              }
            } else {
              this.$message.warning("请输入用户账号")
            }
          } else {
            this.$message.warning("请选择结束日期")
          }
        } else {
          this.$message.warning("请选择开始日期")
        }
      },
      handleUserRecordChange(val) {
        if(this.dateSelect) {
          AdminGetUserRecord(val,this.recordPageSize,this.recordDate).then((data) => {
            this.recordList = data
          }).catch(() => {
            this.$message.error("获取用户操作记录失败")
          })
        } else {
          AdminGetUserRecord(val,this.recordPageSize,'').then((data) => {
            this.recordList = data
          }).catch(() => {
            this.$message.error("获取用户操作记录失败")
          })
        }
      },
      handleOrderRecordChange(val) {
        AdminGetOrderRecord(val,this.recordPageSize).then((data) => {
          this.recordList = data
        }).catch(() => {
          this.$message.error("获取订单操作记录失败")
        })
      },
      handleProductRecordChange(val) {
        AdminGetProductRecord(val,this.recordPageSize).then((data) => {
          this.recordList = data
        }).catch(() => {
          this.$message.error("获取商品操作记录失败")
        })
      },
      modifyCreditRule() {
        AdminModifyCreditRule(this.ModifyCreditRule.baseNumber,this.ModifyCreditRule.benefit).then(() => {
          AdminCreditRule().then((data) => {
            this.creditRule = data
          })
        })
      }
    }
  }
</script>

<style scoped>
  .accountInput {
    width:300px;
  }
  .name{
    font-family: 等线;
    font-size: 24px;
  }
  .type{
    font-family: 仿宋;
    font-size: 20px;
    margin-top: 15px;
  }
  .property{
    font-family: 仿宋;
    font-size: 20px;
  }
  .demo-table-expand {
    font-family: 仿宋;
    font-size: 0;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .input-with-select {
    width: 500px;
    background-color: #fff;
  }
  .text-wrapper {
    white-space: pre-wrap;
  }
</style>