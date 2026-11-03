// Step 2: clean pages.raw.json, download every referenced klh.edu.in image into src/assets/klh/, write src/content/pages.json
// and src/assets/klh/manifest.json (image sizes). Usage: node scripts/import-klh/build.cjs .   (needs: npm i -D sharp)
const fs=require('fs'),path=require('path'),sharp=require('sharp');
const P=path.resolve(process.argv[2]||'.'), S=__dirname, CACHE=path.join(S,'cache'), OUT=path.join(P,'src','assets','klh');
fs.mkdirSync(CACHE,{recursive:true});
const raw=require('./pages.raw.json');
const PREFIX=/^(https?:)?\/\/klh\.edu\.in\/(klh-wp\/)?wp-content\/uploads\//;
const rel=u=>u&&PREFIX.test(u)?u.replace(PREFIX,''):null;
const CUSTOM=['aziznagar','bachupally'];
const pages={};const need=new Set();
for(const [slug,p] of Object.entries(raw)){if(CUSTOM.includes(slug))continue;
  let blocks=[];
  for(const b of p.blocks){
    if(b.type==='h'&&/^Visitor counter$/i.test(b.text))break;
    if(b.type==='p'&&b.text.length<2)continue;
    if(b.type==='img'){const r=rel(b.src);if(!r)continue;if(blocks.some(x=>x.type==='img'&&x.src===r))continue;blocks.push({type:'img',src:r,alt:b.alt});need.add(r);continue}
    if((b.type==='link'||b.type==='list')){const fix=h=>h&&rel(h)?{file:rel(h)}:{href:h};
      if(b.type==='link'){blocks.push({type:'link',text:b.text,...fix(b.href)});continue}
      blocks.push({type:'list',items:b.items.map(i=>({text:i.text,...(i.href?fix(i.href):{})}))});continue}
    blocks.push(b)}
  const banner=rel(p.banner);if(banner)need.add(banner);
  pages[slug]={title:p.title,banner,blocks}}
