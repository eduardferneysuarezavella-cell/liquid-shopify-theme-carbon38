# Carbon38 Shopify theme

Shopify Online Store 2.0 theme for **Carbon38**, built on **Shopify Dawn v15.0.2** with store-specific sections, snippets, and theme settings.

## Requirements

- A Shopify store with theme access
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli) for local development and deployment (recommended)

This repository is plain Liquid, CSS, and JavaScript. There is no Node build step or `package.json`.

## Repository layout

| Path | Purpose |
|------|---------|
| `config/` | `settings_schema.json`, `settings_data.json`, and JSON templates for sections |
| `layout/` | Root layouts (e.g. `theme.liquid`) |
| `sections/` | Modular page sections (homepage, PDP, cart, collection, etc.) |
| `snippets/` | Reusable Liquid partials |
| `templates/` | JSON and Liquid templates mapping sections to page types |
| `assets/` | Stylesheets, scripts, and static assets |
| `locales/` | Translation strings |

## Theme customization (high level)

Beyond standard Dawn options, **Theme settings** (`config/settings_schema.json`) include groups such as:

- **Gift with purchase (GWP)** — optional gift product, thresholds, tags, and related products
- **Gift & gift wrap** — gift wrap product and messaging
- **SKU limiter** — cart and PDP copy when per-SKU limits apply
- **Final sale** — discount threshold and labels for final-sale messaging
- **Analytics** — Google Tag Manager container ID
- **Animation** — page transitions, buttons, image zoom, staggered reveals
- **GW Customer Accounts** — customer account–related theme options

Notable **sections** include bundle PDP support (`bundle-product.liquid`), cart drawer and notifications, Yotpo FAQ/UGC blocks, predictive search variants, international announcement bar, and GammaWaves customer account helpers (`gw-customer-accounts*.liquid`).

## Local development

1. Install [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install).
2. From this directory, connect and pull or push as needed:

   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```

   Or use `shopify theme push` / `shopify theme pull` for deployment and sync.

CLI connection data is ignored by git (see `.gitignore`).

## Ignored files

- `.shopify/` — local Shopify CLI configuration; do not commit store-specific CLI state.

## Further reading

- [Shopify theme architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- [Dawn reference theme](https://github.com/Shopify/dawn) (upstream baseline)

## License / upstream

Core structure and many patterns come from **Dawn** (Shopify). Customizations are specific to this storefront; confirm licensing with your team for third-party assets and apps embedded in the theme.
