> SPEC FOLDER PRE-APPROVED: `.opencode/specs/system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation` — Gate 3 already satisfied. Do NOT ask for a spec folder. Do NOT pause for approval. NON-INTERACTIVE: write the three artifacts to the exact paths below and finish. Be efficient: max 8 tool calls; do NOT run `git log -p` (use `git log --oneline -n 20 -- <file>` only if needed).

# Deep-Research Iteration 3 — F3 semantic_shadow lane weight drift

LEAF deep-research agent. Repo root, workspace-write. INVESTIGATE + REPORT only. Cite file:line.

Focus: F3 — semantic_shadow lane weight drift. Live laneWeights show semantic_shadow at 0.05 with shadowOnly:false, but SC-004/SC-005 scenarios assume shadow-only (weight 0). Determine: (a) SOURCE OF TRUTH for lane weights (config/constant file) + the value + shadowOnly flag for semantic_shadow; (b) intentional promotion vs unintended drift (changelog + light `git log --oneline`); (c) is the bug in the scenario docs (stale) or the live weight; (d) concrete remediation (fix SC-004/SC-005 docs to match live, OR revert weight to 0/shadow) with target file(s).

KEY FILES:
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/  (grep semantic_shadow, shadowOnly, laneWeights)
- .opencode/skills/system-skill-advisor/manual_testing_playbook/scorer-fusion/004-lane-attribution.md and 005-ablation.md
- .opencode/skills/system-skill-advisor/changelog/

OUTPUT CONTRACT — all THREE (exact paths):
1. Narrative -> .opencode/specs/system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/research/iterations/iteration-003.md  (headings: Focus, Actions Taken, Findings[file:line], Questions Answered, Questions Remaining, Next Focus="F4 OpenCode plugin bridge native route")
2. APPEND to .opencode/specs/system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/research/deep-research-state.jsonl via echo >>: {"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"insight","focus":"F3 semantic_shadow lane weight","graphEvents":[]}
3. Delta -> .opencode/specs/system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/research/deltas/iter-003.jsonl  (iteration line + one {"type":"finding",...} per finding w/ id/severity/label/iteration/evidence)
Single-line JSON, newline-terminated, appended. All three REQUIRED.
