---
title: "Goal: Phase 3: versioned-placeholder-gate"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "versioned placeholder gate goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate"
    last_updated_at: "2026-10-23T12:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: versioned-placeholder-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make an unfilled template hint fail validation once a new packet leaves Draft, by turning the core template hints into value tokens stamped v2.3 and giving the validator a Draft lifecycle for v2.3 docs only, with no change to the verdict of any existing packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The grammar is the existing `[YOUR_VALUE_HERE: ...]` token. No new token is added. |
| D2 | A doc stamped v2.3 or later warns on an unfilled token while `spec.md` has the Status Draft and errors at any other status. A doc with an older stamp or none keeps its old error. `[NEEDS CLARIFICATION:` is an error everywhere. |
| D3 | Both the orchestrator function `validatePlaceholders` and the shell rule `check-placeholders.sh` get the lifecycle, and one test file compares them. |
| D4 | Only the five templates `core/spec.md.tmpl`, `core/plan.md.tmpl`, `core/tasks.md.tmpl`, `core/implementation-summary.md.tmpl` and `addons/acceptance-criteria.md.tmpl` are converted, by `convert_hints.py`, and the scaffolder's own placeholders stay as they are. |
| D5 | Every edit is made by a tool or a quoted heredoc. No worker model edits a file in this phase. |
| D6 | The phase closes on a failing-first test, three red mutations, identical strict counts over `specs/` before and after, a suite match plus the new test, and one read-only review through `cli-devin` with `swe-2-max`. |
| D7 | The post-edit scanner, the era report and `upgrade-level.sh` are not edited. Their side effects are recorded as operator items. |
| D8 | The phase makes no commit. The operator commits. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run --config ../../vitest.config.ts --project cli tests/placeholder-token-gate.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime/cli`, prints `Tests  5 passed (5)`, `scratch/test-red.txt` shows it failed once before the code change, and `tasks.md` T010 printed `M1_RED`, `M2_RED`, `M3_RED` and `GREEN_AGAIN`
- [ ] The five templates hold 214 value tokens, `LEFTOVERS_SAME` printed in T011, and `rg -n 'SPECKIT_TEMPLATE_SOURCE:[^|]*\| v2\.2'` over them prints nothing
- [ ] A Level 1 scaffold in `specs/zz-bench-gate/` validates `RESULT: PASSED` with a `PLACEHOLDER_FILLED` warning at Draft, shows an `error` at Complete and shows an `error` with a v2.2 stamp, and the track is deleted
- [ ] `scratch/census/a-before.tsv` equals `a-after.tsv`, and the path, verdict and placeholder columns of `b-before.tsv` equal those of `b-after.tsv`
- [ ] `python3 -I "$PHASE/scratch/tools/suite_compare.py" "$P1/scratch/baseline/suite-start.txt" "$PHASE/scratch/suite-end.txt" 1 5` prints `SUITE_MATCH_PLUS_NEW_TEST`
- [ ] `rg -c 'PLACEHOLDER\]' .skilled/skills/system-spec-kit/references/templates/template-guide.md` prints nothing, `validation-rules.md` holds the lifecycle section, and `scratch/review/T019.txt` holds only `P0`, `P1` or `P2` lines or the single line `NO FINDINGS`, with each P0 and P1 line fixed
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate --strict` prints `RESULT: PASSED`, `git status --porcelain` lists no changed path outside the file list in `spec.md` section 3 and this phase folder, and `git log -1 --format=%H` still prints the start commit
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
| Phases 1 and 2 closed, templates original (T001) | Pending | |
| Tools checked (T002) | Pending | |
| Phase start commit | Pending | |
| Build runs this checkout, no `FOREIGN` line (T003) | Pending | |
| Six tools saved (T004) | Pending | |
| Conversion tool tested on a copy (T005) | Pending | |
| Census before: Gate A and Gate B totals (T006) | Pending | |
| Failing test red (T007) | Pending | |
| Orchestrator block replaced and built (T008) | Pending | |
| Shell rule replaced, test green, harness green (T009) | Pending | |
| Three mutations red (T010) | Pending | |
| Templates converted, stamped, manifest updated (T011) | Pending | |
| Reference docs fixed (T012) | Pending | |
| Snapshot regenerated, template tests green (T013) | Pending | |
| Scaffold smoke test (T014) | Pending | |
| Census after and compare (T015) | Pending | |
| Ledger rows owned by this phase (T016) | Pending | |
| Suite compared with the phase 1 start (T017) | Pending | |
| Scope check (T018) | Pending | |
| Frontier review and findings (T019, T020) | Pending | |
| Phase closed, nothing committed (T021) | Pending | |

### Operator items

Write each as a row in the table below with its probe output when T016 runs. The numbers shown were observed while this phase was planned.

| Item | Note |
|------|------|
| OP-1 era report flip | The manifest bump makes `repo-era.mjs` count every v2.2 stamp as `legacy`. In this repository `signals.templateMarkers` went from `{"new":16871,"legacy":2374,"none":510}` to `{"new":1421,"legacy":17824,"none":510}`. `/doctor:update check` reads the legacy count as a pre-v4 signal. Options: accept, teach the era report that v2.2 is still current for old docs, or hold the manifest bump. The operator decides before a release. |
| OP-2 post-edit scanner | `runtime/cli/spec/check-placeholders.sh` exits 1 on a hint inside a fenced block and exits 0 on a line that holds a value token after the word Priority. After this phase the hook no longer reports unfilled tokens in new packets. Candidate ledger row for a later phase. |
| OP-3 upgrade-level | `upgrade-level.sh` renders template sections into an older doc without touching its stamp, so a v2.2 doc gains tokens that error. The planning run found one existing test that hard-codes the v2.2 plan stamp, `upgrade-legacy.vitest.ts`, and T013 fixes that line. Check the two `upgrade-level` suites in T017. |
| OP-4 other docs | `README.md` lines about `check-placeholders.sh` and `assets/template-mapping.md` still say `[PLACEHOLDER]`. Phase 7 owns the README alignment. |
| OP-5 phase 2 commit | `../002-template-and-example-defect-repair/tasks.md` T017 makes a local commit, while `../goal.md` section 3 says the swarm makes none. This phase makes none. The operator reconciles the two. |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
<!-- /ANCHOR:log -->
