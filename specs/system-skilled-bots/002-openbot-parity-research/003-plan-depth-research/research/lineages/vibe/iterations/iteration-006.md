# Iteration 6: Phases 007-per-bot-apps and 008-vault — security boundaries, secret handling, per-run config and operator prerequisites

## Focus
Whether the two security-bearing phases are planned deeply enough that a builder makes no design decision: 007's per-bot app filter and its UTCP config handoff, and 008's secret store, injection path and output scan. Both phases own a boundary the rest of the packet trusts, so a gap here is a gap in every phase that runs a child.

## Actions Taken
1. Read `007-per-bot-apps/spec.md` scope, requirements and files-to-change, plus its refusal names and worktree-restore rule.
2. Read `008-vault/spec.md:92-185` (scope, files to change, REQ-001..REQ-015, success criteria) and `:218-226` (edge cases).
3. Read `008-vault/plan.md` for the module split, the index shape and the verification commands.
4. Read `008-vault/tasks.md` T002-T030 and `acceptance-criteria.md` AC-001..AC-016 for the pinned shapes and refusal names.
5. Grepped the built runtime for the current state of `secrets` in `definition.ts` and `state-root.ts`, and for the atomic-write and lock conventions the store would need.

## Findings

1. **P0 — the `secrets` name grammar is referenced six times and defined nowhere.** `spec.md:99` ("the `secrets` name grammar is parsed once, in `definition.ts`"), `spec.md:114` ("the store: name grammar"), `spec.md:117`, `spec.md:150` (REQ-005 refuses "a value outside the name grammar"), `plan.md:65` ("owns the name grammar"), `plan.md:122` (a unit test for "the name grammar"), and `goal.md:49`. No file in the phase states the allowed characters, the length bound, the leading-character rule or the case rule. The only concrete datum is the negative case in AC-005, `secrets: ../etc/passwd` → `definition.secret-name-invalid`. A builder must invent the regex, and that regex decides the environment key in finding 2, so the invention propagates. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:65] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:64]

2. **P0 — the `SKILLED_BOT_SECRET_<NAME>` mapping rule is unstated.** REQ-007 fixes the prefix and the one-key admission (`dispatchEnvKeys`), and AC-007 pins exactly one instance, `demo` → `SKILLED_BOT_SECRET_DEMO`. Nothing states how a name that is not already upper-case-and-underscore becomes a key: whether `-` and `.` are translated to `_`, whether the name is upper-cased, or whether the grammar is instead restricted so that the mapping is the identity. The three answers are not equivalent — the first two admit names that collide (`my-key` and `my_key` both map to `MY_KEY`), and the third silently narrows REQ-005. `assertDispatchEnvAllowed` would admit whatever string it is handed, so nothing downstream catches a malformed key. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:152] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:66]

3. **P1 — two refusal names live only in edge-case prose, with no REQ id and no AC row.** `secret-too-long` appears at `spec.md:222` ("a value of 16,384 characters is accepted, matching rakazo's vault bound, and a longer one is refused `secret-too-long`") and `secret-store-unreadable` at `spec.md:223` ("a store folder that cannot be read refuses `secret-store-unreadable` with exit 4"). Neither has a REQ, and neither has an acceptance criterion. `goal.md:63` nevertheless verifies `secret-too-long` in the test run, so a builder who implements the REQ table exactly produces a phase whose own goal check fails. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:222] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/goal.md:63]

4. **P1 — the store's on-disk shapes are pinned only inside acceptance-criteria commands, never in a schema section.** AC-002 supplies `$STATE/secrets/index.json` with `.entries.demo.backend` and `$STATE/secrets/demo.value`; `plan.md:73` supplies the entry as `{backend, createdAt, updatedAt}`. That is enough to reconstruct the file, but it is scattered across a test command and a prose sentence: no `name` field, no version field, no statement that `entries` is keyed by name rather than an array, no fingerprint or length field for `list` to print, and no statement of what `list` prints beyond "names and metadata only" (REQ-003). A builder reading spec and plan alone invents a different file than the one the AC reads. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:61] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:73]

5. **P0 — the phase changes the meaning of an existing field with no migration and no rollback.** `bot-template.txt:21` ships `secrets: null`, and the comment the phase itself replaces says the field is not enforced (`spec.md:135`, T025). After 008, a bot that declares a name the store does not hold is refused `secret-unknown` with exit 4 before dispatch (REQ-006). So every bot already carrying a `secrets:` line stops running on upgrade, and the packet contains no operator step for it: no "before upgrading, run `bots secret set` for every name your bots declare", no audit verb to list declared-but-unstored names, and no rollback note (forgetting a name stops every bot that names it). This is the one place in the packet where a phase silently invalidates existing operator state. [SOURCE: .skilled/skills/system-skilled-bots/assets/bot-template.txt:21] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:151] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:99]

