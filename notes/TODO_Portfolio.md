# À faire — Portfolio

**V1 en ligne ✅** : https://esteban-crln.github.io/

## De ton côté — IMPORTANT après le rangement des dossiers
Les fichiers ont été réorganisés en sous-dossiers (`css/`, `js/`, `favicon/`, `cv/`, `seo/`). Comme ça change les chemins, il faut refaire un upload complet sur GitHub :
- [ ] **Supprimer sur GitHub** les anciens fichiers à la racine du repo : `style.css`, `script.js`, `favicon.ico`, `favicon.svg`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `CV_Esteban_Cornier_Lecan.pdf`, `sitemap.xml`.
- [ ] **Uploader** tout le contenu de ce dossier (`Claude_outputs\Portfolio`, sauf `notes/`) en conservant la structure : `index.html` et `robots.txt` à la racine, plus les dossiers `css/`, `js/`, `favicon/`, `cv/`, `seo/`, `img/`. Sur la page GitHub "Add file → Upload files", tu peux glisser-déposer le dossier entier (hors `notes/`) et GitHub recrée l'arborescence automatiquement.
- [ ] **Vérifier l'affichage final** en navigation privée (Ctrl+F5) une fois uploadé.
- [ ] **Nouveau projet** de cours à ajouter (3ᵉ carte "Projet à venir") — me dire lequel quand tu es prêt.
- [ ] **App_Incendie** : à finir avant de l'ajouter au portfolio (section "Projets personnels").

## En attente / à valider avec moi
- [ ] **Badge TryHackMe dynamique** : pas d'API officielle disponible ; solution possible via une GitHub Action qui scrape ton profil toutes les heures. Mis de côté — dis-moi si tu veux qu'on s'y attelle.

## Fait ✅
- Portfolio en ligne sur GitHub Pages (`https://esteban-crln.github.io/`).
- Photo de profil intégrée (remplace le placeholder).
- CV lié aux deux boutons ("CV" et "Télécharger mon CV").
- Lien LinkedIn mis à jour vers ton vrai profil.
- Année du footer automatique.
- Meta description, Open Graph (avec ta photo), favicon (ECL), `theme-color` clair/sombre, URL canonique.
- `robots.txt` et `sitemap.xml` avec la vraie URL.
- Accessibilité clavier : lien d'évitement, cartes et modales navigables au Tab, gestion du focus.
- Chargement différé (`lazy`) des images des modales.
- Dossier réorganisé : `css/`, `js/`, `favicon/`, `cv/`, `seo/`, `img/` — seuls `index.html` et `robots.txt` restent à la racine.
