---
title: "Feature Specification: Handler Scored-Prompt Consumers"
description: "The recommend handler scores the stripped prompt but hands the raw prompt to compiled-route enrichment and typed-command attachment, so a command named inside a pasted reply attaches to the user's real task. This phase passes the stripped prompt to both, on the cache-hit and the cache-miss path."
trigger_phrases:
  - "handler scored prompt consumers"
  - "phase 8 handler scored prompt consumers"
  - "pasted command attaches to task"
  - "compiled route raw prompt pasted reply"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Handler Scored-Prompt Consumers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 13 |
| **Predecessor** | 007-python-scorer-strip-parity |
| **Successor** | 009-crash-fallback-edge-cases |
| **Handoff Criteria** | The two new handler tests failed before the fix and pass after it, `rg -c 'input\.prompt'` on the handler prints 1 and the compiled-route probe prints the same routes for the pasted and the plain task from a daemon started after the build. Phase 009 builds next |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the pi-context-decisions refinement packet. It fixes refutation finding 4 from the phase 002 build. The finding is recorded in `tmp/p002-briefs/out/last-refute.txt` at the repository root. It also closes the compiled-route follow-up that 002 recorded in `../002-pasted-context-stripping/implementation-summary.md:124`.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot. A pasted reply means text the user copied from an earlier assistant turn and put in front of the new task. The stripped prompt, called `scoredPrompt` in the handler, is the task left after the strip removes that reply.

**Scope Boundary**: Four argument swaps in `runtime/handlers/advisor-recommend.ts` and two tests. The strip rule, the scorer and the command tables stay as they are.

**Dependencies**:
- The strip rule as phase 006 leaves it. `stripLeadingPastedReply` lives in `runtime/lib/prompt-policy.ts` and the handler calls it once at `runtime/handlers/advisor-recommend.ts:536`.

**Deliverables**:
- `enrichCompiledRoutes` and `attachTypedCommand` read `scoredPrompt` on both cache paths.
- One leak test and one equality test in the compiled-route handler test file.
- The 002 compiled-route probe, rerun as a conductor check after the build.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`computeRecommendationOutput` strips the pasted reply once (`runtime/handlers/advisor-recommend.ts:536`) and uses the result for the cache key (`:537-549`), the embedding and the scorer (`:571-579`) and the public fields (`:584-588`). The two steps after scoring still get the raw `input.prompt`: the cache-hit return (`:562-567`) and the cache-miss return (`:640-645`) pass it to both `enrichCompiledRoutes` and `attachTypedCommand`.

That gives two wrong results, each with its own cause.
- **Typed command.** `attachTypedCommand` (`:427-447`) asks `typedCommandForTop` (`runtime/lib/command-attach.ts:256-263`) for a command typed in the prompt, so a `/doctor:sk-code quality` inside the pasted reply attaches to an `sk-code` top recommendation. The command cannot come from the compiled route, because `MODE_COMMANDS` has no `sk-code` row (`runtime/lib/command-attach.ts:15-40`).
- **Compiled route.** `enrichCompiledRoutes` (`:362-421`) sends the prompt to the compiled-route front door on stdin (`:336`), so a pasted `/deep:review` turns the `sk-code` route from `defer` into a route to `sk-code-review`.

The cache stores the output before enrichment (`:634-639`), and the key is built from the stripped text, so the pasted prompt and the plain task share one entry. Every call then enriches with its own raw prompt, and the leak shows on a cache hit as well as on a miss.

### Purpose
A pasted reply changes neither the command nor the compiled route the user's task gets, on a cache hit or a miss.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 from the repository root against worktree daemon 7589. It started at 15:39:46, after the 15:38:42 build of `runtime/dist/runtime/handlers/advisor-recommend.js`. The handler source last changed at 14:50:51.

