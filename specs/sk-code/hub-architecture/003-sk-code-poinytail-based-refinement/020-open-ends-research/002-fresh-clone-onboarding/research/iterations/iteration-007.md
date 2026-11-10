# Iteration 7: Mirror-model hermeticity — can the fresh clone's sync gates run, and does their content pass?

## Focus

All five strategy key questions stay resolved (`openQuestions: []`), so this iteration continues the dispatch's "broaden coverage and verify prior findings" and takes up the carried recommendation (a) from iterations 5 and 6: audit the hermeticity of the agent mirror model against an external clone — specifically iteration 6's open phrasing, "does a fresh clone ever fail a sync gate for content it did not touch?". The mirror chain was read end to end (canonical trees, the pre-commit hook, the checker and its verifier library, the `/doctor` roster check, the generators, CI) and then executed in the disposable clone at the same HEAD. Scope: repository reads plus read-only clone probes; no installs, no builds, no deletions, no repository writes outside the packet. Deferred: iteration 6's (b) codex drift-notice wording decision and (c) the First-Use doc gap; both remain candidates for iterations 8-10.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 7 of 10, stopPolicy max-iterations, progressiveSynthesis true), state JSONL (6 iteration records + this run's `iteration_start`), strategy, findings registry, dashboard, iteration 6.
2. Read the mirror engine end to end: `.skilled/bin/check-agent-mirror-sync.cjs` (full, 148 lines), `.skilled/bin/lib/mirror-sync-verify.cjs` (full, 364 lines).
3. Read the contract and rosters: `.skilled/bin/agent-mirror-crosswalk.md` §1-§2 and §5, `.claude/agents/README.txt` (full), `.pi/SYNC.md` (head).
4. Read the gate surfaces: `.skilled/hooks/git/pre-commit` (full, 103 lines), `.github/workflows/agent-mirror-sync.yml` (full), `.github/workflows/spec-kit-check.yml:150-165`.
5. Read the lifecycle that decides whether the checker's dependency exists: `.skilled/skills/system-spec-kit/package.json:1-30`, `shared/package.json:14-22`, `runtime/package.json:14-26`.
6. Tracked-state probes: `git ls-files .skilled/skills/system-spec-kit/shared/dist` → 0 files; `ls -ld` on the agent directories; `git ls-files -s` on `.cursor/agents`.
7. Clone probes at matching HEADs (repo and clone both `82a71c87d035b0a1c7bc3a9405c116125e1ea6be`): `node .skilled/bin/check-agent-mirror-sync.cjs --all` and `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs`, exit codes bound to their commands.

Total tool calls this iteration ≈ 22 (state reads, 8 research probes, artifact writes, gateway, verification) against the configured budget of 24.

## Findings

1. **The fresh clone's pre-commit mirror gate cannot run until `shared/dist` is built, and nothing on the documented path builds it — any staged agent file then hard-blocks with the wrong diagnosis.** The checker's first act is `require('./lib/mirror-sync-verify.cjs')` [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:21], and that library requires the *built* parser at `.skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` at module load [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:12-14]. A pristine checkout of HEAD tracks zero files there (`git ls-files` count 0, probe this iteration); the clone's copy exists only because earlier iterations built it. No documented step produces it: the workspace root's only install-time script is `postinstall` = `node runtime/cli/setup/record-node-version.js` [SOURCE: .skilled/skills/system-spec-kit/package.json:25], and neither `shared` [SOURCE: .skilled/skills/system-spec-kit/shared/package.json:14-18] nor `runtime` [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:14-19] declares any `prepare` script, so README step 2's `npm install` builds nothing. When a user stages any change under `.opencode|.skilled|.claude|.codex/agents/`, the hook runs the checker and any nonzero exit — crash included — lands in the same branch as drift: `BLOCKED: staged agent files desync the .opencode / .claude mirrors. Fix: re-sync the mirrors...` [SOURCE: .skilled/hooks/git/pre-commit:82-103]. The user is told to fix a desync that does not exist while the real remedy — building the spec-kit workspace — is not on the documented path. [INFERENCE: the absent-file → require-throw → nonzero-exit arc is Node's module-resolution semantics; it was not executed because reproducing it would require deleting the built parser file, and deletions are banned in this run.] Cost: a commit-time hard block with a misleading instruction for anyone who customizes an agent before building; trigger requires staging an agent file, so it sits off the first-packet path.

