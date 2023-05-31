import { useState, useRef, useEffect } from "react";
import Animation from "./Animation";
import Text from "./Text";
import Dog from "./Dog";

function Map(props) {
  const [map, setMap] = useState();
  const ref = useRef();

  useEffect(() => {
    const instance = new window.google.maps.Map(ref.current, props.mapOptions);
    setMap(instance);
  }, []);

  return (
    <>
      <div ref={ref} id="map" />
      {/* {map && <Animation map={map} mapOptions={props.mapOptions} />} */}
      {/* {map && <Text map={map} mapOptions={props.mapOptions} />} */}
      {map && <Dog map={map} mapOptions={props.mapOptions} />}
    </>
  );
}

export default Map;
