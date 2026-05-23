# Deep-Review Iteration 8 Prompt Pack — Saturation / Adversarial Re-Verification

## ROLE

You are a deep-review LEAF executor (cli-codex / gpt-5.5 / reasoning=high / serviceTier=fast). The session has reached full dimension coverage after iter-7. This is a saturation pass to (a) bump coverage_age to ≥1 (legal-stop prerequisite) and (b) re-verify the 6 active findings with a different lens to catch any STOP-veto conditions before synthesis.

Sandbox: workspace-write. ONLY write under `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/`. NEVER modify reviewed files.

## STATE SUMMARY (auto-generated)

- Iteration: 8 of 10
- Mode: review
- Dimension: **flexible re-pass** (least-covered + adversarial re-verification across all 4 dims)
- Review Target: `track:skilled-agent-orchestration`
- Strategy: saturation
- Lifecycle: resume; sessionId=deep-review-102-2026-05-07T2055; lineageMode=resume; generation=1; continuedFromRun=7
- Executor: cli-codex / gpt-5.5 / reasoningEffort=high / serviceTier=fast / timeoutSeconds=900
- Active findings (deduped from registry): 0 P0, 2 P1, 4 P2 (note: state.jsonl iter-5 raw shows 3 P1 + 5 P2; reducer dedup yields 2 P1 + 4 P2 due to P2-027 vs P2-027r reframing and one cross-iteration P1 merge)
- Dimension Coverage: correctness ✓ | security ✓ | traceability ✓ | maintainability ✓ (4 of 4)
- coverage_age: 0 (D4 just covered in iter-7 — this iteration is needed to bump to ≥1)
- Last 3 newFindingsRatios: 0.40 (iter-5) → 0.00 (iter-6) → 0.00 (iter-7)
- Stuck count: 0 (last 2 iterations had 0 new — already past stuck threshold by virtue of coverage)
- Provisional Verdict: CONDITIONAL (P1-027 + P1-028 active, blocking PASS) hasAdvisories=true

## ACTIVE FINDINGS (from registry)

| ID | Severity | Title | File:Line |
|----|----------|-------|-----------|
| P1-027 | P1 | if_cli_opencode YAML branches do not pass --pure | `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:783` (and 3 sibling YAMLs) |
| P1-028 | P1 | cli-opencode sandboxMode declared but ignored by all 4 if_cli_opencode YAML branches | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:37-40` |
| P2-027 | P2 | cli-opencode advisor alias claim in 101 strategy not reflected in aliases.ts | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts:5-27` |
| P2-027r | P2 | REFRAMED: actual defect is missing scoring lane entry, not missing alias | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:11,39` |
| P2-028 | P2 | Zero unit-test coverage for cli-opencode in executor-config.vitest.ts | `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/executor-config.vitest.ts` |
| P2-032 | P2 | Strategy doc surface inventory drift — claims aliases.ts touched by 101 but 101 implementation-summary lists only 5 surfaces | `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/deep-review-strategy.md` |

## ITER-8 SCOPE — SATURATION + ADVERSARIAL RE-VERIFICATION

Do all 5 sub-tasks. Each is bounded and short:

### S1. Adversarial re-verification on P1-027 + P1-028 (different lens)

For each P1, run a SECOND adversarial pass distinct from iter-7:

- **P1-027 second-lens**: Test the contrapositive — IF `--pure` were truly required for cli-opencode dispatch under DeepSeek, would removing `--dangerously-skip-permissions` from the YAML branch ALSO surface as a defect? Read the executor-config.ts cli-opencode flag list and the cli-opencode SKILL.md to confirm `--pure` is the canonical fix vs. some alternative (e.g. `--no-tool-prefix`, model-specific exclusion list, etc.). If `--pure` is NOT actually the canonical fix, downgrade or reframe.

- **P1-028 second-lens**: Read the EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode'] block and verify whether `sandboxMode` carries a runtime-effect contract or is purely advisory. If parseExecutorConfig validates sandboxMode but YAML doesn't honor it, that's a contract violation (P1). If parseExecutorConfig accepts sandboxMode as a no-op pass-through, severity drops to P2 (doc only). Run `node -e "..."` or grep for sandboxMode usage downstream.

### S2. Closed-gate replay re-verification — pick 2 of 13 prior 099 P1s at random

Re-confirm 2 of the 13 prior 099 P1s are actually RESOLVED in 100, not just claimed-resolved. Pick (a) the highest-impact one related to reducer (P1-026 — already verified iter-2 but re-spot-check) and (b) one randomly chosen non-reducer P1 from 099's review-report.md. Read each fix's file:line in the live tree and confirm the fix is present.

If iter-1 narrative isn't accessible, read it: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/007-track-rereview/review/iterations/iteration-001.md` for the closed-gate replay table.

### S3. Sandbox / write-authority audit

Re-verify that NO file outside `102-track-rereview-2/review/` has been mutated in this session. Run:

