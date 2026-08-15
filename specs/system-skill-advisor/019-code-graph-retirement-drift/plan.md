---
title: "Implementation Plan: Code-Graph Retirement Test Drift"
description: "Harden the scorer against null/retired skill ids, regenerate only cleanly-attributable derived artifacts, and triage the rest — delegated to a guardrailed SOL-HIGH pass."
trigger_phrases:
  - "code-graph retirement drift plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/019-code-graph-retirement-drift"
    last_updated_at: "2026-08-15T14:37:23Z"
    last_updated_by: "claude-code"
    recent_action: "Scorer null-id crash fixed via SOL-HIGH; remaining suite failures triaged"
    next_safe_action: "Owner decision on the unrelated drift and the corpus-authoring subset"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Code-Graph Retirement Test Drift

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), Node |
| **Framework** | OpenCode advisor MCP-server scorer |
| **Storage** | JSONL corpus / holdout / baseline artifacts |
| **Testing** | Vitest (default + stress configs) |

### Overview

Delegate a guardrailed remediation to GPT-5.6 SOL HIGH via cli-codex: harden the scorer so a null / retired skill id is skipped rather than dereferenced, regenerate only the derived artifacts whose delta is cleanly attributable to the retirement, and triage the rest honestly. The parent reviews every change to confirm no gate was weakened.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline suite captured
- [x] Gate-3 packet + scope lock defined for the executor

### Definition of Done
- [x] Crash cluster green, no gate weakened
- [x] `validate.sh --strict` exits clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Delegate the fix, verify the diff. The executor works scope-locked; the parent reviews every test/baseline touch and re-runs the focused suite.

### Key Components

- **Scorer guards**: `text.ts`, `explicit.ts`, `fusion.ts` — skip malformed projection entries.
- **Holdout builder guard**: `build-holdout.mjs` — skip unlabeled corpus rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scope
- [x] Capture the baseline, create the Gate-3 packet, write the guardrailed dispatch prompt

### Phase 2: Delegate
- [x] Dispatch GPT-5.6 SOL HIGH (cli-codex) to fix the crash + triage, scope-locked to the advisor

### Phase 3: Verify
- [x] Review the diff (source guards only, no gate edits); re-run focused scorer + state-containment; typecheck exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioural | Crash cluster no longer red | `vitest run tests/scorer/` |
| Structural | Packet conformance | `validate.sh --strict` |
| Guard | No gate weakened | diff review of every test/baseline path |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-5.6-sol` | External | Green | No delegated executor |
| `build-holdout.mjs` regen tool | Internal | Green | No safe holdout regeneration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scorer guard changes routing for a valid skill.
- **Procedure**: revert the four source files; the guards are additive and only affect null/blank-id entries, so blast radius is contained.
<!-- /ANCHOR:rollback -->
