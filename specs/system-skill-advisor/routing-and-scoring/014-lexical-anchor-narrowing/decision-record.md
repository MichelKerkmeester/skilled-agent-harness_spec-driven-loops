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
    recent_action: "Recorded ADR-002 and Q013"
    next_safe_action: "Find a stricter rule for the three remaining lifts that moves no pin"
    blockers:
      - "Three probe lifts remain; the stricter rules tried moved pinned rows"
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

<!-- ANCHOR:adr-002 -->
## ADR-002: Land the distinctive-word anchor with a typed-command owner clause

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator (Q013), Claude |

---

<!-- ANCHOR:adr-002-context -->
### Context

The stricter rules (ADR-001) took sk-doc off typed command prompts. A trace of those 13 prompts showed sk-doc reaching the floor on a lexical score built from its hub vocabulary, which repeats every mode's words.

### Constraints

- No pinned row may move.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: keep the 0.45 lexical score and add a test that one prompt word in the skill's vocabulary is listed by at most 25% of skills (commands left out). The strong-score lift needs a named anchor. The id noun's second word must be a prompt word. A typed command names the skill that owns it.

**How it works**: `promptHoldsDistinctiveWord` in `lanes/lexical.ts`; the clauses in `hasNamedAnchor` and `confidenceFor` in `fusion.ts`; `lexicalAnchorMaxSkillShare` in `scoring-constants.ts`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **E: distinctive-word test, 25%** | No pin moves | Three lifts remain | 7/10 |
| E at 15% | Clears the container lift | Drops system-spec-kit beside sk-doc on the handoff prompt; full suite not run | 5/10 |
| A to C | Clear all five lifts | Move pinned rows | 3/10 |

**Why this one**: the largest gain that keeps every pin.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Generic-word and synonym-only lifts on short prompts stop for the parser and doctor cases.

**What it costs**:
- One more constant. Mitigation: documented beside the anchor floor.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The share drifts as skills are added | L | It is a share, not a count |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The trace attributed each lift |
| 2 | **Beyond Local Maxima?** | PASS | Five candidates measured |
| 3 | **Sufficient?** | PASS | Four small clauses |
| 4 | **Fits Goal?** | PASS | The operator asked for a fresh attempt |
| 5 | **Open Horizons?** | PASS | A stricter share can be tried later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `fusion.ts`, `lanes/lexical.ts`, `scoring-constants.ts`, a new scorer test, release 2.0.4.0.

**How to roll back**: revert the advisor commit and run `npm run build` in the advisor runtime.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q012 | Record the measurements and stop; land no scorer change. | Not stated. | None | ADR-001 |
| Q013 | Make a fresh attempt at the anchor rule that keeps sk-doc on typed `/create:*` prompts. | Not stated. | Q012 for the landing question | ADR-002 |
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

### Q013
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:advisor-014-fresh:0 -->

Question (condensed from the text asked):
```text
Your call, when you want it: a fresh attempt at the advisor rule has to keep sk-doc first on typed /create:* commands.
```

Options:
```text
None offered; a free-text reply to the closing line.
```

Answer:
```text
yes
```
<!-- /ANCHOR:operator-answers-verbatim -->
