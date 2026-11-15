# Review Iteration 002

## Dimension

Security: holdout hygiene and arena containment -- whether a measured turn can reach material it must not have, and whether the holdout boundary holds on every tune, run and report path.

## Dispatcher

Pass-five fan-out lineage `accuracy-runner-5` (area `accuracy-runner`). Sources read this iteration: `review/review-brief-5.txt`, `review/review-focus-5.txt`, `review/review-scope-5.txt`, `review/lineages/accuracy-runner-5/deep-review-strategy.md`, and the packet findings registry for deduplication.

## Files Reviewed

- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:1-354]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:620-780]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:780-930]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1240-1370]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1296-1360]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:150-201]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:407-468]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The dotenv skip and the containment claim cover regular files only, so a symlinked entry is copied as a link that can point outside the arena** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:218-269 -- `holdsDotenv` walks with `entry.isDirectory()`, which is false for a symbolic link, so a linked directory is never entered; `copyPath` then hands the containing tree to `cp -R`, which copies a symlink as a symlink. A `node_modules` entry created by `npm link`, `pnpm link` or a workspace link therefore arrives in the arena pointing at its original folder, and the module header's promise that the arena has "no outer repository whose hooks or credentials it could borrow" and that "the one thing it must never carry across is a dotenv file" does not hold for anything reachable through that link.
   Finding class: security (containment)
   Scope proof: the walk, the dotenv guard and the copy call are all in the scoped builder file, and the header comments at lines 12-34 are the claims being tested.
   Affected surface hints: `copyPlan`, `holdsDotenv`, `copyPath`, `buildArena`, and every live turn's `file_system` and shell tools once it can resolve a link out of the checkout.
   Case: an operator with a locally linked dependency, where `node_modules/linked-pkg` is a symlink to `/Users/me/other-checkout`. Building the arena copies `node_modules` wholesale and the arena's `node_modules/linked-pkg` resolves to the other checkout, so a measured turn can read or write outside the arena with an ordinary file path.

2. **A dotenv file tracked in the commit under test is cloned into the arena, because the dotenv guard runs only on the copied build trees** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:275-327 -- `cloneInto` plus `checkoutDetached` materialise every tracked file of the commit, and `holdsDotenv` is consulted only from `copyPath` for the ignored trees `copyPlan` returns. The module header states the opposite rule for the whole arena ("the one thing it must never carry across is a dotenv file ... at every depth"), so the tracked half of the checkout is unguarded.
   Finding class: security (secret exposure)
   Scope proof: the clone, the copy plan and the guard are all in the scoped builder; the claim under test is the header's dotenv rule at lines 31-34.
   Affected surface hints: `buildArena`, `cloneInto`, `copyPath`, and the `.git/skilled-behaviour-arena` marker that the runner treats as proof of a safe checkout.
   Case: a branch that tracks `.env.local` (added by mistake, or committed in a template repository) is built into an arena; the file is present at `HEAD` in the clone, the guard never inspects it, and the runner's marker check then vouches for that arena as prepared.

3. **The single copy call uses the macOS clonefile flag with no platform check** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:226-230 -- `runCp` always spawns `cp -Rc`. `-c` is the clonefile flag the comment at line 254 names as a same-volume optimisation; on a `cp` that does not implement it the call fails and `copyPath` raises `copy_failed`, so an arena with any ignored build tree cannot be built there. The behaviour suite that covers the builder runs on `ubuntu-latest` in `.github/workflows/spec-kit-check.yml:251-298`, but its two cases build a source with no ignored tree, so the failing branch is never exercised.
   Finding class: security (isolation availability)
   Scope proof: the copy call is in the scoped builder; the CI lane is cited as the platform evidence that the untested branch matters.
   Affected surface hints: `runCp`, `copyPath`, `buildArena`, any operator or CI host that is not macOS.
   Case: building an arena on a Linux host from a source whose `dist/` and `node_modules/` exist. The first copied tree reaches `cp -Rc`, the host's `cp` rejects the flag, and the builder aborts with `copy_failed` after removing the half-built arena, so no arm can run there at all.

