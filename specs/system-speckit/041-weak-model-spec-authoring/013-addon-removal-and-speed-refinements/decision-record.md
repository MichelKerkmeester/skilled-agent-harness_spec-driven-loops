---
title: "Decision Record: Phase 13: addon-removal-and-speed-refinements"
description: "Why this packet accepts strict-census changes that only remove a failure from a packet-root add-on file no template defines."
trigger_phrases:
  - "addon removal and speed refinements decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/013-addon-removal-and-speed-refinements"
    last_updated_at: "2026-10-26T12:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Recorded ADR-001 on the strict-census verdict changes"
    next_safe_action: "Run the final strict validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-013-addon-removal-and-speed-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 13: addon-removal-and-speed-refinements

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Accept verdict changes that only remove a failure from a packet-root add-on file no template defines
<!-- FILL: Write one ADR per decision with context, choice, consequences and the rejected option. GOOD: ADR-001: a flag, because callers already pass flags. WEAK: We decided on a flag. -->

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, conductor |

---

<!-- ANCHOR:adr-001-context -->
### Context

REQ-003 asked the strict census and the six-rule census to match their baselines exactly. The strict census over 4,719 folders was rerun after the change and joined with `scratch/baseline/census-before.tsv`. Exactly 2 rows changed, and no folder gained an error or a warning:

- `specs/sk-prompt/z_archive/002-sk-improve-prompt-rename`: FAIL with 1 error became PASS with 0.
- `specs/system-deep-loop/z_archive/015-sk-deep-rename`: FAIL with 2 errors and 1 warning became FAIL with 1 error and 1 warning.

Both folders hold a packet-root `resource-map.md`. The validator's authored-document set (`authoredDocsForLevel` in `orchestrator.ts`) checks only documents that a template defines. The operator decided on 2026-10-26 to delete the resource-map template, so those files are no longer template-checked, which removed one error in each folder. The six-rule census diff printed nothing. The full rows are in `scratch/baseline/census-before.tsv` and `census-after.tsv`.

### Constraints

- The resource-map template stays deleted: the operator chose that on 2026-10-26, and D1 in `goal.md` freezes it.
- Archived packets under `z_archive/` are records; this phase does not edit them.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Accept a strict-census change when it only removes an error or warning that came from a packet-root add-on file no template defines.

**How it works**: AC-003 is superseded by AC-010, which still requires the six-rule census to match exactly and allows a strict-census row to change only toward PASS, from such a file. The two changed rows meet that test.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept the two changes toward PASS** | No new upkeep; the change follows from the operator's decision | REQ-003's exact-match wording no longer holds as written | 9/10 |
| Restore the resource-map template only to keep validating archived files | The strict census matches exactly | Brings back the manifest entries, phrase maps and snapshots the removal cut | 3/10 |
| Keep a separate validation path for deleted add-ons | The strict census matches exactly | A second code path to maintain for files no new packet can create | 2/10 |

**Why this one**: Both rejected options bring back the upkeep the removal cut, only to keep failing two archived records.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Archived packets can only move toward PASS, and none gains a failure: 2 of 4,719 rows moved, both with fewer errors.
- No template, manifest entry or validator branch returns for the deleted add-on.

**What it costs**:
- REQ-003's exact match no longer holds for the strict census. Mitigation: AC-010 states the narrower test and the joined diff proves it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later change hides a real failure behind this exception | L | AC-010 accepts only changes that remove errors or warnings, from a packet-root add-on file no template defines |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The strict diff shows 2 changed rows, so AC-003 cannot be Met as written |
| 2 | **Beyond Local Maxima?** | PASS | Restoring the template and a separate path were both weighed |
| 3 | **Sufficient?** | PASS | No code change; one superseding criterion |
| 4 | **Fits Goal?** | PASS | The goal is fewer add-ons with no packet gaining a failure, which holds |
| 5 | **Open Horizons?** | PASS | Any future add-on removal follows the same narrow test |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-003 is Superseded by this ADR and AC-010 holds the narrower test.
- `spec.md`: REQ-003 notes that this ADR supersedes it in part.

**How to roll back**: Restore `templates/addons/resource-map.md.tmpl` and its manifest entry from the start commit `fdc0ddde40`, set AC-003 back to Unmet and remove AC-010.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
