---
title: "Implementation Plan: Phase 20: routing-clarify-default"
description: "One read-only CommonJS script in sk-create-skill's scripts replays committed prompts through each compiled hub engine to count clarify outcomes, writes unlabeled clarify rows, and scores labeled rows against the router's first alternative. It stops at a 30-row label gate, and past it a --jev or --deem choice per row is judged under a keep rule fixed in the spec."
trigger_phrases:
  - "clarify default plan"
  - "score-clarify-default plan"
  - "clarify census plan"
  - "clarify label gate plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: routing-clarify-default

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library, plus the compiled routing engine loader and sk-create-skill's scenario parser |
| **Framework** | None. The script spawns `jev` and `cli-deem` as binaries past the gate |
| **Storage** | None. Reads committed fixtures, playbooks and corpus files, and writes only operator-named outputs |
| **Testing** | `node --test`, the convention of `sk-create-skill/scripts/tests/` |

### Overview
`score-clarify-default.cjs` (proposed) runs every committed prompt through its hub's compiled engine and counts `clarify` outcomes per hub and source, keeping checklist alternatives apart from mode alternatives. It writes each mode-alternative clarify row unlabeled, with committed playbook gold where the scenario names a mode among the alternatives. A second entry scores a rows file. Below 30 labeled rows it prints `stop: fewer than 30 labeled rows` and ends, which is where this phase closes. Past the gate, `--jev` or `--deem` asks one `choice` per row in three option orders, and each column ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under `spec.md` section 4. Nothing is served.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] Phase 021's build is not running, since both change `sk-create-skill`'s `SKILL.md`, README and changelog
- [ ] The Keep Rule, the 10-point margin and the 30-row gate in `spec.md` are unchanged since 2026-09-29

### Definition of Done
- [ ] The census ran on the real tree with zero calls and its counts are in `goal.md`'s log
- [ ] The unlabeled rows file exists with every `label` empty, and the scorer printed `stop: fewer than 30 labeled rows` on it
- [ ] `node --test` on the test file exits 0 with at least 16 passing tests, and sk-create-skill's script suite fails nothing beyond its baseline
- [ ] `validate_document.py` exits 0 on every changed skill doc (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding (parent D5)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CommonJS script with a MODULE banner, exported pure functions for the tests and a `main()` that only runs as the entry point, the shape of `validate-compiled-routing-scenarios.cjs`.

### Key Components
- **Prompt sources**: the seven canary fixtures, playbook scenarios through `walkScenarioFiles` and `parseScenario`, and the advisor corpus rows mapped to the compiled hub of their gold skill. Unparsed prompts are counted.
- **Engine replay**: `loadHubEngine(hubId)` and its `evaluate(snapshot, { prompt })`, read only, recording the action and `decision.clarify.alternatives`.
- **Transcript count**: a line scan of the operator-named directory for front-door output with `"action":"clarify"`, counts only.
- **Rows writer**: one JSON line per mode-alternative clarify row, `label` empty, `gold` from `expected_workflow_mode` when it is among the alternatives.
- **Scorer and gate**: label validation, the 30-row gate and the first-alternative baseline.
- **Arms**: the Jev and Deem gates, three left rotations, 002's exit handling, `calls.jsonl`.
- **Verdict**: the Keep Rule in order, integer counts and an exact binomial p.

### Data Flow
Committed prompts flow through each hub's engine into counts and clarify rows. The rows file goes to the operator for labels. A labeled file flows through the gate. Past 30 labels, each backend answers every row three times, the modal pick is scored against the label beside the first alternative, and each column prints its verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Build Roles

Parent D5 sets who builds. A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. It never uses the Agent tool. The code gets a cross-family review, P0 and P1 findings get fixed and P2 findings are recorded. Code follows sk-code's OpenCode route and the docs go through sk-doc (parent D6).

### First Slice, in Order

1. Record sk-create-skill's `node --test` pass and fail counts as the baseline.
2. Write the prompt sources and the engine replay. Check: on the real tree the canary source prints 86 prompts and 3 clarify expectations, and stub logs stay empty.
3. Write the per-hub report and the checklist split. Check: `system-deep-loop` clarify rows land under checklist alternatives.
4. Write the transcript count. Check: a synthetic directory with two front-door lines prints 1 clarify and 1 route, and no text.
5. Write the rows writer and run it on the real tree into an operator-named file. Check: every `label` is empty, and the count of rows with committed `gold` prints.
6. Write the scorer and the gate. Check: `stop: fewer than 30 labeled rows` on the real rows file.
7. Write both gates, the arms and the verdict, tested on synthetic labels with stub backends only. No real model call happens before the operator's labels.
8. Write the sk-doc docs, then cross-family review and path-scoped commits.

The phase closes after step 8 at the label gate. Labeling and the live model runs are the operator's, outside this phase's completion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `S=.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`. `STUB` holds logging `jev` and `cli-deem` stubs.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Census, zero calls | `PATH="$STUB:$PATH" node $S --report $R --rows-out $F` | Per-hub and per-source prompt, unparsed, route, clarify, defer and reject counts, `real clarify rate: not measured`, exit 0, empty stub logs |
| Transcript count | `node $S --report $R --transcripts <synthetic dir>` | Clarify and other-action counts per hub and no prompt text in stdout or the report |
| Label gate | `node $S --score $F` on the unlabeled file | `stop: fewer than 30 labeled rows (<n> labeled)`, exit 0 |
| Gate under a switch | `PATH="$STUB:$PATH" node $S --score $F --deem --out $D` | The same stop line and no stub call |
| Foreign label | `node $S --score <file with one label outside its alternatives>` | Exit 2 naming the row id |
| Deem skip | stub `health` reports backend `stub`, 30 synthetic labels | `deem arm skipped: stub backend`, the rest byte-identical, exit 0 |
| Jev skip | stub `auth status --provider official` exits 3 | Identity line, then `jev arm skipped: no credential`, exit 0 |
| Verdicts | test file, synthetic labels and stub answers | `keep`, `kill`, `stop (margin)` and `stop (coverage)` with K, M, A, B, W, L, F and p |
| No key | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S` | Exit 1 |
| Tests | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Exit 0, at least 16 passing |
| Read-only | `git status --porcelain` before and after each run | Identical, apart from operator-named outputs |
| Skill docs | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc>` | Exit 0 on each changed doc |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The compiled routing runtime and sk-create-skill's scenario parser, both read only. Phase 008 for `cli-deem`. The operator's labels past the gate. The served Deem or a Jev credential for a model run past the gate. No package is installed. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel, but this build runs before or after phase 021's, never beside it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's path-scoped commits: the script, its test, the two README rows and the sk-doc docs, then regenerate the Hermes copy, the sk-doc leaf manifest pair and the trigger index. Delete operator-named outputs inside the repository. No router, fixture or playbook changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
