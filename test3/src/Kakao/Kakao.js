import React, { useEffect, useState } from "react";

const { kakao } = window;

// 1. 회원가입한 본인 주소 기준으로 근처(반경 계산) 해서 근처에 있는 강아지(다른 유저의 주소를 가지고)를 맵 상단에 띄운다. (화면 이동해도 변하지x)
// 2. 본인 위치를 실시간으로 받아서 근처 (반경계산) 해서 근처의 약속 모임을 지도에 띄워진다. (리스트화 시킨다면 정렬 필요할듯? 정렬 기준 필요)
// 3. 처음에 현재 위치의 시.도.군 을 가져와서 해당되는 기준에 대한 데이터만 가져오게 한다.

//----추가할 필요가 있는 기능----
//키워드로 장소검색하고 목록으로 표출하기
//좌표로 주소를 얻어내기
//주소로 장소 표시하기
//마커 클러스터러 사용하기

// 마커 이미지의 이미지 주소입니다
var imageSrc = "./images/marker.svg";
var imageSize = new kakao.maps.Size(40, 42);
var imageOption = { offset: new kakao.maps.Point(20, 42) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

//37.4800384,126.8842496 현재 위치

var currentPosition = []; //사용자의 현재 위치 좌표

function Kakao() {
  const [message, setMessage] = useState(""); //지도 클릭시 위도 경도 메세지
  const [map, setMap] = useState(null); //카카오 map
  const [markers, setMarkers] = useState([]); //마커들 표시
  const [currentOverlay, setCurrentOverlay] = useState(null); //오버레이 있으면 (overlay) 오버레이 없으면 null
  const [positions, setPositions] = useState([
    {
      title: "카카오",
      latlng: new kakao.maps.LatLng(37.479311460347, 126.8866702429908),
    },
    {
      title: "생태연못",
      latlng: new kakao.maps.LatLng(37.4761376343048, 126.8843235209789),
    },
    {
      title: "텃밭",
      latlng: new kakao.maps.LatLng(37.47941009051748, 126.87717317821058),
    },
    {
      title: "근린공원",
      latlng: new kakao.maps.LatLng(37.48622254460432, 126.87797612110123),
    },
    {
      title: "아무곳",
      latlng: new kakao.maps.LatLng(37.48587053082275, 126.88638897195683),
    },
    {
      title: "아무곳",
      latlng: new kakao.maps.LatLng(37.48184075616303, 126.89363105403429),
    },
    {
      title: "아무곳",
      latlng: new kakao.maps.LatLng(37.472827784332004, 126.89047846655862),
    },
  ]);

  //useEffect start---------------------------------------------------------------------------useEffect start
  useEffect(() => {
    if (!map) {
      mapscript(); //------------------------------------------------------------------------mapscript()
    } else {
      //37.4800384,126.8842496 현재 위치
      console.log(currentPosition.latitude);

      //바운더리 설정
      var sw = new kakao.maps.LatLng(
        //- 0.007는 중심에서 멀어지는 값이다. 커질수록 범위 넓어짐
        currentPosition.latitude - 0.007,
        currentPosition.longitude - 0.007
      ); //왼쪽 하단
      var ne = new kakao.maps.LatLng(
        currentPosition.latitude + 0.007,
        currentPosition.longitude + 0.007
      ); //오른쪽 상단
      var lb = new kakao.maps.LatLngBounds(sw, ne);
      //map이 있으면~~
      //for문으로 기존 배열 지도에 마커찍기
      for (var i = 0; i < positions.length; i++) {
        //근처에 있는지 없는지 (true / false)
        let isBoundery = lb.contain(positions[i].latlng);
        console.log(isBoundery);

        //근처에 있다면 (true) 보여준다
        if (isBoundery === true) {
          addMarker(positions[i], map, imageSrc, imageSize, imageOption);
        }
      }

      // map이 업데이트될 때마다 이벤트 리스너 추가
      kakao.maps.event.addListener(map, "click", function (position) {
        //오버레이가 있을때 오버레이 지우기
        if (currentOverlay) {
          //오버레이 있으면~지우기
          return currentOverlay.setMap(null);
        } else {
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
        }
      });
    }
  }, [map, positions, currentOverlay]); // map이 업데이트될 때만 useEffect 실행
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

    //
    //-------------------------------------------------------------------------------geolocation start
    //
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
      const option = {
        // 가능한 경우, 높은 정확도의 위치(예를 들어, GPS 등) 를 읽어오려면 true로 설정
        // 그러나 이 기능은 배터리 지속 시간에 영향을 미친다.
        enableHighAccuracy: false, // 대략적인 값이라도 상관 없음: 기본값

        // 위치 정보가 충분히 캐시되었으면, 이 프로퍼티를 설정하자,
        // 위치 정보를 강제로 재확인하기 위해 사용하기도 하는 이 값의 기본 값은 0이다.
        maximumAge: 0, // 30000 : 5분이 지나기 전까지는 수정되지 않아도 됨

        // 위치 정보를 받기 위해 얼마나 오랫동안 대기할 것인가?
        // 기본값은 Infinity이므로 getCurrentPosition()은 무한정 대기한다.
        timeout: 15000, // 15초 이상 기다리지 않는다.
      };

      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.watchPosition(success, error, option);

      //성공했을떄
      function success(position) {
        currentPosition = position.coords;
        const time = new Date(position.timestamp); //시각
        var lat = position.coords.latitude; // 위도
        var lon = position.coords.longitude; // 경도
        console.log(`현재 위치는 : ${lat},${lon} `);
        console.log(`시간 : ${time} `);
        console.log(position.coords); //자세한 정보 들어있음,, 반경 구할때 필요할듯??
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
    } //-------------------------------------------------------------------------------geolocation end
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

      //오버레이가 있을때 오버레이 지우기
      if (currentOverlay) {
        return currentOverlay.setMap(null);
      } else {
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
        setCurrentOverlay(overlay); //CurrentOverlay를 overlay로 변경
      }
    });
  };
  //addMarker end---------------------------------------------------------------------------addMarker end

  //커스텀 오버레이 닫기 함수
  function closeOverlay(overlay) {
    console.log("오버레이 닫힘");
    overlay.setMap(null); //이거 오버레이 닫기 기능 안됨 수정 필요
    setMap(null); //이거 오버레이 닫기 기능 안됨 수정 필요
    setCurrentOverlay(null); //오버레이 null로 변경
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
