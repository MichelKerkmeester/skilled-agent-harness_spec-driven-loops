# Iteration 8: The codex drift-notice fix decision — one string, a generated file, and the gates that keep it in step

## Focus

All five strategy key questions stay resolved (`openQuestions: []`), so this iteration continues the dispatch's "broaden coverage and verify prior findings" and takes iteration 7's recommended next focus (a): decide whether the codex drift-notice text ("re-run the codex hooks installer with --check") is part of the F7 fix set or a separate notice-alignment fix. The deciding question turned out to be *where the text lives*: iteration 6 read the message at its render site (`.codex/hooks.json`); this iteration traced it to its source, and that trace converts the fix from a sweep over nineteen inline strings into one registry string plus one regeneration inside the existing pre-commit/CI gate system. Scope: repository reads plus one read-only clone probe (`sync-hook-registrations.cjs --check`); no installs, builds, deletions or repository writes outside the packet. Deferred: iteration 7's (b) consolidated fix-set slice and the First-Use documentation gap, both carried to iteration 9.

## Actions Taken

1. Read externalized state: config (session `dr-002-fresh-clone-2026-10-11T16-22-38-567Z`, iteration 8 of 10, stopPolicy max-iterations, progressiveSynthesis true), state JSONL (7 iteration records + this run's `iteration_start`), strategy (every key question ticked), findings registry, dashboard, iterations 6 and 7.
2. Read the generated file and its registry: `.codex/hooks.json` (full, 163 lines) and `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` (head read plus key-line rg).
3. Read the generator end to end: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` (full, 274 lines).
4. Directory-scoped searches: the codex message string across `.skilled/.codex/.claude/.cursor/.devin/.pi`; `mk-hook-drift` across `.skilled`; `install-codex-hooks` references; `.codex/hooks.json` writers; and per-binding `message` overrides in the registry.
5. Gate wiring reads: `.skilled/scripts/git-hooks/pre-commit:263-277` and `.github/workflows/spec-kit-check.yml:150-162`.
6. Clone probe at matching HEAD (`o2-fresh-clone` and worktree both `82a71c87d035b0a1c7bc3a9405c116125e1ea6be`): `sync-hook-registrations.cjs --check` → exit 0, `[hook-registration-sync] PASS: 4 registration files match the 31-hook registry; 18 Pi extensions resolve.`

Total tool calls this iteration ≈ 20 (15 reads/probes, 3 artifact writes, gateway, verification) against the configured budget of 24.

## Findings

1. **The codex fallback text is generated, and its single hand-authored home is `hook-registry.json` line 23.** The registry's own `_note` declares the four runtime registration files — including `.codex/hooks.json` — as generated via `sync-hook-registrations.cjs` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:2]. The script renders each file from the registry, codex through `renderCodex` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:166-168], and writes only files whose content differs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:241-244]. The message itself is `runtimes.codex.defaultMessage` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23], resolved per binding as `binding.message ?? runtimeConfig.defaultMessage` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and rendered into each envelope fallback [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:81]. All eighteen envelope-fallback command entries in `.codex/hooks.json` carry that one string (full read this iteration; first at [SOURCE: .codex/hooks.json:8]). Drift is gate-enforced on both paths: pre-commit runs the synchronizer with `--check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] and CI runs the same check [SOURCE: .github/workflows/spec-kit-check.yml:161]; the clone probe at the same HEAD exits 0 with the PASS line [INFERENCE: clone probe this iteration]. This reframes the fix: no inline-string sweep, no second copy to keep in step — one registry string plus a regeneration.

2. **The message accompanies a failure class the named tool cannot address, and codex is the only runtime whose default advice is off-target.** The fallback fires whenever a codex command fails (missing dist adapter, script crash) and prints "re-run the codex hooks installer with --check" [SOURCE: .codex/hooks.json:8]. The named tool only removes copies of repo-owned hooks from the user-global `~/.codex/hooks.json` and "never rewrites a clean file"; `--check` exits 1 while a copy or orphan remains [SOURCE: .skilled/bin/README.md:168]. The project's own SYNC note states that `.codex/hooks.json` changes need *no* install, and runs the check only to confirm the user-global file holds no stale copy [SOURCE: .codex/SYNC.md:52]. On a fresh clone, where the missing `runtime/dist` is the dominant adapter failure, the advice sends the user to a user-global config cleaner that reports OK while nothing is fixed. The sibling defaults differ in kind: devin's names the working command — "run npm run build in the spec-kit runtime package" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:52] — while claude and cursor say "rebuild the spec-kit runtime or restore the missing adapter" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]. (Partially new: iteration 6's finding 3 established that the installer cannot build; new here is that the fallback's runtime-wide default — not a dist-specific message — is the mechanism, and that codex alone is misaligned.)

