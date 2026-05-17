---
title: "Feature Specification: cross-model-validation"
description: "Plans a cross-model confirmation harness for the 113/003 eval-loop findings that packet 113/006 deliberately held back. The harness is not implemented yet; this packet records the intended dispatch matrix, scoring reuse, and decision gates."
trigger_phrases:
  - "113/007 cross model validation"
  - "deepseek kimi validation harness"
  - "bundle gate aversion confirmation"
  - "framework anti hallucination validation"
  - "cross model confirm cjs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation"
    last_updated_at: "2026-05-17T12:18:35Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-planned-cross-model-validation"
    next_safe_action: "build-cross-model-confirm-harness"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation/scripts/cross-model-confirm.cjs"
      - ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/002-eval-rig/fixtures"
      - ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/003-eval-loop/variants"
      - ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/003-eval-loop/scripts/score-variant.cjs"
      - ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/005-extraction-rerun/scripts/extract-files-from-markdown.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality-arc/007-cross-model-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do both target model routes run cleanly from cli-opencode in the operator environment"
    answered_questions:
      - "Dispatch surface is cli-opencode for both target models"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: cross-model-validation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Packet 113/007 plans a 70-dispatch cross-model confirmation run for the 113/003 eval-loop findings that were not propagated in packet 113/006. It reuses the existing SWE 1.6 fixtures, prompt variants, scoring pipeline, and extraction logic while routing both target models through cli-opencode.

**Key Decisions**: use cli-opencode as the single dispatch surface; run one measurement per model, variant, and fixture tuple without hill-climbing

**Critical Dependencies**: DeepSeek direct API access for `deepseek/deepseek-v4-pro`, opencode-go access for `opencode-go/kimi-k2.6`, and grader access to claude-sonnet-4-5

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 113/003 eval-loop produced bundle-gate-aversion and framework-dominates-anti-hallucination signals on SWE 1.6. Those signals may be specific to a small coding-specialized model, so they should not become cross-CLI prompt guidance until frontier-style models confirm them.

### Purpose
Build and run a confirm-only cross-model harness that decides whether those two findings generalize to deepseek-v4-pro and kimi-k2.6.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build `.opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation/scripts/cross-model-confirm.cjs`.
- Reuse 113/002 SWE 1.6 fixtures and 113/003 variants.
- Dispatch 5 variants across 7 fixtures and 2 models for 70 total dispatches.
- Reuse `scoreVariantFixture()` from 113/003 and `extract()` from 113/005 for acceptance scoring.
- Analyze decision gates after the run completes.

