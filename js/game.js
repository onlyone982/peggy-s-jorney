(()=>{
'use strict';

/* ================= 설정: 여기 숫자만 바꿔도 게임 느낌이 바뀝니다 ================= */
const CFG={
  startSpeed:2.2, maxSpeed:5.2, accel:520,   // 속도: 시작 / 최고 / 클수록 천천히 빨라짐
  scoreRate:.078,                            // 점수가 오르는 빠르기 (클수록 점수가 빨리 오름. 예전 값 .06). accel은 이 값에 맞춰 같이 키워야 속도 곡선이 그대로
  nightEvery:500,                            // 점수 몇 점마다 낮↔밤이 바뀌는지
  fadeFrames:120,                            // 낮↔밤 전환에 걸리는 프레임 수 (60프레임 = 1초)
  moonX:1190, moonY:42, moonSize:65,         // 달의 위치(왼쪽 위 모서리)와 크기, 캔버스 px 기준 (캔버스는 1920x480)
  lionFrom:500,                              // 바다표범이 나오기 시작하는 점수
  gullFrom:150,                            // 갈매기가 나오기 시작하는 점수
  gullScale:.82,                             // 갈매기 크기 (1 = 원본 이미지 기준)
  clouds:3,                                  // 화면에 떠 있는 구름 수
  cloudDelay:[160,480],                      // 구름이 화면 밖으로 나간 뒤 다시 나오기까지 대기(프레임). 작을수록 자주 나옴
  jumpV:4.9, gravity:.33,                    // 점프 힘 / 중력 (높이는 그대로 두고 체공 시간만 약 10% 늘린 값)
  jumpCut:1.2, minJumpFrames:5,              // 점프 버튼을 일찍 떼면 낮은 점프: 떼면(최소 minJumpFrames 프레임 뒤) 올라가는 힘을 jumpCut까지 줄임
                                             // jumpCut이 작을수록 짧은 점프가 낮아지고, minJumpFrames가 클수록 짧은 점프도 높아짐 (60프레임 = 1초)
  adEvery:3,                                 // 게임오버 몇 판마다 광고 버튼을 보여줄지 (3 = 3판, 6판, 9판...)
  adUrl:'https://onedollardrive.com/?utm_source=peggy&utm_medium=game&utm_campaign=gameover',  // 이동할 주소 (UTM은 사이트 방문 통계에서 게임 유입을 구분하는 표시)
  adDomain:'onedollardrive.com',             // 이동 안내 창에 보여줄 도메인 이름
  shareUrl:'https://peggy.day/',                               // 공유 버튼이 복사할 주소. 비워두면 지금 열려 있는 페이지 주소를 씀
  cloudSpeed:.9,                             // 구름 속도 (배경보다 훨씬 느리게)
  fishEvery:3,                               // 생선이 나오는 간격 (화면 몇 개 지날 때마다, 실제로는 +0~1)
  groundTint:[179,179,179],                  // 낮 바닥(거의 흰색 띠)에 곱하는 색. 숫자가 작을수록 어둡고 푸른 톤. null이면 보정 안 함
  groundBand:[889,972],                      // 보정할 바닥 띠의 세로 범위 (bg_day.png 원본 픽셀 기준)
  outline:.35, outlineColor:'#1d2b53'       // 장애물(눈사람·갈매기·바다표범) 외곽선 두께(게임 단위, 0이면 끔)와 색
};

/* ================= 화면 크기 ================= */
// 게임 좌표는 가로 320 단위이고, 실제 캔버스는 K배(6배) 확대된 1920x480 입니다.
const K=6,W=320,G=55,CW=1920,CH=480,R=Math.random;
const FB=97;                                  // 펭귄 이미지 바닥 기준(px)
const PX0=4,PW=8.7,PH=12;                     // 서 있는 펭귄 충돌 상자
const SX0=1.67,SW=16.0,SH=7.67,SB=99;         // 슬라이드 충돌 상자 / 이미지 바닥
const DB=88;                                  // dead 이미지 바닥
const FW=9,FH=4.45;                           // 생선 크기
const GW=92,GH=71;                            // 갈매기 원본 크기(px)
const SNW=12.17,SNH=16.0;                     // 눈사람 크기
const LW=[26.67,27.83],LH=[15.33,13.5];       // 바다표범 두 장면의 크기

/* ================= 이미지 / 소리 파일 ================= */
const IM=u=>{const i=new Image();i.src=u;return i};
const ok=i=>i.complete&&i.naturalWidth>0;
const IMG='assets/img/',SND='assets/sfx/';
const BG=[IM(IMG+'bg_day.png'),IM(IMG+'bg_night.png')];
// 배경 그림의 촘촘한 점무늬(디더링)는 화면에 줄여서 보일 때 얼룩덜룩하게 보입니다.
// 그래서 불러온 직후 한 번만 아주 살짝 흐려서 쓰고, 이 기능이 없는 브라우저에서는 원본 그대로 씁니다.
const BGD=[BG[0],BG[1]];
const smoothBg=(i)=>{
  try{
    const im=BG[i],w=im.naturalWidth,h=im.naturalHeight,c=document.createElement('canvas'),x=c.getContext('2d');
    if(!('filter' in x))return;
    c.width=w*3;c.height=h;
    for(let k=0;k<3;k++)x.drawImage(im,k*w,0);          // 먼저 좌우로 이어 붙이고
    const c2=document.createElement('canvas'),x2=c2.getContext('2d');c2.width=w*3;c2.height=h;
    x2.filter='blur(1.1px)';x2.drawImage(c,0,0);        // 이어 붙인 전체를 한 번에 흐리게 해야 이음새에 흰 줄이 안 생김
    const o=document.createElement('canvas');o.width=w;o.height=h;o.getContext('2d').drawImage(c2,w,0,w,h,0,0,w,h);
    BGD[i]=o;
  }catch(e){}
};
// 낮 배경의 바닥 띠는 거의 흰색이라 눈사람·갈매기가 묻히고 눈도 쉽게 피로합니다.
// 띠 안에서 아주 밝은 픽셀만 부드럽게 어둡고 푸른 톤으로 바꿉니다 (원본 이미지 파일은 그대로, 물·하늘은 영향 없음).
// 파일(file://)로 직접 열면 브라우저가 픽셀 읽기를 막아서 이 보정은 건너뜁니다.
const toneGround=()=>{
  const T=CFG.groundTint;if(!T)return;
  try{
    const s=BGD[0],w=s.naturalWidth||s.width,h=s.naturalHeight||s.height,c=document.createElement('canvas');
    c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(s,0,0);
    const y0=CFG.groundBand[0],y1=Math.min(h,CFG.groundBand[1]),d=x.getImageData(0,y0,w,y1-y0),p=d.data;
    for(let i=0;i<p.length;i+=4){
      let k=((.299*p[i]+.587*p[i+1]+.114*p[i+2])-200)/40;k=k<0?0:k>1?1:k;k=k*k*(3-2*k);   // 밝을수록 1에 가깝게
      p[i]*=1-k+k*T[0]/255;p[i+1]*=1-k+k*T[1]/255;p[i+2]*=1-k+k*T[2]/255;
    }
    x.putImageData(d,0,y0);BGD[0]=c;
  }catch(e){}
};
BG.forEach((im,i)=>{const go=()=>{smoothBg(i);if(i===0)toneGround()};if(ok(im))go();else im.addEventListener('load',go)});
const CL=[1,2,3].map(n=>IM(IMG+'cloud_'+n+'.png'));
const MOON=IM(IMG+'moon.png');
const PF=Array.from({length:11},(_,i)=>IM(IMG+'penguin_'+String(i+1).padStart(2,'0')+'.png'));
const SLI=IM(IMG+'penguin_slide.png'),DEI=IM(IMG+'penguin_dead.png');
const GF=[1,2,3,4,5,6].map(n=>IM(IMG+'gull_'+n+'.png'));
const SNI=IM(IMG+'snowman.png');
const LI=[IM(IMG+'sealion_1.png'),IM(IMG+'sealion_2.png')];   // 두 장을 번갈아 보여주는 바다표범 모션
const FSI=IM(IMG+'fish.png');
const SFX={score:SND+'sfx_score.mp3',jump:SND+'sfx_jump.mp3',fish:SND+'sfx_fish.mp3',over:SND+'sfx_gameover.mp3',click:SND+'sfx_click.mp3'};

/* ================= 효과음 ================= */
const AC=window.AudioContext||window.webkitAudioContext,bufs={};
let ac=null,mg=null;
const getBuf=u=>{
  if(u.startsWith('data:')){const s=atob(u.split(',')[1]),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return Promise.resolve(a.buffer)}
  return fetch(u).then(r=>r.arrayBuffer());
};
try{
  if(AC&&location.protocol!=='file:'){
    ac=new AC();mg=ac.createGain();mg.gain.value=.7;mg.connect(ac.destination);
    // 파일을 직접 열었을 때(file://)는 fetch가 막혀서 아래 Audio 방식으로 대신 재생됩니다.
    Object.keys(SFX).forEach(k=>getBuf(SFX[k]).then(b=>ac.decodeAudioData(b,d=>{bufs[k]=d},()=>{})).catch(()=>{}));
  }
}catch(e){ac=null}
const DEBUG=location.hash==='#debug';
let muted=false;try{muted=localStorage.getItem('peggyMuted')==='1'}catch(e){}
// 통계용 이벤트: Google Analytics(gtag)가 페이지에 있으면 자동으로 보내고, 없어도 'peggy:event' 이벤트로 받아볼 수 있습니다.
// 이벤트: game_start, game_over(score, fish, games), share(platform), ad_shown, ad_open, ad_go, ad_no, mute
const EVT=[];
const track=(name,p)=>{
  try{
    const d=Object.assign({name},p||{});
    if(DEBUG)EVT.push(d);
    window.dispatchEvent(new CustomEvent('peggy:event',{detail:d}));
    if(typeof window.gtag==='function')window.gtag('event',name,p||{});
  }catch(e){}
};
const play=k=>{
  if(muted)return;
  try{
    if(ac&&ac.state==='suspended')ac.resume();
    if(bufs[k]){const s=ac.createBufferSource();s.buffer=bufs[k];s.connect(mg);s.start();return}
    const a=new Audio(SFX[k]);a.volume=.7;a.play().catch(()=>{});
  }catch(e){}
};

/* ================= 상태 ================= */
const cv=document.getElementById('g'),cx=cv.getContext('2d');
cv.width=CW;cv.height=CH;cx.imageSmoothingEnabled=false;
let night=false,nt=0,cutQ=false;                         // night: 목표 / nt: 현재 밤 정도(0=낮, 1=밤, 부드럽게 변함)
let st='idle',obs=[],sp=CFG.startSpeed,dist=0,py=0,vy=0,duck=false,dn=false,gap=120,wait=70,fc=0,hs=0,overT=0,off=0,jt=0,lh=0,bl=0,fsh=[],fn=0,fd=0,fnx=W*CFG.fishEvery,god=false,lastScore=0,lastFish=0,games=0;
try{hs=+localStorage.getItem('penguinHi')||0;games=+localStorage.getItem('penguinGames')||0}catch(e){}
const fl=Array.from({length:40},()=>({x:R()*W,y:R()*G,v:R()+.3}));            // 밤에 내리는 눈
const stars=Array.from({length:40},()=>[R()*CW|0,R()*220|0,R()<.3?6:3]);      // 밤하늘 별
const cl=Array.from({length:CFG.clouds},(_,i)=>({i:CL[R()*3|0],x:CW*(.15+.4*i)+R()*200,y:10+R()*110,v:.6+R()*.6,d:0}));
const nextFish=()=>W*(CFG.fishEvery+R());

const reset=()=>{showAd(false);lh=0;bl=0;jt=0;fn=0;fsh=[];fd=0;fnx=nextFish();obs=[];sp=CFG.startSpeed;night=false;dist=0;py=0;vy=0;duck=false;wait=70;gap=120};

/* ================= 장애물 생성 ================= */
// 갈매기 높이 3단계 (갈매기 아래쪽 y). 크롬 공룡 익룡과 같은 규칙입니다.
//  0 바닥   : 점프로 피함
//  1 중간   : 서 있는 펭귄 머리 높이. 숙이기(슬라이드)나 점프로 피함
//  2 하늘   : 펭귄 머리 위로 지나감. 그냥 달리면 됨
const GULL_BOTTOM=[G-.5,G-8,G-24];
function spawnGull(){
  const gw=GW*CFG.gullScale/K,gh=GH*CFG.gullScale/K,lv=R()*3|0;
  obs.push({k:'g',lv,x:W,y:GULL_BOTTOM[lv]-gh,w:gw,h:gh});
}
function spawn(){
  const r=R();
  if(dist>CFG.gullFrom&&r>.7)spawnGull();
  else if(r<.45||dist<CFG.lionFrom){const n=R()<.3?2:1;for(let i=0;i<n;i++)obs.push({k:'s',x:W+i*(SNW+1),y:G-SNH,w:SNW,h:SNH})}
  else obs.push({k:'l',x:W,y:G-LH[0],w:LW[1],h:LH[0]});   // 바다표범: 큰 쪽 크기를 기준으로 충돌 계산
  gap=sp*30+40+R()*80;
  if(fd>=fnx){const hh=[3,16,28][R()*3|0],n=3;for(let i=0;i<n;i++)fsh.push({x:W+gap*.5+(i-n/2)*FW*1.6,y:G-hh-FH});fd=0;fnx=nextFish()}
}
function die(){
  if(god)return;
  st='over';overT=performance.now();bl=0;play('over');
  lastScore=dist|0;lastFish=fn;games++;
  try{localStorage.setItem('penguinGames',games)}catch(e){}
  track('game_over',{score:lastScore,fish:lastFish,games});
  if(games%CFG.adEvery===0)showAd(true);                    // 몇 판마다 한 번만 광고 버튼 표시
  if((dist|0)>hs){hs=dist|0;try{localStorage.setItem('penguinHi',hs)}catch(e){}}
}

/* ================= 한 프레임 진행 ================= */
function upd(){
  fc++;
  // 낮↔밤 부드러운 전환: 한 프레임에 조금씩 이동
  const step=1/CFG.fadeFrames;nt+=Math.max(-step,Math.min(step,(night?1:0)-nt));
  fl.forEach(f=>{f.y+=.25+.2*f.v;f.x-=.15+(st==='run'?sp*.25*f.v:0);if(f.y>G){f.y=0;f.x=R()*W}if(f.x<0)f.x=W});
  // 구름: 천천히 이동하고, 화면 밖으로 나가면 한참 쉬었다가 다시 등장
  cl.forEach(c=>{
    if(c.d>0){c.d--;return}
    c.x-=(st==='run'?sp:1)*c.v*CFG.cloudSpeed*.5;
    if(c.x<-220){c.d=CFG.cloudDelay[0]+R()*(CFG.cloudDelay[1]-CFG.cloudDelay[0])|0;c.x=CW+20;c.y=10+R()*110;c.i=CL[R()*3|0]}
  });
  if(st!=='run')return;
  sp=Math.min(CFG.maxSpeed,CFG.startSpeed+dist/CFG.accel);
  dist+=sp*CFG.scoreRate;off+=sp;fd+=sp;night=(dist/CFG.nightEvery|0)%2===1;
  const hh=dist/100|0;if(hh>lh){lh=hh;bl=48;play('score')}if(bl>0)bl--;   // 100점마다 점수 깜빡임 + 소리
  duck=dn&&py===0;
  if(py>0||vy>0){jt++;if(cutQ&&jt>=CFG.minJumpFrames){if(vy>CFG.jumpCut)vy=CFG.jumpCut;cutQ=false}vy-=CFG.gravity*(dn?2.2:1);py+=vy;if(py<=0){py=0;vy=0;jt=0}}
  obs.forEach(o=>o.x-=sp+(o.k==='g'?.8:0));
  fsh.forEach(f=>f.x-=sp);fsh=fsh.filter(f=>f.x>-12);
  obs=obs.filter(o=>o.x>-30);
  if(wait>0)wait--;
  else{const l=obs[obs.length-1];if(!l||W-l.x>=gap)spawn()}
  const b=duck?[24+SX0,G-SH,SW,SH]:[24+PX0,G-py-PH,PW,PH];       // 펭귄 충돌 상자 [x,y,w,h]
  fsh=fsh.filter(f=>{const h=b[0]<f.x+FW&&b[0]+b[2]>f.x&&b[1]<f.y+FH&&b[1]+b[3]>f.y;if(h){fn++;play('fish')}return !h});
  for(const o of obs){
    let hx,hy,hw,hh2;
    if(o.k==='l'){hx=o.x+o.w*.25;hw=o.w*.5;hy=o.y+o.h*.2;hh2=o.h*.8-2}   // 바다표범: 몸통 가운데 절반만
    else{const i=o.k==='g'?1.5:2;hx=o.x+i;hw=o.w-2*i;hy=o.y+i;hh2=o.h-2*i}
    if(b[0]<hx+hw&&b[0]+b[2]>hx&&b[1]<hy+hh2&&b[1]+b[3]>hy){die();break}
  }
}

/* ================= 그리기 ================= */
const z=n=>String(n|0).padStart(5,'0');
const mix=(a,b,t)=>Math.round(a+(b-a)*t);
// 장애물 외곽선: 스프라이트와 같은 모양의 어두운 실루엣을 8방향으로 살짝 비껴 그려서 테두리를 만듭니다
const SIL=new Map();
const sil=im=>{
  let c=SIL.get(im);if(c)return c;
  c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;
  const x=c.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-in';x.fillStyle=CFG.outlineColor;x.fillRect(0,0,c.width,c.height);
  SIL.set(im,c);return c;
};
const OFFS=[[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]];
const stroke=(im,x,y,w,h)=>{
  const d=CFG.outline;if(!d||!ok(im))return;
  const s=sil(im);for(const[a,b]of OFFS)cx.drawImage(s,x+a*d,y+b*d,w,h);
};
function drawPeng(){
  const gy=G*K,x=24*K,air=py>0||vy>0;
  const tot=jt+(vy+Math.sqrt(vy*vy+2*CFG.gravity*py))/CFG.gravity;           // 이번 점프의 전체 체공 시간 추정
  const i=air?2+Math.min(8,jt/tot*9|0):st==='run'?(fc>>3&1):0;     // 달리기: 1·2번 / 점프: 3~11번
  cx.save();cx.setTransform(1,0,0,1,0,0);
  if(air){cx.fillStyle='rgba(0,0,0,.28)';cx.beginPath();cx.ellipse(x+50,gy+3,Math.max(16,46-py*K*.12),6,0,0,7);cx.fill()}
  if(st==='over'){if(ok(DEI))cx.drawImage(DEI,x,gy-py*K-DB)}
  else if(duck){if(ok(SLI))cx.drawImage(SLI,x,gy-SB)}
  else if(ok(PF[i]))cx.drawImage(PF[i],x,gy-py*K-FB);
  cx.restore();
}
function draw(){
  const sm=nt*nt*(3-2*nt);                                     // 전환 곡선(처음과 끝이 느림)
  cx.setTransform(1,0,0,1,0,0);cx.globalAlpha=1;
  const x0=-((off*K)%CW)|0;
  // 배경: 낮 위에 밤을 겹쳐서 서서히 바꿈
  if(ok(BG[0])){cx.drawImage(BGD[0],x0,-600);cx.drawImage(BGD[0],x0+CW,-600)}else{cx.fillStyle='#81b6e9';cx.fillRect(0,0,CW,CH)}
  if(sm>.001){
    cx.globalAlpha=sm;
    if(ok(BG[1])){cx.drawImage(BGD[1],x0,-600);cx.drawImage(BGD[1],x0+CW,-600)}
    cx.fillStyle='#fff1e8';stars.forEach(s=>cx.fillRect(s[0],s[1],s[2],s[2]));
    // 달: 점수 글자 왼쪽 위에 작게 떠 있고, 밤이 될수록 위로 떠오름
    if(ok(MOON))cx.drawImage(MOON,CFG.moonX,CFG.moonY+(1-sm)*50,CFG.moonSize,CFG.moonSize);
  }
  if(sm<.999){
    cx.globalAlpha=1-sm;
    cl.forEach(c=>{if(c.d<=0&&ok(c.i))cx.drawImage(c.i,c.x|0,c.y|0,c.i.naturalWidth*.5,c.i.naturalHeight*.5)});
  }
  cx.globalAlpha=1;
  cx.setTransform(K,0,0,K,0,0);
  if(sm>.001){cx.globalAlpha=sm;cx.fillStyle='#fff1e8';fl.forEach(f=>cx.fillRect(f.x|0,f.y|0,f.v>.9?1:.5,f.v>.9?1:.5));cx.globalAlpha=1}
  obs.forEach(o=>{
    if(o.k==='g'){const g=GF[(fc>>2)%6];if(ok(g)){stroke(g,o.x,o.y,o.w,o.h);cx.drawImage(g,o.x,o.y,o.w,o.h)}}
    else if(o.k==='s'){if(ok(SNI)){stroke(SNI,o.x,o.y,o.w,o.h);cx.drawImage(SNI,o.x,o.y,o.w,o.h)}}
    else{const f=(fc>>4)&1,im=LI[f];if(ok(im)){stroke(im,o.x,o.y+o.h-LH[f],LW[f],LH[f]);cx.drawImage(im,o.x,o.y+o.h-LH[f],LW[f],LH[f])}}   // 바다표범: 두 장면을 번갈아 재생
  });
  if(ok(FSI))fsh.forEach(f=>cx.drawImage(FSI,f.x,f.y,FW,FH));
  drawPeng();
  // 글자색도 낮(진한 파랑)에서 밤(밝은 색)으로 부드럽게
  cx.font='bold 10px monospace, sans-serif';cx.fillStyle='rgb('+mix(29,255,sm)+','+mix(43,241,sm)+','+mix(83,232,sm)+')';
  cx.textAlign='right';if(bl<=0||((bl/8|0)&1))cx.fillText(z(dist),W-6,14);cx.fillText('HI '+z(hs),W-44,14);
  if(st!=='idle'){if(ok(FSI))cx.drawImage(FSI,6,6,FW,FH);cx.textAlign='left';cx.fillText('x'+fn,18,14)}
  cx.textAlign='center';
  if(st==='idle'){cx.fillText("PEGGY'S JOURNEY",W/2,24);cx.fillText(I18N.t('press'),W/2,36)}
  if(st==='over'){cx.fillText(I18N.t('over'),W/2,24);cx.fillText(I18N.t('retry'),W/2,36)}
}

/* ================= 입력 ================= */
const $=id=>document.getElementById(id);
const ad=$('ad'),dlg=$('dlg'),dlgGo=$('dlgGo');
const showAd=v=>{if(v){ad.textContent=I18N.t('feed');track('ad_shown',{games})}ad.hidden=!v};
// 광고 버튼 → 이동 안내 창(도메인과 새 탭으로 열린다는 알림) → 확인하면 이동
ad.addEventListener('click',()=>{
  play('click');track('ad_open',{games});
  $('dlgBody').textContent=I18N.t('dlgBody',{f:lastFish,d:CFG.adDomain});
  dlgGo.textContent=I18N.t('dlgGo',{d:CFG.adDomain});dlgGo.href=CFG.adUrl;
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
});
const closeDlg=()=>{if(dlg.close)dlg.close();else dlg.removeAttribute('open')};
dlgGo.addEventListener('click',()=>{play('click');track('ad_go',{games});setTimeout(closeDlg,0)});
$('dlgNo').addEventListener('click',()=>{play('click');track('ad_no',{games});closeDlg()});
dlg.addEventListener('click',e=>{if(e.target===dlg)closeDlg()});          // 바깥을 누르면 닫힘
const jump=()=>{
  let sd=0;
  if(dlg.open)return;
  if(st==='over'){if(performance.now()-overT<400)return;reset();st='run';sd=1;track('game_start',{games})}
  else if(st==='idle'){reset();st='run';sd=1;track('game_start',{games})}
  if(py===0&&vy===0){vy=CFG.jumpV;jt=0;cutQ=false;play(sd?'click':'jump')}
};
// 점프 버튼을 누르고 있는 시간에 따라 높이가 달라집니다.
// 짧게 누르면 낮은 점프(약 60%), 끝까지 누르고 있으면 가장 높은 점프이고, 그 사이는 누른 시간만큼 이어서 높아집니다.
const releaseJump=()=>{if(py>0||vy>0)cutQ=true};   // 실제로 줄이는 것은 upd() 안에서 최소 시간이 지난 뒤
const JK=['Space','ArrowUp','KeyW'];
addEventListener('keydown',e=>{
  if(dlg.open)return;                       // 안내 창이 열려 있으면 게임 입력은 무시
  if(JK.includes(e.code)){e.preventDefault();if(!e.repeat)jump()}
  if(['ArrowDown','KeyS'].includes(e.code)){e.preventDefault();dn=true}
});
addEventListener('keyup',e=>{if(['ArrowDown','KeyS'].includes(e.code))dn=false;if(JK.includes(e.code))releaseJump()});
[cv,$('bj')].forEach(el=>{
  el.addEventListener('pointerdown',e=>{e.preventDefault();jump()});
  ['pointerup','pointerleave','pointercancel'].forEach(t=>el.addEventListener(t,releaseJump));
});
$('bd').addEventListener('pointerdown',e=>{e.preventDefault();dn=true});
['pointerup','pointerleave','pointercancel'].forEach(t=>$('bd').addEventListener(t,()=>{dn=false}));

/* ================= 공유 버튼 (링크 복사) ================= */
const toast=$('toast');let toastT=0;
const say=m=>{toast.textContent=m;toast.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>toast.classList.remove('on'),2200)};
const copyText=async s=>{
  try{await navigator.clipboard.writeText(s);return true}catch(e){}
  try{const t=document.createElement('textarea');t.value=s;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();const r=document.execCommand('copy');t.remove();return r}catch(e){return false}
};
document.querySelectorAll('.share button').forEach(b=>b.addEventListener('click',async()=>{
  const url=CFG.shareUrl||location.href.split('#')[0];
  // 한 판이라도 했으면 점수가 담긴 문구를, 아니면 초대 문구를 링크와 함께 복사
  const text=lastScore>0?I18N.t('shareScore',{f:lastFish,s:lastScore}):I18N.t('shareIdle');
  play('click');track('share',{platform:b.dataset.key});
  say(await copyText(text+'\n'+url)?I18N.t('copied',b.dataset.name):I18N.t('failed'));
}));

/* ================= 소리 끄기 (우측 상단) ================= */
const mb=$('mute');
const paintMute=()=>{mb.classList.toggle('off',muted);mb.setAttribute('aria-pressed',String(muted));mb.title=I18N.t(muted?'unmute':'mute')};
mb.setAttribute('aria-label',I18N.t('mute'));
mb.addEventListener('click',()=>{
  muted=!muted;try{localStorage.setItem('peggyMuted',muted?'1':'0')}catch(e){}
  paintMute();track('mute',{muted});if(!muted)play('click');
});
paintMute();

/* ================= 테스트용 도구 (주소 끝에 #debug 를 붙였을 때만 켜짐) ================= */
if(location.hash==='#debug'){
  window.__dbg={
    state:()=>({st,dist:dist|0,py,duck,nt:+nt.toFixed(3),fn,obs:obs.map(o=>({k:o.k,lv:o.lv,x:+o.x.toFixed(1),y:+o.y.toFixed(1),w:+o.w.toFixed(1),h:+o.h.toFixed(1)})),clouds:cl.map(c=>({x:c.x|0,d:c.d}))}),
    setDist:n=>{dist=n;lh=n/100|0},
    put:(k,lv,x)=>{wait=1e9;obs=[];if(k==='g'){const gw=GW*CFG.gullScale/K,gh=GH*CFG.gullScale/K;obs.push({k,lv,x,y:GULL_BOTTOM[lv]-gh,w:gw,h:gh})}else if(k==='s')obs.push({k,x,y:G-SNH,w:SNW,h:SNH});else obs.push({k:'l',x,y:G-LH[0],w:LW[1],h:LH[0]})},
    god:v=>{god=v},
    events:()=>EVT, setGames:n=>{games=n}, muted:()=>muted
  };
}

/* ================= 메인 루프 ================= */
let last=performance.now(),acc=0;
(function loop(t){acc+=Math.min(t-last,100);last=t;while(acc>=16.667){upd();acc-=16.667}draw();requestAnimationFrame(loop)})(last);
})();