2. **Mirror *content* is hermetic at the current HEAD — the committed state passes both gates when they can run, and the guarded Explore fork is handled everywhere.** In the clone at the same HEAD as the checkout, `check-agent-mirror-sync.cjs --all` exits 0 with `11 agent(s) checked — all mirrors in sync — OK`, and the `/doctor` roster check exits 0 with `cursor 11/11 symlinked`, `devin 11/11 symlinked`, `opencode/codex/pi 11/11 present` (probes this iteration). The Claude-only fork is excluded by design: the checker filters `Explore` via `CLAUDE_ONLY_AGENTS` [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:39], the crosswalk documents that no other runtime has anything to mirror [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:159-161], and no other tree ships it (probe). Two structural facts keep this stable: `.opencode/agents` is a tracked symlink to `../.skilled/agents` (probe), so the checker's canonical dir *is* the crosswalk's canonical dir; and `.cursor`/`.devin` agent entries are tracked symlinks (git mode `120000`) onto `.claude` files (probe), so their bodies cannot drift independently on POSIX. Answer to the iteration's question: a fresh clone does **not** fail a sync gate for content it did not touch — the failure mode is environmental (finding 1), not content drift.

3. **The local and CI paths diverge at exactly the point of failure: CI builds the parser first, the pre-commit hook does not, and of the crosswalk's "three gates" only one is wired into pre-commit.** CI's mirror workflow installs the workspace and runs `tsc --build` in `shared/` *before* invoking the checker [SOURCE: .github/workflows/agent-mirror-sync.yml:20-25] — which is why the crash has never been seen in CI. The local hook has no such primer [SOURCE: .skilled/hooks/git/pre-commit:78-103]. The crosswalk says the three gates "are also wired into the pre-commit and CI paths" [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:211-212]; the file evidence is that CI runs all three (mirror checker, `sync-agents.cjs --check` / `sync-agents-pi.cjs --check`, roster check [SOURCE: .github/workflows/spec-kit-check.yml:154-162]) while pre-commit runs only the mirror checker and comment hygiene. Practical consequence: local commits can carry `.pi`/`.codex` generator staleness that CI later blocks — a maintainer-facing papercut, not an external-newcomer stumble.