## Traceability Checks

- `spec_code`: the scoped builder file and the runner's prompt, holdout and env paths were read against the pass-five brief's holdout and containment questions. Pass for this iteration.
- `checklist_evidence`: every guard the README and the module comments claim was matched to the line that implements it; three gaps recorded, and the guards that do hold are listed under Confirmed-Clean Surfaces.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` `liveArmRefusal`: refuses a checkout with any git remote and requires the `.git/skilled-behaviour-arena` marker, which is the surface that trusts the builder's output. The marker therefore inherits both builder gaps above.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` `findRow`, `freshRowsFrom`, `assertFreshRowsUnique`: the holdout boundary on every run, list and selection path.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` `loadRowLabels`: holdout rows collapse to `{holdout:true}` before any score is computed, so no prompt text can reach a tally, an output line or a refusal reason.

## Edge Cases

- The corpus currently holds no `must-not-start` row on the holdout split (counts-only check: 24 holdout `decline`, 44 holdout `plain`, 24 holdout `skill-only`, 0 holdout `must-not-start`), so the chat set's probe bucket cannot pull a holdout row today. The bucket is not filtered by split, which leaves that fail-closed refusal as the only guard if a holdout probe is ever authored.
- A symlinked entry that points *inside* the arena is harmless, so the containment gap is bounded by what the operator's own tooling links into `node_modules`.
- The builder removes a half-built arena on failure, so gap 3 fails closed rather than leaving an unmarked checkout behind.

## Confirmed-Clean Surfaces

- `findRow` refuses a holdout id before any prompt reaches a child process or the run log, and it is the one lookup used by a run, a selection and a listing, so no caller gets there by a different path.
- `freshRowsFrom` refuses a holdout row, a non-`fresh` split, a non-`fresh-` id and a set that is not exactly 36 rows, and `assertFreshRowsUnique` names ids only, never prompt text.
- `rowLabels` keeps only `id`, `split`, `row_type` and `policy`, so a selection never carries a prompt.
- The run line holds no prompt field; it holds the locator, exit, changed paths, fixture, offer fields and delivery answer only.
- `childEnv` drops every inherited name that ends `_DISABLED`, passes no `AI_SESSION_CHILD`, and points the GitHub CLI at an empty folder with an empty credential helper.
- The arena refuses a destination that already exists or sits inside a repository, removes every inherited remote, and asserts the cloned head matches the source head.

## Ruled Out

- `latestLines` reuse of a same-arm capture: not a security surface; already ruled out in iteration 1.
- Arena builder copying a tracked dotenv file in this repository: no dotenv file is tracked here, only `.env.example` files, so the input is a branch defect rather than the current state (evidence: `git ls-files` filter for dotenv names).
- `--set chat` probe bucket missing a `split` filter: no holdout row carries `row_type: must-not-start`, and `lookupPrompt` refuses a holdout id before the turn starts (evidence: counts-only corpus query, `findRow` guard).
- A multi-turn Vibe projection counted as one run: the runner mints a fresh session id per row, so a scored session holds one turn (evidence: `randomUUID()` in `runTurn`, `locatorFor`).
- `findRow` parsing a holdout row before refusing it: the parsed text reaches neither a child process nor the run log, and the refusal carries the id only, so no prompt escapes (evidence: `Refusal('holdout_row', ...)`).

## Next Focus

- Dimension: traceability
- Focus area: docs and comments against the code they describe -- `routing-accuracy/README.md`, `command-bridges/README.md`, and the arena/runner provenance claims
- Reason: the pass-five brief asks for docs that disagree with the code, and this lineage's area holds two READMEs that describe the scorer and the runner
- Rotation status: first traceability pass
- Required evidence: the exact README line and the code line that contradicts it
- Blocked/productive carry-forward: the holdout and containment surfaces are now swept; the docs are untouched

Review verdict: PASS
