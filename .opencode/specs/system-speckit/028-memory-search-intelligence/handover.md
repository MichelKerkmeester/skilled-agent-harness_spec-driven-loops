---
title: "Session Handover: 028 Renumber Follow-ups — Open Items"
description: "Handover after the 028 top-level renumber, subsystem-sibling normalization and drift cleanup, capturing the one genuinely-open item (descriptions.json reindex) plus the daemon and concurrent-session context a next session needs."
trigger_phrases:
  - "028 renumber handover"
  - "descriptions.json reindex handover"
  - "028 open items"
  - "resume 028 renumber follow-ups"
importance_tier: "important"
contextType: "implementation"
---
# Session Handover: 028 Renumber Follow-ups — Open Items

Continuation record after the 028 renumber + subsystem normalization + drift-cleanup session. Everything the operator flagged (028 numbering, folder names, json drift, system-deep-loop 039/040 naming) is shipped; this handover exists so a next session can close the one remaining gated item without re-deriving state.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this handover when resuming the 028 renumber follow-ups — specifically to run the deferred `descriptions.json` reindex at a clean sync point, to recover the daemon if it re-wedges, or to re-anchor after context compaction.

**Status values:** draft | in_progress | review | complete | archived — this handover is **in_progress** (one open item).
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 028 renumber + subsystem-sibling normalization + drift-cleanup + daemon un-wedge.
- **To Session:** next maintenance session, run at a clean concurrent-sync point.
- **Phase Completed:** 028 top-level renumber (000-006), nested/changelog/rollup-doc alignment, 039/040 deeploop→deep-loop, 032 children_ids fix, dark-flag + 015 + 015/001 validation cleanup. All shipped to `origin/system-speckit/028-memory-search-intelligence`.
- **Recent action:** Un-wedged the spec-memory daemon (search restored) and deliberately deferred the `descriptions.json` reindex to a clean sync point.
- **Spec:** .opencode/specs/system-speckit/028-memory-search-intelligence
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Renumber 028 top-level to a contiguous 000-006 | Close the gaps the subsystem extraction left; operator chose "everything incl. top-level". | 003-skill-advisor→002, 005-spec-data-quality→003, 006-review-remediation→004, 007-dark-flag-graduation→005, 008-speckit-surface-alignment→006; changelog subtree + rollup docs realigned. |
| Normalize system-deep-loop 039/040 `deeploop`→`deep-loop` | Match the `system-deep-loop` packet name; folder-vs-json drift was the only real audit finding there. | Renamed folders + json + refs; preserved descriptive tokens (`deeploop-reliability-*`) and frozen records. |
| Defer the `descriptions.json` reindex | ~2/3 of its drift is the concurrent session's active renames; a reindex now re-stales immediately. | Only open item; must run at a clean sync point with a working daemon. |
| Push via rebase-aware temp-index (never `git add -A`), exclude `descriptions.json` | A concurrent session commits to the same branch continuously; a subtree-swap onto the live tip avoids clobbering its work. | Every commit this session was verified 028/deep-loop-scoped before push. |

### 2.2 Blockers Encountered

**Blockers:** the `descriptions.json` reindex is gated on (a) a clean concurrent-sync point and (b) a healthy daemon. Not a hard blocker for anything shipped — memory search works; only the global index has stale path entries.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

**Resume with:** `/speckit:resume .opencode/specs/system-speckit/028-memory-search-intelligence`

### 3.1 THE open item — `descriptions.json` reindex

- **State:** `.opencode/specs/descriptions.json` has ~301 stale entries (path no longer on disk). ~102 are this session's 028/deeploop renames; ~199 are the concurrent session's own `sk-design`/`sk-doc` renames (e.g. `design/001-sk-design-interface/*`).
- **Gate:** run only once the concurrent session has settled (its work committed and quiet), else the reindex re-stales immediately. This is the recorded "coordinate at clean sync" gate.
- **Steps:** (1) confirm the daemon serves a real `memory_context`/`memory_search` call — do NOT trust `memory_health --warm-only`, which returns a documented false-negative `ECONNREFUSED`; (2) scoped `memory_index_scan({specFolder})` for each renamed path (028 subtree + `system-deep-loop/039-deep-loop-finding-dedup`, `.../040-deep-loop-gauges-dedup-scale`), avoiding full-tree scans which have SIGBUS-ed on this corpus; (3) surgically reconcile `descriptions.json` stale entries disk-existence-gated (remove entries whose `specFolder` path is absent); (4) verify old-path count → 0 for the 028/deeploop tokens.

### 3.2 Remaining 028 validation failures (NOT fixable by editing)

- 6 folders fail `SCAFFOLD_NEVER_TOUCHED`: `003-spec-data-quality/{029-vague-query-model-benchmark, 030-vague-query-improvement-research, 031-generated-metadata-quality-research, 032-z-future-always-ignored, 006-generated-metadata-build/034-scoped-backfill-boundary, .../041-search-quality-fixes}`. These are unbuilt scaffolds (`[template:` titles) by design — only "fixable" by actually building them. Leave unless that is the task.

### 3.3 Daemon recovery recipe (if it re-wedges)

- Symptom: PID-alive but socket-dead (`memory_context` also fails, not just health). Recipe: precisely stop only `mk-spec-memory-launcher.cjs` + `system-spec-kit/mcp_server/dist/context-server.js` (leave code-index/advisor/code-mode daemons alone), remove the stale socket, let the opencode manager respawn a fresh instance, then confirm with a real `memory_context` call. The native ABI is fine (better-sqlite3 loads under the hermes node); the exit-86 crash means another process holds the single-writer lock — that resolves once the stale owner is cleared.

### 3.4 Housekeeping

- The `.worktrees/0025-028-renumber` scratch worktree holds two old stashes (`concurrent-work-backup-before-028-reconcile`, `baseline-check-028-search`) — harmless, drop when tidying.
- Main-tree working dir is synced for 028 + system-deep-loop 039/040; its other packets may lag its own HEAD (concurrent session's checkout) — its next pull reconciles.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] Concurrent session settled (its branch work committed and quiet) before touching `descriptions.json`.
- [ ] Daemon serves a real `memory_search` call (returns results), not just a green `memory_health`.
- [ ] Scoped `memory_index_scan` run for every renamed 028 + deeploop path.
- [ ] `descriptions.json` stale-entry count for 028/deeploop tokens → 0 (disk-existence-gated).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <028-folder> --strict` still Errors:0 on the touched folders.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

Six commits shipped to `origin/system-speckit/028-memory-search-intelligence`, each rebase-safe (temp-index subtree swap onto the live tip, concurrent work untouched): the 028 renumber; 039/040 `deeploop`→`deep-loop`; the 032 `children_ids` fix; the dark-flag + 015-parent validation fixes; the 015/001 Level-2 template conformance. Proven mechanics reused throughout: `git mv` subtree → python (not perl) ref-rewrite → regen `description.json`/`graph-metadata.json` via the real main-tree dist with an injected `level` field → continuity `last_updated_at` pinned to `last_save_at`. Frozen benchmark records (results/runs/transcripts) were preserved content-identical (rename-only). A four-iteration GPT-5.5-fast deep-review loop converged the rollup-doc prose numbering to zero findings; a repo-wide structural drift audit across all four packets was otherwise clean.
<!-- /ANCHOR:session-notes -->
