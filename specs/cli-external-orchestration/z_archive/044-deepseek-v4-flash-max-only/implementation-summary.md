---
title: "Implementation Summary: DeepSeek V4 Flash pinned to the Max thinking tier"
description: "Fan-out builders now force deepseek-v4-flash to max thinking (pi --thinking max / opencode --variant max); catalogs corrected; tests green."
trigger_phrases:
  - "deepseek flash max pin summary"
  - "flash thinking pin fan-out summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/044-deepseek-v4-flash-max-only"
    last_updated_at: "2026-08-16T17:34:05Z"
    last_updated_by: "implementer"
    recent_action: "Pinned DeepSeek Flash to max thinking"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-044-deepseek-flash-max-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-deepseek-v4-flash-max-only |
| **Completed** | 2026-08-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every fan-out dispatch of DeepSeek V4 Flash now runs at the max thinking tier. The command builders auto-upgrade `deepseek-v4-flash` to max effort — cli-pi emits `--thinking max`, cli-opencode emits `--variant max` — even when the lineage names a lower effort or none. Flash stays in every roster; only its effort is pinned. cli-devin was already max-only (its uid `deepseek-v4-flash-max` bakes the tier in). cli-cursor has no DeepSeek and was untouched.

### Flash is a reasoning model

Live inspection (`models-store.json`, `opencode models deepseek`/`opencode-go`) shows Flash is `reasoning: true` with a `max` thinking level. The catalogs that called it "non-reasoning (`--variant` ignored)" were wrong and were corrected. There is no separate `deepseek-v4-flash-max` id on the DeepSeek direct API or opencode-go gateway (verified count 0); those surfaces reach the tier through the effort flag, not a distinct id.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | `isFlashMaxPinnedModel` + `pinReasoningEffortForModel` (source of truth) |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Mirror helper; pin Flash effort in the pi (`--thinking`) and opencode (`--variant`) builders; recorded effort reflects the pin |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | Helper unit tests (bare/prefixed match, `-max` excluded, effort mapping) |
| `system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Builder pin tests (pi + opencode); provider-map assertion updated for Flash `--thinking max` |
| `cli-pi/references/providers-and-models.md` | Modified | Flash corrected to reasoning; `--thinking max` pin note |
| `cli-opencode/references/providers-and-models.md` | Modified | "non-reasoning" claim fixed; `--variant max` pin note |
| `cli-devin/references/providers-and-models.md` | Modified | Max-thinking-only policy note |
| `cli-external-orchestration/changelog/v1.4.3.0.md` | Added | Hub changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Capability was verified live before deciding the mechanism: `models-store.json` and `opencode models` confirmed Flash reasons and exposes a `max` thinking level, and confirmed no `-max` id on the pi/opencode providers. The pin predicate lives in one TS source of truth with a synchronous CJS mirror (matching the existing allowlist-mirror convention) and is applied in both command builders. The old behavior was watched failing first (a Flash dispatch without `--thinking max`), then the pin was added and the suites re-run: baseline `207 passed | 1 skipped`, final `212 passed | 1 skipped` (+5 = helper + builder tests, with one existing assertion updated).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| "Flash Max" = effort pin, not a model id | Live data: Flash is a reasoning model with a `max` thinking level; no `-max` id on pi/opencode |
| Force to max (not reject) | Operator choice: never fail a dispatch; always run Flash at max |
| Keep Flash in the rosters | The model is valid and needed; only its effort is constrained |
| No fabricated `-max` id; cursor untouched; raw dispatch ungated | Providers do not serve a `-max` id; cursor has no DeepSeek; the pin belongs in the fan-out builders |
| Reverted the earlier "remove Flash" edits | That was a misread of "Flash Max" as a model id |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest` executor-config + fanout-run + cli-adapter stress fanout | PASS, `212 passed \| 1 skipped` (baseline `207 passed \| 1 skipped`) |
| cli-pi Flash pin | `buildLineageCommand({kind:'cli-pi', model:'deepseek-v4-flash', reasoningEffort:'high'})` → `--thinking max`; `effectiveConfig.reasoningEffort === 'max'` |
| cli-opencode Flash pin | `deepseek/deepseek-v4-flash` at `high` → `--variant max` |
| Non-Flash unaffected | `deepseek-v4-pro` at `high` still dispatches `high` |
| Devin `-max` uid not matched | `isFlashMaxPinnedModel('deepseek-v4-flash-max') === false` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fan-out only.** The pin lives in the fan-out command builders; a hand-typed `pi --model deepseek-v4-flash` (no fan-out) is not gated.
2. **Force is silent-by-upgrade.** A caller requesting Flash at a lower effort runs at `max`; the pinned value is recorded in the receipt for observability.
3. **cli-opencode has no allowlist.** opencode remains a provider pass-through; the pin governs the effort of a Flash dispatch, not which models are accepted.
<!-- /ANCHOR:limitations -->
