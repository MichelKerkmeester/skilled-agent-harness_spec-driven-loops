# Review Iteration 001 - correctness and security

Lineage: `vibe-hooks-doctor-confirm-5b`. Iteration 1 of 3. Mode: review.
Executor: this session, `cli-opencode` model `opencode-go/deepseek-v4.1-flash`.

## Dispatcher

- Confirming round 5b of pass five for the `vibe-hooks-doctor` area. Sources read first:
  `review/review-brief-5b.txt`, `review/review-focus-5b.txt`, `review/review-scope-5b.txt`,
  `review/verify-5/report.md`, `032-review-pass-five-remediation/plan.md` (D9, D13) and
  `032-review-pass-five-remediation/scratch/review/report-2.txt` and `report-3.txt`.
- `steer.md` does not exist in this lineage directory at this iteration.
- The operator focus names seven checks. Five of them (shell write reader, COMMAND reader,
  arena builder, live-turn remote check) belong to the `accuracy-runner` area by
  `review-scope-5b.txt`; they are read here only as context and are not graded. This
  iteration addresses the two focus items that land on this area's code: the kill-switch read
  inside the Vibe and Claude hooks, and docs agreeing with that code.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:1-242`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:1-210`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:25-105,413-435`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts:90-97,154-165,225-273`
