---
title: "Decision Record: no AI Council seat for cli-deepseek-harness yet"
description: "Why the AI Council resolver keeps rejecting cli-deepseek-harness until a keyed live run proves a route, and what reopens the question."
trigger_phrases:
  - "dsh council seat decision"
  - "deepseek harness council seat"
  - "council seat roster"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/012-deep-loop-modes-and-commands"
    last_updated_at: "2026-11-06T08:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the council seat decision"
    next_safe_action: "Revisit after phase 013 proves a route"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/deep-ai-council/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-cli-deepseek-harness-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should dsh become an AI Council seat? Not until a keyed live run proves a route"
---
# Decision Record: no AI Council seat for cli-deepseek-harness yet

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The council resolver keeps rejecting cli-deepseek-harness

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | claude-opus-5-5, applying the parent goal's frozen decision D6 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Research left one question to this phase: should dsh become an AI Council seat (`001-deep-research/research/research.md`, Q13). The council resolver accepts `native`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-hermes` and the `opencode` alias. It rejects `cli-codex` with its own message, and it throws `unsupported council executor kind` for every other kind, which includes `cli-deepseek-harness` (`.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:193-199`). The listing at `deep-ai-council/SKILL.md:98` omits `cli-hermes`, so the code is the source to cite. A seat is roster membership. Once a kind is a seat, a council round can pick it without the operator naming it.

No dsh route has answered a keyed request yet. No provider key exists yet, so this phase ran no keyed request. Phase 013 enters the keys and owns the live proof.

### Constraints

- The parent goal's D6 keeps the kind experimental and out of default allowlists until a keyed live pin proves a route.
- This phase's D3 changes council files only if this record admits a seat.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: no council seat for `cli-deepseek-harness` in this phase. The resolver keeps rejecting the kind.

**How it works**: No council skill, script, test, pattern doc, YAML or contract changes. `/deep:research` and `/deep:review` still offer the kind, as an explicit executor choice that is never a default. The question reopens once phase 013 saves a keyed run that exits 0 with `final.reason.kind` `completed`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No seat until a route is proven** | Follows D6. A council round never lands on an unproven route. No council code to change now | A council that wants DeepSeek diversity must use `cli-opencode` with a DeepSeek model meanwhile | 9/10 |
| Admit a seat now | One more lens in council rounds | Puts an unproven kind in a roster a round can pick unattended, against D6. Every dsh seat would fail on a missing key today | 2/10 |

**Why this one**: a seat is the kind of default membership D6 forbids before a live pin, and today every dsh seat would fail on a missing key.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The council roster cannot gain the runtime by accident, which was the risk this phase named.

**What it costs**:
- A council round cannot use the dsh harness itself. Mitigation: DeepSeek V4.1 Flash stays reachable through the `cli-opencode` seat.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The question is forgotten after phase 013 proves a route | L | The phase 014 closeout lists reopening Q13 as an operator follow-up |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-003 requires a recorded answer |
| 2 | **Beyond Local Maxima?** | PASS | Admitting a seat now was weighed above |
| 3 | **Sufficient?** | PASS | No code change; the resolver's current list already enforces it |
| 4 | **Fits Goal?** | PASS | Applies parent decision D6 as written |
| 5 | **Open Horizons?** | PASS | Names the evidence that reopens it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Nothing in `.skilled/skills/system-deep-loop/deep-ai-council/`.

**How to roll back**: Not applicable. Admitting a seat later is a new ADR that edits the resolver list and runs `orchestrate-session-cli.vitest.ts`.
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
