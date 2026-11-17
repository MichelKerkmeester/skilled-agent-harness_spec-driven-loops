---
title: "Decision Record: Stop free text hijacking Next Focus in research and review"
description: "The operator-accepted planning call for D5: a carried-forward item must end in a question mark or equal a registry question."
trigger_phrases:
  - "004-focus-hijack-fix operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded the operator's acceptance of the fix-agent planning call"
    next_safe_action: "Build the phase against the accepted decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "operator-decision-004-focus-hijack-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Stop free text hijacking Next Focus in research and review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Carried-forward items must be question-shaped

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Operator accepted the fix-agent planning call on 2026-11-17. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The D5 defect: free text under a later iteration's `## Questions Remaining` is carried forward by `buildCarriedForwardOpenQuestions` and can become research Next Focus, including a status sentence and a resolved question's text. The fix agent settled the filter rule in planning (`spec.md` §7, goal decision D4).

### Constraints

- The filter lives in the shared helper, so research and review see one rule.
- An imperative item without a question mark must still reach Next Focus by another path (REQ-002).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A carried-forward item is kept only when its text ends in `?` or its normalized text equals a registry question, and is dropped when it equals an answered or resolved question.

**How it works**: `buildCarriedForwardOpenQuestions` applies the question-shape rule and the answered rule before the list reaches the registry, its metric and strategy section 11A. The `buildRegistry` call passes the answered and resolved set.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Ends in `?` or equals a registry question** | Drops the observed status-sentence instance; deterministic; one rule in one helper | Drops an imperative item that ends without `?` | 8/10 |
| Reorder so an open machine question outranks carried text | No text rule | Leaves the carried-forward and "Follow up on" steps unreachable | 5/10 |

**Why this one**: The operator accepted the planning call. It closes D5 at the source without making later focus steps unreachable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A status sentence or a resolved question never becomes Next Focus.

**What it costs**:
- An imperative item without `?` is no longer carried forward.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A legitimate imperative item is dropped | L | It still reaches Next Focus as the leaf's `## Recommended Next Focus` (REQ-002); a `continuity-thread` case pins the rule |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | D5 observed live (parent §13) |
| 2 | **Beyond Local Maxima?** | PASS | Reordering weighed in `spec.md` §7 |
| 3 | **Sufficient?** | PASS | REQ-001 cases (a) and (b) |
| 4 | **Fits Goal?** | PASS | Goal decision D4 |
| 5 | **Open Horizons?** | PASS | Phase 010 frontier focus inherits a clean carried list |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `buildCarriedForwardOpenQuestions` in `runtime/lib/deep-loop/continuity-thread.cjs` and its call in `deep-research/scripts/reduce-state.cjs` (T004).

**How to roll back**: Revert the helper change; the carried list returns to today's behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: carried text must end in `?` or equal a registry question | Operator accepted the fix-agent planning call | `spec.md` §7 planning answer | ADR-001, goal D4, T004 |
| Q001 | Accept the planning calls for 004, 006, 007 and 013. | Not stated. | None | 004/006/007/013 decision-record.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision.

**OD-001** (2026-11-17, decider operator)

- Asked: whether to accept the fix-agent planning call in this phase's spec as an Accepted decision.
- Operator answer, as relayed in the 2026-11-17 decision brief: "004 carried text must end in "?" or equal a registry question"
- Recorded as: ADR-001, Accepted.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01GXZervRj4ta5M1vXJ4deg8:3 -->

Question:
```text
The fix agents made four planning calls; accept them? 004: carried text must end in '?' or match a registry question, so status sentences stop steering. 006: focusAlignment checks only the latest record, so one off-focus iteration doesn't block forever. 007: a code-only source answer counts as one class and stays blocked; code plus tests passes. 013: skip the redispatch for executor_missing, findings_not_enumerated and ledger_backing_missing (all landed iterations).
```

Options:
```text
Accept all four (Recommended)
Review individually
```

Answer:
```text
Accept all four (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
