---
title: "Implementation Plan: Phase 13: manual-testing-scenarios"
description: "33 operator scenarios in ten new category folders, conversation scenarios first, each a self-contained bash block over a throwaway world, then one recorded run of the whole corpus through the playbook recorder, with the authoring and execution work dispatched in nine waves."
trigger_phrases:
  - "manual testing scenarios plan"
  - "openbot parity playbook plan"
  - "conversation scenarios plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: manual-testing-scenarios

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown for the corpus. POSIX shell inside each scenario's one bash block |
| **Framework** | The `sk-create-manual-testing-playbook` package contract, its validator and its recorder |
| **Storage** | The corpus under `.skilled/skills/system-skilled-bots/manual-testing-playbook/`, and one run folder under `.skilled/skills/system-skilled-bots/benchmark/reports/` |
| **Testing** | `validate-playbook-package.cjs` for the package, `record-playbook-run.cjs` for the run and `validate.sh --strict` for the packet |

### Overview
The corpus gains 33 scenario files in ten new category folders, `BOT-026` to `BOT-058`, each carrying the five numbered sections and the eight fields the package validator requires [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:158]. The nine conversation scenarios come first, because a message, a parked question, an answer and a resumed run are one conversation and four separate scenarios would prove less than one that drives the whole exchange. Every scenario builds a throwaway world under one temp folder, drives `.skilled/bin/bots.cjs` in it with the shipped stub executor first on PATH, and removes the world in its last step, which is the form the existing 25 scenarios already use [SOURCE: .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-run/needs-you-park-and-hold.md:1]. The corpus is then executed once, and the verdicts land in one run folder through the recorder, which is the one writer of that folder [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:215].
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The corpus stands at 58 scenarios in 17 folders authored and 0 executed, so `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS ... scenarios=58 categories=17 ... violations=0 warnings=0` and `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` exits 1
- [ ] `ls .skilled/skills/system-skilled-bots/manual-testing-playbook/` lists the seventeen category folders and `manual-testing-playbook.md`
- [ ] `rg -c '^\| REQ-' specs/system-skilled-bots/003-openbot-parity-build/00*/spec.md` prints one count per phase spec, so every phase names its requirements
- [ ] `test -f .skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` exits 0, so a scenario can dispatch a run without a model
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs --help` exits 0, so the recorder exists
- [ ] Phases 001 to 011 are closed, so every verb a scenario names exists

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS ... scenarios=58 categories=17 ... violations=0 warnings=0`
- [ ] `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path, and that file holds 58 data rows, one per scenario from BOT-001 to BOT-058
- [ ] `rg -c '^BOT-0' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 58, `rg -c ',(PASS|FAIL|SKIP),' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 58, and `rg -c '^# recorded by record-playbook-run.cjs' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 1
- [ ] `rg -c '^DLR-0(02|23|64),' .skilled/skills/system-deep-loop/benchmark/reports/*--manual-testing-playbook--executor-audit/results.csv` prints 3, one verdict each for the three system-deep-loop scenarios that read `executor-audit.ts`
- [ ] `rg -c ',SKIP,' .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints 0, or every `SKIP` row's reason names a prerequisite the build does not own rather than a missing verb or field
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Corpus with one contract per scenario, and one recorded run.

### Key Components
- **The root index, `manual-testing-playbook.md`**: the package's policy surface. It owns the frontmatter, the overview and the counts, the global preconditions, the global evidence requirements, the deterministic command notation, the review protocol, the wave plan, one section per category, the automated-test cross-reference and the feature-catalog cross-reference [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:67]. It carries no scenario's execution truth, because a second copy of a command is a second answer to the same question.
- **The per-scenario file**: the canonical contract for one `BOT-NNN` id, in five numbered sections: `OVERVIEW`, `SCENARIO CONTRACT`, `TEST EXECUTION`, `SOURCE FILES`, `SOURCE METADATA` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:158]. Section 3 holds the one bash block, its expected signals, its evidence list, its pass/fail rule and its failure triage, so an operator needs nothing else open.
- **The bash block**: one block per scenario, run in order in one shell. It builds the world in step 1, commits it and defines its helpers in step 2, drives the verb under test in the middle steps, and removes the world in its last step. `pbots` runs `.skilled/bin/bots.cjs` with `HOME` inside the world, the stub executor first on `PATH`, and `--repo` and `--skilled-tree` pointing into the world, so no scenario touches a real bot's state.
- **The conversation form**: a multi-turn scenario is the same bash block with its turns numbered, so turn 1 sends a message, turn 2 reads the parked item, turn 3 answers it and turn 4 reads the resumed run's record. This is the form the existing corpus uses for its park-and-answer scenario [SOURCE: .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-run/needs-you-park-and-hold.md:1]. The `json conversation` runner style is not used, because the runner plays turns into an AI runtime session and the subject here is the bots CLI [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:306].
- **The recorder, `record-playbook-run.cjs`**: the one writer of `benchmark/reports/<date>--<label>/`. It refuses a scenario id that is not in the playbook, a verdict that is not `PASS`, `FAIL` or `SKIP`, a `FAIL` or `SKIP` with no reason, and a run folder that already exists, so a run cannot silently overwrite a prior one [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:215].
- **The package validator, `validate-playbook-package.cjs`**: the gate. It checks the five-section order, the eight required fields, the prompt synchronization, the local links and the root's result-persistence marker, and it prints one `PASS` or `FAIL` line per package with its scenario and category counts.

### Data Flow
An operator opens the root index, picks a scenario and runs its bash block from the repository root in a plain terminal. The block builds a temp world, drives the verb, prints the expected signals and removes the world. The operator compares the transcript against the scenario's expected signals and writes one row into a verdict CSV, holding the id, the verdict, the reason and the evidence. When every scenario has a row, the recorder reads that CSV and writes the run folder plus the run's row in `benchmark/reports/README.md`. A `FAIL` goes back to the scenario when the scenario is wrong, and to the phase's packet when the product is wrong.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` | Owns the package policy, the counts and the category sections | update - ten new category sections, the counts, the preconditions, the wave plan and the scenario table rows | `rg -c '^### BOT-0' .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` prints 58 |
| The ten new category folders | Do not exist | create - one folder per phase group, kebab-case, no numeric prefix | `ls -d .skilled/skills/system-skilled-bots/manual-testing-playbook/*/ \| wc -l` prints 17 |
| The seven existing category folders | Hold the 25 pre-parity scenarios | unchanged - no scenario is rewritten, because the corpus is an input and a run never edits it | `git status --porcelain .skilled/skills/system-skilled-bots/manual-testing-playbook/` lists only new files and the root index |
| `.skilled/skills/system-skilled-bots/benchmark/reports/` | Holds no run folder | create - one run folder through the recorder | `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path |
| `.skilled/skills/system-skilled-bots/benchmark/reports/README.md` | Does not exist | create - the recorder writes the run index and its row | `rg -n '^\| Executed \| Folder \|' .skilled/skills/system-skilled-bots/benchmark/reports/README.md` prints the header |
| `.skilled/skills/system-skilled-bots/runtime/` | Owns every verb a scenario drives | not a consumer - this phase reads the verbs and writes no module | `git status --porcelain .skilled/skills/system-skilled-bots/runtime/` prints nothing |
| `.skilled/bin/bots.cjs` | Owns the verb table and the exit codes | not a consumer - a scenario drives it and never edits it | `git status --porcelain .skilled/bin/bots.cjs` prints nothing |
| `specs/system-skilled-bots/003-openbot-parity-build/001..011/spec.md` | Name the verbs and records a scenario asserts | not a consumer - read only, and cited by line | `git status --porcelain specs/system-skilled-bots/003-openbot-parity-build/` lists only this packet's four docs |

Required inventories:
- Same-class producers: `rg -n '^### BOT-0' .skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` lists every scenario heading, so a file with no heading and a heading with no file are both visible.
- Consumers of the corpus: `rg -n 'manual-testing-playbook' .skilled/skills/system-skilled-bots/ --glob '*.md'` names the root index, the skill's own docs and the benchmark index, so a count stated in one place can be checked against the others.
- Consumers of the run folder: `rg -n 'benchmark/reports' .skilled/skills/system-skilled-bots/ --glob '*.md'` names the benchmark index and the recorder's own contract.
- Matrix axes: eleven phases by the verb each adds, by the record each writes, by the verdict each scenario can reach (`PASS`, `FAIL`, `SKIP`), plus the one timing scenario, the two short-loop scenarios and the one optional operator prerequisite.
- Algorithm invariant: a scenario's bash block is self-contained, so its verdict never depends on another scenario having run. A scenario's world lives under one temp folder that its last step removes, so a failed scenario leaves no state behind.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the eleven phase specs and records each verb and record, reads the playbook contract and the existing corpus, and captures the baseline validator line. Implementation writes the nine conversation scenarios, then the routines and activity scenarios, then the screen and working-place scenarios, then the memory, apps, vault and skill scenarios, then the channel scenario and the root index. Verification executes every scenario, records the verdicts through the recorder, fixes or files each `FAIL` and runs the package validator and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package | The five-section order, the eight required fields, the prompt synchronization and the local links of all 58 scenario files | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` |
| Package | Which scenario ids have a recorded verdict, and which run folders hold no `results.csv` | the same validator with `--coverage` |
| Manual | The nine conversation scenarios, executed in one pass | each scenario's own bash block, from a plain terminal |
| Manual | The five routine scenarios, including the one schedule scenario whose slot is computed at run time | each scenario's own bash block |
| Manual | The three activity, three screen, two working-place, three memory, two app, three vault, two skill and one channel scenarios | each scenario's own bash block |
| Manual | The 25 pre-parity scenarios, BOT-001 to BOT-025, rerun as a regression check on the runtime phases 001 to 011 rewrote | each scenario's own bash block |
| Manual | DLR-002, DLR-023 and DLR-064 from `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook`, which read `executor-audit.ts` that 007 and 008 changed | each scenario's own steps |
| Record | The 58 bots verdicts, written into one run folder, and the 3 deep-loop verdicts, written into one run folder under `.skilled/skills/system-deep-loop/benchmark/reports` with `--reports` | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs --playbook <path> --results <csv> --label manual-testing-playbook--openbot-parity` |
| Packet | This packet's own structure and citations | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` |

