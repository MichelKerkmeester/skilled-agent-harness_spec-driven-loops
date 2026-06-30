---
title: "Implementation Summary: Robust embedding-provider auto-resolution fix"
description: "Summary of the node:sqlite factory metadata-read fix, regression test, verification, and interim-pin revert."
trigger_phrases:
  - "implementation"
  - "summary"
  - "embedder"
  - "auto-resolution"
  - "factory"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/009-embedder-auto-resolution-fix"
    last_updated_at: "2026-05-27T13:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "shipped-009-auto-confirmed-live-resolving-ollama-via-node-sqlite"
    next_safe_action: "none-009-complete-optional-push-to-remote"
    blockers: []
    completion_pct: 100
---
# Implementation Summary: Robust embedding-provider auto-resolution fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

> Spec: `./spec.md` · Plan: `./plan.md` · Decision: `./decision-record.md`

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-embedder-auto-resolution-fix |
| **Completed** | 2026-05-27 (live-confirmed: `auto`→ollama after reconnect) |
| **Level** | 2 |
| **Status** | Complete — `auto` resolves ollama live via node:sqlite |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

### node:sqlite metadata read
`factory.ts` no longer shells out to a `sqlite3` binary. Active-embedder metadata is now read in-process via the built-in `node:sqlite` `DatabaseSync` (opened read-only), loaded through a lazy/cached `createRequire(import.meta.url)` guard. On any failure (module unavailable on Node <22.5, unreadable/locked DB) the resolver warns once and returns null so the cascade continues — fixing the silent `auto`→`hf-local` degradation 008 root-caused. Provider/shard resolution is generalized: `active_embedder_provider` is read (default `ollama`) and the shard path is built as `context-vectors__<provider>__<name>__<dim>.sqlite`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/embeddings/factory.ts` | Modify | sqlite3 shell-out → `node:sqlite` read; parameterized probes; warn-once; generic provider/shard resolution; dropped `execFileSync` import |
| `mcp_server/tests/factory-auto-resolution.vitest.ts` | Create | Regression: builds temp DB, sets `PATH=''`, asserts `resolveProvider()` === `ollama` |
| `.claude/mcp.json` | Modify | Reverted interim pin `ollama`→`auto` |
| `opencode.json` | Modify | Reverted interim pin `ollama`→`auto` |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Opus authored the packet and locked the SQLite-reader decision (ADR-009-01). The `factory.ts` edits + regression test were implemented by **cli-codex gpt-5.5** (`model_reasoning_effort=high`, `service_tier=fast`, `--sandbox workspace-write`) under the pre-approved spec folder, scope-locked to two files. Opus then independently verified (rebuilt `shared`, ran the regression + sibling embedder suites, ran the §6 restricted-PATH harness against the live DB), reverted the interim pin, and reconciled the packet. The codex dispatch was killed after its work returned (single-dispatch discipline).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `node:sqlite`, not better-sqlite3 | better-sqlite3 is unresolvable from `shared/dist`; `node:sqlite` is built-in (ADR-009-01) |
| Defensive lazy load + graceful null | Preserves Node <22.5 hosts (no regression vs a fresh host) |
| Default `active_embedder_provider` to `ollama` | Back-compat with current DBs (live DB has the key empty) |
| Revert pin only after §6 verification | Avoids re-breaking embeds if the fix were subtly wrong |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Evidence |
|-----------|--------|----------|
| Typecheck (shared + mcp_server) | Pass | both `npm run build` → exit 0 |
| Regression (sqlite3 off PATH) | Pass | `factory-auto-resolution.vitest.ts` 1/1 |
| Sibling embedder suites | Pass | reconcile (11) + vector-coverage-hygiene (4) = 16/16 |
| Integration (§6 restricted PATH, live DB) | Pass | `/tmp/verify-009-s6.mjs` → ollama / nomic-embed-text-v1.5 / 768 |
| Strict packet validate | Pass | `validate.sh --strict` 0/0 |
| Live (post-reconnect, `auto`) | Pass | daemon pid 14399 on `EMBEDDINGS_PROVIDER=auto` → `embeddingProvider: ollama / nomic-embed-text-v1.5 / 768, healthy:true`; runtime init clean, failed=0 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-01 | No new `shared` runtime dependency | `node:sqlite` built-in; no package.json change | Pass |
| NFR-02 | No subprocess spawn in resolution | in-process `DatabaseSync` read | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Node ≥22.5 for the new probe path** — older Node degrades to the cascade (graceful null), not the active pointer.
2. **`node:sqlite` experimental warning** — emitted by the runtime; cosmetic, suppressible if noisy.
3. **Manifest validation still ollama-specific** — `readActiveOllamaEmbedderFromDb` still uses `getOllamaManifest`; the generic shard path is forward-looking. Non-ollama active pointers gracefully decline (no false ollama claim).

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| 008 recommended better-sqlite3 | Used `node:sqlite` | Resolution boundary (ADR-009-01) |

<!-- /ANCHOR:deviations -->
