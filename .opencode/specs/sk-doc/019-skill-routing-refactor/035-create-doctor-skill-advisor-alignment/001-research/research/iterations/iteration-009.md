# Iteration 009 — Linked-worktree source selection before runtime-mirror repair

## Focus

Should the `/doctor:runtime-mirrors` route present the linked-worktree primary-checkout path as an explicit source-selection diagnostic before offering any repair command?

## Actions Taken

- Read the iteration state, strategy, and immutable research configuration before investigating.
- Re-ran `node .opencode/bin/install-codex-hooks.mjs --check` from the active checkout. The check exited 1 because this session is in a linked worktree; the installer reported the primary checkout and required an explicit override to use the worktree.
- Compared the installer’s Git-anchor guard with the runtime-mirror route manifest and asset. The route has no flags or inputs, invokes the hook checker without `--repo`, and presents repair commands separately from its read-only diagnostic.
- Rechecked the route/asset checker inventory. The asset lists Pi checkers, while the route manifest still lists only the five older invocations; this remains the ordering constraint carried from iteration 8.

## Findings

### F-009-01 — The hook check fails before drift analysis in a linked worktree

The installer rejects a linked-worktree repository anchor before it reads or compares the user-global hook file. Its error includes the detected primary checkout and suggests `--allow-worktree`, which is an anchor override rather than a canonical-source selector. In this checkout, the actual command reproduced that failure. [SOURCE: .opencode/bin/install-codex-hooks.mjs:287-314]

### F-009-02 — The doctor route has no explicit source-selection stage

`runtime-mirrors` declares `allowed_flags: []`, says it takes no inputs, and invokes `install-codex-hooks.mjs --check` without a repository argument. Its repair output recommends the bare installer command. Consequently, a linked-worktree operator receives a failure and a repair command that repeats the same ambiguous anchor choice; the route does not turn the reported primary path into an explicit diagnostic or selected source. [SOURCE: .opencode/commands/doctor/_routes.yaml:189-201] [SOURCE: .opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:24-28,43-46,52-70]

### F-009-03 — The primary checkout should be shown before any repair handoff

The route should detect and display the current checkout, whether it is linked, and the Git primary checkout before presenting repair guidance. For the default read-only hook check, the diagnostic should use an explicit `--repo <primary-checkout>` or require the operator to select a source; repair remains operator-owned. A bare repair command is not sufficient because it hides the source boundary and fails again from a linked worktree. The repository sync manifest already treats the outbound hook installer as a global reconciliation step and documents `--check` as the drift check. [SOURCE: .codex/SYNC.md:18,69,114-117]

### F-009-04 — Do not use `--allow-worktree` as the default route fix

`--allow-worktree` disables the installer’s linked-worktree anchor refusal. It does not establish that the worktree is the canonical checkout for a global hook installation, so using it as the route’s automatic repair advice would conflate “permit this anchor” with “select the authoritative source.” The safer handoff is an explicit selected repository, with `--allow-worktree` left as an intentional expert override if worktree-local checking is ever exposed. [SOURCE: .opencode/bin/install-codex-hooks.mjs:287-314]

## Questions Answered

- **Yes, conditionally on the iteration-8 ordering:** restore the missing Pi checker invocations first so the route’s declared checker set is complete; then add a linked-worktree source diagnostic before any repair command. The diagnostic is independently justified because the Codex hook checker currently fails at the anchor guard and the route has no source-selection contract.
- **Recommended route behavior:** show `current checkout`, `linked-worktree: yes/no`, and `primary checkout` before the hook result; use or request an explicit selected repository for the check; render repair commands only after that source is visible. Keep the route read-only and keep repairs operator-triggered.

## Questions Remaining

- Should the read-only route automatically select the Git primary checkout for the hook check, or show it and require an explicit `--repo` confirmation? This remains separate from whether repair commands require approval.
- After Pi parity is restored, should the source-selection contract stay Codex-hook-specific or be generalized across all mirror checkers through a common checker API?

## Next Focus

After Pi invocations are restored, determine whether source selection should remain a Codex-hook-only option or become a shared repository-root contract across runtime-mirror checkers.
