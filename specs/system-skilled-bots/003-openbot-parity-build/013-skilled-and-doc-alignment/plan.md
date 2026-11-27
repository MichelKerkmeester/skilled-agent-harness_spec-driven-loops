---
title: "Implementation Plan: Phase 13: skilled-and-doc-alignment"
description: "One `system-skilled-bots` topic in `topics.json`, one `/local-skilled-alignment` run over the packet's `.skilled` change set, one `/local-doc-alignment` run over that topic, the fixes both reports name, and the re-runs that prove each report holds zero open findings."
trigger_phrases:
  - "skilled and doc alignment plan"
  - "local-skilled-alignment plan"
  - "local-doc-alignment plan"
  - "alignment wave plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: skilled-and-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON for the topic entry, Markdown for the docs, CommonJS for the one CLI help block |
| **Framework** | None. The two alignment commands are the tooling, and both are operator-local |
| **Storage** | Two run folders outside the checkout: `<state>/local-skilled-alignment/system-skilled-bots/<UTC timestamp>/` and `<state>/local-doc-alignment/system-skilled-bots/<UTC timestamp>/`, each holding `report.md`, `findings.json` and `fix-plan.md` |
| **Testing** | The two commands' own batteries and lanes, plus `validate.sh --strict` on this packet and `npx vitest run` on the runtime |

### Overview
The doc run cannot start until a topic exists, so the first change is one entry in `topics.json`: a title, the `terms` that reach the bots docs, three `codeRoots` and the three package checks that already exist for those docs. With the topic in place, `/local-skilled-alignment :auto` scopes the packet's `.skilled` change set from git topology and `/local-doc-alignment system-skilled-bots :auto` reads every tracked doc that names the topic against those roots. Each writes a findings report outside the checkout. The fix pass works the two reports, records a reason for every finding it rebuts, and the re-runs prove each report holds zero open findings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -c 'system-skilled-bots' .skilled/commands/assets/local-doc-alignment/topics.json` exits 1, the measured gap this phase closes
- [ ] `ls "${XDG_STATE_HOME:-$HOME/.local/state}/local-doc-alignment/system-skilled-bots"` exits 1, so no doc run has ever been made here
- [ ] `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(Object.keys(t.topics).length)"` prints `10`, the shape the new entry copies
- [ ] `node .skilled/bin/bots.cjs --help | wc -l` prints a number and `rg -n '^const VERB_SPECS' .skilled/bin/bots.cjs` prints one line, and both are recorded in `scratch/help-baseline.md` as the pair the doc run's help check compares. The 35-line help and the eleven-verb table are the pre-001 measurement, so this gate records the pair rather than asserting it
- [ ] Phases 001 to 012 are closed, committed and the working tree is clean, so the change set the skilled-alignment run scopes is the packet's own and `git status --porcelain` prints nothing before the first run. A dirty tree would put an uncommitted edit into the scope the run reads and into the diff T023 checks
- [ ] `command -v python3 node` prints both paths, because the topic's three checks need both interpreters
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(t.topics['system-skilled-bots'].codeRoots.length)"` prints `3`
- [ ] The skilled-alignment run folder holds `report.md`, `findings.json` and `fix-plan.md`, and `rg -n '^- Open findings: 0' <run>/report.md` prints one line
- [ ] The doc-alignment run folder holds the same three files, and `rg -n '^- Open findings: 0' <run>/report.md` prints one line
- [ ] `rg -n '^\| still_open \| 0 \|' <recheck>/recheck.md` prints one line
- [ ] `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder, so the clean close is checkable from the packet and not only from the operator's state root
- [ ] `evidence/skilled-alignment/` and `evidence/doc-alignment/` each hold `report.md`, `findings.json` and `recheck.md`, copied from the last run of each command, and `evidence/README.md` names the source run folder of each
- [ ] `rg -c '^## ' scratch/rebuttals.md` prints the number of settled findings, and every heading names an id a run's `findings.json` carries
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots` exits 0
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skilled-bots/manual-testing-playbook` prints `violations=0 warnings=0`, the state 012's root-index task leaves and the fix pass must not regress
- [ ] `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two report-only passes, one fix pass, two re-runs, one evidence copy.

### Design artifacts

The builder reads these instead of deciding. Each one is the only place its subject is fixed, and `spec.md` §5b is the index.