3. **The smallest correct fix is one registry string plus a regeneration, and it stays inside machinery that already exists.** Edit `runtimes.codex.defaultMessage` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23] to name the build remedy, then run `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`; the renderer rewrites only the changed file, `.codex/hooks.json` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:241-244], and both `--check` gates then confirm the pair is consistent [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161]. The registry already supports per-binding `message` overrides — five uses today, three of them exactly the `[codex-hooks] drift detected` installer notice [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728] [SOURCE: .cursor/hooks.json:31] — so a more granular fix is possible but not earned: all four runtimes already carry one runtime-level default, and per-adapter wording would add binding bookkeeping for a message no user has complained about. Direct edits of the generated file would be flagged by both gates; per-binding overrides for the five dist-consuming codex bindings would triple the edit surface.

4. **Decision: the codex notice alignment is a separate one-string fix, not part of F7 — report it as the companion candidate F7b, to be bundled with F7 in one implementation pass.** F7 (README prose naming the spec-kit workspace build) fixes the *absence* of a remedy where users need it; F7b removes a *wrong* remedy where one is offered. Both are one-line changes rooted in the same fact: nothing on the documented path builds `system-spec-kit/runtime/dist` [INFERENCE: combining findings 1-3 with iteration 6's finding 3 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-006.md:23], the dist-absence evidence repeated in iteration 7, and iteration 7's recommendation [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-007.md:88]]. Ranking if the two are separated: F7 first (its absence misleads every fresh-clone runtime), F7b immediately after (its wrong remedy additionally burns one debugging step, codex-only). No dependency either way; F7's acceptance criteria stay untouched. Passed through `.skilled/repo-rules/prevent-overengineering.md`: one string, the existing generator, the existing gates; the per-binding variant is declined explicitly.

## Questions Answered

- None new. Q1-Q5 were resolved in iterations 1-4 and remain ticked in the registry. This iteration answers no open strategy question; per the dispatch it broadens coverage and resolves the carried codex-notice decision.

## Questions Remaining

- None in the strategy registry. Two carried fix-set items are listed under Recommended Next Focus.

## Ruled Out

- Editing the generated `.codex/hooks.json` directly to change the notice: pre-commit and CI run `sync-hook-registrations.cjs --check` [SOURCE: .skilled/scripts/git-hooks/pre-commit:272] [SOURCE: .github/workflows/spec-kit-check.yml:161], so an un-regenerated edit reports drift; the registry is the edit point.
- Per-binding `message` overrides for the dist-only codex adapters: the mechanism exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:73] and is used five times [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:728], but all four runtimes use runtime-level defaults; adding per-adapter strings adds binding bookkeeping the requirement does not earn.
- Rewording the claude/cursor defaults in the same pass: both name a correct rebuild direction [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:36]; no observed misdirection; keeps the pass off the "while we're here" path.
- Executing `install-codex-hooks.mjs --check` in the clone to observe user-global behavior: the user-global `~/.codex/hooks.json` sits outside the clone sandbox; the tool's contract is documented and `--check` is non-mutating by design [SOURCE: .skilled/bin/README.md:168], so its semantics were read, not executed.
- Retrying any exhausted-approach direction: docs-tree, PUBLIC-RELEASE, root-install, Node-18, the sk-vision test-failure claim, the `z_archive`-absence claim, the `bun test` roasts, the `check-git-hooks.sh` execution, and the build re-run all stayed untouched.

## Dead Ends

- None new. The registry-sourced generation pipeline is the live mechanism at HEAD, confirmed by both gates and by the clone probe; the direction is resolved rather than dead, and no content fix remains owed beyond the one string.

## Edge Cases

