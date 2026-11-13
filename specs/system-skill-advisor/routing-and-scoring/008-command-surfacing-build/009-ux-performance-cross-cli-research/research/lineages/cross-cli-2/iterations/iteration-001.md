# Iteration 1: Which runtime loses the Gate 2 policy before the model sees it

## Focus

Q1 of the cross-cli-2 lane: identify, per runtime, the single file that decides whether the Gate 2 policy and the advisor brief reach the model, and separate a delivery hole from a model refusal. The narrowest reading was chosen: the lane asks *where delivery stops*, not *how often the router offers a command* (offer-reach lane) and not *what the brief says* (ux-cost-2 lane). Two runtimes were investigated because they are the only ones whose delivery input is a file this repository owns: Claude's instruction file and Codex's hook approval. The other four are deferred to iteration 2.

## Findings

1. **The default external install deletes the only instruction file Claude Code reads.** `agents-md-embed.cjs` lists `CLAUDE.md` under `FOLDED_COPIES`, folds its unique lines into the `AGENTS.md` block, and removes the file unless `--keep-claude-md` is given; `--remove-claude-md` is documented as "the default". The install guide's step 2 runs `/doctor:agents-md embed --root <dir>` on the default path, and only the optional `link` shape keeps a `CLAUDE.md`. [SOURCE: .skilled/commands/doctor/scripts/agents-md-embed.cjs:92] [SOURCE: .skilled/commands/doctor/scripts/agents-md-embed.cjs:101] [SOURCE: .skilled/commands/doctor/scripts/agents-md-embed.cjs:111] [SOURCE: .skilled/commands/doctor/scripts/agents-md-embed.cjs:746] [SOURCE: INSTALL-SKILLED.md:146]

2. **The project's own check engine already states the consequence.** When `AGENTS.md` is absent and `CLAUDE.md` exists, the install-state row reports `claude-only` with the line "CLAUDE.md is the only instruction file"; when both are absent it reports `absent`. That is the same fact the after arm measured from the other side: a project installed with `embed` ends with `AGENTS.md` and no `CLAUDE.md`, so Claude Code has no project instruction file at all. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217] [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:224]

3. **This repository has no root `CLAUDE.md`, and only the Claude arena was given one.** `ls CLAUDE.md` at the repository root reports "No such file or directory". In `$TMPDIR/skilled-behaviour-arenas/`, `post-claude/CLAUDE.md` is the single file whose content is `@AGENTS.md` (11 bytes), created at 02:53:06; the other five `post-*` arenas hold `AGENTS.md` only. The g2 arm ran at 04:13:06, so its Claude rows are the first rows in this packet whose prompt could load the Gate 2 bullet through a project instruction file. [SOURCE: /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/skilled-behaviour-arenas/post-claude/CLAUDE.md:1] [INFERENCE: file listing plus the CLAUDE.md and runs-g2.jsonl modification times]

4. **With the bullet reachable, Claude still started 0 of 6 g2 rows, while Pi started 4 of 6.** Scoring `runs-g2.jsonl` gives Claude `start 0 of 6`, `COMMAND: line 0 of 6`, and 2 writes on `start` rows; Pi gives `start 4 of 6`, `COMMAND: line 3 of 6`, and 3 writes, with 2 of 5 loop rows started without init. The same six row ids (`g2-deep-research-*`, `g2-deep-review-*`, `g2-speckit-complete-*`) ran on both. The Claude rows record `briefDelivered: true` from the raw transcript, so the brief itself arrived. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-g2.jsonl] [INFERENCE: `score-command-transcripts.mjs --summary runs-g2.jsonl` output read in this iteration]

5. **Codex's approval key is path- and entry-specific, and the runner inherits the operator's Codex home unchanged.** The check builds the key `<root>/.codex/hooks.json:user_prompt_submit:<group>:<index>` and looks for `[hooks.state."<key>"]` with a `trusted_hash` in `$CODEX_HOME/config.toml` (default `~/.codex/config.toml`). `run-command-behaviour.mjs` copies `process.env` and deletes only GitHub tokens, so the child Codex process reads the operator's real Codex home and the arena's own path must be approved interactively. [SOURCE: .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:80] [SOURCE: .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:123] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:814]

