<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市：</dt>
      <dd v-for="(item) in list" :key="item.id" @click="goToPlace(item)">
        {{item.name==='市辖区'?item.province:item.name}}
      </dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: []
      }
    },
    async mounted () {
      let {status,data:{hots}} = await this.$axios.get('/geo/hotCity')
      if (status === 200) {
        this.list = hots
      }
    },
    methods: {
      async goToPlace(item) {
        console.log(item)
        item.name = item.name==="市辖区"?item.province:item.name
        this.$store.state.geo.position.city = item.name
        const { status: status3, data: { result } } = await this.$axios.get('/search/hotPlace', {
          params: {
            city: this.$store.state.geo.position.city.replace('市', '')
          }
        })
        this.$store.commit('home/setHotPlace', status3 === 200 ? result : [])
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss">
@import "~/assets/css/changeCity/hot.scss";
</style>
