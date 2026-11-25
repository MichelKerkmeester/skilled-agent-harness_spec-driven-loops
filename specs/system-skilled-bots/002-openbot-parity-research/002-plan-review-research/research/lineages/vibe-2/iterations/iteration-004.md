# Iteration 4: Plan versus runtime — the verbs, the schema version and the mirror

## Focus

Frontier node F-2-005 (depth 2): "Plan versus runtime: do the files, functions, records, fields and verbs each of the eleven plans names exist with the shapes it assumes, and are its test and verify commands runnable in this checkout?"

This iteration runs every Definition of Ready and Definition of Done command the eleven plans name, and checks the runtime symbols each plan says it will extend. It found one P0 build-order contradiction, one parser gap three phases share, and one mirror-file gap six phases share.

## Actions Taken

1. Extracted every `- [ ]` line from the Definition of Ready and Definition of Done blocks of all eleven `plan.md` files.
2. Ran the runnable ones: the eight "unknown verb" probes, the `rg` pre-state probes, the `npm` script probes, `cargo --version`, `bots status`, `bots answer --scope`, and `diff -q` on the CLI mirror.
3. Read `bots.cjs`'s `VERB_SPECS`, `parseArgs` and `KNOWN_OPTIONS` to test the verb grammar the plans assume.
4. Read `dispatch.ts`, `runner.ts`, `run-record.ts`, `label.ts` and `needs-you.ts` for every symbol a plan says it will extend.
5. Read the parent phase map's dependency column to test each DoD against the state the build order leaves behind.

## Findings

1. **Phase 004's Definition of Done can never pass in build order: it requires `SCHEMA_VERSION = '2'` after phase 001 has bumped it to `'3'`.** Phase 004's DoD says "`rg -n \"SCHEMA_VERSION = '2'\" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line" (`004-computer-exposure/plan.md:49`), and its AFFECTED SURFACES verification repeats the same command (`004-computer-exposure/plan.md:82`). Phase 001's AFFECTED SURFACES says the same file "gains the `actor` column and a `SCHEMA_VERSION` bump" and its verification expects `'3'` (`001-activity-and-actor/plan.md:76`), and the parent phase map makes 004 depend on 001 (`spec.md:124`). The runtime is at `'2'` today (`status-index.ts:55`), so 004's check passes only before 001 lands and fails after. **Severity P0** — the phase cannot be marked done, and a builder who trusts the DoD will either revert 001's bump or ship a failing gate. Fix: change both occurrences in `004-computer-exposure/plan.md` (lines 49 and 82) to `SCHEMA_VERSION = '3'`, and add one sentence to 004's §3 saying the index is already at `'3'` when this phase starts.

2. **Three phases assume a two-word verb grammar the CLI does not have, and only one of them names the parser change.** `VERB_SPECS` is a flat map of single-word verbs with an `ids` count — `run`, `disable`, `enable`, `pause`, `resume`, `inbox`, `enqueue`, `drain`, `answer`, `schedule`, `status` (`bots.cjs:63-77`) — and `parseArgs` takes the first positional as the verb, so `bots skill propose <run-id>` parses as verb `skill` with id `propose`, `bots secret set demo` as verb `secret` with id `set`, and `bots channel list` as verb `channel` with id `list`. Phase 008 names the problem and the fix: "`VERB_SPECS` is the closed verb list | update: the `secret` verb group" (`008-vault/plan.md:91`). Phase 009 says only "`skill` is not in `VERB_SPECS`, so the CLI exits 2" (`009-skills/spec.md:91`) and phase 011 says only "`bots channel list` prints `bots: unknown verb: channel`" (`011-messaging-channels/plan.md:40`); neither names the grammar change. **Severity P1.** Fix: add one row to `008-vault/plan.md` §3 defining a `VERB_GROUPS` table (verb → sub-verb → ids/options) and the `parseArgs` change that reads it, then have `009-skills/plan.md` and `011-messaging-channels/plan.md` cite that row instead of assuming the grammar exists.

