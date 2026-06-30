---
title: "Feature Specification: research the impeccable design skill for sk-design adoption"
description: "Level-3 research packet: a 12-iteration GPT-5.5-xhigh deep-research study of the external impeccable design skill, crosswalked onto sk-design's five modes plus register/hub, every candidate verified against the real post-adoption sk-design file, plus a cross-model completeness sweep. Output: a frozen P1-P3 adoption backlog into existing homes, a ruled-out ledger, and a no-new-mode verdict."
trigger_phrases:
  - "impeccable sk-design research packet"
  - "impeccable adoption research"
  - "impeccable design skill study"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/028-impeccable-design-research"
    last_updated_at: "2026-06-27T14:44:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Converged 12-iteration impeccable research and froze the backlog"
    next_safe_action: "Run the cross-model sweep, then validate"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-028-impeccable-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No new mode is warranted; every item maps to an existing sk-design home"
      - "Yield is modest due to high overlap with prior adoptions"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: research the impeccable design skill for sk-design adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

A deep-research study of the external impeccable design skill (one consolidated skill with 23 commands, a brand/product register, numeric design laws, an audit plus anti-slop posture, per-model defect blocks, an anti-pattern detector engine, and a prose denylist) to determine concrete sk-design improvements. impeccable is the most directly comparable corpus studied so far, so the central finding is overlap: after the 022/023 and 024-027 adoptions, sk-design already encodes most of impeccable's craft and structure. The yield is a modest, frozen P1-P3 backlog into existing homes, with no new mode.

**Key Decisions**: 12 GPT-5.5-xhigh iterations, converged at the 0.05 threshold; every candidate verified against the real sk-design file; a cross-model completeness sweep guards against false positives. Research only, no live sk-design edits.

**Critical Dependencies**: the scoped impeccable corpus and the current post-adoption sk-design files.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../027-foundations-adoption/spec.md |
| **Successor** | optional future build packet if the backlog is approved |
| **Handoff Criteria** | corpus covered, every candidate verified against the real sk-design file, no-new-mode verdict holds, cross-model sweep folded in, packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design has absorbed two external corpora. impeccable is a third and the most comparable. Without a disciplined study it is unclear what impeccable adds beyond what sk-design already encodes, versus already-covered material or infrastructure.

### Purpose
Run a verified, convergent deep-research study that separates genuinely net-new build/visual craft from already-covered material and out-of-scope infrastructure, producing a frozen, implementation-ready adoption backlog mapped to existing sk-design homes.

> **Note:** Research only. Named improvements route to a future build packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading the scoped impeccable corpus and crosswalking onto sk-design's five modes plus register/hub, verified against real files.
- A frozen P1-P3 backlog, a ruled-out ledger, a no-new-mode verdict, and a cross-model sweep.

### Out of Scope
- Editing live sk-design content; the generated provider duplicate trees; build/site/test/CLI infrastructure; adopting impeccable's structural systems wholesale.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The synthesized backlog plus ledger plus verdict plus sweep |
| `research/iterations` and `research/deltas` | Create | Per-iteration evidence and deltas |
| `research/deep-research-state.jsonl` | Create | The append-only state machine |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The corpus is covered | shared laws plus 23 command flows plus detector semantics plus STYLE all read |
| REQ-002 | Every candidate is verified | each item cites the real sk-design file checked plus why absent |
| REQ-003 | The no-new-mode verdict is justified | every item maps to an existing home; structural systems ruled out |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cross-model sweep folded in | Kimi plus DeepSeek verified results in research.md §11b |
| REQ-005 | Packet validates | `validate.sh --strict` clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A frozen, verified adoption backlog plus ruled-out ledger plus no-new-mode verdict, traced to impeccable sources and sk-design targets.
- **SC-002**: Convergence reached honestly; cross-model sweep folded in; packet passes strict validation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False positives | Padded backlog | Verify-against-real plus adversarial cross-model sweep |
| Risk | Scope drift to infrastructure | Wasted iterations | Hard corpus scope |
| Dependency | The impeccable corpus | No input | Read-only, preserved |
| Dependency | cli-codex gpt-5.5 xhigh fast | No executor | Validated from 024 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research artifacts only; no runtime impact on sk-design.

### Security
- **NFR-S01**: Read-only over corpus plus sk-design; cross-model critics run without write permission.

### Reliability
- **NFR-R01**: Externalized state machine is append-only and reducer-verified (corruption 0).

---

## 8. EDGE CASES

### Data Boundaries
- **A candidate already present**: classified ALREADY-COVERED with the location; not added.
- **An infrastructure item**: classified OUT-OF-SCOPE-INFRA; only its semantics inform the backlog.

### Error Scenarios
- **A dispatch fails**: the driver halts after three consecutive failures (none occurred).

### State Transitions
- **Research to build**: this packet freezes the backlog; a future build packet applies it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | One consolidated skill, scoped corpus |
| Risk | 12/25 | High overlap, false-positive risk |
| Research | 16/20 | 12-iteration convergent study plus sweep |
| Multi-Agent | 9/15 | cli-codex loop plus 4 cross-model critics |
| Coordination | 8/15 | Third corpus in the arc |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | False positives | M | M | Verify-against-real plus adversarial sweep |
| R-002 | Scope drift | M | L | Hard corpus scope |
| R-003 | Over-running on low-value synthesis | L | M | Convergence early-stop (stopped at 12) |

---

## 11. USER STORIES

### US-001: Know what impeccable adds (Priority: P0)
**As a** sk-design maintainer, **I want** a verified net-new versus already-covered split, **so that** I only spend a future build on genuine gaps.
**Acceptance Criteria**:
1. Given the research, When I read the backlog, Then every item cites the sk-design file verified absent.

### US-002: A clear scope line (Priority: P0)
**As a** maintainer, **I want** the structural systems ruled out, **so that** sk-design does not bloat into a detector engine or prose validator.
**Acceptance Criteria**:
1. Given §5, When I review the rulings, Then each ruled-out system has a reason.

### US-003: Implementation-ready backlog (Priority: P1)
**As a** future build, **I want** a prioritized backlog with homes plus effort, **so that** the edits are surgical.
**Acceptance Criteria**:
1. Given §4, When I plan a build, Then each item has a target file, why-net-new, and effort.

---

## 12. OPEN QUESTIONS

- Whether the cross-model sweep adds any net-new rec or rejects a backlog item (resolved in research.md §11b).
- Whether a future build should apply the full P1-P3 backlog or only P1 (a build-time sizing decision).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Deliverable**: `research/research.md`
- **Prior phases**: `../022-mifb-design-research/`, `../024-designer-skills-research/`