```bash
git status -s | grep -v "102-track-rereview-2/review/" | head -20
```

Any file outside the review packet root that shows M / A / D status (and was not pre-existing per the user's "worktree cleanliness is never a blocker" memory) is a NEW finding. Note: the user's project memory says baseline state is dirty with parallel tracks — DO NOT flag pre-existing dirty files; only flag CHANGES introduced during this session (last 8 iterations).

### S4. Hidden P0 / P1 sweep — security-sensitive scope

Per spec.md, scope includes "workflow-resolved spec_folder write authority", "Stop hook env override gated to NODE_ENV=test", "opencode --dangerously-skip-permissions semantics". Spot-check these THREE surfaces:

1. **workflow-resolved spec_folder write authority**: Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` for `validateSpecFolder` AND check `spec_kit_deep-review_auto.yaml` `if_cli_copilot` branch (around `buildCopilotPromptArg`). The Copilot wrapper attaches a TARGET AUTHORITY preamble. Confirm cli-codex / cli-gemini / cli-claude_code / cli-opencode branches DO NOT bypass this guard for dispatches that write to spec folders.

2. **Stop hook env override gated to NODE_ENV=test**: grep `.opencode/skills/system-spec-kit/scripts/hooks/` (or wherever the Stop hook lives) for env-override behavior. Confirm gate.

3. **opencode --dangerously-skip-permissions semantics**: Check whether `--dangerously-skip-permissions` is a generic OpenCode flag or specific to cli-opencode. If specific, no risk. If generic and cli-opencode branches are missing alternative auth flow, may be P0/P1.

For any hidden defect found, file at appropriate severity with claim-adjudication packet.

### S5. Verdict-flip headline statement preparation

Synthesize a one-paragraph "verdict-flip headline" suitable for the executive summary of review-report.md. Format:

> Re-review #2 of 099→100 verdict-flip: 13 of 13 prior P1s RESOLVED by 100; 0 P0 / 2 P1 / 4 P2 active findings — all 2 active P1s are NEW regressions introduced by 101's cli-opencode wiring (--pure missing in 4 YAML branches; sandboxMode declared but ignored). Verdict: **CONDITIONAL** — 099 verdict flip from FAIL→PASS technically achieved for the carryover set, but 101 introduced 2 new P1 regressions blocking PASS.

(Adjust counts and language based on actual iter-8 findings. The sentence about verdict-flip is independent of iter-8.)

## CLAIM ADJUDICATION

If you discover any new P0/P1, emit a typed claim packet inline in §New Findings. If 0 new P0/P1, no packets needed.

## STATE FILES

Same paths as iter-7. Append to state.jsonl, write `iterations/iteration-008.md`, write `deltas/iter-008.jsonl`.

## OUTPUT CONTRACT

Three artifacts REQUIRED with the same schema as iter-7. Use `"type":"iteration"` exactly. Sandbox: workspace-write — ONLY write under the review packet path.

### Narrative headings

- `# Iteration 8 — Saturation + Adversarial Re-Verification`
- `## Dispatcher`
- `## Files Reviewed`
- `## S1. Adversarial re-verification (P1-027, P1-028 second-lens)`
- `## S2. Closed-gate replay re-verification (2 of 13)`
- `## S3. Sandbox / write-authority audit`
- `## S4. Hidden P0/P1 sweep — security-sensitive scope`
- `## S5. Verdict-flip headline statement preparation`
- `## Findings — New`
  - `### P0`
  - `### P1`
  - `### P2`
- `## Traceability Checks`
- `## Confirmed-Clean Surfaces`
- `## Ruled Out`
- `## Verdict (provisional)`
- `## Next Focus` — recommend STOP if no new findings, else iter-9 focus

### State.jsonl record (append exactly one line)

```json
{"type":"iteration","iteration":8,"run":8,"mode":"review","status":"complete","focus":"saturation","dimensions":["correctness","security","traceability","maintainability"],"filesReviewed":[...],"findingsCount":<n>,"findingsSummary":{"P0":0,"P1":<n>,"P2":<n>},"findingsNew":{"P0":0,"P1":<n>,"P2":<n>},"findingDetails":[{...}],"traceabilityChecks":{"summary":{"required":2,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":0},"results":[]},"newFindingsRatio":<0..1>,"sessionId":"deep-review-102-2026-05-07T2055","generation":1,"lineageMode":"resume","timestamp":"<ISO-8601-NOW>","durationMs":<ms>,"graphEvents":[]}
```

### Delta jsonl (deltas/iter-008.jsonl)

Same `"type":"iteration"` + per-finding records.

## TIME BUDGET

Hard max 12 minutes. Saturation iterations are deliberately short. Prioritize S1 (adversarial re-verification — most STOP-relevant) and S3 (sandbox audit — independence verification). If running low, S2/S4/S5 can be 2-3 sentences each.

Begin iter-8 now.
