import demo from './demo.vue'
import theme from './skin.vue'
import request from './request.vue'

const routes = [
    {
        path: '/',
        component: demo,
        meta: {title: 'demo'} // 用于设置title
    }, {
        path: '/theme',
        component: theme,
        meta: {title: '换肤功能'}
    },
    {
        path: '/request',
        component: request,
        meta: {title: 'Ajax请求'}
    }
]
export default routes
