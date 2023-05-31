import React, { useEffect } from "react";
import * as THREE from "three";
import { ThreeJSOverlayView } from "@googlemaps/three";

function Animation(props) {
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

    // Red sphere for test
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(15, 32, 16),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    sphere.position.copy(
      overlay.latLngAltitudeToVector3({ lat: 49.285, lng: -123.120556 })
    );
    overlay.scene.add(sphere);
  }, []);

  const degreesPerSecond = 3;

  function animateCamera(time) {
    // update just the heading, leave everything else as it is
    props.map.moveCamera({
      heading: (time / 1000) * degreesPerSecond,
    });

    requestAnimationFrame(animateCamera);
  }

  // start the animation
  requestAnimationFrame(animateCamera);
}

export default Animation;
