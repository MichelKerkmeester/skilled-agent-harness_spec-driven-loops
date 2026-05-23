# Deep-Review Iteration 3 Prompt Pack

## STATE

STATE SUMMARY:
Iteration: 3 of 10
Dimension: security (deep pass)
Prior Findings (cumulative): P0=1 P1=3 P2=3
Dimension Coverage: [correctness:complete] (1/4)
Coverage Age: 0
Last 2 ratios: 1.00 -> 0.50
Stuck count: 0
Provisional Verdict: FAIL (active P0 from P1-001 upgrade)

Mode: review
Review Target: track:skilled-agent-orchestration (packets 093, 094, 095, 096)

Active findings carried forward (read iteration-001.md and iteration-002.md for full adjudication packets):
- **P0-001 (was P1-001)**: Live runtime uses stale generated code-graph scope globs after plural rename. dist/ is on live path. file: .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13
- **P1-002**: Command-owned deep-review/deep-research YAML reads non-existent sk-deep-* skill paths
- **P1-003**: Skill advisor source still writes .opencode/skill/.advisor-state
- **P1-004**: Packet 096 validation failure localizes to parent + 004-symlinks doc sufficiency
- P2-001..003: doc-only drift items

## SHARED DOCTRINE

`.opencode/skills/sk-code-review/references/review_core.md` for severity calls.

## STATE FILES

- Config: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md`
- Iteration narrative target: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-003.md`
- Delta target: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deltas/iter-003.jsonl`
- Prior iterations to read for context: iteration-001.md, iteration-002.md

## TASK FOR THIS ITERATION (D2 Security)

Per strategy §12 NEXT FOCUS:

1. **Hook integrity audit** across OpenCode, Codex, Gemini, Claude.
   - Inspect `.claude/settings.local.json` SessionStart and other hooks (per project memory the hook schema is NESTED `hooks.<Event>: [{matcher, hooks: [{type, command, ...}]}]`).
   - Verify every hook command path resolves to an existing file post-rename (no `.opencode/skill/...` survivors that would silently fail).
   - Check whether generated dist hook files (e.g., `mcp_server/dist/hooks/...`) are live (this matters because P0-001 already proved `dist/` is on the live runtime path).
   - For each `hooks` entry, dry-run the command resolution: does the binary exist? Are its args sane?
2. **Sandbox/auth/approval policy** review:
   - In runtime configs and command workflow YAMLs (`.opencode/commands/speckit/assets/speckit_*_auto.yaml`), compare default `approval_policy`, `sandbox`, and `--allow-all-tools`/`--no-ask-user` defaults against the iteration's READ-ONLY contract.
   - Look at `buildCopilotPromptArg` (cli-copilot path in deep-review YAML) — confirm the TARGET AUTHORITY preamble and `validateSpecFolder` actually reject empty/whitespace/template values.
   - For cli-codex (this dispatch path), confirm `-c approval_policy=never` + `-s workspace-write` + 900s timeout do NOT escape the spec_folder.
3. **Workflow-resolved spec_folder write authority**:
   - Trace how the deep-review YAML resolves `{spec_folder}` and `{artifact_dir}` from setup phase.
   - Confirm iteration outputs cannot escape `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/` even under malformed config.
   - Test: can a hostile spec.md, plan.md, or strategy.md inject content that the reducer mis-routes?
4. **Env precedence & redaction**:
   - Search for env-var-driven path overrides that could be triggered by hostile session env (e.g., `CODE_GRAPH_INDEX_*_ENV` flags from the dist tests we already saw).
   - Look for any path-disclosure or PII redaction surface that the rename could have shifted.
5. **Cross-runtime hook + agent dispatch parity**:
   - Verify `.codex/agents/`, `.gemini/agents/`, `.claude/agents/`, `.opencode/agents/` are all in sync for the leaf agents (deep-review, deep-research, code, etc).
   - Spot-check 2-3 agent definitions for cross-runtime drift.

## CONSTRAINTS

- LEAF. No sub-agents.
- Target 9 tool calls, soft 12, hard 13.
- READ-ONLY review target. Writes confined to 097-track-review/review/{iterations,deltas,deep-review-state.jsonl,deep-review-strategy.md}.
- JSONL `"type":"iteration"` exactly.
- Include `findingDetails` array for every finding new OR updated this iteration.
- New P0/P1 findings must include claim-adjudication packets in iteration narrative.
- Mark D2 Security `[x]` in §3 strategy if security pass converges this iteration. Update §12 NEXT FOCUS for iteration 4 (likely D3 Traceability deep pass on prompt-equality contract across the 16 RCAF playbooks).

## OUTPUT CONTRACT

Three artifacts (validation fails iteration if any missing/malformed):

1. **iteration-003.md** with sections: Dimension, Files Reviewed, Findings by Severity (P0/P1/P2 + claim-adjudication packets), Traceability Checks, Verdict, Next Dimension.

2. **State log iteration record** APPENDED:

```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-3","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":["..."],"findingsCount":<cumulative>,"findingsSummary":{"P0":<cum>,"P1":<cum>,"P2":<cum>},"findingsNew":[/*ids new this iter*/],"findingDetails":[/*full objects for ALL findings touched this iter, including carry-forward updates*/],"traceabilityChecks":{"summary":{...},"results":[...]},"newFindingsRatio":<0..1>,"sessionId":"2026-05-07T14:46:56Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

3. **iter-003.jsonl** — matching iteration record + finding records + classifications + ruled-out directions.

`newFindingsRatio` formula: severity-weighted findings new this iter / cumulative findings touched. P0=10, P1=5, P2=1. `max(calc, 0.50)` if ANY new P0 lands. 0.0 if no new findings.

Begin.
