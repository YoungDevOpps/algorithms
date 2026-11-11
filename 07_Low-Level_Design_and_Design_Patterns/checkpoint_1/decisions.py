# Partie 1 : prendre des décisions (if / elif / else)


# 1) Année bissextile
def is_leap_year(year):
    # Une année divisible par 400 est toujours bissextile (ex : 2000)
    if year % 400 == 0:
        return True
    # Divisible par 100 mais pas par 400 : non (ex : 1900)
    if year % 100 == 0:
        return False
    # Sinon, il suffit qu'elle soit divisible par 4 (ex : 2024)
    return year % 4 == 0


# 2) Prix du billet de cinéma
def ticket_price(age):
    if age <= 12:
        return 10  # enfant
    elif age <= 17:
        return 15  # ado
    else:
        return 20  # adulte


# 3) Conseiller de vêtements
def clothing_advice(temperature, is_raining):
    # On choisit d'abord selon la température...
    if temperature < 10:
        advice = "Il fait froid : mets un gros manteau et une écharpe."
    elif temperature < 20:
        advice = "Il fait frais : une veste ou un pull suffit."
    else:
        advice = "Il fait bon : un t-shirt fera l'affaire."

    # ...puis on ajoute un mot sur la pluie si besoin
    if is_raining:
        advice += " N'oublie pas ton parapluie !"
    return advice


# Quelques essais pour vérifier que tout marche
print("--- Année bissextile ---")
for year in [1900, 2000, 2023, 2024]:
    print(year, "->", is_leap_year(year))

print("--- Prix du billet ---")
for age in [8, 12, 13, 17, 18, 40]:
    print(age, "ans ->", ticket_price(age), "$")

print("--- Conseil vêtements ---")
print(clothing_advice(5, True))
print(clothing_advice(15, False))
print(clothing_advice(28, True))
