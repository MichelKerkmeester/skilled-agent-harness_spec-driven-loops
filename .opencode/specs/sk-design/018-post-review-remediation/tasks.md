---
title: "Tasks: Post-Review Remediation of the sk-design Remediation Program"
description: "Task ledger for remediating the verified 017-review findings: stale _db/_engine path fixes in the playbook, database README, 015 phase-map, and graph-metadata pointers, plus the P1-006 refutation."
trigger_phrases:
  - "post review remediation tasks"
  - "stale db engine path fix tasks"
  - "017 findings remediation ledger"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-post-review-remediation"
    last_updated_at: "2026-07-21T18:25:00Z"
    last_updated_by: "remediation"
    recent_action: "Completed the pointer + doc fixes; refuted P1-006."
    next_safe_action: "Validate + commit."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-018-post-review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Post-Review Remediation of the sk-design Remediation Program

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done with evidence. The executable contract is zero residual dead `_db`/`_engine`
current-state references with every rewritten path resolving, and no shipped code changed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirmed the 4 target files unchanged between review HEAD `7b9d3b6b71` and origin tip; created the fresh worktree at origin. [SOURCE: `git diff --quiet` = unchanged; `.worktrees/0095-sk-design-018-post-review-remediation`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 P1-002 + P1-004: rewrote `_db`/`_engine` paths in `manual-testing-playbook.md` + `database/README.md`. [TESTED: 0 residual refs; 5/5 new module paths resolve]
- [x] T003 P1-003: corrected the `015` phase-map (`001`/`005`/`006` → `Complete`) + refreshed parent continuity. [SOURCE: `015/spec.md` phase-map + continuity]
- [x] T004 P1-005: fixed `key_files` continuity pointers in `001`/`004`; regenerated graph-metadata + descriptions for `012`/`015`/`001`/`004`. [TESTED: 0 dead `_db`/`_engine` paths in the 3 flagged graph-metadata files]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 P1-006: verified against code + tests; the `requery-required` path is reachable + tested, the flagged line is intentional. No code change; refutation documented. [SOURCE: `comparison-lane.test.mjs:227-241` reachable; `:169` no-fit tested]
- [x] T006 Confirmed historical prose `_db` refs preserved; no shipped code file modified. [SOURCE: `003` impl-summary `styles/_db/schema.mjs` intact; scope-diff = docs/metadata only]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] User-facing docs + phase-map + graph-metadata pointers current; every path resolves (T002/T003/T004)
- [x] P1-006 verified + refuted without altering shipped behavior (T005)
- [x] History preserved; no code changed (T006)
<!-- /ANCHOR:completion -->
