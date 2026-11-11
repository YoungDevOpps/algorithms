// Checkpoint 2 : algorithme de Dijkstra
// Lancer avec : node checkpoint_2.js

// Renvoie la distance minimale depuis `start` vers chaque sommet,
// et le sommet précédent pour reconstruire les chemins
function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  // Au départ, tout est à l'infini sauf le point de départ
  for (const vertex in graph) {
    distances[vertex] = Infinity;
    previous[vertex] = null;
  }
  distances[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    // On prend le sommet non visité le plus proche
    let current = null;
    for (const vertex in graph) {
      if (visited.has(vertex)) continue;
      if (current === null || distances[vertex] < distances[current]) {
        current = vertex;
      }
    }

    // Les sommets restants sont inaccessibles
    if (distances[current] === Infinity) break;
    visited.add(current);

    // On regarde si passer par `current` raccourcit le trajet vers un voisin
    for (const neighbor in graph[current]) {
      const newDistance = distances[current] + graph[current][neighbor];
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    }
  }

  return { distances, previous };
}

// Reconstruit le chemin en remontant les sommets précédents
function getPath(previous, target) {
  const path = [];
  for (let v = target; v !== null; v = previous[v]) {
    path.unshift(v);
  }
  return path;
}

// Test
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 },
};

const { distances, previous } = dijkstra(graph, "A");
console.log("Distances depuis A :", distances);

for (const vertex in graph) {
  console.log(
    `A -> ${vertex} : ${distances[vertex]} (${getPath(previous, vertex).join(" -> ")})`,
  );
}
