---
title: "Implementation Plan: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Trace evaluate()'s real severity-mapping branch and the CHECKS registry gap first, then add three new DISPATCH_SHAPES regexes, fold Codex's local shape into the shared registry, implement the severity mapping decision, and re-run the full dispatch-family test suite."
trigger_phrases:
  - "dispatch shape coverage plan"
  - "codex shape fold-in plan"
  - "severity mapping implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 2 plan for dispatch-shape coverage phase"
    next_safe_action: "Read evaluate() source and quote its severity branch before editing"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Severity mapping decision (see spec.md Open Questions)."
    answered_questions:
      - "Functionally independent of phases 001-005; ordered 006 for packet narrative only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | Direct implementation on `skilled/v4.0.0.0`, no worktree (parent packet operator choice) |
| **Authority** | `cli-external-orchestration` (`.opencode/hooks/dispatch/` shared concern) |
| **Verification** | `node --test`/`npx vitest run` per file's documented runner, full dispatch-family suite re-run, `rg` sweeps for zero remaining duplicates |
| **Independence** | No functional dependency on phases 001-005 (goal-hook port); a separate, pre-existing dispatch-shape gap |

### Overview

Read `evaluate()`'s real severity-mapping branch and confirm the `CHECKS` registry gap before writing any shape regex, so the severity decision in REQ-003 is grounded in the actual current behavior rather than the parent packet's plan-text description of it. Add three new `DISPATCH_SHAPES` entries (devin, cursor, pi), fold Codex's locally-bolted-on shape into the same shared array, implement the resolved severity mapping as an explicit branch, add regression tests per new shape, then re-run every dispatch-family test suite (not only the new tests) to confirm the pre-existing `opencode run`/`claude -p` coverage is unregressed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `evaluate()`'s current severity-mapping branch read and quoted verbatim in this plan. [evidence: pending]
- [ ] `CHECKS` registry confirmed to lack `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` entries via `rg`. [evidence: pending]
- [ ] Real dispatch command forms for `devin -p`, `cursor-agent … -p`, `pi -p` confirmed against each skill's own SKILL.md dispatch examples. [evidence: pending]

### Definition of Done

- [ ] Three new `DISPATCH_SHAPES` entries added and tested (REQ-001). [evidence: pending]
- [ ] `CODEX_EXEC_SHAPE` folded into the shared registry, zero remaining local duplicate (REQ-002). [evidence: pending]
- [ ] Severity mapping decision implemented as an explicit branch and tested (REQ-003). [evidence: pending]
- [ ] Regression tests added per new shape (REQ-004). [evidence: pending]
- [ ] Full dispatch-family suite re-run, no regressions on `opencode run`/`claude -p` (REQ-005). [evidence: pending]
- [ ] CHECKS-function gap disclosed in `implementation-summary.md` (REQ-006). [evidence: pending]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single shared-registry extension pattern: `DISPATCH_SHAPES` in `dispatch-audit.mjs` stays the one source of truth every adapter (Claude, Devin, Codex, Cursor, Pi preflight-lint and audit-trail files) reads from, either directly or via `readHardRules`/`evaluate` in `dispatch-rule-checks.mjs`. No new files; this phase only extends and consolidates the existing two-file core.

### Key Components

