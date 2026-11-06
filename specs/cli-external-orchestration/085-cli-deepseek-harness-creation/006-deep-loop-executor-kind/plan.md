---
title: "Implementation Plan: Phase 6: deep-loop-executor-kind"
description: "Adds cli-deepseek-harness as a closed executor kind to the deep-loop config, audit and fan-out builder, with an exact argv, env allowlist, recursion guard, version probe and JSON-final validation. Unit tests prove each and the kind stays out of default allowlists."
trigger_phrases:
  - "deep loop executor kind plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: deep-loop-executor-kind

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`executor-config.ts`, `executor-audit.ts`) and Node.js CommonJS (`fanout-run.cjs`) |
| **Framework** | The deep-loop runtime |
| **Storage** | None. Lineage state lives under each lineage directory |
| **Testing** | vitest in `.skilled/skills/system-deep-loop/runtime/tests/unit/` |

### Overview
The kind joins the config tables, the audit maps and the fan-out builder beside `cli-pi` and `cli-hermes`. The builder emits one exact argv with the prompt on stdin and cwd at the lineage directory, and the audit admits only the reviewed env keys. Four unit suites prove argv, env, success and recursion rules against a baseline of the full unit directory.

Authoring mode is `sk-code` `sk-code-skilled` for the TypeScript and JavaScript runtime and tests, then `sk-code-quality`. The executor is `cli-codex gpt-6-luna xhigh fast`. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/phase-plan.md:138-154]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `ls 002-dsh-offline-contract-pin/evidence/headless-help.txt` prints the path
- [ ] `ls .dsh/patches/lineage.patch.yml` prints the path
- [ ] The full unit directory's vitest pass and fail counts are recorded in `goal.md` section 4 before any edit

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] The four named suites pass and the full unit run has no failure beyond the baseline
- [ ] `spec.md`, `plan.md` and `tasks.md` agree on files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Closed kind registration. Every table that lists kinds gains one entry, and the builder map gains one adapter.

### Key Components
- **`executor-config.ts`**: kind schema, flag support (`model`, `reasoningEffort`, `timeoutSeconds`, `agentPersona` mapped to patch selection), the two-route roster, the Flash `max` pin, sandbox capability false and MCP off.
- **`executor-audit.ts`**: binary map, state env, default home, env allowlist and recursion refusal with no self-presence exemption.
- **`fanout-run.cjs`**: `buildDshLineageCommand`, the adapter map entry, the version probe and the JSON-final validator.

### Data Flow
A fan-out lineage picks the kind. The audit filters the env and checks recursion. The builder spawns `dsh` in the lineage directory with the prompt on stdin. The validator reads the last stdout line, requires a `final` with `reason.kind` `completed` and exit 0, and otherwise marks the lineage failed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-audit.ts` env allowlist | Admits per-kind prefixes and keys to a strict base list | update | `executor-audit.vitest.ts` drop-list test |
| `combo-matrix.vitest.ts` | Enumerates kind combinations | update | Matrix rows and exclusions for the kind |
| `verify-iteration.vitest.ts` | May enumerate kinds, unchecked | unchanged unless it lists kinds | `rg -n 'cli-hermes' tests/unit/verify-iteration.vitest.ts` read before deciding |

Required inventories:
- Same-class producers: `rg -n "'cli-hermes'" .skilled/skills/system-deep-loop/runtime/lib .skilled/skills/system-deep-loop/runtime/scripts` lists every table the kind must join.
- Consumers of changed symbols: `rg -n 'EXECUTOR_KINDS|buildHermesLineageCommand' .skilled/skills/system-deep-loop --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: route (two), permission preset, exit code, final kind, env key set.
- Algorithm invariant: success holds only for exit 0 plus a `final` event with `reason.kind` `completed`. Adversarial cases are an empty stream, a non-JSON tail, an `error` event followed by a `final` and a nested `dsh`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the unit baseline and the inventory of kind tables. Implementation edits config, audit and builder, then the tests and the catalog entry. Verification reruns the four suites and the full unit directory against the baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Config schema, audit env and recursion, builder argv and success test, combo matrix | vitest on the four named suites from `.skilled/skills/system-deep-loop/runtime` |
| Integration | The whole unit directory against the pre-edit baseline | vitest on `tests/unit/` |
| Manual | Default allowlist absence | `rg` on the default tables in `executor-config.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 evidence | Internal | Yellow, not built yet | Builder flags and failure shape are unobserved |
| Phase 004 patches | Internal | Yellow, not built yet | Builder has no patch paths to assert |
| vitest in the deep-loop runtime | Internal | Green | None. No new package is installed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: the full unit run shows a failure that the baseline did not have, or an existing kind's test changes behavior.
- **Procedure**: revert the phase commit with `git revert <sha>`. The kind is absent from defaults, so no running fan-out depends on it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 002 and 004 landed | Implementation |
| Implementation | Unit baseline recorded | Verification |
| Verification | Config, audit, builder and tests written | Phase close, then phases 007, 010, 011 and 012 |
<!-- /ANCHOR:phase-deps -->

---
