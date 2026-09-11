---
title: "Implementation Plan: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model"
description: "Replace the name-based DeepSeek protocol inference with an explicit thinkingFormat opt-in, stop manufacturing the wire-format flag in advice and auto-fix, and declare the llmgateway channel's affinity compat and image modality from a live-verified request."
trigger_phrases:
  - "implementation plan"
  - "deepseek opt-in gate"
  - "declared capability over heuristic"
  - "testing strategy"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension, loaded as source; Node 22 `node --test` + `jiti` for tests) |
| **Framework** | `@earendil-works/pi-coding-agent` extension API |
| **Storage** | JSONC config (`~/.pi/agent/models.json` -> `Code_Environment/Public/.pi/models.json`) |
| **Testing** | `node --test` via `npm test`, `tsc --noEmit` via `npm run typecheck` |

### Overview
Two changes, one theme: stop inferring a channel's capabilities from a model's name and start requiring either a deliberate operator declaration or a verified live fact. The extension gains a single applicability predicate — the effective compat must name the DeepSeek wire format — that every DeepSeek-specific check, suggestion and advice line routes through, so the flag can never be manufactured on the operator's behalf. The config gains the two declarations the live channel actually supports: session-affinity headers at provider level, and image input on the model entry, each proven by a real request before it is written down.

### Approach Notes

- The predicate is the only new concept; every existing check keeps its current shape and merely asks it first. That keeps the diff reviewable and leaves the DeepSeek cache adapter (usage normalization, cache accounting, stats) untouched.
- Affinity provenance: the generic proxy check already distinguishes `undefined` (missing) from `false` (deliberate opt-out). The DeepSeek branch did not, so the fix aligns it with the generic path instead of inventing a second rule.
- Both live claims are verified against the real endpoint with `curl` before the config is edited, so a failing channel reverts to the honest declaration rather than to a hopeful one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (`LLMGATEWAY_API_KEY`, live endpoint reachability)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npm run check` green in `.pi/extensions/pi-cache-optimizer`
- [ ] Live image and affinity requests recorded with their results
- [ ] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered diagnostic: predicate -> missing-key list -> suggestion -> rendered advice, with one predicate owning applicability.

### Key Components
- **`isDeepSeekWireCompatApplicable(model)`** (new): true only for a `deepseek`-named model on a non-official OpenAI-compatible proxy whose effective compat declares `thinkingFormat: "deepseek"`. The single source of truth for "this channel speaks the DeepSeek reasoning wire format".
- **`describeMissingDeepSeekCompat(model)`**: returns `[]` unless the predicate holds; otherwise reports the reasoning-replay requirement, never the wire-format flag itself (demanding the flag that gates the check is circular).
- **`describeMissingCacheCompatForModel(model)`**: composes the generic proxy list (affinity, `undefined`-based) and, when the predicate holds, the DeepSeek-specific additions — mirroring the upstream 2.8.7 composition so affinity advice is never lost for opted-in channels.
- **`buildDeepSeekCompatSuggestion` / `appendDeepSeekCompatAdviceLines`**: emitted values only; the `thinkingFormat` branch and advice line are removed, which also removes it from the `/cache-optimizer fix` write-set because that path reuses the suggestion.
- **`models.json` `llmgateway`**: provider-level `compat.sendSessionAffinityHeaders`, model-level `input` on the DeepSeek entry.

### Data Flow
`model_select` -> `notifyCacheCompatIfNeeded` -> adapter `warningText(model)` -> `describeMissingCacheCompatForModel` -> predicate decides which checks run -> missing list renders advice (or nothing). The same missing list feeds `buildCompatDiagnosis` (`/cache-optimizer doctor|compat`) and `buildFixSuggestion` (`/cache-optimizer fix`), so gate and writer can never disagree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Phase shape: prove the two live claims first (cheapest to falsify), patch the predicate and its consumers, align the tests, then re-run the extension checks and the packet gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Level | What it proves | How |
|-------|----------------|-----|
| Unit (regression) | The gate, the suggestion and the opt-out semantics | New `node --test` cases in `tests/review-findings.test.ts` driven through `__internals_for_tests` (`isDeepSeekLikeModel`, `describeMissingDeepSeekCompat`, `describeMissingCacheCompatForModel`, `buildDeepSeekCompatSuggestion`, `buildDeepSeekCompatWarningText`) |
| Unit (pinned contract) | The fix command writes only opt-out-safe keys | Existing fix-command test asserting `resolveExplicitCompatValue(..., 'thinkingFormat')` is `undefined` after `fix` |
| Typecheck + package | No broken imports or shipped-file regressions | `npm run typecheck`, `npm run check:pack`, `npm run check:diff` |
| Live (channel) | The two declarations are facts, not hopes | `curl` a small generated PNG to the gateway and compare the answer to the image's actual content; one request with the affinity headers enabled returns 200 |
| Packet | Docs, metadata and structure | `validate.sh <folder> --strict`, metadata regeneration |

Test-first note: the new gate tests were written to fail against the pre-patch predicate (`isDeepSeekCompatCheckApplicable({compat: {}})` returning `true`), so the patch is what makes them pass rather than the tests merely describing it afterwards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `LLMGATEWAY_API_KEY` in the environment (referenced from `models.json` as `${LLMGATEWAY_API_KEY}`); never printed, echoed or written to any artifact.
- Network reachability of `https://api.llmgateway.io/v1`.
- Pillow (`PIL`) available locally for generating the deterministic test image; a fallback reference image plus sk-vision OCR serves as ground truth if it were unavailable.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Extension: `git checkout -- .pi/extensions/pi-cache-optimizer/index.ts .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` restores the 2.8.0 behavior.
- Config: remove `providers.llmgateway.compat` and the model's `input` field — both are additive keys, so deletion is a complete revert. If affinity headers 403, set `sendSessionAffinityHeaders: false`, which REQ-003 makes warning-free.
- No automatic writer is enabled: nothing outside these files is touched, and the npm/git upstream copies stay as they are.
<!-- /ANCHOR:rollback -->

---
