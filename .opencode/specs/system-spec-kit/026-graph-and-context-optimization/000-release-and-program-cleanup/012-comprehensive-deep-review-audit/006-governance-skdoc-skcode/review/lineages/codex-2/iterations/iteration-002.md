# Iteration 002 - Security

Focus: governance bypass risk in comment-hygiene enforcement.

## Files Reviewed

- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
- `.opencode/hooks/pre-commit`
- `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`

## Finding

### F002 - P1 - The hygiene-ok escape broadly bypasses an unconditional constitutional comment rule

The constitutional rule is unconditional: never embed ephemeral artifact pointers in code comments [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:34]. It only discusses bypass in the `--no-verify` case, where explicit user override and a documented reason are required [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:71].

The executable checker has a blanket suppression branch for any comment line containing `hygiene-ok` [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:108]. The script docstring advertises the same escape [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:12], the pre-commit message tells users to add it [SOURCE: .opencode/hooks/pre-commit:32], and the universal checklist repeats the escape as a standard step [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:253].

Impact: a forbidden comment can be locally exempted without a documented reason and without proving that the flagged token is durable. That contradicts the constitutional rule's enforcement posture and creates a governance bypass in the exact gate meant to prevent rot.

Fix: either remove the blanket escape or make it first-class in the constitutional rule with a narrow, auditable contract. If the escape remains, require a durable standard-body rationale, for example a stable external standard reference, and add tests showing that ordinary spec/ADR/REQ/finding pointers still fail.

## Claim Adjudication Packet

```json
{
  "findingId": "F002",
  "claim": "The checker and hook guidance allow a broad hygiene-ok suppression that bypasses the constitutional rule without the documented override requirements.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:34",
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:71",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:12",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:108",
    ".opencode/hooks/pre-commit:32",
    ".opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:253"
  ],
  "counterevidenceSought": "Checked sk-code checklist and hook README for a narrow documented false-positive policy.",
  "alternativeExplanation": "The escape may be intended for false positives, but the constitutional rule does not define that path and the checker accepts any hygiene-ok substring.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if the constitutional rule is updated to define a narrow audited exception and the checker enforces that exception shape."
}
```

Review verdict: CONDITIONAL
