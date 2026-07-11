# Iteration 7

## Focus

Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward from iterations 5-6)

## Actions Taken

1. Read `create_agent_auto.yaml` / `create_agent_confirm.yaml` step_1c_spec_folder_setup blocks and grepped all `.opencode/commands/**/assets/*.yaml` for `agent_file:` values to build a full inventory of `agent_availability` targets.
2. Ran `git log --all -p -- '*/agents/speckit.md'` and `git log --all --diff-filter=A --name-only | grep -i agents/speckit` to confirm `speckit.md` was once a real per-runtime agent file (`.claude/agents/speckit.md`, `.codex/agents/speckit.toml`, `.gemini/agents/speckit.md`) that has since been fully retired — it does not exist in any current agent directory.
3. Compared `runtime_agent_path_resolution` blocks across `create_agent_auto.yaml`, `create_agent_confirm.yaml`, `create_readme_auto.yaml`, `create_readme_confirm.yaml` against actual directory names (`ls -d .opencode/agent .opencode/agents`).
4. Re-verified `_routes.yaml` route count (10 primary + 2 mcp sub-routes + 1 standalone `update`) against `speckit.md`'s "Workflow Assets" table and `doctor_speckit_presentation.txt`'s numbered menu / "Valid targets" line.
5. Diffed all 12 `.claude/agents/*.md` vs `.opencode/agents/*.md` pairs with frontmatter stripped, to separate legitimate cross-runtime path localization from genuine copy-paste drift (the Path Convention self-reference line specifically).
6. Spot-checked `orchestrate.md` and `code.md` full bodies (larger diffs) to confirm all non-Path-Convention differences are correct runtime-local self-references, not drift.

## Findings

### F-agent-availability-singular-path (P0, cross-surface)
`runtime_agent_path_resolution.default` is `.opencode/agent` (singular — a directory that does not exist; the real directory is `.opencode/agents`). This appears identically in 4 files:
- `.opencode/commands/create/assets/create_agent_auto.yaml:45`
- `.opencode/commands/create/assets/create_agent_confirm.yaml:46`
- `.opencode/commands/create/assets/create_readme_auto.yaml:83`
- `.opencode/commands/create/assets/create_readme_confirm.yaml:78`

This is the mechanical root cause feeding every downstream `[runtime_agent_path]/<name>.md` substitution in these files (8 total `agent_file:` interpolation sites) onto a nonexistent directory when the default (non-Claude) branch resolves.
**Fix**: change `default: .opencode/agent` → `default: .opencode/agents` in all 4 locations.

### F-create-agent-speckit-agent-retired (P0, commands)
`create_agent_auto.yaml:301` and `create_agent_confirm.yaml:334` both set `agent_file: "[runtime_agent_path]/speckit.md"` inside `step_1c_spec_folder_setup.agent_availability`. Confirmed via git history (`git log --all -p -- '*/agents/speckit.md'`) that `speckit.md` was a real per-runtime agent (retired across `.claude`, `.codex`, `.gemini` agent dirs) with no successor agent file — none of the 12 current agents is named `speckit`. This is the exact same defect class as the already-fixed `write.md` agent reference (commit `dde19822df`, "chore: remove @write agent + stack-specific mentions"), which was never applied to this `speckit.md` reference.
**Fix**: Replace the dead agent lookup with a direct invocation of the `system-spec-kit` skill workflow (matching the sibling `step_1c_spec_folder_setup` block in `create_command_auto.yaml:287-298`, which already does this correctly — no `agent_availability`/`agent_file`, just "Route spec.md and plan.md creation through distributed governance"). This answers the carried-forward open question: create-agent should call the system-spec-kit workflow directly rather than gain a new typed handoff field — the command family already has a working precedent to copy.

