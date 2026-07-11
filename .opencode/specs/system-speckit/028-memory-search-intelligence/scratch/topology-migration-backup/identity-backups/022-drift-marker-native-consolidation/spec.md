---
title: "Feature Specification: Drift-Marker Native Consolidation [template:level_2/spec.md]"
description: "The Layer-2 git-hook drift-marker writer (.opencode/scripts/git-hooks/lib/memory-drift-marker.sh) re-implements four pieces of logic that already exist as tested TypeScript in mcp_server: DB-directory-override precedence (missing config.ts's boundary-enforcement check), the suspect/marker dedup-key format, the atomic temp-file-plus-rename write, and the lock-acquire/stale-reclaim pattern (a different, untested 45s staleness constant vs. 5 minutes, and no owner-liveness check). Fix: replace the embedded heredoc JS with a real call to a compiled, tested Node entrypoint that imports the four existing TS helpers directly."
trigger_phrases:
  - "drift marker native consolidation"
  - "git hook embedded heredoc duplication"
  - "drift marker lock staleness constant mismatch"
  - "memory-drift-marker.sh untestable heredoc"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/022-drift-marker-native-consolidation"
    last_updated_at: "2026-07-09T20:31:22.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded spec, plan, tasks and checklist; status PLANNED, no code written"
    next_safe_action: "Plan approval, then implement per plan.md"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/core/config.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/api/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the lock-reclaim staleness threshold be a parameter added to spec-folder-mutex.ts's isReclaimableLock (default preserving its existing 5-minute value), or a wholly separate shared primitive extracted from both? See §10."
      - "Should the git hook pipe the parsed diff-tree text to the new entrypoint via stdin (today's heredoc equivalent) or via the existing MEMORY_DRIFT_DIFF/MEMORY_DRIFT_REPO_ROOT/MEMORY_DRIFT_SOURCE env vars unchanged? See §10."
    answered_questions: []
---
# Feature Specification: Drift-Marker Native Consolidation

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
| **Branch** | `022-drift-marker-native-consolidation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **code-quality/maintainability fix, not a bug fix** — the current shell-embedded
behavior is functionally correct today, just duplicated, untestable, and one already-observed
edge (the lock-staleness constant mismatch) away from silently disagreeing with the server it
mirrors. It sits on the same Layer-2 git-hook drift-marker pipeline that
`011-automatic-drift-self-healing` shipped and `013-drift-marker-pipeline-resilience` already
hardened (stale-lock breaking, live-DB-path-aware marker write location) — this phase does not
redo either of those fixes, it replaces the file both fixes live in with a real, imported,
vitest-covered TypeScript entrypoint so future changes to any of the four duplicated behaviors
happen in one tested place instead of two.

**Scope Boundary**: Replace `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`'s embedded
`node <<'NODE' ... NODE` heredoc body with a call to a compiled Node entrypoint that imports the
four existing TS helpers. No change to the consumer side
(`consumeMemoryDriftDirtyMarker`/`resolveMemoryDriftMarkerPath`, already correct per 013), no
change to Layer 1 or Layer 3 of 011's self-healing design, no new feature flag.

**Dependencies**: This phase's target file
(`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`) is the exact file
`013-drift-marker-pipeline-resilience` already modified and shipped (F3 stale-lock breaking, F4
live-DB-path resolution — both complete, `013`'s `implementation-summary.md` status Complete,
100%). This phase builds **on top of** 013's landed behavior, not instead of it: the acceptance
criteria below require the new native entrypoint to preserve 013's two already-tested outcomes
(REQ-004's byte-identical unoverridden path, and the 30-60s-resolved, 45s-implemented staleness
window) exactly, not silently adopt a different value because the reused TS helper elsewhere
in the codebase (`spec-folder-mutex.ts`) happens to use a different one. See §6 Risks and §10
Open Questions for how that specific tension is resolved.

**Deliverables**:
- A new, compiled, vitest-covered Node entrypoint that imports and reuses the four existing TS
  helpers directly instead of re-implementing them in shell-embedded JS.
- A shrunk `memory-drift-marker.sh` that does only git plumbing (diff-tree parsing) plus one
  delegated call to that entrypoint.
- New exports on the `mcp_server/api` public barrel so the entrypoint (living under
  `scripts/git-hooks/`, a `scripts/`-tree consumer) can reach the four helpers legally, the same
  route `generate-description.ts` and `backfill-graph-metadata.ts` already use.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet
  number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` (143 lines) detects `.opencode/specs`
