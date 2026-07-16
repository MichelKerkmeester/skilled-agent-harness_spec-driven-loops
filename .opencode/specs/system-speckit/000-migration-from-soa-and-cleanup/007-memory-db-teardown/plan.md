---
title: "Implementation Plan: Gated teardown of the system-speckit memory, vector, and eval databases"
description: "Stop the mk_spec_memory and mk_code_index daemons, delete the verified memory+vectors+eval file set only, leave code-graph/deep-loop/skill-advisor databases untouched, then optionally rebuild via /doctor:update. Gated on phase 006 research.md and a fresh operator 'wipe it' confirmation; never auto-runs."
trigger_phrases:
  - "memory db teardown plan"
  - "context-index sqlite delete plan"
  - "vectors eval wipe plan"
  - "speckit database teardown ordering"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored stop/delete/rebuild implementation plan"
    next_safe_action: "Await phase 006 gate and wipe confirmation"
    blockers:
      - "Blocked until system-speckit/000-migration-from-soa-and-cleanup phase 006 (research) has durably saved research.md."
      - "Blocked on a fresh explicit operator 'wipe it' confirmation captured at execution time — never auto-runs."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
      - ".opencode/skills/system-spec-kit/mcp_server/database/vectors/"
      - ".opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db"
      - ".opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-memory-db-teardown-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact stop mechanism for mk_spec_memory / mk_code_index daemons (idle self-exit vs. explicit process kill) is owned by the execution phase, not this plan."
    answered_questions:
      - "Ordering is fixed by the brief: stop daemons -> delete the named set -> optional /doctor:update rebuild."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gated teardown of the system-speckit memory, vector, and eval databases

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Filesystem/shell operations only (`rm`, `ps`, daemon stop) — no source code changes in this packet. |
| **Framework** | `mk_spec_memory` MCP server runtime (`.opencode/skills/system-spec-kit/mcp_server/`); daemons launched via `.opencode/bin/mk-spec-memory-launcher.cjs` and `.opencode/bin/mk-code-index-launcher.cjs`. |
| **Storage** | SQLite (`context-index.sqlite`, 3 vector shards, `speckit-eval.db`), JSON/JSONL ledgers (drift, search-decisions), Unix domain socket (`daemon-ipc.sock`). |
| **Testing** | Manual verification only: `ls -la`/`du` size checks, `ps aux` process checks, `git status`/`git ls-files` tracking checks, `bash .../validate.sh --strict` for this packet's own docs. |

### Overview
This is a source-first teardown of runtime state, not a code change: stop the two daemons that hold the target files open, delete exactly the enumerated memory+vectors+eval file set (never a directory glob), leave every operator-excluded database untouched, and document the optional `/doctor:update` rebuild path plus the irreversible parts of the loss. This plan authors the procedure; it does not run it.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `ls -la .../mcp_server/database/` | Confirmed `context-index.sqlite` = 919,633,920 bytes (~877 MB); confirmed lock/lease siblings, `speckit-eval.db*`, drift ledger, and checkpoints directory contents. |
| `ls -la .../mcp_server/database/vectors/` | Confirmed 3 vector shard `.sqlite` files summing to ~245.3 MB, plus a git-tracked `README.md`/`.gitkeep` that must be preserved. |
| `grep`/`find` for `search-decisions` | Confirmed the search-decisions ledger lives in the **sibling** `mcp_server/data/` directory, not under `database/` — the brief's "database dir" framing does not cover 100% of the named delete set. |
| `ENV_REFERENCE.md` + `.mcp.json`/`opencode.json` grep | Confirmed the daemon's IPC socket is pinned to `/tmp/mk-spec-memory/daemon-ipc.sock` via `SPECKIT_IPC_SOCKET_DIR`, i.e. **outside** the repo entirely, not a file inside `database/`. |
| `ps aux` | Confirmed 4 live `mk-spec-memory-launcher.cjs` processes and 3 live `mk-code-index-launcher.cjs` processes at scaffold time — both daemon families are currently running and must be stopped before delete. |
| `git ls-files` / `git check-ignore` | Confirmed `checkpoints/*/manifest.json` are git-tracked (clean, unmodified); confirmed the drift ledger, eval db, vector shards, and search-decisions ledger are all gitignored/untracked. |
| `find` for `code-graph.sqlite`, `skill-graph*.sqlite`, `council-graph.sqlite`, `deep-loop-graph.sqlite` | Confirmed each lives in its own skill's `mcp_server/database/` or `runtime/database/` tree, physically separate from `system-spec-kit`'s — the exclusion boundary is already a directory boundary, not something this plan has to carve out of a shared folder. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Exact file set, sizes, and git-tracked status verified directly against the running repo (not assumed from the brief).
- [x] Exclusion boundary (code-graph/deep-loop/skill-advisor) verified as a physically separate directory tree, not a co-mingled path needing careful carve-out.

