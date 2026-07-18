---
title: "Feature Specification: styles-library retrieval substrate"
description: "Build the committed, resumable, generation-bound retrieval engine over the 1,290-bundle sk-design styles library that phase 001 Phase A recommended: a checked retrieval manifest, deterministic eligibility, a disposable FTS5/BM25 accelerator, compact candidate cards, generation-guarded hydration, and a CORPUS_USE_PROOF v1 gate. Foundation phase; everything else in packet 011 depends on it."
trigger_phrases:
  - "styles retrieval substrate"
  - "retrieval manifest generator"
  - "corpus use proof gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the retrieval-substrate L3 scaffold"
    next_safe_action: "Implement the retrieval-manifest generator and deterministic eligibility filters"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does repeated-query load justify shipping the FTS accelerator with Phase A or deferring it to Phase B?"
    answered_questions:
      - "Deterministic eligibility runs first; lexical scores only order the eligible set."
---
# Feature Specification: styles-library retrieval substrate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase builds the shared retrieval substrate for the 1,290-bundle styles library at `.opencode/skills/sk-design/styles/` — the foundation the completed research (`../001-research-utilization/research/lineages/sol/research.md`, §4, §5, §9, §15 Phase A) ranked first (leverage 5, cost 5-8 days, reversibility 5). It delivers a committed, checked retrieval manifest; deterministic eligibility applied before any ranking; a disposable, same-generation SQLite FTS5/BM25 projection; compact candidate cards; generation-guarded hydration; and a blocking `CORPUS_USE_PROOF v1` gate. Every downstream phase in packet 011 (md-generator schema contract, global-mode consumption, guardrails) consumes this substrate, so it is authored and built first.

**Key Decisions**: canonical committed manifest as the only retrieval artifact (ADR-001), deterministic eligibility decides / scores only explain ordering (ADR-002), disposable same-generation FTS accelerator (ADR-003), generation-guarded hydration with a live source-scan fallback (ADR-004), `CORPUS_USE_PROOF v1` as a blocking ready-gate (ADR-005).

**Critical Dependencies**: none — this is the foundation phase. It reads the extracted corpus (packet `010-sk-design-styles-from-refero`) read-only.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned — scaffold; implementation not started |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Estimated LOC** | ~600-900 (new engine modules + fixtures) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../003-global-modes-utilization/` |
| **Successor** | `../005-md-generator-schema-contract/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `010-sk-design-styles-from-refero` extracted 1,290 real design-system bundles into `.opencode/skills/sk-design/styles/` (1,291 child directories, one of which is `_harness` infrastructure). Nothing in the `sk-design` runtime consumes that corpus: there is no committed index, no eligibility discipline, no ranking, and no proof gate. Ad-hoc grep over 20.38 MB of `DESIGN.md` is unjoinable and unstable, loading the whole corpus is ~85 MB of context and a copy-exposure hazard, and a hand-maintained index drifts (the corpus moved from 974 to 1,290 bundles during research while `styles/README.md` stayed at 50). Without a generation-bound substrate, every downstream utilization phase would reinvent retrieval and risk stale, un-provenanced, or averaged output.

### Purpose
Build the Phase A retrieval substrate the research specified: a deterministic, resumable, generation-bound engine that (1) generates and checks a committed retrieval manifest, (2) filters by deterministic eligibility before ranking, (3) ranks eligible candidates with a disposable same-generation lexical projection, (4) returns compact candidate cards for mode-owned selection, (5) hydrates only the chosen style's permitted artifacts under a generation guard, and (6) blocks any corpus-influenced ready claim behind `CORPUS_USE_PROOF v1`. This is the foundation every other phase in packet 011 builds on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A retrieval-manifest generator: per-style key facts (colors, fonts, spacing, capabilities, token axes and counts, section pointers, byte estimates), a per-style content hash, and a corpus generation hash; atomic `--write` and byte-comparing `--check`.
- Deterministic eligibility applied FIRST: required-facet filters, exclusion filters, and provenance/rights gates — before any scoring.
- A disposable, same-generation SQLite FTS5/BM25 ranking projection built on demand and discarded (accelerator, never source of truth).
- Compact candidate cards (≤5 returned) → mode-owned selection → generation-guarded hydration of only permitted artifacts/slices of the chosen style.
- A `CORPUS_USE_PROOF v1` gate required before any corpus-influenced ready claim.
- A bounded live source-scan fallback when the lexical projection is missing/stale; hydration refuses on generation mismatch.
- CI change/invalidation tests. No watcher/daemon — corpus rebuild is sub-second.