4. **Fix-direction candidates for the final ranked set (synthesis; nothing implemented here).** Read through the overengineering lens ([INFERENCE: combines findings 1-3 with iteration 6's finding that the documented path never runs the spec-kit build]): (a) *Document one spec-kit workspace build on the setup path* (`npm --prefix .skilled/skills/system-spec-kit run build`) — one prose line; it closes this crash **and** the `runtime/dist` session-start gaps from iteration 6, so it is the highest-leverage single fix in the family. (b) *Make the gate's failure honest* — have the checker detect the absent parser and exit "not checkable", and let the hook warn-skip it the way it already warn-skips a missing `node` [SOURCE: .skilled/hooks/git/pre-commit:94-102], or print the build command as the remedy. Small, two surfaces, no new machinery. (c) *Rejected on restraint grounds*: tracking the built parser (generated-output drift), and teaching the checker to inline-parse frontmatter (a second parser to keep in step — a new failure surface the current requirement does not earn).

## Questions Answered

- None new. Q1-Q5 were resolved in iterations 1-4 and remain ticked in the registry. This iteration answers no open strategy question; per the dispatch it broadens coverage and verifies prior findings.

## Questions Remaining

- None in the strategy registry. The two unranked candidates are listed under Recommended Next Focus.

## Ruled Out

- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched.
- Executing the checker against a tree without the built parser (the decisive crash reproduction): it would require deleting the built file inside the clone, and deletions are banned in this run; the arc is grounded by the tracked-file count, the load-time require structure, and Node module semantics, with the last hop marked inference.
- Spawning a second pristine sandbox clone: the sanctioned fixture plus `git ls-files` tracking evidence answers the pristine-state question without a new probe zone.

## Dead Ends

- None new. The mirror-content direction is *not* a dead end but is now fully mapped: no content drift exists at HEAD, so no content fix is owed there.

## Edge Cases

- Ambiguous input: the dispatch focus read around "[All tracked questions are resolved]" with "broaden coverage and verify prior findings"; the selected interpretation is iteration 5/6's carried recommendation (a), the mirror-model hermeticity audit, because it was the only unprobed recommendation with a concrete falsifiable question. Deferred: iteration 6's (b) codex-notice wording and (c) the First-Use doc gap.
- Contradictory evidence: the crosswalk states the three gates are wired into pre-commit and CI [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:211-212]; the pre-commit file runs two gates total, only one of them a mirror gate [SOURCE: .skilled/hooks/git/pre-commit:78-103]. Resolved in favor of the file evidence: accurate for CI, overstated for pre-commit. Recorded as finding 3, not as a blocker.
- Missing dependencies: no pristine tree without the built parser exists inside the sanctioned probe surface, and deletions are banned; the last hop of finding 1 stays inference. Second: `research/research.md` still does not exist although `progressiveSynthesis` is true [SOURCE: deep-research-config.json:15], and this dispatch's ALLOWED WRITE PATHS contain only this iteration file and the delta file — progressive synthesis remains with the workflow owner.
- Partial success: none; every planned probe executed and both gate runs returned clean exit codes.

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts, the one-record gateway event file (a transient temp file outside the repository), and the gateway's own writes. All clone probes were read-only: two `node` gate executions that read files and print status, `ls`, and `git ls-files`/`rev-parse`. No installs, builds or deletions ran this iteration; no researched file was modified.

## Sources Consulted

- `.skilled/bin/check-agent-mirror-sync.cjs:1-148` (full read, this iteration)
- `.skilled/bin/lib/mirror-sync-verify.cjs:1-364` (full read, this iteration)
- `.skilled/bin/agent-mirror-crosswalk.md:30-99, 149-161, 204-212` (formatted reads, this iteration)
- `.claude/agents/README.txt` (full read, this iteration)
- `.pi/SYNC.md:1-40` (head read, this iteration)
- `.skilled/hooks/git/pre-commit:60-103` (full tail read; file is 103 lines, this iteration)
- `.github/workflows/agent-mirror-sync.yml:20-50` (read, this iteration)
- `.github/workflows/spec-kit-check.yml:150-165` (read, this iteration)
- `.skilled/skills/system-spec-kit/package.json:1-30` (read, this iteration)
- `.skilled/skills/system-spec-kit/shared/package.json:14-22` (read, this iteration)
- `.skilled/skills/system-spec-kit/runtime/package.json:14-26` (read, this iteration)
- Clone probes (this iteration): HEAD equality `82a71c87…`; `check-agent-mirror-sync.cjs --all` exit 0; `agent-roster-mirror-check.cjs` exit 0; `git ls-files` dist count 0; `ls -ld` dir identities; `git ls-files -s` symlink modes.

## Assessment

- New information ratio: 0.88 (3 fully new findings + 1 partially new synthesis from 4 total = 3.5/4; no simplicity bonus — new file, tracking and probe evidence grounds it)
- Questions addressed: none open; broadened coverage of the agent mirror model and its fresh-clone runnability
- Questions answered: none new
- Questions remaining: none

## Reflection

- What worked and why: reading the gate's *dependency chain* instead of its behavior. The checker looks self-contained; following its two `require` hops surfaced the untracked build artifact in one pass, and the `git ls-files` count separated "exists on this machine" from "exists in a fresh clone" — the same trap iteration 6 named, met again in a new place. Reading the CI workflow next to the hook made the local/CI asymmetry visible immediately and explained why nobody has seen the crash. Executing both gates in the clone closed the content question with exit codes instead of prose.
- What did not work and why: nothing failed. The crash reproduction was deliberately not executed (deletion ban) and is recorded as an inference hop; the `rg -rn` invocation accidentally replaced matches with the letter `n` (`-r` = replace), which garbled one output line and was corrected by re-reading the same region with a context flag — a reminder that flag collisions in `rg` are silent.
- What I would do differently: probe lifecycle scripts (`postinstall`/`prepare`) in the same call as the tracking count — the two together form one claim, and splitting them cost a call. Also worth remembering for iterations 8-10: run gate scripts with `out=$(...)` + immediate `rc=$?` (done here) rather than pipes, which kept both exit codes clean.

## Recommended Next Focus

- (a) Iteration 6's (b): decide whether the codex drift-notice text ("re-run the codex hooks installer") is part of the F7 fix set or a separate notice-alignment fix; the notice matrix is complete.
- (b) Fold in the "First Use" documentation gap for the six non-OpenCode runtimes (iteration 5, finding 3) and the finding-4 candidates above into the single ranked fix set, each passed through `.skilled/repo-rules/prevent-overengineering.md`; with iterations 8-10 remaining, the fix-set review needs one dedicated slice.
- (c) Retest the fix-anchor pass (iteration 5, finding 5) only when implementation starts; not needed for ranking.
