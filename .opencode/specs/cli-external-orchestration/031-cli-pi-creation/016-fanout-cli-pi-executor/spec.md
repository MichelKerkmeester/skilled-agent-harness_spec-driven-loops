---
title: "Feature Specification: Implement the fan-out cli-pi executor"
description: "Replace the throwing cli-pi command-builder stub with a real print-mode dispatch so cli-pi runs as a genuine deep-loop lineage."
trigger_phrases:
  - "fanout cli-pi executor"
  - "cli-pi deep-loop lineage"
importance_tier: "important"
contextType: "implementation"
parent: "cli-external-orchestration/031-cli-pi-creation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Implement The Fan-Out cli-pi Executor

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | cli-external-orchestration/031-cli-pi-creation/016-fanout-cli-pi-executor |
| **Level** | 2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-loop fan-out runtime's `buildPiLineageCommand` threw unconditionally: cli-pi could not run as a fan-out lineage, so deep-review/deep-research could not use Pi. It was gated on "once the headless invocation contract is confirmed." A live `pi -p` dispatch this session confirmed that contract (provider-qualified `--model openai-codex/gpt-5.6-*`, effort via `--thinking`), so the builder can be implemented. This matters because the two cli-cursor models fabricate the loop; cli-pi/LUNA self-drives, so it is the genuine second-lineage transport.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `fanout-run.cjs`: a real `buildPiLineageCommand` (print mode, provider qualification, `--thinking` mapping).
- `executor-config.ts`: add `reasoningEffort` to the cli-pi field allowlist.
- Unit tests for both.

### Out of Scope
- A full live fan-out run (proven separately via direct `pi -p`).
- sandboxMode for cli-pi (Pi has no sandbox flag; the write boundary is prompt-only).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-pi builds a valid print-mode command | `pi -p <prompt> --model <provider/model> [--thinking <level>]` |
| REQ-002 | Model ids are provider-qualified | gpt-5.6-* -> openai-codex/*; the rest by their provider; already-qualified passes through |
| REQ-003 | Effort maps to Pi's --thinking scale | none->off, ultra->max (ceiling), else pass-through; unset omits the flag |
| REQ-004 | No regressions | The full config and fanout-run suites pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- cli-pi is a working fan-out executor kind; the config + fanout-run suites pass (178 tests); the SKILL.md reflects runtime support.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A wrong provider qualification silently fails (pi exits 0) | The provider map is confirmed for gpt-5.6-* and sourced from model-profiles for the rest; the run harness reads output/state, never the exit code |
| No sandbox boundary for a writing lineage | Documented: Pi's write boundary is prompt-only, matching how the runtime treats other non-sandboxed transports |

**Dependencies:** the confirmed headless invocation (packet 015).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Whether the non-gpt Pi models (deepseek/minimax/mimo) need live-dispatch confirmation of their provider routes, as gpt-5.6-luna now has.
<!-- /ANCHOR:questions -->
