# Iteration 5: Per-runtime log shapes and the single adapter contract (F-2-006, Q2)

## Focus
Frontier node F-2-006 asks which runtimes' logs expose timestamped tool events that one `passEvidence` extractor could use. Answering it means walking every `LINEAGE_COMMAND_ADAPTERS` entry. That walk also covers the brief's Q2 dimensions: output format, prompt channel, effort, permission and sandbox, session resume, the two single-executor builders, and the runtime agent mirrors.

Q2 sits outside this lineage's frontier share as a topic question, so it is answered here only as far as F-2-006 reaches it.

## Actions Taken
1. Read all eight adapter builders in `fanout-run.cjs` and the adapter table itself.
2. Read `buildClaudeInvocation`, `runClaude`, `runLineageBuiltin` and `runCodex` in `dispatch-iteration.cjs`.
3. Read the persona inlining in `fanout-run.cjs` (`agentPersonaBlock`).
4. Diffed the `deep-research` agent mirrors against `.skilled`, and ran the read-only `agent-roster-mirror-check.cjs`.

## Findings
1. **Only 2 of 8 kinds write an event log the runner can read today. The other six write text, so honesty and cost signals are blind for them.** [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3610-3619]

   | Kind | Log shape today | Source |
   |---|---|---|
   | `cli-claude-code` | `--output-format text` | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2702-2711] |
   | `cli-cursor` | `--output-format text` | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2930] |
   | `cli-codex` | `exec` with no `--json` | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2665-2680] |
   | `cli-devin` | no format flag | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3066] |
   | `cli-pi` | `-p` | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3166] |
   | `cli-opencode` | `--format json`, with timestamped `tool_use` rows | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2775-2784] |
   | `cli-deepseek-harness` | `--json` | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3360] |
   | `cli-mistral-vibe` | writes an export directory | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3575-3582] |

   - **Change:** give each adapter a `logFormat` and switch the flag where the CLI has one:
     - Claude `--output-format stream-json --verbose` (iteration 3 finding 2);
     - Codex `exec --json`;
     - Cursor `--output-format stream-json`.
   - The Codex and Cursor flag names come from those CLIs' public docs and are not verified in this repository. Pi and Devin stay `text` until a JSON mode is confirmed. [INFERENCE: based on the adapter args read here and iteration 3's Claude headless sources]
   - Value H, effort M, risk M: salvage and the final-answer read change per kind.
2. **The prompt travels through three channels, and the builder never states which.**
   - **argv:** Claude, Cursor, Devin, Pi and OpenCode. OpenCode also passes `input: ''`, which is why the gen3 preview showed `stdin: "<input>"` beside an argv digest.
   - **stdin:** Codex and dsh (`-`).
   - **a file:** Vibe (`--prompt-file`).
   - A 46 KB prompt in argv is visible to `ps`.
   - [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2703-2704] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2784-2790] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3360] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md:56-57]
   - **Change:** each adapter returns `promptChannel: 'argv'|'stdin'|'file'`, and the preview prints it. Prefer stdin wherever the CLI accepts it.
   - Value M, effort S, risk L.
3. **An unset effort means three different things.**
   - **Codex** fills in `medium` when none was asked for. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2664]
   - **Claude** omits the flag. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2712-2714]
   - **OpenCode and Pi** pin Flash models to `max`, and Pi throws on a value it has no `--thinking` mapping for. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2766] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3175-3183]
   - **Cursor** bakes effort into the model id. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2906-2911]
   - **Devin** has no effort at all. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3043-3046]
   - **Change:** the contract says that an unset effort is never invented. Drop Codex's `'medium'` default, and report `effortApplied: flag|baked|pinned|none` per lineage. The `effortApplied` field already exists in `effective_config` (row 9 built).
   - Value M, effort S, risk L.
4. **Session resume is uniform, because no adapter resumes a CLI session.**
   - No builder passes `--resume`, `--session` or `--continue`. Every attempt is a fresh CLI session, and resume happens through the workflow's state files.
   - That uniformity should become a contract clause and a test, so that no future adapter adds a CLI-level resume that would carry over a stamped context.
   - [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2658-3600] [INFERENCE: based on a grep for resume, session and continue flags with no adapter hit]
   - Value L-M, effort S, risk L.
