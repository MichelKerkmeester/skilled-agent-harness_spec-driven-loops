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
    last_updated_at: "2026-07-27T10:08:00Z"
    last_updated_by: "claude-code"
    recent_action: "This phase's own planning tasks complete; T001/T003-T010 deferred (future execution)"
    next_safe_action: "Commit; phase 007 proceeds with the MCP-dependency list"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Does pi-subagents support nested subagent-of-subagent dispatch, needed for T007 (Tier 4)? - deferred to a future execution phase"]
    answered_questions: ["13-agent count and tools:-scoped 11/13 MCP-dependency tally re-verified live at closeout, zero drift"]
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

- [x] T002 Re-run `find .claude/agents -name '*.md' | wc -l` at execution time to catch drift from this plan's 13-agent, 2026-07-27 snapshot. [EVIDENCE: re-ran live during closeout, still returns 13, zero drift]
- [B] T001 Re-confirm `pi` CLI is installed and the `pi install npm:<pkg>` verb syntax matches phase 1's live-probe result before installing `pi-subagents`. [DEFERRED: this phase's own scope is planning-only (spec.md §3 Out of Scope: "actually running `pi install npm:pi-subagents`... execution work for a later phase"); pi CLI 0.82.1 install is confirmed complete per 001's implementation-summary.md, but re-confirming immediately before an actual `pi-subagents` install is a future execution-phase step]
- [B] T003 Install `pi-subagents` via `pi install npm:pi-subagents` (or the corrected verb if phase 1 found a different syntax). [DEFERRED: out of this phase's scope per spec.md's Hard Constraint - this phase does not install pi-subagents or write any file under `.pi/`; a future execution phase performs this step]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T004 [P] Translate the 2 Tier 1 agents (`deep-improvement`, `prompt-improver`) to `.pi/agents/**/*.md`, using only the `name`/`description`/`tools` fields confirmed in plan.md §3. [DEFERRED: out of this planning phase's scope - no `.pi/` file is created here, per spec.md's Hard Constraint]
- [B] T005 [P] Translate the 5 Tier 2 agents (`code`, `debug`, `design`, `markdown`, `deep-research`), each carrying the single `mcp__mk_spec_memory__*` MCP dependency flagged "capability blocked pending phase 007" in the `tools:` line. [DEFERRED: out of this planning phase's scope, same reason as T004]
- [B] T006 Translate the 4 Tier 3 agents (`context`, `deep-alignment`, `deep-review`, `review`), each carrying the multi-server, named (non-wildcard) `mcp__mk_code_index__*` tool dependency. [DEFERRED: out of this planning phase's scope, same reason as T004]
- [B] T007 Translate the 2 Tier 4 agents (`ai-council`, `orchestrate`) only after the nested subagent-of-subagent dispatch question is resolved; if unsupported, document the capability loss instead of a literal translation. [DEFERRED: out of this planning phase's scope, same reason as T004; additionally blocked on the unresolved nested-dispatch open question (spec.md §7)]
- [B] T008 Apply the flat/unpackaged naming decision from spec.md §7 (bare names matching `.claude/agents/*.md`, no `package:` scope) across all 13 translated files, after confirming no collision against `pi-subagents`' builtin agents directory (`~/.pi/agent/extensions/subagent/agents/`). [DEFERRED: out of this planning phase's scope, same reason as T004]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T009 Confirm every translated `.pi/agents/**/*.md` file parses/loads without schema errors via `pi-subagents`' discovery/list surface — the exact 006→007 handoff criterion. [DEFERRED: out of this planning phase's scope, same reason as T004]
- [B] T010 Spot-check project-vs-global override semantics: create one deliberate project/user name collision and confirm the project `.pi/agents/**/*.md` version wins per the documented discovery order. [DEFERRED: out of this planning phase's scope, same reason as T004]
- [x] T011 Run `validate.sh --strict` for phase 006 [EVIDENCE: `implementation-summary.md` Verification table; `--recursive` against the `031-cli-pi-creation` parent is deferred to phase 011's closeout per the packet's own goal directive]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

This phase's own completion bar (planning-only, per its Hard Constraints) is: the inventory/mapping/tier/disposition tables are complete and re-verified live (T002, T011 — both `[x]`). T001/T003-T010 describe a FUTURE execution phase's work (installing `pi-subagents`, writing `.pi/agents/**/*.md`) and are correctly `[B]` blocked-deferred, not stalled — this phase does not perform them by design.

- [x] This phase's own planning deliverables (inventory, mapping, disposition, tier tables) are complete and re-verified live [EVIDENCE: T002, T011]
- [x] Every `[B]` task above carries an explicit `[DEFERRED: ...]` reason tied to this phase's own Hard Constraint, not a silent stall [EVIDENCE: T001, T003-T010]
- [x] `validate.sh --strict` passes `Errors: 0` for this phase's own docs [EVIDENCE: `implementation-summary.md` Verification table]
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

