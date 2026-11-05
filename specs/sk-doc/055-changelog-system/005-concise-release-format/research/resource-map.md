---
title: "Resource Map — Research how .skilled/skills/sk-doc/sk-create-changelog (SKILL.md, ROUTER.md, assets/changelog-template.md and references/) should change so that, by default and especially for releases with many changes, it produces the format of the republished release entry .skilled/changelog/skilled/v4.0.1.0.md at commit 6a93a2cfeb: concise, written for a person using the repository, maintainer-only detail left out (internal tooling, tie-break order, test and scenario lists, how the work was done), a short spec-folder line, an at-a-glance list in section order within the ceiling, topical sections with short benefit-led H4 items, small fixes folded into one bullet list, upgrade notes ordered by section, and a single sentence naming the components that got their own changelog entry. Compare it with the long version of the same entry (git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md), the canonical exemplar .skilled/changelog/skilled/v4.0.0.0.md and the current template, and name each rule that would have produced the short version. Find where the template, SKILL.md, references and the /create:changelog command YAMLs push the other way (for example the exemplar-wins rule, the ceilings, the expanded-format guidance, the keep and drop lists) and what validate_document.py or hvr_scan.py could check. Propose exact edits with file:line. Read-only: write only under the spec folder. Cite file:line for every finding."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 17
- **By category**: READMEs=0, Documents=2, Commands=4, Agents=0, Skills=11, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 005-concise-release-format
- **Generated**: 2026-11-05T20:28:08.209Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/v4.0.0.0.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=3; Iterations=3 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-changelog-auto.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/assets/create-changelog-confirm.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/assets/create-changelog-presentation.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/changelog.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/shared/assets/template-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/validate_document.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-changelog/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/references/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-changelog/references/topology-edge-cases.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-changelog/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-changelog/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py | Cited | OK | Citations=1; Iterations=1 |

---
