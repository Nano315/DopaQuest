# Roadmap de Développement - DopaQuest

Basée sur le fichier `specs/PRD.md`.

## Vue d'ensemble
L'objectif est de délivrer le MVP (Minimum Viable Product) en suivant une progression logique : du cœur de données (Wallet) vers les fonctionnalités périphériques, pour finir par le navigateur sécurisé.

---

## Phase 1 : Fondations & Wallet
**État :** ✅ Completed

Cette phase concernait la mise en place de l'architecture technique et du système de stockage des crédits.

### Composants & Fichiers
*   `services/storage.ts` : Configuration MMKV pour la persistance des données.
*   `store/useWalletStore.ts` : Store Zustand pour gérer le solde de temps (crédit/débit).
*   `app/_layout.tsx` : Configuration de base Expo Router et Theme Provider.
*   `constants/Colors.ts` : Définition de la palette (Clean Productivity).

### Logique Implémentée
*   Initialisation du projet Expo (Managed Workflow).
*   Structure des dossiers (`app`, `components`, `services`, `store`).
*   Persistance du Wallet (le temps est sauvegardé entre les sessions).

---

## Phase 2 : Moteur de Tâches
**État :** 📅 To Do

Implémentation du système "Effort = Récompense" via la création et la validation de tâches manuelles.

### Composants à Créer
*   `types/Task.ts` : Définition TypeScript (ID, Titre, Difficulté, Récurrence, Check).
*   `store/useTaskStore.ts` : Store Zustand pour le CRUD des tâches.
*   `components/tasks/TaskItem.tsx` : Carte visuelle d'une tâche (Checkbox + Titre + Badge Difficulté).
*   `components/tasks/TaskList.tsx` : Liste défilante des tâches actives.
*   `components/tasks/AddTaskSheet.tsx` : Formulaire (Bottom Sheet ou Modal) pour créer une tâche.
*   `app/(tabs)/index.tsx` : Écran principal intégrant la liste et le résumé du Wallet.

### Logique Clé
*   **CRUD** : Ajouter, Lire, Supprimer une tâche.
*   **Validation** : Cocher une tâche déclenche `useWalletStore.addTime()`.
*   **Valeurs** : Associer les gains aux difficultés (Facile=15m, Moyen=30m, Difficile=60m - *valeurs brutes pour l'instant*).
*   **Reset** : Gestion basique de la récurrence (réinitialiser les status 'done' le lendemain).

---

## Phase 3 : Intégration Podomètre (Auto-Reward)
**État :** 📅 To Do

Ajout de la source de revenue passive via l'activité physique.

### Composants à Créer
*   `services/pedometer.ts` : Service wrapper autour de `expo-pedometer`.
*   `store/usePedometerStore.ts` : Gestion du nombre de pas quotidien et du "déjà récompensé".
*   `components/home/StepCounter.tsx` : Jauge ou indicateur visuel des pas du jour.

### Logique Clé
*   **Permissions** : Demander l'accès au capteur au démarrage.
*   **Tracking** : Lire le nombre de pas en temps réel.
*   **Récompense par Paliers** :
    *   Logique pour ne payer qu'une seule fois un palier atteint.
    *   Ex: Tous les 1000 pas = +X minutes.
*   **Synchronisation** : Vérifier la différence de pas au retour de background pour créditer les pas effectués hors de l'app.

---

## Phase 4 : Le Navigateur (WebView - Time Wrapper)
**État :** 📅 To Do

Le cœur de la consommation ("Dépense"). Création de l'environnement contrôlé pour TikTok/Instagram.

### Composants à Créer
*   `components/browser/WebOverlay.tsx` : Container pour la WebView et le Timer.
*   `components/browser/FloatingTimer.tsx` : Overlay affichant le temps restant (déplaçable ou fixe).
*   `app/browser/[url].tsx` : Page dynamique recevant l'URL cible (ex: tiktok.com).
*   `components/browser/SessionStartModal.tsx` : Confirmation avant de lancer ("Combien de temps veux-tu dépenser ?").

### Logique Clé
*   **Consommation** : Décrémenter le Wallet chaque seconde tant que la WebView est active.
*   **Kill Switch** :
    *   Si Timer = 00:00 -> Redirection immédiate vers `app/index.tsx` ou affichage d'un écran de blocage.
*   **Background Pause** : Utiliser `AppState` pour pauser le timer si l'utilisateur quitte DopaQuest (minimise l'app).
*   **Navigation** : Empêcher la navigation hors des domaines autorisés (si spécifié) ou gérer l'historique basique.

---

## Phase 5 : Polish & Règles Métier
**État :** 📅 To Do

Raffinement du modèle économique et UX pour rendre le système juste et engageant.

### Composants à Créer
*   `components/settings/DifficultySelector.tsx` : UI pour choisir le mode Global (Cool, Équilibré, Hardcore).
*   `services/timeCalculator.ts` : Utilitaire centralisant la formule $T = Base \times Multiplier$.
*   `components/onboarding/DailyBonus.tsx` : Notification ou Modal pour l'allocation quotidienne.

### Logique Clé
*   **Matrice de Difficulté** :
    *   Implémenter la formule mathématique du PRD 4.3.
    *   Appliquer le multiplicateur global aux tâches et aux pas.
*   **Verrouillage Difficulté** :
    *   Empêcher le changement de difficulté si `DernierChangement < 7 jours`.
*   **Allocation Quotidienne** :
    *   Script au lancement (Check `lastDailyBonusDate`) pour créditer le montant fixe (ex: 20min/10min/5min) à 06:00.
*   **UI Polish** : Feedback visuel (confettis, animations) lors du gain de temps.