renames/deletes on `post-commit`/`post-merge`/`post-rewrite` (wired at
`git-hooks/post-commit:28-31`, `post-merge:19-29`, `post-rewrite:19-28`, all via
`mark_memory_drift_from_diff ... || true`) and writes an atomic dirty-marker JSON the MCP server
consumes at boot to run a scoped `memory_index_scan`. Its entire write-side logic
(`:28-142`) lives inside an embedded `node <<'NODE' ... NODE` heredoc block — untestable by
vitest, unreachable by any existing test suite, and verified today only by manual/empirical
testing (per `013`'s own resolved-questions record of a real SIGKILL-mid-acquisition repro run
by hand). That heredoc independently re-implements four pieces of logic that already exist as
tested TypeScript elsewhere in `mcp_server`:

**1. DB-directory-override precedence, missing the boundary-enforcement check.**
`memory-drift-marker.sh:56-63` resolves the marker directory by re-checking
`SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` in the same precedence order as
`core/config.ts:63-101`'s `computeDatabasePaths()` (`SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` wins,
else `MEMORY_DB_PATH`'s parent directory, else the hardcoded default) — this precedence mirror
is itself `013`'s F4 fix, already shipped and correct for the common case. But
`computeDatabasePaths()` does one more thing the shell copy has no equivalent of at all: after
resolving the override, it resolves symlinks via `realpathAllowMissing()` (`config.ts:44-56`)
and enforces that the resolved directory sits inside an allowed prefix
(`process.cwd()`, `os.homedir()`, or `os.tmpdir()` — `config.ts:79-92`), throwing
`"Database directory ... is outside the allowed project, home, and temporary directories"`
(`:88-91`) if not. `memory-drift-marker.sh:59-63` has no analogous check — it resolves
`runtimeDbDir`/`runtimeDbPath` and calls `fs.mkdirSync(markerDir, { recursive: true })`
unconditionally at `:64`. This is a real, if narrow, divergence: under a
`SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` override that resolves outside the allowed prefixes, the
live MCP server refuses to open its database at all (`computeDatabasePaths()` throws before any
DB path is ever returned), but the git hook, given the identical override in its own
environment, would silently create a directory and write a marker file there — a boundary the
server enforces and the hook does not, so the two can disagree about whether a given override is
even valid, not just about where the marker lands.

**2. The suspect/marker dedup-key format, independently re-derived.**
`memory-drift-marker.sh:125-127`'s `keyFor(entry)` closure —
`entry.kind === 'rename' ? \`rename:${entry.oldPath}->${entry.newPath}\` : \`delete:${entry.oldPath}\``
— is a hand-written duplicate of `memory-drift-healing.ts:206-210`'s exported
`memoryDriftMarkerEntryKey(entry)`, which computes the exact same two-branch string format for
the exact same purpose (collapsing repeated writes of the same rename/delete into one marker
entry, `:124-129`). The two are currently byte-identical in output, but nothing enforces that —
a future edit to either one (e.g. adding a third `entry.kind`, or changing the delimiter) has no
mechanism to keep the other in sync.

**3. The atomic temp-file-plus-rename write, independently re-derived.**
`memory-drift-marker.sh:136-138` writes the marker via
`tempPath = \`${markerPath}.tmp-${pid}-${Date.now()}-${random}\`` →
`fs.writeFileSync(tempPath, ...)` → `fs.renameSync(tempPath, markerPath)`. This is the same
write-to-temp-then-rename pattern `transaction-manager.ts:177-208`'s exported `atomicWriteFile()`
already implements (temp path at `:178`, write at `:188`, atomic rename at `:191`, temp-file
cleanup on failure at `:201-204`) — the one behavioral difference is that `atomicWriteFile`'s
temp suffix is the fixed `TEMP_SUFFIX = '.tmp'` (`:16`) rather than the hook's own
pid+timestamp+random suffix; this is not a correctness gap under the hook's own lock (only one
lock-holder can write at a time either way), but it is one more small, independently-maintained
divergence in a file that exists specifically to duplicate `atomicWriteFile`'s job.

