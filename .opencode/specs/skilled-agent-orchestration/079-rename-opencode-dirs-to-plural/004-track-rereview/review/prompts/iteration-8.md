# Deep-Review Iteration 8 Prompt Pack — VALIDATE.SH SWEEP + ACTIVE FINDINGS RE-VERIFICATION

## STATE

STATE SUMMARY (auto-generated):
Iteration: 8 of 10
Dimension: cross-cutting (validate.sh sweep + active findings re-verification + opencode discovery sanity)
Prior Findings: P0=0 P1=10 P2=6
Active P1s: P1-007, P1-015, P1-016, P1-017, P1-018, P1-019, P1-020, P1-021, P1-022, P1-023
Active P2s: P1-005 (downgraded), P2-002, P2-004, P2-008, P2-009, P2-010
Dimension Coverage: [inventory, correctness, security, traceability, maintainability] (5/5)
Coverage Age: 1 iteration
Last 2 ratios: 0.0769 -> 0.1875
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 8 of 10
Mode: review
Dimension: cross-cutting (re-verification + opencode discovery + hook gates)
Review Target: track:skilled-agent-orchestration packets 093-098 — final adversarial coverage pass
Review Scope Files (this iteration's focus):
  - bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh on 093, 094, 095, 096, 098 (and sub-phases) — spot-check 3-4 packets
  - skill_advisor.py routing for "deep-review" trigger phrase (does it route correctly?)
  - opencode discovery: `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/` enumeration sanity
  - hook gates: SessionStart hook (Claude Code), Stop hook env override
  - Re-verification of ALL 10 active P1 findings at file:line (Hunter/Skeptic/Referee)
Prior Findings: P0=0 P1=10 P2=6

## CONTEXT — RE-VERIFICATION + EXTERNAL VALIDATOR PASS

This iteration runs the EXTERNAL VALIDATORS and re-verifies every active P1 at file:line.

**FOCUS-A: validate.sh strict sweep**
Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet-path> --strict` on:
- `.opencode/specs/skilled-agent-orchestration/z_archive/076-testing-playbooks-code-review-and-git/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/` (phase parent)
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/` (phase parent + 7 sub-phases)
Report EXIT codes per packet. If any non-zero on packets claimed COMPLETE, raise as P1.

**FOCUS-B: skill_advisor.py routing**
Run `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "deep-review track:skilled-agent-orchestration" --threshold 0.8` and confirm:
- skill matches at confidence >= 0.8
- recommended skill is `deep-review` or `system-spec-kit`
- no Python errors

**FOCUS-C: opencode discovery sanity**
- `ls -d .opencode/skills/*/` returns ~16 plural-named skill folders
- `ls -d .opencode/agents/*/` (or .md files) returns the agent set
- `ls -d .opencode/commands/*/` returns command groups
- No singular survivors of `skill/`, `agent/`, `command/`

**FOCUS-D: Active P1 re-verification (Hunter/Skeptic/Referee)**
For each of the 10 active P1s, do a 1-line re-confirmation:
1. Re-read the file:line cited
2. Confirm the claim still holds OR mark as FALSE_POSITIVE
3. If still active, no severity change. If false-positive, downgrade or mark resolved.

**FOCUS-E: hook gates**
- Stop hook: confirm env override at session-stop.ts:39-46 still gated to NODE_ENV=test
- SessionStart hook: confirm `.claude/settings.local.json` schema is nested correctly

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

Every new P0/P1: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

For RE-VERIFICATIONS (no new finding, just confirming existing): emit a `{"type":"verification","iteration":8,"id":"P1-XXX","status":"confirmed|false_positive","evidence":[...]}` delta record.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-008.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13. (External validate.sh + python invocations are OK if they're a single Bash call each.)
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.

## OUTPUT CONTRACT

Three artifacts: iteration-008.md narrative + state-log JSONL append (`type:iteration`, `dimensions:["correctness","security","traceability","maintainability"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new") + iter-008.jsonl delta with verification records and any new findings. All required.
