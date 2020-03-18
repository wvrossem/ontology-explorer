import graph_data from './graph_data_atlas';

const coseLayout = {
  name: 'cose',
  idealEdgeLength: 100,
  nodeOverlap: 20,
  refresh: 20,
  fit: true,
  padding: 30,
  randomize: false,
  componentSpacing: 100,
  nodeRepulsion: 400000,
  edgeElasticity: 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1000,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
}

const colaLayout = {
  name: 'cola',
  animate: true, // whether to show the layout as it's running
  refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 10000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

  // layout event callbacks
  ready: function () {}, // on layoutready
  stop: function () {}, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
  nodeSpacing: function (node) {
    return 10;
  }, // extra spacing around nodes
  flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
  gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined, // sets edge length directly in simulation
  edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
  edgeJaccardLength: undefined, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

  // infinite layout options
  infinite: false // overrides all other options for a forces-all-the-time mode
}

const coseBilkent = {
  name: 'cose-bilkent',
  // Called on `layoutready`
  ready: function () {},
  // Called on `layoutstop`
  stop: function () {},
  // 'draft', 'default' or 'proof" 
  // - 'draft' fast cooling rate 
  // - 'default' moderate cooling rate 
  // - "proof" slow cooling rate
  quality: 'draft',
  // Whether to include labels in node dimensions. Useful for avoiding label overlap
  nodeDimensionsIncludeLabels: true,
  // number of ticks per frame; higher is faster but more jerky
  refresh: 50,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 0,
  // Whether to enable incremental mode
  randomize: true,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal (intra-graph) edge length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.25,
  // Maximum number of iterations to perform
  numIter: 2500,
  // Whether to tile disconnected nodes
  tile: true,
  // Type of layout animation. The option set is {'during', 'end', false}
  animate: 'end',
  // Duration for animate:end
  animationDuration: 300,
  // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingVertical: 10,
  // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5
}

const clay = {
  name: "klay"
}

const cise = {
  name: "cise",

  // ClusterInfo can be a 2D array contaning node id's or a function that returns cluster ids. 
  // For the 2D array option, the index of the array indicates the cluster ID for all elements in 
  // the collection at that index. Unclustered nodes must NOT be present in this array of clusters.
  // 
  // For the function, it would be given a Cytoscape node and it is expected to return a cluster id  
  // corresponding to that node. Returning negative numbers, null or undefined is fine for unclustered
  // nodes.  
  // e.g
  // Array:                                     OR          function(node){
  //  [ ['n1','n2','n3'],                                       ...
  //    ['n5','n6']                                         }
  //    ['n7', 'n8', 'n9', 'n10'] ]                         
  clusters: (node) => {
    return node.name();
  },

  // -------- Optional parameters --------
  // Whether to animate the layout
  // - true : Animate while the layout is running
  // - false : Just show the end result
  // - 'end' : Animate directly to the end result
  animate: false,

  // number of ticks per frame; higher is faster but more jerky
  refresh: 10,

  // Animation duration used for animate:'end'
  animationDuration: undefined,

  // Easing for animate:'end'
  animationEasing: undefined,

  // Whether to fit the viewport to the repositioned graph
  // true : Fits at end of layout for animate:false or animate:'end'
  fit: true,

  // Padding in rendered co-ordinates around the layout
  padding: 30,

  // separation amount between nodes in a cluster
  // note: increasing this amount will also increase the simulation time 
  nodeSeparation: 12.5,

  // Inter-cluster edge length factor 
  // (2.0 means inter-cluster edges should be twice as long as intra-cluster edges)
  idealInterClusterEdgeLengthCoefficient: 1.4,

  // Whether to pull on-circle nodes inside of the circle
  allowNodesInsideCircle: false,

  // Max percentage of the nodes in a circle that can move inside the circle
  maxRatioOfNodesInsideCircle: 0.1,

  // - Lower values give looser springs
  // - Higher values give tighter springs
  springCoeff: 0.45,

  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,

  // Gravity force (constant)
  gravity: 0.25,

  // Gravity range (constant)
  gravityRange: 3.8,

  // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
  ready: function () {}, // on layoutready
  stop: function () {}, // on layoutstop
}

const config = {
  elements: graph_data,
  style: [{
      selector: "node",
      style: {
        "background-color": "#666",
        "label": "data(name)",
        "width": "10",
        "height": "10"
      }
    },
    {
      selector: "edge",
      style: {
        "width": 1,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle"
      }
    },
    {
      selector: ".hidden",
      style: {
        "display": "none"
      }
    },
    {
      selector: ".visible",
      style: {
        "display": "element"
      }
    },
    {
      selector: 'node:compound',
      css: {
        'background-opacity': 0.333
      }
    },
    {
      selector: "node.cy-expand-collapse-collapsed-node",
      style: {
        "background-color": "#D86666",
        "shape": "rectangle"
      }
    },
    {
      selector: "node[[indegree = 0]][[outdegree = 0]]",
      style: {
        'display': "element"
      }
    },
    {
      selector: ":selected",
      style: {
        "width": "5",
      }
    },
    {
      selector: ".highlight",
      style: {
        "background-color": "yellow",
      }
    },
    {
      selector: ".code",
      style: {
        "label": "",
        "opacity": 0.3,
        "z-index": 1,
        "visibility": "visible",
        // "display": "none",
      }
    },
    {
      selector: ".code-document-link",
      style: {
        // "visibility": "hidden"
        "display": "none",
      }
    },
    {
      selector: ".code-group-link",
      style: {
        "visibility": "visible"
      }
    },
    {
      selector: ".document",
      style: {
        "label": "",
        "z-index": 2,
        "opacity": 0.3,
        "visibility": "hidden"
      }
    },
    {
      selector: ".doc-group-link",
      style: {
        "label": "",
        "z-index": 1,
        "opacity": 0.3,
        "visibility": "hidden"
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
        "background-opacity": 0.2,
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
        "opacity": 0.7,
        "shape": "diamond",
        "background-color": "#7d90ae",
        "visibility": "visible",
        "width": "30",
        "height": "30"
      }
    },
    // {
    //   selector: "node[[degree <= 2]]",
    //   style: {
    //     'width': '2',
    //     'height': '2',
    //   }
    // },
    // {
    //   selector: "node[[degree >= 5]]",
    //   style: {
    //     'width': '50',
    //     'height': '50',
    //   }
    // },
    // {
    //   selector: "node[[degree >= 10]]",
    //   style: {
    //     'width': '50',
    //     'height': '50',
    //   }
    // },
    // FIXME, IO: IOM - MiMOSA - interviews has no coded docs so hide it
    {
      selector: "#df_13",
      style: {
        'display': 'none',
      }
    },
  ],
  boxSelectionEnabled: false,
  autounselectify: true,
  // coseLayout colaLayout coseBilkent clay cise
  layout: coseBilkent,
};

export default config;