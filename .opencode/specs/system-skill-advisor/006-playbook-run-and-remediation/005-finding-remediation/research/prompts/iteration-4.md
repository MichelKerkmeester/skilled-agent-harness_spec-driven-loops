> SPEC FOLDER PRE-APPROVED: `.opencode/specs/system-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation` — Gate 3 satisfied. Do NOT ask for a spec folder or pause. NON-INTERACTIVE: write the three artifacts to the exact paths below. Max 9 tool calls.

# Deep-Research Iteration 4 — F4 OpenCode plugin bridge native route fail-open

LEAF deep-research agent. Repo root, workspace-write. INVESTIGATE + REPORT only. Cite file:line.

Focus: F4 — mk-skill-advisor-bridge.mjs returns route:"python" + error:"SYSTEM_SKILL_ADVISOR_UNAVAILABLE" (fails open to python) even though dist/mcp_server/compat/index.js exists. Determine: (a) exactly how the bridge attempts the native route (import/spawn + how it decides native is unavailable); (b) the precise failure point (bad import path, missing export, subprocess/env issue, version skew, or a guard mis-detecting availability); (c) reproduce + trace; (d) concrete remediation with target file(s) + corrected import/spawn/guard.

KEY FILES:
- .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs
- .opencode/skills/system-skill-advisor/mcp_server/compat/index.ts  (built to dist/mcp_server/compat/index.js)
- .opencode/plugins/mk-skill-advisor.js
- Reproduce: printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | node .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs

OUTPUT CONTRACT — all THREE (exact paths):
1. Narrative -> .opencode/specs/system-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/research/iterations/iteration-004.md  (Next Focus="F5 stale vitest path NC-004/005")
2. APPEND to .opencode/specs/system-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/research/deep-research-state.jsonl: {"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"insight","focus":"F4 opencode bridge native route","graphEvents":[]}
3. Delta -> .opencode/specs/system-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/research/deltas/iter-004.jsonl
Single-line JSON, appended. All three REQUIRED.
