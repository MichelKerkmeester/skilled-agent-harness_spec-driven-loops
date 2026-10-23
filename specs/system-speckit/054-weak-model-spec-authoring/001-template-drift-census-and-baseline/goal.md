---
title: "Goal: Phase 1: template-drift-census-and-baseline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template drift census and baseline goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline"
    last_updated_at: "2026-10-23T11:27:19Z"
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
# Goal: Phase 1: template-drift-census-and-baseline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a verified ledger of every defect in the system-spec-kit templates, examples and authoring docs, and measure how well DeepSeek V4.1 Flash authors a Level 2 packet before any template changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes no file under `.skilled/`. Its writes land in this phase folder and in the throwaway tracks `specs/zz-bench-authoring/` and `specs/zz-bench-hints/`, which are deleted after use. |
| D2 | Three census lanes run at once: templates without examples, examples, and references with `SKILL.md`. |
| D3 | A ledger row is kept only when its evidence command reproduces on the start commit. |
| D4 | The baseline is three serial runs of the frozen task in `tasks.md` T009 on `llmgateway/deepseek-v4.1-flash-1017` at max. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/ledger/ledger.jsonl` parses with `jq`, and rerunning every row's `evidence_cmd` on the start commit prints its `evidence_expect`
- [ ] `scratch/ledger/ledger.jsonl` holds at least 18 leaked-description rows for example files, plus at least one row each for the `Checklist.md fully verified` lines, the write recipe's `<spec-folder>` line, the authoring checklist's `<spec-folder>` line and the style guide's `Why Bulleted Lists` heading
- [ ] `scratch/baseline/baseline.json` holds 3 runs, each with `strict_passed`, `leftover_hints`, `missing_anchors`, `out_of_scope_writes` and `seconds`
- [ ] `validate.sh` on this phase folder with `--strict` prints `RESULT: PASSED`
- [ ] `git status --porcelain` at phase close lists no changed path outside this phase folder
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
| Phase opened | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| check-placeholders.sh false positive | The scan prints `FAIL - 4 placeholder pattern(s) found` and exits 1 on four bracket strings inside fenced code blocks in `tasks.md`. A fenced block is not an unfilled placeholder, so the docs keep the literal commands and this entry records the scan result. |
<!-- /ANCHOR:log -->
