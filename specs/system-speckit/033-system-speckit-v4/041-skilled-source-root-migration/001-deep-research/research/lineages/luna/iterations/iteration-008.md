# Iteration 008 — Migration mechanics and path identity

## Surface: 7 — Migration mechanics

### Finding

- The repository has one documented directory-rename precedent: `git mv storage database` preserved history, and the implementation change was concentrated in one directory constant plus a lifecycle test path. That proves the project has used a history-preserving rename, but it does not prove equivalent similarity or safety for the much larger `.opencode` source-root move. (`.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`, `.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:53-66`)

- The runtime-mirror generator deliberately computes relative symlink targets from each mirror location to a repository-relative source and documents that this keeps mirrors valid when the repository itself moves. The computation does not preserve links when the source-relative directory name changes; the expected source constants and each generated link must change before the links can be regenerated. (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`)

- The mirror generator treats `.claude/agents`, `.claude/commands` and `.opencode/commands` as distinct source/consumer positions, and it derives hook links from runtime config strings containing `.opencode`. A root move therefore changes both generator source constants and the data-to-link extraction rule; changing only existing symlink targets is insufficient. (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-47`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:83-94`, `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:120-143`)

- Codex prompt generation owns its output directory and renders the canonical path `.opencode/commands/<relative-path>` into every prompt stub. A rename that leaves generated prompt files untouched produces prompts that still point at the old root; write mode or an equivalent named regeneration is required. (`.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:19-23`, `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`)

- Hermes is the only inspected source generator with explicit source/output environment overrides for its skill and agent trees, but its rendered markdown still names `.opencode/skills/<skill>` as the canonical path. The override can relocate the read/write roots for that generator; it does not remove the embedded path contract or establish that Hermes itself accepts `.skilled` as a project skill root. (`.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:19-33`, `.opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:76-94`)

- Existing runtime code contains fixed `.opencode` discovery assumptions beyond the mirror generator: the skill graph defaults to `resolve(cwd, '.opencode/skills')`, freshness metadata uses `.opencode/skills`, the advisor CLI searches for `.opencode/bin` and `.opencode/skills`, and validation uses `.opencode/skills/system-spec-kit/SKILL.md` as a sentinel. These are source-level path identities that a mass text rewrite must treat as behavior, not prose. (`.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:40-50`, `.opencode/skills/system-skill-advisor/runtime/lib/freshness.ts:85-94`, `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:189-207`, `.opencode/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:212-220`)

### Classification

- `mechanical` — relative links can be regenerated from changed source constants, and generated prompt/mirror outputs have named owners. (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`, `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`)

- `manual` — the documented rename precedent is insufficient to decide whether this move’s history similarity, commit shape or external-cache treatment is acceptable. The missing evidence is a dry-run on a disposable copy plus an operator decision about history and compatibility policy; no such dry-run was performed here. (`.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md:21-27`)

- `blocker` — fixed discovery assumptions in advisor and runtime code can make the new root invisible even if all symlinks are mechanically retargeted. (`.opencode/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:40-50`, `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:189-213`)

### Consequence for the cutover

- The move has two separate path classes: relative repository links and source code/configuration that names `.opencode`. Relative links can be recalculated; hardcoded discovery paths, rendered prompt text, and generated state require their owning code or generator to change and then their outputs to be refreshed. (`.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:145-160`, `.opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:82-99`, `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:193-207`)

- UNKNOWN: repository evidence does not establish whether the final change can land as one commit while every local and machine-wide hook remains usable. The pre-commit hook itself runs `.opencode`-named checks and may stage generated files, while the global hooks and external registrations are outside the repository. The missing evidence is a disposable-checkout commit rehearsal with hooks installed, not a live checkout mutation. (`.opencode/scripts/git-hooks/pre-commit:14-27`, `.opencode/scripts/git-hooks/pre-commit:194-234`, `.codex/SYNC.md:16-18`)

## Surface: 4 — Derived and generated state, path class

### Finding

- The legacy projection manifest records repo-relative runtime paths such as `.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl`, loop-guard state under `.opencode/skills/.state`, and the compiled command manifest under `.opencode/commands/deep/assets/compiled`. These are not absolute caches, but existing state and projection contracts are keyed to the old root and must be handled as named artifacts rather than assumed to follow a directory rename. (`.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:193-204`, `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:228-250`)

- The write-containment code explicitly recognizes `.opencode/skills/system-deep-loop/runtime/database` and scoped `description.json`/`descriptions.json` files as regenerable runtime state. This makes the repository-relative/derived distinction explicit: these artifacts can be recreated, but their path policy still names `.opencode` and must be changed with the owner. (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:948-969`)

### Classification

- `regenerate` — repo-relative derived state has named projection/generator owners and should be rebuilt or rehydrated from those owners rather than edited as arbitrary text. (`.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:193-204`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:948-969`)

### Consequence for the cutover

- Repo-relative artifact paths can move with the source tree only if their readers, writers and containment rules agree on the new root. External absolute state cannot be repaired by the repository rename; the Codex manifest’s outbound global hook contract is the repository evidence for that separate failure class. (`.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:193-204`, `.codex/SYNC.md:16-18`)

