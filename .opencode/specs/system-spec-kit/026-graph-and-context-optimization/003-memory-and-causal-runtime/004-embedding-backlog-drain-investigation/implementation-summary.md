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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation"
    last_updated_at: "2026-05-28T12:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "verified live drain: retry+pending=0, 28843 success, 22 genuine failed; env confirmed in daemon"
    next_safe_action: "none; drain resolved — optional: 22 genuine failures + T014 synthesis"
    blockers: []
    key_files:
      - "mcp_server/context-server.ts"
      - "mcp_server/lib/embedders/reindex.ts"
      - "shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000010"
      session_id: "rsr-2026-05-26T20-43-39Z"
      parent_session_id: null
    completion_pct: 98
    open_questions:
      - "Are the 22 genuine failures (11 null-content, 11 provider-error) worth a further pass?"
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

**Root-cause correction:** the interval/batch "daemon ignores tuned env" symptom was the call-site override (Fix A), not the launcher/lifecycle env-forwarding the prior handover hypothesized. The env path is sound: `.mcp.json`→`.claude/mcp.json` symlink, launcher spawns with `env: process.env`, all configs hold correct keys, retention cap read at call-time.

**Verified (2026-05-28, post-MCP-reconnect):** fresh daemon (pid 40567) spawned from the rebuilt dist; `ps eww` confirmed `SPECKIT_RETRY_QUEUE_MAX_PENDING=300000`, `BATCH_SIZE=100`, `INTERVAL_MS=5000` reached the daemon env — **no launcher env-forwarding gap**, the call-site override (Fix A) was the sole bug. The background job drained the retry queue at ~batch 100/5s (≈300 rows/12s; the old batch 5/5min would have taken ~9h). A `memory_embedding_reconcile(apply, repairSuccessCoverage:true)` then reset 579 retention false-failures + 1322 success-coverage rows; all re-embedded. **Final: 28843 success, 0 retry, 0 pending, `successMissingActiveVector=0`; 22 genuine failures remain** (11 null-content, 11 provider-error from the flap — not retention-scoped, left untouched).

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

1. Final `research/research.md` synthesis has not been generated by the workflow reducer in this turn.
2. Runtime drain fixes A/B/C are implemented, unit-verified, and live-verified (2026-05-28): backlog drained to 0 retry/pending, 28843 success, coverage 0. 22 genuine failures remain (11 null-content, 11 provider-error) — not addressed here.
3. `memory_embedding_reconcile()` remains a proposed maintenance tool, not an available MCP handler.
4. Live DB counts drifted across snapshots; the runbook requires live preflight counts before apply.

<!-- /ANCHOR:limitations -->
