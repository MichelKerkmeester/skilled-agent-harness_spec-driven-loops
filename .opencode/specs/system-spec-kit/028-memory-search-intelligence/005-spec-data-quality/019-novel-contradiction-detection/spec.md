---
title: "Feature Specification: Novel Cross-Doc Contradiction and Staleness Detection [template:level_2/spec.md]"
description: "Nothing on the corpus checks whether two docs that describe the same entity actually agree. A claim and its later correction can both sit live in the index with no detector that pairs them and scores the conflict, so the logic-consistency reader is unserved."
trigger_phrases:
  - "contradiction detection"
  - "staleness detection"
  - "cross-doc consistency"
  - "llm entailment scoring"
  - "candidate-pair gating"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/019-novel-contradiction-detection"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored novel contradiction detection spec from research synthesis section 3"
    next_safe_action: "Author plan.md and tasks.md for the detector build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Novel Cross-Doc Contradiction and Staleness Detection

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
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `019-novel-contradiction-detection` |
| **Verdict** | GO-on-cost (novel lineage headline) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The corpus has detectors for shape, frontmatter and cross-surface coherence within a single packet, but nothing checks whether two distinct docs that describe the same entity actually agree on the facts. A claim and its later correction can both sit live in the index at once, and the staleness case is the same defect on a time axis where an old assertion outlives the fact it stated. This is the logic-consistency reader the truncation law leaves wide open, since a contradiction is a finding and not a vector row, so no retrieval gate or recall measurement ever surfaces it.

### Purpose
A new report-only detector class on the B1 sweep pairs only the docs that share a catalog entity or a causal edge, scores each candidate pair for contradiction or staleness with an LLM entailment check and emits a finding, never a vector row and never a body mutation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new detector class registered in the shared `detector-registry.ts` with `fixClass: none`, report-only by construction.
- A candidate-pair generator that gates pairs by the shipped `entity_catalog` table and the shipped causal graph, never all-pairs.
- An LLM-entailment scorer that classifies a candidate pair as agree, contradict or stale and attaches a confidence.
- Finding emission into the same report channel the B1 sweep and B2 doctor route already surface, edge-tagged contradiction versus staleness.
- A default-off feature flag so the detector lands dark and never blocks an existing gate.

