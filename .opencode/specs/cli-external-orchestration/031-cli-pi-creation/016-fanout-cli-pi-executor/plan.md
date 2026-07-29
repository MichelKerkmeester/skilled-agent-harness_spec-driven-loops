---
title: "Implementation Plan: Implement the fan-out cli-pi executor"
description: "Builder + config field + tests, mirroring the existing cli-* adapters."
trigger_phrases:
  - "fanout cli-pi executor"
  - "cli-pi deep-loop lineage"
importance_tier: "important"
contextType: "implementation"
parent: "cli-external-orchestration/031-cli-pi-creation"
---

# Implementation Plan: Implement The Fan-Out cli-pi Executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | runtime/scripts/fanout-run.cjs, runtime/lib/deep-loop/executor-config.ts |
| **Pattern** | Mirror the cli-devin/cli-cursor adapters + their vitest blocks |
| **Verification** | Full executor-config + fanout-run vitest suites |

### Overview
Replace the stub throw with a print-mode builder; add reasoningEffort to the cli-pi allowlist; cover model qualification and --thinking mapping with unit tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Headless invocation confirmed (packet 015)

### Definition of Done
- [x] Both suites pass; SKILL.md updated; no regressions
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The runtime duplicates model lists as plain JS (no TS import), so the qualification + thinking helpers live in fanout-run.cjs beside the model set; executor-config.ts only gains the allowlist field.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Config | Add reasoningEffort to the cli-pi allowlist |
| Builder | Provider map + qualify + thinking helpers + buildPiLineageCommand |
| Tests | Rewrite the stub-throw tests as build assertions; add qualification/thinking coverage |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit: executor-config.vitest (allowlist + reasoningEffort accepted) and fanout-run.vitest cli-pi adapter (exact argv, provider qualification for all ids, --thinking none->off / ultra->max / unset-omitted, already-qualified passthrough, binary-absent throw). Run both full files for regressions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The confirmed invocation from packet 015.
- The existing cli-* adapter and vitest patterns.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two source edits and the test edits; the builder returns to its stub throw and cli-pi is unsupported again, without affecting other executors.
<!-- /ANCHOR:rollback -->
