# Iteration 019 — Hooks and runtime wiring: the installer's own status check is the weak link

## Focus

Final sweep before the depth checkpoint, on the hook layer rather than the doctor layer:

1. Read the git hook scripts under `.skilled/scripts/git-hooks`, the hook installer `.skilled/scripts/install-git-hooks.sh`, and the runtime hook config this child had not yet cited (`.claude/settings.json` hooks block, `.codex`/`.opencode` wiring). Hunt for three specific defects: a hook that exits 0 on its own failure, a hook named in a config that does not exist on disk, and a gate a documented env switch claims to control but the script never reads.
2. Re-run the strongest repros available in check mode only, recording command, key output line and exit code.

## Actions Taken

1. **Resolved every hook the repo actually runs.** `.git/hooks` carries six symlinks (`commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-commit`, `pre-push`) into `.opencode/scripts/git-hooks/`, and `readlink` + `[ -e ]` showed all six exist. `.opencode/scripts` is itself a symlink to `../.skilled/scripts`, so both names reach the same files. `git config --get core.hooksPath` returned `/Users/michelkerkmeester/.config/git/hooks`, which holds seven absolute symlinks into `.skilled/scripts/git-hooks/`. **No missing-file finding**: every path named in a config resolves on disk.
2. **Inventoried every `SKILLED_*`/`SPECKIT_*` switch.** I extracted the 22 variables the hooks README documents and diffed them against every variable the hook scripts and libs read. Zero documented-but-unread — the drift I expected was not there. Four are read but undocumented: `SKILLED_ONLY_REPO`, `SKILLED_SHA`, `SPECKIT_SKIP_COMMIT_MSG_VALIDATE`, `SPECKIT_SKIP_DOC_MODEL_VALIDATE`; the last two appear only inside `tests/`, which makes them test harness switches rather than operator switches, so they are not documentation drift. One of them is still a real defect (F19-04).
3. **Tested the fail-open hypothesis on `pre-commit` and refuted it.** The bootstrap block reads `hook-flags.sh` under `set +e`, captures `_hook_flags_rc`, and on any failure prints `WARNING [gate:hook-flags]: resolver unavailable; commit gates remain enabled.` — fail-**closed** [SOURCE: .skilled/scripts/git-hooks/pre-commit:67], with the same treatment for a missing lib [SOURCE: .skilled/scripts/git-hooks/pre-commit:72]. My "hook exits 0 on its own failure" lead died here. The one silent exit that survives is the operator's own kill switch [SOURCE: .skilled/scripts/git-hooks/pre-commit:69], already recorded in an earlier iteration.
4. **Refuted a second hypothesis before writing it.** I suspected `git-hook-gates.cjs` never reads `core.hooksPath`. It does not, but it does not need to: it reads the gate registry [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:45], and `git-setup-check.cjs` owns the hooks-path question [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:438]. The coverage exists; only the *installer's* status rendering is wrong.
5. **Reproduced a live false positive in the installer's status check** (repro below), which is the substantive result of this iteration.

## Findings

### F19-01 — `--status` reports every hook as `SHADOWED` when the same file is reached through the `.opencode` alias (P1, bug, reproduced)

`resolve_target` follows exactly one symlink hop and deliberately does not canonicalise [SOURCE: .skilled/scripts/install-git-hooks.sh:96]. The status loop then compares the resolved target against `$HOOK_SOURCE_DIR/$name` as a **string** [SOURCE: .skilled/scripts/install-git-hooks.sh:136] and, on any difference, prints `SHADOWED: the installed hook resolves outside this checkout` [SOURCE: .skilled/scripts/install-git-hooks.sh:137]. Because `.opencode/scripts -> ../.skilled/scripts`, the string `<repo>/.opencode/scripts/git-hooks/pre-commit` differs from `<repo>/.skilled/scripts/git-hooks/pre-commit` while naming the *same inode*. Any repo installed through the `.opencode` name — which the installer itself supports via `OWNED_HOOK_SOURCE_DIRS` — is reported as running another checkout's copy.

Repro (read-only; drops the global hooksPath with an env override so `HOOK_TARGET_DIR` becomes `.git/hooks`):

```
GIT_CONFIG_GLOBAL=/dev/null bash .skilled/scripts/install-git-hooks.sh --status | grep -c SHADOWED
7
```

Key output line: `SHADOWED: the installed hook resolves outside this checkout` ×7, against `installed: <repo>/.opencode/scripts/git-hooks/<name>`. Exit code: `0`.

