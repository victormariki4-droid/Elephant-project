# 🐘 Human-Elephant Conflict (HEC) Tracking Platform

A full-stack platform for monitoring and managing human-elephant conflict incidents in Tanzania. Built with modern web and mobile technologies, connected to Firebase.

## Architecture

```
├── web-dashboard/    → React + TypeScript + Vite + Tailwind CSS
├── mobile-app/       → React Native + Expo + NativeWind
├── functions/        → Firebase Cloud Functions + Beem Africa SMS
└── shared/           → TypeScript types & Firebase configuration
```

## Firebase Project

- **Project ID:** `elephant-392b0`
- **Firestore Collections:** `alerts`, `users`, `analytics`
- **Auth:** Phone Number (mobile) + Email/Password (web)

## Getting Started

### Web Dashboard
```bash
cd web-dashboard
npm install
npm run dev
```

### Mobile App
```bash
cd mobile-app
npm install
npx expo start
```

### Cloud Functions
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

## Environment Variables

Create `.env` files in each sub-project:

### web-dashboard/.env
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MAPBOX_TOKEN=your_mapbox_token (optional)
```

### mobile-app/.env
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Key Features

- **Real-time Alert Dashboard** — Live Firestore stream of active HEC incidents
- **Field Reporting App** — One-tap incident reporting with GPS and voice recording
- **SMS Fallback** — Automated Beem Africa SMS alerts for offline ranger notification
- **Ranger Mode** — Accept & resolve missions with mitigation tracking
- **Analytics** — Monthly trend charts, mitigation success rates, response time KPIs

## Version History

### v1.1.2 (Current Release)
- **Segmented Priority Selector:** Replaced standard immediate danger toggle with side-by-side priority buttons (`🟢 Normal / Kawaida` and `🚨 Danger / Dharura`) with contextual bilingual details.
- **Operations Center Side-Panel:** Web dashboard details drawer showing GPS maps, victim metadata (names, ages, genders), crop types, and direct Firestore operational state changes (`active` → `responding` → `resolved`).
- **Historical Log Export:** Searchable archive for resolved events with CSV export capabilities.
- **Smart SMS Trigger Rules:** Automated SMS triggers in Cloud Functions whenever `isImmediateDanger` is checked, or when the alert type is `human_injury`, `human_death`, `crop_damage`, or `livestock_killing`.
- **Firebase JS SDK RN Compatibility Fix:** Replaced browser-specific `persistentMultipleTabManager` in mobile Firestore init with native-compatible `getFirestore(app)` to prevent white-screen crashes.
