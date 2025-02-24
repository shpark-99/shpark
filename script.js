const geocoder = new kakao.maps.services.Geocoder();
const adminLocation = { lat: 37.5665, lng: 126.9780 };

function setAdminLocation(address) {
    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            adminLocation.lat = result[0].y;
            adminLocation.lng = result[0].x;
            updateMap(adminLocation.lat, adminLocation.lng);
        } else {
            alert('주소를 찾을 수 없습니다.');
        }
    });
}

const map = new kakao.maps.Map(document.getElementById('map'), {
    center: new kakao.maps.LatLng(adminLocation.lat, adminLocation.lng), level: 3
});
const marker = new kakao.maps.Marker({ position: map.getCenter() });
marker.setMap(map);

function updateMap(lat, lng) {
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.setCenter(moveLatLon);
    marker.setPosition(moveLatLon);
}

navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    geocoder.coord2Address(userLng, userLat, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            document.getElementById('userAddress').innerText = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
        }
    });

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
        resultDiv.innerHTML = '<p style="color: green;">✅ 인증 성공!</p>';
        document.getElementById('nextPageBtn').style.display = 'block';
    } else {
        resultDiv.innerHTML = '<p style="color: red;">❌ 반경 밖입니다. (거리: ' + distance.toFixed(2) + 'm)</p>';
    }
}, (error) => { console.error('위치 정보를 가져올 수 없습니다.', error); });
