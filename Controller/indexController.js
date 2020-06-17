var request = require("request");
var cheerio = require("cheerio");

function indexController(app) {
    app.get('/', function (req, res, next) {
        res.render('index');
    });
    //中间件
    app.post('/getJsonData', function (req, res, next) {
        //
        //https://view.inews.qq.com/g2/getOnsInfo?name=disease_other
        //https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign
		//https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?province=%E5%9B%9B%E5%B7%9D&
		//https://api.inews.qq.com/newsqa/v1/automation/foreign/daily/list?country=%E9%98%BF%E6%A0%B9%E5%BB%B7&
        var getData;
        request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5', function (err, result) {
            if (err) {
                console.log(err);
            }

            getData = result.body;
            var jsData = JSON.parse(JSON.parse(getData).data);
            res.send(jsData);
        })
    });

    app.post('/getJsonforeign', function (req, res, next) {
        //
        //

        var getData1;
        var getData2;
        request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign', function (err, result) {
            if (err) {
                console.log(err);
            }

            request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5', function (err, resultdata) {
                if (err) {
                    console.log(err);
                }

                getData1 = resultdata.body;
                var jsData1 = JSON.parse(JSON.parse(getData1).data);
                //console.log(jsData);
                getData2 = result.body;
                var jsData2 = JSON.parse(JSON.parse(getData2).data);

                var worlddata = new Object()
                worlddata.china = jsData1
                worlddata.foreign = jsData2

                //console.log(worlddata)
                
                res.send(worlddata);
            })

            // getData2 = result.body;
            // var jsData2 = JSON.parse(JSON.parse(getData).data);
            // console.log(jsData);
            // res.send(jsData);
        })
    });


    app.post('/getJsonOther', function (req, res, next) {
        //
        //

        var getData;
        request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_other', function (err, result) {
            if (err) {
                console.log(err);
            }


            getData = result.body;
            var jsData = JSON.parse(JSON.parse(getData).data);
            //console.log(jsData);
            res.send(jsData);
        })
    });
	
	app.post('/getJsonProvince', function (req, res, next) {
        //
        //

        var getData;
		var url = 'https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?province='+req.body.province;
		//必须编码为URI格式
		//console.log(encodeURI(url)); 
        request(encodeURI(url), function (err, result) {
            if (err) {
                console.log(err);
            }		
            getData = result.body;			
			var jsData = JSON.parse(getData).data;
            //console.log(jsData);
            res.send(jsData);
        })
		
    });
}


module.exports = indexController;