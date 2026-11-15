---
title: "Implementation Summary"
description: "Command Tree Parity and Spec-Kit Check pass locally again: private Vibe stubs are ignored, six playbook files cite their suite, the deep contract names one workflow, convergence.cjs needs tsx only as a script and the hook count is 118."
trigger_phrases:
  - "ci red checks after vibe and loop counters implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/028-ci-red-checks-after-vibe-and-loop-counters"
    last_updated_at: "2026-11-15T17:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Fixed the five causes behind the red checks"
    next_safe_action: "Commit, push and confirm both workflows on the new head"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-028-ci-red-checks-after-vibe-and-loop-counters"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-ci-red-checks-after-vibe-and-loop-counters |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A checkout without the operator's private commands now matches the Vibe prompt mirror, because private Vibe stubs are ignored like every other runtime's. The six newest playbook scenarios name the suite that proves them. The router check knows each deep command has one workflow file. The research reducer loads in a job without tsx, and the hook test counts the Codex compact-pointer binding.

### Phase 28: ci-red-checks-after-vibe-and-loop-counters

`.gitignore` gains `/.vibe/prompts/local-*` and the tracked stub leaves the index. The provenance lines cite `hook-session-start`, `compaction-adapters`, `nudge`, `packet-purpose`, `save-continuity-write` and `vibe-adapters`. The `deep` contract entry follows the `speckit` family's single-workflow shape. `convergence.cjs` resolves tsx inside its script branch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gitignore`, `.vibe/prompts/local-skilled-alignment.md` | Modified, untracked | Private Vibe stubs |
| Six playbook files | Modified | Provenance lines |
| `command-contract.json` | Modified | Single deep workflow |
| `convergence.cjs` | Modified | Lazy tsx resolve |
| `hook-registration-sync.vitest.ts` | Modified | 118 bindings |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both CI-only conditions were reproduced locally. With the private command moved away the prompt check passed 44 stubs. With tsx moved away the old `convergence.cjs` failed the reducer test with `Cannot find module 'tsx'`, as CI did, and the new one passed 13 of 13.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the require lazy rather than install tsx in the CLI job | The reducer needs only the helpers, so the import should not need the loader at all |
| Update the binding count rather than drop the assertion | The binding was added on purpose, and the count still guards against an accidental one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CLI vitest project | 210 files pass, 2603 tests, 0 fail |
| Deep-loop convergence suites | 8 files, 204 tests pass |
| Vibe skill, prompt and agent checks | pass |
| `generate-command-routers.cjs --check` | `routers=42 clean=42` |
| Playbook package check | exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None.**
<!-- /ANCHOR:limitations -->

---
