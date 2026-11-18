// 웹 게임 파일을 www/ 폴더로 복사합니다. Capacitor가 이 폴더를 앱 안에 넣습니다.
// 실행: node scripts/build-www.mjs   (또는 npm run build:www)
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const items = ['index.html', 'privacy.html', 'css', 'js', 'assets'];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const name of items) {
  const from = join(root, name);
  if (!existsSync(from)) { console.error('없는 파일:', name); process.exit(1); }
  cpSync(from, join(out, name), { recursive: true });
}
console.log('www/ 준비 완료:', items.join(', '));