| Artifact | What it fixes |
|----------|---------------|
| `design/records.md` | Every field of the topic entry, `scope.json`, `battery.json`, `findings.json`, `dispositions.json`, `report.md`, `fix-plan.md`, `recheck.json`, `recheck.md`, `applied.json`, `scratch/rebuttals.md` and `evidence/`. Section 2.1 pastes the `overlay-layout` topic as the model shape and section 2.2 fixes the decided entry |
| `design/state-machines.md` | Six Mermaid state machines: the skilled run, the doc run, the finding, the recheck bucket, the topic and this phase's own clean-criterion loop |
| `design/sequences.md` | Five Mermaid sequence diagrams, each naming the script, the file it writes and the line it prints |
| `design/refusals.md` | Every way either command stops, with the line it prints and its exit status, plus the aggregator's six problems and the five recheck buckets |
| `design/mockups.md` | Every screen a person sees, including the no-topic display, the unknown-topic display, both result blocks and the bots help block |
| `design/fixtures/` | One golden per record, each produced by the script that writes it, with the seven checks `design/fixtures/README.md` names |

The packet's own contracts are cited by file and section and never copied. `contracts/records.md`'s opening paragraph says why a run folder is not a runtime record, `contracts/cli-json.md` section 1 rule 1 says why `findings.json` is a bare array, and `contracts/refusals.md` section 3.11 says why this phase adds no refusal.

### Key Components
- **The topic entry**: one object in `topics.json` under the key `system-skilled-bots`. Its `terms` are regular expressions matched case-insensitively, its `codeRoots` are the source of truth the lanes read, and its `checks` are the three package validators that already exist for the skill, the playbook and the catalog [SOURCE: .skilled/commands/local-doc-alignment.md:90]. Without it the scope step has no topic and the command stops, which is why it is the first change and not a later one.
- **`/local-skilled-alignment`**: the pass over what the git range changed. It resolves the scope with `resolve-scope.cjs`, runs the fired surfaces' existing checks with `run-battery.cjs`, sends four read-only lanes and one completeness critic, and merges everything with `aggregate-findings.cjs` into `findings.json`, `fix-plan.md` and `report.md` [SOURCE: .skilled/commands/local-skilled-alignment.md:93] [SOURCE: .skilled/commands/local-skilled-alignment.md:97]. It is report-only unless `--fix literal` is passed, and it writes only under its output folder, which sits outside the checkout [SOURCE: .skilled/commands/local-skilled-alignment.md:15].
- **`/local-doc-alignment`**: the pass over the docs as they stand. It lists every tracked doc whose text matches the topic's terms plus every doc inside a code root, skipping specs, changelogs, benchmark reports, symlinks and generated runtime mirrors, then runs the topic's checks and the same lane and critic machinery [SOURCE: .skilled/commands/local-doc-alignment.md:82]. The two commands share `executors.json`, `run-lanes.cjs`, `aggregate-findings.cjs`, `apply-fixes.cjs` and `prune-runs.cjs`, so a lane preset and a report shape are the same on both.
- **The fix pass**: a hand edit, not `--fix literal`. The last full run over this repository reported 36 `judgment` findings against 4 `literal` ones, so the literal applier would reach a tenth of the report [SOURCE: .skilled/commands/local-skilled-alignment.md:15]. A finding whose code root is wrong is recorded and handed to 014 rather than fixed by editing the doc to agree with it.
- **The re-runs**: `--recheck RUN_DIR` replaces steps 1 to 6 with a re-run of that run's failing battery rows and a test of its literal findings, writing `recheck.md` with the resolved, still open, new and needs-review buckets [SOURCE: .skilled/commands/local-skilled-alignment.md:101]. The doc run has no recheck mode, so it is re-run whole and its `report.md` is the record.

