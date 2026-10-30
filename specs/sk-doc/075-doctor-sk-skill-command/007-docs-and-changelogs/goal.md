---
title: "Goal: Phase 7: docs-and-changelogs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "docs and changelogs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/007-docs-and-changelogs"
    last_updated_at: "2026-10-30T05:21:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-docs-and-changelogs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: docs-and-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Document `/doctor:sk-skill` on every reader-facing surface and record the program's changes in each touched skill's changelog.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every changelog entry is written by sk-doc's create-changelog mode through the skill's `.skilled/changelog/` link. |
| D2 | sk-code gets an entry only when a script under `sk-code-skilled/assets/scripts/` changed. |
| D3 | Generated manifests change only through their generator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c "/doctor:sk-skill" README.md .skilled/commands/README.txt` prints 1 or more for both files
- [ ] `.skilled/changelog/sk-doc/create-skill/` and `.skilled/changelog/sk-doc/parent/` each hold a new `v<version>.md` dated in this phase
- [ ] `validate_document.py --type changelog` exits 0 on every new changelog entry
- [ ] `check_readme_references.py`, `ci-leaf-manifest-freshness.cjs` and `ci-skill-derived-freshness.cjs` each exit 0
- [ ] `generate-router-intent-signals.cjs --check` and `ci-skill-root-metadata.cjs` each exit 0
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
| Phase planned | Pending | Spec docs authored 2026-10-30 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has started |
<!-- /ANCHOR:log -->
