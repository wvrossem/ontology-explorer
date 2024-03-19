---
layout: default
title: Install
parent: How-to guides
nav_order: 1
---

To run the Ontology Explorer locally on your machine, you'll need to follow these steps:

## 1. Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>=14.04.x)
- [npm](https://www.npmjs.com/)

## 2. Clone the repository

Clone the Ontology Explorer repository to your local machine:

```bash
git clone https://github.com/wvrossem/ontology-explorer.git
```

Or download an archive of the project at: <https://github.com/wvrossem/ontology-explorer/archive/refs/heads/main.zip>

## 3. Install dependencies

Navigate to the project directory and install the dependencies using npm:

```bash
npm install
```

## 4. Start the development server

Once the dependencies are installed, you can start the development server:

```bash
npm run serve
```

This will start the development server and you can view the ontology explorer at <http://localhost:8080>.
