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
    last_updated_at: "2026-08-29T13:43:03Z"
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

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Spend one line to close the gap the reviews found in this packet's own rule

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Operator, with the assistant proposing |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two independent reviews ran against the applied change set. Between them they found six further defects in this packet's own rules, including the packet's new routing trigger requiring a file read without deferring to the priority gate that forbids reads before it is answered, and a debugging line that named two different repeated-failure counts in a single sentence.

Five of the six fixes rewrite a line. The sixth adds one: the document's own pre-flight checklist, the mechanism meant to catch a missed obligation, had no entry for the obligation this packet introduced. There is no way to close that gap by rewriting an existing line, because the gap is an absent line.

### Constraints

- The prior record set the bar for the amended scope as no net line growth, and this breaks it by one.
- The checklist is the document's own omission-catching mechanism; leaving the new rule out of it means the rule is unenforced by the very list that exists to enforce such rules.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: add the checklist line, and supersede the no-growth criterion against this record rather than let it stand as met on evidence that is no longer true.

**How it works**: the replacement criterion states the measurement that actually holds — one line of growth, every other change an in-place rewrite — and names what the line buys. The closure gate checks a row's status, not whether its evidence is still accurate, so a stale criterion left as met would have passed while being false. That is the exact failure this packet exists to reduce, so it would have been a poor place to tolerate it.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add the line, supersede the criterion** | The checklist covers every mandatory rule; the criteria stay true | One line of permanent context cost in every repo, every turn | 9/10 |
| Leave the criterion as met | No new record | The gate would pass on evidence that is verifiably false, which is worse than the line | 1/10 |
| Skip the checklist line to hold the bar | Bar intact | Keeps a bar by leaving the rule it was protecting unenforced | 3/10 |

**Why this one**: the no-growth bar was a proxy for context cost, not an end in itself. One line that makes a mandatory rule checkable is a better trade than a checklist that silently omits it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The routing trigger is now covered by the pre-flight checklist, so a missed route is catchable rather than silent.
- Two rules that cited skill-internal file paths now name the skill and let its router resolve the file, removing a stale-pointer risk in a document copied across repositories.

**What it costs**:
- One line, paid on every turn in every consuming repository. Mitigation: six of the seven changes rewrite rather than add, so the net is the smallest that closes the gap.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Each future review adds another checklist line until the list is noise | M | The list covers gate obligations only; a rule that is not a gate does not earn an entry |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The checklist omitted a rule the same packet made mandatory |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including holding the bar and doing nothing |
| 3 | **Sufficient?** | PASS | One line; the other five fixes add none |
| 4 | **Fits Goal?** | PASS | An unenforced routing gate was the first review's central criticism |
| 5 | **Open Horizons?** | PASS | Naming skills rather than their internal paths keeps the document portable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Pre-flight checklist: one entry for the first code or markdown write of a task.
- Restraint-ladder and test-floor rules: cite the owning skill, not a path inside it.
- Routing trigger, amendment step, and debugging line: defer to the priority gate, distinguish a blocking contract from a merely wrong one, and name which repeated-failure count governs.

**How to roll back**: revert the commit carrying these seven lines. The prior wording is recoverable from the review findings, which quote each original verbatim. Instruction text only; no runtime state to unwind.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
