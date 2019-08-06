<template>
    <el-carousel indicator-position="none" height="450px">
        <el-carousel-item v-for="url in urls" :key="url">
            <el-image :src="url" :fit="cover"></el-image>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
  export default {
    data() {
      return {
        urls: ['../../../static/1.jpg','../../../static/2.png','../../../static/3.png']
      }
    }
  }
</script>

<style scoped>
</style>