// Partie 1 : prendre des décisions (if / else)

// 1) Année bissextile
function isLeapYear(year) {
  // Une année divisible par 400 est toujours bissextile (ex : 2000)
  if (year % 400 === 0) return true;
  // Divisible par 100 mais pas par 400 : non (ex : 1900)
  if (year % 100 === 0) return false;
  // Sinon, il suffit qu'elle soit divisible par 4 (ex : 2024)
  return year % 4 === 0;
}

// 2) Prix du billet de cinéma
function ticketPrice(age) {
  if (age <= 12) return 10; // enfant
  if (age <= 17) return 15; // ado
  return 20; // adulte
}

// 3) Conseiller de vêtements
function clothingAdvice(temperature, isRaining) {
  let advice;

  // On choisit d'abord selon la température...
  if (temperature < 10) {
    advice = "Il fait froid : mets un gros manteau et une écharpe.";
  } else if (temperature < 20) {
    advice = "Il fait frais : une veste ou un pull suffit.";
  } else {
    advice = "Il fait bon : un t-shirt fera l'affaire.";
  }

  // ...puis on ajoute un mot sur la pluie si besoin
  if (isRaining) {
    advice += " N'oublie pas ton parapluie !";
  }
  return advice;
}

// Quelques essais pour vérifier que tout marche
console.log("--- Année bissextile ---");
for (const year of [1900, 2000, 2023, 2024]) {
  console.log(year, "->", isLeapYear(year));
}

console.log("--- Prix du billet ---");
for (const age of [8, 12, 13, 17, 18, 40]) {
  console.log(age, "ans ->", ticketPrice(age), "$");
}

console.log("--- Conseil vêtements ---");
console.log(clothingAdvice(5, true));
console.log(clothingAdvice(15, false));
console.log(clothingAdvice(28, true));
