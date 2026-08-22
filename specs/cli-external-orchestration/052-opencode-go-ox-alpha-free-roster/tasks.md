---
title: "Tasks: opencode-go Ox Alpha Free roster"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "ox-alpha-free roster"
  - "opencode-go ox alpha"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T10:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded task breakdown; all tasks complete"
    next_safe_action: "Packet complete pending operator review"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: opencode-go Ox Alpha Free roster

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

- [x] T001 Live-probe opencode-go + pi for the model [evidence: `opencode models opencode-go` lists `opencode-go/ox-alpha-free`; `pi --list-models` does NOT list it yet (stale catalog)]
- [x] T002 Read both enforcement points + roster docs [evidence: `executor-config.ts` `PI_SUPPORTED_MODELS` + `fanout-run.cjs` `PI_ALLOWED_MODELS`/`PI_MODEL_PROVIDERS` located; both `### opencode-go` doc sections read]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `ox-alpha-free` to `PI_SUPPORTED_MODELS` [evidence: `executor-config.ts` array now 11 ids incl `ox-alpha-free`]
- [x] T004 Add `ox-alpha-free` to `PI_ALLOWED_MODELS` mirror [evidence: `fanout-run.cjs` Set synced with executor-config]
- [x] T005 Map provider: add `ox-alpha-free → opencode-go` [evidence: `PI_MODEL_PROVIDERS` has `['ox-alpha-free','opencode-go']`]
- [x] T006 Add `ox-alpha-free` row to cli-pi roster doc [evidence: `cli-pi/references/providers-and-models.md` `### opencode-go` row added; "both models"→"the models"]
- [x] T007 Add `opencode-go/ox-alpha-free` row to cli-opencode roster doc [evidence: `cli-opencode/references/providers-and-models.md` `### opencode-go` row added]
- [x] T008 Extend guard test expectations [evidence: `executor-config.vitest.ts` exact-roster array + `fanout-run.vitest.ts` `providerByModel` both gained `ox-alpha-free`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Negative control + syntax + unit tests [evidence: pre-test-edit run failed ONLY on the roster guard showing `+ "ox-alpha-free"`; `node --check fanout-run.cjs` ok; post-edit `npx vitest run` = 199 passed]
- [x] T010 Fanout builder wiring probe [evidence: `buildLineageCommand({kind:'cli-pi',model:'ox-alpha-free'})` emits `pi -p --offline --model opencode-go/ox-alpha-free probe`]
- [x] T011 Live dispatch routing [evidence: pi dispatch reached the gateway (429 `GoUsageLimitError`, custom-model-id fallback); `opencode run --model opencode-go/ox-alpha-free` selected the model (`build · ox-alpha-free`). Full turn deferred by opencode-go monthly quota]
- [x] T012 Spec docs + metadata + strict validate [evidence: 5 docs + `description.json`/`graph-metadata.json`; `validate.sh --strict` recorded in implementation-summary]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T012` complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Tests green + routing live-confirmed [evidence: see `implementation-summary.md` Verification table]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
