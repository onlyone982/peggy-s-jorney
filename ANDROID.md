# 안드로이드 앱 만들기 (Capacitor)

웹 게임(`index.html`, `js`, `css`, `assets`)을 그대로 앱 안에 넣어서 Play 스토어에 올리는 방법입니다.
게임 코드는 웹과 하나를 같이 씁니다. 앱 안에서는 **onedollardrive 광고 버튼이 자동으로 숨겨집니다**(`js/game.js`의 `CFG.adInApp`이 `false`일 때. 웹에서는 그대로 보입니다).

## 준비물

- [Node.js](https://nodejs.org) (LTS 버전)
- [Android Studio](https://developer.android.com/studio) (안드로이드 SDK와 에뮬레이터가 같이 설치됩니다)
- Google Play 개발자 계정 (아래 "Play Console" 참고)

## 처음 한 번만

저장소 폴더에서 터미널(VS Code의 터미널)을 열고 차례로 실행합니다.

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build:www            # 게임 파일을 www/ 로 복사
npx cap add android          # android/ 폴더 생성
node scripts/android-setup.mjs   # 앱을 가로 화면으로 고정
```

앱 ID는 `capacitor.config.json`의 `appId`(`day.peggy.journey`)입니다. **스토어에 올린 뒤에는 바꿀 수 없으니** 다르게 쓰고 싶다면 `npx cap add android` 전에 바꾸세요.

## 게임을 고칠 때마다

```bash
npm run android:sync     # www/ 로 다시 복사하고 android/ 에 반영
npm run android:open     # Android Studio 열기
```

Android Studio에서 ▶ 버튼으로 에뮬레이터나 USB로 연결한 폰에서 실행해 볼 수 있습니다.

## 아이콘 넣기

Android Studio 왼쪽 `app` 폴더 → `res` 우클릭 → **New → Image Asset**
- Icon Type: Launcher Icons (Adaptive and Legacy)
- Foreground Layer: `store/icon_foreground.png`
- Background Layer: `store/icon_background.png`

## 출시용 파일(AAB) 만들기

1. `android/app/build.gradle`의 `versionCode`(정수, **업데이트마다 1씩 올리기**)와 `versionName`을 확인합니다.
2. Android Studio 메뉴 **Build → Generate Signed App Bundle / APK → Android App Bundle**
3. 처음이면 **Create new…** 로 키스토어 파일을 만듭니다. 키스토어 파일과 비밀번호는 **절대 잃어버리면 안 되니** 따로 백업하세요. (Play 앱 서명을 켜면 분실 시 복구 방법이 있지만 그래도 백업은 필수입니다.)
4. `release`를 선택하면 `.aab` 파일이 만들어집니다. 이 파일을 Play Console에 올립니다.

키스토어 파일은 GitHub에 올리지 마세요.

## Play Console

1. [Play Console](https://play.google.com/console)에서 개발자 계정을 만듭니다 (등록비 1회, 신분 확인 필요).
2. **앱 만들기**: 이름 `peggy's journey`, 게임, 무료.
3. 필수 항목을 채웁니다.
   - **개인정보처리방침 URL**: `https://peggy.day/privacy.html` (먼저 `privacy.html` 맨 아래 `[CONTACT EMAIL]` / `[연락 이메일]`을 실제 이메일로 바꿔서 올려야 합니다)
   - **광고 포함 여부**: 아니요 (앱 안에 광고가 없습니다. 나중에 AdMob을 넣으면 "예"로 바꿉니다)
   - **데이터 보안**: Google Analytics가 앱 활동과 기기·기타 식별자를 수집한다고 신고합니다. 개인정보처리방침과 똑같이 맞추세요.
   - **콘텐츠 등급**, **타겟층**: 어린이를 주 대상으로 하면 가족 정책이 추가로 적용되니, 일반 이용자(13세 이상 등) 기준으로 먼저 검토하는 편이 간단합니다.
4. **스토어 등록정보**
   - 앱 아이콘 512×512: `store/icon_512_play.png`
   - 그래픽 이미지 1024×500: `store/feature_graphic_1024x500.png`
   - 휴대전화 스크린샷: `store/screenshots/` (1920×1080)
5. **개인 계정 테스트 요건**: 2023년 11월 13일 이후 만든 개인 계정은 비공개 테스트에서 **테스터 12명 이상이 14일 연속** 참여해야 프로덕션 신청이 가능합니다. 비공개 테스트 트랙에 AAB를 올리고, 테스터 이메일 목록(Google 계정)을 등록해서 초대 링크를 공유하세요. 조건을 채운 뒤 프로덕션 출시를 신청합니다.

## 스토어 설명 초안

짧은 설명 (80자 이내)
- 한국어: 펭귄 페기와 함께 달리고, 점프하고, 생선을 모으는 쉬는 시간 러너 게임
- English: Run, jump and slide with Peggy the penguin. A tiny endless runner for your break time.

자세한 설명 (English)
> Help Peggy the penguin on her journey! Jump over snowmen, slide under gulls, and watch out for sea lions after dark. Hold the jump button longer to jump higher, collect fish along the way, and beat your high score. The day turns to night every 500 points. One-tap controls, short rounds, no account needed.

## 문제가 생기면

- 앱이 세로로 열린다: `node scripts/android-setup.mjs`를 실행했는지 확인합니다 (`AndroidManifest.xml`의 `<activity>`에 `android:screenOrientation="sensorLandscape"`가 있어야 합니다).
- 게임을 고쳤는데 앱에 반영이 안 된다: `npm run android:sync`를 다시 실행합니다.
- 소리가 안 난다: 앱은 화면을 한 번 탭한 뒤부터 소리가 납니다 (WebView 규칙).
- 앱 안에서 광고 버튼을 다시 보이게 하려면 `CFG.adInApp`을 `true`로 바꿉니다 (심사 문제가 없는지 먼저 확인하세요).
