---
title: "Integration Plan — caura-memclaw (008) Memory Hardening into Spec Kit"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
researchPhase: "research/008-caura-memclaw-fleet-memory-teachings/integration"
priorities: ["UX", "automation"]
status: "plan — read-only research output; nothing implemented"
created: "2026-06-06T00:00:00Z"
---

# Integration Plan: 008 Memory Hardening → Spec Kit

Actionable roadmap derived from the 5-iteration integration research (`research.md`). **Design law for the whole plan: UX-first (zero added friction; signals ride the existing response envelope) and automation-first (every behavior fires from an existing hook/sweep/startup/doctor/pre-commit surface; no manual steps).** Most substrate already exists, so this is incremental hardening.

## Architectural rule (applies to every phase)
Split the write path into three phases and put each invariant in the right one:
1. **Pre-mutation guard** (write ingress) — `source_kind` derivation, manual/constitutional overwrite refusal, idempotency receipt lookup/replay. *(new hook point — `mutation-hooks.ts` is post-write and too late for these.)*
2. **Transactional writer** — the actual insert/update, first-timestamp tombstone, natural-key edge upsert with skip-manual.
3. **Post-mutation** (`mutation-hooks.ts`) — cache invalidation, audit-ledger append, advisory/near-dup enrichment kick. *(keep cache/audit here; never integrity decisions.)*

## Phases

### Phase 0 — Docs & scoping (no code)
- **Do:** adopt this plan; record that child `008` is **event-capture + diagnostics first** and its active causal/retention reducer children are **deferred**; reconcile the proposal's new-child number to the current free slot (`015` at time of writing — re-check at scaffold time, the concurrent peck/gem-team runs are still moving numbers).
- **Files:** `008-learning-feedback-reducers/spec.md` (+ children `001/003/004/005`), this packet's docs.
- **Automation/UX:** n/a (planning). **Exit:** 008 active reducers marked deferred; one roadmap exists.

