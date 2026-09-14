---
title: "Feature Specification: Phase 1: alignment-review"
description: "A fifteen-iteration alignment review of the remediated deep-loop tree along six dimensions, read against the repo rules, with every confirmed finding bound to a phase or recorded as reviewed."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: alignment-review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-14 |
| **Branch** | `scaffold/014-alignment-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-review-lane-advisory-and-strict-config |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Fifteen-iteration alignment review of the deep-loop and skill surfaces against the repo rules specification.

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
The fan-out containment packet changed the deep-loop runtime, its command YAMLs, the deep-research references and compiled contract, and the skill documentation around them across thirteen phases and one remediation round. Nothing has yet checked, surface by surface, that those changes left every layer describing the same system: the code, the skill files that route to it, the catalogs and playbooks that document it, the commands and agents that drive it, and the repo rules that bind all of them.

### Purpose
Fifteen review iterations read the remediated tree along six alignment dimensions and against the repo rules, and every confirmed finding is bound to a phase or recorded as reviewed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Six review dimensions, each read against `REPO RULES.md` and the rule files it routes to under `repo-rules/`:
- **sk-code and OpenCode alignment**: `.opencode/skills/sk-code/` (its SKILL.md, mode routers and references) against what the deep-loop runtime and the command YAMLs under `.opencode/commands/deep/` actually do, and against the OpenCode surfaces in `.opencode/agents/`, `.opencode/plugins/` and `opencode.json`
- **Feature catalog and playbook alignment**: every `feature-catalog/` and `manual-testing-playbook/` tree under `.opencode/skills/system-deep-loop/` (hub, `runtime/`, `deep-research/`, `deep-review/`) against the runtime as shipped, with the worktree mechanism removed and the per-pass quarantine layout in place
- **SKILL.md against references and assets**: for `system-deep-loop`, its modes, `cli-external-orchestration` and its cli-* modes, and `sk-code`, whether each SKILL.md's routing, rules and claims match the files under its `references/` and `assets/`
- **Deep-loop command alignment**: the four command YAMLs and presentation assets under `.opencode/commands/deep/assets/` and the compiled contracts under `assets/compiled/` against the runtime scripts they invoke and the references they digest
- **Deep-loop agent alignment**: the agent definitions under `.opencode/agents/` and their mirrors under `.claude/agents/`, `.codex/agents/` and `.pi/agents/` for `deep-research`, `deep-review`, `deep-improvement` and `orchestrate`, against the command contracts and the runtime's route-proof fields
- **General architecture**: the shared-checkout containment model, the fan-out runner, the merge and reducers, and the dispatch adapters, read as one system for contradictions, dead paths and duplicated rules

### Out of Scope
- Re-reviewing the seven original fixes and six remediations line by line - the first review did that; this pass reads alignment across surfaces
- Surfaces outside deep-loop, cli-external-orchestration, sk-code and the repo rules - other skills are named only where one of the six dimensions crosses into them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `014-alignment-review/review/` | Create | Lineage artifacts, merged registry, attribution table and review report |
| `014-alignment-review/goal.md` | Modify | Verdict, binding table and criteria after the run |
| (new phases under the parent) | Create | One per confirmed P0 or P1 finding that needs code or doc work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Fifteen review iterations complete across the lanes under max-iterations with convergence off; each iteration state record carries `target_agent`, `resolved_route`, `agent_definition_loaded` and `mode` |
| REQ-002 | The primary executor is DeepSeek V4.1 Flash max on cli-devin; a lane that fails re-runs on LUNA max fast on cli-codex, then on DeepSeek V4.1 Flash max on cli-pi via the gateway, in that order |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every P0 and P1 finding is verified against the repository and either bound to a phase or recorded as reviewed with the reason |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The merged attribution table names kind and model for every lane and the merged registry has no unverified P0
- **SC-002**: The parent goal's last criterion is checked with the verdict cited
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

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---


