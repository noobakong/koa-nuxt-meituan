<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" type="txt" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" type="email" autocomplete="off"></el-input>
          <el-button type="button" name="button" size="mini" round @click="sendMessage">发送验证码</el-button>
          <span class="status">{{statusMsg}}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" type="txt" autocomplete="off" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">同意协议并注册</el-button>
          <div class="error">{{error}}</div>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
export default {
  layout: "blank",
  data() {
    return {
      statusMsg: "",
      error: "",
      ruleForm: {
        name: "",
        code: "",
        email: "",
        password: "",
        checkPass: ""
      },
      rules: {
        name: [
          {
            required: true,
            type: "string",
            message: "what is you name a ?",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "what is you email?",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "创建密码",
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            required: true,
            message: "确认密码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.password) {
                callback(new Error("两次密码不一致啊"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    sendMessage() {
      const self = this;
      let namePass;
      let emailPass;
      if (self.timerid) {
        return false;
      }
      this.$refs.ruleForm.validateField("name", valid => {
        namePass = valid;
      });
      self.statusMsg = "";
      if (namePass) {
        return false;
      }
      this.$refs.ruleForm.validateField("email", valid => {
        emailPass = valid;
      });
      if (!namePass && !emailPass) {
        self.$axios
          .post("/users/verify", {
            username: encodeURIComponent(self.ruleForm.name),
            email: self.ruleForm.email
          })
          .then(({ status, data }) => {
            if (status == 200 && data && data.code === 0) {
              let count = 60;
              self.statusMsg = `验证码已经发送，剩余${count--}秒`;
              self.timerid = setInterval(function() {
                self.statusMsg = `验证码已经发送，剩余${count--}秒`;
                if (count == 0) {
                  clearInterval(self.timerid);
                  self.statusMsg = "";
                }
              }, 1000);
            } else {
              self.statusMsg = data.msg;
            }
          });
      }
    },
    register() {
      let self = this;
      let param = {};
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          param.username = window.encodeURIComponent(self.ruleForm.name);
          param.password = CryptoJS.MD5(self.ruleForm.password).toString();
          param.email = self.ruleForm.email;
          param.code = self.ruleForm.code;
          self.$axios.post("/users/signup", param).then(({ status, data }) => {
            if (status === 200) {
              console.log('aaa')
              if (data && data.code == 0) {
                location.href = "/login"
              } else {
                self.error = data.msg
              }
            } else {
              self.error = `服务器出错啦 错误码：${status}`
            }
            setTimeout(function() {
              self.error = ''
            },1500)
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/register/index.scss";
</style>
