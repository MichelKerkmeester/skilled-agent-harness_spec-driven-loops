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
    last_updated_at: "2026-09-29T14:30:00Z"
    last_updated_by: "spec-leaf"
    recent_action: "Authored the Planned phase from research R13"
    next_safe_action: "Build per plan.md in number order, released 2026-09-29 (parent D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-022-alignment-folder-suggestion"
      parent_session_id: null
    completion_pct: 0
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

- [ ] From `.skilled/skills/system-spec-kit/runtime/cli`, `npx tsx evals/score-alignment-suggestion.ts --report <dir>` exits 0, prints below-50 counts per save path and `alternatives listed:` once for `validateContentAlignment` and once for `validateFolderAlignment`, and stub `jev` and `cli-deem` binaries first on `PATH` log zero calls
- [ ] On a synthetic rows file with 29 labeled rows, `score-alignment-suggestion.ts --score` prints `stop: fewer than 30 labeled rows` and exits 0, and `--rows-out` given a path inside the repository exits 2
- [ ] `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` exits 0 with at least 18 passing tests, among them a `verdict deem: keep`, a `stop (margin)` and a `jev arm skipped: payload not accepted`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-alignment-suggestion.ts` exits 1, and `git status --porcelain` is identical before and after the runs in criteria 1 and 2
- [ ] `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on system-spec-kit's `SKILL.md`, `README.md` and new changelog file and on both `tooling-and-scripts/alignment-suggestion-measurement.md` files
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
| Spec authored | Done | 2026-09-29: spec, plan, tasks and this goal written as Planned from research R13, docs only. Nothing is built |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Labels | Operator, past the gate | At least 30 labeled rows. Not part of this phase's completion |

### Deviations and findings

| Item | Note |
|------|------|
| Committed events 2026-09-29 | Two below-50 events, both 0% and hard-blocked with no alternatives listed, in one archived fanout log under `specs/sk-doc/z_archive/016-create-diff-mode/`. One 60% event in a scratch trace. No committed record names a final folder |
| CLI path lists nothing (inferred) | The argument save calls `validateContentAlignment` with the specs root (`folder-detector.ts:1034-1045`), which holds 0 folders matching `^\d{3}-`, and it bypasses any pick (`:1047-1049`). The path replay confirms or refutes this |
| Seam lines rechecked 2026-09-29 | `alignment-validator.ts:73-75` and `:503-520` resolve unchanged. The file has not changed since 2026-09-17. The alternatives the research names are listed at `:522-545` |
| Printed score | The warning prints the base score while the decision uses the higher domain-aware score (`:489-493`), so the census bands by the decision line |
<!-- /ANCHOR:log -->
