---
title: "Tasks: Route the cli-pi DeepSeek V4 Flash fan-out literal through the DevPass LLM Gateway"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "devpass deepseek tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Route the cli-pi DeepSeek V4 Flash fan-out literal through the DevPass LLM Gateway

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Establish the route is real

- [x] T001 Reproduce the rejection: five fan-out lanes on the opencode-go route died in six seconds each with `429 GoUsageLimitError` (lineage `logs/fanout-lineage.err`)
- [x] T002 Confirm DevPass lists the model and the credential is present (`pi --list-models` shows `llmgateway deepseek-v4-flash-vision-exp`; `LLMGATEWAY_API_KEY` set)
- [x] T003 Negative control: dispatch the route directly and read the output text (returned `DEVPASS-DEEPSEEK-OK` at `--thinking low`; the `max` probe was still thinking at three minutes)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Move the literal

- [x] T004 Re-point `deepseek-v4-flash-vision-exp` to `llmgateway` in `PI_MODEL_PROVIDERS` (`runtime/scripts/fanout-run.cjs`)
- [x] T005 Correct the four comment sites in `fanout-run.cjs` and the three in `executor-config.ts`
- [x] T006 Move the provider pin and the two selector expectations in the adapter test (`tests/unit/fanout-run.vitest.ts`)
- [x] T007 Correct the cli-pi roster: the opencode-go DeepSeek row, the DevPass paragraph, the DevPass DeepSeek row (`cli-pi/references/providers-and-models.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the cli-pi adapter cases and the executor-config suite (10 passed; 92 passed)
- [x] T009 Confirm the functional diff is one map entry and the rest is comments, test pins and documentation
- [x] T010 Search the runtime and the roster for surviving claims that the fan-out reaches DeepSeek through opencode-go
- [x] T011 Launch round two of the simplification lanes on the route and confirm the first lineage produces its first iteration
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion

- [x] The fan-out reaches DeepSeek V4 Flash on the flat-price plan at `max`
- [x] No unchanged route moved
- [x] Every document agrees with the code
<!-- /ANCHOR:completion -->
