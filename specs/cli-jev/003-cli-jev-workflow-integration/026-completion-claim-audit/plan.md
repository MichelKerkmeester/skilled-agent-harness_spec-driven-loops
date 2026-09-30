---
title: "Implementation Plan: Phase 26: completion-claim-audit"
description: "One read-only Node script in system-spec-kit's runtime scripts runs the completion sentinel's own claim detector over turn texts the operator names with zero calls, prints its fires, per-word counts and, on labeled rows, its false fires and missed claims, stops at a label gate of 30 and then, behind --jev or --deem and each backend's checks, asks one noul per row under a keep rule fixed in the spec."
trigger_phrases:
  - "completion claim audit plan"
  - "score-completion-claims plan"
  - "completion claim census plan"
  - "completion claim keep rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 26: completion-claim-audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES module (`.mjs`), standard library only, as phase 005's `score-compaction-recall.mjs` |
| **Framework** | None. The script loads the CommonJS sentinel through `createRequire` and spawns `cli-deem` and `jev` as child processes |
| **Storage** | None. It reads an operator-named rows file and labels file and writes only under `--out` |
| **Testing** | Vitest through `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`, which includes `runtime/tests/**/*.{vitest,test}.ts` |

### Overview
The script works in two slices. Slice 1 makes no model call: it runs the sentinel's `detectCompletionClaim` on each row, prints fires and per-word counts, then scores the regex against the operator's labels and prints its false fires, missed claims, the label gate, headroom and power lines. Slice 2 adds a Deem arm and a Jev arm, each behind its own switch and checks, that ask one `noul` per labeled row on the same 400-character tail the regex reads and print one verdict per column under the spec's Keep Rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator released this phase on 2026-09-29 (parent goal D3, amended by the "Bind and release" answer), so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel. Evidence: the build ran under the release; the build commit `1a0fb2ea33` sits directly on phase 025's build commit `d657558a2e`, and phase 025 reads `Status | Complete` (`git log` at this closure pass)
- [x] The Keep Rule and the fixed `-q` in `spec.md` section 4 are unchanged since this plan, and no model run has happened. Evidence: the default run prints the `keep rule:` line and the power line, and every run used the logging stubs, so no model was called (`SE` section 2)
- [x] T002 has recorded the runtime vitest baseline for the sentinel's three suites and the pre-run `git status --porcelain`. Evidence: the recorded baseline is the runtime root suite, 108 files and 1,305 tests before against 109 files and 1,328 tests after, with the same failing-name list, and `git status --porcelain` was equal before and after (`SE` section 2)

### Definition of Done
- [x] Every REQ in `spec.md` section 4 meets its acceptance criteria, or is listed as waiting on the label gate. Evidence: both cross-family reviewers mark REQ-001 to REQ-012 met after the P1 fix and the recheck (`SE` section 3), and the live verdict runs wait at the label gate, listed in `implementation-summary.md`
- [x] The new vitest file exits 0 with at least 16 passed, and the sentinel's three existing suites fail nothing beyond T002's baseline. Evidence: `Tests 23 passed (23)`, and the runtime root suite holds the same failing names before and after (`SE` section 2)
- [x] The census counts are recorded in `goal.md`'s log, and so is a verdict line or the label gate's `stop:` line. Evidence: the counts and `stop: fewer than 30 labeled rows` are in `goal.md`'s log, recorded by this closure pass (`SE` section 2)
- [x] Cross-family review leaves no open P0 or P1 finding (parent goal D5). Evidence: the code review prints `VERDICT: PASS` with 4 P2; the docs review prints `VERDICT: FAIL` with 1 P1 and 2 P2, fix f1 closes the P1, and the recheck prints `VERDICT: PASS`; 3 P2 findings are recorded and not chased (`SE` section 3)
- [x] `validate_document.py` exits 0 on every skill doc changed (parent goal D6), and `validate.sh --strict` on this phase prints `RESULT: PASSED`. Evidence: exit 0 on all eight changed docs (`SE` section 2), and `validate.sh --strict` prints `RESULT: PASSED`, run by this closure pass (results in `implementation-summary.md` Verification)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One read-only measurement script with a zero-call default and two dormant arms, the shape of phase 017's `score-track-narrowing.mjs` placed in phase 005's `runtime/scripts/compaction-recall/` layout. It imports the sentinel's detector rather than copying the pattern, so the census always measures the regex the Stop hook runs. Nothing imports the new script and no hook calls it, so every turn end behaves as today.

