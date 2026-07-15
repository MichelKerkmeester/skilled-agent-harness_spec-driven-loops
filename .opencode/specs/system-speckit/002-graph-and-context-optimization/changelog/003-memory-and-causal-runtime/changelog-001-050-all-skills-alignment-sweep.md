---
title: "All Skills Alignment Sweep: 19-skill sk-doc compliance and current-reality audit"
description: "Doc-only sweep audited all 19 skills and root README surfaces against sk-doc templates and current runtime topology. Stale references were fixed across five batch commits. The average DQI proxy rose from 90 to 93."
trigger_phrases:
  - "all skills alignment sweep"
  - "skill docs audit"
  - "sk-doc compliance sweep"
  - "19-skill alignment"
  - "skill library documentation sweep"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The skill library had accumulated mixed current-state language across recent restructures: the standalone `system_skill_advisor` extraction, the `mk-code-index` code-graph rename, post-040 embedding behavior changes. sk-doc template hardening had also progressed. No single sweep had verified all 19 skills, leaving future agents exposed to stale routing guidance.

Five sequential batch commits audited every skill family against sk-doc validators and current runtime topology. CLI executor descriptions were trimmed to fit the 130-character discovery budget. Deep-loop skill docs were fixed for stale state-log names and generated `_TODO` tail sections. MCP integration install guides were aligned to sk-doc templates. The `sk-doc` flowchart assets and install-guide reference each received real overview sections to replace generated stubs. The root READMEs and `system-skill-advisor` docs were updated to reflect canonical `mk-code-index` naming and the standalone advisor topology. All 19 skills passed `quick_validate.py` at close-out and the average DQI proxy rose from 90 to 93.

### Added

- `research/skills-audit.md` audit ledger with per-skill baseline status, batch membership, DQI proxy scores and follow-on candidates
- Real overview sections in six `sk-doc` flowchart assets replacing generated `_TODO` stubs
- Real overview section in `deep-review/references/quick_reference.md` replacing generated `_TODO` tail
- Canonical `mcp__mk_code_index` tool naming in root `README.md` and `.opencode/skills/README.md`

### Changed

- `cli-claude-code`, `cli-codex` and `cli-gemini` SKILL.md descriptions trimmed to fit the sk-doc 130-character soft discovery budget
- `mcp-chrome-devtools` and `mcp-code-mode` INSTALL_GUIDE headers aligned to sk-doc install-guide template section titles
- `mcp-coco-index` primary docs updated to describe both `search` and `cocoindex_refresh_index` MCP tools and remove generated `_TODO` tails from three reference files
- `system-skill-advisor` SKILL.md, ARCHITECTURE.md, SET-UP_GUIDE.md and playbook scenarios updated from transitional compat-dist and wrong `skill-graph.sqlite` path language to current standalone topology
- Manual playbook in `deep-review` updated to use the canonical `review/deep-review-state.jsonl` state log name
- `sk-doc/references/install_guide_creation.md` cleaned of generated `_TODO` tail
- `cli-codex/references/hook_contract.md` duplicate generated `_TODO` section removed
- `system-spec-kit/feature_catalog/02--mutation/12-memory-retention-sweep.md` obsolete `54-tool count` reference corrected

### Fixed

- Generated `_TODO` tail in `deep-review/references/quick_reference.md` removed and replaced with a real overview so the doc validates as a reference
- Stale `system_code_graph` language in root README and `.opencode/skills/README.md` replaced with canonical `mk-code-index` naming
- Old advisor compat-dist path and transitional skill-graph dependency language in `system-skill-advisor` docs replaced with current standalone advisor topology
- Wrong `skill-graph.sqlite` path in advisor docs corrected to the current DB location

### Verification