No scenario calls a model. The stub executor stands in for every runtime, so a scenario's verdict depends on the runtime's own code and never on a provider's availability.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 011 closed | Internal | Yellow | A scenario names a verb that does not exist, and its verdict is `FAIL` against the phase rather than the scenario |
| The shipped stub executor | Internal | Green | No scenario can dispatch a run, so every run scenario records `SKIP` |
| `node` and `git` | External | Green | No scenario runs. Every verdict is `SKIP` with the missing binary as its blocker |
| macOS for the keychain backend | External | Yellow | The vault scenarios take the `--store file` path, which the phase 008 requirement already allows |
| A real Telegram, Slack, Signal or WhatsApp account | External | Red | The channel scenarios still run on the fake transport. A scenario that names a real account records `SKIP` |
| A local `signal-cli` daemon | External | Red | The Signal transport cannot start. The fake transport proves the contract without it |

No package is added. Every scenario uses `node`, `git`, `bash` and the shipped stub executor.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scenario writes outside its temp world, or a scenario's verdict cannot be reproduced from its own bash block, or the corpus states a count the files on disk contradict.
- **Procedure**: revert the one commit. The corpus is documentation, so a revert leaves the runtime untouched. Delete the run folder the recorder wrote and its row in `benchmark/reports/README.md`, because a run whose corpus changed is a new run rather than an edited one. The seven pre-parity category folders are untouched by this phase, so a revert restores the 25-scenario baseline the validator already passes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing. It reads the eleven phase specs, the playbook contract and the existing corpus, and captures the baseline | Implementation, which needs the verb-and-record map and the inventory |
| Implementation | Setup's map and inventory, and phases 001 to 011 closed | Verification, which executes the files the implementation writes |
| Verification | Implementation's 33 files and the root index | Closure: no acceptance criterion is Met before the corpus is executed and recorded |
<!-- /ANCHOR:phase-deps -->

