# Iteration 4: Q5 closure - remaining walk stumbles and the final ranked fix set

## Focus

Q5, the last open key question: further stumbles on the walk (unclear errors, missing prerequisites, tracked clutter, absent credentials, per-runtime setup) and the smallest ranked fix set, each passed through `.skilled/repo-rules/prevent-overengineering.md`.

The dispatch Focus Area line still read "Q3, Q4, Q5 (3 of 5)", but the reducer's canonical question state resolves Q3 and Q4 at iteration 3 (`resolvedAtIteration: 3` in `findings-registry.json`) and lists only Q5 open. Selected interpretation: close Q5. The stale dispatch line is recorded under Edge Cases and as an observation in the delta for the reducer; no operator is present to arbitrate a stale prompt field.

Scope: bare-clone command probes, one `bun install` + `bun run build` bake-off inside the disposable clone, and read-only static reads. No repository writes outside this packet; the clone absorbed all build output.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 4 of 10), state JSONL, strategy, findings registry, iteration 3. Registry confirms `openQuestions` contains Q5 only.
2. Probed per-runtime wiring in `o2-fresh-clone`: seven runtime dirs, symlink vs mirrored layouts, per-runtime MCP config contents, and a census of all 468 tracked symlinks (8 dangling).
3. Probed the real first routed request in the bare clone: the trigger-index lookup and `skill-advisor.cjs advisor_recommend`, each with its exit code bound to the command in the same substitution.
4. Credentials probe: `.utcp_config.json` tracked shape (keys and placeholder count), per-runtime MCP configs, README credential/prerequisite lines.
5. sk-vision bake-off inside the clone: `bun install` (33 packages, exit 0), `bun run build` (exit 0), then the plugin symlink resolution check.
6. Read `.skilled/repo-rules/prevent-overengineering.md` in full (sections 1-2 drive the fix filter) and README.md:154-217 for the fix set's exact text targets.

## Findings

1. **The first routed request in a bare clone is not blocked; the advisor answers from a degraded local scorer.** `lookup-trigger-index.mjs` exited 0 with real results, and `skill-advisor.cjs advisor_recommend` exited 0 with `"status":"ok","degraded":true,"source":"local-scorer"` (recommendation: `sk-git` for the probe prompt). The pre-build error mode is therefore silent routing-quality reduction, not refusal; the machine-readable `degraded` flag is the only signal, and the documented build step is what upgrades it. [SOURCE: README.md:174-176] [INFERENCE: bare-clone probe outputs with exit codes, this iteration; advisor `dist` absence established by the iteration 2 checkpoint]

2. **Per-runtime wiring ships pre-wired with two mechanisms, and no runtime-specific setup step is needed for the first request in the sampled runtimes.** Seven runtime dirs are tracked (`.opencode`, `.pi`, `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes`); `.opencode` wires agents/bin/commands/hooks/scripts/skills/repo-rules through relative symlinks into `../.skilled/*`, while `.pi`, `.claude`, `.codex`, `.cursor` and `.devin` carry real mirrored directories plus their own config surfaces. All three sampled MCP configs (`.pi/mcp.json`, `.claude/mcp.json`, `.devin/mcp_config.json`) point at the same tracked launcher, `.skilled/bin/mcp-code-mode-launcher.cjs` (present in the clone), with `UTCP_CONFIG_FILE=.utcp_config.json`. README lists all seven runtimes up front, and its Verify step checks any of the seven MCP configs. [SOURCE: README.md:16] [SOURCE: README.md:183] [INFERENCE: clone listing and config-cat probes, this iteration]

3. **Tracked clutter with broken links: 8 of 468 tracked symlinks dangle in the clone, two also dangle in the maintainer worktree, and four point at the maintainer's absolute home path.** Known: `.opencode/plugins/sk-vision.js`. Shipped broken (worktree too): `.skilled/changelog/cli-jev/cli-usage` and `.skilled/changelog/cli-jev/parent`. Machine-bound, dead by construction for every external user: four symlinks under `specs/.../review/lineages/.../scratch/` whose targets sit under `/Users/michelkerkmeester/...`. No observed failure names any of these; the cost is visual and semantic noise on clone inspection. [INFERENCE: `git ls-files -s` census filtered to mode 120000 plus an existence loop over all 468 in the clone, and a worktree re-check of the two `.skilled` links, this iteration]

