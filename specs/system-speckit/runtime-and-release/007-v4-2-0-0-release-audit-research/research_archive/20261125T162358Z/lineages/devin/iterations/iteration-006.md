# Iteration 6: Fix-Commit Sweep for User-Visible Changes

## Focus

Complete Q1 by sweeping the window's `fix` and `refactor` commits, not just its `feat` commits, for subjects that name a user-visible surface. Selected interpretation: a fix that changes what a command accepts, which model a runtime defaults to, or where a prompt routes is user-visible behavior and belongs in the notes; a fix that only changes an internal message, a test or a doc does not. Deferred: synthesis.

## Actions Taken

1. Filtered the window's `fix`/`refactor` subjects by user-visible verbs and surfaces (add, remove, rename, default, exit, refuse, flag, allow, support, accept, stop, read, write, report, record, print, surface, honour).
2. Checked each surviving subject against the notes' section text and folded "Smaller fixes" blocks.
3. Verified the three uncovered clusters against HEAD code and the commits that introduced them.

## Findings

1. **MISSING (P2) — the review target forms are unmentioned.** Six fixes change what `/deep:review <target>` accepts: a root or glob target (`613fe6e5d57`), a slashed ref read as a range or as a path on disk (`80c008bc851`), a file path with two dots in its name (`e643bdf44e3`), a named list of review scope files (`385f43c6019`), an open-ended git range (`dfbf0f0745f`), and a commit range's touched files read from git (`260f50e9916`). At HEAD `frontier-admit.cjs` carries `isCommitRange` and the glob-boundary normalizer that these commits added. The notes never mention review targets, commit ranges or globs: `review target`, `commit range` and `glob` each appear 0 times, and the only `target` lines concern sub-targets, the doctor table and a bdg session. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:579-626] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:158]

2. **MISSING (P2) — the Pi default-model ordering fix is unmentioned.** `31ef87dfc7b` reorders `.pi/settings.json` so the project default model sits first in `enabledModels`, because Pi takes the first enabled model when no `defaultModel` is set; the fix restores `llmgateway/deepseek-v4.1-flash-1017` as the default after a family regroup moved `openai/gpt-6-luna` to the front. The notes mention pi only for its sandbox mode ("Devin and pi have no separate write mode", line 332); `enabledModels` appears 0 times. [SOURCE: .pi/settings.json] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:332]

3. **MISSING (P2) — the sk-doc security-phrase routing fix is unmentioned.** `571575632a4` removes a bare security-policy phrase from the sk-doc hub router and the `sk-create-readme` trigger line, so a request that only mentions a security policy no longer routes to the README mode, while `security.md` still routes. The notes never describe sk-doc routing; sk-doc appears only as a doctor command owner and as the README validator. [SOURCE: .skilled/skills/sk-doc/hub-router.json] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:476]

## Verified Claims (not findings)

- **The sandbox, Claude-config and permission fixes are covered.** `fix(system-deep-loop): default unset opencode sandbox mode to workspace-write`, `honor --claude-config-dir on research Claude runs`, `honor a requested sandbox mode for every executor kind` and `record the sandbox mode each executor actually runs` all match lines 325-339 and 246 of the notes.
- **The refusal-line fixes are covered.** Every `fix(doctor)` and `fix(git-hooks)` subject that adds a `Next:` line matches the notes' "Every Refusal Names the Next Command" section.
- **The extend, survivor, redaction and stdout fixes are covered.** `keep the extend step's real exit status`, `let the runner close a leaderless lineage --stop ends`, `redact the logs of lineages --stop closes`, `record a runner stop's live lineages as survivors` and `fail stdout overflow` all match their notes sections.

## Ruled Out

- **Treating every `fix` subject as a MISSING candidate.** Most fix subjects restate behavior the notes already describe in a folded "Smaller fixes" block; only three clusters survived the check against the notes' text.
- **The sk-doc hub-vocabulary failure as a separate BUG.** The commit is itself the fix; at HEAD the router and the trigger line agree, so no defect remains.
- **The Pi fix as a DRIFT.** It restores a default the notes never state, so it is a MISSING entry rather than a contradiction.

## Dead Ends

- **Reading every one of the 165 `fix(system-deep-loop)` commits in full.** The subject filter plus the notes' folded blocks reduced the set to a handful of clusters; opening all of them would have consumed the budget without a better answer.

## Edge Cases

- Ambiguous input: a fix to an existing feature was counted as a user-visible behavior change, because the definition of MISSING includes a changed behavior. A stricter reading that counts only new surfaces would drop findings 1 and 3.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt` (fix/refactor subjects)
- `.skilled/changelog/skilled/v4.2.0.0.md` (all sections and folded blocks)
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:579-626,685,716`
- `.pi/settings.json`
- `.skilled/skills/sk-doc/hub-router.json`, `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`
- `git show --stat` for `613fe6e5d57`, `80c008bc851`, `dfbf0f0745f`, `260f50e9916`, `e643bdf44e3`, `385f43c6019`, `31ef87dfc7b`, `571575632a4`

## Assessment

- New information ratio: 1.00
- Questions addressed: Q1 (substantially: fix commits swept, three uncovered clusters found)
- Questions answered: none in full

## Reflection

- What worked and why: filtering fix subjects by user-visible verbs, then checking only the survivors against the notes' text, found three clusters that the feat-only pass could not see. The review-target cluster is the largest, because six separate fixes landed under one unmentioned feature surface.
- What did not work and why: a keyword sweep cannot decide coverage on its own; several candidates (`record the resolved model`, `read the node cap budget`) were already described in folded blocks. Each survivor needed a notes-line check.
- What I would do differently: group fix subjects by feature surface before checking, so a six-commit cluster is checked once rather than six times.

## Recommended Next Focus

Consolidate the audit: re-read the findings from iterations 1 to 6, remove any that a later iteration superseded, and produce the final MISSING, DRIFT and BUG tables with severity, commit, `file:line` and notes line for synthesis.
