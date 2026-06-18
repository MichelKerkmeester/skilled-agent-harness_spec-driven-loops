# Iteration 4: KQ4 Python Fallback and Scorer Divergence

## Focus

Build the `skill_advisor.py` coverage matrix, explain the native bridge, and quantify local-vs-native recommendation divergence.

## Findings

1. `skill_advisor.py` is 3,642 lines and exposes `--health`, `--validate-only`, thresholds, local/native forcing, batch modes, stdin modes, and deep-routing JSON [SOURCE: command:wc -l .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py], [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3479].
2. Its native bridge is an inline Node ESM script that imports compiled compat handlers and generation state, probes status, then calls `handleAdvisorRecommend` when usable [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:82].
3. The Python bridge allows stale/live generation state to count as shim-eligible even when daemon liveness is not equivalent to native MCP caller liveness [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:111].
4. Runtime bridge calls are subprocess-based with a 2.5s timeout and a small env allowlist [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:336].
5. Measured 10-prompt parity: `--force-local` and `--force-native` returned the same top recommendation for all 10 prompts. Prompts covered git, deep research, code tests, deck request, skill install, Figma mockup, PR review, memory save, localhost browser, and CSV analysis [SOURCE: command:10-prompt force-local vs force-native parity measurement].
6. Coverage matrix: `advisor_recommend` yes; `advisor_status` partial via `--health`; `advisor_validate` partial via `--validate-only`; `advisor_rebuild` no; `skill_graph_scan` no; `skill_graph_query` no; `skill_graph_status` partial as health internals; `skill_graph_validate` partial via validation; `skill_graph_propagate_enhances` no.
7. Verdict: reconcile, do not supersede immediately. Keep `skill_advisor.py` as legacy recommend facade, but make the new Node CLI the canonical 9-tool parity surface.

## Sources Consulted

- `scripts/skill_advisor.py`
- 10-prompt local/native measurement

## Assessment

`newInfoRatio`: 0.90. Confidence high: path coverage and measured parity agree, while missing tool modes are visible in argparse.

## Reflection

What worked: using identical prompts under both force modes. What failed: treating score parity as tool parity. Ruled out: immediate removal of `skill_advisor.py`.

## Recommended Next Focus

KQ5: classify rebuild/scan duration and synchronous-vs-job semantics.
