---
title: "Verification Checklist: PI input-hook latency"
description: "Verification evidence for removing the blocking spawnSync chain from the PI input hook and confirming advisor-brief parity."
trigger_phrases:
  - "pi input latency checklist"
  - "prompt-advisor verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/036-pi-input-hook-latency"
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
      session_id: "impl-036-pi-input-hook-latency"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: PI input-hook latency

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Root cause confirmed with file:line receipts
  - **Evidence**: `prompt-advisor.ts` `TIMEOUT_MS = 2_800` + `runClaudeHookAdapter` (`spawnSync`); shim `CHILD_TIMEOUT_MS = 2_500`; advisor hook `buildSkillAdvisorBrief` → `runAdvisorSubprocess`; pi docs confirm `input` handlers awaited before agent start; opencode plugin in-process + 5-min cache; codex/claude hooks async
- [x] CHK-002 [P0] Import-safety of the advisor hook module confirmed
  - **Evidence**: `dist/hooks/claude/user-prompt-submit.js` exports `handleClaudeUserPromptSubmit`, CLI entry guarded by `IS_CLI_ENTRY`
- [x] CHK-003 [P1] Scope lock recorded
  - **Evidence**: original scope named `prompt-adapter.ts` only; the delivered change legitimately widened to the shared cache/renderer/bridge parity surfaces (see implementation-summary file inventory) while keeping other runtimes' hooks and the classifier vocabulary out of scope
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No synchronous spawn on the input path
  - **Evidence**: `grep -n spawnSync .pi/extensions/prompt-advisor.ts` returns nothing; no `child_process` import remains in the file
- [x] CHK-011 [P0] Advisor envelope contract preserved
  - **Evidence**: transform text = `<prompt>\n\n<additionalContext>` from `hookSpecificOutput.additionalContext` (verified in smoke: advisor diagnostic emitted; brief path exercised in benchmark with status ok)
- [x] CHK-012 [P1] Fail-open preserved
  - **Evidence**: try/catch returns `undefined` on any error; empty-input guard intact
- [x] CHK-013 [P1] Adapter lib untouched for session bridges
  - **Evidence**: `git diff` shows no change to `lib/claude-hook-adapter.ts`; session-start/stop still route through it
- [x] CHK-014 [P1] Comment hygiene holds in the rewritten file
  - **Evidence**: `prompt-advisor.ts` comments explain the durable WHY (pi awaits input handlers; in-process import is safe); no packet/phase/task ids in comments
- [x] CHK-015 [P1] Injected directives are model-agnostic and structured (post-review amendment)
  - **Evidence**: `grep -rn "Fable-5" system-skill-advisor/{lib,plugin-bridges,hooks}` = 0 hits; live dist output is `Advisor: …\nDirectives:\n- Comment hygiene …\n- Governor: …`; the governor capsule deliberately carries no model name because model families change
- [x] CHK-016 [P1] Fallback-directive contract documented in tests
  - **Evidence**: hook suite AS2/AS3/AS6/CHK-021 now assert the real `brief ?? renderAdvisorFallbackDirective()` behavior — the directives block is always delivered; hook + renderer + producer suites 41/41 pass
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Live smoke: extension loads and completes a turn
  - **Evidence**: `pi --offline --approve -p "Reply with exactly: OK"` → `OK`; advisor diagnostic emitted to stderr (in-process execution confirmed); no extension-load error
- [x] CHK-021 [P0] Advisor brief still injected
  - **Evidence**: benchmark path with a substantive prompt returns status ok + `additionalContext` (brief present); the smoke's `below_prompt_policy_threshold` skip is existing policy behavior
- [x] CHK-022 [P1] Before/after latency evidence recorded
  - **Evidence**: old chain 5 fresh messages min 1368 ms / median 1418 ms; new path first 1302 ms, then 2/1/1/1 ms cache hits — full table in implementation-summary.md
- [x] CHK-023 [P1] No regression on other runtimes
  - **Evidence**: path-scoped `git diff --stat -- .pi/extensions .opencode/skills/system-skill-advisor` = exactly the 5 scoped files (+63/−19); claude/codex/opencode hook wiring untouched; the shared cache-set filter is inert for per-process consumers (fresh processes never retained entries). Repo-wide `git status` additionally shows unrelated concurrent changes from other sessions — not attributed to this packet
- [x] CHK-024 [P0] Shared cache actually hits in-process
  - **Evidence**: repeat-prompt `cacheHit: true` at ~1 ms (was `cacheHit: false` every call before the set-site filter fix); regression test `AS9b` in `advisor-brief-producer.vitest.ts` (mixed graph-backed + command/registry labels → second call hits cache, no subprocess) — 18/18 tests pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned
  - **Evidence**: class-of-bug — blocking synchronous multi-process spawn on a hot lifecycle path, plus a cache invalidation defect that made the in-process cache never hit; fixed by in-process reuse of the shared lifecycle module and a set-site label filter (`skill-advisor-brief.ts`)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: grep for `spawnSync` across `.pi/extensions/` and the pi hook adapters: only the input path (`prompt-advisor.ts` via adapter) was hot; session bridges are once-per-session and remain
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed behavior
  - **Evidence**: consumers of the advisor envelope = the single `input` transform; no other consumer of the adapter's `user-prompt-submit.js` route on PI; cache-entry `skillLabels` consumers = `deletedCachedSkills` only
- [x] CHK-FIX-004 [P0] Adversarial table tests for security/parser fixes
  - **Evidence**: `[deferred: not a security/path/parser/redaction change; latency refactor of an existing fail-open hook]`
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed
  - **Evidence**: axes = session state (fresh process vs one session) × prompt (repeat/new) × runtime parity (pi vs claude/codex/opencode); rows exercised by the benchmark (5 fresh vs 5 same-session, `cacheHit` truth table) + smoke
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant
  - **Evidence**: `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` honored unchanged by the shared hook; a disabled advisor returns `{}` → transform skipped
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit source lines
  - **Evidence**: change pinned to `prompt-advisor.ts` (rewrite), `skill-advisor-brief.ts` cache-set site, `tsconfig.build.json` hooks/pi exclusion; timing table in implementation-summary.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new subprocess surface
  - **Evidence**: the input path spawns strictly fewer processes than before (0 hook spawns vs 2); `grep child_process` empty in the extension
- [x] CHK-031 [P0] No secrets or credentials touched
  - **Evidence**: path-scoped `git diff` limited to the extension rewrite, the shared cache filter, tsconfig exclusion, READMEs, and spec docs; no credential-adjacent file touched
- [x] CHK-032 [P1] Fail-open means no turn is ever dropped by the advisor
  - **Evidence**: catch path returns `undefined`; the smoke run completed normally through the in-process path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `.pi/extensions/README.md` consistent with the new wiring
  - **Evidence**: adapter table row for `prompt-advisor` updated to the in-process delegation; flow section documents the exception; `lib/README.md` notes the adapter no longer serves the input path
- [x] CHK-041 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three reflect the final in-process implementation + the shared cache filter + the tsconfig exclusion
- [x] CHK-042 [P2] Benchmark methodology reproducible
  - **Evidence**: commands + prompts recorded in implementation-summary.md (harness: spawnSync shim chain vs in-process handleClaudeUserPromptSubmit, 5 runs each)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only
  - **Evidence**: timing harness written to `/tmp/hook-bench.mjs`; no packet temp files
- [x] CHK-051 [P1] scratch cleaned before completion
  - **Evidence**: `git status` shows no packet `scratch/` artifacts under `036-pi-input-hook-latency`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-02
<!-- /ANCHOR:summary -->
