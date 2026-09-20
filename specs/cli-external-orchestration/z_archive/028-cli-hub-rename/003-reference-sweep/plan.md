---
title: "Implementation Plan: Phase 3 Live Reference Sweep"
description: "Classify references by operational role, update active hub consumers, preserve valid executor and historical names, then run sync checks."
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
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/003-reference-sweep"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Finalized completed reference plan"
    next_safe_action: "Review phase 4 closeout evidence"
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
# Implementation Plan: Phase 3: reference-sweep

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
| **Language/Stack** | Markdown, JSON, TypeScript configuration |
| **Framework** | OpenCode skill and prompt metadata |
| **Storage** | Repository files and generated prompt-quality projection |
| **Testing** | Reference inspection and prompt-quality-card sync |

### Overview
Inventory references, classify each as a live hub consumer, concrete executor reference, or historical record, and update only the active contract surfaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Classification policy documented.
- [x] Sync PASS criterion defined.
- [x] Phase 2 identity model available.

### Definition of Done
- [x] Live references repointed.
- [x] Prompt-quality-card sync passes.
- [x] Phase docs synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Role-aware reference migration.

### Key Components
- **Live hub references**: point to `cli-external-orchestration`.
- **Executor references**: retain `cli-opencode` when naming the workflow.
- **Historical records**: preserve prior-state evidence.

### Data Flow
Current routing identity informs reference classification; changed live data feeds the prompt-quality-card sync check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill and command docs | Active hub consumers | Update | Live path inspection |
| Executor dispatch docs | Concrete workflow consumers | Keep semantic name | Context review |
| Prompt-quality card | Generated routing consumer | Synchronize | PASS result |

Required inventories:
- Producer inventory: canonical hub and nested executor identities from phase 2.
- Consumer inventory: active docs, metadata, tests, and prompt-quality projection.
- Matrix axes: hub versus executor; live versus historical.
- Invariant: only active hub references are renamed to `cli-external-orchestration`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Define occurrence classes.
- [x] Inventory active surfaces.
- [x] Identify generated sync target.

### Phase 2: Core Implementation
- [x] Repoint live hub references.
- [x] Preserve executor semantics.
- [x] Synchronize prompt-quality data.

### Phase 3: Verification
- [x] Prompt-quality-card sync passes.
- [x] Historical evidence policy reviewed.
- [x] Phase docs updated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Active reference targets | Repository inspection |
| Integration | Prompt-quality projection | Sync checker |
| Regression | Rename and registry invariants | Vitest in phase 4 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 identity model | Internal | Green | References could use wrong semantic name |
| Prompt-quality sync tool | Internal | Green | Generated drift remains unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Updated references break valid executor dispatch or rewrite historical evidence.
- **Procedure**: Restore the affected occurrence from the reference-sweep diff and reclassify it.

## L2: PHASE DEPENDENCIES
Phase 2 defines names; phase 3 updates consumers; phase 4 runs integrated checks.

## L2: EFFORT ESTIMATION
| Work | Complexity | Effort |
|---|---|---|
| Inventory and classification | High | Medium |
| Updates and sync | Medium | Short |

## L3: DEPENDENCY GRAPH
`identity model` -> `occurrence classification` -> `live updates` -> `quality-card sync`

## L3: CRITICAL PATH
1. Distinguish hub from executor semantics.
2. Distinguish live from historical references.
3. Verify generated projection synchronization.

## L3: MILESTONES
| Milestone | Success Criteria | Status |
|---|---|---|
| Live refs aligned | Canonical paths used | Complete |
| Generated view aligned | Sync PASS | Complete |

## L3: ARCHITECTURE DECISION RECORD
See `decision-record.md` for the accepted live-only sweep policy.
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
