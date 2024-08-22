import "./App.css";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef, useEffect, useState, useCallback } from "react";
import { MdOutlineMessage } from "react-icons/md";

const libraries = ["places"];

function App() {
  const [address, setAddress] = useState("");
  const [clothingStyle, setClothingStyle] = useState([]);
  const [showStyles, setShowStyles] = useState(null);
  const [userChat, setUserChat] = useState("");
  const [modelChat, setModelChat] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [showMaps, setShowMaps] = useState(true);
  const [showChatBot, setShowChatBot] = useState(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user_chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userChat: userChat }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("post result: ", result.response);
      setModelChat(result.response);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
    setUserChat("");
  };

  console.log("userChat: ", userChat);

  return (
    <div className="container flex justify-center items-center h-screen">
      <div className="row fixed bottom-4 right-4 z-10 overflow-auto">
        {showChatBot && (
          <div className="row transition-opacity duration-300 opacity-100 pb-4">
            {modelChat.length > 0 && (
              <div>
                {modelChat.map((message, index) => (
                  <p key={index} className="mb-1">
                    {message}
                  </p>
                ))}
              </div>
            )}
            <form>
              <input
                type="text"
                placeholder="chat with the bot"
                className="border-2 border-gray-300 p-2 rounded-lg text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                value={userChat}
                onChange={(e) => setUserChat(e.target.value)}
              />
            </form>
          </div>
        )}
        <button
          className="bg-blue-500 text-white p-2 rounded-full shadow-lg transition-transform duration-300 ease-in-out "
          onClick={() => setShowChatBot(!showChatBot)}
        >
          <MdOutlineMessage className="text-xl" />
        </button>
      </div>
      <div className="row text-center absolute flex z-0">
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
