---
layout: default
title: Network visualization
parent: How-to guides
nav_order: 5
---

# Network visualization

Before proceeding, ensure that you have loaded your project and performed the network analysis as explained in the respective documentation pages.

The Network Visualization page generates a force-directed graph of the output of the analysis performed on the data analysis step.

The position of nodes in the drawing space is determined by forces of attraction and repulsion between these nodes. In this way, nodes occurring more frequently together are visualized as closer, while nodes occurring less frequently together are visualized as more distant.

The generated spatial structure makes it possible to visually analyse presence, absence and frequency of categories in the co-occurrence network. Two types of nodes are displayed:

- **Large Red Dots:** Represent the data models (document groups) that were analyzed.
- **Blue Diamonds:** Indicate the code groups connected to a data model. Each blue diamond is connected to its corresponding data model by a line.

**Disclaimer**: Please note that currently, the visualization does not display the underlying codes in code groups, even if there is a button to show them.

By utilizing the Network Visualization page, you can gain insights into the relationships between data models and categories of data within your analysis.
