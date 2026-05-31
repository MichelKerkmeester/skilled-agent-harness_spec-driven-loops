---
title: "End-User Scope Default: Code Graph Defaults to Repo-Only Indexing"
description: "code_graph_scan previously indexed all workspace code including spec-kit internals, polluting end-user search results. This phase shipped a three-phase refactor that makes repo-only the default, adds an explicit maintainer opt-in via includeSkills or SPECKIT_CODE_GRAPH_INDEX_SKILLS. It also persists scope fingerprints so stale-graph migrations trigger a full rescan."
trigger_phrases:
  - "end-user scope default"
  - "code graph skill indexing opt-in"
  - "includeSkills code graph"
  - "scope fingerprint migration"
  - "SPECKIT_CODE_GRAPH_INDEX_SKILLS"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan/004-end-user-scope-default-and-opt-in` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan`

### Summary

The code graph indexed all workspace files by default, including 1,619 files and 34,850 nodes belonging to spec-kit skill internals. End users querying their application code received results mixed with skill-system internals they never needed. Scan time and storage were inflated by files operators had no reason to search.

A three-phase refactor shipped across one main implementation commit and two remediation passes. Phase 1 added a scope policy resolver (`index-scope-policy.ts`), threaded `includeSkills` and `SPECKIT_CODE_GRAPH_INDEX_SKILLS` through the scan handler, walker and schema, then added focused vitest coverage. Phase 2 persisted a scope fingerprint after each scan and wired scope-mismatch detection into the existing `requiredAction:"code_graph_scan"` blocked shape so stale-graph operators receive a loud prompt to rescan. Phase 3 updated the code-graph README and `ENV_REFERENCE.md` then ran the full verification suite.

After a default full rescan the local graph measured 48 files, 646 nodes and 1,231 edges, a 97 percent reduction in file count and a 98 percent reduction in node count. Maintainers working on spec-kit itself regain full skill indexing with one env var or one per-call flag. Two deep-review remediation passes closed all P0 and P1 findings before the packet shipped.

### Added

- `index-scope-policy.ts` scope policy resolver that merges env var and per-call `includeSkills` into a single canonical decision, with `mcp-coco-index/mcp_server` always excluded even under opt-in
- `includeSkills` strict boolean field on `tool-schemas.ts` and `schemas/tool-input-schemas.ts`, covering schema acceptance, rejection, env opt-in and per-call opt-in without process-env leakage
- `scope_fingerprint` and `scope_label` columns persisted in `code_graph_metadata` after each successful scan, with `activeScope`, `storedScope`, `scopeMismatch` and `excludedTrackedFiles` fields exposed on status responses
- Two new vitest files: `code-graph-scan.vitest.ts` (187 lines, end-to-end scan scope coverage) and `code-graph-scope-readiness.vitest.ts` (108 lines, fingerprint and mismatch detection)
- `SPECKIT_CODE_GRAPH_INDEX_SKILLS` entry in `ENV_REFERENCE.md` with default, override semantics and cross-links to policy constants

### Changed

- `lib/utils/index-scope.ts` path guard updated to reject `.opencode/skills/**` by default and accept the explicit opt-in, with per-call `includeSkills` taking precedence over the env var
- `code_graph/lib/structural-indexer.ts` and `code_graph/handlers/scan.ts` thread the canonical root and scope policy into candidate walking and workspace canonicalization, closing a symlinked-root bypass before the default guard runs
- `code_graph/lib/ensure-ready.ts` maps scope mismatch to the full-scan-required state rather than inline repair
- `code_graph/handlers/status.ts` exposes scope metadata fields (`activeScope`, `storedScope`, `scopeMismatch`, `excludedTrackedFiles`) on status responses
- Scan validation errors and warnings now avoid absolute workspace paths, using split-then-relativize message handling instead of regex-token redaction

### Fixed

