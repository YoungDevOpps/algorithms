// ============================================================
//  QUEUES & PRIORITY QUEUES — variations et trade-offs
// ============================================================


// ============================================================
//  1. ARRAY-BASED QUEUE (taille fixe, buffer circulaire)
// ============================================================

class ArrayQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.front = 0;   // index du 1er élément
    this.size = 0;    // nombre d'éléments
  }

  // ajoute à l'arrière — O(1)
  enqueue(element) {
    if (this.size === this.capacity) throw new Error("Queue pleine");
    const rear = (this.front + this.size) % this.capacity;
    this.items[rear] = element;
    this.size++;
  }

  // retire l'élément de devant — O(1)
  dequeue() {
    if (this.isEmpty()) throw new Error("Queue vide");
    const element = this.items[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return element;
  }

  // regarde l'élément de devant — O(1)
  peek() {
    if (this.isEmpty()) throw new Error("Queue vide");
    return this.items[this.front];
  }

  isEmpty() {
    return this.size === 0;
  }
}


// ============================================================
//  2. LINKED LIST-BASED QUEUE (taille dynamique)
// ============================================================

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedQueue {
  constructor() {
    this.head = null; // on dequeue ici
    this.tail = null; // on enqueue ici
    this.size = 0;
  }

  // ajoute à la fin — O(1)
  enqueue(element) {
    const node = new Node(element);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }

  // retire l'élément de devant — O(1)
  dequeue() {
    if (this.isEmpty()) throw new Error("Queue vide");
    const node = this.head;
    this.head = this.head.next;
    if (this.head === null) this.tail = null; // devenue vide
    this.size--;
    return node.value;
  }

  // regarde l'élément de devant — O(1)
  peek() {
    if (this.isEmpty()) throw new Error("Queue vide");
    return this.head.value;
  }

  isEmpty() {
    return this.size === 0;
  }
}


// ============================================================
//  3. MIN-HEAP-BASED PRIORITY QUEUE
// ============================================================
//  tableau : parent=(i-1)/2, gauche=2i+1, droit=2i+2

class MinHeapPriorityQueue {
  constructor() {
    this.heap = [];
  }

  // insère puis remonte — O(log n)
  insert(element) {
    this.heap.push(element);
    this._bubbleUp(this.heap.length - 1);
  }

  // retire la racine (le min) — O(log n)
  extractMin() {
    if (this.isEmpty()) throw new Error("Priority queue vide");
    const min = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }

  // regarde le min — O(1)
  peekMin() {
    if (this.isEmpty()) throw new Error("Priority queue vide");
    return this.heap[0];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  // remonte tant qu'on est plus petit que le parent
  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[i] >= this.heap[parent]) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  // descend tant qu'un enfant est plus petit
  _bubbleDown(i) {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}


// ============================================================
//  4. ORDERED ARRAY-BASED PRIORITY QUEUE
// ============================================================
//  tableau trié décroissant → le min est à la fin

class OrderedArrayPriorityQueue {
  constructor() {
    this.items = [];
  }

  // insère en gardant le tri — O(n)
  insert(element) {
    let i = this.items.length - 1;
    while (i >= 0 && this.items[i] < element) {
      this.items[i + 1] = this.items[i]; // on décale vers la droite
      i--;
    }
    this.items[i + 1] = element;
  }

  // le min est à la fin — O(1)
  extractMin() {
    if (this.isEmpty()) throw new Error("Priority queue vide");
    return this.items.pop();
  }

  // regarde le min — O(1)
  peekMin() {
    if (this.isEmpty()) throw new Error("Priority queue vide");
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}


// ============================================================
//  DÉMONSTRATION
// ============================================================

console.log("===== 1. ARRAY QUEUE (capacité 3) =====");
const aq = new ArrayQueue(3);
aq.enqueue("a");
aq.enqueue("b");
aq.enqueue("c");
console.log("peek :", aq.peek());       // a
try {
  aq.enqueue("d");                       // pleine
} catch (e) {
  console.log("erreur attendue :", e.message);
}
console.log("dequeue :", aq.dequeue());  // a
aq.enqueue("d");                         // réutilise la case libérée
console.log("dequeue :", aq.dequeue());  // b
console.log("dequeue :", aq.dequeue());  // c
console.log("dequeue :", aq.dequeue());  // d
console.log("isEmpty :", aq.isEmpty());  // true

console.log("\n===== 2. LINKED QUEUE =====");
const lq = new LinkedQueue();
lq.enqueue(10);
lq.enqueue(20);
lq.enqueue(30);
console.log("peek :", lq.peek());        // 10
console.log("dequeue :", lq.dequeue());  // 10
console.log("dequeue :", lq.dequeue());  // 20
console.log("isEmpty :", lq.isEmpty());  // false
console.log("dequeue :", lq.dequeue());  // 30
try {
  lq.dequeue();                          // vide
} catch (e) {
  console.log("erreur attendue :", e.message);
}

console.log("\n===== 3. MIN-HEAP PRIORITY QUEUE =====");
const pq = new MinHeapPriorityQueue();
[5, 3, 8, 1, 9, 2].forEach(x => pq.insert(x));
console.log("peekMin :", pq.peekMin());        // 1
console.log("extractMin :", pq.extractMin());  // 1
console.log("extractMin :", pq.extractMin());  // 2
console.log("extractMin :", pq.extractMin());  // 3

console.log("\n===== 4. ORDERED ARRAY PRIORITY QUEUE =====");
const opq = new OrderedArrayPriorityQueue();
[5, 3, 8, 1, 9, 2].forEach(x => opq.insert(x));
console.log("peekMin :", opq.peekMin());        // 1
console.log("extractMin :", opq.extractMin());  // 1
console.log("extractMin :", opq.extractMin());  // 2
console.log("extractMin :", opq.extractMin());  // 3