import { isURL } from '@/utils/validate'
import { BasicLayout } from '@/components/Layouts'
export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
  }
  // 生成首页路由
export function generateIndexRouter(data) {
  let indexRouter = [{
            path: '/',
            name: 'dashboard',
            component: BasicLayout,
            // component: resolve => require(['@/components/layouts/BasicLayout'], resolve),
            meta: { title: '首页' },
            redirect: '/dashboard/analysis',
            children: [
              ...generateChildRouters(data)
            ]
          },{
            "path": "*", "redirect": "/404", "hidden": true
          }]
    return indexRouter;
  }
  
  // 生成嵌套路由（子路由）
  
  function  generateChildRouters (data) {
    const routers = [];
    for (var item of data) {
      let component = "";
      if(item.component.indexOf("Layouts")>=0){
         component = "components/"+item.component;
      }else{
         component = "views/"+item.component;
      }
  
      // eslint-disable-next-line
      let URL = (item.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
      if (isURL(URL)) {
        item.url = URL;
      }
      let menu =  {
        path: item.path,
        name: item.name,
        redirect:item.redirect,
        // component: (resolve) => require(['@/components/Layouts/RouteView.vue'], resolve),
        hidden:item.hidden,
        component:()=> import(`@/${component}.vue`),
        meta: {
          title:item.title ,
          icon: item.icon,
          url:item.url ,
          // permissionList:item.meta.permissionList,
          keepAlive:item.keepAlive,
          /*update_begin author:wuxianquan date:20190908 for:赋值 */
          // internalOrExternal:item.meta.internalOrExternal
          /*update_end author:wuxianquan date:20190908 for:赋值 */
        }
      }
      if(item.alwaysShow){
        menu.alwaysShow = true;
        menu.redirect = menu.path;
      }
      if (item.children && item.children.length > 0) {
        menu.children = [...generateChildRouters( item.children)];
      }
      //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
      //判断是否生成路由
      if(item.route && item.route === '0'){
        //console.log(' 不生成路由 item.route：  '+item.route);
        //console.log(' 不生成路由 item.path：  '+item.path);
      }else{
        routers.push(menu);
      }
      //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
    }
    return routers
  }