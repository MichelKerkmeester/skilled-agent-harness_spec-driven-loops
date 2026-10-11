# Iteration 5: Broadened coverage - non-OpenCode first-session surfaces and fix-anchor re-verification

## Focus

All five strategy key questions are resolved (registry `openQuestions: []`), so the dispatch asked to broaden coverage and verify prior findings. Iteration 4's recommended next focus named the two remaining evidence slots: (a) first-session behavior of the six non-OpenCode runtimes against their tracked hooks and configs, and (b) a re-verification of the fix set's exact text targets. This iteration takes both: it reads the SessionStart hook chains of `.claude`/`.codex`/`.cursor`/`.devin`/`.opencode`/`.hermes`, resolves how a fresh clone ever gets its git hooks installed (README claims "The first AI session you open in the main checkout installs this repository's git hooks" [SOURCE: README.md:191]), measures the untracked `runtime/dist` dependency those chains carry, samples the shipped per-runtime settings defaults, and re-confirms every F1-F6 text anchor. Scope: read-only probes in the `o2-fresh-clone` fixture plus repository reads; no installs or builds were needed.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 5 of 10, stopPolicy max-iterations), state JSONL, strategy, findings registry (`openQuestions: []`), iteration 4.
2. Probed the clone's seven runtime directories: symlink vs real-dir layout, tracked file counts, top-level surfaces, and hook/settings file inventory.
3. Read the sampled session-hook configs (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`) plus `.claude/SYNC.md`'s mirror model.
4. Read `.skilled/bin/check-git-hooks.sh` (1-165) and `.skilled/scripts/install-git-hooks.sh` (1-55), and the spec-kit package scripts (root and runtime workspace).
5. Probed dist tracking (`git ls-files` counts for `runtime/dist` and `runtime/cli/dist`) and cross-referenced the remaining runtimes' wiring (`.opencode/plugins/session-cleanup.js:35`, `.hermes/plugins/repo-guards/__init__.py:115`, `.pi/extensions/README.md`).
6. Re-read README.md:154-200 to re-verify the fix set's text anchors against their exact current lines.

## Findings

1. **The first-session hook-install claim has a working, trust-independent mechanism.** `check-git-hooks.sh` selects its source root by sentinel file only, with no trust check [SOURCE: .skilled/bin/check-git-hooks.sh:37-49]; when a versioned hook has no matching effective symlink it prints one warning line and - with live-sync enabled and this checkout being the main checkout (`_self_dir == _self_common`) - self-heals by running `$SOURCE_ROOT/scripts/install-git-hooks.sh` and printing `auto-installed git hook symlinks (self-heal)` [SOURCE: .skilled/bin/check-git-hooks.sh:129-160]. The guard is wired into the SessionStart chains of `.claude` [SOURCE: .claude/settings.json:143], `.codex` [SOURCE: .codex/hooks.json], `.cursor` [SOURCE: .cursor/hooks.json], `.devin` [SOURCE: .devin/hooks.v1.json], `.opencode` [SOURCE: .opencode/plugins/session-cleanup.js:35] and `.hermes` [SOURCE: .hermes/plugins/repo-guards/__init__.py:115]; `.pi` references the guard from its extensions documentation [SOURCE: .pi/extensions/README.md]. This resolves the tension between README.md:191 and iteration 3's trust finding: `skilled.trustRepoHooks` gates the check scripts in secondary checkouts, not this self-heal. Remaining cost: the install is still prose-only (README.md:189-197) and skipped for linked worktrees by design [SOURCE: .skilled/bin/check-git-hooks.sh:14-17].

2. **Dist-based SessionStart adapters degrade to one-line drift notices until the spec-kit runtime is built, and the documented path never builds it.** The `.codex`, `.cursor` and `.devin` chains run `node .skilled/skills/system-spec-kit/runtime/dist/hooks/<host>/session-start.js` with a `||` fallback that prints `mk-hook-drift ...` to stderr and hands the agent a rebuild-the-runtime note [SOURCE: .codex/hooks.json] [SOURCE: .cursor/hooks.json] [SOURCE: .devin/hooks.v1.json]. `runtime/dist` carries 0 tracked files, so a fresh clone has none of it; the documented install does not build it (root `postinstall` only records the Node version [SOURCE: .skilled/skills/system-spec-kit/package.json], and the runtime workspace `build` script runs only when invoked [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json]). A newcomer who follows README steps 1-3 and opens Codex/Cursor/Devin therefore gets repeated drift notices and no session-start context until someone runs the workspace build; the notice itself names the remedy. Candidate F7 (P3, note-only under the restraint filter): one clause in step 3's prose naming that the same build feeds the session-start hooks. [INFERENCE: tracked-file counts and package scripts read this iteration; the probe clone's `runtime/dist` came from prior iterations' builds]

3. **All seven runtime surfaces ship tracked first-session machinery; the First Use gap is documentation coverage, not missing wiring.** The clone's runtime dirs are all real tracked trees (`.opencode` 58, `.pi` 169, `.claude` 80, `.codex` 71, `.cursor` 78, `.devin` 44, `.hermes` 111 tracked files) [INFERENCE: `git ls-files` counts in the clone, this iteration]. `.claude/SYNC.md` documents the model: whole-dir symlinks for skills, generated per-file command mirrors, a guarded `.claude/agents/` fork, and `settings.json` as hand-authored and unmirrorable [SOURCE: .claude/SYNC.md:33] [SOURCE: .claude/SYNC.md:39] [SOURCE: .claude/SYNC.md:111]. The carried iteration-1 gap stands: the first-use example names only OpenCode while six other runtimes ship equivalent surfaces (registry entry, not re-read this iteration).

4. **Tracked per-runtime settings ship permission and trust defaults that the checked docs never mention.** `.claude/settings.json` is tracked and sets `"defaultMode": "bypassPermissions"`, `"skipDangerousModePermissionPrompt": true` and `env.SYSTEM_SPEC_GATE_ENFORCE: "0"` [SOURCE: .claude/settings.json:3-7] [SOURCE: .claude/settings.json:35-41]; `.pi/settings.json` is tracked and sets `"defaultProjectTrust": "always"` [SOURCE: .pi/settings.json:12]. A scoped grep over README.md, `.claude/SYNC.md`, `.skilled/repo-rules` and the system-spec-kit SKILL found no mention of either value [INFERENCE: rg probe, this iteration], and `.claude/SYNC.md:111` confirms `settings.json` is intentionally hand-authored and outside the mirror gates. If the runtimes honor project settings, every external user of Claude Code silently gets permission prompts bypassed and this repository's spec-gate enforcement switched off; the runtime's merge precedence was not probed, so the finding records the shipped default only.

5. **Fix-set anchors re-verified unchanged.** README.md:160 still carries the two-version Node line with no Node 24 mention; README.md:162 still makes the auto-install/auto-build claim that the iteration-2 probe falsified; the numbered steps at README.md:164-177 still omit hook trust; the trust sentence still sits at README.md:197; and README.md:191 now gives the first-session hook install its prose home, so F4 is a discoverability fix, not a missing-mechanism fix. No fix text has drifted since iteration 3's fix set was written. [SOURCE: README.md:154-200]

## Questions Answered

- None new. Q1-Q5 were already resolved (`resolvedAtIteration` 1-4 in the registry). This iteration answers no open strategy question; per the dispatch it broadens coverage and re-verifies the fix set.

## Questions Remaining

- None in the strategy registry. Optional unprobed slots are listed under Recommended Next Focus.

## Ruled Out

- Executing the `check-git-hooks.sh` self-heal end-to-end inside the clone: running it invokes the installer whose effects beyond the clone's `.git/hooks` were not verified from the 1-55 read, so the mechanism and its trigger conditions were established from the script text instead of mutating machine state.
- No exhausted-approach direction was retried: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, and the two superseded `bun test` roasts all stayed untouched.

## Dead Ends

- None new.

## Edge Cases

- Ambiguous input: the dispatch Focus Area read "[All tracked questions are resolved]" with "broaden coverage and verify prior findings"; the selected interpretation is iteration 4's recommended next focus (a) plus its verification slot (b). Deferred: nothing else met the evidence-backed narrowing test.
- Contradictory evidence: README.md:191's first-session claim had read as unverified against iteration 3's trust gate. Resolved this iteration (finding 1): trust gates the check scripts in secondary checkouts, not the self-heal, so the two are consistent.
- Missing dependencies: none; every probe was a read.
- Partial success: none; every planned probe executed. The self-heal itself was deliberately not executed (see Ruled Out).

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts, the one-record gateway event file (a transient temp file outside the repository), and the gateway's own writes. All clone probes were read-only; no installs or builds ran this iteration.

## Sources Consulted

- README.md:154-200 (re-read for anchor verification, this iteration)
- .skilled/bin/check-git-hooks.sh:1-165 (full read, this iteration)
- .skilled/scripts/install-git-hooks.sh:1-55 (read, this iteration)
- .claude/settings.json (full via head + rg, this iteration)
- .claude/SYNC.md:1-40, 111 (read, this iteration)
- .codex/hooks.json, .cursor/hooks.json, .devin/hooks.v1.json (read, this iteration)
- .opencode/plugins/session-cleanup.js:35, .hermes/plugins/repo-guards/__init__.py:115 (rg hits, this iteration)
- .pi/settings.json (head read, this iteration); .pi/extensions/README.md (rg hit, this iteration)
- .skilled/skills/system-spec-kit/package.json and runtime/package.json (scripts, this iteration)
- o2-fresh-clone probes: runtime dir listings and tracked counts, `git ls-files` dist counts, hook config reads

## Assessment

- New information ratio: 0.80 (3 fully new + 2 partially new of 5 findings = 4.0/5; no simplicity bonus - the iteration carries new external evidence)
- Questions addressed: none open; broadened coverage of per-runtime first-session surfaces and re-verified the fix set
- Questions answered: none new
- Questions remaining: none

## Reflection

- What worked and why: reading the session-start chain backward from each runtime's config surfaced the trust-independent self-heal, which converts iteration 1's "silent machine-wide hook install" from an unresolved risk into a mechanism-backed, bounded behavior the README already describes. Checking dist tracking with `git ls-files` rather than the probe clone's filesystem avoided the trap that the clone's `runtime/dist` exists only because earlier iterations built it.
- What did not work and why: nothing failed; the deliberate non-execution of the installer was a scope decision, not a failure, and is recorded under Ruled Out.
- What I would do differently: widen the `bypassPermissions` grep past the four checked surfaces (skill docs, root markdown) so the documentation-coverage claim is exhaustive rather than sampled.

## Recommended Next Focus

- (a) Verify whether the spec-kit workspace build is the intended remedy for the dist-based session-start hooks and whether one prose clause in README step 3 should name it (candidate F7, P3, note-only under the restraint filter unless hook-drift noise is judged a defect).
- (b) Audit hermeticity of the mirror model: the `.claude/agents` guarded fork and mirror-parity gates against an external clone (does a fresh clone ever fail a sync gate for content it did not touch?).
- (c) At implementation start, re-run the fix-anchor verification (finding 5) before applying F1-F6.
