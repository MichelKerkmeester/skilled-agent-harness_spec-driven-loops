# Iteration 009 — Cross-surface consistency and contradictions

## Surface: 1/2/3 — Source-root identity versus runtime consumers

### Finding

- The shared workspace helper defines `.opencode/skills/system-spec-kit/SKILL.md` as the repository-root sentinel, describes that sentinel as a real authored file, and hoists above an outermost `.opencode` path when the sentinel walk fails. The proposed model makes `.opencode` a consumer link, so the current root-resolution invariant becomes a direct compatibility constraint: the sentinel must remain resolvable there and the hoisting behavior must not misidentify the consumer path. (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:4-21`, `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-27`, `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:48-69`)

- The OpenCode host configuration invokes `.opencode/bin/mcp-code-mode-launcher.cjs`, and that launcher then resolves the MCP server manifest and entrypoint below `.opencode/skills/mcp-code-mode/mcp-server`. This is a contradiction with treating `.opencode` as an empty consumer directory: the runtime needs a working compatibility surface at the old name, including the launcher and its downstream paths. (`opencode.json:10-19`, `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`, `.opencode/bin/mcp-code-mode-launcher.cjs:129-145`)

- The runtime-mirror generator intentionally keeps `.claude/agents` as the canonical source for Cursor and Devin while `.opencode/agents` remains the Codex, Pi and Hermes source. Therefore “all runtimes consume `.skilled` directly” does not describe the existing topology: the migration must preserve or replace two dialect/source relationships, not just retarget one universal symlink. (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`, `.codex/SYNC.md:16-18`, `.pi/SYNC.md:12-18`, `.hermes/SYNC.md:22-31`)

- Hermes’s project skills are generated markdown-only copies because scanning a whole linked canonical tree traverses scripts, dependencies and references; the manifest explicitly says that the linked-tree behavior quarantined content and that the copies are the intended safety boundary. This is a consumer limitation, not an ordinary stale-link case, so making `.hermes/skills` a direct `.skilled/skills` link would reintroduce the documented failure mode. (`.hermes/SYNC.md:12-18`, `.hermes/SYNC.md:22-31`)

### Classification

- `blocker` — the proposal cannot be implemented as a uniform “every runtime directory links directly to `.skilled`” shape while preserving the current OpenCode launcher requirement, Hermes scanner boundary and split agent dialects. The affected consumers need compatible positions, generated copies or deliberate forks. (`opencode.json:10-19`, `.hermes/SYNC.md:12-18`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`)

### Consequence for the cutover

- The source-root inventory must treat `.opencode` as both a runtime consumer and a compatibility namespace, not merely as a former source directory. A direct source move leaves breakage wherever a loader, root finder or launcher uses `.opencode` as an identity rather than as a relocatable file path. (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`, `opencode.json:10-19`, `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`)

## Surface: 4/5/8 — Generated state, gates and documentation consistency

### Finding

- The trigger-index generator resolves its corpus root by requiring both `.opencode` and `specs` as repository markers, while the shared root helper uses a `.opencode` sentinel. If `.opencode` becomes a symlinked consumer, the lookup may still work only if those paths remain resolvable, but the source code’s marker semantics and generated path identities still require explicit review. (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:69-88`, `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:48-69`)

- The skill-advisor graph scanner accepts an explicit `skillsRoot` argument, but its freshness contract, CLI launcher discovery and validation sentinel default to `.opencode` paths. This is a partial configurability asymmetry: one scan call can be pointed elsewhere, while the surrounding freshness, launcher and validation contracts remain fixed. (`.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:40-50`, `.opencode/skills/system-skill-advisor/runtime/lib/freshness.ts:85-94`, `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:193-207`, `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:212-220`)

- The repository’s gates are themselves consumers of the old identity: the pre-commit hook checks `.opencode`-scoped scripts and metadata, and the pre-push hook compares `.opencode` skill changes and compiled routing outputs. A path-only migration that updates source files but not gate scope can either reject the migration or fail to inspect `.skilled` changes. (`.opencode/scripts/git-hooks/pre-commit:14-27`, `.opencode/scripts/git-hooks/pre-commit:412-550`, `.opencode/scripts/git-hooks/pre-push:114-123`, `.opencode/scripts/git-hooks/pre-push:195-229`)

- The documentation surface contains both live instructions and intentionally historical paths: the root instructions prescribe `.opencode` commands, while the deep-loop changelog records the old directory name as point-in-time history. A global markdown substitution would alter a load-bearing contract and corrupt historical meaning at the same time. (`AGENTS.md:45-65`, `AGENTS.md:172-174`, `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`, `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:43-56`)

### Classification

- `regenerate` — trigger indexes, skill-advisor freshness artifacts, compiled routing and owned runtime mirrors have explicit producers and cannot be treated as ordinary prose replacements. (`.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:26-31`, `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:650-706`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`)

- `blocker` — the gates’ current scope and the new source root can disagree during the migration, creating either false rejection or an unreviewed source tree. (`.opencode/scripts/git-hooks/pre-commit:14-27`, `.opencode/scripts/git-hooks/pre-push:114-123`)

- `manual` — live instructions, generated prompt text, packaging contracts and historical records require different treatment. (`AGENTS.md:45-65`, `PUBLIC-RELEASE.md:10-36`, `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`)

### Consequence for the cutover

- The cross-surface blockers are not independent typo counts: they are identity contracts. A consumer can continue to work through a compatibility link only where its loader resolves that link; a generator or gate that searches for the literal `.opencode` root must be updated or explicitly retained, and a generated artifact must be rebuilt by its owner. (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`, `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:69-88`, `.opencode/scripts/git-hooks/pre-commit:14-27`)

## Surface: unresolved runtime configurability

### Finding

- Repository evidence identifies hardcoded and partially configurable paths, but it does not contain the upstream discovery implementations for Claude Code, Codex, Cursor, Devin, Pi, Hermes or OpenCode. Whether those runtimes can be configured to consume `.skilled` directly therefore remains UNKNOWN; the repository can establish its published paths and adapters, not undocumented upstream options. (`.codex/SYNC.md:16-18`, `.cursor/SYNC.md:12-39`, `.devin/SYNC.md:12-39`, `.hermes/SYNC.md:8-16`)

### Classification

- `manual` — the missing evidence is the exact installed-runtime discovery contract for each CLI version, recorded separately from this repository inventory. (`.codex/SYNC.md:16-18`, `.hermes/SYNC.md:8-16`)

### Consequence for the cutover

- No conclusion that “all seven runtimes can be pointed at `.skilled`” is verified by this checkout. The safe inventory result is the set of current consumer positions plus an explicit UNKNOWN for upstream configurability. (`.claude/SYNC.md:12-18`, `.codex/SYNC.md:16-18`, `.cursor/SYNC.md:12-39`, `.devin/SYNC.md:12-39`, `.hermes/SYNC.md:8-16`)

