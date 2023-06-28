// BookDetail.js
import React from "react";
import "./BookDetail.css";

export default function BookDetail({ address, title, x, y }) {
  return (
    <div className="bookDetail">
      <h2 className="bookDetail__title">{title}</h2>
      <h3 className="bookDetail__author">{address}</h3>
      {/* <p className="bookDetail__publisher">
        {address}
      </p> */}
      <p className="bookDetail__rent">
        {x} {y}
      </p>
    </div>
  );
}
