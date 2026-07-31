# Marie-Ève — Art Portfolio

Site statique en HTML/CSS/JS pur (aucune dépendance à installer).

## Pages

- `index.html` — Bienvenue
- `categorie-art.html` — Catégorie Art (aquarelle, pastels, sculpture, etc.)
- `a-propos.html` — À propos (bio + contact)
- `acheter.html` — Acheter (liens boutique)

## Trier les œuvres

Les catégories de la page **Catégorie Art** viennent des sous-dossiers de
`assets/` (ex: `assets/aquarelle/`, `assets/pastels/`, `assets/sculture/`...).
Chaque sous-dossier devient une catégorie.

À l'intérieur d'une catégorie, deux façons de ranger un fichier :

- **directement dans le dossier** → une œuvre = une seule photo/vidéo
- **dans un sous-dossier** (ex: `assets/aquarelle/dossier sans titre 2/`)
  → toutes les photos/vidéos de ce sous-dossier forment **une seule œuvre**
  (angles différents, détails, étapes...), affichée comme une seule vignette
  avec un mini carrousel

Pour donner un titre à une œuvre, renomme son sous-dossier (ex:
`Portrait au clair de lune` au lieu de `dossier sans titre 2`) — le nom
s'affichera sous la vignette. Les dossiers encore appelés "dossier sans
titre" restent sans titre affiché, ce n'est pas grave.

Après avoir trié/regroupé des photos, régénère la liste :

```bash
python3 scripts/generate_gallery.py
```

Cela met à jour `data/gallery.js`. Rien d'autre à toucher.

Pour créer une nouvelle catégorie, il suffit de créer un nouveau dossier
dans `assets/` (ex: `assets/dessin/`) et d'y mettre des images, puis de
relancer la commande ci-dessus. Le nom affiché peut être personnalisé dans
le dictionnaire `LABELS` en haut de `scripts/generate_gallery.py`.

## Photo de profil (page À propos)

Dépose ta photo ici (n'importe lequel des 3 noms suffit) :

```
assets/portrait.jpg
assets/portrait.jpeg
assets/portrait.png
```

Elle apparaîtra automatiquement. Tant qu'aucun fichier n'est présent, un
joli placeholder "M-È" s'affiche à la place.

## À compléter

Deux endroits marqués `TODO` dans le code sont à remplir avec les vraies
informations :

- `a-propos.html` — l'e-mail et le lien Instagram de contact
- `acheter.html` — le lien de la boutique Etsy, et la 2e plateforme de vente
  quand elle sera choisie (actuellement affichée en "Bientôt disponible")

## Voir le site en local

Double-cliquer sur `index.html` fonctionne, mais pour un rendu fidèle
(notamment le chargement des polices), il est préférable de lancer un
petit serveur local depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 dans le navigateur.
