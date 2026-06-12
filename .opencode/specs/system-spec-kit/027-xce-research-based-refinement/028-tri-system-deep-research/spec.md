---
title: "Feature Specification: Tri-System Deep Research Program [template:examples/level_1/spec.md]"
description: "Fifty-angle deep-research investigation of system-spec-kit, system-skill-advisor, and system-code-graph grounded in the 027 epic, executed as fifty gpt-5.5 read-only research iterations."
trigger_phrases:
  - "tri-system deep research"
  - "50 research angles"
  - "027 investigation program"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research"
    last_updated_at: "2026-06-12T00:50:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored 50 research angles and program scaffolding"
    next_safe_action: "Dispatch research iterations in pooled read-only seats"
---
# Feature Specification: Tri-System Deep Research Program

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-12 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 027 epic shipped twenty-four phases, a finding-remediation program, and a database recovery — but every review so far was scoped to shipped diffs. No systematic investigation has swept the three systems as they exist now for missed bugs, broken features, documentation drift, README misalignment, refinement debt, and feature opportunities.

### Purpose
Run a fifty-angle deep-research program over system-spec-kit, system-skill-advisor, and system-code-graph, one read-only gpt-5.5 research iteration per angle, producing a classified findings registry that seeds the next improvement wave.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author fifty research angles grounded in the 027 epic and current shipped state.
- Execute fifty read-only research iterations via cli-opencode gpt-5.5-fast (high).
- Orchestrator-written iteration, delta, and state artifacts plus a synthesized findings registry.

### Out of Scope
- Implementing fixes for findings (a successor packet owns remediation).
- Any write by a research seat (seats are read-only analysis only).
- Live daemon or database mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/deep-research-strategy.md` | Create | The fifty angles and iteration protocol |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/deep-research-config.json` | Create | Program configuration (50 iterations, executor, limits) |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/iterations/` | Create | One iteration report per angle |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/deltas/` | Create | One findings JSONL per iteration |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/028-tri-system-deep-research/research/research.md` | Create | Progressive synthesis and final findings registry |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fifty angles authored across the three systems | `research/deep-research-strategy.md` lists angles 1-50 with system coverage |
| REQ-002 | Fifty research iterations executed | `research/iterations/` holds 50 iteration reports; state records 50 completions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings classified and synthesized | `research/research.md` aggregates findings by class (bug, broken feature, doc drift, readme misalignment, refinement, new feature) with per-angle attribution |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 50/50 iterations complete with parseable findings JSON.
- **SC-002**: The synthesis ranks findings by severity and names the affected files for each.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Seat hallucination on plausible findings | False findings seed wasted remediation | Findings require file:line evidence; synthesis re-verifies high-severity claims |
| Dependency | Warm spec-memory daemon and quiet tree | Seats misread mid-maintenance state | Dispatch after the recovery chain completes |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
