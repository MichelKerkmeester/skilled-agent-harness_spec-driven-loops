# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: D2 Security
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (11 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area; check the safety of offering a mutating command, credential reach in a measured turn, and holdout hygiene so no tune, fix or report path reads or leaks holdout rows.
- How this iteration addressed the focus: it re-derived the child environment from its allowlist, traced every path that can write from a measured turn (arena copy, per-turn restore, the run log and its sibling folders), checked the holdout refusal at each entry point, and then followed the one reader that takes a path out of a run log rather than the checkout (`--backfill`). One new trust-boundary finding came out of that last trace; the credential, arena and holdout invariants hold.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:48-71,540-610,811-925,1191-1299`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:69-131,326-459`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:1-343`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:1-122`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:911-975,1333-1358`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:482-570`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:104-137,246-277`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (id scan only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`--backfill` executes the hook and the advisor CLI from the directory a run-log line names, so a crafted log picks the code that runs** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:333` -- `backfillRunLog` takes `checkoutDir` from `line.locator.projectDir` (line 406-410), calls `warmCheckout(checkoutDir)` (line 416-423) and `replayOffer({ checkoutDir, ... })` (line 424-428). `warmCheckout` runs `node <checkoutDir>/.skilled/bin/skill-advisor.cjs advisor_status ...` when that file exists, and `replayOffer` runs `node <checkoutDir>/.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`. Both are paths from the log, not from the runner's own checkout. A log line is data: `run-command-behaviour.mjs --backfill <log>` accepts a log from any previous arm, including one copied from another machine. A log that names an attacker-controlled `projectDir` therefore executes that directory's JavaScript with the operator's environment. The runner's own `PROJECT_DIR` is a realpath of the checkout, but nothing in the backfill checks that the log's value is that checkout or even inside one.
Finding class: security / trust-boundary
Scope proof: both files are in the declared scope; the finding covers only the backfill read path, not the live arm, whose `projectDir` is written by the runner itself.
Affected surface hints: `command-offer.mjs` `backfillRunLog` and `warmCheckout`; `run-command-behaviour.mjs` `backfillLog`; any run log copied between checkouts or machines.
Case: a log line holds `"locator":{"projectDir":"/tmp/attacker"}` and `/tmp/attacker/.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` writes a file; `node run-command-behaviour.mjs --backfill /tmp/crafted.jsonl --out /tmp/backfilled.jsonl` runs that hook, and the file appears. Today the only refusal is `same_path`; no path check compares the log's directory with the checkout being audited.

## Security Invariants Re-Checked

| Invariant | Result | Evidence |
|---|---|---|
| A measured turn gets no operator credential beyond what its runtime needs to start | Holds | `childEnv` copies only `CHILD_ENV_NAMES`, `CHILD_ENV_PREFIXES`, `GH_CONFIG_DIR`, `GIT_TERMINAL_PROMPT=0` and the empty credential helper (`run-command-behaviour.mjs:828-889`); `SSH_AUTH_SOCK`, `AWS_*`, `NPM_TOKEN` and `GH_TOKEN` cannot match any name or prefix. The guard test asserts exactly that (`command-behaviour-guards.vitest.ts:19-40`, observed pass). |
| A live arm cannot run in a checkout that has a remote or was not built by the arena builder | Holds | `liveArmRefusal` lists `git remote` first, then resolves the marker with `git rev-parse --git-path` (`run-command-behaviour.mjs:590-609`); the builder writes that marker after `assertHead` (`prepare-behaviour-arena.mjs:310-314`). The first-turn order is remote, marker, dirty (`run-command-behaviour.mjs:1081-1097`). |
| The arena never carries a dotenv file | Holds | `copyPlan` records only ignored build trees and `.skilled/**/*.sqlite`; `copyPath` walks a tree that holds a dotenv name and skips every entry whose name starts `.env` at every depth (`prepare-behaviour-arena.mjs:193-224,257-269`). A symlink to a directory is copied as a link, so its target's contents do not follow. |
| A mutating command is never offered without the policy that guards it | Holds for this area | The scorer's `policy` comes from the corpus row (`score-command-transcripts.mjs:1201`) and `byPolicy` counts rows, capped rows, started rows and writes per policy (`:1322-1328`); the capture's typed rows carry the delivered policy (`capture-command-routing-baseline.mjs:521-535`). No area file changes the policy table, which is `scorer-attach` scope. |
| No holdout row reaches a run, a score, a transcript or a published row map | Holds | The runner's `findRow` refuses `split === 'holdout'` before a prompt can reach a child (`run-command-behaviour.mjs:628-639`); the scorer marks such rows `holdout` and never opens them (`score-command-transcripts.mjs:935-945,1154-1156`); the capture gates every published map on `publishRow` (`capture-command-routing-baseline.mjs:501,527,543,554`). A scan of the committed baseline finds 0 of the 44 holdout ids in any key or string. |
| The cost script refuses a holdout row before spawning anything | Holds | `selectRows` checks `row.split === 'holdout'` and the typed/`none` set before `measureRow` (`measure-brief-cost.mjs:112-137`); the refusal prints the id only. |

## Traceability Checks

- `spec_code`: partial. The security-relevant rows of the spec (holdout hygiene, per-runtime proof, mutating-command policy) were checked at their code lines; the per-runtime proof stays open with phase 007.
- `checklist_evidence`: partial. No parent checklist; phase 007's open tasks are the only security-relevant closure gap recorded.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: pass for the credential boundary. The allowlist applies before any runtime argv is built, so the six runtimes share one boundary; the per-runtime proof is still phase 007's.
- `feature_catalog_code`: pending.
- `playbook_capability`: pending.

## Integration Evidence

- `run-command-behaviour.mjs` ↔ `worktree-restore.mjs`: a path the turn adds is restored only when it was absent from the pre-turn snapshot; an inherited dirty path is left alone and the run fails if it still differs. That keeps the restore from discarding another worker's edit.
- `prepare-behaviour-arena.mjs` ↔ `run-command-behaviour.mjs`: the marker string and its `.git` location are the same in both, so the guard cannot accept a tree the builder did not make.
- `score-command-transcripts.mjs` ↔ `command-prompts.jsonl`: the holdout decision is made from `split`, and only a `{holdout: true}` sentinel is retained, so the row's text never enters the scoring structures.

## Edge Cases

- **The backfill finding needs an untrusted log.** The runner writes `projectDir` itself, so a normal arm's log is safe. The finding is P2 because the reach needs a log the operator did not produce and a directory holding the two expected entry points.
- **`--dry-run` still replays the hook**, and the replay inherits the operator's environment. This is documented as an explicit replay for offer inspection, so it is recorded as a known behaviour rather than a finding.
- **The `gh-config-empty` folder is created before the first snapshot.** It is inside the exempt out folder, so the dirty guard does not see it; it is not a credential, and the turn's own files there are restored as changed paths.
- **No live arm.** The worktree carries four other lineages' files, so a live first turn would refuse `worktree_dirty`; every security claim above is read-and-reason evidence, except the two guard tests observed in iteration 1.

## Confirmed-Clean Surfaces

- The child environment allowlist and its guard test.
- The arena builder's destination refusal, marker write and dotenv skip.
- The first-turn guard order (remote, marker, dirty) and the per-turn head/stash check.
- The holdout refusal in the runner, the scorer and the cost script, and the publication gate in the capture.
- The restore rule that never reverts a path that was already dirty.

## Ruled Out

- **A measured turn inheriting the operator's SSH agent, cloud profile or npm token.** Ruled out by the allowlist and by the observed guard test.
- **An arena that carries a `.env` file through a copied build tree.** Ruled out by `holdsDotenv` plus the name filter at every depth; a symlinked directory is copied as a link.
- **A holdout row reaching the scorer through `--summary`.** Ruled out: the label map marks it and `scoreRun` returns `holdout_row` before `loadSession`.
- **The run log itself being outside the restore's reach.** Not a gap: a log written after the closing snapshot is never a changed path, and a turn that edits it fails `restored` rather than passing silently.

## Next Focus

- Dimension: traceability
- Focus area: the four committed numeric floors against the baseline, the docs-versus-code claims in `README.md`, `runtime/tests/README.md`, `manual-testing-playbook.md` and the shared `SKILL.md`/`ARCHITECTURE.md` that describe this harness
- Reason: security closed with one P2; traceability is where the pass-two focus's "docs that disagree with code" obligation is discharged
- Rotation status: D1 complete, D2 complete, D3 next
- Blocked/productive carry-forward: productive (holdout and credential invariants); blocked (no live arm)
- Required evidence: the exact claim, the code or tree fact that contradicts it, and a reader who would act on the wrong one

Review verdict: PASS
