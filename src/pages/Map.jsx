import React, { useEffect } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { getData } from "../services/data.service";

export default function Map() {
  useEffect(() => {
    const map = new OLMap({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [-8246936.494308056, -1119428.8251098266],
        zoom: 7,
        maxZoom: 50,
        minZoom: 5,
      }),
    });

    getData().then((data) => {
      if (data !== null) {
        map.addLayer(data.departments);
        // map.addLayer(data.districts);
        // map.addLayer(data.provinces);
        map.addLayer(data.schools);
      }
    });
    if (map.getView < 9) {
    }

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div>
      <div id="map"></div>
    </div>
  );
}
