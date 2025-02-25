window.onload = function () {
    if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps API 로드 실패");
        return;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    const mapContainer = document.getElementById("map");
    const map = new kakao.maps.Map(mapContainer, { level: 3 });

    // 🎯 관리자 위치 불러오기
    const adminLocation = JSON.parse(localStorage.getItem("adminLocation"));
    if (!adminLocation) {
        alert("관리자가 위치를 설정하지 않았습니다.");
        return;
    }

    document.getElementById("adminAddress").innerText = `(${adminLocation.lat}, ${adminLocation.lng})`;

    // 관리자 위치 마커 추가
    const adminMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(adminLocation.lat, adminLocation.lng),
        map: map
    });

    // 반경 300m 표시
    const circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(adminLocation.lat, adminLocation.lng),
        radius: 300,
        strokeWeight: 2,
        strokeColor: "#0064FF",
        strokeOpacity: 0.8,
        fillColor: "#0064FF",
        fillOpacity: 0.3
    });
    circle.setMap(map);

    map.setCenter(new kakao.maps.LatLng(adminLocation.lat, adminLocation.lng));

    // 🎯 사용자 위치 가져오기
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            const userPosition = new kakao.maps.LatLng(userLat, userLng);

            // 사용자 위치 마커 추가
            const userMarker = new kakao.maps.Marker({
                position: userPosition,
                map: map
            });

            // 사용자 도로명 주소 가져오기
            geocoder.coord2Address(userLng, userLat, function (result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    document.getElementById("userAddress").innerText = result[0].road_address
                        ? result[0].road_address.address_name
                        : result[0].address.address_name;
                }
            });

            // 지도 중심 이동
            map.setCenter(userPosition);

            // 반경 300m 비교
            function getDistance(lat1, lng1, lat2, lng2) {
                function deg2rad(deg) { return deg * (Math.PI / 180); }
                const R = 6371;
                const dLat = deg2rad(lat2 - lat1);
                const dLng = deg2rad(lng2 - lng1);
                const a = Math.sin(dLat / 2) ** 2 +
                          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                          Math.sin(dLng / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c * 1000;
            }

            const distance = getDistance(adminLocation.lat, adminLocation.lng, userLat, userLng);
            const resultDiv = document.getElementById("result");
            const surveyBtn = document.getElementById("surveyBtn");

            if (distance <= 300) {
                resultDiv.innerHTML = `<p style="color: green;">✅ 인증 성공! (거리: ${distance.toFixed(2)}m)</p>`;
                surveyBtn.style.display = "block";
            } else {
                resultDiv.innerHTML = `<p style="color: red;">❌ 반경 밖입니다. (거리: ${distance.toFixed(2)}m)</p>`;
            }
        },
        (error) => {
            console.error("위치 정보를 가져올 수 없습니다.", error);
            alert("위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.");
        }
    );
};
