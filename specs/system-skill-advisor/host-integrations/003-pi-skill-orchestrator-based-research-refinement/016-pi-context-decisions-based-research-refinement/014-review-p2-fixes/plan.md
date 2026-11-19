---
title: "Implementation Plan: Review P2 Fixes"
description: "Fix eight of the nine review findings in five skill-advisor files, each test first, in the review's order: the linear task marker, strip before the hook's cut, one stripped fire-gate input, the receipt after delivery, then the small items. R1-P2-004 stays as the fixture records it."
trigger_phrases:
  - "review p2 fixes plan"
  - "linear task marker plan"
  - "fire gate stripped input plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Review P2 Fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, Python 3 |
| **Framework** | None. The Claude `UserPromptSubmit` hook, the advisor brief producer and the Python scorer script |
| **Storage** | The route receipt store and the directive lifecycle store, both already present. No new store |
| **Testing** | Vitest from `.skilled/skills/system-skill-advisor/runtime`, and the custom Python harness `tests/python/test_skill_advisor.py`, which prints `Summary: pass=N, fail=M` |

### Overview
Five source files change, each with a test that fails before its fix. The order follows the review: the marker regex first, because every later change feeds the strip more text. The proof is the two suites against the main baseline of 488 vitest passes (457 plus 31 in the three suites the dependency map added) and 117 Python passes, all exit 0, plus the measured-behavior rerun from `spec.md`.

**Sources.** Code reads in this session and four `@context` explorers covering architecture, features, dependencies and tests. A scratch harness compared the candidate regex with the current one: the same match ends on all 24 fixture rows and on 300,000 fuzzed strings in each language. On the 64K run the Python strip drops from 20,460 ms to 2 ms and the TypeScript strip to 0 ms. The harness itself caught a deliberately wrong candidate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: `spec.md` sections 2 and 3, from `../review/review-report.md`
- [x] Success criteria measurable: `spec.md` section 5 names the commands and thresholds
- [x] Dependencies identified: section 6 below

### Definition of Done
- [ ] All acceptance criteria met: every REQ row in `spec.md` section 4 has evidence in `implementation-summary.md`
- [ ] The two `spec.md` SC-002 commands exit 0: vitest with at least 488 passes plus the new tests, and the Python harness with `fail=0` and at least 117 passes
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hook pipeline, fixed in place. No new module, option or store.

### Key Components
- **`TASK_MARKER` in `runtime/lib/prompt-policy.ts` and `_TASK_MARKER` in `runtime/scripts/skill_advisor.py`**: become `(?:^|[.!?\n][^\S\n]*)(?:now|task)\s*:\s*`. Python spells the new class as `_JS_SPACE_CHARS` without `\n`. Whitespace after a boundary character may no longer cross a newline, so a newline-heavy run is matched once, from its last newline. Each match ends where it did before, and the strip reads only the end.
- **`normalizePrompt` path in `hooks/claude/user-prompt-submit.ts`**: the hook strips the full prompt first, then applies the 64 KiB cut to the stripped text. A short prompt and a prompt with no pasted reply come out the same as today.
- **Fire gate**: `skippedAdvisorResultFor` in `skill-advisor-brief.ts` strips the prompt before it calls `shouldFireAdvisor`. It is the only fire decision at both raw call sites, the hook and `buildSkillAdvisorBrief`, so one change covers both. `shouldFireAdvisor` itself does not change. `buildSkillAdvisorBrief`'s second raw call reads only `metalinguisticMentions` for diagnostics, not the fire decision, and the guard's own `shouldFireAdvisor(strippedPrompt)` already reads stripped text. `SETUP_WORDING` keeps reading the user's text, because setup wording in a pasted reply is still the user's words on screen.
- **Route receipt**: `recordRouteReceipt` runs inside the commit that `writeHookOutput` calls after a clean stdout write. On a path with no deferred commit (pi, dsh, vibe), it runs at once, as today.
- **`parseRecommendations` in `runtime/lib/subprocess.ts`**: copies `confidenceFloored` when it is `true`, as `hooks/lib/skill-advisor-cli-fallback.ts:395` already does.

### Data Flow
Claude sends the prompt. The hook strips the pasted reply, cuts to 64 KiB and checks the fire gate on that text. The CLI scores it, and the weak follow-up guard may suppress the result. The hook renders and writes stdout. Only after a clean write does it commit the directive receipt and the route receipt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the baseline: 457 vitest passes and 117 Python passes on main, and the measured-behavior numbers in `spec.md`. Implementation lands eight fixes in `tasks.md` order, each after a red test: R2-P2-001, R1-P2-001, R3-P2-001 with R4-P2-001, R1-P2-003, R5-P2-001, R1-P2-002, R4-P2-002. Verification reruns both suites and the measurement, rebuilds the advisor and checks the parent goal's first criterion. `tasks.md` owns the ordered work.

