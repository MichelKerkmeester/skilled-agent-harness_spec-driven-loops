# Deep Context Strategy — cli-devin Deprecation

## Scope (gather-subject)

Deprecate the `.opencode/skills/cli-devin` skill and remove all references to it across the framework: skills, commands, related YAMLs, agents, `AGENTS.md`, `CLAUDE.md`, and every other place. Map the **active-wiring** surface (what deprecation must change) and distinguish it from the **historical-record** surface (immutable spec/benchmark/changelog mentions).

## Executor Pool (by-model-shared-scope)

| label | kind | model | promptFramework |
|-------|------|-------|-----------------|
| native-a | native | sonnet | — |
| native-b | native | sonnet | — |

- Mode: `by-model-shared-scope` — both seats sweep the SAME focus each iteration; cross-seat agreement is the confidence signal.
- agreementMin = 2 · relevanceGate = 0.55 · maxIterations = 10 · convergenceThreshold = 0.10.

## Seeded Frontier (Glob+Grep fallback — code graph MCP unavailable)

Blast radius: **~1811 files** mention `cli-devin`. Split:
- **HISTORICAL** — `.opencode/specs/**` (1572 files) + per-skill `changelog/**` + benchmark `state/*.jsonl` / `per-probe*.jsonl` / eval outputs. Immutable records of completed work.
- **ACTIVE-WIRING** (~173 files, the real deprecation surface):

| # | SLICE cluster | Anchor paths | Why active |
|---|---------------|--------------|------------|
| 1 | The skill itself | `.opencode/skills/cli-devin/**` (SKILL.md, README, graph-metadata.json, references/, assets/, manual_testing_playbook/, changelog/) | Deletion target |
| 2 | Model registry / dispatch | `sk-prompt-models/SKILL.md`, `assets/model-profiles.json`, `references/pattern-index.md`, `references/models/*.md` (swe-1.6, kimi-k2.6, deepseek-v4-pro, glm-5.1), `graph-metadata.json` | cli-devin as dispatch executor + provider/quota_pool entries |
| 3 | Deep-loop executor wiring | `deep-loop-runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`; `commands/deep/assets/deep_start-*-loop_{auto,confirm}.yaml` (`--executor=cli-devin`, `cli-devin seats:` contracts) | cli-devin as an executor `kind` |
| 4 | Agent rosters | `.opencode/agents/*.md` + `.claude/agents/*.md` + `.codex/agents/*.toml` (deep-review, deep-context, deep-research) | CLI-seat dispatch lists naming cli-devin |
| 5 | Governance docs | `AGENTS.md`, `CLAUDE.md`, `.claude/CLAUDE.md`, `README.md` | CLI dispatch rule + small-model dispatch rule mention cli-devin |
| 6 | Cross-skill references | `cli-opencode/references/context-budget.md`, `cli-opencode/manual_testing_playbook/**`, `system-spec-kit/constitutional/post-implementation-deep-review.md`, skill-advisor scripts | Active cross-references / routing |
| 7 | Cross-runtime mirrors + skill-graph edges | `.claude`/`.codex` symlinks, `skill-graph.sqlite` + reciprocal sibling edges in `graph-metadata.json` files pointing at cli-devin | Registration/graph edges that must be pruned |

### Iteration focus rotation (10 sweeps)
1: cluster 1 (skill internals + deletion surface) · 2: cluster 2 (model registry) · 3: cluster 3 (executor wiring code) · 4: cluster 3 (deep-loop YAML contracts) · 5: cluster 4 (agent rosters, 3 runtimes) · 6: cluster 5 (governance docs) · 7: cluster 6 (cross-skill refs) · 8: cluster 7 (graph edges + symlinks) · 9: gap-recovery (uncovered/low-agreement slices) · 10: active-vs-historical boundary confirmation + touch-list ordering.

## Known Context

- **Direct precedent: `132-cli-gemini-deprecation` (Level 3, shipped).** Scoped its work to *"active, non-spec references"* — deliberately did NOT rewrite historical spec docs. Updated runtime capability manifests, mirror/parity checks, command authoring guidance, doctor MCP config lists, skill-advisor routing, and top-level docs. This is the template to follow.
- **`132-cli-gemini-deprecation` sibling: also removed a checked-in runtime mirror dir.** cli-devin has no separate runtime dir (it's a skill), so the analog is the skill dir + cross-runtime symlinks/agents.
- Memory notes: cli-devin is a CLI executor option in all deep loops (`--executor=cli-devin`); `cli-devin has 2 permission modes, not 3`; small-model dispatch is governed by `sk-prompt-models` (model-profiles.json is single source); CLI dispatch rule in CLAUDE.md requires reading `cli-X/SKILL.md` before dispatch.
- Memory MCP `memory_context` was unavailable this session (session-scope error); known-context seeded from the precedent + scan instead.

## Convergence

Stop when host-saturation (K=2 low-progress sweeps, new-agreement-eligible ratio < 0.10) AND graph decision STOP_ALLOWED/absent. Per user instruction, run the full 10 iterations for thorough coverage of the large surface; advance focus each sweep so iterations add coverage rather than re-confirm. Code graph unavailable → citations labeled `unverified` (no `code_graph_verify`); host-saturation governs the stop.
