---
title: "Changelog: 002-skill-docs-alignment"
description: "Aligned stale system-spec-kit and cli-opencode skill documentation to schema v37, 37 memory tools, current flags, scan behavior, and daemon-backed front-door guidance."
trigger_phrases:
  - "000 002 skill docs changelog"
  - "schema v37 docs alignment"
  - "release cleanup skill docs"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/002-skill-docs-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

The skill-documentation pass corrected stale shipped-state claims in `system-spec-kit` and `cli-opencode` documentation while leaving already-current sibling skills untouched. The updates document schema v37, the 37-tool memory surface, default-off 027 flags, self-maintaining scan behavior, and the daemon-backed CLI front-door handback guidance.

### Added

- Missing ENV_REFERENCE entries for `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT`, `SPECKIT_COMPLETION_FRESHNESS`, and `SPECKIT_COMPLETION_FRESHNESS_ENFORCE`.
- Front-door preference guidance in `cli-opencode/SKILL.md` for `spec-memory.cjs`, `code-index.cjs`, and `skill-advisor.cjs` when full `opencode run` delegation is unnecessary.

### Changed

- Updated `system-spec-kit` SKILL/README/reference docs from schema v30 or 36-tool language to schema v37 and 37-tool reality.
- Updated the schema-history feature catalog page while preserving its existing path.
- Reconciled phase docs to completed state.

### Fixed

- Removed stale `schema v30`, `SCHEMA_VERSION = 30`, `36 tools`, and old cooldown claims from touched docs.

### Verification

| Check | Result |
|-------|--------|
| 027 flag completeness grep | PASS |
| False-statement grep | PASS |
| ENV_REFERENCE count self-check | PASS: 179 documented, 179 expected, 0 missing |
| Strict validation | PASS: child phase `validate.sh --strict` reported 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/**` docs | Modified | Schema, tool count, flag, scan, and ownership guidance aligned |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Missing shipped flag rows added |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Daemon-front-door guidance added |
| `002-skill-docs-alignment/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | Phase completion evidence reconciled |

### Follow-Ups

- Historical manual-testing playbook entries that describe v30-era validation scenarios were intentionally not rewritten.
