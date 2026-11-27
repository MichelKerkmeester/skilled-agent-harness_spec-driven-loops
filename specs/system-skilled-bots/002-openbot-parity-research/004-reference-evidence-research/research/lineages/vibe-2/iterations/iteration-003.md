# Iteration 3: Trust, second pass — the three depth-2 questions under F-1-002 (frontier node F-1-002)

## Focus

Frontier node F-1-002 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/context/rakazo-main, specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity): Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against?

This pass works the three depth-2 questions iteration 1 opened under this node: whether the `apps:` filter can be bypassed by a name that is not compared as written (F-2-007), whether a routine-origin approval can take a standing answer (F-2-008), and whether the plan's `secret-store-unreadable` detail can carry a captured backend message (F-2-009). It also corrects one finding from iteration 1 that the plan's own design files refute.

## Actions Taken

1. Read `OpenBot-main/shared/tool-name.ts` for how a tool name is normalised, shortened and displayed.
2. Read the plan's 007 `design/refusals.md`, `design/records.md`, `design/fixtures.md` and `design/state-machines.md` for the match rule and the fail-closed default.
3. Read the plan's 008 `design/backends.md` and `design/leak-checks.md` for the exact detail strings and the fail-closed surfaces.
4. Read the plan's 002 REQ-006 and its decision log for what `bots enable` passes to `answerItem`, and 012's BOT-029 for the `--scope always` refusal.
5. Re-read the tinysecurity `Check::HostTool` paragraph for the per-check composition rule.

## Findings

1. **F-2-007 answered — the `apps:` match is exact and case-sensitive, and the fail-open case the question feared is already ruled out.** "The match is exact and case-sensitive. `GitHub` is not `github`, so it is refused rather than folded to the config's spelling. A name that is a prefix of another is a different name, so `chrome_devtools` is refused when the config holds `chrome_devtools_1` and `chrome_devtools_2`." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/refusals.md:64] *(observed)* The fail-closed default is stronger than a filter: a run that declares nothing writes `{"manual_call_templates": []}` without reading the source config, and a worktree run writes the same bytes into the tree root, "Without the worktree write the child would read the tree's own committed config and reach every server". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures.md:58] *(observed)* There is no normalisation bypass to find. The question is closed.

2. **F-2-007 — but the plan has no rule for a *displayed* tool name, and OpenBot found that failure live.** OpenBot puts any tool name in words, "never drawn as it came", because "FOUND LIVE: a Bot first called `web_search`, a name it was never offered, and its line read \"web_search\" until the real search joined it". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:20-27] *(observed)* The plan's 001 activity rows carry seven row keys and a text form fixed in `design/data-model.md` section 7, with no name-in-words rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:166] *(observed)* A tool name drawn raw is the exact failure OpenBot already hit, and the plan's 003 sanitizer does not cover it because a raw name is printable text, not a control character.

3. **F-2-007 — the 64-character provider cap forces a shortened name with a hash, and the plan has no mapping back.** "A provider takes a tool name of at most 64 characters, so a long app action travels cut and ended with a hash: `mcp__composio-googlesheets__GOOGLESHEETS_UPDATE_DIMENSI_82883606`. Read as it stands, its step said \"Update dimensi 82883606\". A hash does not read backwards, so whoever shortened the names says what they stand for." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:38-46] *(observed)* The plan's 007 filters servers and never shortens, so the cap does not bite there; it bites in 001's activity row for a UTCP tool call, where the row would show the shortened name and the hash. The plan needs either the mapping or a rule that a shortened name is shown as its server plus its action.

4. **F-2-008 answered — the plan has no standing answer at all, so OpenBot's three exclusions are moot today and binding on whichever phase adds one.** The plan refuses `--scope always` as `grant-scope-unsupported` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:145] *(observed)*, and `bots enable` passes the fixed text `enabled`, which `answerItem` records as scope `once`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:269] *(observed)* So a routine's fatigue item cannot become permanent, and the check-in-origin hole iteration 1 raised cannot open. The three exclusions — `source === "task"`, `closed`, `hand_off` — become binding the moment a later phase adds `always`, and 006 should record them as the precondition rather than as a rule it implements.

