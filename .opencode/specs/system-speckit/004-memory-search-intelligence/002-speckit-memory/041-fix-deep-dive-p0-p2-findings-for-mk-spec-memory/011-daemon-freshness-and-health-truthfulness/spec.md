---
title: "Feature Specification: Phase 11: daemon-freshness-and-health-truthfulness [template:level_1/spec.md]"
description: "Break the dist-freshness bootstrap deadlock that takes the spec-memory CLI surface down, make hook fallback failures visible, fix memory_health diagnostics that can never fire, and run a timeboxed SIGBUS crash-loop diagnosis."
trigger_phrases:
  - "dist freshness deadlock"
  - "stale dist exit 75"
  - "memory health truthfulness"
  - "sigbus crash loop"
  - "cli fallback skipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness"
    last_updated_at: "2026-07-04T17:51:12.131Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored planning docs (spec/plan/tasks/checklist) from deep-dive Chain C + Agent I evidence"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-daemon-freshness-and-health-truthfulness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: daemon-freshness-and-health-truthfulness

<!-- SPECKIT_LEVEL: 2 -->
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
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 13 |
| **Predecessor** | 010-search-hot-path-performance |
| **Successor** | 012-envelope-presentation-and-command-doc-alignment |
| **Handoff Criteria** | Build clears staleness same-session (deadlock regression test green); hook fallback skips visibly surfaced; memory_health numbers reconcile with raw SQL under documented definitions; validate.sh --strict exit 0 on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Deep dive remediation phase children specification.

**Execution order note**: despite the folder number, this phase is **FIRST** in the program's recommended execution order (011 → 001 → 002 → ... per ../research/phase-decomposition.md). Every later phase depends on a trustworthy daemon/CLI surface and honest health numbers; the numeric Predecessor/Successor rows above reflect folder ordering only.

**Scope Boundary**: dist-freshness gate and its build-side cache bootstrap, spec-memory CLI shim exit taxonomy and argv exemptions, hook fallback visibility, memory_health/memory_stats truthfulness (definitions shared with phase 002), timeboxed SIGBUS diagnosis, validate.sh CONTINUITY_FRESHNESS import repair, and ExperimentalWarning suppression in CLI spawns. No ranking, corpus, or save-path changes.

**Dependencies**:
- None upstream (this phase runs first). Phase 002 consumes the shared population-definition note produced here (stats vs health).
- Native modules `better-sqlite3` / `sqlite-vec` (SIGBUS diagnosis inspects their build state).

