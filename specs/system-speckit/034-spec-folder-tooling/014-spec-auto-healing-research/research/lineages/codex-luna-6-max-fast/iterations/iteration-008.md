# Iteration 8: Pre-v4 layout detection and migration

## Focus
Identify how the current upgrader detects old repository layouts, what it can safely repair, and where that migration fits with release updates.

## Actions Taken
- Re-read the lead brief and inspected the legacy upgrader's root resolution, dry-run/apply flow, README contract, template migration policy, and doctor update router. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:37] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:131] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:22] [SOURCE: .skilled/commands/doctor/update.md:35]

## Findings
1. **CONFIRMED** The legacy upgrader resolves roots to real paths and explicitly detects a tree whose real home is .opencode/specs. It exits before writes and prints manual move and compatibility-symlink commands; the README describes this as the v3.x layout. This is a structural layout check, not a version-marker check, and the path move remains a user task today. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:131] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:151] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:157] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113]
2. **CONFIRMED** The packet upgrader is dry by default, refuses an apply when any packet could not be validated, repairs only failing active packets, and leaves archived packets unrewritten. It adds absent frontmatter keys without replacing existing values, then runs document and derived-metadata repair before recording residual findings in upgrade-baseline.json. The baseline turns only recorded findings into warnings, so this last step needs a visible report and deliberate acceptance. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:307] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:491] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:493] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:486] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113]
3. **CONFIRMED** The migration guide requires indefinite read support for v2.1 template markers and current-version markers for new writes, and says not to rewrite old packets only to normalize markers. The doctor update router exposes release check, align, apply, rollback, and record-base actions; it has no spec-layout or corpus-migration action. Therefore marker age alone is not sufficient evidence to migrate a repository. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:27] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] [SOURCE: .skilled/commands/doctor/update.md:10] [SOURCE: .skilled/commands/doctor/update.md:35] [SOURCE: .skilled/commands/doctor/update.md:68]

## Recommendations
| ID | recommendation | question answered (Q1 to Q5) | where it lives (file path) | effort (S under a day, M one to three days, L more) | risk (Low, Med or High, with the reason) | files touched | evidence | standing (CONFIRMED or INFERRED) |
|---|---|---|---|---|---|---|---|---|
| R8-01 | Add a layout-migration mode beside upgrade-legacy that previews real paths, symlinks, collisions, and the exact move; only apply after the preview is accepted, preserve a compatibility symlink, and save a rollback map. Repeated scans are idempotent; after apply, a second run is a no-op; reverse by replaying the saved path map or reverting the migration commit. It changes paths and symlinks but does not edit document prose or metadata. | Q3 | .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs | M | Med: incorrect symlink or collision handling could hide or strand a specs tree | upgrade-legacy.mjs; focused tests; README.md | The current root resolver stops at the v3 layout and prints manual move commands instead of executing a previewable migration. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:151] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:157] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:161] | INFERRED |
| R8-02 | Extend doctor update check to report a detected legacy layout and the upgrade-legacy dry-run summary, then route to a distinct migrate-specs action after current tooling is installed. Keep release apply from changing specs implicitly; require explicit migration approval and retain a rollback record. Checks and plans are idempotent; apply is idempotent after success; reverse from the recorded rollback. Migration changes paths and listed metadata only, never authored prose. | Q3 | .skilled/commands/doctor/update.md | M | Med: combining release and corpus state could confuse rollback unless migration has a separate run record | doctor/update.md; doctor-update-check.yaml; doctor-update-apply.yaml; presentation; release-update.cjs | The current router has only release actions, and apply owns release-file updates and rollback; no spec migration is routed. [SOURCE: .skilled/commands/doctor/update.md:35] [SOURCE: .skilled/commands/doctor/update.md:68] | INFERRED |
| R8-03 | Keep historical template markers as read-only provenance. Detect migration need from physical layout and strict structural findings; never stamp a current marker onto an old or markerless document unless exact history proves it. This guard is idempotent and reversible by reverting the guard code; it does not change document content. | Q3 | .skilled/skills/system-spec-kit/templates/MIGRATION.md | S | Low: conservative detection may leave some legacy packets needing a manual review | MIGRATION.md; upgrade-legacy.mjs; focused tests | The migration contract explicitly preserves old marker reads and forbids rewriting packets only to normalize markers. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] | CONFIRMED |

## Ruled Out
- Using an old or absent template-source marker by itself as proof that the whole repository needs migration. The documented policy keeps legacy markers readable indefinitely and treats marker normalization as unnecessary churn. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]

## Questions Answered
- Q3 is partially answered: the current upgrader detects the v3 physical layout and safely previews packet repairs, but its path move is manual and doctor update does not expose corpus migration.

## Questions Remaining
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- Q2: What causes each validation failure class at the source, and how do we stop new instances?
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

## Sources Consulted
- specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:37]
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:151]
- .skilled/skills/system-spec-kit/runtime/cli/spec/README.md [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113]
- .skilled/skills/system-spec-kit/templates/MIGRATION.md [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24]
- .skilled/commands/doctor/update.md [SOURCE: .skilled/commands/doctor/update.md:35]

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q3.
- Questions answered: none; Q3 remains partial pending a complete old-format and doctor-update design.

## Reflection
- The migration boundary is clearer when path-layout migration, document repair, and release update are separate operations with linked previews and rollback evidence. The current code supports dry-run packet repair but asks the operator to move a v3 tree manually. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:151] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:161]
- Historical template markers are provenance, not an adequate repository-version signal, because the migration guide promises indefinite read support and says marker normalization should not rewrite old packets. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]

## Recommended Next Focus
Inspect the remaining old-format signatures and distinguish repairable generated metadata from authored packet content, including archive policy and baseline warnings. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:493] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:113]
