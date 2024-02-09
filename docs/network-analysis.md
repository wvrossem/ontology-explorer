# Network analysis

Before starting the network analysis, ensure that you have uploaded your Atlas.ti project as explained in the Upload page document.

By following the following steps, you can perform network analysis on your Atlas.ti project data models using set operations and explore the relationships within your data.

## Steps

1. **Select Data Model(s):** The first step is to select the data model(s) that will be used in the data analysis.

2. **Select Set Operation:** Choose one of the set operations: union, intersection, or difference.

3. **Include Codes Option:** Specify whether to include codes in the output table after the analysis. By default, these are not shown.

4. **Include Code Groups Option:** Specify whether to include code groups in the output table after the analysis. By default, these are included.

5. **Click Submit:** Once you've configured the options, click "Submit" to start the analysis. This action will generate an output table.

**Disclaimer**: Please note that because of a current limitation in the system, to view the categories of only one data model, you will need to select it twice: once on the first data model(s) side and once on the second data model(s) side.

## Output

The output will display the result from the set operations on the selected data models as a network. Here's an overview of the set operations:

- **Union:** Outputs items included in the selected data models.
- **Intersection:** Outputs elements that are part of all selected data models.
- **Difference:** Shows elements that are in one data model but not the other.

### Overview of output table columns

- **Name:** Name of the code or code group.
- **Type:** Indicates whether it's a code or code-group.
- **Degree Centrality:** Measures the importance of a node based on the number of links.
- **Closeness Centrality:** Measures how close a node is to all other nodes in the network.
- **Betweenness Centrality:** Measures the importance of a node based on the number of times it can be considered as forming a bridge and potentially connect parts of the network.

## Additional Buttons

- **Download Data:** Download the contents of the table as a CSV file.
- **Download Nodes CSV** and **Download Edges CSV:** These buttons export the data for use in the Gephi program, which is used for analysis and visualization of the network. Gephi was utilized to produce the final network visualizations used in the paper.
