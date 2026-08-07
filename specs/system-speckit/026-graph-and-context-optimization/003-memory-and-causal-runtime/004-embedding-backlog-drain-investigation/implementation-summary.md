---
title: "Implementation Summary: mk-spec-memory embedding-backlog drain investigation"
description: "Research-only implementation summary for iteration artifacts and follow-up work."
trigger_phrases:
  - "embedding backlog drain investigation summary"
  - "mk-spec-memory re-embed non-convergence summary"
  - "retry queue parking daemon config reload summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation"
    last_updated_at: "2026-05-28T12:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "fixed E_LINEAGE stale-key re-save (re-root on stale lineage key); tests + e2e pass"
    next_safe_action: "none; embedding lane resolved — store clean, provider flap + E_LINEAGE fixed"
    blockers: []
    key_files:
      - "mcp_server/lib/storage/lineage-state.ts"
      - "mcp_server/tests/create-record-lineage-regressions.vitest.ts"
      - "shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000010"
      session_id: "rsr-2026-05-26T20-43-39Z"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "Q1-Q6 root-cause and runbook questions answered in iteration 010"
      - "Interval/batch gap root cause = context-server.ts call-site override of env-derived config, not launcher env-forwarding"
      - "Live verification: env reaches daemon (no launcher gap); drain runs at batch 100/5s"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `004-embedding-backlog-drain-investigation` |
| **Updated** | 2026-05-27 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This packet produced the final deep-research iteration artifacts for the mk-spec-memory embedding backlog investigation. The original research iteration (below) did not implement runtime fixes; a follow-on session (2026-05-28) implemented the runtime drain fixes — see "Follow-on — runtime drain fixes".

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/iterations/iteration-010.md` | Created | Final evidence-cited consolidation for Q1-Q6, runbook, durable fixes, and residual risks |
| `research/deep-research-state.jsonl` | Updated | Appended canonical `type:"iteration"` record for iteration 10 |
| `research/deltas/iter-010.jsonl` | Created | Structured iteration delta stream for reducer reconstruction |
| `plan.md` | Created | Level 1 plan companion required by spec-folder validation |
| `tasks.md` | Created | Level 1 task tracker companion required by spec-folder validation |
| `implementation-summary.md` | Created | Continuity and summary companion required by spec-folder validation |

### Follow-on — runtime drain fixes (2026-05-28)

The research iteration's top durable fix (commit reindex `embedding_status='success'`) had already shipped as the `005-001` block in `reindex.ts`. This session implemented the remaining runtime fixes:

| Fix | File | Change |
|-----|------|--------|
| A. Retry-env override (drain blocker) | `mcp_server/context-server.ts` | `startBackgroundJob({intervalMs:5min,batchSize:5})` hardcoded options spread *after* the env-derived `BACKGROUND_JOB_CONFIG` (retry-manager.ts), clobbering `SPECKIT_RETRY_INTERVAL_MS`/`_BATCH_SIZE` on every start. Now calls `startBackgroundJob()` with no options and logs the actual config. |
| B. Active-provider pointer | `mcp_server/lib/embedders/reindex.ts` | Reindex completion called `setActiveEmbedder(db,name,dim)` without the optional `provider`, leaving the pointer empty (coerced to undefined on read). Now derives the provider from `manifest.backend` (ollama→ollama, sentence-transformers→hf-local; api left unset as ambiguous). |
| C. Provider-singleton invalidation | `shared/embeddings.ts`, `reindex.ts` | `getProvider()` cached the provider indefinitely; `resolveProvider()` reads the DB active pointer but only on (re)create. Added exported `invalidateProviderSingleton()`, called after the reindex pointer flip so the next embedding re-resolves against the new pointer. |
| D. Provider-flap hardening | `shared/embeddings/factory.ts`, `shared/embeddings.ts` | `resolveProvider()`'s ollama branch is a one-shot DB read (`resolveActiveOllamaEmbedder`) with no server probe, so a transient DB-gate miss (post-crash WAL contention) silently demotes to the **unhealthy** hf-local fallback even when ollama is up — and the result is cached for the daemon's life. Added `isOllamaReachable()` (HTTP probe); `createEmbeddingsProvider` now overrides the hf-local *fallback* to ollama when reachable, and `getProvider()` re-resolves when the cached provider is unhealthy + ollama reachable. Two vitest cases lock both directions. |

**Root-cause correction:** the interval/batch "daemon ignores tuned env" symptom was the call-site override (Fix A), not the launcher/lifecycle env-forwarding the prior handover hypothesized. The env path is sound: `.mcp.json`→`.claude/mcp.json` symlink, launcher spawns with `env: process.env`, all configs hold correct keys, retention cap read at call-time.

**Verified (2026-05-28, post-MCP-reconnect):** fresh daemon (pid 40567) spawned from the rebuilt dist; `ps eww` confirmed `SPECKIT_RETRY_QUEUE_MAX_PENDING=300000`, `BATCH_SIZE=100`, `INTERVAL_MS=5000` reached the daemon env — **no launcher env-forwarding gap**, the call-site override (Fix A) was the sole bug. The background job drained the retry queue at ~batch 100/5s (≈300 rows/12s; the old batch 5/5min would have taken ~9h). A `memory_embedding_reconcile(apply, repairSuccessCoverage:true)` then reset 579 retention false-failures + 1322 success-coverage rows; all re-embedded. **Final: 28843 success, 0 retry, 0 pending, `successMissingActiveVector=0`; 22 genuine failures remain** (11 null-content, 11 provider-error from the flap — not retention-scoped, left untouched).

**Provider-flap fix verified (later daemon, pid 68565):** after Fix D + restart, the fresh daemon resolved `embeddingProvider.provider: ollama, healthy: true` (previously a post-crash daemon, pid 55306, had cached unhealthy hf-local). `memory_search` query-embedding works through ollama.

**Resolved to 0 failed (2026-05-28) — and it was NOT a document-embedding bug.** Direct isolation tests (`generateDocumentEmbedding` on the exact failing files) returned `Float32Array(768)` for every one — embeds work. The 24 "failed" rows were: **21 stale exact-content duplicates** (same `content_hash` as an existing `success` row for the same path — flap-era cruft) and **3 genuinely-unembedded files** (`007-cp-sandbox-speckit-path-fix/{implementation-summary,plan,spec}.md`). Cleanup: deleted the 21 duplicates via `memory_delete` (success rows retain the content + vectors), and reset the 3 to `retry` so the background job re-embedded them via the proven `retryEmbedding` path. **Final store: `success` only, 0 failed / 0 retry / 0 pending.**

**Root cause of the opaque `E081` — found AND fixed (Fix E):** it is an **`E_LINEAGE`** error from the append-only lineage store. `recordLineageTransition` (mcp_server/lib/storage/lineage-state.ts) throws when a save's predecessor row has a `logical_key` (spec-folder + canonical-path + anchor) that differs from the new row's:
```
E_LINEAGE: predecessor 45114 logical identity
  system-spec-kit/030-deep-loop-skills-playbook-validation/007-cp-sandbox-speckit-path-fix::…/implementation-summary.md
