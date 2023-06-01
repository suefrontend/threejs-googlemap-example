import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { ThreeJSOverlayView } from "@googlemaps/three";
import { getGeocode, getLatLng } from "use-places-autocomplete";

function ClickablePins(props) {
  const [places, setPlaces] = useState([]);

  const hotels = [
    { name: "Hyatt Regency Vancouver" },
    { name: "Fairmont Hotel Vancouver" },
    { name: "Rosewood Hotel Georgia" },
    { name: "Metropolitan Hotel Vancouver" },
    { name: "Days Inn by Wyndham Vancouver Downtown" },
    { name: "St Regis Hotel" },
    { name: "EXchange Hotel Vancouver - An Executive Hotel" },
    { name: "Shangri-La Vancouver" },
    { name: "Vancouver Marriott Pinnacle Downtown Hotel" },
    { name: "Delta Hotels by Marriott Vancouver Downtown Suites" },
    { name: "Loden Hotel" },
    { name: "Wedgewood Hotel & Spa" },
  ];

  async function fetchDirections(name) {
    const locationResult = await getGeocode({ address: name });
    const locationLatLng = await getLatLng(locationResult[0]);

    // console.log("locationLatLng", locationLatLng);
    return locationLatLng;
  }

  useEffect(() => {
    props.map.setCenter(props.mapOptions.center);
    const overlay = new ThreeJSOverlayView({
      anchor: {
        lat: props.mapOptions.center.lat,
        lng: props.mapOptions.center.lng,
        altitude: 0,
      },
      upAxis: "Y",
    });
    overlay.setMap(props.map);

    const scene = overlay.scene;

    for (const hotel of hotels) {
      fetchDirections(hotel.name);
    }

    // はじめ
    /// まずはピンを表示させる
    const marker = new window.google.maps.Marker({
      position: props.mapOptions.center,
    });
    marker.setMap(props.map);

    // InfoWindow TEST
    // 実際の住所を表示させたい
    var infowindow = new window.google.maps.InfoWindow({
      content: "Address Comes Here",
    });
    infowindow.open(props.map, marker);

    /// それをクリッカブルにする
    /// クリックしたら、InfoWindowが出てくるようにする

    // 最終ゴール
    /// 自動でBurrard Station近くのホテルを取得して、ピンを打つ
    /// ピンをクリックすると、InfoWindowが開く

    return () => {
      overlay.setMap(null); // Remove the overlay when the component unmounts
    };
  }, []);
}
export default ClickablePins;
