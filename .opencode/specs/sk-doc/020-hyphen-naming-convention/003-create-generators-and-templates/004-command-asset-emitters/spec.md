---
title: "Feature Specification: command asset emitters (020 phase 003 child 004)"
description: "The `/create:*` auto, confirm, and presentation assets still contain output rules and examples that can emit underscore paths. Update the emitter logic to request and write kebab-case names while leaving the asset source filenames and later on-disk renames untouched."
trigger_phrases:
  - "create command asset emitter naming"
  - "hyphenate create command outputs"
  - "create auto confirm output paths"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
    last_updated_at: "2026-07-18T06:38:11Z"
    last_updated_by: "codex"
    recent_action: "Completed kebab-case emission contracts and regression coverage for create command assets"
    next_safe_action: "Integrate this child with the phase 003 parent after central review"
    blockers: []
    key_files:
      - ".opencode/commands/create/assets/tests/test_emitted_name_contract.py"
      - ".opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters/implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: Command Asset Emitters

> Parallel child under `003-create-generators-and-templates`; this child changes emitter instructions only, not the current asset filenames or repository-wide rename state.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child 004 of phase 003 in the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `/create:*` command assets are executable workflow contracts: their YAML steps and presentation contracts choose target paths, filename patterns, validation messages, and completion summaries. Several still say `snake_case`, `feature_catalog`, `manual_testing_playbook`, or use underscore filename patterns, so the command layer can emit a noncanonical path even after packet-local generators are corrected.

Update the emitter logic in the auto, confirm, and presentation assets so every generated non-exempt directory and filename is kebab-case. Keep YAML keys and workflow field names unchanged, preserve exact tool-mandated names, and leave the source asset filenames for later migration phases 008/013.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The content of the `/create:*` auto, confirm, and presentation assets under `.opencode/commands/create/assets/` for skill, skill-parent, feature-catalog, manual-testing-playbook, readme, agent, command, changelog, flowchart, and benchmark workflows.
- Output path derivation, filename patterns, name-format questions, validation diagnostics, completion summaries, and generated-tree assertions in those assets.
- Alignment with child 001's create-skill/package contract, child 002's catalog/playbook contract, child 003's other generator contracts, and phase 002's fail-closed consumer behavior.
- Temporary command-run fixtures that inspect the paths the assets instruct the workflow to write.

### Out of Scope
- Renaming the current source files such as `create_skill_auto.yaml` or `create_feature_catalog_confirm.yaml`; their on-disk names are deferred to phases 008/013.
- Renaming existing commands, skills, catalogs, playbooks, benchmark trees, or other repository content.
- Changing YAML/JSON mapping keys, workflow state field names, code identifiers, frontmatter fields, Python filenames/package directories, or tool-mandated filenames.
- Reimplementing packet-local generator behavior owned by children 001-003; this child projects the output contract into the command emitter layer.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every command asset family has an inventory of emitted filesystem names | The auto, confirm, and presentation assets for each listed `/create:*` workflow are enumerated, and each output path/filename rule has an owner and expected canonical form. |
| REQ-002 | Skill and parent-skill command assets emit names accepted by child 001 | Full-create and parent-hub flows request/derive kebab-case skill names, resource output names, packet/storage directories, and package paths while preserving tool/exempt names. |
| REQ-003 | Catalog/playbook command assets emit names accepted by child 002 and phase 002 | Command output examples and path patterns use `feature-catalog` and `manual-testing-playbook` roots and hyphenated leaves; generated new-only trees pass phase 002 typed-consumer checks and both-root fixtures fail closed. |
| REQ-004 | Readme, agent, command, changelog, flowchart, and benchmark assets emit child 003 names | Each workflow's output path, filename pattern, validation message, and result summary describes the same kebab-case contract proved by child 003. |
| REQ-005 | Asset source names and data keys are not conflated with emitted names | Existing underscore source filenames and YAML/JSON keys remain unchanged in this child; only filesystem names written or requested by the workflow change. |
| REQ-006 | Command runs prove the emitter contract without a repository rename | Representative auto/confirm routes write to temporary targets, and a recursive output listing contains no non-exempt underscore path segment. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every `/create:*` command asset emits or requests kebab-case output names consistent with its packet contract.
- **SC-002**: The command asset source filenames and non-filesystem schema keys remain stable until their assigned migration phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main failure mode is changing a YAML key or source asset path while intending to change only an emitted filename. Keep the inventory split into source paths, data keys, and output values. Catalog/playbook assets also depend on phase 002: the new root must be typed correctly, and both physical roots must be rejected rather than selected arbitrarily.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; emitter scope, source-file rename timing, and the exemption boundary are fixed by the parent assignment and DR-002/DR-003/DR-005/DR-008.
<!-- /ANCHOR:questions -->
