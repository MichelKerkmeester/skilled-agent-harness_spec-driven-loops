---
title: "Implementation Plan: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping"
description: "Add a non-creating read-only path to the two graph databases and the three read scripts, point the doctor deep-loop route at it, then open research runs through the gateway and repair the run's lock, graph, question, resource-map and staging bookkeeping, each unconfirmed finding behind a reproduce-first task."
trigger_phrases:
  - "deep-loop read-only plan"
  - "graph database read-only open"
  - "research run-open gateway plan"
  - "bookkeeping repair plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give the deep-loop runtime a read-only mode and repair deep-research bookkeeping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS entry scripts, Node 20+, workflow YAML, Markdown |
| **Framework** | Deep-loop runtime, append gateway, legacy projections, SQLite via `better-sqlite3` |
| **Storage** | `runtime/database/*.sqlite` coverage and council graphs, JSONL state logs, ledger frames |
| **Testing** | Vitest suites under `runtime/tests`, plus the stem-producer census and route validators |

### Overview

Read-only is a property of the open, not of the query. The plan adds a non-creating open to the coverage and council database modules, threads a read-only flag from the three CLI scripts into that open, and suppresses the two writes the scripts add on top of reading: the observability append and the convergence snapshot. The doctor deep-loop route then calls the scripts in that mode and drops the sentence that says the calls may create a database.

The bookkeeping half is reproduce-first. Each finding the doctor audit did not confirm is tested against the current tree before its fix is written; a finding that no longer holds is recorded and dropped. Where a finding holds, the fix keeps the existing storage boundaries: the run opens through the gateway, the lock carries its nonce, the upsert reads the delta the agent already writes, question resolution merges that delta's evidence fields into what the reducer already reads, the prompt pack requires the fields that were silently missing, and staging stops picking up machine state. Every change is verified by the suite plus the same commands the audit used.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Non-creating read path. A read-only open requires the database file to exist, opens it with the SQLite read-only flag, and never runs directory creation, schema application, journal-mode changes or version writes. The callers that only read stop appending.

### Key Components

- **Database open modes**: `coverage-graph-db.ts` and `council-graph-db.ts` gain a non-creating open beside `initDb()`. The default write-capable open is unchanged.
- **CLI read-only flag**: `status.cjs`, `query.cjs` and `convergence.cjs` parse `--read-only`, use the non-creating open, and skip their write side effects. An absent database is an empty result.
- **Doctor consumer**: the deep-loop route and workflow pass the flag and stop describing writes the calls no longer make.
- **Research run open**: the init step stages a legacy config row through the append gateway, whose upcaster maps it to the run-initialized event that opens the ledger.
- **Reducer question resolution**: the reducer merges each iteration's delta record into the state-log record it already reads, so a delta-provided `answeredQuestions` resolves the strategy boxes.
- **Graph upsert source**: the upsert step reads the iteration's delta file, where `graphEvents` already lives, instead of the thin state-log projection.

### Data Flow

Read: CLI flag -> non-creating open -> SQLite read-only -> result JSON; observability append and snapshot persistence skipped.

Run open: config row -> append gateway -> ledger frame (run-initialized) -> projection writes the state log's first row.

Iteration: agent writes narrative + delta; gateway records the canonical record; reducer merges the delta's evidence into the record set and rewrites registry, dashboard and strategy; upsert reads the delta's graph events and writes the coverage graph; resource-map emission reads the delta's path fields.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/coverage-graph/coverage-graph-db.ts` | Owns directory creation, schema application and version bump through `initDb`; every query helper calls `getDb` | update: add a non-creating read-only open | `rg -n "initDb\|getDb\|readonly" lib/coverage-graph/coverage-graph-db.ts`; new read-only test |
| `lib/council/council-graph-db.ts` | Same for the council graph; already honors `DEEP_LOOP_COUNCIL_DB_DIR` | update: same non-creating open | `rg -n "initDb\|COUNCIL_GRAPH_STORAGE_DIR\|readonly" lib/council/council-graph-db.ts`; new read-only test |
| `scripts/status.cjs`, `scripts/query.cjs`, `scripts/convergence.cjs` | Read-only by intent, write by side effect | update: accept the flag, skip side effects | `rg -n "readOnly\|observability\|persist-snapshot" scripts/status.cjs scripts/query.cjs scripts/convergence.cjs`; new read-only test |
| `lib/deep-loop/observability-events.cjs` | Appends events and creates the event directory | unchanged: callers stop invoking it in read-only mode | `rg -n "appendStatusObservabilityEvent\|appendConvergenceObservabilityEvent" scripts/` |
| `.skilled/commands/doctor/_routes.yaml`, `assets/doctor-deep-loop.yaml` | Consumers of the three scripts; document database creation and observability writes | update: pass the flag, restate the boundary | `bash .skilled/commands/doctor/scripts/route-validate.sh`; `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` |
| `commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml` | Own run open, lock lifecycle, marker guard, upsert step, staging | update: gateway run open, nonce release, delta-sourced upsert, exclusions | `rg -n "step_create_state_log\|loop-lock.cjs release\|step_marker_scan\|step_graph_upsert\|git add" commands/deep/assets/deep-research-*.yaml` |
| `runtime/lib/legacy-projections/deep-research-contract.ts` | Rebuilds the state log rows from ledger events; iteration rows carry no `graphEvents` | unchanged: the fix reads the delta instead | `rg -n "iteration_completed" lib/legacy-projections/deep-research-contract.ts` |
| `deep-research/assets/prompt-pack-iteration.md.tmpl` | Defines the canonical iteration record; omits `answeredQuestions` and path fields | update: require the fields the reducer and extractor already read | `rg -n "answeredQuestions\|source_paths\|graphEvents" deep-research/assets/prompt-pack-iteration.md.tmpl` |
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Census marks the run-initialized stem reserved with "runs open with the flat config row" | update only if the run-open fix speaks the stem | `node runtime/scripts/check-ledger-stem-producers.cjs` |
| `.gitignore` | Has no deep-research run-state rules | update: ignore lock, sentinels and watermarks | `git check-ignore -v specs/<packet>/research/.deep-research.lock` |

