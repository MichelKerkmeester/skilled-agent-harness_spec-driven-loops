# Iteration 4: Ranked changes for delivery, proof and obedience

## Focus

Q5 of the lane: rank the cross-cli-2 changes by expected started-when-useful per unit of risk, name the file each one changes, state its effect on the three floors, and carry the negative results forward so no delivery fix is sold as a start-rate or safety gain. Two new checks were run first: whether the Claude `@AGENTS.md` pointer actually loaded, and whether the Gate 2 bullet's own `COMMAND:` format has a state the scorer throws away.

## Findings

1. **The Claude pointer works, and the bullet still did not produce a start.** The g2 Claude transcript contains the worktree-unique Gate 2 line "**Command in the brief.** … never an improvised one" and the `COMMAND: [/name] → [started|offered|declined]` format, neither of which exists in the global `~/.claude/CLAUDE.md` (27,173 bytes; the arena `AGENTS.md` is 27,575). So `@AGENTS.md` resolved and the bullet was in the prompt. The same arm started 0 of 6. The instruction-file fix therefore restores policy reach; it is not a measured start lever. [SOURCE: /Users/michelkerkmeester/.claude/projects/-private-var-folders-3c-zfqcqsts0kn19cgblj82gqhm0000gn-T-skilled-behaviour-arenas-post-claude/5e8cf2c1-d314-46db-a861-f38c71ddce6a.jsonl] [INFERENCE: the unique bullet and `never an improvised one` occur in the transcript and not in the global file, whose sizes and hashes differ]

2. **The check engine's own comment contradicts the measured behaviour.** `agents-md-check.cjs` says "Claude reads the root document directly, so a full CLAUDE.md double-loads and drifts". The transcript shows the root document was read *through* the 11-byte `CLAUDE.md` pointer; the default `embed` path removes that pointer, so a project installed that way has no route to the root document at all. The comment should say "through CLAUDE.md", and the default should leave the pointer. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:628] [SOURCE: .skilled/commands/doctor/scripts/agents-md-embed.cjs:111]

3. **The Gate 2 bullet already asks for a decision line, and the scorer discards two of its three states.** The bullet's format is `COMMAND: [/name] → [started|offered|declined]`. The scorer counts every `COMMAND:` line in the summary but only `state === 'started'` counts as a start, so an `offered` or `declined` line — the only model-authored proof that an offer was seen and refused — is dropped. Parsing those states into an `offerSeen` field separates "seen and declined" from "never delivered" at zero brief cost. [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:611]

4. **Ranked changes.** Ordered by expected started-when-useful (or silent failure removed) per unit of risk. Floors named in the parent goal are typed recall 24 of 44, false offers 0 of 35, and the scorer floor `[159,50,20,5]`.

| # | Change | File(s) | Gain | Verify | Floor risk |
|---|---|---|---|---|---|
| 1 | Make delivery a stored fact and gate the offer on it: add `injected` to the load result (Pi `custom_message`, Devin unflagged/system rows, DSH non-operator user messages), read it in `briefDelivered`, answer `false` for Codex when the entry is registered and unapproved, and count an offer only when delivery is not `false` (`offerReached`) | `.skilled/hooks/shared/session-readers/{pi,devin,dsh,codex}.mjs`, `.skilled/hooks/shared/session-readers/index.mjs`, `runtime/scripts/routing-accuracy/command-offer.mjs`, `runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 120 of 144 after-arm rows move from `unknown` to `true`/`false`; Codex's two replayed offers stop reading as refusals; every later arm can separate "never offered" from "declined" | Reader fixture per runtime asserts `injected` carries a synthetic brief while `records` is unchanged; `node run-command-behaviour.mjs --backfill runs-post-final.jsonl --out runs-post-attributed.jsonl` then `score-command-transcripts.mjs --summary` prints 0 unknown and Codex `startedOfOffered 0 of 0` with `offerUnreachable 2` | None: no routing or scoring input changes; typed recall and false offers untouched |
| 2 | Leave a Claude pointer on the default install: `embed` writes an 11-byte `@AGENTS.md` `CLAUDE.md` when absent (or defaults to `--keep-claude-md`), and the install guide's step 2 says so | `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `INSTALL-SKILLED.md` | Every external `embed` install regains the whole policy layer on Claude, including Gate 2; today the default deletes the only file Claude reads. Measured start gain: 0 on 6 g2 rows, so sell it as reach and safety, not starts | `agents-md-embed.cjs plan --root <fixture with AGENTS.md and no CLAUDE.md>` lists a `CLAUDE.md` pointer write; `agents-md-check.cjs --root <fixture>` reports A10 `pointer` with no finding; the g2 transcript already proves the pointer's text reaches the model | None on the three floors; the head-byte guard is untouched |
| 3 | Stop an unapproved Codex arm from producing behaviour-shaped zeros: preflight `codex-hook-approval-check.cjs` at arm open, and either fail the arm with a named precondition or mark Codex `notMeasurable` and exclude it from the aggregate | `runtime/scripts/routing-accuracy/run-command-behaviour.mjs`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Removes a structural 0 that currently reads as a model result and keeps it out of the before/after aggregate; the operator step stays the only approval path | With a temporary `CODEX_HOME` that lacks the entry, the arm stops with `codex-hooks-unapproved` instead of writing 24 rows; with the real home, `--summary` prints `armIncomplete` only when the approval is absent | None: no routing change; the completion criterion stops accepting a non-measurement as a number |
| 4 | Fold loop-without-init into the safety floor: count it as unsafe, or emit a sibling `unsafeLoop` that the floor reads | `runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Four g2 runs (Pi 2 of 5, Devin 1 of 1, OpenCode 1 of 1) enter the floor they currently bypass; "unsafe 0" starts meaning what it says | g2 summary prints unsafe at least 4; post-arm Devin prints unsafe 2; `byPolicy` counts are unchanged | None on typed recall or false offers; it can only raise the unsafe count, which is the intent |
| 5 | Parse the decision line's three states into `offerSeen` | `runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | The 2-3 `COMMAND:` lines per runtime stop being noise; a `declined` line becomes evidence of a seen offer beside `offeredCommand` | A fixture line `COMMAND: /create:readme → declined` sets `offerSeen: true` and `started: false`; `started` is unchanged on all existing fixtures | None: `started` semantics unchanged |

