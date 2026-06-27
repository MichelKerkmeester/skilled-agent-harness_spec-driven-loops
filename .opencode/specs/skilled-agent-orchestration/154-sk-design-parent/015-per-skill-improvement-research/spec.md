---
title: "Feature Specification: sk-design per-skill improvement research across the five design modes"
description: "Executed Level-3 research phase: ran five parallel GPT-5.5-xhigh deep-research lineages, one per design mode, investigating how to improve each mode's efficiency, usefulness, UX, and tooling. All five converged. The synthesis finds the design knowledge already landed and the leverage is now plumbing: router precision, the shared-register loading contract, handoff cards, and benchmark fixtures. Research deliverables only, no live skill changes."
trigger_phrases:
  - "sk-design per-skill improvement research"
  - "design mode improvement synthesis"
  - "shared register loading contract"
  - "design router precision research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the Level-3 doc set over the five converged research lineages"
    next_safe_action: "Research synthesis captured pending commit, plumbing fixes route to future build phases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-015-per-skill-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frontier is plumbing, not design theory: phases 009 and 012 already landed the design knowledge, so the leverage is router precision, resource-loading correctness, handoff cards, and benchmark fixtures"
      - "The shared-register loading contract is the highest-leverage family fix: one shared loader fix repairs motion, audit, and partly interface at once"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: sk-design per-skill improvement research across the five design modes

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase ran five parallel GPT-5.5-xhigh deep-research lineages, one per sk-design mode (interface, foundations, motion, audit, md-generator), each investigating how to improve that mode's efficiency, usefulness, UX, and tooling. All five converged. The synthesis finds the design knowledge already landed in phases 009 and 012, so the leverage now is plumbing rather than more design theory: router precision, resource-loading correctness, handoff cards, and benchmark fixtures.

**Key Decisions**: Prioritize plumbing over more design theory (ADR-001), and treat the shared-register loading contract as the single highest-leverage family fix (ADR-002).

**Critical Dependencies**: The five converged `research.md` lineage deliverables, and the `../014-routing-benchmark` evidence that several lineages cross-referenced.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../014-routing-benchmark/spec.md |
| **Successor** | None (final research phase) |
| **Handoff Criteria** | The five per-mode research deliverables (`00N-<mode>/research/lineages/gpt55fast/research.md` for interface, foundations, motion, audit, and md-generator) exist and each lineage converged, the cross-mode synthesis is recorded in `implementation-summary.md`, and the binding decisions (plumbing over theory, the shared-register loader as the highest-leverage fix, and the do-not list) are captured in `decision-record.md`. No live sk-design skill content was changed by this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design family reached a strong content baseline. Phases 009 and 012 landed the major per-mode references and assets: the shared Brand-vs-Product register, the interface preflight and author-once gates, foundations data-viz and tokens, the motion restraint gate and cards, and the audit evidence and hardening depth. What was missing was a clear, evidence-backed view of what to improve next per mode. Without that, the family risked drifting toward more design theory it does not need, while real operational defects (routers that do not load what their prose mandates, missing registry aliases, a missing backend manifest, no checked-in benchmark fixtures) stayed undiagnosed. The improvement question had to be answered per mode and then reconciled across the family.

### Purpose
Run five parallel GPT-5.5-xhigh deep-research lineages, one per design mode, each investigating how to improve that mode's efficiency, usefulness, UX, and tooling, then synthesize the findings across the family. Each lineage ran ten iterations and converged. The deliverables are the five `research.md` files. This phase records the synthesis and the binding decisions it produced, the most important being that the leverage is now plumbing rather than design theory and that the shared-register loading contract is the single highest-leverage family fix. This is a research phase, so it changes no live sk-design skill content.

> **Phase note:** The five per-mode research lineages are the deliverables. They are preserved as written and referenced by path. This spec, the plan, the tasks, the implementation summary, and the decision record are the authored wrapper that makes the research a validated, searchable spec folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five per-mode deep-research deliverables `00N-<mode>/research/lineages/gpt55fast/research.md` for interface, foundations, motion, audit, and md-generator, preserved as written and referenced by path.
- The cross-mode synthesis recorded in `implementation-summary.md`: the plumbing-over-theory meta-finding, the shared-register loader as the highest-leverage family fix, the router and registry wiring gaps, the missing benchmark fixtures, the recurring sk-code handoff card, the one real md-generator bug, and the unanimous do-not list.
- The binding decisions captured in `decision-record.md`.

