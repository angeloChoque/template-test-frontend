import { Vector } from "ol/source.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as Layer } from "ol/layer.js";
import { clusterStyle, polygonStyle } from "../utils/layerStyle";
import { Cluster } from "ol/source.js";

const DEPARTMENT_FEATURE_KEY = "DEPARTAMEN";
const PROVINCE_FEATURE_KEY = "PROVINCIA";
const DISTRICT_FEATURE_KEY = "DISTRITO";
const COLLEGE_FEATURE_KEY = "INSTITUTO";

const DATA_DIRECTORY = "./data";

const DEPARTMENTS_PATH = `${DATA_DIRECTORY}/output_departamentos.geojson`;
const DISTRICTS_PATH = `${DATA_DIRECTORY}/output_distritos.geojson`;
const SCHOOLS_PATH = `${DATA_DIRECTORY}/output_instituciones_educ.geojson`;
const PROVINCES_PATH = `${DATA_DIRECTORY}/output_provincias.geojson`;

export async function getData() {
  try {
    const result = await Promise.all([
      fetchData(DEPARTMENTS_PATH),
      fetchData(PROVINCES_PATH),
      fetchData(DISTRICTS_PATH),
      fetchData(SCHOOLS_PATH),
    ]);
    return {
      departments: dataToLayer(result[0], 0, DEPARTMENT_FEATURE_KEY),
      provinces: dataToLayer(result[1], 2, PROVINCE_FEATURE_KEY),
      districts: dataToLayer(result[2], 1, DISTRICT_FEATURE_KEY),
      schools: dataToLayer(result[3], 3, COLLEGE_FEATURE_KEY),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function dataToLayer(data, counter, name) {
  if (name == "INSTITUTO") {
    const clusterSource = new Cluster({
      source: new Vector({
        features: new GeoJSON({
          featureProjection: "EPSG:3857",
        }).readFeatures(data),
      }),
      distance: 40,
      minDistance: 20,
      zIndex: 10,
    });
    return new Layer({
      source: clusterSource,
      style: (feature) => clusterStyle(feature),
    });
  } else if (name == "DEPARTAMEN") {
    return new Layer({
      source: new Vector({
        features: new GeoJSON({
          featureProjection: "EPSG:3857",
        }).readFeatures(data),
      }),
      style: (feature) => polygonStyle(feature, counter, name),
    });
  }
  return new Layer({
    source: new Vector({
      features: new GeoJSON({
        featureProjection: "EPSG:3857",
      }).readFeatures(data),
    }),
    style: (feature) => polygonStyle(feature, counter, name),
    visible: false,
  });
}

async function fetchData(path) {
  const response = await fetch(path);
  return await response.json();
}
