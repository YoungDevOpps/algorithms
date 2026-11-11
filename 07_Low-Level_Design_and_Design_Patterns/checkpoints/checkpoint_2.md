Title: Implementing Dijkstra's Algorithm in JavaScript

The objective of this task is to implement Dijkstra's algorithm in JavaScript to find the shortest path in a weighted graph. By completing this task, you will gain practical experience in implementing a fundamental graph algorithm and understanding its application in solving real-world problems.

NB: You have to make some research to get a deeper idea if needed to solve the task

Instructions

Implement Dijkstra's Algorithm:

Write a JavaScript function named dijkstra that takes the following parameters:
graph: An object representing the weighted graph. Each key represents a vertex, and the corresponding value is an array of adjacent vertices with their respective weights. For example:const graph = {
'A': { 'B': 4, 'C': 2 },

'B': { 'A': 4, 'C': 5, 'D': 10 },

'C': { 'A': 2, 'B': 5, 'D': 3 },

'D': { 'B': 10, 'C': 3 }

}
