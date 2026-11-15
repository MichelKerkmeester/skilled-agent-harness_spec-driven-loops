# VIB-HK-018 operator procedure

The live run of `hook-scenarios/dist-freshness-shell-conversation.md` recorded a skip, not a pass.
This file names the runner limitation behind that skip and the manual steps that exercise the hook.

## 1. What the live run recorded

- `matrix.md`: runtime `vibe`, verdict `SKIP`, turns passed `0/2`.
- `vibe/checkpoints.tsv`: both turns `SKIP` with the blocker `no warning: every watched package in
  the checkout is fresh, so the all-packages check reports nothing and the runner cannot make the
  checkout stale mid-session`.
- `vibe/turns/validate/screen.txt`: the subject ran the validator through `bash` and reported its
  five errors, so the shell call the hook watches did happen.
- `vibe/turns/validate/check.txt`: the journal holds `validator-finished`, so the command reached
  the shell, and holds no `STALE DIST WARNING`.
- `vibe/turns/build-state/check.txt`: the checkout's own verdict is `"stale":false` for every
  watched package.

## 2. The runner limitation, in three parts

1. The shell path of the hook judges the checkout, never the scratch project.
   `dist-freshness.mjs` calls `check-dist-staleness.sh --all`, and that branch runs
   `dist-freshness.cjs check-all` with no `--workspace-root` argument, so every watched package
   resolves against `findRepoRoot(__dirname)` — the checkout that owns the hook. The
   `SPECKIT_DIST_WORKSPACE_ROOT` override is read only by the single-file branch, which is why the
   edit scenario (VIB-HK-017) can borrow a scratch build and this one cannot. Verified by hand: the
   same `bash` payload, run with `SPECKIT_DIST_WORKSPACE_ROOT` naming a deliberately stale scratch
   package, printed nothing.
2. The scenario may not make the checkout stale. A watched package's source lives under
   `.skilled/skills/**`, which is product code, and the runner fails a row whose repo snapshot
   changed (`REPO_CHANGED`), so a subject or a setup command that edited one would either break the
   product or fail the run it was meant to prove.
3. A stale checkout at launch is repaired before the first turn unless the self-heal is switched
   off. The `session-start` hook runs the same `check-dist-staleness.sh --all` with
   `SPECKIT_DIST_AUTO_REBUILD` unset, and the checker's `_auto_rebuild_enabled()` defaults to on, so
   it rebuilds a stale watched package while the session opens.

The scenario therefore needs a build that is stale when the shell call runs, which is a mutation of
the checkout that only an operator can make.

## 3. Manual steps

Run these from the repository root. The switch in step 1 is what keeps the session-start self-heal
from repairing the build before the first turn.

1. Export the self-heal switch in the shell that launches the runner, so the subject inherits it:

       export SPECKIT_DIST_AUTO_REBUILD=0

2. Append one line to a watched package's source and do not rebuild it:

       printf '\n// operator probe\n' >> .skilled/skills/system-spec-kit/shared/src/index.ts

3. Confirm the build is now behind its source:

       node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all --json --no-write

   The output must read `"stale":true` for `@spec-kit/shared`.

4. Run the scenario exactly as its contract states:

       env -u AI_SESSION_CHILD -u SYSTEM_SPEC_GATE_ENFORCE -u MK_SPEC_GATE_ENFORCE \
         CONVERSATION_REPO_ROOT="$PWD" node \
         .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs \
         --scenario .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/dist-freshness-shell-conversation.md \
         --runtime vibe --scratch "$(mktemp -d)" --out /private/tmp/vib-hk-018-operator

5. Read the `bash` result in the turn's `screen.txt`, or the journal, for the banner and the warning:

       grep -rqs 'STALE DIST WARNING' "$VIBE_HOME/logs/session/unified" && echo warning-recorded

   The result must carry, as a second content item, `Dist freshness after this tool call:` followed
   by `STALE DIST WARNING: @spec-kit/shared -- run: cd .skilled/skills/system-spec-kit/shared && npm run build`.

6. Restore the checkout: revert the appended line and rebuild the package.

       cd .skilled/skills/system-spec-kit/shared && npm run build && cd -

## 4. What a pass looks like

The row is a pass only when the journal holds a `post_tool_call` record for the `bash` call whose
tool result carries the banner and a `STALE DIST WARNING` naming a watched package. A warning on a
different tool call, or a fresh checkout with no warning, is not a pass.
