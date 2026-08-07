# Iteration 001 - Correctness

## Dispatcher

- Focus dimension: correctness
- Scope: feature catalog master, feature-specific code-reference catalog, root playbook release gate, MODULE-header playbook scenario.
- Method: direct reads plus executable shell checks for current file counts and verifier paths.

## Files Reviewed

- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`
- `.opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md`
- `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`

## Findings - New

### P1

- **F001**: Master catalog overstates feature annotation coverage as every source file - `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946` - The master catalog says traceability comments are embedded in "every source file" and that each file declares its feature catalog entry, but the feature-specific catalog entry says coverage is a measured majority, 192 of 280 non-test TypeScript files under `mcp_server/` and `shared/`. A fresh count across `mcp_server/`, `shared/`, and `scripts/` found 195 feature-annotated files out of 530 non-test `.ts` files. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:26]
- **F002**: Manual playbook deterministic count expects 380 files but current tree has 384 - `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166` - The root release-readiness rule says the playbook currently contains 380 scenario files and embeds a deterministic check that exits if the count is not 380. Running the same glob shape against the current tree returns 384, so the documented gate now fails even before scenario verdicts are evaluated. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:140] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166]
- **F003**: MODULE header scenario points to the old verifier path - `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38` - The scenario instructs operators to run `python3 ../sk-code/scripts/verify_alignment_drift.py --root .` after `cd .opencode/skills/system-spec-kit`, but that path does not contain the verifier; only `check-comment-hygiene.sh` and `hooks/` exist there. The live verifier is under `../sk-code/assets/scripts/verify_alignment_drift.py`, and the feature catalog entry also points at the old `.opencode/skills/sk-code/scripts/verify_alignment_drift.py` path. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:50] [SOURCE: .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:1]

### P2

- None.

## Claim Adjudication

```json
[
  {
    "findingId": "F001",
    "claim": "The master feature catalog overstates feature annotation coverage as universal.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:3946",
      ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:26"
    ],
    "counterevidenceSought": "Checked uppercase and lowercase catalog files, feature-specific code-reference entry, and current annotation counts.",
    "alternativeExplanation": "The master paragraph may intend only non-exempt implementation files, but it explicitly says every source file before the later exemption caveat.",
    "finalSeverity": "P1",
    "confidence": 0.87,
    "downgradeTrigger": "Downgrade if the master text is narrowed to measured or non-exempt implementation coverage and the count gate is updated."
  },
  {
    "findingId": "F002",
    "claim": "The root playbook deterministic count gate is stale against the current tree.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:140",
      ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166"
    ],
    "counterevidenceSought": "Ran the same `[0-9][0-9]--*/*.md` plus deprecated-folder count shape from the root playbook.",
    "alternativeExplanation": "The intended count may exclude README files, but the embedded script does not exclude them.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "Downgrade if the script is corrected to the intended scenario-only filter and the documented expected count matches it."
  },
  {
    "findingId": "F003",
    "claim": "The MODULE-header validation scenario is not executable as written because the verifier path moved.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/module-header-compliance-via-verify-alignment-drift-py.md:38",
      ".opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/feature-catalog-code-references.md:50",
      ".opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:1"
    ],
    "counterevidenceSought": "Listed `.opencode/skills/sk-code/scripts` from the scenario working directory and searched for `verify_alignment_drift.py` under `.opencode/skills`.",
    "alternativeExplanation": "A wrapper could be restored at the old path, but it is absent in the current tree.",
    "finalSeverity": "P1",
    "confidence": 0.95,
    "downgradeTrigger": "Downgrade once the playbook and catalog point at `../sk-code/assets/scripts/verify_alignment_drift.py` or a compatible wrapper exists."
  }
]
```

## Confirmed-Clean Surfaces

- `FEATURE_CATALOG.md` exists and is byte-identical to `feature_catalog.md`; uppercase/lowercase catalog naming is not itself a defect.
- The correct verifier path returns `[alignment-drift] PASS` with 0 findings.

## Next Focus

Security pass over playbook execution policy, destructive-scenario constraints, and validation-command trust boundaries.

Review verdict: CONDITIONAL
