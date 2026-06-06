---
title: "caura-memclaw (MemClaw) — Sub-Packet Proposal for 027"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
researchPhase: "research/008-caura-memclaw-fleet-memory-teachings"
newChildProposed: 1
newChildNumber: "015-memclaw-derived-memory-hardening"
amendmentsProposed: 7
created: "2026-06-06T09:15:00Z"
status: "proposal — not yet scaffolded (operator chose proposal-doc-only)"
concurrencyNote: "Reconciled across the concurrent 006-peck (children 009-011) and 007-gem-team (children 012-014) runs; this proposal uses 015 for its new child."
---

# caura-memclaw — Sub-Packet Proposal for 027

Derived from the 20-iteration, adversarially-verified deep-research pass in `research/008-caura-memclaw-fleet-memory-teachings/` (see `research.md`). Evidence is `file:line` into `external/caura-memclaw-main` (Apache-2.0 — design inspiration only, no code copied).

**The honest headline:** caura-memclaw is built for the *opposite* deployment shape (multi-tenant fleet memory). After adversarial verification, the bulk of its transferable signal **validates 027's existing children (002-006)** and supplies a short list of **hardening-grade sharpenings**. Its marquee feature — cross-agent self-improving memory — is **negative knowledge** for a single-user store, and its **direct, asymmetric feedback mutation is an anti-pattern that confirms 027/008's default-off, shadow-first stance is correct**. Only a small set of genuinely-new, cross-cutting items justify a new child.

This proposal therefore has two parts:
- **Part A — one new Level-2 child `015-memclaw-derived-memory-hardening`** for the cross-cutting items that do not fit an existing child's frozen scope.
- **Part B — seven amendments** to existing children (the larger share of the value).

> **⚠ Reconciliation with concurrent research (read first).** A concurrent run, `research/006-peck-source-deep-mining/`, proposes new children **009-peck-verification-discipline, 010-reviewer-prompt-benchmark-substrate, 011-acceptance-coverage-gate** (its `sub-packet-proposal.md`). To avoid a numbering collision, this proposal's new child is **`015-`** (reconciled: the next free slot after peck's `009-011` and the concurrent gem-team/007 proposals `012-014`; existing implementation children run `000`-`008`). If the operator does not adopt all of peck's 009-011, the new child can be compacted to the next actually-free slot at scaffold time (per the no-delete+recreate naming convention). (This research packet is folder-scoped with its own iteration sequence `001-020`, independent of the concurrent 006 run.)

---

## Headline recommendation

| Recommendation | Type | Target | Verdict basis |
|---|---|---|---|
| Idempotency receipts for retryable memory writes | NEW | 015 (P1) | T1 ADAPT |
| MCP tool-ownership map (37-tool surface) | NEW | 015 (P2) | T12 ADAPT |
| Default-recall stale/status hard-exclusion audit | NEW | 015 (P3) | T13 ADAPT |
| `source_kind` provenance + auto-cannot-overwrite-manual | AMEND | 002 | T2 validate+sharpen |
| Advisory near-duplicate (deterministic, no LLM judge) | AMEND | 002 | T3 ADAPT |
| First-timestamp-idempotent tombstone + active/purgeable index split + entity≠causal boundary | AMEND | 004 | T7/T8/T10 |
| Natural-key idempotent edge promotion + provenance-skip-manual | AMEND | 005 | T9 validate |
| **Scope 008 down: event-capture + diagnostics first; defer active reducers** | AMEND | 008 | T4/T5/T6 |
| `last_dedup_checked_at` incremental marker; explicit fingerprint is *better* than MemClaw | AMEND (confirm) | 003 | T14 validate |
| Compact append-only audit for automated mutations | AMEND | 002/004/008 | T11 |

---

## PART A — Proposed new child

## Proposal 015: `015-memclaw-derived-memory-hardening` — Operational write/surface hardening

**Scope summary**: Three cohesive, single-user-grounded hardening additions that cross-cut or fall outside existing children's frozen scope, each directly evidenced in MemClaw and surviving adversarial verification.

