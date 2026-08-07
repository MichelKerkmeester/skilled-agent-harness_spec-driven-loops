# Deep Research Strategy — obsidian42-BRAT

## 1. Overview

This detached lineage builds a source-verified knowledge base for an AI operating an Obsidian vault at the file layer. The iteration cap is authoritative: run two evidence passes, treating any earlier convergence signal as telemetry.

## 2. Topic

Resolve obsidian42-BRAT v2.2.0+ persistence, commands, install/update mechanics, file-layer workflows, failure modes, and practical AI recipes from the plugin source and official BRAT documentation.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- None at the requested behavioral and file-layer level.
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- No implementation changes to BRAT, Obsidian, or the target spec.
- No UI automation or assumptions that BRAT can run headlessly without Obsidian.
- No undocumented schema guesses presented as verified facts.
- No writes outside this detached lineage directory.

## 5. Stop Conditions

- Stop only after two complete iterations because `stopPolicy=max-iterations`.
- Each iteration must contain source citations, negative knowledge, a canonical JSONL record, and a matching delta file.
- Synthesis must distinguish verified source behavior from file-layer recommendations and unresolved version-sensitive details.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- The exact persisted schema and collection entry shapes are established from `src/settings.ts`; see iteration 1.
- Current plugin/theme download, validation, file-write, enablement, and frozen-update behavior is established; see iteration 1.
- Every requested command/action is mapped to its callback and downstream state/file effects; see iteration 2.
- Deterministic file-layer workflows distinguish installed, enabled, and BRAT-registered state; see iteration 2.
- The requested failure and recovery catalog covers releases, assets, reload visibility, private repositories, compatibility, manifests, and stale registration; see iteration 2.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Source-first traversal from `settings.ts` into `BetaPlugins.ts`, `githubUtils.ts`, and `themes.ts` separated current persistence from older documentation language (iteration 1).
- Cross-checking source against official BRAT docs resolved release assets, frozen updates, and theme checksum behavior (iteration 1).
- Following command callbacks into feature code aligned current labels with actual writes, reloads, and registration effects (iteration 2).
- Treating installed, enabled, and BRAT-managed as separate state produced idempotent file-layer recipes (iteration 2).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Prior-context MCP retrieval was unavailable; source-first research will proceed without cached memory.
- Shell fetches to `raw.githubusercontent.com` failed DNS resolution; GitHub HTML source pages and official docs remained available (iteration 1).
- Modal field-by-field internals were not fully readable; downstream source and official docs still covered required behavior (iteration 2).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches (do not retry)

- Raw `raw.githubusercontent.com` shell fetching — BLOCKED for this run after DNS failure; use accessible GitHub source pages instead.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions

- Repository-root plugin install as the current v2.2.0+ primary path; source and official developer docs require GitHub release assets (iteration 1).
- A frozen-only collection replacing `pluginList`; `pluginList` remains membership while `pluginSubListFrozenVersion` carries version metadata (iteration 1).
- BRAT as a fully headless installer; current paths depend on Obsidian APIs and UI/runtime services (iteration 2).
- Direct BRAT protocol enable/disable; official protocol support covers add flows, not those actions (iteration 2).
- Theme unregister as file deletion; source and docs keep installed files (iteration 2).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 0
- Saturated: schema, install mechanics, command map, file-layer workflows, and failure catalog
- Remaining frontier: optional modal field-validation and version-picker internals
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

- Optional only: modal field-level validation and historical point-release UI differences.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

None required. The hard two-iteration cap was reached and synthesis completed; optional future work is limited to modal/version-picker internals.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- The operator confirmed scalar flags: `updateAtStartup`, `updateThemesAtStartup`, `enableAfterInstall`, `loggingEnabled`, and `debuggingMode`.
- The beta-plugin list key and frozen-version list must be verified from source, not inferred from old articles or screenshots.
- `resource-map.md` is absent from the parent spec; the coverage gate is skipped.
- Cached memory context was unavailable for this run.

## 13. Research Boundaries

- Artifact root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol`
- Iterations: exactly 2
- Per-iteration tool budget: target 8–11, maximum 12
- Progressive synthesis: enabled
- Authoritative sources: repository source and official `tfthacker.com/BRAT` documentation; GitHub API/release metadata may corroborate mechanics.

## 14. Active Risks

- Current-main UI labels may differ from historical v2.2.0 point releases; version-locked consumers should inspect the matching tag.
- File-layer enablement remains an inferred operational workflow because BRAT itself uses Obsidian `enablePluginAndSave`.