```text
$ set -o pipefail; node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Earlier you replied: Run /doctor:sk-code quality. Now: Refactor the session store module to remove duplicated locking code" --format json | node -e '<print hit, top, command and mode>'; echo "exit=$?"
hit=true top=sk-code cmd=/doctor:sk-code quality mode=sk-code-quality
exit=0

$ T013 compiled-route probe from 002, p = "Earlier you replied: I ran /deep:review on the hook changes. Now: Refactor the session store module to remove duplicated locking code", output cut to 120 columns
sk-code {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"review-cache","packetId"
sk-doc {"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"7d4bb86f5c38a128e4e63
cli-external-orchestration {"hubId":"cli-external-orchestration","action":"defer","selectionKind":null,"targets":[],"eff
exit=0

$ the same probe, p = "Refactor the session store module to remove duplicated locking code"
sk-code {"hubId":"sk-code","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"fa67ec3ab8531b8a01e
sk-doc {"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"7d4bb86f5c38a128e4e63
cli-external-orchestration {"hubId":"cli-external-orchestration","action":"defer","selectionKind":null,"targets":[],"eff
exit=0

$ node --input-type=module -e "<print stripLeadingPastedReply(argv[1]) from runtime/dist/runtime/lib/prompt-policy.js>" "<each pasted prompt above>"
"Refactor the session store module to remove duplicated locking code"
exit=0
"Refactor the session store module to remove duplicated locking code"
exit=0

$ rg -c 'input\.prompt' .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts
5
```

The pasted `/doctor:sk-code quality` reaches the task as its command on a cache hit, and the pasted `/deep:review` gives `sk-code` a route the plain task does not get. Both pasted prompts strip to the plain task under the current rule.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pass `scoredPrompt` instead of `input.prompt` to `enrichCompiledRoutes` and to `attachTypedCommand` on the cache-hit return at `runtime/handlers/advisor-recommend.ts:562-567`.
- Make the same two swaps on the cache-miss return at `:640-645`.
- Add a leak test: the pasted `/doctor:sk-code quality` prompt carries no command on a cache miss and again on a cache hit.
- Add an equality test: the pasted `/deep:review` prompt and the plain task get the same `compiledRoute` and `command`, and the front door reads the stripped task on stdin.
- Rerun the 002 compiled-route probe after the build and a daemon restart.
- Amended 2026-11-18, from phase 007's open question: the CLI's degraded path keeps a command row's fields when the raw prompt holds its bare command (`runtime/skill-advisor-cli.ts:1498`, called at `:1585`). It reads the stripped prompt instead, so a command named only in a pasted reply cannot attach when the daemon is unreachable.

### Out of Scope
- The strip rule - phase 006 owns it, and this phase reads whatever rule 006 leaves.
- The command-routing capture at `runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:591` - it calls `typedCommandForTop` on rows of `command-prompts.jsonl`, and no row there carries a pasted reply. `rg -n -i 'you replied|assistant response|earlier you'` on that file printed nothing and exited 1 on 2026-11-18.
- `typedCommandIn` inside the scorer (`runtime/lib/scorer/fusion.ts:1243`, `:1256`) - the scorer strips at its entry (`:1277`), so it already reads the stripped text.

### Every `input.prompt` Read in the Handler
After the fix one read stays. Two calls take the whole `input` and read no prompt.

