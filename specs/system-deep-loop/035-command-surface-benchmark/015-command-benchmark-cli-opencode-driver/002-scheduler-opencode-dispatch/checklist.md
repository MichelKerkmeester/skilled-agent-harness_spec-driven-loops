---
title: "Checklist: Scheduler/Runner cli-opencode Dispatch Wiring"
description: "Verification checklist for the scheduler/runner dispatch child phase — canonical argv, no --agent, child spec-gate env, closed stdin, and byte-stable frozen legs. Unchecked pending implementation."
trigger_phrases:
  - "checklist scheduler opencode dispatch"
  - "buildSpawnArgs verification checklist"
  - "cli-opencode leg checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/002-scheduler-opencode-dispatch"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 checklist"
    next_safe_action: "Wire runner dispatch on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-002-scheduler-opencode-dispatch-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Scheduler/Runner cli-opencode Dispatch Wiring

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
- [ ] CHK-002 [P0] cli-opencode SKILL.md re-read and cited (Default Invocation, ALWAYS 3/5/6/11/17)
  - **Evidence**: Pending
- [ ] CHK-003 [P0] Plumbing seam chosen and recorded
  - **Evidence**: Pending


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `cli-opencode` leg renders canonical argv (`--model/--variant/--format json/--dir`)
  - **Evidence**: Pending
- [ ] CHK-011 [P0] No `--agent` token appears for the new leg
  - **Evidence**: Pending
- [ ] CHK-012 [P0] Child spec-gate env `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` injected on the spawn
  - **Evidence**: Pending
- [ ] CHK-013 [P1] `stdio: ['ignore','pipe','pipe']` preserved; no literal `</dev/null` in argv
  - **Evidence**: Pending


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Frozen legs' `buildSpawnArgs` byte-identical to the golden snapshot
  - **Evidence**: Pending
- [ ] CHK-021 [P0] Command-kind scenario renders `--command <family>/<name>` before `--format json`
  - **Evidence**: Pending
- [ ] CHK-022 [P1] Missing `executor` falls back to `deepseek/deepseek-v4-pro` + `high`
  - **Evidence**: Pending
- [ ] CHK-023 [P1] Overridden `executor` model/variant renders its values
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

- [ ] CHK-030 [P0] No credentials/API keys embedded in argv or prompt construction
  - **Evidence**: Pending
- [ ] CHK-031 [P0] Provider auth failure maps to `EXIT_ENV` (75) → scheduler `retryable`; no silent model substitution
  - **Evidence**: Pending
- [ ] CHK-032 [P1] `--dangerously-skip-permissions` scoped to the benchmark leg only (matches existing legs)
  - **Evidence**: Pending


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final runner change
  - **Evidence**: Pending
- [ ] CHK-041 [P1] SKILL.md rule citations recorded in the change description
  - **Evidence**: Pending
- [ ] CHK-042 [P2] Handoff note to child 003 (live-run + evidence expectations) written
  - **Evidence**: Pending


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only the runner (and, if seam 2, the scheduler) changed on the worktree
  - **Evidence**: Pending (`git diff --name-only`)
- [ ] CHK-051 [P1] Runner CLI surface + exit-code contract unchanged
  - **Evidence**: Pending


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending
**Verified By**: Pending — implementation not yet started

<!-- /ANCHOR:summary -->
