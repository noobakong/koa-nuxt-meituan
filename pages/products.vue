<template>
  <div class="page-product">
    <el-row class="page-product">
      <!-- 产品 -->
      <el-col :span="19">
        <!-- 面包屑 -->
        <!-- <Crumbs :keyword="keyword"/> -->
        <!-- 分类 -->
        <Categroy
          :types="types"
          :areas="areas"
        />
        <!-- 产品列表 -->
        <List :list="list"/>
      </el-col>
      <!-- 地图 -->
      <el-col :span="5">
        <Amap
          v-if="point.length"
          :width="230"
          :height="290"
          :point="point"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import Crumbs from '@/components/products/crumbs'
  import Categroy from '@/components/products/categroy'
  import List from '@/components/products/list'
  import Amap from '@/components/public/map'

  export default {
    components: {
      // Crumbs,
      Categroy,
      List,
      Amap
    },
    data () {
      return {
        list: [],
        types: [],
        areas: [],
        keyword: '',
        point: []
      }
    },
    // ssr
    async asyncData (ctx) {
      // get请求获取keyword
      let keyword = ctx.query.keyword
      console.log(keyword)
      // 获取城市
      let city = ctx.store.state.geo.position.city
      console.log(city)
      let { status, data: { count, pois } } = await ctx.$axios.get('/search/resultByKeywords', {
        params: {
          keyword,
          city
        }
      })
      // console.log(pois)
      let { status: status2, data: { areas, types } } = await ctx.$axios.get('/categroy/crumbs', {
        params: {
          city
        }
      })
      // // 数据映射
      if (status === 200 && count > 0 && status2 === 200) {
        return {
          list: pois.filter(item => item.photos.length).map(item => {
            return {
              type: item.type,
              img: item.photos[0].url,
              name: item.name,
              comment: Math.floor(Math.random() * 10000),
              rate: Number(item.biz_ext.rating),
              price: Number(item.biz_ext.cost),
              scene: item.tag,
              tel: item.tel,
              status: '可订明日',
              location: item.location,
              module: item.type.split(';')[0]
            }
          }),
          keyword,
          areas: areas.filter(item => item.type !== '').slice(0, 5),
          types: types.filter(item => item.type !== '').slice(0, 5),
          point: (pois.find(item => item.location).location || '').split(',')
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/products/index.scss";
</style>
