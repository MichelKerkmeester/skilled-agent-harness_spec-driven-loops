# Running Notes

Observations from operating the research program itself. These are not research findings; they are
things the program hit while running, recorded so they are not lost to the transcript.

---

## Architectural constraint discovered in SOL iteration 1

`evaluate(command, rules)` in `dispatch-rule-checks.mjs` takes **no repository-state argument**. It
is a command-only matcher: it can classify `--hard`, `--force`, `-D`, `--prune=now` and deletion
refspecs from the command string, but it cannot see dirty count, HEAD detachment, worktree linkage,
or the active account.

Every state-gated rule the research proposes therefore needs either an extended evaluator signature
or a separate git-specific one. Phase 003 must decide which. This is one iteration's finding and is
not yet independently confirmed.

The same iteration measured reflog prevalence in this repository: commit 73.55%, reset 13.56%,
rebase 2.97%, amend 0.47%. Those are prevalence ceilings, not advisory fire rates — the repository
has no Bash-hook invocation log, so true fire rates cannot be derived from them. An unconditional
`reset` rule would fire on roughly one in seven git mutations, which is squarely in the
teaches-you-to-skim-past-it range.

---

## Devin permission mode blocked the first pass

The first GLM dispatch ran with `--permission-mode auto`, which auto-approves read-only tools only.
The pass completed, produced its findings, and could not write them; its log ends with the agent
asking for write approval. Its result summary survives in `devin-01-blocked-writes.log` and is worth
reading, but the full table was lost.

Re-run at `--permission-mode accept-edits`, which auto-approves workspace edits. The prompt already
scopes writes to this `research/` directory, so the wider permission does not widen the write scope.

**Carry into phase 002 or 003 as a candidate rule source:** the failure shape here — a dispatched
agent completing successfully while silently producing no artifact, exit code 0 — is the same shape
as the pathspec-commit omission that phase 004 exists to address. Success-with-no-output is a class,
not an incident.

---

## The GLM passes cannot run git

Every `git ...` invocation is rejected by the runtime guard in Devin's non-interactive session.
`cat`, `ls`, `wc`, `grep` and the read tools are not blocked.

Consequence: pass 01's enumeration carries **zero measured numbers** and is taxonomy plus inference
only. Read it as a candidate map, not as evidence. Pass 02 worked around the block by reading
`.git/logs/HEAD`, `.git/worktrees/*/logs/HEAD` and `.git/logs/refs/remotes/origin/**` as plaintext,
which is why it has real figures.

The SOL passes run through `cli-opencode` and are not blocked, so measurement claims from that
lineage and from GLM pass 02 onward are checkable; measurement claims from GLM pass 01 are not.

## Cross-model corroboration on the reset numbers

SOL iteration 1 and GLM pass 02 independently measured reset at 13.56% and 13.5% of operations,
by different methods (`git reflog` versus reading `.git/logs/HEAD` directly). An independent
re-measure from the orchestrator returns 201 of 1486 entries, also 13.5%.

GLM pass 02 then supplies the discriminator that makes a reset rule viable: **93% of resets are
unstage-only** — `reset: moving to HEAD`, where the old and new SHA are identical. Verified
independently at 188 of 201. History-moving resets are therefore roughly 0.9% of all operations.

A `reset` rule gated on the verb fires on one operation in seven and will be ignored. The same rule
gated on old SHA differing from new SHA fires on roughly one in a hundred. Carry this into phase
002: the discriminator is the rule, not the verb.

Also measured: **32 linked worktrees, 824 worktree reflog entries.** Worktree-origin pushes are not
a rare edge case in this repository, which bears directly on the worktree-push rule.

---

## Toolchain blocker: strict validation cannot run

`validate.sh --strict` crashes before producing output:

```
Cannot find package '.../mcp-server/node_modules/zod/index.js'
  imported from .../mcp-server/dist/lib/graph/graph-metadata-schema.js
```

`.opencode/skills/system-spec-kit/mcp-server/node_modules` holds 10 entries and 9 are empty
directories, including `zod`, which `package.json` declares as `^4.1.12`. There is no repo-root
`node_modules/zod` and no `workspaces` field, so this package resolves its own dependencies and its
install is incomplete. No npm process is running; the directory mtimes have been static since
20:59.

This is environmental and pre-existing — the session-start hook emitted a stale-dist warning for
this same package, and the crash reproduces against unrelated sibling packets, so it is not specific
to this one.

**Not repaired during the run, deliberately.** The fix is `npm install` in that package directory,
which writes only to a git-ignored tree and is reversible by deleting it and reinstalling. It was
held back because the SOL fan-out is executing `opencode` against this repository right now, and
churning `node_modules` underneath a running research lineage risks destabilising it for no urgent
gain. Validation is a completion gate, and completion is not being claimed yet.

The last full validation run before the crash began reported **0 errors** across the packet tree.
That result predates the final authoring pass on phases 002 to 004, so it does not cover the current
contents and must be re-run before any completion claim.
