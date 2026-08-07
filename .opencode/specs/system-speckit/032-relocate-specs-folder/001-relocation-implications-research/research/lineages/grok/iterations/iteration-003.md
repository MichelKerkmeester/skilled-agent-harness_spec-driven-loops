# Iteration 3: Git symlink and gitignore interactions

## Focus

Trace the root `specs` symlink, repo `.gitignore` negations (`!specs`, `!.opencode/`), and `~/.gitignore_global` `/specs` + `/.opencode/` rules for a relocation that makes top-level `specs/` the real tree.

## Findings

1. **Root `specs` is a tracked symlink to `.opencode/specs`.** `readlink specs` → `.opencode/specs`; `git ls-files -s specs` shows mode `120000` (symlink). The real tree lives under `.opencode/specs`. [SOURCE: shell:readlink specs] [SOURCE: shell:git ls-files -s specs]

2. **Repo `.gitignore` explicitly negates global ignores for this source repo.** Comments state global ignores `/.opencode/` for symlinked repos, but this repo is the SOURCE and must track `.opencode/`; patterns `!.opencode/` and `!specs` override. [SOURCE: .gitignore:7] [SOURCE: .gitignore:10] [SOURCE: .gitignore:11]

3. **`~/.gitignore_global` ignores root `/specs` and entire `/.opencode/`.** Downstream Barter repos that *symlink* AI-SpecKit content rely on these ignores so the symlink and `.opencode` tree stay untracked. Pattern `/specs` is root-anchored (only top-level `specs`). [SOURCE: ~/.gitignore_global:11] [SOURCE: ~/.gitignore_global:16]

4. **If the real tree moves to top-level `specs/` and `.opencode/specs` becomes a symlink (or is removed), roles invert.** In the SOURCE repo: `!specs` already un-ignores top-level specs, so a real directory can be tracked — but every historically tracked path under `.opencode/specs/**` must be re-added under `specs/**` (or git will see a delete+add of thousands of files). Downstream repos: global `/specs` would ignore the new real tree if they ever materialize it locally without a local negation — today they ignore the symlink; after inversion they may need `!specs` locally if they want to track anything, or keep ignoring if specs remain a symlink into a shared mount. [SOURCE: .gitignore:11] [SOURCE: ~/.gitignore_global:11]

5. **`git check-ignore` cannot traverse into the current symlink for child paths.** `git check-ignore -v specs/system-speckit` fails with "beyond a symbolic link", confirming tooling friction around the alias today. [SOURCE: shell:git check-ignore specs/system-speckit]

6. **`specs` appears with `H` in `git ls-files -v`.** Assume-unchanged bit is set on the symlink entry in this workspace snapshot — operational nuance for operators editing the link; not a contract requirement but a local state hazard during migration. [SOURCE: shell:git ls-files -v specs → H specs]

## Ruled Out

- "Just flip the symlink and gitignore needs no changes" — SOURCE history and path index under `.opencode/specs/**` still move; downstream global `/specs` semantics change meaning if the real content lives at top-level.
- "Global `/.opencode/` ignore becomes irrelevant" — `.opencode/` still holds skills/commands/plugins; only the specs subtree would leave.

## Assessment

- newInfoRatio: 0.95
- Novelty justification: Six findings are new git/gitignore mechanics; none were in prior iterations.
- Questions answered: Symlink+negation+global-ignore triangle mapped; inversion implications for SOURCE vs downstream repos stated.

## Recommended Next Focus

Map Spec Kit Memory MCP indexing roots, alias SQL, and canonical-path helpers against a top-level `specs/` authoritative tree.