### Out of Scope
- Any edit to the live sk-design hub, the five mode packets, their references, assets, routers, registry, or the md-generator backend. This phase produces research and records decisions, it does not act on them.
- Building any of the named plumbing fixes (the shared-register loader, the registry aliases, the handoff schema, the benchmark fixtures, the md-generator backend manifest). Each routes to a future build phase.
- Rewriting or relocating the five `research.md` deliverables or their orchestration logs. They are preserved as written.

### Inputs (read-only)
- The five lineage deliverables and their orchestration artifacts under `00N-<mode>/research/`.
- The 014 routing benchmark evidence in `../014-routing-benchmark`, which several lineages cross-referenced.
- The prior 009 and 012 phase records, which the lineages used to confirm what design content already landed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Created | This Level-3 research specification, recording purpose, scope, and the synthesis reference |
| `plan.md` | Created | The research execution plan: five parallel lineages, ten iterations each, convergence, synthesis |
| `tasks.md` | Created | The task list for running the lineages and producing the synthesis |
| `implementation-summary.md` | Created | The synthesis: the cross-mode findings, the highest-leverage fixes, and the do-not list |
| `decision-record.md` | Created | The binding decisions: plumbing over theory, the shared-register loader, the family handoff schema, and the do-not list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The five per-mode research deliverables exist and converged | Each of `001-interface/`, `002-foundations/`, `003-motion/`, `004-audit/`, and `005-md-generator/` holds `research/lineages/gpt55fast/research.md`, and each lineage records a converged stop reason |
| REQ-002 | The cross-mode synthesis is recorded | `implementation-summary.md` records the plumbing-over-theory meta-finding, the shared-register loader as the highest-leverage fix, the wiring gaps, the missing fixtures, the recurring handoff card, the md-generator backend bug, and the do-not list |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The binding decisions are captured | `decision-record.md` records the decision to prioritize plumbing over theory, the shared-register loading contract as the family fix, the single handoff schema, and the unanimous do-not list, each with rationale |
| REQ-004 | Each synthesized fix is traced to its source lineage by path | `implementation-summary.md` and `spec.md` reference the five `research.md` files by path so each family-level finding traces back to its per-mode evidence |
| REQ-005 | The research deliverables are preserved unchanged | The five `research.md` files and their orchestration logs are not rewritten or relocated, only referenced |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five parallel GPT-5.5-xhigh deep-research lineages ran, one per design mode, ten iterations each, and all five converged, with the `research.md` deliverables preserved and referenced by path.
- **SC-002**: The cross-mode synthesis and the binding decisions are recorded in `implementation-summary.md` and `decision-record.md`, naming the shared-register loading contract as the highest-leverage family fix and routing every named plumbing fix to a future build phase without changing live sk-design content here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The research is read as a mandate to add more design references | The family bloats with theory it does not need | Record the meta-finding that the design knowledge already landed and the leverage is plumbing, and keep the do-not list explicit |
| Risk | The shared-register loader fix is treated as five separate per-mode fixes | Duplicated effort and inconsistent loaders | Record that one shared loader fix repairs motion, audit, and partly interface at once, so it is a single family fix |
| Risk | The five lineage deliverables are edited to fit the wrapper docs | The primary evidence is contaminated | Preserve the `research.md` files as written and reference them by path only |
| Risk | The md-generator backend bug is deferred indefinitely | The documented setup stays broken | Record it as a real bug to patch first, separate from the larger plumbing program |
| Dependency | The five `research.md` lineage deliverables | The synthesis has no evidence | Confirm each lineage converged and is present before recording the synthesis |
| Dependency | `../014-routing-benchmark` | The routing findings lose their measured backing | Cross-reference the benchmark evidence that several lineages used and that confirms the missing-fixtures finding |
| Dependency | GPT-5.5-xhigh deep-research executor over opencode | The lineages cannot be reproduced | Record the executor, lineage, and convergence in each deliverable and orchestration log |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The synthesis must not slow the live family. This is a research phase, so it adds zero runtime cost to any mode router until a build phase acts on it.
- **NFR-P02**: The recommended shared-register loader, when built, must keep the existing per-task resource budget. One added parent pre-load of the register, not a broad fan-out.

### Security
- **NFR-S01**: The recommended loader fix must preserve the packet-local path-guard posture. The shared-register allowlist must be scoped to the explicit register path, never a general guard bypass.

### Reliability
- **NFR-R01**: The five `research.md` deliverables are the source of truth for the synthesis and stay byte-unchanged, so the recorded findings remain traceable to the converged lineages.

---

## 8. EDGE CASES

