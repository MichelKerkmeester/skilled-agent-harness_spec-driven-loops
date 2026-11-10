# Deep Research Strategy

## Research Topic

GATE PRE-RESOLUTION: per-runtime reference map for moving the shared AI asset source root from `.opencode` to `.skilled`. Build Map A (all 435 symlinks, per runtime), Map B (non-symlink runtime files naming `.opencode`, plus home-level config), Map C (all 4,258 tracked files outside `specs/` naming `.opencode`, by area), each row cited and classified, reconciled against the seed inventory.

## Known Context

- The seed inventory (`scratch/seed-inventory/`) is the enumeration of record: 435 symlinks (381 resolve into `.opencode`), 4,258 tracked files naming `.opencode` outside `specs/`, 35 of 36 home-level candidate paths existing. Its rows are facts; their classification is this run's work.
- Phase-001 findings (`001-deep-research/research/research.md`) are verified: the `.opencode` root sentinel (`repo-root.mjs`), self-disengaging gates, seven global git hooks, four external references, three runtime consumer shapes. Extend, do not re-derive; correct where the tree disagrees.
- The runtime sync manifests (`.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.hermes/SYNC.md`, `.pi/SYNC.md`) name each surface's owner and mechanism.
- `sync-runtime-mirrors.cjs` owns the `.cursor/agents`, `.devin/agents`, `.claude/commands`, `.cursor/commands` symlink trees and the `claude|codex|cursor|devin` `hooks/` mirrors derived from each runtime's hook config. [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36-48,115-140`]
- Generators named by manifests: `sync-agents.cjs`/`sync-prompts.cjs` (Codex), `sync-agents-pi.cjs`/`sync-prompts-pi.cjs` (Pi), `sync-skills-hermes.cjs`/`sync-prompts-hermes.cjs` (Hermes), `sync-gate1-pointers.cjs` (generated Gate 1 blocks), `install-codex-hooks.mjs` (outbound `~/.codex/hooks.json`).
- The artifact root is fixed to this lineage directory. No source-tree writes are authorized.
- `resource-map.md` is absent at initialization; the coverage gate is skipped.
- Ruled out by the brief: `barter/` (links into a different checkout) and the stray leading-space ` specs/` directory.

## Key Questions (remaining)

- [ ] Map A: for each of the 435 seed symlinks — link path, raw target, resolves into `.opencode`, required target under `.skilled` (both compat-link outcomes where it depends), hand-made vs generator (named and cited), classification.
- [ ] Map B: every non-symlink file under each runtime root naming `.opencode` — line/key, what the reference does, generated-vs-authored with owning command, needed change; plus the home-level configuration each runtime reads.
- [ ] Map C: every tracked file outside `specs/` naming `.opencode`, by area — per-skill artifact types, `.opencode` areas (commands/agents/hooks/plugins/bin/scripts/install-guides), root docs, root config, CI. Code files listed with line; documentation split runnable / prose / historical.
- [ ] Reconciliation: every seed row accounted for; every UNKNOWN carries what would settle it.

## Non-Goals

- Do not propose a cutover order (phase 003's work).
- Do not edit, create or delete any file outside this lineage directory.
- Do not copy home-directory file contents or secrets into output — name file, key and count only.
- Do not decide whether the migration is desirable.

## Stop Conditions

- `stopPolicy: convergence`: stop when a further iteration would add no new rows — i.e., all three maps reconcile against seed counts and residual rows are classified.
- Hard cap: 10 iterations.
- Preserve UNKNOWN claims with the missing evidence that would settle them.

## Classification Legend

`mechanical` = scripted retarget/rewrite; `regenerate` = rebuild via named command; `manual` = a decision is required; `freeze` = historical record, must not be rewritten; `none` = names the path, needs no change (with reason); `blocker` = cannot be done as proposed (with reason).

## Answered Questions

- All four seed questions resolved — see `findings-registry.json` resolvedQuestions.
- Map A: 435/435 — generator attribution (`sync-runtime-mirrors.cjs`, `spec-root-migration.ts`, `sync-hook-registrations.cjs` verify-only) complete.
- Map B: 267/267 — generated-vs-authored split resolved per file; 7 blockers = global git hooks.
- Map C: 4,027/4,027 — the contract family enumerated (13 sentinel + 3 docs + gates + installers + 19 CI).

## What Worked

- Path-pattern classifier (`build_map_c.py`) with explicit contract family (`MANUAL_PAT`) — deterministic, auditable, re-runnable over all areas.
- Joining working tables back to seed TSVs per section (`verify_coverage.py`) — caught zero missing/zero overlap at closure.
- Per-iteration embedded tables + canonical `working/` copies — kept iteration files honest when the classifier gained a rule (iter-005 patched).

## What Failed

- First Map C classifier pass missed extensionless git-hook entrypoints (no ext → skipped code branch). Fixed by making `MANUAL_PAT` global post-tests and regenerating all areas.
- Naive `/changelog/` rule froze `templates/changelog/README.md` (a living template) — fixed with a `/templates/` exclusion.
- Relative-path writes from repo root failed once (lineage dir must be cwd or absolute) — noted in run log.

## Exhausted Approaches

- Sub-area-by-sub-area manual reading — replaced by the seeded classifier + targeted verification of contract candidates (grep for pattern-matchers: `startsWith`, `.test(`, `/\.opencode`).

## Ruled-Out Directions

- `barter/` — links resolve into a different checkout (operator-supplied).
- Leading-space ` specs/` directory — stray duplicate from an earlier run (operator-supplied).
- `node_modules/`, `dist/` — zero tracked files in seed.
- `.codex/AGENTS.md` word-`opencode` hits — runtime-name examples, not paths.
- `generate-trigger-index.mjs` — doc-comment-only mention; not a contract file.

## Next Focus

Loop closed — synthesis written (`research.md`, `convergence-report.md`, `resource-map.md`). Next phase (003) owns cutover ordering; this lineage's `manual` rows are its announcement list.
