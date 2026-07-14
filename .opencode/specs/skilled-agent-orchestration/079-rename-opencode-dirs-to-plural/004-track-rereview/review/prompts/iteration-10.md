# Deep-Review Iteration 10 Prompt Pack — SATURATION + FINAL VERDICT

## STATE

STATE SUMMARY (auto-generated):
Iteration: 10 of 10 (FINAL)
Dimension: cross-cutting (saturation pass + final verdict promotion)
Prior Findings: P0=0 P1=13 P2=6 (ALL P1s adjudicated CONFIRM_P1 in iter 9)
Active P1s: P1-007, P1-015, P1-016, P1-017, P1-018, P1-019, P1-020, P1-021, P1-022, P1-023, P1-024, P1-025, P1-026
Active P2s: P1-005 (downgraded), P2-002, P2-004, P2-008, P2-009, P2-010
Dimension Coverage: [inventory, correctness, security, traceability, maintainability + cross-cutting + adversarial] (5/5 + 2 re-passes)
Coverage Age: 2
Last 2 ratios: 0.1579 -> 0.0
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true (active P1 set blocks PASS)

Review Iteration: 10 of 10
Mode: review
Dimension: saturation (final-look + verdict)
Review Target: track:skilled-agent-orchestration packets 093-098 — final saturation pass
Prior Findings: P0=0 P1=13 P2=6

## CONTEXT — SATURATION PASS

This is the FINAL iteration. Goals:

**FOCUS-A: Saturation lookout (≤3 tool calls)**
Look for anything missed in iter 1-9. One short sweep, e.g.:
- `rg -l "TODO|FIXME|XXX" .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/` for orphan TODOs
- One spot-check on a finding ID we haven't re-touched (e.g., P2-002 vitest singular path — is it intentional historical reference?)
- Spot-check that workflow-resolved spec_folder write authority is preserved across all CLI executors

If you find anything genuinely new at high confidence, raise it. Otherwise note "no new findings".

**FOCUS-B: Final verdict claim**
Based on iter 1-9 evidence + adversarial confirmations:
- Verdict is FAIL (or CONDITIONAL — explain choice)
- hasAdvisories=true (P2 set non-empty)
- 098 remediation status: incomplete — verdict-flip from FAIL to PASS is REFUTED at this time
- Recommend follow-on remediation packet(s)

**FOCUS-C: Planning Packet seed**
Output one short JSON-block (no fenced code; just inline) that summarizes the Planning Packet
recommended seed, with field names as in the YAML synthesis contract:
- `triggered`: true
- `verdict`: "FAIL"
- `hasAdvisories`: true
- `activeFindings`: count by severity
- `remediationWorkstreams`: ordered groups (P1 first, then P2 advisory)
- `specSeed`: bullets for new follow-on spec
- `planSeed`: starter tasks
- `findingClasses`: map of finding ID → class (cross-consumer / matrix-evidence / instance-only / test-isolation / structural)
- `affectedSurfacesSeed`: list of surfaces touched (handlers/, scripts/dist/, validators, advisor, hooks, etc.)
- `fixCompletenessRequired`: true (security/path/auth surface = P1-019 spec_folder interpolation)

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## VERDICTS

`FAIL | CONDITIONAL | PASS`. Pick FAIL or CONDITIONAL given 13 active P1s.

## CLAIM ADJUDICATION

If a new P0/P1 surfaces in this saturation pass, include the typed packet. Otherwise no packet needed.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-010.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-010.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.
- Be concise — this is a wrap-up, not a deep dive.

## OUTPUT CONTRACT

Three artifacts: iteration-010.md narrative (with §Final Verdict and §Planning Packet Seed sections) + state-log JSONL append (`type:iteration`, `dimensions:["correctness","security","traceability","maintainability"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new", focus:"saturation-final", `findingsSummary`, `findingsCount`, `newFindingsRatio` reflecting any new finding ratio, status:"complete") + iter-010.jsonl delta. All required.
