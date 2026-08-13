<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: devin + cursor Fan-out Exec Hardening

<!-- ANCHOR:protocol -->
## Verification Protocol
Unit tests over the exact constructed args for all three sandbox modes of both kinds, plus live write/read probes reproducing each mode with the emitted args; full vitest output captured, never through `tail`. Cross-model SOL adversarial review before landing.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] devin and cursor live behavior probed across every sandbox mode.
- [x] Clean tsc baseline in the worktree.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] devin read-only drops `--sandbox`; workspace-write keeps `dangerous --sandbox`; full-access unchanged.
- [x] cursor read-only is `--mode plan --trust`; workspace-write adds `--trust`; full-access unchanged.
- [x] `CursorApprovalMode`/`resolveCursorApprovalMode` renamed read-only value to `plan` for truthfulness.
- [x] Comment hygiene: durable WHY grounded in live behavior, no ephemeral ids/spec paths.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] fanout-run 93/93 and executor-config 86/86 green.
- [x] Whole-runtime tsc 0.
- [x] Live probes: read-only writes blocked + reads allowed; workspace-write writes succeed with no stall.
- [x] SOL cross-verify: 0 P0; the one stall P1 (Smart Auto) fixed via `--force --sandbox enabled`; the two ambient-config P1s (repo hooks, unapproved MCP) verified NON-reproducing against the real hooks/MCP (read-only leaf wrote zero files in-repo under the real dispatch env; MCPs skipped) — tracked as defense-in-depth for the combo-matrix phase.
- [x] `validate.sh --strict`: Errors 0 (5 tolerated warnings matching the sibling phase baseline).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] No read-only leaf of either kind can write the working directory (the original defect on both is closed).
- [x] No non-`danger-full-access` leaf is blocked by cursor's untrusted-directory gate.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Read-only leaves cannot mutate the repo (exec + write blocked); no secrets in constructed args.
- [x] Workspace-write writes are confined to the working directory at the OS level (devin `--sandbox`, cursor `--sandbox enabled`).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Both builders' comments document the real trust/sandbox/permission behavior of the installed CLIs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Changes confined to `fanout-run.cjs`, `executor-config.ts`, and their two test files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] Unit + live evidence recorded in the implementation summary.
- [x] SOL verdict + P1 dispositions recorded in the implementation summary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review before the per-mode wiring phase (004) exposes devin/cursor.
<!-- /ANCHOR:sign-off -->