4. **Absent credentials are not a first-walk stumble; they gate optional integration surfaces only.** `.utcp_config.json` is tracked in the clone with top-level keys `load_variables_from`, `tool_repository`, `tool_search_strategy`, `manual_call_templates` and seven variable placeholders rather than secrets; the per-runtime MCP configs reference only the tracked launcher. README names per-integration keys (`figma_FIGMA_API_KEY`, `github_GITHUB_PERSONAL_ACCESS_TOKEN`, `webflow_WEBFLOW_TOKEN`) and states that MCP and cross-AI CLI skills need extra tooling or keys depending on the surface. Code Mode's `install` routine (builds Code Mode when its `dist` is missing or stale and registers it across the seven runtime configs, each write after its own approval) is documented in the skills catalog, not the numbered install steps. [SOURCE: README.md:1329-1331] [SOURCE: README.md:1505] [SOURCE: README.md:1254] [INFERENCE: clone `git ls-files --error-unmatch`, `jq keys` and placeholder-count probes, this iteration]

5. **The sk-vision delivery gap is now observed end-to-end, not inferred.** In the clone, `bun install` installed 33 packages (exit 0) and `bun run build` (exit 0) emitted `dist/plugin.js`, `dist/prompt-evidence.js`, `dist/vision-cli.js`, `dist/python/runtime.py` and `hooks/opencode/sk-vision.js`; the tracked `.opencode/plugins/sk-vision.js` symlink then resolves. Two commands under one minute repair the dangling symlink. The original "tests fail until dist is built" claim stays falsified, and the Python-spawning test roast stays deliberately unrun (its motivating hypothesis is dead and the delivery surface is now observed). [INFERENCE: clone `bun install` + `bun run build` + symlink-resolution probe, this iteration]

6. **Final ranked fix set (Q5), each move passed through prevent-overengineering sections 1-2 with its climbing sentence.** Every move starts at "change prose in place" - the cheapest move that requires a write - because "build nothing" leaves a named, observed failure in each case:
   - **F1 (P1) - README.md:162: drop the false advisor auto-build sentence.** The claim that the launcher "installs and builds its own runtime on first run" was falsified by the bare-clone launcher probe (iteration 2). Fails at build-nothing: the first failure a newcomer meets is an unexplained exit instead of the two-command step already present at README.md:174-175.
   - **F2 (P1) - README.md:160: state Code Mode's exact Node requirement beside the existing floors.** Fails at build-nothing: on a single-Node 20/22/26 machine the Code Mode launcher refuses before the first routed request (iteration 2 probe), and line 160 names no Node 24.x.
   - **F3 (P2) - introduce sk-vision's Bun prerequisite and its two-command setup where sk-vision is introduced.** New observed basis: without it the tracked plugin symlink dangles in every fresh clone; with it, two commands restore it (finding 5). Fails at build-nothing: plugin load and `/vision` fail with ENOENT while README prerequisites never mention Bun.
   - **F4 (P2) - move the hook-trust requirement into the numbered install region.** The trust line sits at README.md:197, mid-prose; the numbered steps (README.md:164-177) never mention it. Fails at build-nothing: a second clone silently skips every gate, audible only in a stderr NOTICE (iteration 3 finding 4).
   - **F5 (P3) - one clause on step 3 stating it requires step 2 completed.** Fails at build-nothing: running the advisor build before the spec-kit install exits 1 with TS2591/TS2503 (iteration 2 probe).
   - **F6 (P3, optional, weakest) - root tracked-clutter cleanup (36 empty `.skilled_skills_*` files, the two shipped-broken `.skilled/changelog` symlinks, the four machine-absolute spec-scratch symlinks).** No observed failure names any of it; that is the "while we're here" restraint signal, so the recommendation is: note it, do not build it unless an unrelated root cleanup is already happening (finding 3).
   - **Not earned:** any fix for the compiled-routing `z_archive` dependence (the authored tree ships complete; iteration 3); any fix for the advisor's degraded mode (the documented path's step 3 already builds the runtime); deleting the `.skilled/changelog` dangling links (no consumer is named).
   [SOURCE: .skilled/repo-rules/prevent-overengineering.md:53-66] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:90-101] [SOURCE: README.md:160] [SOURCE: README.md:162] [SOURCE: README.md:164-177] [SOURCE: README.md:197]

