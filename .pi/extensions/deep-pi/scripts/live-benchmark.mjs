// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ SCRIPT: LIVE BENCHMARK                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Require an explicit opt-in because each live round can incur provider charges.
const LIVE_FLAG = '1';

// Keep benchmark defaults stable unless the operator overrides them explicitly.
const DEFAULT_MODEL = 'deepseek-v4-pro';
const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_ROUNDS = 3;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Bound live rounds to prevent accidental request bursts and unbounded charges.
function readRounds() {
  const value = Number.parseInt(
    process.env.DEEPPI_LIVE_ROUNDS ?? String(DEFAULT_ROUNDS),
    10,
  );
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    throw new Error('DEEPPI_LIVE_ROUNDS must be an integer from 1 through 10');
  }
  return value;
}

// Keep the system prompt identical across rounds so measurements test prefix reuse.
function requestBody(model, round) {
  return {
    model,
    messages: [
      {
        role: 'system',
        content: 'You are measuring a stable coding-agent request prefix. Reply with one word.',
      },
      {
        role: 'user',
        content: `Return the word ready for benchmark round ${round}.`,
      },
    ],
    max_tokens: 1,
    temperature: 0,
  };
}

// Accept both provider usage field names used by compatible API responses.
function usageValue(usage, names) {
  for (const name of names) {
    if (typeof usage?.[name] === 'number') return usage[name];
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// Run each live round once so retries cannot distort the cache-token measurement.
async function runLiveBenchmark() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY is required when DEEPPI_LIVE=1');

  const model = process.env.DEEPPI_MODEL ?? DEFAULT_MODEL;
  // Normalize the endpoint once so request construction never adds a double slash.
  const baseUrl = (process.env.DEEPPI_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');
  const rounds = readRounds();
  const results = [];

  for (let round = 1; round <= rounds; round++) {
    const startedAt = process.hrtime.bigint();
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody(model, round)),
    });
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    if (!response.ok) {
      throw new Error(`provider returned HTTP ${response.status} on round ${round}`);
    }
    const payload = await response.json();
    const usage = payload?.usage;
    results.push({
      round,
      status: response.status,
      elapsedMs: Number(elapsedMs.toFixed(1)),
      cacheHitTokens: usageValue(usage, [
        'prompt_cache_hit_tokens',
        'cache_read_input_tokens',
      ]),
      cacheMissTokens: usageValue(usage, [
        'prompt_cache_miss_tokens',
        'cache_creation_input_tokens',
      ]),
    });
  }

  console.log(JSON.stringify({ model, baseUrl, rounds, results }, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

// Keep the live path opt-in because running it can incur provider charges.
if (process.env.DEEPPI_LIVE !== LIVE_FLAG) {
  console.log('benchmark:live skipped; set DEEPPI_LIVE=1 to call the configured provider');
} else {
  try {
    await runLiveBenchmark();
  } catch (error) {
    // Preserve the CLI failure signal while keeping the provider error readable.
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
