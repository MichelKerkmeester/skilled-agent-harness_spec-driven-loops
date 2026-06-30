---
title: "Implementation Plan: cross-model-validation"
description: "Plans the packet-local confirm harness for validating held 113/003 findings on deepseek-v4-pro and kimi-k2.6. The implementation has not started yet."
trigger_phrases:
  - "113/007 implementation plan"
  - "cross model confirm harness plan"
  - "deepseek kimi validation plan"
  - "score variant fixture reuse"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation"
    last_updated_at: "2026-05-17T12:18:35Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-planned-implementation-plan"
    next_safe_action: "build-cross-model-confirm-harness"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/scripts/cross-model-confirm.cjs"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/002-eval-rig/fixtures"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/003-eval-loop/variants"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/003-eval-loop/scripts/score-variant.cjs"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/005-extraction-rerun/scripts/extract-files-from-markdown.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/007-cross-model-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Provider route readiness remains unverified"
    answered_questions:
      - "Harness should be packet-local and confirm-only"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cross-model-validation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS harness plus Markdown packet docs |
| **Framework** | Existing SWE 1.6 eval rig and Spec Kit Level 3 packet |
| **Storage** | Packet-local JSONL state and markdown analysis |
| **Testing** | Provider preflight, harness dry-run, 70-row confirm run, strict packet validation |

### Overview
Packet 113/007 will add a confirm-only harness that dispatches 113/003 variants against 113/002 fixtures on two model routes. The harness will reuse 113/005 extraction and 113/003 scoring so the final analysis can decide whether held findings from packet 113/006 should propagate cross-CLI.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] DeepSeek direct route confirmed through cli-opencode
- [ ] opencode-go Kimi route confirmed through cli-opencode
- [ ] Fixture, variant, scoring, and extraction paths confirmed

### Definition of Done
- [ ] `scripts/cross-model-confirm.cjs` exists and is packet-local
- [ ] 70 dispatch rows are complete or explicitly accounted for
- [ ] Decision-gate analysis is written with result evidence
- [ ] Packet 113/007 implementation summary is updated from planning state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Confirm-only evaluation harness

### Key Components
- **Fixture source**: `.opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/002-eval-rig/fixtures`
- **Variant source**: `.opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/003-eval-loop/variants`
- **Dispatch surface**: cli-opencode for both `deepseek/deepseek-v4-pro --variant high` and `opencode-go/kimi-k2.6 --variant high`
- **Extraction**: `extract()` from `.opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/005-extraction-rerun/scripts/extract-files-from-markdown.cjs`
- **Scoring**: `scoreVariantFixture()` from `.opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/003-eval-loop/scripts/score-variant.cjs`

### Data Flow
The harness renders each variant and fixture prompt, dispatches it through cli-opencode for each target model, writes raw output, extracts file changes into a fixture workspace, scores the result, and appends a structured result row. The analysis compares selected variants across both models after the matrix completes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a planned validation packet, not a bug fix. The affected surfaces are packet-local harness code and packet-local result artifacts.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packet 113/007 scripts | No harness exists yet | Create `cross-model-confirm.cjs` | Node syntax check and dry-run |
| Packet 114 fixtures | Existing SWE 1.6 task set | Read-only reuse | Confirm 7 fixture ids |
| Packet 114 variants | Existing 5 prompt variants | Read-only reuse | Confirm 5 variant ids |
| Packet 113/005 extraction | Converts markdown output to fixture files | Reuse `extract()` | Extraction status in result rows |
| Packet 114 scoring | Produces weighted variant score | Reuse `scoreVariantFixture()` | Score fields in result rows |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preflight
- [ ] Confirm cli-opencode route for `deepseek/deepseek-v4-pro --variant high`.
- [ ] Confirm cli-opencode route for `opencode-go/kimi-k2.6 --variant high`.
- [ ] Confirm grader access to claude-sonnet-4-5.
- [ ] Confirm fixture and variant inventory.

### Phase 2: Harness Build
- [ ] Create packet-local `scripts/cross-model-confirm.cjs`.
- [ ] Add tuple generation for 5 variants, 7 fixtures, and 2 models.
- [ ] Add resumable result logging.
- [ ] Reuse extraction and scoring modules.

