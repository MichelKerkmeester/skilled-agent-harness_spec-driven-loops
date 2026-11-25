# Iteration 5: Plan versus runtime — memory (005) and approval grants (006)

## Focus
Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/*/plan.md, specs/system-skilled-bots/003-openbot-parity-build/*/tasks.md, specs/system-skilled-bots/003-openbot-parity-build/*/acceptance-criteria.md, .skilled/skills/system-skilled-bots/runtime/lib, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/tests): Plan versus runtime: do the files, functions, records, fields and CLI verbs each of the eleven phase plans names exist in the built runtime with the shapes the plan assumes, and are the test and verify commands in every tasks.md and acceptance-criteria.md runnable here (vitest paths, cargo for the Rust screen)? List every mismatch.

## Actions Taken
1. Verified 005's DoR probes and every runtime symbol its tasks name: `buildBotPrompt` at `dispatch.ts:315`, `parseDecisionMarker` at 432, `sharedStatePaths`/`identityStatePaths`, the absence of `remember` in `bots.cjs` and `memory` in `definition.ts`, and the REQ and affected-surface counts (12 and 10).
2. Verified 006's DoR probes: `answer: { ids: 2, options: [] }` at `bots.cjs:73`, the one `bots-run/references/` file, the three `writeNeedsYouItem` call sites, and the absence of `grants` in `status-index.ts`, `delivery.ts` and `status.ts`.
3. Swept every phase for `npx tsc` and `THIRD_PARTY_NOTICES` to size the two systemic patterns.
4. Re-read 006's tasks against iteration 2's finding 5 and corrected it.

## Findings
1. **P1 — systemic, phases 001, 005, 010 and 011: `npx tsc --noEmit` is not runnable in the runtime.** Eight occurrences (`001 tasks.md:138`, `005 tasks.md:144`, `010 plan.md:48`, `010 tasks.md:85` and `:145`, `011 plan.md:51`, `011 tasks.md:103` and `:163`) name a binary the runtime does not install; `runtime/node_modules/.bin` has no `tsc`, and the repo's own script is `../../system-spec-kit/node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json`. Phases 002, 004, 007 and 008 already use `npm run typecheck`, so the packet is internally inconsistent. **Exact edit:** replace all eight with `cd $RT && npm run typecheck`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/package.json:13] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md:144]

2. **P1 — cross-phase, phases 001, 006 and 008 (and mentioned in 009, 010, 011): `THIRD_PARTY_NOTICES.md` has at least three writers with independent contents.** 001 writes two MIT entries, 006 writes one MIT entry for the lifted classifier, 008 writes three Apache-2.0 entries, and each verifies its own count against the same bare path; 009, 010 and 011 also name the file. No phase owns it, names its location, or says append. **Exact edit:** make 001 the owner that creates the file with a `## Lifted sources` section and the exact path, have 006 and 008 append their sections, and scope every count to its own section; do the same for 009-011 once their entries are confirmed. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:67] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md:73] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:64]

3. **P2 — correction to iteration 2 finding 5, phase 006: the missing-`grants` migration is in the tasks.** `tasks.md:53` (T011) reads a missing grant as null and `tasks.md:85` (T036) proves a pre-phase item still lists, so the build is not broken; only `spec.md` REQ-001 and the plan's DoD omit the rule. **Exact edit:** state "a missing `grants` reads as null and prints `-`" in REQ-001 so the requirement and the task agree. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md:53] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145]

4. **P2 — phase 006, `tasks.md:73` (T031) versus `plan.md:130`: the notice task is unconditional while the dependency table drops it.** The plan says the MIT notice entry "is then dropped" when the classifier is written from `docs/approvals.md` alone, but T031 always writes `tool-name.ts` into `THIRD_PARTY_NOTICES.md`. **Exact edit:** make T031 conditional ("only when `tool-name.ts` was lifted") and name the fallback in the plan. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md:73] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:130]

5. **P2 — phase 005, `tasks.md:84` (T035): the two `remember` probes use different temporary state roots.** `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) $BOTS remember ...` and the second `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) $BOTS remember --list` each mint a new root, so the list runs against an empty store and proves only that the verb exits 0. **Exact edit:** bind one root for both commands (`STATE=$(mktemp -d)` then both prefixed with `SKILLED_BOTS_STATE_ROOT=$STATE`). [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md:84]

## Ruled Out
- Suspected 005 DoR drift: ruled out. REQ count 12, affected-surface rows 10, `buildBotPrompt` at 315, `parseDecisionMarker` at 432, and the three absences all reproduce.
- Suspected 006 DoR drift: ruled out. The answer spec at `bots.cjs:73` has an empty options list, the references folder holds one file, and the three item writers are the gate, the answer and the resume stamp.
- Suspected 006 "grants" consumer drift: ruled out. `status-index.ts`, `delivery.ts` and `status.ts` contain no `grants`, as the plan says.

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: iteration 2's finding 5 is contradicted by 006's own T011/T036; the task text prevails and the finding is corrected rather than repeated.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/tasks.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/tasks.md
- .skilled/skills/system-skilled-bots/runtime/package.json
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts
- .skilled/bin/bots.cjs
- .skilled/skills/system-skilled-bots/bots-run/references/

## Assessment
- New information ratio: 0.9
- Questions addressed: F-1-001 for phases 005 and 006
- Questions answered: none fully

## Reflection
- What worked and why: grepping all eleven phases for one pattern (`npx tsc`) turned a single-phase finding into a systemic one with an exact edit list, which is more useful to the builder than four separate reports.
- What did not work and why: iteration 2's finding 5 trusted the spec's requirement table without reading 006's tasks; the tasks had the migration rule all along. The correction is recorded, and the lesson is to read tasks before declaring a missing rule.
- What I would do differently: for every "missing X" claim, grep the phase's tasks for X before writing it down; prose and tasks diverge in both directions.

## Recommended Next Focus
Continue F-1-001 on per-bot apps (007) and vault (008), then 009-011; the `npx tsc` and notice-file patterns are now sized for the synthesis.
