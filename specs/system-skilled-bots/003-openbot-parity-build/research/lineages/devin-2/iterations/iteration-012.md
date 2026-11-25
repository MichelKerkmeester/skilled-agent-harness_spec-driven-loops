# Iteration 12: The run folder and the child environment — can a secret reach the run folder? (angle 4)

**Iteration**: 12 of 13
**Focus**: The run folder and the child environment. Phase 008 promises a stored value never reaches the prompt, the run folder, the run record or a delivery message. This pass tested that promise against what the runner actually writes into the run folder and what a child process can do with the environment it is given.

## Focus

The vault phase's promise is a claim about four sinks. Iteration 8 tested the record, the conversation file and the outbound delivery. This pass tested the fourth sink — the run folder — by reading what the runner writes there, what phase 007 adds to it, and what the child process can produce.

## Actions Taken

1. Read `runner.ts` around the dispatch call for the run folder's paths and the stdout capture.
2. Read `dispatch.ts` for `stdoutLogPath` and what the captured stdout is used for.
3. Read `.utcp_config.json`'s `env` blocks to see whether the filtered copy phase 007 writes carries values or references.
4. Read phase 008's four-sink promise and phase 005's prompt check for the parked-prompt path.

## Findings

1. **P1 — Phase 008's "never the run folder" promise is unenforceable because the runner captures the child's stdout into `<runFolder>/stdout.log`, and the child holds the secret.** The runner sets `stdoutLogPath: join(runFolderPath, 'stdout.log')` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062], and the dispatcher writes the child's output there [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:618]. A bot that runs `echo $SKILLED_BOT_SECRET_DEMO` — or any command that prints its environment — writes the value into the run folder in plaintext, where a backup or a bug report would carry it. Phase 008's requirement says the value never reaches "the prompt, the run folder, the run record or a delivery message" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:153], which the runtime cannot guarantee once the child owns the value. **Exact edit**: add to `008-vault/spec.md` a post-run redaction requirement — "before the run closes, `stdout.log` and any captured output are scanned with `collectKnownSecrets` and each match is replaced with `[redacted: <name>]`, with the redaction recorded on the run record and never the value" — plus one acceptance row that plants a value, prints it from the fixture bot, and asserts the log holds the marker and not the value.
2. **Verified — phase 007's filtered UTCP config carries references, not values.** The repository config's `env` blocks hold `"${FIGMA_API_KEY}"` and `"${GITHUB_PERSONAL_ACCESS_TOKEN}"` [SOURCE: .utcp_config.json:130] [SOURCE: .utcp_config.json:149], so the filtered copy written into the run folder names variables rather than carrying credentials. 007's promise that the config holds no secret is sound.
3. **Verified — the parked prompt is covered.** Phase 004 stores the parked prompt on the needs-you item, and phase 008's literal check covers "a question" and "a request prompt" before dispatch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160], so a value pasted into a prompt refuses the run before the item is written.

## Ruled Out

- **Treating the run record as a fourth leak.** `DispatchSnapshot` has no environment or argv field [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82], so the record cannot carry the value; only the captured output can.
- **Treating a child's descendants as a separate plan defect.** The value is injected into the child's environment and any subprocess it spawns inherits it; that is inherent to environment injection and is the reason the redaction pass, not the injection, is the enforceable control.
- **Treating the `.utcp_config.json` `env_file_path` as a leak.** It is a path to a dotenv file, not a value, and the filtered copy keeps the path the operator already configured.

## Dead Ends

- Searching for a second state-root writer of child output found none: the stdout log is the only capture, and the ledger writes request metadata rather than child text.

## Edge Cases

- **Ambiguous input**: "the run folder" was read as every file under the run's evidence folder, including the filtered config and the captured output, not only the record.
- **Contradictory evidence**: Finding 1 is a promise the runtime cannot keep as written; the phase and the code are both cited.
- **Missing dependencies**: none.
- **Partial success**: the fixture bot was not run; the leak is established from the path construction and the capture call, not from an observed log.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:618
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82
- .utcp_config.json:130, :149
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:153, :160
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 4, the run folder and child environment
- Questions answered: the run record, the filtered config and the parked prompt are clean; the captured stdout is the one sink that can carry a value the runtime injected, and it needs a redaction pass.

## Reflection

- **What worked and why**: Reading the path construction, not the requirement, found the leak. The promise lists four sinks and the code writes to all four; only one of them receives text the runtime does not author.
- **What did not work and why**: The earlier security pass stopped at the record and the conversation file because those are the sinks the phases name. The run folder's own files are named only in the runner.
- **What I would do differently**: For a "never reaches X" promise, enumerate X's files from the code that writes them before accepting the promise.

## Recommended Next Focus

Final pass before synthesis: collect every finding into the cross-phase conflict list and the per-phase ranking, check that no finding duplicates another, and test the three P0/P1 items against the parent spec's scope to see which ones the parent can settle in one edit rather than eleven.
