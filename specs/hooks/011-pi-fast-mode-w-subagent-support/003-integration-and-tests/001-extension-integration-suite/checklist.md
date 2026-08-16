---
title: "Verification Checklist: Phase 1 extension-integration-suite"
description: "Evidence checklist for deterministic extension-boundary coverage and the static/test gate."
trigger_phrases:
  - "extension-integration-suite checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created extension integration suite checklist"
    next_safe_action: "Execute the FakePi suite and record gate evidence"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 1 extension-integration-suite

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-701 [P1] Record each command, its exit code, and its redacted output for every gate and test invocation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-702 [P0] Registration assertions cover the `fast` command and the `fast` flag.
- [ ] CHK-703 [P0] Lifecycle-order assertions cover `session_start` → `model_select` → `session_shutdown`.
- [ ] CHK-704 [P0] Config scope resolution and the one-time legacy migration are exercised.
- [ ] CHK-705 [P0] Model selection gates fast-mode behavior for supported targets.
- [ ] CHK-706 [P0] Namespaced `setStatus` calls are asserted.
- [ ] CHK-707 [P0] Handoff-state application is asserted on a supported model.
- [ ] CHK-708 [P0] Every case above runs through the structural FakePi (registration spies, handler maps, fabricated ctx); no whole-module mock is used.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-709 [P1] The command-ownership helper is exported for the live probe in `002-install-transition/`.
- [ ] CHK-710 [P0] A broken lifecycle or ownership boundary FAILS the suite, not only pure helper errors.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:boundary -->
## Scope Boundary

- [ ] CHK-711 [P0] The suite does NOT touch `.pi/settings.json` or install/npm state.
- [ ] CHK-712 [P1] No live-only behavior is asserted in-process (command-suffix renumbering, RPC/TUI rendering, and child-process spawn stay in later leaves).
<!-- /ANCHOR:boundary -->

<!-- ANCHOR:gate -->
## Verification Gate

- [ ] CHK-713 [P0] `npm run typecheck` (`tsc --noEmit`) exits 0.
- [ ] CHK-714 [P0] The full Vitest suite (`npm test`) is green.
<!-- /ANCHOR:gate -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-715 [P1] No settings or npm-scope change occurred; `git status` is clean.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-716 [P1] Handoff criteria to `002-install-transition/` are met and evidence is appended here.
<!-- /ANCHOR:summary -->