## Questions Answered

- Q5 - all five strategy key questions are now addressed: the walk stumbles are enumerated with costs, and the fix set is ranked and restraint-filtered.

## Questions Remaining

- None from the strategy's key-question registry. The reducer owns the tick; this iteration answers Q5.

## Ruled Out

- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, and the `z_archive`-absence claim all stayed untouched.
- The `bun test` Python-spawning roast was not run and is superseded: its motivating hypothesis (tests fail until `dist` is built) is falsified, and the delivery-surface question it was meant to close is answered by the observed build probe (finding 5).

## Dead Ends

- None new. Nothing found this iteration suggests a productive path for the falsified hypotheses.

## Edge Cases

- Ambiguous input: the dispatch Focus Area line ("Q3, Q4, Q5 (3 of 5)") is stale against the reducer's canonical question state (Q3/Q4 resolved at iteration 3, only Q5 open). Selected interpretation: Q5 closure; recorded as an observation for the reducer.
- Contradictory evidence: none new. The README.md:162 claim vs. the bare-clone probe contradiction remains as recorded in iteration 2.
- Missing dependencies: none blocking. The Python test roast remains deliberately unexecuted (superseded).
- Partial success: none; every planned probe and the bake-off completed.

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts, the one-record gateway event file (a transient temp file outside the repository), and the gateway's own writes. `bun install` and `bun run build` ran only inside the disposable `o2-fresh-clone`; the repository working tree was not mutated.

## Sources Consulted

- README.md:16, 154-217, 1254, 1329-1331, 1505 (reads and greps, this iteration)
- .skilled/repo-rules/prevent-overengineering.md (full, this iteration)
- o2-fresh-clone probes: per-runtime listings, MCP config cats, tracked-symlink census, trigger-index and advisor runs, `bun install` + `bun run build`, symlink-resolution check
- Packet state: config, state JSONL, strategy, findings registry `openQuestions`

## Assessment

- New information ratio: 0.77 (2 fully new + 4 partially new of 6 findings = 4.0/6 = 0.67 raw, plus the +0.10 simplicity bonus for closing the last open key question and collapsing the walk into one final, restraint-filtered fix set)
- Questions addressed: Q5
- Questions answered: Q5
- Questions remaining: none

## Reflection

- What worked and why: probing the actual first routed request instead of trusting the doc path - the two commands showed the failure mode is degradation, not refusal, which re-frames the risk; one bake-off call converted iteration 3's file-level sk-vision claim into observed behavior; and the whole-clone tracked-symlink census surfaced the machine-absolute links a targeted probe would have missed.
- What did not work and why: nothing failed this iteration; no retries were needed, and the earlier lesson about directory-scoped greps held.
- What I would do differently: capture the interpreter version with each runtime probe so floor-adjacent claims do not depend on checkpoint data.

## Recommended Next Focus

All five key questions are resolved; the stated scope is converged. Under the max-iterations stop policy, the only unprobed evidence slots left are (a) first-session behavior of the six non-OpenCode runtime CLIs against their tracked hooks and configs, and (b) a re-verification pass of the final fix set's exact text targets when implementation starts. If the orchestrator prefers to spend remaining iterations elsewhere, treat this lineage as scope-complete for Q1-Q5.