3. **Six phases edit `.skilled/bin/bots.cjs` without updating its `.opencode/bin/bots.cjs` mirror, so the mirror drifts and the three phases that gate on `diff -q` fail.** The two files are byte-identical today (`diff -q` exits 0) and the mirror is a regular file, not a symlink. Phases 003, 010 and 011 list the mirror in AFFECTED SURFACES and require `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` to print nothing (`003-terminal-screen/plan.md:49`, `010-conversations/plan.md:50`, `011-messaging-channels/plan.md:52`). Phases 001, 002, 005, 006, 008 and 009 edit `.skilled/bin/bots.cjs` and never mention the mirror, so after 001 lands the two files differ and 003's DoD fails. **Severity P1.** Fix: add the `.opencode/bin/bots.cjs` row to the AFFECTED SURFACES table of phases 001, 002, 005, 006, 008 and 009, or add one Phase Transition Rule to `spec.md` §3 — "every phase that edits `.skilled/bin/bots.cjs` updates `.opencode/bin/bots.cjs` in the same commit and proves it with `diff -q`".

4. **Three plans have no runnable Definition of Ready, so a builder cannot tell whether the pre-state holds.** Phases 002, 007 and 009 use only generic `[x]` items — "Problem statement clear and scope documented", "Success criteria measurable", "Dependencies identified" (`002-routine-layer/plan.md:39-42`, `007-per-bot-apps/plan.md:39-41`, `009-skills/plan.md:39-42`) — while the other eight name a measured command and its expected output. **Severity P2.** Fix: give each a measured pre-state, matching the pattern the other eight use: 002 `rg -n 'routine' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` exits 1; 007 `rg -n 'apps' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` exits 1; 009 `rg -n 'skills' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` exits 1.

5. **Phase 003's Definition of Ready is circular: it requires a successful build of the crate the phase creates.** The DoR says "`cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0 on the empty crate" (`003-terminal-screen/plan.md:41`), but `crates/` does not exist in this checkout, so the command fails before the phase starts and passes only after the phase has done the work the DoR is meant to gate. **Severity P2.** Fix: move the build check to the Definition of Done and keep only `cargo --version` in the DoR; `cargo 1.92.0` is installed here, so that half already passes.

## Verified Correct

Every other pre-state and post-state command the plans name is runnable and currently returns what the plan says:

- All eight "unknown verb" probes exit 2 with the expected message: `activity`, `inbox --json`, `ui`, `remember`, `secret set`, `chat`, `channel list`, and `answer --scope` (`bots.cjs` probe run).
- `rg -c 'grants' needs-you.ts` exits 1; `rg -n 'posture\.secrets' runtime/lib` exits 1; `rg -n 'SKILLED_BOT_SECRET_' executor-audit.ts` exits 1; `rg -c 'conversation' runtime/lib/` exits 1; `rg -c 'ChannelAdapter' runtime/lib/` exits 1; `rg -n -i 'memory' runtime/lib/*.ts` exits 1; `rg -n 'memory' dispatch.ts` exits 1 — every "the gap is real" probe passes.
- `rg -n 'ITEM_KEYS' needs-you.ts` prints the declaration at line 51 and no `'kind'` entry, as phase 005 requires.
- `rg -n 'DELIVERY_CHANNELS' delivery.ts` prints `45:export const DELIVERY_CHANNELS = ['desktop'] as const;`, exactly as phase 011 requires.
- `ls .skilled/skills/system-skilled-bots/bots-run/references/` lists `run-queue-and-answer.md` and no ladder doc, as phase 006 requires.
- `bots status` prints a row with no `branch` part, as phase 004 requires.
- `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` and `... test` exist as scripts, so phases 004, 007, 008 and 009's DoD commands are runnable.
- Every runtime symbol a plan says it will extend exists with the assumed shape: `buildBotPrompt` (`dispatch.ts:315`), `runPrecheck` (`runner.ts:535`), `findSecretLiteral` and `collectKnownSecrets` (`dispatch.ts`, imported at `answer.ts:20` and `delivery.ts:30`), `readRunRecord` (`run-record.ts:377`), `EvidenceLocations.branch` and `.worktreePath` (`run-record.ts:155-156`), `RESERVED_BOT_IDS` (`label.ts:28`), `HonoredPosture` with four fields (`run-record.ts:123-128`).
- `cargo 1.92.0` is installed, so phase 003's toolchain half of the DoR passes.

