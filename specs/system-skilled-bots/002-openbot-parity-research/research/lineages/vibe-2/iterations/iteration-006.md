# Iteration 6: Frontier node F-3-009 — the smallest secret store skilled bots can add

## Focus

Frontier node F-3-009 (depth 3, scope `.skilled/skills/system-skilled-bots/runtime/lib`, `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts`, `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts`): what is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?

## Actions Taken

1. Read `run-record.ts` for the record's shape and the posture block.
2. Read `needs-you.ts` for the existing park-a-question mechanism.
3. Read `state-root.ts` for the per-identity state layout.
4. Read `bots.cjs` for the CLI's verb and exit-code vocabulary.
5. Re-read `dispatch.ts`'s leak guard and `definition.ts`'s posture block against the design.

## Findings

1. The store belongs **under the user-level state root**, beside needs-you items and run records, because that is the existing rule: "The item lives under the user-level state root so a run can neither forge nor clear one." [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:5]
2. `posture.secrets` should become a **name resolved against that store**, not a free string; today it is carried on the definition and never resolved. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57]
3. The smallest injection that works for a CLI-first product is a **command variable, not a page field**: the value goes into the child process environment only, so the bot's shell can use it and the prompt cannot. rakazo names this exact boundary and exposes it deliberately. [SOURCE: specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:37]
4. The **leak guard already exists and stays the second line**: `collectKnownSecrets` plus `findSecretLiteral` refuse a value that reaches a prompt, a question/answer or a delivery message. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249]
5. The run record **already has the right slot**: `HonoredPosture` carries `isolation`, `sandbox`, `executorKind` and `model`, so a `secretsUsed: string[]` of names — never values — is one field on an existing block. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123]
6. Approval should **reuse needs-you rather than invent a gate**: an unattended run that needs a human decision "ends instead of waiting, and leaves one item the operator answers later", and the item's state is derived from its fields, never stored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:5]
7. The store must be **per identity**, like every other state file: `identityStatePaths` already keys everything by identity under the state root. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117]
8. The CLI **already has the exit vocabulary** for a parked secret request: exit code 5 is "awaiting decision". [SOURCE: .skilled/bin/bots.cjs:54]
9. Encryption-key handling should **follow turnstone's rule rather than invent one**: a key accepted only from a config file and not from environment variables, with an ordered list for rotation where the first key encrypts new writes and all keys are tried on read. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md:8]
10. The store should be **write-only at every surface**, following OpenBot's rule that "nothing in the API reads a secret back out". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:4375]

## The smallest change, with size and risk

**Shape.** One module `secrets.ts` under `runtime/lib`, one CLI verb `bots secret`, one field on `HonoredPosture`, and one reuse of `needs-you`.

- `secrets.ts` — a per-identity store file under the user-level state root, values encrypted with a key read only from the repo config, names and metadata readable, values never returned by any function. Mirrors `needs-you.ts`'s layout and `state-root.ts`'s keying.
- `bots secret set|list|forget` — `set` reads the value from stdin, never from an argument, so it cannot land in shell history; `list` prints names and metadata only.
- `bots secret run --name <n> -- <command>` — the injection path. The value enters the child's environment only. This is the whole "inject without the bot reading it" requirement for a CLI product, and it is one `spawn` option.
- `HonoredPosture.secretsUsed: string[]` — names only, written by the runner when it injects. The run record then answers "which secrets did this run use" without ever holding a value.
- A use that is not pre-approved parks a `NeedsYouItem` and exits 5, reusing the existing mechanism instead of adding an approval gate.

**Size.** Roughly 400–600 lines of runtime plus tests: one module, one CLI verb group, one field, one needs-you call site. No new service, no new dependency, no schema migration.

**Risk.** The residual risk is a bot that reads the value out of its own environment and writes it into a file or a commit. The store cannot prevent that; what it can do is make it findable, because the run record names the secret and the leak guard already refuses the value in a prompt or a delivery. The mitigation is a checker invariant — a run that used a secret and whose worktree diff contains the value fails — which is a second, smaller change.

## Ruled Out

- A page-field injection like OpenBot's masked box: skilled bots has no browser, so there is no field to fill. The command variable is the equivalent primitive.
- A proxy-injection like rakazo's `secret_request`: it needs a server that makes the outbound call, which skilled bots does not have and a small team does not need.
- An external password manager like OpenMausBot's Bitwarden: it adds a service, a CLI dependency and a sync loop for a team of a few people.

## Dead Ends

- Looking for an existing encryption helper in the runtime: there is none, so the key handling has to be specified rather than reused. Turnstone's config-only rule is the cheapest correct answer.

## Edge Cases

- Ambiguous input: "records each use in the run record" could mean one row per use or one list per run. Selected interpretation: one list per run, because the record is one-per-run by design and a list answers the audit question without a new file.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:1-230
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-45
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:100-190
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-290
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:52-58
- .skilled/bin/bots.cjs:20-60
- specs/system-skilled-bots/context/rakazo-main/docs/bot-secrets.md:37
- specs/system-skilled-bots/context/turnstone-main/docs/oauth-storage.md:8
- specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:4375

## Assessment

- New information ratio: 0.85
- Questions addressed: What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?
- Questions answered: What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?

## Reflection

- What worked and why: reading the three existing state modules (`run-record`, `needs-you`, `state-root`) before designing. Each one already solves a piece — a per-run record, a parked question, a per-identity layout — so the design became assembly rather than invention, which is what "smallest change" means.
- What did not work and why: looking for an existing encryption helper assumed one exists; it does not, so the key rule had to be borrowed from turnstone rather than reused locally.
- What I would do differently: start from the run record. It is the join every later surface reads, so any new fact that must be auditable belongs there, and starting there makes the rest of the design fall out.

## Recommended Next Focus

What is the smallest connector registry skilled bots can add on top of MCP and Code Mode, so a bot's apps are named, granted per bot and recorded, without building an OAuth server?
