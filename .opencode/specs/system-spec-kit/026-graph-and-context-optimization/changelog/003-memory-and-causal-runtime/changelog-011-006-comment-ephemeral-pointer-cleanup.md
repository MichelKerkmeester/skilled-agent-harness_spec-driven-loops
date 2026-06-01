---
title: "Changelog: Comment ephemeral-artifact pointer cleanup [011-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup]"
description: "Comment-only sweep removed ~55 sk-code-forbidden ephemeral-artifact pointers from 27 files across the embedding-stack program and adjacent system-spec-kit modules while preserving the durable WHY."
trigger_phrases:
  - "comment ephemeral pointer cleanup"
  - "ephemeral artifact pointer removal"
  - "sk-code no ephemeral pointers"
  - "comment sweep compliance"
  - "pointer cleanup phase"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

<!-- SPICKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

The embedding-stack hardening program and older system-spec-kit modules accumulated ~55 ephemeral-artifact pointers across 27 files. Pointers such as spec folder numbers, task and checklist IDs, ADR IDs, and review-finding IDs become dangling references when artifacts are renamed, renumbered, or archived. This phase stripped those perishable pointers from comments and two at-risk string literals while preserving the durable reasoning each comment explains. Zero logic was changed. Builds, syntax checks, and re-audit all pass.

### Added
- None.

### Changed
- vector-index-store.ts had three lines with ephemeral pointers removed (WS-1, 031/review, 026/004/012).
- context-server.ts had two lines with ephemeral pointers removed (026/007/011, 026/007/009).
- reindex.ts had two lines with ephemeral pointers removed (031/review, 026/004/012).
- registry.ts had the 031/005 reranker-removal note stripped.
- hf-local.ts had spec-folder names removed from the prefix-registry header comment.
- preflight.ts had the 010-index-large-files prefix stripped from a string.
- factory.ts had a bare spec reference removed from an inline comment.
- config.ts had a spec reference removed from an inline comment.
- mk-spec-memory-launcher.cjs had ephemeral pointers removed.
- mk-skill-advisor-launcher.cjs had ephemeral pointers removed.
- launcher-ipc-bridge.cjs had ephemeral pointers removed.
- mk-code-index-launcher.cjs had ephemeral pointers removed per owner authorization.
- generate_report.py had a Phase 005 literal removed from generated benchmark output.

### Fixed
- A CHK-160 reference was removed from a tool-schema description string.
- Two previously uncaught bare spec references were found and removed during context reading.

### Verification

- TS build (@spec-kit/shared) - Pass
- TS build (@spec-kit/mcp-server) - Pass
- CJS syntax check - Pass
- Python syntax check - Pass
- Ephemeral-pointer re-audit grep - Pass (only allowed or false-positive matches remain)
- Strict validation - Pass
- 36 task items completed and recorded

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | Modified | Removed ephemeral pointers from 3 comment lines |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/context-server.ts | Modified | Removed ephemeral pointers from 2 comment lines |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/reindex.ts | Modified | Removed ephemeral pointers from 2 comment lines |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/registry.ts | Modified | Removed reranker-removal note |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/factory.ts | Modified | Removed bare spec reference from inline comment |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/hf-local.ts | Modified | Removed spec-folder names from prefix-registry header |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/embedding-reconcile.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/scripts/bench-dtype-q8-fp16.cjs | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/types.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/document-helpers.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/memory-parser.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/lineage-state.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/quality-scorer.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/api/index.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/preflight.ts | Modified | Removed ephemeral pointer prefix from string |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/query-flow-tracker.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/config.ts | Modified | Removed spec reference from inline comment |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/retry-budget.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-phrase-sanitizer.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/tool-schemas.ts | Modified | Removed CHK-160 reference from schema description |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/shared-payload.ts | Modified | Removed ephemeral pointers from comments |
| .opencode/bin/mk-spec-memory-launcher.cjs | Modified | Removed ephemeral pointers from comments |
| .opencode/bin/mk-skill-advisor-launcher.cjs | Modified | Removed ephemeral pointers from comments |
| .opencode/bin/launcher-ipc-bridge.cjs | Modified | Removed ephemeral pointers from comments |
| .opencode/bin/mk-code-index-launcher.cjs | Modified | Removed ephemeral pointers from comments per owner authorization |
| .opencode/skills/system-spec-kit/scripts/generate_report.py | Modified | Removed Phase 005 literal from generated benchmark output |

### Follow-Ups

- Scope was system-spec-kit source and bin launchers only. Other code surfaces such as webflow and motion_dev were not swept.
- No regression guard was added. A grep-based lint step or pre-commit hook would make the rule enforceable and prevent re-introduction. This is deferred as a separate decision.
- Test-file comments were not swept. A handful of .vitest.ts and .test.* files carry ephemeral IDs in comments and remain out of scope.
