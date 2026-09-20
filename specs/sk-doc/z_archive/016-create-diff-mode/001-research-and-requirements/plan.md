---
title: "Implementation Plan: Document Diff Research and Requirements"
description: "Prepare and run a bounded deep-research program that selects the architecture and v1 boundaries for a portable local document diff skill."
trigger_phrases:
  - "document diff research plan"
  - "document comparison architecture"
  - "deep research document diff"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode/001-research-and-requirements"
    last_updated_at: "2026-07-13T12:36:36Z"
    last_updated_by: "codex"
    recent_action: "Synthesized 30 research iterations"
    next_safe_action: "Resolve deep-loop state audit findings"
    blockers:
      - "Per-lineage deltas and canonical route-proof fields are missing from the command-owned state."
    key_files:
      - "spec.md"
      - "tasks.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-research-preparation"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Which supported workflow recovery repairs the incomplete mechanical state without hand-editing it?"
    answered_questions:
      - "Run research through the deep-research command workflow only."
---

# Implementation Plan: Document Diff Research and Requirements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `system-deep-loop` research mode |
| **Target** | Local create-diff core plus one standalone OpenCode skill |
| **Research State** | 30 command-owned iterations and a canonical synthesis exist; the delta/route-proof audit remains open |
| **Primary Output** | `research/research.md` |
| **Validation** | Spec Kit strict child and recursive parent validation |

### Overview

Prepare an evidence-backed research loop around five questions: format normalization, diff semantics, snapshot lifecycle, secure HTML review, and portable packaging. The loop must synthesize a decision-ready v1 recommendation without implementing the tool.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The user choices and problem statement are explicit in `spec.md`.
- [x] Primary questions, non-goals, and stop conditions are bounded.
- [x] The child has a Level 3 contract and a resource map.
- [x] Strict child and recursive parent validation pass after metadata refresh.
- [x] No pre-existing `research/` state conflicts with a new run.

### Definition of Research Complete

- [ ] The command-owned loop reaches a legal stop and passes its mechanical state checks. [BLOCKED: all lineages reached `maxIterationsReached`, but required deltas and route-proof fields are absent.]
- [x] Findings cite authoritative sources and preserve eliminated alternatives. [EVIDENCE: `research/research.md` includes inline sources, an evidence matrix, and eliminated alternatives.]
- [x] Every target format receives a capability tier and fidelity policy. [EVIDENCE: `research/research.md` §3.]
- [x] One v1 architecture and a testable public interface are recommended. [EVIDENCE: `research/research.md` §§2, 4-6, and 11.]
- [ ] Later phases are proposed from evidence and synchronized into the parent only after review.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Command-owned iterative research with externalized state and a portable-core target architecture.

### Research Workstreams

- **Format and canonical-model evidence**: extraction fidelity, structural constructs, OCR and visual limits.
- **Diff and report evidence**: algorithms, move detection, noise controls, HTML accessibility, and security.
- **Snapshot and packaging evidence**: filesystem lifecycle, runtime, CLI/library contract, skill triggers, dependencies, and portability.
- **Verification evidence**: fixtures, performance tiers, adversarial inputs, licenses, and maintenance health.

### Data Flow

The user starts `/deep:research:auto` with this child as `--spec-folder`. The workflow initializes local state from the charter and resource map, dispatches one leaf iteration per focus, reduces evidence into machine-owned state, converges, and synthesizes `research/research.md`. It may then replace one bounded generated findings fence in `spec.md`; implementation remains a separate later workflow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase packet | Research charter and handoff | Author and validate | Strict child validation |
| Phase parent | Coordination and phase map | Keep one research child active | Recursive strict validation |
| Deep-research workflow | State owner | Preserve the 3 × 10 fan-out and audit its mechanical artifacts | Verify iteration, JSONL, delta, and route-proof contracts |
| Future portable core | Research target only | No files created | Worktree path check |
| Future standalone skill | Research target only | No files created | Worktree path check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold the phased packet and Level 3 child from contract-backed templates.
- [x] Capture product choices, questions, non-goals, stop conditions, and local references.
- [x] Refresh metadata and pass readiness validation.

### Phase 2: Implementation

- [x] Start a new command-owned `/deep:research:auto` run against this child. [EVIDENCE: `research/orchestration-summary.json` records three successful fan-out lineages.]
- [x] Let each leaf iteration investigate one focus and externalize cited findings. [EVIDENCE: each lineage contains ten iteration narratives and ten iteration records.]
- [x] Let the workflow reducer own strategy, registry, dashboard, and synthesis state. [EVIDENCE: reducer-owned artifacts and the merged registry exist; the separate delta/route-proof defect remains blocked in Phase 3.]

### Phase 3: Verification

