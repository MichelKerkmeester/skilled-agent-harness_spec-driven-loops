---
title: "Feature Specification: deep-review gate-model reconciliation (001-gate-model-reconciliation)"
description: "Reconcile the legal-stop gate model across 6 deep-review documentation surfaces against the authoritative 9-gate shape emitted by both deep_start-review-loop YAML workflows. Closes the gate-model drift cluster (LG-0013/0016/0031/0032) surfaced by 003-deep-review phase-5 deep-research."
trigger_phrases:
  - "gate model reconciliation"
  - "001-gate-model-reconciliation"
  - "legal-stop gate bundle"
  - "9-gate authoritative model"
  - "gate count drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/008-deep-review-gate-model-reconciliation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "spec-authored"
    next_safe_action: "reconcile-6-surfaces"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000006001"
      session_id: "131-000-006-gate-model"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Authoritative gate model: 9 gates with Gate suffix, emitted by both deep_start-review-loop_{auto,confirm}.yaml at the blocked_stop append_jsonl step"
      - "Reducer (reduce-state.cjs) is gate-name-agnostic (opaque-string passthrough); not a constraint on the model"
      - "Documentation level: 2 (multi-file doc alignment, 100-499 LOC, no code changes)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-review gate-model reconciliation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup` |
| **Origin** | Follow-on remediation of the gate-model drift cluster surfaced by `003-deep-review` phase-5 deep-research (LG-0013, LG-0016, LG-0031, LG-0032) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-review legal-stop gate model has drifted across documentation surfaces. The `003-deep-review` phase-5 deep-research loop surfaced a 4-gap cluster (LG-0013, LG-0016, LG-0031, LG-0032) plus a deeper finding during this packet's investigation: the AUTHORITATIVE producer (both `deep_start-review-loop_{auto,confirm}.yaml` workflows) emits **9 gates** with the `Gate` suffix at the `step_emit_blocked_stop` append_jsonl step, but every documentation surface describes a different, incomplete model:

| Surface | Gate count | Naming | Drift |
|---|---:|---|---|
| YAML workflows (PRODUCER, authoritative) | 9 | Gate-suffix | baseline |
| `references/convergence.md` §Section-1 event example | 7 | Gate-suffix | missing `candidateCoverageGate` + `graphlessFallbackGate` |
| `references/convergence.md` §6 table | 6 (+1 mapping row from 003 iter-9 fix) | mixed | missing candidate + graphless gates |
| `references/loop_protocol.md` §Step-2 | 7 (post 003 iter-9 fix) | Gate-suffix | missing candidate + graphless gates |
| `references/state_format.md` blocked_stop schema | 7 | Gate-suffix | `candidateCoverageGate` + `graphlessFallbackGate` undocumented |
| `feature_catalog/04--severity-system/05-quality-gates.md` | named in passing | n/a | gate names not enumerated |
| `manual_testing_playbook/.../review-quality-guards-block-premature-stop.md` | 3 | family-level | claims 3 gates vs 9 |
| `scripts/reduce-state.cjs` | N/A | opaque passthrough | reads gate names generically, enforces nothing |

### Purpose

Reconcile all 6 documentation surfaces to the authoritative 9-gate model emitted by the YAML workflows, so a reader of any surface sees the same gate set with the same names. The reducer is confirmed gate-name-agnostic, so no code change is required; this is a pure documentation-alignment packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `references/convergence.md` §Section-1 blocked_stop event example to include all 9 gates in `gateResults`.
- Update `references/convergence.md` §6 LEGAL-STOP GATE BUNDLE table to enumerate all 9 gates with their event-shape names.
- Update `references/loop_protocol.md` §Step-2 gate list from 7 to 9.
- Document `candidateCoverageGate` + `graphlessFallbackGate` in `references/state_format.md` blocked_stop event schema.
- Enumerate all 9 gate names in `feature_catalog/04--severity-system/05-quality-gates.md`.
- Update `manual_testing_playbook/04--convergence-and-recovery/review-quality-guards-block-premature-stop.md` to reference the 9-gate model (or the gate-family framing reconciled with the 9 names).

### Out of Scope

