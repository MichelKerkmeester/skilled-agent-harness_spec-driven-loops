DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — Iteration 5 of 20

## STATE

Session: 029-uplift-9002D7A6 | Topic: system-code-graph uplift
Iteration: 5 of 20
Focus (from reducer next-focus): Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)? <!-- /ANCHOR:next-focus --> 
Remaining Open Questions:
    - Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?
    - Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
    - Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
    - Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
    - Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?
    - Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.
    - Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
    - Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
    - Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
    - Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

Last 3 iterations summary:
iter 002: {"type":"iteration","iteration":2,"newInfoRatio":0.7,"status":"insight","focus":"Q5+Q6 content gaps and mcp_server READMEs currency assessment","graphEvents":[]}
iter 003: {"type":"iteration","iteration":3,"newInfoRatio":0.6,"status":"insight","focus":"Q1 bugs/drift/weak prose beyond known 3 INSTALL_GUIDE drifts","graphEvents":[]}
iter 004: {"type":"iteration","iteration":4,"newInfoRatio":0.85,"status":"insight","focus":"Q2 sk-doc --type classification and mandatory requirements per authored doc","graphEvents":[]}

## STATE FILES

All paths relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
- Config: `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/deep-research-config.json`
- State Log: `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/deep-research-strategy.md`
- Registry: `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/findings-registry.json`
- Iteration narrative target: `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/iterations/iteration-005.md`
- Delta file target: `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/deltas/iter-005.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agents.
- 3-5 actions, max 12 tool calls.
- Write all findings to files. No in-context retention.
- Report findings only; no fixes here.
- Sequential thinking ≥5 thoughts before output.

## PROGRESSIVE FOCUS GUIDE

Use this priority order across iters 2-20 to cover the remaining open questions:
- Iter 2-3: Q5 (useful content gaps in SKILL.md / references / per-folder mcp_server READMEs) + Q6 (per-folder mcp_server READMEs needing fresh authoring vs validation-only)
- Iter 4: Q2 (sk-doc --type per authored doc with mandatory anchors)
- Iter 5: Q4 (README structural arc to mimic from Public root + system-spec-kit) — distill 3 paragraph structure exemplars
- Iter 6: Q10 (worst-case HVR pitfalls in root README + system-spec-kit README to avoid)
- Iter 7-8: Q7 (feature_catalog index + per-feature validation) + Q8 (manual_testing_playbook index + per-scenario validation) — sample 3-5 per-feature files per catalog
- Iter 9: Q9 (optimal child-001 task ordering)
- Iter 10-15: Deep dives on specific gaps surfaced in earlier iters
- Iter 16-20: Synthesis-ready consolidation, citing back to iter-NNN.md sources

When focus from the reducer is already substantively answered by previous iters, advance to the next priority above. Always state which Qs you are addressing in the iteration narrative header.

## OUTPUT CONTRACT

1. `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/iterations/iteration-005.md` with sections: Focus, Actions Taken, Findings (file:line-cited per-file), Questions Answered (with question IDs from registry), Questions Remaining, Next Focus.

2. APPEND single-line JSON to `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/deep-research-state.jsonl`:
```json
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck|complete>","focus":"<short focus phrase>","graphEvents":[]}
```

3. Optional: write `.opencode/specs/system-spec-kit/029-system-code-graph-uplift/research/deltas/iter-005.jsonl` with the iteration record + per-finding records. Workflow will synthesize if absent.

## RESOLVING QUESTIONS

When a question is substantively answered, add to your iter-005.md a "Questions Answered" section listing question text + iter source citations. The reducer will resolve them at the next pass IF you also emit a delta record like:
```json
{"type":"question_resolved","questionId":"<id-from-registry>","resolvedAtIteration":5,"answer":"<one-line summary>"}
```
