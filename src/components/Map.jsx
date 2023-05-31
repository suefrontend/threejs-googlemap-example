import { useState, useRef, useEffect } from "react";
import Animation from "./Animation";
import Text from "./Text";
import Dog from "./Dog";
import Control from "./Control";

function Map(props) {
  const [map, setMap] = useState();
  const [currentComponent, setCurrentComponent] = useState("animation");
  const ref = useRef();
  console.log("current component", currentComponent);

  useEffect(() => {
    const instance = new window.google.maps.Map(ref.current, props.mapOptions);
    setMap(instance);
  }, []);

  return (
    <>
      <div ref={ref} id="map" />

      {currentComponent === "animation" && map && (
        <Animation map={map} mapOptions={props.mapOptions} />
      )}
      {currentComponent === "text" && map && (
        <Text map={map} mapOptions={props.mapOptions} />
      )}
      {currentComponent === "pins" && map && (
        <Dog map={map} mapOptions={props.mapOptions} />
      )}
      {/* {map && <Dog map={map} mapOptions={props.mapOptions} />}*/}
      {map && <Control setCurrentComponent={setCurrentComponent} />}
    </>
  );
}

export default Map;
