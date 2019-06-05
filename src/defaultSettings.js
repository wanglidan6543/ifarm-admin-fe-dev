module.exports = {
  navTheme: 'dark', // theme for nav menu导航菜单主题
  primaryColor: '#1890FF', // primary color of ant design
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu导航菜单位置：侧菜单或顶部菜单
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu内容布局：流动或固定，仅当布局为TopMenu时才有效
  fixedHeader: false, // sticky header
  autoHideHeader: false, // auto hide header自动隐藏标题
  fixSiderbar: false, // sticky siderbar
  menu: {
    disableLocal: false,
  },
  title: '管理系统',
  pwa: true,
  // your iconfont Symbol Scrip Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont图标项目里要进行批量去色处理
  iconfontUrl: '',
};
