# Orchestrator steps

Prepared by the implementer on 2026-10-24. Every step below needs a `git add`, `git commit`, `git push`
or the `~/.zshrc` edit, so the implementer did not run it. Operator approvals are in
`operator-approvals.md`. Run the steps in order.

State the implementer left behind:

| Repository | HEAD | Branch | `git status --porcelain` lines before | after | Untracked paths under `local-skills` |
|---|---|---|---|---|---|
| `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com` (private) | `2276660` | `main` | 31 | 32 (one collapsed `?? local-skills/`) | 162 |
| `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin` (public) | `281a0745` | `main` | 931 | 932 (one collapsed `?? local-skills/`) | 66 |

Both repositories carry a machine-wide commit-msg hook that enforces the sk-git contract through their
`.skilled` link, and it requires a prose body. The approved subjects are kept. Each message file below
adds a short body and passes `validate-message.mjs --commit` with exit 0 and no warning.

## Step 1. Commit and push the Webflow repository (T095a)

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
MSG="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/commit-message-webflow.txt"
test -z "$(git -C "$WEBFLOW_REPO" diff --cached --name-only)" && echo INDEX_CLEAN
git -C "$WEBFLOW_REPO" add local-skills/local-webflow
git -C "$WEBFLOW_REPO" diff --cached --name-only | grep -c '^local-skills/local-webflow/'
git -C "$WEBFLOW_REPO" diff --cached --name-only | grep -c -v '^local-skills/local-webflow/' || true
git -C "$WEBFLOW_REPO" commit -F "$MSG"
git -C "$WEBFLOW_REPO" push origin HEAD:main
```

Expected: `INDEX_CLEAN`, `162`, `0`, a commit, a push to `main`. Stop if the second count is not `0`.
Commit message file: `scratch/commit-message-webflow.txt`.

Proof:

```bash
WEBFLOW_REPO="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
git -C "$WEBFLOW_REPO" ls-files local-skills/local-webflow | wc -l
git -C "$WEBFLOW_REPO" show --name-only --format= HEAD | grep -c -v '^local-skills/local-webflow/' || true
test "$(git -C "$WEBFLOW_REPO" rev-parse HEAD)" = "$(git -C "$WEBFLOW_REPO" rev-parse origin/main)" && echo WEBFLOW_PUSHED
```

Expected: `162`, `0`, `WEBFLOW_PUSHED`.

Rollback: `git -C "$WEBFLOW_REPO" revert <commit>` and a second push after another yes.

## Step 2. Commit and push the Obsidian repository (T095b, public)

```bash
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
MSG="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/sk-code/013-private-surface-skills/004-private-local-skills/scratch/commit-message-obsidian.txt"
test -z "$(git -C "$OBSIDIAN_REPO" diff --cached --name-only)" && echo INDEX_CLEAN
git -C "$OBSIDIAN_REPO" add local-skills/local-obsidian
git -C "$OBSIDIAN_REPO" diff --cached --name-only | grep -c '^local-skills/local-obsidian/'
git -C "$OBSIDIAN_REPO" diff --cached --name-only | grep -c -v '^local-skills/local-obsidian/' || true
git -C "$OBSIDIAN_REPO" commit -F "$MSG"
git -C "$OBSIDIAN_REPO" push origin HEAD:main
```

Expected: `INDEX_CLEAN`, `66`, `0`, a commit, a push to `main`. Stop if the second count is not `0`.
A scan for secrets, absolute home paths and key material over the Obsidian tree (changelog excluded) found nothing.
Commit message file: `scratch/commit-message-obsidian.txt`.

Proof:

```bash
OBSIDIAN_REPO="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
git -C "$OBSIDIAN_REPO" ls-files local-skills/local-obsidian | wc -l
git -C "$OBSIDIAN_REPO" show --name-only --format= HEAD | grep -c -v '^local-skills/local-obsidian/' || true
test "$(git -C "$OBSIDIAN_REPO" rev-parse HEAD)" = "$(git -C "$OBSIDIAN_REPO" rev-parse origin/main)" && echo OBSIDIAN_PUBLISHED
```

Expected: `66`, `0`, `OBSIDIAN_PUBLISHED`.

Rollback: `git -C "$OBSIDIAN_REPO" revert <commit>` and a second push after another yes.

## Step 3. Append the shell export (T006b)

```bash
grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc
zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'
```

If the count is `0` and nothing prints, append once:

```bash
printf '\nexport SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"\n' >> ~/.zshrc
```

Skip the append if a line already holds the two-root value. Stop if a different value exists.

Proof:

```bash
zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'
grep -c '^export SPECKIT_PRIVATE_SKILL_ROOTS=' ~/.zshrc
```

Expected: `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills` and `1`.

Rollback: delete the one appended line.

Note: an exported variable alone does not make the daemon-backed advisor see the private skills. The launcher
child-env allowlist in `.skilled/bin/system-skill-advisor-launcher.cjs` omits `SPECKIT_PRIVATE_SKILL_ROOTS`
(confirmed: a daemon started with the variable exported had no such variable in its environment, and
`advisor_rebuild` indexed 0 `local-*` rows). The in-process indexer finds both. This blocks phase 005's routing
probe until the allowlist gains the one key. It was not changed here because it is outside this phase's scope.

## Step 4. Remove the temporary directory (T100)

Run only after Steps 1 and 2 print their Expected values.

```bash
rm -rf /tmp/psurf-phase4
test ! -e /tmp/psurf-phase4 && echo REMOVED
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain .skilled | wc -l
```

Expected: `REMOVED` and `0`. The logical-path audit script lives only in that directory
(`/tmp/psurf-phase4/link-audit-logical.sh`). Copy it first if a later phase wants it.

## Step 5. Remaining tasks, in order

T101 (independent review), T102, T103 (all 22 acceptance rows still read `Unmet` because AC-019, AC-021 and AC-022
need Steps 1 to 3), T104, T105 (`repair-derived.cjs --apply` then `validate.sh --strict`), T106 (commit by name),
T107, T108 (push `HEAD:main`) and T109 (final state). T106 stages by name: the scratch files
`commit-message-*.txt`, `orchestrator-steps.md` and `operator-approvals.md` are not in its list, so leave them out.
