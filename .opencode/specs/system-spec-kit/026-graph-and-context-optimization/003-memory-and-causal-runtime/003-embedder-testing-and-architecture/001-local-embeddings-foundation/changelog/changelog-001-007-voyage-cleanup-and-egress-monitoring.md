---
title: "007 Voyage Cleanup and Egress Monitoring"
description: "Deleted 463MB of stale Voyage and legacy sqlite files left over from the local-embeddings migration. Added a runtime warn-once egress guard in factory.ts that fires if VOYAGE_API_KEY appears in process.env while the active provider is hf-local."
trigger_phrases:
  - "voyage sqlite cleanup"
  - "voyage egress guard"
  - "factory voyage drift warning"
  - "463MB sqlite reclaim"
  - "VOYAGE_API_KEY runtime guard"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

After the Phase 003 and 004 local-embeddings migration, the spec-kit-memory database directory retained two stale files: a 322MB Voyage 1024-dim sqlite from before hf-local became the active provider plus a 141MB generic-filename `context-index.sqlite` from before filename-keying landed. Both were dead data that slowed down the question "is Voyage still being called?" Both were removed, reclaiming 463MB.

On top of the cleanup, `factory.ts` gained a `warnIfVoyageDriftDetected()` helper that fires once per process startup if `VOYAGE_API_KEY` is set in the environment while the resolved provider is `hf-local`. The warn-once design avoids flooding stderr but still surfaces the regression signal at the next MCP child spawn. A `scratch/tcpdump-verify.sh` script documents the 24h post-merge capture command for user-driven egress confirmation.

### Added

- `voyageDriftWarned` module-level flag in `factory.ts` to gate one-shot warn behavior
- `warnIfVoyageDriftDetected(effectiveProvider)` helper called from `getProviderInfoForResolution()` after metadata resolution
- `scratch/tcpdump-verify.sh` with a 24h `tcpdump` capture command targeting `api.voyageai.com`, marked executable

### Changed

- `getProviderInfoForResolution()` in `factory.ts` now calls the egress guard after resolving provider metadata
- `dist/embeddings/factory.js` and `dist/embeddings/factory.d.ts` regenerated via `npx tsc --build` to include the new guard

### Fixed

- Stale 322MB Voyage 1024-dim sqlite and its WAL companion files no longer occupy the database directory
- Legacy 141MB `context-index.sqlite` (pre-filename-keying) removed, eliminating a source of confusion about which DB is active

### Verification

| Check | Result |
|-------|--------|
| `ls .opencode/skills/system-spec-kit/mcp_server/database/ \| grep -i voyage` | PASS. Empty output. |
| `ls .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | PASS. File not found. |
| `memory_health()` post-delete | PASS. `vectorSearchAvailable: true`, `memoryCount: 2112`, hf-local sqlite intact. |
| `npx tsc --noEmit -p tsconfig.json` after factory.ts edit | PASS. Clean, no output. |
| `npx tsc --build` regenerates dist | PASS. `dist/embeddings/factory.js` contains `warnIfVoyageDriftDetected`. |
| Reclaim total | PASS. 463MB reclaimed (318MB main + 32KB shm + 4MB WAL + 141MB legacy). |
| tcpdump script executable | PASS. `chmod +x` applied. |
| Strict validate | Pending T014 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` | Deleted | 318MB stale Voyage 1024-dim vectors |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-shm` | Deleted | 32KB WAL shared-memory companion |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite-wal` | Deleted | 4MB WAL log |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | Deleted | 141MB pre-filename-keying legacy DB |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Added `voyageDriftWarned` flag and `warnIfVoyageDriftDetected()` helper. Wired into `getProviderInfoForResolution`. |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.js` | Regenerated | `npx tsc --build` output with guard code |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.d.ts` | Regenerated | Type declarations rebuilt |
| `007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh` (NEW) | Created | 24h post-merge egress verification script |

### Follow-Ups

- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on this packet once T014 is resolved to confirm strict validate exits 0.
- User runs `bash scratch/tcpdump-verify.sh` for 24h post-merge to confirm zero packets to `api.voyageai.com`.
- The egress guard logs but does not enforce. If a stricter policy becomes desirable in a later phase, upgrade from warn to throw and add a bypass env var.
