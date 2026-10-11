---
title: "Implementation Summary"
description: "DOC-331's gold is right and the router is wrong, but the only router fix is a finished-run filter with one caller, so the item is CLOSED with the trial recorded."
trigger_phrases:
  - "admission gold implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/003-admission-gold"
    last_updated_at: "2026-10-11T18:00:00Z"
    last_updated_by: "residual-closeout-orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-016-003-admission-gold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-admission-gold |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No source file changes. The phase settles the question with three observations.

**The gold is right.** DOC-331 tests `/doctor:deep-loop`, which must report lazy-init and leave the graph untouched: its pass condition requires `deep_loop_graph_status()` to show zero nodes after the run. A route to `research` hands the agent the research loop, whose iterations upsert graph rows, so it pushes toward the one thing the scenario forbids. The user has finished a run and wants a diagnosis, not another run.

**The router is wrong for one reason.** `compiled-route.cjs --hub system-deep-loop` returns `defer` for `Initialize the deep-loop graph from current iteration folders.` and `route` for `We just finished a deep-research run.` alone. The research alias `deep-research` is a substring match in `canary-router.cjs` `scoreModes`, and the router has no way to tell a mention of a past run from a request for a new one.

**The smallest fix has one caller.** `scratch/context-strip-trial.cjs` strips a finished-run clause before scoring. Over the hub's 15 scenario prompts it changes exactly one, DOC-331, from `route` to `defer`. A search of every playbook prompt finds no other finished-run mention that reaches a router. Building it means a new field in the hub router schema, the compiler, the compiled router and the legacy router it must stay in lockstep with, all for one scenario.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `003-admission-gold/scratch/context-strip-trial.cjs` | Create | Read-only trial |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the probes and the trial itself. No DeepSeek dispatch ran, because the phase builds nothing: the only build candidate failed the overengineering rule before a brief was written.

### Dispatches

| Brief | Route | Result |
|-------|-------|--------|
| None | None | No source change; see Key Decisions |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the gold `UNKNOWN` | The scenario's pass condition forbids a graph write, and the research route leads to one |
| CLOSED: no router change | Every honest router fix is a new context-filter mechanism across the schema, compiler and two routers, and the trial shows its only caller is DOC-331. prevent-overengineering §4 needs two real callers for a new option, and the operator's own rule for item 4 forbids a probe-specific special case |
| Do not reword the prompt | Removing the finished-run sentence would make the scenario pass by testing nothing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `compiled-route.cjs --hub system-deep-loop` on each sentence | graph sentence alone: defer; finished-run sentence alone: route |
| `scratch/context-strip-trial.cjs` | prompts 15 changed 1: DOC-331 route to defer |
| Playbook prompt search for finished-run clauses | One router-relevant match: DOC-331 |
| `compiled-route-admission.cjs --all` | Unchanged: system-deep-loop drift 1, every other hub pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. DOC-331 still drifts, so `compiled-route-admission.cjs --hub system-deep-loop` exits 1 and CI keeps `--warn-only` for it. A second finished-run scenario in any hub would give a context filter its second caller and reopen this decision.
<!-- /ANCHOR:limitations -->

---
