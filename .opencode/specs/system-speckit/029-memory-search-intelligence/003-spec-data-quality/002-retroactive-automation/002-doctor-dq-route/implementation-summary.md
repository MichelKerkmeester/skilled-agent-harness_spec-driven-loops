---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. The B2 doctor data-quality route is scaffolded and specified, no code is written yet."
trigger_phrases:
  - "doctor dq route summary"
  - "data-quality route status planned"
  - "dq route scaffold state"
  - "doctor route implementation status"
  - "guarded dq route summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/002-retroactive-automation/002-doctor-dq-route"
    last_updated_at: "2026-07-06T18:49:51.299Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded dq route docs at planned status"
    next_safe_action: "Build the route asset once the B1 dq-engine seam lands"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/doctor_data-quality.yaml"
      - ".opencode/commands/doctor/assets/doctor_memory.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-phase-author"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the route declares mutates from the first commit or add-only until the apply path is wired"
    answered_questions:
      - "The route consumes the B1 dq-engine and never implements a second detector"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-doctor-dq-route |
| **Completed** | PLANNED, not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status is PLANNED. Nothing is built yet. This phase is a scaffold with a spec and the Level-2 doc set, the route code does not exist. This summary records the intended shape so a later session can pick it up without re-deriving the design.

### Planned data-quality route on /doctor

The plan adds a `data-quality` route to `/doctor` that runs report-only by default and applies safe-class fixes only behind `--confirm`. The route will call the same B1 `dq-engine.runDetectors(target, opts)` with `opts.allowFixClass` pinned to `['safe']`, so the interactive door and the scheduled sweep stay on one engine and one frozen fixClass registry. The route asset is modeled on `doctor_code-graph.yaml` and inverts the `doctor_memory.yaml` `validate_targets` shape to allow the authored docs and the two JSONs and forbid the databases.

### Files Changed

No files changed yet. The table below lists the planned changes, none are applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/_routes.yaml` | Planned Modify | Append the data-quality route row under routes |
| `.opencode/commands/doctor/assets/doctor_data-quality.yaml` | Planned Create | The route workflow, diagnostic-default with a confirm-gated safe-apply phase |
| `.opencode/commands/doctor/speckit.md` | Planned Modify | Register the route in the dispatch table if the router enumerates targets |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase is scaffolded and the doc set is in place. The next session builds the route asset after the B1 dq-engine seam lands, then runs `route-validate.py` plus a default run and a confirm run on a scratch packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Consume the B1 dq-engine, never a second detector | One engine and one fixClass registry keep the interactive door and the scheduled sweep from diverging |
| Pin allowFixClass to safe | INV-1 holds, an authored-body fix is never safe, so the route cannot apply one |
| Invert the doctor_memory validate_targets | Allowing the docs and the two JSONs while forbidding the databases bounds the blast radius |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification run yet. The checklist items stay unchecked because the route is not built. The planned gate command is `python3 .opencode/commands/doctor/scripts/route-validate.py`, which must exit 0 with the data-quality row present.

| Check | Command or artifact | Result |
|-------|---------------------|--------|
| Route manifest | `python3 .opencode/commands/doctor/scripts/route-validate.py` | NOT RUN, the route row does not exist yet |
| Flag-state runs | `/doctor data-quality` default, `--confirm`, `--dry-run --confirm` on a scratch packet | NOT RUN, no route asset to invoke |
| DB-path guard | apply attempt against a DB path, expect `STATUS=FAIL ERROR='confirm-mode-mutation-violation'` | NOT RUN, no apply path wired |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase is a scaffold.** No route code exists. Build is blocked until the B1 dq-engine lands the runDetectors seam and the frozen fixClass registry.
2. **The mutating class is undecided.** The route may declare `mutates` from the first commit or start `add-only` until the apply path is wired, route-validate accepts either as long as gate3_location matches the declared class.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
