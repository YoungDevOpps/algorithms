// Partie 2 : la récursivité (une fonction qui s'appelle elle-même)

// 1) Fibonacci : 0, 1, 1, 2, 3, 5, 8, ...
function fibonacci(n) {
  // Cas de base : les deux premiers nombres sont connus d'avance
  if (n === 0) return 0;
  if (n === 1) return 1;
  // Sinon, c'est la somme des deux nombres juste avant
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 2) Palindrome (on ignore espaces, ponctuation et majuscules)
function cleanText(text) {
  // On garde seulement les lettres et chiffres, en minuscules
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isPalindrome(text) {
  text = cleanText(text);
  // Cas de base : 0 ou 1 lettre, c'est forcément un palindrome
  if (text.length <= 1) return true;
  // Si la première et la dernière lettre sont différentes, c'est perdu
  if (text[0] !== text[text.length - 1]) return false;
  // Sinon on enlève les deux bouts et on recommence
  return isPalindrome(text.slice(1, -1));
}

// 3) Puissance : base ** exponent (exposant entier, positif ou négatif)
function power(base, exponent) {
  // Cas de base : n'importe quel nombre puissance 0 vaut 1
  if (exponent === 0) return 1;
  // Exposant négatif : on calcule en positif puis on prend l'inverse
  if (exponent < 0) return 1 / power(base, -exponent);
  // Sinon : base^n = base * base^(n-1)
  return base * power(base, exponent - 1);
}

// Quelques essais pour vérifier que tout marche
console.log("--- Fibonacci ---");
console.log(Array.from({ length: 10 }, (_, i) => fibonacci(i)));

console.log("--- Palindrome ---");
for (const phrase of ["Radar", "A man, a plan, a canal: Panama", "Bonjour"]) {
  console.log(`"${phrase}" ->`, isPalindrome(phrase));
}

console.log("--- Puissance ---");
console.log("2^10 =", power(2, 10));
console.log("5^0 =", power(5, 0));
console.log("2^-3 =", power(2, -3));
