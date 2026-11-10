# Deep Review Iteration 4

## Dimension

Maintainability. This pass examined the setup diagnostic's command rendering and its relationship to the command actually launched.

## Files Reviewed

- The scope manifest contains the selected setup checker at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/scope-files.txt:51].
- [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:77] confirms that child commands run through spawnSync with an argv array.
- [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139] formats the probe command with the raw custom prompt between double quotes.
- [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:140] passes the same prompt as a distinct argv value to the probe.
- [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:283] and [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:287] show that the formatted command is printed for PASS and FAIL rows.
- [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:303] and [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:307] accept caller-supplied prompt text.
- [SOURCE: .skilled/skills/sk-code/SKILL.md:55] and [SOURCE: .skilled/skills/sk-code/SKILL.md:67] describe registry and router ownership.
- [SOURCE: .skilled/skills/sk-code/ROUTER.md:309] identifies the prose-to-machine router projection.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R4-P2-001 [P2] Doctor probe output does not preserve custom prompts as a replayable command

- Case: a caller supplies a custom --prompt containing an embedded quote or shell expansion, then copies the reported probe command to reproduce a result.
- File: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139]
- Evidence: the display command interpolates raw prompt text inside double quotes. The actual launch passes the prompt as an argv element, and report() prints the display string for both passing and failing probe rows.
- User impact: shell parsing can change or expand the prompt in the displayed command, so a failed route may not be reproducible from the report.
- Finding class: instance-only.
- Scope proof: the prompt-bearing display string and its paired run() call are local to the probe leg. The launched process receives argv, so this finding is limited to the human-facing replay text.
- Affected surfaces: /doctor:sk-code setup, compiled route probe.
- Risk score: 2, advisory only.
- Recommendation: render the command from shell-escaped argv or label the text as a diagnostic description that is not safe to copy.
- Claim: the report's probe command does not round-trip shell-sensitive custom prompt values.
- Evidence refs: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139], [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:140], [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:283], [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:287].
- Counterevidence sought: I checked whether the custom prompt is executed by the checker or only inserted into a display string. The child call receives argv and the report prints the display string.
- Alternative explanation: the command text may be a compact diagnostic label rather than a copyable shell command. It is formatted as a command next to each result.
- Final severity: P2.
- Confidence: 0.90.
- Downgrade trigger: remove this advisory if the report labels the string as illustrative and does not imply it is a replay command.

## Traceability Checks

This maintainability pass did not rerun the core spec_code or checklist_evidence protocols, or the skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability overlays. Iteration 3 recorded those checks as partial, and those statuses remain unchanged. The supplied review state says resource-map.md is absent, so the resource-map coverage gate remains skipped.

## Verdict

PASS for iteration 4. This pass found one P2 advisory and no P0 or P1 findings. The active P1 from iteration 2 remains in the findings registry and was not changed by this iteration.

## Next Dimension

Maintainability follow-up in iteration 5: inspect remaining high-churn setup and release surfaces without reopening the probe command-rendering finding.

Review verdict: PASS
