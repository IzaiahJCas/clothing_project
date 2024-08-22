import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
const libraries = ["places"];

function SearchBar() {
  const [address, setAddress] = useState("");
  const [placeInfo, setPlaceInfo] = useState(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || place.name);
      const details = {
        priceLevel: place.price_level,
        types: place.types,
      };
      setPlaceInfo(details);
      console.log(details);
    });
  }, []);

  return (
    <div className="container flex justify-center items-center h-screen">
      <div className="row text-center">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
          libraries={libraries}
        >
          <div>
            <input
              type="text"
              placeholder="where are you going?"
              className="border-2 border-gray-300 p-2 rounded-lg text-lg"
              ref={autocompleteRef}
            />
          </div>
        </LoadScript>
      </div>
    </div>
  );
}

export default SearchBar;