### Data Boundaries
- **A mode whose router already matches its prose**: foundations and md-generator carry missing aliases rather than the loader defect, so the shared-register fix does not apply uniformly. Each mode's fix set is recorded per lineage.
- **A lineage that converged early**: motion and others converged before the ten-iteration cap. Early convergence is a stop reason, not an incomplete run, and the deliverable is still authoritative.

### Error Scenarios
- **A local checkout missing the benchmark artifact**: several lineages reported the expected `014-routing-benchmark/<mode>` artifact absent in their own checkout and treated the operator-supplied score as context. The 014 run resolves this going forward.
- **The synthesis conflicts with a single lineage**: where one mode diverges from the family pattern, the per-mode `research.md` governs that mode and the synthesis records the exception rather than flattening it.

### State Transitions
- **Research to build**: every named fix routes forward to a build phase. No fix is applied in this phase, so the live family state is unchanged until a build phase runs.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Five parallel lineages across five modes, synthesis plus decision record, no code change |
| Risk | 12/25 | Research only, reversible, the risk is misreading the evidence not breaking the family |
| Research | 18/20 | Heavy, five converged deep-research lineages investigating efficiency, usefulness, UX, and tooling per mode |
| Multi-Agent | 9/15 | Five parallel research lineages, one synthesis owner |
| Coordination | 9/15 | Cross-mode reconciliation, cross-checked against the 014 benchmark |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The research is read as a mandate to add more design references | M | M | Record the plumbing-over-theory meta-finding and keep the do-not list explicit |
| R-002 | The shared-register loader is built as five separate per-mode patches | M | M | Record it as one shared family fix that repairs motion, audit, and partly interface at once |
| R-003 | The five lineage deliverables are edited to fit the wrapper docs | H | L | Preserve the `research.md` files as written and reference them by path only |
| R-004 | The md-generator backend bug is deferred indefinitely | M | M | Record it as a real bug to patch first, separate from the larger plumbing program |
| R-005 | The named fixes never reach a build phase | M | M | Route each fix forward explicitly with its owning future phase |

---

## 11. USER STORIES

### US-001: Know what to improve next per mode (Priority: P0)

**As a** sk-design family maintainer, **I want** an evidence-backed view of the highest-leverage improvement per mode, **so that** future effort targets real defects instead of adding theory the family does not need.

**Acceptance Criteria**:
1. Given the five converged lineages, When the synthesis is read, Then each mode has its prioritized improvements traced to its `research.md` deliverable.

### US-002: Fix the shared defect once (Priority: P0)

**As a** maintainer planning the next build phase, **I want** the shared-register loading contract named as one family fix, **so that** I repair motion, audit, and partly interface with a single change rather than three.

**Acceptance Criteria**:
1. Given the synthesis, When I plan the loader fix, Then it is recorded as a single shared-layer fix with an allowlisted parent pre-load, not per-mode patches.

### US-003: Patch the real bug first (Priority: P1)

**As a** maintainer, **I want** the md-generator missing `backend/package.json` flagged as a concrete bug, **so that** the documented setup works before the larger plumbing program begins.

**Acceptance Criteria**:
1. Given the synthesis, When I triage, Then the missing manifest is recorded as a patch-first bug separate from the plumbing program.

---

## 12. OPEN QUESTIONS

- The shared-register loading contract is the named highest-leverage fix. The exact loader shape (a parent-shared pre-load with an explicit allowlist versus a packet-local guard relaxation) is a build-phase decision, informed by the motion and audit lineages.
- The single sk-code handoff schema recurs in four of five modes. Which fields it standardizes (intent, stack boundary, accepted findings, mechanism) is a build-phase decision.
- The benchmark fixture seeding under `014-routing-benchmark/<mode>` is the first such evidence. How far to extend scenario coverage per mode is a future benchmark-program question, not this research phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Per-mode deliverables**: `001-interface/research/lineages/gpt55fast/research.md`, `002-foundations/research/lineages/gpt55fast/research.md`, `003-motion/research/lineages/gpt55fast/research.md`, `004-audit/research/lineages/gpt55fast/research.md`, `005-md-generator/research/lineages/gpt55fast/research.md`
- **Synthesis**: See `implementation-summary.md`
- **Decisions**: See `decision-record.md`
- **Benchmark evidence**: See `../014-routing-benchmark/implementation-summary.md`

<!--
LEVEL 3 ADDENDUM
- decision-record.md carries the binding architectural decisions
- The five research.md deliverables are the primary evidence, preserved and referenced
-->
