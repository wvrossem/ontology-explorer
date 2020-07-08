const isEmpty = require('lodash/isEmpty');

class Document {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.linkedQuotationIds = new Set();
    this.linkedCodeIds = new Set();
    this.linkedCodeGroupIds = new Set();
    this.linkedDocumentGroupIds = new Set();
  }

  linkQuotation(quotationId) {
    this.linkedQuotationIds.add(quotationId);
  }

  linkCode(codeId) {
    this.linkedCodeIds.add(codeId);
  }

  linkCodeGroup(codeGroupId) {
    this.linkedCodeGroupIds.add(codeGroupId);
  }

  linkDocumentGroup(documentGroupId) {
    this.linkedDocumentGroupIds.add(documentGroupId);
  }
}

class Documents {
  constructor() {
    this.documents = new Map();
  }

  addDocument(document) {
    if (document instanceof Document) {
      this.documents.set(document.id, document);
    } else {
      throw "Add document is not of type Document!";
    }
  }

  getDocument(documentId) {
    return this.documents.get(documentId);
  }

  size() {
    return this.documents.size;
  }
}

class Quotation {
  constructor(id, name, linkedDocumentId, content) {
    this.id = id;
    this.name = name;
    this.linkedDocumentId = linkedDocumentId;
    this.content = content;
  }
}

class Quotations {
  constructor() {
    this.quotations = new Map();
  }

  addQuotation(quotation) {
    if (quotation instanceof Quotation) {
      this.quotations.set(quotation.id, quotation);
    } else {
      throw "Add quotation is not of type Quotation!";
    }
  }

  getQuotation(quotationId) {
    return this.quotations.get(quotationId);
  }

  size() {
    return this.quotations.size;
  }
}

class Code {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.linkedDocumentIds = new Set();
    this.linkedQuotationIds = new Set();
  }

  linkDocument(documentId) {
    this.linkedDocumentIds.add(documentId);
  }

  linkQuotation(quotationId) {
    this.linkedQuotationIds.add(quotationId);
  }
}

class Codes {
  constructor() {
    this.codes = new Map();
  }

  addCode(code) {
    if (code instanceof Code) {
      this.codes.set(code.id, code);
    } else {
      throw "Add code is not of type Code!";
    }
  }

  getCode(codeId) {
    return this.codes.get(codeId);
  }

  size() {
    return this.codes.size;
  }
}

class CodeGroup {
  constructor(id, name) {
    this.id = id;
    this.name = name; 
    this.linkedCodeIds = new Set();
  }

  linkCode(codeId) {
    this.linkedCodeIds.add(codeId);
  }
}

class CodeGroups {
  constructor() {
    this.codeGroups = new Map();
  }

  addCodeGroup(codeGroup) {
    if (codeGroup instanceof CodeGroup) {
      this.codeGroups.set(codeGroup.id, codeGroup);
    } else {
      throw "Add codeGroup is not of type CodeGroup!";
    }
  }

  size() {
    return this.codeGroups.size;
  }
}

class DocumentGroup {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.linkedDocumentIds = new Set(); 
  }

  linkDocument(documentId) {
    this.linkedDocumentIds.add(documentId);
  }

  isEmpty() {
    return isEmpty(this.linkedDocumentIds);
  }
}

class DocumentGroups {
  constructor() {
    this.documentGroups = new Map();
  }

  addDocumentGroup(documentGroup) {
    if (documentGroup instanceof DocumentGroup) {
      this.documentGroups.set(documentGroup.id, documentGroup);
    } else {
      throw "Add documentGroup is not of type DocumentGroup!";
    }
  }

  size() {
    return this.documentGroups.size;
  }
}

module.exports = {
  Document,
  Documents,
  Quotation,
  Quotations,
  Code,
  Codes,
  CodeGroup,
  CodeGroups,
  DocumentGroup,
  DocumentGroups
}