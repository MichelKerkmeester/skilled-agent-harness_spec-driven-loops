---
title: "Changelog: Phase 18: epic-docs-alignment [034-spec-folder-tooling/018-epic-docs-alignment]"
description: "Chronological changelog for the Phase 18: epic-docs-alignment phase."
trigger_phrases:
  - "spec folder tooling epic docs alignment changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-10

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The spec-folder tooling epic shipped commands and checks that the docs did not yet describe. This phase brings the playbooks, feature catalogs, READMEs, doctor docs and release changelogs in line with that code, so an operator or tester who reads a doc gets what the tool does now. A docs audit found 26 such gaps, and each one is fixed or checked in its file.

### Added

- F21 (instance-only): the sweep README says a folder missing from a loaded baseline is new-failure, and first-run only when no baseline loaded (.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md)
- F25 (cross-consumer): Gate 3 option C reads "as an existing packet in the same track" in the worked examples and trigger config (.skilled/skills/system-spec-kit/references/workflows/worked-examples.md, .skilled/skills/system-spec-kit/references/memory/trigger-config.md). The command asset carries the same wording under lane D (.skilled/commands/speckit/assets/speckit-implement.yaml)
- F26 (instance-only): the spec-kit changelog for v2.7.1.0 is a new file, because the SKILL.md version moved to 2.7.1.0 (.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md)
- F26 (supporting): the SKILL.md version moves from 2.7.0.0 to 2.7.1.0 (.skilled/skills/system-spec-kit/SKILL.md)
- Run the document validator on each changed or new markdown file outside specs/: 40 pass, and 2 index READMEs fail their detected type identically at HEAD and pass as readme (scratch/evidence/validate-docs.txt)
- CHK-012 Error handling implemented. Not applicable: no code changed

### Changed

- Read the 26 findings in scratch/audit-findings.md, plus the packet spec, plan and acceptance criteria (scratch/audit-findings.md)
- Rerun the step 1 gates on the current tree and save each output with its exit status (scratch/evidence/playbook-spec-kit.txt, playbook-sk-git.txt, catalog.txt, links.txt, gate3-parity.txt, hook-gates.txt, doctor-compat.txt)
- Check each of F01 to F26 against its named file with grep, and save the checks (scratch/evidence/findings-check.txt, findings-check-b.txt, findings-check-c.txt, f18-and-children.txt)
- Check the two document validator failures against HEAD. Both HEAD copies were validated from a temp directory that was deleted by its exact path afterward (scratch/evidence/validate-docs.txt, followup-verify.txt)
- F01 (instance-only): the hook-gate playbook expects thirteen rows and GATES=13 (.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md)
- F02 (cross-consumer): the doctor-commands index lists the compat scenario DOC-381, and the scenario file exists (.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md, doctor-update-compat.md)

### Fixed

- Rerun the removed-behavior search with its flags placed before --. The first form returned rc=2 because -- ends option parsing, so the corrected run is the usable receipt (scratch/evidence/removed-behavior.txt, removed-behavior-corrected.txt)
- F09 (class-of-bug, playbook side): eleven scenarios added, DOC-381 and 466 to 475, and indexed in the playbook index (.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md, the ten tooling-and-scripts/ files and doctor-update-compat.md)
- F13 (class-of-bug, playbook side): the phase folder creation scenario checks graph metadata and a strict pass (.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/phase-folder-creation.md)
- F09 (class-of-bug, catalog side): seven entries added, one each for anchor integrity and nesting, heal anchor repair, heal lane modes, the repo era report, the phrase lint commit gate, the downgrades report and the reversibility manifest, all indexed in the catalog (.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/, feature-catalog.md)
- F13 (class-of-bug, catalog side): lifecycle automation names the graph metadata derivation and the phrase seeding (.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md)
- F13 (class-of-bug, README side): the create.sh row names the graph metadata derivation and the phrase seeding for 18 kinds (.skilled/skills/system-spec-kit/runtime/cli/spec/README.md)

### Verification

- Playbook, system-spec-kit - Exit 0, 0 violations, 1 warning (PROMPT_UNSYNCED, present before this phase)
- Playbook, sk-git - Exit 0, 0 violations, 0 warnings
- Feature catalog, system-spec-kit - Exit 0, 85 warnings, 0 failures
- Markdown links - 7,945 files, 14,105 links, 0 broken
- Document validator, 42 changed .md files outside specs/ - 40 pass. Two index READMEs fail their detected type identically at HEAD and pass as readme
- Gate 3 menu parity - 12 pass, 0 fail, rc=0
- Hook gate list - STATUS=OK GATES=13 OFF=0, rc=0
- Doctor compat suite - 21 pass, 0 fail, rc=0

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- ENV-REFERENCE.md lists SYSTEM_SPEC_GATE_DISABLED twice at lines 76 and 209, with conflicting metadata, so /doctor:env stops on it. Confirmed by grep, not run.
- The compat YAML does not say whether an owed recovery step counts as a planned move for the dirty-roots check. Reported by the review, not rerun.
- The compat YAML may write run-complete only on success, and may read a missing layout-map script as collisions. Inferred from the YAML, not run.
- The Gate 3 parity test covers twelve files and does not cover speckit-implement.yaml, worked-examples.md or trigger-config.md. Confirmed in the test's file list.
- The CLI test suite creates temporary folders in the real specs/ root. Reported by the review, not rerun.
- Two documentation gaps and one broken path. The spec README omits the completedAt manifest field that upgrade-legacy.mjs:494 writes. retrieval/lib/README.md line 23 names ../retrofit-convention.mjs, which does not exist. The file is runtime/cli/ops/retrofit-convention.mjs. The link checker reads markdown links only, so it does not catch a code-span path.
