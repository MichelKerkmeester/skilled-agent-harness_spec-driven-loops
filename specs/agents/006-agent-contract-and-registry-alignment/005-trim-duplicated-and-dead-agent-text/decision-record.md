---
title: "Decision Record: Phase 5: trim-duplicated-and-dead-agent-text"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "005-trim-duplicated-and-dead-agent-text operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/005-trim-duplicated-and-dead-agent-text"
    last_updated_at: "2026-11-14T14:05:03.310Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 5: trim-duplicated-and-dead-agent-text

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive the 50,000-word ceiling at the measured total

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Operator, through the question tool (Q001) |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-007 requires the eleven agent files to total 50,000 words or fewer. The spec set that number as the measured 52,568 less the blocks named in scope, about 2,600 words. Phases 3 and 4 then added required sections, so the files held 53,367 words when this phase started. The planned cuts remove 2,511 words and end at 50,856.

### Constraints

- Decision D4 of this phase: 50,000 words is a ceiling, and no rule is cut to reach it.
- Decision D3: no rule is reworded to make it shorter.
- The removal map had no further block whose rule another line of the same file states.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: waive AC-007 and accept the measured total of 50,856 words.

**How it works**: the AC-007 row is `Waived` and names this record. Every planned cut was made, and the count is recorded in `scratch/after.txt`. The other seven criteria are unaffected.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive the ceiling at the measured total (chosen)** | D3 and D4 hold, and the scope stays as planned | The files stay 856 words above the number the spec named | 8/10 |
| Find about 850 more words of restated text | The ceiling is met | It widens the frozen scope, needs a new removal map, and the audit found no further restatement, so the words would come from rules | 3/10 |

**Why this one**: the ceiling was derived from a starting total that earlier phases of this packet raised by about 800 words. The amount removed, 2,511 words, is close to the 2,600 the spec planned.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No rule is cut or reworded to reach a number.

**What it costs**:
- NFR-P01 and SC-001 name 50,000 and the files hold 50,856. Mitigation: this record and the AC-007 row state the measured total.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later reader takes 50,000 as met | L | The AC row, `tasks.md` and `implementation-summary.md` all state 50,856 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The planned cuts end 856 words above the ceiling, measured with `wc -w` |
| 2 | **Beyond Local Maxima?** | PASS | Two options were put to the operator |
| 3 | **Sufficient?** | PASS | The waiver closes the one criterion the cuts cannot meet |
| 4 | **Fits Goal?** | PASS | The objective is that no rule is lost in the cut, and D4 ranks that above the ceiling |
| 5 | **Open Horizons?** | PASS | A later packet can cut further with its own removal map |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-007 is `Waived` and names ADR-001.

**Gated tasks**: T013.

**How to roll back**: set AC-007 back to `Unmet` and reopen the phase.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | AC-007, the 50,000-word ceiling, is waived at the measured total through an ADR. | Phases 1 to 4 added about 800 words of required sections, and finding 850 more words risks cutting a rule, which decision D4 forbids. | None | ADR-001 and the AC-007 row |
| Q002 | All nine summary boxes are removed, deep-review.md included. | REQ-004 says no agent file ends with a box-drawn summary, and the removal map already covered the ninth. | None | REQ-004 and the AC-004 row |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:7b3d8afd-85b7-4568-b947-3f44f177431d:toolu_01VcbxKboDj4TpQuir9SUoj6:0 -->

Question:
```text
Phase 005 (trim agent text) cannot reach its word ceiling with the planned cuts. The eleven agent files hold 53,367 words now, the planned cuts remove 2,515 and end at 50,852, and acceptance row AC-007 requires 50,000 or lower. Parent decision D4 says no rule is cut to reach the ceiling. How should the gap of about 850 words be handled?
```

Options:
```text
Waive AC-007 (Recommended)
Find 850 more words
```

Answer:
```text
Waive AC-007 (Recommended)
```

### Q002
<!-- source: claude:7b3d8afd-85b7-4568-b947-3f44f177431d:toolu_01VcbxKboDj4TpQuir9SUoj6:1 -->

Question:
```text
Nine agent files carry a closing summary box, not the eight the spec counted. deep-review.md has one the spec's search missed because its AUTHORITY line is indented differently. REQ-004 says no agent file ends with a box-drawn summary. Remove all nine?
```

Options:
```text
Remove all nine (Recommended)
Remove the planned eight
```

Answer:
```text
Remove all nine (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
