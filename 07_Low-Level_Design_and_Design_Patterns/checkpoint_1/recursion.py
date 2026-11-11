# Partie 2 : la récursivité (une fonction qui s'appelle elle-même)


# 1) Fibonacci : 0, 1, 1, 2, 3, 5, 8, ...
def fibonacci(n):
    # Cas de base : les deux premiers nombres sont connus d'avance
    if n == 0:
        return 0
    if n == 1:
        return 1
    # Sinon, c'est la somme des deux nombres juste avant
    return fibonacci(n - 1) + fibonacci(n - 2)


# 2) Palindrome (on ignore espaces, ponctuation et majuscules)
def clean_text(text):
    # On garde seulement les lettres et chiffres, en minuscules
    return "".join(char.lower() for char in text if char.isalnum())


def is_palindrome(text):
    text = clean_text(text)
    # Cas de base : 0 ou 1 lettre, c'est forcément un palindrome
    if len(text) <= 1:
        return True
    # Si la première et la dernière lettre sont différentes, c'est perdu
    if text[0] != text[-1]:
        return False
    # Sinon on enlève les deux bouts et on recommence
    return is_palindrome(text[1:-1])


# 3) Puissance : base ** exponent (exposant entier, positif ou négatif)
def power(base, exponent):
    # Cas de base : n'importe quel nombre puissance 0 vaut 1
    if exponent == 0:
        return 1
    # Exposant négatif : on calcule en positif puis on prend l'inverse
    if exponent < 0:
        return 1 / power(base, -exponent)
    # Sinon : base^n = base * base^(n-1)
    return base * power(base, exponent - 1)


# Quelques essais pour vérifier que tout marche
print("--- Fibonacci ---")
print([fibonacci(i) for i in range(10)])

print("--- Palindrome ---")
for phrase in ["Radar", "A man, a plan, a canal: Panama", "Bonjour"]:
    print(repr(phrase), "->", is_palindrome(phrase))

print("--- Puissance ---")
print("2^10 =", power(2, 10))
print("5^0 =", power(5, 0))
print("2^-3 =", power(2, -3))
