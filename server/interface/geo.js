import Router from 'koa-router'
import axios from './utils/axios'
import key from './utils/key'

let router = new Router({ prefix: '/geo' })

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

export default router
