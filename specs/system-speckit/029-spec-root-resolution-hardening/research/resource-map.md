---
title: "Resource Map — Harden spec-folder root resolution. Enumerate every root-resolution call site with file and line and its precedence legacy-first vs canonical-first, decide whether canonical-first is the correct universal contract and whether any legacy specs-first caller would regress, determine what created and maintains the specs symlink and whether it is intentional and cross-platform-safe and whether resolution should depend on it, characterize the symlink-absent failure mode for each auto-writer, and produce a ranked regression-safe remediation with migration, rollback, and a validation strategy that passes both with and without the symlink."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 29
- **By category**: READMEs=0, Documents=1, Commands=0, Agents=0, Skills=25, Specs=1, Scripts=0, Tests=0, Config=2, Meta=0
- **Missing on disk**: 12
- **Scope**: research convergence output for 008-spec-root-resolution-hardening
- **Generated**: 2026-07-17T09:24:06.799Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| command: node source-map/parity scan | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:22-44,67-101,567-570 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:31-55,104-152,745-749 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/core/config.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/scripts/core/subfolder-utils.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/core/workflow.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1053,1325-1345 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058,1646-1802 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1016-1058,1663-1687 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/dist/core/workflow.js:730-767,1290-1408 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:214-279,620-662,734-759 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js:620-662,734-759 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/dist/spec-folder/folder-detector.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/extractors/collect-session-data.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:269-352,755-809,876-900 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:309-323,368-380 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:755-809,876-900 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/spec-folder/directory-setup.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/scripts/spec/create.sh | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/strict-pass-freshness-sweep.yml | Cited | OK | Citations=1; Iterations=1 |

---
