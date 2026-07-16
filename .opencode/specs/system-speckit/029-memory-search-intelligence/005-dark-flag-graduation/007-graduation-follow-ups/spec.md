---
title: "Feature Specification: Dark Flag Graduation Follow-Ups"
description: "Phase parent for the production-readiness follow-ups the 009 pre-graduation validation identified, so each dark-flag winner can earn its flip on evidence rather than on a conditional verdict. The code-graph track sets a sensible degree-cap default and wires the bitemporal close-and-insert writer into the reindex path with a live integration test. The deep-loop track sets production defaults for the lag ceiling and progress heartbeat and proves they inform without flooding, plus a scale-test for the finding dedup beyond its synthetic records. The search track adds an append-exempt path so tail-appended rows survive the response-serialization token budget, and a density probe for the true-citation ledger. The advisor track documents and tests the implicit self-recommendation penalty that the cut guard relied on. Every change stays behind its existing default-off flag, with the lone deliberate exception of the deep-loop gauge defaults, which become active and are flood-tested."
trigger_phrases:
  - "dark flag graduation follow-ups"
  - "production readiness for the graduated flags"
  - "wire the bitemporal writer"
  - "set the degree cap and gauge defaults"
  - "append-exempt serializer and citation density probe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/005-dark-flag-graduation/007-graduation-follow-ups"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase parent scaffolded with four graduation follow-up child phases"
    next_safe_action: "Resume 003 search append and citation probe to complete the packet"
    blockers: []
    key_files:
      - "spec.md"
      - "001-codegraph-defaults-bitemporal/spec.md"
      - "001-search-append-citation-probe/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-24-028-010-graduation-follow-ups-parent"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Each follow-up maps to one subsystem child phase with its own flag and proof."
      - "Gauge defaults are the only deliberate flip, activated and flood-tested in 002."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Dark Flag Graduation Follow-Ups

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-24 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Predecessor** | ../006-dark-flag-validation/spec.md |
| **Successor** | ../008-followup-deep-review/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 009 validation confirmed the dark-flag winners are correct and byte-identical when off, but qualified the graduate-ready posture: the bitemporal writer is unwired, the staleness degree cap and the deep-loop gauges default to off, the dedup was only proven on synthetic records, and the cut self-recommendation guard left an undocumented implicit penalty as the sole defense. Each gap must close so a flip decision rests on evidence rather than on a conditional verdict.

### Purpose
Define the graduation follow-up root purpose and child phase map across four subsystems. Each child phase owns one subsystem, lands its change behind the feature's existing default-off flag, with the lone deliberate exception of the deep-loop gauge defaults, and proves byte-identity or flood-safety through a cli test pass before any completion claim.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Code graph:** a non-zero degree-cap default, and the bitemporal close-and-insert writer wired into the reindex edge-replacement path behind `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`, with a live integration test.
- **Deep loop:** production defaults for the lag ceiling and the progress heartbeat that inform without flooding under concurrent pools, and a scale-test for the finding dedup.
- **Search:** an append-exempt path so tail-appended rows survive the response-serialization token budget, and a density probe for the true-citation ledger.
- **Advisor:** a documented, tested contract for the implicit `auditRecsAdvisorPenalty` so a future refactor cannot silently remove the sole self-recommendation defense.

### Out of Scope
- Flipping any production default to on, except the gauge defaults which this packet deliberately activates and flood-tests.
- The multihop production reader-depth measurement, which needs production telemetry and is deferred.
- The advisor RRF fusion, which 009 cleared with no change required.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | parent | Root purpose and child map |
| `description.json` | Create | parent | Search metadata for this phase parent |
| `graph-metadata.json` | Create | parent | Child identity and phase graph metadata |
| `001-codegraph-defaults-bitemporal/spec.md` | Create | 001 | Defines scope and acceptance criteria |
| `002-deeploop-gauges-dedup-scale/spec.md` | Create | 002 | Defines scope and acceptance criteria |
| `001-search-append-citation-probe/spec.md` | Create | 003 | Defines scope and acceptance criteria |
| `004-advisor-penalty-contract/spec.md` | Create | 004 | Defines scope and acceptance criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-codegraph-defaults-bitemporal/` | Degree-cap default and bitemporal writer wiring | COMPLETE |
| 002 | `002-deeploop-gauges-dedup-scale/` | Gauge production defaults and finding dedup scale-test | COMPLETE |
| 003 | `001-search-append-citation-probe/` | Append-exempt serializer and citation density probe | IN PROGRESS |
| 004 | `004-advisor-penalty-contract/` | Documented, tested self-recommendation penalty contract | COMPLETE |

### Phase Transition Rules

- Each child phase must pass `validate.sh` independently before the next phase begins.
- Each follow-up lands behind the feature's existing default-off flag, with the gauge defaults as the lone deliberate exception.
- Parent status changes only after every child strict validation passes.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Select one subsystem follow-up | Child `spec.md` names scope, flag and acceptance criteria |
| child | parent | Child follow-up reaches strict validation green | `validate.sh <child> --strict` exits 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for the scaffold. Per-subsystem findings belong in the selected child phase during execution.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-codegraph-defaults-bitemporal/` through `004-advisor-penalty-contract/`
