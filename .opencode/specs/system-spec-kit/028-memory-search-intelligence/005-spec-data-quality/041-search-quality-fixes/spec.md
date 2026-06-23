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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/041-search-quality-fixes"
    last_updated_at: "2026-06-23T00:00:00Z"
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
| **Status** | In Progress |
| **Created** | 2026-06-23 |
| **Parent Packet** | `005-spec-data-quality` |
| **Source** | `029-vague-query-model-benchmark/research/research.md` |
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

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS
- None. The deep-research answered all six; structure and scope are operator-confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Research:** `../029-vague-query-model-benchmark/research/research.md`
- **Benchmark:** `../029-vague-query-model-benchmark/benchmark-results.md`
