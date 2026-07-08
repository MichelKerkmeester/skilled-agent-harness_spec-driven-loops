---
title: "Tasks: Validation and Closeout"
description: "Task ledger for the final recursive validation sweep and commit/push closeout."
trigger_phrases:
  - "deep loop unification closeout tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/005-validation-and-closeout"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "T001-T006 done and verified; T007 held for explicit go-ahead"
    next_safe_action: "Get explicit commit/push confirmation, then run T007"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-005-scaffold"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Validation and Closeout

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

- [x] T001 002/003 both report their own exit gates green (002 committed as `6323b84342`, 003's `implementation-summary.md`/`checklist.md` document its own full pass). 004 remains deliberately deferred (optional, operator-gated per its own spec; 001's research already recommended against building it — the real fanout run never needed the GLM→MiMo fallback it would wire).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Regenerated phase-parent `description.json` (via `generate-description.js`, replacing stale pre-merge content) + `graph-metadata.json` (via `backfill-graph-metadata.js`).
- [x] T003 001 and 002 already had real `implementation-summary.md` from their own execution; 003's was authored this phase (see `003-external-reference-migration/implementation-summary.md`). 004 and 005 correctly have none (004 unbuilt by design; 005 is this closeout pass itself).
- [x] T004 Worktree-drift advisory: mid-closeout, a concurrent session modified `tests/parity/python-ts-parity.vitest.ts` and `tests/legacy/advisor-corpus-parity.vitest.ts` in `system-skill-advisor` (an unrelated `mcp-figma` retirement shrinking the labeled corpus 197→193 rows, landing its own `ACCEPTED_PARITY_REGRESSION_IDS`/expected-count values on top of this packet's 003-phase edits to the same two files). Re-verified rather than reverted: both files re-run green with the concurrent session's content (3/3 tests passing), and the broader `runtime/` (70/71) and `system-skill-advisor` (690+/692) suites remain at their established baselines. No conflict with this packet's own changes — the two sessions touched the same files for genuinely disjoint reasons and the net result is internally consistent.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `validate.sh --recursive --strict` exit 0 across the phase-parent and all 5 children (re-run twice more after T002's metadata regeneration and the parent `spec.md` status-table update each staled the `source_fingerprint`, then fixed and re-confirmed clean both times).
- [x] T006 Scoped `git status --porcelain` review: ~1128 files under `.opencode`/`.github`/`.gitignore`/`AGENTS.md`, all attributable to this packet's own work (002+003+005) plus the one confirmed concurrent-session file pair noted in T004 — no unrelated contamination found.
- [ ] T007 Commit + push. **Deliberately held**: this is the one genuinely hard-to-reverse, shared-state-affecting action in this phase (per the standing "never commit without being explicitly asked" rule) — everything else in this phase is a safe, local, reversible file operation. Awaiting explicit go-ahead before executing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
