# Iteration 3: sk-vision dist gap, compiled-routing dependence, worktree and hook trust (Q3, Q4; Q5 progressed)

## Focus

Q3, Q4 and Q5 under strategy Next Focus. Q3: are the sk-vision `vision-runtime/dist` build gap and the compiled-routing rebuild dependence on `specs/sk-doc/z_archive` real today, and when does a newcomer hit them? Q4: are worktree provisioning and hook trust (`skilled.trustRepoHooks`) real stumbles on the first-packet path, and what does each cost? Q5 was progressed with additional stumble evidence and a provisional ranked fix set passed through `prevent-overengineering.md`.

Scope: static and clone probes only (no installs or builds were run this iteration). Claims about sk-vision test behavior are file-level conclusions; a runtime `bun test` bake-off is carried to the next iteration.

## Actions Taken

1. Read externalized state: config, state JSONL, strategy, findings registry, iterations 1-2 (iteration 3, focus Q3/Q4/Q5, session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`).
2. Read `.skilled/bin/lib/compiled-route-layout.cjs` in full (206 lines), `compiled-route-sync.cjs:1-60`, and grepped for `AUTHORED_PROGRAM_DIR` consumers and compiled-route invocations.
3. Clone probes: confirmed the exact authored program path `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` exists in both worktree and `o2-fresh-clone`; counted tracked `z_archive` files (6996).
4. Read the hook trust blocks in `.skilled/scripts/git-hooks/pre-commit:30-54`, `:488-582` and `post-commit:30-53`, `install-git-hooks.sh:1-60`, and README.md:154-241.
5. sk-vision probes: package manifest, tree layout, `dist` absence in both trees, tracked plugin symlink, `git check-ignore`, test imports, `runtime.test.ts:8-30`, `build.ts:68`, SKILL.md build/venv/prerequisite lines.
6. Read sk-git `SKILL.md:207-224` (worktree ask-first rule and launch wrapper) and listed `.skilled/bin/worktree-*.sh`.
7. Read `.skilled/repo-rules/prevent-overengineering.md` in full; re-verified the 36 tracked `.skilled_skills_*` clutter files.

## Findings

1. **The sk-vision dist gap is real, and it lands at plugin load, not at test time.** `.opencode/plugins/sk-vision.js` is a tracked symlink (git mode 120000) pointing at `../skills/sk-vision/vision-runtime/dist/plugin.js`; the target does not exist in the worktree or in the fresh clone, and `dist` is not gitignored (check-ignore exits 1) -- it is simply never built. The package's `main`/`exports`/`files` all point into `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/package.json:25] and `build` emits `dist/plugin.js` [SOURCE: .skilled/skills/sk-vision/vision-runtime/scripts/build.ts:68]. SKILL.md states the OpenCode adapter loads through `.opencode/plugins/sk-vision.js` resolving to `vision-runtime/dist/plugin.js` [SOURCE: .skilled/skills/sk-vision/SKILL.md:290]. Cost: on a fresh clone the symlink dangles, so loading the plugin (and any `/vision` use) fails with ENOENT until `bun install && bun run build` [SOURCE: .skilled/skills/sk-vision/vision-runtime/package.json:11-12]. A newcomer does not hit this in README steps 1-3 (sk-vision is not in that path); they hit it when they enable or use sk-vision. [INFERENCE: git ls-files -s .opencode/plugins/sk-vision.js (120000), `find` for dist empty in repo and clone, clone symlink probe, this iteration]

2. **The stated "sk-vision tests failing until vision-runtime/dist is built" hypothesis is not supported.** Every test file imports source or spawns source paths: `src/model-modality.test.ts` imports `./model-modality.js`; `python/runtime.test.ts` resolves an interpreter from `~/.cache/sk-vision/venv`, then a repo `.venv`, then system `python3` (none shipped) and spawns `REPO/python/runtime.py` -- the source file, not `dist/python/runtime.py` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22] [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:75]. No test or hook references a `dist/` path (grep this iteration: only `build.ts:68` mentions dist). So the build gap cannot be the cause of test failures as stated; the dist artifact's consumers are delivery surfaces (plugin, CLI, devin hook), not the test suite. Residual uncertainty: a runtime `bun test` bake-off (with and without a build) was not executed this iteration, so this conclusion is file-level, not observed test output.

