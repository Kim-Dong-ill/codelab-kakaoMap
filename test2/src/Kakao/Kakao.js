import React, { useEffect, useState } from "react";

const { kakao } = window;

function Kakao() {
  const [message, setMessage] = useState("");
  const [map, setMap] = useState(null);
  // const [markers, setMarkers] = useState([]);
  // const [markersCoords, setMarkersCoords] = useState([]); //찍힌 마커가 저장되는 배열
  const [positions, setPositions] = useState([
    {
      title: "카카오",
      latlng: new kakao.maps.LatLng(37.56827526221017, 126.9813458324624),
    },
    {
      title: "생태연못",
      latlng: new kakao.maps.LatLng(37.56600410780766, 126.97763378892346),
    },
    {
      title: "텃밭",
      latlng: new kakao.maps.LatLng(37.56672599582368, 126.98442499820897),
    },
    {
      title: "근린공원",
      latlng: new kakao.maps.LatLng(37.56304937596438, 126.98066802641401),
    },
  ]);

  useEffect(() => {
    mapscript();
  }, [map]); // map이 업데이트될 때만 useEffect 실행

  const mapscript = () => {
    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
      const option = {
        // 가능한 경우, 높은 정확도의 위치(예를 들어, GPS 등) 를 읽어오려면 true로 설정
        // 그러나 이 기능은 배터리 지속 시간에 영향을 미친다.
        enableHighAccuracy: false, // 대략적인 값이라도 상관 없음: 기본값

        // 위치 정보가 충분히 캐시되었으면, 이 프로퍼티를 설정하자,
        // 위치 정보를 강제로 재확인하기 위해 사용하기도 하는 이 값의 기본 값은 0이다.
        maximumAge: 30000, // 5분이 지나기 전까지는 수정되지 않아도 됨

        // 위치 정보를 받기 위해 얼마나 오랫동안 대기할 것인가?
        // 기본값은 Infinity이므로 getCurrentPosition()은 무한정 대기한다.
        timeout: 15000, // 15초 이상 기다리지 않는다.
      };

      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.watchPosition(success, error, option);

      //성공했을떄
      function success(position) {
        const time = new Date(position.timestamp); //시각
        var lat = position.coords.latitude; // 위도
        var lon = position.coords.longitude; // 경도
        console.log(`현재 위치는 : ${lat},${lon} `);
        console.log(`시간 : ${time} `);
        console.log(position); //자세한 정보 들어있음,, 반경 구할때 필요할듯??
        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
          message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
      }

      //실패했을때
      function error(e) {
        console.log("geolocation 오류" + e.code + ":" + e.message);
      }
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
        message = "이 브라우저에서는 geolocation을 사용할수 없어요..";

      displayMarker(locPosition, message);
    }

    // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    function displayMarker(locPosition, message) {
      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

      // 인포윈도우를 생성합니다
      var infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      // 인포윈도우를 마커위에 표시합니다
      infowindow.open(map, marker);

      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);
    }
  };
  return (
    <>
      <div id="map" style={{ width: "500px", height: "80vh" }}></div>
      <div class="result">{message}</div>
    </>
  );
}

export default Kakao;
