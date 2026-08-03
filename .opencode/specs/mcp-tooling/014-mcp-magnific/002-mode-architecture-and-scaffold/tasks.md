---
title: "Tasks: Magnific mode architecture and scaffold"
description: "Decision and scaffolding tasks for the nested mcp-magnific transport packet."
trigger_phrases: ["magnific architecture tasks", "mcp-magnific scaffold tasks", "magnific mode tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/002-mode-architecture-and-scaffold"
    last_updated_at: "2026-08-02T15:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Execute architecture and scaffold phase"
    next_safe_action: "Execute 003-mcp-runtime-integration"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "decision-record.md", "checklist.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-002", parent_session_id: null}
    completion_pct: 100
    open_questions: []
    answered_questions: ["Verified behavior supports packetKind transport (backendKind code-mode-remote-mcp).", "mcp-remote bridge accepted; direct streamable-HTTP registration deferred as documented-but-unverified."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Magnific mode architecture and scaffold

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read Phase 1 research and list every fixed versus unresolved contract field — fixed: transport, auth, bridge, tool names, credit classes; unresolved: live schemas, per-tool costs, job lifecycle, asset formats (U1–U9, `../001-official-mcp-research/research/research.md` §8) [evidence: `research.md` §1–5]
- [x] T002 Compare workflow and transport classifications against live mcp-tooling examples — refero/mobbin registry entries inspected: `packetKind: transport`, `backendKind: code-mode-remote-mcp`, forbidden Write/Edit/Task, `routingClass: metadata` [evidence: `mode-registry.json` entries mcp-refero/mcp-mobbin]
- [x] T003 [P] Inventory nested skill templates and legal package files — sk-create-skill nested-packet doctrine read: packet = SKILL.md + README.md + changelog/; no packet-local graph metadata; transport-axis extension already declared by hub [evidence: `parent-skills-nested-packets.md` §1–4]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Decide packet/backend kind, tool surface, aliases, and external-mutation posture — `packetKind: transport`, `backendKind: code-mode-remote-mcp`, allowed [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain], forbidden [Write, Edit, Task], `mutatesWorkspace: false`; aliases deferred to hub registration phase [evidence: `decision-record.md` ADR-001, packet `SKILL.md` §1]
- [x] T005 Decide runtime bridge, auth boundary, credit confirmation, destructive gate, and output policy — `npx -y mcp-remote https://mcp.magnific.com`; OAuth browser flow with tokens in `~/.mcp-auth/`; class→gate matrix frozen (read-only free; credit-consuming/training/destructive require confirmation with expected output + spend boundary) [evidence: `decision-record.md` ADR-002, ADR-004, ADR-006]
- [x] T006 Decide `sk-design` pairing and when the transport may execute without design judgment — `sk-design` loads before design-affecting execution; transport may execute already-approved transformations without re-deciding taste [evidence: `decision-record.md` ADR-005]
- [x] T007 Scaffold `.opencode/skills/mcp-tooling/mcp-magnific/` and remove mode-illegal metadata — SKILL.md (frozen contract), README.md, changelog/v0.1.0.0.md, references/README.md, examples/README.md; NO description.json/graph-metadata.json in the packet [evidence: packet inventory in `implementation-summary.md`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate package inventory and folder/name parity — inventory walk: 5 scaffold files, `folder == packetSkillName == mcp-magnific`, no packet-local advisor metadata; matches refero/mobbin shape [evidence: `find mcp-tooling/mcp-magnific` inventory]
- [x] T009 Confirm shared hub/runtime files are unchanged in this phase — no edits to mode-registry.json, hub-router.json, .utcp_config.json, .env.example, hub SKILL.md; git status scope check [evidence: change inventory in `implementation-summary.md`]
- [x] T010 Validate child docs and record accepted decisions — decision-record accepted; checklist completed; strict validation passed [evidence: validate.sh --strict exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] One architecture contract controls Phases 3–6 — frozen contract in packet SKILL.md §1–2 and decision-record ADR-001..006
- [x] Package skeleton is valid and safely removable — rollback: delete `mcp-tooling/mcp-magnific/` + later registry entry; no other mode touched (plan.md §7)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research**: `../001-official-mcp-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
