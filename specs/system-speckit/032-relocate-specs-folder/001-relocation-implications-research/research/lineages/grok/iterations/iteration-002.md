# Iteration 2: Cross-runtime mirrors and Gate-3 path language

## Focus

Determine whether runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) embed specs-root path assumptions, and how Gate 3 / framework docs encode `.opencode/specs` vs `specs/`.

## Findings

1. **Runtime hook JSON files do not embed `.opencode/specs` paths.** Grep of `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, and `.devin/hooks.v1.json` returned no specs-path hits. Mirrors proxy hooks into `.opencode/skills/...` and do not hardcode the specs tree location in event registration. [SOURCE: shell:rg runtime hook configs 2026-08-06]

2. **Mirrors symlink skills/commands into `.opencode`, not the specs tree.** `.claude/skills -> ../.opencode/skills` and `.claude/commands -> ../.opencode/commands` (and analogous Codex/Cursor/Devin/Pi hook shims). Specs relocation does not require remirroring those skill/command links. [SOURCE: ls -la .claude]

3. **`.claude/SYNC.md` documents a `specs` whole-dir symlink that is currently absent.** The table lists `specs | whole-dir symlink | ../.opencode/specs | No`, and prose says commands/skills/specs are whole-directory symlinks; `ls .claude/specs` fails. Documented contract and on-disk layout have drifted — relocation planning must not assume per-mirror specs aliases exist today. [SOURCE: .claude/SYNC.md:28] [SOURCE: shell:ls .claude/specs ENOENT]

4. **Gate 3 already dual-lists SPEC_ROOTS.** Both TS and compiled JS set `SPEC_ROOTS = ['.opencode/specs', 'specs']` and `hasSpecRootPrefix` accepts both prefixes. Operator prompts in `spec-gate-core.mjs` still *example* only `.opencode/specs/<track>/<NNN-name>`, biasing answers toward the canonical prefix even though both roots resolve. [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:136] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:107]

5. **Framework docs declare `.opencode/specs` canonical with legacy `specs/`.** AGENTS.md/CLAUDE.md: "Spec folder path | `.opencode/specs/[track]/[###-short-name]/` … Legacy `specs/[###-short-name]` may exist." A relocation that makes top-level `specs/` authoritative inverts this documented hierarchy and requires root-doc updates across mirrored CLAUDE/AGENTS copies. [SOURCE: AGENTS.md:265]

6. **`scaffold-debug-delegation.sh` derives packet_pointer from either root.** It checks OPENCODE_SPECS_ROOT then ROOT_SPECS_ROOT and strips the matching prefix — dual-root pointer derivation already exists for that helper. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:209]

## Ruled Out

- "All six mirrors each carry a live specs symlink that must be flipped" — only documented for Claude; on-disk `.claude/specs` missing; other SYNC.md files lack the row.
- "Hook configs are the primary specs-path blast radius" — they are not.

## Assessment

- newInfoRatio: 0.92
- Novelty justification: Five fully new mirror/Gate-3 findings; one partial refinement of iteration-1 dual-accept theme into operator-prompt bias.
- Questions answered: Cross-runtime mirrors do not hardcode specs roots in hook JSON; behavioral path language lives in Gate 3 prompts + AGENTS/CLAUDE; Claude SYNC docs claim a missing specs symlink.

## Recommended Next Focus

Model git/gitignore interactions for inverting or replacing the root `specs -> .opencode/specs` symlink under repo `!specs`/`!.opencode/` and global `/specs`/`/.opencode/` rules.
