> SPEC FOLDER PRE-APPROVED: `.opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation` — Gate 3 satisfied. Do NOT ask for a spec folder or pause. NON-INTERACTIVE: write the three artifacts to the exact paths below. Max 8 tool calls.

# Deep-Research Iteration 5 — F5 stale vitest path + playbook doc audit

LEAF deep-research agent. Repo root, workspace-write. INVESTIGATE + REPORT only. Cite file:line.

Focus: F5 — NC-004/NC-005 document a vitest command using `skill-advisor/tests/...` invoked from .opencode/skills/system-spec-kit/mcp_server, which resolves to NO test files; real tests live at .opencode/skills/system-skill-advisor/mcp_server/tests/ (49/49 pass). Determine: (a) the correct canonical invocation; (b) WHY the stale path exists (tests moved during a system-spec-kit -> system-skill-advisor extraction) — confirm via structure; (c) AUDIT every other playbook scenario for the same stale pattern (grep) and list every affected scenario; (d) concrete remediation (exact doc edits per affected scenario).

COMMANDS:
- grep -rn "skill-advisor/tests" .opencode/skills/system-skill-advisor/manual_testing_playbook/
- grep -rn "system-spec-kit/mcp_server exec -- vitest" .opencode/skills/system-skill-advisor/manual_testing_playbook/
- ls .opencode/skills/system-skill-advisor/mcp_server/tests/

OUTPUT CONTRACT — all THREE (exact paths):
1. Narrative -> .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/iterations/iteration-005.md  (Next Focus="converged: all 5 findings analyzed")
2. APPEND to .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deep-research-state.jsonl: {"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"insight","focus":"F5 stale vitest path + doc audit","graphEvents":[]}
3. Delta -> .opencode/specs/system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/research/deltas/iter-005.jsonl
Single-line JSON, appended. All three REQUIRED.
