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
    privacy:'Privacy',
    dlgTitle:'Peggy is still hungry! 🐧', dlgBody:'Peggy ate {f} fish this run, but she wants more. Help her out at {d}. It opens in a new tab.', dlgGo:'Go to {d}', dlgNo:'Not now', mute:'Mute sound', unmute:'Turn sound on', shareScore:'Peggy ate {f} fish and ran {s} points! Can you beat her? 🐧', shareIdle:"Run with Peggy in peggy's journey! 🐧",
    jump:'▲ Jump', slide:'▼ Slide (hold)',
    tip:'PC: Space or ↑ to jump (hold longer to jump higher), ↓ to slide · Mobile: tap to jump (hold longer for a higher jump)',
    press:'PRESS SPACE / TAP', over:'GAME OVER', retry:'SPACE / TAP TO RETRY',
    feed:'Feed peggy more fish 🐟',
    copied:'Link copied! Paste it into {n} to share', failed:"Couldn't copy. Please copy the link from the address bar.",
    copyLink:'Copy link: {n}', shareOn:'Share on {n}', shareGroup:'Share the game link', screen:"peggy's journey game screen",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  ko:{
    privacy:'개인정보처리방침',
    dlgTitle:'페기가 아직 배고파요! 🐧', dlgBody:'페기가 이번 판에 생선을 {f}마리 먹었지만 더 먹고 싶대요. {d}에서 페기를 도와주세요. 새 탭으로 열려요.', dlgGo:'{d}로 이동', dlgNo:'다음에요', mute:'소리 끄기', unmute:'소리 켜기', shareScore:'페기가 생선 {f}마리를 먹고 {s}점을 달렸어요! 이길 수 있어요? 🐧', shareIdle:"페기와 함께 달려요, peggy's journey! 🐧",
    jump:'▲ 점프', slide:'▼ 숙이기 (누르고 있기)',
    tip:'PC: 스페이스 또는 ↑ 점프(길게 누르면 더 높이), ↓ 숙이기 · 모바일: 화면을 탭하면 점프(길게 누르면 더 높이)',
    press:'스페이스 / 터치로 시작', over:'게임 오버', retry:'스페이스 / 터치로 다시 시작',
    feed:'페기에게 생선을 더 주세요 🐟',
    copied:'링크를 복사했어요. {n}에 붙여넣어 공유하세요', failed:'복사에 실패했어요. 주소창의 링크를 직접 복사해 주세요',
    copyLink:'링크 복사: {n}', shareOn:'{n}에 공유', shareGroup:'게임 링크 공유', screen:"peggy's journey 게임 화면",
    ig:'인스타그램', fb:'페이스북', rd:'레딧', dc:'디스코드'
  },
  ja:{
    privacy:'プライバシー',
    dlgTitle:'ペギーはまだお腹ぺこぺこ! 🐧', dlgBody:'ペギーは今回、魚を{f}匹食べましたが、もっと食べたいそうです。{d}でペギーを助けてあげてください。新しいタブで開きます。', dlgGo:'{d}へ移動', dlgNo:'今はやめておく', mute:'音を消す', unmute:'音を出す', shareScore:'ペギーは魚を{f}匹食べて{s}点まで走りました!あなたは勝てる? 🐧', shareIdle:"ペギーと一緒に走ろう、peggy's journey! 🐧",
    jump:'▲ ジャンプ', slide:'▼ スライディング (長押し)',
    tip:'PC:スペースまたは↑でジャンプ(長押しでより高く)、↓でスライディング ・ スマホ:画面をタップでジャンプ(長押しでより高く)',
    press:'スペース / タップで開始', over:'ゲームオーバー', retry:'スペース / タップでリトライ',
    feed:'ペギーにもっと魚をあげて 🐟',
    copied:'リンクをコピーしました。{n}に貼り付けて共有してください', failed:'コピーできませんでした。アドレスバーのリンクを直接コピーしてください',
    copyLink:'リンクをコピー: {n}', shareOn:'{n}で共有', shareGroup:'ゲームのリンクを共有', screen:"peggy's journey のゲーム画面",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  'zh-CN':{
    privacy:'隐私政策',
    dlgTitle:'佩吉还饿着呢! 🐧', dlgBody:'佩吉这一局吃了{f}条鱼,但它还想吃更多。请到{d}帮帮它,将在新标签页中打开。', dlgGo:'前往 {d}', dlgNo:'以后再说', mute:'静音', unmute:'开启声音', shareScore:'佩吉吃了{f}条鱼,跑出了{s}分!你能超过它吗? 🐧', shareIdle:"和佩吉一起奔跑吧,peggy's journey! 🐧",
    jump:'▲ 跳跃', slide:'▼ 滑行(按住)',
    tip:'电脑:空格或↑跳跃(按住越久跳得越高),↓滑行 · 手机:点击屏幕跳跃(按住越久跳得越高)',
    press:'按空格 / 点击开始', over:'游戏结束', retry:'按空格 / 点击重试',
    feed:'多给佩吉一些鱼 🐟',
    copied:'链接已复制,请粘贴到{n}分享', failed:'复制失败,请直接复制地址栏中的链接',
    copyLink:'复制链接:{n}', shareOn:'分享到{n}', shareGroup:'分享游戏链接', screen:"peggy's journey 游戏画面",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  'zh-TW':{
    privacy:'隱私權政策',
    dlgTitle:'佩吉還餓著呢! 🐧', dlgBody:'佩吉這一局吃了{f}條魚,但牠還想吃更多。請到{d}幫幫牠,將在新分頁中開啟。', dlgGo:'前往 {d}', dlgNo:'下次再說', mute:'靜音', unmute:'開啟聲音', shareScore:'佩吉吃了{f}條魚,跑出了{s}分!你能超越牠嗎? 🐧', shareIdle:"和佩吉一起奔跑吧,peggy's journey! 🐧",
    jump:'▲ 跳躍', slide:'▼ 滑行(按住)',
    tip:'電腦:空白鍵或↑跳躍(按住越久跳得越高),↓滑行 · 手機:點擊螢幕跳躍(按住越久跳得越高)',
    press:'按空白鍵 / 點擊開始', over:'遊戲結束', retry:'按空白鍵 / 點擊重試',
    feed:'多給佩吉一些魚 🐟',
    copied:'連結已複製,請貼到{n}分享', failed:'複製失敗,請直接複製網址列中的連結',
    copyLink:'複製連結:{n}', shareOn:'分享到{n}', shareGroup:'分享遊戲連結', screen:"peggy's journey 遊戲畫面",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  es:{
    privacy:'Privacidad',
    dlgTitle:'¡Peggy todavía tiene hambre! 🐧', dlgBody:'Peggy se comió {f} pescados en esta partida, pero quiere más. Ayúdala en {d}. Se abrirá en una pestaña nueva.', dlgGo:'Ir a {d}', dlgNo:'Ahora no', mute:'Silenciar', unmute:'Activar sonido', shareScore:'¡Peggy se comió {f} pescados y corrió {s} puntos! ¿Puedes superarla? 🐧', shareIdle:"¡Corre con Peggy en peggy's journey! 🐧",
    jump:'▲ Saltar', slide:'▼ Deslizar (mantener)',
    tip:'PC: Espacio o ↑ para saltar (mantén para saltar más alto), ↓ para deslizar · Móvil: toca para saltar (mantén para más altura)',
    press:'PULSA ESPACIO / TOCA', over:'FIN DEL JUEGO', retry:'ESPACIO / TOCA: REINTENTAR',
    feed:'Dale más pescado a Peggy 🐟',
    copied:'¡Enlace copiado! Pégalo en {n} para compartir', failed:'No se pudo copiar. Copia el enlace de la barra de direcciones.',
    copyLink:'Copiar enlace: {n}', shareOn:'Compartir en {n}', shareGroup:'Compartir el enlace del juego', screen:"pantalla del juego peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  fr:{
    privacy:'Confidentialité',
    dlgTitle:'Peggy a encore faim ! 🐧', dlgBody:"Peggy a mangé {f} poissons cette partie, mais elle en veut encore. Aide-la sur {d}. Le site s'ouvre dans un nouvel onglet.", dlgGo:'Aller sur {d}', dlgNo:'Plus tard', mute:'Couper le son', unmute:'Activer le son', shareScore:'Peggy a mangé {f} poissons et couru {s} points ! Peux-tu la battre ? 🐧', shareIdle:"Cours avec Peggy dans peggy's journey ! 🐧",
    jump:'▲ Sauter', slide:'▼ Glisser (maintenir)',
    tip:"PC : Espace ou ↑ pour sauter (maintenez pour sauter plus haut), ↓ pour glisser · Mobile : touchez pour sauter (maintenez pour plus de hauteur)",
    press:'ESPACE / TOUCHEZ', over:'PARTIE TERMINÉE', retry:'ESPACE / TOUCHEZ : REJOUER',
    feed:'Donne plus de poisson à Peggy 🐟',
    copied:'Lien copié ! Collez-le sur {n} pour partager', failed:"Copie impossible. Copiez le lien depuis la barre d'adresse.",
    copyLink:'Copier le lien : {n}', shareOn:'Partager sur {n}', shareGroup:'Partager le lien du jeu', screen:"écran du jeu peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  de:{
    privacy:'Datenschutz',
    dlgTitle:'Peggy hat noch Hunger! 🐧', dlgBody:'Peggy hat in dieser Runde {f} Fische gefressen, will aber mehr. Hilf ihr auf {d}. Die Seite öffnet sich in einem neuen Tab.', dlgGo:'Zu {d}', dlgNo:'Jetzt nicht', mute:'Ton aus', unmute:'Ton an', shareScore:'Peggy hat {f} Fische gefressen und {s} Punkte erreicht! Schaffst du mehr? 🐧', shareIdle:"Lauf mit Peggy in peggy's journey! 🐧",
    jump:'▲ Springen', slide:'▼ Rutschen (halten)',
    tip:'PC: Leertaste oder ↑ zum Springen (länger halten = höher), ↓ zum Rutschen · Handy: Tippen zum Springen (länger halten = höher)',
    press:'LEERTASTE / TIPPEN', over:'SPIEL VORBEI', retry:'LEERTASTE / TIPPEN: NOCHMAL',
    feed:'Gib Peggy mehr Fisch 🐟',
    copied:'Link kopiert! Füge ihn in {n} ein, um ihn zu teilen', failed:'Kopieren fehlgeschlagen. Bitte kopiere den Link aus der Adressleiste.',
    copyLink:'Link kopieren: {n}', shareOn:'Auf {n} teilen', shareGroup:'Spiel-Link teilen', screen:"Spielbildschirm von peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  pt:{
    privacy:'Privacidade',
    dlgTitle:'A Peggy ainda está com fome! 🐧', dlgBody:'A Peggy comeu {f} peixes nesta partida, mas quer mais. Ajude-a em {d}. Abre em uma nova aba.', dlgGo:'Ir para {d}', dlgNo:'Agora não', mute:'Silenciar', unmute:'Ativar som', shareScore:'A Peggy comeu {f} peixes e correu {s} pontos! Você consegue superá-la? 🐧', shareIdle:"Corra com a Peggy em peggy's journey! 🐧",
    jump:'▲ Pular', slide:'▼ Deslizar (segurar)',
    tip:'PC: Espaço ou ↑ para pular (segure para pular mais alto), ↓ para deslizar · Celular: toque para pular (segure para mais altura)',
    press:'ESPAÇO / TOQUE', over:'FIM DE JOGO', retry:'ESPAÇO / TOQUE: DE NOVO',
    feed:'Dê mais peixe à Peggy 🐟',
    copied:'Link copiado! Cole no {n} para compartilhar', failed:'Não foi possível copiar. Copie o link da barra de endereços.',
    copyLink:'Copiar link: {n}', shareOn:'Compartilhar no {n}', shareGroup:'Compartilhar o link do jogo', screen:"tela do jogo peggy's journey",
    ig:'Instagram', fb:'Facebook', rd:'Reddit', dc:'Discord'
  },
  ru:{
    privacy:'Конфиденциальность',
    dlgTitle:'Пегги всё ещё голодна! 🐧', dlgBody:'В этом забеге Пегги съела рыбок: {f}, но хочет ещё. Помогите ей на {d}. Сайт откроется в новой вкладке.', dlgGo:'Перейти на {d}', dlgNo:'Не сейчас', mute:'Выключить звук', unmute:'Включить звук', shareScore:'Пегги съела рыбок: {f} и пробежала {s} очков! Сможете больше? 🐧', shareIdle:"Бегите с Пегги в peggy's journey! 🐧",
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
// t('copied', '레딧') → {n} 자리에 값을 넣음 / t('dlgBody', {f:3, d:'site.com'}) → {f}, {d} 자리에 값을 넣음
const t=(key,v)=>{
  const s=(DICT[lang][key]!==undefined?DICT[lang][key]:DICT.en[key])||'';
  if(v===undefined)return s;
  const o=typeof v==='object'?v:{n:v};
  return s.replace(/\{(\w+)\}/g,(m,k)=>o[k]!==undefined?o[k]:m);
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
