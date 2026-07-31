#!/usr/bin/env python3
"""
Regenere data/gallery.js a partir du contenu de assets/<categorie>/.

A relancer chaque fois que le tri change dans assets/ :

    python3 scripts/generate_gallery.py

Structure attendue sous assets/<categorie>/ :

  - un fichier image/video directement dans le dossier de categorie
    => une oeuvre a une seule photo
  - un sous-dossier (ex: "dossier sans titre 2") contenant plusieurs
    fichiers => une oeuvre a plusieurs photos/videos (angles, details,
    etapes...), affichee comme une seule vignette avec un mini carrousel

Le titre d'une oeuvre vient du nom du sous-dossier, SAUF si c'est un nom
par defaut du Finder ("dossier sans titre", "dossier sans titre 2"...) qui
est alors ignore. Pour donner un vrai titre a une oeuvre : renommer son
sous-dossier (ex: "Portrait au clair de lune").
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT, "assets")
OUT_FILE = os.path.join(ROOT, "data", "gallery.js")

LABELS = {
    "aquarelle": "Aquarelle",
    "autre": "Autres creations",
    "pastels": "Pastels",
    "peinture": "Peinture",
    "sculture": "Sculpture",
}

IMG_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp")
VID_EXT = (".mp4", ".mov", ".webm")
MEDIA_EXT = IMG_EXT + VID_EXT
SKIP_DIRS = {"text"}
SKIP_FILES = {".DS_Store"}

UNTITLED_RE = re.compile(r"^(dossier sans titre|untitled folder)(\s\d+)?$", re.IGNORECASE)
DATE_RE = re.compile(r"(\d{8}_\d{6})")


def media_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    return "video" if ext in VID_EXT else "image"


def sort_key(filenames):
    for name in filenames:
        m = DATE_RE.search(name)
        if m:
            return m.group(1)
    return "9" * 15


def build_work(filenames, folder=None):
    files = sorted(
        f for f in filenames
        if f not in SKIP_FILES and os.path.splitext(f)[1].lower() in MEDIA_EXT
    )
    if not files:
        return None
    media = [
        {"file": f"{folder}/{f}" if folder else f, "type": media_type(f)}
        for f in files
    ]
    title = folder if (folder and not UNTITLED_RE.match(folder)) else ""
    return {"title": title, "media": media, "_sort": sort_key(files)}


def main():
    categories = []
    for cat_name in sorted(os.listdir(ASSETS_DIR)):
        cat_path = os.path.join(ASSETS_DIR, cat_name)
        if not os.path.isdir(cat_path) or cat_name in SKIP_DIRS:
            continue

        works = []
        for entry in sorted(os.listdir(cat_path)):
            if entry in SKIP_FILES:
                continue
            full = os.path.join(cat_path, entry)
            if os.path.isdir(full):
                sub_files = [f for f in os.listdir(full) if f not in SKIP_FILES]
                work = build_work(sub_files, folder=entry)
            else:
                if os.path.splitext(entry)[1].lower() not in MEDIA_EXT:
                    continue
                work = build_work([entry])
            if work:
                works.append(work)

        works.sort(key=lambda w: w["_sort"])
        for i, w in enumerate(works, 1):
            del w["_sort"]
            w["id"] = f"{cat_name}-{i:02d}"

        categories.append(
            {"key": cat_name, "label": LABELS.get(cat_name, cat_name.capitalize()), "works": works}
        )

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write(
            "// Genere automatiquement par scripts/generate_gallery.py — ne pas editer a la main.\n"
        )
        f.write(
            "// Pour mettre a jour apres avoir trie/regroupe des images dans assets/, relancer: python3 scripts/generate_gallery.py\n"
        )
        f.write("const GALLERY = ")
        json.dump(categories, f, ensure_ascii=False, indent=2)
        f.write(";\n")

    total_works = sum(len(c["works"]) for c in categories)
    total_media = sum(len(w["media"]) for c in categories for w in c["works"])
    print(f"{len(categories)} categories, {total_works} oeuvres, {total_media} fichiers -> {OUT_FILE}")


if __name__ == "__main__":
    main()
