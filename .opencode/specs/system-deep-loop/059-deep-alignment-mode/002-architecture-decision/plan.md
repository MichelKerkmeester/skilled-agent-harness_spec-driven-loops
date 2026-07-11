---
title: "Implementation Plan: Phase 2: architecture-decision"
description: "Plan for the deep-alignment architecture-decision gate: freezes the state machine, adapter contract, alignment contract, and boundaries so phase 003 can scaffold the mode-packet skeleton without re-deriving structure."
trigger_phrases:
  - "deep-alignment architecture plan"
  - "alignment state machine target"
  - "adapter contract target shape"
  - "deep-alignment boundary freeze"
  - "phase 002 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/002-architecture-decision"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the architecture-decision gate plan"
    next_safe_action: "Author the 12 ADRs in decision-record.md"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit decision documentation |
| **Framework** | System Spec Kit Level 3 phase documentation with a decision-record addendum |
| **Storage** | None for execution; ADR content lives in this phase folder |
| **Testing** | `validate.sh --strict` against this phase folder after the ADRs are authored |

### Overview
This phase does not implement deep-alignment. It freezes the architecture the frozen design brief already locked, writing it down as 12 individually traceable ADRs (7 accepted, 5 explicitly open), and names a concrete state-machine and adapter-contract target phase 003 can plan against directly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decision-gate documentation followed by human review, mirroring `skilled-agent-orchestration/124-sk-prompt-parent/002-architecture-decision`'s ADR shape.

### Key Components

**Frozen state machine** (the mode's loop, run by phase 008 against the `deep-review` runtime engine):

```
INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> [optional] REMEDIATE
```

- `INIT`: mode entry, resolves the bound spec folder for state.
- `SCOPE`: the structured scoping question (three axes: artifact class, standard authority, scope) resolves to N alignment lanes; a non-interactive arg form bypasses the question for headless/cron runs.
- `DISCOVER`: per lane, `adapter.discover(scope)` seeds the corpus and FILE nodes.
- `ITERATE`: partitions the corpus across iterations, audits each slice against its lane's authority via `adapter.check(artifact, rules)`, emits P0/P1/P2 conformance findings with file:line, standard-violated, and fix, each VERIFY-FIRST re-probed against live ground truth.
- `CONVERGE`: coverage threshold or max-iterations, reusing `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs`.
- `REPORT`: emits a per-lane `alignment-report.md` verdict.
- `REMEDIATE` (optional, gated): operator-approved, read-only by default; never auto-stages, never runs unattended when concurrent sessions are live.

**Pluggable per-authority adapter contract** — authority-agnostic, not hard-wired to four:

```
adapter.discover(scope) -> artifacts
adapter.standardSource(authority) -> { templates, rules }
adapter.check(artifact, rules) -> findings
```

**Authorities v1**, sequenced by determinism (most deterministic first): `sk-doc` (reference adapter — `validate_document.py` + `extract_structure.py` DQI + `core_standards.md`), `sk-git` (deterministic — conventional-commit + worktree/branch rules already AI-scannable in `SKILL.md`), `sk-design` (audit-rubric — DESIGN.md structure + tokens, STATIC-first, v1 defers live-render), `sk-code` (hardest — surface-detection via `SKILL.md` §2 Smart Routing, reasoning-checked, honest limits not a deterministic linter).

**Alignment contract** (first-class mode invariants, not per-adapter options): (1) verify-first — every reality-drift finding is re-probed against the real validator/CLI/registry before assertion; (2) known-deviation suppression — a per-authority accepted-conventions list so intentional repo conventions are never flagged as drift; (3) read-only by default; (4) gated remediation — opt-in, operator-approved, verify-first, never auto-`-A`/scoped-stage/worktree-when-diverged/doc-only-skip when concurrent sessions are live.

**Artifact layout**: all mode state lives in the bound spec folder's `alignment/` subdirectory (mirroring `deep-review`'s `review/` convention: config, findings registry, state JSONL, iterations, prompts, dispatch receipts) — no manual `/tmp` state, per Gate 4.

