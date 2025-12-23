# Product Requirements Document (PRD) - DopaQuest

## 1. Executive Summary
**DopaQuest** est une application mobile de "Gamified Access Control" conçue pour transformer la relation de l'utilisateur avec son temps d'écran.
*   **Problème :** L'addiction aux boucles de dopamine courte (TikTok, Reels, Shorts) et l'inefficacité des bloqueurs traditionnels qui créent de la frustration.
*   **Solution :** Remplacer la dopamine "gratuite" par une dopamine "méritée". L'accès aux applications addictives se paie avec du temps gagné par l'effort (tâches réelles, activité physique).
*   **Vision :** Un coach bienveillant qui redonne le contrôle à l'utilisateur sans le priver totalement, en valorisant l'effort immédiat.

## 2. Utilisateur Cible (Persona)
*   **Profil :** Conscient de son addiction au "doom-scrolling" mais incapable de s'arrêter par simple volonté.
*   **Frustrations :** A essayé de supprimer les apps (les réinstalle), a essayé les bloqueurs stricts (les désactive).
*   **Besoin :** Un système de sevrage progressif. Il a besoin de voir une corrélation tangible : "J'ai marché 10 minutes = J'ai gagné 5 minutes de TikTok".

## 3. Core Mechanics (La "Dopa-Loop")
Le cœur de DopaQuest repose sur une économie interne simple :
1.  **EFFORT (Input) :** L'utilisateur valide une tâche ou marche.
2.  **RÉCOMPENSE (Process) :** Le "Time Wallet" est crédité de minutes selon la difficulté de l'effort et le paramétrage global.
3.  **DÉPENSE (Output) :** L'utilisateur lance une session "Plaisir" via DopaQuest pour consommer son temps crédité.

## 4. Fonctionnalités MVP (Non-Négociables)

### 4.1. Le "Time Wrapper" (Kill Switch)
Le mécanisme central de consommation.
*   **Description :** Une WebView sécurisée permettant de naviguer sur les sites cibles (TikTok.com, Instagram.com).
*   **Comportement :**
    *   Au lancement : Demande confirmation du temps à dépenser (ou utilise tout le wallet).
    *   Pendant la session : Un *Floating Timer* (overlay) affiche le temps restant décrémenté en temps réel.
    *   Fin de session : À 00:00, l'écran est bloqué (overlay opaque) ou l'utilisateur est redirigé vers l'accueil de DopaQuest.
*   **État Background :** Le timer doit se mettre en pause si l'application passe en arrière-plan (l'utilisateur quitte DopaQuest).

### 4.2. Moteur de Tâches & Podomètre
Les sources de revenus du Wallet.
*   **Tâches Manuelles :**
    *   Création (Nom, Difficulté).
    *   Récurrence basique (Jours de la semaine).
    *   Validation par "Check" -> Crédit immédiat.
*   **Podomètre (Auto-Reward) :**
    *   Intégration capteur natif (via Expo Pedometer).
    *   Paliers de récompense automatiques (ex: tous les 1000 pas).
    *   *Note :* La synchronisation doit être fiable même si l'app n'est pas ouverte constamment.

### 4.3. La Matrice de Difficulté (Règles Métier)
L'algorithme détermine le temps crédité ($T$) selon la formule :
$$T = \text{BaseValue}(\text{TaskDiff}) \times \text{Multiplier}(\text{GlobalDiff})$$

**A. Valeurs de Base (Task Difficulty)**
* Facile : **15 minutes**
* Moyen : **30 minutes**
* Difficile : **60 minutes**

**B. Multiplicateurs (Global Difficulty)**
* Facile (Mode Cool) : **x 1.0** (100%)
* Moyen (Mode Équilibré) : **x 0.5** (50%)
* Difficile (Mode Hardcore) : **x 0.25** (25%)

*Exemple :* Une tâche "Difficile" (60m) en mode global "Moyen" (x0.5) rapporte **30 minutes**.

**C. Contrainte de modification**
* Le changement du `Global Difficulty` est bloqué par un timestamp.
* Condition : `Date.now() > lastDifficultyChangeDate + (7 * 24 * 60 * 60 * 1000)`

### 4.4. Allocation Quotidienne (Universal Basic Income)
Chaque jour à une heure définie (ex: 06:00), l'utilisateur reçoit un crédit de temps "gratuit" pour les besoins de base (messages, check rapide).
*   **Objectif :** Éviter la frustration bloquante au réveil.
*   **Montant :** Inversement proportionnel à la Difficulté Globale (ex: Facile = 20min, Moyen = 10min, Difficile = 5min).

## 5. Architecture Technique
*   **Plateforme :** Mobile (iOS First target, Android compatible).
*   **Framework :** React Native (Expo Managed Workflow).
*   **Data Layer (Local-First) :**
    *   Stockage local persistant (MMKV ou AsyncStorage).
    *   Pas de Backend pour le MVP.
    *   Persistance du Wallet (Report des minutes non utilisées au lendemain).
*   **Développement :** Environnement Windows/Linux (compatible Expo Go / Prebuild).

## 6. Identité Visuelle & UX
*   **Style :** Clean Productivity. Minimaliste, aéré.
*   **Palette :** Couleurs apaisantes mais énergiques pour les validations (Vert "Succès", Bleu "Sérénité").
*   **Composants Clés :**
    *   Jauges de progression circulaires ou linéaires (Wallet, Pas).
    *   Cards pour les tâches avec feedback visuel fort au swipe/check.
*   **Tone of Voice :** Encouragement, clarté. "Tu as gagné 15 minutes" plutôt que "Tu as perdu 15 minutes".

## 7. Roadmap Future (Post-MVP)
*   Mode "Blacklist" (blocage niveau système avec Screen Time API - plus complexe).
*   Social (Défis entre amis).
*   Shop (Dépenser le temps pour débloquer des cosmétiques d'app, pas juste du temps d'écran).
