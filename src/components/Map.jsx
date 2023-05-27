import { useState, useRef, useEffect } from "react";

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
    </>
  );
}
export default Map;
