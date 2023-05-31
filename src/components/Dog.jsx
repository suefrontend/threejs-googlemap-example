import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ThreeJSOverlayView } from "@googlemaps/three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

// Locations of dogs
const locations = [
  { lat: 49.285804, lng: -123.119927 },
  { lat: 49.286704, lng: -123.129184 },
  { lat: 49.283365, lng: -123.100725 },
  { lat: 49.276688, lng: -123.126354 },
  { lat: 49.28101, lng: -123.11879 },
  { lat: 49.281228, lng: -123.125477 },
  { lat: 49.281603, lng: -123.110954 },
  { lat: 49.285806, lng: -123.137186 },
  { lat: 49.28407, lng: -123.113193 },
  { lat: 49.287405, lng: -123.125083 },
];

const Dog = (props) => {
  const dogRef = useRef();

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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load("/low_australian_shepherd/scene.gltf", function (gltf) {
      for (let i = 0; i <= locations.length; i++) {
        const cloneDog = clone(gltf.scene);
        cloneDog.scale.setScalar(1.5);
        // cloneDog.translateY(100);
        cloneDog.rotateY(-120);
        cloneDog.position.copy(
          overlay.latLngAltitudeToVector3({
            lat: locations[i].lat,
            lng: locations[i].lng,
          })
        );
        scene.add(cloneDog);
      }
    });
  }, []);
};

export default Dog;
