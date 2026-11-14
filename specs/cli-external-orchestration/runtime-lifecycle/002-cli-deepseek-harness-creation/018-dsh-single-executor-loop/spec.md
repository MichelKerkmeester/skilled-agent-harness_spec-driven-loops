---
title: "Feature Specification: Phase 18: dsh-single-executor-loop"
description: "/deep:review and /deep:research in :auto refuse a single cli-deepseek-harness executor and exit 2, so dsh runs only as a fan-out lineage. This phase makes one dsh lineage run through the shared command builder with an isolated home, the spec folder marker and a completion check."
trigger_phrases:
  - "dsh single executor loop"
  - "phase 18 dsh single executor loop"
  - "single lineage cli-deepseek-harness"
  - "dsh single executor deep review"
  - "dispatchEnv completionCheck runAuditedExecutorCommand"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: dsh-single-executor-loop

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/376-dsh-single-executor-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 19 |
| **Predecessor** | 016-ci-red-check-repairs |
| **Successor** | None |
| **Handoff Criteria** | Edits E1 to E19 are applied, the three new test cells pass, typecheck and contract drift are clean and every row in `acceptance-criteria.md` is `Met` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the DeepSeek Harness packet. The operator asked to rework the loop so a single lineage also works. Today the `:auto` review and research workflows refuse a lone `cli-deepseek-harness` executor before any dispatch.

**Scope Boundary**: the synchronous audited runner, the two `:auto` workflow YAMLs, their two presentation files, one dsh reference note, two test files and the two compiled contracts the compiler regenerates. No change to the fan-out runner, the dsh builder or the `:confirm` workflows.

**Dependencies**:
- Phase 006, which added the `cli-deepseek-harness` executor kind and `buildDshLineageCommand`.
- Phase 012, which wired the kind into the deep-loop modes and commands.

**Deliverables**:
- A single dsh lineage dispatches from both `:auto` workflows through `buildLineageCommand`, with a `REPOSITORY ROOT` prompt line, a fresh `DSH_HOME`, `DSH_SPEC_FOLDER`, `SYSTEM_SPEC_GATE_DISABLED`, `AI_SESSION_CHILD` and `validateDshCompletion`.
- Two optional runner fields, `dispatchEnv` and `completionCheck`, with tests that fail without them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An operator who runs `/deep:review` or `/deep:research` in `:auto` with one `cli-deepseek-harness` executor gets the refusal message and exit 2, so a dsh run needs at least two lineages. Copying the `if_cli_pi` branch as it stands is not enough. The audited runner drops `DSH_HOME` and `DSH_SPEC_FOLDER`, so dsh would run against `~/.dsh` and break the `dsh-home-isolated` hard rule, and the runner never returns stdout, so `validateDshCompletion` could not catch a guard plugin that did not activate on exit 0.

### Purpose
One dsh lineage runs a review or research iteration in `:auto` from the artifact folder, with its own throwaway home, and a clean exit that hides a failure is recorded as a crash.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node --input-type=module <<'EOF'   # the body of if_cli_deepseek_harness in both :auto YAMLs
console.error('cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind');
process.exit(2);
EOF
cli-deepseek-harness runs only as a fan-out lineage; rerun with --count=2 or a second --executor group, or choose another executor kind
exit=2

$ cd .skilled/skills/system-deep-loop/runtime
$ node --import tsx --input-type=module -e "import {buildExecutorDispatchEnv} from './lib/deep-loop/executor-audit.ts'; const e=buildExecutorDispatchEnv({kind:'cli-deepseek-harness'},{PATH:'/bin',DSH_HOME:'/tmp/h',DSH_SPEC_FOLDER:'/x',LLMGATEWAY_API_KEY:'k'}); console.log(JSON.stringify(Object.keys(e)))"
["PATH","LLMGATEWAY_API_KEY","SPECKIT_CLI_DISPATCH_STACK"]
exit=0

