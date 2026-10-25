---
title: "484 -- Private skill commit guard"
description: "This scenario validates the private-skill pre-commit gate for `484` in a throwaway git repository. It focuses on the gate refusing a commit that stages a `local-*` skill path, the repair line it prints and the guarantee that a refused commit leaves history unchanged."
version: 1.0.0.0
id: tooling-and-scripts-private-skill-commit-guard
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 484 -- Private skill commit guard

## 1. OVERVIEW

This scenario validates the pre-commit private-skill gate in a throwaway git repository. A skill whose folder name starts with `local-` belongs to one checkout, so the gate refuses any staged path under `local-*` in one of the eight skill roots. The fixture stages a `SKILL.md` inside a `local-probe` skill folder and then tries to commit it.

### Why This Matters

The ignore rules keep a private skill out of `git status`, but `git add -f` overrides them. The gate is the second line, and it has no bypass flag. This scenario proves the gate fires on the commit path, names the staged path and its repair, and leaves history unchanged.

---

## 2. SCENARIO CONTRACT

Operators stage a `local-*` skill file in a throwaway repository, attempt the commit, confirm the refusal and run the printed repair.

- Objective: Prove that the private-skill gate refuses a commit that stages a `SKILL.md` in the `local-probe` skill folder, names the path and the repair, exits 1 and leaves the history at its one baseline commit, and that the printed repair empties the index.
- Playbook ID: 484.
- Real user request: `Commit this new skill, and stop me if it is a private local skill that must never be published.`
- Prompt: `Commit this new skill, and stop me if it is a private local skill that must never be published.`
- Preconditions: A checkout that holds `.skilled/scripts/git-hooks`, with git and bash available. The gate needs no toolchain, so the fixture links the checkout's hook directly.
- Expected execution process: Build the throwaway repository, install the pre-commit hook, stage the private skill file, attempt the commit, read the history and run the printed repair.
- Expected signals: The commit exits 1 and stderr carries the gate tag `[gate:private-skill]`, the staged path and a `Fix: git rm --cached -r --` line naming it. The history still holds the baseline commit only. After the repair the index holds no staged path.
- Desired user-visible outcome: The operator sees the path and the repair command, and history is unchanged.
- Pass/fail: PASS if the commit exits 1, the output names the path and the repair, the history holds one commit and the repair empties the index. FAIL if the commit succeeds, or the output does not name the path.

---

## 3. TEST EXECUTION

### Prompt

```
Commit this new skill, and stop me if it is a private local skill that must never be published.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Build the throwaway repository, trust its hooks, install the pre-commit hook and commit a baseline file.

```bash
CHECKOUT="$(pwd)"
FIXTURE="$(mktemp -d)/repo"
OUT="$(mktemp -d)"
mkdir -p "$FIXTURE" && cd "$FIXTURE"
export GIT_CONFIG_GLOBAL="$FIXTURE.gitconfig" && : > "$GIT_CONFIG_GLOBAL"
git init -q && git config user.name Fixture && git config user.email fixture@test.invalid
echo seed > seed.txt && git add -A && git commit -q -m baseline
git config --local skilled.trustRepoHooks true
ln -s "$CHECKOUT/.skilled/scripts/git-hooks/pre-commit" .git/hooks/pre-commit
```

The trust switch lets the hook run in a repository that is not the checkout.

2. Stage the private skill file, attempt the commit and read the history.

```bash
mkdir -p .skilled/skills/local-probe && printf 'private\n' > .skilled/skills/local-probe/SKILL.md
git add .skilled/skills/local-probe/SKILL.md
git commit -q -m "add private skill" > "$OUT/commit.out" 2> "$OUT/commit.err"
echo "commit_exit=$?"
cat "$OUT/commit.err"
git log --oneline
```

3. Run the printed repair and count the staged paths.

```bash
git rm --cached -r -q -- ".skilled/skills/local-probe/SKILL.md"
echo "staged_after_repair=$(git diff --cached --name-only | wc -l | tr -d ' ')"
```

### Expected

Step 2 prints `commit_exit=1`. Its stderr opens with the refusal line, which carries the gate tag `[gate:private-skill]` and ends `a private skill is staged and would be published:`, then `  .skilled/skills/local-probe/SKILL.md`, then `  Fix: git rm --cached -r -- ".skilled/skills/local-probe/SKILL.md"`. The history lists only `baseline`. Step 3 prints `staged_after_repair=0`.

### Evidence

- The commit exit code, the stderr and the `git log` output from step 2.
- The staged-path count from step 3.

### Pass / Fail

- **Pass**: The commit exits 1, the output names the staged path and the repair, the history holds the baseline commit only, and the repair leaves no staged path.
- **Fail**: The commit succeeds, the output does not name the path or the repair, or the history gains a commit.

### Failure Triage

If the commit succeeds, the hook did not run, so check that `.git/hooks/pre-commit` is a link to the checkout's hook and that no global `core.hooksPath` overrides it inside the fixture. If the commit fails on another gate, read its message, because the other gates are outside this scenario. Reset the fixture by deleting the fixture directory and building it again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Implementation: [pre-commit](../../../../scripts/git-hooks/pre-commit)
- Automated coverage: [pre-commit.test.sh](../../../../scripts/git-hooks/tests/pre-commit.test.sh)

Provenance: manual only - bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 484
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/private-skill-commit-guard.md`
