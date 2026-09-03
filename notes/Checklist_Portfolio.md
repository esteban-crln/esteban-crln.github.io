# Checklist — Portfolio Esteban Cornier Lecan

Audit du 19/08/2026, basé sur `index.html`, `style.css`, `script.js` du dossier `Projects/Portfolio`.

Le site est déjà très solide : design cohérent (thème clair/sombre), 7 sections, système de fenêtres/modales fait maison avec drag/minimize/maximize, contenu réel et détaillé sur 2 projets (SAE201, R&Talk), responsive jusqu'à 480px. Voici ce qu'il reste à traiter, du plus important au plus accessoire.

## 1. Contenu à compléter (déjà identifié, laissé de côté pour l'instant)
- Bouton "Télécharger mon CV" pointe vers `#` — pas de PDF lié.
- Liens LinkedIn (`linkedin.com`) et TryHackMe (`tryhackme.com`) sont des URLs génériques, pas tes profils réels.
- 3ᵉ carte "Projet à venir" vide dans la section Portfolio.
- Photo de profil : encore un placeholder (icône), pas de vraie photo.
- Bloc "Projets personnels" ne contient qu'un seul projet (Diagnostic Réseaux), alors que le dossier de travail montre au moins App_Incendie, NetDiagPro et NetRecon comme projets exploitables.

## 2. Bugs / points techniques
- Année du footer figée en dur : `© 2025 · BUT R&T · SPIE ICS` — à mettre à jour (nous sommes en 2026) ou à rendre dynamique en JS.
- Email de contact affiché : `e.cornierlecan@gmail.com`. À vérifier que c'est bien l'adresse à jour et pas une variante (ex. `estebancornierlecan@gmail.com`).
- Le drag des fenêtres modales ne fonctionne qu'à la souris (`mousedown`/`mousemove`/`mouseup`) — pas de support tactile. Sans gravité (les modales s'ouvrent déjà centrées), mais à noter si tu veux un jour permettre de les déplacer au doigt sur mobile/tablette.
- Statistiques TryHackMe codées en dur ("Top 8%", "42+ rooms") à plusieurs endroits (section À propos, section Compétences, section Contact) — penser à les mettre à jour manuellement à chaque progression, ou centraliser la valeur dans le JS pour n'avoir qu'un seul endroit à changer.

## 3. SEO & métadonnées (absents actuellement)
- Pas de `<meta name="description">` — impacte l'affichage dans les résultats Google.
- Pas de balises Open Graph (`og:title`, `og:description`, `og:image`) — impacte l'aperçu quand le lien est partagé sur LinkedIn/réseaux.
- Pas de favicon ni d'`apple-touch-icon`.
- Pas de `<meta name="theme-color">` (utile sur mobile pour la couleur de la barre de statut).

## 4. Accessibilité
- Les fenêtres modales n'ont pas d'attributs `role="dialog"` / `aria-modal="true"`, et il n'y a pas de piège de focus (focus trap) ni de renvoi du focus à l'élément déclencheur à la fermeture — un utilisateur au clavier ou avec lecteur d'écran peut se retrouver perdu.
- Pas de lien "aller au contenu" (skip link) pour le clavier.
- Les boutons de la navbar (`theme-toggle`, `hamburger`) ont bien des `aria-label` — c'est un bon point, à généraliser aux boutons des modales (fermer/réduire/agrandir n'ont pas de libellé accessible, seulement des points colorés).

## 5. Performance
- Polices Google Fonts et Font Awesome chargées via CDN externe : correct techniquement, mais dépendance réseau externe (à surveiller si tu veux un site 100% autonome / RGPD-friendly).
- Pas de lazy-loading explicite (`loading="lazy"`) sur les images des modales (schéma SAE201, captures R&Talk) — gain mineur mais gratuit à ajouter.

## 6. Nice-to-have
- Pas de `robots.txt` / `sitemap.xml` (utile seulement si le site est indexé publiquement).
- Pas de version imprimable (print stylesheet) — utile si quelqu'un veut imprimer ton CV/profil.

---

**Prochaine étape suggérée :** dis-moi lesquels de ces points tu veux que je traite (je recommande de commencer par le footer 2025→2026 et les meta SEO/Open Graph, qui sont rapides et sans risque), et je m'en occupe.
