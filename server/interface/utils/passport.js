import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

passport.use(new LocalStrategy(async function(username,password,done){
  // 设置查询条件
  let where = {
    username
  }
  // 查询符合用户名条件的用户
  let result = await UserModel.findOne(where)
  if (result!=null) { // 如果有此用户
    if(result.password===password) { // 密码正确
      return done(null, result)
    } else { // 密码错误
      return done(null,false,'密码错误')
    }
  } else { // 查无此人
    return done(null,false,'用户名不存在')
  }
}))

// 序列化
passport.serializeUser(function(user,done) {
  done(null,user)
})
// 反序列化
passport.deserializeUser(function (user, done) {
  done(null, user)
})

export default passport
