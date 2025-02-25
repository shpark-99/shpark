window.onload = function () {
    // Kakao API 스크립트 동적으로 추가
    if (typeof kakao === "undefined") {
        const script = document.createElement("script");
        script.async = true;
        script.onload = initMap; // 스크립트 로드 완료 후 실행
        document.head.appendChild(script);
    } else {
        initMap(); // 이미 로드되어 있다면 바로 실행
    }
};

function initMap() {
    if (typeof kakao === "undefined") {
        alert("카카오맵 API 로드 실패! 네트워크 상태를 확인하세요.");
        return;
    }

    kakao.maps.load(function () {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            alert("지도를 표시할 요소가 없습니다.");
            return;
        }

        const map = new kakao.maps.Map(mapContainer, { level: 3 });

        // 관리자 위치 가져오기
        const adminLocation = JSON.parse(localStorage.getItem("adminLocation"));
        if (!adminLocation) {
            alert("관리자가 위치를 설정하지 않았습니다.");
            return;
        }

        document.getElementById("adminAddress").innerText = `(${adminLocation.lat}, ${adminLocation.lng})`;

        // 지도 크기 조정
        mapContainer.style.width = "90%";
        mapContainer.style.height = "300px";
        mapContainer.style.margin = "auto";
        map.relayout();

        // 사용자 위치 가져오기
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userLat = pos.coords.latitude, userLng = pos.coords.longitude;
                document.getElementById("userAddress").innerText = `(${userLat}, ${userLng})`;

                // 사용자 마커 추가
                const userMarker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(userLat, userLng),
                    map: map,
                });

                // 지도 중심 이동
                map.setCenter(new kakao.maps.LatLng(userLat, userLng));
                map.relayout();

                // 거리 계산 및 인증
                function getDistance(lat1, lng1, lat2, lng2) {
                    const R = 6371, dLat = (lat2 - lat1) * (Math.PI / 180), dLng = (lng2 - lng1) * (Math.PI / 180);
                    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLng/2) ** 2;
                    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1000;
                }

                const distance = getDistance(adminLocation.lat, adminLocation.lng, userLat, userLng);
                const resultDiv = document.getElementById("result");
                const surveyBtn = document.getElementById("surveyBtn");

                if (distance <= 300) {
                    resultDiv.innerHTML = '<p class="success-text">✅ 인증 성공! (거리: ' + distance.toFixed(2) + 'm)</p>';
                    surveyBtn.style.display = "block";
                } else {
                    resultDiv.innerHTML = '<p class="error-text">❌ 반경 밖입니다. (거리: ' + distance.toFixed(2) + 'm)</p>';
                    surveyBtn.style.display = "none";
                }
            },
            (err) => {
                console.error("위치 정보를 가져올 수 없습니다.", err);
                alert("위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.");
            }
        );
    });
}
