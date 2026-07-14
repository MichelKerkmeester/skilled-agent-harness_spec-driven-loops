---
title: "Implementation Plan: Audit and Fix Map"
description: "Read every routing source, capture the before-state, and map all 14 frozen fixes before product edits."
trigger_phrases:
  - "sk-doc router audit plan"
  - "fourteen fix map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/001-audit-and-fix-map"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Recorded source audit, baseline, and fix map"
    next_safe_action: "Use phase 002 plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-audit-and-fix-map"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Audit and Fix Map

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
| **Language/Stack** | Markdown and JSON router contracts |
| **Framework** | sk-doc parent hub |
| **Storage** | Repository files only |
| **Testing** | `package_skill.py`, JSON parser, routing replay, spec validation |

### Overview
Audit all ten `create-*` packet contracts and both hub router files before implementation. The pass records the exact 14 fixes below, captures the six-query routing baseline, then hands product edits to phases 002 through 004.

### Fourteen-Fix Map

| Fix | Tier | Source file(s) | Exact trigger, heading, or handoff change |
|---|---|---|---|
| P0-01 | P0 | `create-readme/SKILL.md` | Remove `audit readmes` and standalone README-audit activation from the public trigger boundary; keep README/install-guide authoring triggers. |
| P0-02 | P0 | `create-flowchart/SKILL.md` | Scope `validate` to a flowchart created or edited in the same request; standalone validation of an existing markdown diagram hands off to `create-quality-control`. |
| P0-03 | P0 | `create-quality-control/SKILL.md` | Explicitly own existing-document audit, validation, quality scoring, including existing READMEs and flowcharts; add unambiguous audit/validate query phrases. |
| P1-01 | P1 | `create-benchmark/SKILL.md`, router JSON | Exclude bare `benchmark`; preserve every workstream-A family phrase (`behavior benchmark`, `skill-benchmark`, `model-benchmark`, fixtures/profiles, MCP promotion). |
| P1-02 | P1 | `create-command/SKILL.md`, router JSON | Remove bare `:auto` and `:confirm` suffixes from packet triggers; retain command-authoring phrases that discuss mode routing. |
| P1-03 | P1 | `create-readme/SKILL.md`, router JSON | Remove generic `add documentation`; unresolved generic documentation requests must defer rather than default to README creation. |
| P1-04 | P1 | `create-skill/SKILL.md`, router JSON | Remove bare hub-schema words `workflowMode`, `mode-registry`, and `hub-router` from packet triggers; retain explicit skill and parent-hub authoring phrases. |
| P1-05 | P1 | `hub-router.json` | Remove hub identity/schema vocabulary from every per-mode score path so `documentation`, `mode-registry`, and similar hub terms cannot select a child packet by themselves. |
| P1-06 | P1 | all ten `create-*/SKILL.md` | Replace vague or missing handoffs with concrete sibling packet ids matching the excluded artifact/action. |
| P2-01 | P2 | all ten `create-*/SKILL.md` | Place `### Activation Triggers` first inside `## 1. WHEN TO USE`. |
| P2-02 | P2 | all ten `create-*/SKILL.md` | Keep exactly one `Keyword triggers:` line immediately after activation use cases. |
| P2-03 | P2 | all ten `create-*/SKILL.md` | Standardize the handoff heading to `### When NOT to Use`. |
| P2-04 | P2 | all ten `create-*/SKILL.md` | Standardize the list lead-in to `Use another \`sk-doc\` packet when:`. |
| P2-05 | P2 | all ten `create-*/SKILL.md` | Format every handoff target as the exact backticked sibling packet id; remove generic “matching packet” wording. |

### Before-State Routing

| Query | Top-level advisor | Hub-internal mode before |
|---|---|---|
| `audit documentation quality` | `sk-code` 0.95 and `sk-doc` 0.95 (local fallback scorer) | `create-quality-control`; README source still advertises `audit readmes`, creating source/registry collision risk. |
| `validate a document` | `sk-doc` 0.95 | `create-quality-control`; flowchart source still advertises standalone existing-flowchart validation. |
| `generate a readme` | `sk-doc` 0.95 | `create-readme`. |
| `create a flowchart` | `sk-doc` 0.95 | `create-flowchart`. |
| `add documentation` | `sk-doc` 0.95 | `create-readme` through a generic registry alias. |
| `benchmark` | no top-level recommendation | `create-benchmark` through the bare benchmark vocabulary token. |

The advisor reported `NATIVE_DIST_MISSING` and used its local Python scorer for all six measurements. This affects transport provenance, not the hub-internal JSON analysis.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All audit acceptance criteria met
- [x] Before-state commands captured
- [x] Fix map synchronized across plan and tasks
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first declarative router alignment: packet `Keyword triggers:` and sibling handoffs define intent ownership, then both JSON router files are synchronized from those contracts.

### Key Components
- **Packet contracts**: Own activation phrases and explicit sibling boundaries.
- **Hub registries**: Project packet phrases into aliases and vocabulary without generic cross-mode scoring terms.

### Data Flow
Request phrase -> hub vocabulary match -> one packet mode, ordered bundle, or defer. Existing-document quality verbs route to `create-quality-control`; artifact creation nouns route to the matching creator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Ten packet `SKILL.md` files | Source of trigger and handoff truth | Audit all; edit in later phases | One trigger line and exact sibling handoffs per packet |
| `mode-registry.json` and `hub-router.json` | Runtime projection of packet intent | Regenerate by deterministic hand-sync | Alias/vocabulary drift comparison and routing replay |

Required inventories are the ten packet sources, the hub contract, the two router projections, and the six fixed routing queries.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm branch and workstream-A baseline
- [x] Scaffold phased packet from system-spec-kit templates
- [x] Read skill/spec authoring checklists

### Phase 2: Core Implementation
- [x] Read all thirteen routing sources
- [x] Capture top-level and hub-internal before-state
- [x] Map all 14 fixes before source edits

### Phase 3: Verification
- [x] Confirm 3 P0, 6 P1, and 5 P2 rows
- [x] Confirm generator search result
- [x] Confirm benchmark preservation requirement
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source audit | Ten packet trigger/handoff sections | Read and Grep |
| Routing baseline | Six exact prompts | Python advisor plus JSON reasoning |
| Fix-map count | 3/6/5 taxonomy | Markdown table and tasks cross-check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Workstream-A create-benchmark changes | Internal | Green | Vocabulary must survive synchronization |
| Native advisor dist | Internal | Red | Local scorer used; hub router measured separately |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fix map does not total 14 or conflicts with frozen scope.
- **Procedure**: Stop product edits and restore the phase-001 map from the user brief.
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
