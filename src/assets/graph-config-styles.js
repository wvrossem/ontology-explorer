const styles = {
  styleShowCodes: [{
      selector: "node",
      style: {
        "label": "data(name)",
      }
    },

    {
      selector: "edge",
      style: {
        "width": 1,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
      }
    },

    {
      selector: ".document-group",
      style: {
        "label": "data(name)",
        "text-opacity": 1,
        "font-weight": "bold",
        "text-valign": "center",
        "text-background-color": "white",
        "text-border-style": "solid",
        "text-border-color": "black",
        "z-index": 0,
        "background-opacity": 0.5,
        "shape": "ellipse",
        "background-color": "#D86666",
        "width": "100",
        "height": "100"
      }
    },

    {
      selector: ".code-group",
      style: {
        "label": "data(name)",
        "z-index": 3,
        "shape": "diamond",
        "background-color": "#7d90ae",
        "display": "none",
        "width": "30",
        "height": "30"
      }
    },

    {
      selector: ".code",
      style: {
        "label": "data(name)",
        "opacity": 0.5,
        "z-index": 1,
        "display": "element"
      }
    },

    {
      selector: ".code-document-link",
      style: {
        "display": "none",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "display": "none"
      }
    },
    {
      selector: ".code-document-group-link",
      style: {
        "display": "element"
      }
    },
    {
      selector: ".code-group-document-group-link",
      style: {
        "display": "element"
      }
    },
    {
      selector: ".document",
      style: {
        "label": "",
        "z-index": 2,
        "opacity": 0.3,
        "display": "none",
      }
    },
    {
      selector: ".selected",
      style: {
        "display": "element",
        "opacity": 1,
      }
    }
  ],
  styleShowCodeGroups: [{
      selector: "node",
      style: {
        "label": "data(name)",
      }
    },

    {
      selector: "edge",
      style: {
        "width": 1,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
      }
    },

    {
      selector: ".code",
      style: {
        "label": "data(name)",
        "opacity": 0.3,
        "z-index": 1,
        "display": "none",
      }
    },

    {
      selector: ".document-group",
      style: {
        "label": "data(name)",
        "text-opacity": 1,
        "font-weight": "bold",
        "text-valign": "center",
        "text-background-color": "white",
        "text-border-style": "solid",
        "text-border-color": "black",
        "z-index": 0,
        "background-opacity": 0.5,
        "shape": "ellipse",
        "background-color": "#D86666",
        "width": "100",
        "height": "100"
      }
    },

    {
      selector: ".code-group",
      style: {
        "label": "data(name)",
        "z-index": 3,
        "shape": "diamond",
        "background-color": "#7d90ae",
        "display": "element",
        "width": "30",
        "height": "30"
      }
    },

    {
      selector: ".code-document-link",
      style: {
        "display": "element",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "display": "element"
      }
    },
    {
      selector: ".code-document-group-link",
      style: {
        "display": "element"
      }
    },
    {
      selector: ".code-group-document-group-link",
      style: {
        "display": "element"
      }
    },
    {
      selector: ".document",
      style: {
        "label": "",
        "z-index": 2,
        "opacity": 0.3,
        "display": "none",
      }
    },
    {
      selector: ".selected",
      style: {
        "display": "element",
        "opacity": 1,
      }
    }
  ],
  styleShowAll: [{
      selector: "node",
      style: {
        "label": "data(name)",
      }
    },

    {
      selector: "edge",
      style: {
        "width": 1,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
      }
    },

    {
      selector: ".code",
      style: {
        "label": "data(name)",
        "opacity": 0.5,
        "z-index": 1,
        "display": "element",
      }
    },

    {
      selector: ".document-group",
      style: {
        "label": "data(name)",
        "text-opacity": 1,
        "font-weight": "bold",
        "text-valign": "center",
        "text-background-color": "white",
        "text-border-style": "solid",
        "text-border-color": "black",
        "z-index": 0,
        "background-opacity": 0.5,
        "shape": "ellipse",
        "background-color": "#D86666",
        "width": "100",
        "height": "100"
      }
    },

    {
      selector: ".code-group",
      style: {
        "label": "data(name)",
        "z-index": 3,
        "shape": "diamond",
        "background-color": "#7d90ae",
        "display": "element",
        "width": "30",
        "height": "30"
      }
    },

    {
      selector: ".code-document-link",
      style: {
        "display": "none",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "display": "element",
        "opacity": 0.3,
        "z-index": 1,
      }
    },
    {
      selector: ".code-document-group-link",
      style: {
        "display": "element",
        "opacity": 0.3,
        "z-index": 1,
      }
    },
    {
      selector: ".code-group-document-group-link",
      style: {
        "display": "none"
      }
    },
    {
      selector: ".document",
      style: {
        "label": "",
        "z-index": 2,
        "opacity": 0.3,
        "display": "none",
      }
    },
    {
      selector: ".selected",
      style: {
        "display": "element",
        "opacity": 1,
      }
    }
  ],
}

export default styles;