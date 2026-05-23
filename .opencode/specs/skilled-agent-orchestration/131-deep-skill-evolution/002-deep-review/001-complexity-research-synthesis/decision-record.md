---
title: "Decision Record: Deep Review Complexity Research"
description: "Decision record for using a 10-iteration evidence-led deep-research loop before changing the deep-review workflow."
trigger_phrases:
  - "deep-review complexity decision"
  - "evidence-led deep-review research"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/001-complexity-research-synthesis"
    last_updated_at: "2026-05-22T05:52:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Accepted evidence-led research decision"
    next_safe_action: "Use ADR to guide research synthesis"
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:5555555555555555555555555555555555555555555555555555555555555555"
      session_id: "116-deep-review-complexity-auto-research"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deep Review Complexity Research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Evidence-Led Deep Research Before Deep-Review Remediation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | User, OpenCode agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The user reported that focused deep-research bug-finding sometimes surfaces more bugs than the dedicated deep-review workflow. That outcome implies a possible workflow-design gap, but the root cause could live in prompts, iteration focus, convergence scoring, output contracts, tool budgets, or synthesis behavior.

### Constraints

- The research run must use `/spec_kit:deep-research` workflow semantics rather than a hand-rolled loop.
- The executor route must use `cli-codex`, `gpt-5.5`, `high` reasoning, and `fast` service tier.
- The packet must remain evidence-only until findings are synthesized.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: run a 15-iteration deep-research loop (10 `high` + 5 `xhigh` continuation) before changing deep-review.

**How it works**: The packet defines the research charter, initializes workflow-owned research state, dispatches Codex for each focused iteration, validates artifacts, and synthesizes findings into a ranked recommendation backlog. Implementation changes are deferred to a follow-up packet.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **15-iteration deep-research loop** | Evidence-led, fresh context per pass, likely to expose workflow failure modes | Takes longer before remediation | 9/10 |
| Direct deep-review prompt edits | Faster to implement | Risks treating symptoms and missing actual shallow-review cause | 4/10 |
| Single manual review of deep-review files | Low overhead | Too shallow for the user's reported gap | 5/10 |

**Why this one**: The user's observation is comparative, so the plan must compare workflows with evidence before prescribing changes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Follow-up changes can target documented failure modes instead of guesses.
- Recommendations can cite iteration evidence and affected surfaces.

**What it costs**:
- The user waits for research before remediation. Mitigation: keep the loop bounded to 15 iterations (10 high + 5 xhigh continuation) and synthesize immediately.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Research repeats known points | M | Force a distinct focus and novelty record per iteration. |
| CLI dispatch fails | H | Preflight Codex and preserve exact errors. |
| Recommendations remain abstract | H | Require target surfaces and verification ideas in final synthesis. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User observed a mismatch between deep-research and deep-review bug discovery. |
| 2 | **Beyond Local Maxima?** | PASS | Compares two workflows rather than patching one prompt blindly. |
| 3 | **Sufficient?** | PASS | 15 iterations (10 high + 5 xhigh continuation) cover prompts, agents, YAML, convergence, and synthesis with stress-tested recommendations. |
| 4 | **Fits Goal?** | PASS | Directly targets deeper bug-finding in deep-review. |
| 5 | **Open Horizons?** | PASS | Produces a follow-up backlog that can improve future review loops. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Packet docs and metadata are populated.
- Packet-local `research/` artifacts are generated by the deep-research loop.

**How to roll back**: Stop the run and archive or remove only this packet's generated `research/` artifacts after user approval.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
