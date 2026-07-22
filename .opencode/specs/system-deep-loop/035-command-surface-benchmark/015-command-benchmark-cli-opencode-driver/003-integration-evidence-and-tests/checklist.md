---
title: "Checklist: cli-opencode Leg Integration, Evidence & Regression"
description: "Verification checklist for the integration/evidence/regression child phase — live evidence, integration tests, and byte-stable frozen legs and fixtures. Unchecked pending implementation."
trigger_phrases:
  - "checklist cli-opencode leg integration"
  - "benchmark regression checklist"
  - "end-to-end opencode leg checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/003-integration-evidence-and-tests"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 checklist"
    next_safe_action: "Capture live run on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-003-integration-evidence-and-tests-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: cli-opencode Leg Integration, Evidence & Regression

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |


<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: Pending
- [ ] CHK-002 [P0] Children 001 + 002 landed and verified
  - **Evidence**: Pending
- [ ] CHK-003 [P0] `opencode --version` checked; provider auth pre-flight run (default present or operator asked)
  - **Evidence**: Pending


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The flipped cell declares a `resultPointer` (not `skip`) named `<scenarioId>-cli-opencode.result.json`
  - **Evidence**: Pending
- [ ] CHK-011 [P0] `validateManifest()` passes on the flipped manifest
  - **Evidence**: Pending
- [ ] CHK-012 [P1] Integration tests are deterministic (stubbed via `BEHAVIOR_BENCH_SPAWN_JSON` for CI)
  - **Evidence**: Pending
- [ ] CHK-013 [P1] The transcript shows the canonical `opencode run …` command with no `--agent`
  - **Evidence**: Pending


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `<scenarioId>-cli-opencode.result.json` emitted with `leg: "cli-opencode"` + matching `scenarioId`
  - **Evidence**: Pending
- [ ] CHK-021 [P0] Reconciliation `status`/`resultCount`/`skipCount` coherent; `accountedCellCount` correct
  - **Evidence**: Pending
- [ ] CHK-022 [P0] Frozen legs + 48 driver skips + 4 leaf cells byte-identical to baseline
  - **Evidence**: Pending
- [ ] CHK-023 [P1] Quota rejection yields `retryable` (exit 75), not `failed`
  - **Evidence**: Pending
- [ ] CHK-024 [P1] Benchmark test suite green
  - **Evidence**: Pending


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets/credentials in prompts, transcript, or committed evidence
  - **Evidence**: Pending
- [ ] CHK-031 [P0] `isolation.violations` empty; no write escapes fixture/out dirs
  - **Evidence**: Pending
- [ ] CHK-032 [P1] Post-run fixtures restored to a clean state (git `restoreFixture`)
  - **Evidence**: Pending


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final run + evidence
  - **Evidence**: Pending
- [ ] CHK-041 [P1] Evidence artifact paths recorded in implementation-summary.md
  - **Evidence**: Pending
- [ ] CHK-042 [P2] Parent packet close-out note (all three children complete) written
  - **Evidence**: Pending


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the matrix cell flip + the new test file changed (plus ephemeral out-dir evidence)
  - **Evidence**: Pending (`git diff --name-only`)
- [ ] CHK-051 [P1] Captured out-dir evidence is not accidentally committed as runtime state
  - **Evidence**: Pending
- [ ] CHK-052 [P1] All `fixtures[*].hashes` unchanged
  - **Evidence**: Pending


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 14 | 0/14 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending
**Verified By**: Pending — implementation not yet started

<!-- /ANCHOR:summary -->
