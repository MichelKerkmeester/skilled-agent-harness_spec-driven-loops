---
title: "Changelog: Daemon Freshness and Health Truthfulness [016/011-daemon-freshness-and-health-truthfulness]"
description: "Broke the dist-freshness deadlock that falsely reported a fresh build as stale, exempted help and version from the freshness gate and made the health exclusion-audit fire again."
trigger_phrases:
  - "daemon freshness deadlock changelog"
  - "dist freshness cache prime"
  - "health content_text audit"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness/` (Level 2)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The dist-freshness checker no longer deadlocks. A successful build now pre-warms the per-entry source-hash cache, so the next freshness check short-circuits to fresh instead of falling through to an mtime comparison that could never write the cache. This removed the false-stale state that blocked the compiled validator and the memory CLI for a whole working session. `spec-memory.cjs` now exempts `--help`, `--version` and `completion` from the freshness gate. The health exclusion-audit queries `content_text` instead of the nonexistent `content` column, so the silent-risk diagnostic can fire again. Shipped in `d6e79a333d`.

### Added

- `writePackageSourceHashCache`, exported from the checker and called by `finalize-dist.mjs` after a successful `tsc --build`. It reuses the checker's `collectSourceFiles` enumeration so the finalizer hashes exactly the file set the checker will compare. Keeping that enumeration single-sourced is the load-bearing invariant.
- Deadlock-bootstrap regression coverage in the dist-freshness vitest.

### Changed

- `spec-memory.cjs` exempts `--help`, `--version` and `completion` from the freshness gate.
- Stale-dist stays on exit 75 as a documented non-retryable sub-case, preserving the live 75-is-retryable consumer contract while flagging the sub-case in the recovery text.
- The fallback envelope now carries `timedOut` so the new status recorder can read it.

### Fixed

- The health exclusion-audit queried a nonexistent `content` column and threw. It now queries `content_text` so the audit fires.

### Verification

- `tsc --build` exit 0, clean.
- Freshness returns fresh immediately after a build. The deadlock is broken.
- `spec-memory.cjs --help` and `--version` exit 0, previously 75.
- `memory_health` returns JSON instead of the stale-dist error.
- dist-freshness vitest 20 of 20.
- `validate.sh --strict` zero errors.

### Files Changed

- `scripts/lib/dist-freshness.cjs` exports the cache-priming helper.
- `mcp_server/scripts/finalize-dist.mjs` pre-warms the hash cache after a build.
- `bin/spec-memory.cjs` exempts the argv commands from the gate.
- `mcp_server/handlers/memory-crud-health.ts` fixes the audit column.

### Follow-Ups

- The exhaustive dist by argv by cache matrix and the hostile-env variant are approved deferrals, low-risk since the core deadlock is regression-covered.
