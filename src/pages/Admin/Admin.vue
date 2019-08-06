<template>
  <el-tabs :tab-position="tabPosition" style="height: 500px;">
    <el-tab-pane label="Product Type">
      <h2>Product Type</h2>
      <el-divider></el-divider>
    </el-tab-pane>
    <el-tab-pane label="Order">配置管理</el-tab-pane>
    <el-tab-pane label="Credit">角色管理</el-tab-pane>
    <el-tab-pane label="Address">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>
<script>

  export default {
    data() {
      return {
        tabPosition: 'left'
      }
    }
  }
</script>

<style scoped>
  .accountInput {
    width:300px;
  }
</style>