---

## EXTERNAL ORCHESTRATION

The authoring and execution work is dispatched to external CLIs in eleven waves, numbered 0 to 10. Waves 6, 7, 9 and 10 run from the orchestrator as plain shell with no external executor, because the playbook forbids any wave inside an AI runtime session and every bot definition the new scenarios write names `cli-codex`. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the wave, and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:26]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this packet's workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

### Executor Roster

| Executor | Model | Effort lever | What it is used for here |
|----------|-------|--------------|--------------------------|
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:18] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:146] | The mechanical authoring waves, at `#high` |
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:68] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] | The conversation wave and the screen wave, at `max` and `high` |
| `cli-mistral-vibe` | `deepseek-flash` | none. The row's `thinking` is `max` and no flag raises or lowers it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] | The open fix wave 8, as the primary since 2026-11-27 |
| `cli-devin` | `deepseek-v4-1-flash-max` | none. The max tier is baked into the uid [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:85] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md:59] | The channel and root-index wave, after a quota probe |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] | The last fallback for the open wave 8 |

**Effort policy.** DeepSeek Flash at `high` carries a small mechanical task: one scenario file from a settled inventory row, one root-index section, one execution pass. DeepSeek Flash at `max` carries a design or tricky task: a conversation scenario whose turns must be ordered so each one's state is the next one's precondition, or a scenario whose timing must be computed rather than written down. `gpt-6-luna` at `xhigh` on the `fast` service tier is the last fallback. The hardest task here is wave 8's call on whether a `FAIL` is a scenario defect or a product defect. Since 2026-11-27 that wave runs on `cli-mistral-vibe` at its fixed `max`, falls back at `max` and walks the whole ladder down to `cli-codex`.

