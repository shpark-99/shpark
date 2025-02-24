const geocoder = new kakao.maps.services.Geocoder();
const map = new kakao.maps.Map(document.getElementById('map'), { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 3 });
const marker = new kakao.maps.Marker({ position: map.getCenter() });
marker.setMap(map);

function setAdminLocation() {
    const address = document.getElementById('adminAddress').value;
    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const lat = result[0].y, lng = result[0].x;
            map.setCenter(new kakao.maps.LatLng(lat, lng));
            marker.setPosition(new kakao.maps.LatLng(lat, lng));

            localStorage.setItem('adminLocation', JSON.stringify({ lat, lng }));
            alert('위치 저장 완료!');
        } else alert('주소를 찾을 수 없습니다.');
    });
}
