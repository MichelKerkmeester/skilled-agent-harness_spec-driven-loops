---
title: "Tasks: Headless Fallback Status and Dedup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fallback status tasks"
  - "fallback dedup tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Headless Fallback Status and Dedup

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

- [x] T001 Record baseline pass counts for the advisor runtime suite and the plugin suite. Evidence: the 003 close-out run, advisor 911 passed, 1 failed, 6 skipped of 918 (the ratchet), plugin 29 of 29.
- [x] T002 List every test that pins today's fallback text, starting from the five named in `spec.md` section 3. Evidence: the old text was pinned by hook tests AS2, AS3, AS6, the Python-missing case and DL5; the `fallback` value in `tests/parity/fixtures/policy-plan/baseline-contexts.json`, which fed six failure-fallback parity cases; `FALLBACK_CONTEXT` in the plugin vitest; and a source pin and four transform-dedup tests in the plugin `.cjs` suite. The observation-sink and negative-control tests named in `spec.md` compare the renderer to itself and passed unchanged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 R4: write the failing hook tests for the outage, no-match and skipped heads (`runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Evidence: outage, no-match, skipped, head-length and five-turn cases in `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, plus the CLI-path pairs `skipped`/`live`, `skipped`/`absent` and `degraded`/`stale`.
- [x] T004 R4: make the fallback renderer status-aware and rewrite the timeout renderer as the outage head (`runtime/lib/render.ts:443-463`). Evidence: `advisorFallbackCase` and `renderAdvisorFallbackDirective` in `runtime/lib/render.ts`; `renderAdvisorTimeoutFallback` now renders the outage head and its marker line is gone. The case reads status and freshness, because the CLI path reports a no-match as `skipped` with `live` or `stale` freshness.
- [x] T005 R4: pass the result's status and freshness to the renderer (`hooks/claude/user-prompt-submit.ts:302`). Evidence: `renderAdvisorFallbackDirective(renderOptions, result)` in `hooks/claude/user-prompt-submit.ts`.
- [x] T006 R4: mirror the three heads in the plugin and add the renderer parity test (`.skilled/plugins/system-skill-advisor.js:61`, `:1298-1318`, `:1371-1383`). Evidence: `renderPluginFallbackDirective` in `.skilled/plugins/system-skill-advisor.js` and its three call sites; the parity test covers every status and freshness pair in the rule.
- [x] T007 [P] R4: teach Pi's debug classifier the three heads (`hooks/pi/prompt-advisor.ts:184`). Evidence: `formatPiAdvisorDebug` in `hooks/pi/prompt-advisor.ts` labels `fallback(outage)`, `fallback(no-match)`, `fallback(skipped)` and `fallback(headless)`.
- [x] T008 R4: update the tests T002 listed to the headed text. Evidence: every T002 pin updated to the headed text; the four plugin transform-dedup tests now switch lifecycle dedup off so they isolate the mechanism they test, with assertions unchanged.
- [x] T009 R6: write the five-turn repeat test for the hook and the plugin, plus the no-session-id case. Evidence: DL5 in the hook test and two plugin tests: five turns give one full fallback and four heads for a known session, and five full fallbacks without one.
- [x] T010 R6: stop treating a headed fallback as a fall-open case (`hooks/claude/user-prompt-submit.ts:303-308`, plugin `:267-272`). Evidence: no code change was needed; the lifecycle split only needs a non-empty head before `\nDirectives:`. The hook and plugin comments now say a headed fallback reduces like a brief.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Show each new test failing on the unchanged code, then passing. Evidence: with each source change reverted, 13 hook tests, 28 plugin vitest tests and 5 plugin `.cjs` tests, and 4 Pi tests failed; all passed with the changes restored.
- [x] T012 Run `npm run typecheck` and `npm test` in the advisor runtime and the plugin suite, and report the delta against T001. Evidence: typecheck exit 0; advisor 947 passed, 1 failed, 6 skipped of 954, which is the T001 baseline plus 36 new tests with the same single ratchet failure; plugin 29 of 29; drift guards passed.
- [x] T013 With debug on, run five no-route Claude turns and read the directives-suppressed flag and `emittedBytes` from the diagnostic log. Evidence: five live no-route turns through the real shim in one session, heads `Advisor: no skill matched.`; `emittedBytes` 244 then 26, 26, 26, 26 with `directivesSuppressed` true on turns 2 to 5; the same turns without a session id gave 244 bytes each with nothing suppressed.
- [x] T014 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`. Evidence: strict recursive run over the packet, all five folders `RESULT: PASSED` with 0 errors and 0 warnings
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
- **Research**: `../001-deep-research/research/research.md` R4 and R6, and open questions Q6 and Q7
<!-- /ANCHOR:cross-refs -->

---
