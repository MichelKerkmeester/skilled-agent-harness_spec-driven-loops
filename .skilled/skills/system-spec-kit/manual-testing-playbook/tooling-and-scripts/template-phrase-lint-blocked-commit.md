---
title: "473 -- Template phrase lint blocked commit"
description: "This scenario validates the template phrase lint gate for `473` in a throwaway git repository. It focuses on the gate refusing a commit that stages an editor-fallback trigger phrase, the message it prints and the guarantee that a refused commit leaves history unchanged."
version: 1.0.0.0
id: tooling-and-scripts-template-phrase-lint-blocked-commit
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 473 -- Template phrase lint blocked commit

## 1. OVERVIEW

This scenario validates the pre-commit phrase gate in a throwaway git repository. The gate reads the trigger phrases a commit adds to staged Markdown and refuses the commit when a phrase is a template default or an editor fallback. The fixture stages the phrase `session`, which the editor uses as its terminal fallback, and then tries to commit it.

### Why This Matters

A trigger phrase that the editor fills in by default makes a document match unrelated queries. The gate stops that phrase before it reaches history. This scenario proves the gate fires on the commit path, names the phrase and its class and leaves history unchanged.

---

## 2. SCENARIO CONTRACT

Operators stage a spec document with an editor-fallback phrase in a throwaway repository, attempt the commit and confirm the refusal.

- Objective: Prove that the phrase gate refuses a commit that stages the editor-fallback phrase `session`, names the phrase and its class, exits 1 and leaves the history at its two baseline commits.
- Playbook ID: 473.
- Real user request: `Commit this spec change with the new trigger phrase, and stop me if the phrase is a template or editor default.`
- Prompt: `Commit this spec change with the new trigger phrase, and stop me if the phrase is a template or editor default.`
- Preconditions: A checkout that holds `.skilled/skills/system-spec-kit`, `.skilled/skills/sk-doc`, `.skilled/skills/cli-classifier`, `.skilled/skills/sk-code`, `.skilled/hooks` and `.skilled/scripts/git-hooks`, with Node, git, rsync and bash available. The gate runs only inside a repository the local config trusts, so the fixture sets that switch itself.
- Expected execution process: Build the throwaway repository, install the pre-commit hook, stage the phrase, run the linter directly, attempt the commit and read the history.
- Expected signals: The linter exits 1 and prints an error line that carries `[gate:template-phrase-lint]`, the phrase `"session"`, the class `[editor-fallback]` and the reason. The commit exits 1 with the gate's closing lines, which name the bypass variable. The history still holds the two baseline commits.
- Desired user-visible outcome: The operator sees the phrase, the reason and the bypass hint, and history is unchanged.
- Pass/fail: PASS if the linter and the commit both exit 1, the output names the phrase and its class, and the history holds the two baseline commits. FAIL if the commit succeeds without the bypass, or the output does not name the phrase.

---

## 3. TEST EXECUTION

### Prompt

```
Commit this spec change with the new trigger phrase, and stop me if the phrase is a template or editor default.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the throwaway repository, trust its hooks, install the pre-commit hook and commit a baseline spec document.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)/repo"
OUT="$(mktemp -d)"
mkdir -p "$FIXTURE" && cd "$FIXTURE"
export GIT_CONFIG_GLOBAL="$FIXTURE.gitconfig" && : > "$GIT_CONFIG_GLOBAL"
git init -q && git config user.name Fixture && git config user.email fixture@test.invalid
mkdir -p .skilled/skills .skilled/scripts .opencode specs
rsync -a --exclude node_modules "$CHECKOUT/.skilled/skills/system-spec-kit" "$CHECKOUT/.skilled/skills/sk-doc" "$CHECKOUT/.skilled/skills/cli-classifier" "$CHECKOUT/.skilled/skills/sk-code" .skilled/skills/
ln -s "$CHECKOUT/.skilled/skills/system-spec-kit/node_modules" .skilled/skills/system-spec-kit/node_modules
rsync -a "$CHECKOUT/.skilled/hooks" .skilled/
rsync -a "$CHECKOUT/.skilled/scripts/git-hooks" .skilled/scripts/
touch .opencode/.gitkeep
printf 'dist/\nnode_modules\n' > .gitignore
git add -A && git commit -q -m baseline
git config --local skilled.trustRepoHooks true
git config --local speckit.hooks.mirrorParity off
ln -s "$FIXTURE/.skilled/scripts/git-hooks/pre-commit" .git/hooks/pre-commit
mkdir -p specs/legacy-track/001-phrase-demo
cat > specs/legacy-track/001-phrase-demo/spec.md <<'SPEC'
---
title: "Phrase demo"
description: "Phrase lint fixture"
trigger_phrases:
  - "phrase demo"
---

# Phrase demo
SPEC
git add -A && git commit -q -m "phrase baseline"
```

