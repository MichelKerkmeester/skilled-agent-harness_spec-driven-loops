---
title: "Spec: sk-ai-council Shared Runtime Deliberation"
description: "AI Council deliberation packet evaluating whether sk-ai-council should be extracted from a per-skill helper into a shared runtime similar to deep-loop-runtime. Planning-only; no skill or source-code changes are made in this packet."
trigger_phrases:
  - "sk-ai-council shared runtime deliberation"
  - "ai-council runtime extraction"
  - "council runtime hybrid"
  - "124 sk-ai-council council"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/007-shared-runtime-deliberation"
    last_updated_at: "2026-05-23T05:04:55Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded and authored 4-seat AI Council deliberation."
    next_safe_action: "Use the HYBRID decision criteria before opening any implementation packet."
    blockers: []
    key_files:
      - "ai-council/council-report.md"
      - "ai-council/seats/round-001/seat-04-adjudicator.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1241241241241241241241241241241241241241241241241241241241240001"
      session_id: "116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The council recommends HYBRID: extract only low-level reusable primitives when trigger criteria are met; keep orchestration and packet artifact authorship in sk-ai-council."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Spec: sk-ai-council Shared Runtime Deliberation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet records a four-seat AI Council deliberation on whether `sk-ai-council` should become a shared runtime similar to `deep-loop-runtime`. The ruling is **HYBRID**: do not extract the whole council skill now; extract only reusable state, scoped-write, and convergence primitives if consumer growth or duplicate-runtime pressure appears.

**Key Decisions**: keep council orchestration and seat authoring in `sk-ai-council`; define a future low-level `ai-council-runtime/` extraction path with explicit trigger criteria.

**Critical Dependencies**: `sk-ai-council` artifact contract, `deep-loop-runtime` precedent, packet-local `ai-council/**` source-of-truth rule, and strict spec validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Packet Type** | Planning-only deliberation |
| **Precedent** | `116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-ai-council` already contains runtime-like helpers for artifact persistence, append-only JSONL state, graph replay, and convergence guidance. The open question is whether those helpers should remain embedded in the council skill or move to a shared runtime sibling, especially now that `deep-loop-runtime` exists as a precedent for isolating reusable loop infrastructure.

### Purpose

Run a formal four-seat council that tests full extraction, status quo, and hybrid extraction against current consumers, concrete file surfaces, deep-loop-runtime precedent, costs, and re-deliberation triggers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scaffold Level 3 spec docs for the deliberation packet.
- Create packet-local `ai-council/**` artifacts with config, state, strategy, four seat files, deliberation summary, logs marker, and final report.
- Cite concrete `sk-ai-council`, `deep-loop-runtime`, and memory-leak/lifecycle precedent surfaces with file:line evidence.
- Produce a final recommendation, convergence record, ADRs, implementation sketch, risks, and commit handoff.

### Out of Scope

