---
title: "Tasks: migrate specs and docs (017 phase 012)"
description: "Tasks for phase 012 of the 017 kebab-case filesystem-naming program: migrate specs and docs."
trigger_phrases:
  - "migrate specs and docs tasks"
  - "hyphen naming phase 012 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/012-migrate-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/012-migrate-specs-and-docs"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Migrate specs and docs

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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces
- [ ] T003 Rewrite doc cross-references to the renamed paths
- [ ] T004 Resolve markdown links across all active specs/docs (not just current checker roots)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: Zero in-scope underscore doc filenames remain outside frozen surfaces — `git ls-files` finds 0 in-scope underscore doc names (excl frozen)
- [ ] T006 Verify: Frozen surfaces are untouched except an approved supersession note — No content change under `z_archive/`, changelogs, or completed history beyond the approved note
- [ ] T007 Verify: Doc cross-references and markdown links resolve after the rename — Markdown-link resolution across active specs/docs is clean
- [ ] T008 Verify: Every touched packet/skill strict-validates — `validate.sh --strict` Errors 0 on touched packets
- [ ] T009 Verify: Identifier/key content is not altered by the doc rename — Only filesystem names + path references changed; prose identifiers untouched
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
