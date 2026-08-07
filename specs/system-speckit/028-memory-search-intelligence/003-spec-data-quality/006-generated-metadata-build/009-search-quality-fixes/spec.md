---
title: "Feature Specification: Search-Quality Fixes from the 029 Deep Research"
description: "Implements the six fixes the 029 deep-research surfaced: the dead evidence-gap verdict cap (the real bug), the binary citeCorrect metric, the misleading weightsApplied telemetry, the bare-dash row score, deterministic ranking, and the presentation-contract count and title tightening. Each fix is small and cited; the keystone activates a flag that graduated but never fired live."
trigger_phrases:
  - "search quality fixes"
  - "evidence gap cap fix"
  - "deterministic ranking flag"
  - "029 findings remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/009-search-quality-fixes"
    last_updated_at: "2026-07-04T17:11:55.938Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the 041 fix phase from the 029 deep-research plan"
    next_safe_action: "Implement fix 1 (evidence-gap cap bridge) first"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-23-041-search-quality-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Structure: one phase, six fixes as tasks."
      - "Q6 scope: change production ranking, gated behind a default-off flag."
      - "Verification: fast-subset benchmark re-run."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Search-Quality Fixes from the 029 Deep Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Parent Packet** | `003-spec-data-quality` |
| **Source** | `029-vague-query-model-benchmark/research/research.md` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../008-flag-graduation-benchmark/spec.md |
| **Successor** | ../010-deterministic-ranking-benchmark/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 029 deep-research traced the vague-query benchmark findings to six fixable causes in the live memory-search pipeline. The keystone is a real correctness regression: the `SPECKIT_EVIDENCE_GAP_VERDICT_V1` cap graduated to default-ON this session but never fires on a live search, because the handler sets the evidence-gap warning that drives the banner but never sets the boolean the verdict cap reads. The other five are an off benchmark metric, a misleading telemetry field, a blank row score, non-deterministic ranking, and two presentation-contract gaps.

### Purpose
Land all six fixes, each small and cited, then verify the keystone fires live with a fast-subset benchmark re-run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Fix 1 (Q1, keystone):** bridge `pipelineResult.metadata.stage4.evidenceGapDetected` into `extraData.evidenceGap` so the graduated cap fires; verify the recovery-classification side effect.
- **Fix 2 (Q3):** make the benchmark `citeCorrect` metric three-tier-aware (valid-set membership).
- **Fix 3 (Q4):** add an honest retrieval-profile status field; stop reusing `intent.weightsApplied` as class-profile status.
- **Fix 4 (Q5a):** surface the resolved row score so graph and degree rows show a number, not a dash.
- **Fix 5 (Q6):** deterministic ranking behind a default-off flag, removing the wall-clock inputs (vector decay, trigger boost, recency) from ranking and adding the trigger id tie-break.
- **Fix 6 (Q5b/c):** tighten the presentation contract so the rendered count equals the rows shown and long paths render the leaf title.

### Out of Scope
- Re-running the full 144-cell matrix (fast subset only this pass).
- Graduating the determinism flag to default-on (needs a recall benchmark, a later decision).

