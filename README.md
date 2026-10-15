# Honor Perks app prototype

A deployable static mobile web app with Home, Nearby Map, and Profile tabs.

## Run locally

```sh
npm start
```

Open http://localhost:4173.

## Test

```sh
npm test
```

## Update locations

All editable location data is in `locations.js`. Add a new object inside the `places` array:

```js
{
  id: 'unique-lowercase-id',
  name: 'Business Name',
  initials: 'BN',
  category: 'Dining',
  discount: '10% OFF',
  address: '123 Main St, City, MN',
  lat: 44.0000,
  lng: -93.0000,
  accent: '#8a2b2b',
  description: 'Who qualifies, exclusions, and whether the offer is standing or seasonal.',
  sourceUrl: 'https://business.example/military-offer-terms',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Business+Name+123+Main+St'
}
```

Rules:

1. Give every entry a unique `id`.
2. Verify the exact address and latitude/longitude before publishing.
3. Link `sourceUrl` to current offer terms or direct merchant confirmation.
4. Use `SEASONAL` or `ASK STORE` instead of an unsupported percentage.
5. Use one of the current filter categories (`Dining`, `Retail`, `Auto`, `Health`) or add a matching filter button in `index.html`.
6. Run `npm test`, then commit and push. GitHub Actions redeploys automatically.

You can edit `locations.js` directly on GitHub: open the file, click the pencil icon, make the change, and choose **Commit changes**. For safer updates, create a new branch and pull request rather than committing directly to `main`.

## Deploy with GitHub Pages

The included `.github/workflows/pages.yml` tests the app and deploys only when tests pass.

1. Create a GitHub repository and push this folder to its `main` branch.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions** and confirm “Test and deploy GitHub Pages” finishes successfully.
5. In **Settings → Pages**, enable **Enforce HTTPS**.

For a custom domain, verify the domain in GitHub account settings before adding DNS records, configure it in **Settings → Pages**, then enable **Enforce HTTPS** after the certificate is issued.

## Security boundaries

- GitHub Pages is public static hosting. Never put API secrets, private keys, Plaid secrets, ID.me client secrets, or private customer records in this repository or browser JavaScript.
- ID.me and Plaid integrations require a separate HTTPS backend or serverless API. The backend keeps provider secrets and exchanges short-lived tokens; Pages should receive only safe public configuration.
- Protect `main`, require pull requests and passing status checks, enable Dependabot/security alerts, and use least-privilege GitHub Actions permissions.
- This prototype loads pinned Leaflet resources from unpkg, OpenStreetMap tiles, and Google Fonts. Those services receive ordinary network metadata.

## Important product notes

- Place data is a curated prototype dataset. Each offer exposes its source terms and should be checked before publication.
- ID.me and Plaid are planned integrations only. No identity documents, accounts, or payment information are collected by this prototype.
- Replace the sample member profile and local deals with authenticated API data before production use.
