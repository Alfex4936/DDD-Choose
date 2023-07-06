import React, { useEffect, useRef } from "react";

const { kakao } = window;

const KakaoMap = ({ places }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    // Create the map
    const mapOption = {
      center: new kakao.maps.LatLng(places[0].y, places[0].x),
      level: 4,
      mapTypeId: kakao.maps.MapTypeId.ROADMAP,
    };
    const map = new kakao.maps.Map(mapContainer.current, mapOption);

    // Create marker clusterer
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map, // The map that the markers will be added to
      averageCenter: true, // Whether the center of the cluster marker should be the average position of the markers in the cluster
      minLevel: 10, // The minimum level to cluster markers
    });

    // Loop through each place and display marker
    const markers = places.map(place => {
      const locPosition = new kakao.maps.LatLng(place.y, place.x);
      const message = `<div style="padding:5px;width:100%">${place.place_name}<br/>${place.category_name}<br/>${place.address_name}</div>`;

      const marker = new kakao.maps.Marker({
        position: locPosition,
      });

      const infowindow = new kakao.maps.InfoWindow({
        content: message,
        removable: true,
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });

      infowindow.open(map, marker);
      return marker;
    });

    // Add markers to clusterer
    clusterer.addMarkers(markers);

    // Set map center as first place
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
