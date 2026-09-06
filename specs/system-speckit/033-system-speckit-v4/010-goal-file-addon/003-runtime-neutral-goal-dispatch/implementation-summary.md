---
title: "Implementation Summary: Runtime-Neutral Goal Dispatch"
description: "The speckit goal offer dispatches by runtime instead of naming one runtime's tool, and the stale-filename guard no longer forbids naming a spec document."
trigger_phrases:
  - "goal dispatch"
  - "runtime neutral goal dispatch"
  - "stale filename guard command path"
  - "spec documentation goal offer"
  - "set string objective shape"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/010-goal-file-addon/003-runtime-neutral-goal-dispatch"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped this phase"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/speckit-plan-auto.yaml"
    session_dedup:
      fingerprint: "sha256:f74194f081affc64000a431a9a5847009eaca4059f764da5d3a14842bd5778c7"
      session_id: "2026-08-29-042-003-runtime-neutral-goal-dispatch"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-runtime-neutral-goal-dispatch |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal offer now works in whichever runtime the operator is in. It previously called one runtime's tool by name, and three of the supported runtimes document no adapter for it, including the one whose native goal surface is the reason the offer exists.

### Dispatch by runtime

The set action resolves a dispatch entry rather than naming a tool unconditionally. A runtime with a plugin uses it, a runtime with a command uses that, and a runtime with neither hands off to the operator. No adapter is fabricated anywhere: the core records three runtimes as by-design absent, and inventing a call for them would be a lie the operator cannot see.

The offer and skip paths still call nothing at all, in any runtime, and the objective carried through is recorded as a pointer plus copied criteria rather than a file body.

### The assertion collision

A contract test forbade the substring `goal.md` anywhere in the touched command files. It was written to guard against a renamed command file, but a bare basename match also forbids naming the spec document this packet introduces. It now matches the command path instead, which is what it was guarding all along.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/speckit/assets/*.yaml` | Modified | Runtime dispatch table, neutral offer wording, objective shape |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Modified | Stale-filename guard scoped to the command path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The dispatch table replaced the hard-coded tool in six assets at once, since all six carried the same block. The assertion change was then proven in both directions rather than by re-running the suite: a command file naming the spec document passes, and a command file naming the stale command path still fails. A green suite alone would not have distinguished a correct narrowing from a weakened one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dispatch resolved by runtime | Three runtimes document no adapter; naming one tool made the offer inert in the runtime that needs it most |
| No fabricated adapters | A hand-off the operator can see beats a call that silently does nothing |
| Guard scoped to the command path | It was written for a renamed command file, not to reserve the basename |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Contract test | PASS - 4 passed, 0 failed |
| Control: document reference | PASS - exits 0 |
| Control: stale command reference | PASS - exits 1, guard still bites |
| Offer path | PASS - calls no tool, before and after |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The dispatch table is declarative, not executed here.** It records what each runtime should do; the command layer resolves it at run time.
2. **Only runtimes present in this repository are enumerated.** A new runtime falls to the default hand-off entry, which is the safe direction.
<!-- /ANCHOR:limitations -->

---
