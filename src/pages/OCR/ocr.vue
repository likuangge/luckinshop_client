<template>
  <div>
    <el-button type="primary" :disabled="buttonStatus">证照解析</el-button>
    <el-button type="primary" :disabled="buttonStatus">证照信息</el-button>
    <el-table :data=fileList style="width:100%" highlight-current-row @row-click="rowClick">
      <el-table-column type="index" fixed="left"/>
      <el-table-column label="id" width="100" prop="id"/>
      <el-table-column label="文件类型" width="200" prop="fileTypeDesc"/>
      <el-table-column label="文件名称" prop="fileName">
        <template slot-scope="scope">
          <el-link type="primary">{{scope.row.fileName}}</el-link>
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
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'
  import {reqGetFile} from '../../api'

  export default {
    data() {
      return {
        fileList: [],
        totalFile: 0,
        filePageSize: 30,
        hideFileOnSinglePage: false,
        buttonStatus: true
      }
    },
    mounted() {
      reqGetFile({
        page: 1,
        rows: this.filePageSize
      }).then((data) => {
        if(data.success) {
          this.totalFile = data.data.total;
          this.fileList = data.data.rows;
        } else {
          this.$message.error(data.statusInfo);
        }
      }).catch(() => {
        this.$message.error("获取文件列表失败");
      })
    },
    methods: {
      url: function(data){
        let url = 'https://img.luckincoffeecdn.com/' + data.fileUrl;
        return url;
      },
      handleFileCurrentChange(val) {
        reqGetFile({
          page: val,
          rows: this.filePageSize
        }).then((data) => {
          if(data.success) {
            this.totalFile = data.data.total;
            this.fileList = data.data.rows;
          } else {
            this.$message.error(data.statusInfo);
          }
        }).catch(() => {
          this.$message.error("获取文件列表失败");
        })
      },
      rowClick(row) {
        this.buttonStatus = false;
      }
    }
  }
</script>
