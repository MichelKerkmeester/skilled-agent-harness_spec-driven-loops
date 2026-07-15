---
title: "Feature Specification: Self-Healing Internals Hardening"
description: "Three lower-urgency real logic fixes inside the package-011 self-healing implementation: a synchronous drift-suspect write that can block the search hot path up to 10s once its gating flag ever goes live, a silent read-error swallow in the suspect-queue reader, and a permanently leakable startup marker file. (A fourth candidate finding, a degraded-but-returning FTS channel mislabeled as skipped, was investigated and refuted -- see Out of Scope.)"
trigger_phrases:
  - "self-healing internals hardening"
  - "drift-suspect write latency guard"
  - "processing marker sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/020-self-healing-internals-hardening"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/startup-checks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-014-self-healing-internals-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F8: decided pragma toggle (per-write busy_timeout, 25ms) restored in finally -- implemented at memory-search.ts:418"
      - "F12: decided merge-all -- every stale .processing-* file's entries are recovered, none dropped -- implemented in sweepStaleMemoryDriftProcessingMarkers"
---
# Feature Specification: Self-Healing Internals Hardening

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
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-07-09 |
| **Branch** | `014-self-healing-internals-hardening` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../019-mem0-ranking-tweaks/spec.md |
| **Successor** | ../021-summary-fusion-grounding/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: what this phase is and is not
This is a P2 hardening phase covering three findings (F8, F11, F12) surfaced by a three-angle
Fable-5 review (correctness/quality, architecture consistency, risk/blast-radius) of the package-011
automatic drift self-healing implementation (`004-memory-search-intelligence/011-automatic-drift-self-healing`,
already shipped and passing `validate.sh --strict`). The review's higher-severity findings (F1-F7) and the
marker-pipeline P0/P1 work are deliberately handled in separate sibling phases — this phase covers only
the three lower-urgency items that are genuine code changes but do not gate shipping anything today. A
fourth item from the same review round, F13, was originally scoped into this phase but was subsequently
tested and refuted, then independently reconfirmed refuted by a structural code-walk — it is recorded as a
verified non-issue in Out of Scope below rather than carried as a fix.

**Honest severity framing, not manufactured urgency:**
- F8 is the one item with a real forward dependency: it is not live risk *today* because its gating flag
  defaults off, but it is a hard prerequisite before that flag can ever be turned on. It gets a real fix,
  not a defer-and-monitor note, because the fix is small and the alternative is leaving a landmine for
  whoever graduates the flag later.
- F11 and F12 are genuinely low-urgency, self-healing-degrades-gracefully items — the finding text itself
  says F11 is "tolerable" and F12 only leaks a marker file, not data. Both still get concrete, narrowly
  scoped fixes (a log line for F11, a startup sweep for F12) because the fixes are cheap and the findings
  explicitly ask for them, not because the underlying risk is urgent.

### Problem Statement

