# Iteration 6: Dist-based session-start remedy chain — what clears the drift notices, who names a working remedy, and what the documented install leaves unbuilt

## Focus

All five strategy key questions stay resolved (`openQuestions: []`), so this iteration continues the broadened coverage the dispatch asks for and takes iteration 5's recommended next focus (a): verify whether the spec-kit workspace build is the intended remedy for the dist-based session-start hooks, whether one prose clause in README step 3 should name it (candidate F7, P3), and when the drift notices are judged a defect. The iteration resolves three sub-questions: (i) which build produces `runtime/dist/hooks/*` and whether step 2 already provisions its toolchain; (ii) what each runtime's drift fallback tells the user and whether that advice actually repairs the gap; (iii) which runtimes consume the dist without any notice. Scope: repository reads plus read-only clone probes; the two adapter executions ran against empty stdin inside the disposable clone. No installs or builds ran this iteration.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 6 of 10, stopPolicy max-iterations, progressiveSynthesis true), state JSONL (5 iteration records), strategy, findings registry (`openQuestions: []`), iteration 5.
2. Read the workspace manifests: `.skilled/skills/system-spec-kit/package.json` (npm workspaces, postinstall, devDependencies) and `.skilled/skills/system-spec-kit/runtime/package.json` (build script, devDependencies) — the build chain for the dist hooks.
3. Read the drift fallbacks in `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` and `.claude/settings.json` (rg plus block reads), and compared their remedy texts.
4. Read `.skilled/bin/install-codex-hooks.mjs` (header plus a `dist|build|tsc` scan) to test whether the codex notice's named remedy can produce `runtime/dist`.
5. Probed the pi chain: `.pi/extensions/session-start-context.ts` (numbered read), `.pi/extensions/lib/claude-hook-adapter.ts` (numbered read), `.pi/extensions/README.md` (rg hits), and a recursive `mk-hook-drift` search across `.pi`.
6. Probed the clone: `runtime/dist/hooks` tree listing, `git ls-files` for tracked dist files in the main checkout, and execution of the codex and cursor `session-start.js` adapters.
7. Re-read README.md:150-204 to re-ground the quick-start steps and their exact anchors.

## Findings

1. **The drift-clearing remedy is a single workspace build whose toolchain step 2 already provisions, and the built adapters execute.** `system-spec-kit` is an npm workspace root covering `shared`, `runtime` and `runtime/cli` [SOURCE: .skilled/skills/system-spec-kit/package.json:6-10]; its root devDependencies carry `typescript` [SOURCE: .skilled/skills/system-spec-kit/package.json:47-51], and README step 2 runs `npm --prefix .skilled/skills/system-spec-kit install` [SOURCE: README.md:169-170]. The runtime workspace's `build` script is `npm run prepare-build && tsc --build && node scripts/finalize-dist.mjs` [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:17]. Its product is the `runtime/dist/hooks/{claude,codex,cursor,devin}` tree: the main checkout tracks 0 files under `runtime/dist` (`git ls-files` probe, this iteration), and the probe clone's builds from earlier iterations hold it; both adapters probed execute — codex `session-start.js` exits 0 with empty stdout on empty stdin, cursor `session-start.js` prints `{"permission":"allow"}` and exits 0 in the clone [INFERENCE: clone probe this iteration; the clone's dist comes from prior iterations' builds, so this shows the built product runs, not that step 2 alone suffices]. Remedy-chain conclusion: one command clears the drift class for every dist consumer, and step 2 makes it runnable, but nothing on the documented path invokes it.

2. **The documented path never runs that build; README's only build command is the advisor workspace.** Step 3 builds only `.skilled/skills/system-skill-advisor/runtime` [SOURCE: README.md:172-176]. An rg pass over README for `run build` returned only line 175 (the advisor build), and the sentence "No global TypeScript needed. The builds use the TypeScript the spec-kit workspace installs" [SOURCE: README.md:162] assumes builds that the numbered steps never issue for the spec-kit runtime. Candidate F7 therefore stays a one-clause prose fix: step 2 already installs the workspaces and their TypeScript, so naming the build costs one line and earns no new script, hook or postinstall step. (Partially new: iteration 5 established no build on the documented path; this iteration adds the step-2 sufficiency evidence.)

