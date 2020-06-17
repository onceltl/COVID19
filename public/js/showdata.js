var globalData = {};
$(function ()
{
    setchart()
    function setchart()
    {
        $.ajax(
        {
            type : "post",
            url : "/getJsonOther",
            datatype : "json",
            crossDomain : true,
            success : function (data, status)
            {
                if (status == "success")
                {

                    //var jsondata = JSON.parse(data);
                    var jsData = data;
					globalData = data;
                    console.log(jsData);
                    //总计
                    loadStackLineEcharts(getchinaDayList(jsData), getchinaDetailsDatalList(jsData));

                    // 新增确诊与新增治愈
                    loadAddsStackLineEcharts(getchinaaddsStackDayList(jsData), getchinaaddsStackDataList(jsData));

                    //百分比
                    loadPercentageEcharts(getPercentageDate(jsData), getPercentageData(jsData));

                    // 预测
                    loadPredictionEcharts(getchinaDayList(jsData), getchinaDetailsDatalList(jsData));
                }
                else
                {
                    alert('error');
                }
            },
            error : function (err, status)
            {
                alert('loading data error');
            }
        }
        );
    }
}
)
function getPercentageDate(data)
{
    var getdata = data.dailyHistory;

    var date = [];

    for (i = 0; i < getdata.length; i++)
    {
        date.push(getdata[i].date)
    }

    return date;
}
function getPercentageData(data)
{
    var getdata = data.dailyHistory;

    var detailsdatas = [];

    var details1 = new Object();
    details1.value = [];
    var details2 = new Object();
    details2.value = [];
    var details3 = new Object();
    details3.value = [];
    for (i = 0; i < getdata.length; i++)
    {
        details1.value.push(getdata[i].country.deadRate);
        details2.value.push(getdata[i].hubei.deadRate);
        details3.value.push(getdata[i].notHubei.deadRate);
    }

    detailsdatas.push(details1);
    detailsdatas.push(details2);
    detailsdatas.push(details3);
    return detailsdatas;
}
function getProvincePercentageData(data)
{

    var detailsdatas = [];

    var details1 = new Object();
    details1.value = [];
    for (i = 0; i < data.length; i++)
    {
        details1.value.push(data[i].dead/data[i].confirm);
    }

    detailsdatas.push(details1);
    return detailsdatas;
}
function getWorldPercentageData(data)
{

    var detailsdatas = [];

    var details1 = new Object();
    details1.value = [];
    for (i = 0; i < data.length; i++)
    {
        details1.value.push(data[i].all.deadRate);
    }

    detailsdatas.push(details1);
    return detailsdatas;
}
function getchinaDetailsDatalList(data)
{
    var getdata = data.chinaDayList;

    var detailsdatas = [];

    var details1 = new Object();
    details1.value = [];
    var details2 = new Object();
    details2.value = [];
    var details3 = new Object();
    details3.value = [];
    var details4 = new Object();
    details4.value = [];
    for (i = 0; i < getdata.length; i++)
    {
        details1.value.push(getdata[i].confirm);
        details2.value.push(getdata[i].suspect);
        details3.value.push(getdata[i].heal);
        details4.value.push(getdata[i].dead);
    }

    detailsdatas.push(details1);
    detailsdatas.push(details2);
    detailsdatas.push(details3);
    detailsdatas.push(details4);

    return detailsdatas;
}
function getProvinceDetailsDatalList(data)
{

    var detailsdatas = [];

    var details1 = new Object();
    details1.value = [];
    var details2 = new Object();
    details2.value = [];
    var details3 = new Object();
    details3.value = [];
    var details4 = new Object();
    details4.value = [];
    for (i = 0; i < data.length; i++)
    {
        details1.value.push(data[i].confirm);
        //details2.value.push(data[i].suspect);
        details3.value.push(data[i].heal);
        details4.value.push(data[i].dead);
    }

    detailsdatas.push(details1);
    //detailsdatas.push(details2);
    detailsdatas.push(details3);
    detailsdatas.push(details4);

    return detailsdatas;
}
function getWordDetailsDatalList(data)
{

    var detailsdatas = [];

    var details1 = new Object();
    details1.value = [];
    var details2 = new Object();
    details2.value = [];
    var details3 = new Object();
    details3.value = [];
    var details4 = new Object();
    details4.value = [];
    for (i = 0; i < data.length; i++)
    {
        details1.value.push(data[i].all.confirm);
        //details2.value.push(data[i].suspect);
        details3.value.push(data[i].all.heal);
        details4.value.push(data[i].all.dead);
    }

    detailsdatas.push(details1);
    //detailsdatas.push(details2);
    detailsdatas.push(details3);
    detailsdatas.push(details4);

    return detailsdatas;
}
function getchinaaddsStackDataList(data)
{

    var dailyNewAdds = data.chinaDayAddList;

    //新增确诊病例数组
    var newAddsConfirm = [];
    var newAddsSuspect = [];
    for (i = 1; i < dailyNewAdds.length; i++)
    {
        var perdayadds = dailyNewAdds[i].confirm;
        newAddsConfirm.push(perdayadds);

        var perdayadds = dailyNewAdds[i].heal;
        newAddsSuspect.push(perdayadds);
    }

    var addsStackData = new Object();
    addsStackData.newconfirmadds = newAddsConfirm;
    addsStackData.newsuspectadds = newAddsSuspect;

    return addsStackData;
}
function getchinaaddsStackDayList(data)
{
    var getdata = data.chinaDayAddList;

    var daydata = [];
    for (i = 8; i < getdata.length; i++)
    {
        daydata.push(getdata[i].date);
    }
    return daydata;
}
function getProvinceaddsStackDataList(data)
{


    //新增确诊病例数组
    var newAddsConfirm = [];
    var newAddsSuspect = [];
    for (i = 0; i < data.length; i++)
    {
        newAddsConfirm.push(data[i].newConfirm);
        newAddsSuspect.push(data[i].newHeal);
    }

    var addsStackData = new Object();
    addsStackData.newconfirmadds = newAddsConfirm;
    addsStackData.newsuspectadds = newAddsSuspect;

    return addsStackData;
}
function getWorldaddsStackDataList(data)
{

	//新增确诊病例数组
    var newAddsConfirm = [];
    var newAddsSuspect = [];
	newAddsConfirm.push(data[0].all.newAddConfirm);
	
	newAddsConfirm.push(data[0].all.heal);
    for (i = 1; i < data.length; i++)
    {
        newAddsConfirm.push(data[i].all.newAddConfirm);
        newAddsSuspect.push(data[i].all.heal-data[i-1].all.heal);
    }

    var addsStackData = new Object();
    addsStackData.newconfirmadds = newAddsConfirm;
    addsStackData.newsuspectadds = newAddsSuspect;

    return addsStackData;
}
function loadPercentageEcharts(daydata, daydetailsdata)
{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart6'));
    option =
    {

        tooltip :
        {
            trigger : 'axis',
            axisPointer :
            {
                lineStyle :
                {
                    color : '#dddc6b'
                }
            }
        },
        legend :
        {
            top : '0%',
            data : ['全国病死率', '湖北病死率', '非湖北病死率'],
            textStyle :
            {
                color : 'rgba(255,255,255,.5)',
                fontSize : '12',
            }
        },
        grid :
        {
            left : '10',
            top : '35',
            right : '10',
            bottom : '10',
            containLabel : true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 10,
                    },
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.2)'
                    }

                },

                data : daydata
            },
            {
                axisPointer :
                {
                    show : false
                },
                axisLine :
                {
                    show : false
                },
                position : 'bottom',
                offset : 20,

            }
        ],

        yAxis : [
            {
                type : 'value',
                axisTick :
                {
                    show : false
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 12,
                    },
                },

                splitLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                }
            }
        ],
        series : [
            {
                name : '全国病死率',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#ec9217',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#ec9217',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[0].value

            },
            {
                name : '湖北病死率',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#e83132',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#e83132',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[1].value

            },
            {
                name : '非湖北病死率',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#00d887',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#00d887',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[2].value

            },

        ]

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option,true);
    window.addEventListener("resize", function ()
    {
        myChart.resize();
    }
    );
}
function loadPercentageEchartsProvince(daydata, daydetailsdata)
{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart6'));
    option =
    {

        tooltip :
        {
            trigger : 'axis',
            axisPointer :
            {
                lineStyle :
                {
                    color : '#dddc6b'
                }
            }
        },
        legend :
        {
            top : '0%',
            data : ['病死率'],
            textStyle :
            {
                color : 'rgba(255,255,255,.5)',
                fontSize : '12',
            }
        },
        grid :
        {
            left : '10',
            top : '35',
            right : '10',
            bottom : '10',
            containLabel : true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 10,
                    },
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.2)'
                    }

                },

                data : daydata
            },
            {
                axisPointer :
                {
                    show : false
                },
                axisLine :
                {
                    show : false
                },
                position : 'bottom',
                offset : 20,

            }
        ],

        yAxis : [
            {
                type : 'value',
                axisTick :
                {
                    show : false
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 12,
                    },
                },

                splitLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                }
            }
        ],
        series : [
            {
                name : '病死率',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#ec9217',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#ec9217',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[0].value

            },

        ]

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option,true);
    window.addEventListener("resize", function ()
    {
        myChart.resize();
    }
    );
}
function loadStackLineEcharts(daydata, daydetailsdata)
{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart5'));

    option =
    {
        tooltip :
        {
            trigger : 'axis',
            axisPointer :
            {
                lineStyle :
                {
                    color : '#dddc6b'
                }
            }
        },
        legend :
        {
            top : '0%',
            data : ['确诊总数', '治愈总数', '疑似总数', '死亡总数'],
            textStyle :
            {
                color : 'rgba(255,255,255,.5)',
                fontSize : '12',
            }
        },
        grid :
        {
            left : '10',
            top : '35',
            right : '10',
            bottom : '10',
            containLabel : true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 10,
                    },
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.2)'
                    }

                },

                data : daydata
            },
            {
                axisPointer :
                {
                    show : false
                },
                axisLine :
                {
                    show : false
                },
                position : 'bottom',
                offset : 20,

            }
        ],

        yAxis : [
            {
                type : 'value',
                axisTick :
                {
                    show : false
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 12,
                    },
                },

                splitLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                }
            }
        ],
        series : [
            {
                name : '确诊总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#e83132',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#e83132',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[0].value

            },
            {
                name : '治愈总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#00d887',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(0, 216, 135, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(0, 216, 135, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#00d887',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[2].value

            },
            {
                name : '疑似总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#ec9217',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(0, 216, 135, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(0, 216, 135, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#ec9217',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[1].value

            },
            {
                name : '死亡总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#A020F0',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(0, 216, 135, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(0, 216, 135, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#A020F0',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[3].value

            },

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
function loadStackLineEchartsProvince(daydata, daydetailsdata)
{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart5'));
    option =
    {
        tooltip :
        {
            trigger : 'axis',
            axisPointer :
            {
                lineStyle :
                {
                    color : '#dddc6b'
                }
            }
        },
        legend :
        {
            top : '0%',
            data : ['确诊总数', '治愈总数', '死亡总数'],
            textStyle :
            {
                color : 'rgba(255,255,255,.5)',
                fontSize : '12',
            }
        },
        grid :
        {
            left : '10',
            top : '35',
            right : '10',
            bottom : '10',
            containLabel : true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 10,
                    },
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.2)'
                    }

                },

                data : daydata
            },
            {
                axisPointer :
                {
                    show : false
                },
                axisLine :
                {
                    show : false
                },
                position : 'bottom',
                offset : 20,

            }
        ],

        yAxis : [
            {
                type : 'value',
                axisTick :
                {
                    show : false
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 12,
                    },
                },

                splitLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                }
            }
        ],
        series : [
            {
                name : '确诊总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#e83132',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#e83132',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[0].value

            },
            {
                name : '治愈总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#00d887',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(0, 216, 135, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(0, 216, 135, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#00d887',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[1].value

            },
         
            {
                name : '死亡总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#A020F0',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(0, 216, 135, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(0, 216, 135, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#A020F0',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[2].value
            },

        ]

    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option,true);
    window.addEventListener("resize", function ()
    {
        myChart.resize();
    }
    );
}
function loadPredictionEcharts(daydata, daydetailsdata)
{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart1'));

    option =
    {
        tooltip :
        {
            trigger : 'axis',
            axisPointer :
            {
                lineStyle :
                {
                    color : '#dddc6b'
                }
            }
        },
        legend :
        {
            top : '0%',
            data : ['确诊总数'],
            textStyle :
            {
                color : 'rgba(255,255,255,.5)',
                fontSize : '12',
            }
        },
        grid :
        {
            left : '10',
            top : '35',
            right : '10',
            bottom : '10',
            containLabel : true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 10,
                    },
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.2)'
                    }

                },

                data : daydata
            },
            {
                axisPointer :
                {
                    show : false
                },
                axisLine :
                {
                    show : false
                },
                position : 'bottom',
                offset : 20,

            }
        ],

        yAxis : [
            {
                type : 'value',
                axisTick :
                {
                    show : false
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 12,
                    },
                },

                splitLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                }
            }
        ],
        series : [
            {
                name : '确诊总数',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#e83132',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#e83132',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : daydetailsdata[0].value

            },

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
function loadAddsStackLineEcharts(addsdaydata, data)
{
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echart4'));

    option =
    {
        tooltip :
        {
            trigger : 'axis',
            axisPointer :
            {
                lineStyle :
                {
                    color : '#dddc6b'
                }
            }
        },
        legend :
        {
            top : '0%',
            data : ['新增确诊', '新增治愈'],
            textStyle :
            {
                color : 'rgba(255,255,255,.5)',
                fontSize : '12',
            }
        },
        grid :
        {
            left : '10',
            top : '30',
            right : '10',
            bottom : '10',
            containLabel : true
        },

        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 10,
                    },
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.2)'
                    }

                },

                data : addsdaydata
            },
            {

                axisPointer :
                {
                    show : false
                },
                axisLine :
                {
                    show : false
                },
                position : 'bottom',
                offset : 20,

            }
        ],

        yAxis : [
            {
                type : 'value',
                axisTick :
                {
                    show : false
                },
                axisLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel :
                {
                    textStyle :
                    {
                        color : "rgba(255,255,255,.6)",
                        fontSize : 12,
                    },
                },

                splitLine :
                {
                    lineStyle :
                    {
                        color : 'rgba(255,255,255,.1)'
                    }
                }
            }
        ],
        series : [
            {
                name : '新增确诊',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#e83132',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(1, 132, 213, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(1, 132, 213, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#e83132',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : data.newconfirmadds

            },
            {
                name : '新增治愈',
                type : 'line',
                smooth : true,
                symbol : 'circle',
                symbolSize : 5,
                showSymbol : true,
                lineStyle :
                {

                    normal :
                    {
                        color : '#00d887',
                        width : 2
                    }
                },
                areaStyle :
                {
                    normal :
                    {
                        color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset : 0,
                                    color : 'rgba(0, 216, 135, 0.4)'
                                },
                                {
                                    offset : 0.8,
                                    color : 'rgba(0, 216, 135, 0.1)'
                                }
                            ], false),
                        shadowColor : 'rgba(0, 0, 0, 0.1)',
                    }
                },
                itemStyle :
                {
                    normal :
                    {
                        color : '#00d887',
                        borderColor : 'rgba(221, 220, 107, .1)',
                        borderWidth : 12
                    }
                },
                data : data.newsuspectadds

            },

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

