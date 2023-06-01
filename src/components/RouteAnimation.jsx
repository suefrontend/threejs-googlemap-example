import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import ThreejsOverlayView from "@ubilabs/threejs-overlay-view";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";

function RouteAnimation(props) {
  const overlayRef = useRef();
  const trackRef = useRef();
  const dogRef = useRef();

  const ANIMATION_MS = 10000;
  const FRONT_VECTOR = new THREE.Vector3(0, -1, 0);

  useEffect(() => {
    if (props.route) {
      props.map.setCenter(props.route[Math.floor(props.route.length / 2)], 17);

      if (!overlayRef.current) {
        overlayRef.current = new ThreejsOverlayView(props.mapOptions.center);
        overlayRef.current.setMap(props.map);
      }

      const scene = overlayRef.current.getScene();
      const points = props.route.map((p) =>
        overlayRef.current.latLngAltToVector3(p)
      );
      const curve = new THREE.CatmullRomCurve3(points);

      if (trackRef.current) {
        scene.remove(trackRef.current);
      }

      trackRef.current = createTrackFromCurve(curve);
      scene.add(trackRef.current);

      loadModal().then((model) => {
        if (dogRef.current) {
          overlayRef.current.scene.remove(dogRef.current);
        }
        dogRef.current = model;
        scene.add(dogRef.current);
      });

      overlayRef.current.update = () => {
        trackRef.current.material.resolution.copy(
          overlayRef.current.getViewportSize()
        );

        if (dogRef.current) {
          const progress = (performance.now() % ANIMATION_MS) / ANIMATION_MS;
          curve.getPointAt(progress, dogRef.current.position);
          dogRef.current.quaternion.setFromUnitVectors(
            FRONT_VECTOR,
            curve.getTangentAt(progress)
          );
          dogRef.current.rotateX(Math.PI / 2);
          dogRef.current.rotateY(Math.PI / 2);
        }

        overlayRef.current.requestRedraw();
      };

      console.log("overlay", overlayRef.current);

      return () => {
        scene.remove(trackRef.current);
        scene.remove(dogRef.current);
        overlayRef.current.setMap(null); // Remove the overlay when the component unmounts
      };
    }
  }, [props.route]);
}

async function loadModal() {
  const loader = new GLTFLoader();
  const object = await loader.loadAsync("/low_australian_shepherd/scene.gltf");
  const scene = object.scene;
  scene.scale.setScalar(0.5);

  return scene;
}

function createTrackFromCurve(curve) {
  const points = curve.getSpacedPoints(curve.points.length * 10);
  const positions = points.map((point) => point.toArray()).flat();

  const lineGeometry = new LineGeometry().setPositions(positions);
  const lineMaterial = new LineMaterial({
    color: 0xffb703,
    linewidth: 6,
  });

  return new Line2(lineGeometry, lineMaterial);
}

export default RouteAnimation;
