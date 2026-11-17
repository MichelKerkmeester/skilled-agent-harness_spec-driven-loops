# Iteration 1: Which plain tune rows still get no command after phase 012, and why

## Focus

Question (a) of the lane: enumerate, from the built state at `HEAD` `320e7b64d4`, every plain tune row of `command-prompts.jsonl` that still renders no command in the advisor brief, and name the cause per row id. The committed capture was read first, then the live recommend path was called once per tune row so the answer describes the brief the model receives rather than a bridge-row tally.

## Actions Taken

1. Read the committed capture's per-row state (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`, `attachedMetrics.plain.tune` = own 8, attached 15, combined 23, total 45) and its `rows[*].offered` construction at `capture-command-routing-baseline.mjs:491`.
2. Ran `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<tune prompt>"}' --format json` for all 45 tune rows under `env -u AI_SESSION_CHILD`, recording the top three recommendations, `command`, `policy`, `needsMode` and route action into `prompts/tune-live.jsonl`.
3. Ran `node .skilled/bin/compiled-route.cjs --hub <hub> --prompt-stdin` for the five rows whose top carried a route and no command, to read `action`, `selectionKind` and `targets[].workflowMode`.
4. Read `lib/command-attach.ts` (`MODE_COMMANDS`, `attachCommand`, `routeNeedsMode`), `handlers/advisor-recommend.ts` (`enrichCompiledRoutes`), and `lib/render.ts` (recommendation filter, single head, `Also:` line).
5. Confirmed the advisor build is fresh: `checkPackageFreshness('system-skill-advisor/runtime')` printed `{"status":"fresh"}`.

## Findings

1. At `HEAD` `320e7b64d4`, 27 of 45 plain tune rows render a command on the brief head, 1 more renders it only through the `Also:` doctor line, and 17 render no command at all. Head commands are counted from the live recommend output; the renderer prints one head, so a command on rank 2 is not shown unless that rank is a doctor bridge. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:533]

2. Every one of the 27 head commands is the expected command's family. 21 are the exact corpus label and 6 name a subcommand the corpus omits: `/doctor:agents-md check`, `/doctor:ci report`, `/doctor:env list`, `/doctor:git hooks`, `/doctor:overlay status`, `/doctor:symlink link`. There is no wrong-command offer on the plain tune split, so the remaining defect is recall, not precision. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl]

3. The committed capture's `offered` flag does not mean "a command was offered". It is true when one of the top three scorer row ids maps to a command bridge, whatever the brief prints, so it disagrees with the live head on six tune rows and cannot answer this question on its own. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491]

4. Cause 1, duplicate suppression, 1 row: `cmd-create-agent-plain-tune-01` routes `sk-doc` single to `sk-create-agent`, but the `create:agent` row already ranks second carrying `/create:agent`; `enrichCompiledRoutes` withholds a hub command that already ranks, and the single-head renderer then shows neither. The command is present in the result and absent from the brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:451] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:533]

5. Cause 2, routed mode with no command, 2 rows: `cmd-create-readme-plain-tune-01` and `cmd-create-with-human-voice-plain-tune-01` both route `sk-doc` single to workflow mode `sk-create-quality-control`, which is absent from `MODE_COMMANDS`; one mode cannot name two commands anyway, so the table cannot fix this and the hub alias must. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:21]

6. Cause 3, needs-mode label, 4 rows: `cmd-create-repo-rule-plain-tune-01`, `cmd-doctor-sk-skill-plain-tune-01`, `cmd-speckit-complete-plain-tune-01` and `cmd-speckit-save-plain-tune-01` top `sk-doc` with `action: defer` and print `use sk-doc (needs a mode)`. This is phase 012 wave C working as built; the row is told to ask for a mode, not given a command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:392]

7. Cause 4, deferring or routing hub outside `MODE_COMMANDS`, 2 rows: `cmd-speckit-implement-plain-tune-01` tops `sk-code` with `action: defer` and `needsMode` null, and `cmd-doctor-sk-code-plain-tune-01` tops `sk-code` routing to `sk-code-quality` with no command. `routeNeedsMode` returns true only for a hub in `MODE_COMMANDS`, and `sk-code` has no row, so both are silent. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:392]

