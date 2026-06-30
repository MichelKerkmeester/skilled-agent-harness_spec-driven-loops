# Deep-Review Iteration 4 Prompt Pack — SECURITY

## STATE

STATE SUMMARY (auto-generated):
Iteration: 4 of 10
Dimension: security
Prior Findings: P0=0 P1=5 P2=4 (P1-007, P1-015, P1-016, P1-017, P1-018 + P1-005 downgraded + P2-002, P2-004, P2-008)
Dimension Coverage: [inventory, correctness] (2/5)
Traceability: spec_code=fail | checklist_evidence=fail | skill_agent=pass | agent_cross_runtime=fail (CR transcript gap) | feature_catalog_code=fail | playbook_capability=mixed
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: 0.2857 -> 0.2222
Stuck count: 0
Provisional Verdict: FAIL hasAdvisories=true

Review Iteration: 4 of 10
Mode: review
Dimension: security
Review Target: track:skilled-agent-orchestration packets 093-098 — security audit
Review Scope Files (this iteration's focus):
  - .opencode/skills/system-spec-kit/hooks/claude/session-stop.ts (Stop hook env override gating)
  - .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js (dist mirror)
  - .opencode/skills/system-spec-kit/shared/review-research-paths.cjs (resolver containment, P1-005 downgraded)
  - .opencode/commands/speckit/assets/speckit_deep-review_auto.yaml (workflow-resolved spec_folder write authority + buildCopilotPromptArg, P2-004)
  - .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts (parseExecutorConfig)
  - .claude/settings.local.json (hook config schema; nested vs flat)
  - .opencode/skills/system-spec-kit/references/hooks/ (skill-advisor-hook + SessionStart)
  - .opencode/skills/system-spec-kit/scripts/spec/validate.sh (path traversal, command injection)
  - 098/004-hooks-resolver-tighten/ (claimed Stop hook env gating)
Prior Findings: P0=0 P1=5 P2=4

## CONTEXT — SECURITY PASS

This iteration is the security deep dive. Focus areas:

**FOCUS-A: Stop hook env override (098/004 fix)**
- Confirm `SPECKIT_GENERATE_CONTEXT_SCRIPT` is gated to `NODE_ENV=test` or `SPECKIT_TEST=true`
- Verify the gating cannot be bypassed via mismatched casing, shell unset, or empty string
- Check both source AND dist are synchronized (per iter 2's source/dist drift theme)

**FOCUS-B: Workflow-resolved spec_folder write authority**
- The deep-review YAML pins spec_folder as the only legal write target
- Confirm `buildCopilotPromptArg` actually enforces this; check for any path-injection vector
- Spot-check: can a recovered/bootstrap folder mention inside the prompt body override the workflow-resolved authority?
- This is P2-004's surface

**FOCUS-C: Resolver containment (P1-005 downgraded)**
- Re-examine `review-research-paths.cjs` resolver: does `path.resolve(specFolder)` plus the downstream usage prevent writes outside the spec folder?
- If a malicious spec_folder string contains `../` or absolute path traversal, what happens?

**FOCUS-D: Hook config schema integrity**
- `.claude/settings.local.json` — confirm hook schema is correct (nested form per known-good ref)
- SessionStart hooks — any command-injection vector via prompt content?

**FOCUS-E: validate.sh + skill_advisor.py path traversal**
- Spot-check that user-controllable inputs to validate.sh and skill_advisor.py cannot escape the project directory

DO NOT widen scope beyond security; if you find a non-security issue, defer to maintainability iter 7.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`.

## CLAIM ADJUDICATION

Every new P0/P1: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-config.json
- State Log: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Tool budget 9 / 12 / 13.
- Review target READ-ONLY. Only write under `099-track-rereview/review/`.

## OUTPUT CONTRACT

Three artifacts: iteration-004.md narrative + state-log JSONL append (`type:iteration`, `dimensions:["security"]`, sessionId 2026-05-07T17:08:57Z, generation 1, lineageMode "new") + iter-004.jsonl delta with `{"type":"finding"}` per finding. All required.
