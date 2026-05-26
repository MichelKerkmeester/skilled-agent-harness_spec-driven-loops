---
title: "Implementation Summary: 016/002/020 Embedder Default Drift Fix"
description: "5 hardcoded defaults eliminated via registry-derived getCanonicalFallback() helper; 23 invariant tests lock the contract."
trigger_phrases:
  - "020 shipped summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix"
    last_updated_at: "2026-05-23T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Packet shipped — helper + 5 refactors + 23 invariants"
    next_safe_action: "MCP daemon restart in parent execution context"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000020a3"
      session_id: "016-002-020-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All architecture decisions documented in decision-record.md (ADR-001/002/003)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 016/002/020 Embedder Default Drift Fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 6 modified + 1 new test + 6 spec docs (this packet) |
| Tests added | 1 (`registry.test.ts`, 23 assertions) |
| Tests passing | 23/23 |
| Typecheck | exit 0 |
| Strict-validate | PASS (after spec doc rewrite to canonical anchors) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### `shared/embeddings/registry.ts`

Added after existing `MANIFESTS` export:

- `CanonicalProvider` type union
- `EmbedderNotConfiguredError` class (programmer-error guard for empty MANIFESTS)
- `CLOUD_CANONICAL` frozen record for `voyage` + `openai`
- `getCanonicalFallback(provider)` function — derives local providers from `MANIFESTS[0]`, returns cloud canonical strings from the frozen table

### 5 refactored sites

| File | Line | Before | After |
|---|---|---|---|
| `shared/embeddings.ts` | 874 | `'BAAI/bge-base-en-v1.5'` (later `'nomic-ai/...'` mid-session) | `getCanonicalFallback('hf-local')` |
| `shared/embeddings/providers/hf-local.ts` | 14 | `'BAAI/bge-base-en-v1.5'` | `getCanonicalFallback('hf-local')` |
| `shared/embeddings/providers/ollama.ts` | 14 | `'jina-embeddings-v3'` (BUG — pre-ADR-013) | `getCanonicalFallback('ollama')` |
| `shared/embeddings/factory.ts` | 146–153 | 4 inline strings in `DEFAULT_PROVIDER_MODELS` | All 4 derived from `getCanonicalFallback(...)` + `Object.freeze({...})` |
| `mcp_server/lib/embedders/sidecar-worker.ts` | 71 | `'BAAI/bge-base-en-v1.5'` | `getCanonicalFallback('hf-local')` |

### `shared/embeddings/registry.test.ts` (NEW)

23 standalone-assertion invariants. Test runner: `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` post-typecheck.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Single execution session by main agent on 2026-05-23 ~11:00 UTC:

1. Two Explore agents investigated historic ADRs + traced resolution chain.
2. Helper authored in `registry.ts` per Shape C (registry-derived).
3. 5 site refactors done sequentially via Edit tool (no cli-X dispatch — the changes were too mechanical to justify dispatch overhead).
4. Standalone-assertion test authored matching `shared/predicates/boolean-expr.test.ts` convention.
5. Typecheck + test verification ran clean on first try.
6. Spec docs scaffolded post-execution with canonical-anchor structure.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

See `decision-record.md` for full ADR text. Summary:

- **ADR-001**: Adopt Shape C (registry-derived helper) over Shape A (delete + throw), B (one documented LAST_RESORT_FALLBACK), or D (external JSON config). Lowest blast radius; makes future drift structurally impossible.
- **ADR-002**: Cloud providers (voyage, openai) stay outside the MANIFESTS array. Different operational semantics; no benefit from an array when there's only one canonical per provider.
- **ADR-003**: Test convention is standalone assertions (no Vitest in `shared/`) matching existing patterns.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `npm run typecheck:root` (from `.opencode/skills/system-spec-kit/`) → exit 0
- `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` → 23/23 ok
- `rg "DEFAULT.*['\"]BAAI/bge-base" .opencode/skills/system-spec-kit/` → 0 hits
- `rg "DEFAULT.*['\"]jina-embeddings-v3" .opencode/skills/system-spec-kit/` → 0 hits
- `rg "getCanonicalFallback" .opencode/skills/system-spec-kit/` → 7 hits (1 export + 5 callers + 1 test) — all expected
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → PASS
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- The MANIFESTS array order is now load-bearing — re-ordering changes `getCanonicalFallback('ollama')` and `('hf-local')` return values. The invariant test locks `MANIFESTS[0]` to `nomic-embed-text-v1.5` per ADR-013/014, so any re-order MUST update the test to reflect the new operator decision.
- Cloud providers' canonical strings still live as inline constants inside `CLOUD_CANONICAL` (just two entries). If a third cloud provider arrives or these models change canonical, the table needs a manual update.
- This packet does NOT audit other subsystems (CocoIndex, skill-advisor, code-graph, rerank-sidecar) for similar hardcoded-default patterns. That sweep is deferred to a follow-on deep-research packet.

### Commit Handoff

Main agent commits per repo policy. Suggested message:

```
fix(016/002/020): eliminate embedder default drift via getCanonicalFallback() helper

5 hardcoded embedder default strings replaced with a registry-derived helper. ollama.ts had a pre-ADR-013 bug (jina-embeddings-v3) that contributed to circuit-breaker flapping during the 2026-05-23 incident. Registry MANIFESTS[0] is now the single source of truth — reorders propagate automatically. 23-assertion invariant test locks the contract + blocks legacy-string regression.
```

Suggested explicit paths:

```
.opencode/skills/system-spec-kit/shared/embeddings/registry.ts
.opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts
.opencode/skills/system-spec-kit/shared/embeddings.ts
.opencode/skills/system-spec-kit/shared/embeddings/factory.ts
.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts
.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts
.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix/
```
<!-- /ANCHOR:limitations -->
