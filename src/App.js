import "./App.css";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useEffect, useState, useCallback } from "react";
const libraries = ["places"];

function App() {
  const [address, setAddress] = useState("");
  const [clothingStyle, setClothingStyle] = useState([]);
  const [showStyles, setShowStyles] = useState(null);
  const autocompleteRef = useRef(null);
  const autocompleteInstance = useRef(null);
  const [placeInfo, setPlaceInfo] = useState({
    priceLevel: null,
    types: [],
  });

  const handlePlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();
    setAddress(place.formatted_address || place.name);

    const details = {
      priceLevel: place.price_level,
      types: place.types,
    };
    setPlaceInfo(details);
  };

  useEffect(() => {
    console.log(placeInfo.types);
    if (placeInfo.types.includes("restaurant")) {
      switch (placeInfo.priceLevel) {
        case 1:
          setClothingStyle(["Sports Wear", "Casual"]);
          break;

        case 2:
          setClothingStyle(["Casual"]);
          break;

        case 3:
          setClothingStyle(["Business Casual"]);
          break;

        case 4:
          setClothingStyle(["Formal"]);
          break;
        default:
          setClothingStyle(["Unknown"]);
      }
    } else {
      setClothingStyle(["Unknown"]);
    }

    console.log("Use Effect data: ", placeInfo.priceLevel);
    console.log(clothingStyle);
  }, [placeInfo.priceLevel, placeInfo.types]);

  return (
    <div className="container flex justify-center items-center h-screen">
      <div className="row text-center">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
          libraries={libraries}
        >
          <div>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.addListener("place_changed", () =>
                  handlePlaceChanged(autocomplete)
                );
              }}
            >
              <input
                type="text"
                placeholder="where are you going?"
                className="border-2 border-gray-300 p-2 rounded-lg text-lg"
                ref={autocompleteRef}
              />
            </Autocomplete>
          </div>
        </LoadScript>
        {placeInfo && (
          <div>
            <p>This is the price: {placeInfo.priceLevel} </p>
            <p>This is the type of place: {placeInfo.types[0]} </p>
          </div>
        )}
        {clothingStyle && (
          <div>
            <p>Recommended clothing style: {clothingStyle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
