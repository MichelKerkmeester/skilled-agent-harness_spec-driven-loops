---
title: "Decision Record: Phase 3: frontend-content"
description: "Why the 400-line target for the motion reference is superseded, and the two operator answers that close phase 003."
trigger_phrases:
  - "frontend content decision record"
  - "motion reference line target"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/003-frontend-content"
    last_updated_at: "2026-11-14T15:30:00Z"
    last_updated_by: "implement-workflow"
    recent_action: "Recorded ADR-001 and two operator answers"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "7af6e9dd-2e69-40a8-ad96-09de518ccdff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: frontend-content

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The 400-line target for the motion reference is superseded

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Michel Kerkmeester, operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

REQ-004 asks for `web-motion-and-interaction.md` to be 400 lines or fewer. The file was 642 lines. The scope moves only the rules that ledger row `F7` lists as restating another topic file, which are `M2`, `M13`, `M14`, `M15`, `M17`, `M21`, `M29` and `M51`. Each rule block is 8 lines, and each move leaves one link line behind. Moving all eight took the file to 586 lines.

### Constraints

- The scope in `spec.md` moves only the rules row `F7` lists. The scope is frozen.
- Decision D2 in `goal.md` says a moved rule keeps its wording and its id, so a rule cannot be shortened to save lines.
- Reaching 400 lines would mean moving about 27 more rules that the audit did not name as duplicates.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Accept 586 lines and close AC-004 as superseded.

**How it works**: The eight audited duplicates moved to their owning files, byte for byte. No other rule moved. AC-004 carries the observed line count and names this record.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept 586 lines** | Stays inside the frozen scope and the audit finding | The file stays above the 400-line figure | 8/10 |
| Move the remaining forms, typography, focus and performance rules too | A shorter file, about 450 lines | Still above 400, changes which rules a motion request loads and goes beyond the audit finding | 3/10 |
| Keep the phase open | Changes nothing | The packet's fourth completion criterion cannot pass | 1/10 |

**Why this one**: The 400-line figure was an estimate made before the move list was known. The finding was duplication, and the duplication is gone.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each of the eight rules lives in one topic file.
- An accessibility request loads the focus, tooltip and reduced-motion rules that were filed under motion.

**What it costs**:
- The motion reference stays above 400 lines. Mitigation: a later packet can split it by section if its size becomes a problem, with its own finding.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader expects the 400-line figure from `spec.md` | L | AC-004 states the observed count and names this record |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-004 cannot be met inside the frozen scope, and the phase cannot close with an unmet row |
| 2 | **Beyond Local Maxima?** | PASS | Three options were put to the operator |
| 3 | **Sufficient?** | PASS | No file changes beyond the recorded status |
| 4 | **Fits Goal?** | PASS | The phase objective is one rule in one file, which holds |
| 5 | **Open Horizons?** | PASS | A later split of the file stays possible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` row AC-004 is `Superseded` and names ADR-001.

**How to roll back**: Set AC-004 back to `Unmet` with `-` in the Waiver cell and delete this record.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Correct the motion rule id baseline from 48 to 57 | The tree held 57 `### M` headings before any move, measured at `ff0673af0a`, and holds 57 after it | The figure 48 in REQ-003, AC-003, T002, T014, SC-002 and the goal criterion | `goal.md`, `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` |
| Q002 | Accept 586 lines for the motion reference | Only the eight audited duplicates move, and reaching 400 would move about 27 rules the audit never named | The 400-line target in REQ-004 | ADR-001 and AC-004 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001

Question: Phase 003 says the motion rule ids must count 48 'before the move', but the tree held 57 before I touched it and still holds 57 after (all eight moved rules are byte-identical, none lost or duplicated). How should I close that criterion?

Options: `Correct it to 57 (Recommended)`, `Keep phase 003 open`.

Answer, 2026-11-14: `Correct it to 57 (Recommended)`

### Q002

Question: Phase 003 also asks for the motion reference to be 400 lines or fewer. Moving the eight rules the audit listed took it from 642 to 586. Reaching 400 would mean moving about 27 more rules the audit never named. What should I do?

Options: `Accept 586 lines (Recommended)`, `Move whole sections too`, `Keep phase 003 open`.

Answer, 2026-11-14: `Accept 586 lines (Recommended)`
<!-- /ANCHOR:operator-answers-verbatim -->

---
