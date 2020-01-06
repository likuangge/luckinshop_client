<template>
  <div>
    <el-button type="primary" :disabled="buttonStatus" @click="fileAnalysis">证照解析</el-button>
    <el-button type="primary" :disabled="buttonStatus" @click="showFileDetail">证照信息</el-button>
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
      <el-form :model="fileDetail" v-if="fileDetail != null">
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
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'
  import {reqGetFile, reqFileAnalysis, reqFileDetail} from '../../api'

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
        fileDetail: null
      }
    },
    mounted () {
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
        let url = 'https://img.luckincoffeecdn.com/' + data.fileUrl
        return url
      },
      handleFileCurrentChange(val) {
        reqGetFile({
          page: val,
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
      rowClick (row) {
        this.buttonStatus = false;
        this.selectFile = row;
      },
      fileAnalysis() {
        reqFileAnalysis({
          fileId: this.selectFile.id,
          fileUrl: 'https://img.luckincoffeecdn.com/' + this.selectFile.fileUrl
        }).then((data) => {
          if(data.success) {
            this.$message.info("解析成功");
          } else {
            this.$message.error(data.statusInfo);
          }
        })
      },
      showFileDetail() {
        reqFileDetail(this.selectFile.id).then((data) => {
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
