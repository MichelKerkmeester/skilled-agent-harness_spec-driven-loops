---
title: "Verification Checklist: Codex hook install robustness"
description: "Level 3 verification checklist: containment and the durable convergent-installer fix (D2/D3/D4/D6) are both shipped, installed, and verified; installer self-test 9/9, real install re-anchored and --check clean, live smoke green."
trigger_phrases: ["Codex hook install robustness checklist"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/009-codex-hook-install-robustness"
    last_updated_at: "2026-07-14T19:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped+verified durable convergent installer (D2/D3/D4/D6); self-test 9/9; probe resolved"
    next_safe_action: "packet complete; Part B (CLI spec consolidation) is a separate packet"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: ["Codex 0.144.4 marks a non-zero hook exit Failed but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model — so the inline || emit is valid and shipped (ADR-007 resolved)."]
---
# Verification Checklist: Codex hook install robustness
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
A check is marked `[x]` only with evidence: a command output, a file diff, or a live-session observation. Containment checks carry live-smoke evidence. The durable convergent-installer checks now carry installer self-test evidence (9/9 PASS), real-install verification against the live `~/.codex/hooks.json`, and a live `codex exec` smoke — the durable fix is implemented, installed, and confirmed.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Root cause pinned: `hookIdentity()` (`install-codex-hooks.mjs` ~line 43) discards the `cd` anchor and the dedup filter (~line 98) compares commands after skipping identity, so a stale-anchored entry reads as "already installed" and re-runs report `added: 0`. Recorded in `decision-record.md` (ADR-002 context).
- [x] CHK-002 [P0] Two-model consult adjudicated (SOL ultra dispatcher REJECTED; Fable-5 convergent installer ADOPTED), each grounded in reads of `install-codex-hooks.mjs`. Recorded in `decision-record.md` (ADR-001…ADR-006).
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] The reconcile keys mk-owned entries by `(owner,event,matcher,hookId)` and rewrites the full command+anchor on every run (independent of identity). SHIPPED in `install-codex-hooks.mjs`; `hookIdentity()` hardened to extract the first script after the `node`/`bash`/`python` runner so the D4a fallback text cannot corrupt dedupe identity; self-test 9/9 PASS (reconcile removes a stale-anchored mk entry, re-anchors to the primary checkout, one canonical entry per identity).
- [x] CHK-011 [P0] Superset/unknown entries are byte-identical before and after a reconcile run. SHIPPED; self-test preserves a Superset `notify.sh` entry byte-for-byte across a reconcile (9/9 PASS); real install left superset-notify 3 untouched.
- [x] CHK-012 [P1] The linked-worktree anchor refusal aborts unless `--allow-worktree`; the anchor is always the primary checkout. SHIPPED via `assertSafeRepoAnchor` (`git rev-parse --git-common-dir` vs `<toplevel>/.git`); self-test aborts when `--repo` points at a linked worktree and `--allow-worktree` bypasses (9/9 PASS).
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Containment live smoke passes. Live `codex exec` gpt-5.5 low (read-only) after the re-anchor: SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 Completed, 0 Failed.
- [x] CHK-021 [P0] Convergence test: one reconcile re-anchors a stale-anchored fixture; a second run is a no-op. VERIFIED by the installer self-test (9/9 PASS): a reconcile re-anchors a stale mk entry to the primary checkout, and a second reconcile reports `changed:false` (idempotent). Real install: `--check` exits 0 on the re-anchored `~/.codex/hooks.json`.
- [x] CHK-022 [P1] Refusal + dedupe tests: linked-worktree run aborts; each duplicated source group resolves to one installed entry. VERIFIED (9/9 PASS): the linked-worktree run aborts (`--allow-worktree` overrides), and D6 deduped `.codex/hooks.json` SessionStart from four mk groups to two so `worktree-guard.sh`/`check-git-hooks.sh` resolve to one entry each.
- [x] CHK-023 [P1] OPEN PROBE observed live: Codex 0.144.x non-zero-exit behavior confirmed before the inline `||` emit ships. RESOLVED via a live probe on Codex 0.144.4: a non-zero hook exit is marked "Failed" but does NOT abort the session (fail-open holds), and `node <adapter> || printf <additionalContext>` reaches the model (the model echoed the injected marker). Inline `||` emit shipped in `.codex/hooks.json`.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] The reap → silent dormancy risk is removed TODAY: `~/.codex/hooks.json` has 0 worktree-anchored mk entries (MAIN 16 / superset 3 / worktree 0) with a restorable backup. Containment, not the durable fix.
- [x] CHK-FIX-002 [P0] The recurrence class is closed durably: a re-run always re-anchors mk entries AND the installer refuses to anchor at a linked worktree. SHIPPED (D2 reconcile + D3 `assertSafeRepoAnchor`); self-test 9/9 PASS proves re-anchor-on-run plus linked-worktree abort; real install re-anchored the live file and `--check` exits 0.
- [x] CHK-FIX-003 [P1] Resolution failure is loud, not silent: inline `||` envelope per generated entry + cross-runtime `--check` watchdog. SHIPPED: 16/19 mk commands wrapped with `... || printf <one-line JSON envelope>` (3 Superset `notify.sh` correctly untouched); a failing adapter emits valid JSON; watchdog wired in `.claude/settings.json` (5th SessionStart hook) and new `.opencode/plugins/mk-codex-hooks-watchdog.js`.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] Containment backed up `~/.codex/hooks.json` before writing and preserved the three Superset `notify.sh` entries. Backup `~/.codex/hooks.json.bak-2026-07-14T19-01-32`; superset-notify 3 preserved.
- [x] CHK-031 [P0] The durable fix adds NO new global artifact, dispatcher, or trust record (ACE surface avoided). VERIFIED by the final change surface: only `.opencode/bin/install-codex-hooks.mjs`, `.codex/hooks.json`, `.claude/settings.json`, and the new repo-local plugin `.opencode/plugins/mk-codex-hooks-watchdog.js` changed — no global runner/dispatcher/trust record; dispatcher rejected in ADR-001, launcher/LaunchAgent cut in ADR-005.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] The defect, root cause, two-model consult, and adjudicated decisions are recorded. `decision-record.md` ADR-001…ADR-008; `spec.md` problem statement.
- [x] CHK-041 [P1] The shipped state is explicit so no reader mistakes what is delivered: the containment and the durable fix (D2/D3/D4/D6) are both recorded as shipped and verified in `spec.md`, `plan.md`, and `implementation-summary.md`, with the one residual (the out-of-repo `~/.codex/hooks.json` write, backed up) called out honestly.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] The declared change surface is exactly `install-codex-hooks.mjs`, the source `.codex/hooks.json`, and the Claude/OpenCode SessionStart wiring (`.claude/settings.json` plus the new repo-local watchdog plugin `.opencode/plugins/mk-codex-hooks-watchdog.js`) — no guard adapter, neutral core, or existing plugin. Matches `spec.md` Files to Change; the shipped change surface is identical.
- [x] CHK-051 [P1] No files outside the declared scope are modified by the durable fix. VERIFIED: the final change surface is exactly `install-codex-hooks.mjs`, `.codex/hooks.json`, `.claude/settings.json`, and the new `.opencode/plugins/mk-codex-hooks-watchdog.js`; no Codex adapter, neutral core, or existing plugin was modified — matching the declared scope.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified | Pending |
|---|---:|---:|---:|
| P0 | 10 | 10 | 0 |
| P1 | 8 | 8 | 0 |
| P2 | 0 | 0 | 0 |