Required inventories:
- Same-class producers: `rg -n 'getDb\(|initDb\(' .skilled/skills/system-deep-loop/runtime/lib/coverage-graph .skilled/skills/system-deep-loop/runtime/lib/council`.
- Consumers of changed symbols: `rg -n 'appendStatusObservabilityEvent|appendConvergenceObservabilityEvent|COVERAGE_GRAPH_DATABASE_DIR|COUNCIL_GRAPH_STORAGE_DIR' .skilled/skills/system-deep-loop`.
- Matrix axes: (1) flag on/off; (2) coverage versus council loop type; (3) database present, absent, or older schema; (4) snapshot persistence true/false for convergence.
- Algorithm invariant: a read-only call performs zero write syscalls. Adversarial cases: absent directory, absent file, present file with an older schema, present file with WAL side files, council override directory set, and a concurrent writer.

<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The approach in order:

1. Reproduce. Record the runtime suite baseline, then reproduce each unconfirmed finding (`B1` run open, `B2` marker scan, `B3` lock nonce, `B4` refused rows, `B5` graph upsert) with a command that returns a visible result. Stop and record any finding that no longer holds.
2. Read-only runtime. Add the non-creating open, thread the flag, suppress the two side effects, and keep an absent database an empty result.
3. Doctor consumer. Pass the flag from the route and workflow and restate the write boundary.
4. Research run open. Stage the config row through the gateway in both workflows; update the census if the stem becomes spoken.
5. Lock, marker and refusal alignment. Capture the nonce and pass it on release; separate the canonical header from the nested-dispatch marker; resolve every pinned bookkeeping row by acceptance or deliberate silence.
6. Graph and evidence. Source the upsert from the delta; require `answeredQuestions` and path fields in the record; merge delta evidence in the reducer.
7. Staging. Add the ignore rules and record the tracked-versus-staged decision.
8. Verify. Run the suites, re-run the reproductions, run the doctor and mirror gates, and refresh the mirrors.

Verification commands (each reads its own output and exit status):
- `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/graph-read-only.vitest.ts tests/unit/deep-research-run-open.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts tests/unit/deep-research-marker-scan.vitest.ts tests/unit/deep-research-lock-release.vitest.ts tests/unit/deep-research-bookkeeping-emission.vitest.ts`
- `cd .skilled/skills/system-deep-loop/runtime && npm run typecheck`
- `node .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs`
- `bash .skilled/commands/doctor/scripts/route-validate.sh`
- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`
- `git check-ignore -v specs/system-speckit/048-doctor-command-audit/003-update/research/.deep-research.lock`

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Non-creating open, CLI flag handling, lock nonce release, marker guard, reducer question merge, upsert payload | Vitest under `runtime/tests/unit` |
| Integration | Shipped init step extracted from both workflow YAMLs runs against a temp directory and appends to the ledger | Vitest with the real CLI (`append-mode-event.cjs`) |
| Manual | Doctor deep-loop route run against a scratch database; staging dry run on a fixture packet | Bash, `git add --dry-run` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Append gateway and legacy upcaster (`append-mode-event.cjs`, `legacy-compatibility.ts`) | Internal | Green | The run-open fix cannot produce the ledger's first event |
| Doctor route validator and catalog mirror | Internal | Green | The doctor consumer change cannot land |
| Stem-producer census | Internal | Green | A spoken-stem change would fail the census gate |
| `better-sqlite3` read-only support | External library | Green | The non-creating open falls back to copying the file, which is worse |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a regression in the doctor route, the research workflow, or the runtime suite that cannot be repaired in place.
- **Procedure**: revert the packet's commits. Read-only mode is additive; its removal returns the scripts to today's behavior. The workflow fixes are content changes with no data migration, so a revert restores the old bookkeeping.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + Reproduce) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Implementation | High | 6-10 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **9-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert the packet's commits in reverse order.
2. Restore the workflow YAMLs and the doctor route from the reverted commit.
3. Re-run the read-only reproduction to confirm the scripts are back to creating state, and the runtime suite to confirm the revert is clean.
4. Notify the operator only if a research run was mid-flight under the changed workflow.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The read-only path writes nothing, and the workflow fixes change record shape, not stored data.
<!-- /ANCHOR:enhanced-rollback -->

---


