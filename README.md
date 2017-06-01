# djnodes
Graphs for Dow Jones DNA

# Description
DJ Nodes is a web application which makes use of the Data APIs offered by Dow Jones DNA. The idea is to turn this data into graphs using the http://js.cytoscape.org/ library. The results of a search are displayed using the https://datatables.net/ framework. Currently the application can only search for data on VentureSource, more data points pending implementation.

# Installation
Pull the repository and install it locally using the npm package manager.

# Usage
The application page /graph contains three panels:
1. Search
2. Find
3. Graph

## Search
Search for **people** or **organizations**. For the latter one can select the different types of entities to search for.
![Search](/public/images/search.jpg)

## Find
The results of a search are displayed in a table.
![Find](/public/images/find.jpg)
One can select the rows one wants to graph. The **Clear** button removes all rows which are not slected from the table, the **Reset** button removes all rows.

## Graph
Starting with the element of the selected row, the app searches for relations and connects it to the source node. It repeats this process dependent on the number of **Levels**. This number can be changed with the **+** and **-** buttons under the graph. Here one can also **Regraph** the graph using the current options, **Center** the grap, **Fit** the graph, and choose different layouts.
![Graph](/public/images/graph.jpg)
![Graph](/public/images/graph2.jpg)
One can also select multiple rows and draw several graphs at once. If there is a connection within the maximum level of search, the graphs will merge.
![Graph](/public/images/find-multiple.jpg)
![Graph](/public/images/graph-multiple.jpg)

 
