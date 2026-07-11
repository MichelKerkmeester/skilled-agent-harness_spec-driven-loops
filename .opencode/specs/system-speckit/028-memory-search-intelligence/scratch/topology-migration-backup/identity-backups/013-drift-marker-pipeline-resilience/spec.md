---
title: "Feature Specification: Drift-Marker Producer/Consumer Resilience"
description: "The Layer-2 git-hook drift-marker pipeline shipped in 011-automatic-drift-self-healing has two real resilience gaps: its lock directory has no stale-lock recovery, so a SIGKILLed hook process leaves Layer 2 permanently and silently dead until someone manually removes the lock dir; and its marker write path is hardcoded rather than derived from the daemon's live, override-aware DB path, so under a SPEC_KIT_DB_DIR/MEMORY_DB_PATH override the hook can write markers the consumer never looks at, silently degrading to the slower Layer-3 full-sweep backstop."
trigger_phrases:
  - "drift marker pipeline resilience"
  - "stale lock breaking git hook"
  - "memory drift marker path divergence"
  - "git hook lock directory recovery"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/013-drift-marker-pipeline-resilience"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/core/config.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-013-drift-marker-pipeline-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the hook resolve the live DB directory by shelling out to a small node snippet that imports the same core/config.ts resolution logic, or by independently re-reading SPEC_KIT_DB_DIR/SPECKIT_DB_DIR/MEMORY_DB_PATH in bash and accepting the duplication risk that already exists between status-classifier.sh and strict-pass-freshness.ts (F9)?"
answered_questions:
      - "Stale-lock staleness threshold: resolved to 30-60 seconds. A follow-up adversarial review ran a real SIGKILL-mid-acquisition test and confirmed each lock-acquisition attempt fails fast (~5s) but the stale lock is never recovered on any subsequent attempt -- Layer 2 goes silently and permanently dead after one killed hook process, not that any single git operation hangs. Since normal lock hold time is sub-second, a 30-60s mtime-based threshold is safely conservative."
---
# Feature Specification: Drift-Marker Producer/Consumer Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `013-drift-marker-pipeline-resilience` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase is a **hardening pass** on the Layer-2 git-hook drift-marker pipeline that
`011-automatic-drift-self-healing` shipped: a shared bash hook helper
(`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`) that detects `.opencode/specs`
renames/deletes on `post-commit`/`post-merge`/`post-rewrite` and writes an atomic dirty-marker
JSON that the MCP server consumes at boot to run a scoped `memory_index_scan`. It sits on the
same self-healing subsystem as, but has no hard code dependency on, `011`'s three layers — it
fixes two producer/consumer resilience gaps found by three independent Fable-5 review angles
(correctness/quality, architecture consistency, risk/blast-radius) of packages 006-011, all
already shipped and passing `validate.sh --strict`.

**Scope Boundary**: Two MEDIUM-severity, real logic/config-resolution fixes to the Layer-2
git-hook's lock-recovery and marker-write-path resolution. No change to Layer 1 (query-time
existence filtering), no change to Layer 3 (sweep-to-completion backstop), no change to the
scoped-scan consumption logic itself (`consumeMemoryDriftDirtyMarker`,
`startup-checks.ts:243`).

**Dependencies**: None. Both findings are self-contained fixes to the existing
`memory-drift-marker.sh` producer and `resolveMemoryDriftMarkerPath` consumer-path resolution;
neither requires any other phase's code to land first.

**Deliverables**:
- Mtime-based stale-lock recovery for the git hook's `.lock` directory (F3).
- Live-DB-path-aware marker write location in the git hook, replacing the hardcoded default (F4).

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet
  number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**F3 — Git-hook lock directory has no stale-lock recovery.**
