const fs=require('fs');
const p='dist/app.js';let s=fs.readFileSync(p,'utf8');
const old="${s.mode==='practice'&&!checked?`<button class=\"primary\" data-action=\"check\" ${!selected?'disabled':''}>Kiểm tra đáp án</button>`:`<button class=\"primary\" data-action=\"next\" ${!selected?'disabled':''}>${s.index===s.items.length-1?'Nộp bài':'Next →'}</button>`}";
if(!s.includes(old))throw Error('Expected button not found');
s=s.replace(old,"<button class=\"primary\" data-action=\"next\" ${!selected?'disabled':''}>${s.index===s.items.length-1?'Nộp bài':'Next →'}</button>");
fs.writeFileSync(p,s);
const t='scripts/verify.cjs';s=fs.readFileSync(t,'utf8').replace('chromium.launch({headless:true})',"chromium.launch({headless:true,channel:'chrome'})").replace("assert.equal(await page.locator('.feedback').count(),0);\n  if(i===0)","assert.equal(await page.locator('.feedback').count(),1);\n  if(i===0)").replace("await page.click('[data-action=\"check\"]');",'');
fs.writeFileSync(t,s);
