---
title: "Tasks: Ox Alpha via the Cline provider for cli-pi"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "cline ox-alpha cli-pi"
  - "cline-pass ox-alpha roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/053-cline-ox-alpha-cli-pi-roster"
    last_updated_at: "2026-08-24T10:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete; live-verified x-ai/ox-alpha (PONG)"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-053-cline-ox-alpha-cli-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Ox Alpha via the Cline provider for cli-pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm the Cline provider block + DeepSeek treatment [evidence: `.pi/models.json` `cline-pass` block has 2 DeepSeek models with `thinkingLevelMap` topping at `xhigh`; `.pi/custom-providers.md` §2 documents the slashed-id contract]
- [x] T002 Confirm Ox Alpha context/output + tier facts [evidence: pi model store — `contextWindow` 1,000,000, `maxTokens` 131,072, reasoning; Cline picker tops at "Extra High" (xhigh)]
- [x] T003 Locate fan-out enforcement points + guard assertions [evidence: `PI_SUPPORTED_MODELS` (executor-config.ts), `PI_ALLOWED_MODELS`/`PI_MODEL_PROVIDERS` (fanout-run.cjs), 3 guard tests]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `x-ai/ox-alpha` model to the `cline-pass` block (`.pi/models.json`) [evidence: JSON valid; `pi --list-models` shows the row]
- [x] T005 Add `cline-pass/x-ai/ox-alpha` to `enabledModels` (`.pi/settings.json`) [evidence: settings.json valid; entry present]
- [x] T006 Add `x-ai/ox-alpha` to `PI_SUPPORTED_MODELS` (`executor-config.ts`) [evidence: roster + guard assert]
- [x] T007 Mirror in `PI_ALLOWED_MODELS` + map `x-ai/ox-alpha → cline-pass` in `PI_MODEL_PROVIDERS` (`fanout-run.cjs`) [evidence: `node --check` ok; providerByModel guard]
- [x] T008 Document Ox Alpha in `.pi/custom-providers.md` §2 (models, dispatch, verify, remove) [evidence: §2 lists Ox Alpha + `x-ai/` prefix gotcha]
- [x] T009 Add the Ox Alpha row + note under `### cline-pass` (cli-pi `providers-and-models.md`) [evidence: table row + gotcha updated]
- [x] T010 Swap guard-test expectations (`executor-config.vitest.ts` exact-roster + `fanout-run.vitest.ts` providerByModel) [evidence: 199 passed / 0 failed]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Syntax + unit tests [evidence: `node --check` ok; `executor-config.vitest.ts` + `fanout-run.vitest.ts` = 199 passed / 0 failed]
- [x] T012 Fanout builder wiring probe [evidence: emits `["-p","--offline","--model","cline-pass/x-ai/ox-alpha","probe"]`]
- [x] T013 Live Cline dispatch [evidence: `pi -p --provider cline-pass --model cline-pass/x-ai/ox-alpha --thinking xhigh` returned `PONG`; `cline-pass/ox-alpha` + `…-free` both 404 (negative control)]
- [x] T014 Spec docs + metadata + strict validate [evidence: 5 docs + `description.json`/`graph-metadata.json`; `validate.sh --strict` Errors:0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001–T014 complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Tests green + live Cline dispatch verified [evidence: 199 passed; real `PONG` on `cline-pass/x-ai/ox-alpha`]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
