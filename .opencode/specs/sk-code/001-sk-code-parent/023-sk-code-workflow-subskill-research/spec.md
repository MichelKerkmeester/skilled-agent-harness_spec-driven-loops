---
title: "Feature Specification: Deep research — refine and upgrade the sk-code workflow sub-skills"
description: "Ten-iteration deep-research investigation into how to make the four sk-code WORKFLOW sub-skills (code-implement, code-quality, code-debug, code-verify) materially more useful — surfacing gaps, overlaps, and friction across each SKILL.md, references, and assets, and producing ranked, evidence-grounded upgrade proposals for a later implementation packet."
trigger_phrases:
  - "sk-code workflow subskill research"
  - "refine sk-code sub-skills"
  - "code-implement code-quality code-debug code-verify research"
importance_tier: "high"
contextType: "research"
parent: "skilled-agent-orchestration"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research"
    last_updated_at: "2026-07-05T14:45:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Research packet scaffolded; deep-research loop being launched"
    next_safe_action: "Run 10 productive iterations, converge, synthesize ranked recommendations, memory save"
---
# Feature Specification: Deep research — refine and upgrade the sk-code workflow sub-skills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code parent hub exposes four WORKFLOW sub-skills — `code-implement`, `code-quality`, `code-debug`, `code-verify` — that carry the day-to-day coding lifecycle. They have grown independently across many packets, and it is unclear where each is genuinely useful, where they overlap or leave gaps, and where their SKILL.md guidance, references, or assets create friction rather than leverage. There is no evidence-grounded map of how to make them materially more useful.

### Purpose
Run a bounded deep-research investigation (ten productive iterations) that studies each of the four workflow sub-skills — its `SKILL.md`, its `references/`, and its `assets/` — assesses real usefulness, gaps, overlaps, and friction, and produces a ranked set of concrete, evidence-grounded upgrade proposals (per-skill and cross-cutting). This packet delivers the RESEARCH and synthesis only; the implementation of the accepted proposals is a separate follow-up packet.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Study the four sk-code workflow sub-skills at `.opencode/skills/sk-code/{code-implement,code-quality,code-debug,code-verify}/` — each `SKILL.md`, `references/`, and `assets/`.
- Assess usefulness, coverage gaps, cross-skill overlap, redundancy, and friction (routing, invocation, verification ladders, output contracts).
- Compare against the hub router contract (`mode-registry.json`, `hub-router.json`, `shared/references/smart_routing.md`) and the manual-testing playbook to ground claims in how the skills actually route and load.
- Explore multiple angles across iterations (per-skill deep-dives, cross-skill seams, the implement→quality→debug→verify lifecycle, comparison to sibling hub patterns).
- Produce a ranked, evidence-grounded synthesis of upgrade proposals with rationale and expected leverage.

### Out of Scope
- Implementing any of the proposals (a separate follow-up packet owns implementation).
- The surface sub-skills (`code-webflow`, `code-opencode`, `code-animation`) and the `code-review` workflow — the four lifecycle sub-skills are the focus.
- Re-baselining the sk-code Lane-C benchmark or rewriting the manual-testing-playbook gold (separate handoff).
- Editing the sub-skills themselves during this research phase.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/research/` | Create | Deep-research artifacts: state log, iterations, deltas, strategy, dashboard, synthesis |
| `.opencode/specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/{description,graph-metadata}.json` | Create | Spec-folder metadata for memory-search visibility |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Ten productive research iterations execute | The deep-research state log records ten productive iterations (or documented convergence) with externalized state | operator directive "10 iters of deep research" |
| REQ-002 | All four workflow sub-skills are studied with evidence | Each of code-implement, code-quality, code-debug, code-verify has findings citing its SKILL.md, references, or assets | scope |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-003 | Ranked, evidence-grounded synthesis produced | A synthesis ranks concrete upgrade proposals (per-skill + cross-cutting) with rationale and expected leverage | purpose |
| REQ-004 | Findings saved to memory | The research packet is indexed and the synthesis is memory-saved for the follow-up implementation packet | continuity |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-005 | Comparison to sibling hub patterns | Findings note where sk-design / deep-loop patterns inform sk-code sub-skill upgrades | cross-cutting angle |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten productive iterations (or documented convergence) recorded in the deep-research state. [EVIDENCE: 8 productive iterations; converged at iteration 8 with newInfoRatio 0.00]
- **SC-002**: All four workflow sub-skills covered with cited evidence. [EVIDENCE: research.md covers code-implement/quality/debug/verify with source-cited findings]
- **SC-003**: A ranked synthesis of upgrade proposals exists and is memory-saved. [EVIDENCE: research.md Final Ranked Upgrade Proposals section; memory-saved at close-out]

### Acceptance Scenarios

- **Scenario 1**: **Given** the four sub-skills are studied, **when** the synthesis is produced, **then** each proposal cites concrete evidence from a SKILL.md, reference, or asset.
- **Scenario 2**: **Given** ten iterations run, **when** convergence or the iteration cap is reached, **then** the state log and synthesis are internally consistent.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research converges early with thin coverage | Shallow proposals | Anti-convergence min-iterations; broaden angles each iteration |
| Risk | Shared deep-loop runtime state with other research runs | State interleave | Isolated spec-folder + distinct lineage session |
| Dependency | Executor cli-opencode GPT-5.5 availability | Blocks iteration execution | Headless dispatch with per-iteration timeout; fall back if unavailable |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Research state is externalized (append-only state log, write-once iterations) so the run is resumable.

### Maintainability
- **NFR-M01**: The synthesis is structured for direct consumption by the follow-up implementation packet.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The research reads the sub-skills read-only; it does not edit them during this phase.

### Error Scenarios
- If the executor stalls on an iteration, the per-iteration timeout bounds it and the loop continues or halts with recorded state.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Bounded research over four sub-skills |
| Risk | 8/25 | Read-only research; main risk is coverage depth |
| Research | 18/20 | The packet is itself a research investigation |
| **Total** | **38/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. Implementation of accepted proposals is deferred to a follow-up packet.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Research artifacts**: See `research/`
- **Parent hub**: `.opencode/skills/sk-code/`

<!-- /ANCHOR:related-docs -->
