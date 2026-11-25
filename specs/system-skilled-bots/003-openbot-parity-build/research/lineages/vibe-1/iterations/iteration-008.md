# Iteration 8: The vault's leak paths and its two undefined paths

## Focus

Angle 4 on the one slice the parity research calls "the one slice that can leak": 008 vault. The question was whether the store keeps a value out of every surface a run can read, and what happens when the keychain is locked, the store is unreadable, or a secret is rotated while a run holds it. The frontier is drained, so the focus comes from iteration 7's recommended next focus and from the strategy's lowest-coverage area. Evidence: 008's spec, plan and tasks against `dispatch.ts`, `runner.ts`, `answer.ts`, `delivery.ts` and the deep-loop `executor-audit.ts`, plus the macOS `security` man page.

## Findings

1. **P1 — the keychain backend puts the value in the process argument list, and the phase accepts that exposure although `security` itself offers the prompting form.** 008's risk table names the exposure and mitigates it with a flag and a help line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:189], and its open question decides the keychain stays the default "because the keychain is the only encrypted store and the argv exposure lasts one short-lived process" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:243]. The task that adds the backend verifies it by grepping for `add-generic-password` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:55]. Apple's own man page says the value can be omitted: "`-w password` Specify password to be added. Put at end of command to be prompted (recommended)" [SOURCE: man security, add-generic-password, -w]. So the exposure is a choice, not a constraint, and on the shared host 011 assumes any local user can read it from `ps` during the window. **Edit:** in `008/spec.md` REQ-002 add "the keychain backend runs `security add-generic-password -a <name> -s skilled-bots -U -w` with `-w` last and no value, inheriting the terminal so `security` prompts without echo, and the value never enters argv"; delete the risk row at line 189 and replace the decision at line 243 with "the prompting form is used, so the argv exposure does not exist"; in `tasks.md:55` change the verify to `rg -n 'add-generic-password.*-w$' $R/lib/secrets.ts`; and in REQ-001 add "the placeholder and empty checks run on the value read back after the write, and a refused value is deleted from the backend before exit".

2. **P1 — REQ-007 and the plan say the value never reaches the run folder, but the child's stdout is captured into the run folder and the child holds the value.** REQ-007 says the value reaches "the child environment only, under `SKILLED_BOT_SECRET_<NAME>`, and never the prompt, the run folder, the run record or a delivery message" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154], and the plan repeats "the prompt, the run folder and the delivery message get neither" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:73]. The runtime writes the child's stdout to `stdout.log` inside the run folder [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062], and the literal scan covers only the body, the question, the answer and the request prompt [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:942-953], plus the delivery message and the operator answer [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88]. A child that runs `env` or prints a config writes the value into the run folder, and nothing catches it. **Edit:** in `008/spec.md` REQ-007 replace "never the run folder" with "the runtime never writes the value; a child that prints it is caught after the run", and add REQ-014: "after the child exits, `stdout.log` is scanned with the same known-secret map, a match redacts the line in place and records `secret-in-output` on the run record, and the run is not delivered"; add `runtime/lib/runner.ts` to Files to Change with that scan, and add an acceptance criterion that a child printing `SKILLED_BOT_SECRET_DEMO` leaves no value in `stdout.log`.

3. **P1 — widening `assertDispatchEnvAllowed` to a prefix turns the strict per-kind list into a namespace rule, which is the bypass the list exists to prevent.** 008's plan says the gate "admits the `SKILLED_BOT_SECRET_` prefix in `assertDispatchEnvAllowed`, so the value reaches the child past the per-kind filter and nowhere else" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:69], and the open question records the decision to widen rather than add a subcommand [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:241]. The runtime's own comment says the opposite: "A dispatchEnv key is merged after the per-kind env filter, so it reaches the child even when the filter drops it... This list is therefore the only place that says which keys a caller may name" [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494-1497], and the check throws on any key outside the list [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1508-1516] before the merge at line 1611 [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1611]. A prefix rule admits any `SKILLED_BOT_SECRET_*` key from any future caller, including one built from a bot-controlled name. **Edit:** in `008/spec.md` REQ-002 and `plan.md:69` replace the prefix with a per-dispatch key: `runAuditedExecutorCommand` takes `dispatchEnvKeys?: string[]` alongside `dispatchEnv`, `assertDispatchEnvAllowed` accepts a key that is in the kind's list **or** in that array, and the runner passes exactly `SKILLED_BOT_SECRET_<NAME>` for the one name it resolved; add to `tasks.md` a verify that a second `SKILLED_BOT_SECRET_OTHER` key is still refused.

