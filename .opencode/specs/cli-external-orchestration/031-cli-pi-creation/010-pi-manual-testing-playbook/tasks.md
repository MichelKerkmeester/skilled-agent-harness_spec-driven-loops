---
title: "Tasks: Pi manual-testing playbook (planning)"
description: "Task breakdown for the Pi manual-testing playbook planning phase, plus the FUTURE authoring pass this plan targets."
trigger_phrases:
  - "pi manual testing playbook tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/010-pi-manual-testing-playbook"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md; Setup done, rest scoped to future pass"
    next_safe_action: "Run validate.sh --strict on this phase's own docs"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pi manual-testing playbook (planning)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` (root) + `cli-cursor-creation/006-cursor-manual-testing-playbook/{spec,plan,tasks,checklist}.md` as the structural and tone precedent (`../030-cli-cursor-creation/006-cursor-manual-testing-playbook/`)
- [ ] T002 Read `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` for the canonical package contract, per-feature template, and validation gates
- [ ] T003 Verify real repo counts grounding the future `command-dispatch`/`agent-bridge` categories: `.claude/agents/*.md` file count; command groups under `.opencode/commands/`; native MCP server list and transport shape in `.mcp.json`
- [ ] T004 Sketch the 8-category / 19-`PI-NNN` Scenario Coverage Plan (`spec.md` §9) against the 7 required capability areas (install/contract, skill discovery, command dispatch, agent bridge, MCP host integration, hook/extension behavior, model dispatch) plus one cli-family-generic addition (`prompt-quality`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

FUTURE authoring pass - gated on phases 001-009 landing live-verified facts. NOT executed by this dispatch.

- [ ] T005 Author the root `manual-testing-playbook.md` under `cli-pi/manual-testing-playbook/` (EXECUTION POLICY + SELF-INVOCATION GUARD banners; Global Preconditions gating on Pi CLI install + provider auth, citing phase 001's confirmed self-invocation signal and headless exit-code semantics)
- [ ] T006 Author `cli-invocation` (`PI-001`..`PI-003`) and `skill-discovery` (`PI-004`..`PI-006`) scenarios
- [ ] T007 [P] Author `command-dispatch` (`PI-007`..`PI-008`) and `agent-bridge` (`PI-009`..`PI-010`) scenarios
- [ ] T008 [P] Author `mcp-host-integration` (`PI-011`..`PI-013`), using phase 007's live-confirmed stdio-transport result (not an assumption) for `PI-011`
- [ ] T009 [P] Author `hook-extension-layer` (`PI-014`..`PI-016`), using phase 008's live-confirmed lifecycle-event list for `PI-015`
- [ ] T010 [P] Author `model-dispatch` (`PI-017`..`PI-018`) and `prompt-quality` (`PI-019`) scenarios
- [ ] T011 Add the playbook cross-reference into `cli-pi/SKILL.md` (once phase 003 has shipped that file)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

FUTURE authoring pass - gated on Phase 2 above.

- [ ] T012 Run `validate_document.py` on the root file and all 19 scenario files - 0 structural errors across all files
- [ ] T013 Verify via `grep -rhoE "PI-[0-9]{3}"`: 8 category directories present, scenario count in the 17-20 range, `PI-001`..`PI-0NN` sequential and gap-free; confirm the `cli-pi/SKILL.md` cross-reference via `git diff`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T014 (this-phase) `validate.sh 010-pi-manual-testing-playbook --strict` passes with 0 structural errors; SC-001..SC-003 in `spec.md` reflect planning-stage status honestly (no premature "MET" claims)
- [ ] T015 (future) `validate.sh 010-pi-manual-testing-playbook --strict` re-run after the real playbook exists; tasks T001-T013 above marked `[x]`; an `implementation-summary.md` authored at that time, once this phase has genuinely built and verified the playbook
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Depends on phases 001 (contract), 003 (skill packet), 007 (MCP), 008 (extensions), 009 (models) for the future authoring pass's live facts.
- Structural precedent: `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/`, `../030-cli-cursor-creation/006-cursor-manual-testing-playbook/`.
- Successor: `../011-docs-agents-governance-and-closeout/` (re-judges this playbook's proportionality against the sibling playbooks).
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
