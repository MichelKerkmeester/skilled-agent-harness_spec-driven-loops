---
title: "Feature Specification: Acceptance Criteria Template as Packet Closure Gate"
description: "Add a canonical acceptance-criteria.md to the Level 2, 3 and 3+ document contract. It becomes the single home for acceptance criteria and the gate a packet must pass to be closed, with waiver and supersede paths that require a real decision record."
trigger_phrases:
  - "acceptance criteria template"
  - "acceptance criteria closure gate"
  - "ac waiver adr"
  - "level 2 3 3+ required docs"
  - "ac closure validator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec from the operator goal prompt"
    next_safe_action: "Author plan.md and tasks.md, then build the template and rule"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Acceptance criteria live in acceptance-criteria.md, not spec.md (D2)"
      - "Rollout is forward-only behind a dated cutoff (D3)"
---
# Feature Specification: Acceptance Criteria Template as Packet Closure Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->


---

## EXECUTIVE SUMMARY

Acceptance criteria currently have no single home and no authority. They are authored as a column in the `spec.md` requirements table and as prose blocks under user stories, then traced separately in `checklist.md`, where coverage is measured only as a non-blocking advisory. A packet can therefore be closed with criteria that were never met and never consciously dropped. This phase gives acceptance criteria one canonical document at Levels 2, 3 and 3+, and makes that document the gate a packet must pass before it can be called complete.

**Key Decisions**: `acceptance-criteria.md` is the canonical acceptance-criteria home and `spec.md` stops carrying an acceptance-criteria column at gated levels; a criterion may only be dropped or replaced by a decision record that actually exists.

**Critical Dependencies**: The `AC_COVERAGE` advisory shipped by phase 001 — this phase promotes and repoints it rather than inventing a parallel counter.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-spec-kit-template-optimization |
| **Predecessor** | 001-spec-template-context-optimization |
| **Successor** | 003-restore-level-upgrade-and-vocabulary-invariance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Acceptance criteria are split across two documents and owned by neither. `spec.md` authors them twice — once as the third column of the requirements table, once as Given/When/Then prose under user stories — while `checklist.md` traces them under a separate `AC-ID` scheme. Nothing joins the two, so the `AC_COVERAGE` rule can only guess at the total by counting table cells, and it reports its verdict as `info`. The result is that "complete" is a claim about a checklist, not about the criteria the packet was written to satisfy, and a criterion can be quietly abandoned without anyone recording that it was.

### Purpose

Give every Level 2, 3 and 3+ packet one acceptance-criteria document that decides whether it may close: every criterion is met, or explicitly waived or superseded by a decision record that exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A gated `acceptance-criteria.md` template for Levels 2, 3 and 3+.
- The Level contract entries that make it required at those levels.
- A closure rule that blocks completion on an unmet or improperly waived criterion.
- Repointing the existing acceptance-coverage advisory at the new canonical document.
- The reference surfaces that publish the Level contract, including both READMEs.

