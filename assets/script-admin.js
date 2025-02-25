window.onload = function () {
    const mapContainer = document.getElementById("map");
    const map = new kakao.maps.Map(mapContainer, { level: 3 });

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude, lng = pos.coords.longitude;
            const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
            });

            map.setCenter(new kakao.maps.LatLng(lat, lng));

            document.getElementById("setLocationBtn").addEventListener("click", function () {
                localStorage.setItem("adminLocation", JSON.stringify({ lat, lng }));
                alert("위치가 설정되었습니다!");
            });
        },
        () => alert("위치를 불러올 수 없습니다.")
    );
};
