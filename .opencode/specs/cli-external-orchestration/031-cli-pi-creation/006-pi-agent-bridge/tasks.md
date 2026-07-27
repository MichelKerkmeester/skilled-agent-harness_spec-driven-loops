---
title: "Tasks: Pi agent bridge (pi-subagents third-party translation)"
description: "Task breakdown for the future execution phase: install pi-subagents, translate the 13 real .claude/agents/*.md files in 4 tiers, and verify parse/override behavior."
trigger_phrases:
  - "pi agent bridge tasks"
  - "pi-subagents translation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/006-pi-agent-bridge"
    last_updated_at: "2026-07-27T08:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md: 11 tasks across Setup/Implementation/Verification"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files: ["plan.md", "spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: ["Does pi-subagents support nested subagent-of-subagent dispatch, needed for T007 (Tier 4)?"]
    answered_questions: []
---
# Tasks: Pi agent bridge (pi-subagents third-party translation)

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

- [ ] T001 Re-confirm `pi` CLI is installed and the `pi install npm:<pkg>` verb syntax matches phase 1's live-probe result before installing `pi-subagents`. [EVIDENCE: command output cited in a future `implementation-summary.md`.]
- [ ] T002 Re-run `find .claude/agents -name '*.md' | wc -l` at execution time to catch drift from this plan's 13-agent, 2026-07-27 snapshot. [EVIDENCE: count matches, or a documented delta is reconciled before translation starts.]
- [ ] T003 Install `pi-subagents` via `pi install npm:pi-subagents` (or the corrected verb if phase 1 found a different syntax). [EVIDENCE: install command output/exit code cited.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Translate the 2 Tier 1 agents (`deep-improvement`, `prompt-improver`) to `.pi/agents/**/*.md`, using only the `name`/`description`/`tools` fields confirmed in plan.md §3. [EVIDENCE: 2 files created; each parses via `pi-subagents`' discovery/list surface.]
- [ ] T005 [P] Translate the 5 Tier 2 agents (`code`, `debug`, `design`, `markdown`, `deep-research`), each carrying the single `mcp__mk_spec_memory__*` MCP dependency flagged "capability blocked pending phase 007" in the `tools:` line. [EVIDENCE: 5 files created; each parses; the MCP-blocked flag is visible in the file body or a companion note.]
- [ ] T006 Translate the 4 Tier 3 agents (`context`, `deep-alignment`, `deep-review`, `review`), each carrying the multi-server, named (non-wildcard) `mcp__mk_code_index__*` tool dependency. [EVIDENCE: 4 files created; each parses; named-tool translation behavior documented (accepted, rejected, or silently dropped).]
- [ ] T007 [B] Translate the 2 Tier 4 agents (`ai-council`, `orchestrate`) only after the nested subagent-of-subagent dispatch question is resolved; if unsupported, document the capability loss instead of a literal translation. [EVIDENCE: 2 files created, OR a documented, explicit capability-loss note if `pi-subagents` cannot dispatch further subagents.]
- [ ] T008 Apply the flat/unpackaged naming decision from spec.md §7 (bare names matching `.claude/agents/*.md`, no `package:` scope) across all 13 translated files, after confirming no collision against `pi-subagents`' builtin agents directory (`~/.pi/agent/extensions/subagent/agents/`). [EVIDENCE: `pi-subagents` discovery output shows no unintended name shadowing.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm every translated `.pi/agents/**/*.md` file parses/loads without schema errors via `pi-subagents`' discovery/list surface — the exact 006→007 handoff criterion. [EVIDENCE: command output showing 13/13 (or documented fewer, per T007) agents loaded with zero parse errors.]
- [ ] T010 Spot-check project-vs-global override semantics: create one deliberate project/user name collision and confirm the project `.pi/agents/**/*.md` version wins per the documented discovery order. [EVIDENCE: the winning agent's content matches the project file, not the user-level file.]
- [ ] T011 Run `validate.sh --recursive --strict` for phase 006 and the `031-cli-pi-creation` parent. [EVIDENCE: `Errors: 0` reported for both.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 13 agents translated and tiered per plan.md §3, or Tier 4's 2 agents have a documented capability-loss note instead.
- [ ] No `[B]` blocked tasks remain (T007's block clears once the nested-dispatch open question resolves).
- [ ] `pi-subagents` discovery confirms 13/13 (or 11/13 plus 2 documented exceptions) parse cleanly.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` §3 for the inventory, field-mapping, disposition, and tier tables these tasks execute
- **Verification**: See `checklist.md`
- **Predecessor**: `../005-pi-command-layer/`
- **Successor**: `../007-pi-mcp-host-integration/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

