# Iteration 6: Phases 007-per-bot-apps and 008-vault

## Focus
Per-phase evidence for `007-per-bot-apps` (the `apps:` key that narrows a bot's reachable connector servers to a per-run `.utcp_config.json`) and `008-vault` (`bots secret`, the backend table, the known-secret map, the post-run scan and the injection rule). The pair is taken together because both narrow what a bot may reach — 007 by server name, 008 by stored value — and the gap that matters is the seam between them.

Interpretation chosen: "per-bot apps" means per-bot MCP connector grants, not GUI applications; 007's own problem statement and measured behaviour fix that reading.

## Actions Taken
1. Read 007's problem statement, its measured behaviour and its requirement table.
2. Read OpenMausBot's connector-scope hint module and its test.
3. Read rakazo's `vault.ts` access model and its refusal mapping.
4. Read 008's requirement table, its risk row for the keychain line length, and the measured backend notes.
5. Compared the two narrowing axes — server list and stored value — against each reference.

## Findings

1. **A per-bot server filter does not stop an insufficient-scope retry loop, and OpenMausBot has a mechanism for exactly that case.** The reference detects Google's `ACCESS_TOKEN_SCOPE_INSUFFICIENT` (or "insufficient authentication scopes", or `insufficientPermissions`) and appends a second content block to the tool result naming the exact OAuth scope required and telling the model "Do not retry", while keeping the provider's original error block unchanged. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts:1-5] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts:26-41] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts:131] Its test asserts both halves: the original content survives, and the hint carries the scope URL and the words "Do not retry". [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.test.ts:13-20] The plan's `apps:` key narrows which servers a run's config holds, and says so carefully: "`apps` stays a filter, not a sandbox". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:105] Nothing in 007 or 008 treats a *reachable server whose credential lacks a scope* as a separate state. **Observed.** A bot whose connector grant is correct but whose OAuth grant is short will retry the same call, because the error text reads like a transient permission failure. This is the one mechanism in either reference that a small team gets immediate value from: the hint costs one string per connector and turns a silent loop into a named fix. It fits 007's scope, because 007 owns the declaration of what a bot may reach, and the hint is the failure path of that declaration.

2. **rakazo scopes a stored item to an allow-list of the owner's bots, and the plan's equivalent is the bot's own declaration, so nothing lets an operator say which bots may use a stored secret.** The reference's model is a value on the item: `VaultBots = { allBots: boolean; botIds: string[] }`, documented as "Which of the owner's bots may use an item: every one, or those in `botIds`", and the access check is `allBots || botIds.every(id => bots.some(bot => bot.id === id))`. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:40-41] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:72] The plan's control is on the other side: a bot's definition names `secrets: demo` and the runner resolves it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:155] So the authority to read a stored value is the bot author's declaration, and an operator who stores a token has no way to say "only these two bots may use it". **Observed.** For a repository where every bot definition is reviewed, that is a defensible simplification; for a host that accepts a definition from a git hook or a queue, it means any definition can name any stored secret. The evidence supports a second, operator-side axis — one line in the secret's index entry naming the bots allowed, checked where the name is resolved — and it composes with 007's server filter rather than duplicating it.

3. **The refusal vocabulary needs a name for "stored but not allowed", and rakazo's fixed-string mapping shows why.** The reference maps three distinct conditions to three fixed answers — blocked, unchosen and full — through an explicit equality test on the error message. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:25-38] The plan has one name for a name the store does not hold, `secret-unknown`, which is right while the only reason a name can fail to resolve is that nothing is stored under it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:156] **Observed / inferred.** The moment finding 2's allow-list exists, a secret that is plainly present can fail to resolve, and `secret-unknown` sends the operator to look for a secret that is already there. The reference's answer — one fixed name per condition, with the provider's own error text never shown — is the shape to copy, and it is cheap now and expensive later.

4. **The vault's own failure paths are already measured and guarded more tightly than the reference's, so no lift is needed there.** The plan measured that `security -i` splits a line over 4,096 bytes and prints the remainder to stderr, refuses the line before the spawn, never prints the program's output, verifies a write by reading it back in constant time, and scans the child's stdout, the run folder and the receipt folder for the stored value plus its base64 and URL-encoded forms. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:203] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:165] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:168] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md:63] The reference's protection is the weaker one: it hides the server's error text because "its other errors could echo the value". [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:25-28] **Observed.** Recorded as a confirm: the plan already reaches the reference's conclusion and goes past it, so a builder should not add a second redaction layer.

## Ruled Out
- **Finding a per-run MCP config equivalent in a reference.** None of the ten repos narrows a connector list per run; they narrow per user or per item. 007 is net-new on the mechanism and borrows only the failure path of finding 1.
- **Treating the plan's missing echo guard as a gap.** It is measured and guarded three ways: the length refusal, the never-print rule and the post-run scan.
- **Reading OpenMausBot's `connector/` host directory for a second implementation.** It is a connector marketplace host, not a per-bot filter.

## Dead Ends
- rakazo's `secret-matcher.ts` was located but not read: 008's known-secret map is built from stored values rather than from pattern matching, so the matcher's pattern list would not have changed any finding.
- The `connector-scope-hint` mechanism is reachable only where a connector's OAuth scopes are known per tool slug; the plan would need a per-connector scope table to use it, which is worth naming in 007's design as the cost of finding 1.

## Edge Cases
- Ambiguous input: "apps" in 007's name suggests installed applications. Resolved from 007's own scope: the key is a list of connector server names.
- Contradictory evidence: none.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts
- specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.test.ts
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/backends.md

## Assessment
- New information ratio: 0.88
- Questions addressed: 007-per-bot-apps reference evidence and its failure path; 008-vault access model against a reference with an item-level allow-list.
- Questions answered: both phases' evidence questions. 007 is answered with one borrowable mechanism and no reference for the filter itself; 008 is answered with one missing axis and a confirmed stronger guard set.

## Reflection
- What worked and why: looking for the *failure path* of a narrowing mechanism rather than the mechanism. All ten repos narrow access somehow, so nothing there was new; only OpenMausBot treats "narrowed correctly but the credential is short" as its own state, which is precisely the state a per-bot filter creates.
- What did not work and why: reading 008's spec by grep for "echo" or "redact". The plan's coverage is spread across a risk row, a measured backend note and the post-run scan requirement, so a single-term grep found fragments; reading the requirement table settled it.
- What I would do differently: when a plan is stronger than a reference, say so in one finding and stop looking in that direction, rather than hunting a second-order gap. Two of this iteration's four findings are about the same seam for that reason.

## Recommended Next Focus
Phase 009-skills and 010-conversations: the reference's skill model (what a skill is, how `/<name>` resolves, what validates a hook rule) and its conversation model (transcript, message records, what a returned answer carries), with the failures their tests name.
