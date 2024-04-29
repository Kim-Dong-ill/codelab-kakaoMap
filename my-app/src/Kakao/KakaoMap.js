import React, { useEffect, useState } from "react";

const { kakao } = window;
let flag = true;

function KakaoMap({ a }) {
  const [] = a;
  // const [view, setView] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    mapscript();
  }, []);

  const mapscript = () => {
    var mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);

    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      // 클릭한 위도, 경도 정보를 가져옵니다
      var latlng = mouseEvent.latLng;

      // 마커 위치를 클릭한 위치로 옮깁니다
      marker.setPosition(latlng);

      var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
      message += "경도는 " + latlng.getLng() + " 입니다";

      // var resultDiv = document.getElementById("result");
      setMessage(message);
    });

    function RoadView() {
      console.log("클릭 실행");
      if (flag == true) {
        console.log("로드뷰 보기");
        // 지도에 로드뷰 정보가 있는 도로를 표시하도록 지도타입을 추가합니다
        const viewRoad = map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
        flag = false;
      } else {
        console.log("로드뷰 취소");
        // 아래 코드는 위에서 추가한 로드뷰 도로 정보 지도타입을 제거합니다
        const noneRoad = map.removeOverlayMapTypeId(
          kakao.maps.MapTypeId.ROADVIEW
        );
        flag = true;
      }
    }

    //로드뷰 스카이뷰 보여주기
    function setMapType(maptype) {
      var roadmapControl = document.getElementById("btnRoadmap");
      var skyviewControl = document.getElementById("btnSkyview");
      if (maptype === "roadmap") {
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
        roadmapControl.classList.add("selected_btn");
        skyviewControl.classList.remove("selected_btn");
      } else {
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
        skyviewControl.classList.add("selected_btn");
        roadmapControl.classList.remove("selected_btn");
      }
    }

    //지도 줌인
    function zoomIn() {
      map.setLevel(map.getLevel() - 1);
    }
    //지도 줌아웃
    function zoomOut() {
      map.setLevel(map.getLevel() + 1);
    }

    let markerPosition = new kakao.maps.LatLng(
      37.62197524055062,
      127.16017523675508
    );

    //클릭시 새로운 마커?
    let marker = new kakao.maps.Marker({
      // position: markerPosition,
      position: map.getCenter(),
    });

    // 지도에 마커를 표시합니다
    marker.setMap(map);

    // 이제 함수들이 정의되었으므로 JSX에서 호출할 수 있습니다.
    document
      .getElementById("btnRoadmap")
      .addEventListener("click", () => setMapType("roadmap"));
    document
      .getElementById("btnSkyview")
      .addEventListener("click", () => setMapType("skyview"));
    document.getElementById("btnloadview").addEventListener("click", RoadView);
    document.getElementById("zoomInBtn")?.addEventListener("click", zoomIn);
    document.getElementById("zoomOutBtn")?.addEventListener("click", zoomOut);
  };

  return (
    <div>
      <span id="btnloadview" className="btn">
        로드뷰
      </span>
      <div className="result">{message}</div>
      <div className="map_wrap">
        <div
          id="map"
          style={{
            width: a[0],
            height: a[1],
            position: "relative",
            overflow: "hidden",
          }}
        ></div>
        <div className="custom_typecontrol radius_border">
          <span id="btnRoadmap" className="selected_btn">
            지도
          </span>
          <span id="btnSkyview" className="btn">
            스카이뷰
          </span>
        </div>
        <div className="custom_zoomcontrol radius_border">
          <span id="zoomInBtn">
            <img
              src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
              alt="확대"
            />
          </span>
          <span id="zoomOutBtn">
            <img
              src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
              alt="축소"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

export default KakaoMap;