- `.skilled/hooks/shared/hook-flags.cjs:38-78,234-285` (context: the switch the hooks read)
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:44-70` (context: the
  sibling walk D9 names as the precedent)
- `git -c core.fsmonitor=false diff 2a1a42263cc d21dbc1cafe -- <the two hook sources and their tests>`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- **R1-P2-001 (directive-only fallback) holds.** `withCommandDocuments` guards on
  `context.startsWith('Directives:')` before the separator search
  (`prompt-advisor.mjs:125-128`). A run of the exported function on the fallback text printed
  `directive-only changed: false`, and the same run on a headed brief printed
  `Command documents (read in full before taking one): /create:readme is
  .skilled/commands/create/readme.md.`, so the guard closed the fallback gap without touching
  the headed path.
- **R4-P2-001 (receipt environment) holds.** `headReceiptDir`, `headReceiptPath`,
  `readHeadReceipt` and `writeHeadReceipt` now take `env`, and `buildAdvisorPart` passes its
  injected `env` into `reduceRepeatedHead` (`prompt-advisor.mjs:68-109,168-188,238`). A run with
  `process.env.SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` pointed at one directory and an injected
  `env` pointed at another printed `injected receipts: 1 process receipts: 0`, which is the
  observable the fix promises.
- **R2-P2-001 (resolver hop count) holds.** `hookFlagsResolverPath` walks ancestors for
  `hooks/shared/hook-flags.cjs` (`user-prompt-submit.ts:71-80`). From the source folder the walk
  resolves `.skilled/hooks/shared/hook-flags.cjs`, and the old six-hop URL does not exist from
  there; from the built folder both resolve. The failure the verifier reported is therefore
  closed for the source path with no regression for the built path.
- **The new hook test pins the resolver, not just the envelope.**
  `claude-user-prompt-submit-hook.vitest.ts:416-435` sets `SYSTEM_SKILL_ADVISOR_DISABLED=1`,
  expects `{}` and `buildBrief` uncalled. Because a missing resolver answers enabled
  (`user-prompt-submit.ts:85`), that assertion can only pass when the walk found the real
  resolver from the source tree; the test therefore covers the fix rather than the fail-open
  branch.
- **Kill-switch names in the hook contract still match the resolver.** The canonical
  `SYSTEM_SKILL_ADVISOR_DISABLED`, the two `SYSTEM_*` aliases, the two `SPECKIT_*` aliases and
  the three `MK_SKILL_ADVISOR_*` names in `skill-advisor-hook.md:173-182` are the canonical name
  plus the seven `LEGACY_ALIASES['skill-advisor']` entries, and `MK_HOOKS_DISABLED` is
  `MASTER_ALIASES` (`hook-flags.cjs:41,70-78`). The full doc pass belongs to iteration 3.
- **Holdout hygiene.** A name search over the eight scoped files for the three prompt-corpus
  files printed no hit. No prompt file was opened.

## Integration Evidence

- The Vibe part imports the compiled Claude handler from
  `../../runtime/dist/hooks/claude/user-prompt-submit.js` and calls
  `handleClaudeUserPromptSubmit` with `runtime: 'vibe'` (`prompt-advisor.mjs:32-35,190-196`).
  The compiled module in this checkout carries `hookFlagsResolverPath` (two occurrences), so the
  reviewed source fix and the module the adapter loads agree.
- The Claude prompt hook is reached through `.claude/hooks/user-prompt-submit.js`, a shim whose
  `TARGET_REL` is `skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`;
  the shim resolves its target by a depth-capped walk (`MAX_ROOT_WALK_DEPTH = 14`). The new
  resolver walk inside the target is the only unbounded one and is recorded under Ruled Out.

## Edge Cases

- The report's `arena`, `scorer` and `runner` limits are outside this area. They were not
  re-read as findings, and no conclusion here depends on them.
- The compiled advisor runtime is untracked, so the reviewed artifact is the TypeScript source.
  The working-tree copy already carries the fix, which keeps the adapter runnable, but a checkout
  that never rebuilds would still run the old hop count. That is the documented build contract,
  not a new defect.
- `hookFlagsResolverPath` walks to the filesystem root, unlike the shim beside it. Recorded
  under Ruled Out with the reason it is not raised.

## Confirmed-Clean Surfaces

- `withCommandDocuments` headed behavior is unchanged: same document label, same order, same
  skip for a document that does not resolve (`prompt-advisor.mjs:130-149`).
- `reduceRepeatedHead` still returns a headed brief whole and still drops an unchanged head-only
  brief (`prompt-advisor.mjs:175-187`); the probe read `first: true second-empty: true`.
- `isChildSession` is untouched and still reads both `AI_SESSION_CHILD` and
  `parent_session_id` (`prompt-advisor.mjs:62-66`).
- A missing resolver still answers enabled, so the fix keeps the fail-open contract
  (`user-prompt-submit.ts:84-92`).
- The new test restores both environment names it sets, and no later case in the file depends on
  the flags file it points at `/dev/null` (`claude-user-prompt-submit-hook.vitest.ts:28-29,102-105`).

## Ruled Out

- **The unbounded ancestor walk loads a foreign resolver.** `hookFlagsResolverPath` climbs to the
  filesystem root, so a checkout whose ancestor holds `hooks/shared/hook-flags.cjs` would load
  that file. Not raised: plan D9 freezes this walk-up and names
  `advisor-disabled.ts:50-68` as the precedent, and that sibling is the same loop with the same
  comment. No in-repo caller places such a file above a checkout, so a finding would re-open a
  frozen decision without a new input.
- **The env injection changes the receipt call contract.** `read` and `write` receive the env as a
  third and second argument; an injected function that takes fewer arguments ignores it, and the
  module defaults accept it. The probe exercised the default pair, which is the production path.
- **The directive-only early return also skips a real head.** A context that starts with the
  literal `Directives:` is the handler's no-brief fallback; a headed brief never starts there
  because `renderAdvisorBrief` emits `Advisor:` first. Read at
  `prompt-advisor.mjs:123-132` and `user-prompt-submit.ts`'s renderer use; no second producer.
- **A missing resolver now fails closed.** `hookFlagsResolverPath` returning null answers `true`
  (`user-prompt-submit.ts:85`), which is the same fail-open answer the old `catch` gave.

## Next Focus

- Dimension: traceability and maintainability
- Focus area: `hook-wiring-check.cjs`, its two test files and the doctor README
- Reason: the hook sources and their tests are confirmed in this iteration; the doctor reading
  and the docs that describe it are the remaining changed surfaces
- Rotation status: correctness and security complete; traceability and maintainability pending
- Blocked/productive carry-forward: no blocked approach
- Required evidence: the doctor on fixtures for the `match` shapes, the README lines that
  describe the reading, and the renamed contract test

Review verdict: PASS