1. **P1 — Idempotency receipts (T1).** A minimal SQLite operation-receipt for retryable `memory_save`/`memory_update`: key on a server-derived `(operation_id | content_hash)` plus a request fingerprint; on identical retry, replay the prior result instead of inserting a duplicate; resolve "same retry" vs "same content already exists" distinctly. Deliberately **excludes** MemClaw's HTTP pending-sentinel/TTL/poll middleware — a local single-daemon needs only the receipt + one transaction. Evidence: `common/models/idempotency.py:30-53`; `core-api/src/core_api/middleware/idempotency.py:158-203`; `common/models/memory.py:96-105` (partial unique index `deleted_at IS NULL AND client_request_id IS NOT NULL` — the SQLite analog is a partial unique index on the receipt key).
2. **P2 — MCP tool-ownership map (T12).** A lightweight ownership/stability note for the 37-tool MCP surface (who owns each tool group, add-an-operation criteria, deprecation discipline). **Explicitly rejects** MemClaw's op-dispatch consolidation (it harms LLM tool discoverability — MemClaw only proves it on a 12-tool surface) and its public-SemVer governance (internal surface). Evidence: `docs/api-surfaces.md:1-74`; anti-evidence `core-api/src/core_api/mcp_server.py:735,1169`.
3. **P3 — Default-recall stale/status hard-exclusion audit (T13).** A verify-and-fix task confirming Spec Kit's default search does not silently hard-exclude deprecated-but-relevant memories. MemClaw itself hard-excludes `outdated`/`conflicted` unless `status_filter` is supplied — a self-inconsistency worth auditing against in Spec Kit. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:986,1022`.

**Level estimate**: L2 (~150-350 LOC across receipt table + write-wrapper + audit script; P2 is docs-only).
**Files (indicative)**: idempotency receipt schema + `memory_save`/`memory_update` wrapper in `mcp_server/handlers/save/**`; a `docs/` ownership map under the memory skill; one audit script.

**Dependencies**:
- Requires: existing memory write path + SQLite index.
- Coordinates with: 002 (provenance), 006 (reconciliation/idempotency overlap), 008 (reserved-type provenance). **Independent of** the concurrent peck proposals 009-011.

**Out of scope (negative knowledge guardrails)**: no multi-tenant scoping, no LLM-judge dedup, no HTTP idempotency middleware, no op-dispatch tool consolidation, no SemVer/release-please governance.

---

## PART B — Amendments to existing children

> These are validations + sharpenings, not new scope. Each child's frozen `spec.md` scope is respected; amendments are documented for the next time each child is planned/implemented.

### Amendment to 002 (memory-write-safety)
- **T2 `source_kind` enum + auto-cannot-overwrite-manual** — add an explicit `source_kind` (`human|agent|system|import|feedback`) and enforce that automated writers (enrichment, promoters, reducers) may not overwrite human/constitutional fields. MemClaw's merge-only enrichment **validates** the direction but is *partial* (metadata keys are still enriched: `merge_enrichment_fields.py:28-50`) — Spec Kit should make the field-source rule explicit, not implicit.
- **T3 advisory near-duplicate** — compute `near_duplicate_of` + similarity only when embeddings already exist; deterministic threshold; advisory, never hard-reject; no LLM judge / review queue. Evidence: `detect_near_duplicate.py:25-27,106` (adopt) vs `check_semantic_duplicate.py:7-10,193-210` (the hard-reject path = do NOT copy).
- **T11 automated-mutation audit** — compact append-only audit rows for automated writes. Evidence: `common/models/audit.py:11-25`.

### Amendment to 003 (incremental-index-foundation)
- **T14 (confirmation)** — MemClaw uses a single **global** `Vector(VECTOR_DIM)` with no per-row embedder version/fingerprint columns (`common/models/memory.py:24`); Spec Kit's planned explicit chunk fingerprint + embedder-tuple + derived-state **improves on** MemClaw. Keep the `last_dedup_checked_at` incremental-marker idea (`memory.py:75-77`). No scope change — this is positive confirmation that 003's design is sound.

### Amendment to 004 (causal-edge-tombstones)
- **T7 first-timestamp-idempotent soft-delete** — preserve the first tombstone timestamp (COALESCE-style) so repeat deletes do not extend retention. MemClaw's `memory_soft_delete` *rewrites* `deleted_at` on repeat (`postgres_service.py:418-423`) — Spec Kit should improve on this.
- **T8 active/purgeable partial-index split** — index active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) paths separately to keep both hot. Evidence: `memory.py:96-135`.
- **T10 entity≠causal boundary** — keep any co-occurrence/entity signal as *low-weight recall evidence*, never as causal truth. MemClaw has **no** memory↔memory causal edges (only `supersedes_id` + entity relations: `memory.py:79-83`, `entity.py:27-62`); defer importing an entity graph absent measured need.

