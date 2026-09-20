---
title: "Implementation Summary: Scheduler/Runner cli-opencode Dispatch Wiring"
description: "Planning stub for the scheduler/runner dispatch child phase — not yet implemented. Records the intended runner LEG_TABLE + buildSpawnArgs + env change, decisions, and pending verification."
trigger_phrases:
  - "implementation summary scheduler opencode dispatch"
  - "runner dispatch planning stub"
  - "cli-opencode leg impl summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/002-scheduler-opencode-dispatch"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 implementation stub"
    next_safe_action: "Wire runner dispatch on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-002-scheduler-opencode-dispatch-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Scheduler/Runner cli-opencode Dispatch Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-scheduler-opencode-dispatch |
| **Status** | Planned — not yet implemented |
| **Completed** | Pending |
| **Level** | 2 |
| **Actual Effort** | Not yet started (estimated: 6-7 hours) |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. This is a planning stub. The intended change adds a `cli-opencode` leg to the
runner that renders `opencode run --model <m> --variant <v> --dangerously-skip-permissions
[--command …] --format json --dir <root> <prompt>` with no `--agent`, plumbs model/variant from the
matrix cell `executor` block, and injects `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` on the child
spawn — leaving the three frozen legs' `buildSpawnArgs` output byte-identical.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Planned (Modify) | New leg, model/variant plumbing, `--dir`, env injection. Not yet edited. |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs` | Planned (Modify, conditional) | Pass `--model/--variant` from the cell `executor` if seam (b). Not yet edited. |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered — planning stub. Planned as a leg-scoped change to `behavior-bench-run.cjs` on an isolated worktree, verified by unit tests plus a byte-identical snapshot of the three frozen legs once implemented.
<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Add a NEW `cli-opencode` leg key (not reuse `deepseek`) | The existing `deepseek` entry omits `--variant`/`--dir`; a new key keeps frozen legs byte-stable |
| No `--agent` on the dispatch | SKILL.md ALWAYS rule 3 / Default Invocation — top-level `--agent general` is rejected; role goes in the prompt body |
| Rely on `stdio: ['ignore', …]` for closed stdin | Structurally equivalent to `</dev/null`; there is no shell, so a literal redirect string must NOT be added to argv |
| Inject child spec-gate env leg-scoped | SKILL.md ALWAYS rule 17; leg-scoping protects byte-stability arguments for the frozen legs |
| Auth failure → `EXIT_ENV` (75) → scheduler `retryable` | SKILL.md ALWAYS rule 11: never silently substitute a model; the retryable path already exists |
| **UNKNOWN**: plumbing seam; env scope; auth pre-flight placement | Deferred to implementation (OPEN QUESTIONS) |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Unit (canonical argv) | Pending | - | `cli-opencode` leg renders correct argv, no `--agent` |
| Unit (command/prompt kind) | Pending | - | `--command` ordering and prompt-kind path |
| Snapshot (frozen legs) | Pending | - | byte-identical to golden |
| Env / contract | Pending | - | env injection; exit-code + closed-stdin unchanged |

### Test Coverage Summary

Pending — no implementation yet.


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-C01 | Runner CLI surface backward compatible | Pending | Pending |
| NFR-C02 | Exit-code contract unchanged (`0/2/3/75`) | Pending | Pending |
| NFR-D01 | Argv is a pure function of `(leg, contract, executor)` | Pending | Pending |


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live run here** — this child only renders the correct argv and injects env; the actual
   end-to-end dispatch and evidence are child 003.
2. **Seam undecided** — model/variant plumbing path (per-model keys / runner flags / env seam) is
   an open question that shapes whether the scheduler is touched.
3. **opencode binary not asserted** — argv unit tests do not require the binary; a live dispatch
   (child 003) does, plus a provider auth pre-flight.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| (none yet) | (none yet) | Not yet implemented |

<!-- /ANCHOR:deviations -->
