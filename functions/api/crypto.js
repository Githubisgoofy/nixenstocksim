const COINS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'dogecoin', 'cardano', 'polkadot'];

export async function onRequestGet({ request, env }) {
    const cache = caches.default;
    const cacheKey = new Request(new URL('/api/crypto', request.url).toString());
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
    if (!env.COINGECKO_API_KEY) {
        return Response.json({ error: 'Crypto feed is not configured.' }, { status: 503 });
    }
    const pro = env.COINGECKO_API_PLAN === 'pro';
    const url = new URL(`https://${pro ? 'pro-api' : 'api'}.coingecko.com/api/v3/simple/price`);
    url.search = new URLSearchParams({ ids: COINS.join(','), vs_currencies: 'usd', include_last_updated_at: 'true' });
    try {
        const upstream = await fetch(url, {
            headers: { [pro ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key']: env.COINGECKO_API_KEY },
            signal: AbortSignal.timeout(10000)
        });
        if (!upstream.ok) return Response.json({ error: 'Crypto provider unavailable.' }, { status: 503 });
        const data = await upstream.json();
        const quotes = {};
        for (const coin of COINS) {
            const quote = data[coin];
            if (!quote || !Number.isFinite(quote.usd) || quote.usd <= 0 || !Number.isFinite(quote.last_updated_at) || Date.now() - quote.last_updated_at * 1000 > 600000 || quote.last_updated_at * 1000 > Date.now() + 60000) {
                return Response.json({ error: 'Fresh crypto quotes unavailable.' }, { status: 503 });
            }
            quotes[coin] = { usd: quote.usd, last_updated_at: quote.last_updated_at };
        }
        const response = Response.json(quotes, { headers: { 'Cache-Control': 'public, max-age=300' } });
        await cache.put(cacheKey, response.clone());
        return response;
    } catch {
        return Response.json({ error: 'Crypto provider unavailable.' }, { status: 503 });
    }
}