**4. The lock-acquire/stale-reclaim logic, with a different, untested constant and a missing
check the equivalent server-side lock already has.**
`memory-drift-marker.sh:74` sets `LOCK_STALE_MS = 45_000` and `:79-89`'s `reclaimStaleLock(dir)`
implements a bare mtime-age check plus rename-then-remove reclaim
(`fs.renameSync(dir, reclaimedDir)`, confirm-then-`fs.rmSync`). This is the same class of fix
`013`'s F3 already shipped, deliberately modeled on
`spec-folder-mutex.ts:89-122`'s `isReclaimableLock()`/`reclaimInterprocessLock()` (per `013`'s
own spec.md: "This repo already has a working precedent for the identical class of bug on a
different lock"). But the two implementations were never unified — they are two independent,
parallel-developed copies of the same idea, and they disagree in two concrete ways:
`spec-folder-mutex.ts:18` sets `LOCK_STALE_MS = 5 * 60 * 1000` (5 minutes) where the shell copy
uses 45 seconds — a deliberate, domain-appropriate choice per `013`'s own resolved-questions
record (a short-lived, sub-second git-hook subprocess vs. a long-running save operation), not a
bug in itself, but one more place a future editor could "fix" the mismatch by literally
copy-pasting the wrong constant across. More concretely, `spec-folder-mutex.ts:52-84`'s
`getLockOwnerState()` reads an `owner.json` written by `createInterprocessLock()`
(`:150-159`, records `{pid, specFolder, acquiredAt}`) and probes that PID's liveness via
`process.kill(ownerPid, 0)` (`:71-83`) before falling back to the mtime-age check — a dead
owner's lock is reclaimed immediately, not just after the staleness window elapses. The shell
copy's `reclaimStaleLock()` has no owner-liveness check at all: it never writes an owner-identity
file at lock-acquire time (`memory-drift-marker.sh:95`'s `fs.mkdirSync(lockDir)` is bare), so a
killed hook process's lock can only ever be recovered by waiting out the full 45-second mtime
window, never detected as dead immediately the way `spec-folder-mutex.ts`'s lock can be.

### Purpose

Replace the shell-embedded re-implementation with a real call to a compiled, vitest-covered Node
entrypoint that imports and reuses `computeDatabasePaths`/`resolveDatabasePaths` (boundary check
included), `memoryDriftMarkerEntryKey`, `atomicWriteFile`, and the
`spec-folder-mutex.ts` lock-reclaim primitives directly, so the hook and the server can never
again silently disagree about where the marker lives, how entries dedupe, how the file is
written, or how a stale lock is recovered — and so this logic gets real automated test coverage
for the first time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **A new compiled Node entrypoint** under the existing `scripts/`-tree CLI-script convention
  (the same pattern `generate-description.ts` and `backfill-graph-metadata.ts` already use:
  TypeScript source in `system-spec-kit/scripts/`, compiled via `tsc --build` into
  `scripts/dist/`, importing shared logic only through `@spec-kit/mcp-server/api`, never a
  relative `mcp_server/lib/...` path — enforced today by
  `scripts/evals/check-no-mcp-lib-imports.ts` and `scripts/check-api-boundary.sh`). This
  entrypoint owns: parsing the rename/delete entries the hook already extracts from
  `git diff-tree`, resolving the marker directory via `resolveDatabasePaths()` (boundary check
  included, no shell re-derivation), deduping via `memoryDriftMarkerEntryKey`, acquiring the
  write lock via the shared, staleness-parameterized reclaim primitive (see §10), and writing via
  `atomicWriteFile`.
- **New exports on `mcp_server/api/index.ts`** for the four helpers this entrypoint needs
  (`resolveDatabasePaths`, `memoryDriftMarkerEntryKey`, `atomicWriteFile`, and the lock-reclaim
  primitives), following the exact precedent set when `computeMemoryQualityScore` was added to
  this same barrel for an equivalent `scripts/`-tree consumer.
- **A shrunk `memory-drift-marker.sh`**: `mark_memory_drift_from_diff` keeps its existing
  signature, its `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK` early exit (`:5-7`), its `git rev-parse`
  and `git diff-tree` calls (`:9-19`, this stays git plumbing in bash — it is not duplicated
  logic, it is the one thing only `git` itself can answer), and its `node` availability check
  (`:21-23`). Everything from the heredoc open (`:28`) through its close (`:142`) is replaced by
  one delegated call to the new compiled entrypoint, passed the same
  `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` environment contract the
  heredoc already consumes (see §10 for the stdin-vs-env open question).
- **The staleness-constant reconciliation** (§10): making the reused lock-reclaim mechanism
  parameterizable so `spec-folder-mutex.ts`'s own callers keep their existing 5-minute default
  unchanged, while the new drift-marker entrypoint passes its own `013`-tested 45-second value —
  gaining the owner-liveness check `spec-folder-mutex.ts` already has, without regressing either
  packet's tuned staleness window.
- **First-time automated test coverage** for all four behaviors this entrypoint now owns (dedup
  key, atomic write, lock acquire/stale-reclaim, boundary-enforced path resolution), via vitest —
  something the embedded heredoc could never get.

### Out of Scope

- Any change to `spec-folder-mutex.ts`'s own default 5-minute staleness value, its heartbeat
  mechanism, or any of its existing callers' behavior — this phase adds a parameter with a
  default that preserves today's behavior exactly, it does not change what `memory_save`'s own
  lock does today.
- Any change to the consumer side of the pipeline
  (`consumeMemoryDriftDirtyMarker`/`resolveMemoryDriftMarkerPath`,
  `startup-checks.ts:243-320`/`memory-drift-healing.ts:200-203`) — already correct per `013`'s
  own scope statement, untouched here.
- Any change to Layer 1 (query-time existence filtering) or Layer 3 (sweep-to-completion
  backstop) of `011-automatic-drift-self-healing`.
- Re-litigating `013`'s F3 staleness-threshold value (30-60s, implemented 45s) or its F4
  DB-directory-override precedence order — both are correct and preserved exactly, only their
  *implementation location* moves from shell-embedded duplication to an imported call.
- The F9 finding (a separate, unassigned duplication between `status-classifier.sh` and
  `strict-pass-freshness.ts`'s "valid completion status" list) — same class of bug, different
  files, out of scope here.
- Any new feature flag, capability toggle, or default-on/default-off behavior change to any part
  of the drift-marker pipeline.
- Rewriting the marker JSON schema (`{version, updatedAt, entries}`) or the
  `MEMORY_DRIFT_MARKER_FILENAME` constant.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/scripts/git-hooks/drift-marker-write.ts` | Create | New compiled CLI entrypoint: parses hook-supplied diff entries, resolves the marker path via `resolveDatabasePaths()`, dedups via `memoryDriftMarkerEntryKey`, acquires the write lock via the shared reclaim primitive, writes via `atomicWriteFile` |
| `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` | Modify | Replace the embedded `node <<'NODE'` heredoc body (`:28-142`) with a delegated call to the compiled entrypoint; keep the existing git-plumbing and early-exit logic (`:1-23`) unchanged |
| `.opencode/skills/system-spec-kit/mcp_server/api/index.ts` | Modify | Add re-exports for `resolveDatabasePaths`, `memoryDriftMarkerEntryKey`, `atomicWriteFile`, and the lock-reclaim primitives the new entrypoint needs |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts` | Modify (additive) | Parameterize the staleness threshold used by the reclaim check with a default equal to today's `LOCK_STALE_MS`, so existing callers are unaffected and the new entrypoint can pass its own 45s value; see §10 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The git hook's marker-write logic SHALL be implemented once, in TypeScript, importing `computeDatabasePaths`/`resolveDatabasePaths`, `memoryDriftMarkerEntryKey`, and `atomicWriteFile` from their existing modules (via the `mcp_server/api` barrel) rather than re-implementing any of the three in shell-embedded JS. | `rg -n "keyFor\|tempPath.*tmp-\|runtimeDbDir\|runtimeDbPath"` against the post-fix `memory-drift-marker.sh` returns zero matches for the removed heredoc body; the new entrypoint's compiled output imports each of the three named symbols from `@spec-kit/mcp-server/api` (verified by import statement, not re-declaration). |
| REQ-002 | With a `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` override that resolves outside the allowed boundary (`process.cwd()`/`os.homedir()`/`os.tmpdir()`), the hook SHALL fail the same way `computeDatabasePaths()` does — refuse to write a marker — instead of silently creating a directory and writing there. | A synthetic override pointing outside all three allowed prefixes causes the new entrypoint to throw/exit non-zero with the same boundary-violation message `config.ts:88-91` produces, and no marker file is written; the calling hook still exits 0 overall (existing `\|\| true` contract at every call site preserved). |
| REQ-003 | With no DB-path override set, the marker's write location, dedup behavior, and file format SHALL remain byte-identical to today's post-013 behavior — this is a consolidation of implementation, not a behavior change. | A same-repo before/after comparison with no `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH` set writes the marker to the exact same path, with the exact same `{version, updatedAt, entries}` shape and the exact same dedup collapsing for a repeated rename/delete, as the pre-fix shell heredoc produced. |
| REQ-004 | The lock-acquire/stale-reclaim logic SHALL be implemented once and reused from `spec-folder-mutex.ts`'s existing reclaim primitives, gaining owner-liveness detection, WITHOUT changing the drift-marker hook's own staleness window from its `013`-resolved value. | The new entrypoint's lock reclaim: (a) reclaims immediately when the lock's `owner.json`-recorded PID is provably dead (no staleness wait required), matching `spec-folder-mutex.ts:98`'s `ownerState === 'dead'` branch; (b) falls back to an age check using the drift-marker hook's own 45-second threshold, not `spec-folder-mutex.ts`'s 5-minute default, when the owner cannot be determined; (c) `spec-folder-mutex.ts`'s own existing tests (`spec-folder-mutex-liveness.vitest.ts`) still pass unchanged, confirming its own callers still see the 5-minute default. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The new entrypoint's import of the four reused helpers SHALL pass `check-no-mcp-lib-imports` and `check-api-boundary.sh` — no relative `mcp_server/lib/...` or `mcp_server/handlers/...` import path from the `scripts/` tree. | `npx tsx evals/check-no-mcp-lib-imports.ts` and `bash check-api-boundary.sh`, run from `.opencode/skills/system-spec-kit/scripts/`, report zero violations for the new file. |
| REQ-006 | The four reused behaviors SHALL gain vitest coverage they do not have today (the embedded heredoc has none). | New/extended vitest suites cover: the dedup-key collapsing of a repeated rename/delete entry, the atomic-write's crash-mid-write recovery (no partial marker file), the lock-reclaim's dead-owner-immediate-reclaim and stale-mtime-fallback paths, and the boundary-violation throw path (REQ-002). |
| REQ-007 | `mark_memory_drift_from_diff`'s existing call-site contract SHALL be unchanged: `post-commit`, `post-merge`, and `post-rewrite` continue to call it exactly as today, each still wrapped in `\|\| true`, and it still no-ops silently when `node` is unavailable or the diff is empty. | The three hook files (`post-commit:31`, `post-merge:27,29`, `post-rewrite:28`) require no edits; a manual run with `node` shadowed out of `PATH`, and a run against a commit touching no `.opencode/specs` paths, both exit 0 with no marker write, matching today's behavior exactly. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: None of the four duplicated behaviors (DB-path precedence + boundary check, dedup
  key, atomic write, lock reclaim) has a second, independent, shell-embedded implementation
  anywhere in the repo after this phase ships — each is implemented exactly once, in the existing
  tested TypeScript module, and the git hook calls it.
- **SC-002**: The boundary-enforcement gap (Problem #1) is closed: an out-of-boundary DB-path
  override is refused by the hook the same way it is refused by the live server, instead of the
  hook silently succeeding where the server would have thrown.
- **SC-003**: The lock-reclaim gap (Problem #4) is closed without regressing either packet's own
  tuned constant: the drift-marker hook keeps its `013`-resolved 45-second staleness window and
  gains immediate dead-owner reclaim; `spec-folder-mutex.ts`'s own 5-minute default and existing
  callers are unaffected, proven by its own unchanged test suite still passing.
- **SC-004**: With no override set, marker placement, dedup behavior, and file format are
  unchanged from today's post-`013` behavior (REQ-003) — this phase is a pure implementation
  consolidation for the common case.
- **SC-005**: The four behaviors this entrypoint now owns have vitest coverage for the first
  time (REQ-006), closing the "untestable embedded heredoc" gap named in the Problem Statement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Naively reusing `spec-folder-mutex.ts`'s `isReclaimableLock()` as-is would inherit its hardcoded 5-minute `LOCK_STALE_MS`, silently regressing the drift-marker hook's `013`-resolved, empirically-tested 45-second recovery window (a ~6.7x slower recovery after a killed hook process). | Medium — would reopen the exact "Layer 2 goes silently and permanently dead after one kill" failure class `013` fixed, just with a longer window before self-heal | Parameterize the staleness threshold (REQ-004, §10) rather than importing the constant; add a regression test asserting the drift-marker entrypoint's reclaim uses its own 45s value, not the mutex's 5-minute one |
| Risk | The new entrypoint's boundary-enforcement check (Problem #1 fix, REQ-002) could start rejecting a DB-path override some currently-running session already relies on, if that override happens to resolve outside the allowed prefixes without anyone noticing (because the shell copy never checked). | Low-Medium — would surface a previously-silent misconfiguration as a hook failure (still non-fatal to the commit, `\|\| true` preserved) rather than a silent Layer-2-writes-nowhere-useful outcome | The failure is caught and logged, not thrown uncaught into the git hook's exit code (REQ-007); this is a strict improvement (loud-but-non-fatal beats silent-and-wrong) but is called out here since it is new-observable behavior under an already-misconfigured environment |
| Risk | `atomicWriteFile`'s fixed `.tmp` suffix (vs. the shell copy's pid+timestamp+random suffix) could collide if the lock is ever bypassed or a bug lets two writers proceed concurrently. | Low — the write already only happens under the acquired lock in both today's and the planned design, so this is a defense-in-depth question, not a live gap | Confirm in implementation that the write call sits fully inside the acquired-lock window in the new entrypoint, exactly as it does today (`memory-drift-marker.sh:112-141`'s `try { ... } finally { release }` shape); no change needed to `atomicWriteFile` itself |
| Dependency | `013-drift-marker-pipeline-resilience` (same target file, F3 stale-lock breaking + F4 live-DB-path resolution) | Already shipped and complete; this phase's acceptance criteria are written against its resolved values (45s staleness, live-DB-path precedence order) as the behavior to preserve, not rediscover | No blocking dependency — 013 is done — but REQ-003/REQ-004 exist specifically so this phase does not silently undo 013's tuning while consolidating its implementation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The new entrypoint must preserve the existing non-fatal contract at every call
  site — a thrown error (boundary violation, lock timeout, write failure) must never propagate
  as a non-zero exit that breaks `post-commit`/`post-merge`/`post-rewrite` (all three already
  wrap the call in `\|\| true`, but the entrypoint itself must also exit cleanly on its own
  handled-error paths, matching the heredoc's existing `process.exit(0)` early-outs).
- **NFR-R02**: A malformed or unreadable existing marker file (today's `memory-drift-marker.sh:114-117`
  fallback-to-empty behavior) must be preserved exactly by the new entrypoint — this phase does
  not tighten that tolerance into a hard failure.

### Compatibility
- **NFR-C01**: With no DB-path override set, the new entrypoint's output is byte-identical to
  today's post-`013` shell-heredoc output (REQ-003) for the same input diff.
- **NFR-C02**: `spec-folder-mutex.ts`'s own existing behavior and test suite are unaffected by
  the staleness-parameterization change (REQ-004c).

### Maintainability
- **NFR-M01**: After this phase, a future change to the DB-path override precedence, the dedup
  key format, the atomic-write mechanism, or the lock-reclaim algorithm needs to happen in
  exactly one place to take effect for both the git hook and the live MCP server — this is the
  actual property this phase exists to deliver, not just consolidation for its own sake.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A `SPEC_KIT_DB_DIR`/`MEMORY_DB_PATH` override that resolves to a path that does not exist yet:
  `realpathAllowMissing()` (`config.ts:44-56`) already handles a not-yet-created path by
  recursing to the nearest existing parent — the new entrypoint must exercise this same helper,
  not a shell re-derivation of it, so this edge case is inherited correctly rather than
  re-solved.
- Two hook invocations racing on the same repo (two commits landing near-simultaneously from two
  sessions): the lock still serializes them; only one rename-based reclaim can succeed if both
  detect the same stale lock (mirrors `spec-folder-mutex.ts:101-122`'s existing race-safety
  property).

### Error Scenarios
- The existing marker file is malformed JSON: falls back to `{version: 1, entries: []}` exactly
  as `memory-drift-marker.sh:112-118` does today (NFR-R02) — the new entrypoint must not turn
  this into a hard failure.
- `resolveDatabasePaths()` throws the boundary-violation error (REQ-002): caught by the
  entrypoint, logged, and treated as a no-write outcome — not an uncaught exception that could
  propagate a non-zero exit through the `\|\| true` wrapper into something the git hook cannot
  recover from at a plumbing level (e.g. a corrupted git object) — confirm this by direct test,
  not assumption, since `\|\| true` catches process exit codes but not partial writes.

### State Transitions
- A marker written under the old, pre-consolidation shell-heredoc code path, still unconsumed
  when this phase ships: unaffected — this phase changes how the marker is written going
  forward, not the marker file's own format or location for an override-free session (REQ-003),
  so an unconsumed marker from before this phase remains valid and consumable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One new TypeScript entrypoint file, one shrunk shell file, new barrel exports, and one additive/backward-compatible signature change to `spec-folder-mutex.ts`; no schema change, no new marker format |
| Risk | 15/25 | Touches the same lock/boundary/write-path machinery `013` already hardened once; the staleness-constant reconciliation (§10) is a genuine design decision with a documented wrong answer to avoid (silently inheriting the 5-minute default) |
| Research | 6/20 | All four duplications and the exact reuse targets confirmed against the live tree via direct file:line reads (this spec, `013`'s own spec.md, and the four TS source files); the only open items are two implementation-time wiring choices (§10), not open architectural questions |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Staleness-threshold reconciliation mechanism**: should the fix (a) add an optional `staleMs`
  parameter to `spec-folder-mutex.ts`'s `isReclaimableLock()` (default = today's
  `LOCK_STALE_MS`, so existing callers are unaffected, and the new drift-marker entrypoint passes
  its own 45,000ms), or (b) extract the owner-liveness-plus-mtime-check algorithm into a new,
  smaller shared primitive that both `spec-folder-mutex.ts` and the drift-marker entrypoint call
  with their own threshold, leaving `spec-folder-mutex.ts`'s own exported functions untouched?
  Option (a) is the smaller diff; option (b) is cleaner separation but touches one more file's
  internal structure. Resolve during planning before implementation begins — this is the one
  genuine design decision this phase carries, everything else is a direct, unambiguous reuse of
  an existing exported function.
- **Diff-payload transport**: should the shrunk `memory-drift-marker.sh` pass the parsed
  diff-tree output to the new compiled entrypoint via the same
  `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` environment variables the
  heredoc already reads (`:25-27`, minimal diff, preserves the exact existing interface), or via
  stdin/argv instead? Environment variables are the leading candidate specifically because they
  require the smallest possible change to the three call sites in `post-commit`/`post-merge`/
  `post-rewrite`, none of which need to change at all under this option.

### Resolved Questions

The implementation selected the smaller diffs documented in plan.md and `decision-record.md`:
an optional `staleMs` parameter on `isReclaimableLock()` with its existing five-minute default,
and the unchanged `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` transport.
<!-- /ANCHOR:questions -->