## Questions Answered

- F-2-005 in part: the verbs, the schema version and the mirror are tested; the remaining plans' file-level claims are verified for the symbols named above.

## Questions Remaining

- Do the phases agree on the shared records, and is the build order sound? (F-2-006, F-2-009)
- Security and failure modes. (F-2-007)
- Which planned surfaces duplicate the runtime, ranked by build time saved? (F-2-008, answered in substance at iteration 3 finding 5)

## Ruled Out

- **Treating the eight "unknown verb" probes as a single finding.** They all pass, so they belong in Verified Correct, not in the defect list.
- **Reading phase 004's `'2'` as a deliberate pre-state check.** A Definition of Done is a post-state gate, and 004's own AFFECTED SURFACES repeats the same command as its verification, so the `'2'` is a copy of 001's pre-state, not a design choice.
- **Assuming `.opencode/bin/bots.cjs` is a symlink.** It is a regular 26,523-byte file, so `diff -q` is a real comparison and the mirror must be edited.

## Dead Ends

- **Looking for a sub-verb parser in `bots.cjs`.** `parseArgs` has no notion of a second positional as a sub-verb; `VERB_SPECS[verb].ids` counts ids, not sub-verbs.
- **Looking for a `crates/` directory.** It does not exist, which is why phase 003's DoR build check cannot pass before the phase.

## Edge Cases

- **Ambiguous input:** "runnable here" could mean "runnable on this machine" or "runnable in CI". This iteration tested this machine, which is the stricter reading for the toolchain checks and the weaker one for the CI job; the CI half is recorded in iteration 2 finding 3.
- **Contradictory evidence:** phase 004's DoD and phase 001's AFFECTED SURFACES make incompatible claims about the same constant. Both are cited; finding 1 records 004 as the defect because 001 owns the schema and the parent orders 001 first.
- **Missing dependencies:** none. `cargo`, `npm`, `rg` and `node` are all present.
- **Partial success:** none.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:40,60,76`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:39-42`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:40-52`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:45-49,82`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:39-42`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:39-42`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:39-41`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:91`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:39-42`, `009-skills/spec.md:91`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:50`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:40,52`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:124`
- `.skilled/bin/bots.cjs:63-77`
- `.opencode/bin/bots.cjs` (regular file, byte-identical)
- `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55`
- `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315`
- `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:535`
- `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128,149-159,377`
- `.skilled/skills/system-skilled-bots/runtime/lib/label.ts:28`
- `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51`
- `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45`
- `.skilled/skills/system-skilled-bots/runtime/package.json` (scripts: `typecheck`, `test`)

## Assessment

- New information ratio: 0.90 (4 fully new findings, 1 partially new because phase 008 already names the `VERB_SPECS` change)
- Questions addressed: F-2-005
- Questions answered: F-2-005 in part

## Reflection

- **What worked and why:** running the DoR and DoD commands instead of reading them turned three plans' prose into a pass/fail table. The P0 only appears when 004's DoD is evaluated against the state 001 leaves behind, which requires reading the parent's dependency column alongside the child's gate.
- **What did not work and why:** the first pass compared each plan to the runtime as it is today, which made 004's `'2'` look correct. A Definition of Done is a post-state gate, so the comparison has to be against the state after the dependencies land.
- **What I would do differently:** build a small table of (phase, gate, expected state, state after dependencies) before running anything. The contradiction is visible in that table without executing a command.

## Recommended Next Focus

F-2-006, cross-phase shared-record consistency: `by:` actor, grants, `operators.json`, conversation JSONL, memory files, state-root layout, `HonoredPosture` fields and the `bots --json` output the terminal screen and the channels both read. The `definition.ts` hotspot from iteration 2 and the `operators.json` conflict from iteration 1 belong there.