- Behavioral changes to `scripts/reduce-state.cjs` (confirmed gate-name-agnostic; no change needed).
- Changes to the YAML workflows (`deep_start-review-loop_{auto,confirm}.yaml`), they are the AUTHORITATIVE source, read-only here.
- The other 20 deferred phase-5 gaps from `003-deep-review` (reducer drift, feature_catalog additions, CP test coverage), separate follow-on packets.
- SKILL.md §2 SMART ROUTING (unaffected; preserved per the 003 ADR-004 precedent).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `references/convergence.md` | Modify | §Section-1 event example 7→9 gates; §6 table 7→9 rows |
| `references/loop_protocol.md` | Modify | §Step-2 gate list 7→9 |
| `references/state_format.md` | Modify | Document candidate + graphless gates in blocked_stop schema |
| `feature_catalog/04--severity-system/05-quality-gates.md` | Modify | Enumerate 9 gate names |
| `manual_testing_playbook/04--convergence-and-recovery/018-*.md` | Modify | 9-gate reference |
| `.opencode/skills/deep-review/changelog/v1.10.0.0.md` | Create | Reconciliation changelog entry |
| `.opencode/skills/deep-review/SKILL.md` | Modify | version bump 1.9.0.0 → 1.10.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 doc surfaces enumerate the same 9 gates with the same `Gate`-suffix names | `grep` for all 9 gate names returns hits in each reconciled surface |
| REQ-002 | The 9-gate set matches the YAML `step_emit_blocked_stop` emission verbatim | Gate names in docs match `deep_start-review-loop_auto.yaml:573` gateResults keys |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | LG-0013, LG-0016, LG-0031, LG-0032 all closed | Each gap's surface no longer drifts from the 9-gate model |
| REQ-011 | Changelog v1.10.0.0 authored + SKILL.md version bumped | `grep version: SKILL.md` returns 1.10.0.0 |
| REQ-012 | HVR clean on all edited surfaces | 0 em-dashes, 0 prose semicolons, 0 banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 doc surfaces describe the identical 9-gate model with `Gate`-suffix names matching the YAML producer.
- **SC-002**: Strict validate exits 0 on this spec folder.
- **SC-003**: `003-deep-review` gate-model cluster (LG-0013, LG-0016, LG-0031, LG-0032) is fully closed (cross-referenced in this packet's implementation-summary).
- **SC-004**: No behavioral change to reducer or YAML workflows (verified by git diff scope).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing convergence.md §6 cascades into other cross-references | Medium | Grep for §6 anchor refs before editing; preserve anchor IDs |
| Risk | The 9-gate model itself drifts further if YAML changes later | Low | Document the YAML `step_emit_blocked_stop` as the canonical source-of-truth in each surface |
| Dependency | `deep_start-review-loop_{auto,confirm}.yaml` (authoritative source) | Read-only; verified present | Both confirmed emitting 9 gates at lines 573/581 |
| Dependency | Strict validator | Phase exit blocked if missing | Verified present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No runtime behavior change. This is a docs-only reconciliation. The reducer's gate-name-agnostic passthrough means doc edits cannot break the loop.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Gate added/removed in YAML later**: docs reference the YAML `step_emit_blocked_stop` as canonical, so a future gate change has one obvious source to re-sync from.
- **candidateCoverageGate + graphlessFallbackGate are v2-rollout gates**: they only fire when the review-depth-v2 path is active. Docs note their conditional nature.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 6 doc surfaces + 1 changelog + 1 version bump, roughly 150-250 LOC of edits |
| Risk | 6/25 | docs-only, no code/YAML change, cross-ref preservation needed |
| Research | 4/20 | investigation already complete (9-gate authoritative model confirmed) |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The authoritative gate model was confirmed during investigation and the reducer was verified gate-name-agnostic.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Origin packet**: `../003-deep-review/research/convergence-summary.md` (gate-model drift cluster, meta-pattern 1)
- **Origin findings**: `../003-deep-review/research/iterations/iter-09-cli-devin.json` (LG-0031, LG-0032), `iter-02-cli-devin.json` (LG-0013), `iter-03-cli-devin.json` (LG-0016)
- **Authoritative source**: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` §step_emit_blocked_stop (line 573), `deep_start-review-loop_confirm.yaml` (line 581)
