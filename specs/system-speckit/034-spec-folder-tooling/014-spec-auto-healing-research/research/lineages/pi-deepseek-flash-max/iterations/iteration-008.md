# Iteration 8: /doctor:update, what it actually migrates

## Focus

Begin Q3: read `/doctor:update` (router, release engine, apply workflow, route manifest) to learn what the update action detects and does to a user's tree, and whether a spec-corpus heal fits inside it or needs a separate stage.

## Actions Taken

- Read `.skilled/commands/doctor/update.md` (actions, mutation boundaries, release policy).
- Read `release-update.cjs` unit model, generated-artifact table and option surface.
- Read `doctor-update-apply.yaml` phase list and the post-apply battery in full.
- Read the `_routes.yaml` entries for `/doctor:update` and `/doctor:speckit`.

## Findings

1. `/doctor:update` has five actions with explicit mutation classes: `check` is read-only for the checkout, `align` gathers decisions into an ignored run directory, `apply` previews the plan, requests one startup approval, applies selected decisions and verifies, `rollback` restores paths or clears a stale lock after approval, and `record-base` records the release base for a copied or fresh install. [SOURCE: .skilled/commands/doctor/update.md:40] CONFIRMED
2. The release engine is file-level and unit-based: units are `<kind>:<name>` with kinds `root`, `skill`, `command` and `directory`, all under `.skilled/`. There is no unit kind for `specs/`, so a user's spec corpus is outside the engine's model. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:129] CONFIRMED
3. The engine's generated-artifact table marks generator-owned bytes so they never count as customizations: leaf manifests, skill `graph-metadata.json` `derived` blocks, the trigger index and its sidecars, and compiled-route manifests. All patterns are paths under `.skilled/`; the spec corpus's `description.json` and `graph-metadata.json` are not in the table. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:84] CONFIRMED
4. The post-apply battery is a ready-made pattern for adding corpus work: each check is a name, a `when` condition, a read-only command and a documented repair ("with approval, run the same command without --check"), with every failure offering its repair or engine rollback. [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:146] CONFIRMED
5. The route manifest binds the trigger phrase "spec-kit version migration" to `/doctor:update`, so operators already reach for update when an old tree must be migrated; but the action set contains no spec-corpus stage, which is a discoverability gap rather than a missing engine. [SOURCE: .skilled/commands/doctor/_routes.yaml:312] CONFIRMED
6. `/doctor:speckit` is retrieval diagnostics only: trigger-index staleness, a lookup probe, the ripgrep recipe and a citation-drift census, all read-only and none of them a corpus healer. Its route entry shows the standard shape a new corpus route would follow. [SOURCE: .skilled/commands/doctor/_routes.yaml:41] CONFIRMED
7. Nothing in the doctor surface today can detect an old or pre-v4 repo as such: update detects differences from a recorded release base per tooling unit, and speckit detects index staleness. Oldness of the SPEC CORPUS is currently only visible by running the validator and classifying failures, which is exactly what `upgrade-legacy.mjs` already does internally. [SOURCE: .skilled/commands/doctor/update.md:64] CONFIRMED

## Ruled Out

- Extending the release engine's unit model to cover `specs/`: the engine manages release-owned files against a base; packet repairs are content-shaped work with their own refusal boundary and grandfathering record, so they belong in the pipeline, not in the file-sync engine.
- Treating `/doctor:speckit` as the heal home: its routes are diagnostics, and its own contract keeps them read-only.

## Dead Ends

- Looking for a specs unit or a corpus action in the release engine: the kind list and artifact table both stop at `.skilled/`; the absence is the finding.

## Edge Cases

- Ambiguous input: "how does it fit /doctor:update" could mean inside the engine or beside it; the evidence supports a post-apply battery check or a sibling route, and both are named in the recommendations.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/commands/doctor/update.md`
- `.skilled/commands/doctor/scripts/release-update.cjs`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/commands/doctor/speckit.md`

## Assessment

- New information ratio: 0.85 (6 of 7 findings fully new; 1 consolidates the doctor-surface picture and counts as half new)
- Questions addressed: Q3 (update fit), Q2 (the generated-artifact boundary)
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-020 | Add a corpus-heal check to the update apply battery: run `upgrade-legacy.mjs --roots specs --dry-run`, report the pass/fail counts, and offer the applied repair with approval; archived packets stay opt-in via `--include-archive`, and the existing engine rollback contract covers reversal | Q3 | `.skilled/commands/doctor/assets/doctor-update-apply.yaml` (phase_5 battery) plus presentation wording | M | Med; the battery's approval gate and rollback path bound it, but the dry-run must come first by contract | Apply YAML, presentation, tests for the check | Battery pattern at doctor-update-apply.yaml:146; pipeline contract at upgrade-legacy.mjs:12 | CONFIRMED pattern, INFERRED check wiring | Yes (dry-run first; applied repair is a fixed point) | Engine rollback, or `git restore` for skipped paths | No; pipeline repairs structure and derived facts only |
| R-021 | Detect an old or pre-v4 corpus by evidence, not a version string: (a) strict-validation census, (b) template header versions compared against the level manifest, (c) presence/absence of generated metadata and current layout; each class names the pipeline stage that owns it | Q3 | A census mode beside `upgrade-legacy.mjs`; surfaced by the doctor check | S to M | Low; census is read-only | New census script or a mode | The level manifest carries per-template versions; upgrade-legacy already classifies by failing rules | CONFIRMED manifest and pipeline, INFERRED census shape | Yes (read-only) | Delete the script | No |
| R-022 | Keep the release engine and the corpus heal separate: update migrates release-owned files, the heal migrates packet structure; document the split where the "spec-kit version migration" phrase points so the expectation is met by two cooperating stages, not one | Q3, Q4 | `.skilled/commands/doctor/update.md` and presentation | S | Low; documentation | Update doc plus presentation | update.md's unit model excludes specs; the phrase is bound to update | CONFIRMED | n/a | n/a | No |

## Reflection

- What worked and why: reading the engine's unit model and generated-artifact table answered "what update can touch" precisely, and the battery's check/repair pattern gave a concrete integration point without inventing a workflow.
- What did not work and why: nothing failed; the doctor surface is compact and well-indexed.
- What I would do differently: read `doctor-update-check.yaml` as well to mirror the check-side reporting, since the census recommendation will need it.

## Recommended Next Focus

Iteration 9: design the old-repo detection and migration flow in concrete steps from the evidence: what the census reports per class, what upgrade-legacy does per class, what the operator sees (dry run, apply, record), and how reversibility works per step, including the `upgrade-baseline.json` grandfathering mechanics.
