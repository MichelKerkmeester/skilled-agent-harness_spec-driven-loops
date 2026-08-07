# Iteration 2: Git, symlink, and ignore behavior

## Focus

Determine how the tracked root `specs` symlink, repository negations, and the global ignore file behave before and after a root relocation.

## Actions Taken

- Read the repository `.gitignore` header, provider-specific specs exclusions, and the global ignore file configured through `core.excludesfile`.
- Inspected the root `specs` symlink, its Git index mode, and its resolved target.
- Ran `git check-ignore --no-index` on the root and `.opencode` paths, including the symlink traversal failure for a child path.
- Kept the analysis read-only; no symlink, index, ignore file, or downstream repository was changed.

## Findings

- **F2.1 — `specs` is a tracked symlink, not an untracked convenience alias.** The index records mode `120000` for `specs`, and its target is `.opencode/specs`; the link currently resolves to a directory. Replacing the root with a real directory is therefore a Git object/topology change, not only a path rename. [SOURCE: command: `git ls-files --stage -- specs`] [SOURCE: command: `readlink specs; test -L specs; test -d specs`]
- **F2.2 — this source repository explicitly negates the global ignores.** The local `.gitignore` explains that the global file hides `/.opencode/` for symlinked repositories and then negates both `.opencode/` and `specs`. The global file itself contains anchored `/specs` and `/.opencode/` ignores. The source repo therefore has different visibility from downstream repositories that do not carry the local negations. [SOURCE: .gitignore:5-11] [SOURCE: /Users/michelkerkmeester/.gitignore_global:7-16]
- **F2.3 — downstream real `specs/` directories remain exposed to the global `/specs` rule unless their local policy changes.** A downstream repository using the shared global file will ignore a top-level `specs/` path by default; a local `!specs` rule or a global-policy change is required before a real relocated tree can be tracked there. This is an inference from the anchored global pattern and the source repository's explicit override. [SOURCE: /Users/michelkerkmeester/.gitignore_global:10-16] [SOURCE: .gitignore:5-11] [INFERENCE: downstream repositories without the local negations inherit the global ignore]
- **F2.4 — provider-specific ignore entries still encode the old topology.** The local file excludes selected projects under `.opencode/specs`, plus stale/provider-specific `.claude/specs`, `.codex/specs`, and `.agents/specs` paths. A move to root `specs/` would leave those exclusions unmatched unless they are deliberately repointed, so ignore behavior for those projects can change during migration. [SOURCE: .gitignore:260-279]
- **F2.5 — symlink traversal makes pre-migration checks less representative.** `git check-ignore --no-index` can report the root `specs` negation, but a child such as `specs/system-speckit` fails with “beyond a symbolic link.” Once `specs/` is a real directory, child-path ignore checks become directly observable; tests must cover both the current symlink topology and the target real-directory topology. [SOURCE: command: `git check-ignore -v --no-index -- specs specs/system-speckit .opencode/specs .opencode/specs/system-speckit`]

## Questions Answered

- Q3 is answered at the policy level: the source repo intentionally tracks the old-root content through local negations, while the global ignore file is designed to hide both root symlinks and `.opencode` trees in downstream repos.
- The existing root symlink is tracked and must be treated as a deliberate compatibility boundary during any migration.

## Questions Remaining

- Which runtime mirrors actually carry a specs link today, and which only document or generate agent/command mirrors?
- What root does the Memory MCP server use for indexing, context, and graph/FTS recovery paths?
- What is the measured reference count after excluding documentation, fixtures, archives, and generated output?
- Should compatibility retain a root symlink, or should downstream repositories adopt an explicit local negation before the cutover?

## Ruled Out

- The claim that the current source repository's local ignore result predicts downstream behavior is ruled out; the configured global ignore source creates a different contract for downstream symlinked repositories.

## Dead Ends

- Direct child-path ignore inspection through the tracked `specs` symlink is not available because Git treats the path as beyond a symbolic link. The root-level index and ignore evidence remain usable.

## Edge Cases

- Changing the symlink target without changing the index entry preserves mode `120000`; materializing a real directory changes the index shape and affects checkout/clone behavior.
- The local `!specs` rule is a negation for the source repository, not a portable override of another repository's global ignore configuration.
- Existing `.opencode/specs/<provider>` exclusions do not automatically follow content moved to `specs/<provider>`.

## Sources Consulted

- `.gitignore:1-16,260-279`
- `/Users/michelkerkmeester/.gitignore_global:7-16`
- `git ls-files --stage -- specs`
- `git check-ignore -v --no-index -- specs specs/system-speckit .opencode/specs .opencode/specs/system-speckit`
- `readlink specs; test -L specs; test -d specs`

## Assessment

The Git risk is topology-sensitive. The current source repository is prepared to see both aliases, but the global policy is deliberately hostile to those aliases in downstream repositories. A safe migration must define whether the compatibility symlink remains, how a real `specs/` directory is unignored downstream, and how provider-specific exclusions map to the new root before any file movement.

## Reflection

- What worked and why: combining index mode, symlink resolution, local ignore lines, and the global `core.excludesfile` exposed the source/downstream split.
- What did not work and why: child-path ignore inspection through the symlink cannot model a real-directory migration in place.
- What I would do differently: validate the same paths in a disposable clone with a real `specs/` directory, but that would require writes outside this lineage and was intentionally not performed.

## Recommended Next Focus

Q2 — inspect `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirror/symlink generation and determine whether any of them carry an actual specs path dependency.
