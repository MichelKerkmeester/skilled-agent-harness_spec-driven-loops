---
title: "Decision Record: Phase 007 - Procedure Card Template Alignment"
description: "Decision record choosing to plan both a sk-doc canon path and a local schema-tightening path for procedure-card alignment, gated on Phase 006's decision, instead of pre-selecting one."
trigger_phrases:
  - "procedure card alignment decision"
  - "dual path plan not pre-selected"
  - "sk-doc canon gated on phase 006"
  - "path A path B procedure cards"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "ADR-001 implemented (both paths planned); ADR-002 executed (Path B)"
    next_safe_action: "No further action required; Phase 008 may proceed."
---
# Decision Record: Phase 007 - Procedure Card Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Plan Both Alignment Paths Instead of Pre-Selecting One

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted; both paths were planned as designed, and Phase 006 later selected Path B (see ADR-002 below for the execution decision) |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 003 introduced `shared/procedure_card_schema.md` and fourteen private procedure cards without checking them against sk-doc's existing template canon. Phase 006 (parent-skill canon verification) may or may not formalize procedure cards as sk-doc canon, and that decision has not been made as of this phase. This phase needs to decide how to plan the alignment work without knowing which way Phase 006 will resolve.

### Constraints

- Do not edit `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` during this planning phase.
- Do not pre-select Path A or Path B before Phase 006's decision exists.
- Whichever path is later selected must be immediately executable from this phase's plan, without further research.
- Both paths must carry the same rigor: a required-field lint and an embedded example card.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Author this phase's plan as two fully specified, decision-conditioned paths — Path A (formalize a new sk-doc canonical template, `assets/skill/procedure_card_template.md`, plus a fourteen-card conformance pass) and Path B (tighten `procedure_card_schema.md` locally with the same rigor) — rather than guessing which way Phase 006 will resolve and planning only one.

**How it works**: This phase produces a field-by-field diff table and two acceptance-criteria-complete plans. A future implementation phase reads Phase 006's decision, picks the matching path from this plan, and executes it without re-scoping.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Plan both paths now (chosen)** | Either Phase 006 outcome is immediately actionable; no re-research needed later | Slightly more authoring effort than a single-path plan | 9/10 |
| Pre-select Path A (assume sk-doc canon) | Simpler single-path plan | Risks wasted planning effort and a wrong assumption if Phase 006 rejects canon formalization | 4/10 |
| Pre-select Path B (assume local-only) | Simpler single-path plan | Risks under-planning if Phase 006 wants a formal sk-doc template | 4/10 |
| Defer all planning until Phase 006 closes | Avoids planning under uncertainty entirely | Blocks this phase's entire purpose (making the gap concrete now) and stalls the packet's phase sequence | 3/10 |

**Why this one**: Planning both paths costs a bounded amount of extra authoring time now and removes all research latency later, regardless of which way Phase 006 resolves. It also lets this phase deliver its stated purpose — making the alignment gap concrete — without needing to guess a governance decision that belongs to a different phase.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Whichever way Phase 006 resolves, an implementer can start executing immediately from this phase's plan.
- The field-by-field diff table gives reviewers a concrete, evidence-based view of the gap instead of a vague "needs alignment" note.
- Neither path can quietly ship with less rigor than the other, since both require the same lint-and-example bar.

**What it costs**:
- This phase authors more planning content than a single-path plan would require. Mitigation: keep both paths bounded to acceptance criteria and files-to-change tables, not full implementation prose.
- The plan cannot be marked "implemented" until a later phase actually executes the selected path. Mitigation: this phase's status stays "Planned / Not Started" throughout, with no implementation claim.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Path A is selected but the fourteen-card conformance pass is skipped | M | Require the conformance pass as part of Path A's completion criteria, not the new template alone |
| Path B is selected with weaker rigor than Path A would have provided | M | Require identical lint-and-example rigor in both paths' plans |
| The diff table goes stale if sk-doc's templates change before implementation | L | Require a diff re-check against current templates before implementation begins |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase must make the schema-vs-template gap concrete and plan alignment without knowing Phase 006's outcome in advance. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares pre-selecting Path A, pre-selecting Path B, deferring entirely, and planning both. |
| 3 | **Sufficient?** | PASS | Planning both paths with acceptance criteria is exactly the amount of planning needed to unblock execution the moment Phase 006 resolves. |
| 4 | **Fits Goal?** | PASS | The approach keeps this phase's scope to audit-and-plan, leaving the canon decision itself to Phase 006 as intended. |
| 5 | **Open Horizons?** | PASS | A later phase can select and execute either path, or amend this decision record, without this phase having foreclosed either option. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (in this planning phase):
- Add the field-by-field diff table to `spec.md`.
- Add the Path A and Path B implementation phases, acceptance criteria, and files-to-change tables to `plan.md` and `tasks.md`.
- Add the per-card and per-template audit tasks needed to fill in the diff table with evidence.

**What does NOT change** (deferred to a future implementation phase, after Phase 006 resolves):
- No new file is created at `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`.
- No edits are made to `.opencode/skills/sk-design/shared/procedure_card_schema.md` or any of the fourteen procedure cards.

