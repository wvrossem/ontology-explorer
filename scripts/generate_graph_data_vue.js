const fs = require('fs');
const parse = require('csv-parse');
const clean = require('get-clean-string')()

// Using the first line of the CSV data to discover the column names
rs = fs.createReadStream('/Users/woutervanrossem/Desktop/RQ2.1 EU IS AFSJ - Code Manager.csv');

const nodes = []
const edges = []

const elements = []

let edgeId = 0

const groups = new Set()

function addNode(id, name) {
  elements.push({
    data: { id, name },
    group: "nodes"
  })
}

function checkIfExists(group) {
  if(group && !groups.has(group)) {
    groups.add(group)
    addNode(group, group)
  }
}

parser = parse({columns: true}, function(err, data){
  data.forEach((code) => {
    let codeName = clean(code.Name, '-');
    addNode(codeName, codeName)

    code.Groups.split(',').forEach((group) => {
      if(group) {
        let groupName = clean(group, '-');
        checkIfExists(groupName)
        elements.push({
          data: {
            id: edgeId++,
            source: codeName,
            target: groupName
          },
          group: "edges"
        })
      }
    })
  })

let fileContents = `
const elements = ${JSON.stringify( elements.slice(0,20) )};

export default elements;
`;

  // console.log({nodes, edges})
  fs.writeFile('public/js/graph_data_full.js', fileContents, 'utf8', () => {});
});

rs.pipe(parser);