### Files to Change
| File Path | Change Type | Fix |
|-----------|-------------|-----|
| `mcp_server/handlers/memory-search.ts` | Modify | 1, 3 |
| `mcp_server/formatters/search-results.ts` | Modify | 4 |
| `mcp_server/lib/search/vector-index-queries.ts` | Modify | 5 |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | 5 |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | 5 |
| `029-vague-query-model-benchmark/scripts/extract-metrics.mjs` | Modify | 2 |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | 6 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001:** With `SPECKIT_EVIDENCE_GAP_VERDICT_V1` on, a live search whose Stage 4 detects a gap MUST return `requestQuality: weak` (capped), not `good`, and the banner and verdict MUST agree.
- **REQ-002:** The benchmark `citeCorrect` MUST score `cite_with_caveat` as correct for a `weak` verdict.
- **REQ-003:** The envelope MUST expose retrieval-profile status separately from `intent.weightsApplied`.
- **REQ-004:** Graph and degree result rows MUST carry a displayable numeric score.
- **REQ-005:** Deterministic ranking MUST be gated by a new default-off flag and leave default behavior byte-identical when off.
- **REQ-006:** The rendered result count MUST equal the rows shown; long paths render the leaf title.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The keystone cap fires live. With `SPECKIT_EVIDENCE_GAP_VERDICT_V1` on, an off-corpus search whose Stage 4 detects a gap returns `requestQuality: weak` or `gap` and the banner and verdict agree, where the prior behavior was `good` rendered beside the gap banner
- **SC-002**: The benchmark `citeCorrect` metric reads honest. A `cite_with_caveat` citation scores correct for a `weak` verdict, and the re-extracted rate returns near 1.0 across the open-source models
- **SC-003**: The remaining four fixes land additive and reversible. The telemetry field, the row score, the deterministic-ranking flag and the presentation contract change behavior only where intended and leave default ranking byte-identical when the flag is off
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Activating the dead cap changes the recovery-classification side effect | A true gap could shift recovery status unexpectedly | Verified that `recovery-payload.ts` returns `partial` only on a true gap and non-gaps fall through unchanged |
| Risk | The deterministic-ranking change touches the production ranking path | A regression could shift default ranking | Gated behind a new default-off flag `SPECKIT_DETERMINISTIC_RANKING`, default behavior stays byte-identical, 163 ranking tests pass off |
| Risk | The Stage-4 gap threshold caps an aligned one-word query | An over-conservative cap on `graph` | Recorded as a tuning question for a later packet, the banner and verdict still agree so it is conservative not a contradiction |
| Dependency | The graduated `SPECKIT_EVIDENCE_GAP_VERDICT_V1` flag and the 029 benchmark harness | The keystone proof needs both the live flag and the fast-subset re-run | Both confirmed present, the re-run reused the 029 scripts and config |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None. The deep-research answered all six. Structure and scope are operator-confirmed.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The deterministic-ranking flag adds only a tie-break and a frozen-clock branch, so the on path carries no measurable ranking-latency cost over the default path
- **NFR-P02**: The row-score and telemetry fields are additive envelope writes, introducing no extra retrieval work

### Security
- **NFR-S01**: No fix widens the trust surface. The presentation contract renders a leaf title from an already-trusted path and the new envelope fields are derived from existing internal state
- **NFR-S02**: The fast-subset re-run dispatches only bare-query retrieval, which is read-only, so verification creates no memory record

### Reliability
- **NFR-R01**: The deterministic-ranking flag defaults off and leaves default ranking byte-identical, so the change is reversible by leaving the flag unset
- **NFR-R02**: The keystone cap is conservative. When Stage 4 detects a gap the verdict is capped to `weak` or `gap` rather than dropped, so a borderline query degrades gracefully into a no-cite policy
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Off-corpus query: `authentication` and `kubernetes` have no real corpus match and now cap to `gap` and `weak` with a no-cite or cite-with-caveat policy, the discriminating false-relevance case
- Aligned one-word query: `graph` is on-corpus yet the Stage-4 gap detector still fires and caps it to `weak`, conservative but with banner and verdict in agreement, flagged as a threshold-tuning question not a wiring bug
- Long result path: a path too long for the row renders its leaf title rather than a truncated or dash-only label

### Error Scenarios
- Graph or degree row with no similarity: the resolved composite score is surfaced so the row shows a number rather than a bare dash
- Verdict-banner contradiction: the prior failure mode was a `good` verdict rendered beside the evidence-gap banner on 19 of 144 cells, now zero after the cap is bridged

### State Transitions
- Flag off to on for deterministic ranking: with the flag off ranking keeps the wall-clock inputs and stays byte-identical, with it on the vector decay, trigger boost and recency drop out and the trigger id becomes the final tie-break
- Cite tier transition: a `weak` verdict now maps to `cite_with_caveat` and a `gap` verdict to `do_not_cite_results`, and the benchmark metric scores both honestly
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Six small cited fixes across five source files plus one benchmark script and one presentation asset |
| Risk | 8/25 | One keystone touches the live verdict path and one fix touches production ranking, both gated or verified, the rest are additive |
| Research | 12/20 | The fixes are pre-scoped by the 029 deep-research, the work is implementation plus a fast-subset proof re-run |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS
- **Research:** `../029-vague-query-model-benchmark/research/research.md`
- **Benchmark:** `../029-vague-query-model-benchmark/benchmark-results.md`
