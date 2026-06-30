---
title: "Implementation Plan: adopt the designer-skills-main audit findings into sk-design"
description: "Per-file build plan applying the design-audit slice of the 024 backlog into the live audit references via cli-codex gpt-5.5 high fast, scope-locked, with per-diff verification and read-first skip-if-present discipline."
trigger_phrases:
  - "audit adoption plan designer-skills"
  - "visual-critique crosswalk plan"
  - "sk-design audit build plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/025-audit-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the audit-slice build plan and edit map"
    next_safe_action: "Verify the audit diff, then finalize and validate phase 025"
    blockers: []
    key_files:
      - "spec.md"
      - "../024-designer-skills-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-025-audit-adoption"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: adopt the designer-skills-main audit findings into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown design-guidance docs in the sk-design audit mode |
| **Framework** | system-spec-kit phase; cli-codex gpt-5.5 high fast as the edit executor |
| **Storage** | n/a |
| **Testing** | `validate.sh --strict`; per-diff scope-lock review; read-first skip-if-present |

### Overview
Apply the audit slice of `../024-designer-skills-research/research/research.md` into the four live audit references via one scope-locked cli-codex dispatch. Codex reads current state, adds only net-new items, and the orchestrator verifies the diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 024 backlog names the audit-targeted items + files
- [x] The four audit reference files confirmed present
- [x] Executor confirmed (cli-codex gpt-5.5 high fast, workspace-write)

### Definition of Done
- [x] Audit-targeted items applied additively; nothing already-present duplicated
- [x] Visual-critique is a crosswalk onto existing severity
- [x] `validate.sh --strict` clean for the packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Anchor-scoped additive edits to existing audit references, applied by a single scope-locked codex dispatch and verified by the orchestrator.

### Key Components
- **cli-codex gpt-5.5 high fast**: reads each audit file, adds the named items at fitting anchors, skips present content.
- **Orchestrator**: writes the scope-locked prompt, verifies the diff, reverts on drift.

### Data Flow
024 backlog → scope-locked prompt → codex edit at audit anchors → diff review → accept or revert.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Each surface is edited additively. Adjacent content is not rewritten.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-audit/references/critique_hardening.md` | critique workflow + lenses | add visual-critique crosswalk + perceived-quality lens | diff shows additive lens blocks |
| `design-audit/references/anti_patterns_production.md` | production anti-patterns | add component completeness, localization stress, token-tier, pseudo-loc | diff shows new detectors after existing ones |
| `design-audit/references/accessibility_performance.md` | a11y/perf | add modality coverage, optional POUR scaffold | diff shows additive checklist |
| `design-audit/references/evidence_capture.md` | evidence rules | add evidence-impact guard | diff shows the guard |

Required inventories:
- Same-class producers: additive guidance; no shared symbol changes.
- Consumers of changed symbols: none — human-read audit docs.
- Matrix axes: backlog audit items × their audit references; skip-if-present applies to every edit.
- Algorithm invariant: visual-critique is a crosswalk, never a second score; no impact claims without evidence.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase folder + spec/plan/tasks scaffolded
- [x] Audit files confirmed; executor confirmed
- [x] Scope-locked codex prompt authored

### Phase 2: Core Implementation
- [x] Dispatch the audit-slice codex edit
- [x] Codex adds crosswalk, perceived-quality lens, hardening bundle, token/evidence guards; skips present content

### Phase 3: Verification
- [x] Diff scope-lock verified; no duplication; crosswalk-not-score preserved
- [x] `validate.sh --strict` clean; phase docs finalized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (doc edits) | n/a |
| Integration | Audit-mode internal consistency | Read/Grep |
| Manual | Per-diff scope-lock + skip-if-present + crosswalk verification | git diff, Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 024 backlog | Internal (read-only) | Green | No build spec |
| Live audit references | Internal | Green | Nothing to edit |
| cli-codex gpt-5.5 high fast | External | Green | Edits cannot be applied |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An edit drifts scope, duplicates content, or breaks a doc.
- **Procedure**: `git checkout -- <file>` to revert the specific audit file, then re-dispatch with a tighter prompt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Audit dispatch ──► Verify ──► Finalize
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verify |
| Verify + finalize | Dispatch | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | scaffolded |
| Audit dispatch | Med | one focused codex dispatch |
| Verify + finalize | Med | diff review + wrapper docs + validation |
| **Total** | | **1 dispatch + verify** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The 024 deliverable is preserved and unaffected
- [x] The audit files are under git, so per-file revert is clean
- [x] The dispatch is verified before finalizing

### Rollback Procedure
1. Identify the drifted file from the diff review
2. `git checkout -- <file>` to restore its pre-dispatch state
3. Re-dispatch with a tighter scope-locked prompt

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ 024 backlog (audit)   │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ codex audit dispatch  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ diff verify → finalize│
└──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 024 backlog | (read-only) | edit spec | the dispatch |
| codex dispatch | backlog | live audit edits | verification |
| verify + finalize | dispatch | validated phase | 026 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scope-locked audit dispatch** - the live edits - CRITICAL
2. **Diff verification** - scope-lock + no-duplication + crosswalk-not-score - CRITICAL
3. **Validation** - strict packet validation - CRITICAL

**Total Critical Path**: Setup → dispatch → verify → validate.

**Parallel Opportunities**:
- The 026/027 prompts can be prepared while this dispatch runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit edits live | crosswalk + perceived-quality + hardening + guards applied | Phase 2 |
| M2 | Verified | diff scope-locked, no duplication, crosswalk-not-score | Phase 3 |
| M3 | Validated | strict validation clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN ADDENDUM
- L2/L3 sections present
- Build cluster: one scope-locked cli-codex dispatch, orchestrator verifies the diff
-->
