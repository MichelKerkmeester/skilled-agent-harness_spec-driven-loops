# Deep-Review Iteration 9 Prompt Pack — ADVERSARIAL PASS

## STATE

STATE SUMMARY (auto-generated):
Iteration: 9 of 10
Dimension: cross-cutting (adversarial Hunter/Skeptic/Referee)
Prior Findings: P0=0 P1=13 P2=6
Active P1s: P1-007, P1-015, P1-016, P1-017, P1-018, P1-019, P1-020, P1-021, P1-022, P1-023, P1-024, P1-025, P1-026
Active P2s: P1-005 (downgraded), P2-002, P2-004, P2-008, P2-009, P2-010
Dimension Coverage: [inventory, correctness, security, traceability, maintainability + cross-cutting] (5/5 + re-pass)
Coverage Age: 1
Last 2 ratios: 0.1875 -> 0.1579
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 9 of 10
Mode: review
Dimension: adversarial (Hunter/Skeptic/Referee on ALL 13 active P1s)
Review Target: track:skilled-agent-orchestration packets 093-098 — adversarial verification
Review Scope Files: per-finding file:line references
Prior Findings: P0=0 P1=13 P2=6

## CONTEXT — ADVERSARIAL HUNTER/SKEPTIC/REFEREE PASS

This iteration runs the formal adversarial self-check on every active P1 to firm up the synthesis
that's coming next. For each of the 13 active P1s:

1. **Hunter** — Re-read the cited file:line. Confirm the claim is supported by current source.
2. **Skeptic** — Challenge the severity. Could it be P2 (advisory) instead of P1 (required)?
3. **Referee** — Final ruling: CONFIRM_P1 / DOWNGRADE_TO_P2 / FALSE_POSITIVE_RESOLVED

Targets:
- P1-007 (checklist evidence)
- P1-015 (skill_graph_scan source)
- P1-016 (scripts/dist stale)
- P1-017 (095 inconsistent execution)
- P1-018 (093 playbooks unreachable from skill)
- P1-019 (spec_folder interpolation)
- P1-020 (audit_descriptions.py zero-inventory pass)
- P1-021 (smart-router false-fail on shared CLI router)
- P1-022 (096/004 anchor mismatch + strict-validate fail)
- P1-023 (deferred findings missing from continuity blockers)
- P1-024 (098 child packets fail strict validation)
- P1-025 (advisor routing failure)
- P1-026 (registry/state-log mismatch — reducer bug)

**Also**: spot-check whether any active P2 should be upgraded to P1 based on aggregate impact.

**No new finding hunting** — this is a pure verification pass. Iter 10 (saturation) is the final
chance for new finding discovery.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## VERDICTS

`FAIL | CONDITIONAL | PASS`.

## CLAIM ADJUDICATION

For each adjudicated P1, emit:
```json
{"type":"adjudication","iteration":9,"id":"P1-XXX","hunter":"<file:line confirmation>","skeptic":"<severity challenge>","referee":"CONFIRM_P1|DOWNGRADE_TO_P2|FALSE_POSITIVE","rationale":"<one line>"}
```

Plus the standard `{"type":"finding"}` updates if any severity changes.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-009.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-009.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.
- DO NOT search for new findings — this is verification only.

## OUTPUT CONTRACT

Three artifacts: iteration-009.md narrative (with one §Adjudication subsection per P1) + state-log JSONL append (`type:iteration`, `dimensions:["correctness","security","traceability","maintainability"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new", focus:"adversarial-pass", `findingsCount` reflects post-adjudication count, newFindingsRatio reflects no-new-findings assertion) + iter-009.jsonl delta with `{"type":"adjudication"}` records per P1. All required.
