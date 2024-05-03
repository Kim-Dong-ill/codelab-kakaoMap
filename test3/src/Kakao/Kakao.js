import React, { useEffect, useState } from "react";

const { kakao } = window;

//draggable 마커 이벤트 적용하기

//출발지 입력시 해당 주소로 이동하여 마커 찍기
//이후 상세하게 지도 or 마커 움직여서 정확한 중심점 찾기

//
//------------------------------kakao map start----------------------------//
//

function Kakao() {
  const [message, setMessage] = useState(""); //지도 클릭시 위도 경도 메세지
  const [map, setMap] = useState(null); //카카오 map
  const [geocoder, setGeocoder] = useState();

  //출발지 검색start--------------------------------------------------------출발지 검색start----------------------------------------------------------------출발지 검색 start
  useEffect(() => {
    if (!map) {
      mapscript();
    } else {
      // 주소로 좌표를 검색합니다
      geocoder.addressSearch(
        "제주특별자치도 제주시 첨단로 242",
        function (result, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            console.log(coords);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
          } else {
          }
        }
      );

      // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "dragend", function () {
        // 지도 중심좌표를 얻어옵니다
        var latlng = map.getCenter();
        console.log(latlng);

        var message = "변경된 지도 중심좌표는 " + latlng.getLat() + " 이고, ";
        message += "경도는 " + latlng.getLng() + " 입니다";

        var resultDiv = document.getElementById("result");
        resultDiv.innerHTML = message;
        console.log("출발 좌표", latlng);
      });
    }
  }, [map]);
  //출발지 검색end------------------------------------------------------출발지 검색end-----------------------------------------------------------------출발지 검색 end

  //

  //

  //mapscript start---------------------------------------------------------------------------------------mapscript start
  const mapscript = () => {
    var mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(37.4800384, 126.8842496), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
        mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
      };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    setMap(map);

    // 마우스 휠과 모바일 터치를 이용한 지도 확대, 축소를 막음
    map.setZoomable(false);

    // 확대 축소 컨트롤을 생성하고 지도의 우측에 추가
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();
    setGeocoder(geocoder);
  };
  //mapscript end------------------------------------------------------------------------------------------mapscript end

  //

  return (
    <>
      <div id="map" style={{ width: "500px", height: "80vh" }}>
        <div className="startMarker">
          <div className="startName">출발지</div>
          <img src="./images/marker.svg" alt="" />
        </div>
      </div>
      <div class="result">{message}</div>
      <p id="result"></p>
    </>
  );
}

export default Kakao;
