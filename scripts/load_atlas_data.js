const parser = require('fast-xml-parser');
const fs = require('fs');
const he = require('he');

const xmlData = fs.readFileSync("/Users/woutervanrossem/Workspace/onto-graph-vue/scripts/RQ2.1 EU IS AFSJ.xml").toString();

var options = {
  attributeNamePrefix: "@_",
  attrNodeName: false, //default is 'false'
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  attrValueProcessor: (val, attrName) => he.decode(val, {
    isAttributeValue: true
  }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
  stopNodes: ["parse-me-as-string"]
};

if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
  var jsonObj = parser.parse(xmlData, options);
}

// Intermediate obj
var tObj = parser.getTraversalObj(xmlData, options);
var jsonObj = parser.convertToJson(tObj, options);

const documents = [];
const quotations = new Map();
const codes = new Map();
const codeGroups = [];
const docGroups = [];

function processPrimDoc(primDoc) {
  if (primDoc.quotations['@_size'] <= 1) {
    // FIXME case when only one quotation
    return;
  }

  const docQuotations = primDoc.quotations.q.map(element => {
    const docQuotation = {
      name: element["@_name"],
      id: element["@_id"],
      doc: primDoc["@_id"]
    }

    quotations.set(element["@_id"], docQuotation);

    return docQuotation;
  })

  return {
    name: primDoc["@_name"],
    id: primDoc["@_id"],
    // quotations: docQuotations
  };
}

function processCode(code) {

  return {
    name: code["@_name"],
    id: code["@_id"],
    documents: new Set(),
    quotes: new Set()
  };
}

function processCodeGroup(codeGroup) {
  if (!Array.isArray(codeGroup.item)) {
    return;
  }

  const linkedCodes = codeGroup.item.map(code => {
    return code["@_id"];
  })

  return {
    name: codeGroup["@_name"],
    id: codeGroup["@_id"],
    linkedCodes
  };
}

function processDocGroup(docGroup) {
  if (!Array.isArray(docGroup.item)) {
    return;
  }

  const linkedDocs = docGroup.item.map(code => {
    return code["@_id"];
  })

  return {
    name: docGroup["@_name"],
    id: docGroup["@_id"],
    linkedDocs
  };
}

jsonObj.storedHU.primDocs.primDoc.forEach(element => {
  const document = processPrimDoc(element);

  if (document) {
    documents.push(document);
  }
});

jsonObj.storedHU.codes.code.forEach(element => {
  const code = processCode(element);

  if (code) {
    codes.set(code.id, code);
  }
});

jsonObj.storedHU.families.codeFamilies.codeFamily.forEach(element => {
  const codeGroup = processCodeGroup(element);

  if (codeGroup) {
    codeGroups.push(codeGroup);
  }
});

jsonObj.storedHU.families.primDocFamilies.primDocFamily.forEach(element => {
  const docGroup = processDocGroup(element);

  if (docGroup) {
    docGroups.push(docGroup);
  }
});

jsonObj.storedHU.links.objectSegmentLinks.codings.iLink.forEach(element => {
  const code = codes.get(element["@_obj"]);
  const quote = quotations.get(element["@_qRef"]);

  if (code && quote) {
    code.documents.add(quote.doc);
    code.quotes.add(quote.id);
  }
});

const nodes = [];
const edges = [];

const groups = new Set();

function addNode(node) {
  nodes.push(node);
}

function createNode(id, name, classes) {
  return {
    data: {
      id,
      name
    },
    group: "nodes",
    classes
  };
}

function createIfNotExists(group) {
  if (group && !groups.has(group)) {
    groups.add(group)
    let node = createNode(group, group);
    addNode(node);
  }
}

function addEdgeLink(edgeId, source, target, classes) {
  edges.push({
    data: {
      id: edgeId,
      source,
      target
    },
    group: "edges",
    classes
  })
}

function createDocumentNodes(documents) {
  documents.forEach(({
    id,
    name
  }) => {
    const docNode = createNode(id, name, ["document"])

    addNode(docNode);
  });
}

function createDocumentGroupNodes(docGroups) {
  docGroups.forEach(({
    id,
    name
  }) => {
    const docNode = createNode(id, name, ["document-group"])

    addNode(docNode);
  });
}

function createCodeGroupNodes(codeGroups) {
  codeGroups.forEach(({
    id,
    name
  }) => {
    const codeGroupNode = createNode(id, name, ["code-group"])

    addNode(codeGroupNode);
  });
}

function createCodeNodes(codes) {
  codes.forEach(({
    id,
    name
  }) => {
    const codeNode = createNode(id, name, ["code"])

    addNode(codeNode);
  });
}

function createDocumentLinks(codes) {
  codes.forEach(({
    id,
    documents
  }) => {
    documents.forEach((documentId) => {
      const edgeId = id + "_" + documentId
      addEdgeLink(edgeId, id, documentId, ["code-document-link"])
    })
  });
}

function createCodeGroupLinks(codeGroups) {
  codeGroups.forEach(({
    id,
    linkedCodes
  }) => {
    linkedCodes.forEach((linkedCodeId) => {
      const edgeId = id + "_" + linkedCodeId
      addEdgeLink(edgeId, id, linkedCodeId, ["code-group-link"])
    })
  });
}

function createDocumentGroupLinks(docGroups) {
  docGroups.forEach(({
    id,
    linkedDocs
  }) => {
        linkedDocs.forEach((linkedDocId) => {
      const edgeId = id + "_" + linkedDocId
      addEdgeLink(edgeId, id, linkedDocId, ["doc-group-link"])
    })
  });
}

function createDocumentGroupLinks(docGroups) {
  docGroups.forEach(({
    id,
    linkedDocs
  }) => {
    linkedDocs.forEach((linkedDocId) => {
      const edgeId = id + "_" + linkedDocId
      addEdgeLink(edgeId, id, linkedDocId, ["doc-group-link"])
    })
  });
}

createDocumentGroupNodes(docGroups);
createDocumentNodes(documents);
createCodeGroupNodes(codeGroups);
createCodeNodes(codes);
createDocumentLinks(codes);
createDocumentGroupLinks(docGroups);
createCodeGroupLinks(codeGroups);

const elements = nodes.concat(edges);

  let fileContents = `
const elements = ${JSON.stringify( elements )};

export default elements;
`;

fs.writeFileSync("src/assets/graph_data_atlas.js", fileContents);