---
title: "Feature Specification: Gated teardown of the system-speckit memory, vector, and eval databases"
description: "Delete ONLY the system-spec-kit memory index, vector shards, and eval set (~1.14 GB) under mcp_server/database/ + the sibling search-decisions ledger, after daemons are stopped and after phase 006 research.md is durably saved. Requires a fresh explicit operator 'wipe it' confirmation at run time; NEVER auto-runs. Irreversible: eval history and memory:learn constitutional rules do not rebuild."
trigger_phrases:
  - "memory db teardown"
  - "delete context-index sqlite"
  - "wipe vectors and eval set"
  - "speckit database wipe"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded gated teardown spec docs"
    next_safe_action: "Await phase 006 gate and wipe confirmation"
    blockers:
      - "Blocked until system-speckit/000-migration-from-soa-and-cleanup phase 006 (research) has durably saved research.md — this phase runs LAST in the packet."
      - "Blocked on a fresh explicit operator 'wipe it' confirmation captured at execution time — this phase never auto-runs, even if the above unblocks."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
      - ".opencode/skills/system-spec-kit/mcp_server/database/vectors/"
      - ".opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db"
      - ".opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-memory-db-teardown-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "git rm vs plain rm for the two tracked checkpoint manifest.json files"
      - "Is hf-embed.sock/lock cleanup in scope or cross-daemon shared"
    answered_questions:
      - "Scope is memory + vectors + eval only; other DBs are excluded"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Gated teardown of the system-speckit memory, vector, and eval databases

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