6. **The Codex arm reports an offer the model never received.** `offered` is computed from `offeredCommand` on the run line, and that field is written by replaying the Claude prompt hook inside the checkout — not by reading what the runtime delivered. The after arm's Codex rows therefore read `offered 2`, `started 0 of 2`, which reads as two refusals although `briefDelivered` is `unknown` for all 24 and the goal log records 0 of 24 delivered. The summary has no state that means "offered but unreachable". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1079] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl]

7. **Delivery is provable for 24 of the after arm's 144 rows, all Claude.** In `runs-post-final.jsonl`, `briefDelivered` is `true` 24 times (Claude) and `unknown` 120 times (codex 24, devin 24, pi 24, opencode 24, dsh 24). Pi has a branch in `command-offer.mjs` and a reader that keeps session records, yet its 24 committed rows still read `unknown`, so the committed log was produced without the Pi probe succeeding. The delivery counts quoted in the goal log for devin, dsh and pi come from one-off probes, not from a field in the committed log. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:162]

## Ruled Out

- **"Add a project `CLAUDE.md` and the Claude start rate rises."** The g2 arm had the pointer and still started 0 of 6, so the file fix is necessary for reach but not sufficient for a start. Rejected as a start-rate claim.
- **"Codex declined two offered commands."** The two `offered` rows come from replaying the hook in the checkout; the model received no brief. Rejected as a model behaviour claim.
- **"Pi delivery is already proven in the committed arm."** The committed rows say `unknown`; only an out-of-band probe says otherwise. Rejected as committed evidence.

## Dead Ends

- Reading the Codex `trusted_hash` value to derive it. The check deliberately keeps the hash out of output, and pre-seeding it would defeat the product's approval control. The operator step stays the only lawful path; the recommendation must make the arm *honest*, not bypass the control.
- Treating `offeredCommand` as delivered. It is a replay artifact. Any rate built on it without `briefDelivered` overstates reach.

## Edge Cases

- **Contradictory evidence:** the goal log expects the Gate 2 bullet to matter for Claude, and the g2 arm cannot show it on 6 rows (0 of 6 starts). Both claims are cited; the bullet's value is left as "reach restored, effect unmeasured", not as a gain.
- **Missing dependency:** no operator is present to approve Codex hooks and no model CLI may be started, so the Codex delivery probe can only be verified by a fixture, not by a live run.
- **Partial success:** none. All seven findings are cited.

## Sources Consulted

- `.skilled/commands/doctor/scripts/agents-md-embed.cjs`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs`
- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs`
- `INSTALL-SKILLED.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-g2.jsonl`
- `$TMPDIR/skilled-behaviour-arenas/post-claude/CLAUDE.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`

## Assessment

- New information ratio: 0.80
- Questions addressed: Q1 (Gate 2 reach per runtime)
- Questions answered: Q1

## Reflection

- What worked and why: reading the installer and the check engine together turned a vague "Claude does not see AGENTS.md" into a named default that deletes the file. Reading the arena files rather than trusting the goal log's "rerun queued" showed the rerun had already happened and its result was negative.
- What did not work and why: the Codex approval hash cannot be derived without defeating a product control, so the Codex path stays blocked at the operator and the honest output is a measurement fix, not a delivery fix.
- What I would do differently: read the run line's provenance (`offeredCommand` comes from replay) before reading any rate. That one check changes what "offered 2" means for every runtime.

## Recommended Next Focus

Q2: prove delivery for devin, dsh, opencode and pi from a record the runtime writes, and name the exact field to add at hook time. Start with the readers' drop rules (`devin.mjs` skips unflagged user rows; `dsh.mjs` skips non-operator sources) and the opencode plugin's missing marker.
