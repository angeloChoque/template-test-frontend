import { Fill, Stroke, Style, Text, Circle } from "ol/style.js";

export function polygonStyle(feature, layerNumber, name) {
  const styleParameter = [
    {
      color: "red",
      width: 3,
      textColor: "black",
      textWidth: 2,
      strokeColor: "#fff",
      strokeWidth: 2,
      text: feature.get(name),
    },
    {
      color: "blue",
      width: 3,
      textColor: "blue",
      textWidth: 2,
      strokeColor: "#fff",
      strokeWidth: 2,
      text: feature.get(name),
    },
    {
      color: "black",
      width: 3,
      textColor: "red",
      textWidth: 2,
      strokeColor: "#fff",
      strokeWidth: 2,
      text: feature.get(name),
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

export function clusterStyle(feature) {
  const size = feature.get("features").length; // Número de elementos en el clúster.
  return new Style({
    image: new Circle({
      radius: 12, // Tamaño ajustado según el número de elementos.
      fill: new Fill({
        color: "green", // Color del clúster.
      }),
      stroke: new Stroke({
        color: "white",
        width: 2,
      }),
    }),
    text: new Text({
      text: size.toString(), // Mostrar el número de elementos.
      font: "14px Calibri,sans-serif",
      fill: new Fill({
        color: "white",
      }),
    }),
  });
}