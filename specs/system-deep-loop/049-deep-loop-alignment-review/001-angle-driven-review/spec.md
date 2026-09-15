---
title: "Feature Specification: Phase 1: angle-driven-review"
description: "A twenty-iteration, angle-driven review of routing artifacts, skills, catalogs, playbooks, READMEs, commands, agents, executor parity, architecture and repo-rule alignment, half on DeepSeek and half on GLM, with every finding of any severity bound to a phase."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: angle-driven-review

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

[2-3 sentence high-level overview for stakeholders who need quick context]

**Key Decisions**: [Major decision 1], [Major decision 2]

**Critical Dependencies**: [Blocking dependency]

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-15 |
| **Branch** | `scaffold/001-angle-driven-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Angle-driven alignment review of the deep-loop system, its routers, skills, catalogs, commands, agents, executors and architecture against the repo rules specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twenty phases of the containment packet changed the deep-loop runtime, its commands, protocols, catalogs, agents and packet docs. The fifteen-iteration alignment review found surfaces that still disagree in places it rated P2 and left unbound: hub SKILL.md files against their registries and routers, catalogs against the runtime, READMEs against the code, executor rosters against the seven kinds now registered. Nobody has yet read the whole thing as one architecture, or against the repo rules that bind how it should have been built.

### Purpose
Twenty review iterations, each on a named angle, expanded between waves from what the earlier wave found, so that every surface agrees with every other and every confirmed finding of any severity becomes a phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### How a lane reads this
Each lane runs five iterations. Its label names its angle block below: lane `wave1-deepseek` takes angles 1 to 5 in order, one per iteration; `wave1-glm` takes 6 to 10; `wave2-deepseek` takes 11 to 15; `wave2-glm` takes 16 to 20. An iteration reads only its angle, cites file and line for every claim, and rates each finding P0 to P3 with the repo's severity meaning. Angles 11 to 20 are rewritten after wave one lands, so a wave-two lane reads this file fresh.

### Wave one angles
1. **Routing artifact parity, system-deep-loop hub**: the SKILL.md mode table, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, `graph-metadata.json` and `description.json` must agree on mode names, counts, routing classes, versions and leaf sets. Every disagreement is a finding.
2. **Routing artifact parity, sk-code and cli-external-orchestration hubs**: the same seven artifacts for each; cli-external-orchestration now registers seven modes including cli-hermes, and its ROUTER.md and SKILL.md say six.
3. **SKILL.md against references and assets**: for the three hubs and every mode under them, each path a SKILL.md cites exists, each file under `references/` and `assets/` is reachable from its router, and version fields agree across the mode's files.
4. **Feature catalogs against the runtime**: the hub catalog, the runtime catalog and each mode catalog; every entry names a live file or function, no entry names a removed one (worktrees, retired executor kinds), and the runtime's own write containment has an entry.
5. **Playbooks and READMEs against the runtime**: every playbook command and flag exists; every README claim about scripts, contracts, hooks or counts matches the code, including the compiled-contracts README.
6. **Deep-loop command YAMLs**: the four YAMLs and their presentation assets against the runtime and the prompt packs, auto against confirm step parity, duplicated banners, stale inline containment comments in executor branches, the confirm workflow's resource-map audit step, and every `append_jsonl` directive's executor.
7. **Agents and mirrors**: every agent under `.opencode/agents/` against its `.claude`, `.codex` and `.pi` mirrors; permission mappings dropped with only a comment; delegation and tool vocabularies per runtime.
8. **Cross-CLI executor parity**: the executor kinds in `executor-config.ts`, the runner's command builders, the adapter stress matrix, each cli-* SKILL.md roster and the deep-loop protocols' adapter lists must name the same kinds with the same flags and limits.
9. **Architecture, containment**: detect, quarantine, remedy, ledger, merge, read as one system for contradictions, dead paths, duplicated rules (the inline containment blocks in the YAMLs beside the runner's), and validators with more than one call site.
10. **Architecture, state and ledger**: the gateway, ledger schemas, projections and reducers as one write path; exemptions, stems without producers, producers without stems, and the projection's replace semantics.

### Wave two angles (seeds; rewritten from wave-one findings before wave two runs)
11. Repo-rule alignment, restraint: helpers, options or tests the containment packet added that a simpler existing thing would have served; abstractions no current requirement earns.
12. Repo-rule alignment, scope and evidence: phase commits against their specs, packet claims against cited lines, comment hygiene and the durable why.
13. Dead code and duplication across the runtime after the worktree removal.
14. Test floor: coverage per public surface, and tests that mirror the implementation instead of failing for a real reason.
15. Hooks and gates: pre-commit and pre-push gates against what their docs claim, including the mirror-parity and route gates the last packet had to bypass.
16. The containment packet's own health: twenty phases, statuses, ADR chain, metadata, acceptance evidence.
17. to 20. Reserved for what wave one surfaces.

### Out of Scope
- Fixing anything inside the review; every fix is a phase of the parent
- Surfaces outside the deep-loop, sk-code, cli-external-orchestration and sk-doc trees, unless an angle crosses into them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-angle-driven-review/review/` | Create | Four lineages across two waves, merged registry and attribution |
| this `spec.md` | Modify | Wave-two angles rewritten between waves |
| (new phases under the parent) | Create | One per confirmed finding class, any severity |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Twenty iterations complete across four cli-pi lanes, two on DeepSeek V4.1 Flash max and two on GLM 5.3 Flash max, in two waves under max-iterations with convergence off, each numbered record carrying the route-proof fields |
| REQ-002 | Wave-two angles are rewritten in this spec from wave-one findings before wave two runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every finding, P0 to P3, is verified against the tree and bound to a parent phase or recorded as refuted with the reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Merged attribution names kind and model for all four lanes and no finding is left unbound
- **SC-002**: The routing artifacts of every hub in scope agree exactly after the bound phases land
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [/25] | [Files: X, LOC: Y, Systems: Z] |
| Risk | [/25] | [Auth: Y/N, API: Y/N, Breaking: Y/N] |
| Research | [/20] | [Investigation needs] |
| Multi-Agent | [/15] | [Workstreams: X] |
| Coordination | [/15] | [Dependencies: X] |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | [Risk] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 11. USER STORIES

### US-001: [Title] (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: [Title] (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---