`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:54-64` acquires a lock via
`fs.mkdirSync(lockDir)` inside an embedded `node <<'NODE'` block, retrying every 25ms for up to
5 seconds before giving up and exiting 0 (`:56-64`). The lock is released in a `finally` block
(`:93-95`) that runs `fs.rmSync(lockDir, { recursive: true, force: true })`. If the node
subprocess is SIGKILLed between the successful `mkdirSync` (`:58`) and that `finally` block —
for example, the OS reaps the process during a shutdown, an out-of-memory kill, or a session
teardown that force-kills its process tree — `lockDir` persists on disk forever. There is no
mtime check, no owner-liveness probe, and no TTL anywhere in this file. Every subsequent
`post-commit`/`post-merge`/`post-rewrite` invocation, from every session, then fails fast — the
same ~5-second `mkdirSync` retry loop as always, then a silent exit 0 at `:61` — dropping that
commit's drift entries with zero user-visible signal. This was confirmed empirically, not just
read off the source: SIGKILLing a lock-holder process mid-acquisition (after the `mkdirSync` at
`:58` succeeds, before the `finally` release block at `:93-95` runs) in a throwaway test
directory reproduces exactly this state, and every later invocation repeats the same fast, silent
failure with no recovery. The precise failure shape matters for the fix design: no single git
operation hangs — each attempt still fails in the same bounded ~5 seconds as always — but the
stale lock is never recovered on any subsequent attempt, so Layer 2 goes silently and permanently
dead after exactly one killed hook process, until a human notices (there is no health check that
surfaces this) and manually deletes the stale lock directory. This
is a currently-live, already-reachable failure mode on every commit going forward — not a
hypothetical edge case — because the shared repo runs simultaneous Claude Code/OpenCode sessions
routinely (per `011`'s own spec.md, "this repo routinely runs multiple simultaneous Claude
Code/OpenCode sessions"), which increases the odds of exactly the kind of hard process-tree kill
that leaves a lock orphaned. The writer-vs-writer atomicity mechanism itself — lock dir plus
temp-file-plus-rename (`:90-92`) — is otherwise sound and is not being changed by this fix.

This repo already has a working precedent for the identical class of bug on a different lock:
`.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:86-122`
implements `isReclaimableLock()` (mtime-since-`stat` plus an owner-PID-liveness probe via
`process.kill(pid, 0)`) and `reclaimInterprocessLock()` (rename-then-remove, so a lock a second
racer is mid-acquiring is never destructively deleted out from under it). The git hook's lock is
simpler than that mutex's — it is held only for the lifetime of a single short git-hook
subprocess (sub-second under normal operation), not a long-running daemon save — so a full
PID-liveness probe is not required, but the same mtime-based staleness concept directly applies.

**F4 — Marker path resolution can silently diverge from where the consumer looks.**
`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:21-22` hardcodes the marker directory:

```
local marker_dir="$repo_root/.opencode/skills/system-spec-kit/mcp_server/database"
```

Consumption, on the other side, derives the marker path from the **live, currently-open**
database path, not a hardcoded default. `resolveMemoryDriftMarkerPath()`
(`mcp_server/lib/storage/memory-drift-healing.ts:199-201`) returns
`path.join(path.dirname(path.resolve(databasePath)), MEMORY_DRIFT_MARKER_FILENAME)`, and the
boot call site (`context-server.ts:2229-2230`) passes
`databasePath: vectorIndex.getDbPath() || DATABASE_PATH` — i.e. the actual opened DB file's
path, falling back to the independently-computed `DATABASE_PATH` only if the DB is not yet open.
`DATABASE_PATH` itself is not a fixed constant: `core/config.ts:63-101`'s `computeDatabasePaths()`
re-checks `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` / `MEMORY_DB_PATH` at call time specifically "to
support runtime overrides" (`:64-65`), and this repo already documents at least one other MCP
daemon in this same family (`opencode.json`'s skill-advisor `_NOTE_MEMORY_DB_PATH`) making a
deliberate, explicit decision about how it does or does not honor these same env vars for its own
database. This repo's boot path already has a fix for the *identical class* of bug on the
unclean-shutdown marker: `context-server.ts:372-380`'s `getUncleanShutdownMarkerPath()` derives
its marker directory from `vectorIndex.getDbPath() || DATABASE_PATH` specifically because,
per its own comment, "Under a MEMORY_DB_PATH whose dirname differs from the resolved DB dir,
DATABASE_PATH would point the boot check at the wrong dir and silently disable corruption
detection." The git hook's marker writer is the one remaining place in this pipeline that has
not been given the same fix — it hardcodes `mcp_server/database/` instead of resolving the live
DB directory the same way. Under any DB-path override that moves the live DB directory away from
that hardcoded default, the hook writes markers to a location the consumer's
`resolveMemoryDriftMarkerPath()` never reads, and Layer 2 silently degrades to Layer 3 (the
full-sweep backstop) for every affected session — no error, no warning, just a slower healing
path nobody notices is slower.

### Purpose

Harden both ends of the Layer-2 pipeline so it degrades loudly-recoverable instead of
silently-dead: F3 makes the lock self-heal after a bounded staleness window instead of requiring
manual intervention, and F4 makes the marker producer resolve the same live, override-aware DB
directory the consumer already resolves, so a marker is never written somewhere the consumer will
never look.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**F3 — stale-lock breaking.** Add an mtime-based staleness check to the lock-acquisition loop in
`memory-drift-marker.sh` (`:54-64`): if `mkdirSync` fails with `EEXIST`, `stat` the existing
`lockDir`; if its mtime is older than a fixed staleness threshold (resolved to 30-60 seconds — see
§10 Resolved Questions — comfortably above both the confirmed sub-second normal lock lifetime and
the existing 5-second wait budget, since the lock's expected lifetime is a
single short subprocess, not a long save operation), reclaim it (rename-then-remove, mirroring
`spec-folder-mutex.ts:101-122`'s non-destructive reclaim pattern so a lock a concurrent hook
process is mid-acquiring is never deleted out from under it) and retry acquisition, rather than
looping to the existing 5-second timeout and exiting 0.

**F4 — live DB-path-aware marker write location.** Replace the hardcoded
`marker_dir="$repo_root/.opencode/skills/system-spec-kit/mcp_server/database"`
(`:21`) with a resolution step that mirrors `core/config.ts:63-101`'s
`computeDatabasePaths()`/`resolveMemoryDriftMarkerPath()` precedence
(`SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` override, else `MEMORY_DB_PATH`'s parent directory, else the
existing default), so the hook writes into the same directory the consumer will look in
regardless of which override is active for a given profile/session. The hook already shells out
to `node` for the marker JSON write (`:32-96`), so the resolution can reuse that same embedded
node invocation rather than re-deriving the algorithm a second time in pure bash.

### Out of Scope
- Layer 1 (query-time existence filtering) and Layer 3 (sweep-to-completion backstop) —
  untouched by this phase.
- The scoped-scan consumption logic in `consumeMemoryDriftDirtyMarker`
  (`startup-checks.ts:243-320`) — its `resolveMemoryDriftMarkerPath()`-based derivation is already
  correct; this phase brings the producer into alignment with it, not the other way around.
- Any of the other findings in the review digest (F1, F2, F5-F16) — those belong to sibling
  phases or are explicitly deferred/already-fixed per the digest.
- A general dedup of the "valid completion status" list duplicated between
  `status-classifier.sh` and `strict-pass-freshness.ts` (F9) — noted here only because F4's fix
  touches the same producer-vs-consumer-must-match-config class of bug, but F9 itself is a
  separate, unassigned finding.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` | Modify | F3: add mtime-based stale-lock breaking to the lock-acquisition loop. F4: replace the hardcoded marker directory with a live, override-aware resolution. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The lock-acquisition loop SHALL break a stale lock directory instead of looping to the existing 5-second timeout and silently exiting 0. | A synthetic pre-existing `lockDir` with an mtime older than the staleness threshold, and no live owner of the lock, is reclaimed and the hook proceeds to write its marker within the existing wait budget rather than exiting 0. |
| REQ-002 | The stale-lock reclaim SHALL NOT break a lock that is genuinely held by a still-running concurrent hook process (i.e. the lock's mtime is recent, inside the staleness threshold). | A synthetic `lockDir` with a fresh mtime (simulating a real concurrent writer) is never reclaimed by a second invocation within the staleness window; the second invocation still waits/retries as it does today. |
| REQ-003 | The marker write location SHALL resolve the same live database directory the consumer's `resolveMemoryDriftMarkerPath()` resolves, honoring `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` with the same precedence order as `core/config.ts`'s `computeDatabasePaths()`. | With `SPEC_KIT_DB_DIR` (or `MEMORY_DB_PATH`) set to a non-default directory in the hook's environment, the marker file is written inside that resolved directory, not the hardcoded `mcp_server/database/` default. |
| REQ-004 | With no DB-path override set, the marker write location SHALL remain byte-identical to today's hardcoded default, so existing unoverridden sessions see no behavior change. | With no `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` set, the marker is written to the exact same path as before this fix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The stale-lock staleness threshold SHALL be a named, documented constant, not a magic number inlined at the check site. | The threshold value is defined once, set to 30-60 seconds (resolved during planning via real SIGKILL-mid-acquisition testing; comfortably above the confirmed sub-second normal lock lifetime and the existing 5-second wait budget), with a comment explaining the choice. |
| REQ-006 | F4's resolution logic SHALL be implemented once and reused by both the lock-path and marker-path derivations (the lock directory is `${markerPath}.lock`, so it moves with the marker path automatically), not duplicated. | A single resolution step produces the marker directory; the lock directory path is derived from it, not independently resolved. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A hook process SIGKILLed between lock acquisition and release no longer produces a
  permanently dead Layer 2 — the next commit's hook invocation recovers within the existing wait
  budget instead of requiring manual lock-directory deletion.
- **SC-002**: A live, concurrently-running hook process's lock is never incorrectly reclaimed by a
  second invocation.
- **SC-003**: Under a `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` override, the marker
  file lands in the same directory the consumer's `resolveMemoryDriftMarkerPath()` will look in,
  eliminating the silent Layer-2-writes-nowhere-the-consumer-reads failure mode.
- **SC-004**: With no override set, marker placement is unchanged from today's behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An overly aggressive staleness threshold could reclaim a lock still held by a genuinely slow (but alive) hook process, causing two writers to believe they hold the lock simultaneously. | Medium — could corrupt a marker write | Threshold resolved to 30-60 seconds (see §10 Resolved Questions), comfortably above the lock's confirmed sub-second normal lifetime and the existing 5-second wait budget; mirror `spec-folder-mutex.ts`'s non-destructive rename-then-remove reclaim so a still-live writer's in-progress temp file is never touched directly. |
| Risk | F4's live-path resolution logic (mirroring `core/config.ts`'s precedence) drifts from the TypeScript source of truth over time if implemented as an independent bash re-derivation. | Low-Medium — same class of duplication risk already flagged as F9 for an unrelated pair of files | Prefer shelling out to a small embedded `node` snippet (the hook already does this for the JSON write, `:32-96`) that imports or mirrors the same resolution order, rather than reimplementing `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` precedence a second time in pure bash. |
| Risk | Changing the lock/marker directory path for existing overridden deployments mid-flight could leave an old marker at the old (wrong) location unconsumed. | Low — markers are advisory, not authoritative data | No migration needed: a stray marker at the old hardcoded path is harmless (Layer 3's full-sweep backstop still heals eventually); the fix only changes where *future* hook invocations write, not any existing marker's location. |
| Dependency | None | Both fixes are self-contained changes to `memory-drift-marker.sh`; no other phase must land first. | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The stale-lock reclaim must never destructively remove a lock a live writer still
  holds — the rename-then-remove pattern (mirroring `spec-folder-mutex.ts:101-122`) must confirm
  the rename succeeded before treating the lock as reclaimed.
- **NFR-R02**: A malformed or unreadable staleness check (e.g. `stat` failing on the lock dir for
  an unrelated reason) must fail closed — i.e. fall back to today's existing 5-second-timeout,
  exit-0 behavior — rather than looping forever or crashing the hook.

### Compatibility
- **NFR-C01**: With no DB-path override set, F4's resolution must produce byte-identical output to
  today's hardcoded path (REQ-004), so this is a pure hardening change for the common case, not a
  behavior change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A lock directory that exists but was created moments ago by a genuinely still-running
  concurrent hook: must not be reclaimed (REQ-002); the staleness threshold must sit comfortably
  above normal single-subprocess lifetime.
- A lock directory whose mtime cannot be read (e.g. permissions issue, deleted between the
  `EEXIST` and the `stat` call): treated as "cannot confirm staleness" and falls back to the
  existing wait-and-retry behavior (NFR-R02), not an immediate reclaim.

### Error Scenarios
- Two hook invocations both detect the same stale lock and both attempt to reclaim it
  simultaneously: the rename-based reclaim (mirroring `spec-folder-mutex.ts:101-122`) means only
  one rename can succeed; the loser retries acquisition normally rather than corrupting state.
- `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` is set to a directory that does not exist yet: the hook's
  resolution should not crash — it should behave the same way `mkdir -p` already does today for
  the default directory (`:23`), creating the resolved directory if needed.

### State Transitions
- A marker already written under the old hardcoded path before this fix ships, still unconsumed
  when this fix lands: remains where it is: Layer 3's backstop or a future scan under the old
  path can still pick it up; this fix does not need to migrate it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One bash file, two additive, independent fixes; no schema change, no new files, no TypeScript surface touched |
| Risk | 12/25 | Touches a lock-acquisition path that, if broken, could either corrupt a concurrent marker write or reintroduce the same silent-death failure mode it's meant to fix; mitigated by mirroring an already-proven reclaim pattern (`spec-folder-mutex.ts`) and keeping the no-override behavior byte-identical (REQ-004) |
| Research | 4/20 | Both mechanisms confirmed against the live tree at spec time (direct file:line reads of the hook script, the consumer-side resolver, the DB-path config module, and the existing stale-lock precedent); findings were pre-identified by a prior review pass, not re-derived here |
| **Total** | **24/70** | **Level 2** (findings-driven hardening phase; kept at Level 2 for checklist-grade verification discipline despite the low raw score) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the hook resolve the live DB directory by shelling out to a small node snippet that
  imports the same `core/config.ts` resolution logic (avoiding duplication, at the cost of an
  import path into compiled `mcp_server` output from a git hook), or by independently re-reading
  `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` in bash/embedded-node and accepting the same
  class of duplication risk already flagged as F9 for an unrelated pair of files?

### Resolved Questions

- **Stale-lock staleness threshold: 30-60 seconds.** A follow-up adversarial review ran a real
  test — SIGKILLing a lock-holder process mid-acquisition (`mkdirSync` succeeded, the `finally`
  release block not yet reached) in a throwaway directory — and confirmed the actual failure
  shape: each lock-acquisition attempt fails fast (~5 seconds), but the stale lock is never
  recovered on any subsequent attempt, so Layer 2 goes silently and permanently dead after exactly
  one killed hook process; no single git operation hangs. Since normal lock hold time is
  sub-second, a threshold of 30-60 seconds is comfortably conservative: far enough above normal
  operation and the existing 5-second wait budget to never reclaim a live writer's lock, while
  still recovering within a small, bounded number of commits after a kill. This value is the
  acceptance criterion for REQ-005, not an implementation-time free choice.
<!-- /ANCHOR:questions -->
