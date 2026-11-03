const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
for(const [w,h] of [[1440,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.goto('http://localhost:4174/');
await p.locator('#stories').scrollIntoViewIfNeeded();await p.waitForTimeout(1200);await p.locator('#stories').screenshot({path:`shots/stories_${w}.png`});}
await b.close()})()
