/*
 * article 文章类模型
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticlesSchema = new Schema({
    title: {type: String},
    pic_url: {type:String},
    music_logo:{type:String},
    music_id: {type:Number},
    video_url: {type:String},
    content: {type: String},
    author_id: {type: ObjectId},
    author_name: {type: String},
    top:{type:Boolean, default: false},
    reply_count: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 },
    like_count: {type: Number, default: 0},
    create_at: {
                    date: {type: Date, default: Date.now},
                    year: {type: Number},
                    month: {type: String},
                    day: {type: String},
                    minute: {type: String}
               },
    update_at: {
                    date: {type: Date, default: Date.now},
                    year: {type: Number},
                    month: {type: String},
                    day: {type: String},
                    minute: {type: String}
               },
    create_date: {type: Date, default: Date.now},
    update_date: {type: Date, default: Date.now},
    last_reply: { type: ObjectId },
    last_reply_at: {
                    date: {type: Date, default: Date.now},
                    year: {type: Number},
                    month: {type: String},
                    day: {type: String},
                    minute: {type: String}
                },
    last_reply_date: { type: Date, default: Date.now },
    content_is_html: { type: Boolean },
    del_status: {type:Number, default:0}//删除状态，默认0没有删除，1删除
});

mongoose.model('Articles', ArticlesSchema);