6. **P1 — the index has no concurrency rule.** `set`, `forget` and the write-back verification all read-modify-write one `index.json`. Two `bots secret set` processes, or a `set` racing a `forget`, lose an entry. The runtime already carries the temp-write-then-rename convention this needs (`request-queue.ts:93`, `status-index.ts:712`), but 008 never names it, and no lock or last-writer rule is stated. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:93] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:712]

7. **P1 — the keychain backend names one command of the three it needs.** REQ-002 and T009 name `add-generic-password -a <name> -s skilled-bots -U -w <value>` on `security -i`'s stdin. `forget` (REQ-004) must remove the value from its backend, which for the keychain means `delete-generic-password` with the same account and service, and that command is never named; `list` reads the index, so it is fine. Relatedly, `--store file|keychain` is defined as overriding "the choice" for `set`, but its meaning on `forget` and `list` is undefined when the entry's recorded backend differs from the flag — a `forget --store file` on a keychain entry either misses or lies. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:147] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:55]

8. **P2 — the redaction form and the withheld run's outcome are unspecified.** REQ-014 says a matching line "is redacted in place" and "the run is not delivered", but not what replaces the value (a fixed token, the name, an empty string), not whether the run record's status changes, and not what `bots run` exits with. AC-014 only asserts the value is absent from the run folder, which every one of those choices satisfies. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:164]

## Ruled Out
- Reading 007 as under-planned. It names its refusals (`apps-unknown-server`, `apps-unenforceable`), its env key (`UTCP_CONFIG_FILE` through `dispatchEnvKeys`), its filtered-config write and its worktree-restore-after-exit rule. It is the second-best-planned phase in the packet after 004, and needs no child.
- Treating 008 as needing a phase parent. Its 19 files and 15 requirements are one coherent store plus one injection path; the gaps above are additions to the existing documents, not a split.

## Dead Ends
- Searching for a name grammar in the reference code to adopt by citation: rakazo's `bot-secrets.md:35` is cited for the 16,384 bound only, and the packet never cites it for the grammar. Adopting one would be a design decision the phase does not authorize.
- Looking for an existing lock helper to cite: the runtime has the atomic-rename convention but no exported lock, so 008 would have to introduce one or state that last-writer-wins is accepted.

## Edge Cases
- Ambiguous input: none. Both phases name their files and refusals.
- Contradictory evidence: none.
- Missing dependencies: none. Both phases' dependencies are in-packet.
- Partial success: none. All five research actions returned evidence.

## Questions Answered
- Are 007's security boundaries planned deeply enough to one-shot? Yes, with one P2 (the `--store`-style override semantics do not arise there).
- Is 008's secret handling planned deeply enough to one-shot? No — two P0s (the name grammar and the env-key mapping) and one P0 migration gap block it.

## Questions Remaining
- Whether any other phase changes the meaning of an existing field or file without a migration step (candidate: 005's memory entry format, 006's grant records).
- Whether the packet has a single place where refusal names are registered, since 008 shows names arriving from three different document layers.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:92-185, :218-226
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:27, :46, :65-73, :83-86, :122-130, :196
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/tasks.md:39-91, :199
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/acceptance-criteria.md:54-75
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/goal.md:49, :52, :63
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md
- .skilled/skills/system-skilled-bots/assets/bot-template.txt:21
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57, :101, :263, :281
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts (no `secrets` entry)
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:93
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:712

## Assessment
- New information ratio: 0.93
- Questions addressed: 007's and 008's one-shot readiness; the secret store's schema, grammar, injection and migration story.
- Questions answered: both.

## Reflection
- What worked and why: reading the acceptance criteria as a schema source. AC-002 turned out to be the only place the index shape is written down, which is itself the finding — the phase's data contract lives in a test command.
- What did not work and why: grepping the reference code for a name grammar to cite. The phase cites rakazo for a length bound and for two lifted modules, not for the grammar, so there is nothing to adopt without a decision.
- What I would do differently: check the goal file's verification line against the REQ table earlier. That comparison is what surfaced `secret-too-long` as a name with no requirement behind it.

## Recommended Next Focus
Phases 009-skills and 012-manual-testing-scenarios: whether the skill-proposal staged-write path and the 33-scenario corpus are planned deeply enough to one-shot, and whether the corpus has fixtures rather than prose.
