import fs from 'node:fs';
const raw=fs.readFileSync(new URL('../source/questions-original.txt',import.meta.url),'utf8').replace(/\r/g,'');
const sections=[
 ['foundations','AI & Robotics #1',null,'AI & Robotics #2 — 50 Multiple Choice Questions'],
 ['perception','Robot Perception & Control','Phần 1 — Perception & Control','🔥 Những phần nên học thuộc'],
 ['motion','Sensor & Motion Control','AI & Robotics #3 — Sensor & Motion Control','🔥 Học cấp tốc'],
 ['vision','Computer Vision for Robotics','AI & Robotics — Computer Vision for Robotics','Phần cần thuộc nhất'],
 ['navigation','Autonomous Navigation','AI & Robotics — Autonomous Navigation','🔥 Phần nên học thuộc trước khi thi']
];
const bank=sections.map(([id,title,start,end])=>{
 let body=start ? raw.slice(raw.indexOf(start)+start.length) : raw; const stop=body.indexOf(end); if(stop>=0)body=body.slice(0,stop);
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
  explanation=explanation.split(/\n(?:Phần \d+|🔥|📌|Core Principles|Core Components|Key Components|Ideas|Computer Vision Models|Applications|Object Detection|Semantic Segmentation|Keypoint Detection|Convolutional Neural|Generative Models|CNN|YOLO|Faster R-CNN|SSD|RetinaNet|Index|Sensor & Motion Control|How Computer Vision Works|Main Uses|Capabilities of Autonomous Systems|Project Ideas)(?:[^\n]*)$/m)[0].trim();
  return {id:id+'-'+m[1],number:+m[1],en:stem[0],vi:stem.slice(1).join('\n'),options,correct:ans[1],explanation};
 });
 if(questions.length!==50)throw Error(id+' count '+questions.length);
 return {id,title,questions};
});
const translationsPath=new URL('../source/translations.json',import.meta.url);
const translations=fs.existsSync(translationsPath)?JSON.parse(fs.readFileSync(translationsPath,'utf8')):{};
const foundationTranslations={
 'Mechanical system':'Hệ thống cơ khí','Computing/Controller':'Bộ tính toán/Bộ điều khiển','Sensor':'Cảm biến','Wheel':'Bánh xe','Software/AI':'Phần mềm/AI','AI':'Trí tuệ nhân tạo','Email Robot':'Robot email','Database Robot':'Robot cơ sở dữ liệu','Browser Robot':'Robot trình duyệt','Industrial Robot':'Robot công nghiệp','Service Robot':'Robot dịch vụ',
 'Sensor → AI → Motor':'Cảm biến → AI → Động cơ','Sensor → Rule → Motor':'Cảm biến → Quy tắc → Động cơ','AI → Decision → Motor':'AI → Quyết định → Động cơ','Camera → AI → Motor':'Camera → AI → Động cơ','Rule':'Quy tắc','Perception':'Nhận thức','Decision':'Quyết định','Sensor/Camera → Perception → AI → Decision → Control → Motor':'Cảm biến/Camera → Nhận thức → AI → Quyết định → Điều khiển → Động cơ','Motor → AI → Sensor':'Động cơ → AI → Cảm biến','AI → Camera → Control':'AI → Camera → Điều khiển','Control':'Điều khiển','Camera':'Camera',
 'AI Robot':'Robot AI','Traditional Robot':'Robot truyền thống','Autonomous AI Robot':'Robot AI tự hành','Both robots':'Cả hai robot','Neither robot':'Không robot nào','AI-enabled Robot':'Robot tích hợp AI','Manual Robot':'Robot thủ công','Mechanical Robot':'Robot cơ khí','Input → Processing → Decision → Output':'Đầu vào → Xử lý → Quyết định → Đầu ra','Output → Processing → Input → Decision':'Đầu ra → Xử lý → Đầu vào → Quyết định','Decision → Input → Output':'Quyết định → Đầu vào → Đầu ra','Processing → Output → Input':'Xử lý → Đầu ra → Đầu vào','Input':'Đầu vào','Output':'Đầu ra','Physical action':'Hành động vật lý','Processing':'Xử lý',
 'A website':'Một website','A mobile application':'Một ứng dụng di động','A one-page Robot System Architecture':'Một trang Kiến trúc Hệ thống Robot','A database':'Một cơ sở dữ liệu','Sensors/Camera':'Cảm biến/Camera','Data':'Dữ liệu','Rules':'Các quy tắc','Physical World':'Thế giới vật lý','Sensor data':'Dữ liệu cảm biến','AI model':'Mô hình AI','Warehouse robot':'Robot kho hàng','Web server':'Máy chủ web','Email client':'Ứng dụng email','Search engine':'Công cụ tìm kiếm','Agricultural robot':'Robot nông nghiệp','Delivery robot':'Robot giao hàng','Database robot':'Robot cơ sở dữ liệu','Web robot':'Robot web','Autonomous vehicle':'Phương tiện tự hành','Website':'Website','Cloud server':'Máy chủ đám mây','Autonomous delivery robot':'Robot giao hàng tự hành','Industrial printer':'Máy in công nghiệp','Service database':'Cơ sở dữ liệu dịch vụ','Social media robot':'Robot mạng xã hội',
 'Intelligent Robotics System':'Hệ thống robot thông minh','AI & Computer Vision for Robotics':'AI & Thị giác máy tính cho Robotics','Session 2':'Buổi 2','Session 3':'Buổi 3','Session 5':'Buổi 5','Session 8':'Buổi 8','An intelligent robot system':'Một hệ thống robot thông minh','A social network':'Một mạng xã hội','A database server':'Một máy chủ cơ sở dữ liệu','The environmental state':'Trạng thái môi trường','Email content':'Nội dung email','Objects or states':'Đối tượng hoặc trạng thái','Only passwords':'Chỉ mật khẩu','Only websites':'Chỉ website','Only databases':'Chỉ cơ sở dữ liệu','AI, sensors, and control':'AI, cảm biến và điều khiển','HTML, CSS, and JavaScript':'HTML, CSS và JavaScript','Email, browser, and database':'Email, trình duyệt và cơ sở dữ liệu','Keyboard, mouse, and monitor':'Bàn phím, chuột và màn hình'
};
const missing=new Set();
const english={'Mô-men xoắn':'Torque','Khoảng cách':'Distance','Ánh sáng':'Light','Hình ảnh':'Images','Các lệnh chính xác cho cơ cấu chấp hành':'Precise actuator commands','Dữ liệu camera':'Camera data','Bản đồ Internet':'Internet map','Tốc độ mạng':'Network speed','Vị trí':'Position','Vận tốc':'Velocity','Quỹ đạo':'Trajectory','Gia tốc':'Acceleration','Lực':'Force','Cảm biến':'Sensor','Động cơ':'Motor','Nhiều trục':'Multiple axes','Một cảm biến':'One sensor','Một động cơ':'One motor','Một nguồn điện':'One power supply'};
for(const c of bank)for(const q of c.questions)for(const o of q.options)if(english[o.en]){o.vi=o.en;o.en=english[o.en];o.translated=true;}
for(const c of bank)for(const q of c.questions)for(const o of q.options)if(!o.vi){const vi=translations[o.en]??foundationTranslations[o.en];if(vi){o.vi=vi;o.translated=true;}else if(/^[\d\s.%+−–-]+$/.test(o.en)){o.vi=o.en;}else missing.add(o.en);}
fs.writeFileSync(new URL('../source/missing-translations.json',import.meta.url),JSON.stringify([...missing],null,2));
fs.writeFileSync(new URL('../dist/questions.js',import.meta.url),'window.QUESTION_BANK = '+JSON.stringify(bank,null,2)+';\n');
console.log(JSON.stringify({chapters:bank.map(c=>[c.title,c.questions.length]),missingTranslations:missing.size}));