### Phase 1 — Provenance + audit *(highest leverage)*
- **Do:** add explicit `source_kind` (`human|agent|system|import|feedback`); enforce **auto-cannot-overwrite-manual/constitutional** at write ingress; standardize automated-mutation audit append (reuse `mutation_ledger`, don't add a parallel table).
- **Files:** `lib/search/vector-index-schema.ts`, `handlers/save/create-record.ts`, `handlers/memory-crud-update.ts`, `handlers/mutation-hooks.ts`, `lib/storage/mutation-ledger.ts`; one narrow constitutional rule.
- **Automation:** write-ingress derivation + post-write audit append. **UX:** save/update responses only speak up when an automated write was *skipped to protect manual data* ("Automated update skipped human-authored fields; safe fields saved.").
- **Exit:** every automated write carries actor/source; manual/constitutional fields protected; ledger append-only + deduped.

### Phase 2 — Idempotency + near-duplicate
- **Do:** local idempotency receipt for `memory_save`/`memory_update` (server-derived key; identical retry replays, mismatched payload fails closed); advisory `near_duplicate_of` once embeddings exist; `last_dedup_checked_at` to avoid rescanning.
- **Files:** `handlers/memory-save.ts`, `memory-crud-update.ts`, `save/dedup.ts`, `save/reconsolidation-bridge.ts`, `save/enrichment-state.ts`, `handlers/memory-index.ts`, `vector-index-schema.ts`.
- **Automation:** pre-mutation receipt wrapper; post-embedding enrichment; index-scan repair for deferred vectors. **UX:** retry returns the prior success with a quiet `replayed:true`; near-dup is one inline advisory, never a block/queue.
- **Exit:** identical retry creates no duplicate; same-key/changed-payload fails clearly; unchanged rows not re-deduped.

### Phase 3 — Feedback event log hardening *(mostly already done)*
- **Do:** keep the existing shadow-only implicit feedback capture; **reserve** the system-generated feedback event/artifact types (no public feedback-write tool); ensure `batch-learning` stays shadow-only and gated.
- **Files:** `lib/feedback/feedback-ledger.ts`, `query-flow-tracker.ts`, `batch-learning.ts`, `context-server.ts`, `schemas/tool-input-schemas.ts`.
- **Automation:** already fires from `memory_search` + follow-on dispatch. **UX:** search/debug profiles show event counts + shadow proposals; **no** live ranking promise, no rating widgets.
- **Exit:** events captured automatically; no forged system feedback can enter reducer inputs; active reducers remain deferred.

### Phase 4 — Tombstones + edge promotion
- **Do:** first-timestamp-idempotent soft-delete; active/purgeable partial indexes; fix `insertEdge` so auto-promoters **skip manual** edges (preserve `created_by`/evidence); keep entity/co-occurrence as recall evidence only, never causal truth.
- **Files:** `handlers/memory-crud-delete.ts`, `memory-bulk-delete.ts`, `handlers/causal-graph.ts`, `causal-links-processor.ts`, `lib/storage/causal-edges.ts`, `lib/governance/memory-retention-sweep.ts`, `vector-index-schema.ts`.
- **Automation:** delete/unlink handlers + retention sweep + post-insert enrichment. **UX:** `/memory:manage` and causal search report "skipped manual edge" / tombstone state; no triage prompt.
- **Exit:** repeat delete doesn't extend retention; auto edge promotion idempotent; manual edge provenance never overwritten.

### Phase 5 — Stale-exclusion audit + tool-ownership lint *(polish, independent)*
- **Do:** read-only default-recall stale/status audit (does default search silently drop deprecated-but-relevant rows?); derived MCP tool-ownership lint from `TOOL_DEFINITIONS`; wire both into startup/`/doctor`/pre-commit.
- **Files:** `lib/search/hybrid-search.ts`, `handlers/memory-crud-health.ts`, `doctor_memory.yaml`, `mcp_server/tool-schemas.ts`, pre-commit, `references/config/hook_system.md`.
- **Automation:** startup health probe + `/doctor memory` + `/doctor skill-budget` + pre-commit drift block. **UX:** passive warnings in health/startup; hard block at commit only for ownership-map drift.
- **Exit:** default exclusions audited automatically; 37-tool ownership stays derived + in sync; no manual checklist.

## Mapping to 027 children (how this lands)
- New child **(re-check number; was `012`, now `015`)** = idempotency receipts (Phase 2) + tool-ownership map (Phase 5) + stale-exclusion audit (Phase 5).
- Amendments: **002** ← Phase 1 (source_kind + audit) + Phase 2 near-dup; **003** ← confirm (Phase 2 marker); **004** ← Phase 4; **005** ← Phase 4 edge skip-manual; **006** ← Phase 2 receipts as the retry primitive; **007** ← Phase 5 stale audit; **008** ← Phase 0 scope-down + Phase 3 reserve types + constitutional immunity.

## Top risks + mitigations
| Risk | Mitigation |
|---|---|
| `mutation-hooks.ts` becomes a dumping ground for transaction-time policy | Three-phase split; integrity decisions live in write handlers/storage, not the post-write hook. |
| Default-on automation silently changes recall/ranking | Near-dup stays advisory-only; feedback stays shadow-only; default-on writes record metadata/audit, never demote. |
| Audit ledger noise | Deterministic event keys, bounded retry counters, summary diagnostics in `/doctor` (not raw dumps). |
| Auto edge promotion clobbers manual meaning | Natural-key dedup must preserve manual `created_by`/evidence; auto skips or adds parallel low-strength evidence only. |
| Stale audit false alarms (deprecated rows excluded on purpose) | Distinguish intended exclusion from silent hard-exclusion; report as diagnostic until a policy change is decided. |
| Tool-ownership lint drifts | Derive from `TOOL_DEFINITIONS`; docs are generated/validated output, not the authority. |

## Suggested order
**Phase 0 → 1 → 2 → (3 already mostly done, just reserve types) → 4 → 5.** Phases 1–2 deliver the most safety per unit effort; Phase 5 is independent and can land anytime.
