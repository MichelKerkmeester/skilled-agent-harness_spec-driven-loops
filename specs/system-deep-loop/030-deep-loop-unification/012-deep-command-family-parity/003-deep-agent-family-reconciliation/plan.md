---
title: "Implementation Plan: reconcile the deep-* agents to create-agent (bless-the-dialect)"
description: "Document the deep-loop leaf-iteration agent dialect as sanctioned in create-agent, mirroring create-command's variant mechanism, without rewriting the six agents."
trigger_phrases:
  - "deep agent create-agent reconciliation"
  - "bless the deep-loop agent dialect"
  - "create-agent sanctioned section vocabulary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/003-deep-agent-family-reconciliation"
    last_updated_at: "2026-07-13T14:30:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the bless-the-dialect edits"
    next_safe_action: "Roll up the 064 parent"
---
# Implementation Plan: reconcile the deep-* agents to create-agent (bless-the-dialect)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown authoring guide + template |
| **Framework** | sk-doc create-agent authoring skill |
| **Storage** | `.opencode/skills/sk-doc/create-agent/` |
| **Testing** | `validate_document.py --type agent`, `package_skill.py --check` |

### Overview
The deep-loop leaf-iteration agents use a lane-named section dialect that the validator already accepts but the create-agent guide never sanctions. Rather than rewrite six large agent files (risking dropped HARD-BLOCK gates), document the dialect as a first-class sanctioned shape — exactly as create-command already sanctions its router variants — and sanction the dialect's MCP-tool-scoped permission keys. The six agents are untouched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The create-agent canonical skeleton + variant discussion read directly.
- [x] The six-agent dialect vocabulary confirmed (full + lean sub-variants).
- [x] The create-command variant mechanism identified as the model to mirror.

### Definition of Done
- [x] create-agent SKILL.md + template document the dialect as sanctioned.
- [x] All six deep-* agents still pass `--type agent`.
- [x] create-agent packaging check PASS with no new warnings.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Descriptive sanction, not enforcement: name the alternate section vocabulary, declare what stays required (`## 1. CORE WORKFLOW`), enumerate the concrete instances in the template, and point at the real files — the same four-part pattern `create-command` uses for router variants.

### Key Components
- **create-agent/SKILL.md §3**: the guide-level sanction subsection.
- **agent_template.md §9**: the template-level enumeration (full + lean orders + file pointers).
- **agent_template.md §2**: the MCP-tool-scoped permission-key extension note.
- **validate_document.py / template_rules.json**: unchanged; already tolerate the dialect.

### Data Flow
An author reading create-agent now sees the dialect sanctioned in the guide and enumerated in the template; the validator's behavior is unchanged because the dialect already satisfied the single required section.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Map the create-agent contract, the six-agent dialect, and create-command's variant mechanism.

### Phase 2: Core Implementation
- [x] Add the SKILL.md §3 sanctioned-dialect subsection.
- [x] Add the template §9 dialect entry and the §2 MCP permission-key note.

### Phase 3: Verification
- [x] Re-validate all six agents; run the create-agent packaging check; confirm no agent-file diff.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Agent conformance | All six deep-* agents | `validate_document.py --type agent` |
| Skill packaging | create-agent | `package_skill.py --check` |
| No-diff invariant | Six agent files | `git status` / diff |
| Spec validation | This child | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-command variant mechanism | Internal | Green | No model to mirror the sanction on |
| `validate_document.py` agent rules | Internal | Green | The dialect must remain validator-accepted |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The sanction misstates the dialect or introduces a packaging warning.
- **Procedure**: `git checkout` the two create-agent files; the change is additive prose and fully reversible.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30 minutes |
| Core Implementation | Low | 25 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **70 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed the six agents pass before and after the edits.
- [x] Confirmed the packaging check PASS with only pre-existing warnings.

### Rollback Procedure
1. `git checkout` `create-agent/SKILL.md` and `create-agent/assets/agent_template.md`.
2. Re-run `package_skill.py --check` to confirm the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — additive documentation prose only.

<!-- /ANCHOR:enhanced-rollback -->
