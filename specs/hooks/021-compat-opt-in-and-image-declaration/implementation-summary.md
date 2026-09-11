---
title: "Implementation Summary"
description: "A channel's capabilities are now declared, never inferred from a model's name. The cache optimizer stops telling DeepSeek-named models to adopt a wire format they never opted into, and the llmgateway channel declares the two things a live request proved it supports: session-affinity headers and image input."
trigger_phrases:
  - "implementation summary"
  - "deepseek compat opt-in"
  - "llmgateway image declaration"
  - "validation evidence"
  - "continuation notes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/021-compat-opt-in-and-image-declaration"
    last_updated_at: "2026-09-11T10:10:00Z"
    last_updated_by: "pi-agent"
    recent_action: "Gated DeepSeek compat advice on opt-in; declared affinity and image input"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - ".pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts"
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-compat-opt-in-and-image-declaration"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 021-compat-opt-in-and-image-declaration |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two declarations replaced two guesses. The startup warning on `llmgateway/deepseek-v4.1-flash` is gone, and the same channel now sends images to the model instead of quietly dropping them — both because the configuration states what the channel can do rather than letting a model's name or a missing key imply it.

### Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model

The cache optimizer used `isDeepSeekLikeModel()` — a substring match on the model id — as evidence that a channel spoke DeepSeek's reasoning wire format. Every DeepSeek-named model behind any OpenAI-compatible proxy was therefore told its compat lacked `thinkingFormat` and `requiresReasoningContentOnAssistantMessages`, and `/cache-optimizer fix` would write `thinkingFormat: "deepseek"` into `models.json` on that basis. That is a wire-format switch, not a cache flag, and the newer upstream build of this same extension removed the suggestion for exactly that reason. `isDeepSeekWireCompatApplicable()` in `.pi/extensions/pi-cache-optimizer/index.ts` now decides applicability from an explicit effective `thinkingFormat: "deepseek"`, and it is the single gate every DeepSeek-specific check, suggestion and advice line asks first. The flag itself is never reported as missing — demanding the key that gates the check is circular — so `buildDeepSeekCompatSuggestion()` and the rendered warning can no longer manufacture it.

Session affinity moved to the generic proxy path while keeping its explicit-`false` opt-out, which the DeepSeek branch had ignored: an operator whose proxy blocks custom headers with 403 can now say so once and stop being warned. `models.json` states the two verified facts about the channel: `providers.llmgateway.compat.sendSessionAffinityHeaders` for the whole provider, and `input: ["text","image"]` on the DeepSeek model entry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modified | Added `isDeepSeekWireCompatApplicable()` as the single applicability gate; `describeMissingDeepSeekCompat()` returns nothing unless it holds and no longer demands `thinkingFormat` or affinity; `describeMissingCacheCompatForModel()` composes the generic proxy list with the DeepSeek additions instead of returning early, so opted-in channels keep affinity advice; removed the `thinkingFormat` branch and advice line from `buildDeepSeekCompatSuggestion()` / `appendDeepSeekCompatAdviceLines()` |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | Modified | Replaced the assertions that pinned the name-based behavior with four gate tests (name alone is not protocol evidence, opt-in re-enables the reasoning check, no suggestion or rendered advice proposes the wire format, explicit affinity `false` is respected), and asserted the fix command leaves `thinkingFormat` absent |
| `.pi/models.json` | Modified | Declared `providers.llmgateway.compat.sendSessionAffinityHeaders: true` and `input: ["text","image"]` on the `deepseek-v4.1-flash` entry |
| `specs/hooks/021-compat-opt-in-and-image-declaration/scratch/` | Created | Probe fixtures and evidence: `vision-probe.png`, `live-image-probe.md`, `live-affinity-probe.md`, `verify-no-warning.mjs`, `verify-no-warning.txt`, `check-run.txt` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two claims that could be falsified cheaply were tested before anything was written down. A probe image was generated with a known payload (`PI VISION PROBE` / `CODE KX-4471` / `SEVEN ORANGE KITES`, plus a red ellipse), sent to `https://api.llmgateway.io/v1/chat/completions` as an OpenAI-style multimodal message, and answered correctly — HTTP 200 with all three lines transcribed verbatim. The same endpoint answered HTTP 200 with `session_id`, `x-client-request-id` and `x-session-affinity` set exactly as Pi's adapter sends them. Only then did `models.json` gain the two declarations.

