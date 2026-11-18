---
title: "Implementation Summary"
description: "Planned, not built: the shared hook's crash fallback will keep the setup hint and the skipped classification, run directive dedup, record its policy observation with the runtime and survive a throwing clock. Two doc sentences will be corrected."
trigger_phrases:
  - "crash fallback edge cases implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/009-crash-fallback-edge-cases"
    last_updated_at: "2026-11-18T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Phase planned"
    next_safe_action: "Start task T001 once phase 008 validates strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 009-crash-fallback-edge-cases |
| **Completed** | Not yet. Planned 2026-11-18, not built |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This file records the planned state so the build can fill it in.

### Phase 9: crash-fallback-edge-cases

The plan makes a crash in the shared hook look, to the model, like a timeout on the same turn. A setup prompt keeps its `/doctor:setup` hint, a skipped prompt stays skipped, a repeat turn drops the directive block and the policy record carries the runtime and session. A throwing clock gives the outage line instead of a rejected promise. The threshold row will stop claiming that `confidenceOnly` mode bypasses the confidence threshold.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/user-prompt-submit.ts` | Modify, planned | Hoisted turn state, the guarded clock, two local helpers and the new catch |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify, planned | Seven red-first tests and one guard test |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify, planned | One clause on line 382 |
| `hooks/skill-advisor-hook.md` | Modify, planned | One sentence on line 57 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The plan is four serial Luna leaves for the tests and two parallel leaves for the doc lines. The conductor confirms the seven reds. Three serial leaves then edit the hook, and the conductor runs every check in `tasks.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reverse 004's skip of dedup in the catch | The operator directive leaves nothing open. 004's worry about trusting try state is met by hoisting only fully assigned values and keeping dedup in its own try |
| Two local helpers shared by both paths | The crash path needs the same dedup, receipt and policy record as the normal path. Sharing the code keeps the two paths from drifting |
| Observe through the existing calls, no `render.ts` option | Passing the delivery state reaches the observer the fallback render already calls, and one `observeEmittedAdvisorPolicy` call matches the normal path |
| Read the clock after the disabled and invalid-payload returns | A throwing clock then yields the fallback on a real turn, while the hook-off and bad-payload paths keep `{}` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Edges, measured during planning | `scratch/probe.mjs` on the built hook: no setup hint, a skipped prompt shown as an outage, the directive block on both crashing turns, 0 crash policy records against 2 on the timeout path and a rejection on a throwing clock |
| Hook suite baseline during planning | `npx vitest run tests/hooks`: 11 files, 171 of 171 |
| Build checks | Not run yet. `tasks.md` T002 to T019 hold them |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A missing prompt string with a throwing clock gets the outage fallback, not `{}`.** Only an injected clock can throw, and no registered host passes one. `spec.md` Risks records it.
2. **An adapter that fails to import the built handler stays silent.** This is unchanged from phase 004, and the reason is the same. Rebuilding the runtime is the workaround.
<!-- /ANCHOR:limitations -->

---
