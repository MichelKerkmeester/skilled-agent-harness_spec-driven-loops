---
title: "Decision Record: packet goal fallback"
description: "Why AC-003 of this phase was superseded after a later phase made an over-cap Claude log readable in full, and what replaced its rule."
trigger_phrases:
  - "packet goal fallback decision record"
  - "over-cap goal log superseded criterion"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback"
    last_updated_at: "2026-11-14T17:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded ADR-001, which supersedes AC-003 after the over-cap log read changed"
    next_safe_action: "None. The criterion is Superseded and its replacement lives in the phase that changed the rule"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", "acceptance-criteria.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-packet-goal-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is AC-003 rewritten? No. It is superseded by ADR-001 and its text is left as it was written."
---
# Decision Record: packet goal fallback

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: AC-003 is superseded because an over-cap log is now read whole

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Whole-epic review of 2026-11-14, and the phase that changed the read |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-003 asked that a Claude log longer than the 16 MB tail cap with no goal entry return no packet. That was true when the row was written. The capped tail was the only read, a tail with no goal entry set `whole: false`, and `resolveGoalPacket` refused the packet goal fallback whenever the read was partial, because a partial read cannot rule out a goal that ended earlier in the log.

The whole-epic review of 2026-11-14 found the cost of that rule. A long session whose goal entry sits before the tail cap loses its packet, and long sessions are the ones that reach the context threshold. The review measured 35 of 801 session logs over 16 MB on one account. The refusal was right about the uncertainty and wrong about the answer: it treated bytes it never read as proof that no goal existed.

The phase that owns the reader now scans the earlier bytes in fixed chunks when the capped tail holds no goal entry, reports `whole: true` once that scan completes, and lets a log with no goal entry anywhere reach the packet goal fallback. AC-003 states the opposite rule, so keeping it `Met` would claim a behavior the code no longer has, and rewriting its words in place would hide that the rule changed.

### Constraints

- A criterion's meaning is never changed in place.
- A row keeps its id, its original text and its evidence, and the record says what replaced it.
- The replacement rule is held by the criteria of the phase that changed the reader, not by a new row here.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: mark AC-003 `Superseded` by this record, leave its text untouched, and let the phase that changed the goal reader carry the new rule in its own acceptance criteria.

**How it works**: the capped tail is answered from the tail whenever it holds a goal entry. A tail with none is followed by a front-to-back scan of the bytes before it, so the newest entry anywhere in the log counts. A log that holds no goal entry at all now reaches the packet goal fallback, which is the case AC-003 expected to be refused.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede AC-003 and record the replacement** | The history shows what was true and what changed, and the row keeps its id | One more document to read beside the criteria | 9/10 |
| Rewrite AC-003 in place to the new rule | One row, no new file | Hides that a closed phase changed its claim, and the old evidence no longer matches the words | 2/10 |
| Leave AC-003 `Met` and note the reversal in the phase that changed it | No edit in a closed phase | The row still claims a behavior the code does not have | 2/10 |
| Keep the capped-tail refusal and drop the change | The row stays true | A long session keeps losing a packet goal it never contradicted | 3/10 |

**Why this one**: it keeps the closed phase's history intact and puts the new rule where its evidence lives.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A reader of this phase sees that AC-003 was true when written and is no longer the rule.
- A long Claude session that never set a goal now inherits the nearest unfinished packet goal, which is the case the fallback exists for.

**What it costs**:
- A log over the cap costs a second bounded read when its tail holds no goal entry. The scan runs in fixed chunks and stops at the tail, so the cost stays linear in the bytes before it.
- One criterion in a closed phase is no longer `Met`, and the closure statement has to say so.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone reads the superseded row as a live rule | M | The row's Status cell says `Superseded` and its Waiver cell names this record |
| The scan finds an ended goal and reports it as active | L | The newest entry wins and an ended one still ends the goal, which the replacement phase's tests pin |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The code now answers the case AC-003 refuses, so the row cannot stay `Met` |
| 2 | **Beyond Local Maxima?** | PASS | Rewriting the row and leaving it `Met` were both compared |
| 3 | **Sufficient?** | PASS | One superseded row and one record cover the change |
| 4 | **Fits Goal?** | PASS | The phase exists to say what the fallback does and why |
| 5 | **Open Horizons?** | PASS | The new rule is held by the phase that owns the reader, so a later change updates one place |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` marks AC-003 `Superseded` and names this record in its Waiver cell.
- The closure statement accepts one superseded row and names the phase that carries the new rule.

**How to roll back**: set AC-003 back to `Met` and delete this record once a reader stops treating an unread tail as proof that no goal exists.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
