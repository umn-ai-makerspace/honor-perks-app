# Honor Perks — Expo app

Cross-platform Expo/React Native prototype for discovering carefully sourced military offers. It includes Home, Nearby, Saved, Profile/privacy, and offer-detail flows. The six original Twin Cities offers and cautious merchant language are preserved in `src/data/offers.ts`.

## Product and privacy boundaries

- All profile/member content is **sample demo data**. Offers are a curated prototype dataset, not a guarantee.
- Every offer displays an explicit status and links to source terms and directions. Confirm eligibility, dates, exclusions, and store participation before purchase.
- ID.me military verification and Plaid card linking are **planned only**. This app does not integrate with either provider and collects no identity documents, bank credentials, card numbers, or payment data.
- Saved offer IDs persist locally with AsyncStorage. Location is requested only after **Locate me** is pressed and is used in memory to recompute distances and nearest-first sorting.
- The native iOS/Android build uses `react-native-maps`; web intentionally uses a dependency-free marker fallback.

## Local development and validation

Requires Node 20.19.4 or newer (Node 24 is supported).

```sh
npm install
npm start
npm test
npm run typecheck
npm run doctor
npm run export:web
```

`npm run export:web` writes the static validation build to `dist/`. No secrets belong in this repository or Expo public configuration.

## Updating offers

Edit `src/data/offers.ts`. Keep IDs unique, coordinates numeric, status one of `confirmed`, `seasonal`, or `unconfirmed`, and both URLs HTTPS. Preserve cautious terms. Add/update tests when behavior changes.

## EAS and TestFlight

Prerequisites: an Expo account, Apple Developer Program membership, and access to App Store Connect for bundle ID `com.honorperks.app`.

1. Install/login without storing credentials in the repository: `npx eas-cli login`.
2. Link or create the EAS project: `npx eas-cli init`. EAS may add `extra.eas.projectId` to `app.json`; review it before committing.
3. Register Apple credentials interactively: `npx eas-cli credentials --platform ios`. Prefer EAS-managed credentials; never commit `.p8`, certificates, provisioning profiles, or passwords.
4. Produce a device/internal build if needed: `npx eas-cli build --platform ios --profile preview`.
5. Produce the App Store build: `npx eas-cli build --platform ios --profile production`.
6. Submit the selected build: `npx eas-cli submit --platform ios --profile production`.
7. In App Store Connect, complete privacy nutrition labels accurately, screenshots, support/privacy URLs, age rating, review notes, export compliance, and the location-purpose explanation. Keep the app labeled as a prototype until real account/verification services exist.
8. Add the build to a TestFlight internal group, test location denied/granted flows, map markers, external links, saving after relaunch, and all demo disclosures before inviting external testers.

EAS signing/submission is intentionally not run by CI. CI only tests, type-checks, diagnoses Expo dependencies, and exports web without signing.
