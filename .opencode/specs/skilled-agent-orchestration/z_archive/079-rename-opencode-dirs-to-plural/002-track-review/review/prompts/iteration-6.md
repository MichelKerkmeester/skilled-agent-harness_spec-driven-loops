# Deep-Review Iteration 6 Prompt Pack — Adversarial Re-verification

## STATE

Iteration: 6 of 10
Dimension: cross-cutting (adversarial re-verification + least-covered re-pass)
Prior Findings (cumulative): P0=1 P1=10 P2=8 (19 total)
Dimension Coverage: [correctness:complete, security:complete, traceability:complete, maintainability:complete] (4/4)
Coverage Age: 0  →  this iteration ages coverage to 1
Last 3 ratios: 0.50 -> 0.31 -> 0.30 -> 0.18
Convergence Score: 0.82 (rising, near saturation)
Provisional Verdict: FAIL (active P0; P1-005 candidate for P0 escalation)
Stuck count: 0

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

Active findings (read iteration-001..005 markdown for full packets):
- P0-001 (was P1-001): dist code-graph globs stale; live runtime
- P1-002: Command YAML sk-deep-* drift
- P1-003: skill_advisor.py writes .opencode/skill/.advisor-state
- P1-004: 096 validate.sh failure
- P1-005: artifact resolver accepts malformed spec_folder (resource-map redirect)
- P1-006: Claude Stop hook env-selected autosave precedence
- P1-007: Completed packets unchecked checklist evidence
- P1-008: OpenCode deep-loop leaf-agent mirrors cite non-existent sk-deep-* paths
- P1-009: Codex @review mirror weakens P1 blocking contract
- P1-010: Packet 096 specs bulk-rewritten into plural-to-plural tautology
- P1-011: Orchestrator routing table names non-existent sk-deep-research
- P2-001..008: doc drift, dist test fixtures, setup helpers, copilot guard, naming, install guide

## SHARED DOCTRINE
`.opencode/skills/sk-code-review/references/review_core.md`

## STATE FILES
- All under `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/`
- Iteration narrative target: `iterations/iteration-006.md`
- Delta target: `deltas/iter-006.jsonl`

## TASK FOR THIS ITERATION (adversarial re-verification + sweep)

Per strategy §12 NEXT FOCUS:

1. **P0-001 hunter re-verification**:
   - Re-read `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js` and source `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`.
   - Confirm runtime entry: `opencode.json` MCP server command, `.codex/config.toml`, `.gemini/settings.json`, `.claude/settings.local.json` MCP block. Trace each to the loaded `dist/` file.
   - Verify confidence ≥ 0.85. Downgrade only if you find decisive proof that source `.ts` is loaded directly.

2. **P1-005 escalation check**:
   - Re-trace deep-loop artifact resolver. P1-005 noted that malformed spec_folder values redirect resource-map writes.
   - Construct an attack matrix: empty string, whitespace, `..`, absolute path, symlink, glob, template-literal-not-substituted. For each, trace where the write lands. If ANY non-empty hostile case writes outside the resolved spec_folder, ESCALATE TO P0.
   - Otherwise downgrade to P2 (defense-in-depth).

3. **Tautology sweep** (P1-010 may have siblings):
   - Run `rg -nE '\.opencode/(skills|agents|commands)/ ?-> ?\.opencode/(skills|agents|commands)/'` and `rg -nE 'rename `?\.opencode/(skills|agents|commands)`? to `?\.opencode/(skills|agents|commands)`?'` across canonical workspace.
   - Surface ANY narrative that survived sed corruption. If you find more than 3 distinct surfaces, file a sibling P1.

4. **sk-deep-* dead-reference sweep across the canonical workspace** (P1-002 / P1-008 / P1-011 closure):
   - `rg -il 'sk-deep-(review|research)' --glob '!barter/coder/**' --glob '!**/z_archive/**' --glob '!**/playbooks-archived/**' --glob '!**/iterations/**' --glob '!**/iter-archive/**' --glob '!**/review/iterations/**'`
   - Bucket each hit: live workflow YAML, agent definition, orchestrator/routing table, doc-only citation, test fixture. Confirm coverage of P1-002/P1-008/P1-011; surface any new live-workflow surface as a P1 sibling.

5. **Build hygiene singular-root sweep** (P2-002 / P2-008 closure):
   - For `mcp_server/dist/`, list every file with singular `\.opencode/(skill|agent|command)/`. Quantify the drift surface.
   - For `mcp_server/code_graph/lib/`, `mcp_server/lib/spec/`, `mcp_server/lib/deep-loop/`, `mcp_server/skill_advisor/scripts/`, `mcp_server/lib/storage/`: confirm src is plural in all cases.

6. **Coverage age increment**:
   - This iteration must register without changing dimension coverage (so coverage_age advances 0→1).
   - In the iteration JSONL record, repeat the existing dimension flags rather than adding new ones.

7. **Update strategy** §12 NEXT FOCUS for iter-7 (likely closure pass: confirm or refute the last open severity questions, prepare for synthesis).

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 9 tool calls, soft 12, hard 13.
- READ-ONLY review target. Writes confined to 097-track-review/review/.
- JSONL `"type":"iteration"` exactly with `findingDetails` array.

## OUTPUT CONTRACT

1. **iteration-006.md**: Dimension(s), Files Reviewed, Findings by Severity (with adjudication packets for any new P0/P1 OR severity changes), Traceability Checks, Verdict, Next Dimension.

2. **State log iteration record** APPENDED with `"type":"iteration"` and full `findingDetails` array including any severity changes.

3. **iter-006.jsonl** — matching iteration record + finding records + classifications + ruled-out.

`newFindingsRatio` formula: P0=10/P1=5/P2=1, max(calc, 0.50) on new P0; 0.0 if no new findings.

If you escalate P1-005 to P0, that COUNTS as a new P0 for ratio (use weight 10) — the iteration ratio will pin to ≥0.50 even if no other findings land.

If no new findings AND no severity changes: ratio = 0.0, iteration converges cleanly.

Begin.