### Amendment to 005 (metadata-edge-promoter)
- **T9 natural-key idempotent promotion + provenance** — make generated-edge promotion idempotent via a natural-key unique constraint, tag provenance, and skip already-wired manual links. MemClaw's entity `Relation` does exactly this (`uq_relations_natural_key`, migration `001_initial_schema.py:163-165`; `postgres_service.py:2983-3048`) — direct validation of 005's planned "avoid duplicating manual metadata links."

### Amendment to 006 (write-path-reconciliation)
- **T1 cross-reference** — the idempotency receipt (Proposal 015/P1) is the reconciliation primitive for retry-safe writes; 006's async post-insert-enrichment model is **validated** by MemClaw's decoupled embed/enrich (the *pattern*, not the Pub/Sub infra).

### Amendment to 007 (semantic-trigger-fallback)
- **T13 cross-reference** — the stale/status hard-exclusion audit (Proposal 015/P3) protects the lexical-first fallback from silently dropping deprecated-but-relevant matches.

### Amendment to 008 (learning-feedback-reducers) — the central reframe
MemClaw's `evolve`→`insights` loop is the closest analog to 008 and the most important lesson. After verification it is a **cautionary anti-pattern**, not a model:
- It applies **direct, immediate, asymmetric** weight deltas (success `+0.10`, failure `-0.15`) to canonical weight (`evolve_service.py:147-165`; `constants.py:494-503`), persists LLM rules **active at confidence ≥ 0.5 with no shadow state** (`evolve_service.py:904-923`), and lets low weight feed stale-archival (`postgres_service.py:1606-1644`). In a sparse single-user corpus, one mis-attributed failure can demote a rare-but-correct memory irrecoverably.

Recommended amendments (all *consistent with* 008's existing default-off/shadow-first plan — this sharpens, not redirects):
- **T4 — scope 008 Phase-1 to event-capture + diagnostics only.** Land an append-only feedback-event log (audit/replay/diagnostics) and **defer all active reducers** (retrieval-score / retention / FSRS mutation) until measured ledger quality proves positive value. The fleet payoff that justifies MemClaw's aggressiveness does not exist for one user.
- **T5 — reserve system-generated feedback artifact types** so the user-facing agent cannot forge learning signals once any reducer consumes them. Evidence: `common/enrichment/constants.py:97-110`; `routes/memories.py:101-131`; `mcp_server.py:281-310`.
- **T6 — reject asymmetric damping.** Use symmetric/soft evidence accumulation, a rare-but-correct guard (high-tier/constitutional/user-confirmed/sparse-domain memories are protected from feedback-driven demotion or archival), and **constitutional immunity** (feedback may never demote or archive constitutional/protected memories). Evidence: `constants.py:494-503`; `evolve_service.py:340-375`.
- Insight modes (failures/stale/patterns) survive only as **opt-in manual diagnostics** with minimum-corpus thresholds; **divergence does not transfer** (cross-agent only: `insights_service.py:419-454,1057-1061`).

---

## Sequencing

1. **008 amendment first (documentation/scoping)** — record the scope-down + symmetric-damping/constitutional-immunity invariants before any 008 implementation work begins (cheapest, highest-leverage, prevents building the anti-pattern).
2. **002 amendments** — `source_kind` + automated-mutation audit are P0 provenance gates that 008's event log also depends on.
3. **015/P1 idempotency receipts** — small, isolated, validates 006.
4. **004/005 amendments** — fold into those children when next planned.
5. **015/P2 tool-ownership map + 015/P3 stale audit** — low-risk, independent, can land anytime.

> Cross-run sequencing: this proposal is **orthogonal to** and **non-conflicting with** the concurrent peck proposals (009-011) — peck addresses verification discipline / reviewer-prompt benchmarking / acceptance-coverage; this addresses memory-store write/surface hardening + the 008 feedback reframe. They can be adopted independently.

## Provenance

Source: `research/008-caura-memclaw-fleet-memory-teachings/research.md` §5 (surviving teachings T1-T14), §6 (negative-knowledge ledger), §7 (027-child mapping). 20 iterations (001-020), adversarially verified (017-020) and adjudicated against MemClaw ground truth. All MemClaw references are design inspiration only (Apache-2.0; no code copied).
