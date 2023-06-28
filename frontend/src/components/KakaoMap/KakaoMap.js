import React, { useEffect, useRef } from "react";

const { kakao } = window;

const KakaoMap = ({ places }) => {
  const mapContainer = useRef(null); // This will hold the map DOM node

  useEffect(() => {
    // Create the map
    const mapOption = {
      center: new kakao.maps.LatLng(places[0].y, places[0].x),
      level: 4,
      mapTypeId: kakao.maps.MapTypeId.ROADMAP,
    };
    const map = new kakao.maps.Map(mapContainer.current, mapOption);

    // Function to display marker
    function displayMarker(locPosition, message) {
      const marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
      });

      const infowindow = new kakao.maps.InfoWindow({
        content: message,
        removable: false,
      });

      infowindow.open(map, marker);
      map.setCenter(locPosition);
    }

    // Loop through each place and display marker
    places.forEach(place => {
      const locPosition = new kakao.maps.LatLng(place.y, place.x);
      const message = `<div style="padding:5px;width:100%">${place.place_name}<br/>${place.address_name}</div>`;
      displayMarker(locPosition, message);
    });
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
