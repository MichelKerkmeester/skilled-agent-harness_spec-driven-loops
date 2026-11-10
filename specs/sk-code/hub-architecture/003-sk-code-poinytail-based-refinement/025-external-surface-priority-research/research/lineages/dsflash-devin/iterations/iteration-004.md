# Iteration 4: Q2 part 1 — observed breakage when the two example surfaces are deleted

## Focus
Q2 part 1 (dispatch): make a throwaway copy OUTSIDE the worktree, delete `.skilled/skills/sk-code/sk-code-obsidian` and `sk-code-webflow` in the COPY only, then observe: `compiled-route-guard.cjs`; `compiled-route.cjs --hub sk-code --prompt` for an opencode, an obsidian, a webflow and a generic code prompt; the sk-code parent-skill check and the package/root-metadata gate the doctor runs; the route sync or mint script; the canary tests; and the skill advisor recommend for a code prompt. Record each command, exit status and decisive lines; class BREAK when observed to fail once deleted, OK when it holds.

Copy (outside the worktree, per the dispatch recipe): `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//s025-dsflash-devin-i4.ot15` — mktemp under `$TMPDIR`, `rsync -a --exclude node_modules --exclude .git --exclude specs --exclude .worktrees`, 6 `.skilled/**/node_modules` symlinked back, `git init` + baseline commit (this made a clean control possible via `git checkout`). Every deletion and edit stayed inside the copy; nothing in the worktree was modified.

## Actions Taken
All commands below ran with `cd "$X"` in the copy; exit statuses are as printed.

1. Copy setup, exit 0 (6 node_modules symlinks; baseline commit holds the pre-deletion state).
2. Control before deletion: guard → all 7 hubs `fresh`, exit 0. Route "obsidian plugin settings tab" → `packetId sk-code-obsidian`, exit 0.
3. `rm -rf .skilled/skills/sk-code/sk-code-obsidian .skilled/skills/sk-code/sk-code-webflow` (copy only), exit 0; `ls` shows only `sk-code-skilled`, `sk-code-quality`, `sk-code-review` remain.
4. Post-deletion probes: guard (exit 0); 4 routes (exit 0 each); `parent-skill-check.cjs .skilled/skills/sk-code` (exit 1); `ci-skill-root-metadata.cjs` (exit 1); `compiled-route-sync.cjs` (exit 1, see edge case); `node --test` on the three compiled-route test files (exit 1, 7/8 pass) and on `parent-skill-check-invariants.test.cjs` (exit 0, 98/98); `skill-advisor.cjs advisor_recommend` (exit 0).
5. Control for the one failing test: `git checkout -- .skilled/skills/sk-code` (restore, exit 0), rerun `compiled-route-manifest.test.cjs` → fails identically; re-delete the two packets (copy back to treatment state).
6. Clock: `date -u` 17:05:12Z–17:06:20Z mid-run.

## Findings
Format: `| class | claim | evidence | priority |`. Every row was opened in this iteration; copy-observed rows cite the command run in the copy.