3. **The drift notices name three different remedies, and codex's advice cannot work.** Claude's SessionStart fallback says "rebuild the spec-kit runtime or restore the missing adapter" [SOURCE: .claude/settings.json:133]; cursor's says the same [SOURCE: .cursor/hooks.json:6]; devin's names the exact remedy — "run npm run build in the spec-kit runtime package" [SOURCE: .devin/hooks.v1.json:8]; codex's says "re-run the codex hooks installer with --check" [SOURCE: .codex/hooks.json:8]. That installer reconciles the user-global Codex hook config ("Remove repo-owned hooks from Codex's user-global hook file" [SOURCE: .skilled/bin/install-codex-hooks.mjs:1-14]) and contains no build or dist step — a `dist|build|tsc` scan hit only `buildPerEvent` label helpers [SOURCE: .skilled/bin/install-codex-hooks.mjs:211]. Running it cannot produce `runtime/dist/hooks/*.js`, so a Codex user on a fresh clone is sent to a tool that will report config health while the drift persists. This also corrects iteration 5's notice matrix: `.claude` itself consumes dist hooks with a drift notice, so five runtimes carry notices, not three.

4. **Pi is the sixth dist consumer and the only one with no notice at all — it fails open silently.** Pi's `session-start-context.ts` calls `runClaudeHookAdapter(ctx.cwd, "session-prime.js", ...)` [SOURCE: .pi/extensions/session-start-context.ts:36-41] and returns quietly when the adapter yields nothing [SOURCE: .pi/extensions/session-start-context.ts:42]; the adapter resolves its target under `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude` [SOURCE: .pi/extensions/lib/claude-hook-adapter.ts:41-45] and returns `null` on spawn error, nonzero exit or exception [SOURCE: .pi/extensions/lib/claude-hook-adapter.ts:55-58]. The extension README documents that every handler "wraps its call in try/catch and fails open" [SOURCE: .pi/extensions/README.md:32] and maps `session-start-context.ts` to the claude dist's `session-prime.js` [SOURCE: .pi/extensions/README.md:75]; a recursive `mk-hook-drift` search over `.pi` returned nothing (probe this iteration). On a fresh clone a Pi user therefore loses session-start context (compact recovery, resume reminder) with no diagnostic line, while Claude/Codex/Cursor/Devin users each get one [INFERENCE: file-level chain above; no Pi session was executed]. Ranking by cost to the newcomer: a silent loss with no remedy hint outranks a notice that at least names the failing adapter, and codex's misdirecting notice outranks the correct-but-generic claude/cursor text.

## Questions Answered

- None new. Q1-Q5 were resolved in iterations 1-4 and remain ticked in the registry. This iteration answers no open strategy question; per the dispatch it broadens coverage and verifies prior findings.

## Questions Remaining

- None in the strategy registry. Optional unprobed slots are listed under Recommended Next Focus.

## Ruled Out

- Re-running the spec-kit runtime workspace build end-to-end in the clone to re-prove the devin-named remedy command: the clone is not pristine (prior iterations installed its node_modules and produced its dist), so a re-run would not establish the claim that matters — that the documented step 2 is sufficient. The build script, the present `dist/hooks` tree and the two executed adapters already ground the remedy chain; the step-2 sufficiency statement stays an explicit inference.
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched.

## Dead Ends

- None new.

## Edge Cases