**How to roll back**: Revert only this phase's planning docs. Since no `sk-design` or `sk-doc` content is touched by this decision (ADR-001) on its own, no external rollback is required for the planning pass itself.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Execute Path B Directly in Phase 007 Instead of Deferring to a New Phase

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted; executed |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope |

---

<!-- ANCHOR:adr-002-context -->
### Context

Phase 006 resolved (ADR-001, Accepted: keep `procedures/` sk-design-local; Phase 007 should design an sk-design-local procedure-card template, Path B) within the same work session as this phase, before this phase's docs had been closed out. The parent packet's phase sequence (`spec.md` Phase Navigation) names no separate implementation phase between 007 and 008 for executing whichever path Phase 006 selected — Phase 008 is `smart-routing-optimization`, an unrelated concern. Deferring Path B execution would have required either inventing a new phase number outside the existing sequence, or leaving the alignment gap this phase was chartered to close unresolved indefinitely.

### Constraints

- Do not create `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md` (Path A was not selected).
- Do not alter procedure-card substance (Purpose/Owning mode/Source reference/Trigger/Output contract/Proof gate/Privacy rule content) — structural alignment only (frontmatter, section numbering, lint, worked example).
- Do not touch `mode-registry.json`, `hub-router.json`, or any mode `SKILL.md`.
- Keep `.opencode/skills/sk-doc/**` fully read-only.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Execute Path B directly within Phase 007 — add `## 4. Required-Field Lint`, `## 5. Worked Example` (`accessibility_audit.md`), and `## 9. Publication Checklist` to `shared/procedure_card_schema.md`, and conform all fourteen procedure cards (frontmatter added; sections renumbered to match) — rather than opening a new phase folder to carry out Phase 006's selected path.

**How it works**: This phase's own plan already named Path B's exact scope (files-to-change, acceptance criteria, required-field list) before Phase 006 resolved, so no re-scoping was needed once the decision landed. Execution proceeded directly against that pre-approved scope.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Execute Path B directly in Phase 007 (chosen)** | No new phase number needed; scope was already fully pre-approved by this phase's own plan; closes the alignment gap immediately | Phase 007's original spec framed itself as "planning only," requiring this reconciliation pass to update status/scope framing | 9/10 |
| Defer execution to a new, unplanned phase (e.g. "007b" or renumbered 008) | Keeps Phase 007 strictly planning-only as originally scoped | Invents a phase number outside the existing sequence; delays closing a gap this phase was chartered to make concrete; duplicates scope already fully specified here | 4/10 |
| Leave Path B unexecuted and mark Phase 007 complete as planning-only | Simplest, no further work | Leaves the fourteen cards non-conforming even after the canon decision is known, contradicting this phase's own stated purpose | 2/10 |

**Why this one**: The scope was already fully pre-approved (files-to-change, acceptance criteria, required-field list) by this same phase's plan before Phase 006 resolved. Opening a new phase to execute a plan that already exists, with a decision that already landed, would only add process overhead without changing what gets built.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The alignment gap this phase exists to close is actually closed, not left as an unresolved future dependency.
- `spec.md`, `plan.md`, `checklist.md`, and `implementation-summary.md` can state one consistent, verifiable completion status instead of a permanently "planned" one.

**What it costs**:
- This phase's original "planning only" framing needed a reconciliation pass (this decision record, plus updated `spec.md`/`plan.md`/`checklist.md`/`implementation-summary.md`) to avoid conflicting completion claims across the packet's docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reconciliation pass misses a stale "planning only" claim elsewhere in the packet | L | Every phase doc (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) was reviewed and updated in this same pass; strict validation re-run as a final gate |
| Executing Path B without a distinct phase number makes future audits harder to trace | L | This ADR-002 and `implementation-summary.md`'s Deviations from Plan table record the scope evolution explicitly |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 006 resolved and named Phase 007's execution scope explicitly; deferring further would have left a known, actionable gap unresolved. |
| 2 | **Beyond Local Maxima?** | PASS | Considered deferring to a new phase number and considered leaving the gap unresolved; both were rejected with stated reasons. |
| 3 | **Sufficient?** | PASS | Path B's scope (lint, worked example, checklist, fourteen-card conformance) was already fully specified by this phase's own plan; no additional research was needed. |
| 4 | **Fits Goal?** | PASS | Executing the pre-approved, decision-conditioned plan is exactly what this phase existed to unblock. |
| 5 | **Open Horizons?** | PASS | Path A remains reversible/reconsiderable per ADR-001's stated trigger; nothing here forecloses revisiting the canon decision later. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changed** (executed in this phase):
- `shared/procedure_card_schema.md`: added `## 4. Required-Field Lint`, `## 5. Worked Example`, `## 9. Publication Checklist`, and frontmatter.
- All fourteen procedure cards: frontmatter added; H2 sections renumbered to match the tightened schema.

**What did NOT change**:
- No new file at `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`.
- No edit to `mode-registry.json`, `hub-router.json`, or any mode `SKILL.md`.
- No procedure-card substance (Purpose/Owning mode/Source reference/Trigger/Output contract/Proof gate/Privacy rule content) changed — structural alignment only.

**How to roll back**: See `plan.md` §7 Rollback Plan — `git diff`/`git status` first, then revert `shared/procedure_card_schema.md` and the fourteen named procedure cards if needed.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