3. **The compiled-routing dependence on `specs/sk-doc/z_archive` is real and load-bearing, but it does not break a fresh clone.** `AUTHORED_PROGRAM_DIR` is hardcoded to `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program` [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:53-55]; the sync tool derives `IMPL_ROOT` from it and traces the authored closure into the promoted runtime under `.skilled/bin/lib/compiled-routing` [SOURCE: .skilled/bin/compiled-route-sync.cjs:40] [SOURCE: .skilled/bin/compiled-route-sync.cjs:3-17], and the guard reads the same authored root [SOURCE: .skilled/bin/compiled-route-guard.cjs:39]. The pre-commit route-remint gate also reads the authored program dir and blocks the commit when it cannot resolve it [SOURCE: .skilled/scripts/git-hooks/pre-commit:539] [SOURCE: .skilled/scripts/git-hooks/pre-commit:488-490]. That tree is fully tracked (6996 `z_archive` files) and the exact path was confirmed present in `o2-fresh-clone`, so the fresh-clone default path never misses it. The honest cost is structural fragility, not a current stumble: moving or deleting the archived spec tree (e.g., a specs cleanup) makes sync fail and blocked commits appear. The sync tool's own header acknowledges the authored source sits under a "mutable documentation tree" [SOURCE: .skilled/bin/compiled-route-sync.cjs:6-9], and it ships a `--verify` mode that simulates the move [SOURCE: .skilled/bin/compiled-route-sync.cjs:20-24]. [INFERENCE: directory-presence probes in worktree and clone, this iteration]

4. **Hook trust is code-enforced, and its cost on a secondary checkout is silent degradation made audible only by a NOTICE.** Both hooks compare the hook script's git common dir with the checkout's; when they differ and `git config --local skilled.trustRepoHooks` is not exactly `true`, `SOURCE_ROOT` becomes `.skilled-untrusted` and the checks are skipped [SOURCE: .skilled/scripts/git-hooks/pre-commit:30-46] [SOURCE: .skilled/scripts/git-hooks/post-commit:30-46]. The skip is not silent: the hook prints `NOTICE [gate:hook-trust]: this clone is not trusted, so the pre-commit checks were skipped.` plus the enable command [SOURCE: .skilled/scripts/git-hooks/pre-commit:48-54]. The installer copies the hooks and selects the source root, and the README documents the machine-wide install and the trust requirement in the Git Hooks section [SOURCE: .skilled/scripts/install-git-hooks.sh:22-60] [SOURCE: README.md:189-197]. On the first-packet path the cost is near zero (creating a spec packet needs no commit); the cost lands at the first commit from a second clone or a moved checkout, where all gates -- including comment hygiene -- are skipped and only a stderr notice records why. The trust line is prose mid-section, not a numbered install step, so a user who honors only the numbered steps never sees it [SOURCE: README.md:164-177] [SOURCE: README.md:197].

5. **Worktree provisioning is not on the first-packet path; it is a deferred mandatory choice on the first git write.** The README install steps create no worktree [SOURCE: README.md:164-177]. sk-git owns worktrees and makes the worktree-vs-current-branch question mandatory whenever git-workspace work begins; the AI must ask and wait (A/B) [SOURCE: .skilled/skills/sk-git/SKILL.md:207-216]. The launch wrapper (`worktree-session.sh`, scripts exist under `.skilled/bin/`) is operator opt-in and runs pre-session; it symlinks shared `node_modules`/`dist` into each worktree, and the skill documents a known gap where those wholesale links do not satisfy its own isolation invariant [SOURCE: .skilled/skills/sk-git/SKILL.md:220-224]. Cost on the first packet: none. Cost immediately after: one mandatory, unexplained-to-a-newcomer choice (confused-by-choice), and a wrapper session started before installs links nothing. Classify as confused/deferred, not blocked.

