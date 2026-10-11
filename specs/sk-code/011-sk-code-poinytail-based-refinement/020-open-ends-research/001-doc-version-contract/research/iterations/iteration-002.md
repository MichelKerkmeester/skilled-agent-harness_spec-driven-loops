# Iteration 2: Q5 — Which Hooks, Generators or CI Steps Write or Check a Doc Version Today

## Focus

Q5 of the strategy key questions, carried forward from iteration 1 with partial evidence (post-edit hook gate, package-time validators, separate CI coverage guard; nothing runs verify/apply). This iteration's job is to consolidate that partial evidence into a definitive inventory of every automated surface that writes or checks a per-doc `version:` value, so Q5 can be closed rather than carried again. The dispatch text was unambiguous; no alternate reading was needed.

## Actions Taken

1. Read state: `research/deep-research-config.json`, `research/deep-research-state.jsonl` (iteration 1 recorded, no completed iteration 2), `research/deep-research-strategy.md`, `research/findings-registry.json`, `research/iterations/iteration-001.md`. Focus selection honored the strategy's "Next Focus" (Q5) and checked "Exhausted Approaches" (none of the four BLOCKED directions touched this focus).
2. Repo-wide search for references to `frontmatter-version` / `check-frontmatter-versions` outside specs and mirrors.
3. Inspected the git-hook surface: `.skilled/hooks/git/` (installer + legacy helper), `.opencode/scripts/git-hooks/` (installed hooks); enumerated `gate:*` labels in the pre-commit; ripgrep for `frontmatter` across the whole git-hooks directory (0 matches).
4. Inspected the post-edit router row that dispatches version checks and the shell wrapper it calls.
5. Inspected CI: `skill-doc-frontmatter.yml`, `sk-doc-script-tests.yml`, `agent-mirror-sync.yml`, and every `frontmatter` mention across `.github/workflows/`.
6. Read the coverage guard's contract header to test whether `version` is in its field list.
7. Read `run-script-tests.sh` and searched for any wiring of `test-frontmatter-version.mjs`.
8. Checked `.gitignore`, the frontmatter templates asset, and the engine's mode dispatch (`gate`/`compute`/`apply`/`verify`).
9. Ran `ls -la .opencode/` — discovered `skills` and `agents` are symlinks into `.skilled`, which reframes every `.opencode/...` path in CI and the router as the same physical file, not a second copy.

## Findings

1. **No hook, generator or CI step writes a doc version automatically; the only writer is `apply`, operator-run.** The engine's modes are `compute`/`apply`/`verify`/`gate` [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:11-13]; `apply` is the write path [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:445], and the standard documents it as a manual two-pass flow with `--update` required to overwrite a differing value [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:109]. A search for `frontmatter-version` across `.github/`, `.skilled/hooks/`, and `.opencode/scripts/git-hooks/` finds no caller (matches live in `.gitignore`, the engine and its tests, the wrapper, and documentation). The `compute` manifest output is gitignored [SOURCE: .gitignore:386-390]. Templates seed a literal `version:` at authoring time only [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:411].

2. **The only automatic check on a version value is the post-edit plugin's gate row, and `gate` is presence + format only — no git, no manifest.** Row 3 of the router routes an in-scope skill doc to `check-frontmatter-versions.sh --skill <name>` [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:200-210]; the wrapper execs the engine in `gate` mode [SOURCE: .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:13]; the engine's own comment for that mode is "Presence + format only — no git, no manifest" [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:399]. So no automated surface can detect stored-vs-derived drift.

3. **No git hook checks a doc version at all.** The installed pre-commit's gates are comment-hygiene, template-phrase-lint, agent-mirror-sync, mirror-parity, skill-authoring, plus hook-flags/trust, spec/route remint, prompt-card-sync and mcp-mutation-class [SOURCE: .opencode/scripts/git-hooks/pre-commit:97][SOURCE: .opencode/scripts/git-hooks/pre-commit:172][SOURCE: .opencode/scripts/git-hooks/pre-commit:322]; a ripgrep for `frontmatter` across `.opencode/scripts/git-hooks/` returns zero matches. The `skill-authoring` gate checks leaf-manifest freshness and the parent-skill doctor [SOURCE: .opencode/scripts/git-hooks/pre-commit:324-326]. The legacy helper `.skilled/hooks/git/pre-commit` runs only comment-hygiene and mirror gates as well [SOURCE: .skilled/hooks/git/pre-commit:43].

4. **CI's frontmatter guard does not know the `version` field exists.** `skill-doc-frontmatter.yml` runs the coverage guard [SOURCE: .github/workflows/skill-doc-frontmatter.yml:31], whose declared contract is title, description, trigger_phrases (3-8), importance_tier and contextType [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8]. `version` is absent from that list, so CI cannot fail on any version value in any state.

5. **The engine's own `.mjs` test suite is not wired into CI.** The sk-doc CI job runs `run-script-tests.sh` [SOURCE: .github/workflows/sk-doc-script-tests.yml:53], which loops over `test_*.py` files only [SOURCE: .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh:12]. `test-frontmatter-version.mjs` exists and is documented in the suite README [SOURCE: .skilled/skills/sk-doc/scripts/tests/README.md:73], but a search for the name found no reference in any workflow or runner — engine-behavior regressions are caught only by manual runs.

