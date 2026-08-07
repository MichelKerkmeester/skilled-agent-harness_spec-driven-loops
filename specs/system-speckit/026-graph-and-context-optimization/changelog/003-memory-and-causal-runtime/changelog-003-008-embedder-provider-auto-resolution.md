---
title: "Embedder Provider Auto-Resolution Research: Root Cause Proven, Portable Fix Ranked"
description: "Deep-research packet that identified why EMBEDDINGS_PROVIDER=auto silently resolves to hf-local instead of the active ollama embedder. Root cause traced to a sqlite3 PATH dependency in factory.ts. A ranked portable fix was delivered in research.md. Code implementation deferred to a follow-on packet."
trigger_phrases:
  - "embedder provider auto resolution research"
  - "auto resolves hf-local not ollama root cause"
  - "querySqliteScalar PATH dependency factory.ts"
  - "embeddings provider auto cascade failure"
  - "ollama detection null startup fix"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/008-embedder-provider-auto-resolution` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

`EMBEDDINGS_PROVIDER=auto` was documented to cascade `ollama` first yet reliably resolved to `hf-local` at daemon startup on every host where ollama was active and healthy. Embed calls failed. The retry queue flapped. Operators were forced to apply a non-portable `EMBEDDINGS_PROVIDER=ollama` pin as a stopgap.

A focused read-only investigation via cli-codex gpt-5.5 (high reasoning) traced the failure to a single `execFileSync('sqlite3', ...)` call in `querySqliteScalar` at `factory.ts:284`. The daemon's inherited PATH lacks a `sqlite3` binary, so every probe returns null on `ENOENT`. The null propagates through `readActiveOllamaEmbedderFromDb()` at `factory.ts:352` and `resolveProvider()` at `factory.ts:609`, which then falls through past ollama to the `hf-local` fallback. The earlier hypothesis that `resolveSpecKitPackageRoot()` was at fault was disproven with direct file evidence.

The research deliverable in `research/research.md` ranks four candidate fixes by robustness and portability. The top-ranked fix replaces the shell-out with a `better-sqlite3` read and resolves the DB path generically through `shared/paths.ts`. Code implementation was explicitly deferred to a follow-on packet with its own plan and verification.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Status | Notes |
|-------|--------|-------|
| Research convergence | Pass | Root cause proven with decisive `file:line` citations in `research/research.md` |
| Evidence citations | Pass | `factory.ts:284/352/417/609`, `shared/paths.ts:71`, `schema.ts:48`, `auto-select.ts:476`, `mk-spec-memory-launcher.cjs:343` verified read-only |
| Package-root hypothesis | Pass | `resolveSpecKitPackageRoot()` resolves correctly. Disproven in `research/research.md` |
| Fix ranking delivered | Pass | Four candidates ranked by portability and robustness in `research/research.md` |
| Code shipped | N/A | No code changed by design. Fix deferred to a follow-on packet. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/research.md` (NEW) | Created | Deep-research deliverable: proven root cause, ranked portable fix, verification plan |

### Follow-Ups

- Replace `execFileSync('sqlite3', ...)` metadata probe with a `better-sqlite3` read at `factory.ts:284`.
- Reuse `shared/paths.ts` db-dir resolution for the canonical DB path at `shared/paths.ts:71`.
- Honor `active_embedder_provider` generically and build the shard path from provider/model/dim at `factory.ts:385`.
- Add a regression test simulating a daemon PATH without `sqlite3`.
- Revert the interim `EMBEDDINGS_PROVIDER=ollama` config pin to `auto` only after the fix lands and verifies.