6. **Further stumbles found on the walk.** (a) sk-vision requires Bun (`engines.bun >= 1.0.0`, `build`/`test` scripts are `bun run`/`bun test`), but README prerequisites list only Node, npm, git and a POSIX shell -- no `bun` string appears anywhere in README.md [SOURCE: .skilled/skills/sk-vision/vision-runtime/package.json:11-12] [SOURCE: .skilled/skills/sk-vision/vision-runtime/package.json:45-46] [SOURCE: README.md:158-162]. A newcomer without Bun hits `command not found` at the first sk-vision build. (b) First sk-vision model load downloads ~3.9 GB of weights and may provision a venv via `uv`, requiring Apple Silicon or an Ampere+ GPU -- documented inside sk-vision's SKILL.md but absent from the root install path [SOURCE: .skilled/skills/sk-vision/SKILL.md:242] [SOURCE: .skilled/skills/sk-vision/SKILL.md:230-251]. (c) SKILL.md:208 names `.skilled/plugins/sk-vision.js` as the plugin load path; that path does not exist -- the shipped shim is `.opencode/plugins/sk-vision.js` [SOURCE: .skilled/skills/sk-vision/SKILL.md:208] [SOURCE: .skilled/skills/sk-vision/SKILL.md:290]. (d) Re-verified: 36 empty tracked `.skilled_skills_*` files at the repository root, still unexplained by any document [INFERENCE: `git ls-files | grep -c '^\.skilled_skills'` = 36, this iteration].

7. **Provisional ranked fix set (Q5 progress), each passed through `prevent-overengineering.md` §1/§2.** Ranked by user impact; move + climbing sentence written for every move past "build nothing":
   - **F1 (P1): delete the false auto-build sentence and state the real build requirement.** Move: change prose in place (one sentence). What fails at the cheaper move: doing nothing leaves README.md:162 promising an auto-install/auto-build that the bare-clone probe falsified (iteration 2), so the first-run failure stays. [SOURCE: README.md:162]
   - **F2 (P1): add Code Mode's exact Node 24.x requirement to README prerequisites.** Move: extend the existing prerequisites line. Cheaper move (build nothing) fails because a single-Node 20/22/26 machine is refused by the launcher before the first routed request (iteration 2 probe), and README.md:160 never mentions Node 24.
   - **F3 (P2): document the sk-vision setup (Bun prerequisite + `bun install && bun run build`) where the skill is introduced.** Move: one README/skill line beside the existing sk-vision docs; no new mechanism. What fails at "build nothing": the tracked plugin symlink dangles in every fresh clone (finding 1), so `/vision` fails with ENOENT for any user who follows the skill without the unstated build.
   - **F4 (P2): move the hook-trust command into the numbered install steps.** Move: relocate/duplicate one existing sentence. Cheaper move fails because the trust requirement only appears mid-prose [SOURCE: README.md:197] while the numbered steps never mention it [SOURCE: README.md:164-177]; a second clone silently skips all gates.
   - **F5 (P3): one clause on README step 3 stating it requires step 2 completed.** Move: change prose in place. Cheaper move fails because running the advisor build before the spec-kit install exits 1 with TS2591/TS2503 (iteration 2 probe).
   - **F6 (P3, optional): remove the 36 empty root clutter files from tracking.** Move: change tracked content (git rm of empty files). This is the weakest fix: doing nothing costs only visual noise, and no observed failure names it. Recommended only if bundled with an unrelated root cleanup; otherwise note it, do not build it (prevent-overengineering "while we're here" signal).
   - Not earned: any fix for the compiled-routing `z_archive` dependence. The authored tree ships in the clone (finding 3), so no requirement exists today that a fix would serve; record the fragility and move on. "Build nothing" is the correct move here.

## Ruled Out

