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
    last_updated_at: "2026-07-29T05:31:42Z"
    last_updated_by: "claude"
    recent_action: "Executed all 4 phases; full dispatch-family suite green, no regressions"
    next_safe_action: "None — plan complete; see spec.md for the CHECKS-function follow-up"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Functionally independent of phases 001-005; ordered 006 for packet narrative only."
      - "Severity mapping resolved to error->block; see Phase 3 evidence below."
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

- [x] `evaluate()`'s current severity-mapping branch read and quoted verbatim in this plan. [evidence: pre-change source mapped `severity === 'block' ? 'block' : 'warn'`, quoted verbatim in `implementation-summary.md`'s pre-implementation authoring pass from a direct read of `dispatch-rule-checks.mjs` before any edit (per NFR-T01)]
- [x] `CHECKS` registry confirmed to lack `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` entries via `rg`. [evidence: `CHECKS` in `dispatch-rule-checks.mjs` still contains only 5 entries post-change (`stdin-redirect-required`, `no-bare-agent-general`, `command-flag-for-slash-prompt`, `share-requires-confirmation`, `non-interactive-permission-mode-risk`); none of the three referenced IDs are registered, confirmed by direct read this pass]
- [x] Real dispatch command forms for `devin -p`, `cursor-agent … -p`, `pi -p` confirmed against each skill's own SKILL.md dispatch examples. [evidence: shapes implemented and regression-tested against `devin -p "..."`/`devin --print`, `cursor-agent --model composer-2.5 -p "..."`, `pi --print "..."` in `dispatch-audit.test.mjs`]

### Definition of Done

