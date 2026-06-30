---
title: "Resource Map — Session work: 014-docs-and-stress-test-refresh (parent + 4 children: playbook, feature-catalog, README-cluster, stress durability domain), the 013 continuity reconciliation + 3 changelogs, and the serverInfo 1.7.2->1.8.0 fix in mcp_server/context-server.ts"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 21
- **By category**: READMEs=0, Documents=5, Commands=0, Agents=0, Skills=9, Specs=7, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 5
- **Scope**: review convergence output for 014-docs-and-stress-test-refresh
- **Generated**: 2026-06-02T14:49:18.177Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| checkpoint_create_v2 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| checkpoint_restore_v2 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| front_proxy_replayable_set | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| schema_history_v28_v30 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| sk_git_worktree | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/error-code-reference.md | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md | Analyzed | OK | Findings P0=0 P1=1 P2=1; Iterations=3 |
| .opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/index-scan-phased-async-refinements.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |
| .opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/checkpoint-v2-file-snapshot-roundtrip.md | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/README.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/spec.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/checklist.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update/spec.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/implementation-summary.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/checklist.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/graph-metadata.json | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/specs/system-spec-kit/026-graph-and-context-optimization/changelog/003-memory-and-causal-runtime/changelog-013-001-self-maintaining-index.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
