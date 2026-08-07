# Iteration 001 - Correctness

## State Summary

- Iteration: 1 of 7
- Focus dimension: correctness
- Files reviewed:
  - `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`
  - `.opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md`
  - `.opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md`
  - `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
  - `.opencode/skills/sk-code/SKILL.md`
  - `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`
  - `.opencode/hooks/pre-commit`
  - `.github/workflows/comment-hygiene.yml`

## Findings

### F001 - P1 - Comment TODO guidance contradicts the no-ticket rule and the checker does not enforce ticket ids

The universal OpenCode checklist says code comments must not contain ticket ids, but the same checklist later says TODOs may use an owner or ticket number and gives `TODO(TICKET-123)` as the good example. The Python checklist repeats the ticket-number TODO example, and the shell checklist repeats the "owner or ticket number" rule. The enforcement script's violation patterns cover packet, phase, ADR, requirement, checklist, task, spec-path, worktree-session and deep-review references, but they do not include ticket or issue ids. That leaves authors with conflicting standards and lets one forbidden class pass the documented gate.

Evidence:

- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:75] forbids ticket ids in comments.
- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:148] requires TODO context as owner or ticket number.
- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:158] gives a username TODO example.
- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:159] gives a ticket-number TODO example.
- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md:223] requires owner or ticket number for TODOs.
- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/python_checklist.md:229] gives a ticket-number TODO example.
- [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md:202] requires owner or ticket number for TODOs.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:85] begins the checker violation-pattern list.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:97] ends that list without a ticket or issue-id pattern.

Concrete fix: pick one policy. Under the current constitutional direction, remove ticket-number TODO examples from the checklists and add ticket/issue-id patterns to `check-comment-hygiene.sh`, or explicitly narrow the ban so tickets are allowed in TODO owner slots.

Claim adjudication:

```json
{
  "findingId": "F001",
  "claim": "sk-code forbids ticket ids in comments while recommending ticket-number TODO comments, and the checker does not enforce the ticket-id ban.",
  "evidenceRefs": [
    ".opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:75",
    ".opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:148",
    ".opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:159",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:85",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:97"
  ],
  "counterevidenceSought": "Checked the Python and shell checklists for consistency, and checked the checker violation-pattern list for ticket/issue patterns.",
  "alternativeExplanation": "The checklist may intend ticket ids to be allowed only in TODO owner slots, but that exception is not stated next to the P0 ban and the checker does not encode it.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade if the canonical policy is amended to explicitly allow ticket ids in TODO owner slots and the checker behavior is documented as intentional.",
  "transitions": []
}
```

### F002 - P2 - sk-code names the wrong Claude hook path in its enforcement summary

The sk-code workflow says the Claude Code write-time gate is `scripts/hooks/claude-posttooluse.sh`, but the checked-in hook script is under `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` and the hook's own setup snippet points to that skill-local path. This does not prove enforcement is broken, but it is stale operator-facing documentation in the main skill contract.

Evidence:

- [SOURCE: .opencode/skills/sk-code/SKILL.md:216] names `scripts/hooks/claude-posttooluse.sh` as the write-time warning hook.
- [SOURCE: .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:3] identifies the checked-in Claude Code PostToolUse hook.
- [SOURCE: .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:13] shows the skill-local hook path in the hook entry command.

Concrete fix: update the sk-code enforcement summary to the skill-local hook path, or add the missing root-level wrapper if the shorter path is meant to be canonical.

## Adversarial Self-Check

No P0 findings were reported. The P1 claim was rechecked against the exact checklist lines and the checker pattern list. The strongest counterargument is that ticket ids may be intended as a TODO-specific exception, but the current rule text does not state that exception and the same checklist presents the ban as a P0 hard blocker.

## Iteration Metrics

| Metric | Value |
|---|---:|
| New P0 | 0 |
| New P1 | 1 |
| New P2 | 1 |
| Severity-weighted new findings | 6 |
| newFindingsRatio | 1.00 |

Review verdict: CONDITIONAL
