---
title: "Implementation Summary: Codex hook install robustness"
description: "Containment and the durable convergent-installer fix are both shipped, installed, and verified: reconcile/repair-default installer, linked-worktree anchor refusal, inline fail-loud emit, cross-runtime --check watchdog, and source dedupe. Installer self-test 9/9; real install re-anchored the live file with --check clean; live codex exec smoke green."
trigger_phrases: ["Codex hook install robustness summary", "codex re-anchor containment status"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped+verified durable convergent installer (D2/D3/D4/D6); self-test 9/9; probe resolved"
    next_safe_action: "packet complete; Part B (CLI spec consolidation) is a separate packet"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: ["Codex 0.144.4 marks a non-zero hook exit Failed but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model — so the inline || emit is valid and shipped (ADR-007 resolved)."]
---
# Implementation Summary: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 009-codex-hook-install-robustness |
| **Status** | Complete |
| **Status detail** | Containment and durable fix both shipped, installed, and verified |
| **Level** | 3 |
| **Predecessor** | `../007-codex-hook-parity` |
| **Started** | 2026-07-14 |
| **Completed** | 2026-07-14 |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built

**Containment (shipped first):**
- **Interim re-anchor.** Rewrote all 14 stale `…/Public/.worktrees/0038-codex-hook-parity` mk command prefixes to the primary checkout `…/Public` in `~/.codex/hooks.json`. Precondition verified (all referenced files exist in MAIN; 0 byte-diffs). Backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32`. Post-state: MAIN-repo 16, superset-notify 3, worktree 0. Live smoke (`codex exec` gpt-5.5 low, read-only): SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed. This removed the reap-to-silent-dormancy risk immediately.
- **Two-model consult + adjudication.** SOL (ultra) and Fable-5, each grounded in reads of `install-codex-hooks.mjs`; orchestrator adjudicated in favor of Fable's plan. Recorded as ADR-001…ADR-006 (+ ADR-007 probe, ADR-008 containment).

**Durable fix (shipped, installed, and verified):**
- **D2 convergent/repair-default installer** — shipped in `.opencode/bin/install-codex-hooks.mjs`. Reconciles mk-owned entries by identity and rewrites the full command+anchor on every run; preserves Superset/unknown entries byte-for-byte; appends exactly one canonical entry per identity; atomic temp+rename only on change; backup before write; JSON validation; `--check`/`--dry-run` mutually exclusive. `hookIdentity()` hardened to extract the first script after the `node`/`bash`/`python` runner so the D4a fallback text cannot corrupt the dedupe identity. `--reanchor` was intentionally not added (reconcile IS re-anchoring). Installer self-test suite 9/9 PASS, including a second reconcile that reports `changed:false` (idempotent) and `--check` exiting 0 on a canonical target versus 2 with a `DRIFT` report on a drifted target.
- **D3 linked-worktree anchor refusal** — shipped via `assertSafeRepoAnchor` (`git rev-parse --git-common-dir` compared to `<toplevel>/.git`). Self-test: aborts when `--repo` points at a linked worktree; `--allow-worktree` bypasses (9/9 PASS).
- **D4a inline fail-loud fallback** — shipped, baked into the `.codex/hooks.json` source: each mk command is `... || printf %s "<one-line JSON envelope>"` with an event-specific `hookEventName` and a filename-free `additionalContext`. A failing adapter emits valid JSON `{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"mk codex hook could not resolve; re-run the codex hooks installer with --check"}}`. Real install: 16 of 19 mk commands wrapped (the 3 Superset `notify.sh` correctly untouched). Live smoke: the fallback fired 0 times during normal operation.
- **D4b cross-runtime `--check` watchdog** — shipped. Claude: a 5th SessionStart hook in `.claude/settings.json` runs `install-codex-hooks.mjs --check` non-blocking (`--check … >/dev/null 2>&1 || echo "[codex-hooks] drift detected - run: …"`). OpenCode: a new plugin `.opencode/plugins/mk-codex-hooks-watchdog.js` runs `--check` on `session.created`, logs drift to a bounded workspace log file (never stdout, since OpenCode paints plugin stdout onto the prompt line), fail-open; syntax OK plus load-tested across 5 event shapes with no throw. No standalone global checker; no self-repair from SessionStart.
- **D6 source dedupe** — shipped. `.codex/hooks.json` SessionStart deduped from four mk groups down to two (the standalone `worktree-guard.sh` and `check-git-hooks.sh` duplicate groups removed; both remain once in the first group).
- **OPEN PROBE (ADR-007) resolved** — a live probe on Codex 0.144.4 confirmed a non-zero hook exit is marked "Failed" but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model (the model echoed the injected marker). The inline `||` emit is therefore valid and shipped.
- **Real install verification** — the reconcile was applied to the live `~/.codex/hooks.json` (backup `~/.codex/hooks.json.bak-2026-07-14T18-15-54-565Z`); `--check` then exits 0 (clean/idempotent); anchors are MAIN 16 / superset-notify 3 / worktree 0; SessionStart deduped; and a live `codex exec` (gpt-5.5 low, read-only) fired SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed.

### Decision map (SOL proposal → adjudicated)

| Item | SOL | Adjudicated | Where |
|---|---|---|---|
| Runtime dispatcher / global router | P0 verdict | REJECT (redundant, unnecessary, anti-correct, ACE) | ADR-001 |
| Convergent/repair-default installer | P0 | ADOPT + SHIPPED (drop `--reanchor`) | ADR-002 |
| Linked-worktree anchor refusal | (missed) | ADD + SHIPPED | ADR-003 |
| Fail-loud | P1 standalone global checker | Inline `||` + cross-runtime `--check`, no global artifact — SHIPPED | ADR-004 |
| Launcher shim + LaunchAgent | P2 | CUT | ADR-005 |
| Source dedupe | (missed) | DEDUPE + SHIPPED | ADR-006 |
| Codex non-zero-exit behavior | — | RESOLVED (fail-open on 0.144.4; inline `||` emit shipped) | ADR-007 |
| Interim re-anchor | — | SHIPPED | ADR-008 |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The containment was a single targeted rewrite of the user-global `~/.codex/hooks.json`: the precondition (all referenced adapter files present in MAIN, 0 byte-diffs between the worktree and MAIN copies) was verified before writing, a timestamped backup was taken, the 14 stale `cd` prefixes were re-pointed to the primary checkout, and a read-only live `codex exec` smoke confirmed the lifecycle events still fire. The durable fix was then built and installed: the two-model consult was adjudicated (dispatcher rejected, convergent installer adopted), the reconcile/refusal/fail-loud/watchdog/dedupe changes were implemented (GPT-5.6-SOL xhigh initial implementation, orchestrator-verified), the installer self-test reached 9/9 PASS, the reconcile was applied to the live `~/.codex/hooks.json` (backed up first) with `--check` then exiting 0, and a live `codex exec` smoke reconfirmed the lifecycle. The change surface stayed fixed to `install-codex-hooks.mjs`, the source `.codex/hooks.json`, `.claude/settings.json`, and the new repo-local watchdog plugin `.opencode/plugins/mk-codex-hooks-watchdog.js` — no guard adapter, neutral core, or existing plugin, and no new global artifact.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Reject SOL's runtime dispatcher | Accepted |
| ADR-002 | Adopt a convergent/repair-default installer | Accepted — Shipped |
| ADR-003 | Add a linked-worktree anchor refusal | Accepted — Shipped |
| ADR-004 | Fail loud without a new global artifact | Accepted — Shipped |
| ADR-005 | Cut SOL's launcher shim + LaunchAgent | Accepted |
| ADR-006 | Dedupe the source `.codex/hooks.json` groups | Accepted — Shipped |
| ADR-007 | OPEN PROBE: Codex non-zero hook-exit behavior | Resolved |
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
| `validate.sh --strict` | Pass | Errors: 0 |
| Convergent reconcile re-anchors by identity | Pass | `install-codex-hooks.mjs` self-test 9/9; second reconcile reports `changed:false` (idempotent) |
| Linked-worktree anchor refusal | Pass | `assertSafeRepoAnchor` aborts a linked-worktree `--repo`; `--allow-worktree` bypasses (self-test 9/9) |
| Inline `||` fail-loud emit + `--check` watchdog | Pass | 16 of 19 mk commands wrapped; failing adapter emits valid JSON; watchdog in `.claude/settings.json` + `.opencode/plugins/mk-codex-hooks-watchdog.js` |
| Source `.codex/hooks.json` dedupe | Pass | SessionStart deduped from four mk groups to two; each guard resolves to one entry |
| OPEN PROBE (Codex non-zero-exit) | Pass | Live probe on Codex 0.144.4: non-zero exit marked Failed, session not aborted; `||` emit reaches the model |
| Real install + `--check` clean | Pass | Live `~/.codex/hooks.json` re-anchored (backup taken); `--check` exits 0; anchors MAIN 16 / superset 3 / worktree 0 |
| Live `codex exec` smoke (post-install) | Pass | gpt-5.5 low read-only: SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations

1. **`~/.codex/hooks.json` remains the one out-of-repo write.** The durable reconcile keeps the backup + atomic-write discipline (temp+rename only on change) and adds no new global artifact, but the user-global file is still outside the repo by Codex's design (Codex has no repo-local hook file). The live re-anchor was backed up to `~/.codex/hooks.json.bak-2026-07-14T18-15-54-565Z`, restorable to roll back.
2. **The `--check` watchdog reports drift; it does not self-repair from SessionStart.** By design (ADR-004) — the hook table is already loaded for that session and concurrent sessions would race on a write — so a developer must re-run the installer to converge after drift is reported. This is the intended cost tier; the launcher shim + LaunchAgent were cut in ADR-005.
<!-- /ANCHOR:limitations -->
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

The durable architecture keeps `~/.codex/hooks.json` as a policy file whose mk-owned entries `cd` at the primary checkout and invoke repo-relative adapters — no runtime dispatcher, no global router, no trust record (ADR-001). The installer is now a reconciler that keys the mk-owned subset by `(owner,event,matcher,hookId)`, rewrites command+anchor on every run (ADR-002), refuses to anchor at a linked worktree (ADR-003), and emits an inline fail-loud `||` per entry (ADR-004). The two durable repo-local runtimes (Claude/OpenCode), which cannot fall off, police the fragile global file via a non-mutating `--check` in their SessionStart chain — Claude through a 5th SessionStart hook in `.claude/settings.json`, OpenCode through the new `.opencode/plugins/mk-codex-hooks-watchdog.js` (ADR-004). The Codex guard adapters and neutral cores from child 007 stay byte-frozen; only the installer, the source hook file, and the durable-runtime wiring changed.
<!-- /ANCHOR:architecture-summary -->
