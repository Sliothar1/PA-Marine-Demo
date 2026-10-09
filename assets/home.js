/* Landing-page craft: season radial, count-ups, scroll reveals. No libraries. */
(function(){
'use strict';
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Season at a glance.
   W[i] = % of station-weeks (ISO week i+1) followed by total Dinophysis >=100 cells/L in weeks +1/+2,
   aggregated nationally from the map's season replay (map/data/replay.js, 2016-2026, 31,958 station-weeks).
   First-bloom band: ISO week of each area-season's first >=100 count (map/data/leadtime.js, 661 area-seasons,
   2003-2026): median 25, middle half 22-28. */
var W=[0,0,0,0,0,0,0,0,0,0,0,0.3,0.3,0.5,0.9,1.7,4.9,9,12.2,12.7,14.2,18.8,21.4,21.2,19.5,19.5,20.9,21.4,20.9,16.9,15.3,14.7,11.6,6.9,6.2,4.7,3.5,2.4,2.4,1.5,1.1,0.3,0.5,0.5,0.5,0,0,0,0,0,0,0];
var FB={lo:22,hi:28,med:25};
var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function isoWeek(d){var t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));t.setUTCDate(t.getUTCDate()+4-(t.getUTCDay()||7));var y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y)/864e5+1)/7)}
function radial(el){
  var C=200,R0=78,L=104,max=22,n=52,ns='http://www.w3.org/2000/svg',step=2*Math.PI/n;
  var ang=function(w){return -Math.PI/2+(w-1)*step};            // week 1 at 12 o'clock
  var pt=function(a,r){return [(C+r*Math.cos(a)).toFixed(2),(C+r*Math.sin(a)).toFixed(2)]};
  var col=function(v){var t=Math.min(1,v/max);
    var a=[159,226,216],b=[15,124,128],c=[230,140,70];             // sea-glass -> deep teal -> warm amber
    var m=t<.65?[a,b,t/.65]:[b,c,(t-.65)/.35];
    return 'rgb('+[0,1,2].map(function(i){return Math.round(m[0][i]+(m[1][i]-m[0][i])*m[2])}).join(',')+')'};
  var h='<svg viewBox="0 0 400 400" class="rad-svg" aria-hidden="true">';
  h+='<circle cx="200" cy="200" r="'+(R0+L)+'" class="rad-ring"/><circle cx="200" cy="200" r="'+(R0+L*0.5)+'" class="rad-ring faint"/><circle cx="200" cy="200" r="'+R0+'" class="rad-ring"/>';
  // month ticks + labels (mid-month by day of year)
  for(var m=0;m<12;m++){var d0=new Date(2026,m,1),doy=(d0-new Date(2026,0,1))/864e5,a=-Math.PI/2+doy/365*2*Math.PI,am=a+15.2/365*2*Math.PI;
    var p1=pt(a,R0-4),p2=pt(a,R0+L+6),pl=pt(am,R0+L+20);
    h+='<line x1="'+p1[0]+'" y1="'+p1[1]+'" x2="'+p2[0]+'" y2="'+p2[1]+'" class="rad-tick"/>';
    h+='<text x="'+pl[0]+'" y="'+pl[1]+'" class="rad-month" text-anchor="middle" dominant-baseline="middle">'+MONTHS[m]+'</text>'}
  // first-bloom arc
  var a1=ang(FB.lo)-step/2,a2=ang(FB.hi)+step/2,r=R0-14,q1=pt(a1,r),q2=pt(a2,r);
  h+='<path d="M'+q1[0]+' '+q1[1]+' A'+r+' '+r+' 0 0 1 '+q2[0]+' '+q2[1]+'" class="rad-arc"/>';
  var md=pt(ang(FB.med),r);h+='<circle cx="'+md[0]+'" cy="'+md[1]+'" r="4.5" class="rad-med"/>';
  // spokes
  for(var w=1;w<=n;w++){var v=W[w-1],len=Math.max(1.5,v/max*L),aa=ang(w),s0=pt(aa-step*.36,R0),s1=pt(aa+step*.36,R0),e0=pt(aa-step*.36,R0+len),e1=pt(aa+step*.36,R0+len);
    h+='<path class="spk'+(v>0?'':' zero')+'" data-w="'+w+'" style="--i:'+w+'"'+(v>0?' fill="'+col(v)+'"':'')+' d="M'+s0[0]+' '+s0[1]+' L'+e0[0]+' '+e0[1]+' A'+(R0+len)+' '+(R0+len)+' 0 0 1 '+e1[0]+' '+e1[1]+' L'+s1[0]+' '+s1[1]+' A'+R0+' '+R0+' 0 0 0 '+s0[0]+' '+s0[1]+' Z"><title>Week '+w+': '+v.toFixed(1)+'% of site-weeks had a bloom ahead</title></path>'}
  // this week
  var cw=Math.min(52,isoWeek(new Date())),an=ang(cw),n1=pt(an,R0-26),n2=pt(an,R0+L+8);
  h+='<line x1="'+n1[0]+'" y1="'+n1[1]+'" x2="'+n2[0]+'" y2="'+n2[1]+'" class="rad-now"/><circle cx="'+n2[0]+'" cy="'+n2[1]+'" r="3.5" class="rad-now-dot"/>';
  h+='<text x="200" y="186" class="rad-c1" text-anchor="middle">Bloom season</text><text x="200" y="214" class="rad-c2" text-anchor="middle" id="radVal">week '+cw+' now</text><text x="200" y="234" class="rad-c3" text-anchor="middle" id="radSub">'+W[cw-1].toFixed(1)+'% of site-weeks</text>';
  h+='</svg>';
  el.innerHTML=h;
  var val=el.querySelector('#radVal'),sub=el.querySelector('#radSub');
  var reset=function(){val.textContent='week '+cw+' now';sub.textContent=W[cw-1].toFixed(1)+'% of site-weeks'};
  el.addEventListener('pointerover',function(e){var p=e.target.closest('.spk');if(!p)return;var w=+p.getAttribute('data-w');val.textContent='Week '+w;sub.textContent=W[w-1].toFixed(1)+'% of site-weeks';el.classList.add('hovering');[].forEach.call(el.querySelectorAll('.spk.on'),function(x){x.classList.remove('on')});p.classList.add('on')});
  el.addEventListener('pointerleave',function(){reset();el.classList.remove('hovering');[].forEach.call(el.querySelectorAll('.spk.on'),function(x){x.classList.remove('on')})});
}
var rad=document.getElementById('radial'); if(rad) radial(rad);

/* count-ups (final value is already in the HTML, so no-JS readers see the real number) */
function countUp(el){
  var end=+el.getAttribute('data-count'),pre=el.getAttribute('data-prefix')||'',dur=1100,t0=null;
  if(reduce||!end){return}
  function f(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=pre+Math.round(end*e);if(k<1)requestAnimationFrame(f);else el.textContent=pre+end}
  el.textContent=pre+'0';requestAnimationFrame(f);
  setTimeout(function(){t0=-1e9;el.textContent=pre+end},dur+250); // settle even if frames are throttled
}
/* reveal on scroll */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var t=e.target;t.classList.add('in');setTimeout(function(){t.classList.add('settled')},1600);[].forEach.call(t.querySelectorAll('[data-count]'),countUp);io.unobserve(t)})},{threshold:.18,rootMargin:'0px 0px -6% 0px'}):null;
document.documentElement.classList.add('js');
[].forEach.call(document.querySelectorAll('.reveal'),function(el){if(io&&!reduce)io.observe(el);else el.classList.add('in')});

/* creatures: tap toggles the Irish name on touch screens */
[].forEach.call(document.querySelectorAll('.crit li'),function(li){li.addEventListener('click',function(){li.classList.toggle('show')})});
})();
