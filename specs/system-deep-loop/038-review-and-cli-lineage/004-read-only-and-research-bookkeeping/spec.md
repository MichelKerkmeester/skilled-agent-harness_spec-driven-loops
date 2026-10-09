---
title: "Feature Specification: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping"
description: "The deep-loop graph scripts create and write database state on every status, query and convergence call, so the doctor deep-loop target cannot promise a read-only run; and a deep-research run left a ledger without its opening event, refused bookkeeping rows, an empty coverage graph, unticked key questions and an empty resource map. This packet plans a read-only mode for the three scripts and the repair of the research run's bookkeeping."
trigger_phrases:
  - "deep-loop read-only mode"
  - "deep-research bookkeeping"
  - "coverage graph empty"
  - "lock nonce release"
  - "research key questions unticked"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/041-read-only-and-research-bookkeeping` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop graph scripts are not read-only, so no caller can promise they leave the machine unchanged. `getDb()` in `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:378` lazy-initializes through `initDb()`, which creates the database directory (`:322`), opens or creates the database file (`:324`), enables WAL (`:325`), applies the schema (`:352`), and inserts or bumps `schema_version` (`:355-360`). The council getter does the same at `lib/council/council-graph-db.ts:256-285` and `:292`. Coverage query functions call `getDb()` throughout `coverage-graph-db.ts:539-947`. `scripts/status.cjs:124-128` imports the database module and reads nodes, edges and snapshots before it appends a `status_reported` observability event (`:93-107`, `:195`); `scripts/convergence.cjs:684-708` does the same and appends `convergence_evaluated` (`:275-289`, `:699`, `:734`), with snapshot persistence as an option (`:690-697`); `scripts/query.cjs:111-118` initializes the database without appending an event. The observability writer itself creates its directory and appends (`lib/deep-loop/observability-events.cjs:164-171`). A search for `readOnly`, `read-only`, `dryRun` and `dry-run` across the three scripts and both graph libraries returns no matches, so there is no mode that skips any of this. `/doctor:speckit deep-loop` therefore cannot promise it leaves no state behind: its route invokes the three scripts with no read-only flag (`.skilled/commands/doctor/_routes.yaml:57-59`), and its own contract states that the called scripts may create a missing database and append observability events (`.skilled/commands/doctor/assets/doctor-deep-loop.yaml:5, :29, :53, :100-101`). The audit recorded this as a finding rather than fixing it, because its directive kept changes to the inspected subsystem out of the audit phase (`specs/system-speckit/048-doctor-command-audit/004-deep-loop/implementation-summary.md`, Known Limitations 1 and 2).

Separately, the `/deep:research` run inside the doctor audit exposed bookkeeping defects that make the run's own records untrustworthy. The run needed the append gateway to open its ledger even though its init step writes the state log directly (`.skilled/commands/deep/assets/deep-research-auto.yaml:368-372`); the ledger's first event is `deep-research.ledger.run-initialized` (frame 1 of `specs/system-speckit/048-doctor-command-audit/003-update/research/deep-research-ledger/`), while the upcaster that produces it (`legacy-compatibility.ts:165`) is never invoked by that step. The marker guard matches the canonical prompt-pack header on every iteration (`deep-research-auto.yaml:1061-1075` against the first line of `deep-research/assets/prompt-pack-iteration.md.tmpl`). Lock release passes no nonce (`deep-research-auto.yaml:275-281, :2225`) although a fresh lock is always nonce-bearing (`lib/deep-loop/loop-lock.ts:159`) and a nonce-less release is refused (`:731-742`). The workflow emits bookkeeping rows that the research gateway pins and refuses with exit 1 (`legacy-compatibility.ts:46-94`; observed for `config_warning` and `min_iterations_guard_pass`). The graph upsert reads graph events from the state log (`deep-research-auto.yaml:1792-1805`) while the projection rebuilds iteration rows without a `graphEvents` field (`lib/legacy-projections/deep-research-contract.ts:214-224`), and the coverage database holds zero nodes and zero edges. The reducer resolves a key question only from an iteration record's `answeredQuestions` or an exact `focus` match (`deep-research/scripts/reduce-state.cjs:2317-2350`), and the canonical record the prompt pack requires carries neither field, so the strategy's five boxes stay unticked and the report counts 0 of 5 answered. The resource-map extractor reads `path`, `source_path`, `source_paths`, `citations` and `sources` fields (`runtime/cli/resource-map/extract-from-evidence.cjs:315-324`) that the delta records never carry, so the map lists 0 references. Finally, the staging step runs `git add {state_paths.packet_dir}` (`deep-research-auto.yaml:2183-2187`), which staged 93 paths including the transient `.deep-research.lock` and lock-coordinator state (`003-update/implementation-summary.md`, Known Limitations item 4).

The two halves share one owner: the same runtime and the same research workflow. Fixing the read-only gap removes the audit's standing finding; fixing the bookkeeping removes the conditions that made a research run's evidence trail incomplete.

### Finding status

The doctor audit confirmed three research findings directly and left five as the research agent's report. Every finding below was re-checked against the current tree for this plan; the current-code verdict is what the build starts from, and each unconfirmed finding gets a reproduce-first task in `tasks.md`.

| Finding | Source | Orchestrator-confirmed | Current-code verdict |
|---------|--------|------------------------|----------------------|
| A - no read-only path on the three graph scripts | `048-doctor-command-audit/004-deep-loop/implementation-summary.md` Known Limitations 1-2 | Yes | Holds: `initDb` creates directory, file and schema (`coverage-graph-db.ts:318-360`, `council-graph-db.ts:256-285`); no read-only flag exists in the scripts or libraries |
| B1 - `step_create_state_log` needed the gateway | `003-update/implementation-summary.md` Known Limitations 4 | No | Holds: the step still writes the state log directly (`deep-research-auto.yaml:368-372`, `deep-research-confirm.yaml:392-396`) while the run's ledger opened through a gateway-written `run-initialized` event; the census marks that stem reserved (`deep-research-ledger-types.ts:489`) |
| B2 - marker scan false positive on the canonical header | Known Limitations 4 | No | Holds as written: the algorithm matches `^(DEEP-REVIEW\|DEEP-RESEARCH\|CODE-REVIEW)$` on the previous prompt's first line, and every rendered prompt starts with `DEEP-RESEARCH` (prompt pack line 1; `003-update/research/prompts/iteration-1.md:1`) |
| B3 - lock release needs `--nonce` | Known Limitations 4 | No | Holds: acquire always stamps an `acquireNonce` (`loop-lock.ts:159`), a nonce-less release returns `released: false` and leaves the file (observed; test case `loop-lock-cli.vitest.ts:128-141`), and the workflow's release commands pass only `--owner-pid` |
| B4 - bookkeeping events refused with exit 1 | Known Limitations 4 | No | Holds: `config_warning` and `min_iterations_guard_pass` exit 1 with `legacy-event-has-no-lossless-mode-event` (observed), and both are emitted by the workflow (`deep-research-auto.yaml:667, :670, :673, :765`) |
| B5 - coverage-graph upsert skipped | Known Limitations 4 | No | Holds: the upsert reads `graphEvents` from the state log, whose iteration rows are the projection's thin rebuild without that field; the database holds 0 nodes and 0 edges |
| B6 - key-question boxes never ticked, report says 0 of 5 | `003-update/implementation-summary.md` Known Limitations 4; `research/research.md` section 16 | Yes | Holds: five `- [ ]` boxes in `003-update/research/deep-research-strategy.md:27-33`; registry `openQuestions` 5, `resolvedQuestions` 0; the resolver needs `answeredQuestions` or an exact focus match the records do not provide |
| B7 - resource map lists 0 references | `research/research.md` section 15 | Yes | Holds: `003-update/research/resource-map.md` reports `Total references: 0`; no delta file carries a `path` field; the extractor reads only those fields |
| B8 - staging pulled in transient run state | Known Limitations 4 | Yes | Holds: `git add {state_paths.packet_dir}` stages the whole artifact directory (`deep-research-auto.yaml:2183-2187`, `deep-research-confirm.yaml:1602-1606`); `.gitignore` has no deep-research rules; 33 `.deep-research.lock` files are tracked repo-wide while 26 locks-and-fencing-v1 files are tracked deliberately in other packets |

### Purpose

Give the three deep-loop graph scripts a read-only mode that leaves the filesystem untouched, and make one deep-research run's bookkeeping - run open, lock release, graph persistence, question resolution, resource map and staging - record what actually happened.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A read-only mode for `status.cjs`, `query.cjs` and `convergence.cjs`: no directory or database creation, no schema application or version bump, no observability append, no snapshot persistence, and an empty result when the database is absent.
- Non-creating read-only open paths in the coverage-graph and council-graph database libraries.
- The `/doctor:speckit deep-loop` consumer: route invocations pass the read-only flag and the workflow contract stops describing database creation and observability writes.
- The deep-research run-open step routes the config row through the append gateway in both the auto and confirm workflows, and the stem census marks the run-initialized stem as spoken.
- Question resolution: the canonical iteration record carries the key questions each iteration answered, so the strategy's boxes and the convergence question count reflect the run.
- Coverage-graph persistence: the graph events a run already emits are upserted, so a completed run leaves a non-empty graph.
- Lock release carries the acquisition nonce in every workflow release path.
- The emitted resource map lists the files the run consulted.
- Staging excludes transient run state while keeping the durable evidence trail, and the tracked-versus-staged decision for lock-coordinator state is written down.
- The bookkeeping rows the gateway refuses are resolved: each row either has a lossless canonical home or is not emitted through the gateway, and no step halts on an exit-1 refusal it cannot act on.
- The marker guard stops matching the canonical prompt-pack header.

### Out of Scope

- A read-only mode for `upsert.cjs` or any other graph writer. The three read scripts are the diagnosis surface; a read-only upsert has no meaning.
- Untracking or rewriting the 33 stale `.deep-research.lock` files already in history. This packet stops the workflow from adding more; cleaning history is a separate decision with its own blast radius.
- The audit's other doctor targets and packets. Packet `specs/system-speckit/048-doctor-command-audit` stays as it closed.
- Reworking the ledger schema. If question carry-through can be done inside the reducer from the delta records the run already writes, no stem changes are needed; a schema change would need its own decision record.
- Runs that completed before this change. Their artifacts and counts are evidence, not targets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts` | Modify | Add a non-creating read-only open that never creates the directory, file, schema or version row; honor an override directory so read-only behavior is testable |
| `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts` | Modify | Same non-creating read-only open for the council graph |
| `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs` | Modify | Accept a read-only flag; skip initialization and the observability append; return an empty result when the database is absent |
| `.skilled/skills/system-deep-loop/runtime/scripts/query.cjs` | Modify | Accept a read-only flag; skip initialization; empty result when absent |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Accept a read-only flag; skip initialization, the observability append and snapshot persistence |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Pass the read-only flag on every deep-loop status, query and convergence invocation |
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` | Modify | Call the three scripts read-only and restate the write boundary without database creation or observability appends |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Open the run through the gateway; fix lock release, marker scan, graph upsert source, staging exclusions; align bookkeeping emission |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Mirror every auto-workflow fix that applies to the confirm variant |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | Require `answeredQuestions` and path-bearing source fields in the canonical iteration record |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Merge the delta iteration record's evidence fields into the records question resolution reads; keep the state log authoritative for status and ratio |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Flip the run-initialized census row to spoken with the workflow as producer if the run-open fix speaks it |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/graph-read-only.vitest.ts` | Create | Prove no filesystem writes on the read-only path for all three scripts |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-run-open.vitest.ts` | Create | Run the shipped init step from both workflows and assert the ledger's first event |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts` | Create | Prove a delta's graph events reach the coverage database |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-marker-scan.vitest.ts` | Create | Prove the guard ignores the canonical prompt header |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts` | Create | Prove every workflow release carries the nonce |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-bookkeeping-emission.vitest.ts` | Create | Prove every gateway-routed bookkeeping event is accepted or not emitted |
| `.gitignore` | Modify | Ignore transient deep-research run state: lock, pause and run-now sentinels, projection watermarks |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `status.cjs`, `query.cjs` and `convergence.cjs` accept a read-only mode, and in that mode they never create the database directory or file, never apply schema or bump the schema version, never append an observability event, and never persist a convergence snapshot. A missing database yields an empty result rather than a creation. |
| REQ-002 | `/doctor:speckit deep-loop` passes the read-only mode on every status, query and convergence call, and its route and workflow contract no longer state that the calls may create a database or append observability events. |
| REQ-003 | Both deep-research workflows open a run by recording the initial config row through the append gateway, so the ledger's first event is the run-initialized event and the stem census lists it as spoken. |
| REQ-004 | The canonical iteration record carries the key questions the iteration answered, and the strategy's key-question boxes plus the convergence question count reflect those answers instead of counting zero. |
| REQ-005 | The graph events a run already emits in its iteration delta are persisted to the coverage graph, so a completed run leaves a graph with nodes and edges. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every workflow lock release passes the acquisition nonce, and a completed run leaves no lock file behind. |
| REQ-007 | The emitted resource map lists the files the run consulted, with the evidence fields the extractor already supports. |
| REQ-008 | The staging step never stages transient run state - lock, pause and run-now sentinels, projection watermarks - while durable evidence stays staged, and the tracked-versus-staged decision for lock-coordinator state is recorded. |
| REQ-009 | Every bookkeeping record the workflow emits through the gateway is either accepted (exit 0) or deliberately not emitted; no step halts on an exit-1 refusal it cannot act on. |
| REQ-010 | The marker guard ignores the canonical prompt-pack header and fires only on a genuine nested-dispatch marker. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A read-only status, query or convergence call against an absent database returns an empty result and leaves the filesystem unchanged.
- **SC-002**: A research run's ledger opens with the run-initialized event, its coverage graph is non-empty, its answered-question count matches its records, its resource map lists cited files, and its lock is released.
- **SC-003**: The deep-loop runtime suite shows no new failures against the baseline recorded before the first change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The append gateway and ledger schema in `runtime/lib` | A run-open fix that speaks a reserved stem changes the stem census | Follow the deep-review run-open precedent (packet 039) and keep the change to the same shape |
| Dependency | The doctor route validator | A route edit that changes invocation shape can fail validation | Re-run the route validator and the command-catalog mirror check after the edit |
| Risk | An unconfirmed finding may not reproduce | Work spent on a defect that no longer exists | Each unconfirmed finding gets a reproduce-first task; if it does not hold, record the observation and plan no fix |
| Risk | Merging delta records into reducer question resolution could let a stale delta override the state log | Wrong question counts | State the precedence rule in the plan: the state log wins for status, iteration number and ratio; the delta supplies only absent evidence fields |
| Risk | The coverage database directory override is new surface | Tests or the doctor route could point at the wrong database | Default behavior stays unchanged when the override is unset; the override is documented at the constant |
| Risk | The runtime mirrors under `.opencode` and the other trees drift | Edited runtime files ship stale mirrors | Run the runtime-mirror sync check at verification and write the mirrors |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A read-only status call against an absent database returns in under 500 ms and performs no filesystem write.
- **NFR-P02**: The additional reducer work to merge delta evidence adds no more than one pass over the delta directory per reduce step.

