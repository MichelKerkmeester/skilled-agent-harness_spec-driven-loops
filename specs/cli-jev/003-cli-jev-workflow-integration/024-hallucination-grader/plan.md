---
title: "Implementation Plan: Phase 24: hallucination-grader"
description: "First a startup check that stops the model-benchmark runner from turning an unknown --grader into the mock stub. Then one read-only Node script beside the 5dim scorer maps benchmark outputs to fixtures, scores the deterministic hallucination-flag baseline, stops at a label gate of 30 labeled outputs and, behind --jev or --deem and each backend's checks, asks one noul per output under a keep rule fixed in the spec."
trigger_phrases:
  - "hallucination grader plan"
  - "score-d4-agreement plan"
  - "grader startup check plan"
  - "d4 keep rule plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 24: hallucination-grader

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), standard library only, as the rest of `model-benchmark/` |
| **Framework** | None. The script spawns `hallucination-flag.cjs`, `cli-deem` and `jev` as child processes |
| **Storage** | None. It reads fixtures, operator-named outputs and a labels file, and writes only under `--out` |
| **Testing** | Vitest through `deep-improvement/scripts/vitest.config.mjs`, which includes `*/tests/**/*.vitest.ts` |

### Overview
The work has three slices. Slice 1 makes no model call: the census maps outputs to fixtures, runs the deterministic check unchanged, parses the operator's labels and prints the label gate, headroom and power lines. Slice 2 is the fallback fix: the runner and `buildGraderFn` refuse an unknown grader kind, each with a negative control run first. Slice 3 adds a Deem arm and a Jev arm, each behind its own switch and checks, that ask one `noul` per output and print one verdict per column under the spec's Keep Rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator released this phase on 2026-09-29 (parent goal D3, amended by the "Bind and release" answer), and phase 025 is not building at the same time. Evidence: the build ran under the release (`SE` section 1), and phase 025 remains unbuilt at this closure pass
- [x] The Keep Rule in `spec.md` section 4 is unchanged since this plan, and no model run has happened. Evidence: the census prints the Keep Rule line verbatim and every run used the logging stubs (`SE` section 2)
- [x] T002 has recorded the `model-benchmark/tests/` suite baseline and the pre-run `git status --porcelain`. Evidence: `baseline/vitest-model-benchmark-before.txt` (`Test Files 13 passed (13)`, `Tests 171 passed (171)`) and `baseline/git-status-before.txt`

### Definition of Done
- [x] Every REQ in `spec.md` section 4 meets its acceptance criteria, or is listed as waiting on the label gate. Evidence: both cross-family reviewers mark REQ-001 to REQ-014 met (`SE` section 3), and the live verdict runs wait at the label gate, listed in `implementation-summary.md`
- [x] The new vitest file exits 0 with at least 16 passed, and the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline. Evidence: `Tests 205 passed (205)` across 14 files against `171 passed` across 13, `d4-agreement.vitest.ts` alone `Tests 32 passed (32)`, and the deep-improvement suite's 46 `FAIL` lines identical to `baseline/full-suite-fail-names-before.txt` (`SE` section 2)
- [x] The census counts are recorded in `goal.md`'s log, and so is a verdict line or the label gate's `stop:` line. Evidence: the counts and `stop: fewer than 30 labeled outputs` are in `goal.md`'s log, recorded by this closure pass (`SE` section 2)
- [x] Cross-family review leaves no open P0 or P1 finding (parent goal D5). Evidence: Pi MiMo `VERDICT: PASS` and Devin DeepSeek `VERDICT: PASS`, 4 P2 recorded and not chased (`SE` section 3)
- [x] `validate_document.py` exits 0 on every skill doc changed (parent goal D6), and `validate.sh --strict` on this phase prints `RESULT: PASSED`. Evidence: exit 0 on all 10 changed docs (`SE` section 2), and `validate.sh --strict` prints `RESULT: PASSED`, run by this closure pass (results in `implementation-summary.md` Verification)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A two-line guard in the runner's argument parse plus one read-only measurement script with a zero-call default and two dormant arms, the shape of phase 017's `score-track-narrowing.mjs`. The runner never loads the new script, so every benchmark run behaves as today except an unknown grader kind, which now stops.

