const {chromium}=require('C:/Users/Admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{document.modelContext={registerTool(t){window.testTool=t;}};});
 await page.goto('http://127.0.0.1:4173');
 await page.screenshot({path:'desktop-preview.png',fullPage:true});
 assert.equal(await page.locator('.chapter').count(),5);
 const data=await page.evaluate(()=>window.QUESTION_BANK);assert.deepEqual(data.map(c=>c.questions.length),[50,50,50,50,50]);
 for(const c of data)for(const q of c.questions){assert(q.en&&q.vi);assert.equal(q.options.length,4);assert(q.options.every(o=>o.en&&o.vi));assert(q.options.some(o=>o.id===q.correct));}
 const mcp=await page.evaluate(()=>{const t=window.testTool;const good=t.execute({});let rejects=false;try{t.execute({bad:true});}catch{rejects=true;}return {name:t.name,good,rejects};});assert.equal(mcp.name,'get_study_progress');assert(mcp.rejects);assert.equal(mcp.good.completed,0);
 await page.click('[data-action="start"]');
 for(let i=0;i<10;i++){
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('robotics-study-v1')).active);const q=data.flatMap(c=>c.questions).find(q=>q.id===state.items[state.index].id);const answer=i===0?q.options.find(o=>o.id!==q.correct).id:q.correct;
  await page.click(`[data-answer="${answer}"]`);assert.equal(await page.locator('.feedback').count(),1);
  if(i===0){await page.reload();assert.equal(await page.locator('.resume').count(),1);await page.click('[data-action="resume"]');assert.equal(await page.locator('.answer.selected').count(),1);}
  assert.equal(await page.locator('.answer.correct').count(),1);assert.equal(await page.locator('.feedback').count(),1);
  if(i===0)await page.screenshot({path:'practice-preview.png',fullPage:true});
  await page.click('[data-action="next"]');
 }
 assert.equal(await page.locator('.score-number').innerText(),'90%');assert.equal(await page.locator('details.review').count(),1);await page.click('[data-action="retry"]');assert.equal(await page.locator('.qdot').count(),1);
 await page.click('[data-action="home"]');await page.click('[data-mode="exam"]');await page.click('[data-count="20"]');await page.click('[data-action="start"]');await page.click('[data-confirm]');assert.equal(await page.locator('.qdot').count(),20);
 await page.click('[data-index="19"]');await page.click('.answer:first-child');await page.click('[data-action="next"]');assert.equal(await page.locator('.qdot.current').innerText(),'1');assert.equal(await page.locator('.score-number').count(),0);
 for(let i=0;i<20;i++){await page.click(`[data-index="${i}"]`);const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('robotics-study-v1')).active);const q=data.flatMap(c=>c.questions).find(q=>q.id===state.items[state.index].id);await page.click(`[data-answer="${q.correct}"]`);assert.equal(await page.locator('.feedback').count(),0);assert.equal(await page.locator('.answer.correct').count(),0);if(i===19)await page.click('[data-action="next"]');}
 assert.equal(await page.locator('.score-number').innerText(),'100%');await page.click('[data-action="history"]');assert.equal(await page.locator('.history-row').count(),2);await page.reload();await page.click('[data-action="history"]');assert.equal(await page.locator('.history-row').count(),2);
 await page.click('[data-action="home"]');await page.click('[data-count="50"]');await page.click('[data-action="start"]');const fifty=await page.evaluate(()=>JSON.parse(localStorage.getItem('robotics-study-v1')).active);assert.equal(new Set(fifty.items.map(i=>i.id)).size,50);assert(fifty.items.some(i=>i.order.join('')!=='ABCD'));
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'mobile-quiz-preview.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.click('[data-action="home"]');await page.screenshot({path:'mobile-preview.png',fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 250 bilingual questions; Practice feedback gating; shuffled answer scoring; Exam secrecy; unanswered submission; wrong-only retry; resume; history; 10/20/50; mobile overflow; WebMCP valid/invalid input.');
})().catch(e=>{console.error(e);process.exit(1);});
