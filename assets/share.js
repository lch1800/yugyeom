/* 카카오톡 공유 — 모든 시안이 같이 쓴다.
 *
 * KAKAO_JS_KEY 가 비어 있으면: 휴대폰 공유 창(카카오톡 고르기) → 그것도 없으면(PC) 링크 복사.
 * 키를 넣으면: 카카오 공식 공유(친구 고르기 창 + 사진·제목·"초대장 보기" 버튼 카드).
 *
 * 키 넣는 법 (카카오 개발자 사이트 앱 관리 페이지)
 *   1. 앱 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인 에 배포 주소 등록 (예: https://아이디.github.io)
 *   2. 앱 > 제품 링크 관리 > 웹 도메인 에도 같은 주소 등록 (카드 속 링크가 열리게)
 *   3. 아래 KAKAO_JS_KEY 에 JavaScript 키를 넣는다. 등록한 주소에서만 동작하는 공개용 키라 페이지에 보여도 된다.
 */
(function () {
  var KAKAO_JS_KEY = '959dcd0567361bc6f3e87a3663c7772f';

  // 2.8.4(2026-10-19)는 나온 지 얼마 안 돼 한 단계 전 판을 쓴다. integrity 는 받은 파일에서 직접 계산했다.
  var SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
  var SDK_INTEGRITY = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy';

  var TITLE = '서유겸 첫돌에 초대합니다';
  var DESC = '2026년 11월 28일 토요일 오후 2시 30분 · 파티앤프렌즈 리베라홀';
  var IMAGE = 'assets/og.jpg?v=71f74764';

  // ?after=1 같은 확인용 꼬리는 빼고 보낸다
  function pageUrl() { return location.origin + location.pathname; }
  function absolute(path) { return new URL(path, location.href).href; }

  var useKakao = !!KAKAO_JS_KEY && /^https?:$/.test(location.protocol);

  // 누르는 순간 바로 카카오톡을 열어야 하므로(브라우저가 사용자 동작 직후만 허용) SDK 는 미리 읽어 둔다
  if (useKakao) {
    var s = document.createElement('script');
    s.src = SDK_SRC;
    s.integrity = SDK_INTEGRITY;
    s.crossOrigin = 'anonymous';
    s.onload = function () {
      if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
    };
    document.head.appendChild(s);
  }

  function sendKakao() {
    var link = { mobileWebUrl: pageUrl(), webUrl: pageUrl() };
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: { title: TITLE, description: DESC, imageUrl: absolute(IMAGE), link: link },
      buttons: [{ title: '초대장 보기', link: link }]
    });
  }

  function webShare(fallback) {
    if (!navigator.share) return fallback();
    navigator.share({ title: TITLE, text: DESC, url: pageUrl() }).catch(function (e) {
      if (!e || e.name !== 'AbortError') fallback(); // 사용자가 공유 창을 닫은 건 실패가 아니다
    });
  }

  // fallback: 각 시안의 "링크 복사 + 안내 토스트"
  function share(fallback) {
    if (useKakao && window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
      try { sendKakao(); return; } catch (e) { console.error('카카오 공유 실패', e); }
    }
    webShare(fallback);
  }

  window.InviteShare = { kakao: share, url: pageUrl };
})();
