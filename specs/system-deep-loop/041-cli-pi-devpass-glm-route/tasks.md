---
title: "Tasks: Route the cli-pi GLM-5.3-Flash fan-out literal through the DevPass LLM Gateway"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Route the cli-pi GLM-5.3-Flash fan-out literal through the DevPass LLM Gateway

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

- [x] T001 Confirm `pi` is on PATH and this session is not itself a Pi process, per the cli-pi availability and self-invocation hard rules (done: `pi` 0.85.0 at `~/.local/bin/pi`; parent process is `claude`)
- [x] T002 Confirm `.pi/models.json` declares the `llmgateway` provider with `glm-5.3-flash` among its models and an env-keyed credential (done: `api: openai-completions`, base `https://api.llmgateway.io/v1`, key is an env reference, `LLMGATEWAY_API_KEY` present)
- [x] T003 Negative control: dispatch the route directly before changing code and read the OUTPUT TEXT, not the exit code (done: returned `DEVPASS-GLM-OK` at `--thinking max`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Move the literal

- [x] T004 Re-point `glm-5.3-flash` from `opencode-go` to `llmgateway` in `PI_MODEL_PROVIDERS` (`runtime/scripts/fanout-run.cjs`)
- [x] T005 Correct the two comment blocks in `fanout-run.cjs` that described the opencode-go mapping, including the allowlist note and the effort-pin note
- [x] T006 Correct the `PI_SUPPORTED_MODELS` note and the `isFlashMaxPinnedModel` doc block in `executor-config.ts`
- [x] T007 Correct the cli-pi roster reference: the opencode-go GLM row, the DevPass reachability paragraph and the DevPass GLM row (`cli-pi/references/providers-and-models.md`)
- [x] T008 Move the pinned expectation in the cli-pi adapter test to `llmgateway` (`tests/unit/fanout-run.vitest.ts`)
- [x] T015 Give `cli-pi` an entry in `EXECUTOR_ENV_PREFIXES_BY_KIND` carrying `LLMGATEWAY_` and `CLINE_`, the only two env-keyed providers `.pi/models.json` declares, and record the evidence standard in the comment (`lib/deep-loop/executor-audit.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Prove composition for the changed route and two unchanged neighbours in one run (done: `llmgateway/glm-5.3-flash`, `openrouter/z-ai/glm-5.3-flash`, `opencode-go/deepseek-v4-flash-vision-exp`, all at `--thinking max`)
- [x] T010 Run the targeted suites (done: `executor-config.vitest.ts` 92 passed; `fanout-run.vitest.ts -t 'cli-pi adapter'` 10 passed)
- [x] T011 Confirm the functional diff is one line and the rest is comments (done: the non-comment diff is exactly the one map entry)
- [x] T012 Attribute every remaining failure in a touched file (done: `combo-matrix.vitest.ts` expects `opencode-go/deepseek-v4-flash` and receives the `-vision-exp` default from commit `5aae5f0bc8`; unrelated and pre-existing. One flaky checkpoint-timing test in `fanout-run.vitest.ts` did not reproduce on re-run)
- [x] T013 Grep the runtime for surviving claims of the old mapping (done: none outside unrelated `glm-5.1` fixtures)
- [x] T016 Prove the credential gap from a real dispatch rather than from composition (done: the fan-out reached pi and returned `No API key found for llmgateway` while the identical direct dispatch succeeded; composition, the unit test and the smoke test were all green at that moment)
- [ ] T014 Run the whole `system-deep-loop` runtime suite. NOT DONE: the targeted suites cover the changed surface, and a full run was not performed in this session
- [ ] T017 Confirm an end-to-end fan-out iteration completes on this route. NOT DONE at time of writing: the first attempt exhausted a 900s executor timeout at `--thinking max` and was re-dispatched on a 3600s budget
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion

- [x] The fan-out reaches GLM-5.3-Flash on the flat-price plan at `max`
- [x] No unchanged route moved
- [x] Every document agrees with the code
- [x] The credential the route needs survives the dispatch env filter
- [ ] Whole-suite green: not established, see T014
- [ ] End-to-end iteration proven on this route: see T017
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



