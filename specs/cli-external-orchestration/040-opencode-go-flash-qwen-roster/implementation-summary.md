---
title: "Implementation Summary: opencode-go Flash + Qwen 3.8 Max roster"
description: "Added qwen3.8-max to the cli-pi fan-out roster and re-pointed deepseek-v4-flash to the opencode-go provider across both synced enforcement points, with opencode-go docs in cli-pi and cli-opencode. Live-verified."
trigger_phrases:
  - "implementation summary"
  - "opencode-go roster"
  - "qwen3.8-max"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/040-opencode-go-flash-qwen-roster"
    last_updated_at: "2026-08-07T13:25:40Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Summarized shipped roster + docs changes and live verification"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-040-opencode-go-flash-qwen"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: opencode-go Flash + Qwen 3.8 Max roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-opencode-go-flash-qwen-roster |
| **Completed** | 2026-08-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-loop cli-pi fan-out dispatch can now run **Qwen 3.8 Max**, and both it and **DeepSeek V4 Flash** route through the OpenCode `opencode-go` gateway (the subsidized "2x usage" endpoint). The models were already offered by opencode-go and present in pi's model store; what was missing was the enforced roster entry for qwen3.8-max, the provider routing, and the operator-facing docs.

### Roster enforcement (two synced points)
`qwen3.8-max` was added to `PI_SUPPORTED_MODELS` (`executor-config.ts`, the source of truth) and to its synchronous mirror `PI_ALLOWED_MODELS` (`fanout-run.cjs`). In `fanout-run.cjs`'s `PI_MODEL_PROVIDERS` map, `qwen3.8-max` maps to `opencode-go` and `deepseek-v4-flash` was re-pointed from `deepseek` to `opencode-go` — so both dispatch as `opencode-go/<id>` at the fan-out layer.

### Docs
Both skills gained a `### opencode-go` section in `providers-and-models.md`: cli-pi (bare ids + `--provider opencode-go` dispatch shape, provider count reconciled four→five) and cli-opencode (`opencode-go/<id>` rows). Each row cites the live dispatch that confirmed it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS` += `qwen3.8-max` |
| `.../runtime/scripts/fanout-run.cjs` | Modified | Mirror += `qwen3.8-max`; provider map: qwen→opencode-go, flash re-pointed |
| `.../cli-pi/references/providers-and-models.md` | Modified | New `### opencode-go` section |
| `.../cli-opencode/references/providers-and-models.md` | Modified | New `### opencode-go` section |
| `.../runtime/tests/unit/executor-config.vitest.ts` | Modified | Nine-id roster assertion |
| `.../runtime/tests/unit/fanout-run.vitest.ts` | Modified | providerByModel expectation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Research first: live `opencode models` confirmed both `opencode-go/` ids, and reading `executor-config.ts` + `fanout-run.cjs` surfaced the fail-closed mirror and the provider map (a missing map entry silently dispatches the wrong model). Edited both synced points, updated the two guard tests that pin the roster (they failed first, exactly on the intended change, then passed), and confirmed end-to-end with real dispatches.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-point deepseek-v4-flash to opencode-go | Operator confirmed; uses the "2x usage" gateway; keeps both models on one provider |
| Keep the direct `deepseek` route documented too | deepseek-v4-flash still works via `--provider deepseek`; noted so 035's route isn't lost |
| Update guard tests rather than weaken them | The tests exist to pin the roster; the roster legitimately changed, so the pins move with it |
| No cli-cursor/cli-devin changes | Their providers do not offer these models (spec 035) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check fanout-run.cjs` | PASS |
| `npx vitest run` (executor-config + fanout guards) | PASS — 186 passed (2 failed first on the intended pins, then fixed) |
| `opencode run --model opencode-go/qwen3.8-max` | PASS — replied `OK`, exit 0 |
| `opencode run --model opencode-go/deepseek-v4-flash` | PASS — replied `OK`, exit 0 |
| `pi --provider opencode-go --model qwen3.8-max -p` | PASS — replied `OK` (benign `opencode/deepseek-v4-flash-free` pattern warning) |
| roster sync | PASS — `PI_SUPPORTED_MODELS` == `PI_ALLOWED_MODELS` (both 9 ids) |
| `validate.sh --strict` | PASS — recorded in this session (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Machine-local roster** — pi's opencode-go availability is machine state (`models-store.json`), not a contract; another machine must have the provider authenticated.
2. **Manual mirror** — `executor-config.ts` and `fanout-run.cjs` are hand-synced by design (no TS import in the CJS script); the guard tests are what keep them honest.
3. **deepseek-v4-flash dual route** — direct `deepseek` still works; only the fan-out default moved to opencode-go.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Update roster + provider map | Also updated two guard tests | The tests hardcode the roster/provider pins and had to move with the change |

<!-- /ANCHOR:deviations -->
