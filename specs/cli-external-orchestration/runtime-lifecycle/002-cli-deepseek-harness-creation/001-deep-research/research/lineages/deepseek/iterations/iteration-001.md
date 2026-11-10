# Iteration 1: Headless dispatch contract

## Focus

Angle 1 of the ten-angle plan: what `dsh headless` accepts, emits and returns, and how that
contract compares with `pi -p` and the six other headless runtimes this repo already dispatches.
The goal is the exact command builder shape a `cli-deepseek` mode would emit, not a summary of the
harness.

## Actions Taken

- Read the generated CLI reference (`dsh-src/docs/cli-help.md`) and ran the read-only
  `dsh headless --help` against the installed `0.2.2-rc.1`.
- Read the headless bundle's own README, its `cordis.patch.yml` and its exit-mapping section.
- Ran one permitted live smoke dispatch with `DSH_HOME` pointed inside the lineage directory, so
  no write reached the operator's home. `dsh headless "Reply with the single word OK" </dev/null`.
- Compared against `cli-pi`'s recorded CLI reference and the headless invocations named in the
  other runtime packets.

## Findings

1. `dsh headless` takes the task as the positional argument (multiple words joined, `-` reads
   stdin) and exposes exactly five real options: `--json`, `--session-id <id>`,
   `--permission-mode <preset>`, `--approval-policy <ask|never>`, `--add-dir <path>` (repeatable),
   plus `--help`. There is no `--model`, `--provider`, `--reasoning-effort`, `--cwd`, `--timeout`
   or tool-allowlist flag. [SOURCE: dsh-src/docs/cli-help.md:100-132]
2. The route, model and reasoning level are profile configuration, not dispatch flags: the runner
   "resolves the task and the shared `agentDefaultModel` selection", and an adopted session
   restores its saved route/effort unless the current deployment re-records it. Reasoning effort
   is a model-catalog field (`reasoningEfforts`, or `effort` on a native route) and is saved by
   `agentDefaultModel.saveSelection({ provider, model, reasoningEffort })`.
   [SOURCE: dsh-src/packages/bundle/headless/README.md:128]
   [SOURCE: dsh-src/packages/core/agent-default-model/README.md:53-54]
   [SOURCE: dsh-src/docs/config-catalog.md:2102-2108]
3. Working directory is the process cwd: the headless sandbox row sets
   `workspaceRoot: process.cwd()` and `mode: process.env.DSH_PERMISSION_MODE ?? 'workspace-write'`.
   A dispatch changes directory by changing the child process cwd, not by a flag.
   [SOURCE: dsh-src/packages/bundle/headless/cordis.patch.yml:27-33]
4. stdout carries only the final assistant answer (or the NDJSON `--json` stream); stderr carries
   `dsh: reasoning:` deltas and `dsh: <code>: <message>` diagnostics. In `--json`, the stream is
   `session` first, then `status`, `text`, `thinking`, `tool_call`, `tool_result`, and `final`
   last; every non-final string is capped at 8 KiB and a line at 32 KiB, with `truncated` flags.
   [SOURCE: dsh-src/packages/bundle/headless/README.md:36]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:104]
5. Exit status is a two-value contract: `0` only when the last turn ends `completed`; `1` for
   aborted, error, no turn in the owned interval, usage errors, or an unusable `--session-id`.
   A failing provider is not a distinct code. The trustworthy completion signal is the pair
   "process exit 0 AND `final.reason.kind === 'completed'`", and the JSON `tool_result.error`
   preserves the typed `{name, code}` that separates a policy denial (`AUTO_REVIEW_DENIED`) from a
   reviewer failure. [SOURCE: dsh-src/packages/bundle/headless/README.md:12]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:94]
   [SOURCE: dsh-src/packages/bundle/headless/README.md:136]
