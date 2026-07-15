---
title: "Implementation Plan: Phase 1: research-and-context"
description: "Plan for a read-only research gate that refreshes the sk-prompt and sk-prompt-models facts before architecture decisions. The phase scopes two research passes plus prior-art review and stops for human review before any skill-file changes."
trigger_phrases:
  - "sk-prompt parent plan"
  - "research gate plan"
  - "referrer inventory plan"
  - "prompt-models fold-in planning"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/001-research-and-context"
    last_updated_at: "2026-07-09T13:42:00Z"
    last_updated_by: "opencode"
    recent_action: "Drafted the read-only research-gate implementation plan"
    next_safe_action: "Human review before executing the scoped research passes"
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/spec.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/plan.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown spec-kit documentation with read-only repository inspection |
| **Framework** | System Spec Kit Level 1 phase documentation |
| **Storage** | None for execution; findings remain inside this phase folder when the phase runs |
| **Testing** | Placeholder scan plus `validate.sh` for this phase folder after authored docs change |

### Overview
This phase does not implement the sk-prompt parent hub. It plans a research gate: first confirm both source skills' live state, then produce a fresh referrer inventory and prior-art summary so phase 002 can decide from current evidence rather than stale planning notes.
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
Read-only research gate followed by human review.

### Key Components
- **Skill-state pass**: Read both skills' core descriptor files and compare live versions, tool posture, and graph metadata against the shared program context.
- **Referrer-inventory pass**: Re-run grep sweeps for `sk-prompt-models` and `sk-prompt/SKILL.md` outside `sk-prompt` itself, recording file:line evidence and classifying functional versus documentation references.
- **Prior-art pass**: Review the 121 rename program for rename task shape, referrer handling, and lessons that should inform later phases.

### Data Flow
Live repository reads and grep output become phase-local research artifacts. Those artifacts feed human review and then phase 002 architecture decisions; no skill files or runtime paths are changed in this phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/` and `.opencode/skills/sk-prompt-models/` descriptors | Source facts for the fold-in program | Read-only inventory; unchanged | File reads of `SKILL.md`, `README.md`, `graph-metadata.json`, `description.json`, and changelog/version evidence |
| Runtime and automation referrers | Future consumers of moved paths | Inventory only; unchanged | Fresh grep results with file:line evidence, including known path joins, benchmark write targets, and CI card sync |

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
- [ ] Confirm phase folder scope and no-write boundary outside `001-research-and-context/`
- [ ] Identify exact descriptor files and prior-art folders to read
- [ ] Define grep terms and output format for the referrer inventory

### Phase 2: Core Implementation
- [ ] Execute the skill-state research pass and capture drift from the shared context
- [ ] Execute the referrer-inventory pass and classify functional, CI, benchmark, advisor, and documentation references
- [ ] Review the 121 rename program and summarize reusable lessons for the fold-in phases

### Phase 3: Verification
- [ ] Reconcile research artifacts for internal consistency and unresolved unknowns
- [ ] Confirm no files outside this phase folder were touched during execution
- [ ] Run phase-folder validation and stop for human review before phase 002
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Phase 001 spec docs | `validate.sh` against this phase folder |
| Placeholder check | Authored phase docs | Text search for unresolved bracketed placeholders and template prose |
| Inventory audit | Research outputs | Manual cross-check that required files and grep terms are represented with file:line evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Repository read access | Internal | Green | Research cannot verify live state without reading current files |
| Human review after research gate | Process | Green | Phase 002 must not start until the phase 001 artifacts are reviewed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase execution touches files outside `001-research-and-context/`, or research artifacts contain ungrounded facts without file or grep evidence.
- **Procedure**: Discard or correct only the phase-local research artifacts, re-run the affected read/grep pass, and repeat validation before handoff. No skill-file rollback should be necessary because this phase is read-only outside the phase folder.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
