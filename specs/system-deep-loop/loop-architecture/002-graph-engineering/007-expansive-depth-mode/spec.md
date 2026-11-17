---
title: "Feature Specification: Expansive-depth sub-mode for deep-research and deep-review"
description: "Deep-research and deep-review runs stop early and stay on the questions chosen at init, so broad targets such as a 100-commit sweep or a whole-skill audit come back shallow. This packet researches an additive, opt-in expansive-depth sub-mode that widens and deepens scope."
trigger_phrases:
  - "expansive depth mode"
  - "expansive depth sub mode for deep research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Expansive-depth sub-mode for deep-research and deep-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research and deep-review loops converge on the three to five questions seeded at init and stop once novelty drops, so a broad target such as "research the last 100 commits for bugs, drift and improvements" or "analyze system-skill-advisor for chat-time auto-utilization" gets a narrow, shallow answer. Nothing in the loop adds scope as it learns.

### Purpose
Produce a research-backed design for an additive, opt-in expansive-depth sub-mode that widens and deepens a run's scope, grounded in the current convergence and focus code and in the 002-graph-engineering program.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: this packet is research only. The deep-research loop in research/ measures the current stop and focus behavior from source and records it in research/research.md.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->
### In Scope
- Diagnose why the current loops stop early or stay narrow: convergence.cjs stop decision, newInfoRatio, minIterations, focus selection, strategy Next Focus, coverage graph, divergent mode and the wave_orchestration appendix.
- Mine the 002-graph-engineering program (children 001-006, research/, reference/, context/) for usable graph-loop principles.
- Design the expansive-depth sub-mode and its additive integration into agents, commands, workflow YAMLs, mode registry and convergence logic.
- Record the dispatch-iteration.cjs config-dir routing defect for research runs as a finding.

### Out of Scope
- Implementing the sub-mode - this packet produces findings and a design only.
- Changing default convergence behavior - the sub-mode must stay opt-in.
- Fixing the dispatch-iteration.cjs defect - recorded only, for a later packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research loop state, iterations and the `research.md` synthesis |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Create | Packet docs for this research phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->
REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Explain, with file:line evidence, why current runs stop early or stay narrow | `research/research.md` names each responsible mechanism with a source citation |
| REQ-002 | Propose an additive, opt-in sub-mode design with a named integration surface | `research/research.md` lists every file the sub-mode would touch and shows the default path unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Map graph-engineering principles onto the design | `research/research.md` cites the 002 children or primers each principle comes from |
| REQ-004 | Record the dispatch-iteration.cjs config-dir defect | `research/research.md` carries the defect with its source line and blast radius |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists and answers all seven key questions in `research/deep-research-strategy.md`.
- **SC-002**: The design shows how both example targets (100-commit sweep, skill-advisor chat-time audit) run under the sub-mode.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002-graph-engineering syntheses | The design loses its graph grounding if they are not read | Iterations cite the child `research/research.md` files directly |
| Risk | The design drifts into replacing default convergence | High | Every proposal is checked against the opt-in, default-unchanged constraint |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The seven research questions live in `research/deep-research-strategy.md` and are answered in `research/research.md`.
- A second research generation (5 iterations, cli-devin `swe-2-max`) verifies and extends the first. Generation 1 is archived under `research_archive/20261117T103614Z/`, and `research/research.md` stays canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Research findings (generated from `research/research.md`; edit that file, not this block):**
- **Root cause:** the loops stay narrow because every stop signal and every focus source is tied to the questions written at init, and nothing grows that set during a run. `research/inbox.jsonl` is the only channel that adds counted questions, and nothing writes to it.
- **Design:** an opt-in `--depth-mode=expansive` flag, kept separate from `--convergence-mode`, adds a frontier:
  - The leaf proposes `frontier_proposal` delta rows.
  - A workflow step admits them under depth, fan-out, budget and dedupe caps and writes them to the inbox.
  - The reducer builds a `frontier` field into the registry and picks Next Focus from it.
  - A `frontierOpen` veto in `convergence.cjs`, placed after the `minIterations` floor, can only turn a stop into CONTINUE while frontier nodes are open.
