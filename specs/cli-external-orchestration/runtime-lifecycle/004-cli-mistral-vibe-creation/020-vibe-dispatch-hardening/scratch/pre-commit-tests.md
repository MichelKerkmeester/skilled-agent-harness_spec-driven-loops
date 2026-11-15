# Does the pre-commit hook run any hook node:test suite?

**No.** The hook runs no test file of any kind. Every step it runs is a single-purpose check, a regenerator or a linter, and each one is named below.

## 1. The hook script read

`git config core.hooksPath` returns `/Users/michelkerkmeester/.config/git/hooks`, and its `pre-commit` is a symlink to `.skilled/scripts/git-hooks/pre-commit`. The tracked copy in this worktree and the symlink target are byte-identical (`md5` prints `2e35c8a0810be1863489066dee08261c` for both), so the file read here is the file that runs. It is 1056 lines.

## 2. The line the answer rests on

**Line 1056 is `exit 0`**, the script's last statement. Between the shebang and that exit sit the fifteen gates named below, and every file-running step among them is one of the scripts listed in section 3, so there is no test step before, after or beside them.

The header states the design at lines 4-6: what runs there is what must run before the commit object exists, and "Checks that only need to run once per change, and that cost more than they catch, belong in CI instead". The final gate comment repeats it at lines 1047-1055: the tool ownership map gate is "enforced by CI only (pull request, push to main, and a nightly cron), which is broader than this copy could be."

The fifteen gates, from `rg -o 'gate:[a-z0-9-]+' .skilled/scripts/git-hooks/pre-commit | awk -F: '{print $NF}' | sort -u`: `agent-mirror-sync`, `comment-hygiene`, `contract-recompile`, `doc-version-bump`, `git-timeout`, `hook-flags`, `hook-trust`, `mcp-mutation-class`, `mirror-parity`, `private-skill`, `prompt-card-sync`, `route-remint`, `skill-authoring`, `spec-remint`, `template-phrase-lint`.

## 3. The three searches, with a negative control

```
$ rg -n 'node --test|node:test|\.test\.mjs' .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"
exit=1
```

An empty result is only evidence once the same pattern is shown to find what it claims is absent, so the same command on the workflow that does collect them:

```
$ rg -n 'node --test|node:test|\.test\.mjs' .github/workflows/opencode-plugin-tests.yml; echo "exit=$?"
12:# The hook suites written for `node --test`, and the hook installer test, ran in no
78:    name: OpenCode plugin and hook node:test suites
120:      - name: Run the hook node:test suites
127:            \( -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.test.js' \) \
134:            echo "::error::no node:test hook files were found; the collection rule matched nothing"
137:          echo "Collected ${#files[@]} node:test hook files"
138:          node --test "${files[@]}"
145:        run: node --test '.opencode/plugins/tests/*.test.cjs'
exit=0
```

Two more patterns, so the absence is not an artefact of one spelling:

```
$ rg -n '\.test\.sh|run-tests|npm run|pnpm ' .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"
exit=1
```

Every script the hook invokes is assigned to a name and none of them is a test file or a runner:

- `check-comment-hygiene.sh` and `hygiene-config-flags.cjs` (lines 151 and 186)
- `template-phrase-lint.mjs` (line 226)
- `check-agent-mirror-sync.cjs` (line 244)
- the nine `MIRROR_CHECKS` entries (lines 436-446), which include the dsh `sync-skills`, `sync-prompts` and `sync-agents` generators
- `frontmatter-version.mjs` (line 294)
- `generate-leaf-manifest.cjs`, `generate-router-intent-signals.cjs` and `parent-skill-check.cjs` (lines 495-497)
- `check-prompt-quality-card-sync.sh` (line 590)
- `check-mcp-mutation-class.sh` (line 620)
- `compiled-route-manifest.cjs` (line 659)
- `compile-command-contracts.cjs` (line 858)
- `repair-derived.cjs` (line 938)

None of those names is a suite, and each is invoked either to check a tree or to regenerate one and stage it. One residual is worth naming rather than hiding: a named script could in principle spawn a test runner internally. Nothing in its name or its call shape suggests one, and the phase's question is about the hook's own steps, which the two searches above settle.

The hook's own suites under `.skilled/scripts/git-hooks/tests/` are ten `*.test.sh` files (`ls .skilled/scripts/git-hooks/tests/*.test.sh | wc -l` prints 10), `pre-commit.test.sh` among them, and the hook does not run them either. They are shell suites, not `node --test` files.

## 4. What the answer means for the CI decision

CI is where hook `node:test` suites run. The job in `.github/workflows/opencode-plugin-tests.yml` has a step named "Run the hook node:test suites" that collects them with `find .skilled/hooks` and hands the list to `node --test`, and it has already provisioned the dependency trees and a git identity for them. Adding a Vibe suite to the pre-commit hook would therefore introduce the first test runner the hook has ever run, with none of that setup, on a hook installed globally for every repository on the machine.

Adjacent, not this task: the same `MIRROR_CHECKS` list checks the dsh mirrors and no Vibe mirror. The three Vibe sync generators have no `--check` row here, which is consistent with the sibling suites this phase adds for them.

## 5. Why CI is the gate

No hook suite was added: `.skilled/scripts/git-hooks/pre-commit` runs no `node:test` file (its last statement, line 1056, is `exit 0`), so CI's hook node:test job is the gate for the Vibe suites.
