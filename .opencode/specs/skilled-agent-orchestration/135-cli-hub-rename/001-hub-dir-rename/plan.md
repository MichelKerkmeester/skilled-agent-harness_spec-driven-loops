---
title: "Implementation Plan: Phase 1 Hub Directory Rename"
description: "Move the existing external CLI hub to cli-external-orchestration with git history intact, then hand consumer alignment to later phases."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/001-hub-dir-rename"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Finalized completed rename plan"
    next_safe_action: "Review phase 2 advisor evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: hub-dir-rename

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
| **Language/Stack** | Filesystem and Git |
| **Framework** | OpenCode skill packet layout |
| **Storage** | Repository tree |
| **Testing** | Git evidence plus downstream Vitest suites |

### Overview
Use a direct `git mv` for the parent hub. Preserve nested executors, then verify consumers in the advisor, reference, and closeout phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope documented.
- [x] Success criteria are measurable.
- [x] Existing hub and Git are available.

### Definition of Done
- [x] Directory rename acceptance criteria met.
- [x] Downstream targeted checks recorded in phase 4.
- [x] Phase docs synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
History-preserving filesystem rename with staged consumer cutover.

### Key Components
- **Parent hub**: owns external CLI workflow routing.
- **Nested executors**: retain concrete `cli-opencode` and `cli-claude-code` workflows.

### Data Flow
The existing hub tree moves as one unit; later phases update metadata and consumers to the new parent path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Parent hub directory | Owns external CLI routing | Rename | Git move evidence |
| Nested executor packets | Implement concrete workflows | Unchanged internally | Directory inspection |
| Advisor and docs | Consume hub identity | Update in phases 2-3 | Smoke and sync checks |

Required inventories:
- Same-class producer inventory: one external CLI parent hub.
- Consumer inventory: advisor metadata, routing projections, live docs, and tests.
- Invariant: exactly one canonical hub path remains after the move.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Existing hub and nested packets inspected.
- [x] Destination path confirmed.
- [x] Rollback defined.

### Phase 2: Core Implementation
- [x] Move the hub with `git mv`.
- [x] Preserve nested executor layout.
- [x] Hand consumer changes to phases 2 and 3.

### Phase 3: Verification
- [x] Canonical destination confirmed.
- [x] Duplicate-hub risk addressed.
- [x] Phase documentation updated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Hub directory and nested packets | Git and filesystem inspection |
| Integration | Rename and routing invariants | Vitest, phase 4 |
| Manual | Canonical destination | Repository inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing hub tree | Internal | Green | No source tree to move |
| Git index | Internal | Green | History evidence unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New hub path breaks consumers and cannot be repaired within the packet.
- **Procedure**: Reverse the `git mv` and restore consumer references from the same diff.

## L2: PHASE DEPENDENCIES
Phase 1 blocks advisor realignment; advisor realignment blocks the live-reference sweep; all feed closeout.

## L2: EFFORT ESTIMATION
| Work | Complexity | Effort |
|---|---|---|
| Inspect and move | Medium | Short |
| Consumer handoff | Medium | Separate phases |

## L3: DEPENDENCY GRAPH
`existing hub` -> `git mv` -> `advisor alignment` -> `reference sweep` -> `closeout`

## L3: CRITICAL PATH
1. Preserve the hub tree during the move.
2. Establish the canonical destination.
3. Hand off every consumer class.

## L3: MILESTONES
| Milestone | Success Criteria | Status |
|---|---|---|
| Hub moved | New canonical path exists | Complete |
| Consumers assigned | Later phases own all consumer classes | Complete |

## L3: ARCHITECTURE DECISION RECORD
See `decision-record.md` for the accepted direct-move decision.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Documentation-and-config change only; no external build graph. The subskill `SKILL.md` edits are the single input the registry regeneration consumes.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Audit and fix-map, then the SKILL.md edits, then registry regeneration from the SKILL.md source of truth, then drift verification. Each step gates the next.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

M1: fix map complete and reviewed. M2: registry and hub-router regenerated with zero SKILL.md-to-registry drift and package validation green.
<!-- /ANCHOR:milestones -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
