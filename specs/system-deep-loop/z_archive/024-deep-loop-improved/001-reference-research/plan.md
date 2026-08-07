---
title: "Implementation Plan: Reference Research — Loop-Systems Improvement"
description: "Plan for a 51-iteration deep-research run mining vendored loop-cli-main + kasper into a ranked, deduplicated backlog of 40 loop-system improvements."
trigger_phrases:
  - "loop reference research plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/001-reference-research"
    last_updated_at: "2026-07-02T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored real plan content from research.md evidence"
    next_safe_action: "No implementation action remaining"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/024-deep-loop-improved/001-reference-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-content-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Reference Research — Loop-Systems Improvement

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (reference repos), Markdown (synthesis) |
| **Framework** | `/deep:research` loop, executor `cli-codex gpt-5.5 xhigh fast` |
| **Testing** | N/A -- this is a research packet, not a code change |

### Overview
Ran a 51-iteration deep-research loop over two vendored reference codebases, `external/loop-cli-main` (TS daemon+CLI cadence runner) and `external/kasper` (opencode observe-evaluate-improve-measure loop), consolidating ~221 raw findings (476 registry rows incl. graph nodes) into 40 ranked, deduplicated, evidence-cited backlog items synthesized into `research/research.md` and `research/resource-map.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Two vendored reference codebases confirmed available under `external/`.
- [x] Deep-research loop config authored (`research/deep-research-config.json`), anti-convergence strategy defined.

### Definition of Done
- [x] >=50 proper iterations completed with zero early-stop events. Evidence: 51 iteration files under `research/iterations/`, final `convergenceScore` 0.66, terminated on the `proper_count >= 50` gate, not convergence.
- [x] Ranked, deduplicated, actionable backlog synthesized. Evidence: `research/research.md` (40 items, each with reference `file:line`, OUR target file, difficulty tag).
- [x] Coverage map recorded. Evidence: `research/resource-map.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standard `/deep:research` loop: iteration cycle with externalized state (`deep-research-state.jsonl`, `findings-registry.json`, `deltas/`), convergence-gated but anti-convergence-hardened.

### Key Components
- **Segment progression (S1-S6)**: mine loop-cli -> mine kasper -> map to runtime -> map to workflows/speckit -> cross-cutting -> synthesis.
- **Dimension rotation (D1-D4)**: source-mining / target-mapping / cross-cutting / synthesis, rotated per iteration to prevent premature convergence.
- **Novelty monitor + wildcards**: injected fresh angles (W-06 record-replay, W-10 meta-loop) to keep late iterations genuinely novel rather than restating earlier findings.

### Data Flow
Iteration N reads prior findings-registry state -> mines a segment/dimension of the reference repos -> writes new findings + a delta -> convergence signal computed (recorded, not acted on early) -> iteration 51 gate reached -> synthesis pass consolidates all registry rows into the ranked `research.md` backlog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Vendor `external/loop-cli-main` and `external/kasper` into the packet.
- [x] Author `research/deep-research-config.json` and `research/deep-research-strategy.md` (segment progression, dimension rotation, wildcards).

### Phase 2: Core Implementation
- [x] Run 51 proper iterations (S1-S2: mine loop-cli-main and kasper; S3-S4: map mechanisms to OUR runtime/workflows/speckit surfaces; S5: cross-cutting themes; S6: synthesis).
- [x] Maintain `findings-registry.json` and per-iteration delta files throughout.

### Phase 3: Verification
- [x] Confirm zero early-stop events across all 51 iterations (anti-convergence strategy held).
- [x] Synthesize and rank the final 40-item backlog with evidence citations in `research/research.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence citation check | Every backlog item cites a reference `file:line` and an OUR target file | Manual review during synthesis |
| Convergence audit | Confirm no early stop across 51 iterations | `research/deep-research-state.jsonl` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vendored `external/loop-cli-main` + `external/kasper` | Internal (packet-local) | Green | Reference evidence citations would not resolve without them |

### Downstream
The 40-item backlog is the direct source for `system-deep-loop/024-deep-loop-improved`'s own phase 002-010 tree (each backlog item became its own follow-up implementation spec).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable -- this is a completed, read-only research packet with no runtime behavior to roll back.
- **Procedure**: N/A.
<!-- /ANCHOR:rollback -->
