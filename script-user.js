const geocoder = new kakao.maps.services.Geocoder();
const map = new kakao.maps.Map(document.getElementById('map'), { level: 3 });
const userMarker = new kakao.maps.Marker(), adminMarker = new kakao.maps.Marker();
const circle = new kakao.maps.Circle({ strokeWeight: 1, strokeColor: '#FF0000', fillColor: '#FF0000', fillOpacity: 0.2 });

const adminLocation = JSON.parse(localStorage.getItem('adminLocation'));
if (adminLocation) {
    document.getElementById('adminAddress').innerText = `(${adminLocation.lat}, ${adminLocation.lng})`;
    adminMarker.setPosition(new kakao.maps.LatLng(adminLocation.lat, adminLocation.lng));
    adminMarker.setMap(map);
    circle.setPosition(new kakao.maps.LatLng(adminLocation.lat, adminLocation.lng));
    circle.setRadius(300);
    circle.setMap(map);
}

navigator.geolocation.getCurrentPosition((pos) => {
    const userLat = pos.coords.latitude, userLng = pos.coords.longitude;
    userMarker.setPosition(new kakao.maps.LatLng(userLat, userLng));
    userMarker.setMap(map);
    map.setCenter(new kakao.maps.LatLng(userLat, userLng));

    const distance = getDistance(adminLocation.lat, adminLocation.lng, userLat, userLng);
    document.getElementById('result').innerText = distance <= 300 ? '✅ 인증 성공!' : '❌ 반경 밖입니다.';
    if (distance <= 300) document.getElementById('surveyBtn').classList.remove('hidden-btn');
}, (err) => console.error(err));

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371, dLat = (lat2 - lat1) * (Math.PI / 180), dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLng/2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1000;
}