- [ ] Confirm legal stop and mechanical state guards. [BLOCKED: delta files and canonical route-proof fields are missing.]
- [x] Review the canonical synthesis, format tiers, architecture recommendation, risks, and eliminated alternatives. [EVIDENCE: post-synthesis primary-source corrections are reflected in `research/research.md`.]
- [ ] Revalidate the child after bounded `spec.md` write-back and add evidence-backed later phases to the parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Structural | Required packet files, anchors, metadata, and phase links | `validate.sh --strict` and recursive strict validation |
| State readiness | New run has no conflicting config, JSONL, strategy, or lock | Read-only `research/` path inspection |
| Source quality | Diverse authoritative citations and no weak single-source conclusion | Deep-research quality guards and synthesis references |
| Capability matrix | Text, Markdown, HTML, DOCX, PDF, and scanned cases | Research-generated support table with fidelity notes |
| Algorithm behavior | Adds, deletes, replacements, moves, structure, normalization noise | Proposed fixture corpus with expected outcomes |
| Security | Malformed input, active content, traversal, unsafe output, resource exhaustion | Proposed adversarial fixtures and isolation controls |
| Accessibility | Keyboard flow, semantics, contrast, no-external-assets behavior | Proposed manual and automated HTML checks |
| Performance | Small, medium, large, repeated-block, and image-heavy documents | Proposed benchmark thresholds and measurements |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec Kit packet contract | Internal | Available | Readiness cannot be claimed without strict validation |
| Deep-research command workflow | Internal | Degraded | Synthesis exists, but missing deltas and route proof prevent clean workflow closure |
| Spec memory daemon | Internal | Degraded | Continue from canonical files; save/index visibility may lag until the daemon recovers |
| Upstream parser and diff documentation | External | To research | Runtime and format recommendations remain unknown |
| Representative documents | External/local | To define | Fidelity and performance claims cannot be validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet scope proves wrong, validation cannot be satisfied without changing the approved contract, or research initialization detects conflicting state.
- **Procedure**: Before research starts, remove only this newly created packet. After research starts, preserve or archive command-owned state and use the workflow's restart or recovery branch instead of deleting individual state files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Validated charter -> command-owned research -> synthesis review -> later-phase planning
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet preparation | Approved product direction and templates | Research initialization |
| Deep research | Validated charter and no conflicting state | Architecture selection |
| Synthesis review | Legal stop and canonical synthesis | Later-phase decomposition |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Bound |
|-------|------------|-------|
| Packet preparation | Medium | One authoring and validation pass |
| Deep research | High | Default 10 iterations unless legal convergence occurs earlier |
| Synthesis review | Medium | One decision and phase-decomposition pass |
| Implementation | Unknown | Must be estimated from research, not guessed here |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Before Research

1. Confirm the target child and absence of command-owned state.
2. Start through the command workflow so it owns the lock, config, JSONL, and cleanup.
3. Cancel through the workflow if initialization finds a conflict.

### State Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Use the deep-research lifecycle's supported restart/archive behavior after initialization; never rewrite append-only JSONL or iteration artifacts manually.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
User decisions
    -> Level 3 charter + resource map
        -> strict readiness validation
            -> deep-research state and iterations
                -> canonical synthesis
                    -> v1 architecture and later phases
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Charter | Approved decisions | Questions and boundaries | Research initialization |
| Research loop | Charter and command workflow | Cited findings and convergence state | Synthesis |
| Synthesis | Iterations and reducer state | Recommendation and eliminated alternatives | Implementation planning |
| Later-phase map | Reviewed synthesis | Executable child phases | Product implementation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Pass packet readiness gates** - required before research.
2. **Run the command-owned loop to a legal stop** - required before architecture selection.
3. **Review and accept the synthesis** - required before adding implementation phases.

**Parallel Opportunities**: Within the loop, independent evidence focuses may use supported multi-lineage execution only when the command workflow configures it. No ad hoc fan-out belongs in this packet preparation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Research-ready packet | Strict child and recursive parent validation pass | Current preparation |
| M2 | Converged evidence | Canonical synthesis and convergence report exist | Deep-research run |
| M3 | Decision-ready v1 | Architecture, support tiers, tests, risks, and later phases are accepted | Post-research planning |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The accepted starting direction is documented in `decision-record.md`. Library, runtime, canonical-model, and exact interface decisions remain proposed until research supplies evidence.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the explicit child is the active research target.
- Confirm strict readiness validation passes and no command-owned research state exists.
- Load the deep-research command contract before initializing any research artifact.
- Keep product implementation outside this phase.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Workflow ownership | Start and continue research only through the deep-research command workflow. |
| Scope control | Investigate only the chartered questions, formats, risks, and decision boundaries. |
| State integrity | Let the workflow own its JSONL, strategy, dashboard, registry, iteration, delta, and synthesis artifacts. |
| Evidence quality | Support conclusions with cited authoritative sources and preserve meaningful negative findings. |

### Status Reporting Format

Report the current loop state, covered questions, unresolved evidence gaps, legal stop status, and next command-owned action. Separate confirmed findings from proposed conclusions.

### Blocked Task Protocol

If the workflow detects conflicting state, a charter contradiction, unavailable mandatory evidence, or an illegal lifecycle transition, stop the research run and record the blocker through the workflow's supported state path. Do not hand-edit append-only state or substitute an ad hoc research process.
