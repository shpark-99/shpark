window.onload = function () {
    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 기준
        level: 3
    };

    var map = new kakao.maps.Map(container, options);

    // 예제 매장 위치 (테스트용)
    var storeLocations = [
        { lat: 37.5700, lon: 126.9765, name: "매장 A" },
        { lat: 37.5680, lon: 126.9820, name: "매장 B" }
    ];

    storeLocations.forEach(function (store) {
        var locPosition = new kakao.maps.LatLng(store.lat, store.lon);
        var marker = new kakao.maps.Marker({ position: locPosition });
        marker.setMap(map);
    });
};
