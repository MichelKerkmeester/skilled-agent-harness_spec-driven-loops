# Iteration 9: The consolidated ranked fix set — the whole walk's stumbles folded into one ordered set

## Focus

All five strategy key questions stay resolved (`openQuestions: []`), so this iteration continues the dispatch's "broaden coverage and verify prior findings" and executes iteration 8's carried recommendation (a): fold F1-F6, F7, the new F7b, iteration 7's finding-4 candidates, and the First-Use documentation gap (iteration 5, finding 3) into the single ranked set, each passed through `.skilled/repo-rules/prevent-overengineering.md`. This is the fix-set slice iterations 3, 4 and 8 deferred; it produces the ranked answer the research topic asks for. Scope: repository reads only — README anchors, the pre-commit gate tail, the rule, the spec-kit build scripts — plus prior packet evidence; no installs, builds, deletions or wall-clock clone probes. Deferred to iteration 10: the tracked settings-defaults security flag (iteration 5, finding 4) and the Pi silent fail-open notice question (iteration 6, finding 4), both named in Recommended Next Focus.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 9 of 10, stopPolicy max-iterations, progressiveSynthesis true), state JSONL (8 iteration records + this run's `iteration_start`), strategy, findings registry (full read), iterations 6, 7 and 8.
2. Re-verified the fix anchors in one read: `README.md:150-239` — the prerequisites (160-162), the numbered install (164-177), the Git Hooks prose (189-208) and the First Use section (210-216).
3. Read the mirror gate's failure branch: `.skilled/hooks/git/pre-commit:55-103`.
4. Read `.skilled/repo-rules/prevent-overengineering.md` (full) and applied its §1 reversal-cost order and climbing-sentence discipline to every move.
5. Read the build surfaces that decide F7's wording: `.skilled/skills/system-spec-kit/package.json` scripts and `runtime/package.json` scripts (rg hits).
6. Probes: HEAD equality worktree vs `o2-fresh-clone` (both `82a71c87d035b0a1c7bc3a9405c116125e1ea6be`), `hook-registry.json:23` exact codex defaultMessage string, `research/research.md` absence, state-log iteration-record count (8 before this run).

Total tool calls this iteration ≈ 13 (state reads, 5 research actions, 3 artifact writes, gateway, verification) against the configured budget of 24.

## Findings