### Key Components
- **Grader guard**: after `run-benchmark.cjs:577` reads `--grader`, a value outside `noop`, `mock` and `llm` writes a message and the usage line and exits 2, as the missing-argument check at `:581-584` does. `buildGraderFn` (`score-model-variant.cjs:207-226`) throws for the same values.
- **Census**: lists `<id>.md` and `<id>.run<k>.md` under `--outputs`, maps each to `<id>.json` under `--fixtures`, and prints matched, unmatched and allowlist counts.
- **Deterministic baseline**: writes a temporary virtual fixture with the fixture's `allowlist` (empty when absent) and spawns `scorer/deterministic/hallucination-flag.cjs <fixture> <output>`, reading its score. Below 1.0 is `yes`.
- **Labels and gate**: parses the operator's JSONL and prints `stop: fewer than 30 labeled outputs` or `stop: fewer than 5 labeled <yes|no> outputs` below the gate.
- **Deem arm**: `cli-deem health`, then one `cli-deem noul` per output with the state on stdin and closed.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, then three `jev noul --provider P` per output with no answer cache.
- **Verdict**: the spec's Keep Rule per column, one `verdict <backend>:` line, `report.json` and `calls.jsonl` under `--out`.

### Data Flow
Outputs and fixtures go into the census. The deterministic check and the labels give the baseline method and the gate. Below the gate the run stops. Past it, each requested arm that passes its checks asks its outputs, and the verdict step compares the column with the baseline method on the same measured outputs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is:

1. **Setup.** Confirm the release and that 025 is not building, read the owner's scripts and READMEs, record the suite baseline and `git status --porcelain`, and build the fixture outputs.
2. **Slice 1, zero calls.** Census, deterministic baseline, labels and gate, headroom and power. Run it on the fixture outputs and log the counts.
3. **Slice 2, the fallback fix.** Reproduce `--grader jev` running on mock scores first, then add the guard and the throw, each with its test.
4. **Slice 3, the arms.** The Deem gate and arm, then the Jev gate and arm, the payload gate, the exit table, the records and the verdict per column.
5. **Docs.** The scorer and tests READMEs, then deep-improvement's `SKILL.md`, `README.md`, changelog, feature catalog and playbook through sk-doc.
6. **Runs and review.** Past the label gate, one live `--deem --out` run, a `--jev` run only on the operator's flag, then cross-family review and the parent's commit.

Who builds (parent goal D5, amended by the operator on 2026-09-29): only Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high` write, with no Claude leaves. Each result is verified and the code is reviewed by a model of another family. P0 and P1 findings are fixed, and P2 findings are recorded. The build ran on the roster before the amendment, and its Opus 5.5 xhigh orchestrator was stopped mid-build (`goal.md`'s log).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new vitest file writes a temporary fixtures directory with three fixtures, one carrying an `allowlist`, an outputs directory with one output per fixture plus one without a fixture, and a labels file. Stub `cli-deem` and `jev` scripts on a temporary `PATH` answer from a table and log one line per call. Each public surface gets a happy path and one edge case, as REQ-013 lists, and the verdict cases feed stub answers chosen to land on `keep`, `kill`, `stop (margin)`, `stop (coverage)` and, for Jev, `stop (flips)`. The fallback fix gets one case in `run-benchmark-hardening.vitest.ts` and one in `scorer.vitest.ts`, and the whole `model-benchmark/tests/` suite reruns against T002's baseline. The live runs are proof, not tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Needed for | State at planning |
|------------|-----------|-------------------|
| The operator's release | Any build step | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel |
| Phase 025 not building | Shared doc paths | Planned, released 2026-09-29, not built |
| Benchmark outputs and 30 labels | Any model call | No output or label in the tree |
| `cli-deem` from phase 008 and the served Deem | The Deem arm | Phase 008 Complete. Server health is checked at run time |
| `jev` 0.6.2 and a credential for provider P | The Jev arm | `jev --version` printed `jev 0.6.2` on 2026-09-29. The credential is checked at run time |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` of the build commit removes the script and its test and restores the runner, `buildGraderFn`, the two test files and the docs, which brings back today's silent `mock` fallback. No run changes a tracked file. A report directory the operator named is deleted by hand if unwanted.
<!-- /ANCHOR:rollback -->

---
