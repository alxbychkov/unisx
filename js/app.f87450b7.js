(function(t){function e(e){for(var r,a,c=e[0],i=e[1],u=e[2],l=0,f=[];l<c.length;l++)a=c[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r]);p&&p(e);while(f.length)f.shift()();return s.push.apply(s,u||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],r=!0,a=1;a<n.length;a++){var c=n[a];0!==o[c]&&(r=!1)}r&&(s.splice(e--,1),t=i(i.s=n[0]))}return t}var r={},a={app:0},o={app:0},s=[];function c(t){return i.p+"js/"+({}[t]||t)+"."+{"chunk-1bdab829":"3511fefa","chunk-388a79a3":"77f45fcb"}[t]+".js"}function i(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(t){var e=[],n={"chunk-1bdab829":1};a[t]?e.push(a[t]):0!==a[t]&&n[t]&&e.push(a[t]=new Promise((function(e,n){for(var r="css/"+({}[t]||t)+"."+{"chunk-1bdab829":"13c92cdf","chunk-388a79a3":"31d6cfe0"}[t]+".css",o=i.p+r,s=document.getElementsByTagName("link"),c=0;c<s.length;c++){var u=s[c],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===r||l===o))return e()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){u=f[c],l=u.getAttribute("data-href");if(l===r||l===o)return e()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=e,p.onerror=function(e){var r=e&&e.target&&e.target.src||o,s=new Error("Loading CSS chunk "+t+" failed.\n("+r+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=r,delete a[t],p.parentNode.removeChild(p),n(s)},p.href=o;var m=document.getElementsByTagName("head")[0];m.appendChild(p)})).then((function(){a[t]=0})));var r=o[t];if(0!==r)if(r)e.push(r[2]);else{var s=new Promise((function(e,n){r=o[t]=[e,n]}));e.push(r[2]=s);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=c(t);var f=new Error;u=function(e){l.onerror=l.onload=null,clearTimeout(p);var n=o[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),a=e&&e.target&&e.target.src;f.message="Loading chunk "+t+" failed.\n("+r+": "+a+")",f.name="ChunkLoadError",f.type=r,f.request=a,n[1](f)}o[t]=void 0}};var p=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(e)},i.m=t,i.c=r,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/unisx/",i.oe=function(t){throw console.error(t),t};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=e,u=u.slice();for(var f=0;f<u.length;f++)e(u[f]);var p=l;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"391a":function(t,e,n){t.exports=n.p+"img/soc4.75b6ea0c.svg"},"4ffd":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAnwSURBVHgBpVh7jJVHFT8z8317793nBXaBte1yQQIUaKBUbUgaSolJQxNLNTFqjAFjYtKosfGVGKPLamwbEq2Pf9Q/bNU0RPmjVMQYK2AbDIr1Eai2Qlu2yLLrdtkXe3fvvd9jPGfmzJ1v7z5YyiRz7/eYx29+53fOnPkE3ELRWuem//3k5tyqe7aJiVc6oKmrKJuaIK6Wy0GheKUyVR3Klx74qxCry3ALRcBNFj12qhiNv3kgCOQ+oWvbAeIigKQ3OJrIDEv3En8VCJU7DUl4uNKy8beFZXf3w02WJYPUYyfWwMQbXwSIPgEpAdMWiGpyLcCAlYIozgDWPA1Wmcca/AzC9idF58OvLXXuG4JEkwZw5dmvQ3Xkq6Dj0E4uLAhTMyya68w7x6gDq3khKoQUCs/Ulm/uKxRuzKxYHODEehj9+69h/F93QjLDPTIg6/c0twMIHmz9+QJF5vuhfd1+0Xb/S/BOQGo9tgcgeQ4v2yFNACYvAoz8DSCt2G40uSHKMQcZdpUfXjg2+Zr6EaM6te0kyqVlw9dE8b7HbwokAnyEAWYfohyvA1w9AVAZ8RPCAkzWGVbgzZ5ZEIBXgsxBrDr7wu59B5cEUuuR9+HfH7C2zW2Oo6bIwOWjADMjHoRkUDoLNgPGOJRkGbiZWcOGUQsUChsfFcvv+9GiIJHBEqI4hVclWKxE0wBv/grJrliQxLIDIYUH5nwn61DQ6GhuYViDlgRyPTvE8l3nstM1qDr9Lq6sZDXjvHGeogoAq+6174lZwzDqNomwJvZZGvMYYO+JMfOfOEa8NpPYLjaZURANHTERZT4m0cwHYOrK0/BfdLSpATvJsvUAPe8HyC+bC5QGf+MImn2YTa7Y5Ky9LLM6w6hjz8mBHE8FXsM0buu7D4oVe/vmghz7yyU4/0wJamjKIPATE8BNHwdoXgl1x3Bl6Aw60mls38Qg2azmmtlyz+sadf/Se750xGnr8aowCbfvWSPE2nFuCVAbPH4Azv28BNUpu5I4sjWqIlOjAJd+07AkOx4UN1pTkZnjmq1kgTSy5nfmbC0BdKI/tq61zJnNKrF9NUuFKjjzT7fDeP/n3VQGpLhw/JNwfch2MlpKWWMEACcexRhZHgBoFEoOWc518KJqFixNnjJw6t+F4Lox5Ba3oI53A9zxAeyoWMu8WreglOfF/2TstcdQm5bzmX88VQqqlV0Q44DTmKxEjpHEgqX7Gnrx2OswpxgThh4gga1VbR8CGDQDLN+WsQICaSqS5rwFjDMxg/X/BJRMijB++n7LZP8Lu2FsEAdm6glsFSepTFtwNEiClaQwX8kv9x6qyRLYN6pYoGGhIV5y6CENOgej+YwFmRSKDlTjKsTjF/ZRryCv8jshLUM9UGu3i9Cq0SF01Q5MA81XzMIiv0cbEMICjmLfJsu+YYzMyhTTdE6XJu7SvUb/FXcbkBAlW6wewCo0SX1wplW6XSRNFgDJ8ZH6kxcHOXsd0GBpA0BeCI1FEiFGBQdyF+TdovB5Gl/fZkEmyR1mxbT6zm5r1mrVshpnmFmISTMhMymIIbcLYf+wFWbt2fWFsTyQLQhCS4zbTrWsA5Ugi1oPrQzSKO6RCVN/bdB3kLyvApsnXoBJYsSInU0MzHprF8qlLZNXNiyMQAreiYTwOYC5Z2YjkmFaQKPQSqZYK8yo29qU8l4JC2yRxqkqdgLaBATquB0Df64dYOKyB6izWFMbSw0BygZws1DlHYsWYDQ9DkFamQJJLJGGEs6cqWHKe61ZIWTiWqO5tR2MQLagp7evtiYcQ4Btt/l2bgeyKY8fj/5FYvvT9mgyd8gkKkUIRHn0LVz9GkhcQqoynspJQIL3tclGOmzJt7NesV8OzUvb6tW3rFU6t85u6zy7NmNDlEvxpAvu7L3kjGTyHGl6ekbqju5Jo7cahQw0wQw6TaXmvTm1IUYPX7S6ayxrdqHWpXWeQWxzFc9XcQXnwfFKe+a2p0VOXDJx0Gy7KcfJmOc30cJuKHg5LsT6YSmT6hljLhNEOXCbgI4dKtV6rBNIOFQn587Zsgpg52cwYV1mgZJkmloAtn8M33XPbU8Ml4fZwyPLKIF1Dhg7LDUQQe4V6hIg3WcQ2KfrmjHZsvDHUkUxlDSkQF/8HYitH24IJxrEu94LsBrj7ugF+6y9BxXUOg9ArANnAa7/z5pYsZk1gg1zll13PgrzaPymly1IOXUsVQJkxGFIphZUPaPWvE3h85cxf9z4EA7Q4jVWP8ug6Ds3w4LF7CII4j/P2/2d+lE0CPjcnnIEIa/HIy/UpqAG8TEztNh/9prQlT/aoBzbeGj+eR+NGCA+F9fxIHbyO7Bgxr5owT7nDqPXX/WyMj4wbc1NDAYFMOwQlqCtv7D1yycNSEMI5B63L9NM5Y0+YuApX7/6JwR6iOddAljN7c49C/D6CfssjjOVMifU49QYHpvf5uQkgjQs/MQNYWPNV75xMs03D9fTJgdUp8wse38tsgP/8wWAI59DB3ibger50dHjCibNLz6BII9B3UFdWpbw+CbWshPRHEFztbZq52E3kk+ifrj7ET1y+TkBmdOeEjDr8E8l4POIwvch1i0PAqx9D+jODSDaVtmxpoZBjGGYGThv2SNgUvgtUvLY9WOuc1Jlx+3edFDce6hvDkhjhW+uO65i/VD9EInBXLe1gJiOOJ3S3lmU9F8x6D4fspaCzFkH/5sCHzWUGzfTj4BJf2bXbR39Yu8Td+L5pjLb3FzUpns+hbnHgDF1M2bVXbjFdd7mjwLOtCmbicwXsRxmyFz4jhZE11WWRrnC7SIrGSefhCXldE8SCFrKom3jg1mAc5g0purt3KELt5+FnnVKlOmzymUbaEU2LMHso6kzpRT+aKsyh//AZVV4HSp/mlQuoaBXKYie7Y+JB37w/UZM8+xziOnoow/Ly+d/KQb787NM50xU/6SiZuvVgFUZUzpzZr5UBMovyIFEicQdHQfDDx7tmw/PvCCpVL59196m8sQvRJquMGZ2A9bP0MIzCY5FCmMMmgASoELBbq+uT8AalFajGnUvVq7+gvjQ808thGVBkFR07+pSGslTUgelemrlMhdnfpn5gma2Vv5qoZhpdDyY5kzfOQq1Q7A6Fw4kpc0fDff+9PRiOORiL0XfUP/V7R/ZjPnet3QgfQKs/fm4Hujdtx7g7z0xJwsTk3xMjnmnidEw+L7Q/LSo/HnrjQC6tS+p6N5NJbRbb1KtHFDA+63JNzOO47SWas+w8no0h5HW8DjiPBR+6fxLS517ySBdGezNl7qiFbvR3PulVDtElLT7kaS1TSYSpIoOVPrFOI1/H3Rt+LH47IlrcJPlpkFmi+7dHUTphbtCEa6LIO5RcdROdCVNuclQpaMzqXi1MHHlgvgejMMtlP8DuOn+fpYGr8kAAAAASUVORK5CYII="},5489:function(t,e,n){t.exports=n.p+"img/soc1.19de6c88.svg"},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Header"),n("keep-alive",[n("router-view")],1),n("Footer")],1)},o=[],s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",[n("div",{staticClass:"container"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-12"},[n("div",{staticClass:"head_flex"},[t._m(0),n("div",{staticClass:"top_list_wrp_all"},[n("ul",{staticClass:"top_list"},[n("router-link",{attrs:{to:{name:"Home"},tag:"li","active-class":"active",exact:""}},[n("a",{attrs:{href:""}},[t._v("home")])]),n("router-link",{attrs:{to:{name:"Actions"},tag:"li","active-class":"active"}},[n("a",{attrs:{href:""}},[t._v("operations")])]),t._m(1),t._m(2)],1)]),t._m(3)])])])])])},c=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("a",{staticClass:"logo",attrs:{href:""}},[r("img",{attrs:{src:n("4ffd"),alt:""}}),r("span",[t._v("Universal Synthetics")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",[n("a",{attrs:{href:""}},[t._v("Doc")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",[n("a",{attrs:{href:""}},[t._v("About")])])},function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"open_nav"},[r("img",{attrs:{src:n("869f"),alt:""}})])}],i={name:"Header"},u=i,l=n("2877"),f=Object(l["a"])(u,s,c,!1,null,null,null),p=f.exports,m=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},d=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("footer",[r("div",{staticClass:"container"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-md-12"},[r("div",{staticClass:"footer_wrp"},[r("div",{staticClass:"row flex center"},[r("div",{staticClass:"col-md-4 col-sm-4 col-xs-12"},[r("a",{staticClass:"logo",attrs:{href:""}},[r("img",{attrs:{src:n("4ffd"),alt:""}}),r("span",[t._v("© 2021 Universal Synthetix")])])]),r("div",{staticClass:"col-md-8 col-sm-8 col-xs-12"},[r("div",{staticClass:"foot_flex"},[r("ul",{staticClass:"soc_list"},[r("li",[r("a",{attrs:{href:""}},[r("img",{attrs:{src:n("5489"),alt:""}})])]),r("li",[r("a",{attrs:{href:""}},[r("img",{attrs:{src:n("e41f"),alt:""}})])]),r("li",[r("a",{attrs:{href:""}},[r("img",{attrs:{src:n("dca5"),alt:""}})])]),r("li",[r("a",{attrs:{href:""}},[r("img",{attrs:{src:n("391a"),alt:""}})])])]),r("ul",{staticClass:"top_list"},[r("li",{staticClass:"active"},[r("a",{attrs:{href:""}},[t._v("ABOUT UNISX")])]),r("li",[r("a",{attrs:{href:""}},[t._v("FAQ")])])])])])])])])])])])}],v={name:"Footer"},h=v,g=Object(l["a"])(h,m,d,!1,null,null,null),b=g.exports,A={name:"App",components:{Header:p,Footer:b}},E=A,w=Object(l["a"])(E,a,o,!1,null,null,null),O=w.exports,T=n("1da1"),j=(n("a9e3"),n("96cf"),n("2f62")),S=n("ce96");r["a"].use(j["a"]);var _=new j["a"].Store({state:{instruments:[],portfolio:[],userAccount:localStorage.getItem("userAccount")?localStorage.getItem("userAccount"):"",networkId:"",stablecoins:[],dexLP:[],defiTokens:[]},mutations:{SET_INSTRUMENTS:function(t,e){t.instruments=e},SET_PORTFOLIO:function(t,e){t.portfolio=e},SET_USER_ACCOUNT:function(t,e){t.userAccount=e},SET_NETWORK_ID:function(t,e){t.networkId=e},SET_STABLECOINS:function(t,e){t.stablecoins=e},SET_DEX_LP:function(t,e){t.dexLP=e},SET_DEFI_TOKENS:function(t,e){t.defiTokens=e}},actions:{GET_INSTRUMENTS_FROM_API:function(t){return Object(T["a"])(regeneratorRuntime.mark((function e(){var n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,e.next=3,Object(S["b"])("./static/json/unisx_instruments.json",n,"SET_INSTRUMENTS");case 3:return r=e.sent,e.next=6,Object(S["a"])(r);case 6:return e.abrupt("return",e.sent);case 7:case"end":return e.stop()}}),e)})))()},GET_PORTFOLIO_FROM_API:function(t){return Object(T["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,e.next=3,Object(S["b"])("./static/json/unisx_portfolio.json",n,"SET_PORTFOLIO");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))()},GET_STABLECOINS_FROM_API:function(t){return Object(T["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,e.next=3,Object(S["b"])("./static/json/stablecoins.json",n,"SET_STABLECOINS");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))()},GET_DEX_LP_FROM_API:function(t){return Object(T["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,e.next=3,Object(S["b"])("./static/json/dex_lp.json",n,"SET_DEX_LP");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))()},GET_DEFI_TOKENS_FROM_API:function(t){return Object(T["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,e.next=3,Object(S["b"])("./static/json/defi_tokens.json",n,"SET_DEFI_TOKENS");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))()},GET_USER_ACCOUNT:function(t,e){var n=t.commit;n("SET_USER_ACCOUNT",e)},GET_NETWORK_ID:function(t){var e,n=t.commit,r=Number(null===(e=window.ethereum)||void 0===e?void 0:e.chainId),a=[0,"Ethereum Main Network: ",2,"Ropsten Test Network: ","Rinkeby Test Network: ","Goerli Test Network: ",6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,"Kovan Test Network: "];n("SET_NETWORK_ID",a[r])}},getters:{INSTRUMENTS:function(t){return t.instruments},PORTFOLIO:function(t){return t.portfolio},USER_ACCOUNT:function(t){return t.userAccount},NETWORK_ID:function(t){return t.networkId},STABLECOINS:function(t){return t.stablecoins},DEX_LP:function(t){return t.dexLP},DEFI_TOKENS:function(t){return t.defiTokens}}}),y=_,x=(n("d3b7"),n("3ca3"),n("ddb0"),n("8c4f"));r["a"].use(x["a"]);var C=new x["a"]({routes:[{path:"/",name:"Home",component:function(){return n.e("chunk-388a79a3").then(n.bind(null,"bb51"))}},{path:"/actions",name:"Actions",component:function(){return n.e("chunk-1bdab829").then(n.bind(null,"a71b"))}}]}),I=C;r["a"].config.productionTip=!1,new r["a"]({render:function(t){return t(O)},store:y,router:I}).$mount("#app")},"869f":function(t,e,n){t.exports=n.p+"img/menu.d1922cd1.svg"},ce96:function(t,e,n){"use strict";n.d(e,"b",(function(){return c})),n.d(e,"a",(function(){return u})),n.d(e,"c",(function(){return f}));var r=n("53ca"),a=n("1da1"),o=(n("96cf"),n("caad"),n("b680"),n("bc3a")),s=n.n(o);function c(t){return i.apply(this,arguments)}function i(){return i=Object(a["a"])(regeneratorRuntime.mark((function t(e){var n,r,a=arguments;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=a.length>1&&void 0!==a[1]?a[1]:{},r=a.length>2&&void 0!==a[2]?a[2]:"",t.next=4,s()(e).then((function(t){return"{}"!==JSON.stringify(n)&&r&&n(r,t.data),t.data})).catch((function(t){return console.error(t),[]}));case 4:return t.abrupt("return",t.sent);case 5:case"end":return t.stop()}}),t)}))),i.apply(this,arguments)}function u(t){return l.apply(this,arguments)}function l(){return l=Object(a["a"])(regeneratorRuntime.mark((function t(e){var n,a,o,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if("object"===Object(r["a"])(e)||!e.length){t.next=2;break}return t.abrupt("return",!1);case 2:for(n=e.length,a=0;a<n;a++)s=(+e[a].Rewards/+(null===(o=e[a])||void 0===o?void 0:o.decimals)).toFixed(2),e[a].Price=s||0;return t.next=6,e;case 6:return t.abrupt("return",t.sent);case 7:case"end":return t.stop()}}),t)}))),l.apply(this,arguments)}function f(t,e){var n=[];if(t.length)for(var r=0;r<t.length;r++)n.includes(t[r][e])||n.push(t[r][e]);return n}},dca5:function(t,e,n){t.exports=n.p+"img/soc3.0c57ea20.svg"},e41f:function(t,e,n){t.exports=n.p+"img/soc2.a033c0da.svg"}});
//# sourceMappingURL=app.f87450b7.js.map