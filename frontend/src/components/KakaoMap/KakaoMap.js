import React, { useEffect, useRef } from "react";
import "./KakaoMap.css";

const { kakao } = window;

const KakaoMap = ({ places }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const mapOption = {
      center: new kakao.maps.LatLng(places[0].y, places[0].x),
      level: 4,
      mapTypeId: kakao.maps.MapTypeId.ROADMAP,
    };
    const map = new kakao.maps.Map(mapContainer.current, mapOption);

    const clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 10,
    });

    const markers = places.map((place, index) => {
      const locPosition = new kakao.maps.LatLng(
        parseFloat(place.y) + Math.random() * 0.0002 - 0.0001,
        parseFloat(place.x) + Math.random() * 0.0002 - 0.0001
      );
      const message = `
        <div class="info-window">
            <h1>${place.place_name}</h1>
            <p>${place.category_name}</p>
            <p>${place.address_name}</p>
        </div>`;

      const marker = new kakao.maps.Marker({
        position: locPosition,
      });

      const infowindow = new kakao.maps.InfoWindow({
        content: message,
        removable: true,
      });

      // Add event listener for marker click
      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });

      // Open the info window for 30% of markers initially
      if (Math.random() < 0.3) {
        infowindow.open(map, marker);
      }

      return marker;
    });

    clusterer.addMarkers(markers);

    if (places.length > 0) {
      map.setCenter(new kakao.maps.LatLng(places[0].y, places[0].x));
    }
  }, [places]);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "500px" }}
    />
  );
};

export default KakaoMap;
