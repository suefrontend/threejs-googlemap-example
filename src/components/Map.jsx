import { useState, useRef, useEffect } from "react";
import BasicAnimation from "./BasicAnimation";
import Text from "./Text";
import Pins from "./Pins";
import Control from "./Control";
import Direction from "./Direction";
import RouteAnimation from "./RouteAnimation";
import ClickablePins from "./ClickablePins";

function Map(props) {
  const [map, setMap] = useState();
  const [route, setRoute] = useState();
  const [currentComponent, setCurrentComponent] = useState();
  const ref = useRef();
  // console.log("current component", currentComponent);

  useEffect(() => {
    const instance = new window.google.maps.Map(ref.current, props.mapOptions);
    setMap(instance);
  }, []);

  return (
    <>
      <div ref={ref} id="map" />
      {map && <Control setCurrentComponent={setCurrentComponent} />}

      {currentComponent === "animation" && map && (
        <BasicAnimation map={map} mapOptions={props.mapOptions} />
      )}
      {currentComponent === "text" && map && (
        <Text map={map} mapOptions={props.mapOptions} />
      )}
      {currentComponent === "pins" && map && (
        <Pins map={map} mapOptions={props.mapOptions} />
      )}
      {currentComponent === "direction" && map && (
        <>
          <Direction
            map={map}
            setRoute={setRoute}
            mapOptions={props.mapOptions}
          />
          <RouteAnimation
            map={map}
            mapOptions={props.mapOptions}
            route={route}
          />
        </>
      )}
      {/* {map && <ClickablePins map={map} mapOptions={props.mapOptions} />} */}
    </>
  );
}

export default Map;