| Check | Result |
|---|---|
| Baseline `quick_validate.py` for 19 skills | PASS. 19/19 valid. Three CLI soft warnings before Batch A. |
| Primary README validator | PASS. 21/21 valid for root and skill primary READMEs. |
| Batch A `quick_validate.py` | PASS. 4/4 valid with no warnings after description trims. |
| Batch B `quick_validate.py` | PASS. 4/4 deep-loop skills valid. |
| Batch B changed-doc validation | PASS. `deep-review/references/quick_reference.md` and playbook README both valid. |
| Batch C `quick_validate.py` | PASS. 3/3 MCP integration skills valid. |
| Batch C primary docs validation | PASS. 3 READMEs and 3 INSTALL_GUIDEs valid. Install guides retain one non-blocking section-0 warning. |
| Batch C changed references validation | PASS. `search_patterns.md`, `settings_reference.md` and `tool_reference.md` valid as references. |
| Batch D `quick_validate.py` | PASS. 5/5 sk-* skills valid. |
| Batch D changed-doc validation | PASS. Six flowchart assets validate as assets and `install_guide_creation.md` validates as reference. |
| Batch D stale-reference grep | PASS. No `_TODO`, old advisor extraction path or legacy `mcp__system_code_graph` matches in Batch D scope. |
| Batch E `quick_validate.py` | PASS. 3/3 system-* skills valid. |
| Batch E README validation | PASS. Root README, skills README and `system-skill-advisor` README valid. |
| Batch E changed-doc validation | PASS. Advisor SKILL, ARCHITECTURE, SET-UP_GUIDE, DB policy, advisor rebuild feature and three playbook scenarios all validate. |
| Final `quick_validate.py` for 19 skills | PASS. 19/19 valid. |
| Final primary README validation | PASS. 21/21 root and skill READMEs valid. |
| Final stale-reference grep | PASS. No active-doc matches for `_TODO`, old advisor compat paths, transitional skill-graph dependency, wrong advisor DB path or `54-tool count`. |
| Packet strict validation | PASS. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | Description trimmed to 130-character sk-doc budget |
| `.opencode/skills/cli-codex/SKILL.md` | Modified | Description trimmed to 130-character sk-doc budget |
| `.opencode/skills/cli-gemini/SKILL.md` | Modified | Description trimmed to 130-character sk-doc budget |
| `.opencode/skills/deep-review/references/quick_reference.md` | Modified | Generated `_TODO` tail removed. Real overview section added. |
| `.opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md` | Modified | State log name corrected to canonical `review/deep-review-state.jsonl` |
| `.opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md` | Modified | Section headers aligned to sk-doc install-guide template |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Modified | Primary docs updated to describe both MCP tools. Generated `_TODO` tail removed. |
| `.opencode/skills/mcp-coco-index/README.md` | Modified | Current-reality language updated for both search and cocoindex_refresh_index |
| `.opencode/skills/mcp-coco-index/references/search_patterns.md` | Modified | Generated `_TODO` tail removed |
| `.opencode/skills/mcp-coco-index/references/tool_reference.md` | Modified | Generated `_TODO` tail removed |
| `.opencode/skills/mcp-code-mode/INSTALL_GUIDE.md` | Modified | Section headers aligned to sk-doc install-guide template |
| `.opencode/skills/sk-doc/assets/flowcharts/approval_workflow_loops.md` | Modified | Real overview section added. Validates as asset. |
| `.opencode/skills/sk-doc/assets/flowcharts/decision_tree_flow.md` | Modified | Real overview section added. Validates as asset. |
| `.opencode/skills/sk-doc/assets/flowcharts/parallel_execution.md` | Modified | Real overview section added. Validates as asset. |
| `.opencode/skills/sk-doc/assets/flowcharts/simple_workflow.md` | Modified | Real overview section added. Validates as asset. |
| `.opencode/skills/sk-doc/assets/flowcharts/system_architecture_swimlane.md` | Modified | Real overview section added. Validates as asset. |
| `.opencode/skills/sk-doc/assets/flowcharts/user_onboarding.md` | Modified | Real overview section added. Validates as asset. |
| `.opencode/skills/sk-doc/references/install_guide_creation.md` | Modified | Generated `_TODO` tail removed. Validates as reference. |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | Standalone topology language. Wrong DB path corrected. Transitional language removed. |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified | Compat-dist path and transitional dependency language updated to current state |
| `.opencode/skills/system-skill-advisor/SET-UP_GUIDE.md` | Modified | Current advisor DB path and setup instructions corrected |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Standalone topology and canonical tool naming throughout |
| `.opencode/skills/README.md` | Modified | Updated to 19-skill inventory with canonical `mk-code-index` naming |
| `README.md` | Modified | Canonical `mk-code-index` code-graph references replacing legacy `system_code_graph` |

### Follow-Ups

- A follow-on packet (`016-runtime-config-mk-code-index-parity`) should migrate runtime config files (`opencode.json`, `.codex/config.toml`, `.gemini/settings.json`, possible launcher aliases) from legacy `system_code_graph` to canonical `mk_code_index` naming. Config and source edits were out of scope for this doc-only sweep.
