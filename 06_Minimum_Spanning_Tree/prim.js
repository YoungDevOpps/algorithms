// ============================================================
//  PRIM — Arbre couvrant minimal (MST)
// ============================================================

// ------------------------------------------------------------
//  1. L'algorithme de Prim
//     - on part d'un poste quelconque (le premier)
//     - on répète : trouver le câble le moins cher qui relie
//       un poste DÉJÀ dans l'arbre à un poste PAS ENCORE dedans
//     - on s'arrête quand tous les postes sont reliés
// ------------------------------------------------------------
function prim(edges) {
  // (a) Récupérer la liste des postes uniques (comme pour Kruskal).
  const postes = new Set();
  for (const cable of edges) {
    postes.add(cable.first);
    postes.add(cable.second);
  }

  // (b) "visites" = les postes déjà reliés à l'arbre.
  //     On démarre avec un seul poste : le premier de la liste.
  const visites = new Set();
  const premierPoste = [...postes][0];
  visites.add(premierPoste);

  const mst = []; // les câbles retenus
  let coutTotal = 0; // la somme de leurs coûts

  // (c) Tant que tous les postes ne sont pas reliés, on continue.
  while (visites.size < postes.size) {
    let meilleurCable = null; // le câble le moins cher trouvé ce tour-ci

    // On parcourt TOUS les câbles pour trouver le meilleur candidat :
    // un câble qui a UNE extrémité déjà reliée et l'AUTRE pas encore.
    for (const cable of edges) {
      const firstDedans = visites.has(cable.first);
      const secondDedans = visites.has(cable.second);

      // On veut exactement une extrémité dedans et une dehors.
      // Si les deux sont dedans  -> créerait une boucle, on ignore.
      // Si les deux sont dehors  -> ne touche pas encore l'arbre, on ignore.
      if (firstDedans === secondDedans) continue;

      // Candidat valable : on garde le moins cher vu jusqu'ici.
      if (meilleurCable === null || cable.weight < meilleurCable.weight) {
        meilleurCable = cable;
      }
    }

    // (d) On ajoute ce meilleur câble à l'arbre.
    mst.push(meilleurCable);
    coutTotal += meilleurCable.weight;

    // Le nouveau poste relié est celui des deux extrémités qui était dehors.
    const nouveauPoste = visites.has(meilleurCable.first)
      ? meilleurCable.second
      : meilleurCable.first;
    visites.add(nouveauPoste);
  }

  return { mst, coutTotal };
}

// ------------------------------------------------------------
//  2. Affichage du résultat (identique à celui de Kruskal)
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
//  3. Exemple : le même bureau de 5 postes (A, B, C, D, E)
//     (BONUS) Ajouter un poste ou un câble = ajouter une ligne ici.
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

afficherResultat(prim(edges));
