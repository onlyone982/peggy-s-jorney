/* 언어 자동 인식과 번역 (제목 "peggy's journey"는 번역하지 않음)
 *
 * - 브라우저의 언어 설정(navigator.languages)에서 우선순위가 높은 순서로 지원하는 언어를 찾습니다.
 * - 인식하지 못하거나 지원하지 않는 언어면 영어로 보여줍니다.
 * - 테스트: 주소 끝에 ?lang=ja 처럼 붙이면 그 언어로 강제로 볼 수 있습니다.
 * - 새 언어 추가: 아래 DICT에 같은 키로 한 덩어리를 복사해 넣으면 됩니다.
 */
(()=>{
'use strict';

const DICT={
  en:{
    jump:'▲ Jump', slide:'▼ Slide (hold)',
    tip:'PC: Space or ↑ to jump (hold longer to jump higher), ↓ to slide · Mobile: tap to jump (hold longer for a higher jump)',
    press:'PRESS SPACE / TAP', over:'GAME OVER', retry:'SPACE / TAP TO RETRY',
    feed:'Feed peggy more fish 🐟',
    copied:'Link copied! Paste it into {n} to share', failed:"Couldn't copy. Please copy the link from the address bar.",
    copyLink:'Copy link: {n}', shareOn:'Share on {n}', shareGroup:'Share the game link', screen:"peggy's journey game screen",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  ko:{
    jump:'▲ 점프', slide:'▼ 숙이기 (누르고 있기)',
    tip:'PC: 스페이스 또는 ↑ 점프(길게 누르면 더 높이), ↓ 숙이기 · 모바일: 화면을 탭하면 점프(길게 누르면 더 높이)',
    press:'스페이스 / 터치로 시작', over:'게임 오버', retry:'스페이스 / 터치로 다시 시작',
    feed:'페기에게 생선을 더 주세요 🐟',
    copied:'링크를 복사했어요. {n}에 붙여넣어 공유하세요', failed:'복사에 실패했어요. 주소창의 링크를 직접 복사해 주세요',
    copyLink:'링크 복사: {n}', shareOn:'{n}에 공유', shareGroup:'게임 링크 공유', screen:"peggy's journey 게임 화면",
    ig:'인스타그램', fb:'페이스북', rd:'레딧', dc:'디스코드'
  },
  ja:{
    jump:'▲ ジャンプ', slide:'▼ スライディング (長押し)',
    tip:'PC:スペースまたは↑でジャンプ(長押しでより高く)、↓でスライディング ・ スマホ:画面をタップでジャンプ(長押しでより高く)',
    press:'スペース / タップで開始', over:'ゲームオーバー', retry:'スペース / タップでリトライ',
    feed:'ペギーにもっと魚をあげて 🐟',
    copied:'リンクをコピーしました。{n}に貼り付けて共有してください', failed:'コピーできませんでした。アドレスバーのリンクを直接コピーしてください',
    copyLink:'リンクをコピー: {n}', shareOn:'{n}で共有', shareGroup:'ゲームのリンクを共有', screen:"peggy's journey のゲーム画面",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  'zh-CN':{
    jump:'▲ 跳跃', slide:'▼ 滑行(按住)',
    tip:'电脑:空格或↑跳跃(按住越久跳得越高),↓滑行 · 手机:点击屏幕跳跃(按住越久跳得越高)',
    press:'按空格 / 点击开始', over:'游戏结束', retry:'按空格 / 点击重试',
    feed:'多给佩吉一些鱼 🐟',
    copied:'链接已复制,请粘贴到{n}分享', failed:'复制失败,请直接复制地址栏中的链接',
    copyLink:'复制链接:{n}', shareOn:'分享到{n}', shareGroup:'分享游戏链接', screen:"peggy's journey 游戏画面",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  'zh-TW':{
    jump:'▲ 跳躍', slide:'▼ 滑行(按住)',
    tip:'電腦:空白鍵或↑跳躍(按住越久跳得越高),↓滑行 · 手機:點擊螢幕跳躍(按住越久跳得越高)',
    press:'按空白鍵 / 點擊開始', over:'遊戲結束', retry:'按空白鍵 / 點擊重試',
    feed:'多給佩吉一些魚 🐟',
    copied:'連結已複製,請貼到{n}分享', failed:'複製失敗,請直接複製網址列中的連結',
    copyLink:'複製連結:{n}', shareOn:'分享到{n}', shareGroup:'分享遊戲連結', screen:"peggy's journey 遊戲畫面",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  es:{
    jump:'▲ Saltar', slide:'▼ Deslizar (mantener)',
    tip:'PC: Espacio o ↑ para saltar (mantén para saltar más alto), ↓ para deslizar · Móvil: toca para saltar (mantén para más altura)',
    press:'PULSA ESPACIO / TOCA', over:'FIN DEL JUEGO', retry:'ESPACIO / TOCA: REINTENTAR',
    feed:'Dale más pescado a Peggy 🐟',
    copied:'¡Enlace copiado! Pégalo en {n} para compartir', failed:'No se pudo copiar. Copia el enlace de la barra de direcciones.',
    copyLink:'Copiar enlace: {n}', shareOn:'Compartir en {n}', shareGroup:'Compartir el enlace del juego', screen:"pantalla del juego peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  fr:{
    jump:'▲ Sauter', slide:'▼ Glisser (maintenir)',
    tip:"PC : Espace ou ↑ pour sauter (maintenez pour sauter plus haut), ↓ pour glisser · Mobile : touchez pour sauter (maintenez pour plus de hauteur)",
    press:'ESPACE / TOUCHEZ', over:'PARTIE TERMINÉE', retry:'ESPACE / TOUCHEZ : REJOUER',
    feed:'Donne plus de poisson à Peggy 🐟',
    copied:'Lien copié ! Collez-le sur {n} pour partager', failed:"Copie impossible. Copiez le lien depuis la barre d'adresse.",
    copyLink:'Copier le lien : {n}', shareOn:'Partager sur {n}', shareGroup:'Partager le lien du jeu', screen:"écran du jeu peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  de:{
    jump:'▲ Springen', slide:'▼ Rutschen (halten)',
    tip:'PC: Leertaste oder ↑ zum Springen (länger halten = höher), ↓ zum Rutschen · Handy: Tippen zum Springen (länger halten = höher)',
    press:'LEERTASTE / TIPPEN', over:'SPIEL VORBEI', retry:'LEERTASTE / TIPPEN: NOCHMAL',
    feed:'Gib Peggy mehr Fisch 🐟',
    copied:'Link kopiert! Füge ihn in {n} ein, um ihn zu teilen', failed:'Kopieren fehlgeschlagen. Bitte kopiere den Link aus der Adressleiste.',
    copyLink:'Link kopieren: {n}', shareOn:'Auf {n} teilen', shareGroup:'Spiel-Link teilen', screen:"Spielbildschirm von peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  pt:{
    jump:'▲ Pular', slide:'▼ Deslizar (segurar)',
    tip:'PC: Espaço ou ↑ para pular (segure para pular mais alto), ↓ para deslizar · Celular: toque para pular (segure para mais altura)',
    press:'ESPAÇO / TOQUE', over:'FIM DE JOGO', retry:'ESPAÇO / TOQUE: DE NOVO',
    feed:'Dê mais peixe à Peggy 🐟',
    copied:'Link copiado! Cole no {n} para compartilhar', failed:'Não foi possível copiar. Copie o link da barra de endereços.',
    copyLink:'Copiar link: {n}', shareOn:'Compartilhar no {n}', shareGroup:'Compartilhar o link do jogo', screen:"tela do jogo peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  ru:{
    jump:'▲ Прыжок', slide:'▼ Скольжение (удерживать)',
    tip:'ПК: пробел или ↑ — прыжок (дольше держите — выше), ↓ — скольжение · Телефон: касание — прыжок (дольше — выше)',
    press:'ПРОБЕЛ / КАСАНИЕ', over:'ИГРА ОКОНЧЕНА', retry:'ПРОБЕЛ / КАСАНИЕ: ЗАНОВО',
    feed:'Накорми Пегги ещё рыбкой 🐟',
    copied:'Ссылка скопирована! Вставьте её в {n}, чтобы поделиться', failed:'Не удалось скопировать. Скопируйте ссылку из адресной строки.',
    copyLink:'Копировать ссылку: {n}', shareOn:'Поделиться в {n}', shareGroup:'Поделиться ссылкой на игру', screen:"экран игры peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  }
};

// 언어 코드(예: "ko-KR", "zh-Hant-TW", "pt-BR")를 DICT의 키로 바꿈. 지원하지 않으면 null
const toKey=code=>{
  const s=String(code||'').toLowerCase().replace(/_/g,'-');
  if(!s)return null;
  const base=s.split('-')[0];
  if(base==='zh')return /(^|-)(tw|hk|mo|hant)(-|$)/.test(s)?'zh-TW':'zh-CN';
  return DICT[base]?base:null;
};

const detect=()=>{
  let forced=null;
  try{forced=new URLSearchParams(location.search).get('lang')}catch(e){}
  const list=[forced].concat((navigator.languages&&navigator.languages.length)?Array.from(navigator.languages):[navigator.language]);
  for(const l of list){const k=toKey(l);if(k)return k}
  return 'en';                                   // 인식 실패 또는 미지원 → 영어
};

const lang=detect();
const t=(key,n)=>{
  const s=(DICT[lang][key]!==undefined?DICT[lang][key]:DICT.en[key])||'';
  return n===undefined?s:s.replace('{n}',n);
};

// HTML에 적용: data-i18n(글자), data-i18n-aria(스크린리더 이름), 공유 버튼
const apply=()=>{
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=t(e.dataset.i18n)});
  document.querySelectorAll('[data-i18n-aria]').forEach(e=>{e.setAttribute('aria-label',t(e.dataset.i18nAria))});
  const g=document.querySelector('.share');if(g)g.setAttribute('aria-label',t('shareGroup'));
  document.querySelectorAll('.share button').forEach(b=>{
    const n=t(b.dataset.key);b.dataset.name=n;
    b.setAttribute('aria-label',t('copyLink',n));b.title=t('shareOn',n);
  });
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();

window.I18N={lang,t};
})();
