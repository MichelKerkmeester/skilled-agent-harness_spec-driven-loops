# Iteration 006: skill_agent overlay — SKILL.md contracts vs runtime agent definitions

## Focus

- Dimension: traceability (overlay: skill_agent)
- Goal: compare the deep-review SKILL.md's stated contract
  (LEAF-only, allowed-tools, target files read-only) against the
  runtime deep-review agent definitions in
  `.opencode/agents/deep-review.md`,
  `.claude/agents/deep-review.md`, and
  `.codex/agents/deep-review.md`.

## Scorecard

- Dimensions covered: traceability (skill_agent overlay)
- Files reviewed: 3 agent definitions + SKILL.md frontmatter
- New findings: P0=0 P1=1 P2=2
- Refined findings: 0
- New findings ratio: 1.0 (3/3 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F021 — `SKILL.md` `allowed-tools` includes `Task`, but the agent
  definition has `task: deny` (OpenCode) and the Claude agent's
  `tools:` array has no `Task` entry** —
  `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4` declares
  `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query]`.
  But the LEAF-only contract (`SKILL.md:45-46` "NEVER: Dispatch
  sub-agents, `@deep-review` is LEAF-only") explicitly forbids Task
  dispatch. The runtime agents reflect the LEAF-only intent:
  - OpenCode agent: `task: deny` (`.opencode/agents/deep-review.md:19`)
  - Claude agent: no `Task` in `tools:` allowlist
    (`.claude/agents/deep-review.md:4`)
  - Codex agent: byte-identical to OpenCode
  The `Task` entry in SKILL.md `allowed-tools` is therefore
  contradictory: it grants the agent the Task tool at the
  skill-routing level, but every runtime agent denies Task at the
  agent-definition level. The skill is technically over-permissioned
  relative to what the agents will actually use. This is the kind of
  "allowed-tools drift" the doc-staleness audit was supposed to
  surface but didn't.
  - Category: traceability
  - Source evidence:
    `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4` vs
    `.opencode/agents/deep-review.md:4-21` and
    `.claude/agents/deep-review.md:4`.
  - Affected surface hints: `["deep-review/SKILL.md frontmatter",
    "agent definitions permission block", "doc-staleness audit scope"]`

### P2 Findings

- **F022 — OpenCode and Codex deep-review agent definitions are
  byte-identical (33338 bytes); Claude is 33214 bytes, differing
  only in the `permission:` block vs `tools:` array and the
  `Path Convention` line** —
  `diff .opencode/agents/deep-review.md .codex/agents/deep-review.md`
  returns no output (byte-identical).
  `diff .opencode/agents/deep-review.md .claude/agents/deep-review.md`
  shows 4 lines of difference: the description quotes, the
  permission/tools block, and the path-convention line
  (`.opencode/agents/*.md` vs `.claude/agents/*.md`). The two
  permission models are equivalent in intent (deny Task, deny
  WebFetch, allow Read/Edit/Grep/etc.) but have different
  representations per runtime. This is the expected
  `agent_cross_runtime` parity shape, NOT a defect — but it's a
  useful finding for the synthesis section.
  - Category: traceability (cross-runtime parity)
  - Source evidence: `diff` outputs at
    `iterations/iteration-006.md:48-50`.
  - Affected surface hints: `["agent parity surface",
    "agent_cross_runtime overlay"]`

- **F023 — SKILL.md `allowed-tools` does not include `mcp__mk_code_index__*`
  or `mcp__mk_spec_memory__*` MCP tools, but the runtime OpenCode
  agent does (via `code_graph_query`, `code_graph_context`,
  `detect_changes`)** —
  `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4`
  lists `[Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, code_graph_query]`.
  The OpenCode runtime agent allows `code_graph_query`,
  `code_graph_context`, `detect_changes`, and `memory` — but the
  SKILL.md `allowed-tools` only names `code_graph_query` and the
  generic `memory_context` / `memory_search`. The Claude
  agent's `tools:` array at
  `.claude/agents/deep-review.md:4` explicitly includes
  `mcp__mk_spec_memory__*` and `mcp__mk_code_index__*` — a stricter
  MCP-allowlist that the SKILL.md doesn't reflect. This is a minor
  schema drift; the runtime behavior is gated by the agent
  definition, not the SKILL.md, but the SKILL.md is the
  human-readable contract surface.
  - Category: traceability
  - Source evidence: SKILL.md:4 vs OpenCode agent permissions and
    Claude agent tools.
  - Affected surface hints: `["deep-review/SKILL.md frontmatter",
    "MCP allowlist surface"]`

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | SKILL.md allowed-tools vs runtime agents       | 1 contradiction (F021), 1 drift (F023) |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | partial  | advisory | SKILL.md + 3 runtime agent defs               | F021, F022, F023 |
| agent_cross_runtime| partial  | advisory | OpenCode/Codex byte-identical; Claude differs  | F022 |
| feature_catalog_code| n/a     | advisory | not run this iteration                         | Defer to iteration 007 |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (3/3 novel)
- dimensionsAddressed: traceability (skill_agent overlay)
- noveltyJustification: the doc-staleness audit (2026-07-04 archive)
  did not enumerate the SKILL.md `allowed-tools` vs runtime
  permission block alignment; this is a fresh overlay observation.

## Ruled Out

- The OpenCode/Codex byte-identity is by design (the OpenCode agent
  is the source of truth that Codex mirrors) — not a finding beyond
  F022's parity observation.
- The 4-line diff between OpenCode and Claude is the expected
  per-runtime translation of the same intent — not a defect.

## Dead Ends

- Trying to derive a "complete" deep-review tooling surface from
  the SKILL.md alone — the SKILL.md is missing the MCP allowlist
  specifics; the runtime agent definitions are the ground truth.

## Recommended Next Focus

Iteration 007: feature_catalog_code overlay — verify the
`goal-opencode-plugin.md` feature catalog rows against the
`mk-goal.js` shipped surface. Audit both the system-spec-kit
catalog and the system-skill-advisor catalog for parity.

## Claim Adjudication

```json
{"findingId":"F021","claim":"SKILL.md allowed-tools includes Task but every runtime deep-review agent denies Task (LEAF-only contract is enforced at agent definition level, not skill level).","evidenceRefs":[".opencode/skills/deep-loop-workflows/deep-review/SKILL.md:4",".opencode/skills/deep-loop-workflows/deep-review/SKILL.md:45-46",".opencode/agents/deep-review.md:4-21",".claude/agents/deep-review.md:4"],"counterevidenceSought":"Re-checked SKILL.md frontmatter and the LEAF-only rule; both present. Re-checked all 3 runtime agents; all 3 deny Task.","alternativeExplanation":"Could be that 'Task' in SKILL.md allowed-tools is intended for the orchestrator (the command's YAML workflow), not for the @deep-review LEAF agent. The agent definitions correctly deny it; the skill's allowed-tools list is a soft contract for the orchestrator. This is plausible but the doc surface doesn't disambiguate.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"If 'Task' in allowed-tools is documented as orchestrator-only and the skill is meant to be invoked by orchestrators, downgrade to P2 documentation drift."}
{"findingId":"F022","claim":"OpenCode and Codex deep-review agent definitions are byte-identical (33338 bytes); Claude differs in 4 lines (permission block, path convention).","evidenceRefs":[".opencode/agents/deep-review.md",".codex/agents/deep-review.md",".claude/agents/deep-review.md"],"counterevidenceSought":"Re-ran diff between the 3 agent definitions; OpenCode/Codex are byte-identical, Claude differs in frontmatter and path convention only.","alternativeExplanation":"No alternative explanation — this is the documented cross-runtime parity shape.","finalSeverity":"P2","confidence":0.99,"downgradeTrigger":"None — the parity observation is structural, not a defect."}
```

Review verdict: CONDITIONAL