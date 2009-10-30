(function(){var a="sproutcore/standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:["sproutcore/empty_theme"],styles:["/static/sproutcore/standard_theme/es/3/stylesheet-packed.css","/static/sproutcore/standard_theme/es/3/stylesheet.css"],scripts:["/static/sproutcore/standard_theme/es/3/javascript-packed.js"]}
})();Twitapp=SC.Application.create({NAMESPACE:"Twitapp",VERSION:"0.1.0",store:SC.Store.create({commitRecordsAutomatically:YES})});
Twitapp.RecordStatus={initMixin:function(){if(this.addObserver){this.addObserver("content.status",this,this._rec_status_changed)
}},recordStatusDidChange:function(a){},_rec_status_changed:function(){var a,b;if(this.get&&this.get("content")){b=this.get("content")
}if(b&&b.get){a=b.get("status")}if(a&&this.recordStatusDidChange){this.recordStatusDidChange(a)
}}};sc_require("mixins/record_status");Twitapp.searchController=SC.ObjectController.create(Twitapp.RecordStatus,{contentBinding:"Twitapp.searchesController.selection",contentBindingDefault:SC.Binding.single(),recordStatusDidChange:function(a){var b=this.get("content");
if(a&SC.Record.READY_CLEAN){if(Twitapp.db){Twitapp.dumpRecordsToDatabase()}}}});Twitapp.searchesController=SC.ArrayController.create({allowsMultipleSelection:NO,allowsEmptySelection:NO,queryString:null,search:function(){var c=this.get("queryString");
var a=this.getEach("searchTerm");if(!c){return null}if(a.indexOf(c)!==-1){return null
}var b=Twitapp.get("store").createRecord(Twitapp.Search,{searchTerm:c,unreadTweetsCount:10});
Twitapp.searchesController.selectObject(b)}});Twitapp.tweetsController=SC.ArrayController.create({contentBinding:"Twitapp.searchController.tweets"});
Twitapp.Tweet=SC.Record.extend({primaryKey:"id"});sc_require("models/tweet");Twitapp.TWEETS_QUERY=SC.Query.local(Twitapp.Tweet,{orderBy:"id DESC",url:"search.json?rpp=10&q=twitter"});
Twitapp.TwitterDataSource=SC.DataSource.extend({fetch:function(a,c){var b=c.get("url");
if(b){SC.Request.getUrl(b).json().notify(this,"didFetchTweets",a,c).send();return YES
}return NO},didFetchTweets:function(b,a,e){if(SC.ok(b)){var d=b.get("body").results;
for(var c=0;c<d.length;c++){d[c].guid=d.length-c;d[c].searchTerm=unescape(b.get("body").query);
d[c].text=d[c].text.unescapeHTML()}a.loadRecords(Twitapp.Tweet,d);a.dataSourceDidFetchQuery(e)
}else{a.dataSourceDidErrorQuery(e,b)}},retrieveRecord:function(a,b){return NO},createRecord:function(a,c){var b=a.find(Twitapp.Search).length();
var d=a.readEditableDataHash(c);d.guid=b+1;a.dataSourceDidComplete(c,null,b+1);return YES
},updateRecord:function(a,b){return NO},destroyRecord:function(a,b){return NO}});
Twitapp.String={stripTags:function(){return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi,"")
},unescapeHTML:function(){return this.stripTags().replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"')
}};SC.supplement(String.prototype,Twitapp.String);Twitapp.Search=SC.Record.extend({searchTerm:SC.Record.attr(String),unreadTweetsCount:SC.Record.attr(Number),tweets:function(){var b=this._query;
var a=this.get("searchTerm");if(!b&&a){b=this._query=SC.Query.local(Twitapp.Tweet,{conditions:"searchTerm = {searchterm}",orderBy:"id DESC",parameters:{searchterm:a},url:"search.json?rpp=10&q=%@".fmt(escape(a))})
}return this.get("store").find(b)}.property().cacheable()});Twitapp.TweetView=SC.View.extend(SC.Control,{content:null,createChildViews:function(){var d=this.get("content");
var b,a=[],c=this;this.avatarView=b=this.createChildView(SC.ImageView.design({layout:{centerY:0,left:5,height:48,width:48},content:c.get("content"),contentValueKey:"profile_image_url",canLoadInBackground:YES}));
a.push(b);this.messageView=b=this.createChildView(SC.LabelView.design({layout:{top:10,left:63,right:5,bottom:5},content:c.get("content"),contentValueKey:"text"}));
a.push(b);this.set("childViews",a);return arguments.callee.base.apply(this,arguments)
}});Twitapp.mainPage=SC.Page.design({mainPane:SC.MainPane.design({childViews:"savedSearchesList searchView tweetList".w(),savedSearchesList:SC.ScrollView.design({layout:{top:0,left:0,bottom:0,width:245},hasHorizontalScroller:NO,contentView:SC.SourceListView.design({contentBinding:"Twitapp.searchesController",selectionBinding:"Twitapp.searchesController.selection",contentValueKey:"searchTerm",contentUnreadCountKey:"unreadTweetsCount"})}),searchView:SC.View.design({layout:{top:50,left:310,height:50,width:400},childViews:"searchField searchButton".w(),searchField:SC.TextFieldView.design({layout:{top:2,left:10,height:18,width:260},hint:"Search for #sproutcore".loc(),valueBinding:"Twitapp.searchesController.queryString"}),searchButton:SC.ButtonView.design({layout:{top:0,left:285,height:24,width:100},title:"Search".loc(),isDefault:YES,target:"Twitapp.searchesController",action:"search"})}),tweetList:SC.ScrollView.design({hasHorizontalScroller:NO,layout:{top:100,left:310,width:400,height:500},contentView:SC.ListView.design({contentBinding:"Twitapp.tweetsController",selectionBinding:"Twitapp.tweetsController.selection",exampleView:Twitapp.TweetView,rowHeight:80,rowSpacing:10})})})});
Twitapp.main=function main(){Twitapp.initDataBase();Twitapp.getPath("mainPage.mainPane").append();
Twitapp.SEARCHES_QUERY=SC.Query.local(Twitapp.Search,{orderBy:"searchTerm ASC"});
if(Twitapp.db){Twitapp.loadDatabase()}else{Twitapp.loadFixtures()}};Twitapp.initDataBase=function(){try{if(window.openDatabase){Twitapp.db=openDatabase("Twitapp.SearchStore","1.0","Twitapp Searches Store",200000);
if(!Twitapp.db){console.log("Failed to open database on disk.  Probably because the version was bad or the quota is exceeded.  Will proceed with fixture data.")
}}else{console.log("This browser does not support HTML5 client side storage.  Will proceed with fixture data.")
}}catch(a){}};Twitapp.loadDatabase=function(){Twitapp.db.transaction(function(a){a.executeSql("SELECT COUNT(*) FROM TwitappStoreData",[],function(c,b){Twitapp.restoreRecordsFromDatabase()
},function(b,c){b.executeSql("CREATE TABLE TwitappStoreData (id REAL UNIQUE, json TEXT)",[],function(){Twitapp.loadFixtures();
var d=Twitapp.get("store").find(Twitapp.Search).invoke("get","attributes");var e=SC.json.encode(d);
b.executeSql("INSERT INTO TwitappStoreData (id, json) VALUES (?, ?)",[1,e]);Twitapp.setPath("store.dataSource","Twitapp.TwitterDataSource")
})})})};Twitapp.restoreRecordsFromDatabase=function(){if(!Twitapp.db){return}Twitapp.db.transaction(function(tx){tx.executeSql("SELECT id, json FROM TwitappStoreData",[],function(tx,result){if(result.rows.length>=1){var json=result.rows.item(0)["json"];
var recs=eval(json);Twitapp.get("store").loadRecords(Twitapp.Search,recs);console.log("loaded data from HTML5 DB");
console.log("activating twittersearch data-source");Twitapp.setPath("store.dataSource","Twitapp.TwitterDataSource");
Twitapp.startApplication()}else{Twitapp.loadFixtures()}},function(tx,error){Twitapp.loadFixtures()
})})};Twitapp.dumpRecordsToDatabase=function(){if(!Twitapp.db){return}var a=Twitapp.get("store").find(Twitapp.Search).invoke("get","attributes");
var b=SC.json.encode(a);Twitapp.db.transaction(function(c){c.executeSql("UPDATE TwitappStoreData SET json = ? WHERE id = ?",[b,1])
})};Twitapp.startApplication=function(){var a=Twitapp.get("store").find(Twitapp.SEARCHES_QUERY);
Twitapp.searchesController.set("content",a);Twitapp.setPath("store.dataSource","Twitapp.TwitterDataSource");
Twitapp.mainPage.mainPane.searchView.searchField.becomeFirstResponder()};Twitapp.loadFixtures=function(){Twitapp.setPath("store.dataSource",SC.Record.fixtures);
Twitapp.startApplication()};function main(){Twitapp.main()};