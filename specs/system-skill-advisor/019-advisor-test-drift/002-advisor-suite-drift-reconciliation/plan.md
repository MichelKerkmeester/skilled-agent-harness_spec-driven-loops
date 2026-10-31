---
title: "Implementation Plan: Advisor Suite Drift Reconciliation"
description: "Delegate a guardrailed LUNA-MAX pass to reconcile the ~32 drifted advisor tests to legitimate current behavior; parent reviews every edit for gate-weakening."
trigger_phrases:
  - "advisor suite drift plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/021-advisor-suite-drift-reconciliation"
    last_updated_at: "2026-08-15T17:14:48Z"
    last_updated_by: "claude-code"
    recent_action: "LUNA-MAX reconciled 6 clusters; default suite 40->4 failures; diff reviewed clean"
    next_safe_action: "Owner decision on the 4 residual reds (2 real regressions, corpus floor, env)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Advisor Suite Drift Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Python advisor runtime + eval harness |
| **Framework** | Vitest (default + stress), routing-accuracy capture tools |
| **Storage** | JSONL/JSON baselines, ledgers, corpus fixtures |
| **Testing** | Full `vitest run`, stress config, `tsc --noEmit` |

### Overview

Delegate a guardrailed reconciliation to GPT-5.6 LUNA MAX via cli-codex: regenerate baselines via their own tooling, update corpus/fixtures/skill-list copies to the post-merge reality, and re-point retired-skill routing vocabulary to its successor hub — never weakening a gate. The parent reviews every baseline/test/fixture edit and re-runs the suite before committing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline captured; six clusters categorized
- [x] Gate-3 packet + scope lock + guardrails for the executor

### Definition of Done
- [x] Reconcilable subset green; no gate weakened
- [x] `validate.sh --strict` exits clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Delegate, then verify every edit. The executor works scope-locked; the parent red-flag-scans (no skipped tests / removed assertions / lowered floors), reads the source diffs, and re-runs the full suite.

### Key Components

- **Capture tools** under `scripts/routing-accuracy/` (baselines/ledgers).
- **Corpus fixtures** and cross-language skill-list copies (TS + Python).
- **Scorer routing tables** re-pointed from the retired skill to `mcp-tooling`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope
- [x] Capture the baseline, create the Gate-3 packet, write the guardrailed dispatch prompt

### Phase 2: Delegate
- [x] Dispatch GPT-5.6 LUNA MAX (cli-codex) to reconcile all six clusters, scope-locked

### Phase 3: Verify
- [x] Red-flag scan + source-diff review + full-suite re-run + typecheck
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioural | Reconciled clusters green | `vitest run` (default + stress) |
| Guard | No gate weakened | diff review of every test/baseline/fixture edit |
| Structural | Packet conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-5.6-luna` | External | Green | No delegated executor |
| Landed concurrent renames/retirements | Internal | Green | Deltas would be unattributable |
| Launcher npm-ci guard (packet 020) | Internal | Green | Suite would wipe `node_modules` and hang |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a reconciled expectation turns out to mask a real regression.
- **Procedure**: revert the specific test/baseline file; every edit is independent per cluster, so blast radius stays one cluster.
<!-- /ANCHOR:rollback -->
