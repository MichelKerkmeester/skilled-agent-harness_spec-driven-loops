---
title: "Goal: Phase 7: playbook-catalog-readme-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook catalog readme alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment"
    last_updated_at: "2026-10-23T15:55:00Z"
    last_updated_by: "author"
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
# Goal: Phase 7: playbook-catalog-readme-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every behavior phases 2 to 5 create one operator scenario, one catalog entry and an aligned paragraph in each doc that describes it, so a weak model reads the same rule wherever it looks.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The eight new scenarios live in one new category, `manual-testing-playbook/template-authoring/`, with IDs 476 to 483. |
| D2 | The catalog gets four new leaves under `feature-catalog/tooling-and-scripts/`, one per surface, with one root entry each. |
| D3 | This phase verifies the phase 3 edits in `template-guide.md` and `validation-rules.md` and does not write them again. |
| D4 | Scenarios 476, 477 and 478 create a throwaway track under `specs/zz-pb-*` and remove it in the last step. Scenarios 479, 480 and 482 use a `mktemp -d` folder and remove it. Scenario 481 reads `SKILL.md` with no fixture. Scenario 483 creates `specs/zz-pb-card/001-card-authoring` and removes it. |
| D5 | The eight scenario texts, the four catalog texts and every old and new doc string are frozen in `plan.md` before the first dispatch. |
| D6 | Phase 8 runs the scenarios. This phase only proves that each file is well formed and that every command names a path that exists. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --format text` prints `violations=0` and exits 0, and the root index lists each id 476 to 483 exactly once, so a count over the eight ids prints `8`
- [ ] `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-spec-kit` prints `PASS: 0 violations`
- [ ] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `VALID` for every edited or created document
- [ ] `vitest run runtime/cli/tests/playbook-provenance-paths.vitest.ts` prints `Tests  3 passed (3)` and `vitest run runtime/cli/tests/workflow-invariance.vitest.ts` prints `Tests  2 passed (2)`
- [ ] The spec-kit suite at close matches `scratch/baseline/suite-start.txt` on the `Test Files`, `Tests` and `exit=` lines
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED` with `Errors: 0`
- [ ] `git status --porcelain` at phase close lists no changed path outside the file table in `spec.md` section 3 and this phase folder
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
| Start commit | Pending | |
| Suite baseline recorded | Pending | |
| Lane A scenarios written | Pending | |
| Lane B catalog written | Pending | |
| Lane C docs aligned | Pending | |
| Playbook index updated | Pending | |
| Catalog index updated | Pending | |
| Package validators green | Pending | |
| Frontier review done | Pending | |
| Phase closeable | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| Reference overlap with phase 3 | Phase 3 replaces five `PLACEHOLDER` lines in `template-guide.md` and inserts the lifecycle section in `validation-rules.md`. This phase verifies both and writes only the summary rows phase 3 leaves. |
| Placeholder scan false positive | `spec/check-placeholders.sh` reports the value token examples inside fenced code blocks in `plan.md` and `tasks.md`. A fenced block is not an unfilled placeholder, so the docs keep the literal commands and this entry records the scan result. |
| Changelog line left as shared template text | The `spec.md` Changelog line names `../changelog/` and phase 9 writes the packet changelog. |
| decision-record.md line left as shared template text | The acceptance criteria waiver line names `decision-record.md`, and the ADRs live in `plan.md` L3. The line is shared template text in every phase. |
| Generated metadata refresh | A spec-doc edit changes the hashed source docs, so `repair-derived.cjs --apply` re-derives `graph-metadata.json` after the last doc write. No file other than `graph-metadata.json` changed in that repair. |
<!-- /ANCHOR:log -->
