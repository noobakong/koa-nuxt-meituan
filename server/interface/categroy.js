import Router from 'koa-router'
import axios from './utils/axios'
import key from './utils/key'

let router = new Router({ prefix: '/categroy' })

router.get('/crumbs', async (ctx) => {
  console.log('aaa')
  let { status, data: { areas, types } } = await axios.get(`http://cp-tools.cn/categroy/crumbs`, {
    params: {
      city: ctx.query.city.replace('市','') || '北京',
      sign: key
    }
  })
  ctx.body = {
    areas: status===200?areas : [],
    types: status === 200 ? types : []
  }
})

export default router
