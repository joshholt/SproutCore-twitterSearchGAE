(function(){var a="sproutcore/standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:["sproutcore/empty_theme"],styles:["/static/sproutcore/standard_theme/en/1/stylesheet-packed.css","/static/sproutcore/standard_theme/en/1/stylesheet.css"],scripts:["/static/sproutcore/standard_theme/en/1/javascript-packed.js"]}
})();Twitapp=SC.Application.create({NAMESPACE:"Twitapp",VERSION:"0.1.0",store:SC.Store.create().from("Twitapp.TwitterDataSource")});
Twitapp.searchController=SC.ObjectController.create({queryString:null,search:function(){var b=this.get("queryString");
if(!b){return null}var a=Twitapp.tweetsController.get("content");if(a){a.setPath("query.url","search.json?rpp=10&q=%@".fmt(escape(b)));
a.refresh()}}});Twitapp.tweetsController=SC.ArrayController.create({});Twitapp.Tweet=SC.Record.extend({});
sc_require("models/tweet");Twitapp.TWEETS_QUERY=SC.Query.local(Twitapp.Tweet,{orderBy:"id DESC",url:"search.json?rpp=10&q=twitter"});
Twitapp.TwitterDataSource=SC.DataSource.extend({fetch:function(a,c){var b=c.get("url");
if(b){SC.Request.getUrl(b).json().notify(this,"didFetchTweets",a,c).send();return YES
}return NO},didFetchTweets:function(b,a,e){if(SC.ok(b)){var d=b.get("body").results;
for(var c=0;c<d.length;c++){d[c].guid=d.length-c}a.loadRecords(Twitapp.Tweet,d);a.dataSourceDidFetchQuery(e)
}else{a.dataSourceDidErrorQuery(e,b)}},retrieveRecord:function(a,b){return NO},createRecord:function(a,b){return NO
},updateRecord:function(a,b){return NO},destroyRecord:function(a,b){return NO}});
Twitapp.TweetView=SC.View.extend(SC.Control,{content:null,createChildViews:function(){var d=this.get("content");
var b,a=[],c=this;this.avatarView=b=this.createChildView(SC.ImageView.design({layout:{centerY:0,left:5,height:48,width:48},content:c.get("content"),contentValueKey:"profile_image_url",canLoadInBackground:YES}));
a.push(b);this.messageView=b=this.createChildView(SC.LabelView.design({layout:{top:10,left:63,right:5,bottom:5},content:c.get("content"),contentValueKey:"text"}));
a.push(b);this.set("childViews",a);return arguments.callee.base.apply(this,arguments)
}});Twitapp.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"searchView tweetList".w(),searchView:SC.View.design({layout:{centerX:0,centerY:-210,height:140,width:400},childViews:"searchField searchButton".w(),searchField:SC.TextFieldView.design({layout:{top:2,left:10,height:18,width:260},hint:"Search for #sproutcore".loc(),valueBinding:"Twitapp.searchController.queryString"}),searchButton:SC.ButtonView.design({layout:{top:0,left:285,height:24,width:100},title:"Search".loc(),isDefault:YES,target:"Twitapp.searchController",action:"search"})}),tweetList:SC.ScrollView.design({hasHorizontalScroller:NO,layout:{centerX:0,centerY:0,width:400,height:500},contentView:SC.ListView.design({contentBinding:"Twitapp.tweetsController",selectionBinding:"Twitapp.tweetsController.selection",exampleView:Twitapp.TweetView,rowHeight:80,rowSpacing:10})})})});
Twitapp.main=function main(){Twitapp.getPath("mainPage.mainPane").append();var a=Twitapp.store.find(Twitapp.TWEETS_QUERY);
Twitapp.tweetsController.set("content",a)};function main(){Twitapp.main()};