import fs from 'node:fs';
const raw=fs.readFileSync(new URL('../source/questions-original.txt',import.meta.url),'utf8').replace(/\r/g,'');
const sections=[['perception','Robot Perception & Control','Phần 1 — Perception & Control','🔥 Những phần nên học thuộc'],['motion','Sensor & Motion Control','AI & Robotics #3 — Sensor & Motion Control','🔥 Học cấp tốc'],['vision','Computer Vision for Robotics','AI & Robotics — Computer Vision for Robotics','Phần cần thuộc nhất'],['navigation','Autonomous Navigation','AI & Robotics — Autonomous Navigation','🔥 Phần nên học thuộc trước khi thi']];
const bank=sections.map(([id,title,start,end])=>{
 let body=raw.slice(raw.indexOf(start)+start.length); const stop=body.indexOf(end); if(stop>=0)body=body.slice(0,stop);
 const re=id==='motion'?/^(\d+)\. (.+)$/gm:/^Câu (\d+)\s*$/gm;
 const marks=[...body.matchAll(re)].filter(m=>+m[1]<=50);
 const questions=marks.map((m,i)=>{
  const block=(m[2]?m[2]+'\n':'')+body.slice(m.index+m[0].length,marks[i+1]?.index??body.length).trim();
  const opts=[...block.matchAll(/^([ABCD])\. (.*)$/gm)];
  const ans=/^Answer:\s*([ABCD])/m.exec(block); const ex=/^Giải thích:\s*/m.exec(block);
  if(opts.length!==4||!ans)throw Error(id+' '+m[1]+' invalid');
  const stem=block.slice(0,opts[0].index).trim().split('\n').map(x=>x.trim()).filter(Boolean);
  const options=opts.map((o,j)=>{const text=block.slice(o.index+3,opts[j+1]?.index??ans.index).trim();const lines=text.split('\n').map(x=>x.trim()).filter(Boolean);const pair=lines[0].split(' — ');return {id:o[1],en:pair[0],vi:pair.length>1?pair.slice(1).join(' — '):lines.slice(1).join('\n'),original:text};});
  let explanation=ex?block.slice(ex.index+ex[0].length).trim():'';
  // Section headings follow some explanations; they are not part of the answer.
  explanation=explanation.split(/\n(?:Phần \d+|🔥|📌|Core Principles|Core Components|Key Components|Ideas|Computer Vision Models|Applications|Object Detection|Semantic Segmentation|Keypoint Detection|Convolutional Neural|Generative Models|CNN|YOLO|Faster R-CNN|SSD|RetinaNet|Index|Sensor & Motion Control|How Computer Vision Works|Main Uses|Capabilities of Autonomous Systems|Project Ideas)(?:[^\n]*)$/m)[0].trim();
  return {id:id+'-'+m[1],number:+m[1],en:stem[0],vi:stem.slice(1).join('\n'),options,correct:ans[1],explanation};
 });
 if(questions.length!==50)throw Error(id+' count '+questions.length);
 return {id,title,questions};
});
const translationsPath=new URL('../source/translations.json',import.meta.url);
const translations=fs.existsSync(translationsPath)?JSON.parse(fs.readFileSync(translationsPath,'utf8')):{};
const missing=new Set();
const english={'Mô-men xoắn':'Torque','Khoảng cách':'Distance','Ánh sáng':'Light','Hình ảnh':'Images','Các lệnh chính xác cho cơ cấu chấp hành':'Precise actuator commands','Dữ liệu camera':'Camera data','Bản đồ Internet':'Internet map','Tốc độ mạng':'Network speed','Vị trí':'Position','Vận tốc':'Velocity','Quỹ đạo':'Trajectory','Gia tốc':'Acceleration','Lực':'Force','Cảm biến':'Sensor','Động cơ':'Motor','Nhiều trục':'Multiple axes','Một cảm biến':'One sensor','Một động cơ':'One motor','Một nguồn điện':'One power supply'};
for(const c of bank)for(const q of c.questions)for(const o of q.options)if(english[o.en]){o.vi=o.en;o.en=english[o.en];o.translated=true;}
for(const c of bank)for(const q of c.questions)for(const o of q.options)if(!o.vi){if(translations[o.en]){o.vi=translations[o.en];o.translated=true;}else if(/^[\d\s.%+−–-]+$/.test(o.en)){o.vi=o.en;}else missing.add(o.en);}
fs.writeFileSync(new URL('../source/missing-translations.json',import.meta.url),JSON.stringify([...missing],null,2));
fs.writeFileSync(new URL('../dist/questions.js',import.meta.url),'window.QUESTION_BANK = '+JSON.stringify(bank,null,2)+';\n');
console.log(JSON.stringify({chapters:bank.map(c=>[c.title,c.questions.length]),missingTranslations:missing.size}));