| class | claim | evidence | priority |
| --- | --- | --- | --- |
| BREAK | **The guard is blind to the deletion.** After both packets are gone, `compiled-route-guard.cjs` still prints all 7 hubs `fresh` and exits 0. `inspect()` only compares manifest freshness and authored/runtime bytes; it never stats packet directories, so a hub whose compiled policy routes to deleted packets is indistinguishable from a healthy one. | copy exec: guard pre-deletion exit 0, post-deletion exit 0, same 7 `fresh` lines; [SOURCE: .skilled/bin/compiled-route-guard.cjs:97-116] | P1 |
| BREAK | **The front door silently hands out deleted packets.** Post-deletion, "obsidian plugin settings tab" → `packetId sk-code-obsidian` and "webflow cms collection" → `sk-code-webflow`, both exit 0, with the same `effectivePolicyHash 8cd6f489…` and `generation 2` as the pre-deletion control; the opencode and generic prompts → `sk-code-skilled`. Nothing in the output marks the packet as missing on disk. | copy exec: 4 `compiled-route.cjs --hub sk-code --prompt …` runs, exit 0 each; control route identical for the obsidian prompt | P1 |
| BREAK | **`parent-skill-check.cjs` on sk-code fails hard: exit 1, 113 invariant failures, 0 warnings.** Composition: `FAIL 3c` ×2 (mode packet "is not an existing sub-directory"), `FAIL 5d` ×1 (router resource paths `[sk-code-webflow/SKILL.md, sk-code-obsidian/SKILL.md]` missing on disk), `FAIL 10a-manifest-source` ×1 (`MODE_LEAF_SET_COLLISION`: workflowModes `sk-code-webflow` and `sk-code-obsidian` receive hash-equal leaf sets `4f53cda18c2b` — deleting the packets empties both leaf sets, and the two empty sets collide, so leaf-manifest regeneration fails), `FAIL 12a-router-contract` ×109 (`RRC-006 … does not resolve on disk`, all sk-code-webflow/obsidian paths). 42 PASS lines; final line `FAIL: parent-skill-check — 113 invariant failures, 0 warnings`. | copy exec: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`, exit 1; full report `psc.out` in the copy | P1 |
| OK | **The 5k canary legs stay green through the deletion.** `PASS: 5k-alias`, `PASS: 5k-packet`, `PASS: 5k-canary` ("every routerSignals mode is the expected route of a canary case") all pass post-deletion because `hub-router.json` routerSignals and the canary fixture are self-consistent — they still describe the deleted packets. This contradicts iteration 3's inference that a deletion fails 5k-canary; it stays green while 3c/5d/10a/12a fail. | copy exec: `rg ': 5k' psc.out` | P1 |
| BREAK | **The doctor's fleet package/root-metadata gate fails.** `ci-skill-root-metadata.cjs` exit 1: `checked=14 passed=13 failed=1`; sk-code is the only failure, `RRC-006: resource path "sk-code-obsidian/references/comment-grammar.md" (intent OBSIDIAN_PLUGIN) does not resolve on disk`; the closing hint says `Re-run with --fix to regenerate missing or stale manifests`. | copy exec: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, exit 1 | P1 |
| OK | **The doctor's own invariant test suite is unaffected:** `parent-skill-check-invariants.test.cjs` → 98/98 pass, exit 0. It validates the checker against fixtures, not the live hub, so it cannot catch a live deletion. | copy exec: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`, exit 0 | P2 |
| OK | **The advisor survives and routes.** `advisor_recommend` for "fix a typescript cli bug": exit 0, top-1 `sk-code` (score 0.708, confidence 0.90), `compiledRoute` → `sk-code-skilled`, `effectivePolicyHash 8cd6f489…`. The advisor carries no surface ids (iteration 3), so the deletion is invisible to it — consistent, not broken. | copy exec: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"fix a typescript cli bug"}' --format json`, exit 0 | P2 |
| PRESENCE | **`compiled-route-sync.cjs` cannot complete without `specs/` content.** With no `specs` dir it dies at module load — `ENOENT … lstat '…/specs'` at `compiled-route-sync.cjs:39` — even for `--help`; with an empty `specs/` the usage prints (exit 0) but the no-arg build exits 1: `SYNC FAILED: authored resolver missing at specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs`. The compiled-routing build's authored source lives under a spec archive folder. Deletion-attribution unproven — the copy recipe excludes `specs`; what would settle it: a copy that includes `specs/`, run as control and treatment. | copy exec: `compiled-route-sync.cjs --help` exit 1 then exit 0 after `mkdir specs`; no-arg build exit 1 with the quoted line | P2 |
| OK | **The compiled-route test suite is green apart from a specs-exclusion artifact.** `compiled-route-front-door.test.cjs` + `compiled-route-surface-hint.test.cjs` + `compiled-route-manifest.test.cjs` → 7/8 pass, exit 1; the single failure (`compiled-route-manifest.test.cjs`, file-level, "authored resolver missing … resolve.cjs") is NOT deletion-caused: the control run after `git checkout` restore fails identically. | copy exec: canary1 exit 1 (7 pass / 1 fail); control rerun exit 1, same error | P2 |

