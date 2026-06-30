---
title: "Changelog: sk-design-interface root [143-sk-design-interface/root]"
description: "Packet-level changelog rollup for the completed sk-design-interface phase tree."
trigger_phrases:
  - "143 root changelog"
  - "sk-design-interface rollup"
  - "design skill packet"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/001-sk-design-interface` (Level Phase Parent)

### Summary

Spec 143 turned `sk-design-interface` into a standalone design judgment surface. The packet began by vendoring Anthropic's frontend-design guidance, then added measured design data, a quality floor, optional query tooling, a shared real-UI loop, Mobbin and Refero reference grounding, smart consultation rules and aligned reader-facing docs. The result is a skill that helps an agent name the default, critique it and depart from it deliberately, while staying lean enough to load and strict enough not to become a gallery, preset picker or implementation owner.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-install-claude-frontend-design`](./changelog-143-001-install-claude-frontend-design.md) | Complete | Installed the design judgment skill, preserved upstream guidance and registered advisor routing. |
| [`002-ui-ux-pro-max-merge-research`](./changelog-143-002-ui-ux-pro-max-merge-research.md) | Complete | Researched whether the `ui-ux-pro-max` repo should strengthen the skill and produced a merge recommendation. |
| [`003-ui-ux-pro-max-merge`](./changelog-143-003-ui-ux-pro-max-merge.md) | Complete | Added measured design data, quality references and query-only search without changing the upstream principles file. |
| [`004-doc-alignment-catalog-playbook`](./changelog-143-004-doc-alignment-catalog-playbook.md) | Complete | Aligned the skill docs to `sk-doc` standards with a feature catalog, playbook and reference template pass. |
| [`005-claude-design-parity-research`](./changelog-143-005-claude-design-parity-research.md) | Complete | Researched how `sk-design-interface` and `mcp-magicpath` could move closer to Claude Design behavior. |
| [`006-competitor-design-tools-research`](./changelog-143-006-competitor-design-tools-research.md) | Complete | Expanded the lens to v0, Lovable, Bolt, Figma Make, Subframe and adjacent tools for net-new ideas. |
| [`007-claude-design-parity-build`](./changelog-143-007-claude-design-parity-build.md) | Complete | Built the shared parity protocol and preview-image fidelity helper while keeping both skills lean. |
| [`008-doc-realignment`](./changelog-143-008-doc-realignment.md) | Complete | Realigned existing docs to the parity reality and reconciled feature and playbook counts. |
| [`009-mobbin-refero-design-reference-integration`](./changelog-143-009-mobbin-refero-design-reference-integration.md) | Complete | Added Mobbin and Refero MCP access as critique-against real-world reference grounding. |
| [`010-decouple-from-open-design`](./changelog-143-010-decouple-from-open-design.md) | Complete | Removed Open Design coupling from the live skill while preserving one-way use by `mcp-open-design`. |
| [`011-mobbin-refero-smart-routing`](./changelog-143-011-mobbin-refero-smart-routing.md) | Complete | Changed Mobbin and Refero from passive lookup to initiative, ask and fall-back routing. |
| [`012-catalog-playbook-realignment`](./changelog-143-012-catalog-playbook-realignment.md) | Complete | Catalogued and tested the Mobbin and Refero grounding capability and its routing behavior. |

### Added

- A new `sk-design-interface` skill with `SKILL.md`, `README.md`, `graph-metadata.json`, upstream `LICENSE.txt` and preserved `references/design_principles.md`.
- MIT design data under `assets/data/`, distilled quality references, design inventory docs and optional stdlib-only query search.
- A `feature_catalog/`, `manual_testing_playbook/` and `assets/data/README.md` aligned to the `sk-doc` template family.
- Cross-checked research packets for the `ui-ux-pro-max` merge, Claude Design parity and competitor design-tool ideas.
- A shared real-UI loop, first as `claude_design_parity.md` and later vendor-neutral as `real_ui_loop.md`.
- Mobbin and Refero Code Mode manuals, tool catalogs and `design_references_mcp.md` for critique-against use.
- Smart routing rules that decide when to consult Mobbin or Refero, when to ask and when to fall back.
- Catalog and playbook coverage for the design-reference grounding capability.