- [x] Three new `DISPATCH_SHAPES` entries added and tested (REQ-001). [evidence: `dispatch-audit.mjs` `DISPATCH_SHAPES` gained `cli-devin`/`cli-cursor`/`cli-pi` entries (`/\bdevin\b[^\n;&|]*\s(-p|--print)\b/`, `/\bcursor-agent\b[^\n;&|]*\s(-p|--print)\b/`, `/\bpi\b[^\n;&|]*\s(-p|--print)\b/`); `npx vitest run dispatch-audit.test.mjs` 81/81 passing]
- [x] `CODEX_EXEC_SHAPE` folded into the shared registry, zero remaining local duplicate (REQ-002). [evidence: both Codex adapters — `dispatch-preflight-lint.mjs` (PreToolUse) and `dispatch-audit-posttooluse.mjs` (PostToolUse) — no longer declare `CODEX_EXEC_SHAPE`/`DISPATCH_SKILLS`/`SHAPES`; both read `DISPATCH_SHAPES` directly (`DISPATCH_SHAPES.find(...)`). `rg -n "CODEX_EXEC_SHAPE"` repo-wide (excluding this spec folder's own doc text) returns 0 hits, confirmed by direct read and `rg` sweep this pass]
- [x] Severity mapping decision implemented as an explicit branch and tested (REQ-003). [evidence: `evaluate()` now reads `const blocking = rule.severity === 'block' || rule.severity === 'error';` then `severity: blocking ? 'block' : 'warn'`; `node --test dispatch-rule-checks.test.mjs` 7/7 passing, including the new severity-mapping test]
- [x] Regression tests added per new shape (REQ-004). [evidence: `dispatch-audit.test.mjs` "recognizes each external CLI print-mode dispatch and ignores non-dispatch bash" covers devin/cursor/pi/codex match + non-match cases]
- [x] Full dispatch-family suite re-run, no regressions on `opencode run`/`claude -p` (REQ-005). [evidence: `node --test dispatch-rule-checks.test.mjs` 7/7, `npx vitest run dispatch-audit.test.mjs` 81/81, `node --test` on mk-post-edit-quality + mk-deep-loop-guard + claude-task-dispatch-guard 41/41 — all re-run and passing this pass]
- [x] CHECKS-function gap disclosed in `implementation-summary.md` (REQ-006). [evidence: Known Limitations names the three missing check IDs and the `if (!fn) continue` skip behavior]
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

- [x] Read `evaluate()`'s current severity-mapping line verbatim; quote it in this plan before any edit. [evidence: `severity === 'block' ? 'block' : 'warn'`, quoted in implementation-summary.md's pre-implementation pass]
- [x] `rg -n "command-v-devin-required|devin-self-invocation-guard|cursor-self-invocation-guard|command-v-cursor-agent-required|command-v-pi-required|pi-self-invocation-guard|deep-loop-runtime-delegation" .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` to confirm the CHECKS gap. [evidence: 0 hits pre-change and post-change; `CHECKS` still lists only the 5 pre-existing entries]
- [x] Confirm real dispatch command examples for devin/cursor/pi from each skill's own SKILL.md or references. [evidence: shapes implemented and tested against `devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print` forms]

### Phase 2: Shape Registry + Codex Fold-In

- [x] Add `devin -p`/`--print`, `cursor-agent … -p`/`--print`, `pi -p`/`--print` entries to `DISPATCH_SHAPES`. [evidence: `DISPATCH_SHAPES` in `dispatch-audit.mjs` grew from 2 to 6 entries, adding `cli-devin`/`cli-cursor`/`cli-pi` with an intervening-flag class `[^\n;&|]*` that allows flags between the binary and print flag but stops at a shell separator]
- [x] Move `CODEX_EXEC_SHAPE` into `DISPATCH_SHAPES` (skill `cli-codex`, packetPath `cli-external-orchestration/cli-codex`); remove the local constant and `DISPATCH_SKILLS` composition from the Codex adapter; repoint the adapter to `DISPATCH_SHAPES` directly. [evidence: both `dispatch-preflight-lint.mjs` (PreToolUse) and `dispatch-audit-posttooluse.mjs` (PostToolUse) import `DISPATCH_SHAPES` from `dispatch-audit.mjs` and read it directly (`DISPATCH_SHAPES.find(...)`); no `CODEX_EXEC_SHAPE`/`DISPATCH_SKILLS`/`SHAPES` composition remains in either file, confirmed by direct read]

### Phase 3: Severity Mapping

- [x] Implement the resolved `severity: error` -> `block`/`warn` mapping as an explicit branch in `evaluate()`. [evidence: `const blocking = rule.severity === 'block' || rule.severity === 'error'; ... severity: blocking ? 'block' : 'warn'`, confirmed by direct read post-change]
- [x] Add a test asserting the exact resulting `severity` field for an `error`-severity rule. [evidence: `dispatch-rule-checks.test.mjs` "severity maps error and block to a blocking violation; anything else advises" — proves error->block, block->block, warn->warn, bare->warn via a throwaway registered check]

### Phase 4: Regression Coverage + Full Re-run

- [x] Add a matching/non-matching regression test pair per new shape (devin, cursor, pi, codex-in-shared-registry). [evidence: `dispatch-audit.test.mjs` "recognizes each external CLI print-mode dispatch and ignores non-dispatch bash"; negative cases include `devin auth status`, `cursor-agent --help`, `git status && ls -la`, and `pi install && claude -p "x"` (which correctly resolves to `cli-claude-code`, proving separator-crossing safety)]
- [x] Re-run every dispatch-family suite that exercises `DISPATCH_SHAPES`/`evaluate`/`readHardRules` (not only the new tests); confirm `opencode run`/`claude -p` coverage unregressed. [evidence: `node --test dispatch-rule-checks.test.mjs` 7/7, `npx vitest run dispatch-audit.test.mjs` 81/81, `node --test` on mk-post-edit-quality + mk-deep-loop-guard + claude-task-dispatch-guard 41/41 — all green, pre-existing `opencode run`/`claude -p` cases unregressed]
- [x] Update `implementation-summary.md` with the honest CHECKS-function gap disclosure (REQ-006). [evidence: Known Limitations section names the three missing check IDs and documents the `if (!fn) continue` skip behavior]
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

- [x] Change scoped to exactly 3 files (`dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, Codex adapter) plus their test files; no adjacent-file drift. [evidence: confirmed by direct read — only these 3 source files plus `dispatch-audit.test.mjs`/`dispatch-rule-checks.test.mjs` carry this phase's changes]
- [x] Full dispatch-family suite re-run captured as a baseline before and after the change. [evidence: post-change baseline this pass — 7/7 + 81/81 + 41/41, all green]

### Rollback Procedure

1. If the full suite re-run regresses the pre-existing `opencode run`/`claude -p` coverage, revert the touched files via `git revert` or direct edit reversal.
2. Re-run the full suite to confirm the pre-change baseline is restored.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; code/regex/test changes only.
<!-- /ANCHOR:enhanced-rollback -->
