---
title: "Implementation Summary: Ox Alpha via OpenRouter for cli-pi & cli-opencode"
description: "Registered openrouter/stealth/ox-alpha in the cli-pi roster and both CLI docs, removed the earlier opencode-go/ox-alpha-free route, and relaxed the cli-pi OpenRouter=Flash-only policy to Flash+Ox-Alpha. Zen has no ox model. Guard tests green; both CLIs live-verified."
trigger_phrases:
  - "implementation summary"
  - "ox-alpha roster"
  - "openrouter stealth ox-alpha"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Swapped opencode-go ox route for openrouter/stealth/ox-alpha; both CLIs live-verified"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Ox Alpha via OpenRouter for cli-pi & cli-opencode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 052-opencode-go-ox-alpha-free-roster |
| **Completed** | 2026-08-22 |
| **Level** | 2 |
| **Status** | Complete |

> Slug kept from the packet's original framing; the delivered route is OpenRouter, not opencode-go.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both CLIs can now select **Ox Alpha** via **OpenRouter** (`openrouter/stealth/ox-alpha`). The route first shipped through the OpenCode Go gateway (`opencode-go/ox-alpha-free`); per operator decision that route was **removed** and replaced with the OpenRouter one. The OpenCode **zen** provider (`opencode`) offers no ox model, so it carries nothing.

### Roster enforcement (two synced points)
`stealth/ox-alpha` was added to `PI_SUPPORTED_MODELS` (`executor-config.ts`) and its `fanout-run.cjs` mirror `PI_ALLOWED_MODELS`, and mapped to `openrouter` in `PI_MODEL_PROVIDERS`. The literal keeps its upstream path so `${provider}/${model}` composes the three-segment `openrouter/stealth/ox-alpha`. The earlier `ox-alpha-free`/opencode-go entries were removed.

### Policy relaxation
The cli-pi "OpenRouter = DeepSeek Flash only" policy was widened to **Flash + Ox Alpha** (comments in both runtime files; blockquotes in both roster docs). No other model may route through OpenRouter.

### Docs
The opencode-go ox row was removed from both skills; an `openrouter/stealth/ox-alpha` row was added under each `### openrouter` section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS`: −`ox-alpha-free`, +`stealth/ox-alpha`; OpenRouter policy comment relaxed |
| `.../runtime/scripts/fanout-run.cjs` | Modified | Mirror + provider map: −opencode-go ox, +`stealth/ox-alpha → openrouter` |
| `.../cli-pi/references/providers-and-models.md` | Modified | Drop opencode-go ox row; add OpenRouter ox row; blockquote → Flash + Ox Alpha |
| `.../cli-opencode/references/providers-and-models.md` | Modified | Drop opencode-go ox row; add OpenRouter ox row; blockquote → Flash + Ox Alpha |
| `.../runtime/tests/unit/executor-config.vitest.ts` | Modified | Exact-roster assertion: −`ox-alpha-free`, +`stealth/ox-alpha` |
| `.../runtime/tests/unit/fanout-run.vitest.ts` | Modified | `providerByModel`: −opencode-go ox, +`stealth/ox-alpha → openrouter` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The opencode-go route was shipped first (commit `b83bff8de9` on v4). The operator then redirected: drop opencode-go, use the zen provider — but a live check proved zen has no ox model (`opencode/ox-alpha-free` and `opencode/ox-alpha` both returned `Model not found`), while `openrouter/stealth/ox-alpha` dispatched a real `PONG` on both opencode and pi. With that ground truth, the opencode-go entries were removed and the OpenRouter route added across the rosters, provider map, docs, and guard tests, and the cli-pi OpenRouter policy was relaxed to two models. The fanout builder probe confirms the constructed command is `pi -p --offline --model openrouter/stealth/ox-alpha`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route Ox Alpha via OpenRouter, not opencode-go | Operator decision; the opencode-go route was explicitly removed |
| Do not add anything for the zen provider | Live evidence proves the zen (`opencode`) provider has no ox model — adding one would be fabrication |
| Relax cli-pi OpenRouter allowlist to exactly two models | Ox Alpha needed OpenRouter routing on cli-pi, which the Flash-only policy forbade; kept the allowlist tight (Flash + Ox Alpha only) |
| Keep the folder slug unchanged | The packet is already committed on v4 under this slug; renaming across two branches is churn for a cosmetic identifier. Content states the real route |
| Update guard tests rather than weaken them | The tests pin the exact roster/provider; the roster legitimately changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Zen has no ox (ruled out) | `opencode run --model opencode/ox-alpha-free` / `opencode/ox-alpha` | PASS (ruled out) — both returned `Model not found` |
| OpenRouter ox exists | `opencode models \| grep ox` | PASS — `openrouter/stealth/ox-alpha` listed |
| Syntax | `node --check scripts/fanout-run.cjs` | PASS — exit 0 |
| Guard suite | `npx vitest run` (2 guard files) | PASS — 199 passed / 0 failed |
| No opencode-go ox residue | `grep -c ox-alpha-free` both runtime files | PASS — 0 / 0 |
| Roster present | `grep -c "stealth/ox-alpha"` both runtime files | PASS — executor-config 2, fanout-run 2 |
| Builder wiring | `node -e buildLineageCommand(cli-pi, stealth/ox-alpha)` | PASS — `pi -p --offline --model openrouter/stealth/ox-alpha probe` |
| cli-opencode live turn | `opencode run --model openrouter/stealth/ox-alpha "…"` | PASS — returned `PONG`, exit 0 |
| cli-pi live turn | `pi -p --offline --model openrouter/stealth/ox-alpha "…"` | PASS — returned `PONG` |
| `validate.sh --strict` | packet folder | PASS — recorded in this session (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenRouter allowlist is deliberately narrow** — cli-pi's OpenRouter route permits only DeepSeek V4 Flash and Ox Alpha; any further OpenRouter model needs another explicit roster change.
2. **Stealth channel** — `stealth/ox-alpha` is an OpenRouter "stealth" (pre-release/anonymous) tune; its upstream availability can change without notice. Re-confirm via `opencode models openrouter` if a dispatch starts failing.
3. **Manual mirror** — `executor-config.ts` and `fanout-run.cjs` are hand-synced by design; the guard tests keep them honest.
4. **Folder slug is historical** — the slug says `opencode-go-...` but the delivered route is OpenRouter (documented throughout).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Add ox via opencode-go | Removed opencode-go; routed via OpenRouter | Operator decision mid-task |
| "Keep normal opencode (zen)" | Zen carries nothing | Live evidence: the zen provider has no ox model |
| Add roster + docs | Also relaxed the OpenRouter=Flash-only policy | Required to allow Ox Alpha on the cli-pi OpenRouter route |
<!-- /ANCHOR:deviations -->