- Modifying `sk-ai-council` source, docs, scripts, or graph tooling.
- Modifying `deep-loop-runtime` or `system-spec-kit` MCP sidecar code.
- Touching arc 010 or any parallel Devin work.
- Dispatching external CLI agents or claiming external seats actually ran.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation/*.md` | Create/Update | Level 3 packet docs and decision records |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation/description.json` | Update | Standard packet description metadata |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation/graph-metadata.json` | Update | Standard packet graph metadata |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation/ai-council/**` | Create | Council config, state, strategy, seats, deliberation summary, final report, and log marker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a recommendation across four council seats with a convergence signal. | Four seat files exist under `ai-council/seats/round-001/`; `council-report.md` records verdict, convergence, dissent, and recommendation. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Cite concrete extraction surfaces and impact analysis. | Seat files and report cite `sk-ai-council`, `deep-loop-runtime`, council graph, and memory-leak lifecycle evidence with file:line references. |
| REQ-003 | Preserve planning-only boundaries. | No source code or skill source files are modified; only this packet and packet-local council artifacts are created. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ai-council/council-report.md` states an explicit verdict and decision criteria.
- **SC-002**: all four seat files are authored at 300-600 words with evidence-cited claims.
- **SC-003**: `decision-record.md` contains 3-5 ADRs derived from the council.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-extracting a one-consumer council skill | Creates a runtime nobody needs and adds parity-test burden | HYBRID ruling requires trigger criteria before implementation |
| Risk | Under-extracting state safety primitives | Duplicate append-only state or scoped-write helpers could drift across council surfaces | Permit primitive-only extraction when duplicate consumers appear |
| Risk | Breaking existing packet artifacts | Historical `ai-council/**` packet trees are source-of-truth | Keep orchestration and artifact schema compatible; use parity tests for any future extraction |
| Dependency | `sk-ai-council` current artifact contract | Required for report shape and state semantics | Cite `references/output_schema.md`, `references/folder_layout.md`, and `references/state_format.md` |
| Dependency | `deep-loop-runtime` precedent | Required for extraction comparison | Cite runtime modules, scripts, storage, and lifecycle ADRs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Council report must preserve dissent when no 2-of-3 advocate majority exists.

### Maintainability
- **NFR-M01**: Any implementation sketch must name concrete files, parity-test targets, and rollback boundaries.

### Auditability
- **NFR-A01**: Seat claims must cite file:line evidence, not generic references.

---

## 8. EDGE CASES

### Convergence Outcomes
- 2-of-3 advocate convergence plus adjudicator agreement: report converged majority.
- No advocate majority: report explicit dissent and let the adjudicator issue a ruling.
- Adjudicator rejects all advocates: report no convergence and define re-run criteria.

### Implementation Outcomes
- If only one active consumer exists, do not extract.
- If three or more active consumers depend on the same state/writer/convergence helpers, re-deliberate or open a hybrid extraction packet.
- If a safety incident appears in `ai-council-state.jsonl` writes, extract state primitives even with low consumer count.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | One planning packet, no source-code changes |
| Risk | 15/25 | Wrong recommendation could drive a costly runtime extraction |
| Research | 18/20 | Requires line-cited comparison across `sk-ai-council`, `deep-loop-runtime`, 117, 118, and memory-leak arc evidence |
| Multi-Agent | 13/15 | Four-seat council with dissent and adjudication |
| Coordination | 10/15 | Must avoid parallel arc 010 and source-code mutation |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Full runtime extraction breaks existing council packets or helper callers | H | M | Defer full extraction; require fixture parity before any move |
| R-002 | HYBRID recommendation is too vague to act on | M | M | ADR-001 names exact primitive surfaces and trigger thresholds |
| R-003 | Council graph MCP ownership is mistaken for council runtime ownership | M | M | Report separates packet artifacts, derived graph, and MCP-hosted graph tools |
| R-004 | Future implementer treats this packet as authorization to edit skills | H | L | Out-of-scope section and ADR-004 prohibit source changes in this packet |

---

## 11. USER STORIES

### US-001: Evidence-Based Runtime Decision (Priority: P0)

**As a** skilled-agent-orchestration maintainer, **I want** a line-cited council ruling on whether `sk-ai-council` should become a shared runtime, **so that** future extraction work starts from documented criteria instead of intuition.

**Acceptance Criteria**:
1. Given the council packet, When a maintainer reads `ai-council/council-report.md`, Then they can identify the verdict, convergence state, dissent, trigger criteria, and implementation sketch.

### US-002: Reusable Extraction Boundary (Priority: P1)

**As a** future implementer, **I want** the council to separate primitive extraction from full orchestration extraction, **so that** a follow-on packet can move only the surfaces that have earned runtime status.

**Acceptance Criteria**:
1. Given a follow-on extraction proposal, When it is compared against ADR-001, Then it must satisfy consumer-count, safety-incident, or duplication criteria before moving code.

---

## 12. OPEN QUESTIONS

- None for this packet. Follow-on implementation requires a new spec folder and a fresh source-read pass.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Council Strategy**: See `ai-council/ai-council-strategy.md`
- **Council Report**: See `ai-council/council-report.md`
