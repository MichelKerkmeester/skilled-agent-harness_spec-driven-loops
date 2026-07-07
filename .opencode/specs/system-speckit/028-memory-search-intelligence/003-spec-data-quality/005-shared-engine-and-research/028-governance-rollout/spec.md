---
title: "Feature Specification: Governance and Rollout Layer [template:level_2/spec.md]"
description: "The data-quality program has eighteen build phases with five inviolable ordering edges but no canonical sequencer, no shared four-beat migration discipline, no codified safety model and no consolidated NO-GO list. This phase authors the governance layer that orders the build, gates each rule flip, encodes the two structural invariants and freezes the eighteen-item NO-GO list with its ten anti-patterns."
trigger_phrases:
  - "governance rollout"
  - "seventeen stage sequence"
  - "four beat migration"
  - "no-go list"
  - "safety invariant inv-1 inv-2"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/028-governance-rollout"
    last_updated_at: "2026-07-04T17:12:03.094Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec for the governance and rollout layer"
    next_safe_action: "Run generate-context to produce description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Governance and Rollout Layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `028-governance-rollout` |
| **Tier** | INFRA (research section 5) |
| **Verdict** | GO (governance discipline, no retrieval risk, orders and gates every other phase) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The data-quality program is a fleet of eighteen build phases that share one engine and one registry, yet the ordering that makes them safe lives only in research prose at `../research/research.md:104-118` and nowhere executable. Five dependency edges are inviolable (census before gate, engine before front doors, backfill before error, coverage guard before retrieval trust, C2 before retrieval promotion), but no phase owns the topological sort, so two parallel sessions can flip a hard rule before its backfill reads zero or promote a retrieval-class change before a prod-mode read exists. The four-beat migration discipline (WARN, BACKFILL, RE-MEASURE TO ZERO, ERROR) is described once and re-derived by hand per gate, so it can compress or skip a beat. The safety model rests on two structural invariants (INV-1 a body-touching fix is never safe, INV-2 a retrieval change is never promoted without a prod-at-3 read) that are stated at `../research/research.md:110` but not codified as a checklist any reviewer or CI step consults. The NO-GO list is split across the Tier-D table at `../research/research.md:55-66` and the eight non-unqualified-GO rows of the novel table at `../research/research.md:78-85`, eighteen items total, with no single artifact a contributor can read before proposing a new detector or lane.

### Purpose
Author the canonical governance layer for the data-quality program: one ordered seventeen-stage rollout that encodes the five dependency edges, one four-beat migration runbook every gate phase follows, one safety model that makes INV-1 and INV-2 reviewable, one measurement plan with no cross-credit and one consolidated eighteen-item NO-GO list with its ten anti-patterns, so the build cannot drift out of safe order.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the canonical seventeen-stage rollout document across seven phases as the topological sort of the five inviolable edges (census before gate, engine before front doors, backfill before error, coverage guard before retrieval trust, C2 before retrieval promotion), naming each sibling phase folder per stage. Phases I through V ship the floor-bypassing reuse-first half on cost, Phase VI adds the report-only and additive novel slate in parallel with III through V, Phase VII builds the measurement instrument first then touches the retrieval half.
- Author the four-beat migration runbook (WARN land default-off and report, BACKFILL dry-run then batched apply through the existing additive write paths, RE-MEASURE TO ZERO confirm the corpus-wide failing count is 0, ERROR flip warn to error and drop the dormant `legacy_grandfathered` bypass and verify a corrupted scratch packet now exits 2) as the discipline every gate phase imports, with the single legacy-corpus invariant that no new hard rule is introduced until its backfill report reads zero.
- Codify the Stage-0 census as the prerequisite for every count-to-zero, capturing the known starting numbers (11 invalid graph files on the live root, 0 grandfathered packets so the bypass deletes with zero blast radius, the frontmatter and continuity dry-run gaps, the version-grammar census of 20 SKILL.md across 2 grammars, plus the mixed-embedding-regime chunk census).
- Codify the safety model as a reviewable checklist with the two structural invariants. INV-1 a fix touching an authored body is never `safe`, to be made mechanical by the planned `computeAuthoredDocQuality` wrapper that sibling `026-shared-safe-fix-engine` will ship to throw on full-auto and by quarantining the budget-trim to memory-save. INV-2 a retrieval-class change is never promoted without a prod-at-3 read through the C2 gate. Name the four human boundaries (auto-safe-fix local apply and CI report, human-gated guarded fixes, always-human-authored body edits, the release-reviewer gate that reads the prod-mode column) and the four standing drift guards (embedding drift, coverage drift, read-time content_hash storage drift, cross-copy trigger-vocabulary drift).
- Author the measurement plan: one reader, one metric, no cross-credit. Write-time earns its keep on a conformance count driven to zero plus a scratch-packet regression-catch proof. The scheduled sweep earns its keep only if its first run finds at least one defect in each of the three escape classes the change-triggered tiers missed, else it downgrades to on-demand. Retrieval earns its keep only on a prod-mode completeRecall-at-3 rise, with eval-mode at K and external at-5 and wider numbers ruled inadmissible. Each novel item proves a distinct non-retrieval metric.
- Author the consolidated NO-GO list of all eighteen items (ten Tier-D entries at `../research/research.md:55-66` plus the eight non-unqualified-GO novel entries at `../research/research.md:78-85`, which break down as three qualified GO-on-cost, two conditional and three strict NO-GO) and the ten governance anti-patterns each one instances, including the three novel rewrites that are NO-GO by rail crossing (retrieval-driven auto-rewriting, auto-summarization rollup nodes, doc-quality leaderboard or dashboard).

