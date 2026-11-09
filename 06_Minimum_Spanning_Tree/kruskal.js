// ============================================================
//  KRUSKAL — Arbre couvrant minimal (MST)
// ============================================================

// ------------------------------------------------------------
//  1. DisjointSet (Union-Find)
//     Sert à répondre vite à : "ces deux postes sont-ils
//     déjà dans le même groupe ?" et à fusionner deux groupes.
// ------------------------------------------------------------
class DisjointSet {
  // Au départ, chaque poste est son propre chef (son propre groupe).
  constructor(postes) {
    this.parent = {};
    for (const poste of postes) {
      this.parent[poste] = poste; // X est son propre chef
    }
  }

  // find : remonte la chaîne des parents jusqu'au chef du groupe.
  // Un poste est chef quand il est son propre parent (parent[x] === x).
  find(x) {
    while (this.parent[x] !== x) {
      x = this.parent[x]; // on remonte d'un cran
    }
    return x; // on est arrivé au chef
  }

  // union : fusionne les groupes de x et y.
  // On trouve le chef de chacun, puis on raccroche un chef sous l'autre.
  // Comme tout le groupe remonte vers son chef, un seul lien suffit.
  union(x, y) {
    const chefX = this.find(x);
    const chefY = this.find(y);
    this.parent[chefX] = chefY;
  }
}

// ------------------------------------------------------------
//  2. L'algorithme de Kruskal
//     - on trie les câbles du moins cher au plus cher
//     - on prend chaque câble SAUF s'il crée une boucle (cycle)
//     - on s'arrête quand on a (nombre de postes - 1) câbles
// ------------------------------------------------------------
function kruskal(edges) {
  // (a) Récupérer la liste des postes uniques à partir des câbles.
  //     Un Set refuse automatiquement les doublons.
  const postes = new Set();
  for (const cable of edges) {
    postes.add(cable.first);
    postes.add(cable.second);
  }

  // (b) Initialiser l'Union-Find avec ces postes.
  const ds = new DisjointSet(postes);

  // (c) Trier les câbles par coût croissant.
  //     [...edges] = on copie le tableau pour ne pas modifier l'original.
  const cablesTries = [...edges].sort((a, b) => a.weight - b.weight);

  // (d) Parcourir les câbles triés et construire l'arbre.
  const mst = []; // les câbles retenus
  let coutTotal = 0; // la somme de leurs coûts

  for (const cable of cablesTries) {
    // Même chef => les deux postes sont déjà reliés => boucle => on rejette.
    if (ds.find(cable.first) === ds.find(cable.second)) {
      continue; // on passe au câble suivant
    }

    // Sinon : on prend le câble et on fusionne les deux groupes.
    mst.push(cable);
    coutTotal += cable.weight;
    ds.union(cable.first, cable.second);

    // Filet de sécurité : un MST a exactement (postes - 1) câbles.
    // Dès qu'on les a tous, inutile de continuer.
    if (mst.length === postes.size - 1) break;
  }

  return { mst, coutTotal };
}

// ------------------------------------------------------------
//  3. Affichage du résultat
// ------------------------------------------------------------
function afficherResultat(resultat) {
  console.log("Connexions retenues :");
  for (const cable of resultat.mst) {
    console.log(
      `  ${cable.first} -- ${cable.second}  (coût : ${cable.weight})`,
    );
  }
  console.log(`Coût total du réseau : ${resultat.coutTotal}`);
}

// ------------------------------------------------------------
//  4. Exemple : notre bureau de 5 postes (A, B, C, D, E)
//     (BONUS) Pour ajouter un poste ou un câble, il suffit
//     d'ajouter une ligne dans ce tableau : rien d'autre à changer.
// ------------------------------------------------------------
const edges = [
  { first: "A", second: "B", weight: 4 },
  { first: "A", second: "C", weight: 3 },
  { first: "B", second: "C", weight: 1 },
  { first: "C", second: "D", weight: 2 },
  { first: "B", second: "D", weight: 5 },
  { first: "D", second: "E", weight: 6 },
  { first: "C", second: "E", weight: 7 },
];

afficherResultat(kruskal(edges));
