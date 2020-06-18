var mongoose = require('mongoose'); // 引入mongoose模块
var Schema = mongoose.Schema;   //  创建模型
var userSchema = new Schema({
    name: String,
    jsondata: String
});

var User = mongoose.model('data', userSchema);

module.exports = User;