### Out of Scope
- Any engine, detector, scorer or schema code. This phase ships governance documents and a CI-checkable rollout manifest, not the `dq-engine.ts` or `detector-registry.ts` core, which sibling phases own.
- The C2 prod-mode recall gate build itself. This phase references `015-prodmode-recall-gate` as the promotion gate, it does not build the harness.
- The embedding coverage guard build. This phase names the coverage-guard edge as the retrieval-trust precondition, the guard is built inside the C1 and C2 phases.
- Editing the eighteen sibling phase specs. This phase produces the ordering and discipline they import, it does not rewrite them.
- Flipping any individual rule from warn to error. The flip is owned by each gate phase under the runbook this phase authors.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `028-governance-rollout/rollout-sequence.md` | Create | The canonical seventeen-stage seven-phase ordered rollout, each stage mapped to its sibling phase folder, with the five dependency edges named per stage boundary |
| `028-governance-rollout/migration-runbook.md` | Create | The four-beat WARN-BACKFILL-REMEASURE-ERROR runbook plus the Stage-0 census table with the known starting numbers, imported by every gate phase |
| `028-governance-rollout/safety-model.md` | Create | INV-1 and INV-2 as a reviewable checklist, the four human boundaries, the four standing drift guards, the CI-never-auto-commits boundary rationale |
| `028-governance-rollout/measurement-plan.md` | Create | The one-reader one-metric no-cross-credit plan, the three sweep escape classes, the prod-mode-at-3 admissibility rule |
| `028-governance-rollout/no-go-list.md` | Create | The consolidated eighteen-item NO-GO list keyed to the ten anti-patterns, including the three rail-crossing novel rewrites |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Reference | Names the `legacy_grandfathered` bypass deletion as the ERROR beat of the A4 gate, owned by `004-schema-warn-to-error`, not flipped here |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The system MUST publish one canonical rollout sequence that is the topological sort of the five inviolable dependency edges across seventeen stages and seven phases | `rollout-sequence.md` lists seventeen ordered stages, each of the five edges (census before gate, engine before front doors, backfill before error, coverage guard before retrieval trust, C2 before retrieval promotion) appears as a named stage boundary and no stage precedes a stage it depends on |
| REQ-002 | When a gate phase introduces a new hard rule the system MUST require the four-beat migration in order and MUST block the ERROR beat until the backfill report reads zero | `migration-runbook.md` defines WARN then BACKFILL then RE-MEASURE TO ZERO then ERROR as a non-compressible sequence and states the legacy-corpus invariant that no new hard rule errors until its failing count is 0 |
| REQ-003 | The system MUST codify INV-1 (a body-touching fix is never `safe`) and INV-2 (a retrieval-class change is never promoted without a prod-at-3 read) as a reviewable checklist | `safety-model.md` states both invariants, ties INV-1 to the planned `computeAuthoredDocQuality` full-auto throw that sibling `026-shared-safe-fix-engine` will ship and the budget-trim quarantine, ties INV-2 to the C2 gate and lets a reviewer check each invariant against a proposed change with a yes or no |
| REQ-004 | The system MUST publish a measurement plan that admits no cross-credit between readers and rules eval-mode-at-K and external-at-5-and-wider numbers inadmissible for the retrieval verdict | `measurement-plan.md` states one reader one metric per tier, names the prod-mode completeRecall-at-3 rise as the only admissible retrieval verdict and names the three sweep escape classes that justify the scheduled tier |
| REQ-005 | The system MUST consolidate all eighteen NO-GO items into one list keyed to the ten governance anti-patterns | `no-go-list.md` enumerates eighteen items (ten Tier-D NO-GO entries plus eight non-unqualified-GO novel entries: three qualified GO-on-cost, two conditional and three strict NO-GO) with a deciding reason each, maps each to one of ten named anti-patterns and explicitly marks the three novel rewrites (retrieval-driven auto-rewriting, auto-summarization rollups, leaderboard) as rail-crossing NO-GOs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The Stage-0 census MUST be named as the prerequisite for every count-to-zero gate and MUST carry the known starting numbers | `migration-runbook.md` lists the census numbers (11 invalid live-root graph files, 0 grandfathered packets, the frontmatter and continuity dry-run gaps, 20 SKILL.md across 2 grammars, the mixed-embedding-regime chunk census) as the baseline each gate measures against |
| REQ-007 | The retrieval migration MUST be documented as a SEPARATE migration gated on the embedding coverage guard that does not exist yet | `safety-model.md` and `rollout-sequence.md` place the retrieval half in Phase VII behind the coverage guard and the C2 gate, distinct from the write-time gates of Phases I through V |
| REQ-008 | The four human escalation boundaries and four standing drift guards MUST be enumerated so CI-never-auto-commits has a stated rationale | `safety-model.md` lists the four boundaries (auto-safe-fix, human-gated guarded, human-authored body, release-reviewer prod-column) and four drift guards, then states the governance boundary is blast-radius review not fix-safety |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five governance documents exist, the rollout sequence is a valid topological sort of the five edges across seventeen stages and every sibling gate phase can import the four-beat runbook by reference rather than re-deriving it.
- **SC-002**: The NO-GO list enumerates all eighteen items against ten named anti-patterns, the safety model makes INV-1 and INV-2 reviewable and the measurement plan admits only prod-mode completeRecall-at-3 for the retrieval verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `015-prodmode-recall-gate` is the promotion gate every Tier-C and every 027 retrieval item must pass before promotion | High, the retrieval half of Phase VII cannot promote without it | Reference the C2 phase as the named gate, hold all retrieval-class promotion behind it, build nothing retrieval here |
| Dependency | `026-shared-safe-fix-engine` owns the one engine and frozen fixClass registry that A1 and B1 and B2 share | Med, the rollout orders engine before front doors so the engine phase must land first | Sequence the engine phase ahead of A1, B1, B2 in `rollout-sequence.md`, do not duplicate the registry here |
| Dependency | The Stage-0 census numbers come from the parent research and must hold at build time | Med, a stale census number lets a gate flip before zero | Re-run the census per gate phase as the runbook prescribes, treat the documented numbers as the baseline to confirm not assume |
| Risk | A contributor flips a hard rule or promotes a retrieval change out of order because the governance lives only in prose | High, this is the exact gap this phase closes | Make `rollout-sequence.md` the single ordered source and `migration-runbook.md` the non-compressible discipline both gates import |
| Risk | The one net-negative seam, the graph-metadata rollup, can harm a narrow query by displacing a real child | Med, it is the single candidate that can actively regress | The NO-GO list marks the auto-summarization rollup NO-GO and the measurement plan requires the narrow-query regression be measured in the SAME pass as any broad-query win |
| Risk | The governance documents drift from the sibling phase specs as those phases evolve | Low to Med, governance prose can go stale | Keep each governance doc grounded to the research file:line seams and to the named sibling folders, not to re-stated phase internals |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rollout manifest and runbook are read-time documents with no runtime cost, the only build-time cost is the per-gate census re-run the runbook already prescribes.

