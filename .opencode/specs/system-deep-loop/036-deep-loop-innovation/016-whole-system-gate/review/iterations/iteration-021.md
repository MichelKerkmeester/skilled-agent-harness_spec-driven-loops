# Iteration 021 — security

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:39:24.404Z
- New findings: 2 (of 2 reported; prior total 76)
- Coverage: {"filesExamined":31,"keyPaths":[".opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs",".opencode/commands/deep/assets/deep-alignment-auto.yaml",".opencode/commands/deep/assets/deep-alignment-confirm.yaml",".opencode/skills/system-deep-loop/deep-alignment/SKILL.md",".opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md",".opencode/commands/deep/assets/deep-model-benchmark-auto.yaml",".opencode/commands/deep/assets/deep-model-benchmark-confirm.yaml",".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/SKILL.md",".opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion-gate-contract.md"]}

## Summary
The deep-alignment workflows do not currently invoke REMEDIATE automatically; they only log a separate follow-up note. However, remediate-hook.cjs accepts and ignores --confirm, so its operator gate is documentary rather than enforced. A separate autonomous model-benchmark workflow does auto-invoke canonical promotion with --approve despite declaring approvals: none, creating a real authority-cutover risk.

## Findings
- [P0] F-021-01 Autonomous model benchmark fabricates promotion approval @ .opencode/commands/deep/assets/deep-model-benchmark-auto.yaml:198
  - evidence: The workflow declares approvals: none at line 15, but its unconditional step_promote_candidate has no condition and invokes promote-candidate.cjs with --approve. promote-candidate.cjs treats the presence of that flag as approval and directly copies the candidate over the target in its default promote phase.
  - recommendation: Make autonomous mode advisory-only, or require a separately supplied, candidate- and target-bound operator approval receipt before invoking promotion. Never synthesize --approve from workflow execution mode.
- [P1] F-021-02 REMEDIATE hook does not enforce operator confirmation @ .opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs:87
  - evidence: parseArgs sets args.confirm when --confirm is present, but main only checks args.specFolder and calls enterRemediateHook(args.specFolder) regardless of confirmation. The exported enterRemediateHook function accepts only specFolder, so direct module callers also enter REMEDIATE without authorization. The current body is a no-op, but the documented future replacement would inherit this unauthenticated entry path.
  - recommendation: Require an explicit authorization value at both the CLI and module boundary, reject missing or invalid approval before entering REMEDIATE, and bind approval to the specific packet and intended remediation operation.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 21,
  "dimension": "security",
  "summary": "The deep-alignment workflows do not currently invoke REMEDIATE automatically; they only log a separate follow-up note. However, remediate-hook.cjs accepts and ignores --confirm, so its operator gate is documentary rather than enforced. A separate autonomous model-benchmark workflow does auto-invoke canonical promotion with --approve despite declaring approvals: none, creating a real authority-cutover risk.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Autonomous model benchmark fabricates promotion approval",
      "file": ".opencode/commands/deep/assets/deep-model-benchmark-auto.yaml",
      "line": 198,
      "evidence": "The workflow declares approvals: none at line 15, but its unconditional step_promote_candidate has no condition and invokes promote-candidate.cjs with --approve. promote-candidate.cjs treats the presence of that flag as approval and directly copies the candidate over the target in its default promote phase.",
      "recommendation": "Make autonomous mode advisory-only, or require a separately supplied, candidate- and target-bound operator approval receipt before invoking promotion. Never synthesize --approve from workflow execution mode."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "REMEDIATE hook does not enforce operator confirmation",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs",
      "line": 87,
      "evidence": "parseArgs sets args.confirm when --confirm is present, but main only checks args.specFolder and calls enterRemediateHook(args.specFolder) regardless of confirmation. The exported enterRemediateHook function accepts only specFolder, so direct module callers also enter REMEDIATE without authorization. The current body is a no-op, but the documented future replacement would inherit this unauthenticated entry path.",
      "recommendation": "Require an explicit authorization value at both the CLI and module boundary, reject missing or invalid approval before entering REMEDIATE, and bind approval to the specific packet and intended remediation operation."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 31,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs",
      ".opencode/commands/deep/assets/deep-alignment-auto.yaml",
      ".opencode/commands/deep/assets/deep-alignment-confirm.yaml",
      ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md",
      ".opencode/skills/system-deep-loop/deep-alignment/references/state-machine-wiring.md",
      ".opencode/commands/deep/assets/deep-model-benchmark-auto.yaml",
      ".opencode/commands/deep/assets/deep-model-benchmark-confirm.yaml",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md",
      ".opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion-gate-contract.md"
    ]
  }
}
```