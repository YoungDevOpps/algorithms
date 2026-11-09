# ============================================================
#  QUEUES & PRIORITY QUEUES — variations et trade-offs
# ============================================================


# ============================================================
#  1. ARRAY-BASED QUEUE (taille fixe, buffer circulaire)
# ============================================================

class ArrayQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.items = [None] * capacity
        self.front = 0   # index du 1er élément
        self.size = 0    # nombre d'éléments

    # ajoute à l'arrière — O(1)
    def enqueue(self, element):
        if self.size == self.capacity:
            raise Exception("Queue pleine")
        rear = (self.front + self.size) % self.capacity
        self.items[rear] = element
        self.size += 1

    # retire l'élément de devant — O(1)
    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue vide")
        element = self.items[self.front]
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return element

    # regarde l'élément de devant — O(1)
    def peek(self):
        if self.is_empty():
            raise Exception("Queue vide")
        return self.items[self.front]

    def is_empty(self):
        return self.size == 0


# ============================================================
#  2. LINKED LIST-BASED QUEUE (taille dynamique)
# ============================================================

class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedQueue:
    def __init__(self):
        self.head = None  # on dequeue ici
        self.tail = None  # on enqueue ici
        self.size = 0

    # ajoute à la fin — O(1)
    def enqueue(self, element):
        node = Node(element)
        if self.is_empty():
            self.head = node
            self.tail = node
        else:
            self.tail.next = node
            self.tail = node
        self.size += 1

    # retire l'élément de devant — O(1)
    def dequeue(self):
        if self.is_empty():
            raise Exception("Queue vide")
        node = self.head
        self.head = self.head.next
        if self.head is None:
            self.tail = None  # devenue vide
        self.size -= 1
        return node.value

    # regarde l'élément de devant — O(1)
    def peek(self):
        if self.is_empty():
            raise Exception("Queue vide")
        return self.head.value

    def is_empty(self):
        return self.size == 0


# ============================================================
#  3. MIN-HEAP-BASED PRIORITY QUEUE
# ============================================================
#  tableau : parent=(i-1)//2, gauche=2i+1, droit=2i+2

class MinHeapPriorityQueue:
    def __init__(self):
        self.heap = []

    # insère puis remonte — O(log n)
    def insert(self, element):
        self.heap.append(element)
        self._bubble_up(len(self.heap) - 1)

    # retire la racine (le min) — O(log n)
    def extract_min(self):
        if self.is_empty():
            raise Exception("Priority queue vide")
        min_val = self.heap[0]
        last = self.heap.pop()
        if not self.is_empty():
            self.heap[0] = last
            self._bubble_down(0)
        return min_val

    # regarde le min — O(1)
    def peek_min(self):
        if self.is_empty():
            raise Exception("Priority queue vide")
        return self.heap[0]

    def is_empty(self):
        return len(self.heap) == 0

    # remonte tant qu'on est plus petit que le parent
    def _bubble_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self.heap[i] >= self.heap[parent]:
                break
            self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
            i = parent

    # descend tant qu'un enfant est plus petit
    def _bubble_down(self, i):
        n = len(self.heap)
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            smallest = i
            if left < n and self.heap[left] < self.heap[smallest]:
                smallest = left
            if right < n and self.heap[right] < self.heap[smallest]:
                smallest = right
            if smallest == i:
                break
            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            i = smallest


# ============================================================
#  4. ORDERED ARRAY-BASED PRIORITY QUEUE
# ============================================================
#  tableau trié décroissant → le min est à la fin

class OrderedArrayPriorityQueue:
    def __init__(self):
        self.items = []

    # insère en gardant le tri — O(n)
    def insert(self, element):
        i = len(self.items) - 1
        self.items.append(None)  # on agrandit d'une case
        while i >= 0 and self.items[i] < element:
            self.items[i + 1] = self.items[i]  # on décale vers la droite
            i -= 1
        self.items[i + 1] = element

    # le min est à la fin — O(1)
    def extract_min(self):
        if self.is_empty():
            raise Exception("Priority queue vide")
        return self.items.pop()

    # regarde le min — O(1)
    def peek_min(self):
        if self.is_empty():
            raise Exception("Priority queue vide")
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0


# ============================================================
#  DÉMONSTRATION
# ============================================================

if __name__ == "__main__":
    print("===== 1. ARRAY QUEUE (capacité 3) =====")
    aq = ArrayQueue(3)
    aq.enqueue("a")
    aq.enqueue("b")
    aq.enqueue("c")
    print("peek :", aq.peek())        # a
    try:
        aq.enqueue("d")               # pleine
    except Exception as e:
        print("erreur attendue :", e)
    print("dequeue :", aq.dequeue())  # a
    aq.enqueue("d")                   # réutilise la case libérée
    print("dequeue :", aq.dequeue())  # b
    print("dequeue :", aq.dequeue())  # c
    print("dequeue :", aq.dequeue())  # d
    print("is_empty :", aq.is_empty())  # True

    print("\n===== 2. LINKED QUEUE =====")
    lq = LinkedQueue()
    lq.enqueue(10)
    lq.enqueue(20)
    lq.enqueue(30)
    print("peek :", lq.peek())        # 10
    print("dequeue :", lq.dequeue())  # 10
    print("dequeue :", lq.dequeue())  # 20
    print("is_empty :", lq.is_empty())  # False
    print("dequeue :", lq.dequeue())  # 30
    try:
        lq.dequeue()                  # vide
    except Exception as e:
        print("erreur attendue :", e)

    print("\n===== 3. MIN-HEAP PRIORITY QUEUE =====")
    pq = MinHeapPriorityQueue()
    for x in [5, 3, 8, 1, 9, 2]:
        pq.insert(x)
    print("peek_min :", pq.peek_min())        # 1
    print("extract_min :", pq.extract_min())  # 1
    print("extract_min :", pq.extract_min())  # 2
    print("extract_min :", pq.extract_min())  # 3

    print("\n===== 4. ORDERED ARRAY PRIORITY QUEUE =====")
    opq = OrderedArrayPriorityQueue()
    for x in [5, 3, 8, 1, 9, 2]:
        opq.insert(x)
    print("peek_min :", opq.peek_min())        # 1
    print("extract_min :", opq.extract_min())  # 1
    print("extract_min :", opq.extract_min())  # 2
    print("extract_min :", opq.extract_min())  # 3


# ============================================================
#  COMPARATIF DES TRADE-OFFS
# ============================================================
#
#  QUEUE            enqueue   dequeue   peek    remarque
#  ----------------------------------------------------------
#  Array (fixe)     O(1)      O(1)      O(1)    taille limitée
#  Linked list      O(1)      O(1)      O(1)    taille dynamique
#
#  PRIORITY QUEUE   insert    extract_min   peek_min
#  ----------------------------------------------------------
#  Min-heap         O(log n)  O(log n)      O(1)   rapide à l'insert
#  Tableau ordonné  O(n)      O(1)          O(1)   rapide à l'extract
