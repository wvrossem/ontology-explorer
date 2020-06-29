const xmlParser = require('fast-xml-parser');
const he = require('he');
const isNil = require('lodash/isNil');
const atlas = require('./atlasti_classes.js');

const XML_PARSER_OPTIONS = {
  attributeNamePrefix: "@_",
  attrNodeName: false, // default is 'false'
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: false,
  arrayMode: false, // "strict"
  attrValueProcessor: (val, attrName) => he.decode(val, {
    isAttributeValue: true
  }), // default is a=>a
  tagValueProcessor: (val, tagName) => he.decode(val), // default is a=>a
  stopNodes: ["parse-me-as-string"]
};

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

function processXMLProjectString(xmlDataString) {
  if (xmlParser.validate(xmlDataString) === true) { //optional (it'll return an object in case it's not valid)
    let jsonObj = xmlParser.parse(xmlDataString, XML_PARSER_OPTIONS);
  }

  // Intermediate obj
  let tObj = xmlParser.getTraversalObj(xmlDataString, XML_PARSER_OPTIONS);
  let jsonObj = xmlParser.convertToJson(tObj, XML_PARSER_OPTIONS);

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

  return {
    documents,
    quotations,
    codes,
    codeGroups,
    docGroups
  }
}

module.exports = {
  processXMLProjectString
}