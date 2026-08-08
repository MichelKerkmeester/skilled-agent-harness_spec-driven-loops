# DeepPi Scripts

---

## 1. OVERVIEW

Opt-in developer scripts for the DeepPi extension. The live benchmark calls the real DeepSeek API to measure cache hit and miss tokens across multiple rounds; it is skipped by default and must be explicitly enabled with an environment variable.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `live-benchmark.mjs` | Opt-in live benchmark that sends minimal chat-completion requests to the DeepSeek API and records per-round HTTP status, elapsed milliseconds, `cacheHitTokens`, and `cacheMissTokens`. Reads `DEEPSEEK_API_KEY` (required when live), `DEEPPI_MODEL` (default `deepseek-v4-pro`), `DEEPPI_BASE_URL` (default `https://api.deepseek.com`), and `DEEPPI_LIVE_ROUNDS` (integer 1-10, default 3). Skipped unless `DEEPPI_LIVE=1`. Prints a JSON results object to stdout. |

---

## 3. ENTRYPOINTS

```bash
DEEPPI_LIVE=1 DEEPSEEK_API_KEY=sk-... node scripts/live-benchmark.mjs
```

Without `DEEPPI_LIVE=1`, the script prints a skip message and exits without making any network calls.

---

## 4. RELATED

- [deep-pi README](../README.md)
- [Changes from Upstream](../CHANGES-FROM-UPSTREAM.md)
