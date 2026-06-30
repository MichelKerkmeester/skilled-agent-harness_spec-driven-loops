# Iteration 003: Traceability

## Focus
Dimension: traceability.

Reviewed sk-doc guidance against current Spec Kit templates, active spec packets and shipped sk-doc playbook examples.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.38

## Findings

### P0 Findings
None.

### P1 Findings
- **F003**: sk-doc tells agents to remove spec YAML frontmatter that Spec Kit templates now require — `.opencode/skills/sk-doc/assets/frontmatter_templates.md:400` — the sk-doc frontmatter guide says specs use inline metadata instead of YAML and later says spec frontmatter should be removed or suggested for removal. Current Spec Kit templates and active packet specs begin with YAML frontmatter containing title, description, trigger phrases and continuity metadata. [SOURCE: .opencode/skills/sk-doc/assets/frontmatter_templates.md:400] [SOURCE: .opencode/skills/sk-doc/assets/frontmatter_templates.md:685] [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:2] [SOURCE: .opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:1] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:1]

### P2 Findings
- **F004**: sk-doc filename standards still require snake_case despite hyphenated shipped docs — `.opencode/skills/sk-doc/references/global/core_standards.md:31` — sk-doc says all `.md` filenames should be lowercase snake_case and hyphens should be converted to underscores, while the current manual playbook package includes hyphenated filenames and `validate_document.py --fix --dry-run` reports the representative file valid with no fixes. [SOURCE: .opencode/skills/sk-doc/SKILL.md:47] [SOURCE: .opencode/skills/sk-doc/references/global/core_standards.md:31] [SOURCE: .opencode/skills/sk-doc/references/global/core_standards.md:35] [SOURCE: .opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/markdown-agent-cli-codex.md:1] [SOURCE: .opencode/skills/sk-doc/scripts/validate_document.py:466]

## Claim Adjudication
```json
{
  "findingId": "F003",
  "claim": "sk-doc's frontmatter guide says specs use inline metadata instead of YAML and should have frontmatter removed, but current Spec Kit templates and active packets begin with YAML frontmatter carrying title, description and trigger phrases.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/assets/frontmatter_templates.md:400",
    ".opencode/skills/sk-doc/assets/frontmatter_templates.md:685",
    ".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:2",
    ".opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:1",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:1"
  ],
  "counterevidenceSought": "Checked sk-doc core standards, frontmatter templates, current system-spec-kit manifest templates, example templates, and the active audit spec. The current Spec Kit surfaces use YAML frontmatter for routing metadata.",
  "alternativeExplanation": "The sk-doc guidance may be old generic markdown advice, but it is still shipped as an active frontmatter decision tree and can be loaded by sk-doc.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if sk-doc narrows this rule to non-Spec-Kit external specs or updates the decision tree to preserve Spec Kit frontmatter.",
  "transitions": [
    {
      "iteration": 3,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:39 | Requested drift audit has confirmed actionable sk-doc/sk-code/governance drift. |
| checklist_evidence | pass | hard | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:84 | Level 1 slice has no checklist.md, so no checked claims are unsupported. |
| feature_catalog_code | partial | advisory | .opencode/skills/sk-code/SKILL.md:216 | sk-code standards claim a manual quality command that does not execute as written. |
| playbook_capability | partial | advisory | .opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/markdown-agent-cli-codex.md:1 | Shipped playbook files contradict old filename prose. |

## Assessment
- New findings ratio: 0.38
- Dimensions addressed: traceability
- Novelty justification: Found one required sk-doc/spec-kit contradiction and one advisory filename-standard drift.

## Ruled Out
- "Spec frontmatter is isolated to this audit file": ruled out by the manifest spec template and Level 1 example spec. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:2] [SOURCE: .opencode/skills/system-spec-kit/templates/examples/level_1/spec.md:1]
- "Filename rule is enforced by validate_document.py": not supported; the fix path applies content-line fixes and the representative hyphenated file validates cleanly. [SOURCE: .opencode/skills/sk-doc/scripts/validate_document.py:466]

## Dead Ends
- README frontmatter also has conflicting guidance, but the spec-frontmatter contradiction is the higher-risk instance and subsumes the active remediation lane.

## Recommended Next Focus
Maintainability pass over sk-code verification noise and whether the comment-hygiene command mismatch creates recurring false positives.
Review verdict: CONDITIONAL
