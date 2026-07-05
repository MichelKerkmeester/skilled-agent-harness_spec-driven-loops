---
title: "Implementation Plan: Mode-D Gate Fix + ai-council Route-Identity Fix"
description: "Replace the 8 command files' self-classification gate with a deterministic dispatch-context check, and land the ai-council identity fix across orchestrate-topic.cjs and deep_ai-council_auto.yaml in the same change."
trigger_phrases:
  - "implementation"
  - "plan"
  - "mode d gate fix"
  - "ai-council route identity fix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/006-mode-d-ai-council-identity-fix"
    last_updated_at: "2026-07-01T13:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 009"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs"
      - ".opencode/commands/deep/assets/deep_ai-council_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-008-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Mode-D Gate Fix + ai-council Route-Identity Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command files, CommonJS (`.cjs`), YAML workflow assets |
| **Framework** | OpenCode `/deep:*` command router, deep-loop-runtime fan-out |
| **Storage** | Filesystem — command markdown, JSONL round-completion state |
| **Testing** | grep-based absence checks, ai-council round-completion smoke, `validate.sh --strict` |

### Overview

Two independently-verifiable, low-risk fixes bundled per research/research.md §4 item 1: (1) remove the Phase-0 self-classification prose from all 8 `/deep:*` command files, replacing it with a check grounded in actual dispatch context rather than model self-report; (2) reconcile `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml`'s `mode`/`target_agent` values from `council`/`deep-ai-council` to `ai-council`, matching `mode-registry.json`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 007 research read and cited (research.md §2, §3, §4 item 1).
- [x] Current state of all 8 command files' Phase-0 blocks confirmed structurally identical (not byte-identical — each substitutes its own loop name/command).
- [x] `git status` on `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml` checked before editing — found live in-flight WIP (see implementation-summary.md).

### Definition of Done
- [x] All 8 command files' Phase-0 block replaced with the deterministic check.
- [x] `orchestrate-topic.cjs:310-313` and `deep_ai-council_auto.yaml:132-136` both updated to `ai-council` in the same change.
- [x] grep confirms zero remaining self-classification prose across the 8 files.
- [x] ai-council round-completion smoke confirms route-proof still passes (via full vitest suite, 76/76).
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deterministic dispatch-context check replacing self-report; two-file atomic identity reconciliation against a registry source of truth.

### Key Components

- **8 `/deep:*` command files**: each carries an identical "PHASE 0" block; the fix is the same replacement text applied 8 times, not 8 independent designs.
- **`orchestrate-topic.cjs`**: emits the JSONL round-completion record consumed by the validator.
- **`deep_ai-council_auto.yaml`**: declares the `route_proof` block the validator checks the record against.
- **`mode-registry.json`**: unchanged; already correct (`ai-council` entry). Source of truth, not touched by this phase.

### Data Flow

Council round completes → `orchestrate-topic.cjs` appends a JSONL record with `mode`/`target_agent` → `post_dispatch_validate` (in the YAML) checks the record's fields against its own `route_proof` block → after this fix, both the record and the `route_proof` block read `ai-council`, matching what `mode-registry.json` and the council's own emitted header already say.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 8× `.opencode/commands/deep/*.md` | Advisory self-classification gate (Mode D source) | Replace with deterministic dispatch-context check | grep: zero remaining self-check prose |
| `orchestrate-topic.cjs:310-313` | Emits `mode:'council'`/`target_agent:'deep-ai-council'` | Change to `mode:'ai-council'`/`target_agent:'ai-council'` | grep + round-completion smoke |
| `deep_ai-council_auto.yaml:132-136` | Validates against `mode: council`/`target_agent: deep-ai-council` | Change `route_proof` block to `ai-council` | grep + round-completion smoke |

Required inventories:
- Same-class producers: all 8 command files share the identical Phase-0 block text — confirm via diff before editing to catch any that have already drifted.
- Consumers: `post_dispatch_validate` in the YAML is the sole consumer of the `route_proof` block; no other file references the old `council`/`deep-ai-council` values (confirm via grep before landing).
- Algorithm invariant: the `.cjs` emitter and the YAML validator must always agree with each other AND with `mode-registry.json` — this phase restores the second half of that invariant, which the earlier code silently violated.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all 8 command files' Phase-0 blocks; confirmed structurally identical (not byte-identical).
- [x] Read `orchestrate-topic.cjs:295-325` and `deep_ai-council_auto.yaml:115-140` in full surrounding context.
- [x] Resolved the dispatch-context signal question: no runtime API exists for a markdown contract, so the check is evidence-based prose defaulting to PROCEED on ambiguity.
- [x] `git status`/`git diff` both ai-council target files: found live in-flight WIP (new `route_fields`/`resolved_route_header` additions already using correct `ai-council` values, for a different purpose); completed the wiring rather than duplicating it.

### Phase 2: Core Implementation
- [x] Replaced the Phase-0 block in all 8 command files with the deterministic check.
- [x] Edited `orchestrate-topic.cjs:310-313`: `mode`, `target_agent`, `resolved_route` → `ai-council`.
- [x] Edited `deep_ai-council_auto.yaml:132-136`: `route_proof.mode`, `route_proof.target_agent`, `route_proof.resolved_route` → `ai-council`.

### Phase 3: Verification
- [x] grep all 8 files: zero remaining self-classification prose confirmed.
- [x] grep both ai-council files: zero remaining `council`/`deep-ai-council` values confirmed.
- [x] Ran the actual vitest suite (`deep-ai-council/scripts/tests/`, 9 files, 76/76 pass) — route-proof passes.
- [x] Ran `validate.sh --strict` for this phase folder — passing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static/grep | Absence of self-classification prose across 8 files | `rg`/`grep` |
| Static/grep | Registry-aligned values in both ai-council files | `rg`/`grep` |
| Smoke | ai-council round-completion route-proof | Existing test harness or minimal repro dispatch |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 007 research | Predecessor | Complete | Fix targets would be unconfirmed |
| `mode-registry.json` `ai-council` entry | Source of truth | Confirmed correct | Fix would have no target to converge on |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: ai-council round-completion smoke starts failing route-proof post-fix, or a command file's replaced Phase-0 block breaks dispatch-context detection in practice.
- **Procedure**: Revert both ai-council files together (never one alone — see REQ-003); revert command-file changes independently since they're unrelated to the ai-council identity fix and can be rolled back separately if only one side regresses.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 007 research -> Phase 008 (this phase) -> Phase 009 orchestrate hardening
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 009, Phase 010 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small |
| Core Implementation | Low-Medium | Small (8 near-identical edits + 2 coordinated edits) |
| Verification | Low | Small |
| **Total** | | **Small** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No persisted data migration.
- [ ] Both ai-council files diffed together before commit (atomic pair).
- [ ] `git status` checked for unrelated in-flight ai-council work before editing.

### Rollback Procedure
1. Revert `orchestrate-topic.cjs` and `deep_ai-council_auto.yaml` together.
2. Revert any of the 8 command files independently if only the Mode-D fix regresses.
3. Re-run grep checks and `validate.sh --strict`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File revert only.
<!-- /ANCHOR:enhanced-rollback -->

---
