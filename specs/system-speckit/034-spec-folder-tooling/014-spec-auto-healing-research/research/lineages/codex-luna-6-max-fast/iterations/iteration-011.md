# Iteration 11: Template phrase cleanup and legacy healer interaction

## Focus
Check whether the phrase cleanup, healer defaults, and legacy upgrade sequence agree on empty trigger-phrase fields.

## Actions Taken
- Re-read the lead brief and compared healer literals with the live templates, the cleanup's template-derived plan, and the legacy upgrade sequence. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:45] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs:123] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:290] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]

## Findings
1. **CONFIRMED** The healer's three literal trigger-phrase lists exactly match the current plan, tasks, and implementation-summary templates. The cleanup instead reads each default list from its template at runtime, so the current values agree, but the healer and shell seeder still duplicate the values as separate maintenance sources. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:45] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:18] [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:16] [SOURCE: .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl:16] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs:123]
2. **CONFIRMED** For an exact default block, phrase cleanup replaces it with a packet-specific seed; for a partial list containing custom phrases, it removes only the default entries and preserves the custom ones. The cleanup excludes archives by default and requires --include-archive to opt in. Thus its normal successful path does not empty these lists. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:125] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:183] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:306] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:326] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:381]
3. **CONFIRMED mechanism, INFERRED interaction risk** If a plan, tasks, or implementation-summary trigger list is already empty, the cleanup has no default entries to replace, while heal-spec-docs restores the hard-coded template list. upgrade-legacy invokes that healer with --apply. So the healer can reintroduce generic phrases into an already-cleaned or intentionally empty legacy packet, although the normal phrase-cleanup path seeds a nonempty packet-specific phrase first. Confirm by checking affected empty-list packets in a dry-run migration. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:306] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:134] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]

## Recommendations
| ID | recommendation | question answered (Q1 to Q5) | where it lives (file path) | effort (S under a day, M one to three days, L more) | risk (Low, Med or High, with the reason) | files touched | evidence | standing (CONFIRMED or INFERRED) |
|---|---|---|---|---|---|---|---|---|
| R11-01 | Make the empty-list healer use the same packet-specific seeding function as create and phrase cleanup, with dry-run output showing old and new rows. A repeated run is idempotent; reverse through the saved diff or Git revert; only trigger metadata changes, not body prose. | Q1, Q4 | .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs | M | Med: a wrong slug or document kind changes retrieval terms | heal-spec-docs.cjs; shared phrase seeder; create.sh; template-phrase-cleanup.mjs; focused tests | The cleanup computes seeds from packet slug and description, while the healer restores fixed template phrases whenever a supported field is empty. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:104] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:125] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] | INFERRED |
| R11-02 | Keep archive phrase changes explicit and separately previewed. Do not reseed during archive or restore until the archive policy is reconciled; the default cleanup is live-only, while legacy upgrade treats snapshots as frozen and phase 013 includes archived repair. Repeated opted-in cleanup is idempotent; reverse from its before/after hashes or Git revert; it changes indexing metadata only. | Q1, Q4 | .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs | S | Med: archive edits can alter a historical snapshot and conflict with frozen-snapshot consumers | template-phrase-cleanup.mjs; archive.sh; upgrade-legacy.mjs; phase 013 repair contract | Cleanup excludes archives unless explicitly included; upgrade-legacy says archived snapshots are only recorded; phase 013 says its repair scope includes live and archived packets. This policy conflict is unresolved. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59] | INFERRED |

## Ruled Out
- Treating the phrase-cleanup tool as the sole source of empty-list behavior. A later legacy upgrade runs heal-spec-docs and can restore literal defaults to any already-empty supported field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]
- Automatically reseeding archives during archive or restore while the phase 013 live-and-archived repair scope conflicts with the upgrader's frozen-snapshot contract. Record the conflict and keep archive mutation opt-in until one policy is selected. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]

## Questions Answered
- Q1 is partially answered: phrase cleanup belongs in the document healer/seeder path, but its empty-list behavior should share one packet-specific seeding function.
- Q4 is partially answered: the cleanup's default path seeds packet-specific phrases and excludes archives, while the healer can restore stale generic defaults to an already-empty field.

## Questions Remaining
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- Q2: What causes each validation failure class at the source, and how do we stop new instances?
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

## Sources Consulted
- specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:99]
- .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:45]
- .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:306]
- .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs:123]
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]
- specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]

## Assessment
- New information ratio: 1.0.
- Questions addressed: Q1 and Q4.
- Questions answered: none; the phrase and archive policies still need integration review.

## Reflection
- The phrase cleanup is more precise than a bulk deletion: it replaces full template blocks with per-packet seeds and preserves custom phrases. Its empty-list behavior differs from the healer, which restores original template defaults. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:306] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129]
- The archive question remains a policy conflict because the cleanup can opt into archives, the upgrader leaves them frozen, and phase 013 repairs archived packets. The lead brief requires recording the conflict and continuing. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]

## Recommended Next Focus
Trace create.sh phase mode end to end and compare its metadata generation with a root scaffold, then inspect the series-parent wording in Gate 3. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1174]
