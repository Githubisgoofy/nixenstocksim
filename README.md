## CoinGecko crypto feed

BTC, ETH, SOL, XRP, DOGE, ADA and DOT use USD quotes from CoinGecko through `/api/crypto`. Stocks continue to use the simulator. Quotes refresh every five minutes and the Cloudflare edge caches responses for five minutes. Crypto trading pauses until quotes arrive and whenever they are more than ten minutes old; the last prices remain visible during outages.

### Cloudflare Pages setup

1. Deploy this repository with its `functions/` directory using Cloudflare Pages Git integration (no build command; output directory `.`). A static-only file upload will not install the function.
2. In the Pages project's Settings → Variables and Secrets, add an encrypted secret named `COINGECKO_API_KEY` containing your key. Set it for Production and, if needed, Preview. Never put it in HTML or GitHub.
3. The default API plan is Demo. For a paid Pro key, set `COINGECKO_API_PLAN` to `pro`.
4. Redeploy after setting the secret. Open `/api/crypto` to verify it returns prices, then check the market's feed status.

For local development, copy `.dev.vars.example` to `.dev.vars`, fill in the key, and run `npx wrangler pages dev .`. Run checks with `node tests/crypto.test.mjs`. Opening the HTML directly does not provide the API endpoint.

Provider references: [authentication](https://docs.coingecko.com/demo/reference/authentication) and [simple prices](https://docs.coingecko.com/demo/reference/simple-price). Cache usage is per Cloudflare location; monitor your CoinGecko quota as traffic grows.

---

🚀 Nixen Stock Sim v9
The Market Engine by Lowen LLC.
Launch Dashboard

• Overview
A high-fidelity market simulator engineered for speed and precision. Track assets, manage capital, and monitor your equity curve in a sleek, professional environment.

• Core Systems
Live Exchange – Real-time volatility across Tech, Crypto, and Retail.

Lowen Analytics – Visual equity tracking via Chart.js.

Trade Ledger – Automated transaction logging and history.

Auto-Save – Persistent portfolio state via the Lowen-v9 protocol.

• Technical Stack
Logic: Vanilla JS (ES6+)

Visuals: Chart.js / CSS3

Deployment: Cloudflare Pages

© 2026 WinterAG / Lowen LLC.
Enterprise Edition.
