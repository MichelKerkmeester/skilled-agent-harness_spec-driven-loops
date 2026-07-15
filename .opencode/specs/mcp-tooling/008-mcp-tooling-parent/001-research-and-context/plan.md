---
title: "Implementation Plan: Phase 1: research-and-context"
description: "Plan for a read-only research gate that refreshes the mcp-chrome-devtools, mcp-click-up, and mcp-figma facts before architecture decisions. The phase scopes a skill-state pass, a transport-eligibility pass, and a referrer inventory pass, then stops for human review before any skill-file changes."
trigger_phrases:
  - "mcp-tooling parent plan"
  - "research gate plan"
  - "mcp bridge referrer inventory plan"
  - "figma transport eligibility"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/001-research-and-context"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the read-only research-gate implementation plan"
    next_safe_action: "Human review before executing the scoped research passes"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/001-research-and-context/tasks.md"
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
This phase does not scaffold or move the mcp-tooling parent hub. It plans a research gate: confirm the three bridges' live state and `allowed-tools` postures, classify each as workflow or transport from that evidence, and produce a fresh referrer inventory so phase 002 can decide from current facts rather than stale planning notes.
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
- **Skill-state pass**: Read the three bridges' `SKILL.md`, `README.md`, and `graph-metadata.json`; capture live versions, tracked file counts, and `allowed-tools` postures against the shared program context.
- **Transport-eligibility pass**: From each bridge's `allowed-tools`, classify workflow (writes to the local workspace) versus transport (writes only to an external tool, `mutatesWorkspace:false`), and confirm figma's mandatory `depends_on sk-design` pairing edge.
- **Referrer-inventory pass**: Re-run grep sweeps for the three bridge skill ids and their skill-folder paths, recording file:line evidence and classifying functional path refs versus documentation references.

### Data Flow
Live repository reads and grep output become phase-local research artifacts. Those artifacts feed human review and then phase 002 architecture decisions; no skill files or runtime paths are changed in this phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The three bridge skill descriptors (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`) | Source facts for the fold-in program | Read-only inventory; unchanged | File reads of `SKILL.md`, `README.md`, `graph-metadata.json`, and version/`allowed-tools` evidence |
| `doctor_mcp_install.yaml` + advisor routing corpus | Future consumers of moved paths | Inventory only; unchanged | Fresh grep results with file:line evidence for the functional path refs and the labeled-prompts routing rows |

Required inventories:
- Same-class producers: `rg -n 'mcp-chrome-devtools|mcp-click-up|mcp-figma' .opencode/commands/doctor`.
- Consumers of changed symbols: `rg -n 'mcp-chrome-devtools|mcp-click-up|mcp-figma' . --glob '*.md' --glob '*.yaml' --glob '*.jsonl' --glob '*.json'`.
- Matrix axes: list every referrer class (functional path, advisor corpus, documentation catalog, internal self-path) and the required rows before implementation.
- Algorithm invariant: a skill-folder move must repoint every functional path referrer; name-keyed manuals and the `code_mode` registration key must stay untouched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase folder scope and the no-write boundary outside `001-research-and-context/`
- [ ] Identify the exact descriptor files to read for the three bridges
- [ ] Define grep terms and output format for the referrer inventory

### Phase 2: Core Implementation
- [ ] Execute the skill-state research pass and capture drift from the shared context
- [ ] Execute the transport-eligibility pass and classify each bridge from its `allowed-tools`
- [ ] Execute the referrer-inventory pass and classify functional, advisor-corpus, documentation, and internal self-path references

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
