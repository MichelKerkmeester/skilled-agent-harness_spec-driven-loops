---
title: "Goal: Phase 10: validator-false-positives"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/010-validator-false-positives"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-010-validator-false-positives"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 10: validator-false-positives

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Clear the catalog and skill package validator false positives the feature-catalog track handed off, each with a test that fails before the change.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Drop exempting output file names in root rows: no rule tells an output name from a missing leaf without a per-document allowlist, a second source of truth; the findings are warnings. |
| D2 | Drop allowlisting .opencode/specs: it names a path absent from the checkout, and hiding it would also hide a real broken path; the wording is the document owner's. |
| D3 | Bump no hub version; the master bumps each hub once at merge. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 .skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py`, run from the repository root, exits 0.
- [ ] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py`, run from the repository root, reports 0 failed.
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py --check .skilled/skills/sk-git 2>&1 | grep -c 'Unexpected file type'`, run from the repository root, prints 0.
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py --check .skilled/skills/sk-code 2>&1 | grep -c 'recommended section'`, run from the repository root, prints 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/010-validator-false-positives --strict`, run from the repository root, prints RESULT: PASSED.
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
| Phase planned | Done | spec.md, plan.md, tasks.md and this goal written by the orchestrator |
| Findings read and weighed | Done | orchestrator |
| Catalog validator | Done | t3-p010a |
| Package validator | Done | t3-p010b, fixture rule widened by the orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| Phase added after the plan | Handoff from the feature-catalog track into the tooling scope |
<!-- /ANCHOR:log -->