6. **`.opencode/skills` and `.opencode/agents` are symlinks into `.skilled`.** `ls -la .opencode/` shows `skills -> ../.skilled/skills` and `agents -> ../.skilled/agents` [SOURCE: .opencode/skills][SOURCE: .opencode/agents]. Every CI path that names `.opencode/...` and the router's `.skilled/...` paths execute the same physical files; there is no `.opencode` second copy to keep in sync. The duplicate engine pair iteration 1 found is intra-`.skilled` (`scripts/` vs `shared/scripts/`) and remains real [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:1].

**Composite answer to Q5.** Doc versions have no automated writer: the single writer (`apply --update`) is operator-run, and no hook, generator, packaging step or workflow invokes it. Every automated check outside manual `verify` is presence/format only: the post-edit plugin gate (format), package-time validators (format), and CI's coverage guard (no `version` field at all). Git hooks check nothing version-related, and the engine's fixture tests are not wired into CI. `verify` — the only stored-vs-derived comparison — is invoked by nothing at all.

## Ruled Out

- **An automated writer hiding in hooks/CI.** Searched `.github/`, `.skilled/hooks/`, `.opencode/scripts/git-hooks/` for `frontmatter-version`/`check-frontmatter-versions` callers: none exist; every match is documentation, tests, or the engine itself.
- **The CI coverage guard as a version checker.** Its header contract lists five fields and `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8].
- **The engine's `.mjs` tests as a wired CI check.** The CI harness globs `test_*.py` only; the `.mjs` suite is unreferenced by any workflow.

## Dead Ends

- None newly eliminated. The iteration-1 dead ends (fleet reconcile via `apply --update`; "nothing enforces it" as oversight; engine bug; broken numstat counter) all remain outside this focus and were not retried.

## Edge Cases

- Ambiguous input: none — Q5's dispatch text is a single inventory question.
- Contradictory evidence: none. The `.opencode` symlink discovery corrects an implicit reading from iteration 1 (that `.opencode` paths are copies); it is a refinement, not a conflict, and is recorded in Finding 6.
- Missing dependencies: `.githooks/`, `.pre-commit-config.yaml`, husky and lint-staged do not exist at the repo root; the installed hook set lives under `.opencode/scripts/git-hooks/` and the legacy helper under `.skilled/hooks/git/`. Both were checked; no scope impact.
- Partial success: none — all planned surfaces were reachable and inspected.

## SCOPE VIOLATIONS

None. All researched files were read-only; writes stayed within the packet's `research/iterations/` and `research/deltas/` paths plus the append gateway's own run-directory writes.

## Questions Answered

- Q5: Which hooks, generators or CI steps write or check a doc version today, if any? — **Answered.** Writers: none automated; `apply` is manual-only and the sole writer. Checkers: post-edit plugin gate (format-only), package-time validators (format-only), CI coverage guard (no `version` field), CI script tests (`test_*.py` only, so the engine's `.mjs` suite is unwired), no git hooks. `verify` is invoked by nothing. The full inventory is findings 1-6.

## Questions Remaining

- Q2: What should doc versions mean for an external author?
- Q3: What is the smallest contract that stays green by construction?
- Q4: Should the per-doc version exist at all?

## Sources Consulted

- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` (lines 38, 200-210)
- `.skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` (line 13)
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (lines 11-13, 399, 445)
- `.opencode/scripts/git-hooks/pre-commit` (lines 97, 172, 322-326; gate-label inventory; zero `frontmatter` matches)
- `.skilled/hooks/git/pre-commit` (legacy helper, line 43 and gates)
- `.github/workflows/skill-doc-frontmatter.yml` (line 31)
- `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh` (lines 7-8)
- `.github/workflows/sk-doc-script-tests.yml` (line 53)
- `.opencode/skills/sk-doc/scripts/tests/run-script-tests.sh` (line 12)
- `.skilled/skills/sk-doc/scripts/tests/README.md` (line 73)
- `.gitignore` (lines 386-390)
- `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` (line 411)
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (lines 109, 148-149, 166-170; carried from iteration 1)
- `.opencode/skills`, `.opencode/agents` (symlinks, `ls -la .opencode/`)
- Command outputs: repo-wide `frontmatter-version` search; `gate:*` inventory of the pre-commit; `test-frontmatter-version` wiring search; symlink listing

## Assessment

- New information ratio: 0.93 — (4 fully new findings + 2 partially new findings) / 6 = 0.83, plus the +0.10 synthesis bonus for closing Q5's inventory and removing the "a hidden automated writer may exist" uncertainty.
- Questions addressed: Q5.
- Questions answered: Q5.

## Reflection

- What worked and why: classing the automated surface into three bins (hooks, generators/CI, fixtures) and searching each bin directly produced a closed inventory instead of another partial list; the `ls -la .opencode/` check paid off immediately by converting ambiguous "`.opencode` copy" reasoning into a hard symlink fact.
- What did not work and why: the first `frontmatter-version` search returned dozens of spec-file hits that drowned the signal; narrowing to non-spec, non-markdown paths made the "no caller exists" claim testable.
- What I would do differently: check for symlinks at the top of the tree before counting any path pair as duplicates — iteration 1's "two engine copies" framing would have been sharper with that check applied per tree.

## Recommended Next Focus

Q2: what should a per-doc version mean for an external author? Carry forward iteration 1's two structural candidates — anchor-only `X.Y.0.0` (green by construction, `W` retired) versus a real per-doc revision marker — into Q3's "smallest contract" evaluation. Q5 is now closed and should not be re-investigated; no residual sub-question remains.