> **⚠ IRREVERSIBLE DESTRUCTIVE ACTION — READ BEFORE ANY IMPLEMENTATION WORK ON THIS PHASE**
> This packet plans (does not execute) the permanent deletion of ~1.14 GB of live `mk_spec_memory` runtime state: the canonical memory index, all vector shards, and the evaluation database. **Eval history and `memory:learn` constitutional rules stored in these files do NOT rebuild** — there is no restore path for that content once removed. Execution:
> 1. **MUST NOT start** until `system-speckit/000-migration-from-soa-and-cleanup` phase 006 (research) has durably saved `research.md`. This is phase 007 — the **FINAL** phase of the packet — specifically so nothing later depends on the deleted history.
> 2. **MUST NOT run** without a **fresh, explicit operator "wipe it" confirmation captured at execution time**. A prior approval of this spec is not sufficient; the confirmation must be obtained again immediately before the delete step runs.
> 3. **MUST stop the `mk_spec_memory` (and `mk_code_index`) daemons before deleting anything.** Deleting a SQLite file out from under a live daemon risks a half-written WAL/lock state and a corrupted or unrecoverable index on next boot.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-spec-kit` memory MCP server has accumulated ~1.14 GB of local runtime state under `.opencode/skills/system-spec-kit/mcp_server/database/` (a 877 MB canonical index plus ~245 MB of vector shards) and a ~10.5 MB evaluation database, none of which the operator currently needs preserved. This is disk pressure with no corresponding value, but it cannot simply be `rm -rf`'d: the directory also holds files the daemon needs to keep working (lock/lease state), files that belong to OTHER daemons that must NOT be touched (code-graph, deep-loop runtime, skill-advisor), and at least two files (`checkpoints/*/manifest.json`) that are tracked in git.

### Purpose
Define a precise, verified, gated procedure that removes exactly the named memory+vectors+eval file set — and nothing else — only after the daemons that hold it open are stopped, only after the packet's research phase has durably saved its findings, and only with a fresh operator confirmation obtained at the moment of execution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verified inventory (this document) of the exact on-disk files/dirs that constitute "memory + vectors + eval" for this checkout.
- A stop-daemons-first, delete-second, optional-rebuild-third execution plan (planning only — this packet authors docs, it does not delete anything).
- The gate conditions that must hold before execution is allowed to run: phase 006 `research.md` durably saved, and a fresh operator "wipe it" confirmation captured at run time.
- The rollback/rebuild boundary: what `/doctor:update` (memory_index_scan + lazy re-embed) can and cannot restore afterward.

### Out of Scope
- Deleting or modifying `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` — operator-confirmed excluded, physically separate directory tree.
- Deleting or modifying `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` or `skill-graph-daemon-lease.sqlite` — operator-confirmed excluded, separate directory tree.
- Deleting or modifying `.opencode/skills/system-deep-loop/runtime/database/council-graph.sqlite` or `deep-loop-graph.sqlite` — operator-confirmed excluded, separate directory tree.
- Deleting `.opencode/skills/system-spec-kit/mcp_server/database/backups/`, `migrations/`, or `README.md` — not named in the delete set; these are documentation/reserved-space paths and are preserved.
- Deleting `.doctor-update.bootstrap.json`, `.doctor-update.context-index-coverage.log`, `.doctor-update.last-run.json`, `.crash-probe-receipt`, `.unclean-shutdown`, or the `.mk-spec-memory-launcher{,.prev}.log` daemon logs — not named in the delete set; left untouched.
- Deleting the shared `hf-embed.sock` / `hf-embed-respawn.lock` under `/tmp/mk-spec-memory/` — this is the HF-local model-server's own socket (potentially shared with skill-advisor via `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`), distinct from the memory daemon's own `daemon-ipc.sock`; flagged as an open question, not auto-included.
- Actually running the deletion — that is execution work for a later, explicitly-confirmed pass, not this scaffolding phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | Delete (execution phase only) | Canonical memory index; 919,633,920 bytes (~877 MB) verified via `ls -la`. |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite.lock`, `.lock-info.json`, `.lock-journal` | Delete (execution phase only) | Lock/lease siblings of the above (8,192 + 310 + 8,720 bytes); orphaned once the parent file is gone. |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite` | Delete (execution phase only) | Vector shard 1 of 3; 13,651,968 bytes (~13 MB). |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` | Delete (execution phase only) | Vector shard 2 of 3; 243,429,376 bytes (~232 MB). |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__voyage__voyage-code-3__1024__cloud.sqlite` (+ `-shm`, `-wal`) | Delete (execution phase only) | Vector shard 3 of 3; 53,248 + 32,768 + 0 bytes. Three shards sum to ~245.3 MB, matching the brief's "~245MB" figure. |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md`, `.gitkeep` | **Preserve** | Git-tracked docs/placeholder; not part of the named delete set. |
| `.opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db` (+ `-shm`, `-wal`) | Delete (execution phase only) | Evaluation database; 294,912 + 32,768 + 173,072 bytes (~0.48 MB). Untracked/gitignored. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.memory-drift-dirty-paths.json` | Delete (execution phase only) | The drift ledger; 2,443,666 bytes (~2.3 MB). Gitignored per `.gitignore:138`; confirmed untracked and clean. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.memory-drift-dirty-paths.json.processing-11417-1784107365546` | Delete (execution phase only) | An in-flight/orphaned processing copy of the same drift ledger; 3,333,745 bytes (~3.2 MB). |
| `.opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl` (+ `.2026-07-02T09-53-07-419Z.0.rotated`) | Delete (execution phase only) | The search-decisions ledger; 492,196 + 10,486,220 bytes (~10.5 MB). Lives in the sibling `mcp_server/data/` directory, NOT under `database/` — verified by targeted grep/find, not assumed. Untracked/gitignored (only `data/README.md` is tracked). |
| `.opencode/skills/system-spec-kit/mcp_server/database/checkpoints/007-search-index-integrity-sweep-full-pre-mutation-20260709T1001Z/`, `checkpoints/pre-dedup-canonical-duplicates-20260710/` | Delete (execution phase only) | Two checkpoint subdirectories; each currently contains only a git-tracked `manifest.json` pointer (793 and 791 bytes) — no local snapshot payload was found on disk in this checkout. These are point-in-time snapshots of the very index being destroyed, so they become meaningless once it is gone. |
| `.opencode/skills/system-spec-kit/mcp_server/database/checkpoints/README.md` | **Preserve** | Git-tracked doc describing the checkpoint mechanism; not part of the delete set. |
| `/tmp/mk-spec-memory/daemon-ipc.sock` | Delete (execution phase only) | The `mk_spec_memory` daemon's own IPC control socket, confirmed live at this path via `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory` in `.mcp.json`/`opencode.json` — NOT inside the repo's `database/` directory. A stale socket after an unclean daemon stop can block the next daemon's `listen()`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate on phase 006 research durability | `system-speckit/000-migration-from-soa-and-cleanup` phase 006's `research.md` exists and is committed/saved before any daemon-stop or delete step runs. |
| REQ-002 | Gate on fresh operator confirmation | A literal, explicit "wipe it" (or equivalent unambiguous) confirmation is captured from the operator at the moment execution begins — a prior approval of this spec does not satisfy this gate. |
| REQ-003 | Stop daemons before deleting | Both `mk_spec_memory` and `mk_code_index` daemon processes (verified live via `ps aux` at scaffold time: 4 `mk-spec-memory-launcher.cjs` + 3 `mk-code-index-launcher.cjs` processes) are stopped and confirmed exited before any file in the delete set is removed. |
| REQ-004 | Delete only the named set | Only the files/dirs enumerated in §3 "Files to Change" are removed; `backups/`, `migrations/`, `README.md`, doctor-update bookkeeping files, and all code-graph/deep-loop/skill-advisor databases are left untouched. |
| REQ-005 | Preserve the exclusion boundary | Post-delete, `code-graph.sqlite`, `skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite`, `council-graph.sqlite`, and `deep-loop-graph.sqlite` are byte-for-byte unchanged (verified by mtime/size comparison against pre-delete state). |
| REQ-006 | Document the rebuild boundary | The plan and checklist explicitly state which parts of the deleted state CAN be rebuilt via `/doctor:update` (`memory_index_scan` + lazy re-embed of spec-doc content) and which CANNOT (eval history, `memory:learn` constitutional rules, drift/search-decision audit trails). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Resolve checkpoint manifest tracking | Decide (at execution time, with operator input if needed) whether the two git-tracked `checkpoints/*/manifest.json` files are removed via `git rm` or left as orphaned working-tree deletions, and document the choice. |
| REQ-008 | Resolve the shared hf-embed socket question | Decide whether `/tmp/mk-spec-memory/hf-embed.sock` and `hf-embed-respawn.lock` are in scope, given they may be shared with the skill-advisor daemon; document the decision before execution. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any delete step, `system-speckit/000-migration-from-soa-and-cleanup/006-*/research.md` (exact child slug TBD by that phase's own author) is confirmed present and saved.
- **SC-002**: Before any delete step, a fresh operator confirmation string equivalent to "wipe it" is captured and recorded in the execution log/`implementation-summary.md` of the eventual execution pass.
- **SC-003**: `ps aux | grep -i "mk-spec-memory-launcher\|mk-code-index-launcher"` returns no live processes before the first delete command runs.
- **SC-004**: After execution, `ls -la .opencode/skills/system-spec-kit/mcp_server/database/` shows `context-index.sqlite`, its lock siblings, `speckit-eval.db*`, the drift ledger, and the two checkpoint subdirectories are gone, while `README.md`, `backups/`, `migrations/`, and `vectors/{README.md,.gitkeep}` remain.
- **SC-005**: After execution, `ls -la .opencode/skills/system-spec-kit/mcp_server/data/` shows `search-decisions.jsonl` and its `.rotated` sibling are gone, while `README.md` remains.
- **SC-006**: After execution, `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`, `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph*.sqlite`, and `.opencode/skills/system-deep-loop/runtime/database/*.sqlite` are unchanged (same size/mtime as the pre-delete baseline captured in this spec).
- **SC-007**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown --strict` passes for this scaffolding phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting `context-index.sqlite` while the daemon still holds it open | Corrupted WAL/lock state, or a daemon that crash-loops on a missing file instead of cleanly re-initializing | Stop-daemons-first ordering is a P0 requirement (REQ-003); verify process exit before deleting. |
| Risk | Eval history and `memory:learn` constitutional rules are unrecoverable | Permanent loss of tuning/benchmark history and learned-rule provenance | Foreground irreversibility in this spec; require the fresh "wipe it" gate; no rollback plan claims recoverability for these. |
| Risk | Broad delete accidentally reaches an excluded database (code-graph, deep-loop, skill-advisor) | Breaks an unrelated daemon that was explicitly operator-excluded | Scope this spec to an explicit path-by-path allowlist (§3), not a directory glob; verify exclusion boundary post-delete (REQ-005). |
| Risk | Stale IPC socket at `/tmp/mk-spec-memory/daemon-ipc.sock` blocks the next daemon start | New daemon fails `listen()` with `EADDRINUSE` after an unclean stop | Delete the socket only after confirming the owning process has exited; document in tasks/checklist. |
| Risk | Git-tracked checkpoint `manifest.json` files are deleted with plain `rm` instead of `git rm` | Working tree shows unstaged deletions instead of a clean tracked removal | REQ-007 requires this decision be made explicitly at execution time, not silently defaulted. |
| Dependency | Phase 006 (research) of this same packet | This phase cannot start until phase 006's `research.md` is durably saved | REQ-001 gate; documented as a continuity blocker in this spec's frontmatter. |
| Dependency | `mk_spec_memory` and `mk_code_index` daemon stop procedure | No stop command is verified/authored in this scaffolding pass | Execution-phase author must confirm the exact stop mechanism (e.g. daemon self-exit via idle timeout vs. an explicit kill) before running REQ-003. |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Deletion should free approximately 1.14 GB of local disk space (verified breakdown: ~877 MB index + ~245 MB vectors + ~0.48 MB eval + ~5.6 MB drift ledger + ~10.5 MB search-decisions ledger + negligible lock/checkpoint bytes).

### Security
- **NFR-S01**: The delete step must not run under any automated/unattended mode; the fresh-confirmation gate (REQ-002) is a hard precondition, not a default-yes prompt.

### Reliability
- **NFR-R01**: After deletion, a subsequent `mk_spec_memory` daemon start must not crash-loop; it must either lazily recreate an empty index or require an explicit `/doctor:update` rebuild pass, per REQ-006.

---

## L2: EDGE CASES

### Data Boundaries
- Daemon still running at delete time: treat as a hard stop condition, not a warning — do not proceed.
- Phase 006 `research.md` missing or only partially saved: treat as a hard stop condition; this phase must not begin.
- Operator confirmation given earlier in the session but not re-confirmed at the literal moment of execution: does not satisfy REQ-002; re-ask.

### Error Scenarios
- Delete partially succeeds (e.g., `context-index.sqlite` removed but a vector shard delete fails): document the partial state exactly in the execution's `implementation-summary.md`; do not silently retry without re-verifying daemon-stopped state.
- Post-delete daemon restart surfaces new/unexpected files at the deleted paths: verify these are freshly created (empty/lazy-init) files, not leftovers from an incomplete delete.

### State Transitions
- From "1.14 GB live index" to "empty/rebuildable index": the daemon must be restarted deliberately (not left down) so downstream `memory_search`/`memory_context` calls do not silently operate against a stale in-memory cache of the deleted file.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Small, precisely-enumerated file/dir set (≈15 paths across 2 directories plus 1 external socket); no source code changes. |
| Risk | 22/25 | Irreversible loss of eval history and constitutional-rule provenance; live daemons must be coordinated; an excluded database could be hit by an imprecise glob if not scoped path-by-path. |
| Research | 10/20 | Exact file set, sizes, git-tracked status, socket location, and exclusion boundaries were verified directly (`ls -la`, `du`, `grep`, `find`, `ps aux`, `git ls-files`/`check-ignore`) during this scaffolding pass; remaining research is the exact daemon-stop mechanism, owned by the execution phase. |
| **Total** | **40/70** | **Level 2** — small mechanical scope, but risk/verification-evidence discipline pushes this above a Level 1 typo-fix, matching the packet's explicit Level 2 instruction. |

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the two git-tracked `checkpoints/*/manifest.json` files be removed with `git rm` (clean history) or left as orphaned working-tree deletions once their snapshot directories are wiped? (See REQ-007.)
- Is `/tmp/mk-spec-memory/hf-embed.sock` / `hf-embed-respawn.lock` in scope, given it is shared with the skill-advisor daemon under `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`? (See REQ-008.)
- What is the exact packet slug for phase 006 (research) under this parent — the parent directory `system-speckit/000-migration-from-soa-and-cleanup/` was empty of children at scaffold time, so the slug is UNKNOWN until that phase's own author creates it.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
