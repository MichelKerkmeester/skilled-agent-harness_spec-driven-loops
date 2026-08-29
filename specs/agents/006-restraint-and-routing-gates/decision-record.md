---
title: "Decision Record: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "Records the mid-flight scope amendment that took this packet past its original diff budget, and why the added work was accepted rather than deferred."
trigger_phrases:
  - "decision"
  - "record"
  - "scope amendment"
  - "diff budget"
  - "agents.md"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T12:38:30Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the operator-directed scope amendment"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Pre-Write Restraint and Artifact Routing in AGENTS.md

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Accept the operator-directed scope amendment past the diff budget

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-001-context -->
### Context

The packet froze a diff budget of twelve changed lines in `AGENTS.md`, to keep a change to an always-loaded governance document auditable in one screen. Two independent reviews then ran against the applied change set. The first found six defects in the packet's own edits; those were fixed in place and stayed inside the budget because every fix rewrote a line rather than adding one.

The reviews also surfaced defects that predated this packet: an "invoke a skill" definition nobody could comply with, a pointer to a search-fallback chain that does not exist anywhere in the document, and a bullet telling the agent not to ask permission that read as overriding five separate mandatory waits. These sat outside the frozen scope. The operator then directed that they be fixed before the second review was dispatched.

### Constraints

- `AGENTS.md` is symlinked into every consuming repository and loaded on every turn, so growth is a permanent cost and every added line must earn itself.
- SCOPE LOCK forbids widening scope on the assistant's own judgment; only the operator can amend it.
- The original budget counted changed lines, not added lines, so three further in-place rewrites breach it even though the file does not grow.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: accept the amendment, fix the three pre-existing defects in this packet, and record the budget breach here rather than restate the original requirement to match the outcome.

**How it works**: the original acceptance criterion is marked `Superseded` against this record, and a replacement criterion states the amended bar in terms the change actually has to meet — no net line growth. Editing the original requirement in place would have hidden that the bar moved and who moved it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede the criterion via this record** | The bar moving stays visible and attributable; uses the mechanism the closure gate already provides | Costs a document the packet did not originally plan | 9/10 |
| Rewrite the original criterion to a larger number | One less file | Hides that the bar moved, and reads as passing a test by editing the test | 2/10 |
| Defer the three fixes to a follow-up packet | Keeps this diff untouched | The operator asked for them before the second review, and splitting them would have reviewed a file the follow-up was about to change | 4/10 |

**Why this one**: a closure gate that can be satisfied by rewriting the criterion is not a gate. Superseding it against a named record keeps the original bar legible and says who authorized the change.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Three defects that made rules unenforceable or actively misleading are gone from a document every runtime loads.
- The "do not ask permission" bullet no longer reads as waiving the mandatory waits, which was the one finding with a real safety edge.

**What it costs**:
- The single-screen diff budget is gone: eighteen changed lines instead of twelve. Mitigation: the file itself did not grow, so the per-turn context cost is unchanged.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A larger diff hides a bad edit among good ones | M | Every one of the eighteen lines is quoted in the summary, and the added rules carry their own verification rows |
| Fixing pre-existing defects invites further unscoped cleanup | M | The amendment is bounded to the three named defects; the remaining review findings stay logged and unfixed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two of the three defects made a rule impossible to comply with; the third conflicted with hard blockers |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed above, including doing nothing in this packet |
| 3 | **Sufficient?** | PASS | Three in-place rewrites, no new lines, no new sections |
| 4 | **Fits Goal?** | PASS | The invoke definition was the pressure that produced this packet's own worst defect, so fixing it is on the critical path |
| 5 | **Open Horizons?** | PASS | Naming skills rather than their internals keeps the document portable across repositories |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `AGENTS.md` skill-invocation definition: read what the skill's own router resolves, not its whole bundle tree.
- `AGENTS.md` code-search section: the promised search-fallback chain is no longer claimed, because no such chain is in the document.
- `AGENTS.md` execution behavior: the no-permission bullet is scoped to already-approved steps and names the five waits it does not waive.

**How to roll back**: `git revert` the commit carrying these three lines, or re-apply the three original strings, which are quoted verbatim in the review findings. No runtime state to unwind; the change is instruction text only.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
