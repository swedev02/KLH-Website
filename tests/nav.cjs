const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const w of [1440,1280,1024]){const p=await b.newPage({viewport:{width:w,height:300}});await p.goto('http://localhost:4174/rankings');await p.screenshot({path:`shots/nav_${w}.png`,clip:{x:0,y:0,width:w,height:80}});}
await b.close()})()
