# Iteration 1: Trust — approval grants, per-bot app filtering and the secret store (frontier node F-1-002)

## Focus

Frontier node F-1-002 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/context/rakazo-main, specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity): Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against?

The node's scope names `rakazo-main` and `openhuman-full/vendor/tinysecurity`. This iteration reads both, plus the OpenBot `shared/` declarations the plan's 006 and 007 lean on. The three earlier syntheses already carry the OpenBot approval *order* and the rakazo vault file list, so this iteration cites those and adds only the mechanism, the precedence rules and the failure modes they do not record.

## Actions Taken

1. Read the 003 phase scopes for 006, 007 and 008 to fix what each phase owns and what it defers.
2. Searched `OpenBot-main/shared/` for the approval, standing-rule, decision-tool, authorisation and harness-tool declarations.
3. Read `openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md`, `module-subject-policies.md` and `module-credential-roots.md`, and its `LICENSE`.
4. Read `rakazo-main/packages/core/src/node/secrets-guard.ts`, `packages/core/src/integrations/vault.ts` and `packages/core/src/messages/secret-matcher.ts`.
5. Cross-read the plan's `contracts/refusals.md` section 3.7 and `008-vault/design/leak-checks.md` to separate what the plan already guards from what it does not.

## Findings

1. **006 — OpenBot's standing answer is three exclusions, not a rung.** `offersStandingRule` returns false when `policy.source === "task"`, when `policy.closed === true`, or when `policy.behaviour === "hand_off"`; only then does the card offer "Always allow here" or "Allow for this conversation". A task started from a check-in "asks before every change whatever the person's rules say", so a standing answer saved from one "would be ignored the next time and only mislead". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts:21-29] *(observed)* The plan's ladder is four rungs in order — kinds of action, rules, auto-review, extra vigilant — and says nothing about which approvals may take a standing answer. Phase 002's routines raise exactly the check-in-origin case this predicate excludes, so 006 needs the exclusion or a routine's first approval silently becomes permanent. The earlier synthesis carries the rung order only. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:89]

2. **006 — a grant may convert a required approval into an automatic one and may override nothing else.** `ApprovalGrants2` carries "exact tool names, and exact tool names inside one named flow"; a grant "only converts a required approval into an automatic one (`auto:tool-grant`, `auto:flow-grant`)" and "never overrides a denial, a Cron external effect, reviewed reuse or a human-only tool (`HUMAN_ONLY_TOOLS2`, `native_*`)". "Names are never wildcards." [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:35-41] *(observed)* This is the missing half of the plan's ladder: the plan records the order in which a decision is reached but not the four things a grant may not reach past. A builder writing `grants` on a needs-you item needs the non-override list as a field-level rule, not as prose.

3. **006 — a flow grant is weaker than a tool grant for an effect the module cannot label.** For the `Unlabelled` row, a whole-tool grant approves it as an audited `auto:tool-grant`, but "neither `auto_approve_all` nor a flow grant approves it". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:91] *(observed)* The plan's ladder is a single ordered list, so it cannot express a grant whose strength depends on the effect class. If 006 keeps one ladder, it must at least record that a flow-scoped grant does not cover an unclassified action.

4. **006 and 007 — a widening change must re-ask a human, and only a human answer counts.** `SupersedePolicy` returns `ReviewRequired` when the replacement "widens authority (new or broader roots, removed restrictions, new hosts or tools, higher command autonomy, classes, allowlist entries or budget ... new auto origins, judge enabled, enforcement or the registered path scope disabled, or privacy loosened)", and "Only a row decided by an authenticated human qualifies; automatic, judge and reused approvals are refused. A narrowing change activates without review." [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-subject-policies.md:34-44] *(observed)* Phase 007's `apps:` key is a widening surface: adding a server to `apps:` grants a bot a capability it did not have. The plan's 007 has `apps-unknown-server` for a name that is not a known server, and no rule that a widened `apps:` list re-asks. The evidence supports adding one.

5. **008 — tinysecurity is GPL-3.0, so its contract text may be read and never copied.** The vendored crate's licence is "GNU GENERAL PUBLIC LICENSE Version 3". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/LICENSE:1-2] *(observed)* The plan lifts only rakazo, which is Apache-2.0. [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2] *(observed)* The plan is therefore right to leave tinysecurity out of `THIRD_PARTY_NOTICES.md`, but a builder who reads findings 2 to 4 above must restate the rules in the plan's own words. This is the one licence hazard in the trust slice and no earlier synthesis names it.

