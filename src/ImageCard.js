import React, { useState, useEffect } from "react";
import "./ImageCard.css";

const CHARACTERS_LIMIT = 80;

const ImageCard = ({ item, liked, addLike, removeLike }) => {
  const [showAllExplanation, setShowAllExplanation] = useState(false);
  const { url, date, explanation, title } = item;

  useEffect(() => {
    if (explanation.length <= CHARACTERS_LIMIT) {
      setShowAllExplanation(true);
    }
  }, [explanation]);

  return (
    <div className="image-card">
      <img src={url} alt={title} />
      <div className="image-text">
        <h3>{title}</h3>
        <p className="lead">{date}</p>
        {showAllExplanation ? (
          <div>
            {explanation}{" "}
            <span
              onClick={() => setShowAllExplanation(false)}
              className="content-toggle"
            >
              Less
            </span>
          </div>
        ) : (
          <div>
            {explanation.substring(0, CHARACTERS_LIMIT)}...{" "}
            <span
              onClick={() => setShowAllExplanation(true)}
              className="content-toggle"
            >
              More
            </span>
          </div>
        )}
        {!liked ? (
          <button
            className="btn btn-success mt-2"
            onClick={() => addLike(item)}
          >
            Like
          </button>
        ) : (
          <button
            className="btn btn-info mt-2"
            onClick={() => removeLike(item)}
          >
            Dislike
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