5. **F-2-009 — correction to iteration 1 finding 7: the plan's detail is a fixed phrase per cause, not a captured backend message.** `backends.md` fixes `keychain item for <name> is not in the vault's form` for a read that is not in hex form, and `keychain did not answer within 10 s, unlock it and try again` for a timeout. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:59] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:76] *(observed)* Iteration 1 read `contracts/refusals.md:160`'s `<detail>` as free-form and inferred an echo risk. The design file refutes that. What survives is narrower and still real: the rule is stated by example in a design file and not as a contract line, so a builder adding a new cause has no rule to follow and the next `<detail>` is unconstrained.

6. **F-2-009 — the plan already measured the echo it guards against, and the measurement is the strongest evidence in the packet.** "an over-long line both writes a wrong value to the wrong keychain and echoes part of the value" — measured twice, with the first piece running as an `add-generic-password` without its keychain argument and the later pieces printed to stderr as `security: unknown command "<piece of the value>"`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:63] *(observed)* That is the same failure rakazo's `secretAnswerRefusal` guards against by never showing a backend error at all. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:26-38] *(observed)* The plan's answer is a length bound rather than a refusal to echo; both work, and the plan's is the one that also prevents the wrong-keychain write.

7. **006 — the plan's `grants` field has no place for the effect class, so iteration 1's finding 3 lands as a field gap.** The plan's grant holds "the action kind, the action in the bot's words, the rung that made it ask and the scope the answer granted". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:50] *(observed)* tinysecurity's grant strength depends on the effect class: a whole-tool grant approves an `Unlabelled` effect while a flow grant does not. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:91] *(observed)* Four fields cannot express that. Either the grant gains an effect-class field or 006 records that a flow-scoped grant is out of scope, which is the cheaper answer for a phase that implements rung 1 only.

8. **007 — the checker and the runner share one predicate, which is the pattern the rest of the packet should copy.** "The checker imports the same predicate the runner calls, so a name the runner would refuse fails the check first." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/state-machines.md:221] *(observed)* That is the same one-declaration-read-from-both-sides pattern as OpenBot's `DECISION_TOOLS` and `offersStandingRule`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/decision-tools.ts:13-17] *(observed)* The plan has the pattern in 007 and not in 006 or 008, where the checker and the runner each carry their own copy of the rule. 014 should name the three places and ask for one.

9. **008 — the plan's `secret-store-unreadable` fails closed on every surface, which is stronger than the reference.** "The runner refuses `secret-store-unreadable` before the loop. `answerItem` refuses `secret-store-unreadable` with exit 4. `deliverRecord` sets each queued entry `not-attempted` with the evidence `withheld: secret-store-unreadable`. None of them falls back to the environment-only map, because a check that silently drops the vault would pass the very value it exists to stop." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:61] *(observed)* rakazo's `isDevSecretAllowed` is exactly the silent fallback this rules out. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:25-30] *(observed)* The plan is right and the reference is the counter-example; 008 should cite it as such so a builder does not "simplify" the fail-closed path into a fallback.

10. **006 — the reference composes checks, and the plan's ladder does not.** `Check::HostTool` "lets the host request approval for a tool whose effect the module cannot inspect", "alone it is `approval_unavailable`, which the approval path treats as \"needs a human\"", and "it never relaxes a `Path` or `Command` check carried beside it". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:45-48] *(observed)* The plan's 006 applies rung 1 at the needs-you gate only, so two checks on one call cannot compose. The evidence supports the plan for a phase that implements rung 1, and the composition rule is what a later phase needs; 006 should record it as the shape rung 2 inherits.

## Ruled Out

- **A normalisation bypass in the `apps:` filter.** The match is exact, case-sensitive, prefix-distinct and fail-closed by default. Recorded as finding 1.
- **A standing-answer hole in the routine layer.** The plan refuses `--scope always` outright, so there is no standing answer to save. Recorded as finding 4.
- **An echo risk in `secret-store-unreadable`.** The detail is a fixed phrase per cause. Iteration 1's finding 7 is corrected by finding 5.

## Dead Ends

- `OpenBot-main/shared/tool-name.ts` as a filter reference — it is a display module, not a filter. Do not read it again for 007's match rule.
- `contracts/refusals.md` section 3.7 as the place a detail string is fixed — the design files own the detail, the contract owns the name and the exit. Do not read the contract for a detail again.

## Edge Cases

- Ambiguous input: none. The three depth-2 questions each had one reading.
- Contradictory evidence: iteration 1 finding 7 (the `<detail>` echo risk) is contradicted by `008-vault/design/backends.md:59,76`. Resolved in favour of the design file, and the correction is recorded as finding 5 rather than edited into iteration 1, because an iteration file is write-once.
- Missing dependencies: none.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:1-60
- specs/system-skilled-bots/context/OpenBot-main/shared/decision-tools.ts:13-17
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:45-48,91
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:26-38
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:25-30
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:166
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:138,173,269
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:50,98
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/refusals.md:64
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/records.md:41
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/fixtures.md:34,58
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design/state-machines.md:97,221
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:59,63,76
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:61
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:145

## Assessment

- New information ratio: 0.90
- Questions addressed: F-2-007, F-2-008 and F-2-009, all three.
- Questions answered: all three. F-2-007 has no bypass; F-2-008 has no standing answer to save; F-2-009's detail is fixed per cause, and iteration 1's finding 7 is corrected.

## Reflection

- What worked and why: reading the plan's `design/` files before the reference. The design files are where the plan states its exact strings and match rules, and three of the five questions this iteration carried were answered by the plan rather than by a reference. A gap claim needs the plan's own text, not just the reference's.
- What did not work and why: iteration 1 inferred an echo risk from a `<detail>` placeholder in a contract table without reading the design file that fills it. The contract names the refusal; the design file fixes the string. Reading the contract alone produced a wrong finding.
- What I would do differently: when a finding rests on a placeholder, read the file that fills the placeholder before recording the finding.

## Recommended Next Focus

The trust node is now worked to its depth-2 children and has nothing open below it that this lineage can answer from these two repos. The next iteration should leave the frontier and take the phase coverage the topic's first question demands, starting with 001-activity-and-actor and 002-routine-layer, which this iteration touched only through their approval seams. The specific next reads are `OpenBot-main/shared/activity-rows.ts` and `app/src/lib/bot-lifecycle/activity-groups.ts` for 001, and `OpenBot-main/docs/routines.md` for 002.
