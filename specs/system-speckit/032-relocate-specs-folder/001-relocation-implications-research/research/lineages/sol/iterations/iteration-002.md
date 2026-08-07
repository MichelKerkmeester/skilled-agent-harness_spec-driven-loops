# Iteration 2: Runtime mirror and symlink topology

## Focus

Determine whether each runtime consumes the specs tree through a direct mirror, a generated surface, shared prose references, or only the root `specs` compatibility link.

## Actions Taken

1. Inspected the root `specs` path and every runtime directory with `lstat`-level shell output.
2. Enumerated symlinks under `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi`.
3. Searched runtime manifests and generated agent surfaces for spec-root references.
4. Read the runtime-mirror synchronizer to identify which trees it actually owns.

## Findings

1. The live root topology is `specs -> .opencode/specs`; `.opencode/specs` is a real directory. Relocation inverts this relationship: `specs/` becomes the real canonical directory and, during compatibility, `.opencode/specs` should become the alias. [SOURCE: command `ls -ld specs .opencode/specs`]
2. None of `.claude/specs`, `.codex/specs`, `.cursor/specs`, `.devin/specs`, or `.pi/specs` exists in the live tree. Therefore no runtime-specific specs symlink currently needs repointing on disk. [SOURCE: command `ls -ld .claude/specs .codex/specs .cursor/specs .devin/specs .pi/specs`]
3. `.claude/SYNC.md` is stale on this point: it claims `.claude/specs` is a whole-directory symlink to `../.opencode/specs`, but the path is absent. Migration planning must follow filesystem evidence and should repair the manifest independently. [SOURCE: .claude/SYNC.md:28] [SOURCE: command `ls -ld .claude/specs`]
4. The runtime mirror generator does not manage a specs tree. It derives Cursor/Devin agent links, Cursor command links, and Claude/Codex/Cursor/Devin hook links; specs are absent from `buildExpectedLinks()`. A canonical-root move will not propagate through this synchronizer. [SOURCE: .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:100]
5. Runtime coupling is mostly indirect: Cursor and Devin symlink agents from `.claude/agents`; Codex and Pi generate their agents; those authored/generated agents commonly use the root-neutral spelling `specs/...`. Today that spelling resolves through the root symlink, so making `specs/` real preserves these consumers without regeneration solely for path resolution. [SOURCE: .cursor/SYNC.md:31] [SOURCE: .devin/SYNC.md:29] [SOURCE: .codex/SYNC.md:16] [SOURCE: .pi/SYNC.md:8]
6. Claude is the only manifest that claims a direct specs mirror, and that claim is currently false. Creating a new `.claude/specs` link during relocation is optional compatibility behavior, not a prerequisite for the five live runtime surfaces observed here. [SOURCE: .claude/SYNC.md:14] [INFERENCE: based on absence of all five runtime-specific specs paths and runtime mirror generator scope]
7. A reverse compatibility symlink at `.opencode/specs -> ../specs` is lower blast radius than updating every runtime-authored path immediately, but only if ignore rules and repository installation preserve the target. Git/global-ignore behavior is therefore a gating dependency, not an afterthought. [INFERENCE: based on root symlink inversion and the prevalence of both canonical and root-neutral spellings]

## Questions Answered

- Answered: the live cross-runtime mirror topology and what does or does not require repointing.

## Questions Remaining

- Whether Git tracks the root symlink and how repository/global ignores affect the inverted topology.
- Which MCP paths remain `.opencode/specs` canonical-only.
- Which executable references must move before compatibility aliases can retire.

## Ruled Out

- Repointing five runtime-specific specs symlinks: none exist.
- Relying on `sync-runtime-mirrors.cjs` to repair specs topology: it does not model specs links.
- Treating `.claude/SYNC.md` as current filesystem truth for the specs surface.

## Dead Ends

- The broad symlink enumeration includes hundreds of unrelated agent, command, hook, and package-bin links; only root/specs-related links affect this migration.

## Edge Cases

- Ambiguous input: “cross-runtime mirror behavior” can mean physical specs mirrors or generated documents containing specs paths; both were checked.
- Contradictory evidence: `.claude/SYNC.md` says a specs symlink exists, while filesystem evidence shows it does not.
- Missing dependencies: none.
- Partial success: installer behavior for downstream cloned/symlinked repositories moves to the Git-focused iteration.

## Sources Consulted

- Root and runtime symlink inventory commands
- `.claude/SYNC.md`
- `.codex/SYNC.md`
- `.cursor/SYNC.md`
- `.devin/SYNC.md`
- `.pi/SYNC.md`
- `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs`

## Assessment

- New information ratio: 0.86
- Novelty justification: six of seven findings were new, while the reverse-symlink recommendation refined the prior tooling evidence.
- Confidence: high for live filesystem topology; medium for downstream installation until ignore behavior is tested.

## Reflection

- What worked and why: filesystem inspection exposed a concrete manifest drift that prose-only review would miss.
- What did not work and why: unrestricted symlink enumeration was noisy because runtime trees contain many unrelated generated links.
- What I would do differently: constrain future mirror checks to declared surfaces plus filesystem existence checks.

## Recommended Next Focus

Test repository `.gitignore`, Git index state, and `~/.gitignore_global` interactions for the current and inverted symlink layouts, including downstream symlinked repositories.
