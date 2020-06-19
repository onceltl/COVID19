# COVID19
COVID19数据可视化平台

# 一、环境要求
- 服务器框架:nodejs express
- 系统环境：windows/linux/Mac OS
- 数据库：MongoDB
- 前端框架:Echarts

# 二、目录结构介绍
``` 
    –bin            项目的底层核心，路由配置文件
	  -Controller     POST路由
    -database       MongoDB封装
    –node_modules   项目中依赖的包
    –public         前端
            -css  样式布局
            -images 前端图片
            -js     前端js代码
                  -area_echarts.js 控制地图、饼图、柱状图
                  -showdata.js  控制折线图
            -map    省级、中国、世界地图
            -back.html 背景图片
            
    –routes         主页路由
    –views          主页
    –app.js         node.js入口
    –package.json    包管理
    -Logistic.py  回归疫情预测
``` 
# 三、安装依赖
```
$ npm install
$ npm install supervisor -g
```
# 四、运行

```
$ mongod --dbpath yourdbpath
$ npm start 
//ip: http://localhost:3000
```
