---
title: "Tasks: Hook Path CLI Spawn Trim"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook path cli spawn tasks"
  - "casual prompt gate tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hook Path CLI Spawn Trim

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

- [x] T001 Record baseline pass counts for the advisor runtime suite and the plugin suite (`runtime/`, `.skilled/plugins/tests/system-skill-advisor.test.cjs`). Evidence: the 002 close-out run, advisor 903 passed, 1 failed, 6 skipped of 910 (the failure is the routing-divergence ratchet), plugin 29 of 29.
- [x] T002 Start a daemon from the unchanged build, send it an `advisor_recommend` call carrying an unknown option, and record the error code and exit code the CLI returns (`runtime/skill-advisor-cli.ts:991-997`). Evidence: the old strict zod schema raises `unrecognized_keys ["includeCompiledRoute"]`, the server maps it to JSON-RPC -32602 (`runtime/advisor-server.ts:290-295`), and the unchanged CLI exits 64 against a fake daemon that rejects the key.
- [x] T003 Pull the 002 `durationMs` baseline for hook turns whose top result is a compiled hub. Evidence: four `sk-code` hook turns from the 002 live checks, 741, 940, 1,062 and 1,166 ms, median about 1,001 ms. A live rerun was blocked once source edits made the dist stale (CLI exit 69).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 R2: write the failing handler test that counts `compiled-route.cjs` calls with and without `includeCompiledRoute: false`, on a fresh result and on a cache hit (`runtime/tests/handlers/`). Evidence: `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`, default, fresh and cache-hit cases.
- [x] T005 R2: add `includeCompiledRoute` to the zod options (`runtime/schemas/advisor-tool-schemas.ts:217-228`). Evidence: `runtime/schemas/advisor-tool-schemas.ts:227`.
- [x] T006 R2: add it to the tool descriptor and the CLI manifest, and run both parity tests (`runtime/tools/advisor-recommend.ts:12-25`, `runtime/skill-advisor-cli-manifest.ts:23-45`). Evidence: `runtime/tools/advisor-recommend.ts:23`, `runtime/skill-advisor-cli-manifest.ts:40`; both parity tests pass.
- [x] T007 R2: skip `enrichCompiledRoutes` at both returns when the option is `false` (`runtime/handlers/advisor-recommend.ts:504`, `:571`). Evidence: `runtime/handlers/advisor-recommend.ts:504-506`, `:573-575`; cache writes unchanged.
- [x] T008 R2: send `includeCompiledRoute: false` from the hook-side payload (`hooks/lib/skill-advisor-cli-fallback.ts:222`). Evidence: `hooks/lib/skill-advisor-cli-fallback.ts:228-230`; test in `runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts`.
- [x] T009 R2: retry once without the option on the rejection T002 recorded, with a stub-daemon test (`runtime/skill-advisor-cli.ts:1414`). Evidence: `runtime/skill-advisor-cli.ts:1422-1440`; `runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` covers the retry and an unrelated -32602 that is not retried.
- [x] T010 R5: write the failing hook tests for `/help` and "thanks" with a `buildCliBrief` spy (`runtime/tests/hooks/`). Evidence: `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, `/help`, "thanks" and a routable prompt.
- [x] T011 R5: call `shouldFireAdvisor` before the injected and CLI branches and return a `skipped` result when it declines (`hooks/claude/user-prompt-submit.ts:270-290`). Evidence: `skippedAdvisorResultFor` in `runtime/lib/skill-advisor-brief.ts`, called before the CLI in `hooks/claude/user-prompt-submit.ts`; the injected full producer stays ungated.
- [x] T012 [P] R5: write the replay over `labeled-prompts.jsonl` and `gate2-golden-prompts.jsonl` that lists declined prompts with a real expected skill (`runtime/tests/`). Evidence: `runtime/tests/prompt-policy-gold-replay.vitest.ts`.
- [x] T013 Docs: rewrite the hook flow in `hooks/skill-advisor-hook.md:37-49` and `ARCHITECTURE.md:133` to describe the CLI-only hook with the gate in front of it. Evidence: `hooks/skill-advisor-hook.md` steps 3 to 5, the `{}` paragraph, the section 3 lead, the fail-open overview and table row, and the CLI-caller and Python-scorer rows; `ARCHITECTURE.md` section 5. Both validate with 0 issues.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Show each new test failing on the unchanged code, then passing. Evidence: with each change reverted, the handler test (`expected true to be false`), the gate tests (`expected ok to be skipped`), the payload test (`expected undefined to be false`) and the retry test failed, then passed with it restored. The schema field has no test of its own beyond the parity pair, and the replay passes either way because the gate declines no corpus prompt.
- [x] T015 Run `npm run typecheck` and `npm test` in the advisor runtime and the plugin suite, and report the delta against T001. Evidence: typecheck exit 0; advisor 911 passed, 1 failed, 6 skipped of 918, which is the T001 baseline plus the 8 new tests with the same single ratchet failure; plugin 29 of 29.
- [x] T016 Confirm the replay's declined-and-routable list is empty. Evidence: 195 labeled and 9 golden prompts replayed, 0 declined, so the declined-and-routable list is empty.
- [x] T017 Over a debug-on window, compare median hook `durationMs` on compiled-hub turns against T003. Evidence: paired hook A/B on one build and one daemon, 45 pairs, enrichment off saves a median 65 ms per turn and is faster in 35 pairs; CLI A/B on an isolated daemon, 1,097 to 1,021 ms. See the implementation summary for why the comparison is paired rather than against the four-sample T003 window.
- [x] T018 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`. Evidence: strict recursive run over the packet, all five folders `RESULT: PASSED` with 0 errors and 0 warnings
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
- **Research**: `../001-deep-research/research/research.md` R2 and R5, and open questions Q1 and Q2
<!-- /ANCHOR:cross-refs -->

---
