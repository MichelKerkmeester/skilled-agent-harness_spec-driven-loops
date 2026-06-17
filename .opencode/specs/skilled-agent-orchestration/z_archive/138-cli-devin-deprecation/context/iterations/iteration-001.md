# Iteration 001 — cluster 1: skill internals + broad active-wiring sweep

**Pool:** native-a + native-b (sonnet, by-model-shared-scope) · **Focus:** the cli-devin skill itself + deletion surface, with an opportunistic broad sweep of the active-wiring clusters.

## Per-seat contribution
- **native-a** (completeness emphasis): enumerated the skill dir (~70 files), the deep-loop YAML `if_cli_devin` blocks + asset/reference paths, the executor-config/audit/fanout code sites, AGENTS.md / README.md / skills index, sk-prompt-small-model SKILL.md + model-profiles.json, the skill-advisor playbook Devin hook, descriptions.json.
- **native-b** (dependency/classification emphasis): mapped the graph-metadata reciprocal sibling-edge cluster (cli-opencode/cli-claude-code/cli-codex/sk-prompt-small-model/system-skill-advisor), the model reference docs (swe-1.6/deepseek/kimi/glm + _index + pattern-index), the context-loop YAMLs, constitutional docs, the codex agent mirror, deep-research/deep-review agents.

## Merged result (host, path-keyed)
- **61 distinct files**: 50 active-wiring · 8 skill-internal · 3 historical.
- **16 files with agreement=2** (both seats, high confidence): the deep-loop YAML `if_cli_devin` blocks (research/review auto + review confirm), `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `AGENTS.md`, `README.md`, `.opencode/agents/deep-context.md`, `sk-prompt-small-model/SKILL.md` + `model-profiles.json`, `system-skill-advisor/.../skill-graph.json`, `deep-context/SKILL.md`, and the **swe-1.6 gap**.
- agreementRate 0.262 · sliceCoverage 0.143 (1/7 clusters) · new-agreement-eligible ratio 0.26 → **CONTINUE**.

## Contradictions / Gaps
- **No contradictions** — seats never asserted incompatible contracts; the only divergence was complementary coverage breadth.
- **CRITICAL GAP (both seats): `swe-1.6` is cognition-exclusive.** Its ONLY executor in `model-profiles.json` is `cli-devin` (quota_pool `cognition-free`). Removing cli-devin leaves swe-1.6 with zero executors. DeepSeek-v4-pro / Kimi-k2.6 / GLM-5.1 each retain a `cli-opencode` path, so only their cli-devin executor row is removed. **Decision required before implementation: remove swe-1.6 entirely vs. mark retired.**

## Active-vs-historical boundary (initial)
- **Active-wiring (edit):** deep-loop runtime code (`executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`), the 5 deep-loop YAMLs (`if_cli_devin` + executor enums + context-loop seat notes), the 4 command `.md` executor enums, `sk-prompt-small-model` (SKILL.md, model-profiles.json, graph-metadata.json, model refs, pattern-index), skill-advisor graph (graph-metadata.json + 2 skill-graph.json copies + sqlite rebuild + Devin hook playbook), sibling cli-* graph-metadata reciprocal edges, agents (deep-context/research/review across .opencode/.claude/.codex), governance (AGENTS.md, CLAUDE.md, README.md, skills index), deep-context refs/feature-catalog, constitutional cli-dispatch docs.
- **Historical (leave):** `.opencode/specs/**` (1572 incl. z_archive/104-cli-devin-creation, 135/004-cli-devin-readme), per-skill `changelog/**`, benchmark `state/*.jsonl` / eval outputs. **Open question for the boundary:** `.opencode/specs/descriptions.json` is under specs/ but is a *live* index — flagged for iter-2 classification.

## Next focus
Iter 2: verify + line-resolve the single-seat findings, starting with the deep-loop runtime code sites (executor-config.ts / executor-audit.ts / fanout-run.cjs — read exact lines, confirm every cli-devin token).
