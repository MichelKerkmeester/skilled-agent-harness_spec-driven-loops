---
title: "Changelog: sk-prompt design-tool use cases [145-mcp-open-design/006-sk-prompt-design-tool-usecases]"
description: "Chronological changelog for the sk-prompt design-generation assessment and improvement phase."
trigger_phrases:
  - "phase changelog"
  - "sk-prompt design"
  - "design prompt use cases"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/006-sk-prompt-design-tool-usecases` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design`

### Summary

This phase first asked whether `sk-prompt` already covered the design-generation needs of `mcp-magicpath` and `mcp-open-design`. The answer was a real gap. The phase closed it with one reference plus router wiring, leaving the existing prompt pipeline and scoring model intact.

### Added

- Updated README Section 9.
- Bumped `SKILL.md` to `2.2.0.0`.
- Added `changelog/v2.2.0.0.md`.
- Added one new reference plus router wiring, with no new pipeline or scoring change.
- Recorded `CHK-010`, `CHK-011` and `CHK-012`.

### Changed

- Read `sk-prompt` `SKILL.md`, `depth_framework.md`, `patterns_evaluation.md` and `README.md`.
- Read `mcp-magicpath` and `mcp-open-design` `SKILL.md`.
- Read `sk-design-interface/references/claude_design_parity.md`.
- Grounded the multi-turn discovery flow in `mcp-open-design` references, including `od ui respond` and `start_run`.
- Captured baseline `package_skill.py --check` as PASS with one pre-existing naming warning.
- Reached the assessment verdict for needs (a) to (d) with reasons.
- Updated `DESIGN_GEN` in `INTENT_MODEL`, `RESOURCE_MAP`, resource domains, loading levels, Section 5 and Section 9.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` on `sk-prompt` | PASS: one pre-existing `framework-registry.json` naming warning, no new errors. |
| README structure check | PASS: 0 issues. |
| `validate.sh --strict` | PASS: this packet returned 0 errors. |
| Router consistency | PASS: `DESIGN_GEN` present in all expected router and documentation surfaces. |
| `sk-design-interface` unchanged | PASS: no diff in the skill directory. |
| Tasks complete | PASS: 18 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-prompt/references/design_generation_patterns.md` | Created | Design-generation prompt reference. |
| `.opencode/skills/sk-prompt/SKILL.md` | Updated | `DESIGN_GEN` intent and resource map, resource domains, loading levels, Section 1 use case, Section 5 and Section 9 references and version `2.2.0.0`. |
| `.opencode/skills/sk-prompt/README.md` | Updated | RELATED DOCUMENTS row for the new reference. |
| `.opencode/skills/sk-prompt/changelog/v2.2.0.0.md` | Created | Changelog entry for the addition. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `this file` | Created | Packet control docs. |

### Follow-Ups

- The new reference is static guidance. Its effect on real generation quality is judged in use, not by a fixture suite.
- The manual-testing playbook was not extended in this phase.
- The pre-existing `framework-registry.json` snake_case naming warning persists and remains out of scope.
- The `sk-code` handoff depends on `claude_design_parity.md` Section 6 staying the owner of the manifest.
