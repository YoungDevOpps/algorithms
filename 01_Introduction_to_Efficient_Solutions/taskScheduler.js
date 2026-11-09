/**
 * TASK SCHEDULER — Checkpoint: Comparative Analysis of Algorithmic Techniques
 *
 * Objectif : gérer des tâches (tri, groupement par priorité, détection de chevauchements)
 * et analyser la complexité de chaque opération en notation Big O.
 */

// ─────────────────────────────────────────────
// 1. DONNÉES
// ─────────────────────────────────────────────
// Chaque tâche : { name, start, end, priority }
// start/end sont des entiers
// priority : "High" | "Medium" | "Low"

const tasks = [
  { name: "Code review", start: 60, end: 90, priority: "High" },
  { name: "Morning standup", start: 30, end: 60, priority: "High" },
  { name: "Lunch break", start: 120, end: 180, priority: "Low" },
  { name: "Sprint planning", start: 80, end: 130, priority: "Medium" },
  { name: "Email triage", start: 0, end: 30, priority: "Medium" },
  { name: "Documentation", start: 150, end: 210, priority: "Low" },
  { name: "Bug fix #42", start: 90, end: 150, priority: "High" },
];

// ─────────────────────────────────────────────
// 2. TRI PAR HEURE DE DÉBUT
// ─────────────────────────────────────────────
/**
 * Trie les tâches par start time croissant.
 *
 * Complexité temporelle : O(n log n)  — Array.sort() utilise TimSort
 * Complexité spatiale  : O(log n)     — stack de récursion interne de TimSort
 * (on trie une copie pour ne pas muter l'original)
 */
function sortByStartTime(taskList) {
  return [...taskList].sort((a, b) => a.start - b.start);
}

// ─────────────────────────────────────────────
// 3. GROUPEMENT PAR PRIORITÉ  (Hash Map)
// ─────────────────────────────────────────────
/**
 * Regroupe les tâches dans un objet { High: [...], Medium: [...], Low: [...] }.
 *
 * Complexité temporelle : O(n)  — une seule passe sur le tableau
 * Complexité spatiale  : O(n)  — stocke toutes les tâches dans la hash map
 */
function groupByPriority(taskList) {
  const groups = { High: [], Medium: [], Low: [] };

  for (const task of taskList) {
    // L'accès à groups[task.priority] est O(1) grâce au hash map
    groups[task.priority].push(task);
  }

  return groups;
}

// ─────────────────────────────────────────────
// 4. DÉTECTION DE CHEVAUCHEMENTS (Overlapping)
// ─────────────────────────────────────────────
/**
 * Retourne toutes les paires de tâches qui se chevauchent.
 * Deux tâches [a.start, a.end] et [b.start, b.end] se chevauchent si :
 *   a.start < b.end  ET  b.start < a.end
 *
 * Complexité temporelle : O(n log n + n²) ≈ O(n²) worst case
 * Complexité spatiale  : O(k)  — k = nombre de paires en conflit (résultat)
 */
function detectOverlaps(taskList) {
  const sorted = sortByStartTime(taskList);
  const overlaps = [];

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      // Dès que la tâche j commence après la fin de i, pas besoin de continuer
      if (sorted[j].start >= sorted[i].end) break;

      // Chevauchement confirmé
      overlaps.push({
        task1: sorted[i].name, task2: sorted[j].name,
        overlap: `[${sorted[j].start} → ${sorted[i].end}]`
      });
    }
  }

  return overlaps;
}

// ─────────────────────────────────────────────
// 5. (OPTIONNEL) ESTIMATION MÉMOIRE
// ─────────────────────────────────────────────
/**
 * Estime la mémoire approximative (en octets) occupée par la liste de tâches.
 *
 * Hypothèses simplifiées (moteur V8) :
 *   - Chaque propriété numérique (start, end) ≈ 8 octets (float64)
 *   - Chaque caractère de string ≈ 2 octets (UTF-16)
 *   - Overhead objet JS ≈ 64 octets
 *
 * Complexité temporelle : O(n)
 * Complexité spatiale  : O(1)  — on accumule juste un compteur
 */
function estimateMemoryBytes(taskList) {
  const OBJECT_OVERHEAD = 64;
  const BYTES_PER_CHAR = 2;
  const BYTES_PER_NUM = 8;

  let total = 0;
  for (const task of taskList) {
    total += OBJECT_OVERHEAD;
    total += task.name.length * BYTES_PER_CHAR;
    total += task.priority.length * BYTES_PER_CHAR;
    total += BYTES_PER_NUM * 2; // start + end
  }
  return total;
}

// ─────────────────────────────────────────────
// 6. EXÉCUTION & AFFICHAGE
// ─────────────────────────────────────────────
console.log("═══════════════════════════════════════════");
console.log("         TASK SCHEDULER — RÉSULTATS        ");
console.log("═══════════════════════════════════════════\n");

console.log("── 1. Tâches triées par heure de début ──");
const sorted = sortByStartTime(tasks);
sorted.forEach(t =>
  console.log(`  [${String(t.start).padStart(3)}–${String(t.end).padEnd(3)}] ${t.priority.padEnd(6)} | ${t.name}`)
);

console.log("\n── 2. Tâches groupées par priorité ──");
const groups = groupByPriority(tasks);
for (const [priority, list] of Object.entries(groups)) {
  console.log(`  ${priority} (${list.length}) : ${list.map(t => t.name).join(", ")}`);
}

console.log("\n── 3. Chevauchements détectés ──");
const overlaps = detectOverlaps(tasks);
if (overlaps.length === 0) {
  console.log("  Aucun chevauchement.");
} else {
  overlaps.forEach(o =>
    console.log(`  ⚠ "${o.task1}"  ↔  "${o.task2}"  intervalle commun : ${o.overlap}`)
  );
}

console.log("\n── 4. Estimation mémoire ──");
const mem = estimateMemoryBytes(tasks);
console.log(`  ${tasks.length} tâches ≈ ${mem} octets (${(mem / 1024).toFixed(2)} Ko)`);