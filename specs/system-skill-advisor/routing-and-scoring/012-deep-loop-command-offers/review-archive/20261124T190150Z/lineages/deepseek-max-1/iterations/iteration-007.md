# Iteration 007 - Security (trust boundaries and prompt-as-data)

## Dispatcher

- Mode: review, lineage `deepseek-max-1`, generation 1, iteration 7 of 7 (the `max-iterations` cap).
- Dimension: security - the gate's only trust boundary is the raw prompt string the hook passes on every keystroke-sized event; this iteration tests how that string is handled, what the processes it reaches can do with it, and whether a deep command can start on its own.
- Operator review focus: this is the last configured dimension; the operator focus (traceability) is satisfied in the record and re-checked here only as far as the security surface carries identifiers.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (`eval`/`Function`/`child_process` search; `MODE_COMMANDS`, `COMMAND_ROWS`, `TRACKED_COMMANDS` policy rows at `:71`, `:72`, `:79`, `:109`, `:110`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `lib/scorer/fusion.ts`, `lib/subprocess.ts:283` (`spawn(args.command, args.commandArgs, ...)`), `skill-advisor-cli.ts`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:9`, `:233`, `:256`, `:276`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:43`, `:519`, `:666`
- `.skilled/skills/system-deep-loop/command-metadata.json:9` and `:57` (`ask_first: ["spend"]` on both deep commands)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257`, `:262` (10,000-unit input cap)
- Lineage scratch probe: `.../lineages/deepseek-max-1/.executor-state/security-probe.mjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. No injection path, no unbounded evaluation, no secret exposure and no self-starting command was found in the reviewed surfaces.

## Traceability Checks

Not re-run; both core protocols are recorded from iterations 2 and 4. This iteration's job was the security property, and it changes no recorded status.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283` spawns `args.command` with an argument array and no `shell: true`, so a prompt never reaches a shell.
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:233` slices the prompt to `ADVISOR_PROMPT_MAX_CHARS` before dispatch and `:276` carries it on stdin rather than in an argument, which is the two-layer bound on prompt length.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:43` and `:519` state and implement the prompt-boundary guard: the renderer never reads prompt text, so a prompt cannot write into the injected brief.
- `.skilled/skills/system-deep-loop/command-metadata.json:9` and `:57` derive `ask_first: ["spend"]` for both deep commands, matching NFR-S01.

## Security Checks Performed

| Check | Result |
|---|---|
| Dynamic evaluation in the gate, scorer or subprocess wrapper | None: the only `exec` hits are `RegExp.prototype.exec` (`command-attach.ts:826`, `:844`, `:1202`, `:1395`, `fusion.ts:803`) |
| Shell interpretation of the prompt | None: `spawn` with an argv array and no `shell` option; the hook sends the prompt on stdin |
| Secret material in the changed runtime files | None: `api[_-]?key|secret|token=|password|BEGIN RSA` prints nothing across the six changed files |
| Command policy | `/deep:research` and `/deep:review` are `policy: 'ask'` in every table row (`:71`, `:72`, `:109`, `:110`); `/doctor:deep-loop` is `run` with `mutating: 'add-only'` (`:79`), which is the only command the packet lets run |
| Prompt-boundary injection into the brief | `render.ts` never reads prompt text; the fallback brief path slices and forwards on stdin |
| Unbounded work on attacker-controlled length | Seven pathological inputs through the built module: 10k single letter 7.5 ms, 10k repeated `deep ` 0.4 ms, 10k repeated `not ` 0.6 ms, 10k repeated `skip ` 0.3 ms, 10k nested clauses 8.5 ms, 10k refusal tail 0.3 ms, 96k prompt 5.1 ms. No catastrophic backtracking observed and no input threw |

## Edge Cases

- **A refusal far from the loop name is out of reach by design.** The 10k refusal-tail probe served `/deep:review` because the refusal sits more than `LEAD_WINDOW` (400) characters before the loop name. That is the designed bound the packet states, not a bypass: the fixture's 10,000-character repeated-refusal case is the guard for the in-window shape, and it holds.
- **A 96k prompt reaches `attachCommand` only through a path that already capped it.** The tool schema caps at `ADVISOR_PROMPT_MAX_CHARS` (`advisor-tool-schemas.ts:262`) and the hook slices at the same constant, so the 96k probe measured a shape the production entry points do not deliver; it returned quickly in any case.
- **The packet's own history names one private skill id** (`local-webflow`) in a task cell as a probe artefact. It is a name, not a credential, and it was recorded by an earlier round; no finding is raised.

## Confirmed-Clean Surfaces

- The gate's own code: no dynamic evaluation, no shell, no filesystem write on the attach path.
- The doctor command's `run` policy applies to a diagnosis whose declared mutation is `add-only`, and it is withheld whenever the prompt refuses a run or fix (iteration 5).
- The 10,000-unit input cap is enforced in the schema and mirrored in the hook's slice.

## Ruled Out

- "A prompt can be interpreted by a shell": the spawn shape is argv-only and the prompt travels on stdin.
- "The renderer can be steered by prompt text": it declares and implements that it never reads it.
- "A deep command can start without the operator": both deep rows are `ask`, and the `run` row is the diagnosis only.

## SCOPE VIOLATIONS

None. No file outside the lineage was written by any probe; the two probe scripts live under the lineage's `.executor-state/` and write nothing themselves.

## Next Focus

- Dimension: none remaining - all four configured dimensions have a full iteration (traceability 1 to 4, correctness 5, maintainability 6, security 7).
- Focus: synthesis, with the `max-iterations` stop reason the run was dispatched under.
- Reason: the cap is reached at 7 iterations and every configured dimension is covered.
- Rotation status: complete for this lineage.

Review verdict: PASS
