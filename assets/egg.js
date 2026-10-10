/* Features menu + "A dolphin's hello" (triple-tap the logo, or press D). No libraries. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Features · Gnéithe menu ---------- */
var btn=$('#featBtn'),menu=$('#featMenu');
function closeMenu(){if(!menu||menu.hidden)return;menu.hidden=true;btn.setAttribute('aria-expanded','false')}
if(btn&&menu){
  document.body.appendChild(menu); /* escape the hero's overflow clipping */
  var place=function(){var r=btn.getBoundingClientRect();menu.style.top=(r.bottom+8)+'px';
    if(innerWidth>600){menu.style.right=Math.max(8,innerWidth-r.right)+'px';menu.style.left='auto'}else{menu.style.left='';menu.style.right=''}};
  addEventListener('resize',function(){if(!menu.hidden)place()});
  addEventListener('scroll',function(){closeMenu()},{passive:true});
  btn.addEventListener('click',function(e){e.stopPropagation();var open=menu.hidden;if(open)place();menu.hidden=!open;btn.setAttribute('aria-expanded',String(open));
    if(open){var a=menu.querySelector('a');a&&a.focus({preventScroll:true})}});
  document.addEventListener('click',function(e){if(!menu.hidden&&!menu.contains(e.target))closeMenu()});
  document.addEventListener('keydown',function(e){
    if(menu.hidden)return;
    var items=[].slice.call(menu.querySelectorAll('a')),i=items.indexOf(document.activeElement);
    if(e.key==='Escape'){closeMenu();btn.focus()}
    else if(e.key==='ArrowDown'){e.preventDefault();items[(i+1)%items.length].focus()}
    else if(e.key==='ArrowUp'){e.preventDefault();items[(i-1+items.length)%items.length].focus()}
    else if(e.key==='Tab'&&((e.shiftKey&&i===0)||(!e.shiftKey&&i===items.length-1))){closeMenu()}
  });
  menu.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var act=a.getAttribute('data-act');closeMenu();
    if(act==='egg'){e.preventDefault();setTimeout(startEgg,60)}
    else if(act==='theme'){e.preventDefault();var t=$('#themeBtn');t&&t.click()}});
}

