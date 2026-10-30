---
title: "Feature Specification: Phase 7: docs-and-changelogs"
description: "After phase 6 the /doctor:sk-skill command works, but no README, command index, skill doc, catalog, playbook or changelog names it. This phase documents the command on every listed surface and writes one changelog entry per skill whose files the program touched."
trigger_phrases:
  - "docs and changelogs"
  - "phase 7 docs and changelogs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: docs-and-changelogs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented, open on the conductor's changelog entries |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/281-doctor-skill-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-convert-plumbing |
| **Successor** | 008-hub-gap-report |
| **Handoff Criteria** | Every doc surface in section 3 names `/doctor:sk-skill`, each touched skill has a new changelog file reachable through its `.skilled/changelog/` link, and the five doc gates in REQ-005 exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Doctor skill command: check and convert a skill to the Skilled format and wire it into the advisor specification.

**Scope Boundary**: Documentation and changelog files only, plus the generated sk-doc metadata those edits make stale. No script, route or workflow behavior changes here.

**Dependencies**:
- Phase 2 (`002-check-plumbing`) and phase 6 (`006-convert-plumbing`): the `check` and `convert` targets exist, so the docs describe shipped behavior.
- sk-doc's create-changelog mode (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`) writes every changelog entry, at `.skilled/changelog/{component}/v{VERSION}.md` (`:24`).

**Deliverables**:
- The root README doctor list and Doctor section, `.skilled/commands/README.txt`, the doctor scripts README and the sk-create-skill docs name the command.
- New sk-create-skill manual-testing scenarios, one sk-doc feature-catalog entry, and a doctor-family example in the sk-create-command playbook when it lists family examples.
- One changelog entry per touched skill, written through create-changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README lists the doctor commands at `README.md:213` and describes each in the Doctor section near `README.md:1247-1257`, and `.skilled/commands/README.txt:128` says "Eleven command files cover the diagnostic surface". None of them names `/doctor:sk-skill`. The sk-create-skill canon still says there is no convert-in-place path (`upgrading-a-skill-to-v4.md:79, 95`, design section 1), which the new command contradicts once it ships.

