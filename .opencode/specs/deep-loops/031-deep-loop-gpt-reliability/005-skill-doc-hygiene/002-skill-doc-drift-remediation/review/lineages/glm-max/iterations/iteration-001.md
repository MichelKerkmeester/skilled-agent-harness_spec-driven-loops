# Iteration 1: Correctness — Cluster 1 (ai-council) + Cluster 4 (scanner code) + REPO_ROOT fix

## Focus
Correctness dimension. Independently verify that the claimed edits factually match current runtime reality — not by trusting phase 014's citations, but by re-reading the actual code/docs and re-running greps. Scope: Cluster 1 (ai-council direct-invoke removal in cli-opencode), Cluster 4 (`MIRROR_TEMPLATES` `.toml` removal in `scan-integration.cjs`), and the REPO_ROOT off-by-one fix in the two `setup-cp-sandbox.sh` scripts.

## Scorecard
- Dimensions covered: correctness (partial — Clusters 1, 4, REPO_ROOT)
- Files reviewed: 8 (cli-opencode SKILL.md/README.md/prompt_templates.md/playbook/agent_delegation.md; scan-integration.cjs; 2x setup-cp-sandbox.sh)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings
(none this iteration — all three correctness sub-targets verified clean)

### Verified clean (evidence)
- **Cluster 1 — ai-council direct invoke**: Every remaining `--agent ai-council` literal in cli-opencode is now in *rejection/forbidden* framing, not operational guidance. [SOURCE: cli-opencode/SKILL.md:292] "Direct `--agent ai-council` is rejected at the top level (`mode: subagent`)"; [SOURCE: cli-opencode/assets/prompt_templates.md:372] "never direct top-level `--agent ai-council`"; [SOURCE: cli-opencode/references/agent_delegation.md:197,229] "no longer reachable" / "is forbidden". The playbook fallback note at [SOURCE: cli-opencode/manual_testing_playbook/04--agent-routing/multi-ai-council-multi-strategy.md:51] correctly routes failures to `--agent orchestrate`. Ground truth `.opencode/agents/ai-council.md:4` = `mode: subagent` confirms the framing.
- **Cluster 4 — scanner code**: [SOURCE: deep-improvement/scripts/agent-improvement/scan-integration.cjs:15-18] `MIRROR_TEMPLATES` now has exactly two entries: `.opencode/agents/{name}.md` and `.claude/agents/{name}.md`. The `.toml` entry is gone. Smoke test `node scan-integration.cjs --agent=deep-review` → `status: complete`, exit 0.
- **REPO_ROOT fix**: Both [SOURCE: deep-loop-workflows/deep-research/.../07--command-flow-stress-tests/setup-cp-sandbox.sh:5] and [SOURCE: deep-loop-workflows/deep-review/.../07--command-flow-stress-tests/setup-cp-sandbox.sh:5] use `REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../../.." && pwd)"`. Counting from the script's depth (skill/manual_testing_playbook/07--command-flow-stress-tests/), 6 `..` levels resolves to the repo root, not `.opencode/`. Correct.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | scan-integration.cjs:15-18; ai-council.md:4 | Cluster 4 code matches 2-mirror spec; Cluster 1 framing matches registry mode |
| checklist_evidence | pending | hard | — | deferred to iteration 3 |

## Assessment
- New findings ratio: 0.0 — this iteration confirmed existing claims rather than surfacing new defects.
- Dimensions addressed: correctness (Clusters 1, 4, REPO_ROOT). Security, traceability, maintainability still open.
- Novelty justification: low novelty by design — a fix-phase review's first correctness pass is confirmation work; the defect signal will come from traceability/maintainability sweeps where contradictions and residual drift surface.

## Ruled Out
- Cluster 1 as a regression: all `--agent ai-council` literals are rejection-framed, not guidance. [evidence: grep across cli-opencode, all hits enumerated above]
- Cluster 4 code regression: scanner runs clean post-edit. [evidence: smoke test exit 0]

## Dead Ends
- (none)

## Recommended Next Focus
Iteration 2: security dimension (secrets/permission-scope) + Cluster 5 (plugins/README.md entrypoint count vs real directory). Then iteration 3 should pivot to traceability/spec-alignment, where REQ-acceptance and internal contradiction checks are likeliest to surface real findings.

Review verdict: PASS