### Data Flow
`topics.json` gains the topic. `/local-skilled-alignment :auto` reads the git range, fires the surfaces the scope matches, runs their checks, sends four lanes and a critic, and writes a run folder. `/local-doc-alignment system-skilled-bots :auto` reads the topic, scopes the docs, runs the topic's three checks, sends its lanes and a critic, and writes a second run folder. The fix pass reads both `fix-plan.md` files, edits the docs and the CLI help, and writes `scratch/rebuttals.md` for what it declines. The re-runs read the same inputs again and write `recheck.md` and a second `report.md`. The clean criterion is read from the last run of each command only. The last step copies the last run of each command into `evidence/skilled-alignment/` and `evidence/doc-alignment/`, so the clean close survives `prune-runs.cjs` and 014 reads a checked surface rather than the operator's state root. The copy manifest is `evidence/README.md` and the record shape is `design/records.md` section 12.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a fix packet: its whole job is to work two findings reports. The surfaces below are the ones a finding can land on.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Owns the topic list the doc run resolves against | update: add the `system-skilled-bots` topic | `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(t.topics['system-skilled-bots'].codeRoots.length)"` prints `3` |
| `.skilled/bin/bots.cjs` | Owns the `USAGE` block and the `VERB_SPECS` table that must agree with it | update: the help block only | `node .skilled/bin/bots.cjs --help` lists every `VERB_SPECS` key |
| `.skilled/skills/system-skilled-bots/SKILL.md`, `ROUTER.md`, `README.md` | Own the hub's routing and orientation prose | update: whatever the report names | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots` exits 0 |
| `.skilled/skills/system-skilled-bots/feature-catalog/` | Owns the per-feature entries and the root catalog | update: the entries the report names | `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0 |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/` | Owns the scenarios and the root playbook | update: the scenarios the report names | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skilled-bots/manual-testing-playbook` prints `violations=0` |
| `.skilled/skills/system-skilled-bots/*/references/` | Own the per-mode reference files | update: the files the report names | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` exits 0 |
| `.skilled/skills/system-skilled-bots/runtime/lib/` | Owns the behavior every doc claim describes | not a consumer: a finding here is recorded and handed to 014, never fixed by editing a doc to agree with it | `rg -n 'handed to 014' scratch/rebuttals.md` prints one line per such finding |
| `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml` | Owns the surfaces and their checks | unchanged: S1 to S16 already fire for a `.skilled` scope | `rg -c 'id: S[0-9]+-' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints the same count before and after |

Required inventories:
- Same-class producers: `rg -n 'system-skilled-bots' .skilled/commands/assets/local-doc-alignment/topics.json` before the edit exits 1, and after it prints the new key once.
- Consumers of changed symbols: `rg -n 'bots (activity|routines|ui|remember|secret|skill|chat|channel)' .skilled/skills/system-skilled-bots --glob '*.md'` lists every doc that names a verb the help must carry.
- Matrix axes: the two commands, the two report shapes and the three topic checks are the independent axes. Every row of each is run before completion is claimed.
- Algorithm invariant: the help block and `VERB_SPECS` name the same verb set, and the topic's `codeRoots` cover every doc the `terms` reach.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads both command contracts, the topic shape, the lane presets, the surface map and the bots CLI help, and captures the two baselines. Implementation adds the topic, runs both commands, works the two reports and records the rebuttals. Verification re-runs both commands and reads the clean criterion from the last run of each.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three package validators the topic's `checks` name, and `validate.sh --strict` on this packet | `python3`, `node`, `bash` |
| Integration | Both alignment commands end to end, including their batteries, lanes and critic | `/local-skilled-alignment`, `/local-doc-alignment` |
| Manual | None: every check this phase relies on is a command with an exit status, so no step needs a person to look at a screen | None |

The one command that decides the phase is the re-run: `rg -n '^- Open findings: 0' evidence/*/report.md` prints two lines, one per evidence folder, and `rg -n '^\| still_open \| 0 \|' <recheck>/recheck.md` prints one line for the skilled-alignment recheck. The pattern is a prefix and not the whole line, because the line reads `- Open findings: 0 (0 handed off, 0 rebutted)` and a `$`-anchored pattern never matches it. The line's grammar is `design/records.md` section 7.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3` | External | Green | The skill-package and catalog checks become `cannot_run`, so the doc run's deterministic layer is a gap rather than a pass |
| `node` | External | Green | The playbook check and the bots CLI help read become `cannot_run` |
| A lane CLI on PATH for the chosen `--lanes` preset | External | Yellow | The lane fails and the critic scores a partial set. `--lanes=native` needs no binary and is the last resort |
| Phases 001 to 012 closed | Internal | Yellow | The change set the skilled-alignment run scopes is not the packet's own, so a finding can belong to a phase still in flight |
| `origin/main` present as the default base | Internal | Green | `--base` must name another ref, and the scope is then not the packet's change set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix pass edits a doc to agree with a runtime bug, or a re-run reports a `new` bucket above `0` after the fix pass was declared done.
- **Procedure**: revert the one commit that carries the fix pass. The two run folders sit outside the checkout and are never reverted, so the report that justified the fix survives the revert and the next attempt reads it. `prune-runs.cjs` keeps the newest 10 run folders per command, so an older report is still there when the revert needs it [SOURCE: .skilled/commands/local-skilled-alignment.md:99].
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase's build is dispatched, not hand-run. The roster below is the closed set of executors the build may use, and every row is the same executor the alignment commands' own `executors.json` already carries as a lane preset, so a build worker and a review lane share one roster [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:9].

