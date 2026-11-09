Description: 

You're tasked with designing an efficient cable layout to connect several computers in an office. Each connection between computers has a cost based on the cable length. Your goal is to compute the Minimum Spanning Tree (MST) using Kruskal’s or Prim’s Algorithm, ensuring all computers are connected with the least total cost and no loops.

Instructions

Instructions:

Represent the computers as vertices and the possible cable connections with edges and weights.
Implement a function to construct the MST using either Prim’s or Kruskal’s algorithm.
Output:
List of selected connections (edges).
Total cost of the network.
Bonus: Allow user input to add nodes and weights dynamically.
Hint:

Use an adjacency list or a simple list of edges.
For Kruskal’s, you'll need to implement a Disjoint Set (Union-Find).
For Prim’s, use a min-heap (priority queue) to pick the next cheapest edge.
Always check for cycles (in Kruskal) and for visited nodes (in Prim).