---
title: "Changelog: install-claude-frontend-design [143-sk-interface-design/001-install-claude-frontend-design]"
description: "Chronological changelog for the install-claude-frontend-design phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/001-install-claude-frontend-design` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/143-sk-interface-design`

### Summary

The framework gained a reusable visual-design judgment skill. `sk-interface-design` carries Anthropic's frontend-design guidance into the house skill system, so UI work starts from subject matter, deliberate palette, deliberate type and critique before build. The phase was triggered by a design miss earlier in the session and gave future UI tasks a clear aesthetic direction without making this skill the implementation owner.

### Added

- Added a reciprocal sibling edge to `sk-code` graph metadata.
- Updated the house README, catalog and root README rows under the recorded README task.

### Changed

- Located the upstream skill at `anthropics/skills/skills/frontend-design`.
- Confirmed the name and family with the operator: `sk-interface-design`, in the `sk-code` family.
- Downloaded `SKILL.md` and `LICENSE.txt`.
- Scaffolded spec folder 148.
- Authored `references/design_principles.md` with the reference template and verbatim upstream guidance.
- Authored lean house-template runtime instructions in `.opencode/skills/sk-interface-design/SKILL.md`.
- Authored `README.md` and schema-2 `graph-metadata.json`.

### Fixed

- Skill abstains on non-visual tasks.
- The brief-wins rule prevents over-design.
- Edge cases are handled: brief-fixed direction wins and non-visual tasks defer to `sk-code`.
- No fix packet behavior applied, because this was additive vendoring and not a bug fix.
- No producer behavior changed. Only catalog counts and one sibling edge were edited.
- Consumer graph check passed through a reciprocal `sk-code` sibling edge and graph re-validation with `errorCount 0`.
- No security, path or parser logic was introduced.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py` | PASS: skill is valid with 0 warnings. |
| `validate_document.py` | PASS: `SKILL.md`, `README.md` and the reference doc each returned 0 issues. |
| `skill_graph_scan` | PASS: 1 node indexed, 0 rejected edges and embedding generated. |
| `skill_graph_validate` | PASS: `errorCount 0` with no sibling-symmetry warning. |
| `advisor_recommend` | PASS: design prompt returned top match with confidence 0.92 and uncertainty 0.12 under Gate 2. |
| Skill-count consistency | PASS: 23 across catalog, root README and directory count. |
| Tasks complete | PASS: 15 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-interface-design/SKILL.md` | Created | Lean house-template runtime instructions. |
| `.opencode/skills/sk-interface-design/references/design_principles.md` | Created | Full upstream guidance, reference template and verbatim content. |
| `.opencode/skills/sk-interface-design/LICENSE.txt` | Created | Anthropic Apache-2.0 license, preserved. |
| `.opencode/skills/sk-interface-design/README.md` | Created | House-voice nine-section README. |
| `.opencode/skills/sk-interface-design/graph-metadata.json` | Created | Schema-2 advisor node in the `sk-code` family. |
| `.opencode/skills/sk-code/graph-metadata.json` | Modified | Reciprocal sibling edge to `sk-interface-design`. |
| `.opencode/skills/mcp-magicpath/SKILL.md` | Modified | Auto-apply `sk-interface-design` when authoring or shaping UI. |
| `.opencode/skills/mcp-magicpath/graph-metadata.json` | Modified | Added `depends_on sk-interface-design` at 0.7, `related_to` and reciprocal `prerequisite_for`. |
| `.opencode/skills/README.md` | Modified | Catalog row and counts changed from `sk-*` 6 to 7 and total 22 to 23. |
| `README.md` | Modified | Skill highlight, skills-table row and count changed from 22 to 23. |

### Follow-Ups

- This skill guides design and does not build. Implementation goes to `sk-code`, which owns standards and verification for the detected web surface.
- One pre-existing graph note remains. Every skill, including this one, lacks a `sanitizer_version` in its derived block. That repo-wide condition predates this packet and is a non-blocking warning.
- Guidance is vendored, not live. It is pinned to Anthropic's frontend-design at install time. Re-vendor if Anthropic updates the upstream skill.
