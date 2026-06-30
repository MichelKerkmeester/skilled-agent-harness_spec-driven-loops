# Deep-Research Iteration 4 of 10 — 077 system-spec-kit + mcp-coco-index + sk-code OpenCode audit

You are a LEAF research agent. Investigate the assigned focus area, write three required artifacts, and stop. Do NOT dispatch sub-agents.

## RESEARCH TOPIC

Audit three intertwined surfaces in the OpenCode skill ecosystem:

1. **system-spec-kit** skill + MCP server at `.opencode/skills/system-spec-kit/` — drift between docs and code, validator + graph-metadata test coverage, MCP tool surface coverage vs docs, performance hotspots, concrete improvement targets.

2. **mcp-coco-index** skill + MCP server at `.opencode/skills/mcp-coco-index/` — semantic-search effectiveness, freshness behavior, CLI vs MCP parity, query routing decisions vs decision tree, embedding-provider abstraction.

3. **sk-code OpenCode side**: `.opencode/skills/sk-code/references/opencode/` and `.opencode/skills/sk-code/assets/opencode/`. Audit for staleness, coverage gaps (language sub-detection docs, verification recipes, skills/agents/commands authoring checklists), drift between declared resource_map paths and on-disk structure, concrete add/refine/remove targets.

**Cross-cutting questions:**

- How does sk-code's smart router interact with system-spec-kit's spec-folder writes?
- How does mcp-coco-index ingest sk-code resources? Are queries surfacing them?
- Are there missed integration points between the three surfaces?

## STATE FILES (paths relative to repo root)

- Config: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/deep-research-config.json`
- State Log: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/deep-research-state.jsonl`
- Strategy: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/deep-research-strategy.md`
- Registry: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/findings-registry.json`

## REQUIRED ITERATION 4 FOCUS

Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/deep-research-strategy.md` Section 11 (Next Focus) for the current iteration's focus area. Also review Sections 3 (Key Questions remaining), 6 (Answered Questions), 7-10 (machine-owned: what worked/failed, exhausted, ruled out), and 12 (Known Context).

Read prior iterations under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/iterations/` to avoid re-treading.

## OUTPUT CONTRACT (THREE REQUIRED ARTIFACTS)

### 1. Iteration narrative

Write to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/iterations/iteration-004.md`

Structure:
```markdown
# Iteration 4 — <short focus title>

## Focus
<1-3 sentences on what was investigated this iteration>

## Actions Taken
- Action 1: <what you did, what you read>
- Action 2: ...
(target 3-5 actions, max 12 tool calls)

## Findings
### F-004-001 — <short label> [P0/P1/P2]
<concrete finding with evidence: file paths, line numbers, exact strings>

### F-004-002 — ...

(group by surface: system-spec-kit / mcp-coco-index / sk-code)

## Questions Answered
- Q<id>: <how this iteration resolved or partially resolved the question>

## Questions Remaining
- Q<id>: <still open, why>

## Next Focus (for iteration 5)
<recommended focus area based on what's still uncovered>
```

### 2. Canonical JSONL iteration record

APPEND a single line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/deep-research-state.jsonl`

Format (NO pretty-print, single line, newline-terminated):
```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<insight|stuck|converged>","focus":"<short>","findingsP0":<n>,"findingsP1":<n>,"findingsP2":<n>,"executor":{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","serviceTier":"fast"}}
```

The reducer counts records where `type === "iteration"` ONLY. Use exactly that string.

### 3. Per-iteration delta file

Write to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/065-spec-kit-coco-sk-code-research/research/deltas/iter-004.jsonl`

Contents — one JSON record per line:
```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"...","focus":"...","findingsP0":<n>,"findingsP1":<n>,"findingsP2":<n>}
{"type":"finding","id":"f-iter004-001","severity":"P1","label":"<short>","iteration":4,"surface":"system-spec-kit|mcp-coco-index|sk-code","evidence":"<file:line>"}
{"type":"observation","id":"obs-iter004-001","packet":"077","classification":"real","iteration":4}
{"type":"ruled_out","direction":"<approach>","reason":"<why>","iteration":4}
```

(One `{"type":"iteration",...}` record + one `{"type":"finding",...}` per finding + optional observations / ruled_out entries.)

## CONSTRAINTS

- Write ALL findings to files. Do NOT hold in context.
- Target 3-5 research actions, max 12 tool calls.
- This is iteration 4. After writing the 3 artifacts, STOP.
- Update strategy.md Section 11 (Next Focus) with the recommendation for iteration 5.
- For iterations 7-10 specifically, look for cross-cutting integration findings (have we missed how the 3 surfaces could reinforce each other?).

## ITERATION FOCUS ROTATION (suggested, non-binding)

| Iter | Focus surface |
|------|---------------|
| 1 | Map all 3 surfaces — directory structure, SKILL.md claims vs filesystem |
| 2 | system-spec-kit validator + scripts coverage gaps |
| 3 | system-spec-kit MCP tool surface vs docs drift |
| 4 | mcp-coco-index CLI vs MCP parity + decision-tree drift |
| 5 | mcp-coco-index ingestion of sk-code; embedding-provider abstraction |
| 6 | sk-code OpenCode references — staleness + coverage gaps |
| 7 | sk-code OpenCode assets — checklists, verification recipes, missing files |
| 8 | sk-code STACK_FOLDERS contract vs on-disk; resource_map drift |
| 9 | Cross-cutting: sk-code router x spec-kit writes; coco x sk-code |
| 10 | Final synthesis-prep: gather P0/P1 list, propose remediation phases |

## EXECUTION

Begin investigation. Use Read, Grep, Glob, Bash (read-only inspect), or write your 3 artifacts. Do not dispatch agents.
