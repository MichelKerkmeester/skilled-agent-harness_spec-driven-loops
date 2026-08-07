---
title: "Implementation Summary: Deep-Loop and CLI Contract Drift"
description: "Four contract drifts corrected, three of them defects this program hit by using the tooling rather than auditing it. Two findings routed to phase 009, two to phase 008, one dropped as a miscount."
trigger_phrases:
  - "cli contract drift summary"
  - "017 phase 007 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/007-deep-loop-and-cli-contract-drift"
    last_updated_at: "2026-07-27T15:22:16Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected four CLI and deep-loop contract drifts"
    next_safe_action: "Begin phase 008 runtime mirror and MCP config, then halt"
    blockers: []
    key_files:
      - "approved-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Using a tool finds contract defects that reading its documentation cannot."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-deep-loop-and-cli-contract-drift |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four tooling contracts now describe what their runtime actually does.

| Finding | Result |
|---------|--------|
| X-1 | `cli-devin` documented `devin -p --model M --permission-mode P "<prompt>"`. The CLI rejects a bare positional prompt with `error: unexpected argument`. Corrected to use the `--` separator |
| X-2 | The model table listed GLM as short name `glm`. No such alias exists; the live ids are `glm-5-2` and five siblings. Corrected |
| X-3 | `/deep:research --lineage-timeout-hours` was documented as raising the ceiling above 4 hours. The runtime hard-caps at 4 and rejects any higher value. Now documented as narrowing-only |
| `devin-02:F3` | The cli-opencode hooks README documented the `codex/` sibling but omitted the live `devin/` directory. Added |
| `fanout:SOL-07` | STALE — the claimed legacy-versus-compiled asymmetry does not exist. Both READMEs were still improved to document the real relationship |
| X-4 | Dropped — no repository document recommends the invalid flag value. The defect was in this program's own usage |
| `fanout:SOL-02`, `fanout:SOL-03` | Routed to phase 009 — launcher and shared-payload duplication are over-engineering assessments |
| `fanout:SOL-08`, `devin-04:F3` | Routed to phase 008 — both are mirror divergence |

### Where these defects came from

Three of the four applied fixes were not in the original 88 findings. X-1 and X-2 broke this program's first Devin dispatch. X-3 killed its first fan-out dispatch outright. Each was discovered by trying to use the documented invocation and watching it fail.

The research passes had read all three files and reported nothing, which is not a failure of attention: reading a command example tells you what it says, not whether the binary accepts it. Contract drift of this kind is only visible from the calling side.

### A miscount caught by a worker

`SOL-07` claimed five legacy command bodies against four compiled contracts. The orchestrator's pre-check produced that count by globbing `*.md` in the legacy directory, which included the directory's own `README.md`. There are four bodies and four contracts, matched exactly. The worker re-derived the inventory, found no asymmetry, and returned STALE rather than inventing an explanation for a gap that was not there.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four GPT-5.6-LUNA workers at xhigh effort, dispatched one at a time. Batched dispatches were being terminated at roughly ten minutes of wall-clock while each worker needs about five, so any batch lost everything after its first worker. One worker per dispatch removed the failure entirely.

Every worker was warned that a concurrent session was editing `cli-devin` during this phase and instructed to confirm current line content before each edit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop X-4 rather than manufacture a fix | No repository document carried the bad flag value; the error was this program's own |
| Accept STALE on SOL-07 | The worker's inventory was right and the orchestrator's pre-check was wrong |
| Route the duplication findings to 009 | Launcher and shared-payload size are over-engineering questions, not contract drift |
| Route the agent-count mismatch to 008 | Fourteen, fourteen and thirteen agents across three trees is mirror divergence |
| One worker per dispatch | Batching was losing every worker after the first to a wall-clock limit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Devin invocation now uses `--` | PASS |
| GLM ids match `devin models list` | PASS, six real ids |
| Timeout flag documents narrowing-only | PASS |
| Hooks README covers the live `devin/` directory | PASS |
| Legacy and compiled inventories match | PASS, four and four |
| Containment | PASS, committed with path-scoped commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`cli-devin` was being edited concurrently.** The corrections target lines the other session was not touching, but that skill should be re-checked once both sessions are quiet.
2. **The mirror-sync checker defect is unresolved.** Routed to phase 008, which owns mirror comparison.
<!-- /ANCHOR:limitations -->
