---
title: "Feature Specification: Phase 3: alignment-fixes"
description: "Two alignment runs over the doctor ownership change found stale owners, counts, paths and brief patterns left behind. This phase fixes them and pins two routing behaviors the change moved."
trigger_phrases:
  - "alignment fixes"
  - "phase 3 alignment fixes"
  - "doctor ownership alignment findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/541-own-all-doctor-commands` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-playbook-consolidation |
| **Successor** | None |
| **Handoff Criteria** | Every in-scope finding of both alignment runs is fixed, and every gate matches the phase 2 final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the system-skilled-doctor owns every doctor command and holds the only doctor playbook specification.

**Scope Boundary**: the files the `/local-skilled-alignment` and `/local-doc-alignment doctor-ownership` runs named, plus the open changelog entries for this change.

**Dependencies**:
- Phases 1 and 2 complete and committed.

**Deliverables**:
- Every in-scope finding fixed, two pin tests, and the three open changelog entries extended.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 1 and 2 moved the owner and the playbook, but docs around them kept the old facts. Seven workflow files named the former owner, several counts still said eleven commands or 13 scenarios, and four routing scenarios expected brief lines the advisor no longer prints. Two behaviors also moved with the owner rows and had no test.

### Purpose
Every live doc and workflow states the ownership the code has, and the two moved behaviors are pinned.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n '^skill_owner' .skilled/commands/doctor/assets/*.yaml | grep -v system-skilled-doctor   (before)
doctor-ci-report.yaml:7:skill_owner: ".skilled/skills/sk-code/sk-code-ci/"
doctor-ci-scaffold.yaml:7:skill_owner: ".skilled/skills/sk-code/sk-code-ci/"
doctor-ci-toggle.yaml:7:skill_owner: ".skilled/skills/sk-code/sk-code-ci/"
doctor-git-setup.yaml:7:skill_owner: ".skilled/skills/sk-git/"
doctor-sk-code-setup.yaml:7:skill_owner: ".skilled/skills/sk-code/"
doctor-sk-skill-check.yaml:7:skill_owner: ".skilled/skills/sk-doc/sk-create-skill/"
doctor-sk-skill-convert.yaml:7:skill_owner: ".skilled/skills/sk-doc/sk-create-skill/"

$ printf '{"prompt":"Help me set up skilled",...}' | node .../user-prompt-submit.js   (head line)
Advisor: live; use system-skilled-doctor → /doctor:setup (run) 0.92/0.12 pass.
DOC-385 expected: ^Advisor: (live|stale); use /doctor:setup [0-9.]+/[0-9.]+ pass\.$
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Point the seven stale `skill_owner` lines at system-skilled-doctor.
- Correct the counts, paths and owner wording in the READMEs, playbooks and catalogs the runs named.
- Rewrite four routing scenarios to the brief the advisor prints, and move DOC-409 to the current state paths.
- Add the skill-setup phrases to the skill's `ROUTER.md` stage-two intent.
- Pin the provenance index, the deep-loop doctor on a writing-about prompt, and the typed skill-setup doctor command, and extend the three open changelog entries.

### Out of Scope
- The `mcp-browser-use` signal drift in the compiled skill graph - it predates this branch and needs the operator-gated reindex on main.
- The `access-telemetry.json` reference and the missing `cli/node_modules` - both are gitignored worktree state, not defects.
- Moving `CQ-023` or the two sk-code-ci foreign-repository scenarios - the parent spec keeps scenarios that test a skill mode with that skill; the docs now name them as the exception.
- The advisor's stage-one `graph-metadata.json` vocabulary - phase 1 recorded that wider wording outranks `/doctor:helper` and `/doctor:update`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/assets/doctor-{ci-report,ci-scaffold,ci-toggle,git-setup,sk-code-setup,sk-skill-check,sk-skill-convert}.yaml` | Modify | `skill_owner` names system-skilled-doctor |
| `README.md`, `.skilled/skills/system-skilled-doctor/{README.md,ROUTER.md}` | Modify | Seventeen commands, scenario wording, stage-two phrases |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/**` | Modify | Counts, environments, brief patterns, state paths |
| `.skilled/skills/{sk-code,sk-code/sk-code-ci,sk-git,system-spec-kit}/...` | Modify | Stale scenario references and the catalog overview |
| Two vitest files in system-skill-advisor and one in system-spec-kit | Modify | Pin tests |
| Three open changelog entries | Modify | The ownership move |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `skill_owner` in `.skilled/commands/doctor/assets/` names `.skilled/skills/system-skilled-doctor/` |
| REQ-002 | The four routing scenarios' brief patterns match what the advisor hook prints today |
| REQ-003 | Every gate the phase 2 final state recorded gives the same result or better |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No live doc the runs named still states eleven commands, 13 scenarios, five setup legs or a legacy state path |
| REQ-005 | The provenance test fails when the doctor index loses its provenance line |
| REQ-006 | The deep-loop doctor on a writing-about prompt and a typed skill-setup doctor command each have a pin test |
| REQ-007 | The skill's `ROUTER.md` matches the six skill-setup phrases its `SKILL.md` lists |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/local-skilled-alignment --recheck` on the earlier run reports the in-scope findings resolved.
- **SC-002**: The DOC-406 hook loop prints `use system-skilled-doctor → /doctor:helper (run)`, then `Also: /doctor:helper (run)` under `mcp-code-mode`, then no `/doctor:` text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The built advisor runtime in the worktree | Brief checks cannot run | It was built in phase 1; the hook runs from `dist/` |
| Risk | A stage-two phrase steals stage-one traffic | Low | The advisor never scores `ROUTER.md` keywords; phrase reach and the advisor vitest rerun |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A - docs, workflow metadata and tests only.

### Security
- **NFR-S01**: N/A - no permission or credential surface changes.

### Reliability
- **NFR-R01**: DOC-409's lock and state checks test the folder the engine writes, so a passing run means the files exist.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a scenario prompt that a bridge now catches no longer tests the helper hand-off, so DOC-406 takes prompts that still reach it.
- Maximum input: 61 findings across both runs collapse to about 30 distinct fixes.
- Failure path: the gitignored state folder never shows in `git status`, so DOC-409 checks its files with `test -s` instead.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 35 files, small edits each |
| Risk | 5/25 | No runtime code changes, only tests |
| Research | 8/20 | Live brief runs and the engine's state paths |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
