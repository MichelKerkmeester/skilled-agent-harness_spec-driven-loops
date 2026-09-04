---
title: "Goal: Spec-Kit Residue"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-03T23:30:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Closed the last three criteria on a completed suite run and a measured reference split"
    next_safe_action: "Close the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-007-spec-kit-residue"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Spec-Kit Residue

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide each contract question against packet 049 first, then implement the decisions that survive and record the rest as superseded.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Re-read every ADR against `specs/system-speckit/049-memory-decommission` before touching code. That packet deletes `.opencode/skills/system-spec-kit/mcp-server/` outright, 1,480 files and 453,813 lines |
| D2 | Every ADR ends the phase either done or closed as superseded, with the reason written into `decision-record.md` |
| D3 | ADR-005 and ADR-008 proceed regardless of 049, and neither touches the deleted tree |
| D4 | ADR-001 leaves the two BM25 default assertions red |
| D5 | ADR-002 keeps the filter, moves the six tests, and fixes their titles in the same edit |
| D6 | ADR-003 restores `enforceSearchTokenBudget` and its call site |
| D7 | ADR-004 makes the fixture current by adding the five scope columns |
| D8 | ADR-005 repoints three coverage-graph tests and deletes the fourth |
| D9 | ADR-008 follows the recorded decision: `main()` takes an injectable project root, and the fixture is a throwaway packet under a temp workspace, so no test writes into the repository |
| D10 | ADR-007 and the daemon recycle are undecided, and are likely superseded by 049 |
| D11 | The three open criteria get the same test as the ADRs: measure what survives 049, record what does not. ADR-009 holds the ruling |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] Every ADR in `decision-record.md` carries an implementation commit or a superseded note naming 049
- [x] ADR-005 and ADR-008 are implemented. ADR-008's seven tests pass, and ADR-005 restored 47 of 49 assertions with the two failures named as drift rather than silenced. Those two are now ruled and green: `Tests 60 passed (60)`, exit 0
- [x] The suite completes without a bound killing the run. `npm run test:sharded`, 12 of 12 shards, 34m00s, no shard exited 124
- [x] The missing references are gone or explained. The count is 48 rather than 25: 27 in surviving trees fixed, 21 inside 049's delete recorded. No typecheck lane covers a surviving test file, and A4 now carries the numbers that say why turning one on is its own change
- [x] The ADR-008 suite leaves `git status` clean. The whole-suite run does not: it rewrote 20 generated metadata files under `specs/`, which were restored
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### The 049 mapping

Every path below was checked on disk on 2026-09-02. Packet 049 phase
`003-spec-memory-server-removal` lists `.opencode/skills/system-spec-kit/mcp-server/`
as Delete, 1,480 tracked files and 453,813 lines. Anything under that prefix goes
with it.

| ADR | Subject paths | Inside 049 deletion scope |
|-----|---------------|---------------------------|
| ADR-001 | `mcp-server/lib/search/bm25-index.ts`, `mcp-server/lib/search/hybrid-search.ts`, `mcp-server/tests/search-extended.vitest.ts`, `mcp-server/tests/bm25-index.vitest.ts` | Yes, all four. Leaving the tests red already agrees with this |
| ADR-002 | `mcp-server/lib/search/channel-representation.ts`, `mcp-server/tests/channel-representation.vitest.ts`, `mcp-server/tests/channel-enforcement.vitest.ts` | Yes, all three |
| ADR-003 | `mcp-server/handlers/memory-search.ts`, `mcp-server/tests/memory-search-token-budget.vitest.ts` | Yes, both |
| ADR-004 | `mcp-server/lib/storage/incremental-index.ts`, `mcp-server/tests/incremental-index-move-reconcile.vitest.ts` | Yes, both |
| ADR-005 | `scripts/tests/coverage-graph-integration.vitest.ts`, `scripts/tests/coverage-graph-cross-layer.vitest.ts`, `scripts/tests/graph-convergence-parity.vitest.ts`, `scripts/tests/session-isolation.vitest.ts`, repoint target `.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/` | No. None sits under `mcp-server/`, and 049 names `system-deep-loop` as untouched |
| ADR-006 | `mcp-server/lib/enrichment/retry-budget.ts` | Yes, but already shipped in `59a597e37d` |
| ADR-007 | `.opencode/skills/system-spec-kit/shared/paths.ts`, plus `mcp-server/tests/memory-roadmap-flags.vitest.ts` and `mcp-server/tests/db-lifecycle-paths.vitest.ts` | Split. The five failing tests are inside and go away. `shared/paths.ts` survives the delete, but `resolveDatabaseDir` resolves the memory database directory that 049 removes, so its subject goes even where its file does not |
| ADR-008 | `scripts/memory/generate-context.ts`, `scripts/tests/generate-context-cli-authority.vitest.ts` | No. 049 phase 001 creates under `scripts/memory/` rather than deleting it. 049 phase 002 does ask what replaces the save-path metadata refresh, so the entry point has an open question but no delete order |
| Daemon recycle | `.opencode/bin/system-spec-memory-launcher.cjs`, the OpenCode plugin and the hook concern | Yes. 049 phase 003 deletes the launcher, the plugin and `.opencode/hooks/spec-memory/` |

