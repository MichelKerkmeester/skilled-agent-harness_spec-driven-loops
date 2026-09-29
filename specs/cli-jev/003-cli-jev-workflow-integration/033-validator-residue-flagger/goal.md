---
title: "Goal: Phase 33: validator-residue-flagger"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "validator residue flagger goal"
  - "score-residue-flagger completion criteria"
  - "residue flagger keep rule"
  - "correctness traceability flag verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger"
    last_updated_at: "2026-09-29T15:30:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R26 from the round-3 research"
    next_safe_action: "Build to the label gate in number order, released 2026-09-29 (parent goal D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/033-validator-residue-flagger/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-033-validator-residue-flagger"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 33: validator-residue-flagger

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem `noul` flags correctness and traceability defects in document passages better than today's review table, which flags none, through one read-only deep-review script whose default run makes zero model calls and counts the committed finding rows first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-residue-flagger.cjs` and `residue-flagger-labels.jsonl` in `.skilled/skills/system-deep-loop/deep-review/scripts/`, new `scripts/tests/score-residue-flagger.test.cjs`, two README rows and, per parent D6, deep-review's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No review table, template, reducer or finding changes, and no column is added |
| D2 | Labels: 100 passages drawn with a recorded seed, each read at the first parent of the commit that added its review file. 50 cited by a correctness or traceability finding and 50 from the same documents that no finding cites, 25 per category each. The operator labels all 100, because a finding is a reviewer's claim. No model writes a label. Until 100 exist every run prints `stop: fewer than 100 labeled rows` |
| D3 | The baseline is flag-nothing, the review table today. Only tracked files are read, never `.env` |
| D4 | Keep rule per column, in order: at least 90 percent of rows measured, precision at least 0.8 else `kill (precision)`, a 10-point gain, a one-sided sign test below 0.05 and a Jev flip rate of at most 0.10 over 3 reruns (a Deem `noul` holds by its commit pair). Baseline above 0.90 prints `no headroom`, and under 5 `defect` rows `underpowered`. Offline only |
| D5 | Jev first, else Deem. A Jev arm runs behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A Deem arm runs behind `--deem` after `cli-deem health` passes. A failure prints one skip line and changes nothing. One `--provider P`, no key in any file, no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` exits 0, prints finding rows per severity and dimension and either `stop: fewer than 100 labeled rows` or a `baseline:` and headroom line, and stub `jev` and `cli-deem` first on `PATH` log zero calls
- [ ] With `--deem --out <dir>` and a stub health reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub `jev` whose `auth status --provider official` exits 3 it prints the `jev` path and provider, then `jev arm skipped: no credential`. Each exits 0 with its other output byte-identical to the default run
- [ ] `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` exits 0 with at least 18 passed and 0 failed
- [ ] After the operator labels 100 rows, each backend whose gate passed printed one `verdict <backend>:` line of `keep`, `kill (precision)` or `stop (<reason>)` from a live `--out` run with a `calls.jsonl` holding `wallMs` and `exitCode` on every line, or the zero-call run printed `no headroom` or `underpowered`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and `validate_document.py` exits 0 on each changed deep-review doc
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Spec authoring | Done | 2026-09-29, docs only, from `../007-classifier-deep-research/research/research.md:886-905` (R26), `:460-480`, `:113` (K9), `:1042`, `:1045`, `:1047` and `:1076`, plus the glm-04, mimo-02 and mimo-08 iterations and the mimo lead's steer. Status Planned |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Nothing built |

### Deviations and findings

| Item | Note |
|------|------|
| Seam pinned | R26's seam row names no `file:line`, only "the deep-review findings tables". Pinned 2026-09-29: the four dimensions at `deep-review/SKILL.md:306-313`, the severity scale at `assets/prompt-pack-iteration.md.tmpl:53`, the iteration narrative at `:113` and the JSONL finding record at `:157` |
| Count corrected | R26's metric carries "62 post-pass findings a week". That is mimo-02's post-validation edit rate, cut by the invocation-only rerun to 193 passing invocations in 40 days, unscoped (K9 and the mimo lead's steer at `:152`). glm-04's 50 true and 12 false flags a week rest on it (`:204`). This phase recounts from committed files and uses neither |
| Rough corpus count | 5,862 tracked `.md` files match the review corpus rule on 2026-09-29 (this leaf's `git ls-files` count, against mimo-02's 5,830). Finding tables use several header shapes, so the census reads by header |
<!-- /ANCHOR:log -->
