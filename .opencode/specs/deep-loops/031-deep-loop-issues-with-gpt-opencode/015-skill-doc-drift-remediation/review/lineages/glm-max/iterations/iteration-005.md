# Iteration 5: Adversarial Replay + Cross-Cutting Breadth (terminal evidence pass)

## Focus
Adversarial replay of F001 (the sole P1): re-attempt to disprove or downgrade it. Then confirm the vitest reproducibility under the correct cwd, and run a final breadth pass across the Cluster 6 routing contract and the orchestrate.md load-bearing claim for any hidden P0. This is the terminal iteration under maxIterations=5 / stopPolicy=max-iterations.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability (breadth replay)
- Files reviewed: 6 (orchestrate.md; cli-opencode/SKILL.md:285-300; .opencode/agents/ai-council.md; deep-review/SKILL.md Caller contract; deep-improvement scripts/ vitest config)
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings
(none new — F001 replayed and upheld at P1; no P0 surfaced)

## Adversarial Replay — F001
**Attempt to disprove**: Is playbook.md:362 actually contradicting anything?
- Re-read `.opencode/agents/ai-council.md:4` → `mode: subagent` (unchanged ground truth).
- Re-read `cli-opencode/SKILL.md:31` → "Primary agents (directly invokable via `--agent`): `general`, `plan` (built-in), `orchestrate`" — three primaries, ai-council absent.
- Re-read `cli-opencode/SKILL.md:292` → ai-council is `mode: subagent`, "rejected at the top level".
- Contradiction CONFIRMED across three independent sources. F001 survives adversarial replay.

**Attempt to downgrade P1→P2**: Is it in the explicitly-excluded scope?
- spec.md Out-of-Scope excludes "the pre-existing (non-031) deep-ai-council naming mismatch (@deep-ai-council playbook expectation vs. registry's ai-council)". That exclusion is about the `@deep-ai-council` *naming*; F001 is about the *primary-vs-subagent classification* — a different claim. The exclusion does not cleanly cover F001.
- However: the line IS pre-existing (git blame 2026-05-30, not the remediation commit) and sits outside the phase's cited Cluster-1 line range (417–423). These are genuine mitigating factors recorded in the adjudication packet's downgradeTrigger.
- **Decision**: F001 HELD at P1. The contradiction is factual, the file was edited by the phase, and it directly relates to Cluster 1's purpose (eliminate ai-council-is-directly-invokable confusion). The downgrade path remains available to the operator per the packet's downgradeTrigger; confidence held at 0.72. No severity transition recorded.

## Cross-Cutting Breadth (P0 hunt)
- **Cluster 6 routing contract**: [SOURCE: cli-opencode/SKILL.md:292-295] is internally consistent — orchestrate may perform "exactly one bounded hand-off dispatch" but "MUST NOT re-implement the loop". [SOURCE: .opencode/agents/orchestrate.md:79] `@deep-review` Priority row intact (Priority 7), `subagent_type: "general"`, LEAF tier. [SOURCE: orchestrate.md:92] lists `@deep-review` as LEAF (must not dispatch sub-agents). [SOURCE: orchestrate.md:128] `@deep` is never a Task-dispatch target. The Cluster 6 fix (narrow cli-opencode, keep orchestrate) is consistent with the deep-review Caller contract. No P0.
- **vitest reproducibility (REQ-005)**: Re-ran `npx vitest run` from cwd `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/` → **2 failed | 411 passed (413)**, exit 0. This EXACTLY matches the phase's CHK-022 claim ("411/413 passing, same 2 pre-existing unrelated failures"). The 2 failures are in `skill-benchmark/tests/design-dispatch-boundary-proof.vitest.ts` (dispatch-boundary proofs, unrelated to mirror templates). No regression from the Cluster 4 scanner edit. REQ-005 substantively holds. (Caveat: invocation requires the `scripts/` cwd — a reproducibility note, not a finding, since the phase's claim is numerically exact.)
- **validate.sh**: re-confirmed `validate.sh --strict` → PASSED, 0 errors, 0 warnings.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | REQ map iter 3; orchestrate.md:79,128 | all REQs green; cluster-6 contract sound |
| checklist_evidence | partial | hard | vitest 411/413; validate.sh PASS | F002 (CHK-010 command) the lone reproducibility gap |

## Assessment
- New findings ratio: 0.0 — saturation reached on the terminal pass. No new defect categories surfaced.
- Dimensions addressed: all four (correctness, security, traceability, maintainability) now have ≥1 full iteration of coverage with required traceability protocols examined.
- Novelty justification: this pass was adversarial-replay + breadth; its value is *confirming* F001's severity and closing the P0-hunt, not adding findings. Composite stop signal would vote STOP, but stopPolicy=max-iterations means this is telemetry only; synthesis proceeds after iteration 5 as configured.

## Ruled Out
- F001 as P0: it is a classification contradiction, not a correctness failure or hard-gate breach (REQ-001's literal grep passes). Adversarial attempt to elevate to P0 rejected.
- Hidden P0 in the cluster-6 routing contract: orchestrate.md and cli-opencode/SKILL.md are mutually consistent; the load-bearing `@deep-review` row is intact. No P0.

## Dead Ends
- (none)

## Recommended Next Focus
Synthesis: compile `review-report.md` from the full state. Active findings = 1×P1 (F001) + 1×P2 (F002), 0×P0. Provisional verdict per the verdict map: activeP0==0 AND activeP1>0 → **CONDITIONAL**, routing to `/speckit:plan` for F001 remediation. F001's remediation is a one-line playbook.md:362 edit (drop ai-council from "repo-defined primaries", or reframe as subagent-routed); F002 is a checklist command-path fix.

Review verdict: CONDITIONAL
