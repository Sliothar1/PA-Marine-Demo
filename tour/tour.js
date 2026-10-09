/* Guided tour: step-through with arrows / swipe / buttons, #n deep links, N notes, F full screen */
(function(){
'use strict';
var syncing=false;
var steps=[].slice.call(document.querySelectorAll('.step')), n=steps.length, cur=0;
var bar=document.getElementById('bar'), count=document.getElementById('count');
var panel=document.getElementById('notesPanel'), nbtn=document.getElementById('notesBtn');
var css='body>div[style*="position:fixed"][style*="bottom:0"]{display:none!important}'+
 'html.embed-o header.top,html.embed-o .banner,html.embed-o #foot,html.embed-o #view>.flex,html.embed-o #view>.grid,html.embed-o .mapwrap>div:nth-child(2){display:none!important}'+
 'html.embed-o body{padding:0!important;margin:0!important;overflow:hidden}html.embed-o #view{padding:0!important;margin:0!important;max-width:none!important}'+
 'html.embed-o .mapwrap{display:block!important;margin:0!important}html.embed-o #map{height:calc(100vh - 34px)!important;border:0!important;border-radius:0!important}'+
 'html.embed-o .leaflet-control-attribution{font-size:10px!important}html.embed-o .legend{padding:6px 10px!important;margin:0!important;font-size:12px!important;white-space:nowrap;overflow-x:auto}';
function embed(f){
  function isO(w){var h=w.location.hash.replace(/^#\/?/,'');return h===''||h==='outlook'}
  function inject(){try{var w=f.contentWindow,d=f.contentDocument;if(!d||!/\/map\//.test(d.URL)||!d.head)return 0;if(d.getElementById('embedcss'))return 2;
    var s=d.createElement('style');s.id='embedcss';s.textContent=css;d.head.appendChild(s);d.documentElement.classList.toggle('embed-o',isO(w));
    w.addEventListener('hashchange',function(){var o=isO(w);if(o!==d.documentElement.classList.contains('embed-o')){d.documentElement.classList.toggle('embed-o',o);w.dispatchEvent(new w.HashChangeEvent('hashchange'))}});return 1}catch(e){return 2}}
  var t=setInterval(function(){if(inject())clearInterval(t)},10);
  f.addEventListener('load',function(){clearInterval(t);if(inject()===1){try{f.contentWindow.dispatchEvent(new f.contentWindow.HashChangeEvent('hashchange'))}catch(e){}}});
}
function show(i,push){
  i=Math.max(0,Math.min(n-1,i)); cur=i;
  steps.forEach(function(s,k){s.classList.toggle('on',k===i);s.classList.toggle('before',k<i);s.setAttribute('aria-hidden',k===i?'false':'true');if(k===i)s.scrollTop=0});
  var f=steps[i].querySelector('iframe[data-src]'); if(f&&!f.getAttribute('src')){embed(f);f.setAttribute('src',f.getAttribute('data-src'))}
  bar.style.width=((i+1)/n*100)+'%'; count.textContent=(i+1)+' / '+n;
  document.title=steps[i].getAttribute('data-title')+' · Guided tour · Live Dinophysis Bloom Map';
  if(push!==false){try{history.replaceState(null,'','#'+(i+1))}catch(e){}}
  if(!syncing){try{localStorage.setItem('pa-tour-step',String(i)+':'+Date.now())}catch(e){}}
  var nt=steps[i].querySelector('.notes'); panel.querySelector('.np-in').innerHTML='<p class="np-h">Speaker notes · step '+(i+1)+' (suggestions)</p>'+(nt?nt.innerHTML:'<p>No notes for this step.</p>');
}
function fromHash(){var m=/^#(\d+)$/.exec(location.hash);return m?(+m[1]-1):0}
function toggleNotes(){var o=panel.hidden;panel.hidden=!o;nbtn.setAttribute('aria-pressed',String(o));}
function fs(){var d=document;if(!d.fullscreenElement){(d.documentElement.requestFullscreen||function(){}).call(d.documentElement)}else{d.exitFullscreen()}}
var ov=document.getElementById('overview'), ovl=document.getElementById('ovList');
ovl.innerHTML=steps.map(function(s,k){return '<li><a href="#'+(k+1)+'" data-k="'+k+'">'+s.getAttribute('data-title')+'</a></li>'}).join('');
ovl.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();show(+a.getAttribute('data-k'));toggleOv(false)});
ov.addEventListener('click',function(e){if(e.target===ov)toggleOv(false)});
function toggleOv(o){if(o===undefined)o=ov.hidden;ov.hidden=!o;if(o){[].forEach.call(ovl.querySelectorAll('a'),function(a,k){a.classList.toggle('cur',k===cur)});var c=ovl.querySelector('a.cur');if(c)c.focus()}}
document.getElementById('count').addEventListener('click',function(){toggleOv()});
var t0=Date.now(),tm=document.getElementById('timer');
setInterval(function(){var s=Math.floor((Date.now()-t0)/1000);tm.textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2)},1000);
document.getElementById('timerReset').addEventListener('click',function(){t0=Date.now();tm.textContent='0:00'});
document.getElementById('prev').addEventListener('click',function(){show(cur-1)});
document.getElementById('next').addEventListener('click',function(){show(cur+1)});
nbtn.addEventListener('click',toggleNotes);
document.getElementById('fsBtn').addEventListener('click',fs);
document.addEventListener('keydown',function(e){
  if(e.altKey||e.ctrlKey||e.metaKey)return; var t=e.target.tagName; if(t==='INPUT'||t==='TEXTAREA')return;
  var k=e.key;
  if(k==='ArrowRight'||k==='PageDown'||(k===' '&&!e.shiftKey)){e.preventDefault();show(cur+1)}
  else if(k==='ArrowLeft'||k==='PageUp'||(k===' '&&e.shiftKey)){e.preventDefault();show(cur-1)}
  else if(k==='Home'){show(0)}else if(k==='End'){show(n-1)}
  else if(k==='n'||k==='N'){toggleNotes()}else if(k==='o'||k==='O'){toggleOv()}else if(k==='Escape'){toggleOv(false)}else if(!ov.hidden&&/^[0-9]$/.test(k)){var d=+k;show(d===0?9:d-1);toggleOv(false)}else if(k==='f'||k==='F'){fs()}
});
var x0=null,y0=null;
document.addEventListener('touchstart',function(e){if(e.target.closest('.frame'))return;x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>50&&Math.abs(dx)>1.5*Math.abs(dy)){show(cur+(dx<0?1:-1))}x0=null},{passive:true});
window.addEventListener('hashchange',function(){var i=fromHash();if(i!==cur)show(i,false)});
if(/[?&]notes=1/.test(location.search)){panel.hidden=false;nbtn.setAttribute('aria-pressed','true')}
window.addEventListener('storage',function(e){if(e.key!=='pa-tour-step'||!e.newValue)return;var i=parseInt(e.newValue,10);if(!isNaN(i)&&i!==cur){syncing=true;show(i);syncing=false}});
document.getElementById('presWin').addEventListener('click',function(){window.open(location.pathname+'?notes=1#'+(cur+1),'pa-presenter','width=1000,height=700')});
show(fromHash(),false);
})();
