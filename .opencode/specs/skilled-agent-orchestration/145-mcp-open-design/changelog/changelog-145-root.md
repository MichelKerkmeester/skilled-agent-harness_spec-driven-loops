---
title: "Changelog: mcp-open-design root [145-mcp-open-design/root]"
description: "Root rollup for the completed mcp-open-design phase-parent packet."
trigger_phrases:
  - "145 root changelog"
  - "mcp-open-design root"
  - "open design rollup"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design` (Level Phase Parent)

### Summary

This packet turned Open Design from a researched possibility into the live design transport for agent work. It built `mcp-open-design`, de-vendored and strengthened `sk-design-interface`, added `sk-prompt` support for design-generation briefs and retired `mcp-magicpath` after the local terminal path was live-verified. The final doctrine is simple: Open Design is the transport, `sk-design-interface` is the mandatory design judgment and the docs now reflect the live multi-turn run flow rather than the early one-shot assumption.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-terminal-control-and-integration-research`](./changelog-145-001-terminal-control-and-integration-research.md) | DONE | Researched terminal control, skill shape and de-vendor ordering against local source and the installed app. |
| [`002-mcp-open-design-skill-build`](./changelog-145-002-mcp-open-design-skill-build.md) | DONE | Built the first `mcp-open-design` skill package at commit `0508518ac9`. |
| [`003-sk-design-interface-evolution`](./changelog-145-003-sk-design-interface-evolution.md) | DONE | Removed MIT-derived assets from `sk-design-interface` and rewired it to live Open Design reads. |
| [`004-validation-and-docs`](./changelog-145-004-validation-and-docs.md) | DONE | Live-verified generation, proved `od artifacts create` behavior and remediated deep-review findings. |
| [`005-sk-design-interface-variation-diversity`](./changelog-145-005-sk-design-interface-variation-diversity.md) | DONE | Added a grounded variation-diversity mechanism for multi-direction design briefs. |
| [`006-sk-prompt-design-tool-usecases`](./changelog-145-006-sk-prompt-design-tool-usecases.md) | DONE | Added `sk-prompt` guidance for assessing and improving design-generation prompts. |
| [`007-mcp-open-design-generation-flow-correction`](./changelog-145-007-mcp-open-design-generation-flow-correction.md) | DONE | Corrected every run-direction doc to the live multi-turn generation flow. |
| [`008-mcp-magicpath-deprecation`](./changelog-145-008-mcp-magicpath-deprecation.md) | DONE | Deleted the superseded `mcp-magicpath` skill and re-centered design docs on Open Design. |
| [`009-design-skill-integration-test`](./changelog-145-009-design-skill-integration-test.md) | DONE | Compared MiMo and DeepSeek on identical grounded design briefs. |
| [`010-design-playbook-live-run-and-refinement`](./changelog-145-010-design-playbook-live-run-and-refinement.md) | DONE | Ran all 13 manual playbook scenarios live and refined the gaps. |
| [`011-mandatory-interface-design-coupling`](./changelog-145-011-mandatory-interface-design-coupling.md) | DONE | Made `sk-design-interface` a hard precondition for any design work through Open Design. |
| [`012-catalog-playbook-realignment`](./changelog-145-012-catalog-playbook-realignment.md) | DONE | Aligned the catalog and playbook to the mandatory design-gate reality. |

### Added

- A complete `mcp-open-design` skill package under `.opencode/skills/mcp-open-design/`.
- Live Open Design terminal-control documentation covering MCP wiring, the tool surface and `od` CLI behavior.
- `sk-design-interface` variation-diversity guidance and mandatory Open Design coupling.
- `sk-prompt` design-generation prompt guidance for `mcp-open-design` use cases.
- Manual-testing evidence, model comparison artifacts and a gate-enforcement scenario.

### Changed

- `sk-design-interface` moved from vendored MIT-derived data to Apache-2.0-only live grounding through Open Design.
- `mcp-open-design` run direction changed from a reverse-engineered one-shot assumption to the live multi-turn flow with `od ui respond` as the build trigger.
- Shared design guidance moved from `mcp-magicpath` to the local `mcp-open-design` transport.
- Manual playbooks and catalogs now state that design work requires `sk-design-interface`, while pure wiring and bare inventory remain exempt.

### Fixed

- Restored deleted license files during research so the working tree returned to a clean baseline.
- Corrected stale licensing wording and reciprocal graph edges in review.
- Remediated all deep-review P0 and P1 findings plus the P2 backlog, with three WONTFIX items recorded.
- Fixed the class-wide one-shot generation error across `mcp-open-design` docs.
- Fixed catalog and playbook drift after the mandatory design gate landed.

### Verification

| Check | Result |
|-------|--------|
| Research fleet | PASS: three read-only seats completed and cross-checked the terminal surface. |
| Skill package checks | PASS: `package_skill.py --check` passed for the affected skills at each package phase. |
| Live generation | PASS: a real design rendered through the corrected multi-turn flow. |
| `od artifacts create` behavior | PASS: confirmed it only adds a file and does not run, render or update preview. |
| Deep review remediation | PASS: all 10 P0/P1 findings fixed and re-validated, with zero round-2 false positives. |
| `mcp-magicpath` live-reference grep | PASS: no live `mcp-magicpath` reference remains across skills and the index. |
| Playbook live run | PASS: 13 scenarios executed with 12 PASS, 1 PARTIAL and 0 SKIP. |
| Phase validation | PASS: each phase recorded `validate.sh --strict` success. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-open-design/` | Created and updated | New Open Design transport skill, references, catalog, playbook, README, changelog and graph metadata. |
| `.opencode/skills/sk-design-interface/` | Updated | De-vendored data, live Open Design grounding, variation diversity, mandatory coupling and playbook refinement. |
| `.opencode/skills/sk-prompt/` | Updated | Design-generation reference, router wiring, README rows and changelog entries. |
| `.opencode/skills/mcp-magicpath/` | Deleted | Superseded hosted MagicPath skill removed. |
| `.opencode/skills/mcp-figma/` | Updated | Sibling references repointed from `mcp-magicpath` to `mcp-open-design`. |
| `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/*` | Created and updated | Parent control files and 12 completed phase children. |
| `designs/` | Created | Model comparison outputs for MiMo and DeepSeek design tests. |

### Follow-Ups

- The formal `od mcp install opencode` wire remains optional and operator-gated.
- `WIRE-001` needs a fresh Code Mode session to confirm live `tools/list`.
- The full headless `od --no-open` path and some per-verb auth requirements remain partly inferred.
- Behavioral quality for variation diversity and model-generated HTML remains judgment-based, not fixture-based.