### Data Flow
The frozen design brief's locked decisions become 12 ADRs in `decision-record.md`. Phase 003 reads this plan's architecture section directly to scaffold `SKILL.md`, the `mode-registry.json` entry, and the `alignment/` directory skeleton — no re-derivation of the state machine, adapter contract, or authority set.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-deep-loop/mode-registry.json` | Declarative mode registry phase 003 will extend | Read-only reference for the target shape; unchanged this phase | Read of the existing `research`/`review`/`council` mode entries |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Hub-structure checker, explicit boundary reference | Read-only reference for the boundary ADR; unchanged this phase | File exists and is cited by path in ADR-007 |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the seven locked-decision clusters and five open questions from the frozen design brief
- [ ] Confirm phase 001's research/context map is available as ADR evidence
- [ ] Draft the ADR numbering: 001-007 accepted, 008-012 open

### Phase 2: Core Implementation
- [ ] Author ADR-001 through ADR-007 (accepted) in `decision-record.md`
- [ ] Author ADR-008 through ADR-012 (open) in `decision-record.md`, each naming an owning phase
- [ ] Author the frozen state-machine and adapter-contract target in this plan's Architecture section

### Phase 3: Verification
- [ ] Cross-check `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` cite the same 12 ADRs consistently
- [ ] Confirm no files outside this phase folder were touched during execution
- [ ] Run phase-folder validation and stop for human review before phase 003 begins
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Phase 002 spec docs | `validate.sh --strict` against this phase folder |
| Placeholder check | Authored phase docs | Text search for unresolved bracketed placeholders |
| ADR consistency audit | `decision-record.md` | Manual cross-check that all 12 ADRs are cited consistently across spec/plan/checklist |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001's confirmed research/context map | Internal | Green | ADR evidence would rest on assumption rather than confirmed fact |
| Human approval of the decision gate | Process | Green | Phase 003 must not start until the operator accepts or amends the ADRs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The operator rejects or requires amendment of one or more ADRs, or a later phase's implementation evidence contradicts a frozen decision.
- **Procedure**: Revise the affected ADR in place (same file, same ADR number, new dated Amendment note) rather than creating a competing decision-record.md. No mode-packet rollback is needed because phase 003 has not run yet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 research/context map | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 003 (successor) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirming brief content already at hand |
| Core Implementation | Medium | Authoring 12 ADRs with full context/decision/alternatives/consequences/five-checks/implementation sections |
| Verification | Low | Cross-doc consistency check plus `validate.sh --strict` |
| **Total** | | **Single-session scaffold authoring** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No skill files created yet (additive-only from phase 003 onward)
- [ ] No command or advisor entries exist yet
- [ ] No monitoring surface applies to a documentation-only phase

### Rollback Procedure
1. Revert the affected ADR section via `git checkout` or in-place edit before this phase's docs are committed.
2. Re-run `validate.sh --strict` against this phase folder to confirm the revert is clean.
3. Re-route for human approval.
4. No stakeholder notification needed — nothing downstream has consumed this gate yet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 001-research │────►│ 002-arch-   │────►│ 003-scaffold│
│ -and-context │     │ decision    │     │ -mode-packet│
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  decision │
                    │  -record  │
                    │  (12 ADR) │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Confirmed research/context map (001) | None | ADR evidence base | This phase's ADRs |
| ADR-001..007 (accepted) | 001's confirmed facts | Frozen architecture | Phase 003 scaffold plan |
| ADR-008..012 (open) | Brief's open-questions list | Explicit ownership per phase | Phases 004/007/008 |
| Operator approval | ADR-001..012 authored | Gate closure | Phase 003 start |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Author ADR-001 through ADR-007 (accepted)** - CRITICAL
2. **Author ADR-008 through ADR-012 (open, with owning phases)** - CRITICAL
3. **Operator approval** - CRITICAL (blocks phase 003)

**Total Critical Path**: Single-session authoring plus one human-approval round trip.

**Parallel Opportunities**:
- The accepted-ADR authoring and open-ADR authoring can be drafted in either order since they do not depend on each other's content.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | 12 ADRs authored | All 7 accepted + 5 open ADRs present with required sections | End of phase 002 authoring |
| M2 | Gate validated | `validate.sh --strict` clean on this phase folder | Before requesting approval |
| M3 | Gate approved | Operator explicitly accepts or amends | Before phase 003 starts |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full 12-ADR record (ADR-001 through ADR-007 accepted, ADR-008 through ADR-012 open). This plan's Architecture section (§3) summarizes the frozen state machine and adapter contract those ADRs formalize.

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the seven locked decisions from the frozen design brief are represented as Accepted ADRs without reopening them.
- [ ] Confirm the five open questions are represented as Open ADRs, each with a named owning phase, not silently resolved.
- [ ] Confirm no live `.opencode/skills/system-deep-loop/` file or `mode-registry.json` entry is touched in this phase.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Draft `decision-record.md` before finalizing `spec.md`'s Executive Summary, since the summary depends on the ADRs' final wording. |
| TASK-SCOPE | Edits stay inside `002-architecture-decision/`; no git commands, no edits to `.opencode/skills/system-deep-loop/` or any command file. |

### Status Reporting Format
Report phase status as: `Phase 002 — <Draft|Review Gate|Approved> — N/12 ADRs accepted — blocking on: <operator approval | none>`.

### Blocked Task Protocol
If the operator does not approve within this phase's review window, the phase status stays `Review Gate` and phase 003 does not start. Amendments land as edits to the existing ADR (same number, new dated Amendment note), never as a competing decision document.
<!-- /ANCHOR:ai-execution-protocol -->

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
