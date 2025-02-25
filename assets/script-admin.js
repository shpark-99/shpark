window.onload = function () {
    var container = document.getElementById('map');
    var options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 기준
        level: 3
    };

    var map = new kakao.maps.Map(container, options);

    // 현재 위치 가져오기
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var locPosition = new kakao.maps.LatLng(lat, lon);
            
            // 마커 표시
            var marker = new kakao.maps.Marker({ position: locPosition });
            marker.setMap(map);
            map.setCenter(locPosition);
        });
    }
};
