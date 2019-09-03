import ajax from './ajax'

const BASE_URL = '/api'

// 1、普通用户登录
export const reqLogin = ({account, password, role}) => ajax(BASE_URL+'/login', {account, password, role}, 'POST')

// 2、判断用户最近是否登录
export const reqInitLogin = () => ajax(BASE_URL+'/user/init')

// 3、修改用户信息
export const reqModifyUserInfo = ({userName,telephone,email}) => ajax(BASE_URL+'/user/modify', {userName,telephone,email}, 'POST')

// 4、登出
export const reqLogout = () => ajax(BASE_URL+'/user/logout')

// 5、判断管理员最近是否登录
export const reqAdminInitLogin = () => ajax(BASE_URL+'/admin/init')

// 6、获取所有商品类型
export const reqGetAllTypes = () => ajax(BASE_URL+'/product/getAllTypes')

// 7、获取商品属性名称
export const reqGetPropertyName = (typeName) => ajax(BASE_URL+'/product/getPropertyName', {typeName})

// 8、获取商品
export const reqGetProducts = (typeName) => ajax(BASE_URL+'/product/getProducts', {typeName})

// 9、确认头像修改
export const reqModifyCommit = () => ajax(BASE_URL+'/commit')

// 10、创建商品
export const reqCreateProduct = ({productName, productPrice, productStock, productType, keywords, properties}) => ajax(BASE_URL+'/product/createProduct', {productName, productPrice, productStock, productType, keywords, properties}, 'POST')

// 11、获取商品图片
export const reqGetProductPictures = (productId) => ajax(BASE_URL+'/getProductPictures', {productId})

// 12、购物车信息插入Redis
export const insertShopCart = ({productId,count}) => ajax(BASE_URL+'/shopcart/insertShopCart', {productId,count})

// 13、获取购物车信息
export const reqInitShopCart = () => ajax(BASE_URL+'/shopcart/init')

// 14、删除购物车信息
export const reqDeleteShopCart = (productId) => ajax(BASE_URL+'/shopcart/delete',{productId})

// 15、增加购物车商品数量
export const reqAddCount = (productId) => ajax(BASE_URL+'/shopcart/add',{productId})

// 16、减少购物车商品数量
export const reqSubstractCount = (productId) => ajax(BASE_URL+'/shopcart/substract',{productId})

// 17、添加地址
export const reqAddAddress = ({receiver,telephone,province,city,district,detail,isDefault}) => ajax(BASE_URL+'/address/insert',{receiver,telephone,province,city,district,detail,isDefault},'POST')

// 18、获取所有地址
export const reqGetAddress = () => ajax(BASE_URL+'/address/get')

// 19、修改地址默认状态
export const reqSetDefault = (addressId) => ajax(BASE_URL+'/address/setDefault',{addressId})

// 20、删除地址
export const reqDeleteAddress = (addressId) => ajax(BASE_URL+'/address/delete',{addressId})

// 21、修改地址
export const reqModifyAddress = ({addressId,receiver,telephone,province,city,district,detail}) => ajax(BASE_URL+'/address/modify',{addressId,receiver,telephone,province,city,district,detail},'POST')

// 22、清除订单Session
export const reqClearOrderSession = (orderId) => ajax(BASE_URL+'/order/clear',{orderId})

// 23、创建订单
export const reqCreateOrder = (addressId,benefitCount) => ajax(BASE_URL+'/order/create',{addressId,benefitCount})

// 24、获取订单过期时间
export const reqGetTime = () => ajax(BASE_URL+'/order/getTime')

// 25、获得相应用户订单
export const reqGetOrder = (state) => ajax(BASE_URL+'/order/get',{state})

// 26、是否有未支付的订单
export const reqUnpaid = () => ajax(BASE_URL+'/order/getUnpaid')

// 27、取消订单
export const reqCancelOrder = (orderId) => ajax(BASE_URL+'/order/cancel',{orderId})

// 28、付款
export const reqPay = (orderId) => ajax(BASE_URL+'/order/pay',{orderId})

// 29、管理员获得订单
export const AdminGetOrder = (state) => ajax(BASE_URL+'/admin/getOrder',{state})