The two `git config --local` lines are fixture settings. The trust switch lets the hook run in a repository that is not the checkout, and the mirror switch turns off the agent mirror gate, because the fixture carries no runtime mirrors.

2. Stage the editor-fallback phrase and run the linter directly.

```bash
cat > specs/legacy-track/001-phrase-demo/spec.md <<'SPEC'
---
title: "Phrase demo"
description: "Phrase lint fixture"
trigger_phrases:
  - "phrase demo"
  - "session"
---

# Phrase demo
SPEC
git add specs/legacy-track/001-phrase-demo/spec.md
node .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs
echo "lint_exit=$?"
```

3. Attempt the commit and read the history.

```bash
git commit -q -m "add session phrase" > "$OUT/commit.out" 2> "$OUT/commit.err"
echo "commit_exit=$?"
cat "$OUT/commit.err"
git log --oneline
```

### Expected

Step 1 prints the notice `pre-commit: the mirrorParity gate is off (git config speckit.hooks.mirrorParity in local config).` and then `template-phrase-lint: checked 1 staged Markdown file(s), 1 new phrase(s)` for the baseline commit. The notice comes from the fixture's mirror switch, which step 1 sets. The hook prints it on every commit while that switch is off, so it is expected and ignorable, and it changes neither the exit code nor the verdict. Step 2 prints one error line for `specs/legacy-track/001-phrase-demo/spec.md`. That line carries `[gate:template-phrase-lint]`, the phrase `"session"`, the class `[editor-fallback]` and the reason that the phrase is a terminal fallback of the frontmatter editor. The linter then prints `lint_exit=1`. Step 3 prints `commit_exit=1`. Its stderr starts with the same ignorable mirrorParity notice, then repeats the phrase line, then the gate closing line `staged trigger phrases contain a template or editor fallback.` and the hint `bypass with SPECKIT_SKIP_PHRASE_LINT=1 git commit ...`. The history lists only `phrase baseline` and `baseline`.

### Evidence

- The linter output and exit code from step 2.
- The commit exit code, the stderr from step 3 and the `git log` output.

### Pass / Fail

- **Pass**: The linter and the commit both exit 1, the output names the phrase `"session"` with the class `[editor-fallback]`, and the history holds the two baseline commits.
- **Fail**: The commit succeeds without the bypass variable, the output does not name the phrase or its class, or the history gains a commit.

### Failure Triage

If the commit succeeds, the hook did not run, so check that `.git/hooks/pre-commit` is a link to the fixture's copy and that `skilled.trustRepoHooks` is set to `true` in the fixture's local config. If the commit fails on another gate, read its message, because the other gates are outside this scenario. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [template-phrase-lint-commit-gate.md](../../feature-catalog/tooling-and-scripts/template-phrase-lint-commit-gate.md)
- Implementation: [template-phrase-lint.mjs](../../runtime/cli/spec/template-phrase-lint.mjs)

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 473
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/template-phrase-lint-blocked-commit.md`
