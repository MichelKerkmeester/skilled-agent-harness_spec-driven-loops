---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/041-cli-pi-devpass-glm-route"
    last_updated_at: "2026-09-05T10:59:12Z"
    last_updated_by: "template-author"
    recent_action: "Re-pointed the GLM fan-out literal to DevPass and swept the docs"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-cli-pi-devpass-glm-route"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 041-cli-pi-devpass-glm-route |
| **Completed** | 2026-09-05 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two changes, in two different files, for one goal. The second was invisible until the first was done.

**The routing half.** One map value moved. `PI_MODEL_PROVIDERS` in `runtime/scripts/fanout-run.cjs` now maps the bare literal `glm-5.3-flash` to `llmgateway` instead of `opencode-go`, so the fan-out composes `llmgateway/glm-5.3-flash`, the two-segment selector DevPass requires.

Everything else in the diff is prose. Four places described the old mapping, and a stale description of a routing rule is worse than none, because a reader treats it as the contract: two comment blocks in the `.cjs`, the `PI_SUPPORTED_MODELS` note and the `isFlashMaxPinnedModel` doc block in the `.ts`, and three rows in the cli-pi roster reference.

What did **not** need changing is worth recording. The literal was already in both allowlists, so no allowlist moved. `isFlashMaxPinnedModel` already regex-matches `glm-5.3-flash` on any provider path, so the `max` pin came along for free, and it happens to land on a tier DevPass actually offers, which was not true of every route.

The trade accepted: GLM-5.3-Flash through opencode-go is now direct-dispatch only, exactly as the Cline route already was.

**The credential half.** With the mapping right, the fan-out still failed: it reached pi and returned `No API key found for llmgateway`, while the identical direct dispatch succeeded. `EXECUTOR_ENV_PREFIXES_BY_KIND` had no `cli-pi` entry, so the dispatch env filter stripped every provider credential. It now carries `LLMGATEWAY_` and `CLINE_`, which are the only two env-keyed providers `.pi/models.json` declares. Every other Pi provider authenticates from a file, which is why this went unnoticed until a route that needs an env var was wired into a fan-out.

The original comment said Pi's prefixes were unconfirmed and must not be passed through by analogy. That was right, and the fix honors it: the two prefixes are named by Pi's own config and confirmed by an observed failure, and the comment now records that standard for whoever adds the third.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Route first, code second. A direct `pi` dispatch proved the gateway answers before anything was edited, which meant a later failure could only be in the mapping, not in credentials. The consumer sweep came next, by grep over every `.json`, `.yaml`, `.cjs`, `.mjs` and `.ts` under `.opencode/`, because "nothing depends on this" is a claim that needs a search rather than a memory. Then the one-line edit, the comment sweep, and the test expectation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-point the existing literal rather than add a selector scheme | The builder composes `${provider}/${model}` in one place and three comments already treat one-literal-one-provider as the rule. A second scheme adds a branch to the hot path so a route nobody dispatches today could stay reachable |
| DevPass takes the fan-out slot, opencode-go becomes direct-only | DevPass is a flat-price subscription and the other two GLM routes bill per token. A three-iteration run at `max` on a 1.05M-context model is the spend a flat plan exists for |
| Leave the two hand-synced allowlists alone | Neither needed an edit. Merging them is a real improvement and a different change, and doing it here would hide a one-line routing fix inside a refactor |
| Clear the three-week-old `deep-pi-stats.json.lock` | Every `pi` dispatch was timing out on it and reporting an extension error. Zero bytes, no holder, gitignored, dated 2026-08-15. Removing it took the round trip to 19s clean |
| Allowlist two credential prefixes, not a wildcard | The env filter is defense in depth. Widening it to `PI_` or to everything would trade a real safety property for convenience. Two named prefixes, both required by Pi's own config, keep the property |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live route, before any code change | `pi -p --offline --model llmgateway/glm-5.3-flash --thinking max` returned `DEVPASS-GLM-OK` |
| Composition, changed route | `buildLineageCommand` emits `--model llmgateway/glm-5.3-flash --thinking max` |
| Composition, unchanged neighbours | `openrouter/z-ai/glm-5.3-flash` and `opencode-go/deepseek-v4-flash-vision-exp`, both still correct, both at `--thinking max` |
| `executor-config.vitest.ts` | 92 passed |
| `fanout-run.vitest.ts -t 'cli-pi adapter'` | 10 passed |
| Functional diff size | Exactly one non-comment line |
| Stale-mapping grep over the runtime | No hits outside unrelated `glm-5.1` fixtures |
| `npm run typecheck` | 53 errors, all in `lib/legacy-projections/**` and `lib/mode-append-gateway/**`, zero in either changed file. The one functional line lives in a `.cjs`, which is not typechecked |
| Credential gap, before the fix | A real fan-out dispatch returned `No API key found for llmgateway`; the direct dispatch with the same var set returned the model's answer. That contrast is what isolated the env filter |
| Route after both fixes | The dispatch composes and launches `pi --model llmgateway/glm-5.3-flash --thinking max` and writes intent and completion receipts |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations and Follow-ups

**An end-to-end iteration is not yet proven on this route.** The first attempt after both fixes exhausted a 900s executor timeout at `--thinking max` and was re-dispatched on a 3600s budget. Until one completes, the honest claim is that the route authenticates and launches, not that a full iteration succeeds on it.

**Composition is not proof for an executor change.** The unit test, the in-process composition check and the direct smoke test were all green while the fan-out route was still unauthenticated, because none of them exercises `buildExecutorDispatchEnv`. Only a real dispatch found it. That is the transferable lesson from this packet.

The whole runtime suite was not run. The targeted suites cover the changed surface, but a full run is the only thing that would establish no distant regression, and it is left open in `tasks.md` as T014.

`combo-matrix.vitest.ts` fails on a touched file and is **not** caused by this change: it expects `opencode-go/deepseek-v4-flash` and receives `opencode-go/deepseek-v4-flash-vision-exp`, which is commit `5aae5f0bc8` making Vision the catalogued default. It belongs to whoever made that change.

`PI_SUPPORTED_MODELS` in the `.ts` and `PI_ALLOWED_MODELS` in the `.cjs` remain two hand-synced copies of one list. A literal added to one and missed in the other fails closed at dispatch with a message that names the allowlist rather than the drift.

GLM-5.3-Flash through opencode-go is reachable only by direct dispatch now. That is the deliberate trade, and the roster reference says so on the row itself.
<!-- /ANCHOR:limitations -->

---