**Overall**: Complete. Both the containment (root cause pinned, consult adjudicated, stale anchors repaired with a backup, live smoke green) and the durable convergent-installer fix (D2 reconcile, D3 linked-worktree refusal, D4a inline `||` fail-loud, D4b cross-runtime `--check` watchdog, D6 source dedupe) are shipped, installed, and verified: installer self-test 9/9 PASS, real install re-anchored the live `~/.codex/hooks.json` with `--check` exiting 0, the OPEN PROBE resolved on Codex 0.144.4, and a live `codex exec` fired SessionStart 5/5, UserPromptSubmit 3/3, Stop 4/4 with 0 Failed.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification
- [x] CHK-100 [P0] The policy-file model holds: `~/.codex/hooks.json` stays a set of primary-checkout-anchored entries with no runtime dispatcher or global router; the installer is a reconciler, not a resolver. VERIFIED: the shipped installer reconciles the mk subset in place (self-test 9/9 PASS) and the real install left anchors MAIN 16 / superset-notify 3 / worktree 0 with no global runner added; the model is fixed in ADR-001/ADR-002.
<!-- /ANCHOR:arch-verify -->
<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
`--check` is read-only (parse + compare the mk subset) and must complete inside the SessionStart budget; no network or build work. Confirmed at closeout: `--check` exits 0 on a canonical target and exits 2 with a `DRIFT` report on a drifted target (self-test 9/9 PASS); the real-install `--check` ran clean from the live SessionStart chain.
<!-- /ANCHOR:perf-verify -->
<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
The installer is the deploy step: idempotent, atomic (temp+rename on change), backed up, and revertible by restoring the timestamped backup. Containment is already deployed; the durable reconcile deploys the same way once approved.
<!-- /ANCHOR:deploy-ready -->
<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
Scope-locked to the installer, the source hook file, and the durable-runtime SessionStart wiring; `~/.codex/hooks.json` stays the one out-of-repo write, backed up first. No secret, license, or data-handling surface touched; no new global executable introduced.
<!-- /ANCHOR:compliance-verify -->
<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
The decision record, spec, and implementation summary agree that both the containment and the durable fix are shipped and verified; cross-references resolve; no doc claims residual planned work inside this packet.
<!-- /ANCHOR:docs-verify -->
<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
Containment and the durable fix are both signed off (live-verified): the convergent installer, linked-worktree refusal, inline fail-loud emit, cross-runtime `--check` watchdog, and source dedupe are implemented, the OPEN PROBE is resolved on Codex 0.144.4, the real install re-anchored the live file with `--check` clean, and installer self-test is 9/9 PASS. Packet complete; Part B (CLI spec consolidation) is a separate packet.
<!-- /ANCHOR:sign-off -->
