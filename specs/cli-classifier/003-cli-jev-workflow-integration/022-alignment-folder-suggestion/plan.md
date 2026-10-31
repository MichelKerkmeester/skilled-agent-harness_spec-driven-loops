---
title: "Implementation Plan: Phase 22: alignment-folder-suggestion"
description: "One read-only TypeScript eval in system-spec-kit's CLI package counts below-50 alignment events per save path in committed text and an operator-named transcript directory, replays both validator paths to show which lists alternatives, writes unlabeled rows outside the repository and scores labeled rows against the better free answer. It stops at a 30-row label gate, and past it a --jev or --deem choice per row is judged under a keep rule fixed in the spec."
trigger_phrases:
  - "alignment suggestion plan"
  - "below-50 census plan"
  - "alignment label gate plan"
  - "save path replay plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 22: alignment-folder-suggestion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript run with `npx tsx` from the CLI package, the convention of `runtime/cli/evals/README.md`, plus the alignment validator's exports |
| **Framework** | None. The script spawns `jev` and `cli-deem` as binaries past the gate |
| **Storage** | None. Reads committed text and an operator-named directory, and writes only operator-named outputs outside the repository |
| **Testing** | Vitest in the `cli` project of `.skilled/skills/system-spec-kit/vitest.config.ts` |

### Overview
`score-alignment-suggestion.ts` (proposed) scans committed text for the validator's decision lines and counts below-50 events per save path. It bands each event by its decision line, not by the printed percentage. It then runs both validator paths non-interactively on synthetic save data: the CLI path against the real specs root, and the data path against a synthetic tree. That shows which path can list a folder at all. With `--transcripts` and `--rows-out`, it writes one unlabeled row per transcript event with listed alternatives, to a file outside the repository. A second entry scores a rows file. Below 30 labeled rows it prints `stop: fewer than 30 labeled rows` and ends, which is where this phase closes. Past the gate, `--jev` or `--deem` asks one `choice` per row in three option orders, and each column ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under `spec.md` section 4. Nothing is served.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] No other build is changing system-spec-kit's `SKILL.md`, README or changelog
- [ ] The Keep Rule, the 10-point margin and the 30-row gate in `spec.md` are unchanged since 2026-09-29

### Definition of Done
- [ ] The census and the path replay ran on the real tree with zero calls, and their counts are in `goal.md`'s log
- [ ] The scorer printed `stop: fewer than 30 labeled rows` on an unlabeled rows file
- [ ] The vitest file exits 0 with at least 18 passing tests, and the `cli` project fails nothing beyond its baseline
- [ ] `validate_document.py` exits 0 on every changed skill doc (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding (parent D5)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file TypeScript eval with a MODULE banner, exported pure functions for the tests and a `main()` that only runs as the entry point, the shape of the other scripts in `runtime/cli/evals/`.

### Key Components
- **Line scan**: the decision, block, alternative and pick lines of both paths, read from `alignment-validator.ts:504-597` and `:624-690`, banded by decision line.
- **Committed and transcript sources**: a walk of committed text files that skips source code, and a walk of the operator-named directory. Both print counts only.
- **Path replay**: `validateContentAlignment` and `validateFolderAlignment`, imported read only and run with a non-TTY stdout and captured logs.
- **Rows writer**: one JSON line per transcript event with alternatives, `state` from the paired save call or `null`, `gold` from an interactive pick and `label` empty. It refuses a path inside the repository.
- **Scorer and gate**: label validation, the 30-row gate and the baseline choice.
- **Arms**: the Jev gate with `--accept-payload`, the Deem gate, three left rotations, 002's exit handling and `calls.jsonl` without row text.
- **Verdict**: the Keep Rule in order, integer counts and an exact binomial p.

### Data Flow
Committed text and transcripts flow into band counts per path. Synthetic save data flows through both validator paths into alternative counts. Transcript events with alternatives flow into the rows file outside the repository, and the operator labels it. A labeled file flows through the gate. Past 30 labels, each backend answers every callable row three times, the modal pick is scored against the label beside the baseline, and each column prints its verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Build Roles

Parent D5 sets who builds.
- **Orchestrator.** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step. It runs the CLI executors by Bash only and never uses the Agent tool.
- **Executors.** Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro`, at thinking `high`.
- **Review.** The code gets a cross-family review. P0 and P1 findings get fixed, and P2 findings are recorded.
- **Routes.** Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

### First Slice, in Order

1. Record the `cli` project's vitest pass and fail counts as the baseline, and confirm the evals import policy allows the validator import.
2. Write the line scan and the committed-text census. Check: on the real tree it finds the two 0% hard blocks in the archived fanout log, both with no alternatives, and the one 60% event. Both stub logs stay empty.
3. Write the path replay. Check: the CLI path against the real specs root prints its alternative count, expected 0, and the data path against the synthetic tree lists the higher-scoring siblings.
4. Write the transcript census and the rows writer. Check: a synthetic directory with one paired and one unpaired event writes two rows, one with `state` `null`, every `label` empty, and no text in stdout.
5. Write the scorer and the gate. Check: `stop: fewer than 30 labeled rows` on the synthetic rows file.
6. Write both gates, the arms and the verdict, tested on synthetic labels with stub backends only. No real model call happens before the operator's labels.
7. Write the system-spec-kit docs through sk-doc, then run the cross-family review and the path-scoped commits.

The phase closes after step 7 at the label gate. The operator's transcript census, labels and live model runs are outside this phase's completion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from `.skilled/skills/system-spec-kit/runtime/cli`. `S=evals/score-alignment-suggestion.ts`. `STUB` holds logging `jev` and `cli-deem` stubs, and `$O` is a directory outside the repository.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Census, zero calls | `PATH="$STUB:$PATH" npx tsx $S --report $O/r` | Per-path band counts, block and alternative counts, the path replay's alternative counts, `transcript events: not measured`, exit 0, empty stub logs |
| Transcript rows | `npx tsx $S --report $O/r --transcripts <synthetic dir> --rows-out $O/rows.jsonl` | Counts only on stdout, and rows with every `label` empty |
| Repo path refused | `npx tsx $S --transcripts <synthetic dir> --rows-out ./rows.jsonl` | Exit 2 before any output |
| Label gate | `npx tsx $S --score $O/rows.jsonl` | `stop: fewer than 30 labeled rows (<n> labeled)`, exit 0 |
| Payload gate | stub `jev` passing, 30 synthetic labels, no `--accept-payload` | `jev arm skipped: payload not accepted`, then the Deem column runs |
| Deem skip | stub `health` reports backend `stub` | `deem arm skipped: stub backend`, the rest byte-identical, exit 0 |
| Verdicts | test file, synthetic labels and stub answers | `keep`, `kill`, `stop (margin)` and `stop (coverage)` with K, M, A, B, W, L, F and p |
| No key | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S` | Exit 1 |
| Tests | `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` | Exit 0, at least 18 passing |
| Read-only | `git status --porcelain` before and after each run | Identical |
| Skill docs | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <doc>` from the repository root | Exit 0 on each changed doc |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion --strict` from the repository root | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The alignment validator's exports, read only. `tsx` and `vitest` as the CLI package already declares them, so no package is installed. Phase 008 for `cli-deem`. The operator's transcript directory and labels past the gate. The served Deem, or a Jev credential and the operator's payload acceptance, for a model run past the gate. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's path-scoped commits: the script, its test, the two README rows and the system-spec-kit docs. Then regenerate the Hermes copy and the trigger index. Operator-named outputs sit outside the repository and are the operator's to delete. No validator, detector or save code changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
