# Iteration 003 - Traceability

## State Summary

- Iteration: 3 of 7
- Focus dimension: traceability
- Active findings entering iteration: P0:0 P1:2 P2:1
- Files reviewed:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md`
  - `.opencode/skills/sk-doc/assets/template_rules.json`
  - `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
  - `.opencode/skills/sk-doc/assets/readme/readme_template.md`
  - `.opencode/skills/sk-doc/assets/changelog_template.md`
  - `.opencode/skills/sk-doc/SKILL.md`

## Cross-Reference Protocol Results

### spec_code

Status: partial. Gate: hard.

The slice spec requires auditing constitutional rules versus enforcement and sk-doc/sk-code standards drift. The first two iterations produced governance/sk-code enforcement findings, and this iteration adds a sk-doc template-rule drift finding. The protocol remains partial rather than pass because active P1 findings mean the implementation surface does not yet conform to the standards it documents.

Evidence:

- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:37] states the audit problem.
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:40] requires reporting unenforced rules, contradictions and standards drift.
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:52] includes constitutional rules in scope.
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:53] includes sk-doc in scope.
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:54] includes sk-code in scope.
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:84] requires constitutional enforcement evidence.
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:85] requires sk-doc/sk-code drift evidence.

### checklist_evidence

Status: pass. Gate: hard. Applicable: false.

No `checklist.md` exists in this Level 1 slice packet, so there are no checked completion claims to verify. This is recorded as a skipped-applicable protocol rather than a missing review action.

### feature_catalog_code

Status: pass. Gate: advisory. Applicable: false.

No feature catalog file was in this slice's declared review scope.

### playbook_capability

Status: partial. Gate: advisory. Applicable: true.

The reviewed sk-doc assets include testing playbook templates, but this iteration focused on section-rule drift. No playbook executable capability finding was produced.

## Findings

### F004 - P1 - sk-doc's machine-readable skill rules omit the `REFERENCES` section that its own template says packaging requires

`template_rules.json` defines required sections for `skill` documents as `when_to_use`, `smart_routing`, `how_it_works`, and `rules`. The sk-doc SKILL template says `REFERENCES` is required, and its packaging note says `package_skill.py` fails when `REFERENCES` is missing unless an approved combined `SMART ROUTING & REFERENCES` structure exists. A validator that follows `template_rules.json` can accept a skill structure that the authoring template says packaging rejects.

Evidence:

- [SOURCE: .opencode/skills/sk-doc/assets/template_rules.json:62] starts the `skill` document type rules.
- [SOURCE: .opencode/skills/sk-doc/assets/template_rules.json:64] starts the skill `requiredSections` list.
- [SOURCE: .opencode/skills/sk-doc/assets/template_rules.json:68] ends that required list at `rules`, without `references`.
- [SOURCE: .opencode/skills/sk-doc/assets/skill/skill_md_template.md:112] says `REFERENCES` or the approved combined structure is required.
- [SOURCE: .opencode/skills/sk-doc/assets/skill/skill_md_template.md:114] introduces the packaging enforcement note.
- [SOURCE: .opencode/skills/sk-doc/assets/skill/skill_md_template.md:115] says packaging fails if `REFERENCES` is missing and no approved combined structure exists.

Concrete fix: align `template_rules.json` with the skill template by requiring `references` or explicitly modeling the approved combined `smart_routing_references` alias as satisfying the reference requirement.

Claim adjudication:

```json
{
  "findingId": "F004",
  "claim": "sk-doc's machine-readable skill document rules omit a reference-section requirement that the skill template says package_skill.py enforces.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/assets/template_rules.json:62",
    ".opencode/skills/sk-doc/assets/template_rules.json:64",
    ".opencode/skills/sk-doc/assets/template_rules.json:68",
    ".opencode/skills/sk-doc/assets/skill/skill_md_template.md:112",
    ".opencode/skills/sk-doc/assets/skill/skill_md_template.md:115"
  ],
  "counterevidenceSought": "Checked the skill document type aliases and the SKILL template's packaging note for an alternate combined-section allowance.",
  "alternativeExplanation": "The machine validator may intentionally check only a minimal core shape, but the asset description says the JSON rules are aligned with all templates and the template describes packaging as stricter.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if package_skill.py no longer enforces references, or if template_rules.json is documented as a non-packaging precheck with intentionally weaker requirements.",
  "transitions": []
}
```

## Adversarial Self-Check

No P0 findings were reported. The P1 stays active because the two sk-doc assets describe the same document type with conflicting required-section surfaces.

## Iteration Metrics

| Metric | Value |
|---|---:|
| New P0 | 0 |
| New P1 | 1 |
| New P2 | 0 |
| Severity-weighted new findings | 5 |
| newFindingsRatio | 0.31 |

Review verdict: CONDITIONAL
