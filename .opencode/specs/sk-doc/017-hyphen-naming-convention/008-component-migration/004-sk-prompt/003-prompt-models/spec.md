---
title: "Feature Specification: prompt-models asset and reference names (017 phase 004.003)"
description: "The prompt-models packet has underscore-separated asset and reference filenames, including the model registry and budget data files that are named by active Markdown and skill references. This phase renames those packet-owned paths to kebab-case, updates path-valued consumers, and preserves model IDs, JSON keys, Python/package exemptions, and generated benchmark output."
trigger_phrases:
  - "prompt-models kebab-case migration"
  - "prompt-models asset filenames"
  - "sk-prompt phase 003 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the prompt-models L2 packet from its live asset and reference inventory"
    next_safe_action: "Execute the prompt-models path map after phase 002 handoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/README.md"
      - ".opencode/skills/sk-prompt/prompt-models/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/sk-prompt/prompt-models/assets/confidence_scoring_rubric.md"
      - ".opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json"
      - ".opencode/skills/sk-prompt/prompt-models/assets/per_model_budgets.json"
      - ".opencode/skills/sk-prompt/prompt-models/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The prompt-models benchmarks/** tree is owned by phase 005."
      - "models/_index.md is not an underscore-separated name and is not mechanically rewritten."
      - "Model IDs and JSON keys remain unchanged even when the containing data filename changes."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: prompt-models asset and reference names

> Phase adjacency under the sk-prompt component parent (grouping order, not a runtime dependency): predecessor `002-prompt-improve`; successor `004-manual-testing-playbook`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Phase 003 of the sk-prompt component subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The prompt-models packet contains `cli_prompt_quality_card.md`, `confidence_scoring_rubric.md`, `model_profiles.json`,
`per_model_budgets.json`, `context_budget.md`, `output_verification.md`, `pattern_index.md`, and `quota_fallback.md`.
These names are embedded in the packet skill, README, model profiles, and reference graph, so a safe rename must update
path values while leaving model IDs and data keys intact.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the four files in `prompt-models/assets/` to `cli-prompt-quality-card.md`, `confidence-scoring-rubric.md`, `model-profiles.json`, and `per-model-budgets.json`.
- Rename `context_budget.md`, `output_verification.md`, `pattern_index.md`, and `quota_fallback.md` under `prompt-models/references/` to kebab-case.
- Update active references in `prompt-models/SKILL.md`, `README.md`, model profiles, and packet-local reference documents.
- Parse the renamed JSON data files and prove that their keys and model IDs are unchanged.

### Out of Scope
- `prompt-models/benchmarks/**`, including generated run and archive output; phase 005 owns benchmark trees and dispositions.
- `references/models/_index.md`, which is not an underscore-separated word name and must not be changed mechanically.
- `prompt-models/changelog/**`; frozen history is checked by phase 006.
- `SKILL.md`, Python `.py` files, Python package directories, code identifiers, JSON keys, frontmatter fields, and generated output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `prompt-models/assets/{cli_prompt_quality_card,confidence_scoring_rubric}.md` | Rename | Hyphenated asset filenames; update active card/rubric links |
| `prompt-models/assets/{model_profiles,per_model_budgets}.json` | Rename | Hyphenated data filenames; preserve every JSON key and model ID |
| `prompt-models/references/{context_budget,output_verification,pattern_index,quota_fallback}.md` | Rename | Hyphenated reference filenames; update packet-local links |
| `prompt-models/SKILL.md`, `README.md`, and active model references | Reference update | Repoint path values without changing prompt-craft behavior |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | All eight packet-owned asset/reference names use kebab-case | The map contains four asset/data pairs and four reference pairs with unique targets |
| REQ-002 [P0] | Active consumers resolve the new filenames | `SKILL.md`, `README.md`, model profile links, and reference links contain no stale active source path |
| REQ-003 [P0] | Model/profile data semantics are preserved | Renamed JSON files parse and their keys, model IDs, profile values, and cross-reference semantics are unchanged |
| REQ-004 [P1] | Exemption and adjacent-phase boundaries are respected | No benchmark output, changelog history, Python/package name, tool-mandated name, `_index.md`, identifier, or JSON key is renamed |
| REQ-005 [P1] | The path map is dependency-closed and reversible | All active path values resolve after the rename and the map supports a clean git revert |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Eight prompt-models asset/reference names are kebab-case and every active path consumer resolves.
- **SC-002**: Model profile and budget data retain their exact key/model contract while filenames become canonical.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The highest-risk edge is confusing a filesystem rename such as `model_profiles.json` with a JSON-key rename such as
`model_profiles`. The phase depends on the program exemption rules and phase 002 boundary; JSON parse/key snapshots,
active-reference sweeps, and an explicit benchmark/changelog exclusion mitigate the risk.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; generated benchmark names and the non-snake `_index.md` path must be dispositioned explicitly in the execution evidence.
<!-- /ANCHOR:questions -->
