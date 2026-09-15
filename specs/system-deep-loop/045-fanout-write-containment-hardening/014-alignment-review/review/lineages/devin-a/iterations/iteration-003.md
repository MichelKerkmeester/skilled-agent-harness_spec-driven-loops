# Iteration 3: Deep-Loop Agent Alignment

## Focus

Lane 5 of the packet spec: agent definitions under `.opencode/agents/` and their mirrors under `.claude/agents/`, `.codex/agents/` and `.pi/agents/` for `deep-research`, `deep-review`, `deep-improvement` and `orchestrate`, against the command contracts and the runtime's route-proof fields.

Files reviewed:
- `.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md`, `.codex/agents/deep-research.toml`, `.pi/agents/deep-research.md`
- `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md`
- `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md`, `.codex/agents/deep-improvement.toml`, `.pi/agents/deep-improvement.md`
- `.opencode/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.codex/agents/orchestrate.toml`, `.pi/agents/orchestrate.md`

## Scorecard

- Dimensions covered: correctness, traceability, security
- Files reviewed: 16
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.32

## Findings

### P1, Required

- **F006**: `orchestrate`'s delegation tool surface is inconsistent across runtimes and absent from the two blocks that demand it, `.opencode/agents/orchestrate.md:38` vs `.opencode/agents/orchestrate.md:9-18` and `.pi/agents/orchestrate.md:31` vs `.pi/agents/orchestrate.md:4-8`. The canonical body's CRITICAL line says "You orchestrate via the `task` tool", but the canonical permission block (lines 9-18) lists no `task` key at all (explicit `task: deny` exists on the other three deep-loop agents). The .pi mirror's body repeats the task-tool demand (line 31) while its own `tools:` list (lines 4-8: read, write, edit, bash) omits any task/agent tool. Only the .claude mirror grants delegation (`tools: Read, Write, Edit, Bash, Agent`). A pi-side or OpenCode-side dispatch of orchestrate cannot perform its documented core operation. Dimension: correctness.

### P2, Suggestion

- **F007**: The .pi mirrors of `deep-research` and `deep-improvement` carry declared-but-dropped permission mappings, `.pi/agents/deep-research.md:8` ("# Unmapped OpenCode permission keys: webfetch, external_directory") and `.pi/agents/deep-improvement.md:8` ("# Unmapped OpenCode permission keys: external_directory"). The canonical deep-research grants `webfetch: allow` (`.opencode/agents/deep-research.md:14`); the pi mirror silently loses web fetch with no alternative surface. Declared in a comment, so not silent drift — but a real capability drop on the pi runtime. Dimension: traceability.

## Claim Adjudication

### F006 (P1)

```json
{
  "findingId": "F006",
  "claim": "orchestrate's own permission/tool blocks omit the delegation tool its own body text requires, and the mirrors disagree (only .claude grants Agent).",
  "evidenceRefs": [
    ".opencode/agents/orchestrate.md:38",
    ".opencode/agents/orchestrate.md:9-18",
    ".pi/agents/orchestrate.md:31",
    ".pi/agents/orchestrate.md:4-8",
    ".claude/agents/orchestrate.md:1-6"
  ],
  "counterevidenceSought": "Read the full frontmatter of all four orchestrate mirrors; checked the other three deep-loop agents (task: deny is explicit there, proving the permission block is the operative surface); grepped .pi orchestrate for task/agent tool grants in the tools list — none.",
  "alternativeExplanation": "The pi runtime may grant task by default with the tools list as an additive minimum — but then the list is redundant and the .claude mirror's explicit Agent grant is unexplained; the shipped surface still contradicts its own contract text.",
  "finalSeverity": "P1",
  "confidence": 0.75,
  "downgradeTrigger": "If pi/OpenCode are confirmed to grant task by default to primary agents (documented runtime semantics), downgrade to P2 mirror-tool-list drift.",
  "transitions": [{"iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| agent_cross_runtime | partial | advisory | orchestrate.md:38 vs .pi/agents/orchestrate.md:4-8 | Four agents in scope; descriptions and tool surfaces align except orchestrate's delegation tool (F006) and declared pi unmappings (F007) |
| spec_code | partial | hard | lane-5 claims vs mirrors | Route-proof fields (target_agent/resolved_route/agent_definition_loaded/mode) confirmed present on this lineage's records; mirrors carry canonical path convention |

## Assessment

- New findings ratio: 0.32 (1 P1 + 1 P2; weighted 6 of accumulated 19)
- Dimensions addressed: correctness, traceability, security (permission surface audit)
- Novelty justification: first pass over the agent mirrors; F006/F007 first-seen
- Verdict mapping: P1 present (no P0) -> CONDITIONAL

## Ruled Out

- Description drift: all four agents' descriptions match byte-for-byte across .opencode/.claude/.codex/.pi. Ruled out.
- Codex sandbox drift: `sandbox_mode = "workspace-write"` on all four .codex TOMLs matches the canonical `write: allow`; developer_instructions mirror the canonical bodies. Ruled out.
- deep-review tool-surface drift: `.claude` grants Read/Write/Edit/Bash/Grep/Glob exactly matching `.opencode` allowed-tools. Ruled out.
- deep-research webfetch on .claude: granted (WebFetch in tools) — only the pi mirror drops it (F007). Ruled out as cross-runtime silent drift.

## Dead Ends

- Body-level diff of the full 600-line agent files across four runtimes: frontmatter + contract-critical lines audited; full-body drift hunting deferred to the merged lane scope (devin-b/devin-c may cover it).

## Recommended Next Focus

Iteration 4: SKILL.md vs references/assets + feature catalog and playbook alignment — for `system-deep-loop`, its modes, `cli-external-orchestration` and its cli-* modes, and `sk-code`, whether each SKILL.md's routing/rules/claims match the files under its `references/`/`assets/`; then audit the `feature-catalog/` and `manual-testing-playbook/` trees under system-deep-loop (hub, runtime, deep-research, deep-review) against the shipped runtime.

Review verdict: CONDITIONAL
