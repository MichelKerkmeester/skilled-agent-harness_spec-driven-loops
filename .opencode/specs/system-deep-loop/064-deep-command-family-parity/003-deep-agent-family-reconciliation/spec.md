---
title: "Feature Specification: reconcile the deep-* agents to create-agent (bless-the-dialect)"
description: "Update the sk-doc create-agent authoring guide and template to sanction the deep-loop leaf-iteration agents' lane-named section dialect (ROUTING SCAN / lane CONTRACT / STATE MANAGEMENT / lane ADVERSARIAL CHECK / RULES) and their MCP-tool-scoped permission keys as a documented, conformant shape — mirroring how create-command sanctions router variants — while leaving all six deep-* agent files unchanged."
trigger_phrases:
  - "deep agent create-agent reconciliation"
  - "bless the deep-loop agent dialect"
  - "create-agent sanctioned section vocabulary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/003-deep-agent-family-reconciliation"
    last_updated_at: "2026-07-13T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "WS5 bless-the-dialect implemented and verified"
    next_safe_action: "Roll up the 064 parent; hand off the packet for operator review/merge"
---
# Feature Specification: reconcile the deep-* agents to create-agent (bless-the-dialect)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Branch** | `wt/0036-deep-command-family-parity` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-doc/create-agent` authoring guide and template prescribe one canonical agent section skeleton (`CORE WORKFLOW` / `CAPABILITY SCAN` / `RUNTIME PARAMETERS` / … / `SUMMARY`). The six deep-loop leaf-iteration agents (`@deep-alignment` / `@deep-review` / `@deep-research`, each in `.opencode/agents/` and `.claude/agents/`) instead organize the same responsibilities under a lane-named dialect (`ROUTING SCAN`, a lane `CONTRACT`, `STATE MANAGEMENT`, a lane `ADVERSARIAL CHECK`, `RULES`). That dialect already passes `validate_document.py --type agent` — the validator hard-requires only `## 1. CORE WORKFLOW` — but the authoring guide never documents it as a sanctioned shape, so the family reads as drift against the standard. The operator directed reconciliation via **bless-the-dialect**: document the dialect as conformant rather than rewrite the agents.

### Purpose
Update create-agent (its `SKILL.md` guide and `assets/agent_template.md`) to name the deep-loop leaf-iteration dialect as a sanctioned section vocabulary and to sanction its MCP-tool-scoped permission keys — mirroring exactly how `create-command` sanctions its router variants (a named alternate shape + a template-level enumeration pointing at the real files). All six deep-* agent files stay unchanged: they already validate and are internally consistent.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `create-agent/SKILL.md` §3: a "Sanctioned Section-Vocabulary Dialects" subsection naming the deep-loop dialect and stating only `## 1. CORE WORKFLOW` is validator-required.
- `create-agent/assets/agent_template.md` §9: a "Deep-Loop Iteration Agents (sanctioned dialect)" entry giving the full and lean section orders and pointing at the six real files.
- `create-agent/assets/agent_template.md` §2: a note sanctioning MCP-tool-scoped `permission` keys (`code_graph_query`, `code_graph_context`, `detect_changes`) with their `.claude` `tools:` mirrors.

### Out of Scope
- Any change to the six deep-* agent files — they already pass `--type agent` and are not rewritten.
- Any change to the validator (`validate_document.py`) or `template_rules.json`.
- The alignment/ai-council parity (phase `001-pipeline-command-parity`), the direct-dispatch conversions (predecessor phase `002-direct-dispatch-to-yaml`), and the render-stub → inline-router promotion (successor phase `004-pipeline-command-router-inline`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-agent/SKILL.md` | Modify | §3 sanctioned-dialect subsection |
| `.opencode/skills/sk-doc/create-agent/assets/agent_template.md` | Modify | §9 dialect entry + §2 MCP permission-key note |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | create-agent SKILL.md names the deep-loop dialect as sanctioned | §3 subsection present |
| REQ-002 | agent_template.md §9 gives the full + lean section orders and real-file pointers | §9 entry present |
| REQ-003 | agent_template.md §2 sanctions the MCP-tool-scoped permission keys | §2 note present |
| REQ-004 | All six deep-* agents still pass `validate_document.py --type agent` | exit 0 each |
| REQ-005 | The six agent files are unchanged by this phase | No agent-file diff |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | create-agent skill packaging check introduces no new warnings | `package_skill.py --check` PASS, warnings pre-existing |
| REQ-007 | The sanction mirrors create-command's variant mechanism | Named shape + template enumeration + real-file pointers |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type agent` passes on all six deep-* agent files.
- **SC-002**: `package_skill.py --check` on create-agent returns PASS with only the pre-existing warnings (no new warning from these edits).
- **SC-003**: The six deep-* agent files show no diff for this phase.

### Acceptance Scenarios

- **Scenario 1**: **Given** an author reading create-agent, **when** they reach §3, **then** the deep-loop dialect is documented as a sanctioned alternate vocabulary, not drift.
- **Scenario 2**: **Given** the deep-loop dialect, **when** validated, **then** only `## 1. CORE WORKFLOW` is required and every agent passes.
- **Scenario 3**: **Given** an `.opencode` deep agent's `code_graph_*` permission keys, **when** an author checks the permission reference, **then** the MCP-tool-scoped keys are documented as sanctioned extensions.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting the six agents to the generic skeleton | Dropping HARD-BLOCK gates across large files | Chose bless-the-dialect; agents untouched |
| Risk | A new packaging-check warning from the edits | Skill drift | Confirmed `package_skill.py --check` PASS with only pre-existing warnings |
| Dependency | `create-command` variant mechanism as the model | Inconsistent sanction pattern | Mirrored its named-shape + template-enumeration approach |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime impact — documentation-only change to the authoring guide.

### Security
- **NFR-S01**: The MCP permission-key note preserves least-authority guidance ("grant only the scoped keys the role uses").

### Reliability
- **NFR-R01**: The six agents' validation status is unchanged — the sanction is descriptive, not enforced.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The sanction is scoped to the deep-loop iteration family; authors are told not to invent a fresh dialect for a one-off agent.

### Error Scenarios
- A future one-off agent copying the dialect without being a loop worker is explicitly discouraged in the §3 note.

### Concurrent Operations
- The change is additive prose in a shared authoring skill; it does not alter any agent's runtime behavior.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three additive prose edits in one shared authoring skill |
| Risk | 8/25 | Documentation-only; agents untouched; reversible |
| Research | 8/20 | Mapped the create-agent contract, the six-agent dialect, and create-command's variant mechanism |
| **Total** | **26/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. The bless-the-dialect approach is operator-locked and the sanction mechanism is settled by mirroring create-command.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
