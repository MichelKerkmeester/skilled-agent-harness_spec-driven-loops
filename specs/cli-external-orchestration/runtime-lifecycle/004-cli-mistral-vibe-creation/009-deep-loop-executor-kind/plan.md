---
title: "Implementation Plan: Phase 9: deep-loop-executor-kind"
description: "Add cli-mistral-vibe to the deep-loop executor tables, build its print-mode lineage adapter with a lineage-local VIBE_HOME, and score each lineage from export.json, proven by unit, stress and one keyed lineage run."
trigger_phrases:
  - "deep loop executor kind plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: deep-loop-executor-kind

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS on Node, YAML command assets |
| **Framework** | system-deep-loop runtime: executor tables, fan-out runner, executor audit |
| **Storage** | Lineage folders on disk. Each Vibe lineage holds its own `VIBE_HOME` and `export.json` |
| **Testing** | vitest unit suites, the cli-adapter stress suite, one keyed lineage run |

### Overview
`cli-mistral-vibe` joins the executor tables with the same shape dsh has, minus `reasoningEffort` and sandbox support. `buildVibeLineageCommand` builds a `vibe -p` command whose home, output folder and trust are all lineage-local. The runner scores the lineage from `export.json`, and unit, stress and one keyed run prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 007's Vibe hard rules pass in the dispatch hook suites
- [ ] The executor unit baseline prints `Tests  365 passed (365)`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] The three executor unit suites and `tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` print zero failures
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Executor kind adapter.

### Key Components
- **Executor tables in `executor-config.ts`**: decide which fields a kind accepts and which models it may run. Without a row, a `cli-mistral-vibe` config fails schema parsing.
- **`buildVibeLineageCommand` in `fanout-run.cjs`**: turns a lineage into a `vibe -p` command. Without it, `LINEAGE_COMMAND_ADAPTERS` has no entry and the runner refuses the kind.
- **Env and recursion tables in `executor-audit.ts`**: decide what reaches the child and whether a Vibe ancestor already exists. Without them, the key is filtered out and nested Vibe runs go undetected.

### Data Flow
A deep-loop config names `cli-mistral-vibe`. The schema checks the fields and the roster, and the adapter checks the binary and version, then builds the command with a lineage-local `VIBE_HOME`, `--output-dir` and `--trust`. The audit filters the env and checks the ancestry, Vibe runs one iteration, and the runner scores the lineage from `export.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This change touches env precedence and shared executor policy, so each surface is listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`, web-search policy table, `EXECUTOR_MCP_SERVER_CAPABILITY` (`executor-config.ts`) | Exhaustive `Record<ExecutorKind, ...>` tables, so a new kind breaks type-checking until each has a row | update | `rg -n 'Record<ExecutorKind' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/` and a clean type-check |
| `EXECUTOR_BINARY_BY_KIND` and `detectFromAncestry` (`executor-audit.ts`) | One binary string per kind, read by the ancestor walk | update: allow a list of names for one kind | Unit case detects a `vibe-rs` ancestor |
| `EXECUTOR_ENV_PREFIXES_BY_KIND`, `EXECUTOR_ENV_KEYS_BY_KIND`, `EXECUTOR_STATE_ENV_BY_KIND` (`executor-audit.ts`) | Env allowlist and lineage state | update | Unit case: `MISTRAL_API_KEY` passes and an inherited `VIBE_HOME` is replaced |
| `EXECUTOR_SESSION_ENV_BY_KIND` (`executor-audit.ts`) | Runtime session env per kind | unchanged: Vibe's session env is unconfirmed, the same reason cli-devin is absent | `rg -n "'cli-devin'" executor-audit.ts` shows the precedent comment |
| `LINEAGE_COMMAND_ADAPTERS` and lineage scoring (`fanout-run.cjs`) | Builds each lineage and settles it as fulfilled or rejected. `'partial'` exists only at run level | update: add a per-lineage outcome read from `export.json` | `fanout-run.vitest.ts` cases and the stress fixture |
| `SPECKIT_STATE_ENV_BY_KIND` (`fanout-run.cjs`) | Per-kind state-dir env used for lockfile isolation across same-kind replicas. A plain object, so a missing row raises no type error | update | Unit case: two Vibe replicas get distinct state dirs |
| `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`executor-audit.ts`) | The operator home folder per kind. A Partial table, so a missing row raises no type error | update: `.vibe` | Unit case: the audit treats `~/.vibe` as Vibe's default home |
| `if_cli_*` branches (`deep-research-auto.yaml`, `deep-review-auto.yaml`) | Route a run to a kind | update | `rg -n 'if_cli_mistral_vibe' .skilled/commands/deep/assets/*.yaml` prints one line per file |
| `live-contracts.json`, `matrix-manifest.ts` | Stress matrix coverage | update | The stress suite lists the kind |
| `.skilled/hooks/dispatch/lib/` | Phase 007's preflight reads the dispatch command | not a consumer | No file there changes in this phase |

Required inventories:
- Same-class producers: `rg -n 'cli-deepseek-harness' .skilled/skills/system-deep-loop/runtime .skilled/commands/deep/assets` lists every place a kind is named.
- Consumers of changed symbols: `rg -n 'EXECUTOR_BINARY_BY_KIND|detectFromAncestry' . --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: kind, model alias and exit code (0, 1, 2, 3, 4, and 3 from the recursion guard). Each exit code gets one scoring row.
- Algorithm invariant: a lineage scores success only when `export.json` exists and its `exit_code` is 0. Adversarial cases are a missing export, exit 3 with an export, exit 3 without one, and an inherited `VIBE_HOME`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the unit and stress baselines, reads the roster aliases and locates the lineage result record. Implementation adds the kind to `executor-config.ts`, `executor-audit.ts` and `fanout-run.cjs`, then the stress rows and YAML branches. Verification runs the unit and stress suites, passes the adapter's command through phase 007's preflight and runs one keyed lineage. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Kind schema, roster check, env allowlist, two-name ancestry, exit scoring | vitest: `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts` |
| Integration | Adapter command shape and scoring against a shimmed `vibe` binary | vitest: `tests/stress/cli-adapter/cli-mistral-vibe.vitest.ts` |
| Manual | One keyed Vibe research lineage beside a second executor group | `fanout-run.cjs` with `MISTRAL_API_KEY`, read through `export.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 Vibe hard rules | Internal | Yellow: planned | The adapter's command shape cannot be checked against the preflight |
| `MISTRAL_API_KEY` | External | Red: unset on 2026-11-14 | REQ-007 stays `Unmet` and the phase cannot close |
| `vibe` 3.1.2 on PATH | External | Green: `vibe --version` prints `vibe 3.1.2` | The version preflight refuses every lineage |
| Model rows with `thinking` from phase 006 | Internal | Yellow: planned | `VIBE_SUPPORTED_MODELS` cannot be filled |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an existing kind's unit or stress case fails after the change, or a Vibe lineage scores success without an `export.json`.
- **Procedure**: revert the phase commit. Removing `cli-mistral-vibe` from `EXECUTOR_KINDS` alone breaks the exhaustive tables, so revert every file together.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 complete | Implementation |
| Implementation | Setup baselines and the roster aliases | Verification |
| Verification | Implementation and `MISTRAL_API_KEY` for the keyed lineage | Phase 010 |
<!-- /ANCHOR:phase-deps -->

---