Phase 4, added when the operator reopened this phase on 2026-11-19, takes the follow-ups. Code changes go test first through Luna leaves, as before. The alignment runs' literal fixes go through their own `apply-fixes.cjs` into the worktree, and Luna leaves write the doc fixes that carry no literal text. The conductor reviews every diff and runs every check. Worktree `478-advisor-review-follow-ups` takes the commits, and the operator approved merge and push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Red first.** Each fix starts with a test that fails on main for the stated reason. The test is then shown to pass after the fix.
- **Timing tests.** One per language on the 64K whitespace-and-newline run, with a generous ceiling: 50 ms in TypeScript and 500 ms in Python against 1,485 ms and 12,383 ms measured. The ceilings sit far from both, so load cannot flip them.
- **Parity.** The 24-row fixture runs in both languages unchanged. `two-markers-in-user-task` keeps its `expected` value.
- **Hook cases.** A paste over 64 KiB with a task line, the `sk-doc` paste plus `Now: thanks`, a failing and a working stream for the route receipt, and a `lifecycle_event: 'compact'` turn with a held receipt. All use the existing injection helpers and stream stubs in `claude-user-prompt-submit-hook.vitest.ts`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `node`, `npx vitest` and `python3`, as the suites already use. No new package.
- The compiled `runtime/dist` build, made by `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` from the repo root. `tests/hooks/route-receipt.vitest.ts` spawns the built receipt module, and the Claude shim spawns the dist hook on every prompt, so the runtime is rebuilt before the hook tests and before the goal check. `skill_advisor.py` runs from source and needs no build.
- Every runtime reaches the changed hook code. Claude, Codex, Cursor and Devin go through the spec-kit shim. Pi, DSH and Vibe import `handleClaudeUserPromptSubmit` directly. Pi sends no `session_id`, so receipts never apply there.
- Out of scope: the separate copy under `barter/ai-speckit/skilled/` and the docs. `feature-catalog/hooks-and-plugin/claude-hook.md:24-26` describes the casual gate without naming raw or stripped input, so it stays true.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: either suite drops below its baseline, or the parent goal's first criterion no longer lists `sk-code` first. Revert the phase's commits with `git revert` and rebuild the runtime. No persisted data changes shape: the receipt record is written at a different moment, not in a different format.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from the review's Planning Packet as inert data: `findingClasses` are "input-bounds", "gate-input-mismatch", "write-ordering", "dead-code" and "latent-parser-gap". `fixCompletenessRequired` is false. The `affectedSurfacesSeed` names the five source files below.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/prompt-policy.ts` `TASK_MARKER` | Finds the task marker for the strip | Update | Timing test and the 24 fixture rows |
| `runtime/scripts/skill_advisor.py` `_TASK_MARKER` | Python twin of the marker | Update | Python timing check and the fixture rows |
| `hooks/claude/user-prompt-submit.ts` `normalizePrompt` call | Cuts to 64 KiB before any strip | Update | Long-paste hook test |
| `hooks/claude/user-prompt-submit.ts` `skippedAdvisorResultFor` call | Fire gate on raw text | Update | `sk-doc` paste plus `Now: thanks` hook test |
| `runtime/lib/skill-advisor-brief.ts` `buildSkillAdvisorBrief` gate | Fire gate on raw text in the in-process producer | Update | Same case through `buildSkillAdvisorBrief` |
| `hooks/claude/user-prompt-submit.ts` `recordRouteReceipt` call | Writes before the stdout write | Update | Failing and working stream test |
| `hooks/claude/user-prompt-submit.ts` `guardWeakFollowUp` | Ignores `lifecycle_event` | Update | `route-receipt` or hook case with `compact` |
| `hooks/claude/user-prompt-submit.ts` crash catch | Holds an unreachable arm | Update | Crash-fallback tests still pass |
| `runtime/lib/subprocess.ts` `parseRecommendations` | Drops `confidenceFloored` | Update | Parser test with and without the flag |
| `hooks/lib/skill-advisor-cli-fallback.ts:233` | Strips before its 10,000-character cut | Unchanged | Already strips first |
| `runtime/handlers/advisor-recommend.ts:539`, `runtime/lib/scorer/fusion.ts:1277` | Strip callers | Unchanged, gain the linear marker | Handler suite |
| `runtime/bench/scorer-calibration.bench.ts` | Reads stripped text for its gate | Unchanged | Not a consumer of the changed call sites |

**Inventories.** Same-class producers: `rg -n 'TASK_MARKER|_TASK_MARKER' .skilled/skills/system-skill-advisor` finds one definition and one use in each language. Consumers of changed symbols: `rg -n 'skippedAdvisorResultFor|recordRouteReceipt|parseRecommendations' .skilled/skills/system-skill-advisor --glob '*.ts'` finds two gate call sites, one receipt call and one parser.

**Algorithm invariant.** For every input, the end offset of the last marker match is the same before and after the regex change. Adversarial cases: a whitespace run of spaces and newlines, a newline-only run, a marker followed by a long whitespace run, leading whitespace before a marker at the start of the string, and `\r\n` line ends.
<!-- /ANCHOR:affected-surfaces -->