function getchinaDayList(data)
{
    var getdata = data.chinaDayList;

    var daydata = [];
    for (i = 0; i < getdata.length; i++)
    {
        daydata.push(getdata[i].date);
    }
    return daydata;
}
function getProvinceDayList(data)
{

    var daydata = [];
    for (i = 0; i < data.length; i++)
    {
        daydata.push(data[i].date);
    }
    return daydata;
}
function getWordDayList(data)
{

    var daydata = [];
    for (i = 0; i < data.length; i++)
    {
        daydata.push(data[i].date);
    }
    return daydata;
}
function getProvince(mapName)
{
    $.ajax(
    {
        type : "post",
        url : "/getJsonProvince",
		data:{'province':mapName},
        datatype : "json",
        crossDomain : true,
        success : function (data, status)
        {
            if (status == "success")
            {
                //var jsondata = JSON.parse(data);
                var jsData = data;
                //console.log(jsData);
                //总计
                loadStackLineEchartsProvince(getProvinceDayList(jsData), getProvinceDetailsDatalList(jsData));

                // 新增确诊与新增治愈
                loadAddsStackLineEcharts(getProvinceDayList(jsData), getProvinceaddsStackDataList(jsData));

                //百分比
                loadPercentageEchartsProvince(getProvinceDayList(jsData), getProvincePercentageData(jsData));

                // 预测
                //loadPredictionEcharts(getchinaDayList(jsData), getchinaDetailsDatalList(jsData));
            }
            else
            {
                alert('error');
            }
        },
        error : function (err, status)
        {
            alert('loading data error');
        }
    }
    );
}
function reloadChinaEchart()
{
	    var jsData = globalData;

                    //总计
         loadStackLineEcharts(getchinaDayList(jsData), getchinaDetailsDatalList(jsData));

                    // 新增确诊与新增治愈
                    loadAddsStackLineEcharts(getchinaaddsStackDayList(jsData), getchinaaddsStackDataList(jsData));

                    //百分比
                    loadPercentageEcharts(getPercentageDate(jsData), getPercentageData(jsData));

                    // 预测
                    loadPredictionEcharts(getchinaDayList(jsData), getchinaDetailsDatalList(jsData));
}
function reloadWorldEchart(jsData)
{
                //console.log(jsData);
                //总计
                loadStackLineEchartsProvince(getWordDayList(jsData), getWordDetailsDatalList(jsData));

                // 新增确诊与新增治愈
                loadAddsStackLineEcharts(getWordDayList(jsData), getWorldaddsStackDataList(jsData));

                //百分比
                loadPercentageEchartsProvince(getWordDayList(jsData), getWorldPercentageData(jsData));

                // 预测
                //loadPredictionEcharts(getchinaDayList(jsData), getchinaDetailsDatalList(jsData));
}