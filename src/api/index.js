import ajax from './ajax'

const BASE_URL = '/api'

//获取文件
export const reqGetFile = ({page, rows}) => ajax(BASE_URL+'/ocr/fileList', {page, rows}, 'POST')

// 1、普通用户登录
export const reqLogin = ({username,password}) => ajax(BASE_URL+'/members/login', {username,password}, 'POST')

// 2、判断用户最近是否登录
export const reqGetUserInfo = (memberId) => ajax(BASE_URL+'/members/getInfo',{memberId})

// 3、修改用户信息
export const reqModifyUserInfo = ({memberId,nickname,phoneNum,email}) => ajax(BASE_URL+'/members/updateInfo',{memberId,nickname,phoneNum,email},'PUT')

// 4、登出
export const reqLogout = () => ajax(BASE_URL+'/user/logout')

// 5、判断管理员最近是否登录
export const reqAdminInitLogin = () => ajax(BASE_URL+'/admin/init')

// 6、获取所有商品类型
export const reqGetAllTypes = () => ajax(BASE_URL+'/productType/getFirstType')

export const reqGetSecondTypes = (typeNo) => ajax(BASE_URL + '/productType/getSecondType', {typeNo})

// 8、获取商品
export const reqGetProducts = (typeName) => ajax(BASE_URL+'/product/getProducts', {typeName})

// 9、确认头像修改
export const reqModifyCommit = () => ajax(BASE_URL+'/commit')

// 12、购物车信息插入Redis
export const insertShopCart = ({memberId,productNo,quantity}) => ajax(BASE_URL+'/cart/addCart',{memberId,productNo,quantity},'POST')

// 13、获取购物车信息
export const reqInitShopCart = ({memberId}) => ajax(BASE_URL+'/cart/viewShopCart',{memberId},'POST')

export const reqGetSecKillTime = () => ajax(BASE_URL+'/seckill/secKillTime')

export const reqSecKillProduct = () => ajax(BASE_URL+'/product/searchSeckillProduct')

export const reqSearchExpiredSeckillProduct = () => ajax(BASE_URL+'/product/searchExpiredSeckillProduct')

export const reqGetCoupon = (memberId) => ajax(BASE_URL+"/activities/getCoupon",{memberId})

// 15、增加购物车商品数量
export const reqEditShopCart = ({memberId,productNo,type}) => ajax(BASE_URL+'/cart/editCart',{memberId,productNo,type},'POST')

export const reqSubmitOrder = ({memberId,productNos}) => ajax(BASE_URL+'/order/confirm',{memberId,productNos},'POST')

export const reqGetMessage = (memberId) => ajax(BASE_URL+'/message/getMessage',{memberId})

// 17、添加地址
export const reqAddAddress = ({memberId,receiver,phoneNum,province,city,area,detailAddress,defaultAddress}) => ajax(BASE_URL+'/address/addAddress',{memberId,receiver,phoneNum,province,city,area,detailAddress,defaultAddress},'POST')

// 18、获取所有地址
export const reqGetAddress = (memberId) => ajax(BASE_URL+'/address/getAddressByMemberId',{memberId})

// 19、修改地址默认状态
export const reqSetDefault = ({memberId,addressNo}) => ajax(BASE_URL+'/address/changeDefault',{memberId,addressNo},'PUT')

// 20、删除地址
export const reqDeleteAddress = (addressNo) => ajax(BASE_URL+'/address/deleteAddress',{addressNo},'DELETE')

// 21、修改地址
export const reqModifyAddress = ({addressNo,receiver,phoneNum,province,city,area,detailAddress}) => ajax(BASE_URL+'/address/updateAddress',{addressNo,receiver,phoneNum,province,city,area,detailAddress},'PUT')

// 23、创建订单
export const reqCreateOrder = ({memberId,productNos,addressNo,couponDTO}) => ajax(BASE_URL+'/order/createOrder',{memberId,productNos,addressNo,couponDTO},'POST')

// 25、获得相应用户订单
export const reqGetOrder = ({memberId,orderStatus,page,rows}) => ajax(BASE_URL+'/order/getOrder',{memberId,orderStatus,page,rows},'POST')

// 26、是否有未支付的订单
export const reqUnpaid = ({memberId}) => ajax(BASE_URL+'/order/getUnpaid',{memberId},'POST')

// 27、取消订单
export const reqCancelOrder = ({memberId,orderNo}) => ajax(BASE_URL+'/order/cancelOrder',{memberId,orderNo},'POST')

export const reqGetCancelReason = () => ajax(BASE_URL+"/order/getCancelReason")

// 28、付款
export const reqPay = ({memberId,orderNo,couponDTO}) => ajax(BASE_URL+'/order/payOrder',{memberId,orderNo,couponDTO},'POST')

// 29、管理员获得订单
export const AdminGetOrder = (state) => ajax(BASE_URL+'/admin/getOrder',{state})

