---
title: "Feature Specification: Codex hook/plugin parity for cli-codex"
description: "Give every Claude hook and OpenCode plugin a correct Codex 0.144.2 match via thin codex adapters over runtime-neutral cores, installed into the user-global hooks file and verified live."
trigger_phrases: ["Codex hook parity", "cli-codex hooks", "codex parity adapters"]
importance_tier: important
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T20:11:19Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped and verified; packet complete"
    next_safe_action: "Re-point installer at the primary checkout once it reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Codex hook/plugin parity for cli-codex
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY
Give Codex full hook/plugin parity with Claude and OpenCode. Child 004 shipped only the four session-lifecycle Codex adapters; this packet adds thin Codex adapters over the existing runtime-neutral guard cores (spec-gate, code-graph freshness, post-edit quality, CLI dispatch lint/audit, completion evidence), wires the neutral session scripts into Codex lifecycle events, handles the two non-portable guards honestly, and installs the result where Codex actually reads hooks — user-global `~/.codex/hooks.json`.

**Key decisions** (see `decision-record.md`): direct-core adapters as a third consumer of each core (ADR-002); deny-capable guards emit the Claude-shaped `permissionDecision: deny` (ADR-003); versioned repo source plus an idempotent installer into the user-global hooks file (ADR-004).

