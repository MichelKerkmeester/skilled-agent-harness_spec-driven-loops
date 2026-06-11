---
title: "Phase Parent Rollup: release-cleanup"
description: "Rollup of the 9 child phases under 000-release-cleanup, the 027 release-gate track that aligned the root README, skill docs, feature catalog, manual playbook, stress tests, command/agent/AGENTS.md docs, and skill frontmatter to shipped reality. Children are summarized inline in the Included Phases table."
trigger_phrases:
  - "000-release-cleanup rollup"
  - "027 release gate changelog"
  - "release cleanup phase parent"
  - "027 000 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup` (Level 2, Phase Parent)

### Summary

This phase parent is the 027 release-gate track. Its nine children carried the documentation and verification cleanup that keeps the published surface honest against what the epic actually shipped: the public root README, the skill docs and ENV_REFERENCE rows, the feature catalog, the manual-testing playbook, the MCP-and-CLI stress tests, the command docs, the agent mirrors, the root AGENTS.md governance, and the skill-frontmatter alignment campaign. The work is documentation and process — no runtime behavior changed here — so the substance lives under Summary and Verification, and detail lives in each child's spec docs.

This rollup is the authoritative child inventory for 000. Unlike the pre-existing parents 003 through 010, the 000 children are summarized inline in the Included Phases table below and do not carry separate per-child leaf changelogs, since they are documentation and process slices rather than behavior-changing code phases.

### Included Phases

| Phase | Outcome |
|-------|---------|
| [001-public-root-readme](../../000-release-cleanup/001-public-root-readme/spec.md) | Public root README leads with the deep-loop orchestration capability and the dual-stack CLI front doors |
| [002-skill-docs-alignment](../../000-release-cleanup/002-skill-docs-alignment/spec.md) | Stale skill documentation and ENV_REFERENCE rows aligned to shipped 027 reality, sibling-lane ownership preserved |
| [003-skill-feature-catalog](../../000-release-cleanup/003-skill-feature-catalog/spec.md) | Missing shipped-feature catalog entries added, mutation-count self-check reconciled, source-file traceability verified |
| [004-skill-manual-playbook](../../000-release-cleanup/004-skill-manual-playbook/spec.md) | Manual-testing-playbook scenarios added for each 027 feature, flag, and CLI surface, drift-prone count self-check bumped |
| [005-mcp-cli-stress-tests](../../000-release-cleanup/005-mcp-cli-stress-tests/spec.md) | MCP-and-CLI stress tests added for the dual-stack surface |
| [006-command-alignment](../../000-release-cleanup/006-command-alignment/spec.md) | Content-only command-doc alignment to shipped 027 schema, flags, memory behavior, validators, and CLI front-door reality |
| [007-agent-alignment](../../000-release-cleanup/007-agent-alignment/spec.md) | `.opencode`, `.claude`, and `.codex` agent mirrors reconciled with the agent-io contract and verification-discipline doctrine |
| [008-agents-md-alignment](../../000-release-cleanup/008-agents-md-alignment/spec.md) | Root AGENTS.md governance reconciled, Four Laws and Gates byte-stable, freshness/Logic-Sync/constitutional references updated |
| [009-skill-frontmatter-alignment](../../000-release-cleanup/009-skill-frontmatter-alignment/spec.md) | Phase-parent campaign: ~355 skill reference/asset docs brought to the canonical 5-field frontmatter contract across 22 sub-phases |

### Added

- None. Detail lives in the child phase spec docs.

### Changed

- None. Detail lives in the child phase spec docs.

### Fixed

- None. Detail lives in the child phase spec docs.

### Verification

- Each child shipped with its own implementation summary and strict-validated spec docs. The 009 frontmatter campaign verified 355/355 docs at zero violations under the dependency-free validator.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `000-release-cleanup/` (child phases) | n/a | Rollup of 9 child phases, documentation and process only, no direct source changes at the parent level |

### Follow-Ups

- 009 live adoption (advisor doc-trigger harvest indexing the aligned frontmatter) is operator-gated and requires a fresh advisor session.
