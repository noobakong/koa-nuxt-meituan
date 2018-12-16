import Router from 'koa-router'
import axios from './utils/axios'
import key from './utils/key'

let router = new Router({ prefix: '/geo' })

// 获取定位
router.get('/getPosition', async (ctx) => {
  let { status, data: { province, city } } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${key}`)
  if (status===200) {
    ctx.body = {
      // code: 0,
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

// 获取菜单
router.get('/menu',async (ctx) => {
  let { status, data: { menu } } = await axios.get(`http://cp-tools.cn/geo/menu?sign=${key}`)
  ctx.body = {
    menu: status===200 ? menu : []
  }
})

// 获取省份
router.get('/province', async (ctx) => {
  let { status, data: { province } } = await axios.get(`http://cp-tools.cn/geo/province?sign=${key}`)
  ctx.body = {
    province: status === 200 ? province : []
  }
})

// 根据省id获取城市数据
router.get('/province/:id', async (ctx) => {
  let { status, data: { city } } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${key}`)
  ctx.body = {
    city: status === 200 ? city : []
  }
})

// 获取所有城市数据
router.get('/city', async (ctx) => {
  let { status, data: { city } } = await axios.get(`http://cp-tools.cn/geo/city?sign=${key}`)
  ctx.body = {
    city: status === 200 ? city : []
  }
})

// 获取热门城市数据
router.get('/hotCity', async (ctx) => {
  let { status, data: { hotCity } } = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${key}`)
  ctx.body = {
    hotCity: status === 200 ? hotCity : []
  }
})

export default router
