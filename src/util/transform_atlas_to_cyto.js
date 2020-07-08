const isEmpty = require('lodash/isEmpty');
const cyto = require('./cytoscape_classes.js');

let documents, codes;

let nodes, edges;

let docIds;

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
}

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

const createdCodeGroupToDocGroupLinks = new Set();

function createCodeGroupsToDocGroupsLinks(codeGroupsObj) {
  codeGroupsObj.codeGroups.forEach((codeGroup) => {
    codeGroup.linkedCodeIds.forEach((codeId) => {
      const code = codes.getCode(codeId);

      if (!isEmpty(code.linkedDocumentIds)) {
        code.linkedDocumentIds.forEach((documentId) => {
          const document = documents.getDocument(documentId);

          if (!isEmpty(document.linkedDocumentGroupIds)) {
            document.linkedDocumentGroupIds.forEach((docGroupId) => {
              const edgeId = codeGroup.id + "_" + docGroupId;
              if (!createdCodeGroupToDocGroupLinks.has(edgeId)) {
                addEdgeLink(edgeId, codeGroup.id, docGroupId, [cyto.LINK_TYPES.CODE_GROUP_DOCUMENT_GROUP_LINK]);
                createdCodeGroupToDocGroupLinks.add(edgeId);
              }
            })
          }
        })
      }
    })
  })
}

function transformAtlasToCyto(projElements) {
  nodes = [];
  edges = [];
  docIds = new Set();

  documents = projElements.documents;
  codes = projElements.codes;
  createDocumentGroupNodes(projElements.docGroups);
  createDocumentNodes(projElements.documents);
  createCodeGroupNodes(projElements.codeGroups);
  createCodeNodes(projElements.codes);
  createDocumentLinks(projElements.codes);
  createDocumentGroupLinks(projElements.docGroups);
  createCodeGroupLinks(projElements.codeGroups);
  createCodeToDocGroupsLinks(projElements.codes);
  createCodeGroupsToDocGroupsLinks(projElements.codeGroups);

  const elements = nodes.concat(edges);
  const cyElements = elements.map((element) => element.toJSON());

  return cyElements;
}

module.exports = {
  transformAtlasToCyto
}