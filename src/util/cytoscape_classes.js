
const NODE_TYPES = {
  DOCUMENT: "document",
  DOCUMENT_GROUP: "document-group",
  CODE: "code",
  CODE_GROUP: "code-group"
};

const LINK_TYPES = {
  CODE_DOCUMENT_LINK: "code-document-link",
  CODE_GROUP_LINK: "code-group-link",
  CODE_DOCUMENT_GROUP_LINK: "code-document-group-link",
  DOC_GROUP_LINK: "doc-group-link",
  CODE_GROUP_DOCUMENT_GROUP_LINK: "code-group-document-group-link"
};

class Node {

  constructor(id, name, classes) {
    this.id = id;
    this.name = name;
    this.classes = classes;
  }

  toJSON() {
    return {
      data: {
        id: this.id,
        name: this.name
      },
      group: "nodes",
      classes: this.classes
    };
  }
}

class Edge {

  constructor(id, source, target, classes) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.classes = classes;
  }

  toJSON() {
    return {
      data: {
        id: this.id,
        source: this.source,
        target: this.target
      },
      group: "edges",
      classes: this.classes
    }
  }
}

module.exports = {
  Node,
  Edge,
  NODE_TYPES,
  LINK_TYPES
}