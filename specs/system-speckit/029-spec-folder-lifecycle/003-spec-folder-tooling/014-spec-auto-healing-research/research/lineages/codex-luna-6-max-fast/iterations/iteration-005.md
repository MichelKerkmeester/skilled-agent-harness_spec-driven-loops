# Iteration 5: Template provenance and legacy markers

## Focus
Determine whether older template versions themselves fail validation, and trace missing source markers through the validator, scaffold finalizer, staleness checker, and migration contract.

## Actions Taken
- Re-read the lead's steer file before this iteration and checked a concrete `TEMPLATE_SOURCE` failure from the baseline report. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:55] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:17]
- Read the marker validator, staleness checker, template migration guide, current core template marker, and `create.sh` marker placement helper. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:64] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:22] [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:35] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:790]

## Findings
1. **CONFIRMED** `TEMPLATE_SOURCE` checks only whether the marker string appears within the first 60 lines of each existing contract document; it does not compare the marker version. The migration guide says v2.1 markers remain supported indefinitely, so an older marker version alone is not a validation failure; the baseline example fails because `resource-map.md` has no marker. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:63] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:46] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:17]
2. **CONFIRMED** `create.sh` only relocates a template-source marker when one already exists; it returns successfully when absent. The current core spec template includes a v2.2 marker, but a markerless source template is not repaired or rejected by this helper, and full post-create validation is opt-in. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:790] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:794] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:795] [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:35] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1225]
3. **CONFIRMED** `check-template-staleness.sh` reports a missing marker as `none`, but its auto-upgrade branch runs only for a present, stale version; it updates an existing version comment and does not add one to a markerless document. That avoids inventing historical provenance, but leaves markerless legacy documents unresolved by automation. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:165] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:169] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:171] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:181] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]

## Recommendations
| ID | recommendation | question answered | where it lives (file path) | effort | risk | files touched | evidence | standing |
|---|---|---|---|---|---|---|---|---|
| R5-01 | Add a fast source and rendered-output check that every current contract template emits a source marker in the validator's accepted range; keep the legacy version reader permissive. The check is read-only and idempotent; reverse by removing the check; it does not edit generated documents or their prose. | Q2, Q5 | .skilled/skills/system-spec-kit/runtime/cli/tests/template-structure.vitest.ts and current template-source tests | S | Low: an inaccurate fixture could block legitimate template maintenance | template-structure.vitest.ts; template-source tests | The generator silently accepts a missing marker, while the validator requires a marker and the current migration policy keeps older marked versions valid. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:795] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:63] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] | INFERRED |
| R5-02 | Keep markerless historical provenance explicitly unknown; do not auto-stamp the current template version. Have `/doctor:update` report the missing marker with a manual confirmation path, while a current-template check prevents new omissions. Repeated scans are read-only and idempotent; reverse the compatibility behavior by reverting the policy; no document is changed and no history is invented. | Q3 | .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh and .skilled/commands/doctor/update.md | M | Med: relaxing a strict failure can hide a genuinely recent omission unless new scaffolds are guarded separately | check-template-source.sh; doctor/update.md; template tests | The staleness checker distinguishes `none` but auto-upgrade edits only a present version comment; the migration guide forbids rewriting old packets merely to normalize marker style. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:165] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:181] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] | INFERRED |

## Ruled Out
- Treating every older marker version as a validation failure. The migration contract explicitly keeps v2.1 marker support indefinitely and current validation checks presence only. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56]
- Automatically assigning the current version to a markerless legacy document. The absent marker does not establish which template, if any, produced the file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]

## Questions Answered
- Q2 is partially answered: older marked versions are intentionally supported, while missing markers originate in markerless documents and a generator helper that does not require them.
- Q3 is partially answered: missing historical provenance should remain unknown unless independently established; version bumping is safe only when an existing marker is present.

## Questions Remaining
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- Q2: What causes each validation failure class at the source, and how do we stop new instances?
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

## Sources Consulted
- specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:55]
- .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56]
- .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:165]
- .skilled/skills/system-spec-kit/templates/MIGRATION.md [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24]
- .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:35]
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:790]
- /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:17]

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q2 and Q3.
- Questions answered: none; both remain partially answered.

## Reflection
- The phrase "old template version" conflates two cases. A present v2.1 marker is supported; a missing marker is the actual failure and cannot safely be upgraded by assigning v2.2 without evidence. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:63]
- A current-template regression check can prove new source templates contain markers, but it cannot establish the provenance of older external documents. The latter remains an explicit UNKNOWN unless repository history or an operator supplies evidence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167]

## Recommended Next Focus
Compare the one-off anchor, frontmatter, and description-path repairs with `repair-derived` and `heal-spec-docs.cjs` to assign each mechanical fix to a stable owner and preserve authored content. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:73]