4. **P2 — `vault-policy.ts` answers a question `definition.ts` already answers, so it is a fourth module with nothing to decide.** The plan describes it as "the grant. Answers whether a bot may use a name (`allow` or `off`)" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:64]. The phase keeps `secrets:` as one name and refuses a needs-you park for an unapproved use [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:101-108], so the only two states are "the field names a stored entry" and "it does not", which the parser already produces as `secrets: string | null` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57] and the resolver already refuses as `secret-unknown` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:152]. **Edit:** in `008/spec.md` Files to Change drop `runtime/lib/vault-policy.ts` and move its one real job — the dropped-save check behind REQ-011 — into `secrets.ts` beside the write-back verification; in `plan.md:64` delete the component and in `plan.md:67-69` renumber the remaining three; in `tasks.md` drop the task that creates it and keep the `secret-write-dropped` verify on `secrets.ts`.

5. **P2 — the phase's own integration test pipes the value, and REQ-001 defines only the terminal path.** REQ-001 says the verb "reads the value from stdin with echo off when stdin is a terminal" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147], and the integration test runs "`bots secret set` through the CLI with a piped value" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:126]. Nothing says what a pipe does: whether one line is read, whether a trailing newline is stripped, whether a 16,384-character value with no newline is accepted, or whether a pipe is refused outright. The edge cases cover empty, too long and unreadable, not a pipe [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:218-220]. **Edit:** in `008/spec.md` REQ-001 add "when stdin is not a terminal, one line is read to the first newline, the newline is stripped, and a value with no trailing newline is accepted at end of input"; add the piped case to §8 Edge Cases with the exact refusal for an empty pipe (`secret-empty`).

## Ruled Out

- Looking for a place where the runtime writes the child environment to disk: `dispatchEnv` is passed to the audited runner and never recorded, so the leak is the child's own output, not the runtime's bookkeeping.
- Treating the keychain as the safe backend by default: it is the safer store at rest and the less safe one in flight, and the phase's risk row already says so.
- Reading 008's acceptance criteria line by line for a missing case: the criteria follow the requirements, so a requirement gap shows up as a criterion gap and the requirement is the place to fix.

## Dead Ends

- Looking for a rotation path: the value is resolved once before dispatch and the child keeps it, so a rotation mid-run changes nothing for that run and the next run resolves the new value. No finding.
- Looking for a locked-keychain path: the matrix already covers an unreadable store and the refusal is named `secret-store-unreadable` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:220]. No finding.

## Edge Cases

- Ambiguous input: "never the run folder" could mean the runtime's own writes or every byte under the folder. The narrower reading (the runtime's writes) is the one the requirement can enforce, and the finding names the wider one as the gap.
- Contradictory evidence: 008's risk row against Apple's man page. Both are cited; the man page is better supported because it is the tool's own contract.
- Missing dependencies: none. The runtime, the phase docs and the man page were all readable.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:96,101-108,147,152,154,189,218-220,241,243
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:64,69,73,101,126
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:55
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:942-953,1062
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:287,612
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494-1497,1498-1506,1508-1516,1611
- man security, add-generic-password, -w

## Assessment

- New information ratio: 0.90
- Questions addressed: does the store keep a value out of every surface a run can read, and what happens when the store is unreadable or a secret rotates
- Questions answered: the store does not keep it out of the run folder, the argv exposure is avoidable, and the gate widening weakens a boundary the runtime documents as strict; the unreadable and rotation paths are already covered

## Reflection

- What worked and why: reading the phase's own risk table and open questions first turned up the two places where the phase had already seen the problem and chosen the weaker answer, which is where the highest-value findings were. The man page settled the argv question in one command.
- What did not work and why: the first pass looked for a missing refusal and found the matrix complete. The leak was not a missing refusal but a false claim in a requirement, which only appeared when the requirement was checked against where the runtime actually writes.
- What I would do differently: for any requirement that says "never reaches X", enumerate the writers of X before accepting it. Here `stdout.log` is one grep away and the claim had stood through seven iterations.

## Recommended Next Focus

007 per-bot apps: whether the filtered UTCP config fails closed on an unknown server, whether the per-run config path sits inside the run folder that a child can read, and whether `HonoredPosture.apps` can be forged by a bot that names a server the filter drops. Then 010's conversation JSONL as a third injection path, which is the last carried-forward question.
