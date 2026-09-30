---
title: "Implementation Summary: Goal-Criteria Lint"
description: "Complete at the operator's label gate. The zero-call lint, the scorer, their 20 tests, 100 drawn label rows with every label field null and the sk-create-goal and hub catalog docs are built and committed as 2139eb8c0d. The lint's --all run flags 1,017 rule 4 and 41 rule 5 lines of 1,485 scored, and the scorer prints unlabeled=100 and no rate until the operator adopts a rubric and labels."
trigger_phrases:
  - "goal criteria lint summary"
  - "lint-goal-criteria status"
  - "goal criteria lint label gate"
  - "goal criteria lint results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint"
    last_updated_at: "2026-09-28T23:15:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: 7 of 7 goal criteria ticked, build commit 2139eb8c0d"
    next_safe_action: "Orchestrator commits the phase docs. The operator adopts a rubric and labels the 100 drawn rows"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs"
      - ".skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs"
      - ".skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl"
      - "specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which rubric does the operator adopt for rules 4 and 5"
      - "Should the stop rule also require the Wilson interval's floor under 0.05"
      - "Are the 7 lexical_unscored lines non-English"
    answered_questions:
      - "check-goal.cjs --all prints no RESULT line in corpus mode, so its whole stdout, stderr and exit code are the baseline"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Goal-Criteria Lint

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-goal-criteria-lint |
| **Status** | Complete |
| **Completed** | 2026-09-28, build commit `2139eb8c0d`, at the operator's label gate (parent D4) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Rules 4 and 5 of `sk-create-goal` now have a machine check. It is advisory, makes no model call and leaves `check-goal.cjs` byte-identical. The phase stops at your label gate, so the rubric, the labels, the scored numbers and any model arm are still to come.

### Phase 6: goal-criteria-lint

**The lint.** `lint-goal-criteria.cjs` takes one packet or `--all`, with `--json` and `--root`, and exits 0 on every input. It imports `extractDurableSlice`, `splitFrontmatter` and `LOG_ANCHOR` from `goal-slice.cjs` and carries a byte-identical copy of `check-goal.cjs`'s three parser functions under a "Ported from check-goal.cjs" comment. `rule4DanglingRefs(line)` flags a referring phrase whose head noun does not resolve on the line, and `rule5ExternalFile(line)` flags wording whose check needs another document. Both follow working default A, `mimo-02-strict-v1`, because no rubric is adopted yet. The walker skips `z_archive` and every `scratch` segment and counts the scratch files apart. Each criterion line is `scored`, `placeholder` or `lexical_unscored`, and a goal with no criteria counts as `no_input`. A missing packet, a bad option or an unreadable goal prints one named `ERROR` line.

The first `--all` run on the active tree printed:

```text
goals_scanned=323 scratch_excluded=30 criteria=1543 scored=1485 rule4_violations=1017 rule5_violations=41 both_violations=40 placeholder=51 lexical_unscored=7 no_input=13 errors=0
```

These are the counts the planning prototype predicted for the same tree. Under rubric A, rule 4 fires on 1,017 of 1,485 scored lines. That figure is the lint's flag count, not a base rate, because no label exists to measure its precision.

**The drawn sample.** `goal-criteria-labels.jsonl` holds 100 rows drawn with seed 20260928 over 21 strata, by track group and goal kind, from 1,357 distinct scored hashes. Each row is `{id, text_sha12, rubric, rule4_ok, rule5_ok, labeler}`, with `id` as `specs/.../goal.md:<line>`, a 12-hex hash and the four label fields null. No row holds criterion text. The orchestrator drew it with `draw-labels.cjs` in the build record, the one build target the briefs assigned to it.

**The scorer.** `score-goal-lint.cjs --labels <file>` runs the lint in process, or reads a saved `--all --json` run with `--lint <file>`. It joins on `text_sha12` and refuses mixed rubrics with `rubric mismatch:` and no rate. It counts `stale=`, `not_scored=` and `unlabeled=` apart. Past the gate it prints per-rule TP, FP, FN, TN, precision, recall and F1, the labeled violation rate with a Wilson 95% interval and, under 0.05, `r20 model arm not built: labeled_violation_rate<0.05`. On the drawn file it prints `rows=100 rubric=none unlabeled=100 stale=0 not_scored=0 labeled=0 no labeled rows` and no rate.

