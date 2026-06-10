---
title: "MCP to CLI Tool Transition"
description: "Phase-parent packet for transitioning the mk-spec-memory MCP surface to a CLI tool: feasibility research, dual-stack CLI delivery, and the eventual migration decision."
trigger_phrases:
  - "mcp to cli transition"
  - "028 transition"
  - "spec-memory cli phases"
  - "memory mcp cli"
  - "dual-stack cli program"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Implementation done, suites green; runtime T9xx drills pending"
    next_safe_action: "Run T9xx transport-down drills during dual-stack window"
    blockers: []
    key_files:
      - "spec.md"
      - "001-spec-memory-cli/spec.md"
      - "001-spec-memory-cli/000-spec-memory-cli-research/research/research.md"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "028 is the parent packet for the MCP-to-CLI transition; the completed feasibility/design/risk research lives under child phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: MCP to CLI Tool Transition (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-10 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mk-spec-memory MCP server (37 tools) is the spec-kit's continuity backbone, but the MCP transport carries real operational costs: a mid-session transport disconnect permanently removes the tools from a live session because Claude Code never reconnects MCP transports, every session pays tool-schema token overhead, and each runtime needs separate MCP registration. A CLI surface over the same daemon removes the transport fragility without losing any feature.

### Purpose

Transition the memory MCP surface to a CLI tool in phases: settle feasibility with evidence, ship a dual-stack CLI (MCP stays registered; CLI becomes the resilience + universal surface for hooks, cron, CI, and transport-down recovery), and only then decide on full migration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Feasibility, architecture, and risk research for replacing the MCP protocol layer with a CLI over the existing daemon/IPC socket.
- Dual-stack delivery: `spec-memory` CLI alongside the existing MCP registration, with auto-spawn, session-identity continuity, and the verified design-delta set.
- The eventual migration decision (move runtime surfaces off MCP references) as a later, separately-gated phase.

### Out of Scope

- MCP removal — the MCP registration stays through the dual-stack window.
- Daemon/launcher redesign — 028 adds no daemon changes; it binds the CLI to the daemon's existing tool-handler + IPC surface. (The launcher/lease/reap/re-election lifecycle evolved under packets 026/027/140/030 after this packet was drafted; the CLI auto-spawn path must target that current launcher contract — see each workstream's hardening phase.)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 001-spec-memory-cli/** | Complete | Research phase: feasibility, design, risk closure (done) |
| mcp_server/spec-memory-cli.ts, .opencode/bin/spec-memory.cjs | Complete | Dual-stack CLI implementation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Scope |
|-------|--------|--------|-------|
| 001 | `001-spec-memory-cli/` | Implementation complete, suites green; T9xx transport-down drill pending (dual-stack window open) | The spec-memory CLI workstream. Research record nested as `000-spec-memory-cli-research/` (four runs ending in GO + zero unknowns, 8 delta specs, 10–13d estimate); implementation children: `001-cli-core/` (build), `002-hardening-and-tests/` (regression-lock), `003-runtime-integration/` (adoption + dual-stack window) |
| 002 | `002-code-index-cli/` | Implementation complete, suites green; T9xx transport-down drill pending (dual-stack window open) | CLI-fallback workstream for `mk_code_index` (system-code-graph, 8 tools); phase 000 feasibility research, implementation phases on GO |
| 003 | `003-skill-advisor-cli/` | Implementation complete (tri-daemon program gate passed); T9xx transport-down drill pending (dual-stack window open) | CLI-fallback workstream for `mk_skill_advisor` (system-skill-advisor, 9 tools); phase 000 feasibility research incl. the skill_advisor.py reconcile-vs-supersede question |
| 004 | `004-release-and-program-cleanup/` | In progress | Post-release documentation alignment (release gate, modeled on 026's cleanup phase): skill/code/root READMEs, commands, agent rosters, references incl. ENV_REFERENCE env-var rows, feature catalogs + manual-testing playbooks, release changelog |
| 005+ | not yet created | Pending | Separately-gated follow-ons: migration of the measured MCP reference surfaces, then the MCP-retirement decision |

### Phase Transition Rules

- Each phase child carries its own full doc set (spec/plan/tasks/implementation-summary); this parent stays a lean control file.
- The implementation phase must absorb the 8 design deltas (D1–D7, DD-001) verbatim from `001-spec-memory-cli/000-spec-memory-cli-research/research/research.md` §14 and re-estimate as routine planning hygiene.
- Full migration of MCP references (measured: 93 files / 1,041 references) stays out of scope until the dual-stack window proves the CLI in production use.

### Runtime Pairing Requirement (program-wide)

Every CLI workstream ships PAIRED with its runtime integrations — a CLI nobody's runtime calls does not close the transport-down incident class:

- **Hooks** for Claude Code and Codex: the existing hook adapters (session/prompt-submit family under `system-spec-kit/mcp_server/hooks/<runtime>/` and `system-skill-advisor/hooks/<runtime>/`) gain a CLI-backed path — warm-only with `--timeout-ms`, fail-open, used when the MCP transport is down or as the preferred transport where measurement favors it.
- **An OpenCode plugin** per system: extend `mk-skill-advisor.js` and `mk-code-graph.js` (whose bridge needs a CLI/IPC-backed repair — the in-process import-only fix was reverted as a direct-DB dual-writer hazard; see workstream 002) with CLI-backed fallback; CREATE the missing spec-memory plugin (none exists today — memory access is currently MCP-only in OpenCode).
- Hook/plugin work lands in each workstream's runtime-integration phase and inherits the warm-only latency policy from the research records.
- **Gemini and Devin are excluded from pairing scope**: their framework surfaces were removed end-to-end after this packet was drafted (Gemini deprecated under packet 132; cli-devin + the entire Devin runtime/hook surface removed under packet 142). Neither is a gap or an acceptance blocker; the triad collapses to Claude Code + Codex (plus the per-system OpenCode plugin). Revisit only on operator direction.
- **Tri-daemon spawn drill (program gate)**: before the program's dual-stack window closes, run one drill spawning all three CLIs (spec-memory + code-index + skill-advisor) simultaneously in a single runtime/worktree — owned by the skill-advisor workstream's hardening phase, verifying all three launchers' lease/reap behavior under concurrent auto-spawn. Reap diverges by launcher (spec-memory transparent-recycles on SIGTERM; code-index and skill-advisor exit), so the drill pins `SPECKIT_DAEMON_REELECTION` and verifies respawn-lock serialization with no cross-daemon deadlock.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at parent level. Phase-001 research closed all feasibility and risk questions; implementation-phase questions belong to the next child packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `001-spec-memory-cli/spec.md` — CLI workstream phase parent (phase map)
- `001-spec-memory-cli/000-spec-memory-cli-research/spec.md` — completed research phase (verdict chain, generated findings fence)
- `001-spec-memory-cli/000-spec-memory-cli-research/research/research.md` — canonical merged synthesis (§1–14)
- `context-index.md` — packet reorganization bridge
