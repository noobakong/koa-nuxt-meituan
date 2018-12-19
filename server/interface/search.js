import Router from 'koa-router'
import axios from './utils/axios'
import key from './utils/key'

let router = new Router({ prefix: '/search' })

router.get('/top',async (ctx) => {
  let { status, data: { top } } = await axios.get(`http://cp-tools.cn/search/top`,{
    params: {
      input:ctx.query.input,
      city: ctx.query.city,
      sign:key
    }
  })
  ctx.body = {
    top:status===200?top:[]
  }
})

router.get('/hotPlace',async (ctx) => {
  let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  let {status, data: {result}} = await axios.get(`http://cp-tools.cn/search/hotPlace`,{
    params: {
      sign: key,
      city
    }
  })
  ctx.body = {
    result: status === 200 ? result: []
  }
})

router.get('/resultByKeyWords',async (ctx) => {
  console.log('1')
  const {city,keyword} = ctx.query
  let { status, data: { count, pois } } = await axios.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city,
      keyword,
      sign:key
    }
  })
  console.log(status)
  ctx.body = {
    count: status===200?count : 0,
    pois: status === 200 ? pois : []
  }
})

router.get('/products',async (ctx) => {
  let keyword = ctx.query.keyword || '旅游'
  let city = ctx.query.city || '北京'
  let { status, data: { product, more } } = await axios.get('http://cp-tools.cn/search/products', {
    params: {
      sign:key,
      keyword,
      city
    }
  })
  if (status===200) {
    ctx.body = {
      product,
      // 根据是否登录返回值
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated() ? more : []
    }
  } else {
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  }
})

export default router
