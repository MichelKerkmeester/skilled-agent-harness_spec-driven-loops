# Iteration 003 - Traceability

Focus: feature catalog code references and manual playbook capability checks.

## Files Reviewed

- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/feature-catalog-annotation-name-validity.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md`

## Findings

### F002 - P1 - Annotation-name validity scenario uses the wrong-case catalog filename

Scenario 136 tells operators to extract H3 headings from `feature_catalog/FEATURE_CATALOG.md`. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/feature-catalog-annotation-name-validity.md:38]

The package root is the lower-case `feature_catalog.md`; exact-case discovery finds no `FEATURE_CATALOG.md` entry. This may pass on case-insensitive macOS but fails on case-sensitive environments. The root catalog title confirms the lower-case file is the canonical root. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:13]

Recommendation: update scenario 136 and root playbook snippets to use `feature_catalog/feature_catalog.md`.

### F003 - P1 - MODULE header compliance scenario invokes the verifier from a stale path

Scenario 138 runs `python3 ../sk-code/scripts/verify_alignment_drift.py --root .`. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38]

The sk-code verification contract uses `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`. [SOURCE: .opencode/skills/sk-code/SKILL.md:192]

The sk-code alignment reference repeats the `assets/scripts` path. [SOURCE: .opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md:22]

Observed command result: the stale path fails with file-not-found from the documented working directory; the canonical path reports PASS.

Recommendation: update scenario 138 and linked catalog rows to the canonical `assets/scripts` verifier path.

### F005 - P2 - Representative implementation row cites a file that does not actually carry a feature annotation

The source table says `mcp_server/handlers/index.ts` is a representative handler showing both MODULE and Feature catalog conventions. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:40]

The file opens with a MODULE header, imports, and loader code; the sampled header has no `// Feature catalog:` annotation. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/index.ts:1]

Recommendation: point the row at an annotated handler or narrow the row to MODULE-only representation.

## Claim Adjudication

```yaml
findingId: F002
claim: The annotation-name validity scenario is not portable as documented because it uses the wrong-case catalog filename.
evidenceRefs:
  - .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/feature-catalog-annotation-name-validity.md:38
  - .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:13
counterevidenceSought: Searched exact-case filenames and checked the actual feature catalog root.
alternativeExplanation: The command likely references an earlier package filename; macOS case-insensitivity can mask the issue locally.
finalSeverity: P1
confidence: 0.93
downgradeTrigger: Downgrade if a cross-platform compatibility alias exists or the scenario is corrected.
```

```yaml
findingId: F003
claim: The module-header compliance scenario is not executable as documented because it invokes a stale verifier path.
evidenceRefs:
  - .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38
  - .opencode/skills/sk-code/SKILL.md:192
  - .opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md:22
counterevidenceSought: Checked sk-code script locations and ran the stale and canonical verifier paths.
alternativeExplanation: The verifier moved from scripts to assets/scripts and this scenario was not refreshed.
finalSeverity: P1
confidence: 0.96
downgradeTrigger: Downgrade if the old path is restored as a compatibility wrapper or the scenario is updated.
```

## Protocol Results

- `spec_code`: pass for representative read-only slice.
- `checklist_evidence`: pass, not applicable because no checklist exists.
- `feature_catalog_code`: partial due F001 and F005.
- `playbook_capability`: partial due F002 and F003.

## Verdict Rationale

P1 findings present. No P0 found.
Review verdict: CONDITIONAL
