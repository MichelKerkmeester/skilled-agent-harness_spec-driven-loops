---
title: "Goal: Phase 7: docs-and-changelogs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "docs and changelogs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/007-docs-and-changelogs"
    last_updated_at: "2026-10-30T10:10:00Z"
    last_updated_by: "markdown-worker"
    recent_action: "Wrote every doc surface and proved the doc gates exit 0"
    next_safe_action: "The conductor writes one changelog entry per touched skill and closes the two changelog criteria"
    blockers: []
    key_files:
      - "scratch/touched-skills.md"
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-docs-and-changelogs"
      parent_session_id: null
    completion_pct: 85
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

- [x] `rg -c "/doctor:sk-skill" README.md .skilled/commands/README.txt` prints 1 or more for both files
- [ ] `.skilled/changelog/sk-doc/create-skill/` and `.skilled/changelog/sk-doc/parent/` each hold a new `v<version>.md` dated in this phase
- [ ] `validate_document.py --type changelog` exits 0 on every new changelog entry
- [x] `check_readme_references.py`, `ci-leaf-manifest-freshness.cjs` and `ci-skill-derived-freshness.cjs` each exit 0
- [x] `generate-router-intent-signals.cjs --check` and `ci-skill-root-metadata.cjs` each exit 0
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
| Phase planned | Done | Spec docs authored 2026-10-30 |
| Every doc surface written | Done | Root README, command index, scripts README, packet section 6, adopter guide, four playbook scenarios, one catalog entry and its root section |
| Doc gates | Done | Five exit codes of 0 in `scratch/after.md`, plus `compiled-route-sync.cjs --check` |
| Changelog entries | With the conductor | Four targets named in `scratch/touched-skills.md`, written once every phase has landed |

### Deviations and findings

| Item | Note |
|------|------|
| Two files already failed the reference gate | The playbook test-module table and the command index example. Both repaired so the gate exits 0 over the files this phase changes |
| The sk-doc leaf manifest did not change | Its config lists routed mode resources. Playbook scenarios and catalog entries are not resources, so `--fix` reported `fixed=0` and freshness stayed green |
| The activation manifest needed no refresh | `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` |
| No scenario run end to end | The fixtures live under `.skilled/skills/`, outside this phase's write authority. The check, fleet, JSON and plan forms were observed against shipped skills |
<!-- /ANCHOR:log -->
