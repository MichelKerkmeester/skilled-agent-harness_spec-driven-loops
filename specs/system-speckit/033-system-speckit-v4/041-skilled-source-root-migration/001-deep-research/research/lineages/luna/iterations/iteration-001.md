# Iteration 1: Symlink topology and runtime container asymmetry

## Focus

Inventory the external mirror shapes and determine which apparent mirrors are actually consumed by each runtime.

## Findings

### Surface: 1, Symlink topology

- **Finding:** A live `find` plus `realpath` pass found 427 symlinks resolving inside this checkout's `.opencode` tree. The external runtime roots account for 174 of them: `.claude` 56, `.codex` 19, `.cursor` 53, `.devin` 22, `.hermes` 2 and `.pi` 19. The remaining 253 are internal `.opencode` links and three are under `specs/`. All 427 link targets are relative in this checkout. The operator's 200-link figure therefore has a narrower scope than the resolved-link set and should not be reused without defining whether internal `.opencode` links are included. **Classification:** `mechanical`. **Consequence for the cutover:** The rewrite must enumerate both consumer links and internal links. A literal `.opencode` grep is insufficient because internal links such as changelog and hook adapters use relative targets without spelling `.opencode` in the target.
  - [SOURCE: `.claude/SYNC.md:24-41`]
  - [SOURCE: `.codex/SYNC.md:26-36`]
  - [SOURCE: `.cursor/SYNC.md:27-39`]
  - [SOURCE: `.devin/SYNC.md:27-39`]
  - [SOURCE: `.hermes/SYNC.md:22-31`]
  - [SOURCE: `.pi/SYNC.md:24-35`]

- **Finding:** `.claude/skills` and `.pi/skills` are whole-directory links into `.opencode/skills`, and `.hermes/agents` is a whole-directory link into `.opencode/agents`. `.claude/agents` is a real directory, not a mirror link. **Classification:** `mechanical` for the whole-directory links, `manual` for the real fork. **Consequence for the cutover:** A target rewrite preserves the first three only if the link target is changed. The Claude agent fork cannot be repaired by changing a symlink target because it has no symlink at that position.
  - [SOURCE: `.claude/SYNC.md:14-18`]
  - [SOURCE: `.claude/SYNC.md:24-34`]
  - [SOURCE: `.pi/SYNC.md:24-35`]
  - [SOURCE: `.hermes/SYNC.md:22-31`]

### Surface: 2, Runtime resolution contracts

- **Finding:** Claude's commands and skills are repository discovery surfaces, but the manifest says its hook mirror is discovery-only because `settings.json` command strings point directly at `.opencode` paths. **Classification:** `manual`. **Consequence for the cutover:** Rewriting hook mirror links alone does not update Claude execution. The settings command strings are a separate load-bearing reference surface.
  - [SOURCE: `.claude/SYNC.md:12-18`]
  - [SOURCE: `.claude/SYNC.md:34-41`]

- **Finding:** Cursor discovers custom agents and commands by fixed file convention. Its agents come from `.claude/agents`, while commands come from `.opencode/commands`; it has no project `.cursor/skills` surface. **Classification:** `blocker` for any design that assumes one shared source path can replace the runtime-native locations. **Consequence for the cutover:** `.cursor/agents`, `.claude/agents`, `.cursor/commands` and the direct `.opencode/commands` dependency all need independent treatment.
  - [SOURCE: `.cursor/SYNC.md:12-23`]
  - [SOURCE: `.cursor/SYNC.md:27-39`]

- **Finding:** Devin consumes nested `.devin/agents/<name>/AGENT.md` links to Claude-format files, discovers `.opencode/skills` without a `.devin/skills` mirror and has no mirrored command surface. **Classification:** `blocker` for a design that creates `.devin/commands` or assumes a `.devin/skills` link is required. **Consequence for the cutover:** The existing discovery path is the contract, and the nested shape must remain intact even after source relocation.
  - [SOURCE: `.devin/SYNC.md:12-21`]
  - [SOURCE: `.devin/SYNC.md:27-39`]

- **Finding:** Codex and Pi use generated agents and prompt trees rather than symlinks. Codex's hook configuration is installed outbound to the user-global file, and Pi's generated agent tree is not currently read by an installed surface. **Classification:** `regenerate`. **Consequence for the cutover:** Repointing links cannot update these trees. Their generators and the outbound Codex installer are separate migration surfaces.
  - [SOURCE: `.codex/SYNC.md:14-20`]
  - [SOURCE: `.codex/SYNC.md:24-36`]
  - [SOURCE: `.pi/SYNC.md:12-18`]
  - [SOURCE: `.pi/SYNC.md:24-35`]
  - [SOURCE: `.pi/SYNC.md:80-87`]

- **Finding:** Hermes keeps real generated markdown-only skill copies because scanning a whole linked tree would traverse scripts, dependencies and references. Its agents link to `.opencode/agents`, but Hermes has no agent flag, so agent personas are also mirrored as `agent-*` skills. **Classification:** `regenerate`. **Consequence for the cutover:** Replacing `.hermes/skills` with a link to `.skilled/skills` would violate the documented scanner constraint. The generator must read the new source and continue emitting real copies.
  - [SOURCE: `.hermes/SYNC.md:12-18`]
  - [SOURCE: `.hermes/SYNC.md:22-31`]

## Sources Consulted

- `.claude/SYNC.md`
- `.codex/SYNC.md`
- `.cursor/SYNC.md`
- `.devin/SYNC.md`
- `.hermes/SYNC.md`
- `.pi/SYNC.md`
- Live `find`/`realpath` inspection of symlink objects, with output retained only in the iteration assessment.

## Assessment

- `newInfoRatio`: 1.0
- Novelty justification: This pass corrected the scope of the starting symlink count and identified three distinct mirror classes: direct links, generated copies and dialect forks.
- Confidence: high for repository topology and documented mirror ownership. Runtime behavior claims remain repository-documented unless a live runtime probe is available.

## Reflection

- Worked: manifest-driven inspection plus `realpath` exposed internal relative links that a literal target search misses.
- Ruled out: treating all runtime directories as interchangeable symlink consumers.
- Failed: the repository does not contain the upstream implementation of each external CLI's discovery scanner, so hardcoded-versus-configurable behavior cannot yet be proven for every runtime.

## Recommended Next Focus

Trace the seven runtime path contracts and the generators that materialize their native trees.
