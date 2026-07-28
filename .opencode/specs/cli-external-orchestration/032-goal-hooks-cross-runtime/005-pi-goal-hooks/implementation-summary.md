---
title: "Implementation Summary: Pi goal extension (input-transform injection, session_start restore, turn-end verify)"
description: "Planned-state record for the Pi goal extension: not yet built. This document describes what is designed and what will be verified once phase 001 and phase 002 land and implementation begins."
trigger_phrases:
  - "pi goal extension summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/005-pi-goal-hooks"
    last_updated_at: "2026-07-28T20:45:00Z"
    last_updated_by: "claude"
    recent_action: "Documented planned state, no code built yet"
    next_safe_action: "Await phase 001 and phase 002 completion before implementation"
    blockers:
      - "Blocked on phase 001 (goal core) and phase 002 (capability matrix)."
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-005-pi-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether phase 002 confirms a usable Pi turn-end event, which fixes this phase's final scope."
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-pi-goal-hooks |
| **Completed** | Not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. This packet's `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` were authored ahead of implementation to scaffold the phase per the parent packet's phase-map doctrine (`.opencode/specs/cli-external-orchestration/032-goal-hooks-cross-runtime/spec.md`). This document records the planned state honestly: no `goal-context.ts` file exists yet, no symlink exists yet, and no test suite has run.

### Planned Shape

Once phase 001 (`.opencode/hooks/goal/lib/goal-core.cjs`) and phase 002 (the capability-probe matrix) land, this phase will add:

- `.opencode/hooks/goal/pi/goal-context.ts` — the real, canonical extension file, importing phase 001's goal core for shared active-goal state read/write and `[active_goal]` block rendering with a parameterized "Focused Pi execution agent…" Role line.
- `.pi/extensions/goal-context.ts` — a relative symlink back to the real file, satisfying Pi's fixed auto-discovery directory requirement. This is the reverse of the general Pi-extension pattern used elsewhere in this repo (where the real file usually lives under `.pi/extensions/` and the hooks tree holds the mirror symlink), because the goal concern's canonical home is `.opencode/hooks/goal/` alongside its sibling Devin (003) and Cursor (004) adapters.
- `input` transform: injects the goal brief. Pi renders input-transforms visibly in chat, so this injection will be operator-visible — a UX-relevant difference from Devin/Cursor's invisible injection surfaces, comparable to how this repo's Gate-3 A/B/C/D/E question is already operator-visible in Pi sessions.
- `session_start`: restores active-goal state for a new session.
- Turn-end verify: implemented only if phase 002 confirms Pi's `types.d.ts` exposes a usable turn-end/agent-loop event. If not, this phase ships injection + restore only, and that gap will be stated plainly here rather than glossed over.

### Files Not Yet Delivered

| File | Status | Purpose |
|------|--------|---------|
| `.opencode/hooks/goal/pi/goal-context.ts` | Not yet delivered | Real extension source. |
| `.pi/extensions/goal-context.ts` | Not yet delivered | Relative symlink for Pi auto-discovery. |
| `.opencode/hooks/goal/pi/*.test.cjs` | Not yet delivered | Co-located adapter test suite. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. When implementation begins, the plan (`plan.md`) calls for: confirm phase 001's goal-core API and phase 002's capability-matrix verdict -> author `goal-context.ts` at its canonical path with imports written for the `.pi/extensions/` base per the proven symlink-resolution precedent -> create the relative symlink -> wire `input`/`session_start`/[conditional turn-end] -> co-located unit tests -> a live `pi --offline -p` (or `pi -p`) smoke proof showing the goal brief actually reaching the model/chat transcript -> `validate.sh --strict` on this folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Real file in `.opencode/hooks/goal/pi/`, symlink in `.pi/extensions/` (reverse of the repo's usual Pi pattern) | The goal concern's canonical home is the shared `.opencode/hooks/goal/` tree alongside the Devin and Cursor adapters, not `.pi/extensions/` specifically; this mirrors the parent packet's stated design (`spec.md` §5). |
| Imports written for the `.pi/extensions/` base path | Pi's loader resolves relative imports against the symlink's directory, not its realpath — proven precedent: `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/tasks.md` T042-T044. |
| Turn-end verify explicitly gated on phase 002's verdict rather than assumed | Building verify against a guessed event risks shipping a non-functional or silently-broken feature; the parent packet's phase-ordering exists precisely to prevent this. |
| Reuse phase 001's goal core rather than re-implementing state/render/hardening logic | Avoids duplicated, potentially-diverging logic between the OpenCode, Devin, Cursor, and Pi adapters. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Co-located `node --test` suite | Not yet run |
| Live smoke proof (`pi --offline -p` / `pi -p`), injection visible in transcript | Not yet run |
| Live `session_start` restore check | Not yet run |
| Turn-end verify (conditional on phase 002) | Not yet run |
| `validate.sh --strict` on this folder | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built yet.** This packet exists to scaffold the phase per the parent's phase-map doctrine; all "planned" statements above are design intent, not delivered behavior.
2. **Hard-blocked on two sibling phases.** Implementation cannot start until phase 001 (`goal-core.cjs`) ships a stable API and phase 002 publishes its capability matrix, since REQ-005 (turn-end verify scope) is unresolvable without it.
3. **Turn-end verify scope is genuinely unknown until phase 002 lands.** If Pi's `types.d.ts` exposes no usable turn-end/agent-loop event, the shipped adapter will carry injection + restore only, with no verify/continue step — a real capability gap versus OpenCode's `mk-goal.js`, not a temporary omission.
<!-- /ANCHOR:limitations -->
