# Optimisation de la planification des livraisons

## Analyse, comparaison et recommandation

## Le problème

Pour cette situation le problème qu'on rencontre est celui de l'optimisation de la planification de tâches. On reçoit une liste de tâches, chacune occupe une fenêtre de temps (`start` → `end`), et un seul livreur ne peut faire qu'une tâche à la fois. Deux tâches se **chevauchent** si leurs fenêtres de temps se croisent.

Le but n'est **pas** de maximiser les heures travaillées ni la valeur des tâches, mais de faire le **plus grand nombre de tâches** possible sans aucun chevauchement.

> **La vraie question :** parmi toutes ces tâches qui se chevauchent, quel est le plus grand ensemble de tâches que je peux choisir sans qu'aucune n'entre en collision ?

## Les deux approches

### Brute-force (force brute) — `O(2^n)`

L'état d'esprit « j'essaie tout » en générant **toutes les combinaisons possibles** de tâches (tous les sous-ensembles), on rejette celles qui contiennent un chevauchement, et parmi celles qui restent on garde la plus grande.

- ✅ Toujours correcte (elle teste littéralement toutes les options).
- ❌ Il y a **2^n** sous-ensembles pour _n_ tâches (chaque tâche est « prise » ou « pas prise »). À 10 000 tâches, ce nombre dépasse les 3 000 chiffres : impossible à calculer.

### Greedy (gloutonne) — `O(n log n)`

Le « raccourci malin ». **Insight clé :** en choisissant toujours la tâche qui **finit le plus tôt**, on libère le livreur au plus vite et on laisse le maximum de place aux tâches suivantes.

- Trier les tâches par heure de fin (`end`).
- Parcourir la liste une seule fois : on prend une tâche si elle commence _après_ la fin de la dernière tâche acceptée.

Le coût se limite à un tri + un passage.

---

## Comparaison

| Critère                       | Brute-force                       | Greedy                  |
| ----------------------------- | --------------------------------- | ----------------------- |
| **Complexité temps**          | `O(2^n)` exponentielle            | `O(n log n)`            |
| **Vitesse (grandes entrées)** | Inutilisable                      | Quelques millisecondes  |
| **Mémoire**                   | Explose (stocke les combinaisons) | `O(n)`, quasi constante |
| **Maintenabilité**            | Longue, fragile, dure à déboguer  | Courte, lisible, simple |
| **Résultat**                  | Optimal                           | Optimal (identique)     |

### Résultats mesurés

Sur l'échantillon de 6 tâches de l'énoncé, les **deux approches sélectionnent 4 tâches**, résultat identique.

Sur de grandes entrées, l'écart est brutal :

| Entrée        | Approche    | Temps   |
| ------------- | ----------- | ------- |
| 10 000 tâches | Greedy      | ~18 ms  |
| 20 tâches (!) | Brute-force | ~198 ms |

La brute-force sur **20** tâches (1 048 576 combinaisons) est déjà **10× plus lente** que le greedy sur **10 000** tâches. À 30 tâches elle atteint le milliard de combinaisons ; à 10 000 elle ne terminerait jamais.

## Recommandation

Pour ce système qui fonctionne **en temps réel** et doit encaisser **des milliers de tâches par seconde**, je recommande sans hésiter la **solution greedy**.

Elle est la seule à tenir la charge : rapide, légère en mémoire, simple à maintenir, et surtout **prouvée optimale** pour maximiser le _nombre_ de tâches non chevauchantes. Elle donne la **même bonne réponse** que la force brute, sans son coût.

## Comportement sur les cas limites (bonus)

Le greedy reste correct et stable sur tous les cas particuliers :

| Cas                              | Résultat | Attendu |
| -------------------------------- | -------- | ------- |
| Toutes les tâches se chevauchent | 1        | 1       |
| Aucune tâche ne se chevauche     | toutes   | toutes  |
| Horaires de début/fin identiques | 1        | 1       |
| Liste vide                       | 0        | 0       |

**Conclusion : le greedy est l'approche à retenir pour le système final.**
