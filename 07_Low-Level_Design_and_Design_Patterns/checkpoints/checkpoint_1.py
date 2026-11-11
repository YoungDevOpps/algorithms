# Checkpoint : file d'impression (FIFO) avec menu interactif
# Lancer avec : python3 checkpoint.py

import time
from collections import deque


# File simple : on ajoute à la fin, on retire au début
class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        # popleft() est en O(1), contrairement à list.pop(0)
        return self.items.popleft() if self.items else None

    def peek(self):
        return self.items[0] if self.items else None

    def is_empty(self):
        return len(self.items) == 0


# Durée d'impression en secondes : 0,5 s de base + (caractères × pages) / 100
# Exemple : "Rapport_trimestre_2.pdf" (19 car.) × 10 pages = 0,5 + 1,9 = 2,4 s
# Plafonnée à 8 s pour ne jamais attendre trop longtemps
def print_duration(name, pages):
    return min(0.5 + len(name) * pages / 100, 8)


# Jauge de 1 à 100 %, redessinée sur la même ligne
def show_gauge(seconds):
    delay = seconds / 100
    for p in range(1, 101):
        filled = "#" * (p // 2)
        print(f"\r[{filled:<50}] {p}%", end="", flush=True)
        time.sleep(delay)
    print()


# L'imprimante range les travaux dans une Queue
class PrinterQueue:
    def __init__(self):
        self.queue = Queue()

    def add_job(self, name, pages):
        self.queue.enqueue((name, pages))
        print(f"Ajouté : {name} ({pages} page(s))")

    # Traite le premier travail de la file
    def process_job(self):
        if self.queue.is_empty():
            print("Aucun travail à imprimer.")
            return
        name, pages = self.queue.dequeue()
        seconds = print_duration(name, pages)
        print(f"Impression de {name} ({pages} page(s)), ~{seconds:.1f} s")
        show_gauge(seconds)
        print("Terminé.")

    def print_queue(self):
        if self.queue.is_empty():
            print("File vide.")
            return
        print("File d'attente :")
        for i, (name, pages) in enumerate(self.queue.items, start=1):
            print(f"  {i}. {name} ({pages} page(s))")


# Menu en console
def main():
    printer = PrinterQueue()

    while True:
        print("\n1. Ajouter un job\n2. Lancer un job\n3. Afficher la file\n4. Quitter")
        choice = input("Votre choix : ").strip()

        if choice == "1":
            name = input("Nom du job : ").strip()
            pages = input("Nombre de pages : ").strip()
            # On refuse un nom vide ou un nombre de pages invalide
            if not name or not pages.isdigit() or int(pages) < 1:
                print("Entrée invalide.")
            else:
                printer.add_job(name, int(pages))
        elif choice == "2":
            printer.process_job()
        elif choice == "3":
            printer.print_queue()
        elif choice == "4":
            break
        else:
            print("Choix inconnu.")


main()
