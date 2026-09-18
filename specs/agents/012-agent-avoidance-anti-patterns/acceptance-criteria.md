---
title: "Acceptance Criteria: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/012-agent-avoidance-anti-patterns"
    last_updated_at: "2026-09-18T08:50:00Z"
    last_updated_by: "devin"
    recent_action: "All six criteria Met; packet closed with strict validation passed"
    next_safe_action: "Packet complete; commit when the operator is ready"
    blockers: []
    key_files:
      - "repo-rules/answer-the-actual-request.md"
      - "REPO RULES.md"
      - "repo-rules/evidence-and-proof.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-18-agents-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Audit the agent behavior ruleset against six agent-avoidance anti-patterns and give the uncovered family one home

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/012-agent-avoidance-anti-patterns
**Level:** 2
**Status:** Complete
**Date:** 2026-09-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the six pasted anti-patterns, when the coverage audit runs, then `spec.md` §3.5 maps each pattern to a named home (file+section) or an explicit covered verdict | `spec.md:85`, `spec.md:90` — coverage map rows, six verdicts | Met | - |
| AC-002 | REQ-002 | Given the family has no home, when implementation runs, then `repo-rules/answer-the-actual-request.md` exists with house frontmatter and sections for warnings, reinterpretation, invented constraints, honest refusal, gating estimates, and first-answer honesty | `repo-rules/answer-the-actual-request.md:48`, `repo-rules/answer-the-actual-request.md:93` — `grep -n '^## '` shows the six sections plus boundaries | Met | - |
| AC-003 | REQ-003 | Given the router must reach the file, when `REPO RULES.md` is edited, then the trigger table and the index each carry one row naming it | `REPO RULES.md:47` and `REPO RULES.md:67` — `grep -n 'answer-the-actual-request'` → 2 hits | Met | - |
| AC-004 | REQ-004 | Given pattern 5 is covered except the loop shape, when `evidence-and-proof.md` §10 is amended, then it states that a report becoming honest only under interrogation failed when written | `repo-rules/evidence-and-proof.md:203` — `grep -n 'interrogation'` hit | Met | - |
| AC-005 | REQ-005 | Given the packet and index must validate, when verification runs, then `validate.sh --strict` prints `RESULT: PASSED` and `generate-trigger-index.mjs` exits 0 | `tasks.md:59`, `tasks.md:62` T009/T012 — command outputs read this session | Met | - |
| AC-006 | REQ-006 | Given the one-home invariant, when the diff is reviewed, then no added line restates a rule another file owns — every overlap is a cross-cite | `repo-rules/answer-the-actual-request.md:52,60,68,85,97` — section bodies cite rather than copy | Met | - |
| AC-007 | REQ-007 | Given the rule's trigger is reply-facing and Gate 5 never fires on read-only turns, when `AGENTS.md` §8 is amended, then it carries one routing sentence naming the file | `AGENTS.md:261` — `grep -n 'answer-the-actual-request' AGENTS.md` hit; negative control `git show HEAD:AGENTS.md` → 0 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-002, AC-003 and AC-004 carried the packet: the new rule file owns the avoidance family, the router reaches it, and the interrogation loop is named in `evidence-and-proof.md` §10. Consciously left out: `AGENTS.md` edits (root doc stays a router), the `uncertainty-and-honesty.md` §2 enumeration extension, a `repo-rules/` corpus widening, and a §12 self-check row — all recorded as deferred open questions in `spec.md` §10.
<!-- /ANCHOR:closure -->
