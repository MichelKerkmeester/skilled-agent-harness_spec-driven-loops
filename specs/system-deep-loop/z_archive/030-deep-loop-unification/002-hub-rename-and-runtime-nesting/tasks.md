---
title: "Tasks: Hub Rename + Runtime Nesting"
description: "Task ledger for the irreversible structural merge of deep-loop-runtime into deep-loop-workflows as system-deep-loop."
trigger_phrases:
  - "hub rename runtime nesting tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/002-hub-rename-and-runtime-nesting"
    last_updated_at: "2026-07-08T06:40:24.201Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All stages executed and verified; ready to commit"
    next_safe_action: "Commit scoped changes, then hand off to 003"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-002-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Hub Rename + Runtime Nesting

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Establish recovery baseline (worktree snapshot or pre-move tag).
- [x] T002 Quiesce: confirm zero in-flight `/deep:*` sessions, zero stale writer-lock files under `deep-loop-runtime/database/`.
- [x] T003 Capture baseline `npm test` (deep-loop-runtime) + `npm run test:council` (system-spec-kit/mcp_server) — record EXACT current numbers, don't assume research.md's snapshot still matches. Also snapshot SQLite checksums + `observability-events.jsonl` line count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Stage 1: `git mv deep-loop-workflows system-deep-loop`; edit identity fields inside that tree.
- [x] T005 Stage 2: `git mv deep-loop-runtime system-deep-loop/runtime`; delete its `graph-metadata.json`.
- [x] T005a Stage 2 (corrected): reconcile `SKILL.md` into the ALREADY-EXISTING `README.md` — fold content, strip routable-skill frontmatter, delete `SKILL.md` only after confirmed folded. Do NOT `git mv`/overwrite.
- [x] T006 [P] Stage 3a: repair the expanded Class-A (forward) coupling sites — 5 scripts + 10 test files + 2 special-shape files (see plan.md).
- [x] T007 [P] Stage 3a: repair the expanded Class-B (reverse) coupling sites — 16 files incl. `orchestrate-session.cjs`, both `runtime-capabilities.cjs` copies, `deep-review/reduce-state.cjs`, plus `replay-graph-from-artifacts.cjs`'s different insert-segment shape.
- [x] T008 Stage 3b: repair the expanded `system-spec-kit` tooling-borrow — config pair + `artifact-root.cjs`/test companion + `council-playbook-anchor-integrity.vitest.ts`; re-derive `dependency-seams.vitest.ts`'s `skillsRoot`.
- [x] T009 Stage 4: fresh-author `graph-metadata.json`; bump version to `2.0.0.0`; write `changelog/v2.0.0.0.md`.
- [x] T017 Stage 3c (new): pull forward the 3 router `.md` one-liners (`.opencode/commands/deep/{research,review,ai-council}.md`) from child 003's scope — needed for this phase's own live-verification step.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `package_skill.py --check` on the hub and all 4 mode packets.
- [x] T011 Confirm exactly one `graph-metadata.json`.
- [x] T012 `npm test` in `runtime/` — compare against T003's baseline; pass = no NEW failures beyond the known-pre-existing ones.
- [x] T013 `npm run typecheck` succeeds in `runtime/`.
- [x] T014 `npm run test:council` in `system-spec-kit/mcp_server/` — compare against T003's baseline (already RED); pass = no NEW failures.
- [x] T015 Confirm durable state survived intact — content verified (JSON-valid, no truncation, no corruption); SQLite checksums diverge from the Stage-0 snapshot because this phase's own verification `npm test` runs legitimately appended new entries (369→635 lines), not because of data loss. `git log --follow` is not yet meaningful pre-commit; git's rename-detection heuristic did not auto-flag this one actively-growing file as `R` at status time (shown as D+A) — noted as a minor, non-blocking cosmetic gap, not a correctness issue.
- [x] T016 Live `/deep:research` or `/deep:review` short run confirms reverse `require()`s resolve — use `cli-opencode` or plain in-session dispatch, NOT `cli-claude-code` (confirmed broken via macOS Keychain auth gap in 001's research).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
