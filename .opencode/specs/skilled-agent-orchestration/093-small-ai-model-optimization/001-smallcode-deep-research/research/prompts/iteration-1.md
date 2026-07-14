DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — iter 1 of 20

## STATE

state_summary: First iteration. Strategy and state files are freshly initialized. Loop is dogfooding cli-devin SWE-1.6 (free tier, per ADR-001) against the smallcode-master MIT corpus to extract small-model output-quality patterns.

Research Topic: Mine smallcode-master MIT corpus for small-model output-quality runtime patterns (5 RQs: budget engine, output verification pipeline, per-model profiles + escalation, structured permissions, skill architecture)

Iteration: 1 of 20

Focus Area: **RQ1 — Context Budget Engine.** Read smallcode's `src/context/budget.ms` end-to-end via the preflight context-card pointer (`../preflight/context-card.md` §RQ1, ~56 prior citations). Identify 3–5 reusable patterns. For each pattern emit: (a) the smallcode primitive (file:line + 3–10 line code quote), (b) candidate target path in our skill tree (e.g. `cli-devin/references/budget-engine.md`), (c) a one-line "patch shape" describing the integration form (new file vs section in existing file), (d) acceptance criteria executable by a follow-on packet.

Remaining Key Questions (5):
- [ ] RQ1 — Context Budget Engine
- [ ] RQ2 — Output Verification Pipeline
- [ ] RQ3 — Per-Model Profiles & Escalation
- [ ] RQ4 — Structured Scope/Permissions
- [ ] RQ5 — Skill Architecture (synthesis)

Last 3 Iterations Summary: none yet (this is iter 1)

## STATE FILES

All paths are relative to the repo root.

- Config: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/findings-registry.json`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/001-smallcode-deep-research/research/deltas/iter-001.jsonl`

## CONSTRAINTS

- You are a LEAF agent (SWE-1.6 deep-research iter worker). Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- Do not implement fixes during review. Report findings only.
- Already-shipped findings from packet 113 (DO NOT re-propose): RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier disclosure, RM-8 four-layer mitigation. Cite as "shipped" if relevant.

## SOURCE BOUNDARIES

- Read-only across `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/external/smallcode-master/` (MIT corpus)
- Primary sources for iter 1: `external/smallcode-master/src/context/budget.ms`, `external/smallcode-master/smallcode.toml`, `external/smallcode-master/PLAN.md`, `external/smallcode-master/README.md`
- Preflight evidence base (cite first, drill to source only for specifics): `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/preflight/context-card.md` §RQ1
- Read-only refs (skill tree to map deltas against): `.opencode/skills/cli-devin/SKILL.md`, `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/sk-prompt/SKILL.md`

## OUTPUT CONTRACT (REQUIRED — all 3 artifacts)

1. **Iteration narrative markdown** at `.../research/iterations/iteration-001.md`. Structure with headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus. Include 3-5 patterns with file:line citations + code quotes + candidate target path + patch shape + acceptance criteria per pattern.

2. **Canonical JSONL iteration record** APPENDED to `.../research/deep-research-state.jsonl`. Single line, `"type":"iteration"` EXACTLY (NOT `iteration_delta`). Schema:
```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|progress|exhausted|blocked>","focus":"RQ1 — Context Budget Engine","graphEvents":[]}
```
newInfoRatio for iter 1 should be high (0.7-0.95) since fresh ground. Append via: `echo '<single-line-json>' >> <state-log-path>`. Do NOT pretty-print.

3. **Per-iteration delta file** at `.../research/deltas/iter-001.jsonl`. Multiple records, one per line:
- One `{"type":"iteration",...}` matching the state-log append
- One `{"type":"finding","id":"f-iter001-NNN","severity":"P1|P2|P3","label":"...","iteration":1}` per pattern surfaced (3-5 entries)
- Optional `{"type":"observation",...}`, `{"type":"ruled_out",...}` records if applicable

ALL THREE artifacts are required. Missing or malformed artifacts fail the iter.

## EXECUTION

1. Pre-plan (medium density, 3 ordered steps):
   a. Read preflight context-card §RQ1 (line ranges in card; cites ~56 smallcode source refs) for the structured pattern map. Note the 5 KEY FILES bullets surfacing budget.ms:9-13, 55-67, 109-126, 140-163, 176-193.
   b. Read `external/smallcode-master/src/context/budget.ms` end-to-end (~200 lines) to confirm patterns and extract code quotes. Cross-reference with `smallcode.toml:9-12` (BudgetConfig defaults: max_budget_pct=70, working_memory_tokens=500, summary_threshold=200).
   c. For each of 3-5 patterns: write a section to iteration-001.md with smallcode primitive (file:line + code quote), candidate target path in our skill tree, one-line patch shape, acceptance criteria.
2. Execute the plan. Stop after step c when 3-5 patterns are documented.
3. Append the JSONL iteration record + write the delta file. Stop.

Verification: confirm iteration-001.md is non-empty with all required sections, JSONL line was appended to state-log, delta file has the iteration record + N finding records.