- **`DISPATCH_SHAPES` array** (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`): gains 3 new `{ test, skill, packetPath }` entries (devin, cursor, pi) plus the folded-in Codex entry.
- **`evaluate()`** (`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`): severity-mapping branch updated to handle `error` explicitly.
- **`.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs`**: `CODEX_EXEC_SHAPE` and `DISPATCH_SKILLS` composition removed; adapter reads `DISPATCH_SHAPES` directly, matching the pattern already used by the Pi preflight-lint adapter (confirmed reading `audit.DISPATCH_SHAPES` directly).

### Control Flow

Read `evaluate()` source -> confirm CHECKS gap -> confirm real command forms per CLI -> add 3 new shape entries + fold in Codex's -> update Codex adapter to drop its local duplicate -> implement severity-mapping decision -> add regression tests per shape and for the severity decision -> re-run full dispatch-family suite -> update this packet's docs with the honest CHECKS-gap disclosure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Groundtruth Trace

- [ ] Read `evaluate()`'s current severity-mapping line verbatim; quote it in this plan before any edit.
- [ ] `rg -n "command-v-devin-required|devin-self-invocation-guard|cursor-self-invocation-guard|command-v-cursor-agent-required|command-v-pi-required|pi-self-invocation-guard|deep-loop-runtime-delegation" .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` to confirm the CHECKS gap.
- [ ] Confirm real dispatch command examples for devin/cursor/pi from each skill's own SKILL.md or references.

### Phase 2: Shape Registry + Codex Fold-In

- [ ] Add `devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print` entries to `DISPATCH_SHAPES`.
- [ ] Move `CODEX_EXEC_SHAPE` into `DISPATCH_SHAPES` (skill `cli-codex`, packetPath `cli-external-orchestration/cli-codex`); remove the local constant and `DISPATCH_SKILLS` composition from the Codex adapter; repoint the adapter to `DISPATCH_SHAPES` directly.

### Phase 3: Severity Mapping

- [ ] Implement the resolved `severity: error` -> `block`/`warn` mapping as an explicit branch in `evaluate()`.
- [ ] Add a test asserting the exact resulting `severity` field for an `error`-severity rule.

### Phase 4: Regression Coverage + Full Re-run

- [ ] Add a matching/non-matching regression test pair per new shape (devin, cursor, pi, codex-in-shared-registry).
- [ ] Re-run every dispatch-family suite that exercises `DISPATCH_SHAPES`/`evaluate`/`readHardRules` (not only the new tests); confirm `opencode run`/`claude -p` coverage unregressed.
- [ ] Update `implementation-summary.md` with the honest CHECKS-function gap disclosure (REQ-006).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|-------------------|
| Unit | New shape regexes (match + non-match cases) | `npx vitest run` on `dispatch-audit.test.mjs` and/or `dispatch-rule-checks.test.mjs`, per each file's own documented runner |
| Unit | Severity-mapping decision | New test in `dispatch-rule-checks.test.mjs` asserting the `error`-severity violation's resulting `severity` field |
| Regression | Full dispatch-family suite | Every test file exercising `DISPATCH_SHAPES`/`matchDispatchShape`/`evaluate`/`readHardRules`, re-run post-change, pre-existing cases still passing |
| Static | Zero remaining Codex shape duplicate | `rg -n "CODEX_EXEC_SHAPE"` repo-wide, 0 hits |
| Static | CHECKS gap confirmation | `rg -n "command-v-devin-required\|devin-self-invocation-guard\|deep-loop-runtime-delegation"` against `dispatch-rule-checks.mjs`, documented in `implementation-summary.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` (current real paths, post-relocation) | Internal | Available | Cannot extend or test the shared registry. |
| `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Internal | Available | Cannot remove the local Codex shape duplicate. |
| `cli-devin`/`cli-cursor`/`cli-pi`/`cli-codex` SKILL.md `hard_rules:` frontmatter | Internal | Available | Cannot confirm the severity values and check IDs this phase makes reachable. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new shape regex false-matches an unrelated command in the full suite re-run, or the severity-mapping change alters behavior for the pre-existing `opencode run`/`claude -p` coverage.
- **Procedure**: Revert the specific commit touching `dispatch-audit.mjs`/`dispatch-rule-checks.mjs`/the Codex adapter; since this phase is functionally independent of phases 001-005, reverting it has no cross-phase blast radius within this packet.
- **Data impact**: None. No state files, no data migrations; the audit log format (`buildAuditLine`) is unchanged by this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Groundtruth Trace | None | Shape Registry + Codex Fold-In |
| Shape Registry + Codex Fold-In | Groundtruth Trace | Severity Mapping |
| Severity Mapping | Groundtruth Trace | Regression Coverage + Full Re-run |
| Regression Coverage + Full Re-run | Shape Registry + Codex Fold-In, Severity Mapping | Phase completion |

**Cross-phase note**: none functional against phases 001-005 (the goal-hook port) — this phase is ordered 006 for packet narrative only; its dependencies above are entirely internal to this phase.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Shape |
|-------|------------|--------------|
| Groundtruth Trace | Low | 2-3 direct file reads/greps |
| Shape Registry + Codex Fold-In | Low | 4 new/moved regex entries, 1 adapter simplification |
| Severity Mapping | Low-Medium | 1 explicit branch + 1 targeted test |
| Regression Coverage + Full Re-run | Medium | ~8 new test cases, full suite re-run across 2+ test files |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [ ] Change scoped to exactly 3 files (`dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, Codex adapter) plus their test files; no adjacent-file drift.
- [ ] Full dispatch-family suite re-run captured as a baseline before and after the change.

### Rollback Procedure

1. If the full suite re-run regresses the pre-existing `opencode run`/`claude -p` coverage, revert the touched files via `git revert` or direct edit reversal.
2. Re-run the full suite to confirm the pre-change baseline is restored.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; code/regex/test changes only.
<!-- /ANCHOR:enhanced-rollback -->
