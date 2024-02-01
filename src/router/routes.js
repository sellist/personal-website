import * as VueRouter from 'vue-router'
const test = () => import('../views/TestView.vue')
const testTwo = () => import('../views/TestViewTwo.vue')
const testingComp = () => import('../views/TestingComp.vue')

const routes = [
        {
            path: '/',
            name: 'resume',
            component: test,
        },
        {
            path: '/two',
            name: 'goose',
            component: testTwo,
        },
        {
            path: '/test',
            name: 'testComp',
            component: testingComp,
        },
    ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
  });

export default router;