### Options (evidence-backed; Q3 remains a later iteration)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| D. Ship the default without the two example surfaces and regenerate every input (carried from iteration 3, now with observed cost) | `mode-registry.json` modes[], `hub-router.json` tieBreak/routerSignals, canary fixture, then re-mint; operator repo keeps a local variant | one coordinated data edit per surface set + regenerations | parity breakage until all artifacts regenerate; 5k needs fixture cases only for remaining signals | Docs-only marking — fails: the observed 3c/5d/10a/12a failures and the package gate fail the moment the dirs are gone, regardless of prose |
| E. Teach `compiled-route-guard.cjs` to stat packet directories | [SOURCE: .skilled/bin/compiled-route-guard.cjs:97-116] `inspect()` | new existence check + tests | none material (read-only stat) | Do nothing — fails: the guard reports `fresh` while the front door routes to deleted packets (row 1), so the one gate that exists cannot see the break |

## Questions Answered
None fully. Q2 part 1 (deletion behavior) is now observed end-to-end; Q2's second half — what happens when an external user ADDS their own surface packet — is not. `answeredQuestions: []` recorded so the reducer does not tick Q2 early.

## Questions Remaining
- Q2 part 2: what happens when an external user adds their own surface packet (scaffold path, registry edit, re-mint, doctor).
- Q1 (`ROUTER.md:265-618` §8–§11 only) — still open from iteration 3.
- Q3, Q4, Q5, Q6 — untouched.

## Next Focus
Q2 part 2, in the same copy (baseline still in its git history): restore baseline, scaffold a minimal user surface packet, register it, re-mint, and observe route priority vs `sk-code-skilled`, guard, doctor legs, package gate and advisor — testing as first hypotheses the dangling-route row and the 10a leaf-set collision.

## Edge Cases
- Missing dependency: the copy recipe excludes `specs/`; `compiled-route-sync.cjs` and `compiled-route-manifest.test.cjs` both require the authored resolver `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs`. Both fail identically pre- and post-deletion, so they are recorded as copy artifacts, not BREAKs.
- Partial success: the sync/mint script could not be exercised end-to-end in the copy. What would settle it: a copy that includes `specs/` content, or a sync control/treatment pair on a full tree.
- Contradictory evidence: iteration 3 inferred that a deletion fails 5k-canary; observation shows 5k-alias/5k-packet/5k-canary all PASS while 3c/5d/10a/12a fail. Both recorded; the observation is better supported (it is the command output).

## Sources Consulted
- Copy (throwaway, outside the worktree): `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//s025-dsflash-devin-i4.ot15` — commands: `compiled-route-guard.cjs` (×3), `compiled-route.cjs` (×5), `parent-skill-check.cjs`, `ci-skill-root-metadata.cjs`, `compiled-route-sync.cjs` (×3), `node --test` (×4 files), `skill-advisor.cjs advisor_recommend`; all exit statuses quoted in Actions Taken/Findings.
- [SOURCE: .skilled/bin/compiled-route-guard.cjs:97-116] (repo read)
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:130,138-139] (repo read)
- State files: `deep-research-config.json`, `deep-research-strategy.md`, `iteration-003.md` (lineage-local)

## Assessment
- New information ratio: 0.90 (8 of 9 findings fully new; 1 partially new — advisor route confirmation of iteration 3's surface-invisibility)
- Questions addressed: Q2 (part 1 only)
- Questions answered: none fully

## Reflection
- What worked and why: the copy's baseline git commit made a cheap, decisive control — `git checkout` restored the packets and proved the manifest-test failure was a specs-exclusion artifact rather than a deletion break. The control/treatment pairs (guard pre/post, route pre/post) converted every claim into before/after evidence instead of inference.
- What did not work and why: the recipe's `specs` exclusion blocks the two commands whose authored sources live under `specs/` (sync, manifest test), so both needed a caveat rather than a verdict. The first probe pass also dropped the advisor section (a draft slip), costing an extra round.
- What I would do differently: include `specs/` (or symlink the resolver) in the copy whenever the focus names the sync/mint script, and batch the advisor run into the first probe pass.
