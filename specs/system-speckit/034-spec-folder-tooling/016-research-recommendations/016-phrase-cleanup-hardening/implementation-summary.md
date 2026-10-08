---
title: "Implementation Summary: Phrase cleanup hardening"
description: "Status and summary of phase implementation."
trigger_phrases:
  - "phrase cleanup hardening implementation"
  - "template phrase cleanup summary"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "planning-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

# Implementation Summary: Phrase cleanup hardening

<!-- ANCHOR:summary -->

## Status

This phase is **planned** and not yet built.

## What Was Planned

The phase plans to harden the phrase cleanup family with three improvements: atomic writes in `template-phrase-cleanup.mjs`, seed recipes for all 18 template document kinds, and a pre-commit hook lint that validates staged frontmatter against the phrase-judge criteria.

## What Remains

All implementation work remains:
- Discover all 18 template document kinds
- Extract default seed phrases for each
- Implement atomic write (temp file + rename pattern)
- Add unit test for atomic write
- Update census tool to recognize all 18 kinds
- Add seed recipes to the pin test
- Extend create.sh seeding logic
- Implement no-frontmatter routing
- Create pre-commit phrase-judge lint
- Write tests for the lint
- Run all existing tests to confirm no regression
- Integration testing

## Key Decisions and Trade-offs

The plan chose temp file + rename as the atomic write strategy, which is well-supported across platforms. The seed recipes are added directly to the pin test alongside the two-way pin test (templates ↔ create.sh), rather than in a separate data file. The pre-commit lint blocks only `template-default` and `editor-fallback` on newly added phrases, warns on every other class, and is bypassed with `SPECKIT_SKIP_PHRASE_LINT=1`, as the operator decided on 2026-10-08.

## How to Resume

1. Read the plan and tasks in this folder.
2. Run the discovery tasks (T001-T002) to identify all 18 kinds and their phrases.
3. Follow the implementation tasks (T003-T013) in order.
4. Use the acceptance criteria to verify each step.
5. Run `validate.sh --strict` before claiming completion.

## Notes for Future Sessions

- The 18 template kinds include the five built-in kinds (spec, plan, tasks, implementation-summary, acceptance-criteria) plus thirteen add-on kinds (goal, changelog, before-after, and others).
- Atomic writes are important because cleanup is often run as part of a batch operation and a partial write can corrupt a spec folder.
- The two-way pin (templates ↔ create.sh) ensures seed recipes match template defaults, which is the source of truth.
- No-frontmatter files should be routed to a fixer rather than skipped silently.

<!-- /ANCHOR:summary -->
