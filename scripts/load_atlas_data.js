const xmlParser = require('fast-xml-parser');
const fs = require('fs');
const he = require('he');
const isNil = require('lodash/isNil');
const isEmpty = require('lodash/isEmpty');
const atlas = require('./atlasti_classes.js');
const cyto = require('./cytoscape_classes.js');

// Check and get the path to the Atlas.ti file from command line arguments
if (process.argv.length === 2) {
  console.error('Second argument needs to be path to the Atlas.ti XML file!');
  process.exit(1);
}

const atlasXmlFilePath = process.argv[2];

try {
  fs.accessSync(atlasXmlFilePath, fs.constants.R_OK);
} catch (err) {
  console.error('Cannot read file!');
  process.exit(1);
}

// Read the file contents and convert to a String
const xmlDataString = fs.readFileSync(atlasXmlFilePath).toString();

const xmlParserOptions = {
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

if (xmlParser.validate(xmlDataString) === true) { //optional (it'll return an object in case it's not valid)
  let jsonObj = xmlParser.parse(xmlDataString, xmlParserOptions);
}

// Intermediate obj
let tObj = xmlParser.getTraversalObj(xmlDataString, xmlParserOptions);
let jsonObj = xmlParser.convertToJson(tObj, xmlParserOptions);

const documents = new atlas.Documents();
const quotations = new atlas.Quotations();
const codes = new atlas.Codes();
const codeGroups = new atlas.CodeGroups;
const docGroups = new atlas.DocumentGroups;

function processPrimDoc(primDoc) {
  const newDocument = new atlas.Document(primDoc["@_id"], primDoc["@_name"]);

  if (primDoc.quotations['@_size'] <= 1) {
    // FIXME case when only one quotation
    if (primDoc.quotations['@_size'] == 1) {
      const docQuotation = new atlas.Quotation(
        primDoc.quotations.q["@_id"],
        primDoc.quotations.q["@_name"],
        primDoc["@_id"]
      )
      quotations.addQuotation(docQuotation)
    }

    return newDocument;
  }

  primDoc.quotations.q.map(element => {
    const docQuotation = new atlas.Quotation(
      element["@_id"],
      element["@_name"],
      primDoc["@_id"]
    );

    newDocument.linkQuotation(docQuotation.id);
    quotations.addQuotation(docQuotation);

    return docQuotation;
  })

  return newDocument;
}

function processCode(code) {
  return new atlas.Code(code["@_id"], code["@_name"]);
}

function processCodeGroup(codeGroup) {
  if (!Array.isArray(codeGroup.item)) {
    return;
  }

  const linkedCodes = codeGroup.item.map(code => {
    return code["@_id"];
  })

  const newCodeGroup = new atlas.CodeGroup(codeGroup["@_id"], codeGroup["@_name"]);

  linkedCodes.forEach((codeId) => newCodeGroup.linkCode(codeId));

  return newCodeGroup;
}

function processDocGroup(docGroup) {
  const newDocGroup = new atlas.DocumentGroup(docGroup["@_id"], docGroup["@_name"]);

  // FIXME Handle special cases more elegantly
  if (!Array.isArray(docGroup.item)) {
    newDocGroup.linkDocument(docGroup.item["@_id"]);
    return newDocGroup;
  } else if (!docGroup.item) {
    return;
  }

  const linkedDocs = docGroup.item.map(code => {
    return code["@_id"];
  })

  linkedDocs.forEach((docId) => newDocGroup.linkDocument(docId));

  return newDocGroup;
}

jsonObj.storedHU.primDocs.primDoc.forEach(element => {
  const document = processPrimDoc(element);

  if (document) {
    documents.addDocument(document);
  }
});

jsonObj.storedHU.codes.code.forEach(element => {

  const code = processCode(element);

  if (code) {
    codes.addCode(code);
  }
});

jsonObj.storedHU.families.codeFamilies.codeFamily.forEach(element => {
  const codeGroup = processCodeGroup(element);

  if (codeGroup) {
    codeGroups.addCodeGroup(codeGroup);
  }
});

jsonObj.storedHU.families.primDocFamilies.primDocFamily.forEach(element => {
  const docGroup = processDocGroup(element);

  if (docGroup) {
    docGroups.addDocumentGroup(docGroup);
  }
});

jsonObj.storedHU.links.objectSegmentLinks.codings.iLink.forEach(element => {
  const code = codes.getCode(element["@_obj"]);
  const quotation = quotations.getQuotation(element["@_qRef"]);
  
  
  if (!isNil(code) && !isNil(quotation)) {
    code.linkDocument(quotation.linkedDocumentId);
    code.linkQuotation(quotation.id);
  }
});

const nodes = [];
const edges = [];

const docIds = new Set();

function addNode(node) {
  nodes.push(node);
}

function createNode(id, name, classes) {
  return new cyto.Node(id, name, classes);
}

function addEdgeLink(id, source, target, classes) {
  edges.push(new cyto.Edge(id, source, target, classes));
}

function createDocumentNodes(documentsObj) {
  documentsObj.documents.forEach((doc) => {
    const docNode = createNode(doc.id, doc.name, [cyto.NODE_TYPES.DOCUMENT])
    docIds.add(doc.id);

    addNode(docNode);
  });
}

function createDocumentGroupNodes(docGroupsObj) {
  docGroupsObj.documentGroups.forEach((docGroup) => {
    const docNode = createNode(docGroup.id, docGroup.name, [cyto.NODE_TYPES.DOCUMENT_GROUP])

    addNode(docNode);
  });
}

function createCodeGroupNodes(codeGroupsObj) {
  codeGroupsObj.codeGroups.forEach((codeGroup) => {
    const codeGroupNode = createNode(codeGroup.id, codeGroup.name, [cyto.NODE_TYPES.CODE_GROUP])

    addNode(codeGroupNode);
  });
}

function createCodeNodes(codesObj) {
  codesObj.codes.forEach((code) => {
    const codeNode = createNode(code.id, code.name, [cyto.NODE_TYPES.CODE])

    addNode(codeNode);
  });
}

function createDocumentLinks(codesObj) {
  codesObj.codes.forEach((code) => {
    code.linkedDocumentIds.forEach((documentId) => {
      // FIXME
      if (documentId == undefined) {
        return;
      }
      const edgeId = code.id + "_" + documentId;
      addEdgeLink(edgeId, code.id, documentId, [cyto.LINK_TYPES.CODE_DOCUMENT_LINK]);
    })
  });
}

function createCodeGroupLinks(codeGroupsObj) {
  codeGroupsObj.codeGroups.forEach((codeGroup) => {
    codeGroup.linkedCodeIds.forEach((linkedCodeId) => {
      const edgeId = codeGroup.id + "_" + linkedCodeId
      addEdgeLink(edgeId, codeGroup.id, linkedCodeId, [cyto.LINK_TYPES.CODE_GROUP_LINK])
    });
  });
}

function rememberDocGroupLink(docId, docGroupId) {
  const document = documents.getDocument(docId);

  document.linkDocumentGroup(docGroupId);
};

function createDocumentGroupLinks(docGroupsObj) {
  docGroupsObj.documentGroups.forEach((docGroup) => {
    if (docGroup.isEmpty()) {
      return;
    }
    docGroup.linkedDocumentIds.forEach((linkedDocId) => {
      if (!docIds.has(linkedDocId)) {
        return;
      }
      const edgeId = docGroup.id + "_" + linkedDocId
      addEdgeLink(edgeId, docGroup.id, linkedDocId, [cyto.LINK_TYPES.DOC_GROUP_LINK])
      rememberDocGroupLink(linkedDocId, docGroup.id);
    })
  });
}

const createdCodeToDocGroupLinks = new Set();

function createCodeToDocGroupsLinks(codesObj) {
  codesObj.codes.forEach((code) => {
    code.linkedDocumentIds.forEach((documentId) => {
      const document = documents.getDocument(documentId);
      
      if (!isEmpty(document.linkedDocumentGroupIds)) {
        document.linkedDocumentGroupIds.forEach((docGroupId) => {
          const edgeId = code.id + "_" + docGroupId;
          if (!createdCodeToDocGroupLinks.has(edgeId)) {
            addEdgeLink(edgeId, code.id, docGroupId, [cyto.LINK_TYPES.CODE_DOCUMENT_GROUP_LINK]);
            createdCodeToDocGroupLinks.add(edgeId);
          }
        })
      }
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
createCodeToDocGroupsLinks(codes)

let elements = nodes.concat(edges);

elements = elements.map((element) => element.toJSON());

let fileContents = `
const elements = ${JSON.stringify( elements )};

export default elements;
`;

fs.writeFileSync("src/assets/graph_data_atlas.js", fileContents);