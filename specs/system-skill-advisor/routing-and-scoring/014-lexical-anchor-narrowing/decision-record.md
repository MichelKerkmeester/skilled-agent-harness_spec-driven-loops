---
title: "Decision Record: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor"
description: "Why no anchor rule landed: every measured candidate moved pinned command and doctor rows."
trigger_phrases:
  - "lexical anchor narrowing decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing"
    last_updated_at: "2026-11-24T13:30:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded ADR-001 and Q012"
    next_safe_action: "Find a rule that keeps the typed /create:* rows on sk-doc before landing any anchor change"
    blockers:
      - "Every measured candidate moved pinned command and doctor slice rows"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-lexical-anchor-narrowing"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: No anchor rule lands until one keeps the pinned command rows

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator (Q012), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

Three candidate rules fixed every probe prompt and held all eight ratchet metrics. Each also moved pinned rows in the command and doctor slices, mainly typed `/create:*` and `/speckit:*` prompts that lost sk-doc as top.

### Constraints

- A moved pin needs operator approval before it lands.
- sk-doc on typed command prompts is correct routing, not noise.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: record the measurements and land nothing.

**How it works**: the advisor stays at 2.0.3.0. The attribution, the three candidates and their moved rows are in `implementation-summary.md`, and candidate C's source is in `scratch/`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record and stop** | No routing loss | The five false lifts remain | 7/10 |
| Keep iterating | Might find a rule that keeps sk-doc | More measurement now, no landing guarantee | 6/10 |
| Land and re-pin | False lifts gone | sk-doc loses typed command prompts | 3/10 |

**Why this one**: the operator chose it; the losses are real routing, not only pins.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The next attempt starts from measured attribution, not the earlier guess that every lift came from the lexical clause.

**What it costs**:
- The false lifts stay. Mitigation: none now; they are 0.82 ties, not wrong tops, on the probe prompts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The findings go stale as skills change | M | Re-run the probes and the trace before a new candidate |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every candidate moved pins |
| 2 | **Beyond Local Maxima?** | PASS | Three candidate families measured |
| 3 | **Sufficient?** | PASS | Nothing to roll back |
| 4 | **Fits Goal?** | PASS | The operator chose it |
| 5 | **Open Horizons?** | PASS | Candidate source kept |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet docs only. The advisor source is unchanged.

**How to roll back**: N/A.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q012 | Record the measurements and stop; land no scorer change. | Not stated. | None | ADR-001 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q012
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:advisor-014-stop:0 -->

Question (condensed from the text asked):
```text
Every candidate anchor rule moves pinned command and doctor rows (sk-doc loses typed /create:* prompts). What should happen?
```

Options:
```text
Record and stop (Recommended)
Keep iterating
Land and re-pin
```

Answer:
```text
Record and stop (Recommended)
```
<!-- /ANCHOR:operator-answers-verbatim -->