$ rg -n "export function runAuditedExecutorCommand\(" lib/deep-loop/executor-audit.ts
1198:export function runAuditedExecutorCommand(input: RunAuditedExecutorCommandInput): number {

$ node -e "const f=require('./scripts/fanout-run.cjs'); console.log(typeof f.validateDshCompletion, typeof f.buildLineageCommand, typeof f.createDshHome)"
function function undefined
exit=0

$ rg -n "requires a lineage directory|cwd: path.resolve\(options.lineageDir\)" scripts/fanout-run.cjs
3002:    throw inputError('cli-deepseek-harness requires a lineage directory');
3056:    cwd: path.resolve(options.lineageDir),

$ node --import tsx --input-type=module -e "import {detectFromAncestry} from './lib/deep-loop/executor-audit.ts'; console.log(detectFromAncestry('cli-deepseek-harness',['bash -c // starts dsh in the artifact folder']), detectFromAncestry('cli-deepseek-harness',['bash -c // starts the harness in the artifact folder']))"
true false
exit=0
```

The first block is the refusal: the message and `exit=2`. The second shows the allowlist keeps 3 keys and drops both `DSH_HOME` and `DSH_SPEC_FOLDER`. The third shows the runner returns a `number`, never stdout, so no caller can run `validateDshCompletion` on its output. The fourth and fifth show `createDshHome` is not exported and the dsh builder needs a lineage directory and uses it as cwd. The last shows the ancestry recursion guard fires on any bare `dsh` word in an ancestor command line (`true`) and not on the reworded line (`false`), which binds how the new branch text is written.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `dispatchEnv` to `runAuditedExecutorCommand`, merged after the allowlist env. Without it `DSH_HOME` never reaches the child (second block above).
- Add `completionCheck` to `runAuditedExecutorCommand`, run only after a clean exit. Without it an exit-0 run with an inactive plugin passes unguarded (third block above).
- Replace `if_cli_deepseek_harness` in both `:auto` YAMLs with a dispatch modelled on `if_cli_pi`, and update the two YAML notes that say dsh has no single path. The new branch opens the prompt with a `REPOSITORY ROOT` line, because both prompt templates say "All paths are relative to the repo root." while the leaf starts in the artifact directory.
- Rewrite the four presentation lines that say dsh is fan-out only, add a note to `fanout-executor.md` and regenerate the two compiled contracts.
- Add two runner test cells and one YAML contract assertion that each fail on today's code.

### Out of Scope
- The `:confirm` review and research YAMLs. They have single-executor branches only for native, claude and opencode, so codex, pi, cursor, devin and dsh are all missing there. That is a separate gap for its own packet.
- `runAuditedExecutorCommandAsync`. No workflow branch calls it with a dsh executor, so it keeps ignoring the two new fields.
- Passing `agentPersona` or `liveTools` from the executor config into the single-lineage dsh builder call. The `if_cli_pi` branch does not pass them either, and the persona already travels in the prompt through `withAgentPersona`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Add the `dispatchEnv` and `completionCheck` input fields and honor them in the synchronous runner |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Replace the refusal branch with a single-lineage dsh dispatch and update one note |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Replace the refusal branch with a single-lineage dsh dispatch and update one note |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | Modify | Say a single dsh lineage runs in `:auto` and fan-out also works |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modify | Say a single dsh lineage runs in `:auto` and fan-out also works |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/fanout-executor.md` | Modify | Note that the single-executor `:auto` workflows use the same builder |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modify | Add the `dispatchEnv` and `completionCheck` cells |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Modify | Assert no refusal text and a dsh branch that names the builder, the home and the completion check |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate | Rewritten by `compile-command-contracts.cjs --write`, never by hand |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | Rewritten by `compile-command-contracts.cjs --write`, never by hand |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Neither `:auto` YAML contains `runs only as a fan-out lineage`, and each `if_cli_deepseek_harness` branch names `buildLineageCommand`, `DSH_HOME`, `SYSTEM_SPEC_GATE_DISABLED`, `REPOSITORY ROOT` and `validateDshCompletion`. |
| REQ-002 | A `dispatchEnv` key, `SYSTEM_SPEC_GATE_DISABLED` included, reaches the child even when the per-kind allowlist drops it, and an inherited `DSH_` key the caller did not name stays out. |
| REQ-003 | A non-null `completionCheck` reason on an exit-0 dispatch appends a `dispatch_failure` event with reason `crash` and that reason as detail, and the runner still returns 0. |
| REQ-004 | The single dsh dispatch starts in the artifact directory, never the repository root, with a fresh `DSH_HOME` under the system temp folder that is gone after the run. |
| REQ-005 | No line of either dsh branch holds a bare `dsh` word, so the ancestry recursion guard does not refuse the dispatch as nested. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Both presentation files and `fanout-executor.md` say a single dsh lineage runs in `:auto` through the shared builder and fan-out also works, and none says a single run exits 2. |
| REQ-007 | The compiled review and research contracts are regenerated by the compiler, and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=1` for each. |
| REQ-008 | Runtime typecheck exits 0 and both `:auto` YAMLs load with `yaml.safe_load`. |
| REQ-009 | A keyed single-lineage `/deep:review :auto` iteration with `--executor=cli-deepseek-harness` writes its iteration file and a state record accepted by the append gateway. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The vitest run over the receipts, branch contract and write-containment files reports `Tests  13 passed (13)`, up from the baseline of 10.
- **SC-002**: A rendered dsh branch run against a stub `dsh` exits 0 from the artifact directory with a removed temp home, and the same run with a `did not activate` stderr line records one `crash` dispatch failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `buildDshLineageCommand` and `validateDshCompletion` in `fanout-run.cjs` | A change to either breaks the single path and the fan-out path together | Both paths call the same exports, and the new tests load the real `validateDshCompletion` |
| Risk | The iteration prompt names repo-relative paths such as `node .skilled/.../append-mode-event.cjs`, and dsh now starts in the artifact directory | Med | The prompt opens with a `REPOSITORY ROOT` line telling the leaf to run every command from the root. A keyed live run is the only proof the leaf follows it, which is REQ-009 |
| Risk | An outer step kill while dsh still runs skips the `finally` block and strands a `dsh-home-*` folder | Low | The child timeout is 30 s under the step timeout, at least half of it |
| Risk | A bare `dsh` word anywhere in the heredoc trips the ancestry guard | High | The branch text uses "the harness" instead, and the contract test fails on a bare `dsh` word |
| Risk | `verify-iteration.cjs` reads only the completion receipt, which records exit 0 after a completion-check failure | Low | The `dispatch_failure` event lands at the state-log tail, where `validateIterationOutputs` reports `dispatch_failure_logged` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The single dsh branch adds one `mkdtempSync` and one `rmSync` per iteration and no extra process beyond the builder's existing version probe.
- **NFR-P02**: `completionCheck` runs once per exit-0 dispatch over output already held in memory, so it adds no I/O.

### Security
- **NFR-S01**: `DSH_HOME` is never set on the workflow process, only in `dispatchEnv`, so the state-env recursion guard still refuses a nested dsh dispatch.
- **NFR-S02**: The child cwd is the artifact directory, so headless dsh never reads the repository root `.env`.

### Reliability
- **NFR-R01**: The temp home is removed in a `finally` block, and the child timeout sits 30 s under the step timeout, so neither a runner throw nor a child timeout leaves a `dsh-home-*` folder.
- **NFR-R02**: A missing dsh binary, a wrong release or an off-allowlist model makes `buildLineageCommand` throw before any home is created, so the request never degrades to native.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: no `dispatchEnv` and no `completionCheck` leave every other executor kind byte-identical in env and outcome, which the 10 existing cells keep proving.
- Maximum input: child output past the runner's 10 MiB `maxBuffer` fails the spawn as today, so `completionCheck` never runs on truncated output.
- Failure path: a non-null completion reason appends `dispatch_failure` with reason `crash`, the runner returns 0 and the step exits 0, like the existing non-zero-exit path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 8 edited files plus 2 regenerated contracts, 437 added lines in the prototype, most of them the two YAML branches |
| Risk | 12/25 | Touches the shared audited runner every CLI branch calls, behind two optional fields |
| Research | 6/20 | Builder, guard and runner contracts read and a mirror prototype run before the plan |
| **Total** | **28/70** | **Level 2** |

`recommend-level.sh --loc 330 --files 10` printed `Recommended Level: 1 (Baseline)` and `Score: 36/100`. The scaffold is Level 2 and stays Level 2, so `acceptance-criteria.md` is the closure gate for a change to a runner every CLI branch shares.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does a live dsh leaf follow the `REPOSITORY ROOT` line and run the repo-relative append gateway from the root? Answered: yes. A live five-iteration single-lineage review wrote all five iteration records through the gateway with no `dispatch_failure`, so REQ-009 and AC-009 are met.
- Decided: `SYSTEM_SPEC_GATE_DISABLED=1` rides in `dispatchEnv`, as the fan-out runner sets it, because `SYSTEM_SPEC_GATE_ENFORCE=0` alone only stops the deny.
<!-- /ANCHOR:questions -->

---