8. Cause 5, no recommendation returned, 6 rows: `cmd-create-skill-parent-plain-tune-01`, `cmd-doctor-install-plain-tune-01`, `cmd-doctor-setup-plain-tune-01`, `cmd-doctor-speckit-plain-tune-01`, `cmd-doctor-update-plain-tune-01` and `cmd-speckit-search-plain-tune-01` return zero recommendations, so the brief emits nothing. Five of the six commands have `scorerRow: true` in `TRACKED_COMMANDS`, so their row exists and scored below threshold; `create:skill-parent` has no scorer row. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:189]

9. Cause 6, top skill carries no command and no route, 2 rows: `cmd-doctor-mcp-plain-tune-01` tops `mcp-code-mode` at 0.692 with no route, and `cmd-doctor-skill-advisor-plain-tune-01` tops `system-skill-advisor` at 0.556 with no route although `/doctor:skill-advisor` has seven subcommands. Both are wrong-top rows: the doctor command row is not the top. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl]

10. The 17 no-command rows are the whole remaining plain gap in brief terms: 27 head + 1 Also line + 17 none = 45. Fixing every cause above would take plain tune head reach from 27 to 45, but the causes differ in cost and risk, so they are ranked separately below. [INFERENCE: based on the per-row table in `prompts/tune-live.jsonl` and the renderer's single-head rule]

## Ruled Out

- Reading the committed `attachedMetrics.plain.tune` line as a brief-offer count. It measures expected-command reach through scorer row ids and hub attach at capture time; the live head disagrees on six rows, so it cannot enumerate the rows this iteration asks about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491]
- Treating the six subcommand differences as wrong offers. All six are the expected command's own documented subcommand, so they are label granularity in the corpus, not a routing error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74]
- Counting the whole top three as "offered". The renderer emits one head plus an optional doctor `Also:` line, so a rank-2 command is invisible in 16 of the 17 no-command rows.

## Dead Ends

- `cmd-create-skill-parent-plain-tune-01`: no scorer row and no hub route, so no command can attach without new evidence; it is an alias or scorer-row question, not a table edit.
- `cmd-doctor-skill-advisor-plain-tune-01`: the command has seven subcommands and no default, so no single command can be attached without a policy decision about which subcommand a bare request means.

## Edge Cases

- Ambiguous input: "no command" could mean no command on the top recommendation or no expected-command match. Both are measured: 17 rows have no command anywhere in the brief, 18 have no command on the head, and 24 miss the exact expected label. The narrow reading (no command in the brief) is reported as the answer.
- Contradictory evidence: the committed capture says 23 of 45 combined while the live head says 27 of 45 carry a command. Both are true under their own definitions; finding 3 records the difference and the committed line is not reused as an offer count.
- Missing dependencies: none. The advisor CLI answered all 45 rows and the build is fresh.
- Partial success: none; every planned measurement ran.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl` (45 live recommendations)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (tune rows only; holdout prompt text never read)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:15`, `:21`, `:189`, `:392`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:451`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:533`, `:550`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md`

## Assessment

- New information ratio: 0.85
- Questions addressed: which plain tune rows still get no command after phase 012, and why, by row id
- Questions answered: Which plain tune rows of command-prompts.jsonl still get no command after phase 012, and what is the cause per row id?

## Reflection

- What worked and why: calling the live recommend path per row turned a misleading aggregate into a per-row cause table, and reading the renderer explained why one of those rows still loses its command despite the route resolving correctly.
- What did not work and why: the committed capture's `offered` field looked like the answer and is not, because it counts bridge-row reach rather than the rendered head; the first pass classified rows by `offered` and had to be redone.
- What I would do differently: read the render path before trusting any capture field whose name suggests a user-visible outcome.

## Recommended Next Focus

Question (b): intent-signal enrichment and re-embedding of the skill graph, declined in segment two at rank 15. Read the segment-two disposition first, then measure what the real embedder changes on the tune split (only if an Ollama server is already answering), and price the vector/metadata drift.

Candidate fix ranking carried to synthesis (each needs a file, a measured gain and a floor risk before it is a recommendation):

1. `sk-doc` hub aliases for a readme and a human-voice request so each routes to its own mode (`sk-create-readme`, `sk-create-with-human-voice`), +2 rows, risk is canary movement only.
2. Plain anchors for the five below-threshold doctor/speckit rows, up to +5 rows, risk is the false-offer floor.
3. An `sk-code` mode→command row plus `needsMode` eligibility, +2 rows, risk is a new command being offered on a deferring hub.
4. Drop the duplicate suppression or render a second head, +1 row, risk is brief bytes on every prompt.
5. A default subcommand for `/doctor:skill-advisor` and a stronger mcp cue, +2 rows, risk is a wrong subcommand on a mutating command.