- Ambiguous input: the dispatch Focus Area read "[All tracked questions are resolved]" with "broaden coverage and verify prior findings"; the selected interpretation is iteration 5's recommended next focus (a) — the dist remedy chain — because it decides whether F7 is a real fix. Deferred: iteration 5's focus (b) mirror-model hermeticity audit, which no evidence this iteration made more urgent.
- Contradictory evidence: codex's text says the hooks installer is the remedy, while the installer's own header and function inventory show it only reconciles hook configuration. Resolved in favor of the file evidence (finding 3); the notice is wrong, not the installer.
- Missing dependencies: `research/research.md` does not exist although `progressiveSynthesis` is true [SOURCE: deep-research-config.json:15], and this dispatch's ALLOWED WRITE PATHS contain only this iteration file and the delta file. Progressive synthesis therefore stays with the workflow owner; this iteration's findings land here and in `deltas/iter-006.jsonl` only. Second: the probe clone is no longer a pristine fresh clone (earlier iterations installed and built it), so fresh-clone claims rest on `git ls-files` counts from the real checkout plus hook-config text, not on the clone's filesystem state.
- Partial success: none; every planned probe executed. The build re-run was deliberately skipped (see Ruled Out), not failed.

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts, the one-record gateway event file (a transient temp file outside the repository), and the gateway's own writes. All clone probes were read-only; the two adapter executions ran inside the disposable clone against empty stdin and wrote nothing to the repository tree. No installs or builds ran this iteration.

## Sources Consulted

- README.md:150-204 (re-read for step anchors, this iteration)
- .skilled/skills/system-spec-kit/package.json (full read, this iteration)
- .skilled/skills/system-spec-kit/runtime/package.json (full read, this iteration)
- .codex/hooks.json (full read, this iteration)
- .cursor/hooks.json (full read, this iteration)
- .devin/hooks.v1.json (full read, this iteration)
- .claude/settings.json:116-238 (rg hits + SessionStart block, this iteration)
- .pi/extensions/session-start-context.ts:1-50 (numbered read, this iteration)
- .pi/extensions/lib/claude-hook-adapter.ts:38-60 (numbered read, this iteration)
- .pi/extensions/README.md:32, 75 (rg hits, this iteration)
- .skilled/bin/install-codex-hooks.mjs:1-30 plus `dist|build|tsc` scan (this iteration)
- o2-fresh-clone probes: `dist/hooks` tree listing, codex and cursor `session-start.js` executions, `git ls-files` dist count (this iteration)

## Assessment

- New information ratio: 0.88 (3 fully new + 1 partially new of 4 findings = 3.5/4; no simplicity bonus — the iteration carries new file and probe evidence)
- Questions addressed: none open; broadened coverage of the dist-based session-start remedy chain and notice matrix
- Questions answered: none new
- Questions remaining: none

## Reflection

- What worked and why: following the remedy text rather than the finding. Reading each runtime's fallback string side by side made the inconsistency visible in one pass, and testing codex's named tool against its own header and function inventory falsified its remedy claim cheaply and decisively. Reading the pi adapter and extension as a pair separated "documented fail-open" from "silent fail-open" before it could be overclaimed.
- What did not work and why: nothing failed; the deliberate non-execution of the build re-run was an economy decision recorded under Ruled Out, not a failure.
- What I would do differently: judge "what a fresh clone has" from `git ls-files` and hook-config text first — the clone's `runtime/dist` exists only because earlier iterations built it, and that trap nearly recurred when listing the dist tree. Also, the install-codex-hooks check should have been batched into the same probe as the fallback reads, since the two together form one claim.

## Recommended Next Focus

- (a) Audit hermeticity of the mirror model against an external clone: the `.claude/agents` guarded fork and mirror-parity gates (does a fresh clone ever fail a sync gate for content it did not touch?) — carried from iteration 5 (b).
- (b) Decide whether the codex drift-notice text should be part of the F7 fix set (align it with devin's exact command) or reported separately; the notice matrix (five notices, one silent) is now complete enough to rank.
- (c) The "First Use" documentation gap for the six non-OpenCode runtimes (iteration 5, finding 3) is still unranked; fold it into the fix set review before the final iterations run out.
- (d) At implementation start, re-run the fix-anchor verification (iteration 5, finding 5) before applying F1-F7.