### Changed

- `sk-code` gained a reciprocal sibling edge, and the skill catalog plus root README counts moved from 22 to 23 when the skill was installed.
- `SKILL.md` evolved from lean design guidance into a routed design judgment skill that still stayed under its word caps at each validation point.
- `graph-metadata.json` gained trigger phrases, key files and later dropped Open Design edges when the skill became standalone.
- `mcp-magicpath` was connected to the shared design loop and later kept as a transport partner while `sk-design-interface` stopped depending on it.
- Existing docs were reconciled after the parity build, then again after smart Mobbin and Refero routing.
- Open Design naming was stripped from live `sk-design-interface` content, while `mcp-open-design` kept the reverse mandatory judgment relationship.

### Fixed

- Restored missing license and notice files after a concurrent worktree deletion during the documentation alignment phase.
- Fixed graph and catalog consistency issues, including sibling edge symmetry, key-file pointers and skill-count rows.
- Confirmed `mcp-open-design` coupling was removed from live `sk-design-interface` content without removing the reverse relationship.
- Closed the documentation gap where Mobbin and Refero capability existed in the skill but was not catalogued or covered by the playbook.

### Verification

| Check | Result |
|-------|--------|
| Skill packaging | PASS: `package_skill.py` validated `sk-design-interface` across the install, data, docs and parity phases, and `mcp-magicpath` validated where touched. |
| Skill graph | PASS: `skill_graph_scan` indexed the installed node and `skill_graph_validate` returned `errorCount 0` after the reciprocal edge work. |
| Advisor routing | PASS: `advisor_recommend` surfaced `sk-design-interface` for a design prompt with confidence 0.92 and uncertainty 0.12. |
| Deep research fan-outs | PASS: the 002, 005 and 006 fan-outs completed with 2 of 2 lineages succeeded and merged 27, 15 and 8 findings. |
| Document validation | PASS: `validate_document.py` returned 0 issues on authored catalog, playbook and reference docs where run. |
| Packet validation | PASS: `validate.sh --strict` passed on the research, parity, decoupling and realignment phases where recorded. |
| Live reference tooling | PASS: Mobbin and Refero manuals resolved, OAuth liveness returned auth challenges and `mobbin_search_screens` returned real screen data on Node 24. |
| Coupling removal | PASS: Open Design naming was removed from live `sk-design-interface` content, while the reverse `mcp-open-design` relationship stayed intact. |
| Task completion | PASS: all phase task counts were recorded complete, ranging from 10 to 17 completed task items per child phase. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-design-interface/` | Created and updated | Runtime skill, references, data, docs, playbook, catalog, scripts, licenses and metadata. |
| `.opencode/skills/sk-code/graph-metadata.json` | Modified | Reciprocal sibling edge to `sk-design-interface`. |
| `.opencode/skills/mcp-magicpath/` | Modified | Design loop pointers, canvas-side rules, fidelity helper and docs. |
| `.opencode/skills/mcp-open-design/` | Modified | Reverse transport documentation after the design skill was decoupled. |
| `.opencode/skills/sk-prompt/design_generation_patterns.md` | Modified | Repointed after the decoupling work. |
| `.opencode/skills/README.md` | Modified | Catalog row and skill counts. |
| `README.md` | Modified | Root skill highlight, skills-table row and count. |
| `.utcp_config.json` | Modified | Mobbin and Refero mcp-remote manuals. |
| `.opencode/specs/design/001-sk-design-interface/*` | Created and updated | Phase packet docs, research outputs and completion evidence. |

### Follow-Ups

- The skill guides design judgment. Implementation remains owned by `sk-code`.
- Guidance from Anthropic is vendored, not live. Re-vendor if upstream changes should be adopted.
- The advisor graph may need a maintenance rescan after metadata changes.
- The live Mobbin and Refero path depends on connected subscriptions and Code Mode running on Node 24.
- The real-UI loop is documented and has a stdlib helper, but the full loop still needs end-to-end exercise on a live MagicPath project.
- Catalog and playbook scenarios are operator-run where marked manual.
