# Iteration 4: Plan versus runtime — files, symbols, verbs and the `.opencode` mirror (angle 1)

**Iteration**: 4 of 13
**Focus**: Angle 1 — plan versus runtime. Do the files, functions, records, fields and verbs each phase plan names exist with the shapes it assumes, and are its test and verify commands runnable here?

## Focus

The frontier is drained (F-1-002 and F-1-006 answered), so the run continues under `max-iterations` and broadens into the topic's four review angles. This iteration took the largest untouched angle: the mechanical claim that every phase's file table, symbol reference and verb table matches the runtime as it exists today.

## Actions Taken

1. Extracted every `Create` and `Modify` row from all eleven `spec.md` file tables into a 224-row inventory.
2. Checked each `Modify` path for existence and each `Create` path for absence in the current tree.
3. Checked ten runtime symbols the plans depend on: `buildBotPrompt`, `runPrecheck`, `summarizeRecord`, `findSecretLiteral`, `collectKnownSecrets`, `enqueueRequest`, `writeNeedsYouItem`, `readNeedsYouItem`, `needsYouState`, `DELIVERY_CHANNELS`.
4. Checked five more: `buildResumedPrompt`, `ensureIdentityState`, `sharedStatePaths`, `identityStatePaths`, `openIndex`.
5. Read `bots.cjs` `VERB_SPECS` and `KNOWN_OPTIONS` to confirm the claimed pre-state for every new verb and option.
6. Checked each `tasks.md` notation block against the shell variables its verify commands actually use.
7. Checked the `crates/bots-tui/` path against `DEFAULT_SKILLED_TREE` and the `.opencode/` mirror rule.

## Findings

