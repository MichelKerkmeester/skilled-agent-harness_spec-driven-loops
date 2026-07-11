---
title: "Implementation Summary: Spec-Kit Completion-State Exposer (planning stub)"
description: "Planning stub for the Completion-State Exposer phase. Documents intended deliverables only; nothing is implemented yet."
trigger_phrases:
  - "completion state summary"
  - "completion exposer planning stub"
  - "tool.register phase status"
  - "planned not implemented"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/007-speckit-completion-exposer"
    last_updated_at: "2026-07-11T06:21:17.973Z"
    last_updated_by: "spec-author"
    recent_action: "Set implementation-summary to a planning stub; phase is planned, not implemented"
    next_safe_action: "Begin implementation once phase 001 lands: build completion-state.cjs core first"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs"
      - ".opencode/plugins/mk-speckit-completion.js"
      - ".opencode/bin/speckit-completion.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/007-speckit-completion-exposer"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Ship the optional CLI shim in this phase or defer it?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Spec-Kit Completion-State Exposer (planning stub)

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-speckit-completion-exposer |
| **Status** | Planned, not yet implemented |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned only. Nothing here is implemented yet, and no completion is claimed. This stub records the intended deliverables so the implementation session has a clear starting point.

### Intended Deliverables

- A runtime-neutral core `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs` exposing `computeCompletionState`, which resolves a spec folder, infers its level, shells `check-completion.sh` and `calculate-completeness.sh`, and merges their JSON into one fail-open payload.
- An OpenCode plugin `.opencode/plugins/mk-speckit-completion.js` that registers `mk_speckit_completion` via `tool.register` (the first live use of that surface).
- An optional Claude CLI shim `.opencode/bin/speckit-completion.cjs` over the same core.
- A vitest spec for the core (parse and fail-open).
- A `plugins/README.md` section 3 entrypoint row.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Implementation is scheduled after phase 001 (the higher-value CLI Dispatch Audit Trail slice). The intended order is core first, then the OpenCode adapter, then the optional CLI shim, verified by vitest and a plugin smoke-load.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared core plus thin adapters | Both runtimes get an identical payload and a single never-throw contract; see decision-record.md ADR-001 |
| Read-only fail-safe posture with the exit-1 parse | An incomplete packet must report real status, and a broken packet must not crash the session; see decision-record.md ADR-002 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Core vitest (parse and fail-open) | Pending (not yet implemented) |
| Plugin smoke-load (default-export-only) | Pending (not yet implemented) |
| `validate.sh --strict` on this planning packet | Run during authoring; see the phase author's return note |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Planning stage only.** No code exists yet. This document makes no completion claim and carries no runtime evidence.
2. **Claude parity is scripts plus an optional shim.** Claude has no plugin tool-register surface, so its parity is the two scripts already being Bash-runnable, optionally fronted by the CLI shim. There is no `.claude/settings.json` wiring for this phase.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
</content>