does not match memory 46851 logical identity
  skilled-agent-orchestration/116-deep-skill-evolution/007-deep-stack-playbook-validation/007-cp-sandbox-speckit-path-fix::…/implementation-summary.md
```
The lineage chain assumes logical identity is **immutable**, but a **spec-folder move/rename** changes the path → predecessor `logical_key` ≠ successor → throw. These files were moved across the `026/030 → 116` reorganizations, so every re-save throws. The error matches no `userFriendlyError` pattern (core.ts:198), so it is sanitized to the generic `E081` — which is why it looked opaque. Reproduced deterministically via an isolated `handleMemorySave` run against a `.backup` copy of the production DB (a fresh DB has no predecessor → succeeds, confirming it is state/move-driven, not content- or embed-driven).

**Fix E (shipped):** the lineage rejection is *intentional* for genuinely-different identities (test `T070-3` asserts it). The real defect was narrower — the predecessor's `memory_lineage.logical_key` goes **stale** when a spec-folder reorg updates `memory_index.spec_folder/file_path` in place but leaves the older lineage row's key untouched (verified: row 45114's index path is `116-…` while its lineage key is `030-…`). So in `recordLineageTransition`, when `predecessor.logical_key !== rowLogicalKey`, it now re-checks the predecessor's **current** row identity (`buildLogicalKey(getMemoryRow(predecessorMemoryId))`): if that matches, it's the same file with a stale key → **re-root the chain under the current identity** (the supersede path still deprecates the old predecessor); if it still differs, the cross-identity link is rejected (T070-3 preserved). The change only touches the previously-always-throwing branch, so it cannot regress working saves. Regression test `T070-4` added. **Verified end-to-end:** an isolated `handleMemorySave({force})` against a fresh production-DB copy that previously threw E_LINEAGE now returns "Memory updated successfully" (id 46851); 22 lineage + 106 save/lineage tests pass.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The iteration was delivered as research artifacts only: code and DB reads supplied evidence, JSONL checks validated the reducer inputs, and no runtime implementation or production DB mutation was performed.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep runtime fixes out of this packet | The prompt and spec scope are research-only |
| Treat `memory_embedding_reconcile()` as a follow-up implementation surface | The tool is not implemented yet, but the acceptance contract is defined |
| Preserve prompt baseline and snapshot drift | Operator runbook must use live preflight counts instead of hard-coded mutation predicates |
| Prioritize reindex status commit as durable fix #1 | It most directly prevents vector reindex completion without `memory_index` success metadata |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Delta JSONL parse | Pass | `jq -c . research/deltas/iter-010.jsonl >/dev/null` |
| State-log canonical record | Pass | Last line is `type:"iteration"`, `iteration:10`, `status:"complete"` |
| Spec validation | Pass | `validate.sh --strict` passed with 0 errors and 0 warnings after adding Level 1 companion docs and metadata |
| Build (mcp-server + shared) | Pass | `tsc --build` green both workspaces; dist carries all three fixes (2026-05-28) |
| Unit tests (changed areas) | Pass | embedder-reindex/-set, retry-manager(-health), default-model: 71 pass; only pre-existing T49 `[deferred - requires DB test fixtures]` fails (unrelated) |
| Live drain (T021) | Pass | Post-reconnect: env in daemon confirmed; retry queue → 0 at batch 100/5s; reconcile re-embed → 28843 success / 0 retry / 0 pending / coverage 0; 22 genuine failures remain |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Final `research/research.md` synthesis is present and complete (10-iteration synthesis); T014 closed.
2. Runtime drain fixes A/B/C are implemented, unit-verified, and live-verified (2026-05-28): backlog drained to 0 retry/pending, 28843 success, coverage 0. 22 genuine failures remain (11 null-content, 11 provider-error) — not addressed here.
3. `memory_embedding_reconcile()` remains a proposed maintenance tool, not an available MCP handler.
4. Live DB counts drifted across snapshots; the runbook requires live preflight counts before apply.

<!-- /ANCHOR:limitations -->
