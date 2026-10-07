# Iteration 2: Failure-class taxonomy and report overlap

## Focus
Reconcile the phase 013 baseline with its detailed report, map failures to validator rule owners, and check whether rule totals represent distinct packets.

## Actions Taken
- Recounted folder headings and rule occurrences in the supplied baseline report with read-only rg and Python scans. The phase 013 spec says 2,046 packet failures plus 37 non-packet folders; the report has 2,083 headings. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:90]
- Read the validator registry and validation rules for FILE_EXISTS, LEVEL_MATCH, ANCHORS_VALID, FRONTMATTER_VALID, metadata integrity, document integrity, and template provenance. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:251] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:174] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:368]
- Read report details for archived paths, duplicate anchors, malformed frontmatter, missing required files, stale links, and missing template markers. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:90] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:10] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:59]

## Findings
1. **CONFIRMED** The phase 013 count reconciles: 2,046 failing packets plus 37 non-packet folders produces 2,083 report headings, matching the heading count from the baseline scan. This supports the report denominator, while rule totals remain occurrence counts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:90]
2. **CONFIRMED** The largest re-counted rule totals are METADATA_DISK_PATH_CONSISTENCY 2,898, ANCHORS_VALID 510, SPEC_DOC_INTEGRITY 417, SPEC_DOC_SUFFICIENCY 261, GRAPH_METADATA_CHILD_IDENTITY 260, GREP_CONVENTION 195, LEVEL_MATCH and FILE_EXISTS 180 each, GENERATED_METADATA_INTEGRITY 119, TEMPLATE_SOURCE 99, and FRONTMATTER_VALID 95. These are rule occurrences, not distinct packets. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:90] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:10] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60]
3. **CONFIRMED** A Level 2 folder with missing plan.md and tasks.md triggers both FILE_EXISTS and LEVEL_MATCH for the same defect; the registry assigns FILE_EXISTS to check-files.sh and LEVEL_MATCH to check-level-match.sh. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:251]
4. **CONFIRMED** Example reports tie failures to specific source classes: archived metadata fields retain pre-archive paths; duplicate anchors and orphaned closing anchors are structural; a moved markdown file can lose frontmatter and a relative link can point to a missing target; template-source markers are checked independently. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:90] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:10] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:2] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:18] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:334] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:344]

## Recommendations
| ID | recommendation | question answered | where it lives (file path) | effort | risk | files touched | evidence | standing |
|---|---|---|---|---|---|---|---|---|
| R2-01 | Emit both distinct affected-packet count and per-rule occurrence count in the strict-pass freshness report. Make it deterministic and read-only; reverse by removing the summary output; it cannot change packet content. | Q5 | .github/workflows/strict-pass-freshness-report.yml and its report generator | M | Low: reporting only, but a count-label error could mislead prioritization | strict-pass-freshness-report.yml; report generator | The baseline includes 2,046 failed packets and 37 non-packet folders, while detailed rules repeat the same missing-file issue under two rules. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] | INFERRED |

## Ruled Out
- Summing all per-rule counts to estimate distinct failing packets. One missing Level 2 document pair is reported under both FILE_EXISTS and LEVEL_MATCH. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083]

## Questions Answered
- None. Q2 is partially mapped; source producers and preventive controls remain to check.

## Questions Remaining
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- Q2: What causes each validation failure class at the source, and how do we stop new instances?
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

## Sources Consulted
- specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md (working tree) [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60]
- .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:302]
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:368]
- /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:90]
- specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:60]

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q2 and Q5.
- Questions answered: none.

## Reflection
- The report's heading count and the phase 013 packet totals reconcile, but the rule counts overlap and must remain separate from packet counts. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:60]
- One folder's duplicate anchor creates both anchor-integrity and sufficiency diagnostics, so later work must trace the first failure rather than treating each diagnostic as an independent repair. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:10] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:12]

## Recommended Next Focus
Trace rule failures to their producer files: archive path updates, template anchor generation, document link/source handling, and level scaffolding. Then separate safe automatic fixes from cases requiring human review. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:302] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:100]

