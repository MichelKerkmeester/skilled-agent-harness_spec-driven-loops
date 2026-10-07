# Iteration 9: Inferred metadata versus recovered history

## Focus
Trace what the legacy upgrader inserts into old frontmatter and how its residual-finding baseline affects validation.

## Actions Taken
- Re-read the lead brief and traced fillMissingFrontmatter through the shared builder, then inspected baseline writing and validator application. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:44] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:313] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:442] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988]

## Findings
1. **CONFIRMED** The frontmatter migration fills only managed keys that are absent; when keys already exist, it splices only the new keys into the existing block, and malformed blocks are left unchanged. This protects authored existing values and body text for ordinary spec documents, but does not establish that newly supplied values are historical. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:313] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:325] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:344] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:350]
2. **CONFIRMED mechanism, INFERRED risk** The shared builder can create absent title and description values from headings, the first meaningful sentence, or the filename, and can generate trigger phrases from title tokens and document type. Missing importance and context values fall back to document-type defaults. These are deterministic indexing metadata, not recovered historical values; the check that would confirm suitability is exact comparison with a prior Git blob or a uniquely identified source template. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:957] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1026] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1216]
3. **CONFIRMED** After repair, upgrade-legacy records residual findings in upgrade-baseline.json; the validator changes a fully covered matching error to a warning, while unlisted details remain errors. Identical findings are not rewritten, and the baseline includes recordedBy and recordedAt. This is a validation-policy change, not a prose edit, so the dry-run report should show each exact error-to-warning transition. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:442] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:449] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:454] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1011]

## Recommendations
| ID | recommendation | question answered (Q1 to Q5) | where it lives (file path) | effort (S under a day, M one to three days, L more) | risk (Low, Med or High, with the reason) | files touched | evidence | standing (CONFIRMED or INFERRED) |
|---|---|---|---|---|---|---|---|---|
| R9-01 | Split metadata recovery into evidence tiers: restore a value automatically only from one exact prior Git blob or a uniquely identified literal template; otherwise show builder-inferred metadata as a proposal and label it generated, never as original history. Keep existing metadata and document bodies byte-identical. Repeated application is idempotent; reverse with the saved patch or Git revert; it changes only approved missing metadata and not prose meaning. | Q3 | .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs | M | Med: an incorrect document classification can affect indexing even when body prose stays intact | upgrade-legacy.mjs; frontmatter-migration.ts; focused tests; README.md | The builder derives missing values from headings, sentences, filenames, title tokens, and document-class defaults, while the caller filters out every already-present managed key. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1026] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:344] | INFERRED |
| R9-02 | Make the dry-run report enumerate every baseline entry that would change validation from error to warning, including rule and detail count; keep the existing explicit --apply boundary. The same finding set is a no-op on later runs; reverse by restoring or deleting only the recorded baseline file; it changes validation status for listed findings but does not change document prose. | Q3 | .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs | S | Med: accepting a broad baseline could hide long-lived quality debt unless the exact scope is visible | upgrade-legacy.mjs; presentation output; README.md; focused tests | The validator demotes only fully covered exact finding details and leaves unlisted details as errors; the writer avoids rewriting an identical findings list. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1011] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:449] | INFERRED |

## Ruled Out
- Treating builder-generated title, description, trigger phrases, or default classification as recovered historical metadata. The source derives them from present content and document type, not a historical template record. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1056]
- Treating every legacy validation finding as a pass without showing the baseline entries. The validator requires exact finding coverage and leaves unmatched details as errors. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001]

## Questions Answered
- Q3 is partially answered: existing metadata and prose are protected, but inferred missing metadata needs a provenance label and baseline downgrades need a visible preview.

## Questions Remaining
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- Q2: What causes each validation failure class at the source, and how do we stop new instances?
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

## Sources Consulted
- specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:44]
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:313]
- .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935]
- .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988]

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q3.
- Questions answered: none; Q3 remains partial pending root-layout migration and doctor-update handoff design.

## Reflection
- The upgrader has a useful non-overwrite boundary, but the provenance of a newly inferred field is not represented in the metadata itself. Exact historical restoration and inferred index metadata should therefore be distinct plan outcomes. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:344] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935]
- The baseline mechanism is narrowly matched and idempotent for an unchanged finding set, but it relaxes those exact errors into warnings. The preview should make that effect easy to inspect before apply. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:449] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1011]

## Recommended Next Focus
Inspect the release updater's plan and rollback boundaries to decide how a migration handoff can stay separate from release-file changes while minimizing burden for an older installation. [SOURCE: .skilled/commands/doctor/update.md:68] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2141]
