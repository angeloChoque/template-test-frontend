import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Circle as CircleStyle, Stroke, Style, Fill, Text } from "ol/style.js";
import { Cluster, Vector as VectorSource } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import GeoJSON from "ol/format/GeoJSON.js";

const DOMAIN = "./data";
const DEPARTAMENTOS = `${DOMAIN}/output_departmental.geojson`;
const PROVINCIAS = `${DOMAIN}/output_provincial.geojson`;
const DISTRITOS = `${DOMAIN}/output_distrital.geojson`;
const COLEGIOS = `${DOMAIN}/output_colegios.geojson`;
const LOADER = document.getElementById("laoder");
const DATA_MODAL = document.getElementById("data-modal");
const BODY_MODAL = document.getElementById("body-modal");
const CLOSE_MODAL = document.getElementById("close-modal");

async function getData(url) {
  let data = null;

  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (err) {
    console.error(err);
  }

  return data;
}

var map = new Map({
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

(async () => {
  LOADER.classList.remove("hidden");
  LOADER.classList.add("show");

  function polygonStyleFunction(feature, layerNumber) {
    const styleParameter = [
      {
        color: "black",
        width: 3,
        textColor: "black",
        textWidth: 2,
        strokeColor: "#fff",
        strokeWidth: 2,
        text: feature.get("DEPARTAMEN"),
      },
      {
        color: "blue",
        width: 3,
        textColor: "blue",
        textWidth: 2,
        strokeColor: "#fff",
        strokeWidth: 2,
        text: feature.get("PROVINCIA"),
      },
      {
        color: "red",
        width: 3,
        textColor: "red",
        textWidth: 2,
        strokeColor: "#fff",
        strokeWidth: 2,
        text: feature.get("DISTRITO"),
      },
    ];
    return new Style({
      stroke: new Stroke({
        color: styleParameter[layerNumber].color,
        width: styleParameter[layerNumber].width,
      }),
      text: new Text({
        font: "16px Calibri,sans-serif",
        fill: new Fill({
          color: styleParameter[layerNumber].textColor,
        }),
        stroke: new Stroke({
          color: styleParameter[layerNumber].strokeColor,
          width: styleParameter[layerNumber].strokeWidth,
        }),
        text: styleParameter[layerNumber].text,
      }),
    });
  }

  const departamentos = await getData(DEPARTAMENTOS);
  const vectorSource = new VectorSource({
    features: new GeoJSON({ featureProjection: "EPSG:3857" }).readFeatures(
      departamentos
    ),
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: (feature) => polygonStyleFunction(feature, 0),
  });

  map.addLayer(vectorLayer);

  // PROVINCIAS
  const provincias = await getData(PROVINCIAS);
  const vectorSourceProvincias = new VectorSource({
    features: new GeoJSON({ featureProjection: "EPSG:3857" }).readFeatures(
      provincias
    ),
  });

  const vectorLayerProvincias = new VectorLayer({
    source: vectorSourceProvincias,
    style: (feature) => polygonStyleFunction(feature, 1),
    visible: false,
  });

  map.addLayer(vectorLayerProvincias);

  // DISTRITOS
  const distritos = await getData(DISTRITOS);
  const vectorSourceDistritos = new VectorSource({
    features: new GeoJSON({ featureProjection: "EPSG:3857" }).readFeatures(
      distritos
    ),
  });

  const vectorLayerDistritos = new VectorLayer({
    source: vectorSourceDistritos,
    style: (feature) => polygonStyleFunction(feature, 2),
    visible: false,
  });

  map.addLayer(vectorLayerDistritos);

  // COLEGIOS
  const colegios = await getData(COLEGIOS);
  const vectorSourceColegios = new VectorSource({
    features: new GeoJSON({ featureProjection: "EPSG:3857" }).readFeatures(
      colegios
    ),
  });

  const clusterSourceColegios = new Cluster({
    distance: 40,
    source: vectorSourceColegios,
    minDistance: 20,
    zIndex: 10,
  });

  const styleCache = {};
  const clustersColegios = new VectorLayer({
    source: clusterSourceColegios,
    style: function (feature) {
      const size = feature.get("features").length;
      let style = styleCache[size];
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: "#fff",
            }),
            fill: new Fill({
              color: "#3399CC",
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: "#fff",
            }),
          }),
        });
        styleCache[size] = style;
      }
      return style;
    },
  });

  map.addLayer(clustersColegios);

  /// events
  map.getView().on("change:resolution", (event) => {
    // get curent zoom level
    const zoom = map.getView().getZoom();
    console.log(zoom);

    if (zoom < 9) {
      vectorLayer.setVisible(true);
      vectorLayerProvincias.setVisible(false);
      vectorLayerDistritos.setVisible(false);
    } else if (zoom < 11 && zoom >= 9) {
      vectorLayer.setVisible(false);
      vectorLayerProvincias.setVisible(true);
      vectorLayerDistritos.setVisible(false);
    } else if (zoom >= 9 && zoom < 11) {
      vectorLayer.setVisible(false);
      vectorLayerProvincias.setVisible(true);
      vectorLayerDistritos.setVisible(false);
      console.log("provincias");
    } else if (zoom >= 11) {
      vectorLayer.setVisible(false);
      vectorLayerProvincias.setVisible(false);
      vectorLayerDistritos.setVisible(true);
      console.log("distritos");
    }
  });

  map.on("click", function (evt) {
    const zoom = map.getView().getZoom();
    if (zoom >= 17) {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });

      // get features from clustered
      if (feature && feature.get("features")) {
        const features = feature.get("features");
        console.log(features);
        const data = features.map((f) => f.getProperties());
        console.log(data);

        const colegios = [];

        data.forEach((d) => {
          colegios.push({
            nombre: d.nombre,
            nivelModalidad: d.nivel_modalidad,
            codigoModular: d.cod_modular,
            direccion: d.direccion,
            departamento: d.departamento,
            provincia: d.provincia,
            distrito: d.distrito,
            centroPoblado: d.centro_poblado,
            ugel: d.ugel,
            codigoUgel: d.codigo_ugel,
            gestionDependencia: d.gestion_dependencia,
            ubigeo: d.ubigeo,
            altitud: d.altitud,
            latitud: d.latitud,
            longitud: d.longitud,
          });
        });

        BODY_MODAL.innerHTML = "";

        colegios.forEach((c, i) => {
          const div = document.createElement("div");
          div.innerHTML = `
            <h2 class="text-lg font-bold mb-2">${c.nombre}(${c.codigoModular})</h2>
            <p><b>Nivel y Modalidad:</b> ${c.nivelModalidad}</p>
            <p><b>Código Modular:</b> ${c.codigoModular} </p>
            <p><b>Dirección:</b> ${c.direccion}</p>
            <p><b>Departamento:</b> ${c.departamento}</p>
            <p><b>Provincia:</b> ${c.provincia}</p>
            <p><b>Distrito:</b> ${c.distrito}</p>
            <p><b>Centro Poblado:</b> ${c.centroPoblado}</p>
            <p><b>UGEL:</b> ${c.ugel}</p>
            <p><b>Código UGEL:</b> ${c.codigoUgel}</p>
            <p><b>Gestión y Dependencia:</b> ${c.gestionDependencia}</p>
            <p><b>Ubigeo:</b> ${c.ubigeo}</p>
            <p><b>Altitud:</b> ${c.altitud}</p>
            <p><b>Latitud:</b> ${c.latitud}</p>
            <p><b>Longitud:</b> ${c.longitud}</p>
          `;

          if (i > 0) {
            const hr = document.createElement("hr");
            hr.classList.add("my-2");
            BODY_MODAL.appendChild(hr);
          }

          BODY_MODAL.appendChild(div);
        });

        DATA_MODAL.classList.remove("hidden");
        DATA_MODAL.classList.add("show");
      }
    }
  });

  LOADER.classList.remove("show");
  LOADER.classList.add("hidden");

  CLOSE_MODAL.addEventListener("click", () => {
    DATA_MODAL.classList.remove("show");
    DATA_MODAL.classList.add("hidden");
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      DATA_MODAL.classList.remove("show");
      DATA_MODAL.classList.add("hidden");
    }
  });
})();
