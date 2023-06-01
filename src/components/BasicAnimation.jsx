import React, { useEffect } from "react";
import * as THREE from "three";
import { ThreeJSOverlayView } from "@googlemaps/three";

function BasicAnimation(props) {
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

    const animateCamera = (time) => {
      // update just the heading, leave everything else as it is
      props.map.moveCamera({
        heading: (time / 1000) * degreesPerSecond,
      });

      animationRequestId.current = requestAnimationFrame(animateCamera);
    };

    const animationRequestId = { current: null };
    animateCamera(0); // Start the animation

    return () => {
      cancelAnimationFrame(animationRequestId.current); // Cancel the animation frame when the component unmounts
      overlay.setMap(null); // Remove the overlay when the component unmounts
    };
  }, []);

  const degreesPerSecond = 3;

  return null; // Since this component doesn't render anything, you can return null or a placeholder
}

export default BasicAnimation;
