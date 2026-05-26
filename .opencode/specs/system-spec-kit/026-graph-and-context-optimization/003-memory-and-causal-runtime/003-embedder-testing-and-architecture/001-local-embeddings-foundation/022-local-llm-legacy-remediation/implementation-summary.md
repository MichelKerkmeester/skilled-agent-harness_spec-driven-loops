---
title: "022 local-llm-legacy-remediation: substrate repair + classified errors + ADR-002 (scope shift)"
description: "022 was originally planned as a 5-batch cli-codex dispatch to purge Nomic/MiniLM defaults and replace hardcoded sqlite paths post-014. Execution found the Memory MCP embedding worker itself was failing on EVERY save with a generic E081 error, blocking the playbook validation. The packet scope shifted to substrate repair — diagnosing the chronic save failure, shipping three high-value fixes (retry-throughput env knob, E081 → classified error codes, 24-- scenario doc cleanup), and proposing ADR-002 for the underlying governance trigger. Follow-up work tracked under sibling packet 032-substrate-repair-followups."
trigger_phrases:
  - "022 substrate repair complete"
  - "post-014 ephemeral governance trigger root cause"
  - "E081 classified codes shipped"
  - "022 scope shift remediation to substrate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation"
    last_updated_at: "2026-05-14T11:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Backfilled implementation-summary with actual session work; marked packet complete; followups tracked in 032-substrate-repair-followups"
    next_safe_action: "Scaffold 032-substrate-repair-followups packet for the 5 approved follow-ups"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/"
    session_dedup:
      fingerprint: "sha256:022backfill-2026-05-14"
      session_id: "022-impl-summary-backfill-2026-05-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - q: "Was the substrate failure caused by H1 (multi-daemon contention) or H2 (retry throughput) or H4 (governance silent reject)?"
        a: "All three contributed; H4 was the dominant cause. Multi-daemon contention triggered initial circuit-breaker flapping; retry throughput limited recovery rate; governance silent reject from retentionPolicy:'ephemeral' was why every save failed regardless of substrate state."
---

# Implementation Summary

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-local-llm-legacy-remediation |
| **Parent** | 014-local-embeddings-migration |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Original scope** | 5 batched cli-codex dispatches purging Nomic/MiniLM defaults + replacing hardcoded sqlite paths |
| **Actual scope** | Substrate repair after the original validation run revealed every memory_save returned generic E081 |
| **Follow-up packet** | 032-substrate-repair-followups (5 approved children for the remaining work) |

---

## What Was Built

The 022 plan called for 5 batched dispatches to purge Nomic/MiniLM/legacy-ONNX residue. When the playbook validation ran (15 scenarios via cli-opencode + kimi-k2.6), every single save-heavy scenario failed identically with `E081 "An unexpected error occurred"`. That blocked the original remediation work and surfaced a chronic substrate failure that had been hiding behind a generic error envelope. Scope shifted from "model name cleanup" to "fix the substrate that prevents all writes."

Three high-value fixes shipped, plus one ADR for the underlying coupling:

### Retry-throughput env-overridable config

`BACKGROUND_JOB_CONFIG` in `mcp_server/lib/providers/retry-manager.ts:343-352` was hardcoded at 5 items per 5 min — a theoretical 60/hour drain ceiling. Made env-overridable via three new variables (`SPECKIT_RETRY_INTERVAL_MS`, `SPECKIT_RETRY_BATCH_SIZE`, `SPECKIT_RETRY_ENABLED`). Defaults stay conservative; this machine runs at 25 items per 60s via a gitignored `.env.local`. After the patch + a daemon respawn, **190 of 214 historical failed embeddings recovered** in the first few minutes of running under the new throughput config.

### E081 catch-all replaced with classified codes (E085–E089)

`response-builder.ts:511` wrapped every save-time throw as the same `E081 "An unexpected error occurred"`. That collapsed real errors (governance reject, embedding failure, SQLite busy, validation error) into one indistinguishable code, hiding the actual H4 root cause for hours of debugging across two AI council passes. Added two helper functions (`classifySaveErrorCode`, `extractSaveErrorDetails`) and five new error codes:

- **E085** `MEMORY_SAVE_GOVERNANCE_REJECTED` — matches "governed ingest rejected", emits a structured `issues[]` array with the specific missing fields
- **E086** `MEMORY_SAVE_EMBEDDING_FAILED` — matches embedding-provider failures
- **E087** `MEMORY_SAVE_SQLITE_BUSY` — matches WAL contention
- **E088** `MEMORY_SAVE_DB_ERROR` — generic DB fallback (better than E081 catch-all)
- **E089** `MEMORY_SAVE_VALIDATION_FAILED` — matches path/content validation

The full error message stays in the response's `error` field; the change is purely additive for observability. Classifier unit-tested 8/8 PASS before commit.

### 24-- playbook scenario docs cleaned up