**GPT models go through `cli-codex` alone.** It is the hub's OpenAI-backed mode [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28], and no other mode in this roster reaches an OpenAI model, so a GPT dispatch that names another executor is a routing error rather than a cheaper route.

**`cli-devin` is probed before it is used.** Its paid families are gated by a weekly quota. A quota banner alone is not a refusal, so the wave's first dispatch is a trivial read-only call and the wave moves to the next executor when that call fails [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237].

### Waves

Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of distinct files it writes. A wave whose files are all distinct runs its workers at once. A wave that shares a file runs one worker. The verify column names the check the orchestrator runs before the next wave starts, and the checks themselves follow the table. Waves 0 to 5 ran before 2026-11-27 and keep the executors they ran on. The open dispatched wave, 8, runs on `cli-mistral-vibe` at `deepseek-flash`, the parent's primary since that date [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

| Wave | Task ids | Files | Executor | Model | Effort | Workers in parallel | Verify |
|------|----------|-------|----------|-------|--------|---------------------|--------|
| 0 | T001-T005 | five `scratch/` notes | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 5 | V0 |
| 1 | T006-T014 | nine `conversations/` files | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 9, the file-overlap bound. Run in three batches of 3 when the gateway's rate limit bites | V1 |
| 2 | T015-T022 | five `routines/` and three `activity/` files | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 8 | V2 |
| 3 | T023-T027 | three `terminal-screen/` and two `working-place/` files | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 5 | V3 |
| 4 | T028-T037 | three `memory/`, two `apps/`, three `vault/` and two `skills/` files | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` | 10 | V4 |
| 5 | T038-T039 | one `channels/` file and the root index | `cli-devin` | `deepseek-v4-1-flash-max` | max, baked into the uid | 2, after the quota probe | V5 |
| 6 | T050-T051 | `scratch/contract-recheck.md` and the moved dry-run folder | the orchestrator, no external executor | none | none | 1, because the re-check reads every file the five authoring waves wrote | V6 |
| 7 | T040-T043, T052, T053 | six verdict CSVs under `scratch/` | the orchestrator, no external executor | none | none | 1, because one operator runs the blocks in order | V7 |
| 8 | T044, T046 | `scratch/results.csv` and the scenario files a `FAIL` names | `cli-mistral-vibe` | `deepseek-flash` | `max (fixed)`, fallback at `max` | 1, because both tasks share the results file | V8 |
| 9 | T047, T045, T054 | `scratch/results.csv`, the bots run folder and the deep-loop run folder | the orchestrator, no external executor | none | none | 1, because the recorder reads the files the re-run wrote | V9 |
| 10 | T048-T049 | none. Both tasks read | the orchestrator, no external executor | none | none | 1 | V10 |

- **V0**: `rg -c '^\| BOT-0' scratch/scenario-inventory.md` prints 33, and each of the five `scratch/` notes exists.
- **V1**: `find .skilled/skills/system-skilled-bots/manual-testing-playbook/conversations -name '*.md' | wc -l` prints 9, and the package validator prints `PASS` with `violations=0`.
- **V2**: `find .skilled/skills/system-skilled-bots/manual-testing-playbook/routines .skilled/skills/system-skilled-bots/manual-testing-playbook/activity -name '*.md' | wc -l` prints 8, and the validator prints `PASS`.
- **V3**: `find .skilled/skills/system-skilled-bots/manual-testing-playbook/terminal-screen .skilled/skills/system-skilled-bots/manual-testing-playbook/working-place -name '*.md' | wc -l` prints 5, and the validator prints `PASS`.
- **V4**: `find .skilled/skills/system-skilled-bots/manual-testing-playbook/memory .skilled/skills/system-skilled-bots/manual-testing-playbook/apps .skilled/skills/system-skilled-bots/manual-testing-playbook/vault .skilled/skills/system-skilled-bots/manual-testing-playbook/skills -name '*.md' | wc -l` prints 10, and the validator prints `PASS`.
- **V5**: `find .skilled/skills/system-skilled-bots/manual-testing-playbook/channels -name '*.md' | wc -l` prints 1, and the validator prints `PASS ... scenarios=58 categories=17 ... violations=0`.
- **V6**: `rg -c '^\| BOT-0' scratch/contract-recheck.md` prints 33, `rg -c 'pbots check' .skilled/skills/system-skilled-bots/manual-testing-playbook` exits 1, and `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` exits 1.
- **V7**: `cat scratch/verdicts-*.csv | rg -c '^BOT-0[0-9]{2},[^,]*,(PASS|FAIL|SKIP),'` prints 58, and `rg -c '^DLR-0(02|23|64),[^,]*,(PASS|FAIL|SKIP),' scratch/verdicts-deep-loop.csv` prints 3.
- **V8**: `rg -c '^BOT-0' scratch/results.csv` prints 58, `rg -c ',(PASS|FAIL|SKIP),' scratch/results.csv` prints 58, and `rg -c ',FAIL,' scratch/results.csv` prints 0, or every id it prints appears in `scratch/failures.md`.
- **V9**: `ls .skilled/skills/system-skilled-bots/benchmark/reports/*/results.csv` prints one path, `rg -c '^BOT-0' <that path>` prints 58, `rg -c ',(PASS|FAIL|SKIP),' <that path>` prints 58, and `rg -c '^# recorded by record-playbook-run.cjs' <that path>` prints 1. `rg -c '^DLR-0(02|23|64),' .skilled/skills/system-deep-loop/benchmark/reports/*--manual-testing-playbook--executor-audit/results.csv` prints 3.
- **V10**: `validate-playbook-package.cjs --package system-skilled-bots` prints `PASS`, and `validate.sh --strict` prints `RESULT: PASSED`.

### Fallback Order

When a CLI runs out of usage, or Vibe answers `429` or `402`, the wave moves down this ladder and keeps its task ids, its files and its verify step. The order is the parent's ladder, so a wave that falls back still finishes at the effort it was planned for.

1. `cli-pi` `llmgateway/deepseek-v4.1-flash-1017`, metered per token with the account's credit bonus, and the route sits under the gateway's Premium threshold, so no weekly cap applies [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:96]
2. `cli-opencode` `opencode-go/deepseek-v4.1-flash`, the Go gateway's subsidized rate, at `#high` or `#max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:74] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78]
3. `cli-mistral-vibe` `deepseek-flash`, the Vibe plan's own budget, always at the row's `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:98]
4. `cli-devin` `deepseek-v4-1-flash-max`, the weekly quota, probed with a trivial read-only call before the wave spends it [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` `gpt-6-luna` at `xhigh` on `fast`, the last fallback [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal, rather than authoring a file by hand outside the dispatch contract.

---