The false positive is not cosmetic, because the doctor workflow converts it into an instruction: *"A SHADOWED hook runs another checkout's copy, which may predate gate settings; say so"* [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:82]. The agent would tell the operator their hooks are stale when they are this checkout's own scripts. Verify: the repro above, then `readlink .opencode/scripts` → `../.skilled/scripts`. Fix shape: compare `realpath` of both sides, or reuse `is_our_symlink`/`OWNED_HOOK_SOURCE_DIRS` [SOURCE: .skilled/scripts/install-git-hooks.sh:77] instead of a string inequality.

### F19-02 — `--status` cannot fail: it exits 0 with hooks missing (P2, bug/UX)

The status branch ends in an unconditional `exit 0` [SOURCE: .skilled/scripts/install-git-hooks.sh:149], after having printed `(not installed)` as prose only [SOURCE: .skilled/scripts/install-git-hooks.sh:108] — and my repro B produced exactly that line for `prepare-commit-msg` while still exiting 0. So the one command the doctor prose tells the agent to run [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:82] carries no machine signal at all. The repo already has the better pattern next door: `check-git-hooks.sh` warns to stderr and is documented as advisory [SOURCE: .skilled/bin/check-git-hooks.sh:23]. Verify: `bash .skilled/scripts/install-git-hooks.sh --status >/dev/null; echo $?` → `0`. Improvement: `--status --json` emitting `{hooksPath, installed, shadowed, missing}` plus an explicit `--check` that exits non-zero.

### F19-03 — a global `core.hooksPath` makes this working tree load-bearing for every repository on the machine, and only the worktree case is warned about (P2, over-engineering/UX)

The installer's own source-root comment states the consequence: *"These scripts run for every repository on the machine"* [SOURCE: .skilled/scripts/install-git-hooks.sh:33]. The tail of the script warns precisely about the linked-worktree variant of this hazard — dangling symlinks after a worktree removal [SOURCE: .skilled/scripts/install-git-hooks.sh:203] — but the global case it just created gets no warning, and no check anywhere detects a global hooks dir whose links dangle because this checkout moved. What breaks if the global install is removed: nothing in this repo (`.git/hooks` still holds six working links), so the global layer is the removable one; what breaks if this checkout is moved: commit and push gates across every repo on the machine. Verify: `git config --global --get core.hooksPath` then `ls -l ~/.config/git/hooks`.

### F19-04 — a test sets `SPECKIT_SKIP_DOC_MODEL_VALIDATE`, which no hook reads (P2, misalignment)

`pre-commit.test.sh` runs the hook with `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:34]. No file under `.skilled/scripts/git-hooks` outside `tests/` contains that name, and `pre-commit` gates on `SPECKIT_SKIP_DOC_VERSION_BUMP`, `SPECKIT_SKIP_PHRASE_LINT`, `SPECKIT_SKIP_COMMENT_HYGIENE`, `SPECKIT_SKIP_MIRROR_PARITY` and `SPECKIT_SKIP_SKILL_AUTHORING` instead. The test therefore asserts a skip it never gets; it passes because the doc-model gate is either absent or reached with a fixture that satisfies it. Verify: `grep -rn SPECKIT_SKIP_DOC_MODEL_VALIDATE .skilled/scripts/git-hooks --exclude-dir=tests` → no match.

## Questions Answered

- **"What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?"** New friction evidence: a status check that reports seven false `SHADOWED` lines (F19-01) and cannot exit non-zero when a hook is genuinely absent (F19-02). The first actively misinforms through the workflow prose; the second makes a green status meaningless.

## Questions Remaining

- **Q3/Q4 hooks half — still dominant, and now cheaper to answer.** `--status` is answerable without a scratch repo; accept/reject behaviour is not. `validate-message-git-timeout.test.mjs` and `commit-id-naming.test.sh` remain the cheapest route and still need `/tmp` write authority.
- Carried: the v4.0.0.15/v4.0.0.16 worktree behaviours; `Commit-Id: 0000000` plus a valid id; a pushed commit with no `Commit-Id`; Devin's 16,384-byte rule cut.
- **Q11** — command and skill format against sk-code / sk-doc canon. Untouched for a fourth iteration.

## Next Focus

Depth checkpoint. Reconcile the 19 iterations against the two strategy questions, decide which carried questions are answerable read-only, and state plainly which ones need `/tmp` write authority so the checkpoint records them as blocked rather than merely open.
