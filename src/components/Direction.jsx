import { useState, useRef, useEffect } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import "../App.css";

function Direction(props) {
  const [origin, setOrigin] = useState("Burrard Skytrain Station");
  const [destination, setDestination] = useState("English Bay Beach");

  async function fetchDirections(origin, destination, setRoute) {
    // Fetch geocode
    const [originResults, destinationResults] = await Promise.all([
      getGeocode({ address: origin }),
      getGeocode({ address: destination }),
    ]);

    // Convert geocode to latitude and longitude
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
          console.log("route", route);
        }
      }
    );
  }

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

export default Direction;