Read this as a starting hypothesis, not a verdict. Re-check each path against 049
before you act on it, because 049 is itself still Pending and its scope can move.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Save-path infinite loop | Done | `59a597e37d` fixed the loop that stopped the suite completing |
| Three findings fixed in session | Done | Register 35, 36 and 37 read Fixed |
| Eight ADRs recorded | Done | `007-spec-kit-residue/decision-record.md`, with a resolution on every entry |
| ADR-001 to ADR-004 | Superseded | Every subject path confirmed on disk under `mcp-server/`, which 049 phase 003 lists as Delete |
| ADR-005 | Done | Three imports repointed, `session-isolation.vitest.ts` deleted. 4 erroring files became 47 passing assertions |
| ADR-008 | Done | `main()` takes a defaulted project root. 7 failed / 4 passed became 11 passed, exit 0 |
| ADR-007 | Superseded (split) | Its five tests are inside the delete. `shared/paths.ts` survives but `resolveDatabaseDir` resolves the database 049 removes |
| Daemon recycle | Superseded | 049 phase 003 deletes the launcher, the plugin and `.opencode/hooks/spec-memory/` |
| AC-001, the suite completes | Done | `npm run test:sharded`, 12 of 12 shards, 34m00s wall over 2,040s of shard time, 989 modules, no shard exited 124 |
| AC-002, the residue grouped | Done, split | 31 surviving failures in 15 named mechanisms, and 150 plus 3 load failures inside the delete counted and attributed, 28 of them already ruled by name |
| AC-003, the missing references | Done, split | 27 fixed in `scripts/tests/`, 21 recorded under `mcp-server/`, 0 in the deep-loop runtime tests |

### Deviations and findings

| Item | Note |
|------|------|
| Four decided ADRs may cost more than they return | Confirmed and acted on: ADR-001 through ADR-004 all edit files 049 deletes, and each is now closed as superseded with its decision text preserved |
| The ADR-005 repoint surfaced two real drifts | An empty graph now scores `claimVerificationRate` 1 rather than 0, and a review coverage gap is now a FILE with no *incoming* COVERS rather than no outgoing one. Both producers are in `system-deep-loop` runtime, outside scope. Recorded as adjacent findings A1 and A2, left red |
| A1 and A2 ruled, 2026-09-03 | Operator ruling: the tests follow the producer, and no runtime code is touched. Both producers document the behaviour the tests contradicted, `coverage-graph-signals.ts:~599` in its own doc comment and `coverage-graph-query.ts:286` in the runtime's own `tests/unit/coverage-graph-query.vitest.ts:182`. Red was reproduced first (`Tests 2 failed \| 47 passed (49)`, exit 1), then green (`Test Files 4 passed (4)`, `Tests 60 passed (60)`, exit 0). Deep-loop runtime coverage-graph suite unchanged at `Tests 42 passed (42)`, exit 0. `npm run typecheck` exit 0, though its `tsconfig.json` excludes `tests/**/*.vitest.ts`, so it never saw the edited file |
| A3 fixed in the same pass | The parity comment at `scripts/lib/coverage-graph-convergence.cjs:2` named the deleted `mcp-server` path. Comment-only repair, in the file both repaired tests load as their parity subject. The six prose copies of the stale path are still recorded, not fixed |
| The typecheck lane never sees a test file | `scripts/tsconfig.json` excludes `tests/**/*.vitest.ts`, so the two edited test files were proven by running them, not by type-checking them. Adjacent finding A4 |
| The ADR-008 suite can flake under contention | The first test now does real filesystem work, so on a loaded machine it once exceeded the 30s bound during module import and its lingering `main()` left a lock that failed the next test. A rerun of the same four files finished in 8 seconds, 58 of 60 passing, with only the two known drift failures |
| The ADR-008 fixture needed track-level metadata | A track folder holding `NNN-` children is a phase parent, so the save path rewrites its pointers. The first temp workspace failed on ENOENT until it carried a `graph-metadata.json` like a real track folder does |
| Both inherited counts were low | The residue was carried as 115 failures and 25 references. A completed run says 181 and 48. Neither criterion was reworded, so the correction stays readable against the original claim |
| The machinery that runs the suite goes with 049, the corpus mostly does not | `test:sharded`, `typecheck:tests`, `vitest.config.ts` and `tsconfig.tests.json` all sit under `mcp-server/`. So do 693 of the 989 modules. The remaining 296, in `scripts/tests/` and the deep-loop runtime, outlive the delete and will need a runner that does too |
| A cheap explanation was tested and rejected first | Eight sources in the scripts workspace were newer than their compiled output, which would have explained a family of failures at once. Rebuilding changed nothing: `Tests 12 failed \| 43 passed (56)` before and after. The drifts are in the sources |
| The whole suite writes into the repository | The run rewrote `specs/descriptions.json` and 19 per-packet `description.json` files through `mcp-server/lib/search/folder-discovery.ts`. Restored afterwards, and the writer goes with 049 |
| Scope widened by one file pair, deliberately | Closing AC-003 meant editing two test files outside the phase's frozen list. Both edits are type-only and erase before runtime, and ADR-009 records them |
<!-- /ANCHOR:log -->