### Security
- **NFR-S01**: Read-only mode is decided by the caller's flag, never by an environment variable that a run could inherit accidentally.
- **NFR-S02**: The read-only path never opens a database file for writing, including the WAL and shared-memory side files.

### Reliability
- **NFR-R01**: A read-only call against a database whose schema is older than the code's schema reports the situation without migrating it.
- **NFR-R02**: Every workflow fix keeps the artifact trail readable by the existing reducer; no already-written artifact shape changes meaning.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an absent coverage or council database file is a valid read-only input and yields an empty result.
- Maximum length: a delta directory with no graph events produces no upsert call and no error.
- Invalid format: a malformed delta row is skipped with a warning, unchanged from today's extractor behavior.

### Error Scenarios
- External service failure: not applicable; the read path uses no network call.
- Network timeout: not applicable.
- Concurrent access: a read-only call takes no write lock and must not block or be blocked by a writer.

### State Transitions
- Partial completion: a run interrupted before the upsert leaves the previous graph contents intact; the next reduce step upserts the missing iteration.
- Session expiry: a lock left behind by a dead owner is reclaimed by the next acquire, and its missing nonce is the defect REQ-006 fixes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two workflows, three scripts, two database libraries, the reducer, the prompt pack, the doctor route, the ignore rules and six test files |
| Risk | 14/25 | No auth or deploy surface; behavior changes land in shared runtime code and one workflow's state contract |
| Research | 12/20 | Five findings need reproduction before their fixes are committed to |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Each unconfirmed finding carries a reproduce-first task, and a finding that does not reproduce is recorded with its observation instead of being fixed.

<!-- /ANCHOR:questions -->

---
