function initMap() {
    if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps SDK 로드 실패");
        return;
    }

    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 기준
        level: 3
    };
    var map = new kakao.maps.Map(container, options);
}

function loadKakaoMap() {
    var script = document.createElement("script");
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a50e768349b68eac92037c8858d7a462&libraries=services";
    script.onload = initMap;
    document.head.appendChild(script);
}

window.onload = loadKakaoMap;
