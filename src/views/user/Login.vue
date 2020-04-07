<template>
  <div class="main">
    <a-form
      id="formLogin"
      ref="formLogin"
      :form="form"
      class="user-layout-login"
    >
      <a-tabs
        :active-key="customActiveKey"
        :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane
          key="tab1"
          tab="账号密码登陆"
        >
          <a-form-item>
            <a-input
              v-decorator="['username',validatorRules.username,{ validator: handleUsernameOrEmail }]"
              size="large"
              type="text"
              placeholder="请输入帐户名 / admin"
            >
              <a-icon
                slot="prefix"
                type="user"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="['password',validatorRules.password]"
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码 / 123456"
            >
              <a-icon
                slot="prefix"
                type="lock"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <!-- <a-row :gutter="0">
            <a-col :span="16">
              <a-form-item>
                <a-input
                  v-decorator="['inputCode',validatorRules.inputCode]"
                  size="large"
                  type="text"
                  placeholder="请输入验证码"
                  @change="inputCodeChange"
                >
                  <a-icon
                    slot="prefix"
                    type="smile"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col
              :span="8"
              style="text-align: right"
            >
              <img
                v-if="requestCodeSuccess"
                style="margin-top: 2px;"
                :src="randCodeImage"
                @click="handleChangeCheckCode"
              >
              <img
                v-else
                style="margin-top: 2px;"
                src="../../assets/checkcode.png"
                @click="handleChangeCheckCode"
              >
            </a-col>
          </a-row> -->
        </a-tab-pane>
        <a-tab-pane
          key="tab2"
          tab="手机号登陆"
        >
          <a-form-item>
            <a-input
              v-decorator="['mobile',validatorRules.mobile]"
              size="large"
              type="text"
              placeholder="手机号"
            >
              <a-icon
                slot="prefix"
                type="mobile"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col
              class="gutter-row"
              :span="16"
            >
              <a-form-item>
                <a-input
                  v-decorator="['captcha',validatorRules.captcha]"
                  size="large"
                  type="text"
                  placeholder="请输入验证码"
                >
                  <a-icon
                    slot="prefix"
                    type="mail"
                    :style="{ color: 'rgba(0,0,0,.25)' }"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col
              class="gutter-row"
              :span="8"
            >
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', {initialValue: true, valuePropName: 'checked'}]">
          自动登陆
        </a-checkbox>
        <router-link
          :to="{ name: 'alteration'}"
          class="forge-password"
          style="float: right;"
        >
          忘记密码
        </router-link>
        <!-- <router-link
          :to="{ name: 'register'}"
          class="forge-password"
          style="float: right;margin-right: 10px"
        >
          注册账户
        </router-link> -->
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="loginBtn"
          @click.stop.prevent="handleSubmit"
        >
          确定
        </a-button>
      </a-form-item>

      <div class="user-login-other">
        <span>其他登陆方式</span>
        <a><a-icon
          class="item-icon"
          type="alipay-circle"
        /></a>
        <a><a-icon
          class="item-icon"
          type="taobao-circle"
        /></a>
        <a><a-icon
          class="item-icon"
          type="weibo-circle"
        /></a>
        <router-link
          class="register"
          :to="{ name: 'register' }"
        >
          注册账户
        </router-link>
      </div>
    </a-form>
  </div>
</template>
<script>
import { getLogIn } from '@/api/login'
import { setToken } from '@/utils/auth.js'
import { timeFix } from '@/utils'
export default {
    data () {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          smsSendBtn: false,
        },
        validatorRules:{
          username:{rules: [{ required: true, message: '请输入用户名!'},{validator: this.handleUsernameOrEmail}]},
          password:{rules: [{ required: true, message: '请输入密码!',validator: 'click'}]},
          mobile:{rules: [{validator:this.validateMobile}]},
          captcha:{rule: [{ required: true, message: '请输入验证码!'}]},
          inputCode:{rules: [{ required: true, message: '请输入验证码!'}]}
        },

        verifiedCode:"",
        inputCodeContent:"",
        inputCodeNull:true,

        requestCodeSuccess: false
      }
    },
    methods: {
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      handleTabClick (key) {
        this.customActiveKey = key
      },
      inputCodeChange(e){
        this.inputCodeContent = e.target.value
      },
      handleChangeCheckCode(){
        this.currdatetime = new Date().getTime();
        // getAction(`/sys/randomImage/${this.currdatetime}`).then(res=>{
        //   if(res.success){
        //     this.randCodeImage = res.result
        //     this.requestCodeSuccess=true
        //   }else{
        //     this.$message.error(res.message)
        //     this.requestCodeSuccess=false
        //   }
        // }).catch(()=>{
        //   this.requestCodeSuccess=false
        // })
      },
      handleSubmit() {
        let that = this
        let loginParams = {};
        that.loginBtn = true;
        // 使用账户密码登陆
        if (that.customActiveKey === 'tab1') {
          that.form.validateFields([ 'username', 'password', 'rememberMe' ], { force: true }, (err, values) => {
            if (!err) {
              loginParams.username = values.username
              loginParams.password = values.password
              loginParams.remember_me = values.rememberMe
              loginParams.captcha = that.inputCodeContent
              loginParams.checkKey = that.currdatetime
              // console.log("登录参数",loginParams)
              // that.getLogInHandle(loginParams).then((res) => {
              //   this.departConfirm(res)
              // }).catch((err) => {
              //   that.requestFailed(err);
              // });
              that.getLogInHandle(loginParams)
            }else {
              that.loginBtn = false;
            }
          })
          // 使用手机号登陆
        } else {
          that.form.validateFields([ 'mobile', 'captcha', 'rememberMe' ], { force: true }, (err, values) => {
            if (!err) {
              loginParams.mobile = values.mobile
              loginParams.captcha = values.captcha
              loginParams.remember_me = values.rememberMe
              that.PhoneLogin(loginParams).then((res) => {
                console.log(res.result);
                this.departConfirm(res)
              }).catch((err) => {
                that.requestFailed(err);
              })

            }
          })
        }
      },
      requestFailed (err) {
        this.$notification[ 'error' ]({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试",
          duration: 4,
        });
        this.loginBtn = false;
      },
      loginSuccess () {
        this.$router.push({ name: "dashboard" })
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        });
      },
      getLogInHandle(form) {
        getLogIn(form).then(resp => {
        if (resp.code === 200) {
          setToken(resp.data.access_token)
          this.$store.dispatch('user/setToken', resp.data.access_token)
          this.loginSuccess()
        }
      }).catch((err) => {
        this.requestFailed(err);
      })
      }
    }
}
</script>
<style lang="less" scoped>
.user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }

</style>