**Critical dependency**: the Codex 0.144.2 native hook contract, pinned from the binary schema plus a live probe.
<!-- /ANCHOR:executive-summary -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-codex-hook-adapter-layer/spec.md` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Child 004 shipped only the four Codex session-lifecycle adapters (SessionStart, UserPromptSubmit, Stop, PreCompact). Claude runs roughly fourteen hooks across eight events and OpenCode mirrors them as plugins, so Codex has no match for the tool-level guards (spec-gate, dispatch lint and audit, post-edit quality, code-graph freshness), the extra SessionStart guards (worktree, git-hooks, dist-staleness), the Stop completion sentinel, or session cleanup. Codex therefore runs sessions without the safety and continuity guardrails the other two runtimes enforce.
### Purpose
Give every Claude hook and OpenCode plugin a correct Codex match: build a thin Codex adapter over each existing runtime-neutral core where Codex has the surface, document honestly where it does not, install the result where Codex actually reads it, and verify each with both fixture and live checks.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Thin `runtime/hooks/codex/` adapters over the six guard cores plus the two CLI-dispatch cores.
- Wiring the four runtime-neutral shell/Python session scripts into Codex lifecycle events.
- Codex-native handling for the two guards whose Claude surface does not exist under Codex.
- An idempotent installer that merges the versioned repo hook set into user-global `~/.codex/hooks.json`.
- Fixture (stdin-pipe) plus live `codex exec` verification and a cli-codex manual testing playbook.
### Out of Scope
- Rewriting any runtime-neutral hook core, Claude hook, or OpenCode plugin.
- Defining `.codex/config.toml` `[profiles.*]` for `codex exec -p` agent dispatch.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `<skill>/runtime/hooks/codex/**` | Create | Thin Codex guard adapters over neutral cores. |
| `.codex/hooks.json` | Modify | Versioned source-of-truth hook registration. |
| `.opencode/bin/install-codex-hooks.mjs` | Create | Idempotent merge into `~/.codex/hooks.json`. |
| `cli-codex/manual_testing_playbook/**` | Create | Per-hook manual verification steps. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Every ported adapter reuses its neutral core unchanged | Diff shows no behavioral change to any core; adapter only translates payload and response. |
| REQ-002 | Adapters fail open | Empty or malformed stdin and internal errors exit 0 with no crash. |
| REQ-003 | Hooks reach the runtime surface | The installer merges into `~/.codex/hooks.json`, preserving Superset entries; a live session fires the new events. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-004 | Deny-capable guards block under Codex | spec-gate-enforce and dispatch-preflight-lint emit `permissionDecision: deny` and a live tool call is blocked. |
| REQ-005 | Honest scope for non-portable guards | The dormant route-guard state and the folded task-dispatch surface are documented, not faked. |
### P2 - Nice to have
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-006 | Adapters need no build step | Each adapter is a plain `.mjs`/`.cjs` that runs directly under node; no TypeScript compile is added. |
| REQ-007 | Installer is idempotent | Re-running the installer produces no duplicate entries (dedupe on identical command strings). |
| REQ-008 | No collateral change | Diff shows zero behavioral change to the neutral cores, the Claude hooks, or the OpenCode plugins. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Each Claude hook and OpenCode plugin has a Codex adapter, a documented Codex-native equivalent, or a documented capability gap.
- Every adapter passes a fixture smoke and fails open; a representative set is confirmed live under `codex exec`.
- Neutral cores, Claude hooks, and OpenCode plugins remain byte-unchanged.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Hooks run on every Codex session | A broken adapter degrades all sessions | Fail-open by construction; additive wiring; live smoke before closeout. |
| Risk | `~/.codex/hooks.json` is user-global machine config | Overwrites Superset or user entries | Installer backs up first and merges, never replaces. |
| Dependency | Codex 0.144.2 hook contract | Wrong envelope silently no-ops | Pinned in the decision record from the binary schema and a live probe. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Performance
- **NFR-P01**: Each adapter is a thin translator that calls its core and returns; it adds no work beyond the core's existing per-hook budget and the registered Codex timeout (lifecycle 2.8s; guard hooks short).
### Reliability
- **NFR-R01**: Every adapter fails open — empty or malformed stdin, or any internal error, exits 0 with no emit. A broken adapter never blocks or degrades a Codex session.
### Security
- **NFR-S01**: The installer backs up `~/.codex/hooks.json` before writing and merges rather than replaces, preserving Superset `notify.sh` and user entries.
### Portability
- **NFR-PO1**: Adapters are plain `.mjs`/`.cjs` with no build step; the installer is idempotent and reproducible on any machine.
<!-- /ANCHOR:nfr -->
<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- **Empty / malformed stdin**: exit 0, no emit (fail open).
- **Unmatched tool name**: matcher scoping plus an in-adapter guard means non-target tools are approved/no-op.
- **Future Codex drops deny support**: the deny-capable adapter still fails open (advisory), so the failure mode stays safe.
- **`~/.codex/hooks.json` already holds the entries**: the installer dedupes on identical command strings, so re-runs are no-ops.
- **`~/.codex/hooks.json` missing**: the installer creates it (and backs up any existing file first).
<!-- /ANCHOR:edge-cases -->
<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT
Level 3. The complexity is in **breadth**, not depth: ~9 new adapter files plus one installer touch six skills' runtime hook trees, `mcp_server`, and user-global machine config — but each adapter is ~15–25 LOC and every neutral core stays byte-unchanged. The load-bearing risk is live-runtime verification (Codex fires and honors the hooks), not the code. Blast radius: hooks run on every Codex session, mitigated by fail-open construction and additive wiring.
<!-- /ANCHOR:complexity -->
<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | A broken adapter degrades every Codex session | H | L | Fail-open by construction; fixture smoke + live matrix before closeout |
| R-002 | Installer overwrites Superset/user entries in `~/.codex/hooks.json` | H | L | Backup `.bak-<ts>` first; merge-never-replace; dedupe on command string |
| R-003 | Codex silently ignores a wrong response envelope | M | L | Contract pinned from the 0.144.2 binary schema plus a live probe |
| R-004 | Deny path unconfirmed behaviorally | M | M | Schema-confirmed deny; live matrix in Phase 5; fail-open fallback |
<!-- /ANCHOR:risk-matrix -->
<!-- ANCHOR:user-stories -->
## 11. USER STORIES
### US-001: Codex sessions get the same guardrails (Priority: P0)
**As a** developer running Codex, **I want** the spec-gate, dispatch, freshness, and post-edit guards to fire, **so that** Codex sessions get the same safety and continuity rails Claude and OpenCode already enforce.
### US-002: A deny-capable guard actually blocks (Priority: P1)
**As a** developer, **I want** spec-gate-enforce to block an out-of-scope edit under Codex, **so that** the guard's safety property is preserved, not just advisory.
### US-003: Reproducible install (Priority: P1)
**As a** maintainer, **I want** an idempotent installer that merges into `~/.codex/hooks.json`, **so that** hook parity is reproducible on any machine without hand-editing user config.
<!-- /ANCHOR:user-stories -->
<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS
- None blocking. Live deny-behavioral confirmation is folded into the Phase 5 test matrix; capability is already settled from the 0.144.2 binary schema (see `decision-record.md`).
<!-- /ANCHOR:questions -->
<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../004-codex-hook-adapter-layer/spec.md`
<!-- /ANCHOR:related-docs -->