6. **008 — rakazo's placeholder guard is environment-gated, and the gate is the bug to leave behind.** `isDevSecretAllowed` returns true for `RAKAZO_ALLOW_DEV_SECRETS=1`, for `VITEST` set to `true` or `1`, and for `NODE_ENV` of `development` or `test`; the placeholder is then accepted instead of refused. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:25-30] *(observed)* The plan's `secret-placeholder` refusal is a fixed list with no environment gate. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:30] *(observed)* Lift the placeholder list; do not lift `isDevSecretAllowed`, or a `NODE_ENV=development` shell turns the refusal off.

7. **008 — a backend error must be mapped to a fixed refusal, because the raw error can echo the value.** rakazo's `secretAnswerRefusal` maps a server error onto one of three fixed answers precisely because "Its other errors could echo the value, so they are never shown". [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:26-38] *(observed)* The plan's `secret-store-unreadable` prints `bots: secret-store-unreadable: <detail>`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md:160] *(observed)* If `<detail>` is the keychain program's own stderr, a failing write can print the value it failed to store. The plan needs a rule that `<detail>` is a fixed phrase per cause, never a captured backend message. This is the leak the plan's own threat model does not list.

8. **008 — the lifted matcher carries two bounds the plan does not name.** `createSecretMatcher` builds an Aho–Corasick automaton over UTF-16 code units, caps it at `MAX_SECRET_MATCHER_STATES = 1_000_000` states, and past that falls back to scanning each value in turn; it also decides between the two by a `BUILD_COST = 8` work model. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:2,21,27,58] *(observed)* The plan's REQ-013 requires the one-pass matcher so "many stored values cost one pass over the text rather than one scan per value". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:167] *(observed)* It carries neither the state cap nor the fallback, so a builder who lifts the automaton without them gets unbounded memory on a long value. Lift the cap and the fallback with the matcher.

9. **007 — a per-run tool filter must not remove a tool the harness runs itself.** `HARNESS_OWN_TOOLS` is `ToolSearch` and `Read`: tools "a harness runs itself, inside its own run, and never hands to OpenBot or the browser", and "Nobody outside the harness answers it, so it never makes the caller the one to answer". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/harness-own-tools.ts:1-14] *(observed)* Phase 007 writes a filtered UTCP config per run. A filter that drops a tool the harness owns leaves the run waiting for an answer no one will give, which is a hang rather than a refusal. The plan's 007 has no harness-owned exclusion list.

10. **006 — the bot-voice leak has a test shape the plan lacks.** Every sentence the server answers a step with is exported from one file, and "`server/tests/approval-outcomes-for-person.test.ts` walks these exports and the approval service's, and fails on any that a person would still read in the words written for the Bot, so a sentence added later cannot leak by being forgotten here". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/approval-outcomes.ts:12-16] *(observed)* The plan's 006 adds a grant and a ladder and no test that a person-facing string is not written in the bot's voice. Phase 012 owns the scenario; the export-and-walk test belongs to 006.

11. **006 — OpenBot classifies a decision by the tool left waiting, not by the action's verb.** `DECISION_TOOLS` maps `askApproval` to `approval` and `askChoice` and `askForm` to `question`, and the server "watches runs for a call to one that is left waiting, which is what puts the Bot under Needs you". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/decision-tools.ts:13-17] *(observed)* The plan's 006 adds an `action-kind.ts` that classifies the action. The two disagree on what makes an item a needs-you item: OpenBot counts a waiting decision tool, the plan counts an action kind. The evidence supports keeping both — the action kind for the grant, the waiting tool for the count — and the plan should say so, because a run that asks with a plain question would otherwise not appear under needs-you.

12. **007 and 008 — the token compare to mirror is length-first and branch-free.** `matchesToken` returns false on an empty expected value or a length mismatch, then XOR-accumulates every code unit and compares the accumulator to zero. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/agent-authorisation.ts:2-9] *(observed)* The plan's REQ-011 already requires a constant-time read-back compare [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:165], so this adds the shape rather than the requirement.

