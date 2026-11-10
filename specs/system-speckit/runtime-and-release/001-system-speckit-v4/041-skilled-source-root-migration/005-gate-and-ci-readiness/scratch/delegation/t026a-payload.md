# Edits for unit t026a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/README.md`

OLD:

~~~~text
an untracked skill cannot authorize a remote owner).
~~~~

NEW:

~~~~text
an untracked skill cannot authorize a remote owner).
- Each gate finds its scripts under `.opencode/`, a path that keeps resolving once the tree moves to `.skilled/` and `.opencode` becomes a link to it, and every staged-path filter and pathspec names both roots. A checkout that ships the toolchain is marked by `skills/system-spec-kit/SKILL.md` under either root. There, a missing gate script never passes in silence: a gate that can block exits 1 naming the path and its bypass, and a gate that cannot block warns. Any other repository the globally installed hooks run in sees no new output and no new block.
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/README.md`

OLD:

~~~~text
Fails safe (exits 0) if `worktree-naming.sh` is missing or fails to source.
~~~~

NEW:

~~~~text
Fails safe (exits 0) if `worktree-naming.sh` fails to source. Where the toolchain ships, a missing `worktree-naming.sh` blocks each push the remote gate would check until `SPECKIT_ALLOW_REMOTE_PUSH` approves it, a missing mass-deletion library blocks update pushes until `SPECKIT_ALLOW_MASS_DELETION=1` and a missing route guard blocks until `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1`.
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/README.md`

OLD:

~~~~text
| Autostash ownership |
~~~~

NEW:

~~~~text
| Missing gate scripts | Where the toolchain ships, a blocking gate whose script is missing exits 1 naming the path. `prepare-commit-msg`, `post-commit`, `post-merge` and `post-rewrite` warn instead, because git ignores their exit status or they never block by contract. Elsewhere a missing script adds no new output and no new block. |
| Autostash ownership |
~~~~