### Definition of Done
- [ ] Phase 006 (research) `research.md` confirmed durably saved.
- [ ] A fresh operator "wipe it" confirmation is captured at execution time.
- [ ] `mk_spec_memory` and `mk_code_index` daemons confirmed stopped (no live process).
- [ ] Exactly the enumerated file set is deleted; excluded databases verified unchanged afterward.
- [ ] Rebuild boundary (`/doctor:update`) documented and, if the operator wants it, executed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated, ordered filesystem teardown (stop -> delete -> optional rebuild), not a code refactor.

### Key Components
- **`mk_spec_memory` daemon**: owns `context-index.sqlite`, the vector shards, the drift ledger, and its own `daemon-ipc.sock`; must be the first thing stopped.
- **`mk_code_index` daemon**: named in the brief as a co-stop requirement even though its own database (`code-graph.sqlite`) is excluded from deletion — stopping it first avoids any cross-daemon lock contention during the memory-side delete.
- **`speckit-eval.db`**: a separate SQLite file in the same directory, holding benchmark/eval history with no daemon-independent rebuild path.
- **`search-decisions.jsonl`**: lives in the sibling `mcp_server/data/` directory; an append-only audit ledger, not regenerated by `/doctor:update`.
- **`/doctor:update`**: the only named rebuild path, covering `memory_index_scan` (re-indexes spec docs) plus lazy re-embed (rebuilds vector shards on demand) — it rebuilds a working *search index*, not the deleted *history*.

