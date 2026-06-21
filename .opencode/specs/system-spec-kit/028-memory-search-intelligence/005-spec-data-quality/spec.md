---
title: "Feature Specification: Spec-Kit Data Quality by Default [template:level_3/spec.md]"
description: "Spec-kit docs and the two metadata JSONs are not optimized for retrieval, AI adherence or logic reading. This packet researches how to raise that data quality by default across the whole spec corpus."
trigger_phrases:
  - "spec data quality"
  - "retrieval adherence logic"
  - "metadata fusion"
  - "embedding context"
  - "spec corpus quality"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded the 28-phase implementation children and added the parent phase-documentation map"
    next_safe_action: "Build 026 the shared safe-fix engine first, then 004 the measured GO schema gate"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/stage-0-external-findings.md"
    session_dedup:
      fingerprint: "sha256:b41f6e5c0a92d7184c3f0b58a6e7d2934f1a8c06b9e3d5742a0f9c81e6d34b27"
      session_id: "multi-lineage-research-synthesis"
      parent_session_id: "multi-lineage-research-synthesis"
    completion_pct: 100
    open_questions:
      - "Whether the prod-mode completeRecall@3 read promotes any retrieval candidate once a build runs"
    answered_questions:
      - "Which ranked candidates survive corpus-specific verification"
---
# Feature Specification: Spec-Kit Data Quality by Default

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Spec-kit already stores rich docs and two metadata JSONs per packet, but that data is not tuned for the three jobs it has to do: feed retrieval, steer AI adherence and stay readable as logic. This packet ran the research that decides which of those quality levers are worth building by default. Stage 0 captured a fresh-Opus online sweep of about thirty cited sources across seven angles. The official multi-lineage loop then ran five distinct deep-research lineages across thirty-seven substantive iterations, executed as parallel opus-via-claude2 read-only seats, each verifying its ranked candidates against the live retrieval and validation code. All five lineages converged.

The research converged on the truncation law. The prod retrieval path truncates to a 3-result floor, so it taxes retrieval candidates only while adherence and logic and write-time candidates bypass the floor. The decisive consequence is that the external brief's recall@K numbers are mechanically hidden by the K=3 prod floor, so external validation alone cannot promote a retrieval candidate, only a prod-mode eval-v2 dual-mode measurement can. The five lineages also surfaced the live default-ON quality-loop keystone, four novel floor-bypassing capabilities and a build-ready engine plus governance rollout. The full tiering and the staged rollout live in `research/research.md`.

**Key Decisions**: research-first before any build, rank candidates by external evidence strength, gate every retrieval candidate on a prod-mode completeRecall@3 read

**Critical Dependencies**: the existing spec-memory index, the two metadata JSON schemas, the validate.sh strict contract

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Research Complete |
| **Created** | 2026-06-21 |
| **Branch** | `005-spec-data-quality` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-kit writes plain markdown chunks and two metadata JSONs per packet, but none of that is shaped for retrieval recall, for AI instruction adherence or for machine logic reading. Embedded chunks lose their header path and global identity, the metadata sits beside the text instead of inside the embedding and the JSONs carry no quality or freshness signal. The result is weaker recall and weaker downstream adherence than the stored data could support.

### Purpose
Decide, from external evidence, which data-quality techniques spec-kit should adopt by default so every packet retrieves better, steers AI better and reads as logic better.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research how to improve spec-kit data quality by default for retrieval, AI adherence and logic reading
- Record the Stage 0 external-findings brief as the loop seed
- Rank candidate techniques by external evidence strength
- Scaffold the converged recommendations into 28 implementation child phases under this parent

### Out of Scope
- Building or shipping any candidate. This packet delivers the research and the child scaffolds, not a build
- Touching packet 028, packet 030 or any concurrent-session file. They stay frozen
- Changing the live metadata JSON schemas. Schema work follows the per-phase build

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | The canonical research synthesis for this packet |
| `research/stage-0-external-findings.md` | Create | The Stage 0 external sweep brief |
| `[NNN-slug]/` (28 child phase folders) | Create | One Level-2 doc set per converged recommendation, inventoried in the PHASE DOCUMENTATION MAP |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Capture the Stage 0 external-findings brief verbatim in substance | `research/stage-0-external-findings.md` holds all seven angles and the ranked candidates with every cited URL preserved |
| REQ-002 | Provide a research index that points to the Stage 0 brief | `research/research.md` lists the brief and the seven angles as the loop entry point |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Keep the packet HVR clean | No em-dashes, no prose semicolons, no Oxford commas across the authored docs |
| REQ-004 | Pass strict validation | `validate.sh --strict` returns exit 0 on the packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Stage 0 brief preserves every cited source and every ranked candidate
- **SC-002**: Strict validation returns exit 0 and the docs read HVR clean
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec-memory index and metadata JSON schemas | Candidates that touch them need schema work later | Keep this packet research only and defer schema changes to the loop verdict |
| Risk | Vendor-only claims treated as benchmarked fact | Med | Flag every vendor-only claim in the brief and downgrade it during the loop |
| Risk | Chunking choice presented as universal | Med | Carry metadata fusion as the robust signal rather than a specific chunker |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

