---
title: "Tasks: devin allowlist prune, DeepSeek gap, and mirror parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "devin prune tasks"
  - "deepseek allowlist tasks"
  - "mirror parity tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-devin-allowlist-prune-and-deepseek"
    last_updated_at: "2026-07-30T05:51:30.711Z"
    last_updated_by: "implementer"
    recent_action: "Mark executed tasks with evidence"
    next_safe_action: "Commit the runtime change + packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-045-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: devin allowlist prune, DeepSeek gap, and mirror parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete · `[ ]` pending · `[P]` parallelizable · `[B]` blocked
- Format: `T### description — [evidence: proof]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 Sweep runtime-consumed configs for prune-candidate devin aliases — [evidence: `rg "cli-devin"` over deep-loop scripts/adapters/harnesses returned 0 devin-scoped model pins]
- [x] T002 Re-check catalog↔runtime mapping; found the DeepSeek family absent from the devin allowlist — [evidence: devin block grep 0 deepseek ids pre-change; both existing hits were PI-scoped (`executor-config.ts:158/169`)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

Dispatched to GPT-5.6 SOL (high, fast) via cli-codex under an exact-target-state brief.

- [x] T003 Replace `DEVIN_SUPPORTED_MODELS` with the curated 15-id set; comments made truthful (`executor-config.ts`) — [evidence: 15-id grep count; 0 pruned ids]
- [x] T004 Align the CJS mirror `DEVIN_ALLOWED_MODELS` to the same set (`fanout-run.cjs`) — [evidence: 15-id grep count; 0 pruned ids]
- [x] T005 Expose the mirror's set + default on the script's existing `module.exports` for testing — [evidence: `fanout-run.vitest.ts:1258` destructure]
- [x] T006 Add mirror-parity assertions (sorted-set + default vs the TS exports) — [evidence: `fanout-run.vitest.ts:1266`]
- [x] T007 Extend rejection fixtures with `adaptive` and `opus`; update the exact-set pin — [evidence: suite green with pruned ids rejected]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T008 Orchestrator-run suites: `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` — [evidence: Test Files 2 passed, Tests 182 passed (182)]
- [x] T009 Content greps on both devin blocks: 15/15 ids, 0 pruned, deepseek ×2 each, default `swe` in both — [evidence: `executor-config.ts:252`, `fanout-run.cjs:1809`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Both suites green in an orchestrator-run pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Requirements and acceptance criteria: `spec.md`
- Executed approach, gates, rollback: `plan.md`
- Verification results: `checklist.md`, `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