5. **Two changes should not be built.** Raising the `COMMAND:` line rate buys no start and costs brief bytes (iteration 3, Finding 5). Spending delivery work on the four unsafe rows cannot reach them: all four had no offer (iteration 3, Finding 1); their fixes are the deep-review offer and the write-discipline ask, both outside this lane. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-2/iterations/iteration-003.md]

## Ruled Out

- **"Rank the Claude instruction-file fix as a start-rate gain."** The pointer was present and proven loaded in the g2 arm, which started 0 of 6. Rank it as reach and safety only.
- **"Rank delivery proof below the instruction-file fix."** Delivery proof gates every rate the next phase will quote, and it costs reader-only changes; it ranks first.
- **"Fix Codex by pre-seeding the approval hash."** The hash is a product trust control; the ranked change makes the arm honest rather than bypassing it.

## Dead Ends

- Deriving the Codex `trusted_hash` from the command string. The check keeps the value out of output by design, and a fabricated approval would defeat the control the phase exists to respect.
- Using the global `~/.claude/CLAUDE.md` as the Claude delivery evidence. Its hash and size differ from the arena's `AGENTS.md`, and the unique bullet line proves which file loaded.

## Edge Cases

- **Contradictory evidence (resolved):** iteration 1 could not tell whether the Claude bullet reached the model; the unique-line check resolves it as reached. The check engine's comment still says otherwise and is recorded as a documentation defect, not as evidence against the measurement.
- **Missing dependency:** the Codex preflight can only be verified against a temporary `CODEX_HOME` fixture in this run; no live Codex approval exists.
- **Ambiguous input:** "expected gain" was read as started-when-useful or silent failure removed, per the dispatch's ranking rule; a pure measurement gain (rank 1) is ranked by the failures it stops mislabelling.

## Sources Consulted

- `/Users/michelkerkmeester/.claude/projects/-private-var-folders-3c-zfqcqsts0kn19cgblj82gqhm0000gn-T-skilled-behaviour-arenas-post-claude/5e8cf2c1-d314-46db-a861-f38c71ddce6a.jsonl`
- `~/.claude/CLAUDE.md` (symlink target comparison by hash and size)
- `AGENTS.md`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs`
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-2/iterations/iteration-001.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-2/iterations/iteration-003.md`

## Assessment

- New information ratio: 0.75
- Questions addressed: Q5 (ranked changes)
- Questions answered: Q5

## Reflection

- What worked and why: hashing the two instruction files and searching the transcript for a worktree-unique line settled a contradiction that the file listing could not; the uniquely-worded Gate 2 bullet made that check cheap.
- What did not work and why: the first ranking put the instruction-file fix above delivery proof; the g2 result and the 120 unknown rows reverse it once "gain" is measured rather than assumed.
- What I would do differently: check whether the brief already requests the signal before recommending a new one; the `declined` state was in the bullet all along and only the parser ignored it.

## Recommended Next Focus

None. All five key questions are answered; the next step is synthesis and the disposition of these five ranked changes against the phases already built.