**F8 — synchronous drift-suspect write can block the search hot path up to 10s ([MEDIUM], flag-gated OFF today).**
`memory-search.ts:418` calls `appendMemoryDriftSuspects(requireDb(), stats.suspectIds)` synchronously inside
the query-time existence-filter path, only when `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`
(`capability-flags.ts:225`, default OFF via `isQueryTimeExistenceFilterEnabled()`) excludes a missing-path
row from the top-k results. `appendMemoryDriftSuspects` (`memory-drift-healing.ts:104-130`) always issues a
synchronous `INSERT ... ON CONFLICT DO UPDATE` against the shared `config` table via `writeSuspects`
(`memory-drift-healing.ts:61-73`). The connection this INSERT runs against sets
`busy_timeout = 10000` (`vector-index-store.ts:2132`) — a concurrent writer (a reindex or a save holding a
lock on the same connection/database file) can therefore block this call, and with it the whole query
response, for up to 10 real seconds. The call is already wrapped in try/catch
(`memory-search.ts:417-421`) so a timeout degrades the response (search still returns, drift suspects just
don't get queued that time) rather than crashing — this is why the finding is MEDIUM, not HIGH, and why the
flag defaults off today. But the moment `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` is graduated to default-on in
any future phase, this becomes a live 10-second worst-case tail latency on the primary search path.

**F11 — silent read-error swallow in the drift-suspect queue reader ([LOW]).**
`readMemoryDriftSuspects` (`memory-drift-healing.ts:76-99`) wraps its entire read-and-parse body in a
try/catch whose `catch` block (`:98`) unconditionally returns `[]` with no logging of any kind. A transient
read failure — a concurrent writer mid-`writeSuspects` call, a corrupted `config` row, a locked database —
silently produces an empty queue. Combined with `appendMemoryDriftSuspects`'s read-modify-write pattern
(`memory-drift-healing.ts:110`, which itself calls `readMemoryDriftSuspects` to seed its merge), a transient
read failure at the wrong moment can silently drop already-queued suspect ids when the next append
overwrites the queue with only the new entries. The finding's own framing is that this is tolerable — a
dropped suspect entry just means that one file takes longer to get cleaned up by the Layer 3 backstop
sweep, not permanent data loss — but the total silence makes it undiagnosable when it does happen.

**F12 — a killed-mid-scan boot can leak the `.processing-*` marker file forever ([LOW]).**
`consumeMemoryDriftDirtyMarker` (`startup-checks.ts:243-311`) claims the git-hook dirty marker
(`.memory-drift-dirty-paths.json`) by renaming it to a per-boot `.processing-<pid>-<timestamp>` file
(`startup-checks.ts:251-253`) before consuming it. The claimed file is only ever restored back to the
canonical marker name inside the function's own `catch` block (`:301-310`, specifically the
`fs.renameSync(processingPath, markerPath)` at `:305`), which only runs on a **caught throw from within
this function's own try block** (`:292-300`, covering `runScopedScan`, `refreshMovedSpecFolder`, and the
final `unlinkSync`). If the MCP server process is killed externally — for example by the MCP client's own
init-timeout watchdog — while boot is inside this function but *before* it throws a catchable error, the
`.processing-<pid>-<timestamp>` file is orphaned: nothing at any future boot ever looks for it, restores it,
or re-consumes it. The dirty-marker entries it carried are permanently lost (no data corruption — the
underlying spec-folder files and DB rows are untouched — but the drift they described never gets
auto-healed by Layer 2 again; only a manual or Layer-3 full sweep would eventually catch it independently).
This function is invoked from the real boot sequence at `context-server.ts:2229`, immediately after
`checkJournalMode(database)` at `:2226`.

### Purpose
Land three narrow, independently shippable code fixes inside the already-shipped package-011 self-healing
machinery: bound F8's worst-case added query latency well below the connection's 10s busy_timeout so it is
safe before the flag it gates is ever graduated; make F11's silent failure observable via a log line with no
behavior change; and make F12's marker-claim recoverable across a killed boot via a startup sweep.
None of these fixes touch package-011's public behavior, its feature-flag defaults, or any other 028 phase's
scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**F8 fix — bound the suspect-write's worst-case latency.** Reduce the added worst-case query latency from
the connection's full `busy_timeout = 10000` (`vector-index-store.ts:2132`) down to a short, documented
bound (target: under 100ms under a held write lock) specifically for the drift-suspect INSERT triggered from
`memory-search.ts:418`. The existing try/catch (`:417-421`) already treats this write as best-effort and
degrades silently on failure — this fix does not change that contract, it only shortens how long a lock
collision is allowed to block the calling query before the write gives up.

**F11 fix — log the swallowed read error.** `readMemoryDriftSuspects`'s catch block
(`memory-drift-healing.ts:98`) gets a `console.warn`-level log line naming the failure before returning
`[]`. The fallback behavior itself (empty queue on any read/parse failure) is unchanged — this is
observability only, not a correctness change.