- End users received code-graph results polluted with spec-kit skill internals. Default exclusion of `.opencode/skills/**` removes those results.
- Env-sensitive vitest tests leaked `SPECKIT_CODE_GRAPH_INDEX_SKILLS` across test bodies. Tests now clear the flag for the body and restore the caller's original env afterward.
- Scan error messages could expose absolute workspace paths. Message relativization closes the path-leakage surface.
- Stale graphs (indexed under old scope) silently remained in use. Scope fingerprint comparison now routes to the full-scan-required blocked shape with a clear operator message.

### Verification

| Check | Result |
|-------|--------|
| Remediation focused Vitest (`code-graph-indexer.vitest.ts`, `code-graph-scan.vitest.ts`, `code-graph-scope-readiness.vitest.ts`, `code-graph-siblings-readiness.vitest.ts`, `tool-input-schema.vitest.ts`) | PASS. 5 files, 162 tests passed. |
| Phase 1 grep gates: `includeSkills` in `tool-schemas.ts` and `scan.ts`, `.opencode/skills/**` exclusion in `indexer-types.ts` | PASS |
| Phase 2 code-graph suite (`mcp_server/code_graph/tests/`) | PASS. 19 files, 224 tests passed. |
| Phase 2 blocked shape: `context.ts` and `query.ts` still emit `requiredAction:"code_graph_scan"` | PASS |
| Resource-map drift (Gate E diff) | PASS. No output. |
| Workflow invariance (`scripts/tests/workflow-invariance.vitest.ts`) | PASS. 1 file, 2 tests passed. |
| Strict validation packet 009 (`validate.sh ... --strict`) | PASS. Errors: 0, Warnings: 0. |
| Strict validation packet 008 (`validate.sh ... --strict`) | PASS. Errors: 0, Warnings: 0. |
| Performance baseline: default full scan | PASS. Files 1,619 to 48 (-97%). Nodes 34,850 to 646 (-98%). Edges 16,530 to 1,231 (-93%). |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts` (NEW) | Scope policy resolver: merges env var and per-call `includeSkills` into a canonical decision. `mcp-coco-index/mcp_server` excluded even under opt-in. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Path guard rewritten to reject `.opencode/skills/**` by default. Per-call `includeSkills` takes precedence over `SPECKIT_CODE_GRAPH_INDEX_SKILLS` env. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts` | Policy-aware default excludes and active scope fingerprint type definitions added. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` | Scope policy threaded into candidate walking and workspace canonicalization. Symlinked-root bypass closed. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | `includeSkills` and env resolution threaded through scan args. Scope fingerprint persisted after successful scan. Split-then-relativize error handling. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | New `activeScope`, `storedScope`, `scopeMismatch`, `excludedTrackedFiles` fields on status responses. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Metadata helpers for `scope_fingerprint` and `scope_label` storage in `code_graph_metadata`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Scope mismatch now maps to full-scan-required state, not selective inline repair. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts` | Scope state surfaced in startup brief. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | `includeSkills` boolean field added to strict scan input schema. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | `includeSkills` acceptance, rejection, env and per-call cases added. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Schema acceptance and rejection test cases for `includeSkills`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Default exclude and opt-in config cases. Env isolation with save-and-restore. Precedence matrix covering all six env and per-call combinations. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts` (NEW) | End-to-end scan scope coverage: default exclusion, env opt-in, per-call opt-in and error path relativization. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts` (NEW) | Fingerprint persistence, stale-fingerprint detection and full-scan-required state. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | `SPECKIT_CODE_GRAPH_INDEX_SKILLS` documented with default, override semantics and policy cross-links. |

### Follow-Ups

- Extend scope opt-in to selected individual skills rather than all-or-nothing. The `includeSkills` field accepts `boolean | string[]`. The per-skill-list path is implemented in `index-scope.ts` but no UI or operator playbook covers it yet.
- Evaluate CocoIndex semantic scope cleanup as a separate packet. Embeddings were generated under the old all-files default and will remain stale until a follow-up packet rebuilds the semantic index with the new scope boundary.
