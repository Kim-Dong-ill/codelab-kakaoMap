import React, { useEffect, useState } from "react";

const { kakao } = window;

//선의 거리 계산하기
// 마커 이미지의 이미지 주소입니다
var imageSrc = "./images/marker.svg";
var imageSize = new kakao.maps.Size(40, 42);
var imageOption = { offset: new kakao.maps.Point(20, 42) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

function Kakao() {
  const [message, setMessage] = useState(""); //지도 클릭시 위도 경도 메세지
  const [map, setMap] = useState(null); //카카오 map
  const [markers, setMarkers] = useState([]); //마커들 표시
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
    {
      title: "아무곳",
      latlng: new kakao.maps.LatLng(37.562942148793745, 126.98723276638651),
    },
  ]);

  //useEffect start---------------------------------------------------------------------------useEffect start
  useEffect(() => {
    if (!map) {
      mapscript(); //------------------------------------------------------------------------mapscript()
    } else {
      //map이 있으면~~
      //for문으로 기존 배열 지도에 마커찍기
      for (var i = 0; i < positions.length; i++) {
        console.log(positions[0].latlng);
        addMarker(positions[i], map, imageSrc, imageSize, imageOption);
      }

      // map이 업데이트될 때마다 이벤트 리스너 추가
      kakao.maps.event.addListener(map, "click", function (position) {
        //map 초기화
        setMap(null);

        console.log("지도 클릭event");
        var latlng = position.latLng;
        setMessage(
          "클릭한 위치의 위도는 " +
            latlng.getLat() +
            " 이고, 경도는 " +
            latlng.getLng() +
            " 입니다"
        );
        updateMarkersCoords(latlng);
        addMarker(position, map, imageSrc, imageSize, imageOption);
      });
    }
  }, [map, positions]); // map이 업데이트될 때만 useEffect 실행
  // 나중에 수정사항 - 클릭시 기존 map이 초기화 되지만 약간 느리다.
  //useEffect end---------------------------------------------------------------------------useEffect end

  //클릭시 마커들의 위도 경도 저장 배열
  const updateMarkersCoords = (latlng) => {
    setPositions((prevCoords) => [
      ...prevCoords,
      {
        title: "새로운 마커",
        latlng: new kakao.maps.LatLng(latlng.Ma, latlng.La),
      },
    ]);
  };

  console.log(positions); // 복사한 배열 db에 저장 필요

  //mapscript start---------------------------------------------------------------------------mapscript start
  const mapscript = () => {
    var mapContainer = document.getElementById("map"),
      mapOption = {
        center: new kakao.maps.LatLng(37.5648, 126.98119), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
        mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
      };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    setMap(map);

    // 마우스 드래그와 모바일 터치를 이용한 지도 이동을 막음
    map.setDraggable(false);

    // 마우스 휠과 모바일 터치를 이용한 지도 확대, 축소를 막음
    map.setZoomable(false);

    // 지도 타입 변경 컨트롤을 생성하고 지도의 상단 우측에 추가
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 확대 축소 컨트롤을 생성하고 지도의 우측에 추가
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  };
  //mapscript end---------------------------------------------------------------------------mapscript end

  //

  //addMarker start---------------------------------------------------------------------------addMarker start
  const addMarker = (position, map, imageSrc, imageSize, imageOption) => {
    if (!map) return;
    console.log("마커 생성(addMarker)");

    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      map: map, // 마커를 표시할 지도
      position: position.latlng, // 마커를 표시할 위치
      title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      image: markerImage, // 마커 이미지
    });
    setMarkers((prevMarkers) => [...prevMarkers, marker]);

    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, "click", function () {
      console.log("마커 클릭event");

      //마커 클릭시 해당 마커로 중심좌표 이동
      var mapContainer = document.getElementById("map"),
        mapOption = {
          center: new kakao.maps.LatLng(
            marker.getPosition().Ma,
            marker.getPosition().La
          ), // 지도의 중심좌표
          level: 5, // 지도의 확대 레벨
          mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
        };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      setMap(map);

      var overlayContent = `
            <div class="wrap">
              <div class="info">
                <div class="title">
                  ${position.title}
                  <button><div class="close" title="닫기"></div></button>
                </div>
                <div class="body">
                  <div class="img">
                    <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" style={{width:"73px",height:"70px"}}>
                  </div>
                  <div class="desc">
                    <div class="ellipsis">aaaaaaa 242</div>
                    <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>
                    <div><a href="https://www.kakaocorp.com/main" class="link">홈페이지</a></div>
                  </div>
                </div>
              </div>
            </div>`;

      // 마커 위에 커스텀오버레이를 표시합니다
      // 마커를 중심으로 커스텀 오버레이를 표시하기위해 CSS를 이용해 위치를 설정했습니다
      var overlay = new kakao.maps.CustomOverlay({
        content: overlayContent,
        position: marker.getPosition(),
      });

      // overlayContent를 DOM 요소로 변환합니다.
      var overlayElement = document.createElement("div");
      overlayElement.innerHTML = overlayContent.trim();

      // 닫기 버튼을 선택합니다.
      var closeButton = overlayElement.querySelector(".close");
      console.log(closeButton);

      // 닫기 버튼에 클릭 이벤트를 추가합니다.
      closeButton.addEventListener("click", function (event) {
        console.log("closeBtn 클릭");
        event.stopPropagation(); //지도 클릭 이벤트 전파되는걸 방지
        closeOverlay(overlay);
      });

      // //커스텀 오버레이 닫기 함수
      // function closeOverlay(overlay) {
      //   console.log("오버레이 닫힘");
      //   overlay.setMap(null); //이거 오버레이 닫기 기능 안됨 수정 필요
      // }

      // overlay에 클릭 이벤트를 추가하여 닫기 버튼을 클릭할 때 오버레이만 닫히도록 설정합니다.
      kakao.maps.event.addListener(overlay, "click", function (event) {
        console.log("오버레이 클릭event");
        // 클릭한 요소가 닫기 버튼인 경우에만 오버레이를 닫음
        if (event.target.classList.contains("close")) {
          console.log("오버레이 닫기 클릭");
          closeOverlay(overlay);
        }
      });

      // 지도를 클릭했을 때 마커가 추가되는 것을 방지합니다.
      const mapClickListener = function () {
        console.log("지도 클릭으로 오버레이 닫기");
        // 커스텀 오버레이가 열려있는 경우 닫기 함수를 호출합니다.

        closeOverlay(overlay);
      };

      // 커스텀 오버레이 닫기 함수에서 호출되므로 오버레이가 닫힌 후에 지도 클릭 이벤트 리스너를 다시 등록합니다.
      kakao.maps.event.addListener(overlay, "close", function () {
        console.log("오버레이가 닫혔습니다.");
        // 지도 클릭 이벤트 리스너를 다시 등록합니다.
        kakao.maps.event.addListener(map, "click", mapClickListener);
      });

      // 기존에 등록된 클릭 이벤트 리스너를 삭제합니다.
      kakao.maps.event.removeListener(map, "click", mapClickListener);
      // 새로운 클릭 이벤트 리스너를 등록합니다.
      kakao.maps.event.addListener(map, "click", mapClickListener);

      overlay.setMap(map);
    });
  };
  //addMarker end---------------------------------------------------------------------------addMarker end

  //커스텀 오버레이 닫기 함수
  function closeOverlay(overlay) {
    console.log("오버레이 닫힘");
    overlay.setMap(null); //이거 오버레이 닫기 기능 안됨 수정 필요
  }

  //마커 보이기 클릭시
  const showMarkers = () => {
    markers.forEach((marker) => marker.setMap(map));
  };

  //마커 숨기기 클릭시
  const hideMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
  };

  return (
    <>
      <div id="map" style={{ width: "500px", height: "80vh" }}></div>
      <div class="result">{message}</div>
      <p>
        <button onClick={hideMarkers}>마커 감추기</button>
        <button onClick={showMarkers}>마커 보이기</button>
      </p>
      <em>클릭한 위치에 마커가 표시됩니다!</em>
    </>
  );
}

export default Kakao;