**F12 fix — startup sweep for stale `.processing-*` markers.** Add a check to the boot sequence (alongside
or inside `consumeMemoryDriftDirtyMarker`'s call site in `context-server.ts:2229`) that, before or after the
normal marker consumption, globs the memory DB directory for any leftover
`.memory-drift-dirty-paths.json.processing-*` files from a prior boot's PID and restores/re-consumes their
entries instead of leaving them orphaned forever.

### Out of Scope
- F1-F7, F9, F10, F14, F15, F16 from the same review digest — each belongs to a different, separately
  planned sibling phase under `004-memory-search-intelligence`, or (F16) is already fixed.
- Graduating `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` to default-on. This phase makes that graduation safer
  (F8) but does not itself flip the flag — that is a separate future decision with its own benchmark
  requirement (per package-011's own spec.md REQ-008/Open Questions).
- Any change to the orphan-sweep loop, `ORPHAN_SWEEP_MAX_PAGES`, or the marker-refresh cadence covered by
  finding F1 (sibling phase's scope).
- Any change to the scoped-scan discovery-gate bypass covered by finding F2 (sibling phase's scope).
- Any change to the git-hook lock directory or marker path resolution covered by findings F3/F4 (sibling
  phase's scope).
- Rewriting the `config`-table suspect-queue schema or storage mechanism — F11's fix is a log line, not a
  redesign.
- Any new filesystem watcher, timer, or daemon responsibility — F12's fix is a bounded, one-shot startup
  sweep reusing the existing boot-sequence pattern, not a new always-on process.
- **F13 — verified non-issue, not carried forward.** The original finding claimed a degraded-but-returning
  FTS channel could be mislabeled `'skipped'` in `routing.skippedChannels`. It was tested and refuted, then
  a follow-up adversarial review confirmed the refutation via an independent structural code-walk of
  `fts5Bm25Search` (`sqlite-fts.ts`): every code path that returns non-empty rows sets the lexical-capability
  snapshot to `'ok'` immediately beforehand (a non-`ok` probe returns `[]` before querying; any query throw
  sets a non-`ok` snapshot and returns `[]`; only the final success path sets `'ok'` then returns rows).
  Since `attachChannelExceptionsToRouting` (`hybrid-search.ts:667-668`) reads that same snapshot
  synchronously right after, a channel that actually returned results can never be mislabeled `'skipped'`
  via this path — the scenario is structurally impossible in this codebase, not merely unreproduced in one
  test. Recorded here so a future reviewer does not re-raise it without checking this history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | F8: bound the suspect-write's worst-case latency at the `appendMemoryDriftSuspects` call site (`:418`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts` | Modify | F8: expose the short-timeout write path if the mechanism lives here; F11: add the warning log in `readMemoryDriftSuspects`'s catch (`:98`) |
| `.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts` | Modify | F12: add the stale-`.processing-*` sweep, following the existing boot-check pattern |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | F12: wire the sweep into the boot sequence alongside the existing `consumeMemoryDriftDirtyMarker` call (`:2229`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F8: under a held write lock, the drift-suspect write triggered from the query-time existence-filter path (`memory-search.ts:418`) SHALL fail or defer in under 100ms and SHALL NOT delay the actual search response returned to the caller; it SHALL remain non-fatal (existing try/catch contract preserved) on the fast-fail path. This is a hard prerequisite before `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` (`capability-flags.ts:225`) is ever defaulted on. | Reuse the two-process lock-contention test that already proved the ~10,293ms worst-case block under a held write lock (matching the connection's 10,000ms `busy_timeout` almost exactly): with the write lock held by a second process, the suspect-write path must fail or defer in under 100ms, the search response returned to the caller must not be delayed by the contended write, and no unhandled rejection or crash occurs. A test with no lock contention: the write still succeeds and the suspect queue reflects the new ids, unchanged from today's behavior. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | F12: a `.memory-drift-dirty-paths.json.processing-*` file left on disk by a boot that was killed externally (not via a caught throw) between the rename-claim and completion SHALL be detected and recovered at a subsequent boot, instead of remaining orphaned forever. | Boot-sweep acceptance test is the exact confirmed repro: start a boot, externally SIGKILL the process after `consumeMemoryDriftDirtyMarker`'s rename-claim (`startup-checks.ts:251-253`) has produced the `.processing-<pid>-<timestamp>` file but before the function completes, then start a fresh boot. The new sweep must detect the orphaned `.processing-*` file, restore/re-consume its entries (verified by the marked paths ending up scanned), and the stale file must no longer be present after boot. A boot with no stale processing file present is unaffected: no new log lines beyond a normal no-op, no behavior change. |
| REQ-003 | F11: `readMemoryDriftSuspects` (`memory-drift-healing.ts:76-99`) SHALL log a warning identifying the failure when its read/parse fails, before falling back to `[]`. | A forced read failure (malformed JSON in the `config` row, or a thrown DB error) produces exactly one `console.warn`-level log line naming the failure; the function's return value is still `[]`, unchanged from today's behavior. A successful read produces no new log output. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Under a held write lock, the drift-suspect write's worst-case added query latency is measured
  and documented as under 100ms, with the fast-fail path exercised under the confirmed two-process
  lock-contention test, and the actual search response returned to the caller is never delayed by the
  contended write. `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`'s existing default-off status is unchanged by this
  phase — this only removes the latency landmine for a future graduation decision.
  **MET** — `tests/memory-search-drift-suspect-write-timeout.vitest.ts`; fixed path measured ~15-30ms under a
  held lock vs. an unfixed baseline that blocks for the full held-lock window; flag default confirmed
  unchanged in `capability-flags.ts`.
- **SC-002**: A boot following a killed prior boot mid-marker-consumption no longer leaves a permanent stray
  `.processing-*` file; the marker's entries are recovered rather than silently lost. Verified against the
  exact confirmed repro: external SIGKILL after the `.processing-*` rename, before the function completes.
  **MET** — `tests/startup-checks-processing-marker-sigkill.vitest.ts`, a real spawned child process
  genuinely SIGKILLed after the real rename-claim; recovery confirmed deterministic across 3 repeated runs.
- **SC-003**: A drift-suspect-queue read failure now produces an observable log line instead of vanishing
  silently, with no change to the function's existing fallback return value.
  **MET** — `tests/memory-drift-healing.vitest.ts` "F11: logs exactly one warning..." and "F11: a successful
  read produces no new log output".
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | F8's fix touches the same hot query path the finding is about; a mistake in the fast-fail mechanism (e.g. leaving a lowered `busy_timeout` applied to unrelated later statements on the same connection) could regress unrelated queries. | Could degrade unrelated query latency if the timeout scope leaks | Scope the timeout change tightly around the single suspect-write statement, restore the connection's original `busy_timeout` immediately after (success or failure), and cover with a test asserting a subsequent unrelated query on the same connection still observes the original 10000ms setting |
| Risk | F12's sweep runs at boot and touches filesystem state (the memory DB directory); a bug here could itself leak or corrupt a marker. | Boot-time filesystem bug in new code | Follow the existing atomic temp-file-plus-rename precedent already used by the git-hook marker writer and by `consumeMemoryDriftDirtyMarker` itself; treat a missing/malformed stale file as a no-op per the existing `NFR-R01`-style "never block startup" precedent from package 011 |
| Dependency | None — all three fixes are independently shippable and do not require any other 028 phase to land first. | N/A | REQ-001 (F8) has a *forward* dependency direction: it must land before any future phase graduates `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` to default-on, not before this phase itself can ship |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: F8's fast-fail bound must be short enough to be unnoticeable in normal query latency (target:
  under 100ms under a held write lock, per REQ-001) while still giving the write a real chance to succeed
  under normal (non-contended) conditions.
- **NFR-P02**: F12's startup sweep must be bounded (a small, fixed glob over one directory) so it cannot add
  meaningful boot-time latency even with several stale files present.

### Security
- **NFR-S01**: F12's sweep only ever reads and renames files already inside the existing memory DB
  directory; it introduces no new write target and no new external input surface.

### Reliability
- **NFR-R01**: None of the three fixes may change existing default-off/default-on behavior for any capability
  flag; F8 in particular must not be read as, or bundled with, a decision to graduate
  `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`.
- **NFR-R02**: F11's and F12's fixes must preserve today's "never block or crash on missing/malformed marker
  or suspect data" contract exactly — both are additive (a log line, a recovery sweep), not a tightening of
  error handling into a hard failure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- F8: a suspect-write that would have succeeded well within the shortened timeout under normal load must
  still succeed — the fast-fail bound must not turn healthy writes into false failures.
- F12: more than one stale `.processing-*` file present at once (two killed prior boots in a row) — the open
  question in this spec's frontmatter (merge all vs. restore only the most recent) is resolved during
  implementation, not left undecided in shipped code.

### Error Scenarios
- F8: the shortened-timeout write itself throws a non-lock-related error (e.g. a malformed suspect id) — it
  must still be caught by the existing outer try/catch (`memory-search.ts:417-421`) exactly as today.
- F12: the stale `.processing-*` file itself is malformed or unreadable — treated as unrecoverable and
  logged, not a boot failure, matching package 011's existing `NFR-R01` precedent for the primary marker.
- F11: the log line itself must not throw (e.g. on a circular-reference error object) — use the same
  `toErrorMessage`-style safe stringification already used elsewhere in `memory-search.ts` (`:420`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three small, independent, additive edits across four files (~60-100 LOC total); no schema change, no new abstraction |
| Risk | 13/25 | F8 sits on the search hot path (Level 2 driver), but it is a narrow, well-isolated change with existing test scaffolding (package 011's own vitest suites) to extend rather than build from scratch |
| Research | 6/20 | Every cited mechanism confirmed against the live tree at spec time via direct file:line reads; no open architectural question, only two small implementation-time decisions (see Open Questions) |
| **Total** | **29/70** | **Level 2** (kept at Level 2 rather than Level 1 because F8 is a hot-path change, consistent with this packet's own scope-summary framing) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

Both implementation-time decisions from planning were resolved during implementation (see plan.md and
implementation-summary.md Key Decisions):

- F8: resolved to a per-write `busy_timeout` pragma toggle (25ms), restored unconditionally in a `finally`.
- F12: resolved to merge-all -- every stale `.processing-*` file found at boot is recovered and merged into
  the canonical marker, none silently dropped.
<!-- /ANCHOR:questions -->
