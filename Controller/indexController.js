var request = require("request");
var cheerio = require("cheerio");

var User = require('../database/dbHandel');

function updateAllData()
{
	//https://view.inews.qq.com/g2/getOnsInfo?name=disease_other
    //https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign
	//https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?province=%E5%9B%9B%E5%B7%9D&
	//https://api.inews.qq.com/newsqa/v1/automation/foreign/daily/list?country=%E9%98%BF%E6%A0%B9%E5%BB%B7&
	//'https://view.inews.qq.com/g2/getOnsInfo?name=disease_other'
	
	var countries = [];
	request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5', function (err, result) {
		if(err) throw err;
        var provinces = [];
		getData = result.body;
		console.log("china start");
		
		var jsData = JSON.parse(JSON.parse(getData).data);
		//TODO
		getData = jsData.areaTree[0].children;
		for (i = 0 ;i <getData.length;i++)
			provinces.push(getData[i].name);
		console.log("provinces");
		
		for (let i = 0 ;i < provinces.length; i++)
		{
			var url = 'https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?province='+provinces[i];
			request(encodeURI(url), function (err, result) {
			if(err) throw err;
				var getData = result.body;
				var DataString = JSON.stringify(getData);
				User.findOneAndUpdate({ name:provinces[i]},{ name:provinces[i], jsondata:DataString}, function(err, doc) {
					if(err) throw err;
					if (!doc)
					{
						User.create({ name:provinces[i], jsondata:DataString}, function (err, doc) {
							if (err) console.log("载入失败");
						});
					}
				})
			})
		}
		console.log('provinces saved');
		
		
		User.findOneAndUpdate({ name:'china'},{ name:'china', jsondata:result.body},function(err, doc) {
				if(err) throw err;
				console.log('china saved')
		})
		

	})
	request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_foreign', function (err, result) {
		if(err) throw err;
        getData = result.body;
		console.log("world start");
		
		var jsData = JSON.parse(JSON.parse(getData).data);
		//TODO
		var getData = jsData.foreignList;
		for (i = 0 ;i <getData.length;i++)
			countries.push(getData[i].name);
		console.log(getData.length);
		for (let i = 0 ;i < countries.length; i++)
		{
			
			var url = 'https://api.inews.qq.com/newsqa/v1/automation/foreign/daily/list?country='+countries[i];
			request(encodeURI(url), function (err, result) {
				if(err) throw err;
				var getData = result.body;
				var DataString = JSON.stringify(getData);
				User.findOneAndUpdate({ name:countries[i]},{ name:countries[i], jsondata:DataString}, function(err, doc) {
					if(err) throw err;
					if (!doc)
					{
						User.create({ name:countries[i], jsondata:DataString}, function (err, doc) {
							if (err) console.log("载入失败");
						});
					}
				})
			})
			
		}	
		User.findOneAndUpdate({ name:'world'},{ name:'world', jsondata:result.body}, function(err, doc) {
				if(err) throw err;
				console.log('world saved')
		})
		
	})
	request('https://view.inews.qq.com/g2/getOnsInfo?name=disease_other', function (err, result) {
		if(err) throw err;
        User.findOneAndUpdate({ name:'chinadaily'},{ name:'chinadaily', jsondata:result.body}, function(err, doc) {
				if(err) throw err;
				console.log('chinadaily saved')
		})
		
	})
	

}
function indexController(app) {
    app.get('/', function (req, res, next) {
        res.render('index');
    });
    //中间件
    app.post('/getJsonData', function (req, res, next) {
		User.findOne({name:'更新时间'}, function(err, doc) {
			if(err) throw err;
			var date = new Date();
			var day = date.getDate();
			if (day.toString()!=doc.jsondata)
			{
				updateAllData();
				User.findOneAndUpdate({ name:'更新时间'},{ name:'更新时间', jsondata:day.toString()}, function(err, doc) {
					if(err) throw err;
					console.log("update data");
				})
			}
			var getData;
			User.findOne({name:'china'}, function(err, doc) {
				if(err) throw err;
				getData = doc.jsondata;
				var jsData = JSON.parse(JSON.parse(getData).data);
				res.send(jsData);
			})
			
		});		
    });

    app.post('/getJsonforeign', function (req, res, next) {
        //
        //
		
        var getData;
		User.findOne({name:'world'}, function(err, doc) {
				if(err) throw err;
				getData = doc.jsondata;
				var jsData = JSON.parse(JSON.parse(getData).data);
                var worlddata = new Object()
                worlddata.foreign = jsData
                res.send(worlddata);
		})
		
    });


    app.post('/getJsonOther', function (req, res, next) {
        //
        //
		
        var getData;		
		User.findOne({name:'chinadaily'}, function(err, doc) {
				if(err) throw err;
				getData = doc.jsondata;
				var jsData = JSON.parse(JSON.parse(getData).data);
				res.send(jsData);
		})
		
		
    });
	
	app.post('/getJsonProvince', function (req, res, next) {
        //
        //
        var getData;		
		User.findOne({name:req.body.province}, function(err, doc) {
				if(err) throw err;
				getData = doc.jsondata;
				//console.log(getData);
				var jsData = JSON.parse(JSON.parse(getData)).data;
				res.send(jsData);
		})
		
    });
}


module.exports = indexController;