// 30、是否有未发货的订单
export const reqUnsend = () => ajax(BASE_URL+'/admin/getUnsend')

// 31、管理员发货
export const AdminSendOrder = (orderId) => ajax(BASE_URL+'/admin/send',{orderId})

// 32、是否有未收货的订单
export const reqUnreceive = () => ajax(BASE_URL+'/order/getunreceive')

// 33、确认收货
export const reqReceive = ({memberId,orderNo}) => ajax(BASE_URL+'/order/deliverOrder',{memberId,orderNo},'POST')

// 34、获取积分变更详情
export const reqCreditInfo = (memberId) => ajax(BASE_URL+'/point/get',{memberId})

export const reqCharge = ({memberId,balance}) => ajax(BASE_URL+"/members/changeBalance",{memberId,balance},'POST')

export const reqExchange = ({memberId,change}) => ajax(BASE_URL+"/members/point2balance",{memberId,change},'POST')

// 39、注册
export const reqSignup = ({username,nickname,password,phoneNum,email}) => ajax(BASE_URL+'/members/register',{username,nickname,password,phoneNum,email},'POST')

// 40、请求手机短信验证码
export const reqPhoneCode = (telephone) => ajax(BASE_URL+'/user/code', {telephone})

// 41、搜索商品
export const reqSearchProduct = ({parentType,productType,filter}) => ajax(BASE_URL+'/product/searchProduct',{parentType,productType,filter},'POST')

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

// 50、管理员更改商品关键字
export const AdminChangeKeywords = (keywords,productId) => ajax(BASE_URL+'/admin/changeKeywords',{keywords,productId})

// 51、管理员更改商品价格
export const AdminChangePrice = (price,productId) => ajax(BASE_URL+'/admin/changePrice',{price,productId})

// 52、管理员更改商品库存
export const AdminChangeStock = (stock,productId) => ajax(BASE_URL+'/admin/changeStock',{stock,productId})

// 53、管理员更改商品状态
export const AdminChangeProductState = (productId) => ajax(BASE_URL+'/admin/productState',{productId})

// 55、系统自动取消订单
export const reqSysCancelOrder = (orderId) => ajax(BASE_URL+'/order/syscancel',{orderId})

// 56、管理员修改商品展示图片
export const AdminModifyProductDisplayImage = (productId) => ajax(BASE_URL+'/admin/modifyProductDisplayImage',{productId})

// 60、提交评价
export const reqSubmitComment = ({memberId,orderNo,orderDetailDTOS}) => ajax(BASE_URL+'/comment/addComment',{memberId,orderNo,orderDetailDTOS},'POST')

// 61、获取评价列表
export const reqCommentProduct = (userId,state,page,limit) => ajax(BASE_URL+'/comment/getCommentProduct',{userId,state,page,limit})

// 62、获取评价商品数量
export const reqCommentCount = (userId,state) => ajax(BASE_URL+'/comment/getCommentCount',{userId,state})

// 64、获取商品评价列表
export const reqProductComment = ({productNo,page,rows}) => ajax(BASE_URL+'/comment/getComment',{productNo,page,rows},'POST')

export const reqReplyComment = ({userId,commentContent,parentId,replyId}) => ajax(BASE_URL+'/comment/replyComment',{userId,commentContent,parentId,replyId},'POST')

export const reqGetReplyComment = ({userId,page,rows}) => ajax(BASE_URL+"/comment/getReplyComment",{userId,page,rows},'POST')

export const reqGetMemComment = ({userId,page,rows}) => ajax(BASE_URL+"/comment/getMemComment",{userId,page,rows},'POST')

export const reqConfirmSecOrder = ({memberId,productNo,quantity}) => ajax(BASE_URL+'/seckill/confirmOrder',{memberId,productNo,quantity},'POST')

export const reqCreateSecOrder = ({memberId,productNo,quantity,addressNo}) => ajax(BASE_URL+'/seckill/createOrder',{memberId,productNo,quantity,addressNo},'POST')

export const reqApplyRefund = ({memberId,orderNo,cancelNo}) => ajax(BASE_URL+'/order/processingOrder',{memberId,orderNo,cancelNo},'POST')

export const reqGetActivity = () => ajax(BASE_URL+'/activities/getCampaigns')

// 70、修改密码
export const reqModifyPassword = ({memberId,password,newPassword}) => ajax(BASE_URL+'/members/changePassword',{memberId,password,newPassword},'PUT')

// 3、改变用户状态
export const reqChangeUser = (account) => ajax(BASE_URL+'/user/change', {account}, 'POST')

export const reqGetReplyUnreadCount = ({userId}) => ajax(BASE_URL+'/comment/getReplyUnreadCount',{userId},'POST')

export const reqGetUnreadMessage = ({memberId}) => ajax(BASE_URL+'/message/getMessageNum',{memberId},'POST')

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
