// Checkpoint : file d'impression (FIFO) avec menu interactif
// Lancer avec : node checkpoint.js

const readline = require("readline/promises");

// File simple : on ajoute à la fin, on retire au début
class Queue {
  constructor() {
    this.items = [];
  }

  // Ajoute un élément à la fin de la file
  enqueue(item) {
    this.items.push(item);
  }

  // Retire et renvoie le premier élément de la file
  dequeue() {
    // shift() renvoie undefined si la file est vide
    return this.items.shift();
  }

  // Renvoie le premier élément sans le retirer
  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Durée d'impression en secondes : 0,5 s de base + (caractères × pages) / 100
// Exemple : "Rapport_trimestre_2.pdf" (19 car.) × 10 pages = 0,5 + 1,9 = 2,4 s
// Plafonnée à 8 s pour ne jamais attendre trop longtemps
function printDuration(job) {
  return Math.min(0.5 + (job.name.length * job.pages) / 100, 8);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Jauge de 1 à 100 %, redessinée sur la même ligne
async function showGauge(seconds) {
  const delay = (seconds * 1000) / 100;
  for (let p = 1; p <= 100; p++) {
    const filled = "#".repeat(p / 2);
    const empty = " ".repeat(50 - p / 2);
    process.stdout.write(`\r[${filled}${empty}] ${p}%`);
    await sleep(delay);
  }
  process.stdout.write("\n");
}

// L'imprimante range les travaux dans une Queue
class PrinterQueue {
  constructor() {
    this.queue = new Queue();
  }

  // Ajoute un travail à la file d'impression
  addJob(name, pages) {
    this.queue.enqueue({ name, pages });
    console.log(`Ajouté : ${name} (${pages} page(s))`);
  }

  // Traite le premier travail de la file
  async processJob() {
    if (this.queue.isEmpty()) {
      console.log("Aucun travail à imprimer.");
      return;
    }
    const job = this.queue.dequeue();
    const seconds = printDuration(job);
    console.log(`Impression de ${job.name} (${job.pages} page(s)), ~${seconds.toFixed(1)} s`);
    await showGauge(seconds);
    console.log("Terminé.");
  }

  // Affiche l'état de la file d'impression
  printQueue() {
    if (this.queue.isEmpty()) {
      console.log("File vide.");
      return;
    }
    console.log("File d'attente :");
    this.queue.items.forEach((job, i) => {
      console.log(`  ${i + 1}. ${job.name} (${job.pages} page(s))`);
    });
  }
}

// Menu en console
async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const printer = new PrinterQueue();

  while (true) {
    console.log("\n1. Ajouter un job\n2. Lancer un job\n3. Afficher la file\n4. Quitter");
    const choice = (await rl.question("Votre choix : ")).trim();

    if (choice === "1") {
      const name = (await rl.question("Nom du job : ")).trim();
      const pages = parseInt(await rl.question("Nombre de pages : "), 10);
      // On refuse un nom vide ou un nombre de pages invalide
      if (!name || !(pages > 0)) {
        console.log("Entrée invalide.");
      } else {
        printer.addJob(name, pages);
      }
    } else if (choice === "2") {
      await printer.processJob();
    } else if (choice === "3") {
      printer.printQueue();
    } else if (choice === "4") {
      break;
    } else {
      console.log("Choix inconnu.");
    }
  }
  rl.close();
}

main();
