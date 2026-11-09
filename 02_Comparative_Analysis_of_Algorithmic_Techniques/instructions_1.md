Objective

Description:

You are developing a lightweight task scheduler for a to-do application. The goal is to create efficient solutions for task management including sorting, filtering by priority, and identifying overlapping tasks while analyzing and improving the time and space complexity of each part.

The project focuses on translating common problem types into effective control structures and data models, and optimizing them through analysis.

Instructions:

1.Create a list of tasks, where each task has:

Name
Start time and end time
Priority (e.g., High, Medium, Low)

2.Implement the following features:

Sort tasks by start time (efficiently)
Group tasks by priority using appropriate data structures
Detect overlapping tasks (tasks that run at the same time) 3. Analyze the time and space complexity of each function and optimize where necessary.

4. (Optional): Add a function to estimate memory usage based on number of tasks and data stored.

Hint:

Use objects and arrays to manage data.
For overlapping tasks, consider sorting and comparing intervals similar to the interval scheduling pattern.
Use hash maps for fast grouping.
Sorting can be done with Array.prototype.sort() using custom compare functions.
Analyze operations using Big O notation.
