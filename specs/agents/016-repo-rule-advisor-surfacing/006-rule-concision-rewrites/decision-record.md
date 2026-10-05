---
title: "Decision Record: Rule concision rewrites"
description: "Records the operator's waiver of the corpus byte target after apparatus-only cuts reached 11.7% with every norm kept."
trigger_phrases:
  - "byte target waiver"
  - "rule concision floor"
  - "apparatus only cuts"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/006-rule-concision-rewrites"
    last_updated_at: "2026-10-04T22:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the operator's waiver of the byte target"
    next_safe_action: "Measure the post-change window with the 004 analyzer"
    blockers: []
    key_files:
      - "ledgers/bytes-after.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Rule concision rewrites

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Waive the corpus byte target where apparatus runs out

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-002-context -->
### Context

REQ-004 asked for the 13 rule files to drop to at most 91,028 bytes, a 15% cut, against a 20% to 28% target taken from the 002 research model. 006 D1 allows only apparatus cuts: boilerplate, restatement, rationale and provenance. The rewrites reached 94,609 bytes, an 11.7% cut. Five workers and an independent reviewer found no further apparatus. Per-file cuts ranged from 1.7% to 20.7%, and the files cut least are the ones with the highest share of rule statement, as the 002 research's per-file floor finding predicted.

### Constraints

- D1 forbids changing a norm, so the remaining 3.6 KB could only come from operative text.
- ADR-001 in `plan.md` keeps every failure-naming sentence, which removes the largest block the research drafts had cut.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: waive AC-004 and keep the corpus at 94,609 bytes with every norm intact.

**How it works**: AC-004 is marked `Waived` against this record. The byte table in `ledgers/bytes-after.txt` stays the measured result, so the shortfall remains visible rather than restated away.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive with this record** | Keeps every norm, and the shortfall stays recorded | The 15% figure is not reached | 9/10 |
| Second apparatus-only pass on the least-cut files | Might recover some bytes | Likely under 1 KB, so the target is still missed | 4/10 |
| Cut named operative content | Could reach the byte figure | Needs a D1 amendment and changes what the rules enforce, which the later measurement windows would then confound | 2/10 |

**Why this one**: the target was a model's estimate, and the measured floor is lower. Cutting norms to hit an estimate would trade enforcement for bytes.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

| Risk | Impact | Mitigation |
|------|--------|------------|
| The parent goal's byte criterion is unmet | M | The parent goal is amended with the same waiver, so both say the same thing |
| A later pass finds more apparatus | L | A future revision can still cut it under the normal Revise path |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-004 cannot be met without breaking D1 |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed above |
| 3 | **Sufficient?** | PASS | One criterion waived, nothing else changes |
| 4 | **Fits Goal?** | PASS | The goal is shorter rules that keep what enforces them, and the cut does that |
| 5 | **Open Horizons?** | PASS | Later revisions may still cut further |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` AC-004 is `Waived` with this ADR in its waiver cell.
- The parent goal's byte criterion names this waiver.

**How to roll back**: set AC-004 back to `Unmet` and remove the waiver from the parent goal. No rule file changes.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