### Executor roster

| Executor | Model | Effort | Dispatch shape | Source |
|----------|-------|--------|----------------|--------|
| `cli-mistral-vibe` | `deepseek-flash` | `thinking = "max"` on the roster row, and no flag exists to change it | `VIBE_HOME="$VH" vibe -p "$PROMPT" --model deepseek-flash --add-dir "$WT" --auto-approve --output-dir "$RUN_DIR/out" </dev/null`, run from a scratch folder inside the worktree `$WT`, with `$VH` a fresh `mktemp -d` outside it | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:94] |
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max` | `pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking <level> --mode text </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:160] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | `opencode run -m opencode-go/deepseek-v4.1-flash#max --format json </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165] |
| `cli-devin` | `deepseek-v4-1-flash-max` | baked into the model id, so no flag carries it | `devin -p -- "$PROMPT" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] |

`cli-pi` is the only row whose effort is a standalone flag, so it is the only row where `high` and `max` are a choice on the command line rather than a property of the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157]. `cli-codex` sets effort through `-c model_reasoning_effort=` because no `--reasoning-effort` flag exists [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138]. `cli-devin` and `cli-mistral-vibe` bake the tier into the id or the row, so a dispatch cannot raise or lower it.

### Effort policy

- **`high`** for a small mechanical task: a verb name, a field name, a count, a path, a one-line help entry.
- **`max`** for a design or tricky task: the topic's `terms` and `codeRoots`, a fix that changes what a doc claims, and any edit where two docs disagree about the same fact.
- **`gpt-6-luna` at `xhigh` on the `fast` service tier** for the hardest task in the build, and as the last fallback when every other row is out of usage.
- **GPT models only through `cli-codex`.** No other row in this roster reaches a GPT model, so a task that needs one is a `cli-codex` task by definition.
- **Vibe is the primary for every dispatched wave** and runs at its fixed `max`, so the `high` and `max` tiers above set only the fallback tier on `cli-pi` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:199].
- Compose every prompt as the child preamble, then the inlined persona, then the task and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:56].
- One change per brief: the file, the edit and the check that proves it.
- Read the outcome record, not stdout. A clean stdout proves nothing, and `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:116].
- A Vibe worker starts from its own scratch folder inside the worktree, passes `--add-dir` for the worktree and keeps `VIBE_HOME` outside it, as the parent's Vibe dispatch says [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "BUILD ORCHESTRATION", Vibe dispatch].

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator's own runtime removes its own row from the roster before the first wave. The table below is the guard each row carries. The orchestrator reads its own runtime signal once, at the start, and the ladder in the next section is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-opencode` | the runtime is OpenCode | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:10] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:10] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:10] |
| `cli-pi` | never for being inside Pi. Only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |

### Fallback ladder

Every wave walks the same ladder, and a wave names only its entry point. A row is skipped, not retried, when its guard refuses or its usage is exhausted.

1. `cli-mistral-vibe` at `deepseek-flash`, skipped when `VIBE_SESSION=1` is set and left on a `429` or `402`.
2. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max` at the wave's fallback tier.
3. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max`.
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because quota exhaustion gates the paid families and the banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237].
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, as the last fallback.

The ladder is the parent's [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. `cli-mistral-vibe` is first because the operator made it the primary for every phase on 2026-11-27. `cli-pi` is second because it is the one row whose effort is a flag and whose guard never fires for being inside Pi. `cli-codex` is last because it is the hardest-task row and the one a build should not spend on a mechanical edit.

### Wave mapping

`tasks.md` §Waves owns the wave table: the task ids in each wave, the executor, model and effort each wave runs at, how many workers run in parallel and the file-overlap bound that sets that number, the orchestrator's verify step after the wave, and the fallback order. This section owns the roster and the rules. `tasks.md` owns the assignment.
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 to 012 closed, and both interpreters on PATH | Implementation, because the topic shape and the two baselines are what the first run is read against |
| Implementation | Setup, and the topic entry, because the doc run has no topic without it | Verification, because a re-run needs a first run to recheck |
| Verification | Implementation, and the fix pass, because a recheck of an unfixed run reports the same findings | Closure, because the clean criterion is read from the last run of each command, and the evidence copy is what makes that reading survive the prune |
<!-- /ANCHOR:phase-deps -->

---
