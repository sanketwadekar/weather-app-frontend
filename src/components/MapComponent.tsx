import React, { useEffect } from "react";

declare global {
  interface Window {
    initMap?: () => void;
  }
}

interface MapProps {
  lat: number | null;
  long: number | null;
}

const MapComponent: React.FC<MapProps> = ({ lat, long }) => {
  useEffect(() => {
    // const loadGoogleMapsScript = () => {
    //   const googleMapScript = document.createElement("script");
    //   googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAC7C6mxFDHWh9YCNTIjAvP_7GenOIjh1g&libraries=marker&callback=initMap`;
    //   googleMapScript.async = true;
    //   googleMapScript.defer = true;
    //   document.head.appendChild(googleMapScript);
    // };

    // Set the initMap function on the window object
    // window.initMap = initMap;

    // Check if the script is already added to avoid reloading it
    // if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
    //   loadGoogleMapsScript();
    // }
    initMap()
    // return () => {
    //   // Clean up the script and global initMap function on unmount
    //   // delete window.initMap;
    // };
  }, []);

  const initMap = (): void => {
    const mapOptions = {
      zoom: 13,
      center: { lat: lat || 0, lng: long || 0}, // Use lat and long from props
      mapId: "DEMO_MAP_ID"
    };

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      mapOptions
    );

    new google.maps.marker.AdvancedMarkerElement({
      position: { lat : lat || 0, lng: long || 0}, // Use lat and long from props
      map: map,
    });
  };

  return (
    <div id="map" className="w-100" style={{ height: "500px" }}></div>
  );
};

export default MapComponent;
