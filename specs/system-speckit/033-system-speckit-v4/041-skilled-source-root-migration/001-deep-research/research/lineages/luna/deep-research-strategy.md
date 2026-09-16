# Deep Research Strategy

## Research Topic

GATE PRE-RESOLUTION: inventory what must change and what would break when the shared AI asset source moves from `.opencode` to `.skilled`.

## Known Context

- The operator supplied starting measurements for symlinks, literal references, workflows, gitignore entries and total symlinks. They are treated as hypotheses to extend or correct, not re-counted as final evidence.
- The operator ruled out `barter/` because its links resolve to another checkout.
- The artifact root is fixed to the luna lineage directory. No source-tree writes are authorized.
- `resource-map.md` is absent at initialization, so the coverage gate is skipped.

## Key Questions (remaining)

- [x] What is the complete symlink topology, including relative versus absolute targets and runtime-consumed positions?
- [x] What are the seven runtime resolution contracts, and which paths are configurable versus hardcoded?
- [x] What must remain resolvable at `.opencode/`, and which derived artifacts must be regenerated?
- [x] Which repository gates, CI workflows, documentation and external references become blockers?
- [x] Which migration mechanics create ordering constraints or irrecoverable breakage?

## Non-Goals

- Do not decide whether the migration is desirable.
- Do not propose the cutover sequence.
- Do not edit repository source, generated artifacts or configuration outside this lineage.

## Stop Conditions

- Run exactly 10 evidence iterations because `stopPolicy` is `max-iterations`.
- Synthesis must record `stopReason: maxIterationsReached`.
- Preserve UNKNOWN claims with the missing evidence that would settle them.

## Answered Questions

- The repository documents three mirror classes: direct symlinks, generated native-runtime copies and real dialect forks. The exact resolved-link scope is 427, not the narrower starting count. [SOURCE: `.claude/SYNC.md:24-41`; `.codex/SYNC.md:26-36`; `.hermes/SYNC.md:22-31`]
- Generator implementations hardcode most source roots, and prompt renderers embed `.opencode` paths as data. Hermes is the only checked-in generator with source/output environment overrides. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:19-23`; `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:19-27`]
- The OpenCode launcher, plugin contract and MCP doctor definition require exact `.opencode` runtime names and distinguish ignored/generated MCP build products from source files. [SOURCE: `opencode.json:10-19`; `.opencode/bin/mcp-code-mode-launcher.cjs:19-28`; `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`]
- Generated state has separate owners: trigger-index, leaf manifests, structural graph metadata, compiled deep-loop contracts, runtime dist and SQLite. The trigger generator also searches for `.opencode` as a repository-root marker. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:61-88`; `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:650-706`]
- The commit/push hooks and CI path filters hardcode `.opencode`, so the migration commit has a local hook-ordering dependency and `.skilled`-only edits can be invisible to path-filtered workflows. [SOURCE: `.opencode/scripts/git-hooks/pre-commit:14-27`; `.opencode/scripts/git-hooks/pre-push:114-123`; `.github/workflows/spec-kit-check.yml:7-15`]
- Documentation divides into live instructions, public packaging contracts, generated prompt markdown and historical records; only the first three require path treatment, while historical paths may be intentional. [SOURCE: `AGENTS.md:45-65`; `PUBLIC-RELEASE.md:10-36`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`]
- External state is a separate boundary: Codex hooks, Hermes MCP/trust/plugin configuration, Pi globals, OpenCode user fallbacks and machine-wide Git hooks are not moved by a repository rename. [SOURCE: `.codex/SYNC.md:16-18`; `.hermes/SYNC.md:8-16`; `.pi/SYNC.md:30-35`; `.opencode/hooks/git/install-hooks.sh:5-18`]
- Migration mechanics split into recomputable relative links, fixed `.opencode` discovery code, generated path-bearing outputs and repo-relative runtime state; a prior `git mv` precedent does not settle this larger move. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`; `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:193-207`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`]
- Cross-surface reconciliation found a non-uniform topology: `.opencode` is simultaneously a root sentinel, OpenCode launcher namespace, generator source identity and gate scope; Hermes scanning and split agent dialects prevent a universal direct-link consumer shape. [SOURCE: `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:26-69`; `opencode.json:10-19`; `.hermes/SYNC.md:12-18`; `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`]
- Final review classified every surface as mechanical, regenerate, manual or blocker and retained three UNKNOWNs: upstream runtime configurability, complete external home-state enumeration, and one-commit/history safety without a disposable rehearsal. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`; `.codex/SYNC.md:16-18`; `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`]

## What Worked

- Direct repository inspection with line-numbered source reads is the authoritative method.
- Manifest comparison exposed runtime-native positions and the reason Hermes cannot consume the whole shared tree. [SOURCE: `.hermes/SYNC.md:12-18`; `.cursor/SYNC.md:12-23`]

## What Failed

- External runtime behavior cannot be confirmed from this checkout alone unless a repository contract names it.
- Upstream OpenCode discovery configurability is not vendored, so the root override question remains UNKNOWN.

## Exhausted Approaches

None.

## Ruled Out Directions

- `barter/` is out of scope per the operator-provided reading of its link targets.

## Next Focus

All ten evidence iterations are complete. Synthesize the inventory, blocker list, resource map and convergence report; preserve the explicit UNKNOWN register and stop with maxIterationsReached.

## Research Boundaries

- Max iterations: 10
- Convergence telemetry threshold: 3
- Stop policy: max-iterations
- Executor: cli-codex, model `gpt-5.6-luna`
- All writes: this lineage directory only