**Deliverables**:
- `finalize-dist.mjs` writes per-entry source-hash freshness caches after a successful build (deadlock broken at the source).
- `spec-memory.cjs`: `--help`/`--version`/completion exempt from the gate; stale-dist exit taxonomy made explicit; recovery texts unified; git state reconciled.
- Hook fallback skip reason surfaced one-line at startup; `session_health` exposes last-fallback status.
- `memory-crud-health.ts` exclusion audit queries a real column; sampled metrics labeled; maintenance lastRun wired.
- SIGBUS diagnosis notes with mitigation (native rebuild check, launcher backoff cap).
- validate.sh CONTINUITY_FRESHNESS import error verified and fixed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The entire memory surface was down at session start on 2026-07-03 and the loss was silent: a dist-freshness bootstrap deadlock that `npm run build` (exit 0) cannot clear blocked the CLI shim (live-reproduced twice, deep-dive Chain C), the stale condition was misclassified as retryable exit 75 while hooks fail open, and the daemon's context-server had been crash-looping with SIGBUS earlier that morning (launcher log 05:52-06:07). Independently, `memory_health`'s hard-exclusion audit queries a nonexistent column `content` so the diagnostic can never fire (report §3 #24), and several health metrics misrepresent what they measure (sampled orphan counts presented as totals, last-scan unreadable when the runtime is not initialized, maintenance lastRun never wired).

### Purpose
After this phase, a successful build yields a fresh verdict in the same session, any CLI-fallback skip is visibly surfaced at startup, and health/stats numbers reconcile with raw SQL under documented population definitions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dist-freshness deadlock fix: `finalize-dist.mjs` writes per-entry source-hash caches post-build; checker keeps trusting hash-cache first (`dist-freshness.cjs:349-364`).
- CLI gate ergonomics: exempt `--help`/`--version`/completion; stale-dist exit taxonomy (conservative default: document stale-dist as a non-retryable sub-case *within* 75; distinct code only if the consumer inventory proves it); unify the two recovery command texts (`dist-freshness.cjs:314,390`); reconcile the `spec-memory.cjs` working-tree/git state for any exit-75-adjacent change; align the exit-69 claims in `dist-freshness-enforcement.md:35,42` with actual shim behavior; locate and correct the stale "Off by default" comment cluster tied to these surfaces.
- Hook visibility: one-line "Memory: CLI fallback skipped (<reason>)" in the startup surface; `session_health` exposes last-fallback status.
- Health truthfulness: exclusion-audit `content` → `content_text` (`memory-crud-health.ts:463-473`); last-scan timestamp readable when runtime not initialized; `orphanFiles` labeled as sampled (200-row sample); consistency `mismatchedIds` payload capped; maintenance `lastRun` wiring; shared population definitions note with `memory_stats` (definitions land here, full predicate lands in phase 002).
- SIGBUS crash-loop: timeboxed diagnosis (launcher log evidence, crash-probe receipts, `better-sqlite3`/`sqlite-vec` native rebuild check, launcher backoff cap).
- validate.sh CONTINUITY_FRESHNESS: verify + fix the reported import error for a missing `scripts/mcp_server/lib/validation/spec-doc-structure.js`.
- Suppress Node SQLite ExperimentalWarning in CLI spawns (`spec-memory.cjs` spawnSync; `spec-memory-cli-fallback.ts:210` spawn).

### Out of Scope
- Ranking, corpus repair, save-path, trigger, or graph changes — owned by phases 001-010.
- Envelope presentation and the broader command-doc drift battery — owned by phase 012 (this phase only fixes freshness-gate-adjacent doc drift).
- Full shared active-row predicate implementation — owned by phase 002 (this phase contributes the definitions note only).
- Rebuilding sibling CLI shims (`code-index.cjs`, `skill-advisor.cjs`) beyond a same-class inventory and documented disposition — program scope is mk-spec-memory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs | Modify | Write per-entry source-hash freshness caches after successful build |
| .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs | Modify | Export cache-write helper for finalize; unify recovery message texts |
| .opencode/bin/spec-memory.cjs | Modify | Exempt --help/--version/completion; stale-dist exit taxonomy; warning suppression in spawn |
| .opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts | Modify | Surface skip reason; record last-fallback status; warning suppression in spawn |
| .opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts | Modify | Expose last-fallback status |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | Modify | content_text column fix; sampled labels; mismatchedIds cap; last-scan without runtime; maintenance lastRun |
| .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/dist-freshness-enforcement.md | Modify | Exit 69→actual taxonomy; hash-cache paragraph rewrite ("never pre-warmed" becomes false) |
| .opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts | Modify | Deadlock-bootstrap regression test |
| .opencode/skills/system-spec-kit/scripts/spec/validate.sh (+ scripts/validation/continuity-freshness.ts chain) | Modify | Verify + fix CONTINUITY_FRESHNESS spec-doc-structure.js import |
| Daemon launcher (locate via `rg -n "backoff|respawn|restart" .opencode/skills/system-spec-kit/mcp_server`) | Modify | Backoff cap for crash-loop mitigation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Break the dist-freshness bootstrap deadlock: `finalize-dist.mjs` writes per-entry source-hash caches after a successful build for every mcp_server dist entry (default, spec-memory-cli, validation-orchestrator). Today the hash cache is only written after an mtime pass (`dist-freshness.cjs:394`), so it can never bootstrap when `tsc --build` skips re-emitting content-identical outputs (🟢 Chain C, live-reproduced twice). **Enumeration invariant**: the finalizer MUST compute each cache over the checker's own source *enumeration* (`collectSourceFiles`, walked at `dist-freshness.cjs:333`), not merely its hash function (`hashSourceFiles`/`cachePathFor`). If the finalizer enumerates its own file set and it diverges from what the checker walks, the stored hash never equals the checker's recomputed hash and the deadlock persists. | With source mtimes newer than dist mtimes and no cache present: `npm run build` in mcp_server → `node .opencode/bin/spec-memory.cjs --help` exits 0 in the same session, resolved via the hash short-circuit (`:349-364`), not the mtime path; the finalizer-written hash equals the checker's recompute over `collectSourceFiles`; regression test in dist-freshness.vitest.ts covers the bootstrap path |
| REQ-002 | Exempt `--help`, `--version`, and shell-completion argv from the freshness gate in `spec-memory.cjs` (gate currently runs unconditionally before argv inspection, `spec-memory.cjs:76-77`). | With a forced-stale dist, `spec-memory.cjs --help` and `--version` print usage/version and exit 0; a tool invocation still refuses |
| REQ-003 | Make the stale-dist exit taxonomy explicit. **Conservative default**: DOCUMENT stale-dist as a non-retryable sub-case *within* exit 75 (stale/missing currently exits `EXIT_RETRYABLE=75` at `spec-memory.cjs:55-56`) — do NOT move it off 75. CLAUDE.md's "75 = retryable" is a live consumer contract (hooks, doctor routes, README), so a distinct non-retryable exit code is introduced ONLY if the T006 consumer inventory (`rg -n "75"`) proves a caller actually mis-retries stale-dist. Also: reconcile the `spec-memory.cjs` working-tree state for any exit-75-adjacent change (verify-first: clean in git as of 2026-07-03T09:5xZ, but dispatch-reported uncommitted — confirm and commit or record the SHA); unify the missing-dist and stale-dist recovery texts (`dist-freshness.cjs:314,390`); fix the exit-69 doc drift (`dist-freshness-enforcement.md:35,42` vs `spec-memory.cjs:20-21,56`). | Exit-code decision recorded in plan/tasks with rationale; default outcome is "stale-dist documented as non-retryable within 75" unless the inventory proves a distinct code is required; `git status` clean for the shim with the behavior committed; both refusal messages carry the same rebuild-command form; enforcement doc states the real exit code |
| REQ-004 | Fix the health hard-exclusion audit column: `memory-crud-health.ts:463-473` filters on nonexistent column `content` (`content IS NOT NULL`) so the prepared statement throws, is caught, and `exclusionAudit` is always 'ok' (report §3 #24, 🟡 — verify by running the query against the live schema first). | Query uses `content_text`; a synthetic hard-excluded row makes the diagnostic fire in a test; live run returns a real verdict instead of constant 'ok' |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Hook fallback visibility: when the CLI fallback is skipped or fails (`spec-memory-cli-fallback.ts`, fail-open at :258), emit one line "Memory: CLI fallback skipped (<reason>)" in the startup surface, and expose last-fallback status (timestamp, reason, outcome) via `session_health` (this session lost continuity silently, 🟢 ledger L6). | Forced-stale dist at session start produces the visible one-liner; `session_health` response includes the last-fallback record |
| REQ-006 | Health/stats truthfulness batch: last-scan timestamp readable when the runtime is not initialized; `orphanFiles` labeled as a 200-row sample, not a total (12,352 actual dead rows vs reported 25, 🟢 L2); consistency `mismatchedIds` payload capped; maintenance `lastRun` wired (currently null though reconcile has never run, 🟢 L3); shared population-definitions note published with `memory_stats` (stats excludes deprecated silently, health counts raw — 7,369-row disagreement, 🟢 L1). | Each metric's label matches its measurement method; health-vs-raw-SQL reconciliation receipt recorded; definitions note referenced by both handlers and by phase 002 |
| REQ-007 | SIGBUS crash-loop diagnosis (timeboxed, max 1 day): analyze launcher log evidence 05:52-06:07 and crash-probe receipts, check `better-sqlite3`/`sqlite-vec` native module build state (rebuild check), and cap launcher restart backoff so a crash-loop cannot burn unbounded restarts (🟢 L6, self-healed, cause untraced — mmap/native suspect). | Diagnosis notes with evidence and either root cause or explicit UNKNOWN + mitigation; backoff cap implemented and covered by a unit test or documented manual receipt |
| REQ-008 | Validation + spawn hygiene: verify and fix the validate.sh CONTINUITY_FRESHNESS import error for missing `scripts/mcp_server/lib/validation/spec-doc-structure.js` (reported this session; did NOT reproduce on 2026-07-03T09:5xZ strict run of this folder — verify-first, find the triggering condition); suppress Node SQLite ExperimentalWarning in CLI spawns (`spec-memory.cjs` spawnSync, `spec-memory-cli-fallback.ts:210`). | Triggering condition identified and import path fixed (or not-reproducible verdict recorded with the exact probe commands); CLI stderr free of ExperimentalWarning on a clean invocation |

### Acceptance Scenarios

1. **Given** a dist tree where git checkout touched source mtimes without content changes and no freshness cache exists, **When** the operator runs `npm run build` in mcp_server and invokes the spec-memory CLI, **Then** the CLI runs the command instead of refusing with a stale-dist error (REQ-001).
2. **Given** a genuinely stale dist entry, **When** the operator runs `spec-memory.cjs --help`, **Then** usage text prints with exit 0 while a real tool call still refuses with the documented stale-dist code and the unified recovery text (REQ-002, REQ-003).
3. **Given** a stale dist at session start, **When** hooks fall back and skip the CLI, **Then** the startup surface shows "Memory: CLI fallback skipped (<reason>)" and `session_health` reports the last-fallback record (REQ-005).
4. **Given** a synthetic row that a hard-exclusion rule should flag, **When** `memory_health` runs its exclusion audit, **Then** the diagnostic fires instead of returning constant 'ok' (REQ-004).
5. **Given** an uninitialized runtime, **When** the operator reads health, **Then** the last-scan timestamp is still readable and `orphanFiles` is labeled as sampled (REQ-006).
6. **Given** the strict validation path that previously errored importing `spec-doc-structure.js`, **When** validate.sh runs CONTINUITY_FRESHNESS under the identified triggering condition, **Then** the check completes without an import error (REQ-008).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Build → fresh verdict in the same session: the Chain C reproduction steps no longer produce a refusal after a successful build (regression test + live receipt).
- **SC-002**: Stale-dist is visibly surfaced at startup (one-line skip reason + session_health status) — no more silent continuity loss.
- **SC-003**: Health numbers reconcile with raw SQL within documented definitions: exclusion audit can fire, sampled metrics labeled, maintenance lastRun real, stats-vs-health population difference documented.
- **SC-004**: SIGBUS diagnosis closed with evidence-backed root cause or explicit UNKNOWN plus a launcher backoff cap.
- **SC-005**: Vitest baseline delta clean: the whole mcp_server suite re-run shows no new failures vs the Phase-1 baseline capture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `better-sqlite3` / `sqlite-vec` native builds | SIGBUS diagnosis inconclusive if native state already healed | Timebox; record UNKNOWN honestly; ship backoff cap regardless |
| Dependency | Phase 002 (shared active-row predicate) | Population definitions could drift if 002 redefines them | Publish the definitions note here; 002 implements against it |
| Risk | Freshness-cache write masks a genuinely stale dist (build succeeded but emitted nothing) | Med — CLI would trust a wrong cache | Cache written only after verified successful finalize step, keyed by source-content hash; regression test includes a real-stale case that must still refuse |
| Risk | Exit-code change breaks callers that branch on 75 (CLAUDE.md documents 75 = retryable) | Med — hook/CLI consumers misroute | Conservative default keeps stale-dist INSIDE 75 (documented non-retryable sub-case); consumer inventory (`rg -n "75" .opencode/bin .claude .opencode/skills/system-spec-kit/mcp_server/hooks`) precedes any move to a distinct code; update docs in the same change |
| Risk | Concurrent sessions writing the shared gitignored dist/ while finalize writes caches | Low — cache could hash another session's in-flight sources | Same failure class as the documented no-auto-rebuild rationale; cache is advisory-fresh only, mtime path remains authoritative fallback |
| Risk | Working-tree state of `spec-memory.cjs` differs at execution time from planning-time observation (clean at 2026-07-03T09:5xZ) | Low | REQ-003 verify-first task re-checks `git status` before acting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Freshness gate overhead stays negligible on the CLI hot path — hash-cache short-circuit avoids the full mtime walk when the cache matches (cache is written at build time, never at call time)
- **NFR-P02**: Health handler changes add no table scans beyond the existing sampled queries (mismatchedIds cap reduces payload, not increases work)

### Security
- **NFR-S01**: Fallback skip-reason strings are sanitized before emission to the startup surface (no raw env values or user content interpolated)
- **NFR-S02**: Socket directory permissions (0o700) and the Darwin sun_path guard in the shim are preserved by any spawn changes

### Reliability
- **NFR-R01**: A genuinely stale dist (source content differs from what built it) MUST still refuse after the cache-bootstrap change — hard invariant, tested adversarially
- **NFR-R02**: Launcher restart backoff is capped so a crash-looping daemon cannot spin unbounded restarts
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Missing/empty cache file**: checker falls through to the mtime comparison unchanged (current behavior preserved)
- **Corrupted cache content**: treated as absent, never as fresh
- **Per-entry isolation**: a cache written for `spec-memory-cli` never vouches for `validation-orchestrator` or the default entry

### Error Scenarios
- **Failed build**: finalize-dist writes NO caches (cache only after verified successful finalize)
- **Dist entry missing**: 'missing' verdict and refusal unchanged by the bootstrap fix
- **Runtime not initialized**: health last-scan timestamp still readable (REQ-006); health returns labeled partial data instead of throwing

### State Transitions
- **Partial build (some entries emitted)**: only successfully finalized entries receive caches
- **`SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`**: bypass behavior unchanged and still visible in the startup surface when it masks a stale dist
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~10 files across shim, checker, finalizer, hooks, handlers, feature-catalog docs, tests |
| Risk | 12/25 | Gate-behavior change on the CLI hot path; zero schema or data migrations |
| Research | 10/20 | Chain C fully live-reproduced; SIGBUS cause unknown (timeboxed diagnosis) |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Stale-dist exit taxonomy: the conservative default is to DOCUMENT stale-dist as a non-retryable sub-case *within* exit 75 (75 is a live retryable contract for hooks/doctor/README); a distinct non-retryable code is introduced ONLY if the T006 `rg -n "75"` consumer inventory proves a caller mis-retries stale-dist. (Decide in T006 after the inventory; Level 2 — record the decision inline in tasks.md, no decision-record.md.)
- Where does the "Off by default" stale comment cluster live? Planning-time grep of the freshness/fallback surfaces found no match (candidates found elsewhere are accurate today); T003 must locate the operator-reported cluster or record a not-found verdict with the grep receipts.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
