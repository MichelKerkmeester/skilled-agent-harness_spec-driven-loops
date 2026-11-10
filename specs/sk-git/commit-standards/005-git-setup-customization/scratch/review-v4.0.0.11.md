# Review: v4.0.0.11 and the v4.0.0.13 follow-up fixes (/doctor:git setup)

Read-only review of the setup battery, its tests, the `/doctor:git` command surfaces, the two scoped script changes and the docs and changelogs that describe them. Every finding below was reproduced with a read-only run, a throwaway fixture repository under `mktemp -d` (deleted afterwards) or a direct code read named in the evidence.

Verdict: no P0, five P1 and fourteen P2. The battery runs clean on this checkout (`STATUS=OK checks=11`, exit 0), the suite passes 47 of 47 and every validator passes. The P1 items are wrong verdicts or repairs a user can hit outside the battery's own checkout.

---

## 1. FINDINGS

### P1

**P1-1. The trust row says a clone's own hook scripts do not run while they do.**

- Where: `.skilled/commands/doctor/scripts/git-setup-check.cjs:397-408` (trust), `:330-332` and `:356-358` (hooks accepts links into the repository's own tree), `README.md:1503`.
- Defect: the hooks row passes when installed hooks link into the inspected repository's own `.skilled/scripts/git-hooks`, and the trust row then reports `SKIP` with "untrusted: this clone's own hook scripts do not run", but git runs those linked scripts directly, and their trust block resolves the clone's own common dir, so they count themselves as trusted.
- Failure scenario: an operator clones a fork, runs the clone's own `bash .skilled/scripts/install-git-hooks.sh` without setting trust, then runs `/doctor:git setup`. The report says the clone's scripts do not run. Every commit runs them.
- Evidence: fixture clone with the toolchain sentinel and a pre-commit that writes a marker. After the clone's installer ran, the battery printed `hooks PASS` and `trust SKIP "untrusted: this clone's own hook scripts do not run"`. A plain `git commit` then wrote the marker. The root README makes the same false claim: "Without trust the clone's own gates do not run."

**P1-2. advisory-rules checks a file the advisory never reads outside this checkout.**

- Where: `git-setup-check.cjs:709` (reads `OWN_ROOT/skills/sk-git/hard-rules.json`), `:73` (repair names the repo-relative `.skilled/skills/sk-git/hard-rules.json`), `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:107` (reads `<projectDir>/.skilled/skills/sk-git/hard-rules.json`), `README.md:1505`.
- Defect: the row validates the battery's own rule file, while the advisory dispatches on the inspected repository's file.
- Failure scenario: a repository whose own `hard-rules.json` names an unknown check, or that has no rule file at all so the advisory is silent for every command, gets `advisory-rules PASS`. The repair line names the repository's file, which the check does not read, so fixing it never changes the row.
- Evidence: in a fixture repository, the shipped advisory stayed silent for `git add does-not-exist.txt` with no repo rule file and printed `[add-pathspec-matches-nothing]` once the repo carried the shipped rules. With the repo rules naming `no-such-check`, the battery printed `advisory-rules PASS`. The round-trip test (`git-setup-check.test.cjs:1226-1256`) passes only because it edits the install root's file, not the path the repair prints. The README's "Shared files" bullet is wrong for the same reason: the allowlist and `hard-rules.json` are read per repository, not from the shared install.

**P1-3. ai-tool-hooks passes a registration whose command cannot run.**

- Where: `git-setup-check.cjs:862-866`, the test at `git-setup-check.test.cjs:1290-1313`.
- Defect: for Claude, Codex, Devin and Cursor any command string containing `git-preflight-advisory` counts, without checking that the path it runs exists, which falls short of v4.0.0.13's "counts only when it binds a real handler".
- Failure scenario: the battery's own foreign-repo path (`core.hooksPath` to this checkout) leaves a repository without `.skilled/`. Copying this checkout's `.claude/settings.json` there reads as registered while every Bash call fails to load the advisory.
- Evidence: a fixture with `node .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` registered and no `.skilled/` gave `ai-tool-hooks PASS`. Running that command from the project dir exited 1 with a Node module-not-found error. The README round-trip test copies this checkout's adapter files into a bare fixture, where none of them can load, and asserts PASS. The repair points at hooks README section 3, which names the event and matcher but never the command line to register.

**P1-4. Repair lines break on an install path with a space.**

- Where: `git-setup-check.cjs:336-338` (hooks), `:305` (install restore), `:459` (contract `mkdir -p`).
- Defect: paths are interpolated unquoted into shell commands.
- Failure scenario: an install under a path such as `~/Library/Mobile Documents/...` prints `git config core.hooksPath /.../my root/.skilled/scripts/git-hooks`. Git reads the second word as a value pattern, exits 0 and sets `core.hooksPath` to the truncated `/.../my`.
- Evidence: fixture install root at `<tmp>/my root/.skilled`. The printed repair exited 0, `git config --get-all core.hooksPath` showed `/.../my`, and the rerun still printed `hooks FAIL`.

**P1-5. A stray file in the hook source folder gives a FAIL the repair cannot clear.**

- Where: `git-setup-check.cjs:344-347`.
- Defect: the battery expects every non-README file in `scripts/git-hooks` to be installed, while the installer links only real git hook names (`install-git-hooks.sh` `is_git_hook_name`).
- Failure scenario: macOS Finder writes `.DS_Store` into the folder. The own-checkout run fails `hooks` with `.DS_Store: not installed`. Running the printed installer changes nothing, so the run stays at exit 1.
- Evidence: own-checkout fixture with a copied hook tree plus `.DS_Store`. The installer exited 0, and the battery still printed `hooks FAIL [".DS_Store: not installed"]` with the same installer repair.

### P2

**P2-1. A crashing allowlist helper still passes.** `git-setup-check.cjs:519-524` and `:537-538`. Any exit other than 0 or 1 becomes "refused (script exited N)" on a passing row, even for `main`, the built-in exception. A fake install root whose `worktree-naming.sh` exits 2 printed `allowlist PASS` with `main: refused (script exited 2)`. This is the defect class v1.9.1.0 says it fixed ("A check that could not run says so").

**P2-2. An exported GIT_DIR steers the standards row.** `git-setup-check.cjs:126-144` and `:480`, `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:261-267`. The safe environment is built only for spawned children, while the in-process contract module runs `git` with the untouched `process.env`. With `GIT_DIR` pointing at another repository whose `skgit.contractDir` is missing, the row printed `standards FAIL` naming the other repository's path, with the `/doctor:git standards` repair. Without it the same fixture passed. The GIT_DIR test (`test.cjs:1056-1065`) checks only the worktrees row, and the feature catalog's "to every child process" (`doctor-git-settings.md:31`) is not true for this child.

**P2-3. Hermes runs the advisory, and the battery can never clear on Hermes.** `git-setup-check.cjs:52` and `:954-958`, `doctor-git-setup.yaml:48`, `.hermes/plugins/repo-guards/__init__.py:41`, `:294-300` and `:529`. Hermes wires the advisory through `repo-guards`, but the battery checks six adapters and refuses `--tool hermes`. Every Hermes run ends `STATUS=DEGRADED` (exit 3 observed without a tool), and its detail asks for a `--tool` value Hermes cannot pass. `SKILL.md:250` ("All six AI runtimes") and the hooks README section 3 table omit Hermes too.

**P2-4. Claude's documented catch-all matcher fails.** `git-setup-check.cjs:867-876`. `matcher: "*"` becomes `^(?:*)$`, the RegExp throws and the entry counts as unregistered. A fixture with `"*"` printed `ai-tool-hooks FAIL` with a repair to register what is already registered. The same entry with an empty matcher passed.

**P2-5. A fully muted advisory reads as healthy.** `git-setup-check.cjs:106` and `:809-821`. With `SK_GIT_PREFLIGHT_DISABLED=1` and `SKGIT_ADVISORY=0` this checkout printed `suppression PASS` and `STATUS=OK checks=11`, exit 0, although no advisory can ever show. An unregistered adapter with the same effect fails, and a gate saved off degrades.

**P2-6. An adapter symlink can print bytes from a file outside the repository.** `git-setup-check.cjs:928-940`. Adapter configs follow symlinks and the JSON parse error is printed. A `.codex/hooks.json` linked to an outside `API_TOKEN=...` file printed `Unexpected token 'A', "API_TOKEN="... is not valid JSON`. The allowlist reader refuses symlinks for exactly this reason (`:553-557`).

**P2-7. The install restore repair fails when the file is not in HEAD.** `git-setup-check.cjs:298-308`. Only "is this a work tree" is checked. A vendored, uncommitted install printed `git -C <host> restore --source=HEAD -- .skilled/skills/sk-git/hard-rules.json`, which failed with `fatal: could not resolve HEAD` (exit 128).

**P2-8. A dangling symlink as the worktree base passes.** `git-setup-check.cjs:586-594` and `:637`. `existsSync` skips the dangling link and judges its writable parent, but the helper's `mkdir -p` (`worktree-naming.sh:415`) fails on it. Fixture: `worktrees PASS`, then `mkdir -p` exited 1.

**P2-9. `--json` drops detail lines too.** `git-setup-check.cjs:69-71` and `:993`. The comment says the human block is capped, but the cap is applied before both renderers. On this checkout the JSON worktrees row ends `"... 2 more"`, so scripts lose two provision entries.

**P2-10. Two repairs hardcode `.skilled/`.** `git-setup-check.cjs:73` and `:78`. Every other label uses `ownLabel`, which honours an `.opencode` install root (comment at `:112-114`). From that root these two repairs name a file that does not exist. This is a code read, not a run.

**P2-11. The input-gate claim is overstated, and the 008 summary is stale.** `.skilled/changelog/skilled/v4.0.0.13.md:24` and `sk-create-command/changelog/v1.0.4.0.md:25` say all nine gated commands agree. `sk-create-command/assets/command-router-template.md:54` puts the gate "before ROUTER CONTRACT", while `deep/research.md:38`, `deep/review.md:21`, `deep/ai-council.md:20` and `prompt/improve.md:17` put it inside section 1. `008-out-of-scope-cleanup/implementation-summary.md:122` still says `doctor/git.md` keeps its gate before the H1, and the commit that wrote that line (`144d0bdeb6`) moved the gate below the H1.

**P2-12. The setup workflow text and the result display disagree with the code.** `doctor-git-setup.yaml:49` describes hooks as "resolves to this checkout" (the code also accepts the repository's own tree and checks the execute bit) and commit-id as "the Commit-Id policy markers" (it checks the policy decision and the allocator). `doctor-git-setup.yaml:60` lists degraded, skipped and unknown rows on exit 1, while `doctor-git-presentation.txt:256` does not. The result table at `:245-247` has no detail column, so on a FAIL the user never sees which hook is missing.

**P2-13. Tests that pass for the wrong reason, and missing tests.** The advisory-rules round trip (P1-2) and the README section 3 round trip (P1-3) pass without the printed repair being correct. Nothing covers a helper exit outside 0 and 1, GIT_DIR on the standards row, a non-hook file in the hook folder, a space in the install path or Claude's `*` matcher. The fsmonitor marker in `test.cjs:356-378` cannot fail today, which its comment admits. The gpg.program test is real: without the safe environment the policy probe ran the fake gpg.

**P2-14. Refinements that would simplify the code without changing behaviour.** `GIT_FLAGS` (`:210`) duplicates the `core.fsmonitor=false` the environment already sets for every git child. The PATH comment is written twice (`:146-150` and `:168-172`). A non-repository and a bad flag print the same bare usage line (`:1091-1097`), so the user cannot tell which happened. Invalid JSON in `hard-rules.json` is reported as "not a JSON array" (`:717`).

---

## 2. CHECKED AND SOUND

- The battery on this checkout: `--tool=claude` printed eleven PASS rows, `STATUS=OK checks=11`, exit 0. Without a tool it exited 3, and `--repo /tmp` exited 2.
- `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`: 47 pass, 0 fail, exit 0.
- `package_skill.py .skilled/skills/sk-git --check`: `Result: PASS`, SKILL.md at 4,990 words, under the 5,000 limit.
- `validate-playbook-package.cjs --package sk-git`: PASS, 46 scenarios, 0 violations. `validate_document.py` reported VALID for all 13 in-scope docs by type. `hvr_scan.py` found 0 hard blockers in the scoped docs, and the comma flags are clause commas, not serial commas.
- The hook-flags.env parser matches the shell and Node readers (BOM, quotes, trailing comment, last line wins, env set-but-empty wins).
- The worktree base resolution matches `worktree-naming.sh` (env, then git config, then `.worktrees`, `~` expansion, main worktree).
- The Commit-Id policy is sourced from the battery's own tree, the status fold and exit codes match every doc, and every FAIL carries a repair.
- `readRepoFile` handles FIFOs, directories and size, and PATH narrowing keeps a planted `./git` from running.
- The drift guard's evidence skip passes its 28 unit tests, and `verify_alignment_drift.py` passes on the doctor scripts with headers and sections checked. The Hermes marker change has no other consumer still using the old semicolon form.
- The `/doctor:git` routes in `_routes.yaml` match `git.md`, the YAML and the presentation for target names, mutation class and the `--tool` flag.

---

## 3. RECOMMENDATIONS

1. **Trust (P1-1).** When the installed hooks resolve into the inspected repository's own tree, the trust row should say the repository's own scripts run, and should not report it as untrusted. Fix the README line to say trust matters only when the hooks come from another checkout, such as a global `core.hooksPath`.
2. **advisory-rules (P1-2).** Read `<repo>/.skilled/skills/sk-git/hard-rules.json` as data, the file the advisory reads, and validate it against the battery's own `GIT_CHECKS`. Report "no rule file, so the advisory is silent" when it is missing. Make the repair name the absolute path read, and fix the README "Shared files" bullet.
3. **ai-tool-hooks (P1-3 and P2-4).** For JSON adapters, resolve the `.mjs` path named in the command against the project dir and require it to exist. For OpenCode and Pi, resolve the `git-rule-checks.mjs` import relative to the adapter file. Treat `*` and an empty matcher as match-all for Claude. Change the round-trip test so the fixture carries the files the command needs, and put one complete registration entry per runtime in hooks README section 3.
4. **Repair quoting (P1-4).** Quote every interpolated path in a repair line, for example by wrapping it in single quotes with embedded quotes escaped. Add a test that runs the hooks repair from an install root containing a space.
5. **Hook names (P1-5).** Filter the shipped hook list with the same git-hook-name list the installer uses, or share one list between them.
6. **Allowlist exits (P2-1).** Make any exit other than 0 or 1, or `main` coming back refused, set the row to UNKNOWN.
7. **Environment (P2-2 and part of P2-14).** In `main()`, apply the safe settings to `process.env` once, next to `narrowPath()`: drop the repository-selecting variables and add the two config overrides. In-process modules are then covered too, and `GIT_FLAGS` and the per-call env building can go. Extend the GIT_DIR test to the standards row.
8. **Hermes (P2-3).** Either accept `--tool hermes` and check `.hermes/plugins/repo-guards/__init__.py` for its `GIT_PREFLIGHT_ADVISORY` call, or state in the YAML, SKILL.md and hooks README that Hermes always ends DEGRADED and why. Add Hermes to the section 3 table either way.
9. **Muted advisory (P2-5).** Report `SK_GIT_PREFLIGHT_DISABLED` or `SKGIT_ADVISORY=0|false|off` as DEGRADED with an unset repair, the way a saved-off gate is reported.
10. **Symlinked adapter configs (P2-6).** Do not print the parse error text. Say "not valid JSON" instead, or refuse a symlink that resolves outside the repository.
11. **Install restore (P2-7).** Before printing the restore, check each path with `git cat-file -e HEAD:<path>`, and fall back to the reinstall wording when it is not in HEAD.
12. **Worktree base (P2-8).** Use `lstat` in the ancestor walk and fail on a dangling symlink.
13. **Detail cap (P2-9).** Apply `limitDetails` in `renderHuman` only.
14. **Hardcoded roots (P2-10).** Build both repairs with `ownLabel`.
15. **Docs (P2-11 and P2-12).** Either move the four gates out of section 1 or change the router template comment and the two changelog lines to the looser rule. Correct the stale 008 known limitation. Align the YAML step 2 wording with the code, give the FAIL render the same "list each degraded, skipped or unknown check" rule as the YAML, and add the failing row's detail lines under its repair.
16. **Usage errors (P2-14).** Print a one-line reason before the usage line, such as "not inside a git work tree" or "unknown argument", and give invalid JSON in `hard-rules.json` its own message.
