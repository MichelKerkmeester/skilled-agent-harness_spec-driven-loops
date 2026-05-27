---
title: Deep Research Strategy - Skill Advisor Finding Remediation
description: Session tracking for deep research into the root causes and remediation approaches for the 5 key findings from the 028 skill-advisor playbook run.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the deep-research session investigating the 5 key findings recorded in `028-skill-advisor-playbook-run`. For each finding: determine root cause from the actual code, then specify a concrete, scoped remediation approach. Executor: cli-codex / gpt-5.5 / reasoning high / service-tier fast.

### Usage
Read at every iteration. Analyst-owned sections (Topic, initial Key Questions, Non-Goals, Stop Conditions, Known Context, Boundaries) are stable; machine-owned sections (3, 6, 7-11) are refreshed by the reducer.

---

## 2. TOPIC
Investigate and design remediation for the 5 key findings from the system-skill-advisor manual testing playbook run (packet 028): (F1) corpus accuracy regression, (F2) PC-005 bench failures + doc gap, (F3) semantic_shadow lane weight drift, (F4) OpenCode plugin bridge native-route fail-open, (F5) stale vitest paths in NC-004/005 playbook docs.

---

## 3. KEY QUESTIONS (remaining)
- [ ] F1: What is the root cause of the corpus accuracy regression (advisor_validate 50.78% full-corpus / 42.5% holdout vs documented 80.5%/77.5%)? Confirm whether the `sk-deep-research`/`sk-deep-review` gold-label vs live `deep-research`/`deep-review` skill-ID drift is the primary driver, quantify its share, and identify the fixes for P0-MEM-001 / P0-UNC-001 / P0-UNC-002 / P0-CMD-001 / P0-CMD-002 / P0-CMD-003. What is the concrete remediation (corpus relabel vs alias map vs scorer change)?
- [ ] F2: What is the correct PC-005 bench invocation (the `--dataset` requirement), why do the warm_p95 and cold_p95 latency gates fail, and what is the remediation (scenario-doc fix + gate threshold/perf fix)?
- [ ] F3: Is the live `semantic_shadow` laneWeight 0.05 (shadowOnly:false) an intentional promotion from shadow (weight 0) or an unintended regression? What is the source of truth for lane weights, and should SC-004/SC-005 scenario docs be corrected or the weight reverted?
- [ ] F4: Why does the OpenCode plugin bridge native route fail with SYSTEM_SKILL_ADVISOR_UNAVAILABLE despite `dist/mcp_server/compat/index.js` present (route falls to python fail-open)? What is the concrete fix to make the native route engage?
- [ ] F5: What is the correct vitest invocation/path for NC-004/005 (documented `skill-advisor/tests/...` from system-spec-kit/mcp_server resolves nothing; correct is `system-skill-advisor/mcp_server/tests/`)? Are other playbook scenarios similarly stale, and what is the doc-correction scope?

---

## 4. NON-GOALS
- Implementing the fixes (this session investigates + designs remediation phases only; implementation is the subsequent /speckit work).
- Re-running the full 46-scenario playbook.
- Changing the skill-advisor scoring architecture beyond what the findings require.
- Resolving the infrastructure-gated SKIP scenarios (separate harness work).

---

## 5. STOP CONDITIONS
- All 5 key questions answered with a root cause AND a concrete remediation approach each.
- newInfoRatio < 0.05 across the rolling window (convergence).
- maxIterations (10) reached.

---

## 6. ANSWERED QUESTIONS
[None yet -- populated as iterations answer questions]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[Populated after iteration 1 completes]

---

## 8. WHAT FAILED
[Populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is exhausted]

---

## 10. RULED OUT DIRECTIONS
[Populated from iteration dead-end data]

---

## 11. NEXT FOCUS
F1 corpus accuracy regression: read the advisor_validate handler + the validation corpus/fixtures + the regression dataset to confirm the skill-ID drift mechanism (gold labels `sk-deep-research`/`sk-deep-review` vs live graph IDs `deep-research`/`deep-review`), quantify how many of the 193 corpus cases / 24 P0 cases that drift accounts for, and inspect the P0-CMD/MEM/UNC cases to separate label-drift failures from genuine scorer/routing regressions.

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Findings source: `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/004-shell-python-daemon/implementation-summary.md` (consolidated findings) and `002-mcp-native-scenarios/` (NC-003 evidence).

Key code paths to investigate:
- F1: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts`, `mcp_server/lib/scorer/`, `mcp_server/scripts/skill_advisor_regression.py`, `mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl`, the validation corpus.
- F2: `mcp_server/scripts/skill_advisor_bench.py`, `mcp_server/bench/`, the PC-005 scenario doc `manual_testing_playbook/10--python-compat/005-bench-runner.md`.
- F3: `mcp_server/lib/scorer/` lane-weight source of truth (config/constants), SC-004/SC-005 scenario docs under `08--scorer-fusion/`.
- F4: `mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`, `mcp_server/compat/index.ts` (built to `dist/mcp_server/compat/index.js`), `.opencode/plugins/mk-skill-advisor.js`.
- F5: `manual_testing_playbook/01--native-mcp-tools/004-*.md` + `005-*.md`, actual test dir `mcp_server/tests/`.

Live evidence (generation 4464): laneWeights `{explicit_author:0.42, lexical:0.28, graph_causal:0.13, derived_generated:0.12, semantic_shadow:0.05}`; advisor_validate perSkill `sk-deep-research` 0/34, `sk-deep-review` 0/19, `system-spec-kit` 28/55; PC-004 main-env 54/96, P0 12/24, top1 62.79%, all gates fail.

Memory MCP (mk-spec-memory) is currently disconnected — prior-context load via memory_context is unavailable; save routes via generate-context.js CLI.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Executor: cli-codex / gpt-5.5 / reasoning high / service-tier fast
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-05-26T20:24:43Z
