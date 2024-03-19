---
layout: default
title: Domain model
parent: Reference
nav_order: 1
---

The following diagram visually represents the interconnected entities within the domain model of an ATLAS.ti project. At the core of the model is the ATLAS. ti project, which encompasses ``Document groups``, ``Documents``, ``Code Groups``, ``Codes``, and ``Quotes``.

``Document groups`` typically represent individual systems under analysis and may contain multiple ``Documents`` detailing the data model of a system.

Within ``Documents``, ``Quotes`` serve as in-vivo codings of categories of data, providing associations with ``Codes`` that represent these categories.

``Code groups`` serve the purpose of harmonization and grouping of ``Codes``, to model relations between them.

```mermaid
classDiagram
    class Documents {
        documents
        addDocument(document)
        getDocument(documentId)
        size()
    }

    class Document {
        id
        name
        linkedQuotationIds
        linkedCodeIds
        linkedCodeGroupIds
        linkedDocumentGroupIds
        linkQuotation(quotationId)
        linkCode(codeId)
        linkCodeGroup(codeGroupId)
        linkDocumentGroup(documentGroupId)
    }

    class Quotations {
        quotations
        addQuotation(quotation)
        getQuotation(quotationId)
        size()
    }

    class Quotation {
        id
        name
        linkedDocumentId
        content
    }

    class Codes {
        codes
        addCode(code)
        getCode(codeId)
        size()
    }

    class Code {
        id
        name
        linkedDocumentIds
        linkedQuotationIds
        linkDocument(documentId)
        linkQuotation(quotationId)
    }

    class CodeGroups {
        codeGroups
        addCodeGroup(codeGroup)
        getCodeGroupsMap()
        size()
    }

    class CodeGroup {
        id
        name
        linkedCodeIds
        linkedCodeGroupIds
        linkCode(codeId)
        linkCodeGroup(codeGroupId, weight)
    }

    class DocumentGroups {
        documentGroups
        addDocumentGroup(documentGroup)
        size()
    }

    class DocumentGroup {
        id
        name
        linkedDocumentIds
        isEmpty()
        linkDocument(documentId)
    }

    Project *-- DocumentGroups
    Project *-- Documents
    Project *-- CodeGroups
    Project *-- Codes
    Project *-- Quotations

    DocumentGroup <--> Document
    Document <--> Quotation
    Document <--> Code
    Document --> CodeGroup
    Quotation <-- Code
    CodeGroup --> Code
    Code Group <--> CodeGroup
    Documents o-- Document
    Quotations o-- Quotation
    Codes o-- Code
    CodeGroups o-- CodeGroup
    DocumentGroups o-- DocumentGroup

```

In the Ontology Explorer, the ATLAS.ti domain model is translated into a network structure comprising ``Nodes`` and ``Links`` used for analysis and visualization using [Cytoscape.js](https://js.cytoscape.org/).

Each entity from the Atlas.ti project is represented as a ``Node``, distinguished by its ``Type`` attribute. ``Links`` also have an attribute ``Type`` to model the different types of connections within the network, which are used in the analysis and visualization.

The following diagram illustrates this model.

```mermaid
classDiagram
    class NODE_TYPES {
        DOCUMENT
        DOCUMENT_GROUP
        CODE
        CODE_GROUP
    }

    class LINK_TYPES {
        CODE_DOCUMENT_LINK
        CODE_GROUP_LINK
        CODE_GROUP_DISTANCE_LINK
        CODE_DOCUMENT_GROUP_LINK
        DOC_GROUP_LINK
        CODE_GROUP_DOCUMENT_GROUP_LINK
    }

    class Node {
        id
        name
        classes
        toJSON()
    }

    class Edge {
        id
        source
        target
        classes
        toJSON()
    }

    Network *-- Node
    Network *-- Edge

    Edge "*" -- "2" Node

    NODE_TYPES .. Node
    LINK_TYPES .. Edge
```