13. **Evidence limit — the OpenBot snapshot has no `server/`, so the ladder's lower rungs are readable only as prose.** `shared/standing-rule.ts` cites `server/src/approvals/policy.ts`, `service.ts` and `store.ts`, and `shared/decision-tools.ts` cites `server/src/approvals/decision-waits.ts`; none of those paths exists in the vendored tree. `shared/sensitive-rule.test.ts` is present with no `shared/sensitive-rule.ts` beside it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts:6-8] *(observed)* Rungs 2 to 4 of the plan's ladder therefore rest on `docs/approvals.md` alone, and the plan's own handoff criterion already marks them not implemented in this phase. Any later phase that implements rung 2 needs a different reference than this snapshot.

## Ruled Out

- **Reading the OpenBot approval engine from code.** `server/src/approvals/` is absent from the snapshot; only the shared declarations and `docs/approvals.md` survive. Recorded as finding 13 rather than retried.
- **Treating tinysecurity as a lift source.** GPL-3.0 rules it out for a build that ships Apache-2.0 and MIT notices. Its contract text is still the best statement of the grant precedence rules, so it is cited as design evidence only.
- **Deriving the ladder from a `ladder` or `rung` identifier in OpenBot.** A search for both terms across the TypeScript and Markdown returns nothing; the ladder is the plan's own framing of the documented order, not an OpenBot symbol.

## Dead Ends

- `rg "ladder|rung"` over `OpenBot-main` — no hits. The plan's four-rung vocabulary has no counterpart in the reference and must not be presented as lifted.
- `OpenBot-main/server/` — does not exist. Do not cite it again in a later iteration.

## Edge Cases

- Ambiguous input: the node's scope names `openhuman-full/vendor/tinysecurity` as a trust source, but the crate is docs-only in this snapshot (no `src/`, no `crates/`). Selected interpretation: cite its contract documents as design evidence and record the licence blocker. Deferred: whether the crate's Rust source would change any finding.
- Contradictory evidence: none. The plan and the references agree on the order of the ladder; they differ on what a grant may override, which is a gap rather than a conflict.
- Missing dependencies: `OpenBot-main/server/` and `tinysecurity/src/` are both absent. Fallbacks used: the shared declarations and the contract docs. Confidence impact: rungs 2 to 4 of the ladder are prose-only.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md:149-165
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:28-36
- specs/system-skilled-bots/context/OpenBot-main/shared/standing-rule.ts:1-30
- specs/system-skilled-bots/context/OpenBot-main/shared/decision-tools.ts:1-22
- specs/system-skilled-bots/context/OpenBot-main/shared/approval-outcomes.ts:1-80
- specs/system-skilled-bots/context/OpenBot-main/shared/agent-authorisation.ts:1-20
- specs/system-skilled-bots/context/OpenBot-main/shared/harness-own-tools.ts:1-14
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:1-143
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-subject-policies.md:1-51
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/docs/module-credential-roots.md:1-28
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/LICENSE:1-2
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:1-70
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:1-60
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts:1-60
- specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:71-89,128,147
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:150-166

## Assessment

- New information ratio: 0.96
- Questions addressed: the F-1-002 question in full — which reference files implement approval grants, per-bot filtering and a secret store; what to lift or mirror; which leak, bypass and precedence bugs the plan does not guard against.
- Questions answered: the F-1-002 question, at the level of mechanism and failure mode. The plan-side gap list is complete for 006 and 008 and partial for 007, whose filtered-config writer is not in this snapshot.

## Reflection

- What worked and why: reading the plan's scope boundary first, then the reference, then the plan's own refusal table, turned each read into a gap rather than a restatement. The refusal table is what proved finding 7 — the plan prints `<detail>` where rakazo deliberately prints nothing.
- What did not work and why: searching OpenBot for the plan's own vocabulary (`ladder`, `rung`) returned nothing, because the vocabulary is the plan's invention. Searching for the mechanism (`offersStandingRule`, `DECISION_TOOLS`, `ApprovalGrants2`) found it immediately.
- What I would do differently: check for a `server/` directory before planning to read an engine, so the evidence limit is known at the start of the iteration rather than at the end.

## Recommended Next Focus

Continue F-1-002 on the half this iteration did not reach: the per-run filtered config writer for 007 and the injection path for 008. The specific next reads are `rakazo-main/docs/bot-secrets.md` for the vault bound the plan cites, `rakazo-main/packages/core/src/node/` for the injection site, and `OpenBot-main/shared/tool-name.ts` (1004 lines) for how a tool name is normalised before a filter compares it — a filter that compares raw names against normalised ones is the next bypass candidate.