### Out of Scope
- The shared safe-fix engine, detector registry and `fixClass` allow-list - owned by 026-shared-safe-fix-engine, consumed here.
- The B1 sweep entrypoint and CI fan-out plumbing - owned by 011-b1-scheduled-dq-sweep, this detector mounts on it.
- Any auto-resolution of a detected contradiction - the detector is report-only, a human picks the surviving claim.
- Any vector row, embedding or retrieval-class change - this is floor-bypassing by construction and never touches ranking.
- A new entity extractor or causal graph - both are shipped and consumed read-only as the pair-gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/sweep/detectors/contradiction.ts` | Create | The detector class: candidate-pair generation, entailment scoring, finding emission |
| `.opencode/skills/system-spec-kit/scripts/sweep/detector-registry.ts` | Modify | Register the contradiction detector entry with `fixClass: none` |
| `.opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts` | Modify | Fold the new detector into the report-mode fan-out behind the default-off flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The detector SHALL register with `fixClass: none` and emit findings only, never write to the corpus. | A sweep run with the detector enabled on a corpus with a planted contradiction emits a finding and leaves the git working tree clean. |
| REQ-002 | When generating candidate pairs, the system SHALL pair only docs that share an `entity_catalog` entity or a causal edge, never all-pairs. | On a fixture corpus, the candidate-pair count is bounded by shared-entity and causal-edge adjacency and a pair with no shared entity and no edge is never scored. |
| REQ-003 | When a candidate pair is scored as contradict or stale, the system SHALL emit a finding tagged with the pair, the verdict class and the entailment confidence. | A planted contradiction produces a finding row carrying both doc paths, a `contradict` or `stale` tag and a confidence value. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The detector SHALL be gated behind a default-off feature flag so it lands dark. | With the flag unset, a sweep run skips the detector and the existing gates are unchanged. |
| REQ-005 | When the LLM entailment call fails or times out on a pair, the system SHALL record the pair as errored and continue the fan-out. | A forced scorer failure on one pair errors that pair and the remaining pairs still score. |
| REQ-006 | The detector SHALL distinguish a contradiction from a staleness case by tagging the time axis when one claim post-dates the other. | A planted stale-claim fixture is tagged `stale` and a planted same-time conflict is tagged `contradict`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The detector's first run finds at least one real cross-doc contradiction or stale claim on the live corpus that no shape, frontmatter or coherence gate could have caught, proving the logic-consistency reader was unserved.
- **SC-002**: The candidate-pair count stays a small multiple of the shared-entity and causal-edge adjacency, not the all-pairs quadratic, so a full-corpus run completes in a single sweep job.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 026-shared-safe-fix-engine | The detector has no registry or report channel of its own | Build after the engine and registry land, register one entry, emit through the shared channel |
| Dependency | 011-b1-scheduled-dq-sweep | The detector has no fan-out caller of its own | Mount on the B1 sweep, it is one more detector in the report-mode set |
| Risk | All-pairs scoring blowup | A quadratic scan of the corpus times out and costs LLM calls with no value | Candidate-pair gate by shared `entity_catalog` entity and causal edge, never all-pairs |
| Risk | LLM entailment false-positives | A noisy detector floods the report with non-contradictions | Report-only, human-gated, confidence-tagged so a reviewer triages, no auto-action |
| Risk | An LLM hallucinating a contradiction | A fabricated finding wastes reviewer time | Confidence threshold plus the pair-gate keep volume low and every finding cites both source docs for human verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Candidate-pair generation is bounded by shared-entity and causal-edge adjacency, so the LLM-call count scales with corpus connectivity, not corpus size squared.
- **NFR-P02**: The entailment scorer batches or caps concurrent LLM calls so a full sweep run fits one job wall clock.

### Security
- **NFR-S01**: The detector is report-only with `fixClass: none`, so it has no write path to the corpus and cannot mutate a source doc.

### Reliability
- **NFR-R01**: A scorer failure on one pair errors that pair and the fan-out over remaining pairs continues, so one bad call never aborts the sweep.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A doc with no `entity_catalog` entity and no causal edge: it generates no candidate pair and is silently skipped, never scored against everything.
- A self-pair where the entity points back at the same doc: filtered before scoring.
- An empty corpus subtree: zero pairs, zero findings, clean exit.

### Error Scenarios
- The LLM entailment call times out on a pair: the pair is recorded errored and the run continues.
- The `entity_catalog` table is empty or absent: the detector degrades to causal-edge pairs only and reports the catalog gap rather than failing.
- A candidate pair where one doc was deleted between pairing and scoring: the missing target is skipped as errored, not crashed on.

### State Transitions
- A contradiction the operator resolves by editing one doc: the next sweep no longer pairs them as a conflict, so the finding self-clears with no detector state to reset.
- A stale claim that becomes current again: the time-axis tag flips on the next run since the verdict is recomputed per run, never cached.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One new detector class plus two thin registration edits, all over shipped machinery |
| Risk | 12/25 | Report-only and human-gated, the only real risk is LLM noise, mitigated by the pair-gate and confidence threshold |
| Research | 8/20 | Pair-gate seams verified to the shipped entity catalog and causal graph, the entailment scorer is the open design |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, verified to file:line against the live tree.

- The detector lives at `scripts/sweep/detectors/contradiction.ts` and registers one entry `{id, surface, detect, fixClass: none, fix: undefined}` in the shared `detector-registry.ts`. A `none` fixClass means the engine never offers it an apply path, which is the structural guarantee that it stays report-only.
- The candidate-pair gate consumes the shipped entity catalog. Entities are upserted into the `entity_catalog` table by `updateEntityCatalog` and rebuilt deterministically by `rebuildEntityCatalog` (`lib/extraction/entity-extractor.ts:367,433`). The detector reads `entity_catalog` to find docs that share a canonical entity and proposes only those as candidate pairs.
- The second pair source is the shipped causal graph. Flattened-chain edges (`FlatEdge`, `FlattenedChain` in `handlers/causal-graph.ts:45,56`) and the causal query surface (`tools/causal-tools.ts`) give the docs already linked by a captured causal relation, which are the second class of pairs worth comparing.
- The entailment scorer takes a candidate pair, sends both claims to the LLM with an agree-or-contradict-or-stale rubric and returns a verdict plus a confidence. It is the one net-new piece. It writes no field and mutates no body, it returns a finding object the sweep folds into its report.
- The detector mounts on the B1 sweep fan-out at `scripts/sweep/dq-sweep.ts`, gated behind a default-off flag, so it runs in report mode alongside the A1 detectors and never under any apply path.

## 8. DEPENDENCIES AND VERDICT

- **Depends on 026-shared-safe-fix-engine**: the detector registers in the single `detector-registry.ts` source of truth and emits through the one shared report channel. It contributes a `none`-class detector and no fix, so it touches the allow-list not at all. Build it after the engine and registry land.
- **Depends on 011-b1-scheduled-dq-sweep**: the detector is one entry in the B1 report-mode fan-out, it has no scheduler, CI workflow or runner of its own. It ships after the sweep exists.
- **Not gated on 015-c2-prodmode-recall-gate**: this detector emits findings, never a vector row, so it is floor-bypassing by construction and the C2 prod-mode completeRecall@3 gate does not apply. Its value proof is a found contradiction on the live corpus, not a recall rise.
- **Consumes the shipped entity catalog and causal graph read-only**: `entity_catalog` (`lib/extraction/entity-extractor.ts`) and the causal graph (`handlers/causal-graph.ts`, `tools/causal-tools.ts`) are the pair-gate inputs, not new builds. The detector reads them and writes neither.
- **Verdict: GO-on-cost (novel lineage headline)**. The novel lineage attacked twelve out-of-the-box ideas and this is its headline survivor. It bypasses the truncation law because a contradiction is a finding and not a retrieval result, it serves the logic-consistency reader nothing else touches and the candidate-pair gate plus report-only construction keep its cost and blast radius bounded. It ships on cost and structural soundness, with the standing-value proof deferred to the first run that finds a real conflict.

---

## 10. OPEN QUESTIONS

- What confidence threshold separates a reported contradiction from a discarded low-confidence pair, given the cost of reviewer noise versus a missed real conflict.
- Which LLM and which rubric for the entailment call, balancing call cost across the candidate-pair set against verdict fidelity.
- Does the time-axis staleness tag read the doc `last_updated_at` continuity field or a git-history timestamp to decide which claim post-dates the other.
<!-- /ANCHOR:questions -->
