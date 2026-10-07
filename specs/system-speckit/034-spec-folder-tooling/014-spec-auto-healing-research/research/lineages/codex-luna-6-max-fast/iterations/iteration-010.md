# Iteration 10: Release update and migration transaction boundaries

## Focus
Determine whether spec migration can safely share /doctor:update check, apply, and rollback, then define a low-friction handoff.

## Actions Taken
- Re-read the lead brief and inspected the check and apply workflow mutation boundaries, release engine path ownership, plan digest, and rollback validation. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:95] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:83] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2389]

## Findings
1. **CONFIRMED** /doctor:update check allows no checkout writes; its only mutation exception fetches release commits into Git storage and FETCH_HEAD. This gives the check workflow room for a read-only compatibility scan, but not an automatic migration. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:67] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:73]
2. **CONFIRMED** The release engine inventories committed and indexed files under .skilled, owns paths below .skilled units, and requires every release write to appear in the exact dry-run plan. Its rollback rejects paths outside the release plan's units. A specs/ tree move or corpus repair cannot safely be included in the current release apply transaction or its rollback. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:343] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1725] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:83] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2389]
3. **CONFIRMED** The release apply flow previews its complete write set, checks a digest, writes rollback.json before the first target file, and limits rollback to release records and paths inside the plan's units. **INFERRED** The least surprising integration is for doctor update check to show a read-only compatibility result and offer a separate, explicitly approved migration transaction after current tooling is installed; verify by testing the future workflow against a dirty specs tree and a partial migration rollback. [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:112] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:124] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:137] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2140] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2184] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391]

## Recommendations
| ID | recommendation | question answered (Q1 to Q5) | where it lives (file path) | effort (S under a day, M one to three days, L more) | risk (Low, Med or High, with the reason) | files touched | evidence | standing (CONFIRMED or INFERRED) |
|---|---|---|---|---|---|---|---|---|
| R10-01 | Add a read-only compatibility preflight to doctor update check that detects the legacy root layout and runs the legacy packet scan when available; report whether a tool update is needed before migration. The scan is idempotent and reversible by reverting the probe; it does not alter document content. | Q3 | .skilled/commands/doctor/assets/doctor-update-check.yaml | M | Low: a large corpus scan may increase check time or report unknown for unreadable legacy data | doctor-update-check.yaml; doctor-update.md; compatibility probe; focused tests | The check workflow explicitly forbids checkout writes and already renders per-unit status and next steps, while the current release engine is scoped to .skilled. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:127] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] | INFERRED |
| R10-02 | Keep migration as a distinct action and transaction with its own dry-run plan, approval, backup or path map, and rollback record. Let doctor update check route to it, but do not put specs/ in the release engine's write set or reuse release rollback. Repeated migration is a no-op; reverse from the migration's own record or Git revert; layout moves change paths and approved metadata only, never authored prose. | Q3 | .skilled/commands/doctor/update.md | M | Med: a second transaction and state record require clear user-facing recovery instructions | doctor/update.md; dedicated migration workflow and engine; upgrade-legacy.mjs; presentation; README.md | Release rollback only accepts paths owned by the release plan, and its current unit inventory and path ownership are rooted at .skilled. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1725] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391] | INFERRED |

## Ruled Out
- Adding specs/ migration writes to the current release-update apply plan and relying on release rollback. The current updater inventories .skilled and rejects rollback paths outside its release units. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391]
- Running a spec migration from doctor update check. Its contract allows no checkout writes and check has no persisted run record. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:77]

## Questions Answered
- Q3 is answered at the workflow-boundary level: use a read-only check for detection and handoff, then a separate dry-run-first migration transaction with its own approval and rollback. The exact layout migration and frontmatter evidence tiers remain implementation requirements.

## Questions Remaining
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- Q2: What causes each validation failure class at the source, and how do we stop new instances?
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

## Sources Consulted
- specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:95]
- .skilled/commands/doctor/assets/doctor-update-check.yaml [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65]
- .skilled/commands/doctor/assets/doctor-update-apply.yaml [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:137]
- .skilled/commands/doctor/scripts/release-update.cjs [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338]
- .skilled/commands/doctor/scripts/release-update.cjs [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391]

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q3.
- Questions answered: Q3.

## Reflection
- The updater's strong path and rollback boundaries are useful, but they are deliberately about installing a release. Reusing those guarantees for corpus migration would require separate scope, plan, and recovery artifacts rather than widening the current release engine. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391]
- A read-only compatibility signal in check can reduce discovery work without weakening the release transaction boundary. Migration itself should remain a separate approved operation. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/update.md:68]

## Recommended Next Focus
Inspect template phrase cleanup, the healer defaults, and the migration sequence to find whether a cleanup can be undone by a later legacy-upgrade step. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:42]