- "sk-vision tests fail until `vision-runtime/dist` is built": falsified at file level. Tests import `src` and spawn `python/runtime.py`; no test consumes `dist` [SOURCE: .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-22]. The dist consumer is the plugin/CLI delivery surface, not the test suite.
- "The compiled-routing rebuild breaks a fresh clone because the authored source under `specs/sk-doc/z_archive` is absent": falsified. The path is tracked (6996 files) and present in the clone; sync, guard and the pre-commit gate all resolve it there.
- Runtime `bun test` roast of sk-vision was planned and not executed (tool-call budget and the clone's missing node_modules for that workspace); carried to next iteration rather than inferred away.

## Dead Ends

- None new. No exhausted-approach direction was retried: the docs-tree, PUBLIC-RELEASE, root-install and Node-18 directions stayed untouched.

## Edge Cases

- Ambiguous input: none. Dispatch focus (Q3, Q4, Q5) was explicit and matched strategy Next Focus.
- Contradictory evidence: one resolved, one recorded. Resolved: the research topic's sk-vision test claim vs. the observed import/spawn targets -- observed files win; the claim is falsified with the residual uncertainty that no test run was executed (finding 2). Recorded: README's machine-wide hook install vs. the trust gate's skip behavior -- both are true and coexist; the README prose does describe the trust requirement, so this is a placement problem, not a false claim.
- Missing dependencies: none required for this iteration's conclusions. sk-vision's Bun runtime is present on this machine (1.3.9) but is a documented gap for others (finding 6a).
- Partial success: none. All planned reads and probes completed.

## SCOPE VIOLATIONS

None. All probes were read-only (repository and `o2-fresh-clone`); the only writes are this packet's iteration file, delta file, and the append gateway's own writes.

## Sources Consulted

- .skilled/bin/lib/compiled-route-layout.cjs (full)
- .skilled/bin/compiled-route-sync.cjs:1-60
- .skilled/bin/compiled-route-guard.cjs:39 (grep)
- .skilled/scripts/git-hooks/pre-commit:30-54, 488-539 (grep)
- .skilled/scripts/git-hooks/post-commit:30-53 (grep)
- .skilled/scripts/install-git-hooks.sh:1-60
- README.md:154-241
- .skilled/skills/sk-vision/vision-runtime/package.json (full)
- .skilled/skills/sk-vision/vision-runtime/scripts/build.ts:68 (grep)
- .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts:8-30, 75
- .skilled/skills/sk-vision/SKILL.md:208, 230-251, 264, 288-290 (grep)
- .skilled/skills/sk-git/SKILL.md:207-224 (grep)
- .skilled/repo-rules/prevent-overengineering.md (full)
- Fresh-clone probes: authored-dir presence, dist absence, plugin symlink, tracked z_archive count, `.skilled_skills_*` count (all read-only)

## Assessment

- New information ratio: 0.89 (4 fully new, 3 partially new of 7 findings = 5.5/7 raw = 0.79, plus the +0.10 simplicity bonus for collapsing the five hypothesis stumbles into three verified mechanisms, one falsified claim, and one deferred-by-design behavior)
- Questions addressed: Q3, Q4, Q5
- Questions answered: Q3, Q4
- Questions remaining: Q5 (walk closure and final fix ranking)

## Reflection

- What worked and why: chasing each hypothesis down its consumer chain. The sk-vision claim died at the import list while the real breakage surfaced at the tracked plugin symlink -- one probe separated the stated mechanism from the actual one. Likewise, reading the trust gate and the pre-commit consumers together showed the z_archive dependence ships in the clone, converting a hypothesized blocker into a named, unfixable-today fragility.
- What did not work and why: a repo-wide `grep -rln trustRepoHooks .` swallowed 322 seconds by scanning spec packets before I scoped to `.skilled`, and a follow-up call cost another 102 seconds. Recursive greps over this repository must be directory-scoped from the first call; the time went out of the research budget, not the evidence.
- What I would do differently: scope every recursive grep by directory in the same call that needs it; and run the sk-vision `bun install && bun test` bake-off with a bounded timeout inside the clone to convert findings 1-2 from file-level to runtime evidence.

## Recommended Next Focus

Q5 closure. Walk the remaining candidate stumbles explicitly: per-runtime setup beyond OpenCode (six other runtime configs), credential/network prerequisites (Code Mode `.env`/`.utcp_config.json`, sk-vision's 3.9 GB weight download), platform requirements (GPU / Apple Silicon), and any first-packet failure the walk has not touched. Then finalize the ranked fix set from finding 7 against `prevent-overengineering.md`, and run the sk-vision `bun install && bun run build && bun test` probe (before/after build) to close finding 2's residual uncertainty. Also verify the final fix ranking against the now-recorded costs: the P1 pair (README auto-build falsehood, Node 24 absence) remains the highest user-impact pair observed across iterations 1-3.