### Out of Scope
- Level 1 — it keeps acceptance criteria inline in `spec.md`, because it has no acceptance-criteria document and would otherwise lose them entirely.
- Backfilling the existing Level 2/3/3+ packets — forward-only rollout, per D3.
- Packet `036-spec-doc-template-reduction` and any other adjacent packet — scope lock.
- `scripts/spec/upgrade-level.sh`, which is separately broken and is reported, not fixed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/addons/acceptance-criteria.md.tmpl` | Create | The gated acceptance-criteria document |
| `templates/spec-kit-docs.json` | Modify | Document entry, version, section gates, required at 2/3/3+ |
| `templates/core/spec.md.tmpl` | Modify | Drop the acceptance-criteria column and user-story criteria at gated levels |
| `scripts/rules/check-ac-closure.sh` | Create | The closure gate |
| `scripts/rules/check-ac-coverage.sh` | Modify | Count from the canonical document, fall back for pre-cutoff packets |
| `scripts/lib/validator-registry.json` | Modify | Register the closure rule with severity and flags |
| `templates/README.md`, `templates/CONTRACT.md` | Modify | Publish the document in the manifest surfaces |
| `templates/examples/level-2\|3\|3+` | Modify | Worked examples carry the new document |
| `references/validation/validation-rules.md` | Modify | Document the rule and its failure modes |
| `mcp-server/ENV-REFERENCE.md` | Modify | Register the new environment flags |
| `.opencode/skills/system-spec-kit/README.md` | Modify | Skill README reflects the new Level contract |
| `README.md` | Modify | Public root README reflects the new Level contract |
| `CLAUDE.md` | Modify | Section 3 documentation-level table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A gated `acceptance-criteria.md` template exists and renders for Levels 2, 3 and 3+ and never for Level 1 |
| REQ-002 | The Level contract requires the document at Levels 2, 3 and 3+, so the existing file-presence rule enforces it without a new presence rule |
| REQ-003 | A closure rule fails under `--strict` when a post-cutoff packet has an acceptance criterion that is neither met nor validly waived |
| REQ-004 | A waiver or supersede is only accepted when it names an ADR that actually exists in `decision-record.md`; naming a missing ADR is an error, not a pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The acceptance-coverage advisory counts criteria from `acceptance-criteria.md`, falling back to `spec.md` for pre-cutoff packets |
| REQ-006 | Rollout is gated by a dated cutoff that reuses the existing cutoff-constant pattern rather than a third mechanism |
| REQ-007 | Every reference surface that publishes the Level contract is updated, including the skill README and the public root README |
| REQ-008 | `spec.md` stops carrying acceptance criteria at Levels 2, 3 and 3+, while Level 1 keeps them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A post-cutoff Level 2/3/3+ packet with an unmet criterion cannot reach `validate.sh --strict` exit 0.
- **SC-002**: An existing pre-cutoff packet's validation result is unchanged by this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 `AC_COVERAGE` rule | Repointing has nothing to build on if it is absent | Verified present in `validator-registry.json` before starting |
| Risk | The gate fires on the 2,588 existing packets | High — mass false failure across the whole tree | Dated cutoff; unknown packet age is treated as pre-cutoff and stays advisory |
| Risk | Removing the `spec.md` column breaks the advisory's fallback counter | Medium | Fallback is retained and only used for pre-cutoff packets |
| Risk | A waiver becomes a rubber stamp | Medium — the gate turns into theatre | The referenced ADR must exist; a dangling reference fails |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The closure rule adds no more than a few file reads per packet, matching the cost profile of the sibling shell rules.

### Security
- **NFR-S01**: The rule reads packet documents only, and writes nothing.

### Reliability
- **NFR-R01**: A packet whose age cannot be determined is treated as pre-cutoff, so an unreadable date degrades to advisory rather than to a false block.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an `acceptance-criteria.md` with no criterion rows is a no-op for the gate, matching how the coverage advisory treats an empty count.
- Maximum length: no row limit; the rule is line-based like its siblings.

### Error Scenarios
- Missing `decision-record.md` while a row claims a waiver: error — the waiver cannot be verified.
- A waiver naming an ADR the decision record does not contain: error.
- Missing `acceptance-criteria.md` in a post-cutoff gated packet: caught by the existing file-presence rule, not by a duplicate check here.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 13, Systems: templates + validation + docs |
| Risk | 15/25 | Auth: N, API: N, Breaking: Y — changes the closure contract for all future gated packets |
| Research | 6/20 | Mechanisms already exist and were read; little investigation left |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: phase 001 rule, plus the reference surfaces |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Gate fires retroactively across the existing tree | H | M | Dated cutoff, unknown age degrades to advisory |
| R-002 | Waiver path used to bypass rather than record | M | M | ADR existence is verified, not asserted |
| R-003 | Level 1 silently loses acceptance criteria | M | L | Column is gated, not deleted; Level 1 retains it |

---

## 11. USER STORIES

### US-001: Closing a packet honestly (Priority: P0)

**As a** packet author, **I want** one document that states what must be true for this packet to close, **so that** "complete" means the criteria were met rather than that a checklist was ticked.

### US-002: Dropping a criterion on purpose (Priority: P1)

**As a** packet author whose criterion no longer applies, **I want** to retire it through a decision record, **so that** the change of mind is recorded where future readers will find it instead of vanishing.

---

## 12. OPEN QUESTIONS

- None. D1, D2 and D3 were settled by the operator on 2026-08-29 and are recorded in `decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Operator Goal**: See `../goal.md`

---
