import React, { useEffect, useState } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { getData } from "../services/data.service";
import ModalCollege from "../components/ModalCollege";

export default function Map() {
  const [open, setOpen] = useState(false);
  const [schoolData, setSchoolData] = useState(null);

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
        map.addLayer(data.districts);
        map.addLayer(data.provinces);
        map.addLayer(data.schools);
      }

      map.getView().on("change:resolution", () => {
        const zoom = map.getView().getZoom();
        if (zoom < 9 && zoom > 0) {
          data.departments.setVisible(true);
          data.districts.setVisible(false);
          data.provinces.setVisible(false);
        }
        if (zoom >= 9 && zoom < 11) {
          data.departments.setVisible(false);
          data.districts.setVisible(false);
          data.provinces.setVisible(true);
        }
        if (zoom >= 11) {
          data.departments.setVisible(false);
          data.districts.setVisible(true);
          data.provinces.setVisible(false);
        }
      });

      map.on("click", function (evt) {
        const zoom = map.getView().getZoom();
        if (zoom >= 17) {
          const feature = map.forEachFeatureAtPixel(
            evt.pixel,
            (feature) => feature
          );

          if (feature && feature.get("features")) {
            const features = feature.get("features");
            const data = features.map((f) => f.getProperties());

            const College = data.map((properties) => ({
              nombre: properties.nombre,
              nivelModalidad: properties.nivel_modalidad,
              codigoModular: properties.cod_modular,
              direccion: properties.direccion,
              departamento: properties.departamento,
              provincia: properties.provincia,
              distrito: properties.distrito,
              centroPoblado: properties.centro_poblado,
              ugel: properties.ugel,
              codigoUgel: properties.codigo_ugel,
              gestionDependencia: properties.gestion_dependencia,
              ubigeo: properties.ubigeo,
              altitud: properties.altitud,
              latitud: properties.latitud,
              longitud: properties.longitud,
            }));
            setSchoolData(College);
            setOpen(true);
          }
        }
      });
    });

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div>
      <div id="map"></div>
      <ModalCollege open={open} setOpen={setOpen} schoolData={schoolData} />
    </div>
  );
}
