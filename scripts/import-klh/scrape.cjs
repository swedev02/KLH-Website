// Step 1: render every klh.edu.in menu page and extract its content blocks into pages.raw.json.
// Usage: node scripts/import-klh/scrape.cjs   (needs: npm i -D playwright)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const SLUGS=['inception-brief-history','vision-mission','achievements-awards','ranking','world-class-education','academic-collaborations','leadership','formerl','campuses-locations','maps-directions','learner-centric-approach','education-environment','research-facilities','working-at-klh','iqac','industrial-practice-school','extension-activities','give-to-kl','aziznagar','bachupally','programs-at-klh','entry-requirements','fee-structure','transfer-of-admission','admission-help-desk','about-placement','students-placed','contact-2','collaborations','facilities','research','contact-us'];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});const out={};
for(const slug of SLUGS){try{
 const res=await p.goto('https://klh.edu.in/'+slug+'/',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(2500);
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}});await p.waitForTimeout(800);
 out[slug]=await p.evaluate(()=>{
  const best=i=>{const ss=(i.getAttribute('srcset')||'').split(',').map(s=>s.trim().split(/\s+/)).filter(x=>x[0]);let u=i.getAttribute('data-lazyload')||i.getAttribute('data-src')||i.getAttribute('data-lazy-src')||i.currentSrc||i.src;if(ss.length){ss.sort((a,b)=>parseInt(b[1])-parseInt(a[1]));u=ss[0][0]}return u&&u.startsWith('//')?'https:'+u:u};
  const top=document.querySelector('.top_site_main');const banner=top&&(top.getAttribute('style')||'').match(/url\(([^)]+)\)/);
  const title=(document.querySelector('.top_site_main .page-title, h1.page-title, h1')||{}).textContent?.trim();
  const root=document.querySelector('.entry-content')||document.querySelector('#main-content')||document.body;
  const blocks=[];const txt=e=>e.textContent.replace(/\s+/g,' ').trim();
  const push=b=>{const last=blocks[blocks.length-1];if(last&&JSON.stringify(last)===JSON.stringify(b))return;blocks.push(b)};
  const walk=el=>{for(const n of el.children){const t=n.tagName;const cs=getComputedStyle(n);if(cs.display==='none'&&!n.closest('rs-module'))continue;
   if(/^(SCRIPT|STYLE|NOSCRIPT|FORM|BUTTON|INPUT|SELECT)$/.test(t))continue;
   if(/^H[1-6]$/.test(t)){n.querySelectorAll('img').forEach(i=>img(i));const s=txt(n);if(s)push({type:'h',level:+t[1],text:s});continue}
   if(t==='TABLE'){const rows=[...n.querySelectorAll('tr')].map(r=>[...r.children].map(c=>txt(c)));if(rows.length)push({type:'table',rows});continue}
   if(t==='UL'||t==='OL'){const items=[...n.children].filter(li=>li.tagName==='LI').map(li=>{const a=li.querySelector('a[href]');return a&&txt(a)===txt(li)?{text:txt(li),href:a.href}:{text:txt(li)}}).filter(x=>x.text);if(items.length)push({type:'list',items});n.querySelectorAll('img').forEach(i=>img(i));continue}
   if(t==='IMG'){img(n);continue}
   if(t==='IFRAME'){if(/youtube|vimeo/.test(n.src))push({type:'video',src:n.src});continue}
   if(t==='VIDEO'){const s=n.querySelector('source')?.src||n.src;if(s)push({type:'video',src:s});continue}
   if(t==='P'||(n.children.length===0&&txt(n))){n.querySelectorAll('img').forEach(i=>img(i));const a=[...n.querySelectorAll('a[href]')];const s=txt(n);
     if(s){if(a.length===1&&txt(a[0])===s)push({type:'link',text:s,href:a[0].href});else push({type:'p',text:s})}continue}
   if(t==='A'&&!n.querySelector('img,div,p,h1,h2,h3,h4')){const s=txt(n);if(s&&n.href&&!/^javascript/.test(n.href))push({type:'link',text:s,href:n.href});continue}
   const bg=(n.getAttribute('style')||'').match(/background-image:\s*url\(([^)]+)\)/);if(bg)push({type:'img',src:bg[1].replace(/['"]/g,''),alt:'',w:0,h:0});
   walk(n)}};
  const img=i=>{const u=best(i);if(!u||u.startsWith('data:')||/dummy\.png|LOG9|\/Lg\.png|li\.jpg/.test(u))return;const w=i.naturalWidth,h=i.naturalHeight;if(w&&w<60&&h<60)return;push({type:'img',src:u,alt:(i.alt||'').trim(),w,h})};
  walk(root);
  return {title,banner:banner?banner[1].replace(/['"]/g,''):null,blocks}});
 console.log(slug,res.status(),out[slug].blocks.length,out[slug].title)}catch(e){console.log('FAIL',slug,e.message)}}
fs.writeFileSync(path.join(__dirname,'pages.raw.json'),JSON.stringify(out,null,1));await b.close()})()
