# Verdict on the GPT-5.6 Luna review of the fourth round of check fixes

The reviewer was GPT-5.6 Luna at `xhigh` on the fast tier through cli-codex, in a read-only sandbox, from 2026-09-17 08:21Z to 08:39Z. A worktree fingerprint before and after matched apart from the return file and the orchestrator's own document edits. It reviewed `3f8803e0d0` and `2f9d3bcdd2` (T058).

The reviewer asked for changes and raised five P1 findings and one P2 finding, and for each it answered that an ordinary edit could produce the shape. It found no bash 3.2.57 or BWK awk portability defect and no fixture case that passes without its change. The orchestrator reproduced all six against `2f9d3bcdd2`. Five rounds had now found 4, 8, 5, 4 and 6 shapes, and no CI workflow ran the hook test scripts, so the orchestrator put the result to the operator. The operator chose to fix all six, add the hook test scripts to CI, and publish without a sixth review.

| ID | Checked by | Verdict | Disposition |
|----|------------|---------|-------------|
| F1 | An array of `$REPO_ROOT/.opencode/...` paths expanded into `git diff` passed, because a variable path in an array was read as a script path | Confirmed | Fixed: a variable path in an array stays a script path unless the file expands that array into a git command, which makes its entries pathspecs that need twins. The real hooks' script arrays are not expanded into git and keep resolving. Case 37 |
| F2 | `node "$REPO_ROOT/.opencode/skills/demo/$MISSING"` counted the existing prefix as a resolved input | Confirmed | Fixed as far as text allows: a path that continues into a variable or a glob is now dynamic rather than resolved, in hooks and in workflows. What the variable holds is beyond a text check, so the input is reported as dynamic, not failed. Case 38 checks the counts |
| F3 | Two one-root regexes joined by `&&` on one line passed, because the literal check looked at the whole line | Confirmed | Fixed: regex groups and literals are judged per command segment. Case 39 |
| F4 | `git log --format='.skilled/...' -- .opencode/...` passed, because the format text counted as the twin | Confirmed | Fixed: in a git command, roots after `--` are pathspecs, roots before `--` are options or revisions, and an option value such as `--format=` is never a pathspec. Case 40 |
| F5 | A flow-style entry `- { package-ecosystem: "pip", directories: ["/.opencode/**"] }` joined the previous entry's group | Confirmed | Fixed: a flow-style list item opens a new entry. Case 41 |
| F6 | `node .opencode/bin/check-no-spec-imports.?js` failed as a missing input | Confirmed | Fixed: `?` and bracket expressions are globs, resolved with `compgen -G`. Case 42 |

All six new cases failed against `2f9d3bcdd2`, and the suite passes 42 of 42. The tree passes with 130 inputs resolved, 8 dynamic and 167 twin pairs, the three real-hook mutations still fail, and the round-four findings still fail.

`gate-inputs.yml` now also runs the six hook test scripts and the SessionStart check's test script. Those run the real hooks against staged changes under both roots, which covers the gates' behavior however a gate is spelled, where the text check can only cover what it can read. The scripts have only run on macOS so far, so CI on the pushed tip is their first Linux run.