### Out of Scope
- The extraction itself (owned by packet 010) and any change to corpus contents.
- Mode taste policy and per-mode consumption contracts beyond generic request/hydration adapters (owned by `../005-md-generator-schema-contract/` and later global-mode phases).
- Any semantic/vector reranker (Phase C; deferred until a measured lift over the lexical baseline exists).
- A frozen human-labeled relevance benchmark beyond smoke fixtures (Phase B planning work).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_engine/style-library.mjs` | Create (NEW/proposed) | CLI entrypoint: `build --write`, `build --check`, `query`, `hydrate` |
| `.opencode/skills/sk-design/styles/_engine/manifest.mjs` | Create (NEW/proposed) | Manifest schema, refresh algorithm, content/generation hashing |
| `.opencode/skills/sk-design/styles/_engine/eligibility.mjs` | Create (NEW/proposed) | Required-facet, exclusion, and provenance/rights gates (pre-ranking) |
| `.opencode/skills/sk-design/styles/_engine/rank-fts.mjs` | Create (NEW/proposed) | Disposable same-generation SQLite FTS5/BM25 projection + source-scan fallback |
| `.opencode/skills/sk-design/styles/_engine/cards.mjs` | Create (NEW/proposed) | Compact candidate-card assembly and byte-capping |
| `.opencode/skills/sk-design/styles/_engine/hydrate.mjs` | Create (NEW/proposed) | Generation-guarded hydration of permitted artifacts/slices |
| `.opencode/skills/sk-design/styles/_engine/corpus-use-proof.mjs` | Create (NEW/proposed) | `CORPUS_USE_PROOF v1` schema + validator |
| `.opencode/skills/sk-design/styles/_retrieval-manifest.json` | Create (NEW/proposed) | The only committed retrieval artifact (byte-stable generated output) |
| `.opencode/skills/sk-design/styles/_engine/__tests__/**` | Create (NEW/proposed) | Change/invalidation, fallback, generation-mismatch, and proof-card fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Committed checked manifest | `build --write` produces byte-stable `styles/_retrieval-manifest.json` with `schemaVersion`, `generationHash`, `crawlManifestHash`, `recordCount`, and sorted `styles[]`; `build --check` regenerates in memory, byte-compares, reports added/changed/removed ids, and never writes. |
| REQ-002 | Deterministic eligibility first | Required-facet filters, exclusion filters, and provenance/rights gates are applied BEFORE any ranking; an ineligible style can never appear in candidate cards regardless of lexical score. |
| REQ-003 | Generation-guarded hydration | Hydration requires the card's generation hash, re-hashes selected artifacts, applies mode includes + byte caps, and refuses a mismatch with `generation-mismatch`. |
| REQ-004 | CORPUS_USE_PROOF v1 gate | No corpus-influenced ready claim is emitted without a valid `CORPUS_USE_PROOF v1` card (authority, selection rationale, coherent fingerprint, transformation delta, provenance/anti-copy, application proof). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Disposable lexical accelerator | The SQLite FTS5/BM25 projection is built on demand from the current generation and discarded; it is never committed and never authoritative. |
| REQ-006 | Bounded source-scan fallback | When the lexical cache is stale/absent, retrieval degrades to deterministic filters + a bounded `DESIGN.md` scan and returns `degraded:true`. |
| REQ-007 | Compact candidate cards | Each `query` returns ≤5 cards carrying id/title/thesis, generation+content hashes, generic capabilities, token axes, provenance/rights, score breakdown, and estimated hydration bytes. |
| REQ-008 | Change/invalidation CI tests | Fixtures cover byte-stable `--check`, add/change/delete invalidation, pre/post mutation abort, stale/absent FTS fallback, generation-mismatch refusal, deterministic card ordering, and valid/invalid proof cards. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `style-library.mjs build --check` is byte-stable on an unchanged corpus and flags exactly the mutated ids after an add/change/delete.
- **SC-002**: A `query` over the 1,290-bundle generation returns ≤5 eligible cards under ~2 KB each, with deterministic eligibility demonstrably applied before ranking.
- **SC-003**: `hydrate` refuses a stale card with `generation-mismatch`; the source-scan fallback returns `degraded:true` when the FTS projection is absent.
- **SC-004**: A corpus-influenced ready claim is blocked unless a valid `CORPUS_USE_PROOF v1` card is present.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Manifest drifts from corpus | High | Generation hash over schema + crawl-manifest hash + sorted content hashes; `--check` in CI on any `styles/**` change |
| Risk | Lexical score becomes authoritative | High | Eligibility gates run first; scores only order the eligible set; FTS projection is disposable, never committed |
| Risk | Stale hydration leaks old-generation values | Med | Generation-guarded hydration re-hashes and refuses mismatch |
| Risk | Averaged / slop output | Med | `CORPUS_USE_PROOF v1` blocks; never average token values; one coherent anchor by default |
| Dependency | Extracted styles corpus (packet 010) | Low | Consumed read-only as the subject; no corpus changes in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full corpus generation load + hash completes sub-second (research prototype: 145.83 ms load/hash; 739.36 ms parse/tokenize for 1,290 bundles).
- **NFR-P02**: A deterministic metadata query stays ~1 ms/query over the compact manifest.
- **NFR-P03**: Candidate-card payloads for a top-five result stay under ~2 KB (prototype: 967-1,582 bytes); median selected hydration ~4.8 KB.

### Reliability
- **NFR-R01**: `build --write` aborts with `corpus-changing` if the pre/post input fingerprints differ, then publishes via adjacent temp file + atomic rename.
- **NFR-R02**: Retrieval degrades to deterministic filters + bounded source scan (`degraded:true`) when the lexical cache is missing/stale; it never fails hard on a missing accelerator.

### Security / Provenance
- **NFR-S01**: Hydration never returns artifacts of an unknown-rights style for exact reuse; `licenseStatus` and evidence scope travel on every card.
- **NFR-S02**: Volatile timestamps stay out of byte-stable generated content.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Corpus Boundaries
- **Infrastructure dirs**: `_harness` and `_engine` are excluded from `styles[]` (infrastructure, not bundles); `recordCount` counts real bundles only.
- **Added/changed/deleted styles**: refresh reparses only changed records, reuses unchanged derived fields, removes deleted ids.
- **Missing artifacts**: a bundle lacking a required section is scored on available capabilities; the card lists `availableSections` honestly rather than inventing them.

### Failure Scenarios
- **Stale FTS cache**: degrade to source scan, return `degraded:true`, never serve stale-generation ranking as authoritative.
- **Generation mismatch on hydrate**: return `generation-mismatch`; caller must re-query the current generation.
- **Unknown rights**: exclude from exact-reuse hydration; still eligible as a relationship/rationale reference under the proof gate.

### Provenance
- **Missing provenance**: excluded by the provenance gate at eligibility, before ranking.
- **Corpus mutating mid-build**: `corpus-changing` abort prevents publishing a torn generation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~8 new engine modules + manifest + fixtures; LOC: ~600-900; Systems: styles corpus + retrieval + CI |
| Risk | 18/25 | Auth: N; API: N (local CLI); Breaking: N (no runtime consumer until 005); provenance/rights handling: Y |
| Research | 12/20 | Fully specified by 001 research §4/§5/§9/§15; remaining unknowns are facet vocabulary + FTS timing |
| Multi-Agent | 6/15 | Single implementer; 5 sequential phases |
| Coordination | 8/15 | Foundation for all later packet-011 phases; no upstream dependency |
| **Total** | **64/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Manifest and corpus diverge silently | H | M | Generation-hash `--check` in CI on every `styles/**` change |
| R-002 | Lexical ranker treated as truth | H | M | Eligibility-first ordering; disposable, uncommitted FTS |
| R-003 | Stale-generation values leak into output | H | L | Generation-guarded hydration + refusal |
| R-004 | Averaged / incoherent slop output | M | M | `CORPUS_USE_PROOF v1` blocking gate; one-anchor default |
| R-005 | Rights-unknown asset reused verbatim | H | L | Provenance/rights gate at eligibility; anti-copy proof |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Mode requests candidates (Priority: P0)

**As a** sk-design mode (interface/foundations/motion/audit/md-generator), **I want** to submit a generic retrieval need and receive ≤5 eligible candidate cards, **so that** I own selection while the engine owns retrieval.

**Acceptance Criteria**:
1. Given a request with `requiredFacets` and `exclusions`, When I `query`, Then only styles passing deterministic eligibility appear, ordered by the lexical score.
2. Given the FTS projection is absent, When I `query`, Then I still receive deterministically filtered cards with `degraded:true`.

### US-002: Generation-guarded hydration (Priority: P0)

**As a** mode that selected a candidate, **I want** hydration to load only that style's permitted artifacts under a generation guard, **so that** I never receive stale or over-broad content.

**Acceptance Criteria**:
1. Given a card whose generation hash matches the current manifest, When I `hydrate`, Then I receive the permitted artifacts/slices within the byte cap.
2. Given a stale card, When I `hydrate`, Then I receive `generation-mismatch` and no content.

### US-003: Proof-gated ready claim (Priority: P1)

**As a** maintainer, **I want** any corpus-influenced ready claim blocked without a valid `CORPUS_USE_PROOF v1` card, **so that** un-provenanced or averaged output cannot ship.

**Acceptance Criteria**:
1. Given corpus material influenced a decision, When a ready claim is made without a valid proof card, Then the gate blocks it.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the FTS accelerator ship with Phase A or wait for measured repeated-query load in Phase B? **Leaning: build the interface in Phase A, enable only when operational measurements justify it.**
- Where should `_retrieval-manifest.json` live relative to `_engine/` for cleanest `styles/**` CI globbing? **RESOLVED: manifest at `styles/_retrieval-manifest.json`, code under `styles/_engine/`.**
- What is the exact facet vocabulary for `requiredFacets`/`exclusions`? **Deferred to implementation; seeded from research §5 examples (`serif-role`, `warm-surface`, `license-restricted`, `generation-mismatch`).**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../003-global-modes-utilization/`
- **Successor**: `../005-md-generator-schema-contract/`
- **Research basis**: `../001-research-utilization/research/lineages/sol/research.md` (§4 substrate, §5 pipeline, §9 tooling, §15 Phase A)
- **Source corpus**: `.opencode/skills/sk-design/styles/`
- **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Decisions**: `decision-record.md`
<!-- /ANCHOR:related-docs -->
</content>
</invoke>
