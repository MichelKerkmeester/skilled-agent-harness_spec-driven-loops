---
title: "Implementation Summary: Incremental Code-Graph Freshness Guard (planning stub)"
description: "Planning-stage stub for the post-edit code-graph freshness guard. The phase is planned, not implemented; this file lists intended deliverables and makes no completion claims."
trigger_phrases:
  - "code graph freshness summary"
  - "freshness guard planning stub"
  - "post-edit guard status"
  - "not yet implemented freshness"
  - "code-graph-freshness-guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/002-code-graph-freshness-guard"
    last_updated_at: "2026-07-11T06:21:17.310Z"
    last_updated_by: "spec-author"
    recent_action: "Set implementation-summary to a Level 3 planning stub (no completion claims)"
    next_safe_action: "Await approval, then fill this after implementation and verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/plugins/mk-code-graph-freshness.js"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-code-graph-freshness-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> PLANNING STUB. This phase is planned, not yet implemented. No code exists yet and no completion is claimed. Fill this summary only after the guard ships and its checks pass.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-code-graph-freshness-guard |
| **Status** | Planned (not yet implemented) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. The plan is to add a post-edit code-graph freshness guard so an established, warm graph self-heals from soft-stale back to fresh after an edit burst, without blocking the edit and without cold-starting the daemon.

### Intended Deliverables

- `freshness-core.cjs`: the runtime-neutral policy core (`evaluateEdit`, `drainPending`, `sweepStaleFreshnessState`, `probeDaemonWarm`, `appendFreshnessLog`).
- `mk-code-graph-freshness.js`: the OpenCode adapter (`tool.execute.after` plus `event` plus an in-memory debounce timer).
- `code-graph-freshness.cjs`: the Claude PostToolUse adapter, co-resident with sk-code's hook.
- `freshness-core.vitest.ts`: the unit suite pinning the scan / defer-cold / defer-empty guarantees.
- `.claude/settings.json` and `plugins/README.md` wiring.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned approach clones the proven `dispatch-guard.cjs` atomic-state, sweep, and append-log machinery for the core, then wraps it in two thin adapters. Verification will run the core unit suite, an adapter smoke test, `opencode-plugins-folder-purity`, and command-tree parity before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared output-free core plus two thin adapters (ADR-001) | Two runtimes need identical policy; a shared core keeps it tested once and stops drift |
| Advisory fail-open, warm-only, default-off bootstrap (ADR-002) | A hot-path guard must never block an edit or cold-start the daemon, and scope establishment stays the operator's call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation | NOT STARTED (planning stage) |
| Core unit assertions (scan / defer-cold / defer-empty) | Specified in tasks.md T011-T012, not yet run |
| plugin-folder-purity + command-tree parity | Not yet run |

Planned verification (not yet run): `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` plus the `freshness-core.vitest.ts` suite under `vitest`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope on this repo.** Under default env the index scope excludes `.opencode/skills`, agents, commands, specs, and plugins, and this repo's edits land mostly under `.opencode/skills`. So on this repo, default-env, the guard will mostly classify edits as out-of-scope and defer. Its value is highest for end-user-code repos and maintainer-mode sessions (`INDEX_*` on).
2. **Empty graph now.** The readiness marker reports `graphFreshness=empty`, and the guard deliberately does not bootstrap from empty by default. Set `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP=1` to opt in; it is documented but left unset.
3. **Claude trailing-edge precision is bounded.** A pure trailing edge on the stateless Claude hook is picked up at the next SessionStart drain, not instantly. This is an accepted limit, not a bug, since stale structural reads already false-safe to `blocked`.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:architecture-summary -->
## Architecture Summary

Runtime-neutral policy core plus two thin runtime adapters, mirroring the shipped `mk-deep-loop-guard` boundary. The core computes a transport-free decision from cheap file probes and an atomic hex-keyed debounce state; each adapter owns only the detached warm-only scan spawn and the append-only log. Full architecture and ADRs live in `plan.md` and `decision-record.md`.
<!-- /ANCHOR:architecture-summary -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
This file is intentionally a planning stub until the phase is implemented.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