### Data Flow
Today: daemons read/write `context-index.sqlite` + vector shards on every `memory_search`/`memory_save` call, append to the drift and search-decisions ledgers as side effects, and periodically checkpoint the index into `checkpoints/`. After teardown: the daemons restart against an empty/missing index; `/doctor:update` can walk spec-doc content again and rebuild a fresh (but historyless) index; the drift ledger, search-decisions ledger, eval database, and any `memory:learn` constitutional-rule provenance stored in the deleted tables do not come back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` (+ lock siblings) | Canonical memory index, live-held by `mk_spec_memory` | Delete, after daemon stop | `ls -la` shows path gone; daemon restart does not crash-loop. |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/*.sqlite{,-shm,-wal}` (3 shards) | Embedding vector storage per ADR-012 | Delete, after daemon stop | `ls -la vectors/` shows only `README.md`/`.gitkeep` remain. |
| `.opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db{,-shm,-wal}` | Evaluation/benchmark history | Delete, after daemon stop | `ls -la` shows path gone; no rebuild path exists for this content. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.memory-drift-dirty-paths.json{,.processing-*}` | Drift-detection dirty-path ledger | Delete, after daemon stop | `ls -la` shows path gone. |
| `.opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl{,.rotated}` | Search-decision audit ledger (sibling dir, not under `database/`) | Delete, after daemon stop | `ls -la data/` shows only `README.md` remains. |
| `.opencode/skills/system-spec-kit/mcp_server/database/checkpoints/{007-*,pre-dedup-*}/` | Point-in-time snapshots of the index being destroyed | Delete directories; decide `git rm` vs. plain `rm` for the two tracked `manifest.json` files (REQ-007) | `checkpoints/README.md` remains; `git status` shows the intended tracked/untracked outcome. |
| `/tmp/mk-spec-memory/daemon-ipc.sock` | `mk_spec_memory` daemon's own IPC control socket | Delete, only after confirming the owning process has exited | `ls -la /tmp/mk-spec-memory/` shows no stale socket before next daemon start. |
| `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`, `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph*.sqlite`, `.opencode/skills/system-deep-loop/runtime/database/*.sqlite` | Independent daemons' own databases | **Not a consumer of this change — unchanged** | Size/mtime comparison against the pre-delete baseline in `spec.md` §5 SC-006. |
| `.opencode/skills/system-spec-kit/mcp_server/database/{backups,migrations}/`, `README.md`, `.doctor-update.*`, `.crash-probe-receipt`, `.unclean-shutdown`, `.mk-spec-memory-launcher{,.prev}.log` | Documentation, reserved space, or unrelated bookkeeping | **Not a consumer of this change — unchanged** | `ls -la` diff against pre-delete baseline shows no touch. |

Required inventories:
- Same-class producers: `find .opencode/skills -maxdepth 3 -iname "*.sqlite" -path "*mcp_server/database*" -o -iname "*.sqlite" -path "*runtime/database*"` — run before execution to reconfirm the exclusion boundary has not shifted since this plan was authored.
- Consumers of changed paths: `ps aux | grep -i "mk-spec-memory-launcher\|mk-code-index-launcher"` before AND after the stop step, to prove both daemon families actually exited.
- Matrix axes: {daemon-stopped: yes/no} x {file in named delete set: yes/no} x {file in excluded-database boundary: yes/no}. Only the (yes, yes, no) cell is ever deleted.
- Algorithm invariant: no delete command in the execution phase may target a directory glob (e.g. `rm -rf database/`) — every command must name an explicit path from the §3/spec.md `Files to Change` table, so the exclusion boundary can never be crossed by accident.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (gates + daemon stop)
- [ ] Confirm `system-speckit/000-migration-from-soa-and-cleanup` phase 006 (research) has durably saved `research.md`.
- [ ] Capture a fresh, explicit operator "wipe it" confirmation at this exact moment — do not reuse an earlier approval.
- [ ] Stop the `mk_spec_memory` daemon(s); confirm via `ps aux` that no `mk-spec-memory-launcher.cjs` process remains.
- [ ] Stop the `mk_code_index` daemon(s); confirm via `ps aux` that no `mk-code-index-launcher.cjs` process remains.

### Phase 2: Core Implementation (delete the named set only)
- [ ] Delete `context-index.sqlite` and its `.lock`/`.lock-info.json`/`.lock-journal` siblings.
- [ ] Delete the 3 vector shard `.sqlite{,-shm,-wal}` files under `vectors/`, preserving `README.md`/`.gitkeep`.
- [ ] Delete `speckit-eval.db{,-shm,-wal}`.
- [ ] Delete `.memory-drift-dirty-paths.json` and its `.processing-*` sibling.
- [ ] Delete `search-decisions.jsonl` and its `.rotated` sibling from `mcp_server/data/`.
- [ ] Delete the two `checkpoints/*/` snapshot subdirectories, resolving the `git rm` vs. plain `rm` question (REQ-007) for their tracked `manifest.json` files; preserve `checkpoints/README.md`.
- [ ] Delete `/tmp/mk-spec-memory/daemon-ipc.sock` only after re-confirming the owning process has exited.

### Phase 3: Verification
- [ ] Confirm every path in the named delete set is gone (`ls -la` per directory).
- [ ] Confirm every excluded database (code-graph, skill-advisor, deep-loop runtime) is byte-for-byte unchanged (size/mtime match the pre-delete baseline).
- [ ] Document, in the execution's `implementation-summary.md`, exactly what was deleted, what is rebuildable via `/doctor:update`, and what is permanently lost (eval history, `memory:learn` constitutional-rule provenance, drift/search-decision audit trails).
- [ ] If the operator wants a working index again, run `/doctor:update` (drives `memory_index_scan` + lazy re-embed) and confirm the daemon comes back up cleanly against the now-empty index.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual filesystem verification | Named delete set fully removed | `ls -la` on `mcp_server/database/`, `mcp_server/database/vectors/`, `mcp_server/database/checkpoints/`, `mcp_server/data/`, `/tmp/mk-spec-memory/` |
| Manual exclusion-boundary verification | Excluded databases unchanged | `ls -la` size/mtime diff against the pre-delete baseline recorded in `spec.md` §5 SC-006 |
| Process verification | Daemons stopped before delete, restarted cleanly after | `ps aux \| grep -i "mk-spec-memory-launcher\|mk-code-index-launcher"` before/after each phase |
| Git-tracking verification | Correct handling of tracked `manifest.json` files | `git status --porcelain` on `mcp_server/database/checkpoints/` before/after |
| Spec validation | This scaffolding phase's own docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 (research) `research.md` | Internal, same packet | Not yet created — parent directory had zero children at scaffold time | This phase cannot start; it is explicitly ordered to run LAST in the packet. |
| Fresh operator "wipe it" confirmation | Human gate | Not obtainable in advance — must be captured at execution time | This phase cannot start without it, regardless of any other gate's state. |
| `mk_spec_memory` / `mk_code_index` daemon stop mechanism | Internal tooling | Exact stop command (idle self-exit vs. explicit kill) not verified in this scaffolding pass | Execution phase must confirm the stop mechanism before Phase 1 can complete. |
| `/doctor:update` (`memory_index_scan` + lazy re-embed) | Internal tooling | Available, per `.opencode/skills/system-spec-kit/` docs | Optional — only needed if the operator wants a working index restored after teardown. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 requirement in `spec.md` §4 fails during execution — e.g., a daemon is found still running mid-delete, an excluded database's size/mtime changed, or the operator withdraws the "wipe it" confirmation before the delete step completes.
- **Procedure**: Stop deleting immediately. There is **no restore path** for `context-index.sqlite`, the vector shards, `speckit-eval.db`, the drift ledger, or `search-decisions.jsonl` once removed — this plan's only "rollback" is (a) not deleting further paths once a fault is detected, and (b) running `/doctor:update` to rebuild a fresh, historyless index so the daemon is at least functional again. Any excluded database that was mistakenly touched must be restored from its own daemon's independent checkpoint/backup mechanism, if one exists — this plan does not own that restore.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Gates + daemon stop) ──► Phase 2 (Delete named set) ──► Phase 3 (Verify + optional rebuild)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (gates + stop) | Phase 006 research.md saved; fresh operator confirmation | Core delete |
| Core delete | Setup | Verification |
| Verification | Core delete | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (gates + daemon stop) | Low | 15-30 minutes (mostly waiting on the confirmation gate) |
| Core delete | Low | 10-15 minutes (a short, explicit list of `rm` commands) |
| Verification | Low-Medium | 20-30 minutes (size/mtime diffs across 3 excluded databases plus documentation) |
| **Total** | | **~1 hour of active execution work, once both gates are open** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 006 `research.md` confirmed saved.
- [ ] Fresh operator "wipe it" confirmation captured at execution time.
- [ ] Pre-delete size/mtime baseline recorded for every excluded database (code-graph, skill-advisor, deep-loop runtime).
- [ ] Both daemon families confirmed stopped.

### Rollback Procedure
1. Stop deleting further paths the moment any P0 requirement fails.
2. Do NOT attempt to restore `context-index.sqlite`, the vector shards, `speckit-eval.db`, the drift ledger, or `search-decisions.jsonl` — no backup mechanism is named for these; treat their loss as final once removed.
3. If an excluded database was touched by mistake, restore it from that database's own daemon-specific checkpoint/backup path (outside this plan's scope) and re-verify size/mtime.
4. Run `/doctor:update` to bring the memory daemon back to a working (but historyless) state if the operator wants it usable again.

### Data Reversal
- **Has data migrations?** No — this is deletion, not migration.
- **Reversal procedure**: None for the named delete set. `/doctor:update` rebuilds a *working index*, not the *deleted history*.
<!-- /ANCHOR:enhanced-rollback -->
