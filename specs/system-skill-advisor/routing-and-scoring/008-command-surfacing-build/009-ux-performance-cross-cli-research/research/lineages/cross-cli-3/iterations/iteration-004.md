# Iteration 4: Ranking the cross-CLI options by gain per unit of floor risk

## Focus

Turn the measured differences of iterations 1-3 into a ranked set: each item names the file it changes, the measurable gain (commands, bytes, rows or runtimes), the committed check that proves it, and its risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [160,50,21,5] at HEAD; segment two quoted [159,50,20,5] before phase 011).

## Actions Taken

1. Re-ran the OpenCode transform over the nine probe prompts capturing **every** system entry, not only the first, to price the second block.
2. Read segment one's rank 9 and its disposition, and the decision that blocks the canonical rename (Q025), to confirm what may be reopened.
3. Checked whether any workspace overrides the threshold pair the plugin hardcodes.

## Findings

1. **The compiled-routing block is emitted on 7 of 9 prompts and always says `targets=none`.** It is 73 bytes for the sk-doc hub and 83 for system-deep-loop, 561 bytes across the nine prompts. It appears on typed, plain, ambiguous (`outcome=defer`), the three deep plain rows and the doctor-deep-loop row; it is absent on the doctor-setup and no-match prompts, where no compiled route is served. The hook emits no equivalent line on any of the nine. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-entries.json] [SOURCE: .opencode/plugins/system-skill-advisor.js:1586]

2. **Segment one's rank 9 may be reopened, and this is the measurement that changes it.** Rank 9 asked to settle G5 on the real path, "also on OpenCode", and to add a visibility count. The count shipped in 011; the fix was left as an operator rename, and the canonical rename is blocked by Q025. Iteration 2 supplies three facts rank 9 did not have: every non-Claude runtime resolves 45 of 45 commands, so OpenCode does not collapse; `commandVisibility` cannot certify a collapse it did not model (it counts a `skill.md` folder as one, and skips root commands); and `.claude/skills` is a single symlink to the canonical tree, which prices the skill-mirror route. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:112] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:61]

3. **No workspace overrides the threshold pair.** The only values in the tree are the compat-contract defaults, 0.8 and 0.35, so the plugin's hardcoded 0.35 and the hook's `effectiveThresholds` read agree today. The divergence is a latent hazard, not a current defect, and building a reader for it now would be building for a hypothetical. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json:6] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:341]

4. **Ranked set, highest gain per unit of risk first.** All floor risk is stated against typed recall 24/44, false offers 0/35 and EVAL [160,50,21,5].

| # | Change | File | Measured gain | Verify | Floor risk |
|---|---|---|---|---|---|
| 1 | Restore Claude's 44 of 44 without renaming: skip the `create/skill.md` command link, generate `.claude/skills/create/SKILL.md` with `name: create`, and make `.claude/skills` a managed tree (reopens rank 9 with the iteration-2 measurement) | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` (`buildExpectedLinks`, `commandVisibility`); generated `.claude/skills/create/SKILL.md` | 12 `create:*` names become visible on Claude, 32/44 → 44/44; 0 change on claude-none, cursor, codex, opencode, pi, devin, dsh; every displayed name unchanged | `commandVisibility` counts command links plus the skill link, asserts 44, and one fixture listing shows `create` and `create:readme` together; `--check` prints `visibility claude 44/44` and still exits 1 on a new `skill.md`-with-siblings folder | None on any floor: no scoring input, no canonical command edit, no advisor-graph entry — provided the skill stays Claude-only |
| 2 | Stop emitting an empty compiled-routing line: render it only when `targets.length > 0` (or drop the block) | `.opencode/plugins/system-skill-advisor.js:1586`, `.opencode/plugins/lib/skill-advisor-render.js:124` | −561 bytes over the nine probe prompts (73 for sk-doc, 83 for system-deep-loop, 7 of 9 prompts); OpenCode's injected bytes equal the hook's on those prompts | Plugin test asserts one `output.system` entry when the summary has no targets; the probe file prints 286 B for the typed prompt where it prints 359 B today | None: metadata only, no routing decision changes |
| 3 | Give the one DSH row a session id so it scores | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` (DSH locator) | 1 row moves from unscored to scored; DSH delivery goes 23 true + 1 unknown → 24 answered | The arm prints `24 of 24 scored` for DSH beside `delivery unknown 0` | None |
| 4 | Count `deliveryUnknown` on run lines, not only on scored rows | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1300` | DSH prints `delivery unknown 1` where it prints 0 today; the count stops depending on scorability | Fixture: an unscored line with `briefDelivered: 'unknown'` increments the counter | None |
| 5 | Split Codex `false` into `unapproved` and `not-delivered` | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`; run line | 24 Codex rows stop reading as one cause; the arm separates a product control from a delivery failure | A `CODEX_HOME` without the approval entry prints the `unapproved` value; an approved entry with no stored brief prints `not-delivered` | None |

5. **Ranked because of what moves, not because of what is tidy.** Rank 1 moves twelve operator-visible names on one runtime and touches no scoring input. Rank 2 moves 561 bytes and buys byte parity with the hook. Ranks 3-5 move single rows or single fields and exist so the next arm's numbers cannot be misread. Nothing here re-recommends a built item: rank 1 is the fix half of segment-one rank 9, the others are new. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md:135]

## Ruled Out

- Building a reader for `effectiveThresholds` in the plugin. No override exists in the tree; the restraint rule says not to build for a hypothetical. Recorded as a latent hazard in iteration 1 finding 4 instead.
- Putting the `create` skill in the canonical `.skilled/skills` tree. It would add a fifteenth skill to every runtime and to the advisor graph, which is the one route by which rank 1 could move the floors.

## Dead Ends

- Pricing rank 2 by tokens rather than bytes: at four characters per token the block is 18-21 tokens, which no cap binds; the gain is parity and noise, not budget.

## Edge Cases

- Ambiguous input: "started-when-useful" could be read as start rate or as reachable commands. Used reachable commands for rank 1 (a hidden command cannot be started) and bytes for rank 2 (no start claim).
- Contradictory evidence: none. Segment one's rank 9 said "settle on the real path"; this iteration keeps that requirement and changes only the proposed remedy.
- Missing dependencies: a live Claude listing is still needed to prove the generated skill renders as `create`; the mechanism is the one the 12 existing skills already use, so the risk is low but the proof is not in hand.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-entries.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md`
- `.skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json`
- `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/lib/skill-advisor-render.js`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/steer.md` (absent; not present at the time of this iteration)

## Assessment

- New information ratio: 0.6
- Questions addressed: Which remaining cross-CLI gap ranks first by started-when-useful gain per unit of floor risk, and what file does each fix change?
- Questions answered: the same question

## Reflection

- What worked and why: capturing every system entry rather than the first turned "there is an extra line" into "561 bytes over nine prompts, 7 of 9". The ranking needed a number, not an observation.
- What did not work and why: the first attempt at that capture edited the earlier script by string replacement and broke it. A fresh script with the same stub was faster than repairing the edit.
- What I would do differently: price the second block in the same run that compares the heads, so the byte table exists at iteration 1.

## Recommended Next Focus

Whether the degraded (daemon-unreachable) path still costs a command per runtime, and what the smallest change is that makes the fallback answer carry the same command as the live answer — the one carried question from the segment-three brief that no other lane owns.