5. **Row 13 (one executor path) is half built already, and the unbuilt half still drifts.**
   - `runLineageBuiltin` already routes Cursor, Devin and Pi through `buildLineageCommand`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:414-478]
   - Claude and Codex keep hand-built twins: `buildClaudeInvocation`, and `runCodex`'s own `exec` args. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:368-382] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:921-930]
   - Live drift: the fan-out Codex builder adds `--search` when `webSearch` is `live`, while `runCodex` never does. A single-executor Codex run therefore cannot search the web under the same config. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2666-2668]
   - **Change:** route `runClaude` and `runCodex` through `runLineageBuiltin`. Keep Claude's config-dir env, and delete the two twins.
   - Value H, effort S-M, risk M.
6. **The single adapter contract, with one conformance test.**
   - Each `LINEAGE_COMMAND_ADAPTERS` entry returns:
     - `{command, args, promptChannel, logFormat}`;
     - `effective: {permission, sandboxEnforcement, effortApplied, webSearch}`;
     - `parseLog(stdout) → {events:[{t, tool, target}], costUsd, finalText}`;
     - `classifyFailure(stderr, stdout) → {failure_class, retryable}`.
   - **Test:** one table-driven conformance test iterates the keys of `LINEAGE_COMMAND_ADAPTERS`. It fails when a kind lacks a field or a fixture log, and checks that each fixture parses to non-empty `finalText` and, for event logs, to timestamped events.
   - This is the Inspect `ModelAPI` shape from iteration 3, finding 6, applied to this runner. `fanout-salvage.cjs`'s `extractTextFromOpencodeJson` and `sumProviderCostFromLog` would become OpenCode's `parseLog`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:41-96] [SOURCE: https://inspect.aisi.org.uk/extensions-model-api.html]
   - Value H, effort M, risk M.
7. **Agent mirrors cannot affect a fan-out lineage. Only the roster is checked, not the bodies.**
   - The roster check reports every runtime complete: OK across claude, codex, opencode, pi, dsh and vibe, with cursor and devin as symlinks. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs]
   - The `.claude` `deep-research` body differs from `.skilled` only in the Path Convention line. [SOURCE: .claude/agents/deep-research.md:11]
   - The fan-out inlines the canonical `.skilled/agents/<name>.md` persona into every lineage prompt, whatever the runtime, so mirror drift reaches only native single-executor runs. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:175-196]
   - **Change:** extend the mirror check to compare bodies, ignoring the Path Convention line and format-specific frontmatter. Body drift would then fail instead of passing as "present".
   - Value M, effort S, risk L.

## Questions Answered
- **F-2-006:** today only OpenCode (and dsh's `--json`) expose timestamped tool events. Claude, Codex and Cursor have JSON stream modes to switch to. Pi and Devin need confirmation.

## Questions Remaining
- None in this lineage's frontier share. Every node is now addressed.

## Ruled Out
- **Mirrors as a source of fan-out divergence:** the persona is inlined from `.skilled` (finding 7).

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: Q2 is a topic question. I answered it through F-2-006's adapter walk, not as a separate node.
- Contradictory evidence: none.
- Missing dependencies: the Codex, Cursor, Pi and Devin JSON flags are not verified locally, because running those CLIs is out of this lineage's remit. They are marked as inference.
- Partial success: none.

## Sources Consulted
- `runtime/scripts/fanout-run.cjs`: 175-196, 2658-2725, 2757-2790, 2895-2935, 3032-3070, 3146-3190, 3286-3360, 3495-3600, 3610-3633
- `runtime/scripts/dispatch-iteration.cjs`: 360-480, 881-1000
- `runtime/scripts/fanout-salvage.cjs`: 41-96
- `.claude/agents/deep-research.md` against `.skilled/agents/deep-research.md`; `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` (run read-only, STATUS=OK)

## Assessment
- New information ratio: 0.79
- Questions addressed: F-2-006 (and Q2 by extension)
- Questions answered: F-2-006

## Reflection
- **What worked:** walking the adapter table one row at a time. The differences came out as a table, not as anecdotes.
- **What did not work:** none of the five text-log kinds could be confirmed to have a JSON mode without running their CLIs.
- **What I would do differently:** first write fixture logs from one real run per kind. The conformance test needs them anyway.

## Recommended Next Focus
Every node in this lineage's share is answered. The next step is synthesis: rank all the recommendations by value over effort.
