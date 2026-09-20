---
title: "Feature Specification: Program-Surface Leftovers"
description: "Close the four in-scope findings no sibling phase owns — implicit workflow token permissions while npm-fetched tools execute, a feature catalog conflating modes with packets, a deprecated derived-sync writer advertising a schema path it no longer serves, and the requirement wording that contradicts the phase map's own ordering."
trigger_phrases:
  - "workflow token permissions implicit"
  - "feature catalog modes versus packets"
  - "deprecated derived sync writer"
  - "requirement wording contradicts phase map"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/019-program-surface-leftovers"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed four program-surface leftovers"
    next_safe_action: "Proceed to phase 018"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/019-program-surface-leftovers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The derived-sync writer has no production caller, so it was documented as deprecated-but-retained rather than deleted"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Program-Surface Leftovers

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A coverage audit of the six remediation phases against all 41 audit findings found four that touch surfaces this program built or edited, and that no sibling phase owns. Without this phase they would be closed by omission rather than by decision.

The routing workflow leaves token permissions implicit while executing tools fetched from a package registry. The workflow is the program's own deliverable, and a job that does not declare a least-privilege token grant inherits whatever the repository default is — a wider grant than a test runner needs.

The root feature catalog describes twelve workflow modes as though they map one-to-one onto twelve packets. They do not: modes and packets are separately-addressable concepts, and an alias fan-out means one packet can back more than one mode. A reader routing by that catalog will reach the wrong place.

A deprecated derived-sync writer still advertises a full-object schema path it no longer serves, which invites a caller to depend on a shape the module will not honour.

Finally, a requirement's acceptance criteria states that the baseline is recorded before the first phase begins, while the phase map places the baseline capture second. Two audit lineages found this independently. The reviewer who checked it rated the consequence as low — it is a wording defect with no behavioural effect — but it is a contradiction inside the document that governs the program, and it is cheap to correct.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — declaring an explicit least-privilege token permission on the routing workflow; correcting the feature catalog's mode-versus-packet framing; resolving the deprecated derived-sync writer's advertised schema path by deletion or by an accurate deprecation note; and amending the requirement wording so it matches the phase map's ordering.

Out of scope — the regression and its gates (phases 013 and 014); completion claims and checklist evidence (015); metadata regeneration (016); authority path and contract corrections (017); the disposition register (018); and every finding that blames a line outside this program's commit range, which phase 020 owns.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The routing workflow declares an explicit least-privilege token grant | The workflow specifies the permissions its jobs actually need rather than inheriting the repository default, and a CI run confirms the jobs still pass under the narrowed grant. A grant that is narrowed but never exercised is not verified |
| REQ-002 | The feature catalog distinguishes modes from packets | The catalog states the real relationship, including that one packet can back more than one mode, so a reader routing by it reaches the right target. The count is corrected wherever it implied a one-to-one mapping |
| REQ-003 | The deprecated derived-sync writer no longer advertises a path it does not serve | Either the writer is removed after confirming no caller reaches it, or its documentation states accurately what it does and does not honour. Leaving a misleading schema advertisement in place is not an acceptable close |
| REQ-004 | The requirement wording matches the phase map's ordering | The acceptance criteria reads consistently with where the baseline capture actually sits in the sequence, and no other requirement in the parent spec contradicts the map |
| REQ-005 | Each fix is verified by its own check, not by inspection alone | The workflow change is proven by a CI run, the catalog by reading it against the live mode registry, the writer by a caller search, and the wording by re-reading the parent spec for remaining contradictions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The routing workflow declares explicit permissions and still passes CI under them; the feature catalog describes the real mode-to-packet relationship; the deprecated writer is either gone or accurately documented, with the caller search recorded either way; the requirement wording agrees with the phase map; and each of the four carries a verification specific to it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Narrowing workflow permissions could break a job that quietly relied on a wider default | REQ-001 requires a CI run under the narrowed grant before the change is accepted, so the failure surfaces immediately rather than on the next unrelated push |
| Risk | Deleting the deprecated writer could break an unlisted caller | REQ-003 makes deletion conditional on a caller search; where the search is inconclusive, the documentation path is taken instead |
| Risk | Amending requirement wording after the fact could be read as rewriting history to fit the outcome | The amendment corrects an internal contradiction that predates the audit and changes no acceptance threshold; the change is recorded as a wording correction rather than a scope change |
| Dependency | Phase 014 touches the same workflow file | If both phases are open simultaneously, the workflow edits are sequenced to avoid a conflicting rewrite of the same job block |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved: the caller search found no production importer of the derived-sync writer (only two test files reach it), so it was retained with an accurate `@deprecated` banner rather than deleted — deletion plus rewriting the two dependent tests is a larger, operator-preference change left open. The routing workflow's live CI run under the narrowed permission grant is operator-gated (this program does not push).
<!-- /ANCHOR:questions -->
