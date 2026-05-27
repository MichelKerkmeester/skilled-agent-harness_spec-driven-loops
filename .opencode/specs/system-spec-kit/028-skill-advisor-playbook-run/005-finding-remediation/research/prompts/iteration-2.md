# Deep-Research Iteration 2 — F2 PC-005 bench

You are a LEAF deep-research agent. Run from repo root, workspace-write sandbox. INVESTIGATE + REPORT only; do NOT implement fixes. Cite file:line for every claim.

Iteration: 2 of 10
Focus: **F2 — PC-005 bench runner.** The PC-005 scenario doc omits the required `--dataset` flag, and the bench's warm_p95 + cold_p95 latency gates fail (throughput_multiplier passes). Determine: (a) the correct documented invocation (is the scenario doc wrong, or is --dataset genuinely required by the script?); (b) WHY warm_p95 and cold_p95 fail — are the gate thresholds (--max-warm-p95-ms / --max-cold-p95-ms defaults) unrealistic for this machine, is there a real latency regression, or a cold-start/subprocess artifact?; (c) concrete remediation for each (doc fix + gate-threshold or perf fix), with target files.

KEY FILES:
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py` (argparse: --dataset required; default gate thresholds)
- `.opencode/skills/system-skill-advisor/mcp_server/bench/` (latency-bench.ts, scorer-bench.ts, baselines)
- scenario doc: `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md`
- Evidence from 028: bench with --dataset exited 1, gates {warm_p95:false, cold_p95:false, throughput_multiplier:true}.

OUTPUT CONTRACT (all THREE required):
1. Narrative -> `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/iterations/iteration-002.md` (headings: Focus, Actions Taken, Findings[file:line], Questions Answered, Questions Remaining, Next Focus -> "F3 semantic_shadow lane weight").
2. APPEND to state log via echo >> : `{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"insight|evidence","focus":"F2 PC-005 bench","graphEvents":[]}` at `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deep-research-state.jsonl`
3. Delta file `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-002.jsonl` (iteration line + one finding/observation line each).
Single-line JSON, newline-terminated, appended (not stdout-only).
