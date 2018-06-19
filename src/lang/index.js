import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cache from '@/common/cache'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: Cache.getStorage('lang') || 'zh', // set locale
  messages // set locale messages
})

export default i18n
