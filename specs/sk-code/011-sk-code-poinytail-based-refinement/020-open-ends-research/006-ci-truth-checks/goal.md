---
title: "Goal: Phase 6: ci-truth-checks"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ci truth checks goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/006-ci-truth-checks"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-020-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: ci-truth-checks

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every pull request fail on a feature-catalog package failure or on a citation it newly breaks, while older citation debt prints as one non-blocking count.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | What the scanner resolves stays unchanged. The gate imports its resolver and widens nothing. |
| D2 | A citation is keyed by its citing file plus its cited target, not by the line it sits on, so a citation that only moved is not new. |
| D3 | Only the unresolved and past-end statuses count as broken. |
| D4 | A pull request blocks on a new broken citation. A push only reports. |
| D5 | The catalog validator and its fixture test block from their first run, with no new warn tier. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs`, run from the repository root, exits 0.
- [x] `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py && python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py`, run from the repository root, exits 0.
- [x] `grep -cE 'cite-drift-gate\.mjs --base|validate_catalog_package\.py$|test_validator_fixtures\.py$' .github/workflows/sk-doc-script-tests.yml`, run from the repository root, prints 3.
- [x] `actionlint .github/workflows/sk-doc-script-tests.yml`, run from the repository root, prints nothing and exits 0.
- [x] `node .skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs --base HEAD`, run from the repository root, exits 0 and its last line ends with `older unresolved or past-end citations, not blocking`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/006-ci-truth-checks --strict`, run from the repository root, prints RESULT: PASSED.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal` |
| Gate, workflow, changelogs | Done | Gate test 5/5, catalog 29 PASS, actionlint clean, simulated PRs exit 1 and 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Merge base | The workflow passes `git merge-base "$BASE_SHA" HEAD`, since the pull-request checkout is a merge commit |
| Symlinked docs | A second dispatch made the gate skip symlinks; the first build counted 36 extra citations the scanner never sees |
<!-- /ANCHOR:log -->
