---
title: "Tasks: Phase 5: docs-governance-and-closeout"
description: "Task ledger for the closeout: roster and catalog truth, parent metadata, the phase-004 pair, this phase's documents, then the recursive gate with the trigger index and continuity last."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/005-docs-governance-and-closeout"
    last_updated_at: "2026-09-20T11:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Tasks executed; the recursive gate is the closing step"
    next_safe_action: "Report the operator's provider-credential step"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-005-docs-governance-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A Jev provider credential remains an operator step; the two authenticated scenarios stay SKIP"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: docs-governance-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the pre-phase baseline: hub gate, both dispatch suites, both package validators, manifest freshness
- [x] T002 Grep every mode enumeration and count for stale references to the hub's mode set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Name the transport in Rule 7's trigger and clarify that it is never a delegation target (`.skilled/agents/orchestrate.md`)
- [x] T004 Add the transport anti-pattern row and the related-resource line (`.skilled/agents/orchestrate.md`)
- [x] T005 Add the eligibility note that the transport needs no row because it runs nothing (`.skilled/agents/prompt-improver.md`)
- [x] T006 Add the `NONE (transport)` persona-attachment row (`.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`)
- [x] T007 Correct the hub catalog root's mode counts, transport paragraph and inspector line (`cli-external-orchestration/feature-catalog/feature-catalog.md`)
- [x] T008 Correct the same falsified zero-axis claims at the routing leaf (`.../feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`)
- [x] T009 Author the parent phase map, handoff criteria and metadata (`001-cli-jev-creation/spec.md`)
- [x] T010 Author the parent durable directive and completion criteria (`001-cli-jev-creation/goal.md`)
- [x] T011 Complete the phase-004 pair left at scaffold (`004-catalog-and-playbook/{spec.md,plan.md}`)
- [x] T012 Author this phase's five documents (`005-docs-governance-and-closeout/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Re-run the hub gate after the catalog edits (`parent-skill-check.cjs` on the hub path)
- [x] T014 Re-run both dispatch suites, including the declared/implemented bijection
- [x] T015 Re-run both package validators for `cli-jev` (catalog and playbook)
- [x] T016 Run the scaffold-token scan over the five children
- [x] T017 Run the recursive strict gate over the parent and the five children
- [x] T018 Re-derive the per-folder metadata after the final document writes, then re-run the strict gates
- [x] T019 Regenerate the trigger index and verify a lookup surfaces the packet
- [x] T020 Save continuity for the packet through the continuity writer
- [x] T021 Re-run the recursive gate on the final tree so the recorded result matches it
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed, including the recursive gate read in full
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` and `../goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code was changed in this phase; the touched files are documents
- [x] CHK-011 [P0] Every JSON touched by an adjacent phase still parses; this phase touched none
- [x] CHK-012 [P1] Every claim written in this phase came from a command run in this session
- [x] CHK-013 [P1] Each edited document keeps its frontmatter fields and four-part version where it has one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: hub gate, both suites, both validators, recursive gate
- [x] CHK-022 [P1] Edge cases tested: the mode-enumeration grep re-run after the edits, and the scaffold-token scan
- [x] CHK-023 [P1] Error scenarios validated: the recursive gate's failure output is quoted where it occurred and repaired before the pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `docs-drift` for the roster and catalog claims, `scaffold-leftover` for the phase-004 pair
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the mode-enumeration grep ran across `.skilled/`, `repo-rules/` and `AGENTS.md`
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the hub catalog validator and the prompt-card sync guard were re-run after their inputs changed
- [x] CHK-FIX-004 [P0] Not applicable: no path, parser, redaction or security change in this phase
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed: the verification table in `implementation-summary.md`
- [x] CHK-FIX-006 [P1] Not applicable: no process-wide state is read by a document
- [x] CHK-FIX-007 [P1] Evidence is pinned to the final tree: the recursive gate re-ran after the last write
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: no credential value appears in any document this phase touched
- [x] CHK-031 [P0] Input validation implemented: not applicable, documents only
- [x] CHK-032 [P1] Auth/authz working correctly: unchanged; this phase touched no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: not applicable, no code changed
- [x] CHK-042 [P2] README updated: the hub README was updated in phase 003; no README edit belongs to this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-20
<!-- /ANCHOR:summary -->
