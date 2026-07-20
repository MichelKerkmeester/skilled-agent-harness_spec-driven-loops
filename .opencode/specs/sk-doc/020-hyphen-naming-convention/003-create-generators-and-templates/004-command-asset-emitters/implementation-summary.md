---
title: "Implementation Summary: command asset emitters"
description: "Create command assets now request, derive and display canonical kebab-case output paths while their current source filenames and schema keys remain stable."
trigger_phrases:
  - "create command asset emitter implementation"
  - "kebab case create command outputs"
  - "command asset output migration summary"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/004-command-asset-emitters"
    last_updated_at: "2026-07-20T11:09:35Z"
    last_updated_by: "codex"
    recent_action: "Completed kebab-case output contracts and regression coverage for create command assets"
    next_safe_action: "Integrate this child with the phase 003 parent after central review"
    blockers: []
    key_files:
      - ".opencode/commands/create/assets/tests/test_emitted_name_contract.py"
      - ".opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Current underscore command asset source filenames remain unchanged in this child."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-command-asset-emitters |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
| **Base** | `1ec0ad2947b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/create:*` command layer now emits canonical kebab-case names instead of advertising underscore paths. Catalogs, playbooks, skill resources, benchmark packages, command bundles, install guides and flowchart targets all share the same filesystem contract. Current command asset source filenames, schema keys and Python names stay unchanged.

### Emitted Path Contracts

Catalog output now starts at `feature-catalog/feature-catalog.md` with kebab-case category and feature names. Playbook output starts at `manual-testing-playbook/manual-testing-playbook.md` with kebab-case scenario directories and files. Skill resources use patterns such as `[topic]-workflow.md`, while command bundles use `<stem>-auto.yaml`, `<stem>-confirm.yaml` and `<stem>-presentation.txt`.

Benchmark output uses `benchmark-report.md` and `assets/conformance-benchmark/<benchmark-id>/conformance-benchmark.md`. Install guide examples use `install-guides/mcp-semantic-search.md`. Flowchart assets reject non-exempt underscore segments before writing.

### Regression Contract

The new regression fixture records all 33 root command assets and the emitted names each family owns. The Python test parses all 22 YAML assets, checks required and forbidden emitter tokens, confirms source filename stability and materializes representative auto and confirm trees in temporary directories.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/create/assets/create_skill_{auto,confirm}.yaml` | Modified | Emit kebab-case reference and asset filenames. |
| `.opencode/commands/create/assets/create_skill_parent_{auto,confirm}.yaml` | Modified | Emit the canonical manual testing playbook root. |
| `.opencode/commands/create/assets/create_feature_catalog_*` | Modified | Emit canonical catalog roots, categories and feature files. |
| `.opencode/commands/create/assets/create_manual_testing_playbook_*` | Modified | Emit canonical playbook roots, scenario directories and files. |
| `.opencode/commands/create/assets/create_benchmark_*` | Modified | Emit canonical benchmark report and conformance package names. |
| `.opencode/commands/create/assets/create_command_*` | Modified | Emit hyphenated auto, confirm and presentation asset suffixes. |
| `.opencode/commands/create/assets/create_readme_*` | Modified | Emit kebab-case install guide directories and filename prefixes. |
| `.opencode/commands/create/assets/create_flowchart_*` | Modified | Validate kebab-case output path segments. |
| `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json` | Created | Record source inventory and emitted path fixtures. |
| `.opencode/commands/create/assets/tests/test_emitted_name_contract.py` | Created | Verify YAML parsing, emitter tokens, source stability and temporary trees. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The migration changed emitted values and user-facing messages inside the existing source assets. It did not rename those assets or edit the phase 002 resolver and consumers. Focused tests bind each changed family to exact output tokens, then create separate auto and confirm trees under Python temporary directories. The phase 002 consumer matrix ran unchanged after the emitter edits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep current `create_*.yaml` and presentation filenames | Later migration phases own source asset renames, while this child owns emitted values only. |
| Preserve keys such as `benchmark_family` and `quick_ref` | These values identify workflow state or enum choices rather than filesystem output. |
| Keep `mcp_server`, Python filenames and exact tool names | The migration exemptions protect import packages, language conventions and tool contracts. |
| Use one fixture across auto and confirm route trees | Both routes must advertise the same names, so shared cases expose parity drift with less duplicate data. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m unittest discover .opencode/commands/create/assets/tests -v` | PASS, 4/4 tests. Initial fixture count assertion failed at 22 versus 30, then passed after correction to the real YAML count. |
| Temporary auto and confirm trees | PASS, `AUTO_FILES=22`, `CONFIRM_FILES=22`, `ZERO_NON_EXEMPT_UNDERSCORES=1`. |
| Phase 002 Python and JavaScript consumer matrix | PASS, `PY_JS_MATRIX_PASS=28` and `JS_MATRIX_PASS=16`. Unsupported, missing and coexisting roots fail closed. |
| Lane C scenario loading | PASS, sk-doc 32 and sk-code 30. |
| Alignment drift | PASS, 2 scanned files with 0 findings. |
| `git diff --check -- .opencode/commands/create/assets` | PASS, exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Source asset names remain underscore-based.** This child preserves all 33 current source filenames for later rename phases.
2. **Route evidence uses contract fixtures.** The test parses both workflow modes and materializes their output trees, but it does not run an interactive `/create:*` session.
<!-- /ANCHOR:limitations -->
