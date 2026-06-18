# Iteration 037 — Angle 37

**Angle:** Native vs local scorer parity: systematic differential testing beyond the gold dataset (the local path just needed three fixes the native path did not).

**Summary:** The local scorer is materially less aligned than the current parity gates show: it fails most harder intent fixtures and can misroute even an explicit `mcp-code-mode` request. The native path also has default telemetry writes, which should be disabled for read-only parity probes.

**Findings kept:** 3

## [P1][BUG] Local scorer can override an explicitly named skill with a related skill keyword

- Evidence: Command: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local --show-rejections --threshold 0.8 --uncertainty 0.35 'Use mcp-code-mode to call an external MCP tool chain through TypeScript execution.' Output: mcp-code-mode confidence 0.95 uncertainty 0.39 passes_threshold false; mcp-chrome-devtools confidence 0.95 uncertainty 0.15 passes_threshold true reason includes '!mcp-code-mode(keyword)'. Source: .opencode/skills/mcp-chrome-devtools/SKILL.md:8, .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3260-3275
- Detail: The local scorer treats mcp-chrome-devtools' `mcp-code-mode` keyword as positive evidence for Chrome DevTools, so a prompt explicitly naming `mcp-code-mode` can route to the Chrome orchestrator. The native path has explicit Code Mode disambiguation for tool-chain vocabulary in `fusion.ts`, while the local path only lifts mcp-code-mode above sk-code and does not demote mcp-chrome-devtools.
- Fix sketch: In the Python scorer, treat exact skill-id mentions as owner-only evidence or add a negative/override rule preventing related-skill keywords from beating the explicitly named skill.

## [P1][BROKEN-FEATURE] Parity coverage stops at gold preservation and misses harder local/native drift

- Evidence: Command: Python local scorer over intent + harder fixtures returned intent rows=24 correct=19 mismatch_count=5 and harder rows=22 correct=4 mismatch_count=18. Fixture/test evidence: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts:34-45 uses ten self-naming prompts; .opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts:127-139 only checks native preserves Python-correct gold rows; .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts:645-664 writes a harder-corpus report without asserting accuracy.
- Detail: The current automated parity story does not systematically differential-test the local Python scorer against native behavior outside the gold-preservation slice. The repo already contains harder intent fixtures, but they are used for native lane-weight reporting rather than a local/native gate, allowing large local drift to remain non-blocking.
- Fix sketch: Add a non-writing parity test that runs Python local and native scorer over the intent and harder corpora, failing on unapproved top-skill divergences or local regressions.

## [P2][BUG] Native advisor recommendation path writes shadow deltas during read-style scoring

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:378-388 calls recordShadowDelta for every shadow recommendation; .opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts:95-100 creates the directory and appends JSONL.
- Detail: A systematic parity harness that calls native `advisor_recommend` is not side-effect-free by default because the handler appends shadow telemetry. That makes read-only differential testing harder and diverges from the local in-process Python scorer, which only computes recommendations.
- Fix sketch: Gate shadow-delta writes behind an explicit telemetry flag or a handler option so parity/read-only probes can disable all writes.