// 30、是否有未发货的订单
export const reqUnsend = () => ajax(BASE_URL+'/admin/getUnsend')

// 31、管理员发货
export const AdminSendOrder = (orderId) => ajax(BASE_URL+'/admin/send',{orderId})

// 32、是否有未收货的订单
export const reqUnreceive = () => ajax(BASE_URL+'/order/getunreceive')

// 33、确认收货
export const reqReceive = (orderId) => ajax(BASE_URL+'/order/receive',{orderId})

// 34、获取积分变更详情
export const reqCreditInfo = () => ajax(BASE_URL+'/user/getcreditinfo')

// 35、管理员获取积分规则
export const AdminCreditRule = () => ajax(BASE_URL+'/admin/rule')

// 36、管理员获取用户信息
export const AdminUserInfo = () => ajax(BASE_URL+'/admin/user')

// 37、管理员更改用户状态
export const AdminChangeState = (userId) => ajax(BASE_URL+'/admin/state',{userId})

// 38、管理员获取商品信息
export const AdminGetProduct = () => ajax(BASE_URL+'/admin/product')

// 39、注册
export const reqSignup = ({telephone, userName, password, code, email}) => ajax(BASE_URL+'/user/signup', {telephone, userName, password, code, email}, 'POST')

// 40、请求手机短信验证码
export const reqPhoneCode = (telephone) => ajax(BASE_URL+'/user/code', {telephone})

// 41、搜索商品
export const reqSearchProduct = (type,filter) => ajax(BASE_URL+'/product/search',{type,filter})

// 42、管理员搜索订单
export const AdminSearchOrder = (type,filter) => ajax(BASE_URL+'/admin/searchOrder', {type,filter})

// 43、管理员获取用户操作记录
export const AdminUserRecord = (date) => ajax(BASE_URL+'/admin/userRecordCount',{date})

// 44、管理员获取订单操作记录
export const AdminOrderRecord = () => ajax(BASE_URL+'/admin/orderRecordCount')

// 45、管理员获取商品操作记录
export const AdminProductRecord = () => ajax(BASE_URL+'/admin/productRecordCount')

// 46、管理员获取商品类型信息
export const AdminProductType = () => ajax(BASE_URL+'/admin/productType')

// 47、管理员更改商品类型状态
export const AdminChangeTypeState = (typeId) => ajax(BASE_URL+'/admin/typeState',{typeId})

// 48、管理员更改商品类型规格
export const AdminChangeProperty = (propertyName,typeId) => ajax(BASE_URL+'/admin/changeProperty',{propertyName,typeId})

// 49、管理员增加商品类型
export const AdminCreateProductType = ({typeName,propertyName}) => ajax(BASE_URL+'/admin/createType',{typeName,propertyName},'POST')

// 50、管理员更改商品关键字
export const AdminChangeKeywords = (keywords,productId) => ajax(BASE_URL+'/admin/changeKeywords',{keywords,productId})

// 51、管理员更改商品价格
export const AdminChangePrice = (price,productId) => ajax(BASE_URL+'/admin/changePrice',{price,productId})

// 52、管理员更改商品库存
export const AdminChangeStock = (stock,productId) => ajax(BASE_URL+'/admin/changeStock',{stock,productId})

// 53、管理员更改商品状态
export const AdminChangeProductState = (productId) => ajax(BASE_URL+'/admin/productState',{productId})

// 54.管理员更改商品规格
export const AdminChangePropertyValue = (propertyValue,productId) => ajax(BASE_URL+'/admin/propertyValue',{propertyValue,productId})

// 55、系统自动取消订单
export const reqSysCancelOrder = (orderId) => ajax(BASE_URL+'/order/syscancel',{orderId})

// 56、管理员修改商品展示图片
export const AdminModifyProductDisplayImage = (productId) => ajax(BASE_URL+'/admin/modifyProductDisplayImage',{productId})

// 57、管理员修改商品详情图片
export const modifyProductDetailPicture = (picId) => ajax(BASE_URL+'/admin/modifyProductDetailPicture',{picId})

// 58、管理员删除商品详情图片
export const AdminDeleteProductDetailImage = (picId) => ajax(BASE_URL+'/admin/deleteProductDetailPicture',{picId})

