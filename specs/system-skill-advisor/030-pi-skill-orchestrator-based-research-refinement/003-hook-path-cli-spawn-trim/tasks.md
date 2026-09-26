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

- [ ] T001 Record baseline pass counts for the advisor runtime suite and the plugin suite (`runtime/`, `.skilled/plugins/tests/system-skill-advisor.test.cjs`)
- [ ] T002 Start a daemon from the unchanged build, send it an `advisor_recommend` call carrying an unknown option, and record the error code and exit code the CLI returns (`runtime/skill-advisor-cli.ts:991-997`)
- [ ] T003 Pull the 002 `durationMs` baseline for hook turns whose top result is a compiled hub
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 R2: write the failing handler test that counts `compiled-route.cjs` calls with and without `includeCompiledRoute: false`, on a fresh result and on a cache hit (`runtime/tests/handlers/`)
- [ ] T005 R2: add `includeCompiledRoute` to the zod options (`runtime/schemas/advisor-tool-schemas.ts:217-228`)
- [ ] T006 R2: add it to the tool descriptor and the CLI manifest, and run both parity tests (`runtime/tools/advisor-recommend.ts:12-25`, `runtime/skill-advisor-cli-manifest.ts:23-45`)
- [ ] T007 R2: skip `enrichCompiledRoutes` at both returns when the option is `false` (`runtime/handlers/advisor-recommend.ts:504`, `:571`)
- [ ] T008 R2: send `includeCompiledRoute: false` from the hook-side payload (`hooks/lib/skill-advisor-cli-fallback.ts:222`)
- [ ] T009 R2: retry once without the option on the rejection T002 recorded, with a stub-daemon test (`runtime/skill-advisor-cli.ts:1414`)
- [ ] T010 R5: write the failing hook tests for `/help` and "thanks" with a `buildCliBrief` spy (`runtime/tests/hooks/`)
- [ ] T011 R5: call `shouldFireAdvisor` before the injected and CLI branches and return a `skipped` result when it declines (`hooks/claude/user-prompt-submit.ts:270-290`)
- [ ] T012 [P] R5: write the replay over `labeled-prompts.jsonl` and `gate2-golden-prompts.jsonl` that lists declined prompts with a real expected skill (`runtime/tests/`)
- [ ] T013 Docs: rewrite the hook flow in `hooks/skill-advisor-hook.md:37-49` and `ARCHITECTURE.md:133` to describe the CLI-only hook with the gate in front of it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Show each new test failing on the unchanged code, then passing
- [ ] T015 Run `npm run typecheck` and `npm test` in the advisor runtime and the plugin suite, and report the delta against T001
- [ ] T016 Confirm the replay's declined-and-routable list is empty
- [ ] T017 Over a debug-on window, compare median hook `durationMs` on compiled-hub turns against T003
- [ ] T018 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/research.md` R2 and R5, and open questions Q1 and Q2
<!-- /ANCHOR:cross-refs -->

---
