# Deep research — iteration 003 of 5

Continuing a research loop on improving the Pi extension `pi-cache-optimizer`
(`.pi/extensions/pi-cache-optimizer/index.ts`, ~9,400 lines, plus `tests/`).

## Findings already on the table (from earlier iterations)

  - 1. P0 — Separate “cache miss” from “cache signal unavailable”
  - 2. P0 — Gate stable-prefix lifting on cross-turn stability
  - 3. P0 — Make economics useful with explicit local pricing
  - 4. P1 — Add provider capability gates instead of treating adapters as cache guarantees
  - 5. P1 — Treat third-party `prompt_cache_key` support as an explicit capability
  - 6. P1 — Make router cache hints request-scoped
  - 7. P2 — Verify the retry guard’s event contract before tuning it further

Do not re-derive these. Build on them.

## This iteration's angle — minimal design for what survived

For every finding that iteration 2 CONFIRMED, design the smallest change that fixes it. Give the exact functions and call sites touched, the new behavior, and what stays unchanged. Reuse existing structures — the persisted stats record, the existing command surface, existing config — rather than adding parallel ones. For each design state explicitly what would have to be true for it to be wrong.

## Rules

- Cite `file:line` for every claim about current behavior. Uncited = hypothesis, label it.
- Prefer being wrong loudly over vague. If an earlier finding is mistaken, say which and why.
- Do not edit any file. Research only; your reply is the artifact.
- Do not propose a rewrite. Changes must fit the existing structure.
- Budget: at most 12 tool calls. One angle done well beats a survey.


---

## Verbatim output of iteration 002 — this is the input you build on

Verdict: P0 #1 and #2 survive. P0 #3 is too broad as a code finding; only its zero-rate edge case survives.

### 1. Separate cache miss from unavailable signal — CONFIRMED

`message_end` selects an adapter and normalizes every non-error assistant response ([index.ts:9429](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9429), [index.ts:9443](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9443)).

With `usage.input` present but no cache fields, `getPiNormalizedUsage` returns `{ cacheRead: 0, cacheWrite: 0 }` rather than `undefined` ([index.ts:2482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2482), [index.ts:2487](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2487), [index.ts:2495](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2495)). The OpenAI, Anthropic, and Gemini raw readers make the same assumption ([index.ts:2541](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2541), [index.ts:2567](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2567), [index.ts:2610](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2610)); DeepSeek instead returns `undefined` when its hit field is absent ([index.ts:2509](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2509)).

The cumulative path increments `totalRequests` for that zero-cache snapshot and only increments hits when `cacheRead > 0` ([index.ts:4188](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4188)). The missing-usage flag is attached only to recent samples ([index.ts:4278](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4278)); it does not remove the request from the hit-rate denominator shown in stats ([index.ts:4346](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4346)).

The official-provider comments define omission as a full miss, but the README explicitly supports upstream integrations whose usage “does not expose cache fields” ([index.ts:2542](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:2542), [README.md:368](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/README.md:368)). Therefore the conflation is reachable for custom/proxy/router responses.

### 2. Gate stable-prefix lifting on cross-turn stability — CONFIRMED

Candidate collection accepts `customPrompt`, `appendSystemPrompt`, tool snippets, and prompt guidelines without a stability check ([index.ts:694](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:694), [index.ts:705](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:705)). Context-file paths are filtered, but their contents are not compared across turns ([index.ts:710](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:710)).

`optimizeSystemPrompt` checks only whether a candidate occurs exactly once in the current prompt ([index.ts:857](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:857), [index.ts:875](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:875)). It then lifts it immediately ([index.ts:880](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:880)); there is no prior-turn comparison.

The per-model map records prefix churn after the rewrite but is explicitly report-only ([index.ts:8484](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:8484), [index.ts:9141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9141), [index.ts:9151](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9151)). The hook runs by default for non-Responses APIs ([index.ts:183](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:183), [index.ts:9062](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9062), [index.ts:9101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:9101)).

Existing tests demonstrate the behavior: a unique guideline is lifted ([review-findings.test.ts:44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:44)), and the lifecycle test changes that guideline between turns ([cache-economics.test.ts:231](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:231), [cache-economics.test.ts:255](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:255)).

### 3. Make economics useful with explicit local pricing — REFUTED as a broad code defect

The extension already supports explicit local pricing. It reads the active model’s `cost` block ([index.ts:4123](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4123)) and falls back through the model registry ([index.ts:4144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4144), [index.ts:4151](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4151)). A test covers registry fallback ([cache-economics.test.ts:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:60)).

Missing prices intentionally produce `unpriced`, while requests still count normally ([index.ts:4193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4193), [index.ts:4386](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4386)). The pricing source is external `models.json`, not bundled into the extension ([index.ts:5633](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:5633), [README.md:326](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/README.md:326)).

Residual confirmed defect: an explicitly free cached-read rate (`cacheRead: 0`) is rejected as unpriced ([index.ts:4128](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/index.ts:4128), [cache-economics.test.ts:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-cache-optimizer/tests/cache-economics.test.ts:54)). Keep that narrower issue; strike the broader “no explicit local pricing path” P0.

No files were changed.