- Ambiguous input: the dispatch focus read around "[All tracked questions are resolved]" with "broaden coverage and verify prior findings"; the selected interpretation is iteration 7's carried recommendation (a) — the codex drift-notice decision — because it was the narrowest open recommendation with a concrete falsifiable question. Deferred: iteration 7's (b) consolidated fix-set slice and the First-Use doc gap (iteration 5, finding 3), both held for iteration 9.
- Contradictory evidence: a test-fixture spec under `anchor-repair-sample` states "No generator currently produces any of the four JSON files" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/specs_system-speckit_033-system-speckit-v4_032-recorded-findings-closure_014-registration-schema-unification_spec.md:64]; the live registry `_note` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:2], the generator's render/write path [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs:241-244], both `--check` gates and the clone PASS contradict it. Resolved in favor of the live evidence: the fixture is stale sample data for anchor-repair tests, not a live claim about HEAD.
- Missing dependencies: `research/research.md` still does not exist although `progressiveSynthesis` is true [SOURCE: deep-research-config.json:15], and this dispatch's ALLOWED WRITE PATHS contain only this iteration file and the delta file — progressive synthesis remains with the workflow owner, as recorded in iterations 5-7. The fresh-clone fixture is no longer pristine (prior iterations installed and built it), so the probe used it for the gate check only (which needs the built shared workspace present there) while pristine-state claims rest on tracked-file and hook-config reads.
- Partial success: none; every planned probe executed and the gate run returned a clean exit code with an affirmative PASS line.

## SCOPE VIOLATIONS

None. All writes were the two packet artifacts, the one-record gateway event file (a transient temp file outside the repository), and the gateway's own writes. The clone probe was read-only: one `node` gate execution that reads files and prints a status, plus `git rev-parse` and `ls`. No installs, builds or deletions ran this iteration; no researched file was modified.

## Sources Consulted

- `.codex/hooks.json` (full read, this iteration)
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` (head read + key-line rg, this iteration)
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` (full read, this iteration)
- `.skilled/scripts/git-hooks/pre-commit:263-277` (gate context, this iteration)
- `.github/workflows/spec-kit-check.yml:150-162` (gate context, this iteration)
- `.skilled/bin/README.md:168` (installer contract, rg hit, this iteration)
- `.codex/SYNC.md:52` (rg hit, this iteration)
- `.cursor/hooks.json:31` (rg hit, this iteration)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-006.md:23` (prior finding, this iteration)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-007.md:88` (prior recommendation, this iteration)
- o2-fresh-clone probes (this iteration): HEAD equality `82a71c87…`; `sync-hook-registrations.cjs --check` exit 0 with the PASS line; artifact fencing checks.

## Assessment

- New information ratio: 0.75 (2 fully new findings — the registry as single source with gate-enforced generation, and the one-string fix analysis; 2 partially new — the misdirection refinement and the decision; (2 + 0.5 + 0.5) / 4 = 3.0/4; no simplicity bonus, new file, gate and probe evidence grounds it)
- Questions addressed: none open; broadened coverage of the codex drift-notice decision and the hook-registration generation pipeline
- Questions answered: none new
- Questions remaining: none

## Reflection

- What worked and why: following the string to its *source* instead of its first sighting. Iteration 6 read the message where it renders and, reasonably, treated the fix surface as the file; one registry read plus one `--check` run collapsed "a file full of strings" into "one registry entry plus a gate-enforced regen". Running the synchronizer in the clone with the exit code bound to the command (`out=$(...); rc=$?`) converted "the registry is canonical" from a doc claim into an observed PASS at the same HEAD.
- What did not work and why: nothing failed. One near-miss: a stale fixture spec seen in grep output claims no generator exists, and it would have inverted the fix-surface conclusion had it been trusted over the live registry, the gate wiring, and the probe; the contradiction is recorded under Edge Cases rather than silently dropped.
- What I would do differently: when a prior iteration quotes a string from a generated-looking file, read that file's `_note`/header or its renderer before characterizing the fix surface. The extra hop here replaced an implied nineteen-edit sweep with a one-string change — the same class of mistake as the iteration 6 "clone's dist exists because we built it" trap, met in yet another place.

## Recommended Next Focus

- (a) The consolidated fix-set slice (iteration 7's recommendation (b), still owed): fold F1-F6, F7, the new F7b, the iteration 7 finding-4 candidates, and the First-Use documentation gap (iteration 5, finding 3) into the single ranked set, each passed through `.skilled/repo-rules/prevent-overengineering.md`; iterations 9-10 remain to run it.
- (b) At implementation start, re-run the fix-anchor verification (iteration 5, finding 5) before applying any F-fix.
- (c) When F7b lands, no widening is owed: no other runtime's default names a tool that cannot address its failure class (devin names the build command; claude/cursor name rebuilding), so the alignment stays codex-only unless new evidence appears.