/* ---------- A dolphin's hello: Dingle Bay, Co. Kerry ---------- */
var DINGLE=[52.1,-10.24], frame=$('#mapframe'), iframe=$('#liveMap'), toast=$('#toast');
var running=null;
function mapApi(){try{var w=iframe.contentWindow,m=w.PA_MAP;if(m&&m._container&&m._container.isConnected)return {w:w,m:m}}catch(e){}return null}
function ensureOutlook(cb){
  var api=mapApi();if(api){cb(api);return}
  try{var w=iframe.contentWindow;if(w&&w.location.hash.replace(/^#\/?/,'')!=='outlook'&&w.location.hash!==''){w.location.hash='#/outlook'}}catch(e){}
  var n=0,t=setInterval(function(){var a=mapApi();if(a||++n>40){clearInterval(t);cb(a)}},100);
}
var NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
/* original line-art dolphin, facing +x, about 74 px long */
var DOL_BODY='M40 2C37 .8 34 .2 32-.4 31-4 27-8.5 20-10.5 10-13-4-12.5-14-9-20-7-25-4.5-30-1.2-33-5-37-8-42-9.5-39-6-37.5-2.5-37 0-37.5 2.5-39 6-42 9.5-37 8-33 5-30 1.2-22 6-8 9.8 6 9.8 18 9.8 27 7 33 4.6 36 3.6 38 2.8 40 2Z',
    DOL_FIN='M6-12.2C4-16 0-20-6-23-4.5-19-4-15.5-5-11.8',
    DOL_FLIP='M16 7C14 11 10.5 14 6.5 15.5 8.5 12 9.5 9.5 9.5 8.2',
    FISH='M8 0C5-3.2 0-4-4-1.8L-8-4.2-7-0-8 4.2-4 1.8C0 4 5 3.2 8 0Z';
function startEgg(){
  if(running)return;
  if(!frame||!iframe){return}
  var r=frame.getBoundingClientRect();
  if(r.top<0||r.bottom>innerHeight){frame.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}
  ensureOutlook(function(api){run(api)});
}
function run(api){
  var st={api:api,t0:0,raf:0,timers:[],home:null};running=st;
  var layer=document.createElement('div');layer.className='egg-layer live';layer.setAttribute('aria-hidden','true');
  var svg=el('svg',{});layer.appendChild(svg);frame.appendChild(layer);st.layer=layer;
  var defs=el('defs',{},svg),cp=el('clipPath',{id:'eggAbove'},defs),cr=el('rect',{x:-2000,y:-2000,width:4000,height:2000},cp);
  var g=el('g',{},svg); /* translated to the Dingle point each frame */
  var pin=el('circle',{class:'pin',r:16,cx:0,cy:0},g);
  var lbl=el('text',{class:'lbl',x:0,y:34,'text-anchor':'middle'},g);lbl.textContent='Daingean Uí Chúis';
  var rips=el('g',{},g),drops=el('g',{},g),fishG=el('g',{'clip-path':'url(#eggAbove)'},g);
  var dolG=el('g',{'clip-path':'url(#eggAbove)'},g),dol=el('g',{class:'dol',opacity:0},dolG);
  el('path',{d:DOL_BODY},dol);el('path',{d:DOL_FIN},dol);el('path',{d:DOL_FLIP},dol);
  el('path',{class:'ln',d:'M40 2C36 3 32 3.4 28 2.4'},dol);el('circle',{cx:24.5,cy:-3.6,r:1.3,fill:'#0b4f5c',stroke:'none'},dol);
  var fish=[0,1,2].map(function(){var f=el('path',{class:'fish',d:FISH,opacity:0},fishG);return f});
  var ripples=[];
  function ripple(x,big){var e=el('ellipse',{class:'rip',cx:x,cy:0,rx:1,ry:.3},rips);ripples.push({e:e,x:x,t:performance.now(),big:big})}
  var dropL=[];
  function splash(x,dir){for(var i=0;i<6;i++){var c=el('circle',{class:'drop',r:1.6+Math.random()*1.2,cx:x,cy:0},drops);dropL.push({e:c,x:x,vx:(dir*0.4+(Math.random()-.5))*60,vy:-(70+Math.random()*60),t:performance.now()})}}
  /* jumps: [start ms, duration ms, from x, to x, height] */
  var S=Math.max(1.1,Math.min(1.5,frame.getBoundingClientRect().width/280));
  var J=[{s:400,d:1800,a:-80*S,b:80*S,h:84*S},{s:4700,d:1700,a:85*S,b:-70*S,h:72*S}];
  var F=[{s:2500,d:650,a:-34*S,b:-6*S,h:24*S,i:0},{s:2900,d:600,a:10*S,b:34*S,h:20*S,i:1},{s:3300,d:700,a:-12*S,b:16*S,h:28*S,i:2}];
  var fired={};
  function point(){try{var m=api.m,p=m.latLngToContainerPoint(DINGLE),mr=m._container.getBoundingClientRect();return [p.x+mr.left,p.y+mr.top]}catch(e){var b=frame.getBoundingClientRect();return [b.width/2,b.height/2]}}
  function arc(j,now){var k=(now-j.s)/j.d;if(k<0||k>1)return null;var x=j.a+(j.b-j.a)*k,y=-4*j.h*k*(1-k),dx=(j.b-j.a),dy=-4*j.h*(1-2*k);return {x:x,y:y,ang:Math.atan2(dy,dx)*180/Math.PI,k:k}}
  function frameFn(now){
    if(!st.t0)st.t0=now;var t=now-st.t0,P=point();
    g.setAttribute('transform','translate('+P[0].toFixed(1)+','+P[1].toFixed(1)+')');
    cr.setAttribute('y',-2000);cr.setAttribute('height',2000.5);
    pin.setAttribute('r',(16+3*Math.sin(t/500)).toFixed(1));
    var showing=false;
    J.forEach(function(j,ji){var a=arc(j,t);
      if(t>=j.s&&!fired['j'+ji]){fired['j'+ji]=1;ripple(j.a,1);splash(j.a,Math.sign(j.b-j.a))}
      if(t>=j.s+j.d&&!fired['k'+ji]){fired['k'+ji]=1;ripple(j.b,1);splash(j.b,Math.sign(j.b-j.a))}
      if(a){showing=true;var flip=j.b<j.a;dol.setAttribute('opacity',1);
        dol.setAttribute('transform','translate('+a.x.toFixed(1)+','+a.y.toFixed(1)+') rotate('+(flip?a.ang-180:a.ang).toFixed(1)+')'+(flip?' scale(-'+S+','+S+')':' scale('+S+')'))}});
    if(!showing)dol.setAttribute('opacity',0);
    F.forEach(function(f){var a=arc(f,t),e=fish[f.i];
      if(t>=f.s&&!fired['f'+f.i]){fired['f'+f.i]=1;ripple(f.a,0)}
      if(t>=f.s+f.d&&!fired['g'+f.i]){fired['g'+f.i]=1;ripple(f.b,0)}
      if(a){var flip=f.b<f.a;e.setAttribute('opacity',1);e.setAttribute('transform','translate('+a.x.toFixed(1)+','+a.y.toFixed(1)+') rotate('+(flip?a.ang-180:a.ang).toFixed(1)+')'+(flip?' scale(-'+S+','+S+')':' scale('+S+')'))}else e.setAttribute('opacity',0)});
    ripples=ripples.filter(function(r){var k=(now-r.t)/(r.big?1500:1000);if(k>1){r.e.remove();return false}var rx=(r.big?30:14)*k+2;r.e.setAttribute('rx',rx.toFixed(1));r.e.setAttribute('ry',(rx*.32).toFixed(1));r.e.setAttribute('opacity',(1-k).toFixed(2));return true});
    dropL=dropL.filter(function(d){var s=(now-d.t)/1000;if(s>0.9){d.e.remove();return false}var y=d.vy*s+160*s*s;if(y>0){d.e.remove();return false}d.e.setAttribute('cx',(d.x+d.vx*s).toFixed(1));d.e.setAttribute('cy',y.toFixed(1));return true});
    if(t<7600||ripples.length||dropL.length)st.raf=requestAnimationFrame(frameFn);
  }
  function go(){
    if(reduce){/* a single still dolphin, no motion */
      var P=point();g.setAttribute('transform','translate('+P[0]+','+P[1]+')');dol.setAttribute('opacity',1);dol.setAttribute('transform','translate(0,-40) rotate(-20)');
    }else st.raf=requestAnimationFrame(frameFn);
    showToast();
  }
  if(api){
    var m=api.m;st.home={c:m.getCenter(),z:m.getZoom()};
    if(reduce){m.setView(DINGLE,9.5);go()}
    else{var once=function(){m.off('moveend',once);clearTimeout(st.fb);go()};m.on('moveend',once);st.fb=setTimeout(once,3600);m.flyTo(DINGLE,9.5,{duration:2.2})}
  }else go();
  layer.addEventListener('click',endEgg);
  st.timers.push(setTimeout(endEgg,10500));
}
function showToast(){
  if(!toast)return;
  toast.innerHTML='<i lang="ga">Dia dhuit ó Dhaingean Uí Chúis</i> · Hello from Dingle<small>Dingle Bay, Co. Kerry, long the home of Fungie the dolphin · tap to close</small>';
  toast.classList.add('show');
}
function endEgg(){
  var st=running;if(!st)return;running=null;
  cancelAnimationFrame(st.raf);st.timers.forEach(clearTimeout);clearTimeout(st.fb);
  if(toast)toast.classList.remove('show');
  st.layer.style.transition='opacity .5s';st.layer.style.opacity='0';setTimeout(function(){st.layer.remove()},550);
  if(st.api&&st.home){try{reduce?st.api.m.setView(st.home.c,st.home.z):st.api.m.flyTo(st.home.c,st.home.z,{duration:1.6})}catch(e){}}
}
if(toast)toast.addEventListener('click',endEgg);
window.paDolphinHello=startEgg;
if(/[?&]hello\b/.test(location.search)||location.hash==='#hello'){addEventListener('load',function(){setTimeout(startEgg,900)})}

/* triggers: triple-tap the logo (or the hero dolphin), or press D */
function tapper(node,single){
  if(!node)return;var n=0,tm=null;
  node.style.touchAction='manipulation';
  node.addEventListener('click',function(e){e.preventDefault();n++;clearTimeout(tm);node.classList.remove('tap1','tap2');
    if(n>=3){n=0;startEgg();return}
    node.classList.add('tap'+n);
    tm=setTimeout(function(){node.classList.remove('tap1','tap2');if(n===1&&single)single();n=0},420)});
}
tapper($('#logo'),function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
tapper($('.headline .emblem'),null);
function onKey(e){var t=e.target;if(t&&t.closest&&t.closest('input,textarea,select,[contenteditable]'))return;
  if((e.key==='d'||e.key==='D')&&!e.metaKey&&!e.ctrlKey&&!e.altKey){startEgg()}
  else if(e.key==='Escape'&&running){endEgg()}}
document.addEventListener('keydown',onKey);
if(iframe)iframe.addEventListener('load',function(){try{iframe.contentDocument.addEventListener('keydown',onKey)}catch(e){}});
})();
