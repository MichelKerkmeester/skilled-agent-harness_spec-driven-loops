---
title: "Implementation Summary: sk-design style database"
description: "Built and fixture-verified the SQLite+FTS5+vector style database per the 001 design; adapter defaults to legacy pending the full-corpus activation gate."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/001-style-database"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "review-remediation"
    recent_action: "Built + independently fixture-verified the style database; full-corpus SLO remains deferred"
    next_safe_action: "Run the same-full-corpus persistent-enable go/no-go before changing the legacy default"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/"
      - ".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db-build-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Vectors: profile-addressed JSON arrays + deterministic cosine (no external SQLite vector extension, per no-new-deps)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: sk-design style database

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 3 of 4 (implementation) |
| **Status** | Implementation complete; persistent activation pending full-corpus go/no-go |
| **Executor** | GPT-5.6-SOL (high) via cli-opencode in isolated worktree `.worktrees/0078-sk-design-012-style-db-build` |
| **Verification** | Independent: 24/24 db tests, 20/20 legacy (no regression), RRF rank-fusion confirmed |
| **Completed** | 2026-07-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The published-SQLite-generation style database per 001, using Node `node:sqlite` (`DatabaseSync`) + FTS5, no new dependencies. Adapter defaults to `legacy`; the flat files stay authoritative.

### Files Created / Changed

| File Path | Change Type | Lines | Description |
|-----------|-------------|-------|-------------|
| `styles/_db/schema.mjs` | Create | 354 | Versioned schema: styles + normalized children, external-content FTS5 + triggers, vectors, relationships, `corpus_generations` + pointer, partial index |
| `styles/_db/indexer.mjs` | Create | 1181 | DISCOVER→VERIFY→PARSE_VALIDATE→COMMIT→VECTOR_DRAIN→PUBLISH; hash-authoritative freshness; durable atomic generation publish (fsync + immutable orphan files); tombstone/quarantine |
| `styles/_db/retrieval.mjs` | Create | 467 | Eligibility-first; structured/FTS5/vector lanes; weighted RRF over ranks + attribution; generation snapshot + keyset cursor; degradation ladder; fail-closed |
| `styles/_db/vectors.mjs` | Create | 346 | Non-blocking rebuildable queue keyed by identity+retrieval-hash+profile; content-addressed embedding cache |
| `styles/_db/README.md` | Create | — | Generation model, indexer lifecycle, adapter modes |
| `styles/_db/__tests__/*.mjs` | Create | — | schema/indexer/retrieval/adapter tests + fixtures (24 tests) |
| `styles/_engine/persistent-adapter.mjs` | Create | 358 | `legacy\|shadow\|persistent` switch (default legacy) + shadow parity compare |
| `styles/_engine/style-library.mjs` | Modify | — | Route through the adapter, preserving runQuery/runHydrate/CLI/cards/refusals |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched a GPT-5.6-SOL (high) implementer via `opencode run` in an isolated worktree off origin tip `4283b6a331`, with the 001 research + 003 spec as authoritative design. The agent ran its own review sub-loop, hardening the generation-publish path (fsync ordering, immutable generation orphans so a synced pointer can never dangle, post-pointer fault coverage) before reporting. Then verified independently by the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Vector lane: profile-addressed JSON arrays + deterministic cosine**, not an external SQLite vector extension (the no-new-dependencies constraint). Ranking stays deterministic; the queue/cache design is unchanged from 001.
- **Adapter defaults to `legacy`** (`SK_DESIGN_STYLE_DB_MODE ?? 'legacy'`); the persistent path activates only on explicit opt-in. No generation is published to readers without explicit cutover.
- **Durable atomic publish:** immutable generation files + synced atomic pointer + pinned-reader isolation + durable rollback (added during the agent's review loop).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Independent implementation re-run (orchestrator):** `node --test _db/__tests__/` → **24/24 pass**; legacy engine `node --test _engine/__tests__/` → **20/20 pass** (no correctness regression at delivery time).
- **RRF spot-check (finding = hypothesis):** `retrieval.mjs` fuses by `weight / (k + rank)` accumulated over channel ranks with per-channel attribution + deterministic tie-break — genuine weighted RRF over ranks, not raw score addition (REQ-003).
- **Adapter default confirmed `legacy`;** modules are substantial (2,706 lines total), not stubs.
- Tests bind to at most 20 styles. The relative timing assertion is a bounded-sample guard only and does not establish performance against the measured 1,290-style legacy baseline. The full-corpus comparison and a configured embedding provider are persistent-enable checks, not test-suite claims.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **SLO not yet measured at corpus scale** — tests prove correctness and relative timing only on a ≤20-style sample. The same-full-corpus persistent-vs-6,246.5 ms legacy comparison is deferred to the persistent-enable go/no-go and blocks changing the adapter default from `legacy`.
- **Embedding provider not wired** — the vector lane uses deterministic cosine over profile-addressed arrays; a real embedder is a production-config step.
- **Handoff to phase 004-interface-commands:** independent of this DB; proceeds with the operator-confirmed `/interface:*` names.
<!-- /ANCHOR:limitations -->
