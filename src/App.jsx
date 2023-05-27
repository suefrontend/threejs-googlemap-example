import { Wrapper } from "@googlemaps/react-wrapper";
import Map from "./components/Map";
import "./App.css";

function App() {
  const mapOptions = {
    center: {
      lat: 49.286,
      lng: -123.120556,
    },
    zoom: 17,
    heading: 200,
    tilt: 200,
    mapId: import.meta.env.VITE_MAP_ID,
  };

  return (
    <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map mapOptions={mapOptions} />
    </Wrapper>
  );
}

export default App;
