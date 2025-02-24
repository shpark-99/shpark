const geocoder = new kakao.maps.services.Geocoder();
const mapContainer = document.getElementById('map');
const map = new kakao.maps.Map(mapContainer, { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 3 });
const marker = new kakao.maps.Marker();
marker.setMap(map);

// 🎯 관리자 위치 불러오기
const adminLocation = JSON.parse(localStorage.getItem('adminLocation'));
if (!adminLocation) {
    alert('관리자가 위치를 설정하지 않았습니다.');
} else {
    console.log('관리자 위치:', adminLocation);
}

// 사용자 현재 위치 가져오기
navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const userPosition = new kakao.maps.LatLng(userLat, userLng);
    marker.setPosition(userPosition);
    map.setCenter(userPosition);

    // 좌표 -> 주소 변환
    geocoder.coord2Address(userLng, userLat, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            document.getElementById('userAddress').innerText = result[0].road_address 
                ? result[0].road_address.address_name 
                : result[0].address.address_name;
        }
    });

    // 🎯 거리 계산 (Haversine 공식 적용)
    function getDistance(lat1, lng1, lat2, lng2) {
        function deg2rad(deg) { return deg * (Math.PI / 180); }
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLng = deg2rad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    }

    const distance = getDistance(adminLocation.lat, adminLocation.lng, userLat, userLng);
    const resultDiv = document.getElementById('result');

    if (distance <= 300) {
        resultDiv.innerHTML = '<p style="color: green;">✅ 인증 성공! (거리: ' + distance.toFixed(2) + 'm)</p>';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">❌ 반경 밖입니다. (거리: ' + distance.toFixed(2) + 'm)</p>';
    }
}, (error) => { console.error('위치 정보를 가져올 수 없습니다.', error); });
