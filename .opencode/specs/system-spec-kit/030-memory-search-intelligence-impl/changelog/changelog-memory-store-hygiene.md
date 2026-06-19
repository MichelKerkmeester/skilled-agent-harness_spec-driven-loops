---
title: "Memory Store and Hygiene: Content-Id Module, Enrichment Gauges, Constitutional CAS Guard, Closed-Edge Skip"
description: "Four shipped Wave-0 candidates hardened the Memory MCP store and hygiene paths with a centralized content-id module, pending/failed enrichment gauges, a constitutional self-edit and compare-and-swap guard and a closed-edge skip in promoter cleanup. Two candidates were deferred to Wave-1 with evidence."
trigger_phrases:
  - "030 memory store hygiene changelog"
  - "content-id module byte identical"
  - "constitutional CAS guard self-edit"
  - "enrichment gauges pending failed"
  - "candidate 6 candidate 11 deferred"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/system-spec-kit/030-memory-search-intelligence-impl` (Level 3)
> Subsystem: Memory MCP store and hygiene
> Source: `spec.md` section 14 candidates 7, 8, 9, 10 (shipped), 6 and 11 (deferred)

### Summary

Four Wave-0 candidates landed on the Memory MCP store and hygiene paths, each at its named seam with focus tests and a scoped commit. Candidate 7 centralizes two duplicated SHA-256 hashes into one module while keeping both identities distinct and the emitted hash values byte-identical, so existing rows and receipts stay valid. Candidate 8 exposes pending and failed background-enrichment gauges off the existing status aggregation with no new state. Candidate 9 adds a defensive closed-edge skip to the frontmatter promoter cleanup. Candidate 10 adds a constitutional self-edit block and an optional compare-and-swap precondition to the constitutional update path while leaving the normal update path byte-identical. Candidate 10 carried an independent opus review with a SHIP verdict on the security-critical self-edit block. Two further candidates from this subsystem were deferred to Wave-1 with concrete evidence.

### Added

- `lib/content-id.ts` with `hashContentBody` for the content-body hash and `hashCanonicalJson` for the canonical-field hash, preserving the receipt-specific `normalizeForHash` token normalization (Candidate 7).
- Pending and failed counts on `getBackgroundEnrichmentStats`, read off the existing `post_insert_enrichment_status` aggregation with no new background state (Candidate 8).
- A constitutional self-edit assertion (`E_CONSTITUTIONAL_SELF_EDIT`) that rejects an edit which removes a constitutional row's own protection (Candidate 10).
- An optional `expectedHash` compare-and-swap precondition (`E_STALE_CONSTITUTIONAL_UPDATE`) on the constitutional update path, exposed as an additive optional tool param (Candidate 10).
- Byte-identical parity, gauge, promoter and constitutional-guard tests across the store and hygiene suites.

### Changed

- `memory-parser` and `idempotency-receipts` now call the shared content-id module instead of duplicated inline SHA-256 code, with the two identities kept distinct (Candidate 7).
- The frontmatter promoter cleanup query adds `AND invalid_at IS NULL` so it skips already temporally-closed generated causal edges (Candidate 9).

### Fixed

- A constitutional row could previously be edited to remove its own protection, or be overwritten on a stale read. The update path now fails closed on a protection-removing edit and, when `expectedHash` is supplied, rejects a stale-read overwrite.
- Promoter cleanup could touch generated causal edges that were already temporally closed. The closed-edge skip leaves them intact.

### Verification

| Check | Result |
|-------|--------|
| Typecheck and build (Memory MCP) | PASS, exit 0 |
| Candidate 7 content-id suite | PASS: 77 memory-crud and idempotency tests, including the byte-identical parity test |
| Candidates 8, 9, 10 suite | PASS: 114 search/crud/schema/health/promoter tests |
| Candidate 10 adversarial review | SHIP: unconditional self-edit block correct, CAS opt-in and a now-dead downgrade-audit branch flagged P2 polish |
| Default-path parity | PASS: non-constitutional update path byte-identical, no emitted content-id hash value changes |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/frontmatter-promoter.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/feedback-safety-posture.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/frontmatter-promoter.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` | Modified |

### Commits

| Commit | Candidates |
|--------|-----------|
| `e1c6a3c793` | 8 (enrichment gauges), 9 (skip-closed sweep hygiene), 10 (constitutional CAS guard) |
| `18c8582e33` | 7 (centralized content-id module) |

### Deferred to Wave-1

These two candidates belong to this subsystem and were deliberately dropped from Wave-0 with evidence, not left as partial work.

- **Candidate 6, C4-A idempotency-receipts default-on.** Flipping `SPECKIT_MEMORY_IDEMPOTENCY` on activates the idempotency and near-dup path on `memory_update` and breaks 11 `handleMemoryUpdate` tests that pass with it off. The roadmap flagged this as needing deferred-wiring care, not a clean flip, and the replay leg was already refuted. Wave-1 must scope the save path apart from update-path semantics before any default flip. The shipped content-id primitive (Candidate 7) is the infrastructure this future work builds on.
- **Candidate 11, M-system-kind-exclusion.** An opus review against the live 734 MB database proved `source_kind='system'` is 9,592 canonical spec-docs including 29 constitutional rules, not substrate noise. The cheap predicate would hide roughly half of useful recall, and an admin opt-in does not rescue a default that hides load-bearing memories. Wave-1 needs a real substrate signal plus a constitutional and spec-doc short-circuit plus live-DB validation before changing default recall.

### Follow-Ups

- Create Wave-1 work for Candidate 6 with save and update-path idempotency scoping and `handleMemoryUpdate` regression gates.
- Create Wave-1 work for Candidate 11 with a true substrate signal, a constitutional and spec-doc short-circuit and live-DB validation.