**The skill docs (parent D6).** `SKILL.md` names the lint and the scorer beside the checker and moves to 1.3.0.0. The skill README and `scripts/README.md` list both scripts, both test files and the labels file, and the scripts README tests row reads `pass 40`. The changelog `v1.3.0.0.md`, playbook scenario SCG-009 with its root row and the hub catalog leaf `document-validation/goal-criteria-lint.md` with its root entry are new.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs` | Created | The lint, 635 lines. Briefs 01 to 06 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs` | Created | 12 cases, 308 lines. Briefs 01 to 06 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs` | Created | The scorer, 347 lines. Briefs 07 and 08 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/score-goal-lint.test.cjs` | Created | 8 cases on synthetic fixture labels, 187 lines. Briefs 07 and 08 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl` | Created | 100 drawn rows with null label fields. The orchestrator's own write |
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` | Modified | +3/-3, version 1.3.0.0. Brief 12 |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | Modified | +26/-5. Brief 13 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | Modified | +36/-5, with three doc-truth fixes. Brief 14 |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.3.0.0.md` | Created | 28 lines. Brief 09 |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/lint-goal-criteria.md` | Created | SCG-009, 141 lines. Briefs 10 and 17 |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md` | Modified | +22/-2. Brief 15 |
| `.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md` | Created | 62 lines. Brief 11 |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md` | Modified | +19/-4. Brief 16 |
| `.hermes/skills/sk-create-goal/SKILL.md` | Regenerated | The session's `sync-skills-hermes.cjs` run, to clear the drift the `SKILL.md` change caused |
| Two `activation/sk-doc/manifest.json` files | Regenerated | The repository's `route-remint` commit hook, +1/-1 each |
| `scratch/w3-build/` | Created | The build record: `build-evidence.md`, 17 briefs, baselines, dispatch logs and final runs, 191 paths |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` and this file | Modified | The closure pass recorded the evidence and corrected the stale premises |

`2139eb8c0d` holds 207 paths: the 13 build files, the Hermes copy, the two manifests and the 191 record paths (`git show --name-only 2139eb8c0d`). `check-goal.cjs` and `create-goal-auto.yaml` are unchanged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The planning documents were written from recommendation R20 in `../004-deep-research-expansion/research/research.md` and amended for two backends from `../007-classifier-deep-research/research/research.md` section 14. They were amended again on 2026-09-28 for the parent's wave 3 directive. The operator released the phase that day (parent `goal.md` D3).

A build orchestrator, Opus 5.5 at xhigh, captured the baselines at HEAD `996cf85eef` and fixed a proof plan of 14 rows before the first dispatch. It wrote 17 single-change briefs into `scratch/w3-build/briefs/`, each under 90 lines, and ran them one at a time by Bash on the roster the operator set at about 20:30 that evening. Devin on `deepseek-v4-1-flash-max` wrote the parser port, rule 4, the walker, the em-dash cleanup and the scorer core (briefs 01, 02, 04, 06 and 07). Pi on `llmgateway/mimo-v2.6-pro` wrote rule 5 and the line classes, the lint's command line, the scorer's command line and the nine doc copies (briefs 03, 05, 08 and 09 to 17). Brief 17 was a one-line follow-up, not a retry. No brief failed its check. After each dispatch the orchestrator read the handback, diffed the tree and ran the brief's own check. It drew the label sample itself.

The orchestrator session reran the gates from the final state and regenerated the Hermes copy. A Claude `review` agent, a different family from the DeepSeek and MiMo writers, passed the code with no P0 or P1 and six P2s, recorded and not fixed under parent D5. The session checked the staged set against an allowlist, scanned it for keys and committed `2139eb8c0d`. This closure pass recorded that evidence in the phase docs and ran the phase gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A separate lint instead of a new `check-goal.cjs` check | `check-goal.cjs` is a completion gate with frozen exit codes. An advisory lint inside it would move `RESULT: PASSED` for every goal |
| Copy the parser, pinned by a parity test | `check-goal.cjs` exports only packet-level runners, and new exports would widen a frozen gate for one caller. The parity test fails if the copies drift |
| The rubric before any label, chosen by the operator | The recorded base rates run from 1.5% to 79.5% because they measure different failure definitions. The build ran under working default A and wrote no label |
| Draw scored lines only, one per hash | No label is spent on a placeholder or a repeated line, and a label joined by hash survives a moved `path:line` id |
| Prove the scorer on synthetic fixture labels | Parent D4 puts the real labels past the gate, so only fixtures can show the per-rule numbers, the interval and the stop line inside this phase |
| Zero calls and no model arm at the gate | The lexical lint is the build-nothing competitor. A model arm on either backend has to beat it by a measured F1 gain, and none is built before the labels |
| Record the review's P2s and fix none | Parent D5: fix P0 and P1, record P2 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

`E` is `scratch/w3-build/build-evidence.md`, the build orchestrator's record. The session record is the orchestrator session's rerun, review and commit notes. `$G` is `.skilled/skills/sk-doc/sk-create-goal/scripts`.

| Check | Result |
|-------|--------|
| Checker baseline (T002), HEAD `996cf85eef`: `env -u SKDOC_SKIP_VALIDATION node $G/check-goal.cjs --all` | `goals_scanned=353`, `phase_parents_scanned=36`, findings missing-binding-row 203, placeholder 86, criteria-count 38, parent-budget 4, frontmatter-fence 0. One stderr `ERROR` line for a scratch fixture whose frontmatter has no closing fence. No `RESULT` line, because corpus mode prints none (`check-goal.cjs:540-555`). Exit 2 (`E` section 1) |
| Other baselines | sk-create-goal suite 20 of 20. `validate_document.py` 8 of 8 exit 0. Playbook package `PASS`, 8 scenarios. Catalog package 0 fail and 6 warn. Skill-root metadata 16 of 16. Hermes check already `DRIFT system-spec-kit`, from another phase. Phase strict validate `RESULT: PASSED` (`E` section 1) |
| P1: `PATH="$STUB:$PATH" node $G/lint-goal-criteria.cjs --all` | The counts above, empty stderr, no stub log, exit 0 (`E` section 4) |
| P2 and G1: `node --test $G/tests/` | `tests 40`, `pass 40`, `fail 0`, exit 0. The seven named lint cases each `ok`. Delta +20 over the baseline, 0 regressions (`E` sections 4 and 5) |
| P3: `git diff --quiet` on `check-goal.cjs`, `shasum -a 256`, the baseline `--all` again | Diff exit 0, hash `4bf117a9...aadcd6` unchanged, stdout and stderr `cmp`-identical to the baseline, exit 2 as before (`E` section 4) |
| P4: `node check-labels.cjs` and a separate `node -e` schema pass | `rows=100 bad_schema=0 stale_hash=0 id_moved=0 max_row_chars=262 distinct_hashes=100`, then `rows=100 bad=0 distinct_ids=100`, exit 0 each (`E` section 4) |
| P5: the scorer with and without `--lint`, then `node --test $G/tests/score-goal-lint.test.cjs` | Both print `rows=100 rubric=none unlabeled=100 stale=0 not_scored=0 labeled=0 no labeled rows`, no rate, `cmp`-identical. Tests 8 of 8. Exit 0 each (`E` section 4) |
| P6 and P9: `grep -n API_KEY` and `grep -n child_process` on both scripts, the scorer under the stub `PATH` | No match, exit 1 each. No stub log (`E` section 4) |
| P7: `validate.sh <this phase> --strict` at the build's end | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0 (`E` section 4) |
| P8: the lint on `specs/no-such-packet`, on `--bogus` and on a temp tree whose only goal has mode 000 | `ERROR specs/no-such-packet: packet not found`, `ERROR unknown option: --bogus`, `ERROR specs/a/goal.md: EACCES: permission denied`, exit 0 each (`E` section 4) |
| P10: the scorer on a temp labels copy with rubrics `a` and `mimo-02-strict-v1` | `rows=100`, `rubric mismatch: a,mimo-02-strict-v1`, no rate, exit 0 (`E` section 4) |
| P11: `git diff --quiet` on `create-goal-auto.yaml` | No diff, exit 0 (`E` section 4) |
| G2: `validate_document.py` on the eight changed skill docs | `Total issues: 0` on six. The playbook root and catalog root keep the one `document_type_fallback` note they had at baseline, and read 0 with `--type playbook` and `--type feature_catalog`. Exit 0 each (`E` section 4) |
| G3: playbook and catalog package validators | `PASS ... scenarios=9 categories=1 operator=9 ... violations=0 warnings=0`, then `WARN tier=warn violations=6`, the six baseline warnings. Exit 0 each (`E` section 4) |
| Other final checks | Skill-root metadata 16 of 16. Validation switch tests 7 passed. `check-goal.cjs <this phase>` 5 of 5. `hvr_scan.py` on the three new docs: 0 hard blockers. Em dashes: 0 in 12 of 13 targets, and `feature-catalog.md` keeps its 3 from HEAD (`E` section 4) |
| Session reruns from the final state | P1 and P5 under the stub `PATH`: the same counts, no stub log. Suite 40 of 40. P3 byte-identical, sha `4bf117a97684d37d` unchanged. Own schema pass `rows=100 bad=0 distinct_ids=100 distinct_hashes=100`. `API_KEY`, `child_process` and `--jev` or `--deem` greps: no match. P11 no diff. G2 and G3 as above. 0 em dashes in the 4 scripts and 3 new docs, no comment-hygiene match (session record) |
| Session: Hermes copy | `sync-skills-hermes.cjs --check` printed `DRIFT sk-create-goal`, exit 1. After `sync-skills-hermes.cjs` (`Wrote 1 of 73`) it printed `PASS: 73 Hermes skill copies in sync`, exit 0 (session record) |
| Review (Claude `review` agent, code by DeepSeek via Devin and MiMo via Pi) | PASS, no P0 and no P1. Confirmed no model arm, no `--jev` or `--deem` and no spawn, the port byte-identical to `check-goal.cjs:140-217`, six edge cases without a crash and the scorer arithmetic by hand: rule 4 0.5, 0.5 and 0.5, rule 5 1, 0.5 and 0.6667, Wilson `[0.3006,0.9544]` and `[0.0071,0.1954]`. REQ-012 and REQ-013 not built, as the gate requires. Six P2s recorded (session record) |
| Closure pass: read-only confirmations | `git diff --quiet` on `check-goal.cjs`, and from `996cf85eef` to HEAD, exit 0 each. `grep -n API_KEY` on both scripts, no match, exit 1. A `node -e` schema pass on the labels printed `rows=100 bad=0 distinct_ids=100 distinct_hashes=100`. `git status --short` on sk-create-goal, the hub catalog, the Hermes copy and the yaml printed nothing |
| Closure pass: `repair-derived.cjs --folder <this phase> --apply` | `inspected=1 repaired=1 failed=0`, exit 0, re-deriving the graph metadata after the doc edits. Rerun after this table was filled in |
| Closure pass: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0, 0 `RESULT: FAILED` lines. `STATUS_CROSS_DOC_CONSISTENCY` passed with both docs `Complete`. Rerun after this table was filled in |
| Closure pass: `check-goal.cjs <this phase>` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure pass: `goal.cjs packet <this phase> --workspace "$PWD"` | Exit 0, `STATUS=OK`, `packet_budget=unknown` and `packet_durable_chars=5308`, as expected for a phase child |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The labels are yours, and everything after them waits.** Adopt a rubric (T001), fill `rubric`, `rule4_ok`, `rule5_ok` and `labeler` on the 100 rows (T012) and run the scorer (T014). T015, T016 and T022 wait on the stop rule and the measured precision. Parent D4 puts all six outside this phase's completion.
2. **No precision or recall exists yet.** Rule 4 flags 1,017 of 1,485 scored lines under rubric A, and nobody has measured how many of those flags are right. The rate, the per-rule numbers and the stop decision are UNKNOWN until the labels.
3. **Six review P2 findings are open.** The scorer prints F1 as `n/a` when precision or recall has a zero denominator, though 2TP/(2TP+FP+FN) gives 0 (`score-goal-lint.cjs:119-122`). It scores a labeled row whose rubric is null and can print `rubric=null` in the stop line (`:143`, `:181`). Its in-process lint run drops errors, so `--root /nonexistent-root` prints `stale=1` and exit 0 with no `ERROR` line (`:317-318`). `scripts/README.md:93` says `check-goal.cjs --all` exits 2 when a goal cannot be read, but it also exits 2 on an unclosed frontmatter fence. `scripts/README.md:100` leaves out the scorer's exit 2 on a missing `--labels` or an unknown option. Every scorer command-line test passes `--lint`, so the default in-process run, `--root` and the `n/a` output have no test.
4. **Three derived paths are outside `spec.md`'s file list.** The Hermes copy and the two manifests came from repository tooling after the build, not from a brief, and are in `2139eb8c0d`.
5. **Coverage is partial by design.** The lint reaches goals authored through `/create:goal`. Native `/goal` strings, direct edits and `/goal-opencode set` bypass it.
6. **Seven lines are `lexical_unscored`.** Each has no word from the lint's English list, so neither rule scores it. Whether any is non-English was not checked.
7. **Two steps are left to others.** The trigger index rebuild is deferred until 005 is committed, so the index does not know this phase's new trigger phrases yet. `spec.md` asks for a refresh of `../changelog/` at close, but the parent folder has no `changelog/` directory and this closure pass may write only this folder's docs.
<!-- /ANCHOR:limitations -->

---