### Out of Scope
- Hill-climbing, mutation loops, or new prompt variants.
- Cross-CLI propagation of bundle-gate or anti-hallucination guidance before analysis completes.
- Changes to skill bodies, prompt quality cards, changelogs, or provider configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation/scripts/cross-model-confirm.cjs` | Create | Planned confirm harness for 70 dispatches |
| `.opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation/state/confirm-results.jsonl` | Create | Planned result log written by the harness |
| `.opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation/analysis.md` | Create | Planned post-run decision analysis |
| `.opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/007-cross-model-validation/implementation-summary.md` | Update | Planned after harness and run complete |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dispatch via cli-opencode for both target models | Harness invokes `deepseek/deepseek-v4-pro --variant high` and `opencode-go/kimi-k2.6 --variant high` through cli-opencode |
| REQ-002 | Reuse existing fixtures and variants | Harness reads 7 fixtures from 113/002 and 5 variants from 113/003 |
| REQ-003 | Reuse existing scoring and extraction | Harness calls `scoreVariantFixture()` and 113/005 `extract()` rather than inventing a new scoring path |
| REQ-004 | Produce full measurement matrix | Results include 5 variants x 7 fixtures x 2 models = 70 dispatch rows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep the run confirm-only | One iteration per tuple; no mutation, hill-climbing, or variant rewriting |
| REQ-006 | Preserve grader comparability | Grader is claude-sonnet-4-5 to match the 113/003 baseline |
| REQ-007 | Apply explicit decision gates | Analysis compares standard vs strict bundle gate and anti-hallucination-strong vs RCAF-medium across both models |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The harness can run the full 70-dispatch matrix and write structured results.
- **SC-002**: Analysis decides whether bundle-gate-aversion generalizes beyond SWE 1.6.
- **SC-003**: Analysis decides whether framework-dominates-anti-hallucination generalizes beyond SWE 1.6.
- **SC-004**: Any cross-CLI propagation recommendation is evidence-backed by both target models.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek direct API route | DeepSeek rows cannot run | Fail the run visibly and keep propagation blocked |
| Dependency | opencode-go Kimi route | Kimi rows cannot run | Fail the run visibly and keep propagation blocked |
| Dependency | claude-sonnet-4-5 grader access | Scores cannot match 113/003 baseline | Do not substitute silently; document any grader change |
| Risk | Model latency or provider throttling | Wall-clock extends beyond 120 minutes | Resume from result log and keep one row per tuple |
| Risk | Extraction mismatch | D1 acceptance scoring becomes noisy | Reuse 113/005 extraction logic and log skipped blocks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Expected wall-clock is 60-120 minutes depending on provider latency.

### Security
- **NFR-S01**: Harness must not print API keys, provider credentials, or gateway secrets.

### Reliability
- **NFR-R01**: Results should be append-only or resumable so partial provider failures do not erase completed rows.

---

## 8. EDGE CASES

### Data Boundaries
- Missing fixture: fail before dispatching any incomplete matrix.
- Missing variant: fail before dispatching any incomplete matrix.
- Duplicate result row: keep tuple identity explicit as model, variant, fixture, and run id.

### Error Scenarios
- Provider timeout: record failure for the tuple and allow rerun/resume.
- Grader parse failure: preserve raw output and grader parse status for analysis.
- Extraction skip: record skipped blocks from `extract()` so D1 acceptance is explainable.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | New harness, result state, analysis docs |
| Risk | 16/25 | External providers, grader cost, long-running dispatches |
| Research | 18/20 | Cross-model validation and decision-gate analysis |
| Multi-Agent | 0/15 | No SpawnAgent; main-session execution only |
| Coordination | 12/15 | Reuses packets 113/002, 113/003, and 113/005 |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | One provider route fails | H | M | Keep propagation blocked and rerun missing tuples |
| R-002 | Grader differs from 113/003 baseline | M | L | Use claude-sonnet-4-5 or document a deliberate baseline break |
| R-003 | Single-run noise changes conclusions | M | M | Treat gates as confirmation only and cite raw row evidence |
| R-004 | Harness mutates variants accidentally | H | L | Read variants as fixtures; do not write back to 113/003 |

---

## 11. USER STORIES

### US-001: Validate Held Findings (Priority: P0)

**As a** CLI prompt maintainer, **I want** bundle-gate and anti-hallucination findings tested on two frontier-style routes, **so that** cross-CLI guidance is not based only on SWE 1.6 behavior.

**Acceptance Criteria**:
1. Given the completed run, When both target models agree standard bundle gate scores at least as high as strict bundle gate, Then bundle-gate-aversion can be propagated cross-CLI.

---

### US-002: Block Unsafe Propagation (Priority: P0)

**As a** release owner, **I want** a strict gate that blocks propagation when either frontier model prefers stricter constraints, **so that** CLI guidance does not regress larger-model performance.

**Acceptance Criteria**:
1. Given either target model scores strict bundle gate higher, When analysis runs, Then bundle-gate-aversion remains cli-devin-specific.

---

### US-003: Reuse Prior Scoring (Priority: P1)

**As a** validation operator, **I want** the same scoring and extraction path as prior packets, **so that** results remain comparable to 113/003 and 113/005.

**Acceptance Criteria**:
1. Given a model output, When the harness scores it, Then `extract()` prepares fixture files and `scoreVariantFixture()` produces the weighted result.

---

## 12. OPEN QUESTIONS

- Do both configured provider routes work from the operator environment without additional credentials or gateway changes?
- Should failed tuples be retried automatically or recorded for manual rerun only?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
