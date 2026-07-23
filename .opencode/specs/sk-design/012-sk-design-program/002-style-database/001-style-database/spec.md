---
title: "Feature Specification: sk-design style database implementation"
description: "Implement the published-SQLite-generation style database (schema + incremental indexer + eligibility-first RRF retrieval + migration adapter) per the 001 research recommendation, wired into styles/_engine."
trigger_phrases:
  - "style database implementation"
  - "styles sqlite fts vector"
  - "styles _engine database backend"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/001-style-database"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author phase-003 build spec from 001 research recommendation"
    next_safe_action: "Plan then dispatch SOL implementer for the style database"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/"
      - ".opencode/specs/sk-design/012-sk-design-program/001-research/001-research-style-database/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-design style database implementation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implementation complete; persistent activation pending full-corpus go/no-go |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | `002-research-design-commands` |
| **Successor** | `004-interface-commands` |
| **Phase** | 3 of 4 |
| **Implements** | `../001-research-style-database/research/research.md` (authoritative design) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 1,290-style library (`.opencode/skills/sk-design/styles/`) is served by a file-walking retrieval engine (`styles/_engine`) whose read path rebuilds a 5.89 MB denormalized manifest and a disposable in-memory FTS index on every query — a full-corpus query measured at 6,246.5 ms. There is no persistent index, no semantic retrieval, and no incremental sync. Phase 001 converged on a concrete architecture; it now needs building.

### Purpose

Implement the phase-001 design: **one published SQLite generation** holding normalized style state + trigger-synchronized FTS5 + indexed relationship edges, with **profile-addressed vectors as a rebuildable projection**, fed by a **crash-safe incremental indexer** and queried by an **eligibility-first weighted-RRF retrieval API** — wired into `styles/_engine` behind a `legacy|shadow|persistent` adapter that keeps the flat files authoritative.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Schema:** UUID-first `styles` identity + surrogate integer rowid; normalized `style_artifacts`, terms, token-axes, sections; `retrieval_documents`; trigger-maintained external-content FTS5; profile-addressed vector + content-addressed embedding cache; normalized `style_relationships`; immutable `corpus_generations` + current pointer. Derived fields (available sections, hydration estimates, active count, generation hash) are computed, not independently authoritative.
- **Indexer:** `DISCOVER → VERIFY → PARSE_VALIDATE → COMMIT → VECTOR_DRAIN → PUBLISH` lifecycle; mtime/size/ctime as hints, canonical all-artifact hash as freshness authority; `BEGIN IMMEDIATE` transactional child-row replacement; success markers advance only after commit; tombstone/quarantine lifecycle for disappeared styles.
- **Retrieval:** hard eligibility filters (facets, exclusions, provenance, exact-reuse rights) joined before ranking; structured + persistent FTS5 + vector top-k lanes; versioned weighted **RRF over ranks** (not raw score addition) with per-channel attribution; generation-bound snapshot + keyset cursor; channel-local degradation ladder (hybrid → structured+FTS → structured+vector → structured-only); fail-closed on missing/invalid generation.
- **Migration adapter:** existing `runQuery`/`runHydrate`/CLI/card fields/refusal codes preserved behind a `legacy|shadow|persistent` switch; corpus walking legal only in explicit migration/rollback mode.
- **Tests:** schema pressure (duplicate-slug, tombstone, cascades, FTS triggers, partial index), indexer crash-safety, RRF/cursor determinism, degradation fallback, shadow-vs-legacy parity.

### Out of Scope

- A dedicated graph engine (001 ruled it out; relationships are a normalized table).
- Re-extracting styles (packet 010 owns extraction).
- Changing `sk-design` design judgment, or the phase-004 command surface.
- New embedding-provider infrastructure beyond reusing the system-speckit embedding pattern.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_db/schema.mjs` | Create | Versioned schema module (tables, FTS5, triggers, indexes, generations) |
| `.opencode/skills/sk-design/styles/_db/indexer.mjs` | Create | DISCOVER→…→PUBLISH incremental indexer + tombstone lifecycle |
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Create | Eligibility-first FTS5+vector RRF retrieval over a published generation |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Create | Rebuildable vector queue + content-addressed embedding cache |
| `.opencode/skills/sk-design/styles/_db/README.md` | Create | DB architecture, generation model, adapter modes |
| `.opencode/skills/sk-design/styles/_engine/*.mjs` | Modify | `legacy\|shadow\|persistent` adapter over runQuery/runHydrate |
| `.opencode/skills/sk-design/styles/_db/__tests__/**` | Create | Schema/indexer/retrieval/parity tests (node --test) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Published-generation schema | SQLite schema per 001 exists with FTS5 triggers + generation pointer; a query binds one generation snapshot. |
| REQ-002 | Crash-safe incremental indexer | Re-index after a simulated mid-commit crash leaves no partial generation; success markers advance only post-commit; unchanged styles are skipped by hash. |
| REQ-003 | Eligibility-first RRF retrieval | Hard filters join before ranking; fusion is weighted RRF over ranks with per-channel attribution; missing/invalid generation fails closed. |
| REQ-004 | Adapter keeps flat files authoritative | `_engine` runs `legacy\|shadow\|persistent`; shadow mode matches legacy results within tolerance; the DB never becomes the source of truth. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Vectors non-blocking + rebuildable | Pending/failed vectors never block lexical retrieval; the vector queue is keyed by identity+retrieval-hash+profile and supersedes stale jobs. |
| REQ-006 | Relationship table | `designSystem.similar` targets are normalized (raw label, resolution state, confidence, nullable canonical target) — no traversal service. |
| REQ-007 | Retrieval SLO | A bounded 20-style comparison guards against obvious regression. A same-full-corpus persistent-vs-legacy measurement is required at the persistent-enable go/no-go; the bounded sample does not prove performance against the 1,290-style baseline. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All P0 requirements met; the persistent path returns generation-consistent, eligibility-correct results and passes the bounded-sample timing guard. Full-corpus performance remains an activation gate.
- Shadow mode parity holds against the legacy engine; flat files remain authoritative.
- `node --test` suite green; `validate.sh` for this phase `--strict` = 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** the flat style library + `styles/_engine` (packet 011) + 001's research design + system-speckit's sqlite/FTS/vector patterns (`mcp-server/lib/search`, `lib/storage`, `lib/embedders`) as reference.
- **Risk:** generation-switch races or partial rebuilds — mitigated by atomic pointer switch + staging + old-generation readers finishing. **Risk:** embedding-provider outage — mitigated by non-blocking vector queue + lexical fallback.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- The bounded 20-style check must show no obvious persistent-path regression. Before activation, a same-full-corpus persistent-vs-legacy run must measure the 1,290-style result against the 6,246.5 ms legacy baseline; incremental re-index touches only changed styles.

### Security

- Local SQLite only; no new network surface beyond the reused embedding pattern; hydration still validates rights, containment, artifact hashes, byte caps.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Embedding provider/model for the vector lane: reuse system-speckit's configured embedder, or a style-specific profile? (Resolve at plan time.)
- Cutover trigger: manual maintenance command vs automatic on first persistent query. (Resolve at plan time.)
<!-- /ANCHOR:questions -->
