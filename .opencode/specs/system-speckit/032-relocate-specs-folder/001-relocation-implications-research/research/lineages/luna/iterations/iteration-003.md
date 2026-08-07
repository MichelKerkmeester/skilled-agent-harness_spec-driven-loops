# Iteration 3: Cross-runtime mirror behavior

## Focus

Identify whether `.claude`, `.codex`, `.cursor`, `.devin`, and `.pi` mirror or generate a specs tree, and separate relocation effects from pre-existing mirror drift.

## Actions Taken

- Read all five runtime sync manifests and the shared runtime-mirror generator.
- Inspected the actual runtime directory entries and searched active mirror/generator code for specs-root references.
- Ran read-only mirror checks for shared symlinks, Codex agents/prompts, Pi agents/prompts, and the all-runtime roster.

## Findings

- **F3.1 — the Claude manifest documents a specs symlink that is absent in the current tree.** `.claude/SYNC.md` says `specs` is a whole-directory symlink to `../.opencode/specs`, but the working-tree inventory has no `.claude/specs` entry; the actual root alias is the tracked repository-level `specs` symlink. This is a documentation/topology mismatch that relocation would make more visible. [SOURCE: .claude/SYNC.md:14-30] [SOURCE: command: `ls -la .claude; ls -ld .claude/specs specs .opencode/specs`]
- **F3.2 — the shared runtime-mirror generator does not own a specs mirror.** Its expected-link set covers Cursor and Devin agents/commands plus hook mirrors, with relative targets; it has no `.claude/specs`, `.codex/specs`, `.cursor/specs`, `.devin/specs`, or `.pi/specs` generation path. A specs relocation therefore is not automatically propagated by this generator. [SOURCE: .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:27-38] [SOURCE: .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:100-128] [SOURCE: .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:131-151]
- **F3.3 — Cursor and Devin mirror agent/command discovery, not specs.** Cursor symlinks agents from `.claude/agents` and commands from `.opencode/commands`; Devin nests symlinks to `.claude/agents` and has no mirrored command surface. Their relative symlink targets remain valid when the repository moves, but neither runtime supplies a second specs root to repoint. [SOURCE: .cursor/SYNC.md:27-39] [SOURCE: .devin/SYNC.md:25-38]
- **F3.4 — Codex and Pi generated surfaces also do not consume specs paths.** Their manifests and generators describe generated agents/prompts from `.opencode/agents` and `.opencode/commands`; the targeted generator search found no `.opencode/specs` dependency. Relocating specs should not require regeneration for path reasons, though the normal drift checks remain part of post-migration verification. [SOURCE: .codex/SYNC.md:24-36] [SOURCE: .pi/SYNC.md:22-35] [SOURCE: command: `rg -n 'specs|\.opencode/commands|\.opencode/agents' .opencode/skills/system-spec-kit/scripts/codex .opencode/skills/system-spec-kit/scripts/pi`]
- **F3.5 — the current mirror baseline is not clean, independently of relocation.** The shared mirror check reports a missing Cursor hook; Codex agent check reports a stale `orchestrate.toml`; Pi agent check reports nine stale generated agents. Codex and Pi prompts pass, and the all-runtime roster check reports 13/13 coverage. These existing findings must be separated from any relocation regression. [SOURCE: command: `sync-runtime-mirrors.cjs --check`] [SOURCE: command: `sync-agents.cjs --check`] [SOURCE: command: `sync-prompts.cjs --check`] [SOURCE: command: `sync-agents-pi.cjs --check`] [SOURCE: command: `sync-prompts-pi.cjs --check`] [SOURCE: command: `agent-roster-mirror-check.cjs`]

## Questions Answered

- Q2 is answered for the named runtime mirrors: the active generators manage agents, prompts, commands, and hooks; they do not manage a cross-runtime specs directory.
- The only specs-specific mirror claim found is the stale Claude manifest entry, so a relocation plan must validate the actual filesystem rather than rely on the manifest alone.

## Questions Remaining

- What exact root does the Memory MCP server use for indexing, context, and graph/FTS recovery paths?
- What is the measured reference count after excluding documentation, fixtures, archives, and generated output?
- Which in-repo path references remain after the tooling, Git, and mirror-specific references are classified?

## Ruled Out

- A broad “regenerate all five runtime surfaces because specs moved” requirement is ruled out by the generator contracts: the generated surfaces do not consume the specs root directly.

## Dead Ends

- The shared mirror check is not a clean migration baseline because it already reports unrelated drift. Its output is still useful as a pre-existing-state receipt.

## Edge Cases

- A stale manifest entry can create false confidence about a runtime path that does not exist in the working tree.
- Relative symlinks in the agent/command mirrors are repository-location-safe, but that property does not apply to arbitrary absolute path literals inside hand-authored hooks or docs.
- Pi extensions are hand-authored guard bridges and therefore need separate path-reference inspection even though generated Pi agents/prompts do not reference specs.

## Sources Consulted

- `.claude/SYNC.md:12-65`
- `.codex/SYNC.md:12-70`
- `.cursor/SYNC.md:12-75`
- `.devin/SYNC.md:1-115`
- `.pi/SYNC.md:1-122`
- `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:1-151`
- Read-only mirror and roster checks listed in F3.5

## Assessment

Cross-runtime risk is lower than the core tooling and Git risk, but the runtime tree has a stale documentation claim and an already-dirty mirror baseline. The relocation should preserve the current runtime generator boundaries, explicitly verify that no specs mirrors are expected, and record pre/post drift results so unrelated mirror failures are not misattributed to the move.

## Reflection

- What worked and why: reading manifests alongside generator code distinguished documented intent, actual ownership, and current filesystem state.
- What did not work and why: a clean all-runtime baseline is unavailable because several independent mirror checks already fail.
- What I would do differently: run the mirror checks against a known-clean commit or isolated checkout before evaluating a future relocation diff.

## Recommended Next Focus

Q4 — trace Spec Kit Memory MCP root discovery and path normalization for indexing, context, graph, and diagnostic recovery paths.