This packet is now a phase parent. The research lives at the root and the implementation lives in the 28 child phases below, one child per converged recommendation. Each child carries its own full Level-2 doc set, spec.md plus plan.md plus tasks.md plus checklist.md plus implementation-summary.md, alongside the two metadata JSONs. The verdict tier comes straight from the canonical synthesis in `research/research.md`.

### Tier A on-write reuse-first

| Phase | Folder | Scope | Verdict tier |
|-------|--------|-------|--------------|
| 001 | `001-a1-extend-quality-loop-authored/` | Extend the live default-ON quality loop to score authored spec docs, the keystone on-write reuse seam | GO-on-cost |
| 002 | `002-a2-trigger-propagation-description/` | Propagate trigger phrases into description.json so retrieval and adherence read the same signal | GO-on-cost |
| 003 | `003-a3-enum-constrain-schemas/` | Enum-constrain the two metadata JSON schemas so invalid field values fail fast | GO-on-cost |
| 004 | `004-a4-schema-warn-to-error/` | Promote the JSON-schema validation gate from warn to error, the one measured unconditional GO | GO |
| 005 | `005-a5-trigger-coherence-assertion/` | Assert trigger coherence between spec.md and description.json so they cannot drift | GO-on-cost |
| 006 | `006-a6-hvr-style-autofix/` | Autofix HVR style violations at write time so the voice rules hold without manual passes | GO-on-cost |
| 007 | `007-a7-ears-constraints-req-coverage/` | Add EARS constraints and requirement-coverage checks to raise adherence on authored docs | GO-on-cost |
| 008 | `008-a8-surface-provenance-fields/` | Surface provenance fields on each doc so a reader can trace where a claim came from | GO-on-cost |
| 009 | `009-a9-content-hash-integrity/` | Add a content-hash integrity field so a stale or tampered doc surfaces as an error | GO-on-cost |
| 010 | `010-a10-per-surface-gates/` | Add per-surface gates so each doc family enforces only the checks that fit it | GO-on-cost |

### Tier B retroactive automation

| Phase | Folder | Scope | Verdict tier |
|-------|--------|-------|--------------|
| 011 | `011-b1-scheduled-dq-sweep/` | Run a scheduled data-quality sweep across the corpus, the keystone retroactive automation | GO-on-cost |
| 012 | `012-b2-doctor-dq-route/` | Add a doctor data-quality route so an operator can run the sweep on demand | GO-on-cost |
| 013 | `013-b3-retrieval-feedback-edge/` | Write a retrieval-feedback edge so observed recall flows back into the quality signal | GO-on-cost |

### Tier C retrieval, C2-gated

| Phase | Folder | Scope | Verdict tier |
|-------|--------|-------|--------------|
| 014 | `014-c1-chunk-prefix/` | Prefix each embedded chunk with its header path and global identity to lift recall | CONDITIONAL |
| 015 | `015-c2-prodmode-recall-gate/` | Stand up the prod-mode completeRecall@3 benchmark gate, the unblocker for every Tier-C item | CONDITIONAL |
| 016 | `016-c3-answerable-questions-tags/` | Tag each doc with the questions it can answer so retrieval matches intent | CONDITIONAL |
| 017 | `017-c4-metadata-fusion/` | Fuse metadata into the embedding so the signal travels inside the vector not beside it | CONDITIONAL |
| 018 | `018-c5-llm-judge-scorer/` | Add an LLM-judge scorer to grade retrieval candidates the floor would otherwise hide | CONDITIONAL |

### Novel out-of-the-box GO