// 59、管理员增加商品详情图片
export const AdminAddProductDetailImage = (roleId) => ajax(BASE_URL+'/admin/addProductDetailPicture',{roleId})

// 60、提交评价
export const reqSubmitComment = ({commentId,rate,comment}) => ajax(BASE_URL+'/comment/submitComment',{commentId,rate,comment},'POST')

// 61、获取评价列表
export const reqCommentProduct = (userId,state,page,limit) => ajax(BASE_URL+'/comment/getCommentProduct',{userId,state,page,limit})

// 62、获取评价商品数量
export const reqCommentCount = (userId,state) => ajax(BASE_URL+'/comment/getCommentCount',{userId,state})

// 63、获取商品评价数量
export const reqProductCommentCount = (productId) => ajax(BASE_URL+'/comment/getProductCommentCount',{productId})

// 64、获取商品评价列表
export const reqProductComment = (productId,page,limit) => ajax(BASE_URL+'/comment/getProductComment',{productId,page,limit})

// 65、日期筛选订单
export const AdminDateOrderFilter = (beginDate,endDate,account) => ajax(BASE_URL+'/admin/dateOrder', {beginDate,endDate,account})

// 66、分页获取用户操作记录
export const AdminGetUserRecord = (page,limit,date) => ajax(BASE_URL+'/admin/getUserRecord',{page,limit,date})

// 67、分页获取订单操作记录
export const AdminGetOrderRecord = (page,limit) => ajax(BASE_URL+'/admin/getOrderRecord',{page,limit})

// 68、分页获取商品操作记录
export const AdminGetProductRecord = (page,limit) => ajax(BASE_URL+'/admin/getProductRecord',{page,limit})

// 69、修改积分规则
export const AdminModifyCreditRule = (baseNumber,benefit) => ajax(BASE_URL+'/admin/modifyCreditRule',{baseNumber,benefit})

// 70、修改密码
export const reqModifyPassword = (oldPassword,newPassword) => ajax(BASE_URL+'/user/modifyPassword',{oldPassword,newPassword})

// 3、改变用户状态
export const reqChangeUser = (account) => ajax(BASE_URL+'/user/change', {account}, 'POST')

// 4、获取所有用户状态
export const reqGetUserState = () => ajax(BASE_URL+'/user/states')

// 5、获取所有书籍
export const reqGetAllBook = () => ajax(BASE_URL+'/book/get')

// 6、添加书籍
export const reqAddBook = (book) => ajax(BASE_URL+'/book/add', {
    name: book.name,
    author: book.author,
    isbn: book.isbn,
    outline: book.outline,
    price: book.price,
    stock: book.stock,
    cover: book.cover,
    press: book.press,
    year: book.year,
    pages: book.pages,
}, 'POST')

// 7、修改书籍
export const reqModifyBook = (book,newisbn,cover) => ajax(BASE_URL+'/book/modify', {
    name: book.name,
    author: book.author,
    isbn: book.isbn,
    newisbn: newisbn,
    outline: book.outline,
    price: book.price,
    stock: book.stock,
    cover: cover,
    press: book.press,
    year: book.year,
    pages: book.pages,
}, 'POST')

// 9、添加订单
export const reqAddOrder = (orders) => ajax(BASE_URL+'/order/add', {orders}, 'POST')

// 10、获得所有订单
export const reqGetAllOrder = () => ajax(BASE_URL+'/order/getall')

// 11、搜索书籍
export const reqSearchBook = (filter) => ajax(BASE_URL+'/book/search', {filter})

// 12、删除上传的书籍图片
export const reqDeleteImg = (filename) => ajax(BASE_URL+'/delete', {filename})

// 13、获得书籍详情
export const reqGetBookDetail = (ISBN) => ajax(BASE_URL+'/book/detail', {ISBN})

// 14、删除书籍
export const reqDeleteBook = (ISBN) => ajax(BASE_URL+'/book/delete', {ISBN})

// 19、日期筛选订单详情
export const reqDateDetailOrderFilter = (beginDate, endDate, account) => ajax(BASE_URL+'/order/dateDetail', {beginDate, endDate, account})

// 21、请求发送找回密码的电子邮件
export const reqSendMail = (email) => ajax(BASE_URL+'/mail',{email})