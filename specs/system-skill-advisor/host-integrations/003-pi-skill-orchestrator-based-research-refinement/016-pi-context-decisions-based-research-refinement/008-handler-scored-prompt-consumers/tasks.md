---
title: "Tasks: Handler Scored-Prompt Consumers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handler scored prompt consumers tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Handler Scored-Prompt Consumers

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is `.skilled/skills/system-skill-advisor/`. Run every command from the repository root unless it says `from A/runtime/`.

- `ROUTE` is `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`, run from `A/runtime/`.
- `WIDE` is `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts tests/handlers/advisor-recommend.vitest.ts tests/handlers/advisor-recommend-typed-command.vitest.ts tests/hooks`, run from `A/runtime/`.
- `PASTED` is `Earlier you replied: I ran /deep:review on the hook changes. Now: Refactor the session store module to remove duplicated locking code`. `LEAK` is `Earlier you replied: Run /doctor:sk-code quality. Now: Refactor the session store module to remove duplicated locking code`. `PLAIN` is `Refactor the session store module to remove duplicated locking code`.
- `PROBE` is the 002 T013 compiled-route command, verbatim: `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "$p" --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{for(const r of JSON.parse(s).data.recommendations)console.log(r.skillId+" "+JSON.stringify(r.compiledRoute??null))})'`. `PROBE_CMD` is the same command with `+" "+(r.command??"-")` added at the end of the `console.log` argument.

Luna leaves are T004 and T006, one change per brief, following `../delegation-strategy.md`. Every other task is the conductor's. Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Conductor: confirm the strip rule phase 006 left still turns both probe prompts into the plain task (`A/runtime/lib/prompt-policy.ts`). Verify: `npm --prefix A/runtime run build` exits 0, then `node --input-type=module -e "const m=await import('$PWD/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/prompt-policy.js');console.log(JSON.stringify(m.stripLeadingPastedReply(process.argv[1])))" "$p"` prints `"Refactor the session store module to remove duplicated locking code"` for `p` set to `PASTED` and again for `LEAK`. Any other output halts the phase. Record it and pick prompts the rule strips before T004.
- [ ] T002 Conductor: record the test baselines (`A/runtime/tests/`). Verify: `ROUTE` exits 0 and `WIDE` exits 0. Both pass counts go into `implementation-summary.md`.
- [ ] T003 Conductor: re-read the two returns before editing (`A/runtime/handlers/advisor-recommend.ts`). Verify: `rg -c 'input\.prompt' A/runtime/handlers/advisor-recommend.ts` prints 5. `sed -n 562,567p` and `sed -n 640,645p` on that file show `input.prompt` as the second argument of `enrichCompiledRoutes` and the second argument of `attachTypedCommand`. A shifted line halts the phase until the brief is updated.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Luna leaf: add the `advisorPromptCache` import from `../../lib/prompt-cache.js` and the two tests `plan.md` section 3 names, `keeps a command typed in a pasted reply off the task on a miss and a hit` and `routes a pasted reply the same as the plain task`. Each starts with `advisorPromptCache.clear()` (`A/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`). Verify: `ROUTE` fails on exactly these two tests, with every older test in the file passing.
- [ ] T005 Conductor: confirm each test fails for its own reason (`A/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`). Verify: the leak test's failure shows `recommendations[0].command` equal to `/doctor:sk-code quality`, not a wrong top skill or a wrong `cache.hit`. The equality test's failure shows a differing `compiledRoute` or a captured front-door `input` that still starts with `Earlier you replied`.
- [ ] T006 Luna leaf: replace `input.prompt` with `scoredPrompt` as the second argument of `enrichCompiledRoutes` and of `attachTypedCommand` on the cache-hit return (`:562-567`) and the cache-miss return (`:640-645`) (`A/runtime/handlers/advisor-recommend.ts`). Verify: `ROUTE` exits 0, and `rg -c 'input\.prompt' A/runtime/handlers/advisor-recommend.ts` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Conductor: run the typecheck and the build (`A/runtime/`). Verify: `npm --prefix A/runtime run typecheck` exits 0, then `npm --prefix A/runtime run build` exits 0.
- [ ] T008 Conductor: run the wider tests (`A/runtime/tests/`). Verify: `WIDE` exits 0, and its pass count is the T002 count plus 2.
- [ ] T009 Conductor: restart only this worktree's daemon (`A/runtime/dist/`). Verify: `pkill -f "$PWD/.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js"` and `pkill -f "$PWD/.skilled/bin/system-skill-advisor-launcher.cjs"` run, then `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format text` exits 0. `ps -o lstart= -p "$(pgrep -f "$PWD/.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js")"` prints a time later than `stat -f %Sm A/runtime/dist/runtime/handlers/advisor-recommend.js`. `pgrep -f "MEGA/Development/Skilled/.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js"` still prints the primary checkout's pid.
- [ ] T010 Conductor: rerun the 002 compiled-route probe on the fresh daemon (`.skilled/bin/skill-advisor.cjs`). Verify: run `PROBE` with `p` set to `PASTED` into one file and with `p` set to `PLAIN` into another, and `diff` on the two files exits 0. Then run `PROBE_CMD` with `p` set to `LEAK`. Its `sk-code` line ends in `-` rather than `/doctor:sk-code quality`. Its `compiledRoute` matches the `PLAIN` run's `sk-code` line.
- [ ] T011 Conductor: confirm the diff holds only the two planned files (`git`). Verify: `git diff --stat -- A/runtime/handlers A/runtime/tests/handlers` lists `advisor-recommend.ts` and `advisor-recommend-compiled-route-option.vitest.ts` and nothing else.
- [ ] T012 Conductor: check comment hygiene in the changed code (`A/runtime/`). Verify: `git diff -U0 -- A/runtime/handlers A/runtime/tests/handlers | rg -n '^\+.*(N3|R[0-9]|016-|phase 0|finding)'` prints nothing and exits 1.
- [ ] T013 Conductor: record the files, both red reasons, every test count and the probe lines (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `ROUTE` and `WIDE` exit 0 with the two new tests, `rg -c 'input\.prompt'` on the handler prints 1 and the T010 `diff` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source finding**: refutation finding 4 in `tmp/p002-briefs/out/last-refute.txt` at the repository root
- **Probe origin**: `../002-pasted-context-stripping/tasks.md` T013
<!-- /ANCHOR:cross-refs -->

---
