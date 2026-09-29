---
title: "Implementation Plan: Phase 25: reviewer-verdict-fallback"
description: "One read-only Node script beside the reviewer scorer replays its verdict regex over fixtures, operator-named outputs and reviewer reports with zero calls, scores two zero-call baselines on the labeled misses, stops at a label gate of 12 and then, behind --jev or --deem and each backend's checks, asks one choice over pass, fail and block per output in three option orders under a keep rule fixed in the spec."
trigger_phrases:
  - "reviewer verdict fallback plan"
  - "score-verdict-fallback plan"
  - "verdict regex census plan"
  - "reviewer fallback keep rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 25: reviewer-verdict-fallback

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), standard library only, as the rest of `model-benchmark/lib/` |
| **Framework** | None. The script imports `extractVerdict` and spawns `cli-deem` and `jev` as child processes |
| **Storage** | None. It reads fixtures, an operator-named outputs file and reports, and writes only under `--out` |
| **Testing** | Vitest through `deep-improvement/scripts/vitest.config.mjs`, which includes `*/tests/**/*.vitest.ts` |

### Overview
The script works in two slices. Slice 1 makes no model call: it replays the reviewer scorer's own `extractVerdict` over every source the operator names, keeps only the misses, scores the majority-class and loose-rule baselines on the labeled misses and prints the label gate, headroom and power lines. Slice 2 adds a Deem arm and a Jev arm, each behind its own switch and checks, that ask one three-key `choice` per miss in three option orders and print one verdict per column under the spec's Keep Rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29 (parent goal D3, amended by the "Bind and release" answer), and phase 024 is not building at the same time
- [ ] The Keep Rule and the option descriptions in `spec.md` section 4 are unchanged since this plan, and no model run has happened
- [ ] T002 has recorded the `model-benchmark/tests/` suite baseline and the pre-run `git status --porcelain`

### Definition of Done
- [ ] Every REQ in `spec.md` section 4 meets its acceptance criteria, or is listed as waiting on the label gate
- [ ] The new vitest file exits 0 with at least 16 passed, and the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline
- [ ] The census counts are recorded in `goal.md`'s log, and so is a verdict line or the label gate's `stop:` line
- [ ] Cross-family review leaves no open P0 or P1 finding (parent goal D5)
- [ ] `validate_document.py` exits 0 on every skill doc changed (parent goal D6), and `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One read-only measurement script with a zero-call default and two dormant arms, the shape of phase 017's `score-track-narrowing.mjs`. It imports the scorer's regex function rather than copying it, so the census always measures the regex the scorer runs. Nothing imports the new script, so every reviewer benchmark behaves as today.

### Key Components
- **Census**: loads the profile's fixtures, merges each visible and hidden case as the scorer does, and replays `extractVerdict` on each `reviewer_output`. It also replays every row of `--outputs` and reads `per_test[].verdictMethod` from each `reviewer-report.json` under `--reports`.
- **Baselines**: the majority class of the labeled misses, and the loose rule, the last whole word `pass`, `fail` or `block` in the output. The better one on the labeled misses is the baseline method.
- **Labels and gate**: parses the outputs file and prints `stop: fewer than 12 labeled regex-miss outputs` or `stop: no labeled <verdict> output` below the gate.
- **Deem arm**: `cli-deem health`, then three `cli-deem choice` calls per miss, one per option order, the output on stdin and closed.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, then three `jev choice --provider P` per miss, the three orders doubling as reruns.
- **Verdict**: the spec's Keep Rule per column, one `verdict <backend>:` line, `report.json` and `calls.jsonl` under `--out`.

### Data Flow
Fixtures, outputs and reports go into the census, which keeps the regex misses. The labels give the population, the baselines and the gate. Below the gate the run stops. Past it, each requested arm that passes its checks asks its misses, and the verdict step compares the column with the baseline method on the same measured misses.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is:

1. **Setup.** Confirm the release and that 024 is not building, read the reviewer scorer and its schema, record the suite baseline and `git status --porcelain`, and build the test fixtures.
2. **Slice 1, zero calls.** Census over fixtures, outputs and reports, both baselines, labels and gate, headroom and power. Run it on today's fixtures and log `8 hits, 0 misses`.
3. **Slice 2, the arms.** The Deem gate and arm, then the Jev gate and arm, the payload gate, the exit table, the records and the verdict per column.
4. **Docs.** The lib and tests READMEs, then deep-improvement's `SKILL.md`, `README.md`, changelog, feature catalog and playbook through sk-doc.
5. **Runs and review.** Past the label gate, one live `--deem --out` run, a `--jev` run only on the operator's flag, then cross-family review and the parent's commit.

Who builds (parent goal D5): a fresh Opus 5.5 xhigh build orchestrator sends single-change briefs to Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`, verifies each result and gets the code reviewed by a model of another family. P0 and P1 findings are fixed, and P2 findings are recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The vitest file writes a temporary profile with two reviewer fixtures, one case of which carries a recorded output with no verdict line, an outputs file of labeled misses across the three verdicts, a `reviewer-report.json` with one `none` case and stub `cli-deem` and `jev` scripts that answer from a table and log one line per call. Each public surface gets a happy path and one edge case, as REQ-011 lists, and the verdict cases feed stub answers chosen to land on `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (flips)`. The whole `model-benchmark/tests/` suite reruns against T002's baseline. The live runs are proof, not tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Needed for | State at planning |
|------------|-----------|-------------------|
| The operator's release | Any build step | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel |
| Phase 024 not building | Shared doc paths | Planned, released 2026-09-29, not built |
| Regex-miss outputs and 12 labels | Any model call | None exists (8 of 8 fixture cases hit the regex) |
| `cli-deem` from phase 008 and the served Deem | The Deem arm | Phase 008 Complete. Server health is checked at run time |
| `jev` 0.6.2 and a credential for provider P | The Jev arm | `jev --version` printed `jev 0.6.2` on 2026-09-29. The credential is checked at run time |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The build adds two files and edits docs only. `git revert` of the build commit removes the script and its test and restores the READMEs, `SKILL.md`, changelog, catalog and playbook. No run changes a tracked file. A report directory the operator named is deleted by hand if unwanted.
<!-- /ANCHOR:rollback -->

---
