---
title: "Tasks: integrate, validate, and ship the 138 command+agent canon-conformance packet"
description: "Task breakdown for the final child of the 138 packet: confirm children green, run validate.sh --recursive --strict to Errors:0, refresh parent metadata and roll up the parent, confirm every per-file gate, and record the FF-push and ~/.codex install as operator-gated deferrals."
trigger_phrases:
  - "138 integrate validate ship tasks"
  - "recursive strict validate tasks"
  - "138 parent rollup tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/004-integrate-validate-ship"
    last_updated_at: "2026-07-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Broke down integration gates and the two operator-gated ship tasks"
    next_safe_action: "Orchestrator strict-validates the packet; ship and home install stay operator-gated"
---
# Tasks: integrate, validate, and ship the 138 command+agent canon-conformance packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Confirm children 000–003 each pass `validate.sh --strict` at Errors:0 Warnings:0 (`.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/00{0,1,2,3}-*/`)
- [x] T002 Confirm the core conformance + parity work is committed on `skilled/0041-command-agent-canon` — doctor family, five more command families to create-command canon, codex agent-TOML parity gate, and `sync-prompts.cjs` + 37 thin router-prompts

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [B] Run `validate.sh --recursive --strict` on the whole packet → Errors:0 (orchestrator-run, after parent metadata is generated) (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T004 [B] Refresh parent metadata and roll the parent up — `generate-context.js` regenerates `description.json` + `graph-metadata.json`; status + `derived.last_active_child_id` reflect completed children (orchestrator-run) (`…/138-command-agent-canon-conformance/{description.json,graph-metadata.json}`)
- [ ] T005 Confirm every per-file gate green on the integrated tree — `validate_document.py --type command|agent`, `sync-agents.cjs --check`, `sync-prompts.cjs --check`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Author this child's Level-2 spec-doc set (spec/plan/tasks/checklist/implementation-summary + decision-record); evidence: six docs under `004-integrate-validate-ship/`, structure-clean via `template-structure.js compare` (0 missing/extra/out-of-order)
- [x] T007 Record the FF-push (`skilled/0041-command-agent-canon` → `origin/skilled/v4.0.0.0`) as an operator-gated Open Question; evidence: `spec.md` §7 + `decision-record.md` ADR-001
- [x] T008 Record the `~/.codex/prompts/` install + stale `create` symlink repair as an operator-gated Open Question; evidence: `spec.md` §7 + `decision-record.md` ADR-002

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All authoring + deferral-recording tasks marked `[x]` with evidence in `checklist.md` / `implementation-summary.md`
- [ ] `validate.sh --recursive --strict` on the packet → Errors:0 (orchestrator-run)
- [ ] Parent metadata refreshed + parent rolled up (orchestrator-run)
- [ ] Every per-file gate green on the integrated tree
- [ ] DEFERRED (operator confirmation): FF-push to `origin/skilled/v4.0.0.0`; `~/.codex/prompts/` install + symlink repair

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