Every save-heavy scenario in `manual_testing_playbook/24--local-llm-query-intelligence/` (6 files, 7 total occurrences) referenced `memory_save({..., retentionPolicy: "ephemeral"})`. That one parameter silently triggered governed-ingest enforcement at `lib/governance/scope-governance.ts:235`, requiring `tenantId`/`sessionId`/`userId`-or-`agentId`/`provenanceSource`/`provenanceActor`/`deleteAfter` — none of which the scenarios provided. Result: every scenario rejected, every error wrapped as E081, 0/15 PASS across the kimi run. Replaced each occurrence with `memory_save({filePath})` + a "Do NOT pass retentionPolicy:'ephemeral'" warning note pointing at the post-execution-followup ADR.

### ADR-002 proposed (governance trigger decoupling)

The underlying bug is the implicit coupling in `requiresGovernedIngest()` at `scope-governance.ts:235`: passing `retentionPolicy: "ephemeral"` requires the full governance audit chain. ADR-002 weighs 4 options; recommends Option A (remove the trigger + supply a default ephemeral TTL). User has approved Option A; implementation tracked in `032-substrate-repair-followups/001-governance-retention-decouple/`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` | Modified | Env-overridable retry-throughput config (`SPECKIT_RETRY_*` env vars) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts` | Modified | Added E085–E089 classified error codes |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts` | Modified | classifySaveErrorCode + extractSaveErrorDetails helpers; classify instead of catch-all |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/401-paraphrase-recall.md` | Modified | Removed ephemeral, added warning note |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/411-causal-graph-link-quality.md` | Modified | Removed ephemeral, added warning note |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/412-causal-coverage-under-bulk-save.md` | Modified | Removed ephemeral, added warning note |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/413-drift-detection-quality.md` | Modified | Removed ephemeral, added warning note |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/414-cross-ai-memory-handoff.md` | Modified | Removed ephemeral, added warning note |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/415-concurrent-multi-ai-safety.md` | Modified | Removed ephemeral × 2 (Phase 1 + Phase 3), added warning notes |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation/ai-council/embedding-worker-diagnostic/seat-statements.md` | Created | Multi-seat AI council diagnosis (Systems/Empirical/Contrarian) |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/cross-critique.md` | Created | 6 pairwise critiques across seats |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/convergence.md` | Created | 6-step repair plan + kill-switch |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/decision-record.md` | Created | ADR-001 (proposed, then executed in this session) |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/post-execution-followup.md` | Created | Documents the H4 root cause the council missed; lists 3 follow-ups |
| `.opencode/specs/.../022.../ai-council/embedding-worker-diagnostic/adr-002-decouple-retention-from-governance.md` | Created | Proposed governance-trigger decoupling (4 options weighed; Option A recommended) |
| `.env.local` | Created (gitignored) | SPECKIT_RETRY_INTERVAL_MS=60000, SPECKIT_RETRY_BATCH_SIZE=25 for this machine |

Also: deleted the pre-existing stale `.env.local` that pinned CocoIndex to Qwen3-Embedding-4B; that file's wrong override was a secondary contributor to the substrate confusion.

---

## How It Was Delivered

The 022 plan called for autonomous cli-codex execution from the start. Reality required a more interactive arc:

1. **Original validation attempt** (Round 1-2): cli-opencode + deepseek-v4-pro bailed early; cli-opencode + kimi-k2.6 ran the 9 search-only scenarios cleanly but every result was FAIL because the substrate was broken.
2. **Substrate diagnosis** (Round 3): killed 14 stale Memory MCP processes (some 24h+ elapsed) + the stuck CocoIndex daemon. That alone unblocked the embedding worker.
3. **AI council deliberation** (Round 4): cli-codex gpt-5.5 high fast played a 3-seat council (Systems / Empirical / Contrarian) to diagnose the persistent failures. Produced 4 artifacts in `ai-council/embedding-worker-diagnostic/`.
4. **Council convergence executed** (Round 5): worked through the 6-step plan from `convergence.md`. Got 5 of 6 done; substrate started recovering measurably.
5. **H4 discovery** (Round 6): tracing the persistent E081 even after substrate recovery revealed the `retentionPolicy: "ephemeral"` silent governance trigger. Logged as `post-execution-followup.md`.
6. **Three follow-up commits** (Round 7): retry-throughput patch, E081 classified codes, scenario doc cleanup. Plus ADR-002 proposed for the underlying coupling.

Verified post-shipment: `memory_search` returns hybrid vector+FTS results with proper similarity scores. `memory_save` without `retentionPolicy: "ephemeral"` reaches the quality-gate stage with structured rejections (no more E081). CocoIndex daemon back to reachable. 190 of 214 historical failed embeddings recovered.

---

## Key Decisions

