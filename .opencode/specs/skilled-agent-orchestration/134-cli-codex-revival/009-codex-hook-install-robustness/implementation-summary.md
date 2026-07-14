---
title: "Implementation Summary: Codex hook install robustness"
description: "Containment shipped (interim re-anchor of 14 stale worktree-anchored mk entries, backed up and live-verified); the durable convergent-installer fix is planned, approval-gated, and NOT implemented. Carries the DONE/PLANNED split and the decision map."
trigger_phrases: ["Codex hook install robustness summary", "codex re-anchor containment status"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped interim re-anchor containment; scoped the durable fix; authored the planning packet"
    next_safe_action: "run the OPEN PROBE, then implement D2/D3 in install-codex-hooks.mjs"
    blockers: ["Durable fix D2/D3/D4 is approval-gated; not yet implemented", "OPEN PROBE (D4 pre-req) unresolved"]
    completion_pct: 20
    open_questions: ["How does Codex 0.144.x treat a hook command's non-zero exit?"]
    answered_questions: []
---
# Implementation Summary: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 009-codex-hook-install-robustness |
| **Status** | In Progress |
| **Status detail** | Containment shipped; durable fix planned + approval-gated |
| **Level** | 3 |
| **Predecessor** | `../007-codex-hook-parity` |
| **Started** | 2026-07-14 |
| **Completed** | — (durable fix not implemented) |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built

**DONE (shipped this session):**
- **Containment — interim re-anchor.** Rewrote all 14 stale `…/Public/.worktrees/0038-codex-hook-parity` mk command prefixes → the primary checkout `…/Public` in `~/.codex/hooks.json`. Precondition verified (all referenced files exist in MAIN; 0 byte-diffs). Backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32`. Post-state: MAIN-repo 16, superset-notify 3, worktree 0. Live smoke (`codex exec` gpt-5.5 low, read-only): SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed. This removes the reap → silent dormancy risk TODAY.
- **Two-model consult + adjudication.** SOL (ultra) and Fable-5, each grounded in reads of `install-codex-hooks.mjs`; orchestrator adjudicated in favor of Fable's plan. Recorded as ADR-001…ADR-006 (+ ADR-007 open probe, ADR-008 containment).

**PLANNED and APPROVAL-GATED (NOT implemented):**
- Convergent/repair-default installer (D2): reconcile mk-owned entries by `(owner,event,matcher,hookId)` with full command+anchor rewrite; preserve Superset/unknown verbatim; atomic temp+rename on change; non-mutating `--check`.
- Linked-worktree anchor refusal (D3).
- Fail-loud inline `||` emit + cross-runtime `--check` watchdog wired into the Claude/OpenCode SessionStart chain (D4).
- Source `.codex/hooks.json` dedupe of the doubled SessionStart groups (D6).
- OPEN PROBE (D4 pre-req): Codex 0.144.x non-zero hook-exit behavior.

### Decision map (SOL proposal → adjudicated)

| Item | SOL | Adjudicated | Where |
|---|---|---|---|
| Runtime dispatcher / global router | P0 verdict | REJECT (redundant, unnecessary, anti-correct, ACE) | ADR-001 |
| Convergent/repair-default installer | P0 | ADOPT (drop `--reanchor`) | ADR-002 |
| Linked-worktree anchor refusal | (missed) | ADD | ADR-003 |
| Fail-loud | P1 standalone global checker | Inline `||` + cross-runtime `--check`, no global artifact | ADR-004 |
| Launcher shim + LaunchAgent | P2 | CUT | ADR-005 |
| Source dedupe | (missed) | DEDUPE | ADR-006 |
| Codex non-zero-exit behavior | — | OPEN PROBE (gates D4 emit) | ADR-007 |
| Interim re-anchor | — | SHIPPED | ADR-008 |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The containment was a single targeted rewrite of the user-global `~/.codex/hooks.json`: the precondition (all referenced adapter files present in MAIN, 0 byte-diffs between the worktree and MAIN copies) was verified before writing, a timestamped backup was taken, the 14 stale `cd` prefixes were re-pointed to the primary checkout, and a read-only live `codex exec` smoke confirmed the lifecycle events still fire. The durable fix was scoped, not built: the two-model consult was adjudicated and the decisions recorded, and the installer change surface was fixed to `install-codex-hooks.mjs`, the source `.codex/hooks.json`, and the repo-local Claude/OpenCode SessionStart wiring — no adapter, neutral core, or plugin, and no new global artifact.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Reject SOL's runtime dispatcher | Accepted |
| ADR-002 | Adopt a convergent/repair-default installer | Accepted (planned) |
| ADR-003 | Add a linked-worktree anchor refusal | Accepted (planned) |
| ADR-004 | Fail loud without a new global artifact | Accepted (planned) |
| ADR-005 | Cut SOL's launcher shim + LaunchAgent | Accepted |
| ADR-006 | Dedupe the source `.codex/hooks.json` groups | Accepted (planned) |
| ADR-007 | OPEN PROBE: Codex non-zero hook-exit behavior | Open |
| ADR-008 | Containment — interim re-anchor | Shipped |

See `decision-record.md` for full ADR documentation.
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|---|---|---|
| Containment re-anchor precondition | Pass | All referenced adapter files exist in MAIN; 0 byte-diffs worktree-vs-MAIN |
| Containment post-state | Pass | `~/.codex/hooks.json`: MAIN-repo 16, superset-notify 3, worktree 0 |
| Containment backup | Pass | `~/.codex/hooks.json.bak-2026-07-14T19-01-32` restorable |
| Containment live smoke | Pass | `codex exec` gpt-5.5 low (read-only): SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed |
| Two-model consult adjudicated | Pass | ADR-001…ADR-006 record SOL vs Fable-5; dispatcher rejected, convergent installer adopted |
| `validate.sh --strict` | Pass | Errors: 0 (authoring run) |
| Convergent reconcile re-anchors by identity | Owed | Planned (T020/T021); not implemented |
| Linked-worktree anchor refusal | Owed | Planned (T023); not implemented |
| Inline `||` fail-loud emit + `--check` watchdog | Owed | Planned (T031/T041); T041 gated on ADR-007 |
| Source `.codex/hooks.json` dedupe | Owed | Planned (T042); not implemented |
| OPEN PROBE (Codex non-zero-exit) | Owed | Not yet run (ADR-007) |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations

1. **The durable fix is NOT implemented.** Containment removes the live risk today, but a plain installer re-run still cannot re-anchor until D2 lands, and the installer still derives its anchor from its own location until D3 lands — so the recurrence class stays open. This packet is planning + containment, not the durable fix.
2. **The interim re-anchor is a manual rewrite, not a converging installer.** It fixed the current stale entries; it did not change the installer, so a future worktree reap could reintroduce the same stale-anchor drift until D2/D3 ship.
3. **The inline `||` fail-loud shape is unconfirmed.** D4's emit depends on the OPEN PROBE (ADR-007): how Codex 0.144.x treats a non-zero hook exit. Until that is observed live, the emit must not ship; if Codex ignores non-zero exits, the fail-loud coverage degrades to the cross-runtime `--check` watchdog alone.
4. **`~/.codex/hooks.json` remains the one out-of-repo write** — the containment backed it up first; the durable reconcile will keep the same backup + atomic-write discipline and add no new global artifact.
5. **Approval-gated.** The durable-fix decisions are adjudicated but not authorized for implementation; the checklist's durable-fix items stay unchecked until an approved implementation pass completes.
<!-- /ANCHOR:limitations -->
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

The intended durable architecture keeps `~/.codex/hooks.json` as a policy file whose mk-owned entries `cd` at the primary checkout and invoke repo-relative adapters — no runtime dispatcher, no global router, no trust record (ADR-001). The installer becomes a reconciler that keys the mk-owned subset by `(owner,event,matcher,hookId)`, rewrites command+anchor on every run (ADR-002), refuses to anchor at a linked worktree (ADR-003), and emits an inline fail-loud `||` per entry (ADR-004). The two durable repo-local runtimes (Claude/OpenCode), which cannot fall off, police the fragile global file via a non-mutating `--check` in their SessionStart chain (ADR-004). The Codex adapters and neutral cores from child 007 stay byte-frozen; only the installer, the source hook file, and the durable-runtime wiring change.
<!-- /ANCHOR:architecture-summary -->
