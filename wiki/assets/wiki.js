/* PA-Marine wiki: hash router, sidebar, search, theme, test log */
(function(){
'use strict';
var PAGES = window.PAGES || [], TESTS = window.TESTS || [];
var $ = function(s,el){return (el||document).querySelector(s)};
var $$ = function(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))};
var esc = function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')};
var md = function(s){return esc(s).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>')};
var plain = function(s){return String(s).replace(/\*\*?/g,'')};
var CAT = {
  pos:{label:'Adopted / passed', short:'Passed', color:'var(--pos)'},
  null:{label:'Null / no lift', short:'Null', color:'var(--null)'},
  chk:{label:'Robustness check / caveat', short:'Check', color:'var(--chk)'},
  desc:{label:'Descriptive / data', short:'Descriptive', color:'var(--desc)'},
  pend:{label:'Pending / not run / milestone', short:'Pending', color:'var(--pend)'}
};
var CAT_ORDER=['pos','null','chk','desc','pend'];
/* light Irish-language labels (shown alongside the English) */
var GA={overview:'Forléargas','how-it-works':'Conas a oibríonn sé',results:'Torthaí','test-log':'Tástálacha',heatwaves:'Tonnta teasa mara',toxins:'Tocsainí eile',france:'An Fhrainc',sampling:'Samplaí',data:'Foinsí sonraí',limitations:'Teorainneacha',glossary:'Gluais',about:'Fúinn'};
var GA_GROUP={'Start here':'Tosaigh anseo','Findings':'Fionnachtana','Reference':'Tagairt'};

/* ---------- height of sticky header ---------- */
function setHH(){document.documentElement.style.setProperty('--hh',$('#stickyhead').offsetHeight+'px')}
window.addEventListener('resize',setHH); setHH();

/* ---------- theme ---------- */
$('#themeBtn').addEventListener('click',function(){
  var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',t); try{localStorage.setItem('pa-theme',t)}catch(e){}
});

/* ---------- sidebar ---------- */
function buildSide(){
  var groups=[], by={};
  PAGES.forEach(function(p){ if(!by[p.group]){by[p.group]=[];groups.push(p.group)} by[p.group].push(p) });
  var h='';
  groups.forEach(function(g){
    h+='<h4>'+esc(g)+(GA_GROUP[g]?' <i lang="ga">· '+GA_GROUP[g]+'</i>':'')+'</h4>';
    by[g].forEach(function(p){
      h+='<a href="#/'+p.id+'" data-id="'+p.id+'"><span aria-hidden="true">'+(p.icon||'•')+'</span>'+'<span class="lbl">'+esc(p.title)+(GA[p.id]?'<i lang="ga">'+GA[p.id]+'</i>':'')+'</span>'+(p.id==='test-log'?'<span class="n">'+TESTS.length+'</span>':'')+'</a>';
    });
  });
  h+='<div class="ext"><h4>Elsewhere on this site</h4><a href="../"><span>⌂</span><span class="lbl">Home page<i lang="ga">Baile</i></span></a><a href="../map/"><span>🗺</span><span class="lbl">Live map<i lang="ga">An léarscáil bheo</i></span></a><a href="../tour/"><span>🎞️</span><span class="lbl">Guided tour<i lang="ga">Turas</i></span></a></div>';
  h+='<div class="credit-card"><b>Garry Lohan (ATU Galway) and Felix Sproll (Marine Institute)</b><br>Research prototype for Ocean Hackathon Cork 2026. Not Marine Institute advice.<br><i lang="ga">Déanta i nGaillimh</i> · Made in Galway</div>';
  $('#side').innerHTML=h;
}
function openNav(o){document.body.classList.toggle('navopen',o)}
$('#menuBtn').addEventListener('click',function(){openNav(!document.body.classList.contains('navopen'))});
$('#scrim').addEventListener('click',function(){openNav(false)});

/* ---------- router ---------- */
function parseHash(){
  var h=location.hash.replace(/^#\/?/,''), q='';
  var i=h.indexOf('?'); if(i>=0){q=h.slice(i+1);h=h.slice(0,i)}
  var params={}; q.split('&').forEach(function(kv){if(!kv)return;var a=kv.split('=');params[decodeURIComponent(a[0])]=decodeURIComponent((a[1]||'').replace(/\+/g,' '))});
  var parts=h.split('/'); return {id:parts[0]||'overview',sec:parts[1]||'',params:params};
}
function slug(s){return s.toLowerCase().replace(/<[^>]+>/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function render(){
  var r=parseHash(), idx=-1;
  PAGES.forEach(function(p,i){if(p.id===r.id)idx=i});
  if(idx<0){r.id='overview';idx=0}
  var p=PAGES[idx];
  document.title=p.title+' · PA-Marine-Model wiki';
  var html='<div class="crumb">'+esc(p.group)+'</div>'+(GA[p.id]?'<div class="ga-kicker" lang="ga">'+GA[p.id]+'</div>':'')+'<h1>'+esc(p.title)+'</h1>'+(p.lede?'<p class="lede">'+p.lede+'</p>':'')+p.html;
  var prev=PAGES[idx-1], next=PAGES[idx+1];
  html+='<nav class="pager">'+(prev?'<a href="#/'+prev.id+'"><small>← Previous</small>'+esc(prev.title)+'</a>':'<span></span>')+(next?'<a class="nx" href="#/'+next.id+'"><small>Next →</small>'+esc(next.title)+'</a>':'<span></span>')+'</nav>';
  var view=$('#view'); view.innerHTML=html; view.classList.toggle('wide',!!p.wide); $('.layout').classList.toggle('notoc',!!p.wide);
  // headings ids + toc
  var toc='';
  $$('h2',view).forEach(function(h){h.id=h.id||slug(h.textContent);toc+='<a href="#/'+p.id+'/'+h.id+'" data-sec="'+h.id+'">'+esc(h.textContent)+'</a>'});
  $('#toc').innerHTML=toc?'<b>On this page</b>'+toc:'';
  $$('#side a').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-id')===p.id)});
  // widgets
  $$('[data-widget]',view).forEach(function(el){var w=WIDGETS[el.getAttribute('data-widget')];if(w)w(el,r.params)});
  $$('figure img',view).forEach(function(img){img.loading='lazy';img.addEventListener('click',function(){var lb=$('#lightbox');$('img',lb).src=img.src;$('img',lb).alt=img.alt;lb.classList.add('open')})});
  openNav(false);
  if(r.sec){var t=document.getElementById(r.sec); if(t){setTimeout(function(){t.scrollIntoView()},0)}} else window.scrollTo(0,0);
  if(r.params.hl) highlight(view,r.params.hl);
}
$('#lightbox').addEventListener('click',function(){this.classList.remove('open')});
function highlight(root,term){
  term=term.trim(); if(term.length<3)return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), nodes=[], n;
  while((n=walker.nextNode())){ if(n.parentNode.closest('script,style,.pager,[data-widget]'))continue; if(n.nodeValue.toLowerCase().indexOf(term.toLowerCase())>=0)nodes.push(n) }
  var first=null;
  nodes.slice(0,40).forEach(function(node){
    var v=node.nodeValue, i=v.toLowerCase().indexOf(term.toLowerCase()); if(i<0)return;
    var m=document.createElement('mark'); m.textContent=v.slice(i,i+term.length);
    var after=node.splitText(i); after.nodeValue=after.nodeValue.slice(term.length); node.parentNode.insertBefore(m,after);
    if(!first)first=m;
  });
  if(first)setTimeout(function(){first.scrollIntoView({block:'center'})},30);
}
window.addEventListener('hashchange',render);

/* ---------- search ---------- */
var INDEX=[];
function buildIndex(){
  var tmp=document.createElement('div');
  PAGES.forEach(function(p){
    tmp.innerHTML=p.html.replace(/<div data-widget[^>]*><\/div>/g,'');
    // split by h2 sections
    var sec={title:'',id:'',text:''}, secs=[];
    Array.prototype.forEach.call(tmp.childNodes,function(nd){
      if(nd.nodeName==='H2'){secs.push(sec);sec={title:nd.textContent,id:slug(nd.textContent),text:''}}
      else sec.text+=' '+(nd.textContent||'');
    });
    secs.push(sec);
    secs.forEach(function(s,i){INDEX.push({kind:'page',page:p,title:p.title+(s.title?' › '+s.title:''),href:'#/'+p.id+(s.id?'/'+s.id:''),text:(i===0?(p.title+' '+(p.lede||'').replace(/<[^>]+>/g,'')+' '):'')+s.title+' '+s.text.replace(/\s+/g,' '),key:p.keywords||''})});
  });
  TESTS.forEach(function(t){INDEX.push({kind:'test',t:t,title:'Test #'+t.n+': '+plain(t.test),href:'#/test-log?q='+encodeURIComponent('#'+t.n),text:plain(t.test+' '+t.result+' '+t.verdict+' '+t.theme+' '+CAT[t.cat].label)})});
}
function snippet(text,terms){
  var lo=text.toLowerCase(), i=-1;
  terms.some(function(t){i=lo.indexOf(t);return i>=0});
  var s=Math.max(0,i-60), out=(s>0?'…':'')+text.slice(s,s+170)+(text.length>s+170?'…':'');
  out=esc(out);
  terms.forEach(function(t){if(t.length<2)return;out=out.replace(new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});
  return out;
}
var selIdx=-1, lastHits=[];
function doSearch(){
  var q=$('#q').value.trim().toLowerCase(), box=$('#results');
  if(q.length<2){box.classList.remove('open');box.innerHTML='';lastHits=[];return}
  var terms=q.split(/\s+/).filter(Boolean);
  var hits=[];
  INDEX.forEach(function(e){
    var hay=(e.title+' '+e.text+' '+e.key).toLowerCase(), score=0, ok=true;
    terms.forEach(function(t){var c=hay.split(t).length-1; if(!c)ok=false; score+=c+(e.title.toLowerCase().indexOf(t)>=0?8:0)});
    if(/^#?\d+$/.test(q)&&e.kind==='test'&&('#'+e.t.n===q||String(e.t.n)===q)){ok=true;score=999}
    if(ok)hits.push({e:e,score:score+(e.kind==='page'?2:0)});
  });
  hits.sort(function(a,b){return b.score-a.score});
  var pages=hits.filter(function(h){return h.e.kind==='page'}).slice(0,7), tests=hits.filter(function(h){return h.e.kind==='test'});
  lastHits=pages.concat(tests.slice(0,6));
  var h='';
  pages.forEach(function(x){h+='<a href="'+x.e.href+(x.e.href.indexOf('?')<0?'?hl='+encodeURIComponent(terms[0]):'')+'"><div class="rt">'+esc(x.e.title)+'</div><div class="rs">'+snippet(x.e.text,terms)+'</div></a>'});
  tests.slice(0,6).forEach(function(x){h+='<a href="'+x.e.href+'"><div class="rt">'+esc(x.e.title.slice(0,90))+'<span class="badge b-'+x.e.t.cat+'">'+CAT[x.e.t.cat].short+'</span></div><div class="rs">'+snippet(x.e.text,terms)+'</div></a>'});
  if(tests.length>6)h+='<a href="#/test-log?q='+encodeURIComponent(q)+'"><div class="rt">See all '+tests.length+' matching tests in the test log →</div></a>';
  if(!h)h='<a><div class="rs">No matches for “'+esc(q)+'”.</div></a>';
  box.innerHTML=h; box.classList.add('open'); selIdx=-1;
  $$('a',box).forEach(function(a){a.addEventListener('click',function(){box.classList.remove('open');$('#q').blur()})});
}
$('#q').addEventListener('input',doSearch);
$('#q').addEventListener('focus',doSearch);
$('#q').addEventListener('keydown',function(ev){
  var items=$$('#results a[href]');
  if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();selIdx=(selIdx+(ev.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach(function(a,i){a.classList.toggle('sel',i===selIdx)});if(items[selIdx])items[selIdx].scrollIntoView({block:'nearest'})}
  else if(ev.key==='Enter'){var a=items[selIdx>=0?selIdx:0];if(a){location.hash=a.getAttribute('href');$('#results').classList.remove('open');this.blur()}}
  else if(ev.key==='Escape'){$('#results').classList.remove('open');this.blur()}
});
document.addEventListener('click',function(ev){if(!ev.target.closest('.search'))$('#results').classList.remove('open')});
document.addEventListener('keydown',function(ev){if(ev.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){ev.preventDefault();$('#q').focus()}});

/* ---------- widgets ---------- */
var WIDGETS={};
WIDGETS.testlog=function(el,params){
  var counts={}; CAT_ORDER.forEach(function(c){counts[c]=0}); TESTS.forEach(function(t){counts[t.cat]++});
  var themes=[]; TESTS.forEach(function(t){if(themes.indexOf(t.theme)<0)themes.push(t.theme)});
  var state={cat:params.cat||'all',theme:params.theme||'',q:params.q||'',order:'asc'};
  var h='<div class="dist" aria-hidden="true">'+CAT_ORDER.map(function(c){return '<span title="'+CAT[c].label+': '+counts[c]+'" style="width:'+(100*counts[c]/TESTS.length)+'%;background:'+CAT[c].color+'"></span>'}).join('')+'</div>';
  h+='<div class="legend">'+CAT_ORDER.map(function(c){return '<span><b style="background:'+CAT[c].color+'"></b>'+CAT[c].label+' · '+counts[c]+'</span>'}).join('')+'</div>';
  h+='<div class="chips" id="tlChips"><button class="chip c-all" data-c="all">All<i>'+TESTS.length+'</i></button>'+CAT_ORDER.map(function(c){return '<button class="chip c-'+c+'" data-c="'+c+'">'+CAT[c].label+'<i>'+counts[c]+'</i></button>'}).join('')+'</div>';
  h+='<div class="tl-controls"><input id="tlQ" type="search" placeholder="Filter tests: e.g. heatwave, wind, France, #84, toxin…" aria-label="Filter tests"><select id="tlTheme" aria-label="Theme"><option value="">All themes</option>'+themes.map(function(t){return '<option>'+esc(t)+'</option>'}).join('')+'</select><select id="tlOrder" aria-label="Order"><option value="asc">Oldest first</option><option value="desc">Newest first</option></select><span class="tl-count" id="tlCount"></span></div>';
  h+='<div class="tbl"><table id="tlTable"><thead><tr><th>#</th><th>Date</th><th>Test</th><th>Headline result</th><th>Verdict</th></tr></thead><tbody></tbody></table></div>';
  el.innerHTML=h;
  $('#tlQ').value=state.q; $('#tlTheme').value=state.theme;
  function draw(){
    $$('#tlChips .chip').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-c')===state.cat)});
    var q=state.q.trim().toLowerCase(), terms=q.split(/\s+/).filter(Boolean);
    var rows=TESTS.filter(function(t){
      if(state.cat!=='all'&&t.cat!==state.cat)return false;
      if(state.theme&&t.theme!==state.theme)return false;
      if(/^#\d+$/.test(q))return '#'+t.n===q;
      var hay=plain(t.n+' '+t.date+' '+t.test+' '+t.result+' '+t.verdict+' '+t.theme+' '+CAT[t.cat].label).toLowerCase();
      return terms.every(function(x){return hay.indexOf(x)>=0});
    });
    if(state.order==='desc')rows=rows.slice().reverse();
    $('#tlTable tbody').innerHTML=rows.map(function(t){
      return '<tr class="'+t.cat+'"><td>#'+t.n+'</td><td class="date">'+esc(t.date)+'</td><td>'+md(t.test)+'<span class="theme">'+esc(t.theme)+'</span></td><td>'+md(t.result)+'</td><td><span class="badge b-'+t.cat+'">'+CAT[t.cat].short+'</span><span class="verd">'+md(t.verdict)+'</span></td></tr>';
    }).join('')||'<tr><td colspan="5">No tests match these filters.</td></tr>';
    var nn=rows.filter(function(t){return t.cat==='null'}).length;
    $('#tlCount').textContent=rows.length+' of '+TESTS.length+' shown · '+nn+' null';
  }
  $$('#tlChips .chip').forEach(function(b){b.addEventListener('click',function(){state.cat=b.getAttribute('data-c');draw()})});
  $('#tlQ').addEventListener('input',function(){state.q=this.value;draw()});
  $('#tlTheme').addEventListener('change',function(){state.theme=this.value;draw()});
  $('#tlOrder').addEventListener('change',function(){state.order=this.value;draw()});
  draw();
};
/* CI rows: data-rows JSON [{l,s,e,lo,hi,v,hit}] each drawn on its own symmetric scale */
WIDGETS.ci=function(el){
  var rows=window[el.getAttribute('data-src')]||[];
  el.className='ci-box';
  el.innerHTML=rows.map(function(r){
    var m=Math.max(Math.abs(r.lo),Math.abs(r.hi),Math.abs(r.e))*1.15||1;
    var x=function(v){return 50+50*v/m};
    var col=r.hit?'var(--pos)':'var(--accent2)';
    var lo=x(Math.min(r.lo,r.hi)), hi=x(Math.max(r.lo,r.hi));
    var svg='<div class="cibar" aria-hidden="true"><span class="z"></span><span class="b" style="left:'+lo+'%;width:'+(hi-lo)+'%;background:'+col+'"></span><span class="d" style="left:'+x(r.e)+'%;background:'+col+'"></span></div>';
    return '<div class="ci-row"><div class="lbl"><b>'+esc(r.l)+'</b><span>'+esc(r.s||'')+'</span></div>'+svg+'<div class="val">'+esc(r.v)+'</div></div>';
  }).join('')+'<p style="font-size:12.5px;color:var(--muted);margin:8px 0 6px">Dot = estimate, bar = 95% CI, dashed line = no effect. Each row is drawn on its own scale (units differ); what matters is whether the bar crosses the dashed line.</p>';
};

buildSide(); buildIndex(); render();
})();
