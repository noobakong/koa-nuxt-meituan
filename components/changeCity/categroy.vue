<template>
  <div>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd v-for="item in list" :key="item">
        <a :href="'#city-'+item">{{item}}</a>
      </dd>
    </dl>
    <dl v-for="item in blocks" :key="item.title" class="m-categroy-section">
      <dt :id="'city-'+item.title">{{item.title}}</dt>
      <dd>
        <span v-for="c in item.city" :key="c" @click="goToPlace(c)">{{c}}</span>
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
        for (let [k,v] of Object.entries(d)) {
          blocks.push({
            title:k.toUpperCase(),
            city:v
          })
        }
        blocks.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        self.blocks = blocks
      }
    },
    methods: {
      async goToPlace(item) {
        console.log(item)
        this.$store.state.geo.position.city = item
        const { status: status3, data: { result } } = await this.$axios.get('/search/hotPlace', {
          params: {
            city: this.$store.state.geo.position.city.replace('市', '')
          }
        })
        this.$store.commit('home/setHotPlace', status3 === 200 ? result : [])
        sessionStorage.setItem('city',item)
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