1. **The consolidated ranked fix set (the iteration's artifact).** Order is by (probability × cost) along the walk from clone to first spec packet, not by fix cost; when two ranks tie, the one-line prose move wins. Every move starts at the cheapest write and carries its climbing sentence — the observed failure that "build nothing" leaves:

| Rank | ID | Surface | The move | Why build-nothing fails (climbing sentence) | Severity |
|------|----|---------|----------|--------------------------------------------|----------|
| 1 | F1 | README.md:162 | delete the false advisor auto-build clause (change prose in place) | the bare-clone probe observed the launcher exit 1 with `Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'` for a user who trusts the sentence and skips steps 2-3 (iteration 2, finding 2) | P1 |
| 2 | F2 | README.md:160 | state Code Mode's exact Node range beside the existing floors (extend the line) | a single-Node 20/22/26 machine is refused outright — `no Node interpreter satisfies >=24.0.0 <25.0.0` — before the first routed request, and line 160 names no Node 24 (iteration 2, finding 6) | P1 |
| 3 | F7 | README step 2/3 region (169-176) | one clause naming the spec-kit workspace build whose product feeds the session-start adapters | five dist consumers degrade every session until someone builds: claude/codex/cursor/devin print drift notices, Pi fails open silently, and nothing on the documented path produces `runtime/dist` (iterations 5-6; iteration 7 finding 4(a)) | P2 |
| 4 | F7b | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23` (`runtimes.codex.defaultMessage`) | change one registry string + run the existing generator | codex's fallback sends users to a user-global config cleaner that reports OK while the dist-dependent failure persists (iteration 8, findings 2-3) | P2 |
| 5 | F3 | README/sk-vision doc line | document Bun + `bun install && bun run build` where sk-vision is introduced | the tracked `.opencode/plugins/sk-vision.js` symlink dangles in every fresh clone and `/vision` fails with ENOENT until two unstated commands (iteration 3, finding 1; iteration 4, finding 5) | P2 |
| 6 | F4 | README numbered steps | move/duplicate the hook-trust sentence into the numbered region | a user who honors only the numbered steps never sees `skilled.trustRepoHooks`; a second clone silently skips every gate, audible only in a stderr NOTICE (iteration 3, finding 4) | P2 |
| 7 | F8 | `.skilled/hooks/git/pre-commit` + `.skilled/bin/check-agent-mirror-sync.cjs` | distinguish "not checkable" from "desynced" and warn-skip the former | the gate's crash-vs-drift conflation hard-blocks with "staged agent files desync the mirrors" for a desync that does not exist; a Node uncaught throw exits 1, the same code as a drift finding (iteration 7, finding 1; hook lines 90-100) | P3 |
| 8 | F5 | README step 3 | one clause stating step 3 requires step 2 completed | running the advisor build before the spec-kit install exits 1 with TS2591/TS2503 (iteration 2, finding 4) | P3 |
| 9 | F9 | README First Use (212) | name the other six runtimes or point to the per-runtime sections | six of seven shipped runtimes have no documented first step while all seven appear in the Verify step and all seven configs ship (iteration 1, finding 1; README:183, 212-216) | P3 |
| — | F6 | repo root | (note-only) remove the 36 empty `.skilled_skills_*` files + the broken tracked symlinks | no observed failure names any of it — the "while we're here" restraint signal; bundle only with an unrelated root cleanup (iteration 4, finding 6) | P3-optional |

2. **Anchor re-verification at the shared HEAD: every fix anchor is unchanged.** Worktree and clone both sit at `82a71c87d035b0a1c7bc3a9405c116125e1ea6be` (probe this iteration). `README.md:162` still makes the auto-install/auto-build claim; `README.md:160` still carries the two-version line with no Node 24; the numbered steps (`164-177`) still omit hook trust; the trust sentence still sits at `197`; the First Use section still names only OpenCode at `212`; and the codex defaultMessage still reads `mk codex hook could not resolve; re-run the codex hooks installer with --check` at `hook-registry.json:23`. No fix text has drifted since iteration 5's anchor pass.

3. **F8's mechanism is an exit-code collision, and the same hook file already models the fix.** `.skilled/hooks/git/pre-commit:95` runs `node "$MIRROR_CHECKER"` and treats any nonzero exit as drift, printing the desync message at 97-99; an uncaught `require` throw in the checker also exits 1, so "cannot load the built parser" and "mirrors desynced" are indistinguishable to the hook. The comment-hygiene gate in the same file already distinguishes environmental non-execution from a finding — `# Exit 2 means no staged file was checkable` at 69-70, with its own branch at 71-76 — and the mirror branch already warn-skips a missing `node` at 93-94. F8 therefore reuses an existing convention on two small surfaces (checker exit code + hook branch), no new machinery.

4. **Ranking rationale: the order is the walk's order, with severity as the tiebreak.** F1 lands first in time (a reader meets Prerequisites before commands); F2 is the highest-frequency hard block at the first routed request; F7/F7b affect five runtimes every session and cost one clause plus one string; F3/F4 hit optional-but-shipped surfaces; F8's hard block requires staging an agent file, so it sits off the first-packet path and below the prose fixes it shares a cause with; F5 costs one debugging cycle; F9 is documentation coverage with no observed failure.

5. **The smallest set fits four surfaces and adds nothing.** README.md carries F1, F2, F4, F5, F7 and F9 (all prose, no new script); `hook-registry.json` plus the existing regenerator carries F7b; the sk-vision docs carry F3; the hook plus the mirror checker carry F8. No new file, dependency, script, option or abstraction is earned by any item; the six declined directions (z_archive fix, advisor degraded mode, tracking the built parser, inline frontmatter parsing, per-binding codex messages, claude/cursor rewording) stay declined for the reasons iterations 3-8 recorded.

## Questions Answered

- None new. Q1-Q5 were resolved in iterations 1-4 and remain ticked in the registry. This iteration resolves the last carried fix-set recommendation; per the dispatch it broadens coverage and verifies prior findings.

## Questions Remaining

- None in the strategy registry. Iteration 10 candidates: the settings-defaults security flag (iteration 5, finding 4) and the Pi silent fail-open notice question (iteration 6, finding 4).

## Ruled Out

- Re-probing the anchors beyond the fresh read: the read is the verification; a second pass is owed only at implementation start per iteration 8's (b).
- Writing `research/research.md` despite `progressiveSynthesis: true`: outside this dispatch's allowed write paths; progressive synthesis stays workflow-owned.
- Adding F6 to the implementation bundle: the "while we're here" restraint signal; no observed failure names it.
- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the z_archive-absence claim, the bun-test roasts, the check-git-hooks execution and the build re-run all stayed untouched.

## Dead Ends

- None new. The consolidated set resolves the carried fix-set recommendation; the remaining work is implementation-time anchor re-verification, not research.

## Edge Cases

- Ambiguous input: the dispatch focus around "[All tracked questions are resolved]" read with "broaden coverage and verify prior findings"; the selected interpretation is iteration 8's recommendation (a), the only remaining carried recommendation with a concrete deliverable. Deferred: the two iteration-10 candidates above.
- Contradictory evidence: none new. Iteration 7's candidate (a) quotes the root build command while the demonstrated dist producer is the runtime workspace's own `build` script; the set records both and defers the exact invocation to implementation verification rather than picking one unverified.
- Missing dependencies: `research/research.md` still does not exist although `progressiveSynthesis` is true [SOURCE: deep-research-config.json:15], and this dispatch's ALLOWED WRITE PATHS exclude it — progressive synthesis remains with the workflow owner. No clone probe was needed this iteration, so the fixture's non-pristine state is irrelevant here.
- Partial success: none; every planned read and probe executed.

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts, the one-record gateway event file (a transient temp file outside the repository), and the gateway's own writes. No clone probe ran this iteration; the only commands were read-only `rg`, `git rev-parse`, `date` and `node -e` metadata reads.

## Sources Consulted

- `README.md:150-239` (anchor re-verification read, this iteration)
- `.skilled/hooks/git/pre-commit:55-103` (failure-branch read, this iteration)
- `.skilled/repo-rules/prevent-overengineering.md` (full read, this iteration)
- `.skilled/skills/system-spec-kit/package.json:14-16` (scripts rg, this iteration)
- `.skilled/skills/system-spec-kit/runtime/package.json:16-17` (scripts rg, this iteration)
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23` (rg, this iteration)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-006.md`, `iteration-007.md`, `iteration-008.md` (carried recommendations, this iteration)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/findings-registry.json` (full read, this iteration)
- Probes (this iteration): HEAD prints for worktree and `o2-fresh-clone` (equal); state-log iteration-record count 8; `research/` listing shows no `research.md`.

## Assessment

- New information ratio: 0.50 (0 fully new, 4 partially new, 1 redundant from 5 findings = 0.4; +0.10 simplicity bonus for collapsing nine candidates and six declines into one ordered model without new external evidence)
- Questions addressed: none open; broadened coverage via the fix-set consolidation
- Questions answered: none new
- Questions remaining: none

## Reflection

- What worked and why: consolidating from the registry instead of re-deriving from the walks. The registry already carried each finding with its evidence and each fix with its climbing sentence, so one full read plus one anchor re-verification read was enough to fold nine items — the iteration's cost went into ordering and decline logic, not evidence gathering. Reading the hook tail in the same pass turned F8 from "option (b)" into a concrete two-surface change with an in-file precedent (the hygiene branch's exit-2 convention).
- What did not work and why: nothing failed. One near-miss: iteration 7's (a) names the root build command, but the root script (`tsc --build`, read this iteration) is not evidence that project references fan out to `runtime/dist`; the set records the demonstrated runtime-workspace producer and defers the exact invocation rather than promoting an unverified command.
- What I would do differently: keep the fix-set slice from accumulating across iterations 3-8 — the first F-items were written at P1-P3 in iteration 3 and only got their final rank in iteration 9, five iterations later; a dedicated consolidation at iteration 4 would have exposed F7/F7b before the dist chain was fully mapped.

## Recommended Next Focus

- (a) Iteration 10: decide the two remaining flagged items — the tracked settings-defaults security flag (iteration 5, finding 4) and whether Pi's silent fail-open earns a notice line (iteration 6, finding 4) — and close the run's telemetry.
- (b) At implementation start, re-run the fix-anchor verification before applying any F-fix, and pin the exact spec-kit build invocation F7 will name (root `npm run build` vs the runtime workspace build) from a clean-tree probe or the tsconfig project references.
- (c) No widening owed: the set's four surfaces are the whole smallest set; attaching any declined direction (z_archive, parser tracking, per-binding messages) would exceed what the observed failures earn.
