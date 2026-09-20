---
title: "Tasks: Implement the fan-out cli-pi executor"
description: "Builder, config, tests."
trigger_phrases:
  - "fanout cli-pi executor"
  - "cli-pi deep-loop lineage"
importance_tier: "important"
contextType: "implementation"
parent: "cli-external-orchestration/031-cli-pi-creation"
---

# Tasks: Implement The Fan-Out cli-pi Executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Confirm the headless invocation (packet 015) and read the cli-* adapter patterns
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T101 Add reasoningEffort to the cli-pi field allowlist (executor-config.ts)
- [x] T102 Add provider map + qualify + thinking helpers and implement buildPiLineageCommand (fanout-run.cjs)
- [x] T103 Update the cli-pi SKILL.md execution-ownership note
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T201 Rewrite the stub-throw tests as build assertions; add qualification/thinking coverage
- [x] T202 Both full suites pass (178 tests)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All tasks complete with evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Confirmed invocation: `../015-gpt-dispatch-live-confirmation/`
- Contract pin: `../001-pi-contract-pin/`
<!-- /ANCHOR:cross-refs -->
