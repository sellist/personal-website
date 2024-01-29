import * as VueRouter from 'vue-router'
const test = () => import('../views/TestView.vue')
const testTwo = () => import('../views/TestViewTwo.vue')

const routes = [
        {
            path: '/',
            name: 'test',
            component: test,
        },
        {
            path: '/two',
            name: 'testTwo',
            component: testTwo,
        }
    ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
  });

export default router;