### Phase 3: Run and Analyze
- [ ] Run one iteration per tuple for 70 total dispatches.
- [ ] Compare standard-bundle-gate against strict-bundle-gate on both models.
- [ ] Compare v-003-anti-hallucination-strong against v-004-rcaf-medium on both models.
- [ ] Write final propagation recommendation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Harness parses and imports dependencies | `node --check` |
| Preflight | Both model routes dispatch through cli-opencode | Minimal prompt dispatch |
| Dry run | Tuple generation and state paths | Harness dry-run mode |
| Confirm run | 70 model, variant, fixture tuples | Packet harness |
| Analysis | Decision gates over result matrix | Manual review plus script summary if added |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-opencode | Internal skill surface | Planned | No shared dispatch surface for both model routes |
| deepseek/deepseek-v4-pro | External provider route | Unverified | DeepSeek confirmation rows cannot run |
| opencode-go/kimi-k2.6 | External gateway route | Unverified | Kimi confirmation rows cannot run |
| claude-sonnet-4-5 grader | External grader | Planned | Scores lose parity with 113/003 |
| 113/002 fixtures | Internal evidence | Available | Matrix cannot match SWE 1.6 baseline |
| 113/003 variants and scoring | Internal evidence | Available | Variant comparisons cannot match prior run |
| 113/005 extraction | Internal evidence | Available | D1 acceptance extraction is weaker or duplicated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Harness design proves invalid, provider routes cannot run, or result rows are contaminated by dispatch defects.
- **Procedure**: Revert packet-local harness, state, and analysis files; leave packet 113/006 unchanged and keep held findings unpropagated.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Preflight -> Harness build -> 70-row run -> Decision analysis -> Propagation recommendation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preflight | Provider and grader access | Harness run |
| Harness build | Fixture, variant, scoring, extraction paths | Confirm matrix |
| Confirm matrix | Harness build and provider routes | Analysis |
| Analysis | Complete or accounted result rows | Cross-CLI propagation recommendation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preflight | Medium | 15-30 minutes |
| Harness build | Medium | 1-2 hours |
| Confirm run | High | 60-120 minutes wall-clock |
| Analysis | Medium | 30-60 minutes |
| **Total** | | **About 3-5 hours including run time** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No skill-body changes included
- [ ] Harness writes only under packet 113/007
- [ ] Provider costs understood before full run

### Rollback Procedure
1. Stop the harness if provider output or scoring shape is invalid.
2. Preserve raw state for diagnosis if it helps explain the failure.
3. Revert packet-local harness and analysis files if the design is discarded.
4. Keep packet 113/006 held findings unpropagated.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete or revert packet-local state files only
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
113/002 fixtures ─────┐
113/003 variants ─────┤
113/003 scoring ──────┼──> cross-model-confirm.cjs ──> result matrix ──> decision analysis
113/005 extraction ───────┤
cli-opencode routes ──┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Route preflight | cli-opencode and providers | Route readiness | Full dispatch |
| Harness | Prior packet assets and routes | Result rows | Analysis |
| Extraction and scoring | 113/005 and 113/003 modules | D1 and weighted scores | Decision gates |
| Analysis | Complete result matrix | Propagation recommendation | Any cross-CLI update |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Provider route preflight** - 15-30 minutes - CRITICAL
2. **Harness build and dry run** - 1-2 hours - CRITICAL
3. **70-dispatch confirm run** - 60-120 minutes - CRITICAL
4. **Decision-gate analysis** - 30-60 minutes - CRITICAL

**Total Critical Path**: About 3-5 hours including model latency

**Parallel Opportunities**:
- Fixture and variant inventory can happen while provider credentials are checked.
- Analysis template can be prepared before the matrix completes, but conclusions require result rows.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Route preflight complete | Both model routes answer through cli-opencode | Before harness run |
| M2 | Harness built | Script generates 70 tuples and writes resumable state | Implementation phase |
| M3 | Matrix complete | 70 rows scored or explicitly accounted for | Run phase |
| M4 | Recommendation written | Decision gates produce propagation outcome | Analysis phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use cli-opencode for Both Model Routes

**Status**: Accepted

**Context**: The validation run needs to compare model behavior while holding dispatch surface constant.

**Decision**: Use cli-opencode for both `deepseek/deepseek-v4-pro --variant high` and `opencode-go/kimi-k2.6 --variant high`.

**Consequences**:
- Wrapper behavior stays constant across both model routes.
- The run depends on cli-opencode route health before the matrix starts.

**Alternatives Rejected**:
- Separate CLI skills per model: rejected because wrapper differences would contaminate the model comparison.
