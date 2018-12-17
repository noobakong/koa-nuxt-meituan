<template>
  <div>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list" :key="item">
        <a :href="'#city-'+item">{{item}}</a>
      </dd>
    </dl>
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id="'city-'+item.title">{{item.title}}</dt>
      <dd>
        <span v-for="c in item.city" :key="c">{{c}}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin'
  export default {
    data () {
      return {
        list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        blocks: []
      }
    },
    async mounted () {
      let self = this
      let blocks = []
      let {status,data: {city}} = await self.$axios.get('/geo/city')
      if (status === 200) {
        let p,c
        let d = {}
        city.forEach(item => {
          // 转换为拼音
          p=pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
          // 截取首字母
          c=p.charCodeAt(0)
          // 取a-z
          if (c>96&&c<123) {
            if (!d[p]) {
              d[p] = []
            }
            d[p].push(item.name)
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import "@/assets/css/changeCity/categroy.scss"
</style>