| Line | Read | Verdict |
|------|------|---------|
| `:536` | `stripLeadingPastedReply(input.prompt)` | Stays. It is the one place the raw prompt must be read, to produce `scoredPrompt` |
| `:565`, `:566` | cache-hit `enrichCompiledRoutes` and `attachTypedCommand` | Swap to `scoredPrompt` |
| `:643`, `:644` | cache-miss `enrichCompiledRoutes` and `attachTypedCommand` | Swap to `scoredPrompt` |
| `:593` | `outputAbstainReasons(input, result)` | No prompt read. The function reads only `input.options` (`:500-509`) |
| `:657` | `disabledRecommendOutput(input, process.env, {})` | No prompt read. Its parameter type holds only `workspaceRoot` and `options` (`runtime/lib/advisor-disabled.ts:150-158`) |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/handlers/advisor-recommend.ts` | Modify | `input.prompt` becomes `scoredPrompt` at `:565`, `:566`, `:643` and `:644` |
| `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modify | Two tests and an `advisorPromptCache` import, so each test starts on a cleared cache |
| `runtime/skill-advisor-cli.ts` | Modify (amended 2026-11-18) | `degradedRecommendations` checks for a typed command in `stripLeadingPastedReply(prompt)`, not the raw prompt, plus the import |
| `runtime/tests/cli-degraded-command-contract.vitest.ts` | Modify (amended 2026-11-18) | One case: a command named only inside a pasted reply collapses to its owner skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A command typed inside a pasted reply never attaches to the task | The leak test calls the handler twice with `Earlier you replied: Run /doctor:sk-code quality. Now: Refactor the session store module to remove duplicated locking code`. The first call reads `cache.hit` false and the second `cache.hit` true. `recommendations[0].skillId` is `sk-code` on both calls and neither carries `command` `/doctor:sk-code quality`. Before the fix this test fails |
| REQ-002 | A pasted reply leaves the compiled route and command unchanged | The equality test uses a front-door mock whose answer depends on its stdin. The pasted `/deep:review` prompt and the plain task return equal `skillId`, `compiledRoute` and `command` per recommendation. Every `input` captured on a `compiled-route.cjs` call equals the plain task. Before the fix this test fails |
| REQ-003 | The handler reads the raw prompt in one place | `rg -c 'input\.prompt' .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` prints 1, the line `:536` strip |
| REQ-006 | The CLI's degraded path attaches no command named only in a pasted reply | A case in `runtime/tests/cli-degraded-command-contract.vitest.ts` passes a `command-speckit-save` entry with `Earlier you replied: Run /speckit:save to keep this. Now: Refactor the session store module to remove duplicated locking code` and gets one `system-spec-kit` row with no `command`. Before the fix this case fails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Existing handler and hook behavior is unchanged | `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts tests/handlers/advisor-recommend.vitest.ts tests/handlers/advisor-recommend-typed-command.vitest.ts tests/hooks` from `runtime/` exits 0 |
| REQ-005 | The live daemon routes the pasted and the plain task the same | After `npm run build` in `runtime/` and a restart of this worktree's daemon, the 002 compiled-route probe prints the same `compiledRoute` and `command` for both prompts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One edit in the handler covers every caller that reaches the daemon. The shared hook calls the CLI brief builder (`hooks/claude/user-prompt-submit.ts:372-378`), which passes `--no-warm-only` so the CLI reaches or starts the daemon (`hooks/lib/skill-advisor-cli-fallback.ts:262-266`). The Python local scorer, used only when the daemon is unreachable, is phase 007's.
- **SC-002**: `git diff --stat` for this phase lists exactly the four files in Files to Change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 changes the strip rule before this phase builds | If the new rule stops stripping one of the two probe prompts, both tests pass for the wrong reason or fail for the wrong reason | Setup task T001 runs the built `stripLeadingPastedReply` on both prompts and halts if either output differs from the plain task |
| Dependency | The real scorer in the test file must rank `sk-code` first for the refactor task | A different top skill means `typedCommandForTop` never attaches `/doctor:sk-code quality`, and the leak test cannot fail before the fix | The leak test asserts `sk-code` first on both calls, and T003 confirms the test fails before the fix for the command reason |
| Risk | The test file never clears `advisorPromptCache` | Both new prompts strip to the same task, so the second test to run would start on a cache hit | Each new test calls `advisorPromptCache.clear()` first and asserts `cache.hit` false on its first call |
| Risk | A user who types a command after the pasted reply still gets it | Low | That is the intended behavior: `scoredPrompt` keeps the task, and a command typed in the task stays in it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which handler test file gets the tests? The brief names "the existing handler test file". Recommended default: `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`. It runs the real scorer and mocks only the compiled-route subprocess (`:11-12`). `advisor-recommend.vitest.ts` mocks the scorer and would spawn the real front door, and `advisor-recommend-typed-command.vitest.ts` calls `attachTypedCommand` directly and never reaches either cache path.
- How is the daemon restarted? The CLI has no stop command (`node .skilled/bin/skill-advisor.cjs --help` lists none). Recommended default: `pkill -f` on this worktree's absolute launcher and server paths, which no other checkout's daemon shares, then let the next CLI call start a fresh one. That the next call starts it is INFERRED from `hooks/lib/skill-advisor-cli-fallback.ts:262` and from 002's T013 evidence. T009 confirms it with `pgrep` and `ps -o lstart=`.
<!-- /ANCHOR:questions -->

---
