---
title: "Feature Specification: Presentation Adherence Research [template:examples/level_1/spec.md]"
description: "Ten-angle research program into presentation-contract adherence of dispatched models running the upgraded command families, executed with MiMo v2.5 Pro and DeepSeek v4 Pro at high reasoning."
trigger_phrases:
  - "presentation adherence research"
  - "10 adherence angles"
  - "command adherence program"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research"
    last_updated_at: "2026-06-12T00:50:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored 10 adherence angles and program scaffolding"
    next_safe_action: "Dispatch research iterations in pooled read-only seats"
---
# Feature Specification: Presentation Adherence Research

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
Live bare-command tests showed mixed presentation-contract adherence: the doctor router menu and Gate-3 blocks rendered verbatim while /memory:search ignored its parseable render template and answered in free prose. The command split needs a grounded explanation and a fix plan.

### Purpose
Run a ten-angle research program with two heterogeneous high-reasoning models over the live command tree, producing a convergent diagnosis and a ranked recommendation set for adherence-by-construction.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author ten adherence angles grounded in the captured bare-command transcripts.
- Execute ten read-only iterations: five MiMo v2.5 Pro (high), five DeepSeek v4 Pro (high).
- Orchestrator-written iteration, delta, and state artifacts plus a synthesized findings registry.

### Out of Scope
- Implementing fixes for findings (a successor packet owns remediation).
- Any write by a research seat (seats are read-only analysis only).
- Live daemon or database mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research/research/deep-research-strategy.md` | Create | The fifty angles and iteration protocol |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research/research/deep-research-config.json` | Create | Program configuration (50 iterations, executor, limits) |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research/research/iterations/` | Create | One iteration report per angle |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research/research/deltas/` | Create | One findings JSONL per iteration |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/006-presentation-adherence-research/research/research.md` | Create | Progressive synthesis and final findings registry |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ten adherence angles authored | `research/prompts/` holds one brief per angle covering structure, phrasing, fill protocol, and enforcement |
| REQ-002 | Ten research iterations executed across both models | `research/iterations/` holds 10 reports; state records 10 completions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings classified and synthesized | `research/research.md` aggregates findings by class (bug, broken feature, doc drift, readme misalignment, refinement, new feature) with per-angle attribution |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10/10 iterations complete (prose seats distilled with the full output preserved).
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
