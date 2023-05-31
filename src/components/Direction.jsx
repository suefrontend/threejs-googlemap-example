import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import ThreejsOverlayView from "@ubilabs/threejs-overlay-view";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getGeocode, getLatLng } from "use-places-autocomplete";

function Direction(props) {
  const [origin, setOrigin] = useState("Burrard");
  const [destination, setDestination] = useState("27 Front St E Toronto");

  useEffect(() => {
    fetchDirections(origin, destination, props.setRoute);
  }, [origin, destination]);

  return (
    <div className="directions">
      <h2>Direction</h2>
      <h3>Origin</h3>
      <p>{origin}</p>
      <h3>Destination</h3>
      <p>{destination}</p>
    </div>
  );
}

const ANIMATION_MS = 10000;
const FRONT_VECTOR = new THREE.Vector3(0, -1, 0);

function Animation(props) {
  const overlayRef = useRef();
  const trackRef = useRef();
  const carRef = useRef();

  useEffect(() => {
    props.map.setCenter(props.route[Math.floor(props.route.length / 2)], 17);

    if (!overlayRef.current) {
      overlayRef.current = new ThreejsOverlayView(mapOptions.center);
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
      if (carRef.current) {
        overlayRef.current.scene.remove(carRef.current);
      }
      carRef.current = model;
      scene.add(carRef.current);
    });

    overlayRef.current.update = () => {
      trackRef.current.material.resolution.copy(
        overlayRef.current.getViewportSize()
      );

      if (carRef.current) {
        const progress = (performance.now() % ANIMATION_MS) / ANIMATION_MS;
        curve.getPointAt(progress, carRef.current.position);
        carRef.current.quaternion.setFromUnitVectors(
          FRONT_VECTOR,
          curve.getTangentAt(progress)
        );
        carRef.current.rotateX(Math.PI / 2);
      }

      overlayRef.current.requestRedraw();
    };

    return () => {
      scene.remove(trackRef.current);
      scene.remove(carRef.current);
    };
  }, [props.route]);
}

async function loadModal() {
  const loader = new GLTFLoader();
  const object = await loader.loadAsync("/low_poly_car/scene.gltf");
  console.log("object", object);
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
  const line = new Line2(lineGeometry, lineMaterial);
  console.log("line", line);
  return line;
}

async function fetchDirections(origin, destination, setRoute) {
  const [originResults, destinationResults] = await Promise.all([
    getGeocode({ address: origin }),
    getGeocode({ address: destination }),
  ]);

  const [originLocation, destinationLocation] = await Promise.all([
    getLatLng(originResults[0]),
    getLatLng(destinationResults[0]),
  ]);

  const service = new window.google.maps.DirectionsService();
  service.route(
    {
      origin: originLocation,
      destination: destinationLocation,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK" && result) {
        const route = result.routes[0].overview_path.map((path) => ({
          lat: path.lat(),
          lng: path.lng(),
        }));
        setRoute(route);
      }
    }
  );
}

export default Direction;
