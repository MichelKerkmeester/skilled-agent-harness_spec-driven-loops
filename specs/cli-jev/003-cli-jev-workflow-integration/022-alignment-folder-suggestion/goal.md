---
title: "Goal: Phase 22: alignment-folder-suggestion"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "alignment folder suggestion goal"
  - "score-alignment-suggestion completion criteria"
  - "alignment label gate"
  - "below-50 census verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion"
    last_updated_at: "2026-09-29T16:53:36Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase at the label gate: build commit ba70806077, all goal criteria ticked"
    next_safe_action: "Operator labels 30 rows, then one live Deem run and a Jev run on their yes"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-022-alignment-folder-suggestion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 22: alignment-folder-suggestion

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count below-50 alignment saves per save path with zero model calls, show which path can list a folder to suggest, and build the gold research R13 lacks up to a 30-row label gate, with a tested scorer that past the gate judges a Jev or Deem folder pick against the better free answer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `evals/score-alignment-suggestion.ts` and `tests/score-alignment-suggestion.vitest.ts` in `.skilled/skills/system-spec-kit/runtime/cli/`, two README rows and, per parent D6, system-spec-kit's `SKILL.md`, README, changelog, catalog and playbook. No validator, detector or save changes |
| D2 | The census bands events by the validator's decision line on both paths, over committed text and, on request, an operator-named transcript directory, and prints counts only. A path replay runs both validator functions non-interactively to show which lists alternatives |
| D3 | Gold is an interactive pick in a transcript or an operator label. No model writes a label. Rows go only to a file outside the repository. Below 30 labeled rows the scorer prints `stop: fewer than 30 labeled rows` and this phase closes there |
| D4 | Spec section 4's Keep Rule decides each column past the gate, in order: coverage `10*M >= 9*K`, `kill` when P(X >= L) <= 0.05, a gain of at least 10 points over the better of the target and the top alternative, sign test p < 0.05 and flips `10*F <= 3*M`. A keep serves nothing |
| D5 | Jev first, else Deem (parent D1). Jev needs `jev 0.6.2`, `jev auth status --provider P` exiting 0 and, because rows are the operator's session text, the payload gate of 003's D9. Deem needs a passing `cli-deem health` and runs when the payload gate is not accepted. A failed gate prints one skip line and exits 0. No key in any file |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] From `.skilled/skills/system-spec-kit/runtime/cli`, `npx tsx evals/score-alignment-suggestion.ts --report <dir>` exits 0, prints below-50 counts per save path and `alternatives listed:` once for `validateContentAlignment` and once for `validateFolderAlignment`, and stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [x] On a synthetic rows file with 29 labeled rows, `score-alignment-suggestion.ts --score` prints `stop: fewer than 30 labeled rows` and exits 0, and `--rows-out` given a path inside the repository exits 2
- [x] `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` exits 0 with at least 18 passing tests, among them a `verdict deem: keep`, a `stop (margin)` and a `jev arm skipped: payload not accepted`
- [x] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-alignment-suggestion.ts` exits 1, and `git status --porcelain` is identical before and after the runs in criteria 1 and 2
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on system-spec-kit's `SKILL.md`, `README.md` and new changelog file and on both `tooling-and-scripts/alignment-suggestion-measurement.md` files
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R13, docs only. Nothing was built |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Done | 2026-09-29: code briefs 01 to 08 (with 01b, 01c, 02b and 03b) through Devin `deepseek-v4-1-flash-max`, doc briefs d01 to d09 through Pi `llmgateway/mimo-v2.6-pro` at `high`, all `STATUS: DONE`, plus fix briefs `f1` to `f4`. `S` is 1,567 lines and `T` 772 lines with 42 cases. Committed as `ba70806077`, 12 files. Source: `BE` section 3, `SE` sections 1, 3 and 5 |
| Zero-call run | Done | G1 rerun from the final state, exit 0, 0 stub calls: `committed: files=6 events=3 skipped_source=1`, `committed path cli: aligned=0 moderate=1 low=2 infrastructure=0 below50=2 with_alternatives=0 without_alternatives=2 hard_blocks=2 picks=0`, `committed path data:` all zero, `replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0`, `replay data: validateFolderAlignment root=synthetic numbered_folders=3 decision=low alternatives listed: 2`, `transcript events: not measured`. Source: `SE` section 2 |
| Label gate | Done | G2 from the final state: `--transcripts <empty dir> --rows-out <file>` exit 0 with `rows written: 0`; `--score <rows> --deem --out <dir>` exit 0, `stop: fewer than 30 labeled rows (0 labeled)`, no arm, the `--out` folder not created, 0 stub calls; `--report ./inside-report` exit 2, `refused: --report path is inside the repository`. The 29-label boundary case asserts `stop: fewer than 30 labeled rows (29 labeled)` and passes at 30 (`T:349-383`). Source: `SE` section 2 |
| Tests and suites | Done | G3: `Tests 42 passed (42)`, exit 0. The `cli` project suite `Test Files 158 passed | 3 skipped (161)`, `Tests 1644 passed | 19 skipped (1663)` against the baseline's 157 files and 1,602 tests (+1 file, +42 tests). Typecheck, both import policy checks and the architecture boundary check exit 0, code route `Findings: 0`. Source: `SE` section 2 |
| Skill docs | Done | Briefs d01 to d09 wrote the nine docs, `validate_document.py` exits 0 on all nine and `sync-skills-hermes.cjs --check` prints `PASS: 72 Hermes skill copies in sync`. Source: `SE` sections 1 and 2 |
| Review and commit | Done | Pi MiMo on the code `VERDICT: PASS` (REQ-001 to REQ-009 met, 3 P2), Devin DeepSeek on the docs `VERDICT: PASS` (REQ-001 to REQ-010 met, 5 P2), recheck `VERDICT: PASS`. Committed as `ba70806077`, 12 files, not pushed; the trigger index follows in its own commit. Source: `SE` sections 3, 4 and 5 |
| Labels | Operator, past the gate | At least 30 operator labels on a rows sheet built from the operator's transcripts (`--transcripts <dir> --rows-out <file>`). No label exists and no model writes one. Not part of this phase's completion (parent D4, `SE` section 5) |
| Live runs | Operator, past the gate | After the labels: one `--deem --out <dir>` run and, on the operator's flag and after stripping secrets, one `--jev --accept-payload --out <dir>` run. Each verdict line goes into this log. Not part of this phase's completion (parent D4, `SE` section 5) |
| Phase docs | Done | Closure pass 2026-09-29: `spec.md`, `tasks.md`, this goal and `implementation-summary.md` record the evidence and correct the stale premises. Gate results are in `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| Committed events 2026-09-29 | Two below-50 events, both 0% and hard-blocked with no alternatives listed, in one archived fanout log under `specs/sk-doc/z_archive/016-create-diff-mode/`. One 60% event in a scratch trace. No committed record names a final folder |
| CLI path lists nothing | The argument save calls `validateContentAlignment` with the specs root (`folder-detector.ts:1034-1045`), which holds 0 folders matching `^\d{3}-`, and it bypasses any pick (`:1047-1049`). It was inferred from the code and a listing; the path replay confirms it: `replay cli: validateContentAlignment root=specs numbered_folders=0 decision=low alternatives listed: 0` (`SE` section 2) |
| Seam lines rechecked 2026-09-29 | `alignment-validator.ts:73-75` and `:503-520` resolve unchanged. The file has not changed since 2026-09-17. The alternatives the research names are listed at `:522-545` |
| Printed score | The warning prints the base score while the decision uses the higher domain-aware score (`:489-493`), so the census bands by the decision line |
| Dispatch 01 wrote nothing | The first code dispatch spent its budget reading packet docs and repository files, wrote no file and exited 0. Re-dispatched as 01b naming only the two files to open (`BE` section 3) |
| Header rules anchored at the line start | The build contract anchored the header rules at the line start, so a JSON log line opening with the header (`{"output":"   Alignment check: ...`) lost its target. 01c made the header rules match anywhere on a line; decision lines stay anchored (`BE` section 3) |
| `isPathInsideRoot` arguments swapped | Dispatch 02 passed the path first, but `shared/utils/path-containment.ts:36` takes the root first, so the refusal case did not fire and the focused run scanned the real repository. 02b swapped the arguments and moved the case's path under `SKILL.md`, a file, where a broken refusal can neither write nor scan (`BE` section 3) |
| Stray `no-such-report-dir/` at the worktree root | The failing run after dispatch 02 wrote `report.json` there, with the pre-03b census shape. The session moved the folder to its scratchpad, not deleted (`BE` "Stray folder", `SE` sections 1 and 6) |
| Quoted template counted as an event | The smoke run after 03 counted a brief quoting the validator's `Warning: INFRASTRUCTURE MISMATCH (` template as a data-path event. 03b matched the decision rules to the validator's whole printed line, digits where it prints numbers; the rerun prints `events=3` (`BE` section 3, `W/runs/smoke-03b.txt`) |
| Executors changed mid-build | The operator said "Dont use opus" and "No Claude leaves". The session stopped the Opus 5.5 xhigh build leaf after dispatch 09a, which renamed a parameter Devin found already in place and wrote nothing, and ran the nine doc briefs through Pi. Parent D5 now says only Devin and Pi write (`SE` section 1) |
| Review fix 1: rows-writer wording | The changelog and the catalog entry said `--rows-out` writes one row per event, while the writer keeps only low or infrastructure events that list alternatives. Both now say so (`SE` section 3, `f1`, `f2`) |
| Review fix 2: catalog version | The catalog entry carried `version: 4.3.0.0`, now `4.4.0.0` (`SE` section 3, `f1`) |
| Review fix 3: catalog shorthand | The catalog entry's overview used the build brief's shorthand `S` for the script, now "The script measures" and "It holds". The same search over every doc committed for 019, 020, 023, 024 and 035 found no other case (`SE` section 3, `f1`) |
| Review fix 4: root and leaf description | The catalog package warned `root_leaf_description_mismatch` on the new entry. The root block's description now equals the entry's frontmatter and the package is back to the baseline's `violations=85` (`SE` section 3, `f3`) |
| Review fix 5: evals README tree | The evals README tree omitted the script. One tree line added (`SE` section 3, `f4`) |
| P2 findings, recorded, not chased | Parent D5. 1: the arm-start `jev auth test` record in `calls.jsonl` uses `status: "auth"` with `row_id: null`, outside REQ-007's three statuses. 2: a retried exit-4 call leaves one record, not one per spawn. 3: the rows writer can emit `target: null` when a data-path event's header sits more than 8 lines from its decision, and `--score` then rejects the whole file with `bad row at line N`. 4: the Jev auth-test call has no exit-4 retry, and exit 130 prints `auth test failed` where phase 002 prints `interrupted`. 5: the trigger index is stale for the new docs until the session rebuilds it in its own commit (`SE` section 3) |
| Completion criterion amended in `tasks.md` | "No `[B]` blocked tasks remaining" now reads "... other than T019", because parent D4 closes phases 019 to 035 at their label gate and keeps the labels and the model runs as operator items |
<!-- /ANCHOR:log -->
