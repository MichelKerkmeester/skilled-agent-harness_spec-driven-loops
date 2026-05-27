# Deep-Research Iteration Prompt Pack

You are a LEAF deep-research agent investigating root causes + remediation for findings from a skill-advisor playbook run. You run from the repo root with workspace-write sandbox. INVESTIGATE and REPORT only — do NOT implement fixes.

## STATE

STATE SUMMARY: Segment 1 | Iteration 1 of 10 | Questions 0/5 answered | Last focus: none yet | Last 2 ratios: N/A -> N/A | Stuck count: 0

Research Topic: Investigate and remediate the 5 key findings from the system-skill-advisor playbook run (028).
Iteration: 1 of 10
Focus Area (THIS iteration): **F1 — corpus accuracy regression.** advisor_validate reports full-corpus top-1 50.78% / holdout 42.5% vs documented baseline 80.5%/77.5%. Confirm whether the skill-ID drift (validation corpus gold labels use `sk-deep-research`/`sk-deep-review` but the live skill graph indexes `deep-research`/`deep-review`) is the primary driver, and QUANTIFY its share (how many of the 193 corpus cases / 24 P0 cases map to those two labels). Then inspect the P0 failures P0-MEM-001, P0-UNC-001, P0-UNC-002, P0-CMD-001, P0-CMD-002, P0-CMD-003 to separate label-drift failures from genuine scorer/routing regressions. Determine the concrete remediation (corpus relabel vs alias map vs scorer change) and where the fix lands.

Remaining Key Questions: F1 corpus accuracy; F2 PC-005 bench; F3 semantic_shadow lane weight drift; F4 OpenCode plugin bridge native route; F5 stale vitest path NC-004/005.

Last 3 Iterations Summary: none yet.

## KEY FILES TO READ (F1)
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` (lane scoring, gold-label matching)
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` (grep for `sk-deep-research`, `sk-deep-review`, and the P0-* case ids)
- the validation corpus the handler loads (find it from advisor-validate.ts imports)
- Live evidence: laneWeights {explicit_author:0.42, lexical:0.28, graph_causal:0.13, derived_generated:0.12, semantic_shadow:0.05}; perSkill sk-deep-research 0/34, sk-deep-review 0/19, system-spec-kit 28/55.

## STATE FILES (paths relative to repo root)
- Config: .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-001.jsonl

## CONSTRAINTS
- LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls.
- Write ALL findings to files. Report findings only; do not implement fixes.
- Cite exact file paths + line numbers as evidence for every claim.

## OUTPUT CONTRACT — produce all THREE artifacts:

1. **Iteration narrative** at `.../research/iterations/iteration-001.md` with headings: Focus, Actions Taken, Findings (with file:line evidence), Questions Answered, Questions Remaining, Next Focus. For F1, the Findings MUST include: (a) confirmed root-cause mechanism with evidence, (b) quantified share of the regression attributable to skill-ID drift, (c) per-P0-case classification (drift vs genuine regression), (d) a concrete remediation recommendation with the target file(s).

2. **Canonical JSONL record** APPENDED (not overwrite) to the State Log via `echo '<single-line-json>' >> <state-log-path>`. EXACT schema (type MUST be "iteration"):
`{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"insight|evidence|thought","focus":"F1 corpus accuracy regression","graphEvents":[]}`

3. **Delta file** at `.../research/deltas/iter-001.jsonl`: one `{"type":"iteration",...}` line (same as above) plus one structured line per finding/observation/ruled_out, e.g. `{"type":"finding","id":"f-iter001-001","severity":"P0","label":"...","iteration":1}`.

All three are REQUIRED. Use single-line JSON, newline-terminated, appended to the state log (do not print JSON to stdout only).
