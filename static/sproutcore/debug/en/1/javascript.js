var SC=SC||{};SC._mapDisplayNamesUseHashForSeenTypes=["object","number","boolean","array","string","function","class","undefined","error"];
SC.mapDisplayNames=function(h,a,m,f,q){if(!SC.browser.safari){return}if(!SC._mapDisplayNamesUseHashForSeenTypesHash){var g=SC._mapDisplayNamesUseHashForSeenTypes;
var l={};var p=g.length;for(var o=0;o<p;++o){var c=g[o];l[c]=true}SC._mapDisplayNamesUseHashForSeenTypesHash=l
}if(h===undefined){h=window}if(a===undefined){a=0}if(m===undefined){m=[]}if(f===undefined){f={}
}if(q===undefined){q=[]}if(a>5){return}var d=!!SC._mapDisplayNamesUseHashForSeenTypesHash[SC.typeOf(h)];
var b;var k;if(d){b=SC.hashFor(h);k=f[b]}else{k=q}if(k&&k.indexOf(h)!==-1){return
}if(k){k.push(h)}else{if(d){f[b]=[h]}}var e=m.length,n,s,j;m[e]="";for(var r in h){if(h.hasOwnProperty&&!h.hasOwnProperty(r)){continue
}if(!isNaN(Number(r))){continue}if(r==="constructor"){continue}if(r==="superclass"){continue
}if(r==="document"){continue}s=h[r];if(r==="SproutCore"){r="SC"}j=SC.typeOf(s);if(j===SC.T_FUNCTION){if(!s.displayName){m[e]=r;
n=m.join(".").replace(".prototype.","#");s.displayName=n}if(s.prototype){m.push("prototype");
SC.mapDisplayNames(s.prototype,a+1,m,f,q);m.pop()}}else{if(j===SC.T_CLASS){m[e]=r;
SC.mapDisplayNames(s,a+1,m,f,q)}else{if((r.indexOf("_")!==0)&&(j===SC.T_OBJECT||j===SC.T_HASH)){m[e]=r;
SC.mapDisplayNames(s,a+1,m,f,q)}}}}m.pop()};if((typeof SC!=="undefined")&&SC&&SC.bundleDidLoad){SC.bundleDidLoad("sproutcore/debug")
};