const geocoder = new kakao.maps.services.Geocoder();
const mapContainer = document.getElementById('map');
const map = new kakao.maps.Map(mapContainer, { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 3 });
const marker = new kakao.maps.Marker({ position: map.getCenter() });
marker.setMap(map);

function setAdminLocation() {
    const address = document.getElementById('adminAddress').value;
    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lng = result[0].x;
            updateMap(lat, lng);

            // 관리자 위치 저장
            localStorage.setItem('adminLocation', JSON.stringify({ lat, lng }));
            alert('위치 저장 완료!');
        } else {
            alert('주소를 찾을 수 없습니다.');
        }
    });
}

function updateMap(lat, lng) {
    const newPosition = new kakao.maps.LatLng(lat, lng);
    map.setCenter(newPosition);
    marker.setPosition(newPosition);
}
