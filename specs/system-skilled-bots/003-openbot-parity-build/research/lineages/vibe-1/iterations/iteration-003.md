# Iteration 3: Run-record, status-index and prompt-builder extensions (frontier F-2-005)

## Focus

Frontier node F-2-005 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, 005-memory, 007-per-bot-apps, 008-vault, 009-skills): Do 004, 005, 007, 008 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator or the closed FIELD_GROUPS list?

I read the five phases' record and index claims, then the two validators and the one prompt builder they all edit. The node's own framing (schemaVersion and FIELD_GROUPS) turned out to be the smaller half of the answer: the record is additive-safe, and the real collision is that four phases edit one prompt builder and four edit one answer function with no stated order.

## Actions Taken

1. Read the record's shape and validator: `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128,149-183,196-270`.
2. Read the index's version handling and summary path: `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55,253-258,266,677`.
3. Read the five phases' record and index claims: `004-computer-exposure/spec.md:40-60,142-171`, `004-computer-exposure/plan.md:49,82`, `005-memory/spec.md:94,114`, `007-per-bot-apps/spec.md:40,49,99,105,116`, `008-vault/spec.md:147-163`, `009-skills/spec.md:45,102-113,159`.
4. Read the one prompt builder: `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:300-338`.
5. Read the dispatch-env filters: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:307-318,1495-1517`.

## Findings

1. **P1 — 004 requires the index schema version to stay `'2'`, but 001 (phase 1) bumps it to `'3'`.** 004's REQ-006 says "`SCHEMA_VERSION` stays `'2'`, so an index built before this phase still opens" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147], and both its readiness check and its affected-surfaces row assert `rg -n "SCHEMA_VERSION = '2'"` prints one line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:49] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:82]. 001 bumps it: "Add the `actor` column, bump `SCHEMA_VERSION`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:114] and its verification expects `'3'` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:76]. 004 is phase 4, so its readiness check fails on the first day and its requirement is false. **Exact edit**: change 004 REQ-006 to "this phase adds no column and no version change; the index version is whatever 001 left", and replace the literal `'2'` in `004-computer-exposure/plan.md:49,82` with "the version 001 left".

2. **P1 — 001's version bump makes an existing index unreadable, and the rebuild it relies on is not a requirement.** The index refuses a stored version that differs: `if (row?.value !== SCHEMA_VERSION) throw new Error(...)` and the caller returns `index-unreadable` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:253-258]. 001's risk row says the mitigation is "Bump `SCHEMA_VERSION`, rebuild from run records on open, and prove it with a test that opens a version-2 index" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:179], but no requirement in 001 states the rebuild-on-open behaviour, so an implementer can satisfy every REQ and still leave `bots status` failing on an old index. **Exact edit**: add to 001's P0 table "REQ-008: an index whose stored version differs from `SCHEMA_VERSION` is rebuilt from run records on open, and `bots status` prints no error", and cite it from the risk row.

3. **P1 — four phases edit one prompt builder and no phase states the order of its sections.** `buildBotPrompt` builds a fixed line list: the child exemption, the bound spec folder, the optional checkout line, the decision marker, then the body [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315-338]. 004 adds a working-place line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:142], 005 prepends the memory block [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:94], 009 adds skill bodies [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:102], and 010 appends the transcript after the body [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148]. Each says where its own block goes and none says where it sits relative to the others, so four implementers can produce four different prompts and every phase's test still passes. **Exact edit**: add one paragraph to 005's plan fixing the order — "exemption, spec folder, working place, memory, skills, decision marker, body, conversation" — and have 004, 009 and 010 cite it.

4. **P1 — four phases edit `answer.ts` and no phase states that the edits compose.** 001 writes `by` on the answer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146], 006 writes the scope on the grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96], 009 adds a proposal seam that "call[s] the proposal seam before the resume enqueue, and report[s] a recorded review instead of a request" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:125], and 011 reuses the path for channel answers [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49]. The function is one linear body: read, refuse, write the answer, build the resume request, enqueue, stamp [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:68-120]. 009's "instead of a request" is a branch in the middle of that body, and nothing says whether it runs before or after 006's scope write. **Exact edit**: add to 009's plan "the seam runs after the answer and the scope are written and before the resume request is built, and a test asserts one answer carries `by`, the scope and the recorded review".

5. **P1 — 007 and 008 both need the deep-loop dispatch-env allowlist and neither names the edit precisely enough to make.** 007 sets `UTCP_CONFIG_FILE` in the child environment and says it is "admitting that key through the deep-loop executor allowlist" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:99], without naming which executor kinds. 008 says "Widen `assertDispatchEnvAllowed` with the `SKILLED_BOT_SECRET_` prefix" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:187]. That function admits exact keys only: `if (!allowed.includes(key)) throw new Error(...)` against a per-kind list [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1495-1517], so a prefix is refused there. **Exact edit**: state the edit once, in 007: "`DISPATCH_ENV_KEYS` gains `UTCP_CONFIG_FILE` for every kind, and `assertDispatchEnvAllowed` gains a prefix rule mirroring `EXECUTOR_ENV_PREFIXES_BY_KIND`", and have 008 cite it for `SKILLED_BOT_SECRET_`.

6. **P1 — correction to iteration 2's finding 9: the prefix machinery already exists on the parent-env side, so only one of the two filters needs a new rule.** Iteration 2 said "a prefix is admitted by neither". That is wrong for the parent-env filter: `isAllowedExecutorEnvKey` already ends with `return (EXECUTOR_ENV_PREFIXES_BY_KIND[kind] ?? []).some((prefix) => key.startsWith(prefix))` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:317]. The core claim stands — `assertDispatchEnvAllowed` is exact-match, so 008's mitigation as written fails — but the fix is smaller than iteration 2 implied: add `SKILLED_BOT_SECRET_` to `EXECUTOR_ENV_PREFIXES_BY_KIND` for every kind and mirror the prefix rule in `assertDispatchEnvAllowed`. **Exact edit**: none in the packet; this corrects the evidence in `iteration-002.md` finding 9 and supersedes its "neither" clause.

7. **P2 — 007 adds `apps` to `HonoredPosture` without saying it is optional on read, while 008 says so for `secretsUsed`.** `HonoredPosture` is `{isolation, sandbox, executorKind, model}` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128] and the validator checks the posture only as a plain object [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:240-244], so both fields are additive-safe. 008 states the read default: "a record written before this phase still validates with the field read as `[]`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154]. 007 states no default [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:116]. **Exact edit**: add to 007 REQ "a record written before this phase reads `apps` as `[]`".

8. **P2 — 004's working-place line overlaps the checkout line the prompt already carries.** `checkoutLine` already tells a child that starts outside the checkout where the repository is [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:306-308], and it is included whenever `checkoutRoot` is given [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:330]. A worktree run starts in the tree, so it gets both that line and 004's "Your working place is `<path>` on branch `<branch>`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:142], with no statement of how the two relate. **Exact edit**: add to 004 REQ-001 "the working-place line replaces `checkoutLine` for a worktree run, so the prompt carries one location line", or state that both appear and why.

## Questions Answered

- Do 004, 005, 007, 008 and 009 break the `schemaVersion` validator or the closed `FIELD_GROUPS` list? **No.** The validator checks that the eight groups exist and that the posture is an object; it rejects no extra key [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:237-244]. Every field these phases add is additive, and only a `schemaVersion` bump would strand records — which no phase proposes.
- Do they extend the status index safely? **004 does, 001 does not.** 004 adds two `RunSummary` fields with no column and no version change; 001 bumps the version and relies on a rebuild it never requires (findings 1 and 2).

## Questions Remaining

- Are the phase verify commands runnable in this checkout (cargo, vitest, jq)?
- Does 005's memory block create a prompt-injection path of its own, and does its secret-literal check cover a fact a bot proposes?
- What is still missing after all eleven phases for a small team, and what is overbuilt?

## Ruled Out

- Treating the closed `FIELD_GROUPS` list as a blocker for new fields: it is a presence check, not an allowlist, and the posture object is validated only as an object.
- Reading 005's memory file format for this node: 005 touches no record and no index field, so its only interface here is the prompt builder.

## Dead Ends

- Looking for a record-level allowlist that would reject `apps` or `secretsUsed`: there is none. The only strict list is `DISPATCH_ENV_KEYS` on the executor side, which is a different surface.

## Edge Cases

- Ambiguous input: the node asks about two validators; the answer is that one is permissive and the other (the index version) is strict, so I reported them separately.
- Contradictory evidence: iteration 2's finding 9 overclaimed that neither env filter admits a prefix. Finding 6 corrects it with the line that disproves the claim, and the correction is recorded rather than edited away.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128,149-183,196-270
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55,253-258,266,677
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:300-338
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:68-120
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:307-318,1495-1517
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:114,179
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:76
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:40-60,142-171
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:49,82
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:94
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:40,49,99,105,116
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147-163,187
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:45,102-113,125,159
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49

## Assessment

- New information ratio: 0.88
- Questions addressed: record and index safety across five phases; the shared prompt builder; the shared answer path
- Questions answered: both halves of the node's question

## Reflection

- What worked and why: reading the validator before the phases inverted the node's premise. The record is permissive, so the interesting question became "what else do these five phases share", and the prompt builder and the answer path are the answer.
- What did not work and why: iteration 2's claim that neither env filter admits a prefix was an overclaim from reading one function. Reading `isAllowedExecutorEnvKey` in full showed the prefix branch. The cost is a correction, which is cheaper than a wrong fix in the packet.
- What I would do differently: when a finding says "neither X nor Y", read both in full before writing it. A two-function claim needs two reads.

## Recommended Next Focus

The prompt builder and the answer path are now known to be shared by four phases each, which makes the parity-gap angle the right next step: with the interfaces mapped, the question is what a small team still cannot do after all eleven phases, and which of these eleven slices is overbuilt for that team.
