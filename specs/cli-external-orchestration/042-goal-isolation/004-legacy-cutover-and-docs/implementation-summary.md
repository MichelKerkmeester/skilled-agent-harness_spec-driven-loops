---
title: "Implementation Summary: Legacy Cutover and Goal Documentation"
description: "Completed explicit legacy quarantine and migration, privacy-safe diagnostics, support-truth reconciliation, and operator documentation for session-scoped goals."
status: "complete"
trigger_phrases:
  - "goal cutover status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/004-legacy-cutover-and-docs"
    last_updated_at: "2026-08-10T19:18:00Z"
    last_updated_by: "codex"
    recent_action: "Legacy cutover verified"
    next_safe_action: "Run final verification and validation in phase 5"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Legacy Cutover and Goal Documentation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-legacy-cutover-and-docs |
| **Created** | 2026-08-10 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `.opencode/hooks/goal/lib/goal-core.cjs` and `.opencode/hooks/goal/bin/goal.cjs` now inspect, explicitly migrate, or archive legacy singleton state. Legacy state is diagnostic-only and never participates in normal scoped reads.
- Migration requires a complete workspace/runtime/session scope, refuses occupied targets and malformed records, preserves the objective and goal id, and quarantines the source only after the scoped write succeeds.
- Malformed legacy bytes can be archived byte-for-byte under a full content-hash filename. Repeated actions are safe no-ops once the source is absent.
- Doctor and health output report aggregate counts and legacy classification without disclosing raw session identifiers.
- Goal READMEs, commands, runtime contract, feature catalog, and manual playbooks now match the tracked support matrix.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cutover was implemented against isolated state roots and copied legacy fixtures. Source/config/test inventory established the runtime truth: Pi has native lifecycle and management binding; Cursor injection has native identity but prompt management is unsupported; OpenCode keeps its independent native plugin; Devin remains decommissioned; Claude and Codex have no native goal adapter.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve legacy bytes in quarantine | A singleton may contain a real objective even though ownership is unknown. |
| Write scoped target before quarantining source | A failed target write must leave the only recoverable record untouched. |
| Refuse malformed migration and occupied targets | Neither corrupt input nor target overwrite can be made safe by inference. |
| Derive support claims from source, registrations, and tests | Historical documentation alone cannot prove current runtime behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Legacy negative control | Before implementation, 47 tests produced 42 passes and 5 expected failures for missing legacy APIs/actions. |
| Integrated goal suite | PASS: 82/82 core, CLI, Pi, and Cursor tests. |
| OpenCode regression suite | PASS: 119/119 plugin tests. |
| Copied-state canaries | PASS: explicit valid migration bound only the selected Pi session; missing scope failed; repeat migration was a no-op; malformed bytes were preserved exactly with mode 0600. |
| Runtime registration truth | PASS: registered paths exist; Pi and Cursor registrations match tracked adapters; Devin has no goal registration. |
| Documentation structure | PASS: 14/14 modified documents validated. |
| Relative links | PASS: 199/199 checked links resolve. |
| Stale support claims | PASS: targeted singleton, Devin, and unbound-management scan returned zero matches. |
| Alignment and comment hygiene | PASS: alignment reported zero findings; all eight modified executable/test files passed comment hygiene. |
| Strict phase validation | PASS: strict validation completed with zero errors and zero warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Pi remains deliberately disabled in `.pi/settings.json` until the final Phase 5 gate passes.
2. Cursor prompt management remains unsupported because that surface does not expose the hook's native session identity.
3. Claude can see the mirrored OpenCode command file through the command-directory symlink, but it has no native goal plugin tools; command visibility is not runtime support.
<!-- /ANCHOR:limitations -->