### Key Components
- **Census**: reads `--rows`, runs `detectCompletionClaim` on each row's `raw_text`, and for each fired row records the first pattern word in its 400-character tail. It prints `rows: <n> fires: <n>` and one count per word, never text.
- **Labels and gate**: parses `--labels`, joins by `id`, and prints `stop: fewer than 30 labeled rows` or `stop: fewer than 5 labeled <yes|no> rows` below the gate.
- **Regex errors**: on labeled rows, false fires and missed claims with their per-word split, and the regex's accuracy, which is the baseline B.
- **Deem arm**: `cli-deem health`, then one `cli-deem noul -q <fixed>` per labeled row with the tail on stdin and closed.
- **Jev arm**: the identity line, the three checks, the payload gate, one `jev auth test --provider P`, then three `jev noul --provider P` calls per row with no answer cache.
- **Verdict**: the spec's Keep Rule per column, one `verdict <backend>:` line, `report.json` and `calls.jsonl` under `--out`.

### Data Flow
The rows file goes into the census, which prints fires and words. The labels give the population, the regex's errors and the gate. Below the gate the run stops. Past it, each requested arm that passes its checks asks its rows, and the verdict step compares the column with the regex on the same measured rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is:

1. **Setup.** Confirm the release, read the sentinel, its Claude adapter and phase 005's census, record the vitest baseline and `git status --porcelain`, and build synthetic fixtures.
2. **Slice 1, zero calls.** Census, per-word counts, labels and gate, the regex's errors, headroom and power. Run it on phase 003's fixture and log `rows: 50 fires: 4`.
3. **Slice 2, the arms.** The Deem gate and arm, then the Jev gate, the payload gate and the Jev arm, the exit table, the records and the verdict per column.
4. **Docs.** The scripts README row, then system-spec-kit's `SKILL.md`, `README.md`, changelog, feature catalog and playbook through sk-doc.
5. **Runs and review.** Past the label gate, one live `--deem --out` run, a `--jev` run only on the operator's flag and acceptance, then cross-family review and the parent's commit.

Who builds (parent goal D5, amended by the operator on 2026-09-29): only DeepSeek V4.1 Flash and MiMo v2.6 Pro write, with no Claude leaves. The session ran the single-change briefs for the code on DeepSeek V4.1 Flash through Cline at `--thinking xhigh` and the doc briefs on Pi `llmgateway/mimo-v2.6-pro` at `high`, verified each result itself and had the code and docs reviewed by a model of another family. P0 and P1 findings are fixed, and P2 findings are recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The vitest file writes synthetic rows only: claims inside and outside the 400-character tail, one row per pattern word, turns that say "fixed" without claiming completion and turns that claim completion in words the pattern lacks. It adds a labels file across both classes and stub `cli-deem` and `jev` scripts that answer from a table and log one line per call. Each public surface gets a happy path and one edge case, as REQ-012 lists, and the verdict cases feed stub answers chosen to land on `keep`, `kill`, `stop (margin)`, `stop (coverage)` and a Jev `stop (flips)`. A test asserts that no fixture text reaches stdout. The sentinel's three suites rerun against T002's baseline. The live runs are proof, not tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Needed for | State at planning |
|------------|-----------|-------------------|
| The operator's release | Any build step | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel |
| A rows file and 30 labels | Any model call | Phase 003's 50 rows exist, untracked. No claim label exists |
| `cli-deem` from phase 008 and the served Deem | The Deem arm | Phase 008 Complete. Server health is checked at run time |
| `jev` 0.6.2, a credential for provider P and `--accept-payload` | The Jev arm | `jev --version` printed `jev 0.6.2` on 2026-09-29. The credential and the acceptance are checked at run time |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The build adds one script, one test file and one fixtures directory, and edits docs only. `git revert` of the build commit removes them and restores the README, `SKILL.md`, changelog, catalog and playbook. No run changes a tracked file, and the sentinel, hooks and settings are never touched. A report directory the operator named is deleted by hand if unwanted.
<!-- /ANCHOR:rollback -->

---
