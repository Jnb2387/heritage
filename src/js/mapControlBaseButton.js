import SatelliteStyle from "../../data/heritage_satellite_style.json";
import RegularStyle from "../../data/heritage_style.json";

const defaultStyles = [
  {
    label: "OSM",
    title: "Basemap with color style",
    styleName: "Heritage Style",
    styleUrl: RegularStyle
  },
  {
    label: "Sat",
    title: "Basemap with satellite imagery",
    styleName: "Heritage Satellite Style",
    styleUrl: SatelliteStyle
  }
];

//Layers to match visibility from old style to new
const customlayers = [
  "heritage_address_num",
  "heritage_parcels_fill",
  "heritage_parcels_line",
  "heritage_buildings-3d",
  "points",
  "points_label"
];

export default class StylesControl {
  constructor(options = {}) {
    this.styles = options.styles || defaultStyles;
    this.onChange = options.onChange;
  }

  insertControls() {
    this.container = document.createElement("div");
    this.container.classList.add("mapboxgl-ctrl");
    this.container.classList.add("mapboxgl-ctrl-group");
    this.styles.forEach(style => {
      const node = document.createElement("button");
      node.setAttribute("type", "button");
      node.setAttribute("title", style.title);
      node.textContent = style.label;
      node.addEventListener("click", () => {
        //Get the visibility of each customlayer
        let allLayers = this.map.getStyle().layers;
        let filterLayers = customlayers.map(layer => {
          return allLayers.find(a => a.id == layer);
        });
        //Change the Style
        // if (node.classList.contains("-active")) return;
        this.map.setStyle(style.styleUrl);
        if (this.onChange) this.onChange(style);

        //Set the visibility of the customLayers
        filterLayers.forEach(layer => {
          this.map.setLayoutProperty(
            layer.id,
            "visibility",
            layer.layout.visibility
          );
        });
      });
      this.container.appendChild(node);
      // this.container.append(node);
      // document.querySelector(".layermenuclass").appendChild(node);
    });
  }

  onAdd(map) {
    this.map = map;
    this.insertControls();
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
