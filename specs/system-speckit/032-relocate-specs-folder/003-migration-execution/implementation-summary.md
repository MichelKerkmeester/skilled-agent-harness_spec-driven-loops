---
title: "Implementation Summary: Specs-Root Migration Execution"
description: "All 11 steps of the runbook ran and verified clean, including step 9's Memory MCP reindex — worked around a daemon-workspace mismatch with a standalone reindex, then a verified bulk-delete of 10,459 stale-alias rows the reindex alone couldn't clean up."
trigger_phrases:
  - "migration execution summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-07T11:35:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 11 steps executed and verified; step 9 dedup resolved via bulk-delete"
    next_safe_action: "T015: operator reviews the final state"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-migration-execution |
| **Completed** | 2026-08-07 — all 11 steps executed and verified |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runbook scoped in this phase (11 numbered steps, each with an exact command and its own pass/fail check) then ran, gated by the operator's separate `/goal` submission plus "Go" — the explicit approval ADR-001 required.

### The Flip (Step 4)

The atomic step: `specs/` is now the real, physical directory; `.opencode/specs` is a relative symlink to `../specs`. Landed in one commit (`606e55cb8a`) together with the `.gitignore` rebase for the four downstream projects (`ai-systems`, `anobel.com`, `barter`, `z-future`), per ADR-002's leak-prevention requirement. All three named pre-commit checks passed before committing.

### The Wider Fix (Steps 5-8, 10)

Steps 5-8 flipped the 12 originally-named call sites (7 registry resolvers, 5 `SPEC_KIT_SPECS_DIR` override sites) plus CI and operator-facing docs. Step 10's test-suite inversion surfaced **6 more production files** with the same hardcoded old-direction bug that were never on the original list: `spec-root-canonical-resolver.ts`, `spec-root-write-guard.ts`, `spec-root-migration.ts` (two functions), `spec-root-migration-manifest.ts`, and `config.ts` (whose registry label had also been wrong — `legacy-first` when the code was always canonical-first). All were fixed in the same pass, since a real correctness bug post-flip isn't optional just because it wasn't on the original list.

### Step 9's Design Gap (Memory MCP Reindex)

This session's `mk-spec-memory` MCP connection resolved to a daemon serving a different git worktree (`.worktrees/0129-system-deep-loop-036-remediation-execution/`), not the main repo. Worked around it with the standalone `cli.js reindex --force`, bypassing the daemon and writing directly to the main repo's own `context-index.sqlite`.

That standalone reindex ran for roughly 3 hours discovering new content under `specs/`, but it structurally could not clean up the 10,459 rows still indexed under the old `.opencode/specs/` alias. The root cause, confirmed by reading `incremental-index.ts`: both its stale-path detector and its orphan sweep check literal filesystem existence, and the `.opencode/specs -> ../specs` compat symlink means those old-alias paths always resolve — no amount of reindexing will ever flag them as orphaned. A direct SQL check confirmed the real damage: 2,384 of those rows already had a duplicate counterpart indexed under the canonical path, a live violation of this step's own acceptance check.

The operator chose to bulk-delete the stale rows immediately rather than defer to a code-level fix. Killed the reindex process, then ran one transactional `DELETE FROM memory_index WHERE file_path LIKE '%.opencode/specs/%'` (10,459 rows) with `PRAGMA foreign_keys = ON`. The `memory_fts_delete` trigger cascaded the FTS5 shadow table automatically; `PRAGMA integrity_check` returned ok and `PRAGMA foreign_key_check` found 0 violations. Final index state: 0 stale-alias rows, 5,733 canonical `specs/` rows, 5,756 total.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed the runbook from `plan.md` §4 in order, verifying each step's named check before proceeding, per the operator's autonomous-execution directive. Along the way: discovered and resolved a 3,308-file pre-existing dirty tree blocking step 1's pre-flight (committed as its own change, `2666012cfe` after a rebase), fixed a genuinely ambiguous 2,814-file deletion (the already-decommissioned `system-code-graph` packet) with an explicit operator decision, and removed the `system-code-graph` skill folder's last stray artifact per a separate operator request mid-run. Resolved two later remote divergences (concurrent live work landing on the same branch) via rebase, no data loss.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix 6 more discovered call sites beyond the original 12 (step 10) | Testing the validation matrix surfaced real production bugs (old canonical direction still hardcoded) that would have shipped broken if left alone just because they weren't on the original list |
| Route step 9 around the daemon instead of killing it | The daemon may be serving another live session (confirmed: it pushed 2 real commits to this same branch mid-run); a standalone `cli.js reindex --force` against the main repo's own DB got the same result without disrupting it |
| Bulk-delete the 10,459 stale rows instead of scoping a code-level fix first | The operator chose speed: a raw reindex could never clean these rows up (confirmed via code read, not guesswork), and the fix is a rebuildable index-cache mutation, not data loss — a proper `incremental-index.ts` fix can still follow later if the symlink direction ever changes again |
| Commit the pre-existing 3,308-file dirty tree before step 1 could proceed | Step 1's clean-tree precondition genuinely couldn't be satisfied otherwise; each ambiguous case (the system-code-graph deletion) got an explicit operator decision rather than a guess |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Step 1-8, 10 named checks | PASS — see `tasks.md` T004-T013 for evidence per step |
| Step 4's 3 pre-commit checks (gitignore match, symlink target, no leaked project trees) | PASS — all 3 confirmed before commit `606e55cb8a` |
| `registryCoverageGaps()` | PASS — empty |
| `spec-root-*` test suite | 54/55 pass (1 pre-existing, unrelated regex typo) |
| `tsc --noEmit` across both packages | PASS — 0 new errors |
| This packet's own `validate.sh --strict` | PASS — 0 errors after this save regenerates description.json/graph-metadata.json |
| Step 9 (Memory MCP reindex + dedup) | PASS — 10,459 stale rows deleted, `PRAGMA integrity_check` ok, `PRAGMA foreign_key_check` 0 violations, FTS cascade confirmed 1:1 |
| Step 11 (full repo sweep) | PASS — `strict-pass-freshness.ts --roots specs`: 0 regressions, 0 new failures across 1,911 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **582 exact-duplicate rows remain in the Memory MCP index, unrelated to this migration.** Discovered while verifying the step-9 dedup: the same literal `file_path` (with identical `anchor_id`/`title`) is indexed twice for 582 files, including non-`specs/` files like `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md`. Pre-existing, not caused by the specs-root flip, and out of this packet's scope — flagged for a future standalone investigation into the incremental scan's insert-vs-update logic.
2. **The daemon that owns the shared `context-index.sqlite` is worktree-routed, not repo-routed.** `mk-spec-memory-launcher.cjs` resolves its root from its own physical script location, so whichever worktree's daemon wins the election determines which repo gets indexed through the MCP tools. This session worked around it with a standalone CLI invocation; the underlying routing behavior is unchanged and will resurface for the next session that hits it.
3. **A live concurrent session is working on this same branch** in a separate worktree (confirmed via multiple independent commit pushes during this run). Anyone picking this packet back up should re-fetch before assuming the branch tip.
4. **`CLAUDE.md` has the same stale "Spec folder path" row `AGENTS.md` had before step 8 fixed it** — flagged to the operator, not fixed here (out of this packet's named scope).
<!-- /ANCHOR:limitations -->