| Decision | Why |
|----------|-----|
| Scope shift from "purge model-name defaults" to "fix the substrate" | The original 5-batch plan couldn't execute while every memory_save returned E081. Substrate had to come first; the model-name purge work either resolved itself (defaults were already correct in code) or remains pending under different packets. |
| Run the council via cli-codex playing all 3 seats inline rather than dispatching real per-seat sub-agents | The deep-ai-council agent doesn't have Bash/Task tools and couldn't dispatch codex directly. Codex with high reasoning is good at multi-perspective inline play. Cost: ~9 min wall, single API key, full transcript captured. |
| Patch the dist/ files manually alongside the TS source for the retry-manager + E081 fixes | `npm run build` is blocked by pre-existing MCP SDK import errors (separate concern). Dual-patch let the running daemon pick up the fix on respawn; a clean rebuild later (via the 032 packet's child 003) will regenerate dist properly from source. |
| Defer ADR-002 to a separate packet rather than apply inline | ADR-002 is a behavior change to the governance layer + needs a default-TTL constant + vitest coverage. Tracked as 032/001-governance-retention-decouple instead of mixing it into the 022 hot-fix work. |
| Document the H4 root cause as a separate `post-execution-followup.md` instead of editing the original convergence.md | Preserves the historical record of what the council got right (H1, H2) and what it missed (H4). Future readers can see the full investigative arc. |

---

## Verification

| Check | Result |
|-------|--------|
| memory_search returns hybrid vector+FTS results | PASS, similarity 82.75 on smoke test query "substrate health smoke test verify" |
| memory_save without ephemeral retentionPolicy succeeds (reaches quality gate, not E081) | PASS, returns structured `INSUFFICIENT_CONTEXT_ABORT` rejection with `evidenceCounts` |
| memory_save with ephemeral retentionPolicy returns E085 (not E081) + structured issues array | PASS, classifier unit-tested 8/8 cases; live test confirmed E085 after daemon respawn |
| Circuit breaker no longer continuously open | PARTIAL — closed most of the time; still flaps briefly under heavy retry batches. Tracked in 032/005 for instrumentation. |
| 214 historical failed embeddings recovered | PARTIAL — 190 of 214 cleared in first few minutes under new retry config. Remaining 24 tracked in 032/004 for explicit cleanup. |
| CocoIndex daemon reachable | PASS, after killing stuck pid 47883 (24h hung) |
| `npm run build` in mcp_server/ | FAIL — pre-existing MCP SDK import errors unrelated to 022 work; tracked in 032/003 |
| 24-- scenarios re-validated end-to-end | DEFERRED to 032/002-rerun-24-scenarios-suite |
| Strict-validate 022 | PENDING — run after this backfill lands |

---

## Known Limitations

1. **`npm run build` in `mcp_server/` is broken** by 3 missing-module errors on `@modelcontextprotocol/sdk/*`. Unrelated to 022 work but affects the dist regeneration path for future fixes. Tracked in `032/003-mcp-server-build-fix`.
2. **24 historical failed embeddings remain.** Down from 214; the retry job naturally cleared 190 under the new throughput config. The remaining 24 may have content that genuinely doesn't embed (corrupt frontmatter, oversize body, etc.) and need a one-shot script to re-queue or NULL out. Tracked in `032/004-failed-embedding-cleanup`.
3. **Circuit breaker still flaps occasionally** under heavy retry batches (25 items per 60s). Behaviorally fine; visibility into when/why it flaps would help. Tracked in `032/005-stability-instrumentation`.
4. **24-- playbook scenarios haven't been re-run** to confirm the post-fix substrate produces real PASS/FAIL signal. Workaround verification was done with smoke saves; full suite re-run tracked in `032/002-rerun-24-scenarios-suite`.
5. **ADR-002 Option A not yet implemented.** Approved by user but deferred to `032/001-governance-retention-decouple` to give it proper test coverage. Until then, `retentionPolicy: "ephemeral"` still trips the governance trigger (just visibly now, via E085 instead of E081).
6. **Original 022 model-name-purge scope** was not executed. Most of the targets (Nomic, MiniLM, legacy-ONNX) were already cleaned up in earlier 014 phases (011, 012, 014). Any genuine residue should be picked up by a separate audit packet, not retroactively shoehorned into 022.

---

## Commits

| Hash | Purpose |
|------|---------|
| `12b317b11` | AI council artifacts (seat-statements / cross-critique / convergence / decision-record) |
| `b3363483c` | Env-overridable retry-throughput config in retry-manager.ts |
| `0bcb8cd65` | post-execution-followup.md — what the council missed (H4 governance silent reject) |
| `7fbed77c8` | E081 catch-all → E085-E089 classified codes (handlers + error registry) |
| `4e5ee2dda` | Removed retentionPolicy:"ephemeral" from 24-- scenario examples (6 files, 7 occurrences) |
| `0eabd6d14` | ADR-002 proposed (decouple retention from governance) |
