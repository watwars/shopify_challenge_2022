import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import ImageCard from "./ImageCard";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [liked, setLiked] = useState([]);
  const [isMainTab, setIsMainTab] = useState(true);

  const apiKey = process.env.REACT_APP_NASA_API_KEY;

  const fetchNewData = useCallback(() => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=10`;
    axios
      .get(url)
      .then((response) => {
        const items = response.data;
        setData((data) => [...data, ...items]);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching data from NASA API");
        console.error(error);
      });
  }, [apiKey]);

  // Fetching images from NASA API
  useEffect(() => {
    setIsLoading(true);
    fetchNewData();
  }, [fetchNewData]);

  useEffect(() => {
    const alreadyLiked = JSON.parse(localStorage.getItem("liked")) || [];
    setLiked(alreadyLiked);
  }, []);

  const isItemLiked = (item) => {
    for (const l of liked) {
      if (l.url === item.url) return true;
    }
    return false;
  };

  const addLike = (item) => {
    const newLiked = [...liked, item];
    setLiked(newLiked);
    localStorage.setItem("liked", JSON.stringify(newLiked));
    toast.success(`You liked ${item.title}`);
  };

  const removeLike = (item) => {
    const newLiked = liked.filter((i) => i.url !== item.url);
    setLiked(newLiked);
    localStorage.setItem("liked", JSON.stringify(newLiked));
    toast.error(`You disliked ${item.title}`);
  };

  const switchTab = () => {
    setIsMainTab((isMainTab) => !isMainTab);
  };

  const itemsToShow = isMainTab ? data : liked;
  const buttonText = isMainTab ? "View Liked Images" : "Browse All Images";

  return (
    <div className="app-container">
      <ToastContainer />
      <div className="app-heading">
        <div>
          <h1 className="mt-5 mb-2">NASA Images</h1>
          <p className="lead mb-5">Images fetched from the NASA API.</p>
        </div>
        <button onClick={switchTab} className="btn btn-secondary">
          {buttonText}
        </button>
      </div>

      {!isLoading ? (
        <div className="text-center">
          <div className="images-container">
            {itemsToShow.length > 0 ? (
              itemsToShow.map((item) => (
                <ImageCard
                  item={item}
                  liked={isItemLiked(item)}
                  addLike={addLike}
                  removeLike={removeLike}
                  key={item.date}
                />
              ))
            ) : (
              <div>No images to show</div>
            )}
          </div>
          {isMainTab ? (
            <button
              onClick={fetchNewData}
              className="btn btn-primary mt-3 mb-3"
            >
              View More...
            </button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="loading-container">
          Loading...
          <div
            className="spinner-border"
            style={{ width: "2rem", height: "2rem" }}
            role="status"
          >
            <span className="sr-only"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