### F-doctor-workflow-table-and-menu-omit-freshness (P0, doctor)
Extends the iteration-1/6 seed finding with a second, independently-verifiable location:
- `.opencode/commands/doctor/speckit.md` "Workflow Assets" table (lines 29-39) lists 9 targets, omitting `skill-graph-freshness` (route exists at `_routes.yaml:171-185`, yaml asset `doctor_skill-graph-freshness.yaml` confirmed present).
- `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt` lines 38-40 number options 1-10 but skip `skill-graph-freshness` entirely, and line 79's "Valid targets:" enumeration also omits it — so a user typing `/doctor skill-graph-freshness` would work (router reads `_routes.yaml` directly) but the `list`/`?`/help paths give no way to discover the target exists.
**Fix**: Add `skill-graph-freshness` as row 5 (after `deep-loop`, before `skill-advisor`, matching `_routes.yaml` order) to both the `speckit.md` table and the presentation menu/valid-targets line.

### F-deep-research-path-convention-miswired (P0, agents — confirmed seed #2)
`.claude/agents/deep-research.md:11` reads `**Path Convention**: Use only `.opencode/agents/*.md` as the canonical runtime path reference.` It should self-reference `.claude/agents/*.md` (matching all 9 other agents that carry this line correctly localized per-runtime).
**Fix**: change to `.claude/agents/*.md`.

### F-markdown-path-convention-miswired (P1, agents — adjacent instance of seed #2's class)
Same defect, second file: `.claude/agents/markdown.md:11` reads `.opencode/agents/*.md` instead of `.claude/agents/*.md`. Confirmed by diffing all 12 frontmatter-stripped body pairs — only `deep-research` and `markdown` have this miswiring; the other 9 agents that carry a Path Convention line are correctly self-localized, and `ai-council.md` has no such line at all (see below).
**Fix**: change to `.claude/agents/*.md`.

### F-ai-council-missing-path-convention (P2, agents)
`ai-council.md` is the only one of the 12 agents (in either runtime) with no "Path Convention" / "canonical runtime path" self-reference line at all. Not a broken reference, but an inconsistency in agent-body coverage relative to the other 11 agents, which all state this convention explicitly.
**Fix**: add a Path Convention line consistent with the other agents' phrasing (`.claude/agents/*.md` in the Claude mirror, `.opencode/agents/*.md` in the OpenCode mirror).

### F-orchestrate-dual-runtime-note-asymmetry (P2, agents, cross-surface)
`.claude/agents/orchestrate.md:784` (anti-pattern table, "Improvise custom agent instructions" row) reads: "...has a definition file in `.claude/agents/` (this runtime's mirror; canonical source in `.opencode/agents/`)..." — an explicit dual-runtime provenance note. The OpenCode mirror's equivalent row (`.opencode/agents/orchestrate.md:809`) drops that clause entirely and just says "Agent definition files contain...". Minor prose asymmetry; not a dead reference, but the two mirrors no longer say the same thing about where the canonical source lives.
**Fix**: either add the equivalent provenance clause to the OpenCode mirror or drop it from the Claude mirror for parity — flag as follow-up cleanup, low priority.

## Questions Answered

1. **Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup?** — Direct invocation. `create_command_auto.yaml`'s `step_1c_spec_folder_setup` (lines 287-298) already implements the correct pattern with no `agent_availability`/`agent_file` block at all — it just routes spec.md/plan.md creation through "distributed governance" prose, no dead agent lookup. `create_agent_auto.yaml`/`create_agent_confirm.yaml` should be rewritten to match that sibling pattern rather than invent a new typed field.

2. Partial answer to **"Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation?"** — out of scope for this iteration's tool budget; not re-investigated.

## Questions Remaining

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward, still unaddressed)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (carried forward, still unaddressed)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook? (carried forward, still unaddressed)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried forward, still unaddressed)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried forward, still unaddressed)
- Which command-to-skill and command-to-agent references remain dead beyond the classes already found across iterations 5 and 7 (`speckit.md`, `write.md`, singular `.opencode/agent`)? A full mechanical sweep of every `agent_file:`/`agent_availability` block across all 62 workflow YAMLs beyond `/create` and `/deep` and `/speckit` families has not yet been done.

## Next Focus

Full mechanical sweep of every `agent_availability`/`agent_file:` block across the remaining command families (design, doctor sub-workflows, memory, prompt) not yet checked in this or prior iterations, cross-referenced against the current 12-agent inventory — to close out the "which command-to-agent references remain dead" open question definitively.
