---
title: "Tasks: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model

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
## Phase 1: Setup

- [x] T001 Scaffold the packet and record the constraint that only the loaded project package is in scope (`specs/hooks/021-compat-opt-in-and-image-declaration/`)
- [x] T002 Generate a deterministic probe image with a known payload for the live vision request (`scratch/vision-probe.png`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Prove image pass-through on the live channel before declaring it: send the probe image and require an answer that matches its content (`scratch/live-image-probe.md`)
- [x] T004 Prove the channel accepts session-affinity headers before enabling them for every model on the provider (`scratch/live-affinity-probe.md`)
- [x] T005 Add the explicit wire-protocol predicate and route every DeepSeek-specific check through it (`.pi/extensions/pi-cache-optimizer/index.ts`)
- [x] T006 Remove the manufactured `thinkingFormat: "deepseek"` value and its advice line from the suggestion and rendered warning (`.pi/extensions/pi-cache-optimizer/index.ts`)
- [x] T007 Align the DeepSeek affinity check with the generic opt-out semantics so an explicit `false` stops warning (`.pi/extensions/pi-cache-optimizer/index.ts`)
- [x] T008 Declare the verified capabilities: provider-level affinity compat and model-level image input (`.pi/models.json`)
- [x] T009 Update the pinned DeepSeek classification and fix-command tests, then add opt-in gate regression coverage (`.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the extension check suite (`cd .pi/extensions/pi-cache-optimizer && npm run check`) — evidence recorded in `scratch/check-run.txt`
- [x] T011 Confirm via the real `model_select` hook, a fresh module instance and the operator's own `models.json` that `llmgateway/deepseek-v4.1-flash` emits no cache-compat warning, with positive controls proving the harness can see one, and that the state stays reachable through the command surface (`scratch/verify-no-warning.txt`)
- [x] T012 Run the packet validator in strict mode and regenerate generated metadata (`specs/hooks/021-compat-opt-in-and-image-declaration/`)
- [x] T013 Write `implementation-summary.md` with the evidence, the reversions taken and the residual limits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Live probes**: `scratch/live-image-probe.md`, `scratch/live-affinity-probe.md`
<!-- /ANCHOR:cross-refs -->

---
