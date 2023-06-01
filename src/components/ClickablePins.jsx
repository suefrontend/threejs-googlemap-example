import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { ThreeJSOverlayView } from "@googlemaps/three";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import "../App.css";

function ClickablePins(props) {
  const [places, setPlaces] = useState([]);

  const hotels = [
    { name: "Hyatt Regency Vancouver" },
    { name: "Fairmont Hotel Vancouver" },
    { name: "Rosewood Hotel Georgia" },
    { name: "Metropolitan Hotel Vancouver" },
    { name: "Days Inn by Wyndham Vancouver Downtown" },
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

    const fetchData = async () => {
      const placesData = [];
      for (const hotel of hotels) {
        const location = await fetchDirections(hotel.name);
        placesData.push({ ...location, name: hotel.name });
        console.log("placesData", placesData);
      }
      setPlaces(placesData); // Set the places state to the fetched locations
      console.log("places", places);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (places.length > 0) {
      for (const place of places) {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map: props.map,
          animation: window.google.maps.Animation.DROP,
        });

        // InfoWindow TEST
        const infowindow = new window.google.maps.InfoWindow({
          content: place.name,
          disableAutoPan: true, // Disable automatic panning 
        });

        marker.addListener("click", () => {
          infowindow.open(props.map, marker);
        });
      }
    }
  }, [places, props.map]);
}
export default ClickablePins;