6. Live smoke on the installed package confirms the failure shape: exit 1, empty stdout, stderr
   `dsh: MISSING_CREDENTIAL: llm-deepseek: no API key for provider route "deepseek-official";
   store DEEPSEEK_API_KEY through the credentials service ... or export DEEPSEEK_API_KEY`.
   The same run initialized `$DSH_HOME/profiles/headless` from the shipped template and created a
   session directory, so first boot needs no `pnpm install` and no manual profile creation.
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.events/smoke-1.stderr]
7. Headless disables the managed credential store, `authorization` and `deepseek-account` rows.
   API keys are read from the launch environment, then `<invocation cwd>/.env`, then
   `$DSH_HOME/.env`; GUI-saved keys are ignored without modifying their file. This is the opposite
   of `pi`'s stored-agent-directory model and means a repo-local `.env` is a viable, documented
   key path for a `cli-deepseek` dispatch without touching `$DSH_HOME`. [SOURCE: dsh-src/packages/bundle/headless/README.md:56]
8. Compared with `pi -p`, the harness moves every per-dispatch lever into configuration: Pi takes
   `--provider`, `--model`, `--thinking`, `--tools`, `--skill`, `--session`, `--no-context-files`
   on the command line, while `dsh headless` takes only permission and session identity. A faithful
   `cli-pi` mirror therefore needs a repo-local profile overlay that pins the model roster and a
   dispatch builder that passes the prompt on stdin and closes it, not a long flag string.
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:94-96]
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:112-134]

## Ruled Out

- Treating exit `1` as a provider-auth signal: the contract collapses aborts, denials, timeouts and
  missing credentials into one code. Classification must read the `dsh: <code>:` stderr line or the
  JSON event stream.
- Adding a `--model` flag to a hoped-for dispatch builder: the installed help has no such option.

## Dead Ends

- Probing a successful dispatch: no provider key exists on this machine, and creating one is out of
  bounds. The failure contract is the deliverable, not a passing reply.

## Edge Cases

- Ambiguous input: none; Angle 1 names the exact commands.
- Contradictory evidence: none; the generated help, the installed live help and the bundle README
  agree.
- Missing dependencies: no provider credential (expected, recorded as the failure shape).
- Partial success: the smoke reaches the provider boundary, so boot, task parsing, profile
  initialization and credential failure are all observed, but no successful turn is.

## Sources Consulted

- `dsh-src/docs/cli-help.md:100-132`
- `dsh-src/packages/bundle/headless/README.md:12,36,46,56,94,104,128,136,190`
- `dsh-src/packages/bundle/headless/cordis.patch.yml:27-33`
- `dsh-src/packages/core/agent-default-model/README.md:53-54`
- `dsh-src/docs/config-catalog.md:2102-2108`
- Live `dsh headless --help` on 0.2.2-rc.1, exit 0
- Live `dsh headless "Reply with the single word OK"` smoke, exit 1, stderr quoted above
- `.skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:94-134`

## Assessment

- New information ratio: 0.87 (six fully new findings, two partially new against the resource map's
  already-known launcher shape)
- Questions addressed: Angle 1 headless contract and runtime comparison
- Questions answered: What exactly does `dsh headless` accept, emit and return, and how does it compare with `pi -p` and the other seven runtimes' headless contracts?

## Reflection

- What worked and why: the generated `docs/cli-help.md` is authoritative and version-matched, and
  the bundle README documents the exit mapping that the help omits. Pointing `DSH_HOME` inside the
  lineage made a live failure observable without touching the operator's home.
- What did not work and why: macOS has no `timeout`, so the first smoke attempt failed with exit
  127 before the harness ran; the retry used `perl -e 'alarm 120; exec @ARGV'`.
- What I would do differently: run the smoke before reading the README, so the failure text can
  validate the documented mapping rather than illustrate it.

## Recommended Next Focus

Angle 2: providers, models and reasoning levels, including whether the LLM Gateway and OpenCode Go
can be expressed as custom OpenAI-compatible routes and what a closed roster would look like.
