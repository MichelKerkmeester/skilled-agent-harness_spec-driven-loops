# Iteration 4: Maintainability and Moved Documentation

## Focus
Maintainability review of moved package READMEs, related links, registry metadata and operator playbooks.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 11 direct files
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.25

## Findings

### P1, Required
- **F007**: The committed scan helpers still embed a developer-specific absolute repository path. `.scan-one-fast.sh` hardcodes both the validator and spec roots, while `.scan-validate-all.py` hardcodes the same workstation root. These helpers are in the moved CLI tree and are intended to run from other checkouts. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/.scan-one-fast.sh:4-6] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/.scan-validate-all.py:7-8]

### P2, Suggestion
- **F008**: Several moved README related links still resolve as if the package were a sibling workspace. `continuity/README.md` links to `../../runtime/scripts/README.md`, and `spec-folder/README.md` and `kpi/README.md` link to a removed `../memory/README.md`. [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/continuity/README.md:212-217] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec-folder/README.md:134-139] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/kpi/README.md:87-92]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | implementation-summary.md:136-154; moved READMEs | File inventory says docs were corrected, but current moved docs retain topology residue. |
| checklist_evidence | partial | hard | tasks.md:157-169; README links | File organization and docs checks do not evidence link resolution. |
| feature_catalog_code | partial | advisory | runtime/cli README files | Package surface exists but internal wayfinding is stale. |
| playbook_capability | partial | advisory | manual playbook:52-116 | Evidence blocks still use retired paths. |

## Assessment
- New findings ratio: 0.25
- Dimensions addressed: maintainability
- Novelty justification: direct README link inspection found broken relative targets distinct from the broad root documentation findings.

## Ruled Out
- The current runtime mirror generator itself resolves its repository root from `__dirname`, so this finding is limited to the scan helpers. [SOURCE: runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:24-33]

## Dead Ends
- No documentation edits were made during review.

## Recommended Next Focus
Correctness replay of registry consumers, CI guard paths and committed scan helper behavior.

Review verdict: CONDITIONAL
