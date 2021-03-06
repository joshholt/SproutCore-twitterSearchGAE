SC.RootResponder=SC.RootResponder.extend({platform:"mobile",setup:function(){arguments.callee.base.apply(this,arguments);
this.listenFor("touchstart touchmove touchend touchcancel".w(),document)},touchstart:function(b){try{var a=this.targetViewForEvent(b);
a=this._touchView=this.sendEvent("touchStart",b,a);if(a&&a.respondsTo("touchDragged")){this._touchCanDrag=YES
}}catch(c){console.log("Exception during touchStart: %@".fmt(c));this._touchView=null;
this._touchCanDrag=NO;return NO}return a?b.hasCustomEventHandling:YES},touchmove:function(c){SC.RunLoop.begin();
try{var b=this._lastHovered||[];var d=[];var a=this.targetViewForEvent(c);while(a&&(a!==this)){if(b.indexOf(a)!==-1){a.tryToPerform("touchMoved",c);
d.push(a)}else{a.tryToPerform("touchEntered",c);d.push(a)}a=a.get("nextResponder")
}for(var h=0;h<b.length;h++){a=b[h];var g=a.respondsTo("touchExited");if(g&&!(d.indexOf(a)!==-1)){a.tryToPerform("touchExited",c)
}}this._lastHovered=d;if(this._touchView){this._touchView.tryToPerform("touchDragged",c)
}}catch(f){console.log("Exception during touchMove: %@".fmt(f))}SC.RunLoop.end();
return YES},touchend:function(b){try{b.cancel=NO;var c=null,a=this._touchView;if(a){c=this.sendEvent("touchEnd",b,a)
}if(!c){a=this.targetViewForEvent(b)}this._touchCanDrag=NO;this._touchView=null}catch(d){console.log("Exception during touchEnd: %@".fmt(d));
this._touchCanDrag=NO;this._touchView=null;return NO}return(c)?b.hasCustomEventHandling:YES
},touchcancel:function(a){a.cancel=YES;return this.touchend(a)}});SC.ButtonView=SC.View.extend(SC.Control,SC.Button,{tagName:"a",classNames:["sc-button-view"],theme:"square",href:"",action:null,target:null,triggerAction:function(a){if(!this.get("isEnabled")){return false
}this.set("isActive",YES);this._action(a);this.invokeLater("set",200,"isActive",NO);
return true},_TEMPORARY_CLASS_HASH:{},displayProperties:"href icon title value".w(),render:function(c,e){if(this.get("tagName")==="a"){var a=this.get("href");
if(!a||(a.length===0)){a="javascript:;"}c.attr("href",a)}var b=this._TEMPORARY_CLASS_HASH,d=this.get("icon");
b.def=this.get("isDefault");b.cancel=this.get("isCancel");b.icon=!!d;c.attr("role","button").setClass(b).addClass(this.get("theme"));
if(!this._isTouchActive){c=c.begin("span").addClass("sc-button-inner");this.renderTitle(c,e);
c=c.end()}},_isTouchActive:NO,touchStart:function(a){if(!this.get("isEnabled")){return YES
}this.set("isActive",YES);this._isTouchActive=YES;return YES},touchExited:function(a){if(this._isTouchActive){this.set("isActive",NO)
}return YES},touchEntered:function(a){this.set("isActive",this._isTouchActive);return YES
},touchEnd:function(b){if(this._isTouchActive){this.set("isActive",NO)}this._isTouchActive=false;
var a,c,d,e;if(b.changedTouches.length>0){e=b.changedTouches[0];c={x:e.pageX,y:e.pageY};
d=this.convertFrameToView(this.get("frame"),null);a=SC.pointInRect(c,d)}else{a=YES
}if(!b.cancel&&a&&this.get("isEnabled")){this._action(b)}return true},_action:function(a){console.log("action!");
var c=this.get("action");var d=this.get("target")||null;var e=this.get("pane");var b=e?e.get("rootResponder"):null;
if(b){b.sendAction(c,d,this,e)}}});if((typeof SC!=="undefined")&&SC&&SC.bundleDidLoad){SC.bundleDidLoad("sproutcore/mobile")
};