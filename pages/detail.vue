<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <crumbs :keyword="keyword" :type="type"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <Summary :meta="product"/>
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>团购及优惠</h3>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <List
          v-if="login"
          :list="list"/>
        <div
          v-else
          class="deal-need-login">
          <img
            src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png"
            alt="登录查看">
          <span>请登录后查看详细团购优惠</span>
          <el-button
            type="primary"
            round>
            <a href="/login">立即登录</a>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Crumbs from '@/components/detail/crumbs.vue'
import Summary from '@/components/detail/summary.vue'
import List from '@/components/detail/list.vue'
export default {
  components: {
    Crumbs,
    Summary,
    List
  },
  computed: {
    canOrder () {
      return this.list.filter(item => item.photos.length).length
    }
  },
  async asyncData (ctx) {
    // 客户端拿不到请求参数，只能在服务器中拿到keyword和type
    let {keyword,type} = ctx.query
    let {status,data: {product,more: list,login}} = await ctx.$axios.get('/search/products', {
      params: {
        keyword,
        type,
        city: ctx.store.state.geo.position.city
      }
    })
    if (status === 200) {
      return {
        keyword,
        product,
        type,
        list,
        login
      }
    } else {
      return {
        keyword,
        product: {},
        type,
        list: [],
        login: false
      }
    }
  },
  mounted() {
    console.log(this.login)
  }
}
</script>

<style lang="scss">
@import "@/assets/css/detail/index.scss";
</style>
