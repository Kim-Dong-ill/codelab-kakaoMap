import React, { useEffect } from "react";
import KakaoMap from "./Kakao/KakaoMap";
import { useForm } from "react-hook-form";

function App() {
  const a = [1500, 500];

  return (
    <>
      <KakaoMap a={a}> </KakaoMap>
    </>
  );
}

export default App;
