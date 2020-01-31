const fs = require('fs');
const parse = require('csv-parse');
const clean = require('get-clean-string')()

// Using the first line of the CSV data to discover the column names
rs = fs.createReadStream('/Users/woutervanrossem/Desktop/RQ2.1 EU IS AFSJ - Code Manager.csv');

const elements = []

let edgeId = 0

const groups = new Set()

function addNode(node) {
  elements.push(node);
}

function createNode(id, name) {
  return {
    data: {
      id,
      name
    },
    group: "nodes"
  };
}

function createIfNotExists(group) {
  if (group && !groups.has(group)) {
    groups.add(group)
    let node =  createNode(group, group);
    addNode(node);
  }
}

function addEdgeLink(codeName, groupName) {
  elements.push({
    data: {
      id: edgeId++,
      source: codeName,
      target: groupName
    },
    group: "edges"
  })
}

parser = parse({
  columns: true
}, function (err, data) {
  data.forEach((code) => {
    let codeName = clean(code.Name, '-');
    let node = createNode(codeName, codeName)

    code.Groups.split(',').forEach((group) => {
      if (group) {
        let groupName = clean(group, '-');
        createIfNotExists(groupName)
        if (groupName.startsWith("attributes-")) {
          node.data.parent = groupName;
        }
        addEdgeLink(codeName, groupName);
        addNode(node)
      }
    })
  })

  // let elements = elements.slice(0, 100);

  let fileContents = `
const elements = ${JSON.stringify( elements )};

export default elements;
`;

  // console.log({nodes, edges})
  fs.writeFile('public/js/graph_data_compound.js', fileContents, 'utf8', () => {});
});

rs.pipe(parser);