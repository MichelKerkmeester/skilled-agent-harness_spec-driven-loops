# Lead steer

Review target: the build commit(s) on this branch after the scaffold commit 0039903bde (the build commit is 0c5dbe87c1). List them with
`git log --oneline 0039903bde..HEAD` and read each diff with `git show <sha>`. Review only what those
commits change: the argument parsers and exit paths of the scripts named in this packet's spec.md
ledger, their typo-flag tests, the shared helpers `system-deep-loop/runtime/scripts/lib/cli-guards.cjs`
(assertKnownFlags) and `system-skill-advisor/runtime/scripts/routing-accuracy/reject-unknown-options.mjs`,
the version bumps and the changelog entries.

Questions worth checking:
- Does any parser now reject an option a real caller (hook, workflow, command doc, other script) passes?
- Does any parser still accept a misspelled option, or reject a valid one (value flags, `--flag=value`, `--help`)?
- Is each exit code consistent with that script's existing usage code (the packet keeps 64, 1 and the deep-loop JSON exit 3 where they existed)?
- Do the tests prove the changed behavior, and would they fail without the fix?

Rulings: the exit-code choices above are operator decisions, not findings. The two pass-through
exceptions in spec.md are deliberate. `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`
is a served copy that was left unchanged on purpose. Every finding needs a command that reproduces it.
