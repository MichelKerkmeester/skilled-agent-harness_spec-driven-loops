---
title: "Decision Record: Derive SOURCE quality_class at the graph upsert choke point"
description: "The operator-accepted planning call: a code-only source is one derived class and stays blocked, while code plus tests passes."
trigger_phrases:
  - "007-source-diversity-quality-class operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded the operator's acceptance of the fix-agent planning call"
    next_safe_action: "Build the phase against the accepted decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "operator-decision-007-source-diversity-quality-class"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Derive SOURCE quality_class at the graph upsert choke point

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Code-only source is one class; code plus tests passes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Operator accepted the fix-agent planning call on 2026-11-17. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`sourceDiversity` counts distinct derived `quality_class` values per question, with a 1.5 threshold (`convergence.cjs:437`, blocker at `:448`). A question answered only from code files derives one class. The fix agent settled in planning (`spec.md` §7) that this stays blocked, and that code plus its tests derives two classes and passes.

### Constraints

- Goal decision D3 keeps the signal's math unchanged.
- The derivation reads a SOURCE node's `path` first.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A code-only source counts as one class and a question answered only from it stays blocked by `source_diversity_guard`; a question that cites code and its tests derives two classes and passes.

**How it works**: No threshold or count change. The REQ-004 code-only fixture, a `.cjs` file plus its `.vitest.ts` test, reports `sourceDiversity` 2.0 with no `source_diversity_guard` blocker, and a single-class question reports 1.0.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One class stays blocked, code plus tests passes** | Keeps the signal honest; no math change | Code-only runs must cite tests to pass | 8/10 |
| Lower the threshold or count sources instead of classes | Code-only runs pass more easily | Lets a single class of evidence clear a diversity gate; amends D3 | 4/10 |

**Why this one**: The operator accepted the planning call. The signal measures class diversity, and code plus tests is real diversity.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Source diversity can no longer be raised by citing more files of one class.

**What it costs**:
- A code-only question that cites no tests blocks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A code-only run that cites no tests blocks at the guard | M | Intended; the REQ-004 fixture pins the passing code-plus-test case |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | D1 made the signal gameable (parent §13) |
| 2 | **Beyond Local Maxima?** | PASS | Threshold and source-count rules weighed |
| 3 | **Sufficient?** | PASS | REQ-004 cases |
| 4 | **Fits Goal?** | PASS | Goal decision D3 |
| 5 | **Open Horizons?** | PASS | A later threshold change amends D3 openly |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- REQ-004 fixtures in `convergence-script.vitest.ts` and `coverage-graph-signals.vitest.ts` (T007). No change to `coverage-graph-signals.ts`.

**How to roll back**: Revert the fixtures; no runtime threshold changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: code-only source counts as one class and stays blocked; code plus tests passes | Operator accepted the fix-agent planning call | `spec.md` §7 planning answer | ADR-001, REQ-004, T007 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision.

**OD-001** (2026-11-17, decider operator)

- Asked: whether to accept the fix-agent planning call in this phase's spec as an Accepted decision.
- Operator answer, as relayed in the 2026-11-17 decision brief: "007 code-only source counts as one class and stays blocked, code plus tests passes"
- Recorded as: ADR-001, Accepted.

<!-- /ANCHOR:operator-answers-verbatim -->
