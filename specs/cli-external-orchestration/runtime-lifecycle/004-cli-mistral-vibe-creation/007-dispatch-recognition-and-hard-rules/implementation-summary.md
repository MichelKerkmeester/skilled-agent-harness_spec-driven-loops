---
title: "Implementation Summary"
description: "The dispatch hook now recognizes Mistral Vibe and enforces its six hard rules: print mode, an isolated home, an output dir, the closed roster, no repository-root cwd and a closed stdin."
trigger_phrases:
  - "vibe dispatch recognition implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/007-dispatch-recognition-and-hard-rules"
    last_updated_at: "2026-11-14T19:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built Vibe dispatch recognition and five new checks plus the stdin extension; suites green"
    next_safe_action: "Phase 008 builds the Vibe repo guards and settles the hook wire format"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does vibe 3.1.2 load a .env from its working directory?"
    answered_questions:
      - "Process name, stdin and --prompt-file, from phase 004"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-dispatch-recognition-and-hard-rules |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `vibe` command typed through a governed runtime now meets the same preflight as every other executor. A dispatch that skips print mode, leaves `VIBE_HOME` unset or in the checkout, omits `--output-dir`, names an off-roster model, runs from the repository root or leaves stdin open is refused, and the refusal names the rule.

### Phase 7: dispatch-recognition-and-hard-rules

`dispatch-audit.mjs` maps `vibe`, `vibe-rs` and `vibe-acp` to `cli-mistral-vibe`, except the session-free forms. `dispatch-rule-checks.mjs` gains a Vibe invocation parser, five checks, and Vibe shapes in the shared stdin check.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | Vibe recognition |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modified | Recognition cases |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | Parser, five checks, stdin shapes, roster constant |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Per-check, guard, end-to-end and session-free cases |
| `.skilled/hooks/dispatch/README.md` | Modified | Check rows and executor names |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` | Modified | The config-copy step the dispatch shape needs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Nine OpenCode dispatches on `mistral/deepseek-v4-1-flash-1017#max`, one check with its tests per brief. After each, the orchestrator reran the suites, probed the check with commands that hide a flag inside the prompt text, and diffed the test files for edited cases.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A constant roster set plus a sync test | The hook stays free of markdown parsing, and the test fails if the reference and the set drift |
| `VIBE_HOME` must sit on the dispatch's own command | A separate `export` cannot be tied to the run it governs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rule-check suites | PASS: 64, fail 0 (baseline 53) |
| Recognition suite | PASS: 130 (baseline 128) |
| Hooks vitest suite | PASS: 9 files, 496 tests; no pre-change baseline |
| Documented dispatch through `evaluateDispatch` | PASS: `[]` |
| Documented dispatch, keyed run | PASS: exit `0`, `finished` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime reach.** The checks run where the dispatch hook runs. A session whose hooks load from another checkout is not covered until this change is merged there.
2. **Working-directory dotenv.** Whether Vibe loads a `.env` from its cwd stays UNKNOWN; the cwd rule refuses the root either way.
<!-- /ANCHOR:limitations -->