The code change was verified through the extension's own `model_select` hook rather than by inspection. `scratch/verify-no-warning.mjs` imports the real module, registers it on a stub host, fires the hook that produced the original chat warning, and counts notifications — with two positive controls that fail the harness if it cannot see a warning at all. The full check suite (`npm run typecheck`, 114 `node --test` cases, `git diff --check`, `npm pack --dry-run`) exits 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate on the effective `thinkingFormat` instead of removing the DeepSeek checks | The checks are legitimate once the wire format is declared; deleting them would trade a false positive for a silent unknown. One predicate keeps the advice truthful in both directions. |
| Never emit `thinkingFormat: "deepseek"`, not even as a suggestion | The newer upstream removed it after it turned valid `reasoning_effort` requests into provider-rejected `thinking` requests. A diagnostic that breaks the channel it advises has no business auto-writing it. |
| Move session affinity to the generic proxy path | That path already treats an explicit `false` as a deliberate opt-out; the DeepSeek branch had a second, stricter copy of the rule that could not be satisfied. One rule, one meaning. |
| Compose rather than early-return in `describeMissingCacheCompatForModel()` | The non-DeepSeek paths and the command surfaces read this list, so an early return would silently drop affinity advice for opted-in channels. |
| Prove image input live before declaring it | A declaration is a claim Pi acts on. If the channel had rejected images, the honest outcome was to keep the entry text-only; guessing would have produced 400s far from the change that caused them. |
| Keep `model-modality.ts` untouched | Its name allowlist only affects the auto-inspect path, which is off (`SK_VISION_AUTOINSPECT` unset). Changing code that is not on the failure path widens blast radius for no observed gain. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS — clean, no diagnostics |
| `npm test` | PASS — 114 tests, 28 suites, 0 failures (includes the 4 new gate tests) |
| `npm run check:diff` / `check:pack` | PASS — no whitespace errors; pack dry-run ships only `index.ts`, `package.json`, `LICENSE`, `README.md` |
| `model_select` hook, real `models.json` | PASS — `llmgateway/deepseek-v4.1-flash` and `llmgateway/glm-5.3-flash` produce 0 compat warnings (`scratch/verify-no-warning.txt`) |
| Positive control: plain third-party proxy, no compat | PASS — 1 warning, so the harness does detect advisories |
| Positive control: opted-in DeepSeek proxy missing the replay flag | PASS — 1 DeepSeek-shaped warning; the opt-in path still warns when genuinely incomplete |
| Positive control: DeepSeek-named, never opted in | PASS — 0 chat warnings (adapter short-circuit); the state stays visible through `/cache-optimizer compat`/`doctor` |
| Command surface after the change | PASS — `/cache-optimizer compat` and `doctor` report `✅ Compat fully configured.` with the affinity-enabled note and the optional retention advice |
| Live image pass-through | PASS — HTTP 200, all three probe lines transcribed exactly, red ellipse identified (`scratch/live-image-probe.md`) |
| Live affinity headers | PASS — HTTP 200 with `session_id`, `x-client-request-id`, `x-session-affinity` set (`scratch/live-affinity-probe.md`) |
| `validate.sh --strict` | PASS after metadata regeneration — see the packet's own gate output |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The affinity probe proves acceptance, not stickiness.** HTTP 200 with the three headers shows the endpoint does not reject them; it does not show the gateway pins a session to one upstream, so no cache-hit improvement is claimed from it. The 403 escape hatch is one explicit `false` away and is warning-free.
2. **The image proof covers one model on one gateway.** `llmgateway/deepseek-v4.1-flash` was proven; the provider's other models keep their existing declarations.
3. **Only the loaded project copy is patched.** The npm and git copies under `~/.pi/agent/` still carry the older behavior; they are not the loaded package, so the running extension is correct, but a future refresh in either direction would need the same change.
4. **`model-modality.ts` still classifies any `deepseek`-named model as text-only** by name allowlist, even when `input` declares images. Harmless while the auto-inspect path is disabled; it would matter if `SK_VISION_AUTOINSPECT=1` is ever set.
5. **The vendored extension README still describes `thinkingFormat` as an expectation.** `README.md` line 191 says the guidance "expects" `compat.thinkingFormat: "deepseek"` for DeepSeek models, and line 272 lists the key as supported. Both stay true as statements about the keys, but neither says the flag is now an operator-only opt-in that the extension never writes. The README was outside this packet's frozen scope, so it was left unchanged and is the packet's next safe action.
6. **A DeepSeek-named channel that was never opted in no longer warns in chat at all.** That is the intended trade — the state remains visible through `/cache-optimizer compat` and `doctor` — but it does mean a genuinely incomplete DeepSeek proxy is only discoverable through the command surface.
<!-- /ANCHOR:limitations -->

---
