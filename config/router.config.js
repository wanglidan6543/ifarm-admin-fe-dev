export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      // { path: '/user/register', name: 'register', component: './User/Register' },
      // {path: '/user/register-result', name: 'register.result', component: './User/RegisterResult',},
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        // name: 'article',
        component: './Home/List',
      },
      {
        path: '/article',
        icon: 'file-text',
        name: 'article',
        component: './Article/List',
      },
      {
        path: '/article/add',
        name: 'articleAdd',
        hideInMenu: true,
        component: './Article/ArticleEdit',
      },
      { path: '/price', name: 'price', icon: 'pay-circle', component: './Price/List' },
      // 订单详情
      {
        path: '/pricematerial',
        name: 'pricematerial',
        icon: 'area-chart',
        component: './Pricematerial/List',
      },
      // 订单详情查看
      {
        path: '/pricematerial/edit/:id/:orderId',
        name: 'pricematerialedit',
        hideInMenu: true,
        component: './Pricematerial/Pricematerialdetail',
      },
      // 用户关联农场管理
      {
        path: '/relatedfarms',
        name: 'relatedfarms',
        icon: 'home',
        component: './Relatedfarms/List',
      },
      // 编辑用户关联农场管理
      {
        path: '/relatedfarms/edit/:id',
        name: 'relatedfarmsEdit',
        hideInMenu: true,
        component: './Relatedfarms/RelatedfarmsEdit',
      },

      {
        // 农场指标阈值管理
        path: '/threshold',
        name: 'threshold',
        icon: 'compass',
        component: './Threshold/List',
      },
      {
        // 农场指标阈值管理编辑
        path: '/threshold/edit/:id',
        name: 'thresholdedit',
        hideInMenu: true,
        component: './Threshold/ThresholdEdit',
      },

      // {
      //   // 用户指标穿透管理
      //   path: '/indicatorsthrough',
      //   name: 'indicatorsthrough',
      //   icon: 'line-chart',
      //   component: './Indicatorsthrough/List',
      // },
      // {
      //   // 用户指标穿透管理编辑
      //   path: '/indicatorsthrough/edit/:id',
      //   name: 'indicatorsthroughedit',
      //   hideInMenu: true,
      //   component: './Indicatorsthrough/IndicatorsthroughEdit',
      // },

      {
        path: '/administration',
        name: 'administration',
        icon: 'solution',
        component: './Administration/List',
      }, // 管理员管理
      {
        path: '/administration/edit/:id',
        name: '',
        hideInMenu: true,
        component: './Administration/AdminEdit',
      },
      {
        path: '/administration/add',
        name: 'administrationAdd',
        hideInMenu: true,
        component: './Administration/AdminEdit',
      },
       // 用户管理
       {
        path: '/usered',
        name: 'usered',
        icon: 'user',
        component: './Usered/List',
      },
      {
        path: '/usered/add',
        name: 'useredAdd',
        hideInMenu: true,
        component: './Usered/UseredAdd',
      },
      {
        path: '/usered/edit/:id',
        name: 'useredEdit',
        hideInMenu: true,
        component: './Usered/UseredAdd',
      },
      // 管理员管理权限
      {
        path: '/administration/authority/:id',
        name: 'authority',
        hideInMenu: true,
        component: './Administration/Authority',
      },

      // 修改密码
      {
        path: '/login/password',
        name: 'account.password',
        hideInMenu: true,
        component: './User/Changepassword',
      },
      // {
      //   path: '/jurisdiction',
      //   name: 'jurisdiction',
      //   icon: 'safety',
      //   component: './Jurisdiction/List',
      // }, // 管理员权限
      // {
      //   path: '/jurisdiction/edit:id',
      //   name: '',
      //   hideInMenu: true,
      //   component: './Jurisdiction/JurisdictionAdd',
      // }, // 管理员编辑
      // {
      //   path: '/jurisdiction/add',
      //   name: '',
      //   hideInMenu: true,
      //   component: './Jurisdiction/JurisdictionAdd',
      // }, // 管理员新增
      {
        path: '/article/edit/:id',
        name: 'articleEdit',
        hideInMenu: true,
        component: './Article/ArticleEdit',
      },
      {
        path: '/administration/edit/:id',
        name: 'administrationEdit',
        hideInMenu: true,
        component: './Administration/AdminEdit',
      },
      // dashboard
      { path: '/', redirect: '/article' },
      {
        component: '404',
      },
    ],
  },
];
