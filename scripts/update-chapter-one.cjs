const fs = require('node:fs');

function replaceExact(path, replacements) {
  let text = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!text.includes(from)) throw new Error(`${path}: expected text not found: ${from}`);
    text = text.replace(from, to);
  }
  fs.writeFileSync(path, text);
}

replaceExact('dist/app.js', [
  ["chapter='perception'", "chapter='foundations'"],
  ['<b>200</b><span>Câu hỏi · 4 chương</span>', '<b>250</b><span>Câu hỏi · 5 chương</span>'],
  [' / 200</small>', ' / 250</small>'],
  ["['Nhận thức & điều khiển robot','Cảm biến & điều khiển chuyển động','Thị giác máy tính cho robot','Điều hướng tự hành']", "['Nền tảng AI & Robotics','Nhận thức & điều khiển robot','Cảm biến & điều khiển chuyển động','Thị giác máy tính cho robot','Điều hướng tự hành']"]
]);

replaceExact('dist/index.html', [
  ['200 câu hỏi song ngữ', '250 câu hỏi song ngữ']
]);

replaceExact('README.md', [
  ['gồm 4 chương × 50 câu', 'gồm 5 chương × 50 câu'],
  ['`dist/questions.js`: 200 câu song ngữ.', '`dist/questions.js`: 250 câu song ngữ.'],
  ['Chọn đúng 4 bộ #2–#5, mỗi bộ 50 câu. Bộ nhập môn #1 và các câu bổ sung ngoài 4 bộ chính không đưa vào bài thi.', 'Chọn đúng 5 bộ #1–#5, mỗi bộ 50 câu. Bộ #1 là Chương 1; Robot Perception & Control là Chương 2.']
]);

replaceExact('scripts/verify.cjs', [
  ["[50,50,50,50]", "[50,50,50,50,50]"],
  ['200 bilingual questions', '250 bilingual questions']
]);
