import React, { useEffect } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { ThreeJSOverlayView } from "@googlemaps/three";

const Text = (props) => {
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

    const fontLoader = new FontLoader();

    fontLoader.load("./font.json", function (font) {
      const title = "HYATT HOTEL VANCOUVER".split(" ");

      for (const index in title) {
        createTitle(title[index], index);
      }

      function createTitle(title, index) {
        let textGeometry = new TextGeometry(title, {
          font: font,
          size: 35,
          height: 5,
        });
        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0x4285f4,
          specular: 0xffffff,
        });

        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.copy(
          overlay.latLngAltitudeToVector3({
            lat: props.mapOptions.center.lat,
            lng: props.mapOptions.center.lng,
          })
        );
        if (index !== 0) {
          textMesh.position.setY(130 + index * 15);
        } else {
          textMesh.position.setY(130);
        }

        textMesh.geometry.computeBoundingBox();
        textMesh.geometry.translate(
          -textMesh.geometry.boundingBox.max.x / 2,
          0,
          0
        );

        textMesh.scale.set(0.3, 0.3, 0.3);
        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        textMesh.rotation.y = -Math.PI;

        overlay.scene.add(textMesh);
      }
    });

    // Create a line
    let material = new THREE.LineBasicMaterial({ color: 0x4285f4 });
    const points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, 120, 0));

    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let line = new THREE.Line(geometry, material);

    line.position.copy(
      overlay.latLngAltitudeToVector3({
        lat: props.mapOptions.center.lat,
        lng: props.mapOptions.center.lng,
      })
    );

    overlay.scene.add(line);
  }, []);
};

export default Text;