| Phase | Folder | Scope | Verdict tier |
|-------|--------|-------|--------------|
| 019 | `019-novel-contradiction-detection/` | Detect contradictions across docs so conflicting claims surface before a reader trusts one | GO |
| 020 | `020-novel-embedding-drift-monitor/` | Monitor embedding drift so a re-index need surfaces as a signal not a guess | GO |
| 021 | `021-novel-example-test-generation/` | Generate example tests from a doc so its claims carry executable evidence | GO |
| 022 | `022-novel-context-budget-assembler/` | Assemble a context budget so the most relevant docs fit the window without truncation loss | GO |
| 023 | `023-novel-typed-relation-kg/` | Build a typed-relation knowledge graph so edges carry meaning not just adjacency | GO |
| 024 | `024-novel-freshness-decay-queue/` | Queue docs by freshness decay so stale records get re-checked first | GO |
| 025 | `025-novel-per-doc-quality-slas/` | Set per-doc quality SLAs so each doc family carries its own measurable floor | GO |

### Infra

| Phase | Folder | Scope | Verdict tier |
|-------|--------|-------|--------------|
| 026 | `026-shared-safe-fix-engine/` | Build the shared safe-fix engine that A1, B1 and B2 all reuse, the foundation seam | Infra |
| 027 | `027-retrieval-floor-experiment/` | Raise the result budget and measure whether results 4 through 10 carry signal | Infra |
| 028 | `028-governance-rollout/` | Define the 17-stage rollout plus migration plus safety model plus the consolidated NO-GO list | Infra |

### Build-Order Dependencies

- The 026 shared safe-fix engine ships before 001 A1 and 011 B1 and 012 B2, because those three reuse it as their fix path.
- The 015 C2 prod-mode benchmark gate ships before every Tier-C item and before the 027 floor experiment, because no retrieval candidate can promote without a prod-mode completeRecall@3 read.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Any adopted embedding-side change must run once per field with no full re-embed when a fused-metadata path is chosen

### Security
- **NFR-S01**: Research artifacts stay local until the orchestrator commits, with no external write

### Reliability
- **NFR-R01**: The brief stays reproducible because every claim carries a cited source

---

## 8. EDGE CASES

### Data Boundaries
- Empty packet: a packet with only a spec and the two JSONs still needs a quality and freshness signal
- Maximum length: very large docs must keep header-path identity on every embedded chunk

### Error Scenarios
- Stale embedding: a drifted embedding must surface as an error rather than silent stale recall
- Missing metadata JSON: a packet without `description.json` or `graph-metadata.json` stays invisible to retrieval and must be flagged

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 2 authored research docs, Systems: retrieval, adherence, logic |
| Risk | 12/25 | Auth: N, API: N, Breaking: N |
| Research | 18/20 | Seven angles, about thirty cited sources, ten ranked candidates |
| Multi-Agent | 8/15 | Workstreams: a by-angle research loop |
| Coordination | 8/15 | Dependencies: index and schema follow-on |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Vendor-only claims drive a default change | H | M | Mark vendor-only claims and require independent verification in the loop |
| R-002 | A corpus-specific chunker is adopted as universal | M | M | Carry metadata fusion as the robust signal |
| R-003 | Adherence techniques over-promise on guarantees | M | H | Record the honest adherence ceiling and pair structure with self-verification gates |

---

## 11. USER STORIES

### US-001: Retrieval engineer (Priority: P0)

**As a** retrieval engineer, **I want** the Stage 0 brief to name evidence-backed retrieval wins, **so that** I can pick the highest-ROI embedding change first.

**Acceptance Criteria**:
1. Given the brief, When I read Angle 1, Then I see header-path and global-identifier prefixing backed by three external validations

### US-002: Spec author (Priority: P1)

**As a** spec author, **I want** the adherence angle to carry an honest ceiling, **so that** I do not assume any format guarantees agent compliance.

**Acceptance Criteria**:
1. Given the brief, When I read Angle 2, Then I see the Fowler and Bockeler ceiling stated plainly next to the EARS and constraint techniques

---

## 12. OPEN QUESTIONS

- Which ranked candidates survive corpus-specific verification once the loop runs. ANSWERED by the five-lineage loop: one measured unconditional GO (the JSON-schema gate), a cluster of floor-bypassing GO-on-cost fields and gates plus seven novel floor-bypassing capabilities, a conditional retrieval slate of five items that stay hypothesis-until-prod-measured, plus a consolidated no-go list of eighteen already-shipped or premature or over-engineered techniques. See `research/research.md`.
- How much of the Turso and libSQL claim set holds up under an independent benchmark. ANSWERED: no-go. RRF plus sqlite-vec already ship, the swap moves nothing measurable, while quantization is premature on a roughly 2022-row corpus.
- Whether the prod-mode completeRecall@3 read promotes any retrieval candidate once a build runs. OPEN, deferred to a build stage.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Index**: See `research/research.md`
