
$(function () {
var citymap = 
{"新疆":{"吐鲁番":"吐鲁番市","乌鲁木齐":"乌鲁木齐市","昌吉州":"昌吉回族自治州","伊犁州":"伊犁哈萨克自治州","巴州":"巴音郭楞蒙古自治州","阿克苏":"阿克苏地区","六师五家渠":"五家渠市","第八师石河子":"石河子市"}

};

	var globalChinaData;
	var globalWordData;
	$('.t_btn0').click(function () {
        loadall(globalChinaData);
		reloadChinaEchart();
    });
	$('.t_btn3').click(function () {
        loadallWorld(globalWordData);
		reloadWorldEchart(globalWordData.globalDailyHistory);
		
    });			
	map();
	
	
	
	function setcitymap(data)
	{
		var pdata = data.areaTree[0].children;
		for (var i = 0 ;i < pdata.length ;i++)
		{
			var citydata = pdata[i].children;
			if (pdata[i].name == "北京" || pdata[i].name == "天津" || pdata[i].name == "上海" || pdata[i].name == "重庆")
			{
				var mapname = {};
				for (var j = 0 ;j < citydata.length;j++)
					mapname[citydata[j].name] = citydata[j].name + "区";
				citymap[pdata[i].name]  = mapname;
				continue;
			}
			if (pdata[i].name == "新疆" )
				continue;
			var mapname = {};
				for (var j = 0 ;j < citydata.length;j++)
					mapname[citydata[j].name] = citydata[j].name + "市";
			citymap[pdata[i].name]  = mapname;
		}
		citymap["四川"]["凉山"] = "凉山彝族自治州";
		citymap["四川"]["甘孜"] = "甘孜藏族自治州";
		citymap["四川"]["阿坝"] = "阿坝藏族羌族自治州";
		//TODO : handle special case
	}
	function loadall(jsData)
	{
	//加载总数
		loadNewDayTotals(jsData);
		loadNewDayAdds(jsData);
		//加载中国地图
		loadEcharts(covertData(jsData), getlastUpdateTime(jsData),'china');
		//top10
		loadTopEcharts(getTopdata(jsData,'china'),'china');
		//饼图
		loadPieDatapercentage(getHealRateData(jsData,'china'),'china');
		loadPieDatanowConfirm(getnowConfirmData(jsData),'china');	
	}
	function loadallWorld(jsData)
	{
		//加载总数
		loadNewDayTotalsWord(jsData);
		loadNewDayAddsWord(jsData);
		//加载世界地图
		
		loadEcharts(getCountryList(jsData), getlastUpdateTime(globalChinaData),'world');
		//top10
		loadTopEcharts(getTopdataWord(jsData),'world');
		//饼图
		loadPieDatapercentage(getHealRateData(jsData,'world'),'world');
		loadPieDatanowConfirmWord(getnowConfirmDataWord(jsData));	
	}
    function map() {
		$.ajax({
			type: "post",
			url: "/getJsonData",
			datatype: "json",
			crossDomain: true,
			success: function (data, status) {
				if (status == "success") {
					var jsData = data;
					globalChinaData = data;
					console.log(jsData);
					setcitymap(jsData);
					loadall(jsData);
					
				} else {
					alert('error');
				}
			},
			error: function (err, status) {
				alert('loading data error');
			}
		});
		$.ajax({
			type: "post",
			url: "/getJsonforeign",
			datatype: "json",
			crossDomain: true,
			success: function (data, status) {
				if (status == "success") {
					
					globalWordData = data.foreign;
					console.log(globalWordData);
				} else {
					alert('error');
				}
			},
			error: function (err, status) {
				alert('loading data error');
			}
		});
    }
	function getnowConfirmData(data,mapName) {
		var getdata = data.areaTree[0].children;
		var total = data.chinaTotal.nowConfirm;
		var hktwam = 0;
		var outchina = 0;
		for (i = 0 ;i <getdata.length;i++)
		{
			if (getdata[i].name == "香港" ||getdata[i].name == "台湾" || getdata[i].name == "澳门")
			{
				hktwam = hktwam + getdata[i].total.nowConfirm;
				
			} else {
				var citydata = getdata[i].children;
				for (j = 0 ;j<citydata.length;j++)
				{
						if (citydata[j].name == '境外输入')
							outchina = outchina + citydata[j].total.nowConfirm;
				}
			}
		}
		
		var pieData = [];
		var perPieData = new Object();
		perPieData.name = '31省本土病例';
		perPieData.value = total - hktwam - outchina;
		pieData.push(perPieData);

		perhealdata = new Object();
		perhealdata.name = '港澳台病例';
		perhealdata.value = hktwam;

		pieData.push(perhealdata);

		var perdeaddata = new Object
		perdeaddata.name = '境外输入病例';
		perdeaddata.value = outchina;

		pieData.push(perdeaddata);

		return pieData;

	}
	function getnowConfirmDataWord(data) {
		var getdata = data.continentStatis[data.continentStatis.length-1].statis;
		
		
		var pieData = [];
		
		for (var keys in getdata)
		{
			var perPieData = new Object();
			perPieData.name = keys;
			perPieData.value = getdata[keys];
			pieData.push(perPieData);
		}
		return pieData;

	}
	function getnowConfirmCityData(data,mapName) {
		var getdata = data.areaTree[0].children;
		var total = data.chinaTotal.nowConfirm;
		var notdetermine = 0;
		var outchina = 0;
		if (mapName!='china')
		{
			for (i = 0 ;i < getdata.length;i++)
				if (getdata[i].name == mapName) 
				{
					
					total = getdata[i].total.nowConfirm;
					getdata = getdata[i].children;
					break;
				}
		}
		for (i = 0 ;i <getdata.length;i++)
		{
			if (getdata[i].name == "地区待确认" || getdata[i].name == "外地来京" )
			{
				if (getdata[i].total.nowConfirm > 0)
					notdetermine = notdetermine + getdata[i].total.nowConfirm;
				continue;
			}
			if (getdata[i].name == "境外输入" )
			{
				outchina = outchina + getdata[i].total.nowConfirm;
				continue;
			}
			
		}
		var pieData = [];
		var perPieData = new Object();
		perPieData.name = '本土病例';
		perPieData.value = total - notdetermine - outchina;
		pieData.push(perPieData);

		perhealdata = new Object();
		perhealdata.name = '地区待确认';
		perhealdata.value = notdetermine;

		pieData.push(perhealdata);

		var perdeaddata = new Object
		perdeaddata.name = '境外输入病例';
		perdeaddata.value = outchina;

		pieData.push(perdeaddata);

		return pieData;

	}
	function loadPieDatanowConfirm(data,mapName)
    {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb2'));
		var legenddata = ['31省本土病例', '港澳台病例', '境外输入病例'];
		if (mapName!='china')
		{
			legenddata = ['本土病例', '地区待确认', '境外输入病例'];
		}
        option =
        {

            title : [
                {
                    text : '现有确诊分布',
                    left : 'center',
                    textStyle :
                    {
                        color : '#fff',
                        fontSize : '16'
                    }

                }
            ],
            tooltip :
            {
                trigger : 'item',
                formatter : "{a} <br/>{b}: {c} ({d}%)",
                position : function (p)
                { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend :
            {

                top : '70%',
                itemWidth : 10,
                itemHeight : 10,
                data : legenddata,
                textStyle :
                {
                    color : 'rgba(255,255,255,.5)',
                    fontSize : '12',
                }
            },
            series : [
                {
                    name : '病例分布',
                    type : 'pie',
                    center : ['50%', '42%'],
                    radius : ['40%', '60%'],
                    color : ['#e83132', '#EEEE00', '#ec9217'],
					
                    label :
                    {
                        show : false
                    },
                    labelLine :
                    {
                        show : false
                    },
                    data : data
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function ()
        {
            myChart.resize();
        }
        );
    }
	
	
	function loadPieDatanowConfirmWord(data,mapName)
    {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('fb2'));
		var legenddata = ['亚洲', '北美洲','欧洲', '南美洲','大洋洲', '非洲','其他'];
        option =
        {

            title : [
                {
                    text : '累积确诊分布',
                    left : 'center',
                    textStyle :
                    {
                        color : '#fff',
                        fontSize : '16'
                    }

                }
            ],
            tooltip :
            {
                trigger : 'item',
                formatter : "{a} <br/>{b}: {c} ({d}%)",
                position : function (p)
                { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend :
            {

                top : '70%',
                itemWidth : 10,
                itemHeight : 10,
                data : legenddata,
                textStyle :
                {
                    color : 'rgba(255,255,255,.5)',
                    fontSize : '12',
                }
            },
            series : [
                {
                    name : '病例分布',
                    type : 'pie',
                    center : ['50%', '42%'],
                    radius : ['40%', '60%'],
                    color : ['#00d887','#EEEE00', '#ec9217','#00CED1','#A020F0','#e83132','#FFC1C1'],
					
                    label :
                    {
                        show : false
                    },
                    labelLine :
                    {
                        show : false
                    },
                    data : data
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function ()
        {
            myChart.resize();
        }
        );
    }
	function getHealRateData(data,mapName) {
		var getdata = data.chinaTotal;
		if (mapName!='china' && mapName != 'world')
		{
			for (i = 0 ;i < data.areaTree[0].children.length;i++)
				if (data.areaTree[0].children[i].name == mapName) 
				{
					getdata = data.areaTree[0].children[i].total;
					break;
				}
		}
		if (mapName == 'world')
			getdata = data.globalStatis;
		var total = getdata.confirm;
		var heal = getdata.heal;
		var dead = getdata.dead;
		
		var pieData = [];
		var perPieData = new Object();
		perPieData.name = '治疗中';
		//确诊总病例减去治愈和死亡病例
		perPieData.value = parseInt(total) - parseInt(heal) - parseInt(dead);
		pieData.push(perPieData);

		perhealdata = new Object();
		perhealdata.name = '已治愈';
		perhealdata.value = heal;

		pieData.push(perhealdata);

		var perdeaddata = new Object
		perdeaddata.name = '病亡';
		perdeaddata.value = getdata.dead;

		pieData.push(perdeaddata);

		return pieData;

	}
	function loadPieDatapercentage(data,mapName)
    {
        // 基于准备好的dom，初始化echarts实例
		var text = '国内治愈率';
		if (mapName!='china')
		{
			text = mapName+'治愈率';
		}
		if (mapName=='world')
		{
			text = '全球治愈率';
		}
        var myChart = echarts.init(document.getElementById('fb1'));
		
		if (mapName!='world')
		{
			data[0].label={show : true,formatter: '{d}%' }
			data[0].labelLine={show: true}
        }
		option =
        {

            title : [
                {
                    text : text,
                    left : 'center',
                    textStyle :
                    {
                        color : '#fff',
                        fontSize : '16'
                    }

                }
            ],
            tooltip :
            {
                trigger : 'item',
                formatter : "{a} <br/>{b}: {c} ({d}%)",
                position : function (p)
                { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend :
            {
                top : '70%',
                itemWidth : 10,
                itemHeight : 10,
				orient: 'vertical',
                data : ['治疗中', '已治愈', '病亡'],
				textStyle :
                {
                    color : 'rgba(255,255,255,.5)',
                    fontSize : '12',
                }
            },
            series : [
                {
                    name : '病例分布',
                    type : 'pie',
                    center : ['50%', '42%'],
                    radius : ['40%', '60%'],
                    color : ['#e83132', '#00d887', '#A020F0'],
					
                    label :
                    {
                        show : false
                    },
                    labelLine :
                    {
                        show : false
                    },
                    data : data
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function ()
        {
            myChart.resize();
        }
        );
    }
	function getTopdata(jsData,mapName)
	{
		var Top10Data = new Object();
		var Top_name = [];
		var Top_value = [];
		var Temps = [];
		var provdata = jsData.areaTree[0].children;
		if (mapName!='china')
		{
			for (i = 0 ;i < provdata.length;i++)
				if (provdata[i].name == mapName) 
				{
					provdata = provdata[i].children;
					break;
				}
		}
		provdata.sort(function(a,b){
			return b.total.confirm - a.total.confirm;
		})
		var s = 0 ,e = 10;
		if (mapName == 'china')
		{
			s=s+1;
			e=e+1;
		}
		for (i = s ;i<Math.min(e,provdata.length);i++)
		{
			Top_name.push(provdata[i].name);
			Top_value.push(provdata[i].total.confirm);

		}
	
		Top10Data.name = Top_name;
		Top10Data.value = Top_value;
		return Top10Data;
	}
	function getTopdataWord(jsData)
	{
		var Top10Data = new Object();
		var Top_name = [];
		var Top_value = [];
		var Temps = [];
		var provdata = jsData.foreignList;
		for (i = 0 ;i<Math.min(10,provdata.length);i++)
		{
			Top_name.push(provdata[i].name);
			Top_value.push(provdata[i].nowConfirm);

		}
	
		Top10Data.name = Top_name;
		Top10Data.value = Top_value;
		return Top10Data;
	}
	function loadTopEcharts(data,mapName)
    {
        // 基于准备好的dom，初始化echarts实例
		if (mapName == 'china')
			$('.set-confirmTop').text('累积确诊TOP10(除武汉)');
        else if (mapName == 'world') $('.set-confirmTop').text('现有确诊TOP10');
		else $('.set-confirmTop').text('累积确诊TOP10');
		var myChart = echarts.init(document.getElementById('echart2'));

        option =
        {
            //  backgroundColor: '#00265f',
            tooltip :
            {
                trigger : 'axis',
                axisPointer :
                {
                    type : 'shadow'
                }
            },
            grid :
            {
                left : '0%',
                top : '10px',
                right : '0%',
                bottom : '4%',
                containLabel : true
            },
            xAxis : [
                {
                    type : 'category',
                    data : data.name,
                    axisLine :
                    {
                        show : true,
                        lineStyle :
                        {
                            color : "rgba(255,255,255,.1)",
                            width : 1,
                            type : "solid"
                        },
                    },

                    axisTick :
                    {
                        show : false,
                    },
                    axisLabel :
                    {
                        interval : 0,
                        // rotate:50,
                        show : true,
                        splitNumber : 15,
                        textStyle :
                        {
                            color : "rgba(255,255,255,.6)",
                            fontSize : '12',
                        },
                    },
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel :
                    {
                        //formatter: '{value} %'
                        show : true,
                        textStyle :
                        {
                            color : "rgba(255,255,255,.6)",
                            fontSize : '12',
                        },
                    },
                    axisTick :
                    {
                        show : false,
                    },
                    axisLine :
                    {
                        show : true,
                        lineStyle :
                        {
                            color : "rgba(255,255,255,.1	)",
                            width : 1,
                            type : "solid"
                        },
                    },
                    splitLine :
                    {
                        lineStyle :
                        {
                            color : "rgba(255,255,255,.1)",
                        }
                    }
                }
            ],
            series : [
                {

                    type : 'bar',
                    data : data.value,
                    barWidth : '35%', //柱子宽度
                    // barGap: 1, //柱子之间间距
                    itemStyle :
                    {
                        normal :
                        {
                            color : '#27d08a',
                            opacity : 1,
                            barBorderRadius : 5,
                        }
                    }
                }

            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function ()
        {
            myChart.resize();
        }
        );
    }
	function loadNewDayTotals(data) {
		var getdata = data.chinaTotal;
		$('.set-confirmnow').text(getdata.nowConfirm);
		$('.set-confirm').text(getdata.confirm);
		$('.set-dead').text(getdata.dead);
		$('.set-heal').text(getdata.heal);
	}

	//获取新增数量
	function loadNewDayAdds(data) {
		var getdata = data.chinaAdd;
		$('.set-yes-confirmadd').text('+' + getdata.confirm);
		$('.set-yes-confirmnowadd').text('+'+getdata.nowConfirm);
		$('.set-yes-deadadd').text('+' + getdata.dead);
		$('.set-yes-healadd').text('+' + getdata.heal);
	}
	
	
	function loadNewDayTotalsWord(data) {
		var getdata = data.globalStatis;
		$('.set-confirmnow').text(getdata.nowConfirm);
		$('.set-confirm').text(getdata.confirm);
		$('.set-dead').text(getdata.dead);
		$('.set-heal').text(getdata.heal);
	}

	//获取新增数量
	function loadNewDayAddsWord(data) {
		var getdata = data.globalStatis;
		$('.set-yes-confirmadd').text('+'+getdata.confirmAdd);
		$('.set-yes-confirmnowadd').text('+' + getdata.nowConfirmAdd);
		$('.set-yes-deadadd').text('+' + getdata.deadAdd);
		$('.set-yes-healadd').text('+' + getdata.healAdd);
	}
	function covertData(data) {
		var firstconvertdata = data.areaTree;
		var secondconvertdata = firstconvertdata[0].children;

		var cityData = new Object();

		var cityconfirmtotoaldata = [];
		var citydetailsdata = [];
		var cityallconfirm = [];
		for (i = 0; i < secondconvertdata.length; i++) {
			var cityconfirm = new Object();
			var citydetails = new Object();
			var cityall = new Object();
			//在诊人数
			cityconfirm.name = secondconvertdata[i].name;
			cityconfirm.value = parseInt(secondconvertdata[i].total.confirm) - parseInt(secondconvertdata[i].total.heal) - parseInt(secondconvertdata[i].total.dead)
			cityconfirmtotoaldata.push(cityconfirm);
			
			//总确诊人数
			cityall.name = secondconvertdata[i].name;
			cityall.value = parseInt(secondconvertdata[i].total.confirm);
			cityallconfirm.push(cityall);
			
			//显示细节
			var city = new Object();
			city.name = secondconvertdata[i].name;
			city.value = [];

			var confirm = new Object;
			confirm.name = "现存确诊";
			confirm.value = parseInt(secondconvertdata[i].total.confirm) - parseInt(secondconvertdata[i].total.heal) - parseInt(secondconvertdata[i].total.dead);
			city.value.push(confirm);

			var heal = new Object;
			heal.name = "已治愈";
			heal.value = secondconvertdata[i].total.heal;
			city.value.push(heal);

			var dead = new Object;
			dead.name = "病亡病例";
			dead.value = secondconvertdata[i].total.dead;
			city.value.push(dead);
			//
			citydetailsdata.push(city);
		}

		cityData.cityconfirmtotoaldata = cityconfirmtotoaldata;
		cityData.citydetailsdata = citydetailsdata;
		cityData.cityallconfirm = cityallconfirm;
		return cityData;
	}
	function getCountryList(data) {
		var getData = data.foreignList;

		var countryData = new Object();

		var countryconfirmtotoaldata = [];
		var countrynowconfirmtotoaldata = [];
		var countrydetailsdata = [];

		for (i = 0; i < getData.length; i++) {
			var countryconfirm = new Object();
			var countrynowconfirm = new Object();
			var countrydetails = new Object();

			countryconfirm.name = getData[i].name;
			countryconfirm.value = getData[i].confirm;
			countryconfirmtotoaldata.push(countryconfirm);
			
			countrynowconfirm.name = getData[i].name;
			countrynowconfirm.value = getData[i].nowConfirm;
			countrynowconfirmtotoaldata.push(countrynowconfirm);
			
			//详细数据
			var country = new Object();
			country.name = getData[i].name;
			country.updatetime = getData[i].date;
			country.value = [];

			var confirm = new Object;
			confirm.name = "在诊病例";
			confirm.value = getData[i].confirm - getData[i].heal - getData[i].dead;
			country.value.push(confirm);

			var confirmtotle = new Object;
			confirmtotle.name = "累计确诊病例";
			confirmtotle.value = getData[i].confirm;
			country.value.push(confirmtotle);

			var heal = new Object;
			heal.name = "已治愈";
			heal.value = getData[i].heal;
			country.value.push(heal);

			var dead = new Object;
			dead.name = "病亡病例";
			dead.value = getData[i].dead;
			country.value.push(dead);

			countrydetailsdata.push(country);
		}

		//addchina


		var getChinaData = globalChinaData.chinaTotal;

		var countryconfirm = new Object();
		var countrynowconfirm = new Object();
		countryconfirm.name = '中国';
		countryconfirm.value = getChinaData.confirm;
		countryconfirmtotoaldata.push(countryconfirm);
		
		countrynowconfirm.name = '中国';
		countrynowconfirm.value = getChinaData.nowConfirm;
		countrynowconfirmtotoaldata.push(countrynowconfirm);
		
		// //详细数据
		var country = new Object();
		country.name = '中国';
		country.updatetime = getChinaData.lastUpdateTime;
		country.value = [];

		var confirm = new Object;
		confirm.name = "在诊病例";
		confirm.value = getChinaData.nowConfirm;
		country.value.push(confirm);

		var confirmtotle = new Object;
		confirmtotle.name = "累计确诊病例";
		confirmtotle.value = getChinaData.confirm;
		country.value.push(confirmtotle);

		var heal = new Object;
		heal.name = "已治愈";
		heal.value = getChinaData.heal;
		country.value.push(heal);

		var dead = new Object;
		dead.name = "病亡病例";
		dead.value = getChinaData.dead;
		country.value.push(dead);
		countrydetailsdata.push(country);
		
		countryData.cityconfirmtotoaldata = countrynowconfirmtotoaldata;
		countryData.citydetailsdata = countrydetailsdata;
		countryData.cityallconfirm = countryconfirmtotoaldata;
		return countryData;
	}
	function getlastUpdateTime(data) {
		return data.lastUpdateTime;
	}
	function loadEcharts(cityData, lastUpdateTime,mapName) {
		var data = cityData.cityconfirmtotoaldata;
		var toolTipData = cityData.citydetailsdata;
		//
		var name_title = "COVID19全国疫情图"
		if (mapName !='china')
		{
			name_title = "COVID19"+mapName+"疫情图"
		}
		if (mapName =='world')
		{
			name_title = "COVID19全球疫情图"
		}
		var nameColor = " rgb(91,39,113)"
		var name_fontFamily = '等线'
		var name_fontSize = 25

		var geoCoordMap = {};

		var dom = document.getElementById('map_1');
		var myChart = echarts.init(dom);
		if (mapName == 'china')
		{
			
		
			myChart.on('click', function (param) {
				load_city_jsfile(param.name);
			});
		} else {
			//取消之前的绑定
			if(myChart._$handlers.click){
				myChart._$handlers.click.length = 0;
			}
			myChart.on('click', function (param) {
			});
		}
		/*获取地图数据*/
		myChart.showLoading();
		var mapFeatures = echarts.getMap(mapName).geoJson.features;
		myChart.hideLoading();
		mapFeatures.forEach(function(v) {
			// 地区名称
			var name = v.properties.name;
			// 地区经纬度
			//if (name =='美国' || name == '英国') console.log(v);
			if (mapName == 'world')
			{
				geoCoordMap[name] = v.geometry.coordinates[v.geometry.coordinates.length-1];
				while(geoCoordMap[name].length!=2)
				{
					geoCoordMap[name] = geoCoordMap[name][0];
				}
			}
			else 
				geoCoordMap[name] = v.properties.cp;
		});
		var max = 48,
			min = 9; // todo 
		var maxSize4Pin = 10,
			minSize4Pin = 2;

		//获取数据
		var convertData = function(data) {
			var res = [];
			var used = {};
			for(var i = 0; i < data.length; i++) {
				var name = data[i].name;
				if (citymap[mapName] && citymap[mapName][name])
					name = citymap[mapName][name];
				var geoCoord = geoCoordMap[name];
				if(geoCoord) {
					used[name] = true;
					res.push({
						name: name,
						value: geoCoord.concat(data[i].value),
					});
				}
			}
			
			for(let key  in geoCoordMap)
				if (!used[key] && geoCoordMap[key])
				{
					res.push({
						name: key,
						value: geoCoordMap[key].concat(0),
					});
				} 
			return res;
		};
		var zoom = 1.0;
		var roam = false;
		var symbolSizefunc =function (val) {
					if (val[2]>=40) return 20;
					if (val[2]>=10) return 15;
					if (val[2]>0)return 10 ;
					return 0;
		}
		if (mapName == 'world')
		{
			symbolSizefunc =function (val) {
					if (val[2]>100000) return 40;
					if (val[2]>10000) return 20;
					if (val[2]>100) return 10;
					return val[2]/1000;
			}
		}
		var visualMap = 
		{
				show: true,
				type: 'piecewise',
				min:1,
				max:100000,
				minOpen:true, 
				splitNumber: 5,
				pieces: [					
					{
						min: 0,
						max: 0,
						label: '0-0',
						text: '0-0',
						color:'#BEBEBE',
					},
					
					{
						min: 1,
						max: 99,
						label: '1-99',
						text: '1-99'
					},
					{
						min: 100,
						max: 999,
						label: '10-999'
					},
					{
						min: 1000,
						max: 9999,
						label: '1000-9999'
					},
					{
						min: 10000,
						label: '>10000'
					}
				],
				itemWidth: 50,
				showLabel: true,
				orient: "horizontal",
				left: 'center',
				top: 'bottom',
				textStyle: {
					color: '#FFFFFF',
					fontFamily: name_fontFamily
				},
				calculable: true,
				seriesIndex: [1],
				inRange: {
					color: ['#5F8BFF', '#1F2FBF']
				}
		}

		
		option = {
			title: {
				text: name_title,
				x: 'center',
				textStyle: {
					color: '#FFFFFF',
					fontFamily: name_fontFamily,
					fontSize: name_fontSize
				},
			},
			tooltip: {
				trigger: 'item',
				formatter: function(params) {
					var toolTiphtml = ''
					if (params.componentSubType== "effectScatter")
					{
						for(var i = 0; i < toolTipData.length; i++) 
						{
							var name = toolTipData[i].name;
							if (citymap[mapName] && citymap[mapName][name])
								name = citymap[mapName][name];
							if(params.name == name) {
								toolTiphtml += name + ':<br>'
								toolTiphtml += toolTipData[i].value[0].name + ':' + toolTipData[i].value[0].value + "<br>"
								
							}
						}
					} else {
							for(var i = 0; i < toolTipData.length; i++) 
							{
								var name = toolTipData[i].name;
								if (citymap[mapName] && citymap[mapName][name])
									name = citymap[mapName][name];
								if(params.name == name) 
								{
									toolTiphtml += name + ':<br>'
									toolTiphtml +=  '累计确诊:' +  cityData.cityallconfirm[i].value+ "<br>"
									toolTiphtml += toolTipData[i].value[1].name + ':' + toolTipData[i].value[1].value + "<br>"
									toolTiphtml += toolTipData[i].value[2].name + ':' + toolTipData[i].value[2].value + "<br>"
									return toolTiphtml;
								}
								
							}
							toolTiphtml += params.name + ':<br>'
							toolTiphtml += '累计确诊:' +  0+ "<br>"
							toolTiphtml += '已治愈:' + 0+ "<br>"
							toolTiphtml += '病亡病例:' + 0 + "<br>"
							
							
					}
					return toolTiphtml;
					
				}
			},
			
			visualMap: visualMap,
			
			geo: {
				map: mapName,
				label: {
					emphasis: {
					show: false
					}
				},
				roam: true,//禁止其放大缩小
				/*
				itemStyle: {
					normal: {
						areaColor: '#4c60ff',
						borderColor: '#002097'
					},
					emphasis: {
						areaColor: '#FFAA85'
					}
				}
				*/
				itemStyle: {
                            normal: {
                                //          	color: '#ddd',
                               // borderColor: 'rgba(255,255,255, 1)',
							    //borderColor: 'rgba(147, 235, 248, 1)',
                                //borderColor : visualMap,
								borderWidth: 1,
                                areaColor: {
                                    type: 'radial',
                                    x: 0.5,
                                    y: 0.5,
                                    r: 0.8,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: 'rgba(	47,79,79, .2)' // 100% 处的颜色
                                    }],
                                    globalCoord: false // 缺省为 false
                                },
                                shadowColor: 'rgba(128, 217, 248, 1)',
                                shadowOffsetX: -2,
                                shadowOffsetY: 2,
                                shadowBlur: 10
                            },
							emphasis: {
                                areaColor: '#FFAA85',
                                borderWidth: 0
                            }
				}				
			},
			series : [{
				name: '散点',
				type: 'effectScatter',
				rippleEffect: {
                            period: 2,
                            brushType: 'stroke',
                            scale: 3
                        },
				coordinateSystem: 'geo',
				data: convertData(data),
				roam: true,
				symbolSize: symbolSizefunc,
				label: {
					normal: {
						formatter: '{b}',
						position: 'right',
						show: false
					},
					emphasis: {
						show: true
					}
				},
				itemStyle: {
					normal: {
						color: '#ffeb7b'
					}
				}
			},
			{
					type: 'map',
					map: mapName,
					geoIndex: 0,
					aspectScale: 0.75, //长宽比
					showLegendSymbol: false, // 存在legend时显示
					/*
					label: {
						normal: {
							show: true
						},
						emphasis: {
							show: false,
							textStyle: {
								color: '#fff'
							}
						}
					},
					*/
					roam: true,
					/*
					itemStyle: {
						normal: {
							areaColor: '#ffffff',
							borderColor: '#ffffff',
						},
						emphasis: {
							areaColor: '#7f1818'
						}
					},
					*/
					animation: false,
					data: convertData(cityData.cityallconfirm),
			}]
		};
		myChart.clear();
		myChart.setOption(option,true);
		window.addEventListener("resize",function(){
            myChart.resize();
        });
	}
	
	function getDetailsToolTipData(cityName, data) {

		var testData = data.areaTree;

		var ciryOfDistrict = testData[0].children[cityName].children;

		var districtConfirmData = [];
		for (i = 0; i < ciryOfDistrict.length; i++) {
			var perDis = new Object();

			perDis.name = ciryOfDistrict[i].name;

			var _valuedata = [];


			var nowConfirm = new Object();
			nowConfirm.name = "在诊病例"
			nowConfirm.value = ciryOfDistrict[i].total.confirm - ciryOfDistrict[i].total.heal - ciryOfDistrict[i].total.dead;
			_valuedata.push(nowConfirm);



			var confirm = new Object();
			confirm.name = "累计确诊病例";
			confirm.value = ciryOfDistrict[i].total.confirm;
			_valuedata.push(confirm);

			var heal = new Object();
			heal.name = "治愈病例";
			heal.value = ciryOfDistrict[i].total.heal;
			_valuedata.push(heal);

			var dead = new Object();
			dead.name = "病亡病例";
			dead.value = ciryOfDistrict[i].total.dead;
			_valuedata.push(dead);

			perDis.value = _valuedata //ciryOfDistrict[i].total.confirm;
			districtConfirmData.push(perDis);
		}


		return districtConfirmData;
	}
	function getJsByCity(cityName) {
		var js_src = "";
		switch (cityName) {
			case "天津":
				js_src = "../map/js/province/tianjin.js";
				break;
			case "北京":
				js_src = "../map/js/province/beijing.js";
				break;
			case "上海":
				js_src = "../map/js/province/shanghai.js";
				break;
			case "安徽":
				js_src = "../map/js/province/anhui.js";
				break;
			case "澳门":
				js_src = "../map/js/province/aomen.js";
				break;
			case "重庆":
				js_src = "../map/js/province/chongqing.js";
				break;
			case "福建":
				js_src = "../map/js/province/fujian.js";
				break;
			case "甘肃":
				js_src = "../map/js/province/gansu.js";
				break;
			case "广东":
				js_src = "../map/js/province/guangdong.js";
				break;
			case "广西":
				js_src = "../map/js/province/guangxi.js";
				break;
			case "贵州":
				js_src = "../map/js/province/guizhou.js";
				break;
			case "海南":
				js_src = "../map/js/province/hainan.js";
				break;
			case "河北":
				js_src = "../map/js/province/hebei.js";
				break;
			case "湖北":
				js_src = "../map/js/province/hubei.js";
				break;
			case "黑龙江":
				js_src = "../map/js/province/heilongjiang.js";
				break;
			case "河南":
				js_src = "../map/js/province/henan.js";
				break;
			case "湖南":
				js_src = "../map/js/province/hunan.js";
				break;
			case "江苏":
				js_src = "../map/js/province/jiangsu.js";
				break;
			case "江西":
				js_src = "../map/js/province/jiangxi.js";
				break;
			case "广西":
				js_src = "../map/js/province/guangxi.js";
				break;
			case "吉林":
				js_src = "../map/js/province/jilin.js";
				break;
			case "辽宁":
				js_src = "../map/js/province/liaoning.js";
				break;
			case "内蒙古":
				js_src = "../map/js/province/neimenggu.js";
				break;
			case "宁夏":
				js_src = "../map/js/province/ningxia.js";
				break;
			case "青海":
				js_src = "../map/js/province/qinghai.js";
				break;
			case "山东":
				js_src = "../map/js/province/shandong.js";
				break;
			case "山西":
				js_src = "../map/js/province/shanxi.js";
				break;
			case "陕西":
				js_src = "../map/js/province/shanxi1.js";
				break;
			case "四川":
				js_src = "../map/js/province/sichuan.js";
				break;
			case "台湾":
				js_src = "../map/js/province/taiwan.js";
				break;
			case "香港":
				js_src = "../map/js/province/xianggang.js";
				break;
			case "新疆":
				js_src = "../map/js/province/xinjiang.js";
				break;
			case "西藏":
				js_src = "../map/js/province/xizang.js";
				break;
			case "云南":
				js_src = "../map/js/province/yunnan.js";
				break;
			case "浙江":
				js_src = "../map/js/province/zhejiang.js";
				break;
			default:
				js_src = "../map/js/province/hubei.js";
		}

		return js_src;
	}
	
	function covertCityData(cityName,data) {
		var firstconvertdata = data.areaTree;
		var secondconvertdata = firstconvertdata[0].children;
		var thirdconvertdata = secondconvertdata[0].children;
		
		for (i = 1; i < secondconvertdata.length; i++)
		{
			if (secondconvertdata[i].name == cityName)
			{
				thirdconvertdata = secondconvertdata[i].children;
				break;
			}
		}
		var cityData = new Object();

		var cityconfirmtotoaldata = [];
		var citydetailsdata = [];
		var cityallconfirm = [];
		for (i = 0; i < thirdconvertdata.length; i++) {
			var cityconfirm = new Object();
			var citydetails = new Object();
			var cityall = new Object();
			//在诊人数
			cityconfirm.name = thirdconvertdata[i].name;
			cityconfirm.value = parseInt(thirdconvertdata[i].total.confirm) - parseInt(thirdconvertdata[i].total.heal) - parseInt(thirdconvertdata[i].total.dead)
			cityconfirmtotoaldata.push(cityconfirm);
			
			//总确诊人数
			cityall.name = thirdconvertdata[i].name;
			cityall.value = parseInt(thirdconvertdata[i].total.confirm);
			cityallconfirm.push(cityall);
			
			//显示细节
			var city = new Object();
			city.name = thirdconvertdata[i].name;
			city.value = [];

			var confirm = new Object;
			confirm.name = "现存确诊";
			confirm.value = parseInt(thirdconvertdata[i].total.confirm) - parseInt(thirdconvertdata[i].total.heal) - parseInt(thirdconvertdata[i].total.dead);
			city.value.push(confirm);

			var heal = new Object;
			heal.name = "已治愈";
			heal.value = thirdconvertdata[i].total.heal;
			city.value.push(heal);

			var dead = new Object;
			dead.name = "病亡病例";
			dead.value = thirdconvertdata[i].total.dead;
			city.value.push(dead);
			//
			citydetailsdata.push(city);
		}

		cityData.cityconfirmtotoaldata = cityconfirmtotoaldata;
		cityData.citydetailsdata = citydetailsdata;
		cityData.cityallconfirm = cityallconfirm;
		return cityData;
	}
	
	function load_city_jsfile(selectCityText) {
		var js_src = getJsByCity(selectCityText);
		//动态加载js
		jQuery.getScript(js_src)
			.done(function () {
				loadEcharts(covertCityData(selectCityText, globalChinaData), getlastUpdateTime(globalChinaData), selectCityText);
				loadTopEcharts(getTopdata(globalChinaData,selectCityText),selectCityText);
				loadPieDatapercentage(getHealRateData(globalChinaData,selectCityText),selectCityText);
				loadPieDatanowConfirm(getnowConfirmCityData(globalChinaData,selectCityText),selectCityText);
				getProvince(selectCityText);
			})
			.fail(function () {

			});
			
	}
})

