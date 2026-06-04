# Iteration 004 - Maintainability

Focus: sk-doc and sk-code standards drift.

## Files Reviewed

- `.opencode/skills/sk-doc/references/global/core_standards.md`
- `.opencode/skills/sk-doc/references/global/quick_reference.md`
- `.opencode/skills/sk-doc/assets/template_rules.json`
- `.opencode/skills/sk-doc/scripts/validate_document.py`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`
- `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`
- `.opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py`

## Findings

### F004 - P1 - sk-doc command requirements are split across three incompatible contracts

`core_standards.md` says command files are blocked when they miss INPUTS, WORKFLOW, and OUTPUTS [SOURCE: .opencode/skills/sk-doc/references/global/core_standards.md:113]. Later in the same file it says command required sections are Purpose, Contract, Instructions, and Example Usage [SOURCE: .opencode/skills/sk-doc/references/global/core_standards.md:239]. The quick reference repeats Purpose, Contract, Instructions, and Example Usage as required [SOURCE: .opencode/skills/sk-doc/references/global/quick_reference.md:125].

The machine-readable rule JSON only requires `purpose` and `instructions`, while `contract` and examples are recommended rather than required [SOURCE: .opencode/skills/sk-doc/assets/template_rules.json:111]. The validator uses that `requiredSections` array directly [SOURCE: .opencode/skills/sk-doc/scripts/validate_document.py:408].

Impact: a command can pass the validator while missing sections that sk-doc prose says are required, and maintainers have three conflicting contracts to choose from. This is exactly the standards drift the review slice asks to find.

Fix: pick one command contract and align `core_standards.md`, `quick_reference.md`, `command_template.md`, `template_rules.json`, and validator tests around it.

### F005 - P2 - Default sk-code alignment verification can pass warning-only P0 checklist gaps

`sk-code` says Phase 1.5 applies P0/P1/P2 checks before claiming implementation done [SOURCE: .opencode/skills/sk-code/SKILL.md:41], and its OPENCODE verification command is `verify_alignment_drift.py --root <changed-scope>` without `--fail-on-warn` [SOURCE: .opencode/skills/sk-code/SKILL.md:192].

The universal checklist labels file headers as P0 hard blockers and says the verifier checks marker-level headers [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:28] [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:45]. The verifier, however, only fails on ERROR findings or warnings with `--fail-on-warn` [SOURCE: .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:456], and its tests assert that warning-only output exits 0 by default [SOURCE: .opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py:120].

Impact: this is not a hidden runtime bug because the alignment reference documents warning-only behavior. It is still a standards drift: the top-level completion contract can look satisfied while P0 checklist items remain as non-blocking warnings.

Fix: make the top-level OPENCODE verification contract say when `--fail-on-warn` is required, or downgrade header checklist wording from P0 where the default verifier intentionally treats it as advisory.

## Claim Adjudication Packet

```json
{
  "findingId": "F004",
  "claim": "sk-doc documents incompatible required command sections, and the validator enforces only the weakest variant.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/references/global/core_standards.md:113",
    ".opencode/skills/sk-doc/references/global/core_standards.md:239",
    ".opencode/skills/sk-doc/references/global/quick_reference.md:125",
    ".opencode/skills/sk-doc/assets/template_rules.json:111",
    ".opencode/skills/sk-doc/scripts/validate_document.py:408"
  ],
  "counterevidenceSought": "Checked command template and validator section lookup for a single authoritative contract.",
  "alternativeExplanation": "The stricter prose may be aspirational, but it is labeled required and blocking in reference docs.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade if docs are updated to mark contract/example sections as recommended rather than required."
}
```

Review verdict: CONDITIONAL
