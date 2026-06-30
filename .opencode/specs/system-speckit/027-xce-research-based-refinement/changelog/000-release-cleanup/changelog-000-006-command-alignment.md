---
title: "Changelog: 006-command-alignment"
description: "Content-only command documentation alignment for shipped 027 schema, flags, memory behavior, validators, and daemon-backed CLI front-door reality."
trigger_phrases:
  - "000 006 command alignment changelog"
  - "release cleanup command docs"
  - "command docs schema v37"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/006-command-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

Command docs were aligned to shipped 027 runtime reality without restructuring commands or changing behavior. The pass covered memory, speckit, and doctor command docs, while explicitly deferring the structural router/presentation split to the later 011 phase.

### Added

- Current notes for semantic-trigger shadow mode, causal-inference behavior, observability traces, idempotency, tombstones, restore panels, authored continuity snapshots, and tri-daemon CLI front doors.

### Changed

- Updated memory command docs for schema v37 storage, retention, tombstones, idempotency, source-kind provenance, and correct retention classes.
- Updated speckit command docs for the current validator surface, targeted post-save scan guidance, and resume restore-panel/snapshot context.
- Updated doctor command docs to distinguish five MCP servers from three daemon-backed CLI front doors.

### Fixed

- Removed stale `v23`/`SCHEMA=v13` command-doc examples and stale `shared` retention wording.

### Verification

| Check | Result |
|-------|--------|
| Shipped reality verification | PASS: schema v37, flags, validator names, and 37/8/9 CLI surfaces checked against source docs/code |
| Stale command grep | PASS |
| Structural/router check | PASS: markdown prose only; no YAML/assets/router/frontmatter tool changes |
| Strict validation | PASS: child phase `validate.sh --strict` exited 0 after compactness retry |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/memory/*.md` | Modified | Current memory command content |
| `.opencode/commands/speckit/{complete,implement,resume}.md` | Modified | Current validation, scan, and resume content |
| `.opencode/commands/doctor/{speckit,mcp,update}.md` | Modified | v37 diagnostics and tri-daemon CLI front-door content |
| `006-command-alignment/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | Phase completion evidence reconciled |

### Follow-Ups

- The structural command router/presentation split was intentionally deferred to the 004/002 command-presentation workflow separation phases.
