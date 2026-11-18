// `npx cap add android` 를 한 번 실행한 뒤에 한 번만 실행하세요: 앱을 가로 화면으로 고정합니다.
// 실행: node scripts/android-setup.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (!existsSync(manifest)) { console.error('android 폴더가 없습니다. 먼저 `npx cap add android`를 실행하세요.'); process.exit(1); }

let xml = readFileSync(manifest, 'utf8');
if (xml.includes('android:screenOrientation')) { console.log('이미 설정되어 있습니다.'); process.exit(0); }
const before = xml;
xml = xml.replace(/(<activity\b)/, '$1\n            android:screenOrientation="sensorLandscape"');
if (xml === before) { console.error('<activity> 태그를 찾지 못했습니다. AndroidManifest.xml을 직접 열어 확인하세요.'); process.exit(1); }
writeFileSync(manifest, xml);
console.log('가로 고정(sensorLandscape) 적용 완료');