### Purpose
A reader who opens any of the listed doc surfaces finds `/doctor:sk-skill check` and `convert` described the same way, and each skill the program changed carries a dated changelog entry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "/doctor:sk-skill" README.md .skilled/commands/README.txt
exit 1
$ sed -n 128p .skilled/commands/README.txt
Eleven command files cover the diagnostic surface, one per owner. Backed by `_routes.yaml`, `mcp-doctor.sh`, interactive YAML workflows, and the live environment switch reference.
$ rg -l doctor .skilled/skills/sk-doc/sk-create-command/manual-testing-playbook
exit 1
```
Run in the worktree on 2026-10-30. The last command shows the sk-create-command playbook lists no doctor-family example today.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `/doctor:sk-skill` to the doctor list at `README.md:213` and an entry with its `check` and `convert` targets to the Doctor section near `README.md:1247-1257`.
- Add a row to `.skilled/commands/README.txt:130-140` and keep the command-file count at `:128` true; add the new scripts and the two libs to `.skilled/commands/doctor/scripts/README.markdown` sections 2, 3, 5 and 6.
- Update the sk-create-skill docs: `SKILL.md` section 6, `references/skill/upgrading-a-skill-to-v4.md` sections 1 and 5, new scenarios under `manual-testing-playbook/standalone-skill/`, and one entry in `.skilled/skills/sk-doc/feature-catalog/`.
- Write one changelog entry per touched skill through create-changelog, through each skill's `.skilled/changelog/` link.
- Regenerate the sk-doc leaf manifest with `ci-skill-root-metadata.cjs --fix --skill sk-doc`, and refresh `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` only if its freshness check reports drift (design section 3 marks this inferred, to confirm here).

### Out of Scope
- The framework release changelog under `.skilled/changelog/skilled/` - phase 10 writes it.
- Any behavior change to scripts, routes or YAML - phases 1 to 6 own them.
- Docs for the hub gap report and the mirror fix - phases 8 and 9 add their own lines if they change a documented surface.

### Changelog targets

`.skilled/changelog/` holds one entry per component. A standalone skill is a link to its own folder (`system-skill-advisor -> ../skills/system-skill-advisor/changelog`); a hub is a real directory with `parent` plus one link per packet with the leading `sk-` dropped (`sk-doc/create-skill -> ../../skills/sk-doc/sk-create-skill/changelog`), observed with `ls -la .skilled/changelog` on 2026-10-30.

| Skill | When | Write through |
|-------|------|---------------|
| sk-create-skill | Always: its SKILL.md, reference and playbook change | `.skilled/changelog/sk-doc/create-skill/` |
| sk-doc hub | Always: its feature catalog and leaf manifest change | `.skilled/changelog/sk-doc/parent/` |
| sk-create-command | When `assets/command-contract.json` or its playbook changed (phases 2, 6, this phase) | `.skilled/changelog/sk-doc/create-command/` |
| system-skill-advisor | When `command-bridges/scoring-compatibility.json` or the generated bridges changed (phases 2, 6) | `.skilled/changelog/system-skill-advisor/` |
| sk-code (`sk-code-skilled`) | Only when a script under `sk-code-skilled/assets/scripts/` changed; decision D3 uses them in place | `.skilled/changelog/sk-code/code-skilled/` |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Doctor list (`:213`) and Doctor section entry (near `:1247-1257`) |
| `.skilled/commands/README.txt` | Modify | Count line (`:128`) kept true, and the Skill Format Check row |
| `.skilled/commands/doctor/scripts/README.markdown` | Modify | Directory tree, key files, diagnostic entrypoints and mutation boundaries for `sk-skill-check.cjs`, `sk-skill-convert.cjs` and the two libs |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | Section 6 REFERENCES names the command |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | Modify | Sections 1 and 5 point at `/doctor:sk-skill convert` for a single skill |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/*.md` | Create | Scenarios: check a skill, convert an older Skilled skill, convert a plain skill, refuse a hub candidate |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index the new scenarios |
| `.skilled/skills/sk-doc/feature-catalog/<category>/<entry>.md` and `feature-catalog.md` | Create, Modify | One entry for the command |
| `.skilled/skills/sk-doc/sk-create-command/manual-testing-playbook/` | Modify (conditional) | A doctor-family example only if the playbook lists per-family examples |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Modify | Regenerated by `ci-skill-root-metadata.cjs --fix`, never by hand |
| `<skill>/changelog/v<next>.md` per the table above | Create | Written by create-changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg -c "/doctor:sk-skill" README.md .skilled/commands/README.txt .skilled/commands/doctor/scripts/README.markdown .skilled/skills/sk-doc/sk-create-skill/SKILL.md` prints a count of 1 or more for each file. |
| REQ-002 | Each skill in the changelog table that meets its "When" condition has a new `v<version>.md`, and `ls .skilled/changelog/<link>/v<version>.md` resolves through the link. |
| REQ-003 | Every changelog entry is written by sk-doc's create-changelog mode and passes `python3 .skilled/skills/sk-doc/scripts/validate_document.py <entry> --type changelog`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The new playbook scenarios and catalog entry pass `validate_document.py` with `--type playbook_feature` and `--type feature_catalog`. |
| REQ-005 | `check_readme_references.py`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` and `generate-router-intent-signals.cjs --check` all exit 0 (design phase 7). |
| REQ-006 | `upgrading-a-skill-to-v4.md` no longer states that no convert-in-place path exists for a single skill; it names `/doctor:sk-skill convert` and keeps the hub path at `/create:skill-parent`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five doc gates in REQ-005 exit 0 after the edits.
- **SC-002**: Every changelog link named in section 3 resolves to a folder holding the new entry.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | create-changelog mode | Without it the entries would be hand-written and drift from the changelog template | Load `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` and let it compute each four-part version |
| Risk | Adding sk-doc docs leaves the sk-doc leaf manifest and compiled-routing manifest stale | Med | Run `ci-skill-root-metadata.cjs --fix --skill sk-doc` and the two freshness gates before closing |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documentation only; no runtime path changes.
- **NFR-P02**: N/A: no service.

### Security
- **NFR-S01**: No doc, scenario or changelog names an operator-local private skill or command; the only `local-` mention is the generic refusal rule.
- **NFR-S02**: Scenario fixtures use invented skill names (design R10).

### Reliability
- **NFR-R01**: Every link the edits add resolves under `check_readme_references.py`.
- **NFR-R02**: The doc descriptions of `check` and `convert` match the router's target table word for word on target names and flags.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill whose "When" condition is false (sk-code when no `sk-code-skilled` script changed) gets no changelog entry, and the phase log records why.
- Maximum input: a hub component writes to its packet link (`sk-doc/create-skill`), never to `parent`, unless the hub's own files changed.
- Failure path: a changelog link that does not resolve fails REQ-002; repair the link before writing the entry, never write into a dangling path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 15 doc files and up to five changelog entries |
| Risk | 6/25 | Docs only; generated manifests are regenerated |
| Research | 5/20 | Confirm which skills changed across phases 1 to 6 |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the compiled-routing activation manifest for sk-doc need a refresh? Decision: refresh only when its freshness check reports drift.
- Does the sk-create-command playbook list per-family examples? Decision: add a doctor example only if it does; on 2026-10-30 `rg -l doctor` over it finds none.
<!-- /ANCHOR:questions -->

---


