# Integration Research: caura-memclaw (008) → Spec Kit Memory (UX + Automation first)

<!-- ANCHOR:deep-research-008-integration -->

**Packet:** `…/research/008-caura-memclaw-fleet-memory-teachings/integration/`
**Lineage:** `2026-06-06-008-integration-ux-automation` · folder-scoped iterations **001-005** (5)
**Executor:** cli-opencode `openai/gpt-5.5-fast --variant high`, read-only, parallel fan-out (width 5)
**Question:** How to integrate the 008 proposal (new child + amendments) and what it impacts — UX and automation as the top priorities.
**Status:** Converged (5/5 insight; grounded in live `file:line` reads of the memory server, commands, agents, hooks).

---

## 1. EXECUTIVE SUMMARY

**The integration is low-risk incremental hardening, not new construction — because most of the substrate already exists.** The five passes (read against the live code) found that the Spec Kit memory server already has: governance provenance fields on writes, a **shadow-only feedback ledger** with fixed event types and *no* ranking side-effects, an **append-only `mutation_ledger`** (SQLite triggers), a **natural-key on `causal_edges`**, always-surfaced constitutional memories, a centralized **post-write hook fan-out** (`mutation-hooks.ts`), and a **response-envelope hint system** (`response-hints.ts`, `mutation-feedback.ts`). So the 008 "scope feedback down to capture + diagnostics" recommendation is **largely already implemented**, and the rest is small, well-localized edits.

**Two design surfaces make UX + automation natural:**
- **Automation surface:** the existing write-ingress + `mutation-hooks.ts` (post-write) + retention sweep + startup hooks + `/doctor` + pre-commit. Every new behavior binds to one of these — no manual steps.
- **UX surface:** the existing MCP **response envelope** (`hints[]`, `meta.autoSurface`, `postMutationHooks`, `assistiveRecommendation`). New signals ride these fields, so command syntax never changes and the hot path stays one-step.

**The one architectural caution:** `mutation-hooks.ts` is **post-write only** — too late for overwrite-prevention or idempotency decisions. Those must live at **write ingress / inside the transaction** (split into pre-mutation guard → transactional writer → post-mutation invalidation/audit). This is the single most important structural finding.

---

## 2. WHAT ALREADY EXISTS (the pleasant surprise)

| Capability | Already in the code | Evidence |
|---|---|---|
| Write-time provenance fields | `provenance_source` / `provenance_actor` accepted on save | `handlers/memory-save.ts:3079-3108` |
| Implicit source classification | template/manual fallback on save | `memory-save.ts:345-350, 523-533` |
| Duplicate checks at save | `save/dedup.ts`; assistive recommendations + related IDs in response | `handlers/save/dedup.ts`, `save/response-builder.ts:377-393` |
| **Shadow-only feedback capture (008)** | `feedback-ledger.ts` shadow-only, 5 fixed event types, **no ranking side effects**; `search_shown`/`result_cited`/follow-on logged | `lib/feedback/feedback-ledger.ts:1-13, 25-45, 115-127, 161-170`; `memory-search.ts:1529-1598`; `context-server.ts:1153-1164` |
| Append-only audit | `mutation_ledger` via SQLite triggers; save ledger append; retention sweep reports ledger | `lib/storage/mutation-ledger.ts`, `save/response-builder.ts:330-350`, `memory-retention-sweep.ts:36-68` |
| Causal natural key | `causal_edges` has a natural unique key + bounded auto-edge caps | `lib/storage/causal-edges.ts` |
| Constitutional immunity substrate | constitutional always-surfaced; invalid constitutional paths downgraded with governance audit | `hooks/memory-surface.ts:175-215`, `memory-save.ts:422-442` |
| Post-write automation | centralized hook fan-out; responses attach `postMutationHooks` | `handlers/mutation-hooks.ts:21-126`, `save/response-builder.ts:628-675` |
| Response-envelope UX | `hints[]`, `meta.autoSurface`, mutation-feedback fields | `hooks/response-hints.ts:86-128`, `hooks/mutation-feedback.ts:6-58` |
| Stale exclusion (to audit) | search forces `includeArchived=false`; FTS filters `importance_tier != 'deprecated'` | `handlers/memory-search.ts`, `lib/search/sqlite-fts.ts` |

---

## 3. THE ACTUAL INTEGRATION WORK (the gaps)

