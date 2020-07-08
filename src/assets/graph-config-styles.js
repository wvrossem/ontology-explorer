const defaultStyles = [{
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
      "curve-style": "haystack"
    }
  },

  {
    selector: ".code",
    style: {
      "label": "data(name)",
      "opacity": 0.3,
      "z-index": 1,
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
      "z-index": 5,
      "background-opacity": 1,
      "shape": "ellipse",
      "background-color": "#E39393",
      padding: "50px"
    }
  },

  {
    selector: ".code-group",
    style: {
      "label": "data(name)",
      "z-index": 3,
      "shape": "diamond",
      "background-color": "#7d90ae",
      // "padding": "5px"
      "width": "30",
      "height": "30"
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
    selector: ".code-document-link",
    style: {
      "display": "none",
    }
  }
]

const selectedStyle = {
  selector: ".selected",
  style: {
    "label": "data(name)",
    "visibility": "visible",
    "opacity": 1,
  }
}

const styles = {
  styleShowCodes: [
    ...defaultStyles,
    {
      selector: ".code",
      style: {
        "visibility": "visible",
      }
    }, {
      selector: ".code-group",
      style: {
        "visibility": "hidden",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "visibility": "hidden",
      }
    },
    {
      selector: ".code-document-group-link",
      style: {
        "visibility": "visible",
      }
    },
    {
      selector: ".code-group-document-group-link",
      style: {
        "visibility": "hidden",
      }
    },
    selectedStyle
  ],
  styleShowCodeGroups: [
    ...defaultStyles,
    {
      selector: ".code",
      style: {
        "visibility": "hidden",
      }
    }, {
      selector: ".code-group",
      style: {
        "visibility": "visible",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "visibility": "hidden",
      }
    },
    {
      selector: ".code-document-group-link",
      style: {
        "visibility": "hidden",
      }
    },
    {
      selector: ".code-group-document-group-link",
      style: {
        "visibility": "visible",
      }
    },
    selectedStyle
  ],
  styleShowAll: [
    ...defaultStyles,
    {
      selector: ".code",
      style: {
        "visibility": "visible",
      }
    }, {
      selector: ".code-group",
      style: {
        "visibility": "visible",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "visibility": "visible",
      }
    },
    {
      selector: ".code-document-group-link",
      style: {
        "visibility": "visible",
      }
    },
    {
      selector: ".code-group-document-group-link",
      style: {
        "visibility": "visible",
      }
    },
    selectedStyle
  ],
}

export default styles;