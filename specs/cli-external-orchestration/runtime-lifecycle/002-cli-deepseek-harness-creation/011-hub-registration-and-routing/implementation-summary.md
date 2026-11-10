---
title: "Implementation Summary"
description: "Phase 11 registers cli-deepseek-harness as the eighth hub mode, with verified advisor and compiled-routing behavior and documented open checks."
trigger_phrases:
  - "hub registration and routing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/011-hub-registration-and-routing"
    last_updated_at: "2026-11-06T08:57:12Z"
    last_updated_by: "codex-gpt-6"
    recent_action: "Recorded current routing and test results"
    next_safe_action: "Resolve T003 and the open P1 checks"
    blockers:
      - "T003 baseline transcript not saved"
      - "CHK-040, CHK-041 and CHK-050 remain open"
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-011-hub-registration-and-routing"
      parent_session_id: null
    completion_pct: 82
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-hub-registration-and-routing |
| **Completed** | No; T003 and three P1 checks remain open |
| **Status** | In Progress |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hub now registers `cli-deepseek-harness` as mode eight with the four harness aliases. The hub tables, advisor graph, compiled-routing inputs, sk-prompt tables and runtime agent mirrors include the mode.

### Phase 11: hub-registration-and-routing

The advisor first selects `cli-external-orchestration`; the compiled hub route then selects `cli-deepseek-harness` for dsh prompts and keeps `use cli-opencode with deepseek-v4.1-flash` on `cli-opencode`. The seven existing mode canaries still resolve to their own modes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Hub registry, router, tables and manifests | Modified or regenerated | Register the eighth mode and its aliases |
| Advisor and compiled-routing sources | Modified or regenerated | Add dsh selection and preserve the cli-opencode DeepSeek route |
| sk-prompt and agent tables and mirrors | Modified or regenerated | Expose the mode and keep generated agent copies in sync |
| Phase evidence | Added | Record current reruns and remaining limitations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The registry count is eight, the parent-skill check passes with no warnings, and reminted compiled-routing manifest tests pass 48/48. Advisor parity and scorer suites pass 393 tests with four skipped; the scorer ratchet is 7/7 after recapturing its baseline. Card-sync, mirror-sync and 16 in-memory route canaries pass. Receipts are in `evidence/closeout-rerun.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Aliases name the harness, never a bare model word | A bare `deepseek` alias would pull `cli-opencode` DeepSeek model requests to the harness, the failure phase 001 research Section 3 rejects |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Registry and aliases | 8 modes, exit 0 | `evidence/closeout-mode-registry.txt` |
| Parent hub invariants | All hard checks pass, 0 warnings | `evidence/closeout-parent-skill-check.txt` |
| Compiled-routing manifest tests | 48 pass, 0 fail | `evidence/closeout-compiled-route-manifest-rerun.txt` |
| Advisor parity and scorer suites | 393 pass, 4 skipped, exit 0 | `evidence/closeout-advisor-parity-scorer.txt` |
| Advisor and compiled child routing | Hub first hop; DeepSeek model route to `cli-opencode` | `evidence/closeout-advisor-opencode-deepseek.json`, `evidence/closeout-compiled-route-opencode-deepseek.txt` |
| Card, agent mirror and route canary checks | Pass; 11 mirrors in sync; 16/16 canaries | `evidence/card-sync.txt`, `evidence/agent-mirror-sync.txt`, `evidence/canary-in-memory-output.txt` |
| Strict phase validation | `RESULT: PASSED`, 0 warnings | `evidence/closeout-validation.txt:51`, `:53` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T003 remains open.** No pre-edit advisor-suite transcript was saved, so the original baseline cannot be reconstructed.
2. **CHK-040 remains open.** `plan.md` still marks phases 003 and 006 as Red; the requested closeout did not edit the plan.
3. **CHK-041 remains open.** One stale seven-mode count remains in the out-of-scope `cli-hermes` feature catalog.
4. **CHK-050 remains open.** Check outputs are stored under `evidence/`, as the dispatch requested, rather than `scratch/`.
5. **The archived canary validator is blocked by a pre-existing missing untracked script.** It reports ENOENT for `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`; the script is outside this phase's write scope.
6. **Why the status stays In Progress.** T003, CHK-040, CHK-041 and CHK-050 stay open. The spec stays In Progress because the open rows above have no saved evidence in this folder, and a baseline taken before an edit cannot be recaptured afterwards. Each row closes only with a new run. The parent goal's completion criteria are met by phase 013 evidence and the final gate, so these rows do not block the packet goal.
<!-- /ANCHOR:limitations -->

---
