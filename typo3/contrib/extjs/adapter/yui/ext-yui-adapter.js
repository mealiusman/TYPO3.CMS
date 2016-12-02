/*
 This file is part of Ext JS 3.4

 Copyright (c) 2011-2013 Sencha Inc

 Contact:  http://www.sencha.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://www.sencha.com/contact.

 Build date: 2015-03-04 21:15:25
 */
window.undefined=window.undefined;Ext={version:"3.4.1.1",versionDetail:{major:3,minor:4,patch:1.1}};Ext.apply=function(d,e,b){if(b){Ext.apply(d,b)}if(d&&e&&typeof e=="object"){for(var a in e){d[a]=e[a]}}return d};(function(){var h=0,f=Object.prototype.toString,A=navigator.userAgent.toLowerCase(),o=function(e){return e.test(A)},u=document,r=u.documentMode,v=u.compatMode=="CSS1Compat",z=o(/edge/),a=!z&&o(/opera/),J=!z&&o(/\bchrome\b/),B=!z&&o(/webkit/),d=!z&&!J&&o(/safari/),H=d&&o(/applewebkit\/4/),F=d&&o(/version\/3/),D=d&&o(/version\/4/),k=!a&&(o(/msie/)||o(/trident/)),I=k&&((o(/msie 7/)&&r!=8&&r!=9&&r!=10)||r==7),G=k&&((o(/msie 8/)&&r!=7&&r!=9&&r!=10)||r==8),E=k&&((o(/msie 9/)&&r!=7&&r!=8&&r!=10)||r==9),j=k&&((o(/msie 10/)&&r!=7&&r!=8&&r!=9)||r==10),g=k&&((o(/trident\/7\.0/)&&r!=7&&r!=8&&r!=9&&r!=10)||r==11),L=k&&o(/msie 6/),M=k&&(L||I||G||E),c=!z&&!B&&o(/gecko/)&&!o(/trident/),O=c&&o(/rv:1\.8/),N=c&&o(/rv:1\.9/),n=M&&!v,i=o(/windows|win32/),C=o(/macintosh|mac os x/),q=o(/adobeair/),w=o(/linux/),s=/^https/i.test(window.location.protocol),b=[],x=[],p=Ext.emptyFn,y=Ext.apply({},{constructor:p,toString:p,valueOf:p}),m=function(){var e=m.caller.caller;return e.$owner.prototype[e.$name].apply(this,arguments)};if(y.constructor!==p){x.push("constructor")}if(y.toString!==p){x.push("toString")}if(y.valueOf!==p){x.push("valueOf")}if(!x.length){x=null}function l(){}Ext.apply(l,{$isClass:true,callParent:function(e){var t;return(t=this.callParent.caller)&&(t.$previous||((t=t.$owner?t:t.caller)&&t.$owner.superclass.self[t.$name])).apply(this,e||b)}});l.prototype={constructor:function(){},callParent:function(t){var P,e=(P=this.callParent.caller)&&(P.$previous||((P=P.$owner?P:P.caller)&&P.$owner.superclass[P.$name]));return e.apply(this,t||b)}};if(L){try{u.execCommand("BackgroundImageCache",false,true)}catch(K){}}Ext.apply(Ext,{SSL_SECURE_URL:s&&k?'javascript:""':"about:blank",isStrict:v,isSecure:s,isReady:false,enableForcedBoxModel:false,enableGarbageCollector:true,enableListenerCollection:false,enableNestedListenerRemoval:false,USE_NATIVE_JSON:false,applyIf:function(t,P){if(t){for(var e in P){if(!Ext.isDefined(t[e])){t[e]=P[e]}}}return t},id:function(e,t){e=Ext.getDom(e,true)||{};if(!e.id){e.id=(t||"ext-gen")+(++h)}return e.id},extend:function(){var t=function(Q){for(var P in Q){this[P]=Q[P]}};var e=Object.prototype.constructor;return function(U,R,T){if(typeof R=="object"){T=R;R=U;U=T.constructor!=e?T.constructor:function(){R.apply(this,arguments)}}var Q=function(){},S,P=R.prototype;Q.prototype=P;S=U.prototype=new Q();S.constructor=U;U.superclass=P;if(P.constructor==e){P.constructor=R}U.override=function(V){Ext.override(U,V)};S.superclass=S.supr=(function(){return P});S.override=t;Ext.override(U,T);U.extend=function(V){return Ext.extend(U,V)};return U}}(),global:(function(){return this})(),Base:l,namespaceCache:{},createNamespace:function(T,Q){var e=Ext.namespaceCache,R=Q?T.substring(0,T.lastIndexOf(".")):T,W=e[R],U,P,t,S,V;if(!W){W=Ext.global;if(R){V=[];S=R.split(".");for(U=0,P=S.length;U<P;++U){t=S[U];W=W[t]||(W[t]={});V.push(t);e[V.join(".")]=W}}}return W},getClassByName:function(P){var Q=P.split("."),e=Ext.global,R=Q.length,t;for(t=0;e&&t<R;++t){e=e[Q[t]]}return e||null},addMembers:function(t,S,P,e){var R,Q,T;for(Q in P){if(P.hasOwnProperty(Q)){T=P[Q];if(typeof T=="function"){T.$owner=t;T.$name=Q}S[Q]=T}}if(e&&x){for(R=x.length;R-->0;){Q=x[R];if(P.hasOwnProperty(Q)){T=P[Q];if(typeof T=="function"){T.$owner=t;T.$name=Q}S[Q]=T}}}},define:function(T,R,P){var t=R.override,V,S,e,Q;if(t){delete R.override;V=Ext.getClassByName(t);Ext.override(V,R)}else{if(T){Q=Ext.createNamespace(T,true);e=T.substring(T.lastIndexOf(".")+1)}V=function U(){this.constructor.apply(this,arguments)};if(T){V.displayName=T}V.$isClass=true;V.callParent=Ext.Base.callParent;if(typeof R=="function"){R=R(V)}S=R.extend;if(S){delete R.extend;if(typeof S=="string"){S=Ext.getClassByName(S)}}else{S=l}Ext.extend(V,S,R);if(V.prototype.constructor===V){delete V.prototype.constructor}if(!V.prototype.$isClass){Ext.applyIf(V.prototype,l.prototype)}V.prototype.self=V;if(R.xtype){Ext.reg(R.xtype,V)}V=R.singleton?new V():V;if(T){Q[e]=V}}if(P){P.call(V)}return V},override:function(R,T){var P,S;if(T){if(R.$isClass){S=T.statics;if(S){delete T.statics}Ext.addMembers(R,R.prototype,T,true);if(S){Ext.addMembers(R,R,S)}}else{if(typeof R=="function"){P=R.prototype;Ext.apply(P,T);if(Ext.isIE&&T.hasOwnProperty("toString")){P.toString=T.toString}}else{var e=R.self,t,Q;if(e&&e.$isClass){for(t in T){if(T.hasOwnProperty(t)){Q=T[t];if(typeof Q=="function"){if(e.$className){Q.displayName=e.$className+"#"+t}Q.$name=t;Q.$owner=e;Q.$previous=R.hasOwnProperty(t)?R[t]:m}R[t]=Q}}}else{Ext.apply(R,T);if(!R.constructor.$isClass){R.constructor.prototype.callParent=l.prototype.callParent;R.constructor.callParent=l.callParent}}}}}},namespace:function(){var Q=arguments.length,R=0,t,P,e,T,S,U;for(;R<Q;++R){e=arguments[R];T=arguments[R].split(".");U=window[T[0]];if(U===undefined){U=window[T[0]]={}}S=T.slice(1);t=S.length;for(P=0;P<t;++P){U=U[S[P]]=U[S[P]]||{}}}return U},urlEncode:function(S,R){var P,t=[],Q=encodeURIComponent;Ext.iterate(S,function(e,T){P=Ext.isEmpty(T);Ext.each(P?e:T,function(U){t.push("&",Q(e),"=",(!Ext.isEmpty(U)&&(U!=e||!P))?(Ext.isDate(U)?Ext.encode(U).replace(/"/g,""):Q(U)):"")})});if(!R){t.shift();R=""}return R+t.join("")},urlDecode:function(P,t){if(Ext.isEmpty(P)){return{}}var S={},R=P.split("&"),T=decodeURIComponent,e,Q;Ext.each(R,function(U){U=U.split("=");e=T(U[0]);Q=T(U[1]);S[e]=t||!S[e]?Q:[].concat(S[e]).concat(Q)});return S},urlAppend:function(e,t){if(!Ext.isEmpty(t)){return e+(e.indexOf("?")===-1?"?":"&")+t}return e},toArray:function(){return k?function(P,S,Q,R){R=[];for(var t=0,e=P.length;t<e;t++){R.push(P[t])}return R.slice(S||0,Q||R.length)}:function(e,P,t){return Array.prototype.slice.call(e,P||0,t||e.length)}}(),isIterable:function(e){if(Ext.isArray(e)||e.callee){return true}if(/NodeList|HTMLCollection/.test(f.call(e))){return true}return((typeof e.nextNode!="undefined"||e.item)&&Ext.isNumber(e.length))},each:function(R,Q,P){if(Ext.isEmpty(R,true)){return}if(!Ext.isIterable(R)||Ext.isPrimitive(R)){R=[R]}for(var t=0,e=R.length;t<e;t++){if(Q.call(P||R[t],R[t],t,R)===false){return t}}},iterate:function(P,t,e){if(Ext.isEmpty(P)){return}if(Ext.isIterable(P)){Ext.each(P,t,e);return}else{if(typeof P=="object"){for(var Q in P){if(P.hasOwnProperty(Q)){if(t.call(e||P,Q,P[Q],P)===false){return}}}}}},getDom:function(P,t){if(!P||!u){return null}if(P.dom){return P.dom}else{if(typeof P=="string"){var Q=u.getElementById(P);if(Q&&k&&t){if(P==Q.getAttribute("id")){return Q}else{return null}}return Q}else{return P}}},getBody:function(){return Ext.get(u.body||u.documentElement)},getHead:function(){var e;return function(){if(e==undefined){e=Ext.get(u.getElementsByTagName("head")[0])}return e}}(),removeNode:k&&!G?function(){var e;return function(t){if(t&&t.tagName!="BODY"){(Ext.enableNestedListenerRemoval)?Ext.EventManager.purgeElement(t,true):Ext.EventManager.removeAll(t);e=e||u.createElement("div");e.appendChild(t);e.innerHTML="";delete Ext.elCache[t.id]}}}():function(e){if(e&&e.parentNode&&e.tagName!="BODY"){(Ext.enableNestedListenerRemoval)?Ext.EventManager.purgeElement(e,true):Ext.EventManager.removeAll(e);e.parentNode.removeChild(e);delete Ext.elCache[e.id]}},isEmpty:function(t,e){return t===null||t===undefined||((Ext.isArray(t)&&!t.length))||(!e?t==="":false)},isArray:function(e){return f.apply(e)==="[object Array]"},isDate:function(e){return f.apply(e)==="[object Date]"},isObject:function(e){return !!e&&Object.prototype.toString.call(e)==="[object Object]"},isPrimitive:function(e){return Ext.isString(e)||Ext.isNumber(e)||Ext.isBoolean(e)},isFunction:function(e){return f.apply(e)==="[object Function]"},isNumber:function(e){return typeof e==="number"&&isFinite(e)},isString:function(e){return typeof e==="string"},isBoolean:function(e){return typeof e==="boolean"},isElement:function(e){return e?!!e.tagName:false},isDefined:function(e){return typeof e!=="undefined"},isOpera:a,isWebKit:B,isChrome:J,isSafari:d,isSafari3:F,isSafari4:D,isSafari2:H,isEdge:z,isIE:k,isIE6:L,isIE7:I,isIE8:G,isIE9:E,isIE10:j,isIE11:g,isIE9m:M,isIE10p:k&&!(L||I||G||E),isIEQuirks:k&&(!v&&(L||I||G||E)),isGecko:c,isGecko2:O,isGecko3:N,isBorderBox:n,isLinux:w,isWindows:i,isMac:C,isAir:q});Ext.ns=Ext.namespace})();Ext.ns("Ext.util","Ext.lib","Ext.data","Ext.supports");Ext.elCache={};Ext.apply(Function.prototype,{createInterceptor:function(b,a){var c=this;return !Ext.isFunction(b)?this:function(){var e=this,d=arguments;b.target=e;b.method=c;return(b.apply(a||e||window,d)!==false)?c.apply(e||window,d):null}},createCallback:function(){var a=arguments,b=this;return function(){return b.apply(window,a)}},createDelegate:function(c,b,a){var d=this;return function(){var f=b||arguments;if(a===true){f=Array.prototype.slice.call(arguments,0);f=f.concat(b)}else{if(Ext.isNumber(a)){f=Array.prototype.slice.call(arguments,0);var e=[a,0].concat(b);Array.prototype.splice.apply(f,e)}}return d.apply(c||window,f)}},defer:function(c,e,b,a){var d=this.createDelegate(e,b,a);if(c>0){return setTimeout(d,c)}d();return 0}});Ext.applyIf(String,{format:function(b){var a=Ext.toArray(arguments,1);return b.replace(/\{(\d+)\}/g,function(c,d){return a[d]})}});Ext.applyIf(Array.prototype,{indexOf:function(b,c){var a=this.length;c=c||0;c+=(c<0)?a:0;for(;c<a;++c){if(this[c]===b){return c}}return -1},remove:function(b){var a=this.indexOf(b);if(a!=-1){this.splice(a,1)}return this}});Ext.util.TaskRunner=function(e){e=e||10;var f=[],a=[],b=0,g=false,d=function(){g=false;clearInterval(b);b=0},h=function(){if(!g){g=true;b=setInterval(i,e)}},c=function(j){a.push(j);if(j.onStop){j.onStop.apply(j.scope||j)}},i=function(){var l=a.length,n=new Date().getTime();if(l>0){for(var p=0;p<l;p++){f.remove(a[p])}a=[];if(f.length<1){d();return}}for(var p=0,o,k,m,j=f.length;p<j;++p){o=f[p];k=n-o.taskRunTime;if(o.interval<=k){m=o.run.apply(o.scope||o,o.args||[++o.taskRunCount]);o.taskRunTime=n;if(m===false||o.taskRunCount===o.repeat){c(o);return}}if(o.duration&&o.duration<=(n-o.taskStartTime)){c(o)}}};this.start=function(j){f.push(j);j.taskStartTime=new Date().getTime();j.taskRunTime=0;j.taskRunCount=0;h();return j};this.stop=function(j){c(j);return j};this.stopAll=function(){d();for(var k=0,j=f.length;k<j;k++){if(f[k].onStop){f[k].onStop()}}f=[];a=[]}};Ext.TaskMgr=new Ext.util.TaskRunner();if(typeof YAHOO=="undefined"){throw"Unable to load Ext, core YUI utilities (yahoo, dom, event) not found."}(function(){var m=YAHOO.util.Event,b=YAHOO.util.Dom,f=YAHOO.util.Connect,h=YAHOO.util.Easing,c=YAHOO.util.Anim,j,k=YAHOO.env.getVersion("yahoo").version.split("."),a=parseInt(k[0],10)>=3,l={},e=function(n,o){if(n&&n.firstChild){while(o){if(o===n){return true}o=o.parentNode;if(o&&(o.nodeType!=1)){o=null}}}return false},i=function(n){return !e(n.currentTarget,Ext.lib.Event.getRelatedTarget(n))};Ext.lib.Dom={getViewWidth:function(n){return n?b.getDocumentWidth():b.getViewportWidth()},getViewHeight:function(n){return n?b.getDocumentHeight():b.getViewportHeight()},isAncestor:function(n,o){return b.isAncestor(n,o)},getRegion:function(n){return b.getRegion(n)},getY:function(n){return this.getXY(n)[1]},getX:function(n){return this.getXY(n)[0]},getXY:function(q){var o,u,w,z,t=(document.body||document.documentElement);q=Ext.getDom(q);if(q==t){return[0,0]}if(q.getBoundingClientRect){w=q.getBoundingClientRect();z=g(document).getScroll();return[Math.round(w.left+z.left),Math.round(w.top+z.top)]}var A=0,v=0;o=q;var n=g(q).getStyle("position")=="absolute";while(o){A+=o.offsetLeft;v+=o.offsetTop;if(!n&&g(o).getStyle("position")=="absolute"){n=true}if(Ext.isGecko){u=g(o);var B=parseInt(u.getStyle("borderTopWidth"),10)||0;var r=parseInt(u.getStyle("borderLeftWidth"),10)||0;A+=r;v+=B;if(o!=q&&u.getStyle("overflow")!="visible"){A+=r;v+=B}}o=o.offsetParent}if(Ext.isSafari&&n){A-=t.offsetLeft;v-=t.offsetTop}if(Ext.isGecko&&!n){var s=g(t);A+=parseInt(s.getStyle("borderLeftWidth"),10)||0;v+=parseInt(s.getStyle("borderTopWidth"),10)||0}o=q.parentNode;while(o&&o!=t){if(!Ext.isOpera||(o.tagName!="TR"&&g(o).getStyle("display")!="inline")){A-=o.scrollLeft;v-=o.scrollTop}o=o.parentNode}return[A,v]},setXY:function(n,o){n=Ext.fly(n,"_setXY");n.position();var p=n.translatePoints(o);if(o[0]!==false){n.dom.style.left=p.left+"px"}if(o[1]!==false){n.dom.style.top=p.top+"px"}},setX:function(o,n){this.setXY(o,[n,false])},setY:function(n,o){this.setXY(n,[false,o])}};Ext.lib.Event={getPageX:function(n){return m.getPageX(n.browserEvent||n)},getPageY:function(n){return m.getPageY(n.browserEvent||n)},getXY:function(n){return m.getXY(n.browserEvent||n)},getTarget:function(n){return m.getTarget(n.browserEvent||n)},getRelatedTarget:function(n){return m.getRelatedTarget(n.browserEvent||n)},on:function(r,n,q,p,o){if((n=="mouseenter"||n=="mouseleave")&&!a){var s=l[r.id]||(l[r.id]={});s[n]=q;q=q.createInterceptor(i);n=(n=="mouseenter")?"mouseover":"mouseout"}m.on(r,n,q,p,o)},un:function(p,n,o){if((n=="mouseenter"||n=="mouseleave")&&!a){var r=l[p.id],q=r&&r[n];if(q){o=q.fn;delete r[n];n=(n=="mouseenter")?"mouseover":"mouseout"}}m.removeListener(p,n,o)},purgeElement:function(n){m.purgeElement(n)},preventDefault:function(n){m.preventDefault(n.browserEvent||n)},stopPropagation:function(n){m.stopPropagation(n.browserEvent||n)},stopEvent:function(n){m.stopEvent(n.browserEvent||n)},onAvailable:function(q,p,o,n){return m.onAvailable(q,p,o,n)}};Ext.lib.Ajax={request:function(t,r,n,s,o){if(o){var p=o.headers;if(p){for(var q in p){if(p.hasOwnProperty(q)){f.initHeader(q,p[q],false)}}}if(o.xmlData){if(!p||!p["Content-Type"]){f.initHeader("Content-Type","text/xml",false)}t=(t?t:(o.method?o.method:"POST"));s=o.xmlData}else{if(o.jsonData){if(!p||!p["Content-Type"]){f.initHeader("Content-Type","application/json",false)}t=(t?t:(o.method?o.method:"POST"));s=typeof o.jsonData=="object"?Ext.encode(o.jsonData):o.jsonData}}}return f.asyncRequest(t,r,n,s)},formRequest:function(r,q,o,s,n,p){f.setForm(r,n,p);return f.asyncRequest(Ext.getDom(r).method||"POST",q,o,s)},isCallInProgress:function(n){return f.isCallInProgress(n)},abort:function(n){return f.abort(n)},serializeForm:function(n){var o=f.setForm(n.dom||n);f.resetFormState();return o}};Ext.lib.Region=YAHOO.util.Region;Ext.lib.Point=YAHOO.util.Point;Ext.lib.Anim={scroll:function(q,o,r,s,n,p){this.run(q,o,r,s,n,p,YAHOO.util.Scroll)},motion:function(q,o,r,s,n,p){this.run(q,o,r,s,n,p,YAHOO.util.Motion)},color:function(q,o,r,s,n,p){this.run(q,o,r,s,n,p,YAHOO.util.ColorAnim)},run:function(r,o,t,u,n,q,p){p=p||YAHOO.util.Anim;if(typeof u=="string"){u=YAHOO.util.Easing[u]}var s=new p(r,o,t,u);s.animateX(function(){Ext.callback(n,q)});return s}};function g(n){if(!j){j=new Ext.Element.Flyweight()}j.dom=n;return j}if(Ext.isIE){function d(){var n=Function.prototype;delete n.createSequence;delete n.defer;delete n.createDelegate;delete n.createCallback;delete n.createInterceptor;window.detachEvent("onunload",d)}window.attachEvent("onunload",d)}if(YAHOO.util.Anim){YAHOO.util.Anim.prototype.animateX=function(p,n){var o=function(){this.onComplete.unsubscribe(o);if(typeof p=="function"){p.call(n||this,this)}};this.onComplete.subscribe(o,this,true);this.animate()}}if(YAHOO.util.DragDrop&&Ext.dd.DragDrop){YAHOO.util.DragDrop.defaultPadding=Ext.dd.DragDrop.defaultPadding;YAHOO.util.DragDrop.constrainTo=Ext.dd.DragDrop.constrainTo}YAHOO.util.Dom.getXY=function(n){var o=function(p){return Ext.lib.Dom.getXY(p)};return YAHOO.util.Dom.batch(n,o,YAHOO.util.Dom,true)};if(YAHOO.util.AnimMgr){YAHOO.util.AnimMgr.fps=1000}YAHOO.util.Region.prototype.adjust=function(p,o,n,q){this.top+=p;this.left+=o;this.right+=q;this.bottom+=n;return this};YAHOO.util.Region.prototype.constrainTo=function(n){this.top=this.top.constrain(n.top,n.bottom);this.bottom=this.bottom.constrain(n.top,n.bottom);this.left=this.left.constrain(n.left,n.right);this.right=this.right.constrain(n.left,n.right);return this}})();