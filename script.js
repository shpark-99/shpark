let map, geocoder, baseMarker, userMarker, circle, targetLocation = null;
const COOKIE_NAME = "auth_token";
const STORAGE_KEY = "auth_token_storage";

// ✅ 지도 초기화
function initMap() {
    console.log("✅ initMap() 실행 중...");
    const container = document.getElementById('map');
    map = new kakao.maps.Map(container, { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 5 });
    geocoder = new kakao.maps.services.Geocoder();
    console.log("✅ 카카오 지도 초기화 완료!");
}

// ✅ 기준 위치 설정
function setBaseLocation() {
    const address = document.getElementById("addressInput").value.trim();
    if (!address) {
        alert("📌 주소를 입력하세요!");
        return;
    }

    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const lat = result[0].y, lng = result[0].x;
            targetLocation = new kakao.maps.LatLng(lat, lng);

            if (baseMarker) baseMarker.setMap(null);
            baseMarker = new kakao.maps.Marker({ map: map, position: targetLocation, title: "기준 위치" });

            if (circle) circle.setMap(null);
            circle = new kakao.maps.Circle({
                map: map, center: targetLocation, radius: 300,
                strokeWeight: 2, strokeColor: '#FF0000', strokeOpacity: 0.8,
                fillColor: '#FF0000', fillOpacity: 0.2
            });

            map.setCenter(targetLocation);
            document.getElementById("verifyButton").disabled = false;
            updateStatusMessage("✅ 기준 위치 설정 완료! 위치 인증 가능.", "blue");
        } else {
            alert("❌ 주소 검색 실패! 올바른 주소를 입력하세요.");
        }
    });
}

// ✅ 내 위치 인증
function verifyMyLocation() {
    if (!targetLocation) {
        alert("❌ 기준 위치를 먼저 설정하세요!");
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude, userLng = position.coords.longitude;
                const userLocation = new kakao.maps.LatLng(userLat, userLng);

                if (userMarker) userMarker.setMap(null);
                userMarker = new kakao.maps.Marker({ map: map, position: userLocation, title: "내 위치" });

                checkDistance(userLocation);
            },
            function(error) {
                alert("❌ 위치 정보를 가져올 수 없습니다! (에러 코드: " + error.code + ")");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
    } else {
        alert("❌ 이 브라우저에서는 위치 정보를 지원하지 않습니다!");
    }
}

// ✅ 거리 측정 및 인증 확인
function checkDistance(userLocation) {
    if (!kakao.maps.geometry) {
        alert("❌ Kakao Maps geometry 라이브러리가 없습니다.");
        return;
    }

    const distance = kakao.maps.geometry.computeDistanceBetween(targetLocation, userLocation);
    console.log(`📏 거리: ${distance.toFixed(2)}m`);

    if (distance <= 300) {
        updateStatusMessage("✅ 위치 인증 성공! 반경 300m 이내입니다.", "green");
        document.getElementById("verifyButton").disabled = true;
    } else {
        updateStatusMessage("❌ 위치 인증 실패! 반경을 벗어났습니다.", "red");
    }
}

// ✅ 쿠키 설정 (서드파티 쿠키 대응)
function setAuthCookie() {
    document.cookie = `${COOKIE_NAME}=your_auth_token_value; SameSite=None; Secure; max-age=3600`;
    localStorage.setItem(STORAGE_KEY, "your_auth_token_value");
    console.log("✅ 인증 데이터 저장 완료");
}

// ✅ 쿠키 삭제
function clearAuthCookie() {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑 인증 데이터 삭제 완료");
}

// ✅ 상태 메시지 업데이트
function updateStatusMessage(message, color) {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerText = message;
    statusMessage.style.color = color;
}

// ✅ 페이지 로드 시 지도 초기화
kakao.maps.load(initMap);