| Item | Gap to close | Target file(s) | Visible? | Auto-trigger |
|---|---|---|---|---|
| **`source_kind` + auto-can't-overwrite-manual** | add explicit `source_kind` enum; enforce manual/constitutional protection at write ingress (not caller discipline) | `lib/search/vector-index-schema.ts`, `handlers/save/create-record.ts`, `memory-crud-update.ts`, constitutional rule | audit-only | write ingress (pre-mutation guard) |
| **Idempotency receipts** | new receipt table + pre-mutation replay wrapper for `memory_save`/`memory_update` | `vector-index-schema.ts`, `memory-save.ts`, `memory-crud-update.ts`, `save/dedup.ts` | invisible (retry replays) | pre-mutation wrapper |
| **Edge promotion skip-manual** | `insertEdge` currently updates `created_by` on existing rows → auto-promoters must **skip manual** rows | `lib/storage/causal-edges.ts`, `causal-links-processor.ts` | invisible | post-insert enrichment |
| **First-timestamp tombstone + index split** | soft-delete must keep first timestamp (COALESCE); add active/purgeable partial indexes | `memory-crud-delete.ts`, `memory-bulk-delete.ts`, `vector-index-schema.ts`, `memory-retention-sweep.ts` | health-visible | delete handlers + sweep |
| **Stale-exclusion audit** | read-only audit: is default recall silently dropping deprecated-but-relevant rows? | `memory-crud-health.ts`, `lib/search/hybrid-search.ts`, `doctor_memory.yaml` | diagnostic | startup health + `/doctor memory` |
| **Reserve feedback types** | already 5 fixed types; just keep them server-only (no public feedback-write tool) | `lib/feedback/feedback-ledger.ts`, `schemas/tool-input-schemas.ts` | invisible | server-side only |
| **008 active reducers** | **defer** — rescope the `008` active causal/retention reducer children to diagnostics-first | `008-learning-feedback-reducers/{spec,001,003,004,005}.md` | spec-only | n/a (planning) |
| **Tool-ownership map** | generate/lint from `TOOL_DEFINITIONS`; don't hand-maintain | `mcp_server/tool-schemas.ts`, `tools/index.ts`, pre-commit, `/doctor skill-budget` | diagnostic | pre-commit + doctor |
| **Advisory near-duplicate** | extend existing assistive-recommendation path; deterministic, never hard-reject | `save/reconsolidation-bridge.ts`, `save/response-builder.ts` | advisory hint | save-time when embeddings exist |

---

## 4. IMPACT SUMMARY

- **Skills:** `system-spec-kit` carries ~all of it (it owns the memory server + spec children + constitutional + templates). `sk-doc` = the tool-ownership map doc + amended child spec-docs. `sk-code` = the TypeScript implementation + verification surface. `system-skill-advisor` = **no behavior change** (docs-only boundary note). **No new skill needed.**
- **Commands:** `/memory:save` (source_kind, idempotency, near-dup, feedback — all behind the existing envelope), `/memory:search` (stale audit + shadow feedback), `/memory:manage` (audit/retention/tombstone visibility), `/memory:learn` (constitutional immunity), `/speckit:*` (continuity saves tagged `source_kind`), `/doctor memory` (one target reports all hardening health), `/doctor skill-budget` (tool-ownership lint).
- **Agents:** `@context` (read-only; surfaces stale/provenance caveat only when flagged), `@orchestrate` (routes continuity saves, passes caller identity — never asks source_kind), `@markdown` (spec-doc writes get provenance tagging).
- **Hooks (the automation core):** write-ingress guard (new pre-mutation phase), `mutation-hooks.ts` (post-write audit/cache/receipt-finalize), retention sweep, startup `session-prime.ts`, `/doctor`, pre-commit. Everything fires automatically off these.

---

## 5. UX DESIGN (operator priority #1)

**Principles:** infer don't ask · surface on exception not success · hot path stays one-step · diagnostics are pull-based (`/doctor`, dashboards, `includeTrace`) · advisory means advisory (never block/mutate canonical truth) · plain language ("retry recognized", "saved normally", "omitted stale candidates").

**Per-behavior defaults (all zero-friction):** `source_kind` inferred from caller (agent/system/import/feedback/human), hidden unless diagnostic · idempotency = server-derived receipt; identical retry replays the prior success with a quiet `replayed:true` · near-duplicate = one inline advisory hint, never a queue/judge · feedback = passive shadow capture, dashboard-only (no rating widgets) · audit = append silently, warn only on failure · delete = tombstones idempotently with same `confirm:true` contract (no "soft or hard?" prompt) · stale-exclusion = active results by default + omission note only on weak/empty results or diagnostics mode.

**Friction anti-patterns explicitly rejected:** asking the user to pick `source_kind`; user-supplied idempotency tokens; near-dup hard-rejects/review queues; "was this useful?" widgets; audit spam on every success; "soft or hard delete?" prompts; op-dispatch tool consolidation.

---

## 6. AUTOMATION DESIGN (operator priority #1)

**Principles:** invariants at the writer/dispatcher boundary (not operator instructions) · derive metadata over authoring it · read-only audits default-on/fail-open, mutating guards default-on/fail-closed-only-on-integrity-risk · append-only ledgers with deterministic event keys (no noisy repeats) · catch-up repair runs from existing loops (startup, index scan, retention sweep, `/doctor`, pre-commit) · 008 feedback stays shadow-first.

**Bindings:** `source_kind` → write ingress · idempotency → pre-mutation wrapper · near-dup → post-embedding enrichment + index-scan repair · feedback → already auto from `memory_search`/follow-on · audit → `mutation-hooks.ts` + `mutation_ledger` · tombstone → delete handlers + sweep · stale audit → startup health + `/doctor` · edge dedup → `causal-edges` guard · tool-ownership lint → pre-commit + `/doctor`.

---

## 7. CONVERGENCE & PROVENANCE

5/5 iterations insight; the work is well-bounded because it reads the live system and finds most substrate present. **Residual uncertainty:** exact transaction-boundary refactor for the pre-mutation guard phase needs a code-level design pass (out of scope for read-only research). Sources: `iterations/iteration-001..005.md`, grounded in `mcp_server/handlers/*`, `mcp_server/lib/{feedback,storage,search}/*`, `commands/{memory,speckit,doctor}/*`, `agents/*`, hooks. The actionable roadmap is in `integration-plan.md`.

<!-- /ANCHOR:deep-research-008-integration -->
