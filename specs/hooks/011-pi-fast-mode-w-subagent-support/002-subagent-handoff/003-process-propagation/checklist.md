---
title: "Verification Checklist: Phase 3 process-propagation"
description: "Evidence checklist for one-directional child-process env inheritance and isolation."
trigger_phrases:
  - "process-propagation checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/003-process-propagation"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created process-propagation checklist"
    next_safe_action: "Run and record the inheritance and isolation probes"
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

# Verification Checklist: Phase 3 process-propagation

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-601 [P1] Record the fixture command, child exit code, and captured stdout for each env case.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:inheritance -->
## Environment Inheritance

- [ ] CHK-602 [P1] Child launched via `spawnSync(process.execPath, [fixturePath], { env: { ...process.env, PI_FAST_MODE_W_SUBAGENT_SUPPORT: "1" } })` observes exactly the parent-set `"1"` at spawn.
- [ ] CHK-603 [P1] Child observes exactly the parent-set `"0"`, and reports invalid/unset values consistently.
<!-- /ANCHOR:inheritance -->

<!-- ANCHOR:isolation -->
## Process Isolation

- [ ] CHK-604 [P1] A child-local env write does NOT mutate the parent process environment.
<!-- /ANCHOR:isolation -->

<!-- ANCHOR:determinism -->
## Determinism & Security

- [ ] CHK-605 [P1] Inheritance test is deterministic (no network, timing, or external state).
- [ ] CHK-606 [P1] Fixture and tests carry no credentials or provider secrets.
<!-- /ANCHOR:determinism -->

<!-- ANCHOR:reuse -->
## Reuse

- [ ] CHK-607 [P1] The spawn fixture is reusable by `003-integration-and-tests` for the live probe.
<!-- /ANCHOR:reuse -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-608 [P1] README documents strict values, precedence, and the one-directional rule matching the implementation.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-609 [P1] `tests/propagation.test.ts` passes all inheritance and isolation cases.
- [ ] CHK-610 [P1] `npm run typecheck` exits 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-611 [P1] Handoff criteria to `003-integration-and-tests` are met and evidence is recorded here.
<!-- /ANCHOR:summary -->