1. **P1 — Phase 005 puts `--as` in scope and in REQ-001 but never tasks it.** The spec lists `--as` in the scope list, the deliverable and REQ-001's actor rule [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:51] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:93] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:144], and the acceptance table exercises only the OS-user path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md:54]. Neither `005-memory/plan.md` nor `005-memory/tasks.md` mentions `--as` at all, and the CLI rejects an option a verb's spec does not list [SOURCE: .skilled/bin/bots.cjs:64]. So `bots remember --as ada` would exit 2 as an unknown option and REQ-001's actor branch is unbuilt and untested. **Exact edit**: add to `005-memory/tasks.md` a task mirroring 001's `--as` task — "Add `as` to `remember`'s options and pass the resolved actor to the entry" with a verify that `bots remember x --as ada` prints the entry rather than `unknown option` — and one acceptance row that reads the actor back through `--list --json`.
2. **P2 — The `.opencode/bin/bots.cjs` mirror row is missing from six phases' file tables.** Phases 003, 010 and 011 each list both `.skilled/bin/bots.cjs` and `.opencode/bin/bots.cjs` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:143], while 001, 002, 005, 006, 008 and 009 list only the `.skilled` copy [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:118]. The two files are byte-identical today (same SHA-1) and phase 003's plan states that `.opencode/` mirrors `.skilled/` wholesale [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31]. A phase that edits only the `.skilled` copy leaves the mirror stale, and any command that runs the `.opencode` CLI sees the old verb table. **Exact edit**: add `.opencode/bin/bots.cjs` to the file table of 001, 002, 005, 006, 008 and 009, or add one sentence to the parent spec that a sync step owns the mirror and no phase edits it by hand.
3. **P2 — `scripts/fixtures/` is marked `Create` in two phases though the folder already exists.** Phase 002 and phase 009 each carry a `Create` row for `.skilled/skills/system-skilled-bots/scripts/fixtures/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:146] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:142], and the directory is already present in the tree. A `Create` row for an existing path is wrong in the change-type column and hides what the phase actually adds. **Exact edit**: change both rows to `Modify` and name the subfolder each phase adds (for example `scripts/fixtures/routine-floor/` and `scripts/fixtures/skills-too-large/`).
4. **P2 — Phase 004's notation block says two shell variables and defines three.** The block reads "Two shell variables shorten the commands below" and then assigns `LIB`, `RT` and `BOTS` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:29]. Every command in the file is still runnable, so this is polish, not a gate. **Exact edit**: change "Two" to "Three".

## Ruled Out

- **Treating the `crates/bots-tui/` path as inconsistent with `<skilled-tree>`.** `DEFAULT_SKILLED_TREE` resolves to the repository root (`__dirname/../..` from `.skilled/bin`), so `<skilled-tree>/crates/bots-tui/target/release/bots-ui` and the file table's `crates/bots-tui/...` name the same path [SOURCE: .skilled/bin/bots.cjs:17] [SOURCE: .skilled/bin/bots.cjs:425]. The plan's reason for placing the crate outside `.skilled/` — the `.opencode/` mirror would duplicate the build output — is sound [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31].
- **Treating any planned symbol as invented.** All fifteen symbols checked exist today, including `buildBotPrompt` in `dispatch.ts` and `runner.ts`, `runPrecheck` in `runner.ts`, `summarizeRecord` in `status-index.ts`, `buildResumedPrompt` in `needs-you.ts` and `runner.ts`, and `openIndex` in `status-index.ts`. The plans' pre-state claims are accurate.
- **Treating the new verbs as already present.** `VERB_SPECS` holds exactly the eleven verbs the phases claim, and none of `activity`, `ui`, `routines`, `remember`, `secret`, `skill`, `chat` or `channel` is among them [SOURCE: .skilled/bin/bots.cjs:64]. Every phase's "unknown verb" measured behavior is accurate.
- **Treating `$T` in phase 007's tasks as an undefined variable.** It is a `mktemp` directory defined inline in the same command [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md:37], not a missing notation variable.

## Dead Ends

- A pure existence sweep cannot find a wrong shape: every `Modify` path exists and every `Create` path is absent except `scripts/fixtures/`, so the sweep is clean apart from Finding 3. Shape errors need a per-symbol read, which is the next iteration's work.

## Edge Cases

- **Ambiguous input**: "the files, functions, records, fields and verbs each plan names" was read as the file tables, the named symbols, the CLI verb and option tables, and the crate path. Record field shapes were covered in iterations 1-3.
- **Contradictory evidence**: none.
- **Missing dependencies**: none; the runtime and all eleven phase docs were readable.
- **Partial success**: the `crates/bots-tui` Rust crate cannot be built here (no crate yet, and the toolchain was not exercised), so the crate's verify commands were read, not run. That is deferred to a later iteration if a cargo toolchain is present.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:136
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:61
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:143
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:127
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:31
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:29
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:51, :93, :144
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md:44
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/tasks.md:37
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:170
- .skilled/bin/bots.cjs:17, :64, :425
- `.opencode/bin/bots.cjs` and `.skilled/bin/bots.cjs` SHA-1 comparison (identical)
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 1 (plan versus runtime), file and symbol layer
- Questions answered: the file tables and named symbols are accurate except for 005's `--as`, the mirror rows, the fixtures change type and one notation count; every planned symbol exists and every planned verb is genuinely new.

## Reflection

- **What worked and why**: The mechanical existence sweep is cheap and decisive. Comparing `Create` against the tree found the one stale row, and comparing `Modify` against the tree proved that every pre-state file exists — including the `crates/bots-tui` rows, which are correctly future files created by 003 and modified by 010.
- **What did not work and why**: The first extraction command used backticks inside double quotes and the shell executed them; single-quoting the pattern fixed it. A second attempt at variable detection with `^[A-Z]+=` missed prose-defined variables, which made a clean file look broken until the notation blocks were read.
- **What I would do differently**: Extract the file table once to a file and reuse it across iterations instead of re-deriving it per pass.

## Recommended Next Focus

Continue angle 1 at the shape layer: read the record and field shapes each plan assumes against the runtime's actual types — `RunRecord`, `NeedsYouItem`, `RunSummary`, `BotDefinition`, the request queue record and the delivery record — and check the `--json` payloads the terminal and channels consume. The mechanical layer is clean; the shape layer is where a wrong assumption hides.