// home, campus and menu imagery used outside the generic page template
const EXTRA=`2026/04/bann1er3-1.jpg 2026/04/banner1-1.jpeg 2026/04/N567.jpg 2025/10/n-scaled.jpg 2024/05/Banner-Placement-01-min-scaled.jpg 2025/01/admission-2025-26.jpg 2024/05/Banner-Placement-02-min-scaled.jpg 2026/04/place-1-2.jpg 2026/04/IMG_1696-1-2-scaled.jpg 2025/01/c3.jpg 2025/01/c1-1.jpg 2026/04/TCS-2.jpg 2023/04/award.jpg 2025/01/i8.jpg 2025/01/act1.jpg 2025/01/i2.jpg
2026/03/SPORTS.jpg 2026/03/IEE-2-CON.jpg 2026/03/asdf-e1775104253297.jpg 2026/03/PRI99-1.jpg 2016/11/poster-video.jpg 2026/04/DESF-1.png 2020/06/r11.png 2020/06/s11.png
2023/10/photo_6138874942213700227_y-1.jpg 2023/03/saikamal.jpg 2022/06/q7.jpg 2022/06/q6.jpg 2022/06/q4.jpg 2022/04/S1.jpg 2022/04/S2.jpg 2022/04/S3.jpg 2022/04/S4.jpg 2022/04/S5.jpg 2022/06/q3.jpg 2022/06/q5.jpg 2022/08/Updated.jpg 2022/08/photo_2022-08-31_17-38-29.jpg 2022/08/photo_2022-08-31_17-37-49.jpg 2022/09/photo_2022-09-15_17-17-01.jpg 2023/10/Amazon-02.jpg 2023/10/Amazon-01-1.jpg 2026/04/counselling-1.jpg 2025/11/photo_2025-11-15_10-25-06.jpg 2026/03/simons.jpg 2026/02/student.jpg 2026/03/cumins.jpg 2026/02/infosys.jpg 2026/02/donationcamp.jpg 2025/11/photo_2025-11-15_10-24-59.jpg 2025/11/photo_2025-11-15_10-24-45.jpg 2025/11/photo_2025-11-15_10-24-53.jpg 2025/11/photo_2025-11-01_14-27-12.jpg 2025/11/photo_2025-11-01_14-27-00.jpg 2025/11/photo_2025-11-01_14-26-49.jpg 2025/11/photo_2025-11-01_14-25-30.jpg 2025/11/photo_2025-11-01_14-25-22.jpg 2025/11/photo_2025-11-01_14-25-12.jpg 2025/11/photo_2025-11-01_14-25-01.jpg 2025/11/photo_2025-11-15_10-24-38.jpg
2020/05/i5.jpg 2020/08/i1-com.jpg 2020/08/i888-co.jpg 2020/08/i79-com.jpg 2020/08/i9-compressed-11zon-1.jpg 2020/08/i12-compressed-11zon.jpg 2020/08/i14-co.jpg 2020/08/jjjj-com.jpg 2020/08/i89-compressed-11zon.jpg 2020/08/i11-compressed-11zon.jpg 2022/05/D-e1653990171502.jpg 2020/08/i4-compressed-11zon.jpg 2020/05/i6.jpg 2020/05/i2.jpg 2020/08/i3-co.jpg
2020/05/i88-e1589900911252.jpg 2020/05/i8-e1589901218759.jpg
2026/10/theme-banner-huhh1_compressed.jpg 2023/05/ert.jpg 2023/05/OIP.jpeg 2020/05/maxresdefault-1-600x635-1.jpg 2015/06/data-e1589371669556.png 2020/05/CSEI.png 2020/05/ECEI.png 2020/05/MBA.png 2020/05/bab.png
2022/05/amazon-web-services-academy-e1652949088488.jpg 2022/05/bp.png 2022/05/cisco.jpg 2022/05/redhat-e1652949139131.png 2020/04/csc-1.png 2020/04/hp-1.png 2020/04/ibm-2.png 2020/04/info.png 2020/04/valuelabs.png 2020/04/intel.png 2020/04/cts.png 2020/04/cisco-1.png 2020/04/TA.png 2020/04/amazon-2.png 2020/04/wipro-1.png
2022/04/ak1.jpg 2022/04/stu.jpg 2022/04/ARP.jpg 2022/04/ASD.jpg 2022/04/S1-1.jpg 2022/04/S6.jpg 2022/04/S7.jpg 2022/04/S5-1.jpg 2022/04/S8.jpg`.split(/\s+/).filter(Boolean);
EXTRA.forEach(e=>need.add(e));
(async()=>{const failed=[];let n=0,bytes=0;
 const list=[...need];
 for(let k=0;k<list.length;k+=8){await Promise.all(list.slice(k,k+8).map(async r=>{
  const c=path.join(CACHE,r.replace(/\//g,'_'));
  if(!fs.existsSync(c)){const res=await fetch('https://klh.edu.in/wp-content/uploads/'+r).catch(()=>null);if(!res||!res.ok){failed.push(r);return}fs.writeFileSync(c,Buffer.from(await res.arrayBuffer()))}
  const o=path.join(OUT,r);fs.mkdirSync(path.dirname(o),{recursive:true});
  try{const img=sharp(c,{animated:false});const m=await img.metadata();
   if(/\.(gif|svg)$/i.test(r)){fs.copyFileSync(c,o)}
   else if(m.format==='png'){await sharp(c).resize({width:1920,withoutEnlargement:true}).png({palette:m.width>400,quality:88,compressionLevel:9}).toFile(o)}
   else{await sharp(c).rotate().resize({width:1920,withoutEnlargement:true}).jpeg({quality:80,mozjpeg:true}).toFile(o+'.tmp');fs.renameSync(o+'.tmp',o)}
   n++;bytes+=fs.statSync(o).size}catch(e){failed.push(r+' '+e.message)}}))}
 // drop blocks whose image failed
 const bad=new Set(failed.map(f=>f.split(' ')[0]));
 for(const p of Object.values(pages)){p.blocks=p.blocks.filter(b=>!(b.type==='img'&&bad.has(b.src)));if(bad.has(p.banner))p.banner=null}
 fs.mkdirSync(path.join(P,'src','content'),{recursive:true});
 fs.writeFileSync(path.join(P,'src','content','pages.json'),JSON.stringify(pages,null,1));
 // image size manifest used by src/assets/index.js
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
 const man={};for(const f of walk(OUT)){if(f.endsWith('.json'))continue;const m=await sharp(f).metadata();man[path.relative(OUT,f).split(path.sep).join('/')]=[m.width,m.height]}
 fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(man));
 console.log('images',n,'MB',(bytes/1e6).toFixed(1),'failed',failed)})()
