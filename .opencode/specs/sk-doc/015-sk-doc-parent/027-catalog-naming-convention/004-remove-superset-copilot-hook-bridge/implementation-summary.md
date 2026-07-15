---
title: "Implementation Summary: Remove the Superset/Copilot hook bridge"
description: "Shipped removal of the checked-in Superset/Copilot hook bridge: 6 deletes, 6 surgical edits, and a local untracked-config purge, with the spec-kit Copilot priming preserved and the parity test green."
trigger_phrases:
  - "superset removal summary"
  - "copilot hook bridge removed"
  - "decommission superset summary"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
    last_updated_at: "2026-07-12T11:46:10Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed the bridge removal: 6 deletes + 6 edits + local purge; parity test 2/2; grep gate 0"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files:
      - ".github/hooks/scripts/session-start.sh"
      - ".opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/hooks-parity-stress.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity test passes with Claude + OpenCode arms after dropping the Copilot/superset arm (2/2)"
      - "The bridge's runtime brain (~/.superset/hooks/copilot-hook.sh) is out of repo; operator uninstalls separately"
---
# Implementation Summary: Remove the Superset/Copilot Hook Bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-remove-superset-copilot-hook-bridge |
| **Completed** | 2026-07-12 |
| **Level** | 2 |
| **Actual Effort** | ~35 minutes (estimated: ~40) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Decommissioned the checked-in Superset/Copilot hook bridge — the fan-out that forwarded Copilot lifecycle events to
the operator's machine-local `~/.superset/hooks/copilot-hook.sh`. The blast radius was first mis-reported as 501 files;
investigation showed most hits were the ordinary word "superset" (set/type theory), and the real bridge was 11 tracked
files plus one untracked local config. The spec-kit's own Copilot session-priming (which shares two of the lifecycle
scripts) was preserved by editing out only the trailing bridge call block.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/hooks/scripts/superset-notify.sh` | Deleted | Notify wrapper shelling to `~/.superset/hooks/copilot-hook.sh` |
| `system-spec-kit/feature_catalog/.github/hooks/superset-notify.json` | Deleted | Propagated bridge config |
| `system-spec-kit/mcp_server/.github/hooks/superset-notify.json` | Deleted | Propagated bridge config |
| `system-spec-kit/scripts/.github/hooks/superset-notify.json` | Deleted | Propagated bridge config |
| `system-spec-kit/mcp_server/.github/hooks/README.md` | Deleted | "Superset Copilot Webhook Configuration" doc |
| `system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts` | Deleted | Test asserting only the bridge wiring |
| `.github/hooks/scripts/session-start.sh` | Modified | Removed trailing `~/.superset` block; kept `session-prime.js` priming |
| `.github/hooks/scripts/user-prompt-submitted.sh` | Modified | Removed trailing `~/.superset` block; kept `user-prompt-submit.js` priming |
| `system-spec-kit/references/config/hook_system.md` | Modified | Removed the superset-wrapper sentence |
| `sk-code/code-opencode/references/shared/hooks.md` | Modified | 3 sites rewritten to "no checked-in wrapper config" |
| `system-skill-advisor/.../hooks-parity-stress.vitest.ts` | Modified | Dropped the Copilot/superset arm; kept Claude + OpenCode |
| `system-spec-kit/mcp_server/tests/advisor-fixtures/README.md` | Modified | Removed dangling link to the deleted wiring test |
| `.github/hooks/superset-notify.json` (untracked, local) | Removed | Backed up to scratchpad; `.git/info/exclude` line dropped |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The removal ran inline in the main worktree rather than as a fanned-out agent job, because it was an 11-file surgical
change that needed direct judgment on which files were load-bearing versus pure-superset. Confidence came from three
post-edit checks: the `hooks-parity-stress` vitest suite passed 2/2 with the Claude + OpenCode arms intact, a live-tree
grep for `superset-notify` / `.superset/hooks/copilot-hook` (excluding frozen `specs/` + `z_archive`) returned zero, and
both lifecycle scripts were confirmed to still invoke their spec-kit priming with no superset references. Everything is
staged path-scoped for a single reversible commit; the untracked root config was backed up before removal.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Edit (not delete) the two lifecycle scripts | They run the spec-kit Copilot session-priming; only the trailing `~/.superset` block is bridge-specific |
| Leave `specs/**` + z_archive references | Frozen historical record of the bridge's prior existence (project rule) |
| Leave `cli_reference.md` `~/.superset/bin/opencode` | Documents the opencode BINARY location, not the hook bridge |
| Leave `~/.superset/` app itself | Out of repo, operator-owned; uninstalled separately |
| Scrub the `superset-notify.json` filename from the removal-note docs | Keeps `hooks.md` describing current state, not a deleted file; makes the grep gate literally zero |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Parity vitest | Pass | 2/2 | `hooks-parity-stress` Claude + OpenCode arms green under `vitest.stress.config.ts` |
| Live-tree grep | Pass | - | `superset-notify` / `.superset/hooks/copilot-hook` excl specs/z_archive = 0 |
| Orphan check | Pass | - | `copilot-hook-wiring` live refs = 0 after README link removal |
| Priming survival | Pass | - | both lifecycle scripts still invoke their `*-prime.js` / `*-submit.js` |
| Strict validate | Pending | - | `validate.sh --recursive --strict` on parent + child — see final gate |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Tracked removals in one path-scoped commit | Staged path-scoped | Pass |
| NFR-R02 | Untracked config backed up before rm | scratchpad backup (784 bytes) | Pass |
| NFR-S01 | Commit excludes concurrent/daemon churn | Path-scoped add only | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime brain out of repo** — `~/.superset/hooks/copilot-hook.sh` still exists on the operator's machine; its
   callers are now gone, but the app is uninstalled separately (out of scope).
2. **`.github/hooks/scripts/` registration** — after the untracked root config purge, the two lifecycle scripts are
   no longer wired by a checked-in config; they run only if a runtime discovers them. This is expected for a
   bridge removal and does not affect the spec-kit MCP hooks (registered via `.claude/settings.json` / plugins).
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| 5 surgical edits | 6 edits | Added `advisor-fixtures/README.md` — a dangling link to the deleted wiring test surfaced during the orphan check |
<!-- /ANCHOR:deviations -->
