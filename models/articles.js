/*
 * article 文章类模型
 *
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ArticlesSchema = new Schema({
    title: {type:String},
    content: {type:String},
    author_id: {type:ObjectId},
    top:{type:Boolen, default: false},
    reply_count: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    last_reply: { type: ObjectId },
    last_reply_at: { type: Date, default: Date.now },
    content_is_html: { type: Boolean }
});

mongoose.model('Articles', ArticlesSchema);