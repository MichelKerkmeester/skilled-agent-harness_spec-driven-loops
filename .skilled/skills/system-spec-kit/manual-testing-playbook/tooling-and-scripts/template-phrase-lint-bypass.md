---
title: "474 -- Template phrase lint bypass"
description: "This scenario validates the template phrase lint bypass for `474` in a throwaway git repository. It focuses on the SPECKIT_SKIP_PHRASE_LINT variable letting one commit through the phrase gate, the linter reporting the skip and the guarantee that the bypass is limited to that one command."
version: 1.0.0.0
id: tooling-and-scripts-template-phrase-lint-bypass
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 474 -- Template phrase lint bypass

## 1. OVERVIEW

This scenario validates the bypass for the pre-commit phrase gate in a throwaway git repository. Scenario 473 showed the gate refusing a commit that stages the editor-fallback phrase `session`. Here the same commit runs with `SPECKIT_SKIP_PHRASE_LINT=1` set on the command line, and the scenario confirms that the commit lands and that the variable does not persist to the next commit.

### Why This Matters

A gate with no bypass blocks legitimate work, and a bypass that persisted would silently disable the gate for every later commit. This scenario proves that the bypass works for one command and expires with it.

---

## 2. SCENARIO CONTRACT

Operators commit the editor-fallback phrase with the bypass variable set, then commit again without it to confirm the gate is back on.

- Objective: Prove that `SPECKIT_SKIP_PHRASE_LINT=1` lets one commit that stages the phrase `session` land, that the linter reports the skip, and that the next commit without the variable is refused again.
- Playbook ID: 474.
- Real user request: `Commit this trigger phrase even though the gate flags it, and keep the gate on for everything after this commit.`
- Prompt: `Commit this trigger phrase even though the gate flags it, and keep the gate on for everything after this commit.`
- Preconditions: The same checkout and tools as scenario 473. The fixture sets the same two local config switches as scenario 473.
- Expected execution process: Build the throwaway repository, stage the phrase, commit with the bypass variable, confirm the skip message, then stage a second phrase and commit without the variable.
- Expected signals: The bypass commit exits 0 and lands on top of the two baseline commits. Running the linter with the variable set prints `template-phrase-lint: skipped by SPECKIT_SKIP_PHRASE_LINT=1`. The commit without the variable exits 1 again.
- Desired user-visible outcome: The operator gets the commit they asked for, and the gate stays on for the next commit.
- Pass/fail: PASS if the bypass commit exits 0 and the next commit without the variable exits 1. FAIL if the bypass commit exits non-zero, or the next commit without the variable succeeds.

---

## 3. TEST EXECUTION

### Prompt

```
Commit this trigger phrase even though the gate flags it, and keep the gate on for everything after this commit.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the throwaway repository with the same setup as scenario 473, then stage the editor-fallback phrase.

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
```

2. Commit with the bypass variable set, and confirm the linter reports the skip.

```bash
SPECKIT_SKIP_PHRASE_LINT=1 git commit -q -m "add session phrase (bypass)" > "$OUT/bypass.out" 2> "$OUT/bypass.err"
echo "bypass_exit=$?"
cat "$OUT/bypass.err"
SPECKIT_SKIP_PHRASE_LINT=1 node .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs
echo "skip_lint_exit=$?"
git log --oneline
```

3. Stage a second editor-fallback phrase and commit without the variable.

```bash
cat > specs/legacy-track/001-phrase-demo/spec.md <<'SPEC'
---
title: "Phrase demo"
description: "Phrase lint fixture"
trigger_phrases:
  - "phrase demo"
  - "session"
  - "context"
---

# Phrase demo
SPEC
git add specs/legacy-track/001-phrase-demo/spec.md
git commit -q -m "add context phrase" > "$OUT/next.out" 2> "$OUT/next.err"
echo "next_exit=$?"
cat "$OUT/next.err"
git log --oneline
```

### Expected

Step 2 prints `bypass_exit=0` with no phrase error on stderr, then the linter prints `template-phrase-lint: skipped by SPECKIT_SKIP_PHRASE_LINT=1` and `skip_lint_exit=0`. The history now lists `add session phrase (bypass)` above the two baseline commits. Step 3 prints `next_exit=1`. Its stderr names the phrase `"context"` with the class `[editor-fallback]` and the reason that it is a terminal fallback of the frontmatter editor, then the gate closing line and the bypass hint. The history is unchanged, still three commits.

### Evidence

- The exit code and stderr from step 2, and the skip line from the linter.
- The exit code, stderr and `git log` output from step 3.

### Pass / Fail

- **Pass**: The bypass commit exits 0, the linter reports the skip, and the next commit without the variable exits 1 with the phrase named.
- **Fail**: The bypass commit exits non-zero, the linter does not report the skip, or the next commit without the variable succeeds.

### Failure Triage

If the bypass commit still fails, a different gate is blocking it, so read that gate's message. The phrase gate reads the variable from the commit's environment, so set it on the same command as `git commit`, as step 2 does. If step 3 succeeds, the variable leaked into the shell, so start a new shell and rebuild the fixture. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [template-phrase-lint-commit-gate.md](../../feature-catalog/tooling-and-scripts/template-phrase-lint-commit-gate.md)
- Implementation: [template-phrase-lint.mjs](../../runtime/cli/spec/template-phrase-lint.mjs)

Provenance: manual only - SPECKIT_SKIP_PHRASE_LINT=1 git commit -q -m "add session phrase (bypass)"

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 474
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/template-phrase-lint-bypass.md`
