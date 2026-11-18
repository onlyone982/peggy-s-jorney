/* Google Analytics 4 연결 (Firebase 프로젝트의 웹 앱 "측정 ID"도 같은 G-로 시작하는 ID입니다)
 *
 * 사용법: 아래 GA_ID에 측정 ID(예: 'G-ABCDE12345')를 넣으면 켜집니다. 비워 두면 아무것도 하지 않습니다. (현재 peggy 웹 앱의 ID가 들어 있습니다)
 * 게임이 보내는 이벤트(game_start, game_over, share, ad_shown, ad_open, ad_go, ad_no, mute)는
 * js/game.js의 track()이 window.gtag로 자동 전달합니다.
 */
(()=>{
'use strict';
const GA_ID='G-8304LLZLP2';

if(!/^G-[A-Z0-9]+$/.test(GA_ID))return;               // 비어 있거나 형식이 틀리면 사용 안 함
if(navigator.doNotTrack==='1')return;                  // 브라우저의 '추적 안 함' 설정을 존중

window.dataLayer=window.dataLayer||[];
window.gtag=function(){window.dataLayer.push(arguments)};

// 개인정보 동의 설정: 유럽(EEA)·영국·스위스에서는 동의 없이 분석 쿠키를 쓰지 않도록 기본값을 '거부'로 둡니다.
// 그 밖의 지역은 분석만 허용하고, 광고용 저장과 광고 개인화는 모든 지역에서 끕니다.
gtag('consent','default',{
  analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
  region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH']
});
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});

gtag('js',new Date());
gtag('config',GA_ID,{allow_google_signals:false,allow_ad_personalization_signals:false});

const s=document.createElement('script');
s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
document.head.appendChild(s);
})();
