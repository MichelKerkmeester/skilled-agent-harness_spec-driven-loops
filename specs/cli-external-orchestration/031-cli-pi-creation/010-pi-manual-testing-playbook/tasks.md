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
    last_updated_at: "2026-07-27T11:36:00Z"
    last_updated_by: "claude-code"
    recent_action: "Setup tasks re-verified live; T005-T015 deferred to a future execution phase"
    next_safe_action: "Commit; phase 011 re-judges playbook proportionality at closeout"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-planning"
      parent_session_id: null
    completion_pct: 90
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

- [x] T001 Read `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` + `006-cursor-manual-testing-playbook` as precedent [EVIDENCE: `spec.md` §9 table structure mirrors the cited precedent's shape]
- [x] T002 Read `sk-doc/create-manual-testing-playbook/SKILL.md` for the canonical contract [EVIDENCE: `plan.md` §3 Key Components names the exact banner/section set from that contract]
- [x] T003 Verify real repo counts [EVIDENCE: re-ran live during closeout - `find .claude/agents -name '*.md' | wc -l` returns 13, `grep -rl "^argument-hint:" .opencode/commands` returns 36, `.mcp.json` lists 5 native servers - all match `spec.md`'s existing figures, zero drift]
- [x] T004 Sketch the 8-category / 19-`PI-NNN` Scenario Coverage Plan [EVIDENCE: `spec.md` §9, 19 rows across 8 categories, re-verified against phases 001/007/008/009's real landed facts during this closeout]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

FUTURE authoring pass - gated on phases 001-009 landing live-verified facts. NOT executed by this dispatch.

- [B] T005 Author the root `manual-testing-playbook.md` [DEFERRED: out of this planning phase's own scope per its Hard Constraint - creating any file under `cli-pi/manual-testing-playbook/` is explicitly out of scope; a future execution phase performs this step]
- [B] T006 Author `cli-invocation`/`skill-discovery` scenarios [DEFERRED: same reason as T005]
- [B] T007 [P] Author `command-dispatch`/`agent-bridge` scenarios [DEFERRED: same reason as T005]
- [B] T008 [P] Author `mcp-host-integration` scenarios [DEFERRED: same reason as T005; phase 007's docs-level narrowing (stdio now documented) is already reflected in `spec.md` §9's `PI-011` row for the future authoring pass to consume]
- [B] T009 [P] Author `hook-extension-layer` scenarios [DEFERRED: same reason as T005; phase 008's type-confirmed 32-event set is already reflected in `spec.md` §9's `PI-015` row]
- [B] T010 [P] Author `model-dispatch`/`prompt-quality` scenarios [DEFERRED: same reason as T005; phase 009's real 7-model roster is already reflected in `spec.md` §9's `PI-017`/`PI-018` rows]
- [B] T011 Add the playbook cross-reference into `cli-pi/SKILL.md` [DEFERRED: same reason as T005 - editing `cli-pi/SKILL.md` is explicitly out of this phase's own scope]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

FUTURE authoring pass - gated on Phase 2 above.

- [B] T012 Run `validate_document.py` on the root file and all 19 scenario files [DEFERRED: gated on T005-T010, no playbook files exist yet]
- [B] T013 Verify category/scenario counts and the `cli-pi/SKILL.md` cross-reference [DEFERRED: gated on T005-T011]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T014 (this-phase) `validate.sh --strict` passes with 0 structural errors; SC-001..SC-003 reflect planning-stage status honestly [EVIDENCE: via the main-tree metadata round-trip pattern, recorded in the commit; SC-001 is the planning artifact itself, SC-002/SC-003 explicitly note what remains unconfirmed]
- [B] T015 (future) `validate.sh --strict` re-run after the real playbook exists [DEFERRED: gated on T005-T013, a future execution phase's own closeout]
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