### Security
- **NFR-S01**: The governance layer adds no new write path and no new trust boundary, it documents the existing boundaries and the CI-never-auto-commits rule.

### Reliability
- **NFR-R01**: The four-beat runbook guarantees a valid corpus continues to pass strict validation at every beat, because no rule errors until its backfill reads zero.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero grandfathered packets: the census reads 0, so the `legacy_grandfathered` bypass deletion in the A4 ERROR beat carries zero blast radius. The runbook records this as the baseline.
- A gate whose backfill cannot reach zero: the runbook blocks the ERROR beat, the rule stays at warn, the gap is surfaced not silently flipped.
- A novel item that is report-only and additive: Phase VI parallelizes with III through V because it emits findings or additive artifacts, never vector rows, so it does not contend for the retrieval gate.

### Error Scenarios
- A retrieval-class change proposed without a prod-at-3 read: INV-2 blocks promotion, the C2 gate is the named precondition, the change stays default-off behind the coverage guard.
- A safe-fix proposed against an authored doc body: INV-1 blocks the `safe` classification, the planned `computeAuthoredDocQuality` wrapper will throw on full-auto.
- A scheduled sweep that finds nothing the change-triggered tiers missed: the measurement plan downgrades it to on-demand rather than keeping a no-value standing job.

### State Transitions
- Partial rollout across parallel sessions: the seventeen-stage order is the single arbiter, a stage cannot start until its dependency edge is satisfied, even when sessions run concurrently.
- A gate mid-migration: WARN and BACKFILL may have landed while severity is still warn, the ERROR beat is the final transition and lands only after RE-MEASURE TO ZERO.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 5 new governance documents plus 1 referenced file, no engine or schema code, but it orders 17 stages and 18 NO-GO items |
| Risk | 8/25 | No code change and no breaking flip here, the risk is governance drift and out-of-order flips by other phases this layer must prevent |
| Research | 3/20 | Sequence, edges, invariants, census numbers and the NO-GO list are all grounded to `../research/research.md` sections 4 and 5 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `rollout-sequence.md` be a CI-checkable manifest (a structured list a guard can read against the live sibling folders) or a prose document only, given the parent program already CI-asserts the `/doctor` route manifest via `route-validate.py`.
- Does the Stage-0 census run once as a parent prerequisite and feed every gate, or does each gate phase re-run its own slice of the census against its own surface at flip time.
- Are the three sweep escape classes (path-filter escapes, backfill blind spots, cross-surface coherence) the final list, or does the B1 scheduled-sweep phase get to add a fourth class as it discovers escapes.
<!-- /ANCHOR:questions -->
