"""
TASK SCHEDULER — Checkpoint: Comparative Analysis of Algorithmic Techniques

Objectif : gérer des tâches (tri, groupement par priorité, détection de chevauchements)
et analyser la complexité de chaque opération en notation Big O.
"""

from collections import defaultdict
import sys

# ─────────────────────────────────────────────
# 1. DONNÉES
# ─────────────────────────────────────────────
# Chaque tâche : { "name", "start", "end", "priority" }
# start/end : entiers (minutes depuis minuit)
# priority  : "High" | "Medium" | "Low"

tasks = [
    {"name": "Code review",      "start": 60,  "end": 90,  "priority": "High"  },
    {"name": "Morning standup",  "start": 30,  "end": 60,  "priority": "High"  },
    {"name": "Lunch break",      "start": 120, "end": 180, "priority": "Low"   },
    {"name": "Sprint planning",  "start": 80,  "end": 130, "priority": "Medium"},
    {"name": "Email triage",     "start": 0,   "end": 30,  "priority": "Medium"},
    {"name": "Documentation",    "start": 150, "end": 210, "priority": "Low"   },
    {"name": "Bug fix #42",      "start": 90,  "end": 150, "priority": "High"  },
]

# ─────────────────────────────────────────────
# 2. TRI PAR HEURE DE DÉBUT
# ─────────────────────────────────────────────
def sort_by_start_time(task_list: list) -> list:
    """
    Trie une copie des tâches par start time croissant.

    Complexité temporelle : O(n log n)  — Timsort (algorithme natif de Python)
    Complexité spatiale  : O(n)         — une nouvelle liste est retournée
    """
    return sorted(task_list, key=lambda t: t["start"])


# ─────────────────────────────────────────────
# 3. GROUPEMENT PAR PRIORITÉ  (Hash Map)
# ─────────────────────────────────────────────
def group_by_priority(task_list: list) -> dict:
    """
    Regroupe les tâches dans un dict { "High": [...], "Medium": [...], "Low": [...] }.

    Complexité temporelle : O(n)  — une seule passe sur la liste
    Complexité spatiale  : O(n)  — stocke toutes les tâches dans la hash map
    """
    groups = defaultdict(list)  # accès/insertion en O(1) amorti

    for task in task_list:
        # L'accès à groups[task["priority"]] est O(1) grâce au hash map
        groups[task["priority"]].append(task)

    return {p: groups[p] for p in ["High", "Medium", "Low"] if p in groups}


# ─────────────────────────────────────────────
# 4. DÉTECTION DE CHEVAUCHEMENTS (Overlapping)
# ─────────────────────────────────────────────
def detect_overlaps(task_list: list) -> list:
    """
    Retourne toutes les paires de tâches qui se chevauchent.
    Deux tâches [a.start, a.end] et [b.start, b.end] se chevauchent si :
    a.start < b.end  ET  b.start < a.end

    Complexité temporelle : O(n log n + n²) ≈ O(n²) worst case
    Complexité spatiale  : O(k)  — k = nombre de paires en conflit
    """
    sorted_tasks = sort_by_start_time(task_list)
    overlaps = []

    for i in range(len(sorted_tasks)):
        for j in range(i + 1, len(sorted_tasks)):
            # Dès que la tâche j commence après la fin de i, pas besoin de continuer
            if sorted_tasks[j]["start"] >= sorted_tasks[i]["end"]:
                break

            # Chevauchement confirmé
            overlaps.append({
                "task1":   sorted_tasks[i]["name"],
                "task2":   sorted_tasks[j]["name"],
                "overlap": f"[{sorted_tasks[j]['start']} → {sorted_tasks[i]['end']}]",
            })

    return overlaps


# ─────────────────────────────────────────────
# 5. (OPTIONNEL) ESTIMATION MÉMOIRE
# ─────────────────────────────────────────────
def estimate_memory_bytes(task_list: list) -> int:
    """
    Estime la mémoire réelle utilisée par la liste de tâches via sys.getsizeof.

    Complexité temporelle : O(n)
    Complexité spatiale  : O(1)  — on accumule juste un compteur
    """
    total = sys.getsizeof(task_list)  # overhead de la liste

    for task in task_list:
        total += sys.getsizeof(task)  # overhead du dict
        for key, value in task.items():
            total += sys.getsizeof(key)
            total += sys.getsizeof(value)

    return total


# ─────────────────────────────────────────────
# 6. EXÉCUTION & AFFICHAGE
# ─────────────────────────────────────────────
def main():
    sep = "═" * 43
    print(sep)
    print("       TASK SCHEDULER — RÉSULTATS         ")
    print(sep)

    print("\n── 1. Tâches triées par heure de début ──")
    for t in sort_by_start_time(tasks):
        print(f"  [{t['start']:>3}–{t['end']:<3}] {t['priority']:<6} | {t['name']}")

    print("\n── 2. Tâches groupées par priorité ──")
    for priority, group in group_by_priority(tasks).items():
        names = ", ".join(t["name"] for t in group)
        print(f"  {priority} ({len(group)}) : {names}")

    print("\n── 3. Chevauchements détectés ──")
    overlaps = detect_overlaps(tasks)
    if not overlaps:
        print("  Aucun chevauchement.")
    else:
        for o in overlaps:
            print(f"  ⚠ \"{o['task1']}\"  ↔  \"{o['task2']}\"  intervalle commun : {o['overlap']}")

    print("\n── 4. Estimation mémoire ──")
    mem = estimate_memory_bytes(tasks)
    print(f"  {len(tasks)} tâches ≈ {mem} octets ({mem / 1024:.2f} Ko)")


if __name__ == "__main__":
    main()
