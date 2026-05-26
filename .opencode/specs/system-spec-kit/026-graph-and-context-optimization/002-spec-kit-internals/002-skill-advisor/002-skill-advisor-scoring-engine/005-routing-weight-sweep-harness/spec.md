---
title: "Feature Specification: Lane weight sweep harness and intent-prompt corpus"
description: "Extend runLaneAblation to accept laneWeightsOverride, build a 20-30 prompt corpus split between today-correct and intent-described, sweep candidate vectors against it, recommend a tuned weight."
trigger_phrases:
  - "lane weight sweep harness"
  - "advisor weight vector sweep"
  - "intent prompt corpus"
  - "skill advisor tuning"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-routing-weight-sweep-harness"
    last_updated_at: "2026-05-13T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001503"
      session_id: "003-weight-sweep-harness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Today corpus comes from synthesized fixture prompts authored in this packet, not the existing ablation legacy fixtures."
      - "Sweep emits a recommendation table; lane-registry.ts is NOT modified by this packet (any future weight change is a separate packet)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Lane weight sweep harness and intent-prompt corpus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-13 |
| **Branch** | `003-weight-sweep-harness` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015/002 promoted the cosine lane to a live weight of 0.05 by following a single conservative weight vector. The promotion was safe but the choice of 0.05 was a judgement call without empirical comparison against other candidates. The existing `runLaneAblation` at `scorer/ablation.ts` only supports lane on/off ablation; there is no weight-vector sweep infrastructure. Future tuning attempts cannot be evidence-driven without that harness.

### Purpose
Build the missing infrastructure: extend `scoreAdvisorPrompt` to accept a `laneWeightsOverride` parameter, extend ablation.ts with a `runLaneWeightSweep` function, author a fixture corpus of 20-30 prompts that span today-correct routings AND intent-described routings, sweep a small set of candidate vectors, output a markdown recommendation report. This packet does NOT modify `lane-registry.ts` — its output is research, not behavior change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `AdvisorScoringOptions` with optional `laneWeightsOverride: Partial<Record<ScorerLane, number>>`.
- Extend `scoreAdvisorPrompt` to merge the override on top of `DEFAULT_SCORER_WEIGHTS` when present.
- Add `runLaneWeightSweep(args: { cases, workspaceRoot, vectors }) => SweepReport` in `scorer/ablation.ts`.
- Author a fixture corpus at `skill_advisor/tests/scorer/fixtures/intent-prompt-corpus.ts` (or `.json`) with 20-30 entries: half today-correct (already route to a specific skill via lexical/explicit) and half intent-described (describe what the user wants without naming the skill's keywords).
- Define 5-8 candidate weight vectors in the packet's spec.md and pass them to the sweep.
- Vitest test that runs the sweep and emits a markdown table.
- Recommendation summary in packet's `implementation-summary.md` plus a `research/sweep-results.md` artifact.

### Out of Scope
- Modifying `lane-registry.ts`. The promoted 0.05 weight stays unchanged.
- Modifying the cosine lane math.
- Adding new lanes.
- Tuning thresholds (`confidenceThreshold`, `uncertaintyThreshold`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | `AdvisorScoringOptions.laneWeightsOverride` accepted by `scoreAdvisorPrompt`. | Type compiles; new field documented in types.ts. |
| REQ-002 | When override is set, fusion uses overridden weights for the named lanes and DEFAULT_SCORER_WEIGHTS for the rest. | Unit test verifies a single-lane override changes only that lane's contribution. |
| REQ-003 | `runLaneWeightSweep` accepts an array of weight vectors and returns a `SweepReport` with per-vector accuracy and per-skill routing diffs. | Function exists; test exercises it. |
| REQ-004 | Fixture corpus exists with at least 20 entries split 50/50 today-correct vs intent-described. | Corpus file checked in; each entry has `prompt` + `expectedSkill` + `category: 'today-correct'\|'intent-described'`. |
| REQ-005 | Candidate vectors include: current live (baseline), conservative variants (±0.02), aggressive variants (+0.10 / +0.15 to semantic). | At least 5 vectors listed in spec.md and exercised by the sweep test. |
| REQ-006 | Sweep results documented in `research/sweep-results.md`. | Markdown file lists per-vector overall accuracy, today-correct accuracy, intent-described accuracy, and any routing flips. |
| REQ-007 | Recommendation surfaced in implementation-summary.md. | "Recommended next weight" entry, with rationale: "stay at 0.05" or "raise to X". Justified by sweep numbers. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: `npm run typecheck` passes from `mcp_server/`.
- **SC-003**: Sweep Vitest test passes and emits the markdown report.
- **SC-004**: Recommendation is justified by numbers from the sweep (not handwave).
- **SC-005**: `lane-registry.ts` is untouched (research-only packet).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Corpus authored by codex may be biased toward the current cosine lane | Sweep result favors current weights regardless | Author the corpus FIRST without running the sweep; review prompts for adversarial balance before sweep runs |
| Risk | Sweep flags a winner that differs from current 0.05 | Implies the conservative promotion was suboptimal | Document the finding but do NOT auto-promote; sibling packet would handle the change |
| Dependency | 015/001 + 015/002 shipped | Cosine lane must exist and be live | Both already on origin/main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Exact corpus authoring strategy (use real-world prompts vs synthetic templated prompts)
- Whether to include shadow-only lane variant (live: false at non-zero weight) as a sweep dimension
- Format of the markdown report
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Sweep test runs in under 30 seconds against the fixture corpus (no live MCP calls; pure scoring). |
| NFR-S01 | Security | Corpus contains no secrets or production-sensitive prompts. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Override sets a lane weight to 0 for a `live: true` lane: fusion should treat it as if that lane were temporarily shadow-only for this scoring call.
- Override contains a lane that does not exist in the registry: ignore and warn (do not throw).
- Empty override object: behave identically to no override.
- Weight override sum != 1.0: do NOT renormalize; just use the literal values and let the fusion math handle it. Document this in the function's JSDoc.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 350-600 | Types extension, fusion override path, sweep function, corpus file, vitest, report markdown |
| **Surface area** | Medium | Touches scoring core but stays additive (existing callers unaffected) |
| **Risk** | Low | No live behavior change; research output only |
| **Reversibility** | High | Single-commit revert |
<!-- /ANCHOR:complexity -->
