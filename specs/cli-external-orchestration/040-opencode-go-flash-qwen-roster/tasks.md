---
title: "Tasks: opencode-go Flash + Qwen 3.8 Max roster"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "opencode-go roster"
  - "qwen3.8-max"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/040-opencode-go-flash-qwen-roster"
    last_updated_at: "2026-08-07T13:25:40Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded task breakdown; all tasks complete"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-040-opencode-go-flash-qwen"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: opencode-go Flash + Qwen 3.8 Max roster

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

- [x] T001 Live-probe opencode-go for both models [evidence: `opencode models` lists `opencode-go/deepseek-v4-flash` and `opencode-go/qwen3.8-max`]
- [x] T002 Read both enforcement points + roster docs [evidence: `executor-config.ts` `PI_SUPPORTED_MODELS` + `fanout-run.cjs` mirror/map located]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `qwen3.8-max` to `PI_SUPPORTED_MODELS` [evidence: `executor-config.ts` array now 9 ids incl `qwen3.8-max`]
- [x] T004 Add `qwen3.8-max` to `PI_ALLOWED_MODELS` mirror [evidence: `fanout-run.cjs` Set synced with executor-config]
- [x] T005 Map providers: add qwen→opencode-go, re-point flash→opencode-go [evidence: `PI_MODEL_PROVIDERS` has `['qwen3.8-max','opencode-go']` and `['deepseek-v4-flash','opencode-go']`]
- [x] T006 Add `### opencode-go` to cli-pi roster doc [evidence: `cli-pi/references/providers-and-models.md` opencode-go section added]
- [x] T007 Add `### opencode-go` to cli-opencode roster doc [evidence: `cli-opencode/references/providers-and-models.md` opencode-go section added]
- [x] T008 Update guard test expectations [evidence: `executor-config.vitest.ts` + `fanout-run.vitest.ts` roster/provider pins updated]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Syntax + unit tests [evidence: `node --check fanout-run.cjs` ok; `npx vitest run` 186 passed]
- [x] T010 Live dispatch both models [evidence: `opencode run --model opencode-go/qwen3.8-max` and `--model opencode-go/deepseek-v4-flash` both returned OK; `pi --provider opencode-go --model qwen3.8-max` returned OK]
- [x] T011 Spec docs + metadata + strict validate [evidence: 5 docs + `description.json`/`graph-metadata.json`; `validate.sh --strict` recorded in implementation-summary]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T011` complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Tests and live dispatch passed [evidence: see `implementation-summary.md` Verification table]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
