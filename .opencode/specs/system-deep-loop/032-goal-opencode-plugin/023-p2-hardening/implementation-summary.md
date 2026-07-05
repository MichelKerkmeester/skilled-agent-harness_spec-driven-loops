---
title: "Implementation Summary: Phase 23: p2-hardening"
description: "Seven P2 hardening fixes landed in mk-goal.js with regression coverage: pause/resume wall-clock accounting, guarded budget_limited recovery, broader role-label neutralization, expanded secret redaction, retry-after unit handling, async continuation stat, and debug-visible state error surfacing."
trigger_phrases:
  - "goal plugin p2 hardening implementation"
  - "phase 23 complete"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/023-p2-hardening"
    last_updated_at: "2026-07-04T09:34:00Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Completed P2 hardening fixes"
    next_safe_action: "Regenerate metadata"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-continuation.test.cjs"
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-023-p2-hardening-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "2026-07-04, implementation: all seven scoped fixes shipped with fresh verification."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-p2-hardening |
| **Completed** | 2026-07-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal plugin now handles the seven adjudicated P2 hardening edges without changing the command surface. Paused time no longer consumes the wall-clock continuation budget, budget-limited goals can recover only after the budget is raised, prompt-injection and secret-redaction defenses cover the added formats, retry-after parsing honors explicit units, continuation dispatch avoids synchronous stat I/O, and debug mode surfaces the two previously silent state failures.

### Goal Runtime Hardening

The runtime stores `activeWallMs` as migration-safe state, accumulates it on pause, and rebases the active wall-clock origin on resume so `continuationCapReason` can remain unchanged. `budget_limited` now has a guarded path back to `active`, but only when `tokenBudget > tokensUsed`; still-exhausted goals continue to fail closed.

### Sanitization And Observability

Evidence redaction now covers Google API keys, PEM private-key blocks, and conservative high-entropy strings while preserving short shas and ordinary prose. Role-label neutralization now handles `:`, `=`, `->`, and `→` for the folded role allowlist. The append and orphan-sweep catch paths still do not throw, but they write direct stderr diagnostics when `MK_GOAL_DEBUG` is truthy.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Implemented all seven runtime hardening fixes. |
| `.opencode/plugins/tests/mk-goal-continuation.test.cjs` | Modified | Added wall-clock pause/resume and debug fault-injection coverage. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modified | Added budget recovery and retry-after unit coverage. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Modified | Added non-colon role delimiter sanitizer coverage. |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Modified | Added expanded secret-redaction coverage. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tests were written first for the three mandated RED/GREEN fixes, then run against current production code to prove the failures. After implementation, the touched tests passed 84/84 and the full plugin suite passed 110/110, up from the 104/104 baseline with no new failures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `continuationCapReason` unchanged | Rebasing `startedAtMs` preserves the existing cap calculation while excluding paused time. |
| Reject still-exhausted budget resumes | A budget-limited goal should not churn back to active until the raised budget exceeds usage. |
| Redact PEM blocks before inline sanitization | Multi-line key blocks must match before newline collapse changes their shape. |
| Emit debug diagnostics directly to stderr | Routing these failures through the JSONL append path could recurse through the same failing state writer. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `node --test .opencode/plugins/tests/*.test.cjs` | PASS: 104 tests, 104 pass, 0 fail. |
| Pre-fix RED run for touched tests | FAIL as expected: wall-clock resume actual `suppressed` vs expected `fired`; budget raised resume returned `STATUS=FAIL ACTION=resume`; role delimiter test did not match `system-role: do X`. |
| Targeted touched tests | PASS: 84 tests, 84 pass, 0 fail. |
| Final `node --test .opencode/plugins/tests/*.test.cjs` | PASS: 110 tests, 110 pass, 0 fail. |
| `rg -n "statSync" .opencode/plugins/mk-goal.js` | PASS: no output. |
| `node --check` on touched JS files | PASS: no output for all five files. |
| Comment hygiene | PASS: no output for `.opencode/plugins/mk-goal.js`. |
| Alignment drift | PASS: `Findings: 0`, `Errors: 0`, `Warnings: 0`, `Violations: 0`. |
| Strict spec validation | BLOCKED BY GENERATED METADATA: code and authored docs validated, but `graph-metadata.json` reported `SOURCE_FINGERPRINT_MISMATCH`; generated metadata is outside the approved write paths and orchestrator-owned post-dispatch. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Generated metadata refreshed post-dispatch** description.json and graph-metadata.json were intentionally outside the dispatch's write paths; the orchestrator regenerated them afterward and strict validation now reports Errors: 0.
2. **Changelog not refreshed** ../changelog/ is outside the allowed write paths for this bounded implementation task.
3. **Wall-clock resets on limit recovery** The pause/resume rebase also fires on `usage_limited` and `budget_limited` transitions back to `active`, where `activeWallMs` is 0, so those recoveries restart the wall budget in full rather than preserving pre-limit elapsed time. This is intentional: provider downtime and budget raises should not be charged as active work, and total runtime stays bounded by `maxAutoTurns`. Preserving pre-limit time would require accumulating `activeWallMs` on the limit transitions too.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