- **Defaults stay unchanged:** there is no new mode-registry entry, the gateway upcast is not changed, and `wave_orchestration` stays reference-only.
- **Review side (generation 2):** review has no question surface, so a review frontier must admit into `candidateCoverage`/`searchDebt`, not the inbox.
- **Completed-run extension (generation 2, build first):** adopt the reserved `completed-continue` lineage mode, spelled `--extend=N`. It records a new `run_extended` ledger event and keeps the session and generation.
  - The duration clock counts idle wall-clock time since `createdAt`. So the extension sets `maxDurationMinutes = max(prior, elapsedAtExtension) + M`, where M has a default, and it never re-stamps `createdAt`.
  - It also sets `maxIterations = continuedFromRun + N`.
  - The config change happens under the lock, and a snapshot step runs before synthesis.
- **Defects to fix separately (D1-D14, `research/research.md` §13; independently reviewed by Fable 5.2 and verified by Opus 5.5):**
  - D1: `sourceDiversity` has no `quality_class` producer. Fix: derive it at upsert from a closed vocabulary.
  - D2: research `cli-claude-code` silently drops `--config-dir`.
  - D7: the route-proof drop is the research upcast at `legacy-compatibility.ts:643-660`. Its fix is a ledger-schema decision.
  - D11: a completed run cannot be extended.
  - D12: the fan-out merge drops review coverage.
  - D3, D10 and D14 are downgraded after verification: they affect no default run, or they apply only to hand-edited configs.
- **Build order (`research/research.md` §20):** Slice A (extension) first, then the defect slices in any order. The research frontier (J) comes after them, and the review frontier (K) comes last.
- **Decisions open before Slices F and H:**
  - whether the research upcast may widen;
  - whether to enforce the four review dimensions or support custom ones.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## Phase Documentation Map

Build order: 001 first; 002-009, 012 and 013 in any order; then 010; then 011. No phase waits on a decision now: the operator decided phases 006, 008 and 012 on 2026-11-17, and each `decision-record.md` holds the accepted choice.

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-completed-run-extension/` | draft | Slice A: `completed-continue` / `--extend=N` for finished research and review runs |
| 2 | `002-research-claude-config-dir/` | draft | Slice B (D2): forward the Claude config dir on single-executor research |
| 3 | `003-review-min-iterations-floor/` | draft | Slice C (D3): apply the review `minIterations` floor |
| 4 | `004-focus-hijack-fix/` | draft | Slice D (D5): stop stale free text steering Next Focus, research and review |
| 5 | `005-prompt-pack-contract-alignment/` | draft | Slice E (D6, D13): prompt-pack write list and heading match the agent definition |
| 6 | `006-state-log-leaf-fields/` | draft | Slice F (D7, D9): widen the research upcast, stem schema and type so leaf fields reach the state log |
| 7 | `007-source-diversity-quality-class/` | draft | Slice G (D1): derive `quality_class` at upsert from a closed vocabulary |
| 8 | `008-review-dimension-coverage/` | draft | Slice H (D10): support custom review dimensions, so every configured dimension is tracked and can be covered |
| 9 | `009-fanout-review-coverage-merge/` | draft | Slice I (D12): carry review coverage surfaces through the fan-out merge |
| 10 | `010-research-frontier-mode/` | draft | Slice J: opt-in `--depth-mode=expansive` for deep-research; needs 004-007 |
| 11 | `011-review-frontier-mode/` | draft | Slice K: expansive mode for deep-review; needs 008, 009 and 010 |
| 12 | `012-pivot-hygiene/` | draft | Slice L: council seat cap of 3 per council attempt with at most one quorum retry per pivot (6 seats at most), dead pivot guard retired |
| 13 | `013-no-redispatch-landed-iteration/` | draft | Slice M (D14): no redispatch of an iteration that already landed |
