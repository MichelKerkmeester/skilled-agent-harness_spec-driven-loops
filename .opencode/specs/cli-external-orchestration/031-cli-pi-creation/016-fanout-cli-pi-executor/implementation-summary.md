---
title: "Implementation Summary: Implement the fan-out cli-pi executor"
description: "cli-pi is now a working deep-loop fan-out executor: print-mode builder, provider qualification, --thinking effort, 178 tests green."
trigger_phrases:
  - "fanout cli-pi executor"
  - "cli-pi deep-loop lineage"
importance_tier: "important"
contextType: "implementation"
parent: "cli-external-orchestration/031-cli-pi-creation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/016-fanout-cli-pi-executor"
    last_updated_at: "2026-07-29T05:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented buildPiLineageCommand + reasoningEffort field; 178 tests pass"
    next_safe_action: "Optional: a hermetic live fan-out smoke test; confirm non-gpt provider routes"
    blockers: []
    completion_pct: 100
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-fanout-cli-pi-executor |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`fanout-run.cjs` gained `PI_MODEL_PROVIDERS` + `qualifyPiModel` + `piThinkingLevel` helpers and a real `buildPiLineageCommand` that emits `pi -p <prompt> --model <provider/model> [--thinking <level>]`, replacing the unconditional throw. `executor-config.ts` added `reasoningEffort` to the cli-pi field allowlist (it maps to `--thinking`). The cli-pi SKILL.md execution-ownership note now states the runtime supports the executor kind.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Mirrored the existing cli-devin/cli-cursor adapters and their vitest blocks. The two stale tests that asserted the stub throw were rewritten as build assertions; new cases cover provider qualification for every id, the --thinking mapping (none->off, ultra->max, unset-omitted), and already-qualified passthrough.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Qualify helpers live in fanout-run.cjs, not executor-config.ts | The runtime duplicates model data as plain JS by design to avoid importing the TS at command-construction time |
| No sandboxMode for cli-pi | Pi exposes no sandbox flag; a print-mode lineage's boundary is the --tools allowlist, left at default so it can write its own state |
| Clamp ultra->max | Pi's --thinking ceiling is max; the codex 'ultra' has no Pi equivalent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

Full executor-config and fanout-run vitest suites: 178 passed, 0 failed. The cli-pi adapter block covers exact argv, provider qualification for all seven ids, the effort mapping, and the binary-absent throw. `node --check` clean on fanout-run.cjs.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

Only gpt-5.6-luna's provider route is live-confirmed; the deepseek/minimax/mimo provider entries come from model-profiles and are not yet live-dispatched through the fan-out. No end-to-end live fan-out run was executed here (proven separately via direct pi -p).
<!-- /ANCHOR:limitations -->
