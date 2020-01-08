<template>
  <div v-loading="loading">
    <el-button type="primary" :disabled="buttonStatus" @click="fileAnalysis">证照解析</el-button>
    <el-button type="primary" :disabled="buttonStatus" @click="showFileDetail">证照信息</el-button>
    <el-button icon="el-icon-caret-top" v-show="upStatus" @click="backToTop" :circle="true" style="position: fixed;bottom: 30px;z-index: 100;right: 30px;background-color: red;height: 65px">UP</el-button>
    <el-table :data=fileList style="width:100%" highlight-current-row @row-click="rowClick">
      <el-table-column type="index" fixed="left"/>
      <el-table-column label="id" width="100" prop="id"/>
      <el-table-column label="文件类型" width="200" prop="fileTypeDesc"/>
      <el-table-column label="文件名称" prop="fileName">
        <template slot-scope="scope">
          <el-link type="primary" :href=url(scope.row) target="_blank">{{scope.row.fileName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文件内容" prop="fileName">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src=url(scope.row) />
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="200" prop="createTimeDesc"/>
    </el-table>
    <div style="text-align:center">
      <el-pagination layout="total,prev,pager,next,jumper" :total="totalFile" :page-size="filePageSize"
                     :hide-on-single-page="hideFileOnSinglePage" @current-change="handleFileCurrentChange"/>
    </div>
    <el-dialog :visible.sync="showFileDetailDialog" title="文件详情">
      <el-form :model="fileDetail" v-if="fileDetail != null && selectFile.fileType === 'LICENCE_YYZZWC_WATERMARK'">
        <el-form-item label="统一社会信用代码">
          {{ fileDetail.societyCode }}
        </el-form-item>
        <el-form-item label="名称">
          {{ fileDetail.name }}
        </el-form-item>
        <el-form-item label="类型">
          {{ fileDetail.type }}
        </el-form-item>
        <el-form-item label="负责人">
          {{ fileDetail.principal }}
        </el-form-item>
        <el-form-item label="经营范围">
          {{ fileDetail.businessScope }}
        </el-form-item>
        <el-form-item label="成立日期">
          {{ fileDetail.createDate }}
        </el-form-item>
        <el-form-item label="营业期限">
          {{ fileDetail.operatingPeriod }}
        </el-form-item>
        <el-form-item label="营业场所">
          {{ fileDetail.operatingPlace }}
        </el-form-item>
      </el-form>
      <el-form :model="fileDetail" v-if="fileDetail != null && selectFile.fileType === 'LICENCE_SYZBL_WATERMARK'">
        <el-form-item label="统一社会信用代码">
          {{ fileDetail.societyCode }}
        </el-form-item>
        <el-form-item label="经营者名称">
          {{ fileDetail.name }}
        </el-form-item>
        <el-form-item label="住所">
          {{ fileDetail.place }}
        </el-form-item>
        <el-form-item label="法定代表人(负责人)">
          {{ fileDetail.principal }}
        </el-form-item>
        <el-form-item label="经营项目">
          {{ fileDetail.operatingProject }}
        </el-form-item>
        <el-form-item label="经营场所">
          {{ fileDetail.operatingPlace }}
        </el-form-item>
        <el-form-item label="主体业态">
          {{ fileDetail.mainBusinessFormat }}
        </el-form-item>
        <el-form-item label="许可证编号">
          {{ fileDetail.permissionCode }}
        </el-form-item>
        <el-form-item label="日常监督管理机构">
          {{ fileDetail.dailyManagementOrg }}
        </el-form-item>
        <el-form-item label="日常监督管理人员">
          {{ fileDetail.dailyManagementPerson }}
        </el-form-item>
        <el-form-item label="投诉举报电话">
          {{ fileDetail.complaintPhone }}
        </el-form-item>
        <el-form-item label="发证机关">
          {{ fileDetail.certificationAuthority }}
        </el-form-item>
        <el-form-item label="签发人">
          {{ fileDetail.issuer }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {reqFileAnalysis, reqFileDetail, reqGetFile} from '../../api'

  export default {
    data () {
      return {
        fileList: [],
        totalFile: 0,
        filePageSize: 30,
        hideFileOnSinglePage: true,
        buttonStatus: true,
        selectFile: null,
        showFileDetailDialog: false,
        fileDetail: null,
        loading: false,
        upStatus: false
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll);
      reqGetFile({
        page: 1,
        rows: this.filePageSize
      }).then((data) => {
        if (data.success) {
          this.totalFile = data.data.total
          if (this.totalFile > this.filePageSize) {
            this.hideFileOnSinglePage = false
          }
          this.fileList = data.data.rows
        } else {
          this.$message.error(data.statusInfo)
        }
      }).catch(() => {
        this.$message.error('获取文件列表失败')
      })
    },
    methods: {
      url(data) {
        return 'https://img.luckincoffeecdn.com/' + data.fileUrl
      },
      handleScroll() {
        let distance = document.documentElement.scrollTop;
        this.upStatus = distance > 0;
      },
      backToTop() {
        let back = setInterval(() => {
          if(document.body.scrollTop || document.documentElement.scrollTop) {
            document.body.scrollTop -= 100;
            document.documentElement.scrollTop -= 100;
          } else {
            clearInterval(back);
          }
        });
      },
      handleFileCurrentChange(val) {
        reqGetFile({
          page: val,
          rows: this.filePageSize
        }).then((data) => {
          if (data.success) {
            this.buttonStatus = true;
            this.totalFile = data.data.total;
            if (this.totalFile > this.filePageSize) {
              this.hideFileOnSinglePage = false
            }
            this.fileList = data.data.rows
          } else {
            this.$message.error(data.statusInfo)
          }
        }).catch(() => {
          this.$message.error('获取文件列表失败')
        })
      },
      rowClick (row) {
        this.buttonStatus = false;
        this.selectFile = row;
      },
      fileAnalysis() {
        this.loading = true;
        reqFileAnalysis({
          fileId: this.selectFile.id,
          fileType: this.selectFile.fileType,
          fileUrl: 'https://img.luckincoffeecdn.com/' + this.selectFile.fileUrl
        }).then((data) => {
          if(data.success) {
            this.loading = false;
            this.$message.info("解析成功");
          } else {
            this.loading = false;
            this.$message.error(data.statusInfo);
          }
        })
      },
      showFileDetail() {
        reqFileDetail({
          fileId: this.selectFile.id,
          fileType: this.selectFile.fileType
        }).then((data) => {
          if(data.success) {
            this.showFileDetailDialog = true;
            this.fileDetail = data.data
          } else {
            this.$message.error(data.statusInfo)
          }
        })
      }
    }
  }
</script>
