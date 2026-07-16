---
title: "Tasks: remove transition aliases (032 phase 009)"
description: "Tasks for phase 009 of the 032 kebab-case filesystem-naming program: remove post-migration root and index aliases and verify fail-closed handling."
trigger_phrases:
  - "remove transition aliases tasks"
  - "hyphen naming phase 009 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Decomposed alias removal into prerequisite, consumer, fixture, and evidence tasks"
    next_safe_action: "Start with the phase 002 closure and consumer-manifest checks"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases/plan.md"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/009-remove-transition-aliases/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Remove transition aliases

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 002's coexistence window is closed and the physical canonical roots are present.
- [ ] T002 Reconcile the phase 002 consumer manifest with the current branch and record every consumer row.
- [ ] T003 Record the pinned BASE SHA and candidate starting SHA before alias-removal edits.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Remove legacy root/index lookup and emission branches from the shared classifier and resolver.
- [ ] T005 [P] Remove legacy path handling from the Lane C loader/generator, router, package, and guard consumers.
- [ ] T006 [P] Update canonical positive fixtures and add negative fixtures for old roots, old indexes, mismatched pairs, and near-matches.
- [ ] T007 Review changed predicates for the policy exemptions and frozen surfaces; retain only intentional negative-test or historical references.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every consumer-manifest row has no executable transition alias or has an evidence-backed non-consumer disposition.
- [ ] T009 Verify: canonical hyphenated roots and indexes preserve typed classification, routing, packaging, generation, and scenario discovery.
- [ ] T010 Verify: every old root/index, mismatched pair, and near-match fails explicitly without `readme`, empty-corpus, or unrelated fallback.
- [ ] T011 Verify: both physical roots are rejected as a conflict before discovery or classification.
- [ ] T012 Verify: the phase diff changes no code identifiers, data keys, frontmatter fields, Python/package exemptions, or frozen history.
- [ ] T013 Assemble the phase 009 evidence bundle for the phase 010 whole-repo gate.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green with canonical and fail-closed fixture results recorded
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification contract**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
