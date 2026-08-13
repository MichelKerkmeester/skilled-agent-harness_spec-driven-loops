---
title: "Tasks: PI input-hook latency"
description: "Task breakdown for removing the blocking spawnSync chain from the PI input hook, benchmarking the fix, and verifying parity with the other runtimes."
trigger_phrases:
  - "pi input latency tasks"
  - "prompt-advisor tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/005-pi-input-hook-latency"
    last_updated_at: "2026-08-02T15:36:37Z"
    last_updated_by: "implementer"
    recent_action: "Packet complete: in-process advisor hook landed; cache fix; benchmark recorded"
    next_safe_action: "Follow-up candidate: daemon fast-path or non-gating injection for the cold advisor tail"
    blockers: []
    key_files:
      - ".pi/extensions/prompt-advisor.ts"
      - ".pi/extensions/lib/claude-hook-adapter.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-005-pi-input-hook-latency"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: PI input-hook latency

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

> Investigation from the diagnosis turn; complete before this packet was authored.

- [x] T001 Trace the full per-message hook chain for PI and the other three runtimes
  - **Evidence**: `prompt-advisor.ts` (`TIMEOUT_MS = 2_800`, `runClaudeHookAdapter`), `dist/hooks/claude/user-prompt-submit.js` shim (`CHILD_TIMEOUT_MS = 2_500`), advisor hook → `buildSkillAdvisorBrief` → `runAdvisorSubprocess`; opencode plugin `mk-skill-advisor.js` (in-process + 5-min cache); codex/claude hooks run async
- [x] T002 Confirm import-safety of the compiled advisor hook module
  - **Evidence**: `dist/hooks/claude/user-prompt-submit.js` exports `handleClaudeUserPromptSubmit` and guards its CLI entry with `IS_CLI_ENTRY`
- [x] T003 Confirm Pi awaits `input` handlers before agent processing
  - **Evidence**: pi docs `extensions.md` — "Agent processing begins (`before_agent_start`, etc.)" after the `input` event
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Git workspace chosen — current branch (operator decision)
  - **Evidence**: operator answered "B" to the sk-git workspace question; no `worktree` created
- [x] T005 Rewrite `prompt-advisor.ts` to call `handleClaudeUserPromptSubmit` in-process (`.pi/extensions/prompt-advisor.ts` → real file `system-skill-advisor/hooks/pi/prompt-advisor.ts`)
  - **Evidence**: `prompt-advisor.ts` rewritten and loaded by the live `pi` smoke + benchmark runs
- [x] T006 Remove `spawnSync`/`child_process` from the input path; keep `lib/claude-hook-adapter.ts` for session bridges (no edit to the lib)
  - **Evidence**: `grep -n spawnSync .pi/extensions/prompt-advisor.ts` empty; `git diff` shows the lib untouched
- [x] T006b Fix the shared cache-invalidation bug found during benchmarking: cache-set site stores only fingerprint-backed skill labels (`system-skill-advisor/mcp-server/lib/skill-advisor-brief.ts`) — without it the in-process cache never hit
  - **Evidence**: before fix `cacheHit: false` on every call (size stayed 1); after fix call2 = `cacheHit: true` at 1 ms
- [x] T006c Exclude `../hooks/pi/**` from the system-skill-advisor build (`tsconfig.build.json`), matching the system-spec-kit precedent; `npm run build` now exits 0
  - **Evidence**: `npm run build` exit 0 (previously TS2307/TS7006 with emission)
- [x] T007 Update `.pi/extensions/README.md` + `lib/README.md` adapter tables and flow docs
  - **Evidence**: README table row for `prompt-advisor` now names the in-process delegation; lib README notes the adapter no longer serves the input path
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Static check: `grep -n spawnSync .pi/extensions/prompt-advisor.ts` returns nothing (only a comment mention explaining the removed approach; no code path uses it)
  - **Evidence**: `grep -n spawnSync .pi/extensions/prompt-advisor.ts` empty; `grep -c child_process` empty; both confirmed post-edit
- [x] T009 Live smoke: `pi --offline --approve -p "Reply with exactly: OK"` — extension loads, advisor diagnostic emitted, no startup error
  - **Evidence**: smoke run completed with `OK` and an in-process advisor diagnostic line on stderr
- [x] T010 Benchmark before/after: old chain min 1368 ms / median 1418 ms per message (5 runs); new path first 1302 ms then 2/1/1/1 ms cache hits (recorded in implementation-summary.md)
  - **Evidence**: timing table in `implementation-summary.md`; `cacheHit: true` at 1 ms on repeats
- [x] T011 Session bridges untouched: path-scoped `git diff` (`.pi/extensions`, `system-skill-advisor`) shows no change to `lib/claude-hook-adapter.ts` or session-start/stop extensions
  - **Evidence**: `git diff --stat -- .pi/extensions .opencode/skills/system-skill-advisor` = exactly the 5 scoped files, +63/−19; repo-wide status shows unrelated concurrent changes from other sessions (mcp-tooling, deep-loop, .env.example) — not from this packet
- [x] T012 Generate metadata (`generate-description.js` + graph backfill) + `validate.sh --strict`; complete checklist.md and implementation-summary.md
  - **Evidence**: `validate.sh --strict` exit 0 (Errors: 0, Warnings: 0)
- [x] T013 Directive hygiene + structure (post-review amendment): remove the model-family name from every injected hook message across all runtimes; render the injected block as a labeled `Directives:` capsule
  - **Evidence**: `grep -rn "Fable-5" system-skill-advisor/{lib,plugin-bridges,hooks}` = 0 hits; live dist hook emits `Advisor: …\nDirectives:\n- Comment hygiene …\n- Governor: …` with `/Fable/i` false; bridge + renderer + producer + hook suites 41/41 pass; pi smoke passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] No synchronous spawn on the PI input path
- [x] Advisor brief injection confirmed live
- [x] Before/after latency evidence recorded
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
