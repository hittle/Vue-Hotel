import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


  const routes= [
    {
      path: '/',
      name: 'Home',
      component: Home => require(['@/views/Home'],Home),
      meta:{
        requireAuth: true
      },
      children:[
        {
          path: '/',
          name: 'Main',
          component: Main => require(['@/components/Main.vue'], Main),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/test',
          name: 'Test',
          component: Test => require(['@/views/Test.vue'], Test),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/roomInfor',
          name: 'RoomInfor',
          component: RoomInfor => require(['@/views/RoomInformation.vue'], RoomInfor),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/history',
          name: 'History',
          component: History => require(['@/views/History.vue'], History),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/statistics',
          name: 'Statistics',
          component: Statistics => require(['@/views/Statistics.vue'], Statistics),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/custInfo',
          name: 'custInfo',
          component: custInfo => require(['@/views/CustInfo.vue'], custInfo),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/staffInfo',
          name: 'staffInfo',
          component: staffInfo => require(['@/views/CustInfo.vue'], staffInfo),
          meta:{
            requireAuth: true
          },
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: userInfo => require(['@/views/userInfo.vue'], userInfo),
          meta:{
            requireAuth: true
          },
        }
      ]
    },
    {
      path:'/login',
      name:'Login',
      component:Login => require(['@/views/Login'],Login)
    },
    {
      path:'/admin/login',
      name:'adminLogin',
      component:adminLogin => require(['@/views/Login'],adminLogin)
    },
    {
      path:'/lock',
      name:'Lock',
      component:Lock => require(['@/views/Lock'],Lock)
    }
  ]

const router = new Router({
  mode:'history',
  routes
});
router.beforeEach((to,from,next)=>{
  // if(to.meta.requireAuth&&window.localStorage.getItem('loginToken')===null||to.name==='Lock'&&window.localStorage.getItem('loginToken')===null){   //在未登录情况下，不给跳转到任何页面
  //   next({
  //     path:'/login'
  //   })
  // }else
  if(to.meta.requireAuth&&window.localStorage.getItem('lock')!==null&&eval(window.localStorage.getItem('lock').toLowerCase())===true){   //在系统锁定情况下，不给跳转任何页面
    next({
      path:'/lock'
    })
  }
  // else if(to.name==='Login'&&window.localStorage.getItem('loginToken')!==null||to.name==='Lock'&&eval(window.localStorage.getItem('lock').toLowerCase())===false){    //在已登录情况下不给跳转到登录页面，在系统未锁定情况下，不给跳转到系统锁定界面
  //   next(false)
  // }
  else{
    next();
  }
})
export default router