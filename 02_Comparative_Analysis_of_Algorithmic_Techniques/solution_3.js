/**
 * ============================================================================
 *  Interval Scheduling Maximization  (Activity Selection Problem)
 *  Sélectionner le nombre MAXIMUM de tâches non chevauchantes
 *  qu'un seul livreur peut réaliser.
 * ============================================================================
 *
 *  Deux approches comparées :
 *    1) Brute-force : explore les 2^n combinaisons possibles -> O(2^n)
 *    2) Greedy      : trie par heure de fin, un seul parcours -> O(n log n)
 *
 *  Exécuter avec :  node solution_3.js
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Donnée de test fournie par l'énoncé
// ---------------------------------------------------------------------------
const tasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 },
];

// ---------------------------------------------------------------------------
// Outil : deux tâches se chevauchent-elles ?
// On considère que la fin d'une tâche et le début de la suivante peuvent
// coïncider (ex: finir à 6 et commencer à 6 est autorisé).
// ---------------------------------------------------------------------------
function overlap(a, b) {
  return a.start < b.end && b.start < a.end;
}

// ===========================================================================
// 1) BRUTE-FORCE  ->  O(2^n)
// ---------------------------------------------------------------------------
// Idée : chaque tâche a 2 états (prise / pas prise). On génère donc les
// 2^n sous-ensembles via le motif binaire d'un compteur, on jette ceux qui
// contiennent un chevauchement, et on garde le plus grand sous-ensemble valide.
// ===========================================================================
function bruteForce(tasks) {
  const n = tasks.length;
  let best = [];

  for (let mask = 0; mask < 1 << n; mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(tasks[i]);
    }

    // Le sous-ensemble est-il valide (aucun chevauchement) ?
    let valid = true;
    for (let i = 0; i < subset.length && valid; i++) {
      for (let j = i + 1; j < subset.length; j++) {
        if (overlap(subset[i], subset[j])) {
          valid = false;
          break;
        }
      }
    }

    if (valid && subset.length > best.length) best = subset;
  }

  return best;
}

// ===========================================================================
// 2) GREEDY  ->  O(n log n)
// ---------------------------------------------------------------------------
// Insight clé : en choisissant toujours la tâche qui FINIT le plus tôt,
// on libère le livreur au plus vite et on laisse le maximum de place aux
// tâches suivantes. Prouvé optimal pour ce problème.
// Étapes : trier par 'end', puis un seul parcours.
// ===========================================================================
function greedy(tasks) {
  const sorted = [...tasks].sort((a, b) => a.end - b.end);

  const selected = [];
  let lastEnd = -Infinity;

  for (const task of sorted) {
    if (task.start >= lastEnd) {
      selected.push(task);
      lastEnd = task.end;
    }
  }

  return selected;
}

// ===========================================================================
// Générateur de tâches aléatoires (pour les tests de performance)
// ===========================================================================
function generateTasks(count, maxTime = 100000) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * maxTime);
    const duration = 1 + Math.floor(Math.random() * 10);
    result.push({ start, end: start + duration });
  }
  return result;
}

// ===========================================================================
// 2) VALIDATION — les deux approches donnent-elles le même résultat ?
// ===========================================================================
console.log("========================================================");
console.log(" VALIDATION sur l'échantillon de l'énoncé (6 tâches)");
console.log("========================================================");

const bfResult = bruteForce(tasks);
const grResult = greedy(tasks);

console.log("Brute-force -> ", bfResult.length, "tâches :", bfResult);
console.log("Greedy      -> ", grResult.length, "tâches :", grResult);
console.log(
  "Même nombre de tâches sélectionnées ?",
  bfResult.length === grResult.length ? "✅ OUI" : "❌ NON"
);

// ===========================================================================
// 2) TIMING sur de grandes entrées
// ---------------------------------------------------------------------------
// ⚠️  La brute-force est en O(2^n) : impossible de la lancer sur 10 000 tâches
//     (2^10000 est un nombre à plus de 3000 chiffres). On la mesure donc sur
//     une PETITE entrée (20 tâches) pour montrer qu'elle grimpe déjà vite,
//     tandis que le greedy encaisse 10 000 tâches sans broncher.
// ===========================================================================
console.log("\n========================================================");
console.log(" PERFORMANCE");
console.log("========================================================");

// --- Greedy sur 10 000 tâches ---
const bigInput = generateTasks(10000);
let t0 = performance.now();
const grBig = greedy(bigInput);
let t1 = performance.now();
console.log(
  `Greedy sur 10 000 tâches  : ${grBig.length} sélectionnées en ${(t1 - t0).toFixed(3)} ms`
);

// --- Brute-force sur 20 tâches seulement ---
const smallInput = generateTasks(20);
t0 = performance.now();
const bfSmall = bruteForce(smallInput);
t1 = performance.now();
console.log(
  `Brute-force sur 20 tâches : ${bfSmall.length} sélectionnées en ${(t1 - t0).toFixed(3)} ms`
);
console.log(
  "(20 tâches = 1 048 576 combinaisons déjà. À 30 tâches = ~1 milliard.)"
);

// ===========================================================================
// 5) BONUS — Stress test / cas limites
// ===========================================================================
console.log("\n========================================================");
console.log(" BONUS — Cas limites (greedy)");
console.log("========================================================");

// a) Toutes les tâches se chevauchent -> on ne peut en garder qu'UNE
const allOverlap = [
  { start: 1, end: 10 },
  { start: 2, end: 9 },
  { start: 3, end: 8 },
  { start: 4, end: 7 },
];
console.log("Toutes chevauchantes  ->", greedy(allOverlap).length, "attendu : 1");

// b) Aucune tâche ne se chevauche -> on les garde TOUTES
const noneOverlap = [
  { start: 1, end: 2 },
  { start: 2, end: 3 },
  { start: 3, end: 4 },
  { start: 4, end: 5 },
];
console.log("Aucune chevauchante   ->", greedy(noneOverlap).length, "attendu : 4");

// c) Mêmes heures de début / de fin
const sameTimes = [
  { start: 1, end: 4 },
  { start: 1, end: 4 },
  { start: 1, end: 4 },
];
console.log("Horaires identiques   ->", greedy(sameTimes).length, "attendu : 1");

// d) Liste vide
console.log("Liste vide            ->", greedy([]).length, "attendu : 0");
