---
title: "Tasks: packet-012 deep-review remediation"
description: "Per-finding fix tasks for the packet-012 review remediation."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/005-reviews-and-remediation/001-review-remediation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author remediation tasks"
    next_safe_action: "Implement T001 (vector crash recovery)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: packet-012 deep-review remediation

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. Each fix ships with its regression test. Legacy default stays `legacy`.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 (#1 REQ-001) Add stale-running reconciliation to `vectors.mjs` drain: reset/reclaim `running` jobs orphaned by a process exit (startup sweep or lease timeout); add a process-interruption regression test. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]
- [x] T002 (#2 REQ-002) In `retrieval.mjs` `queryPersistentStyles`, compare a caller-supplied generation — honor by reopening it, or fail-closed reject — never silently serve current; add a stale-generation test. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 (#3 REQ-003) In `schema.mjs` `resolvePublishedDatabasePath`, add read-side realpath containment (reject a pointer resolving outside the generation dir) and bind the opened DB's `generationHash` to the pointer; add containment + binding tests. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]
- [x] T004 (#4 REQ-004) Cap `queryVector` type/dimensions/serialized size in `retrieval.mjs` before fingerprinting on every caller path; reject oversized input; add a test. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]
- [x] T005 (#10 REQ-005) In `indexer.mjs` `readVerifiedArtifacts`/`computeAggregateHash`, exclude the mutable `slug` from the aggregate hash (use stable UUID/role identity); add a slug-rename hash-stability test. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]
- [x] T006 (#9 REQ-007) Add a documented, tested operator surface for persistent status/build/cutover/rollback/vector-repair + a keep-current+rollback generation prune invariant; update `_db/README.md`. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 (#7 REQ-006, #8) Resolve the SLO evidence: measure same-full-corpus persistent-vs-legacy OR amend the 003 SLO/checklist/completion claim to not assert "proven"; then reconcile the parent `Complete/verified` language (closes #8 once #5/#6/#7 hold). [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]
- [x] T008 Full `node --test` green (existing 24 + new regression tests) and legacy `_engine` 20/20 (no regression); `validate.sh --strict` = 0 errors. [SOURCE: styles/_db/vectors.mjs] [TESTED: 31/31 db, 20/20 legacy]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 (T001-T004) + P1/P2 (T005-T007) tasks `[x]` with evidence; tests + validate green; the persistent path is safe to enable behind an explicit go/no-go.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Findings source: `../review/lineages/sol/iterations/iteration-005.md` (deep review `955d58f898`).
- Target code: `../003-style-database/` implementation (`styles/_db/`, `styles/_engine/`).
- Already reconciled (#5/#6, partial #8): commit `955d58f898`.

<!-- /ANCHOR:cross-refs -->
